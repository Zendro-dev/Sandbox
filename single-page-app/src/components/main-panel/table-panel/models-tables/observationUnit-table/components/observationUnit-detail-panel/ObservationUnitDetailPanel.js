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
import ObservationUnitAttributesPage from './components/observationUnit-attributes-page/ObservationUnitAttributesPage'
import ObservationUnitAssociationsPage from './components/observationUnit-associations-page/ObservationUnitAssociationsPage'
import ObservationUnitUpdatePanel from '../observationUnit-update-panel/ObservationUnitUpdatePanel'
import ObservationUnitDeleteConfirmationDialog from '../ObservationUnitDeleteConfirmationDialog'
import EventDetailPanel from '../../../event-table/components/event-detail-panel/EventDetailPanel'
import GermplasmDetailPanel from '../../../germplasm-table/components/germplasm-detail-panel/GermplasmDetailPanel'
import ImageDetailPanel from '../../../image-table/components/image-detail-panel/ImageDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationTreatmentDetailPanel from '../../../observationTreatment-table/components/observationTreatment-detail-panel/ObservationTreatmentDetailPanel'
import ObservationUnitPositionDetailPanel from '../../../observationUnitPosition-table/components/observationUnitPosition-detail-panel/ObservationUnitPositionDetailPanel'
import ProgramDetailPanel from '../../../program-table/components/program-detail-panel/ProgramDetailPanel'
import StudyDetailPanel from '../../../study-table/components/study-detail-panel/StudyDetailPanel'
import TrialDetailPanel from '../../../trial-table/components/trial-detail-panel/TrialDetailPanel'
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

