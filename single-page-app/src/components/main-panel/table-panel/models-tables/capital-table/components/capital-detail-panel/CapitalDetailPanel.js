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
const CapitalAttributesPage = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Attributes-Capital" */ './components/capital-attributes-page/CapitalAttributesPage')));
const CapitalAssociationsPage = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Associations-Capital" */ './components/capital-associations-page/CapitalAssociationsPage')));
const CapitalUpdatePanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Update-Capital" */ '../capital-update-panel/CapitalUpdatePanel')));
const CapitalDeleteConfirmationDialog = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Delete-Capital" */ '../CapitalDeleteConfirmationDialog')));
const CountryDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Detail-Detail-Country" */ '../../../country-table/components/country-detail-panel/CountryDetailPanel')));

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

export default function CapitalDetailPanel(props) {
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

  const [countryDetailDialogOpen, setCountryDetailDialogOpen] = useState(false);
  const [countryDetailItem, setCountryDetailItem] = useState(undefined);

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
      lastModelChanged['capital']&&
      lastModelChanged['capital'][String(item['capital_id'])]) {
          
        //updated item
        if(lastModelChanged['capital'][String(item['capital_id'])].op === "update"&&
            lastModelChanged['capital'][String(item['capital_id'])].newItem) {
              //replace item
              setItemState(lastModelChanged['capital'][String(item['capital_id'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['capital'][String(item['capital_id'])].op === "delete") {
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
    if(countryDetailItem !== undefined) {
      setCountryDetailDialogOpen(true);
    }
  }, [countryDetailItem]);


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
    //capital_id
    variables.capital_id = item.capital_id;

    /*
      API Request: api.capital.deleteItem
    */
    let api = await loadApi("capital");
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

    let cancelableApiReq = makeCancelable(api.capital.deleteItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'capital', method: 'doDelete()', request: 'api.capital.deleteItem'}];
            newError.path=['Capitals', `capital_id:${item.capital_id}`, 'delete'];
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
          newError.locations=[{model: 'capital', method: 'doDelete()', request: 'api.capital.deleteItem'}];
          newError.path=['Capitals', `capital_id:${item.capital_id}`, 'delete'];
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
      .catch((err) => { //error: on api.capital.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'capital', method: 'doDelete()', request: 'api.capital.deleteItem'}];
          newError.path=['Capitals', `capital_id:${item.capital_id}` ,'delete'];
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
    initialValueOkStates.capital_id = (item.capital_id!==null ? 1 : 0);
    initialValueOkStates.country_id = -2; //FK

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
      dispatch(modelChange('capital', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('capital', 'delete', item, null))
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

  const handleClickOnCountryRow = (event, item) => {
    setCountryDetailItem(item);
  };

  const handleCountryDetailDialogClose = (event) => {
    delayedCloseCountryDetailPanel(event, 500);
  }

  const delayedCloseCountryDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCountryDetailDialogOpen(false);
        setCountryDetailItem(undefined);
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
                  id='CapitalDetailPanel-button-close'
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
                { t('modelPanels.detailOf') +  ": Capital | capital_id: " + itemState['capital_id'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.capital&&Array.isArray(permissions.capital)
                &&(permissions.capital.includes('update') || permissions.capital.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='CapitalDetailPanel-button-edit'
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
                (permissions&&permissions.capital&&Array.isArray(permissions.capital)
                &&(permissions.capital.includes('delete') || permissions.capital.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='CapitalDetailPanel-button-delete'
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
                  <CapitalAttributesPage
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
                  <CapitalAssociationsPage
                    item={itemState}
                    deleted={deleted}
                    handleClickOnCountryRow={handleClickOnCountryRow}
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
                <CapitalAttributesPage
                  item={itemState}
                  valueOkStates={valueOkStates}
                />
              </ErrorBoundary></Suspense>
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
                <CapitalAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnCountryRow={handleClickOnCountryRow}
                />
              </ErrorBoundary></Suspense>
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={updateDialogOpen} handleClose={(event) => { handleUpdateDialogClose(event, false) }}>
          <CapitalUpdatePanel
            permissions={permissions}
            item={updateItem}
            handleClose={handleUpdateDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={deleteConfirmationDialogOpen} handleClose={handleDeleteConfirmationReject}>
          <CapitalDeleteConfirmationDialog
            permissions={permissions}
            item={deleteConfirmationItem}
            handleAccept={handleDeleteConfirmationAccept}
            handleReject={handleDeleteConfirmationReject}
          />
        </ErrorBoundary></Suspense>
      )}

      {/* Dialog: Country Detail Panel */}
      {(countryDetailDialogOpen) && (
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={countryDetailDialogOpen} handleClose={handleCountryDetailDialogClose}>
          <CountryDetailPanel
            permissions={permissions}
            item={countryDetailItem}
            dialog={true}
            handleClose={handleCountryDetailDialogClose}
          />
        </ErrorBoundary></Suspense>
      )}
    </div>
  );
}
CapitalDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};