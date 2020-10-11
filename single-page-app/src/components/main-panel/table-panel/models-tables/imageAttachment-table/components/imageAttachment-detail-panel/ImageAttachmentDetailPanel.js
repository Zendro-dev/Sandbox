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
import ImageAttachmentAttributesPage from './components/imageAttachment-attributes-page/ImageAttachmentAttributesPage'
import ImageAttachmentAssociationsPage from './components/imageAttachment-associations-page/ImageAttachmentAssociationsPage'
import ImageAttachmentUpdatePanel from '../imageAttachment-update-panel/ImageAttachmentUpdatePanel'
import ImageAttachmentDeleteConfirmationDialog from '../ImageAttachmentDeleteConfirmationDialog'
import ImageAttachmentUpdateImageDialog from '../../components/ImageAttachmentUpdateImageDialog'
import PersonDetailPanel from '../../../person-table/components/person-detail-panel/PersonDetailPanel'
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

export default function ImageAttachmentDetailPanel(props) {
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
  
  const [updateImageDialogOpen, setUpdateImageDialogOpen] = useState(false);
  const [imageAttachmentUpdateItem, setImageAttachmentUpdateItem] = useState(undefined);

  const [personDetailDialogOpen, setPersonDetailDialogOpen] = useState(false);
  const [personDetailItem, setPersonDetailItem] = useState(undefined);

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
      lastModelChanged['ImageAttachment']&&
      lastModelChanged['ImageAttachment'][String(item['id'])]) {
          
        //updated item
        if((lastModelChanged['ImageAttachment'][String(item['id'])].op === "update"
         || lastModelChanged['ImageAttachment'][String(item['id'])].op === "update-image")
        && lastModelChanged['ImageAttachment'][String(item['id'])].newItem) {
              //replace item
              setItemState(lastModelChanged['ImageAttachment'][String(item['id'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['ImageAttachment'][String(item['id'])].op === "delete") {
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
    if(personDetailItem !== undefined) {
      setPersonDetailDialogOpen(true);
    }
  }, [personDetailItem]);


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
    //id
    variables.id = item.id;

    /*
      API Request: api.imageAttachment.deleteItem
    */
    let cancelableApiReq = makeCancelable(api.imageAttachment.deleteItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
            newError.path=['ImageAttachments', `id:${item.id}`, 'delete'];
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
          newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
          newError.path=['ImageAttachments', `id:${item.id}`, 'delete'];
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
      .catch((err) => { //error: on api.imageAttachment.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
          newError.path=['ImageAttachments', `id:${item.id}` ,'delete'];
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

    initialValueOkStates.fileName = (item.fileName!==null ? 1 : 0);
    initialValueOkStates.fileSizeKb = (item.fileSizeKb!==null ? 1 : 0);
    initialValueOkStates.fileType = (item.fileType!==null ? 1 : 0);
    initialValueOkStates.filePath = (item.filePath!==null ? 1 : 0);
    initialValueOkStates.smallTnPath = (item.smallTnPath!==null ? 1 : 0);
    initialValueOkStates.mediumTnPath = (item.mediumTnPath!==null ? 1 : 0);
    initialValueOkStates.licence = (item.licence!==null ? 1 : 0);
    initialValueOkStates.description = (item.description!==null ? 1 : 0);
    initialValueOkStates.personId = -2; //FK

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
      dispatch(modelChange('ImageAttachment', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('ImageAttachment', 'delete', item, null))
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

  const handleClickOnPersonRow = (event, item) => {
    setPersonDetailItem(item);
  };

  const handlePersonDetailDialogClose = (event) => {
    delayedClosePersonDetailPanel(event, 500);
  }

  const delayedClosePersonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setPersonDetailDialogOpen(false);
        setPersonDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Image Update-Dialog handlers
   */
  const handleImageUpdateClicked = (event, item) => {
    setImageAttachmentUpdateItem(item);
    setUpdateImageDialogOpen(true);
  }

  const handleImageUpdateCancel = (event) => {
    setImageAttachmentUpdateItem(undefined);
    delayedCloseImageUpdateDialog(event, 500);
  }

  const handleImageUpdateDone = (event, newItem) => {
    dispatch(modelChange('ImageAttachment', 'update-image', imageAttachmentUpdateItem, newItem))
    setImageAttachmentUpdateItem(undefined);
    delayedCloseImageUpdateDialog(event, 500);
  }

  const delayedCloseImageUpdateDialog = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateImageDialogOpen(false);
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
                  id='ImageAttachmentDetailPanel-button-close'
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
                { t('modelPanels.detailOf') +  ": ImageAttachment | id: " + itemState['id'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                &&(permissions.imageAttachment.includes('update') || permissions.imageAttachment.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='ImageAttachmentDetailPanel-button-edit'
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
                (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                &&(permissions.imageAttachment.includes('delete') || permissions.imageAttachment.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='ImageAttachmentDetailPanel-button-delete'
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
                <ImageAttachmentAttributesPage
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
                <ImageAttachmentAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnPersonRow={handleClickOnPersonRow}
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
              <ImageAttachmentAttributesPage
                item={itemState}
                valueOkStates={valueOkStates}
              />
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <ImageAttachmentAssociationsPage
                item={itemState}
                deleted={deleted}
                handleClickOnPersonRow={handleClickOnPersonRow}
              />
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <ImageAttachmentUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
          handleImageUpdateClicked={handleImageUpdateClicked}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <ImageAttachmentDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Person Detail Panel */}
      {(personDetailDialogOpen) && (
        <PersonDetailPanel
          permissions={permissions}
          item={personDetailItem}
          dialog={true}
          handleClose={handlePersonDetailDialogClose}
        />
      )}

      {/* Dialog: Update Image */}
      {(updateImageDialogOpen) && (
        <ImageAttachmentUpdateImageDialog
          item={imageAttachmentUpdateItem}
          handleCancel={handleImageUpdateCancel}
          handleDone={handleImageUpdateDone}
        />
      )}

    </div>
  );
}
ImageAttachmentDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};