import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import TrialAttributesPage from './components/trial-attributes-page/TrialAttributesPage'
import TrialAssociationsPage from './components/trial-associations-page/TrialAssociationsPage'
import TrialTabsA from './components/TrialTabsA'
import TrialConfirmationDialog from './components/TrialConfirmationDialog'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import ProgramDetailPanel from '../../../program-table/components/program-detail-panel/ProgramDetailPanel'
import StudyDetailPanel from '../../../study-table/components/study-detail-panel/StudyDetailPanel'
import TrialToContactDetailPanel from '../../../trial_to_contact-table/components/trial_to_contact-detail-panel/Trial_to_contactDetailPanel'
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
  notiErrorActionText: {
    color: '#eba0a0',
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
  const lastFetchTime = useRef(Date.now());
    const [foreignKeys, setForeignKeys] = useState(getInitialForeignKeys());
  
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
  const changedAssociations = useRef({});
  
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);
  const programIdsToAdd = useRef((item.program&& item.program.programDbId) ? [item.program.programDbId] : []);
  const [programIdsToAddState, setProgramIdsToAddState] = useState((item.program&& item.program.programDbId) ? [item.program.programDbId] : []);
  const [studiesIdsToAddState, setStudiesIdsToAddState] = useState([]);
  const studiesIdsToAdd = useRef([]);
  const [studiesIdsToRemoveState, setStudiesIdsToRemoveState] = useState([]);
  const studiesIdsToRemove = useRef([]);
  const [trialToContactsIdsToAddState, setTrialToContactsIdsToAddState] = useState([]);
  const trialToContactsIdsToAdd = useRef([]);
  const [trialToContactsIdsToRemoveState, setTrialToContactsIdsToRemoveState] = useState([]);
  const trialToContactsIdsToRemove = useRef([]);

  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [programDetailDialogOpen, setProgramDetailDialogOpen] = useState(false);
  const [programDetailItem, setProgramDetailItem] = useState(undefined);
  const [studyDetailDialogOpen, setStudyDetailDialogOpen] = useState(false);
  const [studyDetailItem, setStudyDetailItem] = useState(undefined);
  const [trial_to_contactDetailDialogOpen, setTrial_to_contactDetailDialogOpen] = useState(false);
  const [trial_to_contactDetailItem, setTrial_to_contactDetailItem] = useState(undefined);

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

  const actionText = useRef(null);
  const action = (key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  );

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
  useEffect(() => {
    if (trial_to_contactDetailItem !== undefined) {
      setTrial_to_contactDetailDialogOpen(true);
    }
  }, [trial_to_contactDetailItem]);

  function getInitialValues() {
    let initialValues = {};

    initialValues.active = item.active;
    initialValues.commonCropName = item.commonCropName;
    initialValues.documentationURL = item.documentationURL;
    initialValues.endDate = item.endDate;
    initialValues.programDbId = item.programDbId;
    initialValues.startDate = item.startDate;
    initialValues.trialDescription = item.trialDescription;
    initialValues.trialName = item.trialName;
    initialValues.trialPUI = item.trialPUI;
    initialValues.trialDbId = item.trialDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
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
    */
    let initialValueOkStates = {};

  initialValueOkStates.active = (item.active!==null ? 1 : 0);
  initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.endDate = (item.endDate!==null ? 1 : 0);
    initialValueOkStates.programDbId = -2; //FK
  initialValueOkStates.startDate = (item.startDate!==null ? 1 : 0);
  initialValueOkStates.trialDescription = (item.trialDescription!==null ? 1 : 0);
  initialValueOkStates.trialName = (item.trialName!==null ? 1 : 0);
  initialValueOkStates.trialPUI = (item.trialPUI!==null ? 1 : 0);
  initialValueOkStates.trialDbId = (item.trialDbId!==null ? 1 : 0);

    return initialValueOkStates;
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
    if(values.current.active !== item.active) { return true;}
    if(values.current.commonCropName !== item.commonCropName) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if((values.current.endDate === null || item.endDate === null) && item.endDate !== values.current.endDate) { return true; }
    if(values.current.endDate !== null && item.endDate !== null && !moment(values.current.endDate).isSame(item.endDate)) { return true; }
    if(values.current.programDbId !== item.programDbId) { return true;}
    if((values.current.startDate === null || item.startDate === null) && item.startDate !== values.current.startDate) { return true; }
    if(values.current.startDate !== null && item.startDate !== null && !moment(values.current.startDate).isSame(item.startDate)) { return true; }
    if(values.current.trialDescription !== item.trialDescription) { return true;}
    if(values.current.trialName !== item.trialName) { return true;}
    if(values.current.trialPUI !== item.trialPUI) { return true;}
    if(values.current.trialDbId !== item.trialDbId) { return true;}
    return false;
  }

  function setAddRemoveProgram(variables) {
    //data to notify changes
    changedAssociations.current.program = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.program&&item.program.programDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(programIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.program.programDbId!== programIdsToAdd.current[0]) {
          //set id to add
          variables.addProgram = programIdsToAdd.current[0];
          
          changedAssociations.current.program.added = true;
          changedAssociations.current.program.idsAdded = programIdsToAdd.current;
          changedAssociations.current.program.removed = true;
          changedAssociations.current.program.idsRemoved = [item.program.programDbId];
        } else {
          /*
           * Case I.a.2: The ID on toAdd list es equal to the current associated ID.
           */
          //do nothing here (nothing changes).
        }
      } else {
        /*
         * Case I.b: The toAdd list is empty (current association removed).
         */
        //set id to remove
        variables.removeProgram = item.program.programDbId;
        
        changedAssociations.current.program.removed = true;
        changedAssociations.current.program.idsRemoved = [item.program.programDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(programIdsToAdd.current.length>0) {
        //set id to add
        variables.addProgram = programIdsToAdd.current[0];
        
        changedAssociations.current.program.added = true;
        changedAssociations.current.program.idsAdded = programIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }

  function doSave(event) {
    /*
      Variables setup
    */
    //variables
    let keys = Object.keys(values.current);
    let variables = {};


    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's
    delete variables.programDbId;

    //add & remove: to_one's
    setAddRemoveProgram(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.observationUnits = {added: false, removed: false};
    
    if(observationUnitsIdsToAdd.current.length>0) {
      variables.addObservationUnits = observationUnitsIdsToAdd.current;
      
      changedAssociations.current.observationUnits.added = true;
      changedAssociations.current.observationUnits.idsAdded = observationUnitsIdsToAdd.current;
    }
    if(observationUnitsIdsToRemove.current.length>0) {
      variables.removeObservationUnits = observationUnitsIdsToRemove.current;
      
      changedAssociations.current.observationUnits.removed = true;
      changedAssociations.current.observationUnits.idsRemoved = observationUnitsIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.studies = {added: false, removed: false};
    
    if(studiesIdsToAdd.current.length>0) {
      variables.addStudies = studiesIdsToAdd.current;
      
      changedAssociations.current.studies.added = true;
      changedAssociations.current.studies.idsAdded = studiesIdsToAdd.current;
    }
    if(studiesIdsToRemove.current.length>0) {
      variables.removeStudies = studiesIdsToRemove.current;
      
      changedAssociations.current.studies.removed = true;
      changedAssociations.current.studies.idsRemoved = studiesIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.trialToContacts = {added: false, removed: false};
    
    if(trialToContactsIdsToAdd.current.length>0) {
      variables.addTrialToContacts = trialToContactsIdsToAdd.current;
      
      changedAssociations.current.trialToContacts.added = true;
      changedAssociations.current.trialToContacts.idsAdded = trialToContactsIdsToAdd.current;
    }
    if(trialToContactsIdsToRemove.current.length>0) {
      variables.removeTrialToContacts = trialToContactsIdsToRemove.current;
      
      changedAssociations.current.trialToContacts.removed = true;
      changedAssociations.current.trialToContacts.idsRemoved = trialToContactsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.trial.updateItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(response => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response
        if (
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
              action,
            });
            console.log("Errors: ", response.data.errors);
          } else {

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
            onClose(event, true, response.data.data.updateTrial);
          }
          return;

        } else { //error: bad response on updateItem()
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."));
          
          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
          return;
        }
      })
      .catch(({isCanceled, ...err}) => { //error: on updateItem()
        if(isCanceled) {
          return;
        } else {
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e1', "An error occurred while trying to execute the GraphQL query. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", err);
          
          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
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
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
        break;
      case 'program':
        programIdsToAdd.current = [];
        programIdsToAdd.current.push(itemId);
        setProgramIdsToAddState(programIdsToAdd.current);
        handleSetValue(itemId, 1, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: itemId});
        break;
      case 'studies':
        studiesIdsToAdd.current.push(itemId);
        setStudiesIdsToAddState(studiesIdsToAdd.current);
        break;
      case 'trialToContacts':
        trialToContactsIdsToAdd.current.push(itemId);
        setTrialToContactsIdsToAddState(trialToContactsIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToAdd.current.length; ++i)
      {
        if(observationUnitsIdsToAdd.current[i] === itemId) {
          observationUnitsIdsToAdd.current.splice(i, 1);
          setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'program') {
      programIdsToAdd.current = [];
      setProgramIdsToAddState([]);
      handleSetValue(null, 0, 'programDbId');
      setForeignKeys({...foreignKeys, programDbId: null});
      return;
    }//end: case 'program'
    if(associationKey === 'studies') {
      for(let i=0; i<studiesIdsToAdd.current.length; ++i)
      {
        if(studiesIdsToAdd.current[i] === itemId) {
          studiesIdsToAdd.current.splice(i, 1);
          setStudiesIdsToAddState(studiesIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'studies'
    if(associationKey === 'trialToContacts') {
      for(let i=0; i<trialToContactsIdsToAdd.current.length; ++i)
      {
        if(trialToContactsIdsToAdd.current[i] === itemId) {
          trialToContactsIdsToAdd.current.splice(i, 1);
          setTrialToContactsIdsToAddState(trialToContactsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'trialToContacts'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'observationUnits':
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState(observationUnitsIdsToRemove.current);
        break;
      case 'studies':
        studiesIdsToRemove.current.push(itemId);
        setStudiesIdsToRemoveState(studiesIdsToRemove.current);
        break;
      case 'trialToContacts':
        trialToContactsIdsToRemove.current.push(itemId);
        setTrialToContactsIdsToRemoveState(trialToContactsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToRemove.current.length; ++i)
      {
        if(observationUnitsIdsToRemove.current[i] === itemId) {
          observationUnitsIdsToRemove.current.splice(i, 1);
          setObservationUnitsIdsToRemoveState(observationUnitsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'studies') {
      for(let i=0; i<studiesIdsToRemove.current.length; ++i)
      {
        if(studiesIdsToRemove.current[i] === itemId) {
          studiesIdsToRemove.current.splice(i, 1);
          setStudiesIdsToRemoveState(studiesIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'studies'
    if(associationKey === 'trialToContacts') {
      for(let i=0; i<trialToContactsIdsToRemove.current.length; ++i)
      {
        if(trialToContactsIdsToRemove.current[i] === itemId) {
          trialToContactsIdsToRemove.current.splice(i, 1);
          setTrialToContactsIdsToRemoveState(trialToContactsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'trialToContacts'
  }

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

  const handleClickOnTrial_to_contactRow = (event, item) => {
    setTrial_to_contactDetailItem(item);
  };

  const handleTrial_to_contactDetailDialogClose = (event) => {
    delayedCloseTrial_to_contactDetailPanel(event, 500);
  }

  const delayedCloseTrial_to_contactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTrial_to_contactDetailDialogOpen(false);
        setTrial_to_contactDetailItem(undefined);
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
    <Dialog fullScreen open={open} TransitionComponent={Transition}
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
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <TrialAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              observationUnitsIdsToAdd={observationUnitsIdsToAddState}
              observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
              programIdsToAdd={programIdsToAddState}
              studiesIdsToAdd={studiesIdsToAddState}
              studiesIdsToRemove={studiesIdsToRemoveState}
              trialToContactsIdsToAdd={trialToContactsIdsToAddState}
              trialToContactsIdsToRemove={trialToContactsIdsToRemoveState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              handleClickOnProgramRow={handleClickOnProgramRow}
              handleClickOnStudyRow={handleClickOnStudyRow}
              handleClickOnTrial_to_contactRow={handleClickOnTrial_to_contactRow}
            />
          </Grid>
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
        {/* Dialog: Trial_to_contact Detail Panel */}
        {(trial_to_contactDetailDialogOpen) && (
          <TrialToContactDetailPanel
            permissions={permissions}
            item={trial_to_contactDetailItem}
            dialog={true}
            handleClose={handleTrial_to_contactDetailDialogClose}
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
