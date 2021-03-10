import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modelChange } from '../../../../../../../store/actions';
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../../../requests/requests.index.js';
import { makeCancelable, retry } from '../../../../../../../utils';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import ErrorBoundary from '../../../../../../pages/ErrorBoundary';
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
//lazy loading
const CountryAttributesPage = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Attributes-Country" */ './components/country-attributes-page/CountryAttributesPage')));
const CountryAssociationsPage = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Associations-Country" */ './components/country-associations-page/CountryAssociationsPage')));
const CountryUpdatePanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Update-Country" */ '../country-update-panel/CountryUpdatePanel')));
const CountryDeleteConfirmationDialog = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Delete-Country" */ '../CountryDeleteConfirmationDialog')));
const CapitalDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Detail-Capital" */ '../../../capital-table/components/capital-detail-panel/CapitalDetailPanel')));
const ContinentDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Detail-Continent" */ '../../../continent-table/components/continent-detail-panel/ContinentDetailPanel')));
const RiverDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Detail-River" */ '../../../river-table/components/river-detail-panel/RiverDetailPanel')));

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

export default function CountryDetailPanel(props) {
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

  const [capitalDetailDialogOpen, setCapitalDetailDialogOpen] = useState(false);
  const [capitalDetailItem, setCapitalDetailItem] = useState(undefined);
  const [continentDetailDialogOpen, setContinentDetailDialogOpen] = useState(false);
  const [continentDetailItem, setContinentDetailItem] = useState(undefined);
  const [riverDetailDialogOpen, setRiverDetailDialogOpen] = useState(false);
  const [riverDetailItem, setRiverDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isCanceling = useRef(false);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);
  const dispatch = useDispatch();

  //snackbar
  const variant = useRef('info');
  const errors = useRef([]);
  const content = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errors.current}
    variant={variant.current} />
  ));
  const actionText = useRef(t('modelPanels.gotIt', "Got it"));
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

   /**
    * Callbacks:
    *  showMessage
    */

   /**
    * showMessage
    * 
    * Show the given message in a notistack snackbar.
    * 
    */
   const showMessage = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variant.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? action.current : undefined,
      content: withDetail ? content.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * Effects
   */

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
      lastModelChanged['country']&&
      lastModelChanged['country'][String(item['country_id'])]) {
          
        //updated item
        if(lastModelChanged['country'][String(item['country_id'])].op === "update"&&
            lastModelChanged['country'][String(item['country_id'])].newItem) {
              //replace item
              setItemState(lastModelChanged['country'][String(item['country_id'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['country'][String(item['country_id'])].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);
  
  useEffect(() => {
    if(capitalDetailItem !== undefined) {
      setCapitalDetailDialogOpen(true);
    }
  }, [capitalDetailItem]);

  useEffect(() => {
    if(continentDetailItem !== undefined) {
      setContinentDetailDialogOpen(true);
    }
  }, [continentDetailItem]);

  useEffect(() => {
    if(riverDetailItem !== undefined) {
      setRiverDetailDialogOpen(true);
    }
  }, [riverDetailItem]);


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

  /**
   * Utils
   */

  function clearRequestDoDelete() {
    delayedCloseDeleteConfirmationAccept(null, 500);
  }

  /**
    * doDelete
    * 
    * Delete @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item deleted.
    * 
    */
  async function doDelete(event, item) {
    errors.current = [];
    
    //variables
    let variables = {};
    //country_id
    variables.country_id = item.country_id;

    /*
      API Request: api.country.deleteItem
    */
    let api = await loadApi("country");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variant.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errors.current.push(newError);
      showMessage(newError.message, withDetails);
      clearRequestDoDelete();
      return;
    }

    let cancelableApiReq = makeCancelable(api.country.deleteItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'country', method: 'doDelete()', request: 'api.country.deleteItem'}];
            newError.path=['Countries', `country_id:${item.country_id}`, 'delete'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'country', method: 'doDelete()', request: 'api.country.deleteItem'}];
          newError.path=['Countries', `country_id:${item.country_id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
 
          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

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
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.country.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'country', method: 'doDelete()', request: 'api.country.deleteItem'}];
          newError.path=['Countries', `country_id:${item.country_id}` ,'delete'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
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

    initialValueOkStates.name = (item.name!==null ? 1 : 0);
    initialValueOkStates.country_id = (item.country_id!==null ? 1 : 0);
    initialValueOkStates.continent_id = -2; //FK
    initialValueOkStates.river_ids = -2; //FK

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
      dispatch(modelChange('country', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('country', 'delete', item, null))
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

  const handleClickOnCapitalRow = (event, item) => {
    setCapitalDetailItem(item);
  };

  const handleCapitalDetailDialogClose = (event) => {
    delayedCloseCapitalDetailPanel(event, 500);
  }

  const delayedCloseCapitalDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCapitalDetailDialogOpen(false);
        setCapitalDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnContinentRow = (event, item) => {
    setContinentDetailItem(item);
  };

  const handleContinentDetailDialogClose = (event) => {
    delayedCloseContinentDetailPanel(event, 500);
  }

  const delayedCloseContinentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setContinentDetailDialogOpen(false);
        setContinentDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnRiverRow = (event, item) => {
    setRiverDetailItem(item);
  };

  const handleRiverDetailDialogClose = (event) => {
    delayedCloseRiverDetailPanel(event, 500);
  }

  const delayedCloseRiverDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setRiverDetailDialogOpen(false);
        setRiverDetailItem(undefined);
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
                  id='CountryDetailPanel-button-close'
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
                { t('modelPanels.detailOf') +  ": Country | country_id: " + itemState['country_id'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.country&&Array.isArray(permissions.country)
                &&(permissions.country.includes('update') || permissions.country.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='CountryDetailPanel-button-edit'
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
                (permissions&&permissions.country&&Array.isArray(permissions.country)
                &&(permissions.country.includes('delete') || permissions.country.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='CountryDetailPanel-button-delete'
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
                <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
                  <CountryAttributesPage
                    item={itemState}
                    valueOkStates={valueOkStates}
                  />
                </ErrorBoundary></Suspense>
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
                <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
                  {/* Associations Page */}
                  <CountryAssociationsPage
                    item={itemState}
                    deleted={deleted}
                    handleClickOnCapitalRow={handleClickOnCapitalRow}
                    handleClickOnContinentRow={handleClickOnContinentRow}
                    handleClickOnRiverRow={handleClickOnRiverRow}
                  />
                </ErrorBoundary></Suspense>
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
              <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
                <CountryAttributesPage
                  item={itemState}
                  valueOkStates={valueOkStates}
                />
              </ErrorBoundary></Suspense>
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
                <CountryAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnCapitalRow={handleClickOnCapitalRow}
                  handleClickOnContinentRow={handleClickOnContinentRow}
                  handleClickOnRiverRow={handleClickOnRiverRow}
                />
              </ErrorBoundary></Suspense>
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={updateDialogOpen} handleClose={(event) => { handleUpdateDialogClose(event, false) }}>
          <CountryUpdatePanel
            permissions={permissions}
            item={updateItem}
            handleClose={handleUpdateDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={deleteConfirmationDialogOpen} handleClose={handleDeleteConfirmationReject}>
          <CountryDeleteConfirmationDialog
            permissions={permissions}
            item={deleteConfirmationItem}
            handleAccept={handleDeleteConfirmationAccept}
            handleReject={handleDeleteConfirmationReject}
          />
        </ErrorBoundary></Suspense>
      )}

      {/* Dialog: Capital Detail Panel */}
      {(capitalDetailDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={capitalDetailDialogOpen} handleClose={handleCapitalDetailDialogClose}>
          <CapitalDetailPanel
            permissions={permissions}
            item={capitalDetailItem}
            dialog={true}
            handleClose={handleCapitalDetailDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}
      {/* Dialog: Continent Detail Panel */}
      {(continentDetailDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={continentDetailDialogOpen} handleClose={handleContinentDetailDialogClose}>
          <ContinentDetailPanel
            permissions={permissions}
            item={continentDetailItem}
            dialog={true}
            handleClose={handleContinentDetailDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}
      {/* Dialog: River Detail Panel */}
      {(riverDetailDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={riverDetailDialogOpen} handleClose={handleRiverDetailDialogClose}>
          <RiverDetailPanel
            permissions={permissions}
            item={riverDetailItem}
            dialog={true}
            handleClose={handleRiverDetailDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}
    </div>
  );
}
CountryDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};