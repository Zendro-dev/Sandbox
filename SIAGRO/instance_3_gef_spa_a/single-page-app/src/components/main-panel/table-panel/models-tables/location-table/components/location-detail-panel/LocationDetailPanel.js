import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modelChange } from '../../../../../../../store/actions'
import PropTypes from 'prop-types';
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import LocationAttributesPage from './components/location-attributes-page/LocationAttributesPage'
import LocationAssociationsPage from './components/location-associations-page/LocationAssociationsPage'
import LocationUpdatePanel from '../location-update-panel/LocationUpdatePanel'
import LocationDeleteConfirmationDialog from '../LocationDeleteConfirmationDialog'
import AccessionDetailPanel from '../../../accession-table/components/accession-detail-panel/AccessionDetailPanel'
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

export default function LocationDetailPanel(props) {
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

  const [accessionDetailDialogOpen, setAccessionDetailDialogOpen] = useState(false);
  const [accessionDetailItem, setAccessionDetailItem] = useState(undefined);

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
      lastModelChanged.Location&&
      lastModelChanged.Location[String(itemState.locationId)]) {
          
        //updated item
        if(lastModelChanged.Location[String(itemState.locationId)].op === "update"&&
            lastModelChanged.Location[String(itemState.locationId)].newItem) {
              //replace item
              setItemState(lastModelChanged.Location[String(itemState.locationId)].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.Location[String(itemState.locationId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, itemState.locationId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);
  
  useEffect(() => {
    if(accessionDetailItem !== undefined) {
      setAccessionDetailDialogOpen(true);
    }
  }, [accessionDetailItem]);


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
    //nothing to do.
  }

  /**
    * doDelete
    * 
    * Delete @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item deleted.
    * 
    */
  function doDelete(event, item) {
    errors.current = [];
    
    //variables
    let variables = {};

    /*
      API Request: deleteLocation
    */
    let cancelableApiReq = makeCancelable(api.location.deleteItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(!response.data ||!response.data.data) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'Location', query: 'deleteLocation', method: 'doDelete()', request: 'api.location.deleteItem'}];
          newError.path=['Locations', `locationId:${item.locationId}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        //check: deleteLocation
        let deleteLocation = response.data.data.deleteLocation;
        if(deleteLocation === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'deleteLocation ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'Location', query: 'deleteLocation', method: 'doDelete()', request: 'api.location.deleteItem'}];
          newError.path=['Locations', `locationId:${item.locationId}` , 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        /**
         * Type of deleteLocation is not validated. Only not null is
         * checked above to confirm successfull operation.
         */

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'deleteLocation ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'Location', query: 'deleteLocation', method: 'doDelete()', request: 'api.location.deleteItem'}];
          newError.path=['Locations', `locationId:${item.locationId}` ,'delete'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
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
      .catch((err) => { //error: on deleteLocation
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Location', query: 'deleteLocation', method: 'doDelete()', request: 'api.location.deleteItem'}];
          newError.path=['Locations', `locationId:${item.locationId}` ,'delete'];
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

    initialValueOkStates.locationId = (item.locationId!==null ? 1 : 0);
    initialValueOkStates.country = (item.country!==null ? 1 : 0);
    initialValueOkStates.state = (item.state!==null ? 1 : 0);
    initialValueOkStates.municipality = (item.municipality!==null ? 1 : 0);
    initialValueOkStates.locality = (item.locality!==null ? 1 : 0);
    initialValueOkStates.latitude = (item.latitude!==null ? 1 : 0);
    initialValueOkStates.longitude = (item.longitude!==null ? 1 : 0);
    initialValueOkStates.altitude = (item.altitude!==null ? 1 : 0);
    initialValueOkStates.natural_area = (item.natural_area!==null ? 1 : 0);
    initialValueOkStates.natural_area_name = (item.natural_area_name!==null ? 1 : 0);
    initialValueOkStates.georeference_method = (item.georeference_method!==null ? 1 : 0);
    initialValueOkStates.georeference_source = (item.georeference_source!==null ? 1 : 0);
    initialValueOkStates.datum = (item.datum!==null ? 1 : 0);
    initialValueOkStates.vegetation = (item.vegetation!==null ? 1 : 0);
    initialValueOkStates.stoniness = (item.stoniness!==null ? 1 : 0);
    initialValueOkStates.sewer = (item.sewer!==null ? 1 : 0);
    initialValueOkStates.topography = (item.topography!==null ? 1 : 0);
    initialValueOkStates.slope = (item.slope!==null ? 1 : 0);

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
      dispatch(modelChange('Location', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('Location', 'delete', item, null))
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

  const handleClickOnAccessionRow = (event, item) => {
    setAccessionDetailItem(item);
  };

  const handleAccessionDetailDialogClose = (event) => {
    delayedCloseAccessionDetailPanel(event, 500);
  }

  const delayedCloseAccessionDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setAccessionDetailDialogOpen(false);
        setAccessionDetailItem(undefined);
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
                { t('modelPanels.detailOf') +  ": Location | locationId: " + itemState.locationId}
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
                <LocationAttributesPage
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
                <LocationAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnAccessionRow={handleClickOnAccessionRow}
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
              <LocationAttributesPage
                item={itemState}
                valueOkStates={valueOkStates}
              />
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <LocationAssociationsPage
                item={itemState}
                deleted={deleted}
                handleClickOnAccessionRow={handleClickOnAccessionRow}
              />
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <LocationUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <LocationDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Accession Detail Panel */}
      {(accessionDetailDialogOpen) && (
        <AccessionDetailPanel
          permissions={permissions}
          item={accessionDetailItem}
          dialog={true}
          handleClose={handleAccessionDetailDialogClose}
        />
      )}
    </div>
  );
}
LocationDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};