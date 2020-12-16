import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import EventTabsA from './components/EventTabsA';
import { loadApi } from '../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../utils';
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
//lazy loading
const EventAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-Event" */ './components/event-attributes-page/EventAttributesPage'));
const EventAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-Event" */ './components/event-associations-page/EventAssociationsPage'));
const EventConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-Event" */ './components/EventConfirmationDialog'));
const EventParameterDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-EventParameter" */ '../../../eventParameter-table/components/eventParameter-detail-panel/EventParameterDetailPanel'));
const ObservationUnitDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-ObservationUnit" */ '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'));
const StudyDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Study" */ '../../../study-table/components/study-detail-panel/StudyDetailPanel'));

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

export default function EventUpdatePanel(props) {
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
  
  const [eventParametersIdsToAddState, setEventParametersIdsToAddState] = useState([]);
  const eventParametersIdsToAdd = useRef([]);
  const [eventParametersIdsToRemoveState, setEventParametersIdsToRemoveState] = useState([]);
  const eventParametersIdsToRemove = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);
  const [studyIdsToRemoveState, setStudyIdsToRemoveState] = useState([]);
  const studyIdsToRemove = useRef([]);

  const [eventParameterDetailDialogOpen, setEventParameterDetailDialogOpen] = useState(false);
  const [eventParameterDetailItem, setEventParameterDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [studyDetailDialogOpen, setStudyDetailDialogOpen] = useState(false);
  const [studyDetailItem, setStudyDetailItem] = useState(undefined);

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
      lastModelChanged.event&&
      lastModelChanged.event[String(item.eventType)]) {

        //updated item
        if(lastModelChanged.event[String(item.eventType)].op === "update"&&
            lastModelChanged.event[String(item.eventType)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.event[String(item.eventType)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.eventType]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (eventParameterDetailItem !== undefined) {
      setEventParameterDetailDialogOpen(true);
    }
  }, [eventParameterDetailItem]);
  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);
  useEffect(() => {
    if (studyDetailItem !== undefined) {
      setStudyDetailDialogOpen(true);
    }
  }, [studyDetailItem]);

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

    initialValues.eventDbId = item.eventDbId;
    initialValues.eventDescription = item.eventDescription;
    initialValues.eventType = item.eventType;
    initialValues.date = item.date;
    initialValues.observationUnitDbIds = item.observationUnitDbIds;
    initialValues.studyDbId = item.studyDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.observationUnitDbIds = item.observationUnitDbIds;
    initialForeignKeys.studyDbId = item.studyDbId;

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

  initialValueOkStates.eventDbId = (item.eventDbId!==null ? 1 : 0);
  initialValueOkStates.eventDescription = (item.eventDescription!==null ? 1 : 0);
  initialValueOkStates.eventType = (item.eventType!==null ? 1 : 0);
  initialValueOkStates.date = (item.date!==null ? 1 : 0);
    initialValueOkStates.observationUnitDbIds = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.eventDbId = {errors: []};
    _initialValueAjvStates.eventDescription = {errors: []};
    _initialValueAjvStates.eventType = {errors: []};
    _initialValueAjvStates.date = {errors: []};
    _initialValueAjvStates.observationUnitDbIds = {errors: []}; //FK
    _initialValueAjvStates.studyDbId = {errors: []}; //FK

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
    if(values.current.eventDbId !== item.eventDbId) { return true;}
    if(values.current.eventDescription !== item.eventDescription) { return true;}
    if(values.current.eventType !== item.eventType) { return true;}
    if((values.current.date === null || item.date === null) && item.date !== values.current.date) { return true; }
    if(values.current.date !== null && item.date !== null && !moment(values.current.date).isSame(item.date)) { return true; }
    if(values.current.observationUnitDbIds !== item.observationUnitDbIds) { return true;}
    if(values.current.studyDbId !== item.studyDbId) { return true;}
    return false;
  }

  function setAddRemoveOneStudy(variables) {
    //data to notify changes
    if(!changedAssociations.current.event_studyDbId) changedAssociations.current.event_studyDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(studyIdsToAdd.current.length>0) {
      //set id to add
      variables.addStudy = studyIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.event_studyDbId.added = true;
      changedAssociations.current.event_studyDbId.idsAdded = [studyIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(studyIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeStudy = studyIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.event_studyDbId.removed = true;
      changedAssociations.current.event_studyDbId.idsRemoved = [studyIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyEventParameters(variables) {
    //data to notify changes
    if(!changedAssociations.current.eventParameter_eventDbId) changedAssociations.current.eventParameter_eventDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(eventParametersIdsToAdd.current.length>0) {
      //set ids to add
      variables.addEventParameters = [ ...eventParametersIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.eventParameter_eventDbId.added = true;
      if(changedAssociations.current.eventParameter_eventDbId.idsAdded){
        eventParametersIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.eventParameter_eventDbId.idsAdded.includes(it)) changedAssociations.current.eventParameter_eventDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.eventParameter_eventDbId.idsAdded = [...eventParametersIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(eventParametersIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeEventParameters = [ ...eventParametersIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.eventParameter_eventDbId.removed = true;
      if(changedAssociations.current.eventParameter_eventDbId.idsRemoved){
        eventParametersIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.eventParameter_eventDbId.idsRemoved.includes(it)) changedAssociations.current.eventParameter_eventDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.eventParameter_eventDbId.idsRemoved = [...eventParametersIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationUnits(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_eventDbIds) changedAssociations.current.observationUnit_eventDbIds = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationUnits = [ ...observationUnitsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationUnit_eventDbIds.added = true;
      if(changedAssociations.current.observationUnit_eventDbIds.idsAdded){
        observationUnitsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationUnit_eventDbIds.idsAdded.includes(it)) changedAssociations.current.observationUnit_eventDbIds.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationUnit_eventDbIds.idsAdded = [...observationUnitsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationUnits = [ ...observationUnitsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationUnit_eventDbIds.removed = true;
      if(changedAssociations.current.observationUnit_eventDbIds.idsRemoved){
        observationUnitsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationUnit_eventDbIds.idsRemoved.includes(it)) changedAssociations.current.observationUnit_eventDbIds.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationUnit_eventDbIds.idsRemoved = [...observationUnitsIdsToRemove.current];
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
    
    delete variables.observationUnitDbIds; //FK
    delete variables.studyDbId; //FK

    //add & remove: to_one's
    setAddRemoveOneStudy(variables);

    //add & remove: to_many's
    setAddRemoveManyEventParameters(variables);
    setAddRemoveManyObservationUnits(variables);

    /*
      API Request: api.event.updateItem
    */
    let api = await loadApi("event");
    let cancelableApiReq = makeCancelable(api.event.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'event', method: 'doSave()', request: 'api.event.updateItem'}];
            newError.path=['Events', `eventType:${item.eventType}`, 'update'];
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
          newError.locations=[{model: 'event', method: 'doSave()', request: 'api.event.updateItem'}];
          newError.path=['Events', `eventType:${item.eventType}`, 'update'];
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
      .catch((err) => { //error: on api.event.updateItem
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
          newError.locations=[{model: 'event', method: 'doSave()', request: 'api.event.updateItem'}];
          newError.path=['Events', `eventType:${item.eventType}`, 'update'];
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
      case 'eventParameters':
        eventParametersIdsToAdd.current.push(itemId);
        setEventParametersIdsToAddState([...eventParametersIdsToAdd.current]);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
        break;
      case 'study':
        studyIdsToAdd.current = [];
        studyIdsToAdd.current.push(itemId);
        setStudyIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'eventParameters') {
      for(let i=0; i<eventParametersIdsToAdd.current.length; ++i)
      {
        if(eventParametersIdsToAdd.current[i] === itemId) {
          eventParametersIdsToAdd.current.splice(i, 1);
          setEventParametersIdsToAddState([...eventParametersIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'eventParameters'
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToAdd.current.length; ++i)
      {
        if(observationUnitsIdsToAdd.current[i] === itemId) {
          observationUnitsIdsToAdd.current.splice(i, 1);
          setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'study') {
      if(studyIdsToAdd.current.length > 0
      && studyIdsToAdd.current[0] === itemId) {
        studyIdsToAdd.current = [];
        setStudyIdsToAddState([]);
        handleSetValue(null, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: null});
      }
      return;
    }//end: case 'study'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'eventParameters':
  
        eventParametersIdsToRemove.current.push(itemId);
        setEventParametersIdsToRemoveState([...eventParametersIdsToRemove.current]);
        break;
        case 'observationUnits':
  
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
        break;
        case 'study':
          studyIdsToRemove.current = [];
          studyIdsToRemove.current.push(itemId);
          setStudyIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'studyDbId');
          setForeignKeys({...foreignKeys, studyDbId: null});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'eventParameters') {
      for(let i=0; i<eventParametersIdsToRemove.current.length; ++i)
      {
        if(eventParametersIdsToRemove.current[i] === itemId) {
          eventParametersIdsToRemove.current.splice(i, 1);
          setEventParametersIdsToRemoveState([...eventParametersIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'eventParameters'
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToRemove.current.length; ++i)
      {
        if(observationUnitsIdsToRemove.current[i] === itemId) {
          observationUnitsIdsToRemove.current.splice(i, 1);
          setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'study') {
      if(studyIdsToRemove.current.length > 0
      && studyIdsToRemove.current[0] === itemId) {
        studyIdsToRemove.current = [];
        setStudyIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
      }
      return;
    }//end: case 'study'
  }

  const handleClickOnEventParameterRow = (event, item) => {
    setEventParameterDetailItem(item);
  };

  const handleEventParameterDetailDialogClose = (event) => {
    delayedCloseEventParameterDetailPanel(event, 500);
  }

  const delayedCloseEventParameterDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEventParameterDetailDialogOpen(false);
        setEventParameterDetailItem(undefined);
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='EventUpdatePanel-dialog' 
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
              id='EventUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Event | eventType: " + item.eventType}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " event" }>
              <Fab
                id='EventUpdatePanel-fabButton-save' 
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
            <EventTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <EventAttributesPage
                hidden={tabsValue !== 0}
                item={item}
                valueOkStates={valueOkStates}
                valueAjvStates={valueAjvStates}
                foreignKeys = {foreignKeys}
                handleSetValue={handleSetValue}
              />
            </Suspense>
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <Suspense fallback={<div />}>
                <EventAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  eventParametersIdsToAdd={eventParametersIdsToAddState}
                  eventParametersIdsToRemove={eventParametersIdsToRemoveState}
                  observationUnitsIdsToAdd={observationUnitsIdsToAddState}
                  observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
                  studyIdsToAdd={studyIdsToAddState}
                  studyIdsToRemove={studyIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnEventParameterRow={handleClickOnEventParameterRow}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                  handleClickOnStudyRow={handleClickOnStudyRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <EventConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

        {/* Dialog: EventParameter Detail Panel */}
        {(eventParameterDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <EventParameterDetailPanel
              permissions={permissions}
              item={eventParameterDetailItem}
              dialog={true}
              handleClose={handleEventParameterDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ObservationUnitDetailPanel
              permissions={permissions}
              item={observationUnitDetailItem}
              dialog={true}
              handleClose={handleObservationUnitDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Study Detail Panel */}
        {(studyDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <StudyDetailPanel
              permissions={permissions}
              item={studyDetailItem}
              dialog={true}
              handleClose={handleStudyDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
EventUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
