import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import ImageAttributesPage from './components/image-attributes-page/ImageAttributesPage'
import ImageAssociationsPage from './components/image-associations-page/ImageAssociationsPage'
import ImageTabsA from './components/ImageTabsA'
import ImageConfirmationDialog from './components/ImageConfirmationDialog'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateWarning from '@material-ui/icons/ErrorOutline';
import { amber, red } from '@material-ui/core/colors';

const debounceTimeout = 700;
const appBarHeight = 64;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
  },
  tabsA: {
    backgroundColor: "#ffffff",
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: -26+3,
    right: 10,
    margin: '0 auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageUpdatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    permissions,
 
    item,
    handleClose,
  } = props;
  
  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const [valueAjvStates, setValueAjvStates] = useState(getInitialValueAjvStates());
  const lastFetchTime = useRef(Date.now());
  const [foreignKeys, setForeignKeys] = useState(getInitialForeignKeys());
  Boolean(setForeignKeys); //avoids 'unused' warning

  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);

  const values = useRef(getInitialValues());
  const valuesOkRefs = useRef(getInitialValueOkStates());
  const valuesAjvRefs = useRef(getInitialValueAjvStates());
  const changedAssociations = useRef({});
  
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationUnitIdsToAddState, setObservationUnitIdsToAddState] = useState([]);
  const observationUnitIdsToAdd = useRef([]);
  const [observationUnitIdsToRemoveState, setObservationUnitIdsToRemoveState] = useState([]);
  const observationUnitIdsToRemove = useRef([]);

  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isSaving = useRef(false);
  const isCanceling = useRef(false);
  const isClosing = useRef(false);
  const isDebouncingTabsChange = useRef(false);
  const currentTabValue = useRef(tabsValue);
  const lastTabValue = useRef(tabsValue);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

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
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged.image&&
      lastModelChanged.image[String(item.imageDbId)]) {

        //updated item
        if(lastModelChanged.image[String(item.imageDbId)].op === "update"&&
            lastModelChanged.image[String(item.imageDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.image[String(item.imageDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.imageDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);
  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);

  /**
   * Utils
   */

  function clearRequestDoSave() {
    //reset contention flags
    isSaving.current = false;
    isClosing.current = false;
  }

  function getInitialValues() {
    let initialValues = {};

    initialValues.copyright = item.copyright;
    initialValues.description = item.description;
    initialValues.imageFileName = item.imageFileName;
    initialValues.imageFileSize = item.imageFileSize;
    initialValues.imageHeight = item.imageHeight;
    initialValues.imageName = item.imageName;
    initialValues.imageTimeStamp = item.imageTimeStamp;
    initialValues.imageURL = item.imageURL;
    initialValues.imageWidth = item.imageWidth;
    initialValues.mimeType = item.mimeType;
    initialValues.observationUnitDbId = item.observationUnitDbId;
    initialValues.imageDbId = item.imageDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.observationUnitDbId = item.observationUnitDbId;

    return initialForeignKeys;
  }

  function getInitialValueOkStates() {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
       -3: readOnly
    */
    let initialValueOkStates = {};

  initialValueOkStates.copyright = (item.copyright!==null ? 1 : 0);
  initialValueOkStates.description = (item.description!==null ? 1 : 0);
  initialValueOkStates.imageFileName = (item.imageFileName!==null ? 1 : 0);
  initialValueOkStates.imageFileSize = (item.imageFileSize!==null ? 1 : 0);
  initialValueOkStates.imageHeight = (item.imageHeight!==null ? 1 : 0);
  initialValueOkStates.imageName = (item.imageName!==null ? 1 : 0);
  initialValueOkStates.imageTimeStamp = (item.imageTimeStamp!==null ? 1 : 0);
  initialValueOkStates.imageURL = (item.imageURL!==null ? 1 : 0);
  initialValueOkStates.imageWidth = (item.imageWidth!==null ? 1 : 0);
  initialValueOkStates.mimeType = (item.mimeType!==null ? 1 : 0);
    initialValueOkStates.observationUnitDbId = -2; //FK
  initialValueOkStates.imageDbId = (item.imageDbId!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.copyright = {errors: []};
    _initialValueAjvStates.description = {errors: []};
    _initialValueAjvStates.imageFileName = {errors: []};
    _initialValueAjvStates.imageFileSize = {errors: []};
    _initialValueAjvStates.imageHeight = {errors: []};
    _initialValueAjvStates.imageName = {errors: []};
    _initialValueAjvStates.imageTimeStamp = {errors: []};
    _initialValueAjvStates.imageURL = {errors: []};
    _initialValueAjvStates.imageWidth = {errors: []};
    _initialValueAjvStates.mimeType = {errors: []};
    _initialValueAjvStates.observationUnitDbId = {errors: []}; //FK
    _initialValueAjvStates.imageDbId = {errors: []};

    return _initialValueAjvStates;
  }

  function areThereNotAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === -1) {
        return true;
      }
    }
    return false;
  }

  function areThereIncompleteFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 0) {
        return true;
      }
    }
    return false;
  }

  function areThereChangedFields() {
    if(values.current.copyright !== item.copyright) { return true;}
    if(values.current.description !== item.description) { return true;}
    if(values.current.imageFileName !== item.imageFileName) { return true;}
    if(Number(values.current.imageFileSize) !== Number(item.imageFileSize)) { return true;}
    if(Number(values.current.imageHeight) !== Number(item.imageHeight)) { return true;}
    if(values.current.imageName !== item.imageName) { return true;}
    if((values.current.imageTimeStamp === null || item.imageTimeStamp === null) && item.imageTimeStamp !== values.current.imageTimeStamp) { return true; }
    if(values.current.imageTimeStamp !== null && item.imageTimeStamp !== null && !moment(values.current.imageTimeStamp).isSame(item.imageTimeStamp)) { return true; }
    if(values.current.imageURL !== item.imageURL) { return true;}
    if(Number(values.current.imageWidth) !== Number(item.imageWidth)) { return true;}
    if(values.current.mimeType !== item.mimeType) { return true;}
    if(values.current.observationUnitDbId !== item.observationUnitDbId) { return true;}
    if(values.current.imageDbId !== item.imageDbId) { return true;}
    return false;
  }

  function setAddRemoveOneObservationUnit(variables) {
    //data to notify changes
    if(!changedAssociations.current.image_observationUnitDbId) changedAssociations.current.image_observationUnitDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitIdsToAdd.current.length>0) {
      //set id to add
      variables.addObservationUnit = observationUnitIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.image_observationUnitDbId.added = true;
      changedAssociations.current.image_observationUnitDbId.idsAdded = [observationUnitIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeObservationUnit = observationUnitIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.image_observationUnitDbId.removed = true;
      changedAssociations.current.image_observationUnitDbId.idsRemoved = [observationUnitIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyObservations(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_imageDbId) changedAssociations.current.observation_imageDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservations = [ ...observationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observation_imageDbId.added = true;
      if(changedAssociations.current.observation_imageDbId.idsAdded){
        observationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observation_imageDbId.idsAdded.includes(it)) changedAssociations.current.observation_imageDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observation_imageDbId.idsAdded = [...observationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservations = [ ...observationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observation_imageDbId.removed = true;
      if(changedAssociations.current.observation_imageDbId.idsRemoved){
        observationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observation_imageDbId.idsRemoved.includes(it)) changedAssociations.current.observation_imageDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observation_imageDbId.idsRemoved = [...observationsIdsToRemove.current];
      }
    }
    
    return;
  }

function setAjvErrors(err) {
    //check
    if(err&&err.response&&err.response.data&&Array.isArray(err.response.data.errors)) {
      let errors = err.response.data.errors;
 
      //for each error
      for(let i=0; i<errors.length; ++i) {
        let e=errors[i];
        //check
        if(e && typeof e === 'object'
        && e.extensions && typeof e.extensions === 'object' 
        && Array.isArray(e.extensions.validationErrors)){
          let validationErrors = e.extensions.validationErrors;
          
          for(let j=0; j<validationErrors.length; ++j) {
            let validationError = validationErrors[j];

            //check
            if(validationError && typeof validationError === 'object' 
            && validationError.dataPath && validationError.message) {
              /**
               * In this point, the error is considered as an AJV error.
               * 
               * It will be set in a ajvStatus reference and at the end of this function 
               * the ajvStatus state will be updated.
               */
              //set reference
              addAjvErrorToField(validationError);
            }
          }
        }
      }
      //update state
      setValueAjvStates({...valuesAjvRefs.current});
    }
  }

  function addAjvErrorToField(error) {
    let dataPath = error.dataPath.slice(1);
    
    if(valuesAjvRefs.current[dataPath] !== undefined){
      valuesAjvRefs.current[dataPath].errors.push(error.message);
    }
  }
  
  /**
    * doSave
    * 
    * Update new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item updated.
    * 
    */
  async function doSave(event) {
    errors.current = [];
    valuesAjvRefs.current = getInitialValueAjvStates();

    /*
      Variables setup
    */
    //variables
    let keys = Object.keys(values.current);
    let variables = {};


    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1
      && valuesOkRefs.current[keys[i]] !== -2 //FK
      && valuesOkRefs.current[keys[i]] !== -3 //readOnly
      ) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }
    
    delete variables.observationUnitDbId; //FK

    //add & remove: to_one's
    setAddRemoveOneObservationUnit(variables);

    //add & remove: to_many's
    setAddRemoveManyObservations(variables);

    /*
      API Request: api.image.updateItem
    */
    let cancelableApiReq = makeCancelable(api.image.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'image', method: 'doSave()', request: 'api.image.updateItem'}];
            newError.path=['Images', `imageDbId:${item.imageDbId}`, 'update'];
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
          newError.locations=[{model: 'image', method: 'doSave()', request: 'api.image.updateItem'}];
          newError.path=['Images', `imageDbId:${item.imageDbId}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return false;
        } 

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg5', "Record updated successfully."), {
          variant: 'success',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        onClose(event, true, response.value);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.image.updateItem
        if(err.isCanceled) {
          return;
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'image', method: 'doSave()', request: 'api.image.updateItem'}];
          newError.path=['Images', `imageDbId:${item.imageDbId}`, 'update'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }
      });
  }

  const handleTabsChange = (event, newValue) => {
    //save last value
    lastTabValue.current = newValue;

    if(!isDebouncingTabsChange.current){
      //set last value
      currentTabValue.current = newValue;
      setTabsValue(newValue);
      
      //debounce
      isDebouncingTabsChange.current = true;
      let cancelableTimer = startTimerToDebounceTabsChange();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingTabsChange.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastTabValue.current !== currentTabValue.current){
            setTabsValue(lastTabValue.current);
            currentTabValue.current = lastTabValue.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };

  const handleSetValue = (value, status, key) => {
    values.current[key] = value;
    if(status !== valuesOkRefs.current[key]) {
      valuesOkRefs.current[key] = status;
      setValueOkStates({...valuesOkRefs.current});
    }
  }

  const handleSave = (event) => {
    if(areThereNotAcceptableFields()) {
      setConfirmationTitle( t('modelPanels.invalidFields', "Some fields are not valid") );
      setConfirmationText( t('modelPanels.invalidFieldsB', "To continue, please correct these fields.") );
      setConfirmationAcceptText("");
      setConfirmationRejectText( t('modelPanels.updateAccept', "I UNDERSTAND"));
      handleAccept.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
      return;
    }

    if(areThereIncompleteFields()) {
      setConfirmationTitle( t('modelPanels.incompleteFields', "Some fields are empty") );
      setConfirmationText( t('modelPanels.incompleteFieldsB', "Do you want to continue anyway?") );
      setConfirmationAcceptText( t('modelPanels.saveIncompleteAccept', "YES, SAVE") );
      setConfirmationRejectText( t('modelPanels.saveIncompleteReject', "DON'T SAVE YET") );
      handleAccept.current = () => {
        if(!isClosing.current) {
          isClosing.current = true;
          doSave(event);
          setConfirmationOpen(false);
        }
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
    } else {
      doSave(event);
    }
  }

  const handleCancel = (event) => {
    if(areThereChangedFields()) {
        setConfirmationTitle( t('modelPanels.cancelChanges', "The edited information has not been saved") );
        setConfirmationText( t('modelPanels.cancelChangesB', "Some fields have been edited, if you continue without save, the changes will be lost, you want to continue?") );
        setConfirmationAcceptText( t('modelPanels.cancelChangesAccept', "YES, EXIT") );
        setConfirmationRejectText( t('modelPanels.cancelChangesReject', "STAY") );
        handleAccept.current = () => {
          if(!isClosing.current) {
            isClosing.current = true;
            setConfirmationOpen(false);
            onClose(event, false, null);
          }
        }
        handleReject.current = () => {
          isCanceling.current = false;
          setConfirmationOpen(false);
        }
        setConfirmationOpen(true);
        return;
    } else {
      onClose(event, false, null);
    }
  }

  const onClose = (event, status, newItem) => {
    setOpen(false);
    handleClose(event, status, item, newItem, changedAssociations.current);
  }

  const handleConfirmationAccept = (event) => {
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    handleReject.current();
  }

  const handleTransferToAdd = (associationKey, itemId) => {
    switch(associationKey) {
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState([...observationsIdsToAdd.current]);
        break;
      case 'observationUnit':
        observationUnitIdsToAdd.current = [];
        observationUnitIdsToAdd.current.push(itemId);
        setObservationUnitIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToAdd.current.length; ++i)
      {
        if(observationsIdsToAdd.current[i] === itemId) {
          observationsIdsToAdd.current.splice(i, 1);
          setObservationsIdsToAddState([...observationsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationUnit') {
      if(observationUnitIdsToAdd.current.length > 0
      && observationUnitIdsToAdd.current[0] === itemId) {
        observationUnitIdsToAdd.current = [];
        setObservationUnitIdsToAddState([]);
        handleSetValue(null, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: null});
      }
      return;
    }//end: case 'observationUnit'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'observations':
  
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
        break;
        case 'observationUnit':
          observationUnitIdsToRemove.current = [];
          observationUnitIdsToRemove.current.push(itemId);
          setObservationUnitIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'observationUnitDbId');
          setForeignKeys({...foreignKeys, observationUnitDbId: null});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToRemove.current.length; ++i)
      {
        if(observationsIdsToRemove.current[i] === itemId) {
          observationsIdsToRemove.current.splice(i, 1);
          setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationUnit') {
      if(observationUnitIdsToRemove.current.length > 0
      && observationUnitIdsToRemove.current[0] === itemId) {
        observationUnitIdsToRemove.current = [];
        setObservationUnitIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
      }
      return;
    }//end: case 'observationUnit'
  }

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

  const handleClickOnObservationUnitRow = (event, item) => {
    setObservationUnitDetailItem(item);
  };

  const handleObservationUnitDetailDialogClose = (event) => {
    delayedCloseObservationUnitDetailPanel(event, 500);
  }

  const delayedCloseObservationUnitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationUnitDetailDialogOpen(false);
        setObservationUnitDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='ImageUpdatePanel-dialog' 
      fullScreen open={open} TransitionComponent={Transition}
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      <AppBar>
        <Toolbar>
          <Tooltip title={ t('modelPanels.cancel') }>
            <IconButton
              id='ImageUpdatePanel-button-cancel'
              edge="start" 
              color="inherit" 
              onClick={(event) => {
                if(!isCanceling.current){
                  isCanceling.current = true;
                  handleCancel(event);
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            { t('modelPanels.editing') +  ": Image | imageDbId: " + item.imageDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " image" }>
              <Fab
                id='ImageUpdatePanel-fabButton-save' 
                color="secondary" 
                className={classes.fabButton}
                onClick={(event) => {
                  if(!isSaving.current){
                    isSaving.current = true;
                    handleSave(event);
                  }
                }}
              >
                <SaveIcon />
              </Fab>
            </Tooltip>
          )}

        </Toolbar>
      </AppBar>
      <Toolbar/>

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>

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
                      <UpdateWarning style={{ color: amber[700] }} />
                    }
                    title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                    subheader="Updated"
                  />
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
            
          {/* TabsA: Menú */}
          <Grid item xs={12}>
            <ImageTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ImageAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <ImageAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                observationsIdsToAdd={observationsIdsToAddState}
                observationsIdsToRemove={observationsIdsToRemoveState}
                observationUnitIdsToAdd={observationUnitIdsToAddState}
                observationUnitIdsToRemove={observationUnitIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <ImageConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Observation Detail Panel */}
        {(observationDetailDialogOpen) && (
          <ObservationDetailPanel
            permissions={permissions}
            item={observationDetailItem}
            dialog={true}
            handleClose={handleObservationDetailDialogClose}
          />
        )}
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <ObservationUnitDetailPanel
            permissions={permissions}
            item={observationUnitDetailItem}
            dialog={true}
            handleClose={handleObservationUnitDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
ImageUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
