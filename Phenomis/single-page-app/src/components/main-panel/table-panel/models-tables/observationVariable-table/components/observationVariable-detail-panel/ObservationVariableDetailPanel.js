import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modelChange } from '../../../../../../../store/actions'
import PropTypes from 'prop-types';
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import ObservationVariableAttributesPage from './components/observationVariable-attributes-page/ObservationVariableAttributesPage'
import ObservationVariableAssociationsPage from './components/observationVariable-associations-page/ObservationVariableAssociationsPage'
import ObservationVariableUpdatePanel from '../observationVariable-update-panel/ObservationVariableUpdatePanel'
import ObservationVariableDeleteConfirmationDialog from '../ObservationVariableDeleteConfirmationDialog'
import MethodDetailPanel from '../../../method-table/components/method-detail-panel/MethodDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import OntologyReferenceDetailPanel from '../../../ontologyReference-table/components/ontologyReference-detail-panel/OntologyReferenceDetailPanel'
import ScaleDetailPanel from '../../../scale-table/components/scale-detail-panel/ScaleDetailPanel'
import TraitDetailPanel from '../../../trait-table/components/trait-detail-panel/TraitDetailPanel'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateOk from '@material-ui/icons/CheckCircleOutlined';
import { red, green } from '@material-ui/core/colors';