export default function ObservationUnitDetailPanel(props) {
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

  const [eventDetailDialogOpen, setEventDetailDialogOpen] = useState(false);
  const [eventDetailItem, setEventDetailItem] = useState(undefined);
  const [germplasmDetailDialogOpen, setGermplasmDetailDialogOpen] = useState(false);
  const [germplasmDetailItem, setGermplasmDetailItem] = useState(undefined);
  const [imageDetailDialogOpen, setImageDetailDialogOpen] = useState(false);
  const [imageDetailItem, setImageDetailItem] = useState(undefined);
  const [locationDetailDialogOpen, setLocationDetailDialogOpen] = useState(false);
  const [locationDetailItem, setLocationDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [observationTreatmentDetailDialogOpen, setObservationTreatmentDetailDialogOpen] = useState(false);
  const [observationTreatmentDetailItem, setObservationTreatmentDetailItem] = useState(undefined);
  const [observationUnitPositionDetailDialogOpen, setObservationUnitPositionDetailDialogOpen] = useState(false);
  const [observationUnitPositionDetailItem, setObservationUnitPositionDetailItem] = useState(undefined);
  const [programDetailDialogOpen, setProgramDetailDialogOpen] = useState(false);
  const [programDetailItem, setProgramDetailItem] = useState(undefined);
  const [studyDetailDialogOpen, setStudyDetailDialogOpen] = useState(false);
  const [studyDetailItem, setStudyDetailItem] = useState(undefined);
  const [trialDetailDialogOpen, setTrialDetailDialogOpen] = useState(false);
  const [trialDetailItem, setTrialDetailItem] = useState(undefined);

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
      lastModelChanged['observationUnit']&&
      lastModelChanged['observationUnit'][String(item['observationUnitDbId'])]) {
          
        //updated item
        if(lastModelChanged['observationUnit'][String(item['observationUnitDbId'])].op === "update"&&
            lastModelChanged['observationUnit'][String(item['observationUnitDbId'])].newItem) {
              //replace item
              setItemState(lastModelChanged['observationUnit'][String(item['observationUnitDbId'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['observationUnit'][String(item['observationUnitDbId'])].op === "delete") {
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
    if(eventDetailItem !== undefined) {
      setEventDetailDialogOpen(true);
    }
  }, [eventDetailItem]);

  useEffect(() => {
    if(germplasmDetailItem !== undefined) {
      setGermplasmDetailDialogOpen(true);
    }
  }, [germplasmDetailItem]);

  useEffect(() => {
    if(imageDetailItem !== undefined) {
      setImageDetailDialogOpen(true);
    }
  }, [imageDetailItem]);

  useEffect(() => {
    if(locationDetailItem !== undefined) {
      setLocationDetailDialogOpen(true);
    }
  }, [locationDetailItem]);

  useEffect(() => {
    if(observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);

  useEffect(() => {
    if(observationTreatmentDetailItem !== undefined) {
      setObservationTreatmentDetailDialogOpen(true);
    }
  }, [observationTreatmentDetailItem]);

  useEffect(() => {
    if(observationUnitPositionDetailItem !== undefined) {
      setObservationUnitPositionDetailDialogOpen(true);
    }
  }, [observationUnitPositionDetailItem]);

  useEffect(() => {
    if(programDetailItem !== undefined) {
      setProgramDetailDialogOpen(true);
    }
  }, [programDetailItem]);

  useEffect(() => {
    if(studyDetailItem !== undefined) {
      setStudyDetailDialogOpen(true);
    }
  }, [studyDetailItem]);

  useEffect(() => {
    if(trialDetailItem !== undefined) {
      setTrialDetailDialogOpen(true);
    }
  }, [trialDetailItem]);


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
    //observationUnitDbId
    variables.observationUnitDbId = item.observationUnitDbId;

    /*
      API Request: api.observationUnit.deleteItem
    */
    let cancelableApiReq = makeCancelable(api.observationUnit.deleteItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observationUnit', method: 'doDelete()', request: 'api.observationUnit.deleteItem'}];
            newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}`, 'delete'];
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
          newError.locations=[{model: 'observationUnit', method: 'doDelete()', request: 'api.observationUnit.deleteItem'}];
          newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}`, 'delete'];
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
      .catch((err) => { //error: on api.observationUnit.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationUnit', method: 'doDelete()', request: 'api.observationUnit.deleteItem'}];
          newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}` ,'delete'];
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

    initialValueOkStates.observationLevel = (item.observationLevel!==null ? 1 : 0);
    initialValueOkStates.observationUnitName = (item.observationUnitName!==null ? 1 : 0);
    initialValueOkStates.observationUnitPUI = (item.observationUnitPUI!==null ? 1 : 0);
    initialValueOkStates.plantNumber = (item.plantNumber!==null ? 1 : 0);
    initialValueOkStates.plotNumber = (item.plotNumber!==null ? 1 : 0);
    initialValueOkStates.programDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
    initialValueOkStates.trialDbId = -2; //FK
    initialValueOkStates.observationUnitDbId = (item.observationUnitDbId!==null ? 1 : 0);
    initialValueOkStates.germplasmDbId = -2; //FK
    initialValueOkStates.locationDbId = -2; //FK
    initialValueOkStates.eventDbIds = -2; //FK

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
      dispatch(modelChange('observationUnit', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('observationUnit', 'delete', item, null))
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

  const handleClickOnEventRow = (event, item) => {
    setEventDetailItem(item);
  };

  const handleEventDetailDialogClose = (event) => {
    delayedCloseEventDetailPanel(event, 500);
  }

  const delayedCloseEventDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEventDetailDialogOpen(false);
        setEventDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnGermplasmRow = (event, item) => {
    setGermplasmDetailItem(item);
  };

  const handleGermplasmDetailDialogClose = (event) => {
    delayedCloseGermplasmDetailPanel(event, 500);
  }

  const delayedCloseGermplasmDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setGermplasmDetailDialogOpen(false);
        setGermplasmDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnImageRow = (event, item) => {
    setImageDetailItem(item);
  };

  const handleImageDetailDialogClose = (event) => {
    delayedCloseImageDetailPanel(event, 500);
  }

  const delayedCloseImageDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setImageDetailDialogOpen(false);
        setImageDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnLocationRow = (event, item) => {
    setLocationDetailItem(item);
  };

  const handleLocationDetailDialogClose = (event) => {
    delayedCloseLocationDetailPanel(event, 500);
  }

  const delayedCloseLocationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setLocationDetailDialogOpen(false);
        setLocationDetailItem(undefined);
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
  const handleClickOnObservationTreatmentRow = (event, item) => {
    setObservationTreatmentDetailItem(item);
  };

  const handleObservationTreatmentDetailDialogClose = (event) => {
    delayedCloseObservationTreatmentDetailPanel(event, 500);
  }

  const delayedCloseObservationTreatmentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationTreatmentDetailDialogOpen(false);
        setObservationTreatmentDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnObservationUnitPositionRow = (event, item) => {
    setObservationUnitPositionDetailItem(item);
  };

  const handleObservationUnitPositionDetailDialogClose = (event) => {
    delayedCloseObservationUnitPositionDetailPanel(event, 500);
  }

  const delayedCloseObservationUnitPositionDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationUnitPositionDetailDialogOpen(false);
        setObservationUnitPositionDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnProgramRow = (event, item) => {
    setProgramDetailItem(item);
  };

  const handleProgramDetailDialogClose = (event) => {
    delayedCloseProgramDetailPanel(event, 500);
  }

  const delayedCloseProgramDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setProgramDetailDialogOpen(false);
        setProgramDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnStudyRow = (event, item) => {
    setStudyDetailItem(item);
  };

  const handleStudyDetailDialogClose = (event) => {
    delayedCloseStudyDetailPanel(event, 500);
  }

  const delayedCloseStudyDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudyDetailDialogOpen(false);
        setStudyDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnTrialRow = (event, item) => {
    setTrialDetailItem(item);
  };

  const handleTrialDetailDialogClose = (event) => {
    delayedCloseTrialDetailPanel(event, 500);
  }

  const delayedCloseTrialDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTrialDetailDialogOpen(false);
        setTrialDetailItem(undefined);
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
                  id='ObservationUnitDetailPanel-button-close'
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
                { t('modelPanels.detailOf') +  ": ObservationUnit | observationUnitDbId: " + itemState['observationUnitDbId'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.observationUnit&&Array.isArray(permissions.observationUnit)
                &&(permissions.observationUnit.includes('update') || permissions.observationUnit.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='ObservationUnitDetailPanel-button-edit'
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
                (permissions&&permissions.observationUnit&&Array.isArray(permissions.observationUnit)
                &&(permissions.observationUnit.includes('delete') || permissions.observationUnit.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='ObservationUnitDetailPanel-button-delete'
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
                <ObservationUnitAttributesPage
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
                <ObservationUnitAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnEventRow={handleClickOnEventRow}
                  handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                  handleClickOnImageRow={handleClickOnImageRow}
                  handleClickOnLocationRow={handleClickOnLocationRow}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                  handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
                  handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
                  handleClickOnProgramRow={handleClickOnProgramRow}
                  handleClickOnStudyRow={handleClickOnStudyRow}
                  handleClickOnTrialRow={handleClickOnTrialRow}
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
              <ObservationUnitAttributesPage
                item={itemState}
                valueOkStates={valueOkStates}
              />
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <ObservationUnitAssociationsPage
                item={itemState}
                deleted={deleted}
                handleClickOnEventRow={handleClickOnEventRow}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                handleClickOnImageRow={handleClickOnImageRow}
                handleClickOnLocationRow={handleClickOnLocationRow}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
                handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
                handleClickOnProgramRow={handleClickOnProgramRow}
                handleClickOnStudyRow={handleClickOnStudyRow}
                handleClickOnTrialRow={handleClickOnTrialRow}
              />
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <ObservationUnitUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <ObservationUnitDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Event Detail Panel */}
      {(eventDetailDialogOpen) && (
        <EventDetailPanel
          permissions={permissions}
          item={eventDetailItem}
          dialog={true}
          handleClose={handleEventDetailDialogClose}
        />
      )}
      {/* Dialog: Germplasm Detail Panel */}
      {(germplasmDetailDialogOpen) && (
        <GermplasmDetailPanel
          permissions={permissions}
          item={germplasmDetailItem}
          dialog={true}
          handleClose={handleGermplasmDetailDialogClose}
        />
      )}
      {/* Dialog: Image Detail Panel */}
      {(imageDetailDialogOpen) && (
        <ImageDetailPanel
          permissions={permissions}
          item={imageDetailItem}
          dialog={true}
          handleClose={handleImageDetailDialogClose}
        />
      )}
      {/* Dialog: Location Detail Panel */}
      {(locationDetailDialogOpen) && (
        <LocationDetailPanel
          permissions={permissions}
          item={locationDetailItem}
          dialog={true}
          handleClose={handleLocationDetailDialogClose}
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
      {/* Dialog: ObservationTreatment Detail Panel */}
      {(observationTreatmentDetailDialogOpen) && (
        <ObservationTreatmentDetailPanel
          permissions={permissions}
          item={observationTreatmentDetailItem}
          dialog={true}
          handleClose={handleObservationTreatmentDetailDialogClose}
        />
      )}
      {/* Dialog: ObservationUnitPosition Detail Panel */}
      {(observationUnitPositionDetailDialogOpen) && (
        <ObservationUnitPositionDetailPanel
          permissions={permissions}
          item={observationUnitPositionDetailItem}
          dialog={true}
          handleClose={handleObservationUnitPositionDetailDialogClose}
        />
      )}
      {/* Dialog: Program Detail Panel */}
      {(programDetailDialogOpen) && (
        <ProgramDetailPanel
          permissions={permissions}
          item={programDetailItem}
          dialog={true}
          handleClose={handleProgramDetailDialogClose}
        />
      )}
      {/* Dialog: Study Detail Panel */}
      {(studyDetailDialogOpen) && (
        <StudyDetailPanel
          permissions={permissions}
          item={studyDetailItem}
          dialog={true}
          handleClose={handleStudyDetailDialogClose}
        />
      )}
      {/* Dialog: Trial Detail Panel */}
      {(trialDetailDialogOpen) && (
        <TrialDetailPanel
          permissions={permissions}
          item={trialDetailItem}
          dialog={true}
          handleClose={handleTrialDetailDialogClose}
        />
      )}
    </div>
  );
}
ObservationUnitDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};