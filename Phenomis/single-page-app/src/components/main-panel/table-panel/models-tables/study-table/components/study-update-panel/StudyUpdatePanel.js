import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import StudyAttributesPage from './components/study-attributes-page/StudyAttributesPage'
import StudyAssociationsPage from './components/study-associations-page/StudyAssociationsPage'
import StudyTabsA from './components/StudyTabsA'
import StudyConfirmationDialog from './components/StudyConfirmationDialog'
import EnvironmentParameterDetailPanel from '../../../environmentParameter-table/components/environmentParameter-detail-panel/EnvironmentParameterDetailPanel'
import EventDetailPanel from '../../../event-table/components/event-detail-panel/EventDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import StudyToContactDetailPanel from '../../../study_to_contact-table/components/study_to_contact-detail-panel/Study_to_contactDetailPanel'
import StudyToSeasonDetailPanel from '../../../study_to_season-table/components/study_to_season-detail-panel/Study_to_seasonDetailPanel'
import TrialDetailPanel from '../../../trial-table/components/trial-detail-panel/TrialDetailPanel'
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

export default function StudyUpdatePanel(props) {
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
  
  const [environmentParametersIdsToAddState, setEnvironmentParametersIdsToAddState] = useState([]);
  const environmentParametersIdsToAdd = useRef([]);
  const [environmentParametersIdsToRemoveState, setEnvironmentParametersIdsToRemoveState] = useState([]);
  const environmentParametersIdsToRemove = useRef([]);
  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
  const [eventsIdsToRemoveState, setEventsIdsToRemoveState] = useState([]);
  const eventsIdsToRemove = useRef([]);
  const locationIdsToAdd = useRef((item.location&& item.location.locationDbId) ? [item.location.locationDbId] : []);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState((item.location&& item.location.locationDbId) ? [item.location.locationDbId] : []);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);
  const [studyToContactsIdsToAddState, setStudyToContactsIdsToAddState] = useState([]);
  const studyToContactsIdsToAdd = useRef([]);
  const [studyToContactsIdsToRemoveState, setStudyToContactsIdsToRemoveState] = useState([]);
  const studyToContactsIdsToRemove = useRef([]);
  const [studyToSeasonsIdsToAddState, setStudyToSeasonsIdsToAddState] = useState([]);
  const studyToSeasonsIdsToAdd = useRef([]);
  const [studyToSeasonsIdsToRemoveState, setStudyToSeasonsIdsToRemoveState] = useState([]);
  const studyToSeasonsIdsToRemove = useRef([]);
  const trialIdsToAdd = useRef((item.trial&& item.trial.trialDbId) ? [item.trial.trialDbId] : []);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState((item.trial&& item.trial.trialDbId) ? [item.trial.trialDbId] : []);

  const [environmentParameterDetailDialogOpen, setEnvironmentParameterDetailDialogOpen] = useState(false);
  const [environmentParameterDetailItem, setEnvironmentParameterDetailItem] = useState(undefined);
  const [eventDetailDialogOpen, setEventDetailDialogOpen] = useState(false);
  const [eventDetailItem, setEventDetailItem] = useState(undefined);
  const [locationDetailDialogOpen, setLocationDetailDialogOpen] = useState(false);
  const [locationDetailItem, setLocationDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [study_to_contactDetailDialogOpen, setStudy_to_contactDetailDialogOpen] = useState(false);
  const [study_to_contactDetailItem, setStudy_to_contactDetailItem] = useState(undefined);
  const [study_to_seasonDetailDialogOpen, setStudy_to_seasonDetailDialogOpen] = useState(false);
  const [study_to_seasonDetailItem, setStudy_to_seasonDetailItem] = useState(undefined);
  const [trialDetailDialogOpen, setTrialDetailDialogOpen] = useState(false);
  const [trialDetailItem, setTrialDetailItem] = useState(undefined);

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
      lastModelChanged.study&&
      lastModelChanged.study[String(item.studyDbId)]) {

        //updated item
        if(lastModelChanged.study[String(item.studyDbId)].op === "update"&&
            lastModelChanged.study[String(item.studyDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.study[String(item.studyDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.studyDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (environmentParameterDetailItem !== undefined) {
      setEnvironmentParameterDetailDialogOpen(true);
    }
  }, [environmentParameterDetailItem]);
  useEffect(() => {
    if (eventDetailItem !== undefined) {
      setEventDetailDialogOpen(true);
    }
  }, [eventDetailItem]);
  useEffect(() => {
    if (locationDetailItem !== undefined) {
      setLocationDetailDialogOpen(true);
    }
  }, [locationDetailItem]);
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
  useEffect(() => {
    if (study_to_contactDetailItem !== undefined) {
      setStudy_to_contactDetailDialogOpen(true);
    }
  }, [study_to_contactDetailItem]);
  useEffect(() => {
    if (study_to_seasonDetailItem !== undefined) {
      setStudy_to_seasonDetailDialogOpen(true);
    }
  }, [study_to_seasonDetailItem]);
  useEffect(() => {
    if (trialDetailItem !== undefined) {
      setTrialDetailDialogOpen(true);
    }
  }, [trialDetailItem]);

  function getInitialValues() {
    let initialValues = {};

    initialValues.active = item.active;
    initialValues.commonCropName = item.commonCropName;
    initialValues.culturalPractices = item.culturalPractices;
    initialValues.documentationURL = item.documentationURL;
    initialValues.endDate = item.endDate;
    initialValues.license = item.license;
    initialValues.observationUnitsDescription = item.observationUnitsDescription;
    initialValues.startDate = item.startDate;
    initialValues.studyDescription = item.studyDescription;
    initialValues.studyName = item.studyName;
    initialValues.studyType = item.studyType;
    initialValues.trialDbId = item.trialDbId;
    initialValues.studyDbId = item.studyDbId;
    initialValues.locationDbId = item.locationDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.locationDbId = item.locationDbId;
    initialForeignKeys.trialDbId = item.trialDbId;

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
  initialValueOkStates.culturalPractices = (item.culturalPractices!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.endDate = (item.endDate!==null ? 1 : 0);
  initialValueOkStates.license = (item.license!==null ? 1 : 0);
  initialValueOkStates.observationUnitsDescription = (item.observationUnitsDescription!==null ? 1 : 0);
  initialValueOkStates.startDate = (item.startDate!==null ? 1 : 0);
  initialValueOkStates.studyDescription = (item.studyDescription!==null ? 1 : 0);
  initialValueOkStates.studyName = (item.studyName!==null ? 1 : 0);
  initialValueOkStates.studyType = (item.studyType!==null ? 1 : 0);
    initialValueOkStates.trialDbId = -2; //FK
  initialValueOkStates.studyDbId = (item.studyDbId!==null ? 1 : 0);
    initialValueOkStates.locationDbId = -2; //FK

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
    if(values.current.culturalPractices !== item.culturalPractices) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if((values.current.endDate === null || item.endDate === null) && item.endDate !== values.current.endDate) { return true; }
    if(values.current.endDate !== null && item.endDate !== null && !moment(values.current.endDate).isSame(item.endDate)) { return true; }
    if(values.current.license !== item.license) { return true;}
    if(values.current.observationUnitsDescription !== item.observationUnitsDescription) { return true;}
    if((values.current.startDate === null || item.startDate === null) && item.startDate !== values.current.startDate) { return true; }
    if(values.current.startDate !== null && item.startDate !== null && !moment(values.current.startDate).isSame(item.startDate)) { return true; }
    if(values.current.studyDescription !== item.studyDescription) { return true;}
    if(values.current.studyName !== item.studyName) { return true;}
    if(values.current.studyType !== item.studyType) { return true;}
    if(values.current.trialDbId !== item.trialDbId) { return true;}
    if(values.current.studyDbId !== item.studyDbId) { return true;}
    if(values.current.locationDbId !== item.locationDbId) { return true;}
    return false;
  }

  function setAddRemoveLocation(variables) {
    //data to notify changes
    changedAssociations.current.location = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.location&&item.location.locationDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(locationIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.location.locationDbId!== locationIdsToAdd.current[0]) {
          //set id to add
          variables.addLocation = locationIdsToAdd.current[0];
          
          changedAssociations.current.location.added = true;
          changedAssociations.current.location.idsAdded = locationIdsToAdd.current;
          changedAssociations.current.location.removed = true;
          changedAssociations.current.location.idsRemoved = [item.location.locationDbId];
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
        variables.removeLocation = item.location.locationDbId;
        
        changedAssociations.current.location.removed = true;
        changedAssociations.current.location.idsRemoved = [item.location.locationDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(locationIdsToAdd.current.length>0) {
        //set id to add
        variables.addLocation = locationIdsToAdd.current[0];
        
        changedAssociations.current.location.added = true;
        changedAssociations.current.location.idsAdded = locationIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveTrial(variables) {
    //data to notify changes
    changedAssociations.current.trial = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.trial&&item.trial.trialDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(trialIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.trial.trialDbId!== trialIdsToAdd.current[0]) {
          //set id to add
          variables.addTrial = trialIdsToAdd.current[0];
          
          changedAssociations.current.trial.added = true;
          changedAssociations.current.trial.idsAdded = trialIdsToAdd.current;
          changedAssociations.current.trial.removed = true;
          changedAssociations.current.trial.idsRemoved = [item.trial.trialDbId];
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
        variables.removeTrial = item.trial.trialDbId;
        
        changedAssociations.current.trial.removed = true;
        changedAssociations.current.trial.idsRemoved = [item.trial.trialDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(trialIdsToAdd.current.length>0) {
        //set id to add
        variables.addTrial = trialIdsToAdd.current[0];
        
        changedAssociations.current.trial.added = true;
        changedAssociations.current.trial.idsAdded = trialIdsToAdd.current;
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
    delete variables.trialDbId;
    delete variables.locationDbId;

    //add & remove: to_one's
    setAddRemoveLocation(variables);
    setAddRemoveTrial(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.environmentParameters = {added: false, removed: false};
    
    if(environmentParametersIdsToAdd.current.length>0) {
      variables.addEnvironmentParameters = environmentParametersIdsToAdd.current;
      
      changedAssociations.current.environmentParameters.added = true;
      changedAssociations.current.environmentParameters.idsAdded = environmentParametersIdsToAdd.current;
    }
    if(environmentParametersIdsToRemove.current.length>0) {
      variables.removeEnvironmentParameters = environmentParametersIdsToRemove.current;
      
      changedAssociations.current.environmentParameters.removed = true;
      changedAssociations.current.environmentParameters.idsRemoved = environmentParametersIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.events = {added: false, removed: false};
    
    if(eventsIdsToAdd.current.length>0) {
      variables.addEvents = eventsIdsToAdd.current;
      
      changedAssociations.current.events.added = true;
      changedAssociations.current.events.idsAdded = eventsIdsToAdd.current;
    }
    if(eventsIdsToRemove.current.length>0) {
      variables.removeEvents = eventsIdsToRemove.current;
      
      changedAssociations.current.events.removed = true;
      changedAssociations.current.events.idsRemoved = eventsIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.observations = {added: false, removed: false};
    
    if(observationsIdsToAdd.current.length>0) {
      variables.addObservations = observationsIdsToAdd.current;
      
      changedAssociations.current.observations.added = true;
      changedAssociations.current.observations.idsAdded = observationsIdsToAdd.current;
    }
    if(observationsIdsToRemove.current.length>0) {
      variables.removeObservations = observationsIdsToRemove.current;
      
      changedAssociations.current.observations.removed = true;
      changedAssociations.current.observations.idsRemoved = observationsIdsToRemove.current;
    }
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
    changedAssociations.current.studyToContacts = {added: false, removed: false};
    
    if(studyToContactsIdsToAdd.current.length>0) {
      variables.addStudyToContacts = studyToContactsIdsToAdd.current;
      
      changedAssociations.current.studyToContacts.added = true;
      changedAssociations.current.studyToContacts.idsAdded = studyToContactsIdsToAdd.current;
    }
    if(studyToContactsIdsToRemove.current.length>0) {
      variables.removeStudyToContacts = studyToContactsIdsToRemove.current;
      
      changedAssociations.current.studyToContacts.removed = true;
      changedAssociations.current.studyToContacts.idsRemoved = studyToContactsIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.studyToSeasons = {added: false, removed: false};
    
    if(studyToSeasonsIdsToAdd.current.length>0) {
      variables.addStudyToSeasons = studyToSeasonsIdsToAdd.current;
      
      changedAssociations.current.studyToSeasons.added = true;
      changedAssociations.current.studyToSeasons.idsAdded = studyToSeasonsIdsToAdd.current;
    }
    if(studyToSeasonsIdsToRemove.current.length>0) {
      variables.removeStudyToSeasons = studyToSeasonsIdsToRemove.current;
      
      changedAssociations.current.studyToSeasons.removed = true;
      changedAssociations.current.studyToSeasons.idsRemoved = studyToSeasonsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.study.updateItem(graphqlServerUrl, variables));
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
            onClose(event, true, response.data.data.updateStudy);
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
      case 'environmentParameters':
        environmentParametersIdsToAdd.current.push(itemId);
        setEnvironmentParametersIdsToAddState(environmentParametersIdsToAdd.current);
        break;
      case 'events':
        eventsIdsToAdd.current.push(itemId);
        setEventsIdsToAddState(eventsIdsToAdd.current);
        break;
      case 'location':
        locationIdsToAdd.current = [];
        locationIdsToAdd.current.push(itemId);
        setLocationIdsToAddState(locationIdsToAdd.current);
        handleSetValue(itemId, 1, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState(observationsIdsToAdd.current);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
        break;
      case 'studyToContacts':
        studyToContactsIdsToAdd.current.push(itemId);
        setStudyToContactsIdsToAddState(studyToContactsIdsToAdd.current);
        break;
      case 'studyToSeasons':
        studyToSeasonsIdsToAdd.current.push(itemId);
        setStudyToSeasonsIdsToAddState(studyToSeasonsIdsToAdd.current);
        break;
      case 'trial':
        trialIdsToAdd.current = [];
        trialIdsToAdd.current.push(itemId);
        setTrialIdsToAddState(trialIdsToAdd.current);
        handleSetValue(itemId, 1, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'environmentParameters') {
      for(let i=0; i<environmentParametersIdsToAdd.current.length; ++i)
      {
        if(environmentParametersIdsToAdd.current[i] === itemId) {
          environmentParametersIdsToAdd.current.splice(i, 1);
          setEnvironmentParametersIdsToAddState(environmentParametersIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'environmentParameters'
    if(associationKey === 'events') {
      for(let i=0; i<eventsIdsToAdd.current.length; ++i)
      {
        if(eventsIdsToAdd.current[i] === itemId) {
          eventsIdsToAdd.current.splice(i, 1);
          setEventsIdsToAddState(eventsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'events'
    if(associationKey === 'location') {
      locationIdsToAdd.current = [];
      setLocationIdsToAddState([]);
      handleSetValue(null, 0, 'locationDbId');
      setForeignKeys({...foreignKeys, locationDbId: null});
      return;
    }//end: case 'location'
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToAdd.current.length; ++i)
      {
        if(observationsIdsToAdd.current[i] === itemId) {
          observationsIdsToAdd.current.splice(i, 1);
          setObservationsIdsToAddState(observationsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observations'
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
    if(associationKey === 'studyToContacts') {
      for(let i=0; i<studyToContactsIdsToAdd.current.length; ++i)
      {
        if(studyToContactsIdsToAdd.current[i] === itemId) {
          studyToContactsIdsToAdd.current.splice(i, 1);
          setStudyToContactsIdsToAddState(studyToContactsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'studyToContacts'
    if(associationKey === 'studyToSeasons') {
      for(let i=0; i<studyToSeasonsIdsToAdd.current.length; ++i)
      {
        if(studyToSeasonsIdsToAdd.current[i] === itemId) {
          studyToSeasonsIdsToAdd.current.splice(i, 1);
          setStudyToSeasonsIdsToAddState(studyToSeasonsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'studyToSeasons'
    if(associationKey === 'trial') {
      trialIdsToAdd.current = [];
      setTrialIdsToAddState([]);
      handleSetValue(null, 0, 'trialDbId');
      setForeignKeys({...foreignKeys, trialDbId: null});
      return;
    }//end: case 'trial'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'environmentParameters':
        environmentParametersIdsToRemove.current.push(itemId);
        setEnvironmentParametersIdsToRemoveState(environmentParametersIdsToRemove.current);
        break;
      case 'events':
        eventsIdsToRemove.current.push(itemId);
        setEventsIdsToRemoveState(eventsIdsToRemove.current);
        break;
      case 'observations':
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState(observationsIdsToRemove.current);
        break;
      case 'observationUnits':
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState(observationUnitsIdsToRemove.current);
        break;
      case 'studyToContacts':
        studyToContactsIdsToRemove.current.push(itemId);
        setStudyToContactsIdsToRemoveState(studyToContactsIdsToRemove.current);
        break;
      case 'studyToSeasons':
        studyToSeasonsIdsToRemove.current.push(itemId);
        setStudyToSeasonsIdsToRemoveState(studyToSeasonsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'environmentParameters') {
      for(let i=0; i<environmentParametersIdsToRemove.current.length; ++i)
      {
        if(environmentParametersIdsToRemove.current[i] === itemId) {
          environmentParametersIdsToRemove.current.splice(i, 1);
          setEnvironmentParametersIdsToRemoveState(environmentParametersIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'environmentParameters'
    if(associationKey === 'events') {
      for(let i=0; i<eventsIdsToRemove.current.length; ++i)
      {
        if(eventsIdsToRemove.current[i] === itemId) {
          eventsIdsToRemove.current.splice(i, 1);
          setEventsIdsToRemoveState(eventsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'events'
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToRemove.current.length; ++i)
      {
        if(observationsIdsToRemove.current[i] === itemId) {
          observationsIdsToRemove.current.splice(i, 1);
          setObservationsIdsToRemoveState(observationsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'observations'
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
    if(associationKey === 'studyToContacts') {
      for(let i=0; i<studyToContactsIdsToRemove.current.length; ++i)
      {
        if(studyToContactsIdsToRemove.current[i] === itemId) {
          studyToContactsIdsToRemove.current.splice(i, 1);
          setStudyToContactsIdsToRemoveState(studyToContactsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'studyToContacts'
    if(associationKey === 'studyToSeasons') {
      for(let i=0; i<studyToSeasonsIdsToRemove.current.length; ++i)
      {
        if(studyToSeasonsIdsToRemove.current[i] === itemId) {
          studyToSeasonsIdsToRemove.current.splice(i, 1);
          setStudyToSeasonsIdsToRemoveState(studyToSeasonsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'studyToSeasons'
  }

  const handleClickOnEnvironmentParameterRow = (event, item) => {
    setEnvironmentParameterDetailItem(item);
  };

  const handleEnvironmentParameterDetailDialogClose = (event) => {
    delayedCloseEnvironmentParameterDetailPanel(event, 500);
  }

  const delayedCloseEnvironmentParameterDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEnvironmentParameterDetailDialogOpen(false);
        setEnvironmentParameterDetailItem(undefined);
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

  const handleClickOnStudy_to_contactRow = (event, item) => {
    setStudy_to_contactDetailItem(item);
  };

  const handleStudy_to_contactDetailDialogClose = (event) => {
    delayedCloseStudy_to_contactDetailPanel(event, 500);
  }

  const delayedCloseStudy_to_contactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudy_to_contactDetailDialogOpen(false);
        setStudy_to_contactDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnStudy_to_seasonRow = (event, item) => {
    setStudy_to_seasonDetailItem(item);
  };

  const handleStudy_to_seasonDetailDialogClose = (event) => {
    delayedCloseStudy_to_seasonDetailPanel(event, 500);
  }

  const delayedCloseStudy_to_seasonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudy_to_seasonDetailDialogOpen(false);
        setStudy_to_seasonDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Study | studyDbId: " + item.studyDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " study" }>
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
            <StudyTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <StudyAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <StudyAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              environmentParametersIdsToAdd={environmentParametersIdsToAddState}
              environmentParametersIdsToRemove={environmentParametersIdsToRemoveState}
              eventsIdsToAdd={eventsIdsToAddState}
              eventsIdsToRemove={eventsIdsToRemoveState}
              locationIdsToAdd={locationIdsToAddState}
              observationsIdsToAdd={observationsIdsToAddState}
              observationsIdsToRemove={observationsIdsToRemoveState}
              observationUnitsIdsToAdd={observationUnitsIdsToAddState}
              observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
              studyToContactsIdsToAdd={studyToContactsIdsToAddState}
              studyToContactsIdsToRemove={studyToContactsIdsToRemoveState}
              studyToSeasonsIdsToAdd={studyToSeasonsIdsToAddState}
              studyToSeasonsIdsToRemove={studyToSeasonsIdsToRemoveState}
              trialIdsToAdd={trialIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
              handleClickOnEventRow={handleClickOnEventRow}
              handleClickOnLocationRow={handleClickOnLocationRow}
              handleClickOnObservationRow={handleClickOnObservationRow}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
              handleClickOnStudy_to_seasonRow={handleClickOnStudy_to_seasonRow}
              handleClickOnTrialRow={handleClickOnTrialRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <StudyConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: EnvironmentParameter Detail Panel */}
        {(environmentParameterDetailDialogOpen) && (
          <EnvironmentParameterDetailPanel
            permissions={permissions}
            item={environmentParameterDetailItem}
            dialog={true}
            handleClose={handleEnvironmentParameterDetailDialogClose}
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
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <ObservationUnitDetailPanel
            permissions={permissions}
            item={observationUnitDetailItem}
            dialog={true}
            handleClose={handleObservationUnitDetailDialogClose}
          />
        )}
        {/* Dialog: Study_to_contact Detail Panel */}
        {(study_to_contactDetailDialogOpen) && (
          <StudyToContactDetailPanel
            permissions={permissions}
            item={study_to_contactDetailItem}
            dialog={true}
            handleClose={handleStudy_to_contactDetailDialogClose}
          />
        )}
        {/* Dialog: Study_to_season Detail Panel */}
        {(study_to_seasonDetailDialogOpen) && (
          <StudyToSeasonDetailPanel
            permissions={permissions}
            item={study_to_seasonDetailItem}
            dialog={true}
            handleClose={handleStudy_to_seasonDetailDialogClose}
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

    </Dialog>
  );
}
StudyUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