const appBarHeight = 72;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
    minHeight: 1200,
    paddingTop: theme.spacing(1),
  },
  appBar: {
    height: appBarHeight,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
  },
  divider: {
    marginTop: theme.spacing(2),
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ObservationVariableDetailPanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    permissions, 
    item,
    dialog,
    handleClose,
  } = props;
  
  const [open, setOpen] = useState(true);
  const [itemState, setItemState] = useState(item);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates(item));
  const lastFetchTime = useRef(Date.now());

  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(undefined);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteConfirmationItem, setDeleteConfirmationItem] = useState(undefined);

  const [methodDetailDialogOpen, setMethodDetailDialogOpen] = useState(false);
  const [methodDetailItem, setMethodDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [ontologyReferenceDetailDialogOpen, setOntologyReferenceDetailDialogOpen] = useState(false);
  const [ontologyReferenceDetailItem, setOntologyReferenceDetailItem] = useState(undefined);
  const [scaleDetailDialogOpen, setScaleDetailDialogOpen] = useState(false);
  const [scaleDetailItem, setScaleDetailItem] = useState(undefined);
  const [traitDetailDialogOpen, setTraitDetailDialogOpen] = useState(false);
  const [traitDetailItem, setTraitDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isCanceling = useRef(false);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);
  const dispatch = useDispatch();

  const actionText = useRef(null);
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);

  useEffect(() => {
    /*
     * Handle changes 
     */
    
    /*
     * Checks
     */
    if(!lastModelChanged) {
      return;
    }
    if(!lastChangeTimestamp || !lastFetchTime.current) {
      return;
    }
    let isNewChange = (lastFetchTime.current<lastChangeTimestamp);
    if(!isNewChange) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();

    /*
     * Case 1: 
     * This item was updated, either in his attributes or in his associations, or was deleted.
     * 
     * Conditions:
     * A: the item was modified.
     * B: the item was deleted.
     * 
     * Actions:
     * if A:
     * - replace item
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged.observationVariable&&
      lastModelChanged.observationVariable[String(itemState.observationVariableDbId)]) {
          
        //updated item
        if(lastModelChanged.observationVariable[String(itemState.observationVariableDbId)].op === "update"&&
            lastModelChanged.observationVariable[String(itemState.observationVariableDbId)].newItem) {
              //replace item
              setItemState(lastModelChanged.observationVariable[String(itemState.observationVariableDbId)].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.observationVariable[String(itemState.observationVariableDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, itemState.observationVariableDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);
  
  useEffect(() => {
    if(methodDetailItem !== undefined) {
      setMethodDetailDialogOpen(true);
    }
  }, [methodDetailItem]);

  useEffect(() => {
    if(observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);

  useEffect(() => {
    if(ontologyReferenceDetailItem !== undefined) {
      setOntologyReferenceDetailDialogOpen(true);
    }
  }, [ontologyReferenceDetailItem]);

  useEffect(() => {
    if(scaleDetailItem !== undefined) {
      setScaleDetailDialogOpen(true);
    }
  }, [scaleDetailItem]);

  useEffect(() => {
    if(traitDetailItem !== undefined) {
      setTraitDetailDialogOpen(true);
    }
  }, [traitDetailItem]);


  useEffect(() => {
    if(updateItem !== undefined) {
      setUpdateDialogOpen(true);
    }
  }, [updateItem]);

  useEffect(() => {
    if(deleteConfirmationItem !== undefined) {
      setDeleteConfirmationDialogOpen(true);
    }
  }, [deleteConfirmationItem]);

  useEffect(() => {
    if(itemState) {
      setValueOkStates(getInitialValueOkStates(itemState));
    }
    lastFetchTime.current = Date.now();
  }, [itemState]);

  function doDelete(event, item) {
    //variables
    let variables = {};


    /*
      API Request: deleteItem
    */
    let cancelableApiReq = makeCancelable(api.observationVariable.deleteItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(response => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response
        if(
          response.data &&
          response.data.data
        ) {
          //notify graphql errors
          if(response.data.errors) {
            actionText.current = t('modelPanels.gotIt', "Got it");
            enqueueSnackbar( t('modelPanels.errors.e3', "The GraphQL query returned a response with errors. Please contact your administrator."), {
              variant: 'error',
              preventDuplicate: false,
              persist: true,
              action: action.current,
            });
            console.log("Errors: ", response.data.errors);
          }else {

            //ok
            enqueueSnackbar( t('modelPanels.messages.msg4', "Record deleted successfully."), {
              variant: 'success',
              preventDuplicate: false,
              persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
            onSuccessDelete(event, item);
          }
          return;

        } else { //error: bad response on deleteItem()
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action: action.current,
          });
          console.log("Error: ", t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."));
          return;
        }
      })
      .catch(({isCanceled, ...err}) => { //error: on deleteItem()
        if(isCanceled) {
          return;
        } else {
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e1', "An error occurred while trying to execute the GraphQL query. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action: action.current,
          });
          console.log("Error: ", err);
          return;
        }
      });
  }

  function getInitialValueOkStates(item) {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
    */
    let initialValueOkStates = {};

    initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
    initialValueOkStates.defaultValue = (item.defaultValue!==null ? 1 : 0);
    initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
    initialValueOkStates.growthStage = (item.growthStage!==null ? 1 : 0);
    initialValueOkStates.institution = (item.institution!==null ? 1 : 0);
    initialValueOkStates.language = (item.language!==null ? 1 : 0);
    initialValueOkStates.scientist = (item.scientist!==null ? 1 : 0);
    initialValueOkStates.status = (item.status!==null ? 1 : 0);
    initialValueOkStates.submissionTimestamp = (item.submissionTimestamp!==null ? 1 : 0);
    initialValueOkStates.xref = (item.xref!==null ? 1 : 0);
    initialValueOkStates.observationVariableDbId = (item.observationVariableDbId!==null ? 1 : 0);
    initialValueOkStates.observationVariableName = (item.observationVariableName!==null ? 1 : 0);
    initialValueOkStates.methodDbId = -2; //FK
    initialValueOkStates.scaleDbId = -2; //FK
    initialValueOkStates.traitDbId = -2; //FK
    initialValueOkStates.ontologyDbId = -2; //FK

    return initialValueOkStates;
  }

  const handleCancel = (event) => {
    setOpen(false);
    handleClose(event);
  }

  const handleUpdateClicked = (event, item) => {
    setOpen(false);
    delayedOpenUpdatePanel(event, item, 50);
  }

  const delayedOpenUpdatePanel = async (event, item, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateItem(item);
        resolve("ok");
      }, ms);
    });
  };

  const handleUpdateDialogClose = (event, status, item, newItem, changedAssociations) => {
    if(status) {
      dispatch(modelChange('observationVariable', 'update', item, newItem, changedAssociations))
    }
    delayedCloseUpdatePanel(event, 500);
  }

  const delayedCloseUpdatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateDialogOpen(false);
        setUpdateItem(undefined);
        handleClose(event);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteClicked = (event, item) => {
    setDeleteConfirmationItem(item);
  }

  const handleDeleteConfirmationAccept = (event, item) => {
    setOpen(false);
    doDelete(event, item);
  }

  const onSuccessDelete = (event, item) => {
    dispatch(modelChange('observationVariable', 'delete', item, null))
    delayedCloseDeleteConfirmationAccept(event, 500);
  }

  const delayedCloseDeleteConfirmationAccept = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        handleClose(event);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteConfirmationReject = (event) => {
    delayedCloseDeleteConfirmationReject(event, 500);
  }

  const delayedCloseDeleteConfirmationReject = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnMethodRow = (event, item) => {
    setMethodDetailItem(item);
  };

  const handleMethodDetailDialogClose = (event) => {
    delayedCloseMethodDetailPanel(event, 500);
  }

  const delayedCloseMethodDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMethodDetailDialogOpen(false);
        setMethodDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnObservationRow = (event, item) => {
    setObservationDetailItem(item);
  };

  const handleObservationDetailDialogClose = (event) => {
    delayedCloseObservationDetailPanel(event, 500);
  }

  const delayedCloseObservationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationDetailDialogOpen(false);
        setObservationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnOntologyReferenceRow = (event, item) => {
    setOntologyReferenceDetailItem(item);
  };

  const handleOntologyReferenceDetailDialogClose = (event) => {
    delayedCloseOntologyReferenceDetailPanel(event, 500);
  }

  const delayedCloseOntologyReferenceDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setOntologyReferenceDetailDialogOpen(false);
        setOntologyReferenceDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnScaleRow = (event, item) => {
    setScaleDetailItem(item);
  };

  const handleScaleDetailDialogClose = (event) => {
    delayedCloseScaleDetailPanel(event, 500);
  }

  const delayedCloseScaleDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setScaleDetailDialogOpen(false);
        setScaleDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnTraitRow = (event, item) => {
    setTraitDetailItem(item);
  };

  const handleTraitDetailDialogClose = (event) => {
    delayedCloseTraitDetailPanel(event, 500);
  }

  const delayedCloseTraitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTraitDetailDialogOpen(false);
        setTraitDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  return (
    <div>
      {/* Dialog Mode */}
      {(dialog !== undefined && dialog === true) && (
        
        <Dialog fullScreen open={open} TransitionComponent={Transition}
          onClose={(event) => {
            if(!isCanceling.current){
              isCanceling.current = true;
              handleCancel(event);
            }
          }}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Tooltip title={ t('modelPanels.close') }>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={(event) => {
                    if(!isCanceling.current){
                      isCanceling.current = true;
                      handleCancel(event);
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" className={classes.title}>
                { t('modelPanels.detailOf') +  ": ObservationVariable | observationVariableDbId: " + itemState.observationVariableDbId}
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.user&&Array.isArray(permissions.user)
                &&(permissions.user.includes('update') || permissions.user.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        color='inherit'
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUpdateClicked(event, itemState);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                )
              }
              {
                /* acl check */
                (permissions&&permissions.user&&Array.isArray(permissions.user)
                &&(permissions.user.includes('delete') || permissions.user.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        color='inherit'
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClicked(event, itemState);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                )
              }
              
            </Toolbar>
          </AppBar>
          <Toolbar className={classes.appBar}/>

          <div className={classes.root}>
            <Grid container justify='center' alignItems='flex-start' alignContent='flex-start' spacing={0}>

              <Grid item xs={12}>
                {/* Delete warning */}
                <Box
                  width="100%"
                  p={0}
                  position="fixed"
                  top={appBarHeight}
                  left={0}
                  zIndex="speedDial"
                >
                  <Collapse in={deleted}>
                    <Card className={classes.warningCard} square={true}>
                      <CardHeader
                        avatar={
                          <DeletedWarning style={{ color: red[700] }} />
                        }
                        title={ t('modelPanels.deletedWarning', "This item no longer exists. It was deleted elsewhere.") }
                        subheader="Deleted"
                      />
                    </Card>
                  </Collapse>
                </Box>
              </Grid>
  
              <Grid item xs={12}>
                {/* Update warning */}
                <Box
                  width="100%"
                  p={0}
                  position="fixed"
                  top={appBarHeight}
                  left={0}
                  zIndex="speedDial"
                >
                  <Collapse in={updated}>
                    <Card className={classes.warningCard} square={true}>
                      <CardHeader
                        avatar={
                          <UpdateOk style={{ color: green[700] }} />
                        }
                        title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                        subheader="Updated"
                      />
                      <CardActions>
                        <Button size="small" color="primary" onClick={()=>{setUpdated(false)}}>
                          Got it
                        </Button>
                      </CardActions>
                    </Card>
                  </Collapse>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Collapse in={updated||deleted}>
                  <Card className={classes.warningCard} square={true} elevation={0}>
                  </Card>
                </Collapse>
              </Grid>

              <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
                <Divider className={classes.divider} />
                <Grid container justify='flex-start'>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      { t('modelPanels.attributes') }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {/* Attributes Page */}
                <ObservationVariableAttributesPage
                  item={itemState}
                  valueOkStates={valueOkStates}
                />
              </Grid>

              <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
                <Divider />
                <Grid container justify='flex-start'>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      { t('modelPanels.associations') }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
    
              <Grid item xs={12}>
                {/* Associations Page */}
                <ObservationVariableAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                  handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                  handleClickOnTraitRow={handleClickOnTraitRow}
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>
      )}

      {/* No-Dialog Mode */}
      {(dialog !== undefined && dialog === false) && (
    
        <div className={classes.root}>
          <Grid container justify='center' alignItems='flex-start' alignContent='flex-start' spacing={0}>

            <Grid item xs={12}>
              {/* Attributes Page */}
              <ObservationVariableAttributesPage
                item={itemState}
                valueOkStates={valueOkStates}
              />
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <ObservationVariableAssociationsPage
                item={itemState}
                deleted={deleted}
                handleClickOnMethodRow={handleClickOnMethodRow}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                handleClickOnScaleRow={handleClickOnScaleRow}
                handleClickOnTraitRow={handleClickOnTraitRow}
              />
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <ObservationVariableUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <ObservationVariableDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Method Detail Panel */}
      {(methodDetailDialogOpen) && (
        <MethodDetailPanel
          permissions={permissions}
          item={methodDetailItem}
          dialog={true}
          handleClose={handleMethodDetailDialogClose}
        />
      )}
      {/* Dialog: Observation Detail Panel */}
      {(observationDetailDialogOpen) && (
        <ObservationDetailPanel
          permissions={permissions}
          item={observationDetailItem}
          dialog={true}
          handleClose={handleObservationDetailDialogClose}
        />
      )}
      {/* Dialog: OntologyReference Detail Panel */}
      {(ontologyReferenceDetailDialogOpen) && (
        <OntologyReferenceDetailPanel
          permissions={permissions}
          item={ontologyReferenceDetailItem}
          dialog={true}
          handleClose={handleOntologyReferenceDetailDialogClose}
        />
      )}
      {/* Dialog: Scale Detail Panel */}
      {(scaleDetailDialogOpen) && (
        <ScaleDetailPanel
          permissions={permissions}
          item={scaleDetailItem}
          dialog={true}
          handleClose={handleScaleDetailDialogClose}
        />
      )}
      {/* Dialog: Trait Detail Panel */}
      {(traitDetailDialogOpen) && (
        <TraitDetailPanel
          permissions={permissions}
          item={traitDetailItem}
          dialog={true}
          handleClose={handleTraitDetailDialogClose}
        />
      )}
    </div>
  );
}
ObservationVariableDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};