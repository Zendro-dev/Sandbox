import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import TrialAttributesPage from './components/trial-attributes-page/TrialAttributesPage'
import TrialAssociationsPage from './components/trial-associations-page/TrialAssociationsPage'
import TrialTabsA from './components/TrialTabsA'
import TrialConfirmationDialog from './components/TrialConfirmationDialog'
import ContactDetailPanel from '../../../contact-table/components/contact-detail-panel/ContactDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import ProgramDetailPanel from '../../../program-table/components/program-detail-panel/ProgramDetailPanel'
import StudyDetailPanel from '../../../study-table/components/study-detail-panel/StudyDetailPanel'
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

export default function TrialUpdatePanel(props) {
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
  
  const [contactsIdsToAddState, setContactsIdsToAddState] = useState([]);
  const contactsIdsToAdd = useRef([]);
  const [contactsIdsToRemoveState, setContactsIdsToRemoveState] = useState([]);
  const contactsIdsToRemove = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);
  const [programIdsToAddState, setProgramIdsToAddState] = useState([]);
  const programIdsToAdd = useRef([]);
  const [programIdsToRemoveState, setProgramIdsToRemoveState] = useState([]);
  const programIdsToRemove = useRef([]);
  const [studiesIdsToAddState, setStudiesIdsToAddState] = useState([]);
  const studiesIdsToAdd = useRef([]);
  const [studiesIdsToRemoveState, setStudiesIdsToRemoveState] = useState([]);
  const studiesIdsToRemove = useRef([]);

  const [contactDetailDialogOpen, setContactDetailDialogOpen] = useState(false);
  const [contactDetailItem, setContactDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [programDetailDialogOpen, setProgramDetailDialogOpen] = useState(false);
  const [programDetailItem, setProgramDetailItem] = useState(undefined);
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
      lastModelChanged.trial&&
      lastModelChanged.trial[String(item.trialDbId)]) {

        //updated item
        if(lastModelChanged.trial[String(item.trialDbId)].op === "update"&&
            lastModelChanged.trial[String(item.trialDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.trial[String(item.trialDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.trialDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (contactDetailItem !== undefined) {
      setContactDetailDialogOpen(true);
    }
  }, [contactDetailItem]);
  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);
  useEffect(() => {
    if (programDetailItem !== undefined) {
      setProgramDetailDialogOpen(true);
    }
  }, [programDetailItem]);
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

    initialValues.trialDbId = item.trialDbId;
    initialValues.active = item.active;
    initialValues.commonCropName = item.commonCropName;
    initialValues.documentationURL = item.documentationURL;
    initialValues.endDate = item.endDate;
    initialValues.startDate = item.startDate;
    initialValues.trialDescription = item.trialDescription;
    initialValues.trialName = item.trialName;
    initialValues.trialPUI = item.trialPUI;
    initialValues.programDbId = item.programDbId;
    initialValues.contactDbIds = item.contactDbIds;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.contactDbIds = item.contactDbIds;
    initialForeignKeys.programDbId = item.programDbId;

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

  initialValueOkStates.trialDbId = (item.trialDbId!==null ? 1 : 0);
  initialValueOkStates.active = (item.active!==null ? 1 : 0);
  initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.endDate = (item.endDate!==null ? 1 : 0);
  initialValueOkStates.startDate = (item.startDate!==null ? 1 : 0);
  initialValueOkStates.trialDescription = (item.trialDescription!==null ? 1 : 0);
  initialValueOkStates.trialName = (item.trialName!==null ? 1 : 0);
  initialValueOkStates.trialPUI = (item.trialPUI!==null ? 1 : 0);
    initialValueOkStates.programDbId = -2; //FK
    initialValueOkStates.contactDbIds = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.trialDbId = {errors: []};
    _initialValueAjvStates.active = {errors: []};
    _initialValueAjvStates.commonCropName = {errors: []};
    _initialValueAjvStates.documentationURL = {errors: []};
    _initialValueAjvStates.endDate = {errors: []};
    _initialValueAjvStates.startDate = {errors: []};
    _initialValueAjvStates.trialDescription = {errors: []};
    _initialValueAjvStates.trialName = {errors: []};
    _initialValueAjvStates.trialPUI = {errors: []};
    _initialValueAjvStates.programDbId = {errors: []}; //FK
    _initialValueAjvStates.contactDbIds = {errors: []}; //FK

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
    if(values.current.trialDbId !== item.trialDbId) { return true;}
    if(values.current.active !== item.active) { return true;}
    if(values.current.commonCropName !== item.commonCropName) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if((values.current.endDate === null || item.endDate === null) && item.endDate !== values.current.endDate) { return true; }
    if(values.current.endDate !== null && item.endDate !== null && !moment(values.current.endDate).isSame(item.endDate)) { return true; }
    if((values.current.startDate === null || item.startDate === null) && item.startDate !== values.current.startDate) { return true; }
    if(values.current.startDate !== null && item.startDate !== null && !moment(values.current.startDate).isSame(item.startDate)) { return true; }
    if(values.current.trialDescription !== item.trialDescription) { return true;}
    if(values.current.trialName !== item.trialName) { return true;}
    if(values.current.trialPUI !== item.trialPUI) { return true;}
    if(values.current.programDbId !== item.programDbId) { return true;}
    if(values.current.contactDbIds !== item.contactDbIds) { return true;}
    return false;
  }

  function setAddRemoveOneProgram(variables) {
    //data to notify changes
    if(!changedAssociations.current.trial_programDbId) changedAssociations.current.trial_programDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(programIdsToAdd.current.length>0) {
      //set id to add
      variables.addProgram = programIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.trial_programDbId.added = true;
      changedAssociations.current.trial_programDbId.idsAdded = [programIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(programIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeProgram = programIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.trial_programDbId.removed = true;
      changedAssociations.current.trial_programDbId.idsRemoved = [programIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyContacts(variables) {
    //data to notify changes
    if(!changedAssociations.current.contact_triaDbIds) changedAssociations.current.contact_triaDbIds = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(contactsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addContacts = [ ...contactsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.contact_triaDbIds.added = true;
      if(changedAssociations.current.contact_triaDbIds.idsAdded){
        contactsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.contact_triaDbIds.idsAdded.includes(it)) changedAssociations.current.contact_triaDbIds.idsAdded.push(it);});
      } else {
        changedAssociations.current.contact_triaDbIds.idsAdded = [...contactsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(contactsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeContacts = [ ...contactsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.contact_triaDbIds.removed = true;
      if(changedAssociations.current.contact_triaDbIds.idsRemoved){
        contactsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.contact_triaDbIds.idsRemoved.includes(it)) changedAssociations.current.contact_triaDbIds.idsRemoved.push(it);});
      } else {
        changedAssociations.current.contact_triaDbIds.idsRemoved = [...contactsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationUnits(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_trialDbId) changedAssociations.current.observationUnit_trialDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationUnits = [ ...observationUnitsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationUnit_trialDbId.added = true;
      if(changedAssociations.current.observationUnit_trialDbId.idsAdded){
        observationUnitsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationUnit_trialDbId.idsAdded.includes(it)) changedAssociations.current.observationUnit_trialDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationUnit_trialDbId.idsAdded = [...observationUnitsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationUnits = [ ...observationUnitsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationUnit_trialDbId.removed = true;
      if(changedAssociations.current.observationUnit_trialDbId.idsRemoved){
        observationUnitsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationUnit_trialDbId.idsRemoved.includes(it)) changedAssociations.current.observationUnit_trialDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationUnit_trialDbId.idsRemoved = [...observationUnitsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyStudies(variables) {
    //data to notify changes
    if(!changedAssociations.current.study_trialDbId) changedAssociations.current.study_trialDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(studiesIdsToAdd.current.length>0) {
      //set ids to add
      variables.addStudies = [ ...studiesIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.study_trialDbId.added = true;
      if(changedAssociations.current.study_trialDbId.idsAdded){
        studiesIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.study_trialDbId.idsAdded.includes(it)) changedAssociations.current.study_trialDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.study_trialDbId.idsAdded = [...studiesIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(studiesIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeStudies = [ ...studiesIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.study_trialDbId.removed = true;
      if(changedAssociations.current.study_trialDbId.idsRemoved){
        studiesIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.study_trialDbId.idsRemoved.includes(it)) changedAssociations.current.study_trialDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.study_trialDbId.idsRemoved = [...studiesIdsToRemove.current];
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
    
    delete variables.programDbId; //FK
    delete variables.contactDbIds; //FK

    //add & remove: to_one's
    setAddRemoveOneProgram(variables);

    //add & remove: to_many's
    setAddRemoveManyContacts(variables);
    setAddRemoveManyObservationUnits(variables);
    setAddRemoveManyStudies(variables);

    /*
      API Request: api.trial.updateItem
    */
    let cancelableApiReq = makeCancelable(api.trial.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'trial', method: 'doSave()', request: 'api.trial.updateItem'}];
            newError.path=['Trials', `trialDbId:${item.trialDbId}`, 'update'];
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
          newError.locations=[{model: 'trial', method: 'doSave()', request: 'api.trial.updateItem'}];
          newError.path=['Trials', `trialDbId:${item.trialDbId}`, 'update'];
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
      .catch((err) => { //error: on api.trial.updateItem
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
          newError.locations=[{model: 'trial', method: 'doSave()', request: 'api.trial.updateItem'}];
          newError.path=['Trials', `trialDbId:${item.trialDbId}`, 'update'];
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
      case 'contacts':
        contactsIdsToAdd.current.push(itemId);
        setContactsIdsToAddState([...contactsIdsToAdd.current]);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
        break;
      case 'program':
        programIdsToAdd.current = [];
        programIdsToAdd.current.push(itemId);
        setProgramIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: itemId});
        break;
      case 'studies':
        studiesIdsToAdd.current.push(itemId);
        setStudiesIdsToAddState([...studiesIdsToAdd.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'contacts') {
      for(let i=0; i<contactsIdsToAdd.current.length; ++i)
      {
        if(contactsIdsToAdd.current[i] === itemId) {
          contactsIdsToAdd.current.splice(i, 1);
          setContactsIdsToAddState([...contactsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'contacts'
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
    if(associationKey === 'program') {
      if(programIdsToAdd.current.length > 0
      && programIdsToAdd.current[0] === itemId) {
        programIdsToAdd.current = [];
        setProgramIdsToAddState([]);
        handleSetValue(null, -2, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: null});
      }
      return;
    }//end: case 'program'
    if(associationKey === 'studies') {
      for(let i=0; i<studiesIdsToAdd.current.length; ++i)
      {
        if(studiesIdsToAdd.current[i] === itemId) {
          studiesIdsToAdd.current.splice(i, 1);
          setStudiesIdsToAddState([...studiesIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'studies'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'contacts':
  
        contactsIdsToRemove.current.push(itemId);
        setContactsIdsToRemoveState([...contactsIdsToRemove.current]);
        break;
        case 'observationUnits':
  
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
        break;
        case 'program':
          programIdsToRemove.current = [];
          programIdsToRemove.current.push(itemId);
          setProgramIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'programDbId');
          setForeignKeys({...foreignKeys, programDbId: null});
        break;
        case 'studies':
  
        studiesIdsToRemove.current.push(itemId);
        setStudiesIdsToRemoveState([...studiesIdsToRemove.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'contacts') {
      for(let i=0; i<contactsIdsToRemove.current.length; ++i)
      {
        if(contactsIdsToRemove.current[i] === itemId) {
          contactsIdsToRemove.current.splice(i, 1);
          setContactsIdsToRemoveState([...contactsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'contacts'
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
    if(associationKey === 'program') {
      if(programIdsToRemove.current.length > 0
      && programIdsToRemove.current[0] === itemId) {
        programIdsToRemove.current = [];
        setProgramIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: itemId});
      }
      return;
    }//end: case 'program'
    if(associationKey === 'studies') {
      for(let i=0; i<studiesIdsToRemove.current.length; ++i)
      {
        if(studiesIdsToRemove.current[i] === itemId) {
          studiesIdsToRemove.current.splice(i, 1);
          setStudiesIdsToRemoveState([...studiesIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'studies'
  }

  const handleClickOnContactRow = (event, item) => {
    setContactDetailItem(item);
  };

  const handleContactDetailDialogClose = (event) => {
    delayedCloseContactDetailPanel(event, 500);
  }

  const delayedCloseContactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setContactDetailDialogOpen(false);
        setContactDetailItem(undefined);
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='TrialUpdatePanel-dialog' 
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
              id='TrialUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Trial | trialDbId: " + item.trialDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " trial" }>
              <Fab
                id='TrialUpdatePanel-fabButton-save' 
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
            <TrialTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <TrialAttributesPage
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
              <TrialAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                contactsIdsToAdd={contactsIdsToAddState}
                contactsIdsToRemove={contactsIdsToRemoveState}
                observationUnitsIdsToAdd={observationUnitsIdsToAddState}
                observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
                programIdsToAdd={programIdsToAddState}
                programIdsToRemove={programIdsToRemoveState}
                studiesIdsToAdd={studiesIdsToAddState}
                studiesIdsToRemove={studiesIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnContactRow={handleClickOnContactRow}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                handleClickOnProgramRow={handleClickOnProgramRow}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <TrialConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Contact Detail Panel */}
        {(contactDetailDialogOpen) && (
          <ContactDetailPanel
            permissions={permissions}
            item={contactDetailItem}
            dialog={true}
            handleClose={handleContactDetailDialogClose}
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
      </div>

    </Dialog>
  );
}
TrialUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
