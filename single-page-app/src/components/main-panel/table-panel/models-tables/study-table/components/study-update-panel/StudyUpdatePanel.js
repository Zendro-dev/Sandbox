import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import StudyAttributesPage from './components/study-attributes-page/StudyAttributesPage'
import StudyAssociationsPage from './components/study-associations-page/StudyAssociationsPage'
import StudyTabsA from './components/StudyTabsA'
import StudyConfirmationDialog from './components/StudyConfirmationDialog'
import ContactDetailPanel from '../../../contact-table/components/contact-detail-panel/ContactDetailPanel'
import EnvironmentParameterDetailPanel from '../../../environmentParameter-table/components/environmentParameter-detail-panel/EnvironmentParameterDetailPanel'
import EventDetailPanel from '../../../event-table/components/event-detail-panel/EventDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import SeasonDetailPanel from '../../../season-table/components/season-detail-panel/SeasonDetailPanel'
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
  const [environmentParametersIdsToAddState, setEnvironmentParametersIdsToAddState] = useState([]);
  const environmentParametersIdsToAdd = useRef([]);
  const [environmentParametersIdsToRemoveState, setEnvironmentParametersIdsToRemoveState] = useState([]);
  const environmentParametersIdsToRemove = useRef([]);
  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
  const [eventsIdsToRemoveState, setEventsIdsToRemoveState] = useState([]);
  const eventsIdsToRemove = useRef([]);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState([]);
  const locationIdsToAdd = useRef([]);
  const [locationIdsToRemoveState, setLocationIdsToRemoveState] = useState([]);
  const locationIdsToRemove = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);
  const [seasonsIdsToAddState, setSeasonsIdsToAddState] = useState([]);
  const seasonsIdsToAdd = useRef([]);
  const [seasonsIdsToRemoveState, setSeasonsIdsToRemoveState] = useState([]);
  const seasonsIdsToRemove = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);
  const [trialIdsToRemoveState, setTrialIdsToRemoveState] = useState([]);
  const trialIdsToRemove = useRef([]);

  const [contactDetailDialogOpen, setContactDetailDialogOpen] = useState(false);
  const [contactDetailItem, setContactDetailItem] = useState(undefined);
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
  const [seasonDetailDialogOpen, setSeasonDetailDialogOpen] = useState(false);
  const [seasonDetailItem, setSeasonDetailItem] = useState(undefined);
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
    if (contactDetailItem !== undefined) {
      setContactDetailDialogOpen(true);
    }
  }, [contactDetailItem]);
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
    if (seasonDetailItem !== undefined) {
      setSeasonDetailDialogOpen(true);
    }
  }, [seasonDetailItem]);
  useEffect(() => {
    if (trialDetailItem !== undefined) {
      setTrialDetailDialogOpen(true);
    }
  }, [trialDetailItem]);

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

    initialValues.studyDbId = item.studyDbId;
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
    initialValues.locationDbId = item.locationDbId;
    initialValues.contactDbIds = item.contactDbIds;
    initialValues.seasonDbIds = item.seasonDbIds;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.contactDbIds = item.contactDbIds;
    initialForeignKeys.seasonDbIds = item.seasonDbIds;
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
       -3: readOnly
    */
    let initialValueOkStates = {};

  initialValueOkStates.studyDbId = (item.studyDbId!==null ? 1 : 0);
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
    initialValueOkStates.locationDbId = -2; //FK
    initialValueOkStates.contactDbIds = -2; //FK
    initialValueOkStates.seasonDbIds = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.studyDbId = {errors: []};
    _initialValueAjvStates.active = {errors: []};
    _initialValueAjvStates.commonCropName = {errors: []};
    _initialValueAjvStates.culturalPractices = {errors: []};
    _initialValueAjvStates.documentationURL = {errors: []};
    _initialValueAjvStates.endDate = {errors: []};
    _initialValueAjvStates.license = {errors: []};
    _initialValueAjvStates.observationUnitsDescription = {errors: []};
    _initialValueAjvStates.startDate = {errors: []};
    _initialValueAjvStates.studyDescription = {errors: []};
    _initialValueAjvStates.studyName = {errors: []};
    _initialValueAjvStates.studyType = {errors: []};
    _initialValueAjvStates.trialDbId = {errors: []}; //FK
    _initialValueAjvStates.locationDbId = {errors: []}; //FK
    _initialValueAjvStates.contactDbIds = {errors: []}; //FK
    _initialValueAjvStates.seasonDbIds = {errors: []}; //FK

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
    if(values.current.studyDbId !== item.studyDbId) { return true;}
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
    if(values.current.locationDbId !== item.locationDbId) { return true;}
    if(values.current.contactDbIds !== item.contactDbIds) { return true;}
    if(values.current.seasonDbIds !== item.seasonDbIds) { return true;}
    return false;
  }

  function setAddRemoveOneLocation(variables) {
    //data to notify changes
    if(!changedAssociations.current.study_locationDbId) changedAssociations.current.study_locationDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(locationIdsToAdd.current.length>0) {
      //set id to add
      variables.addLocation = locationIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.study_locationDbId.added = true;
      changedAssociations.current.study_locationDbId.idsAdded = [locationIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(locationIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeLocation = locationIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.study_locationDbId.removed = true;
      changedAssociations.current.study_locationDbId.idsRemoved = [locationIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneTrial(variables) {
    //data to notify changes
    if(!changedAssociations.current.study_trialDbId) changedAssociations.current.study_trialDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(trialIdsToAdd.current.length>0) {
      //set id to add
      variables.addTrial = trialIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.study_trialDbId.added = true;
      changedAssociations.current.study_trialDbId.idsAdded = [trialIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(trialIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeTrial = trialIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.study_trialDbId.removed = true;
      changedAssociations.current.study_trialDbId.idsRemoved = [trialIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyContacts(variables) {
    //data to notify changes
    if(!changedAssociations.current.contact_stduyDbIds) changedAssociations.current.contact_stduyDbIds = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(contactsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addContacts = [ ...contactsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.contact_stduyDbIds.added = true;
      if(changedAssociations.current.contact_stduyDbIds.idsAdded){
        contactsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.contact_stduyDbIds.idsAdded.includes(it)) changedAssociations.current.contact_stduyDbIds.idsAdded.push(it);});
      } else {
        changedAssociations.current.contact_stduyDbIds.idsAdded = [...contactsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(contactsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeContacts = [ ...contactsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.contact_stduyDbIds.removed = true;
      if(changedAssociations.current.contact_stduyDbIds.idsRemoved){
        contactsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.contact_stduyDbIds.idsRemoved.includes(it)) changedAssociations.current.contact_stduyDbIds.idsRemoved.push(it);});
      } else {
        changedAssociations.current.contact_stduyDbIds.idsRemoved = [...contactsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyEnvironmentParameters(variables) {
    //data to notify changes
    if(!changedAssociations.current.environmentParameter_studyDbId) changedAssociations.current.environmentParameter_studyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(environmentParametersIdsToAdd.current.length>0) {
      //set ids to add
      variables.addEnvironmentParameters = [ ...environmentParametersIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.environmentParameter_studyDbId.added = true;
      if(changedAssociations.current.environmentParameter_studyDbId.idsAdded){
        environmentParametersIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.environmentParameter_studyDbId.idsAdded.includes(it)) changedAssociations.current.environmentParameter_studyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.environmentParameter_studyDbId.idsAdded = [...environmentParametersIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(environmentParametersIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeEnvironmentParameters = [ ...environmentParametersIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.environmentParameter_studyDbId.removed = true;
      if(changedAssociations.current.environmentParameter_studyDbId.idsRemoved){
        environmentParametersIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.environmentParameter_studyDbId.idsRemoved.includes(it)) changedAssociations.current.environmentParameter_studyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.environmentParameter_studyDbId.idsRemoved = [...environmentParametersIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyEvents(variables) {
    //data to notify changes
    if(!changedAssociations.current.event_studyDbId) changedAssociations.current.event_studyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(eventsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addEvents = [ ...eventsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.event_studyDbId.added = true;
      if(changedAssociations.current.event_studyDbId.idsAdded){
        eventsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.event_studyDbId.idsAdded.includes(it)) changedAssociations.current.event_studyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.event_studyDbId.idsAdded = [...eventsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(eventsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeEvents = [ ...eventsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.event_studyDbId.removed = true;
      if(changedAssociations.current.event_studyDbId.idsRemoved){
        eventsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.event_studyDbId.idsRemoved.includes(it)) changedAssociations.current.event_studyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.event_studyDbId.idsRemoved = [...eventsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservations(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_studyDbId) changedAssociations.current.observation_studyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservations = [ ...observationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observation_studyDbId.added = true;
      if(changedAssociations.current.observation_studyDbId.idsAdded){
        observationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observation_studyDbId.idsAdded.includes(it)) changedAssociations.current.observation_studyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observation_studyDbId.idsAdded = [...observationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservations = [ ...observationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observation_studyDbId.removed = true;
      if(changedAssociations.current.observation_studyDbId.idsRemoved){
        observationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observation_studyDbId.idsRemoved.includes(it)) changedAssociations.current.observation_studyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observation_studyDbId.idsRemoved = [...observationsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationUnits(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_studyDbId) changedAssociations.current.observationUnit_studyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationUnits = [ ...observationUnitsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationUnit_studyDbId.added = true;
      if(changedAssociations.current.observationUnit_studyDbId.idsAdded){
        observationUnitsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationUnit_studyDbId.idsAdded.includes(it)) changedAssociations.current.observationUnit_studyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationUnit_studyDbId.idsAdded = [...observationUnitsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationUnits = [ ...observationUnitsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationUnit_studyDbId.removed = true;
      if(changedAssociations.current.observationUnit_studyDbId.idsRemoved){
        observationUnitsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationUnit_studyDbId.idsRemoved.includes(it)) changedAssociations.current.observationUnit_studyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationUnit_studyDbId.idsRemoved = [...observationUnitsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManySeasons(variables) {
    //data to notify changes
    if(!changedAssociations.current.season_studyDbIds) changedAssociations.current.season_studyDbIds = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(seasonsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addSeasons = [ ...seasonsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.season_studyDbIds.added = true;
      if(changedAssociations.current.season_studyDbIds.idsAdded){
        seasonsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.season_studyDbIds.idsAdded.includes(it)) changedAssociations.current.season_studyDbIds.idsAdded.push(it);});
      } else {
        changedAssociations.current.season_studyDbIds.idsAdded = [...seasonsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(seasonsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeSeasons = [ ...seasonsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.season_studyDbIds.removed = true;
      if(changedAssociations.current.season_studyDbIds.idsRemoved){
        seasonsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.season_studyDbIds.idsRemoved.includes(it)) changedAssociations.current.season_studyDbIds.idsRemoved.push(it);});
      } else {
        changedAssociations.current.season_studyDbIds.idsRemoved = [...seasonsIdsToRemove.current];
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
    
    delete variables.trialDbId; //FK
    delete variables.locationDbId; //FK
    delete variables.contactDbIds; //FK
    delete variables.seasonDbIds; //FK

    //add & remove: to_one's
    setAddRemoveOneLocation(variables);
    setAddRemoveOneTrial(variables);

    //add & remove: to_many's
    setAddRemoveManyContacts(variables);
    setAddRemoveManyEnvironmentParameters(variables);
    setAddRemoveManyEvents(variables);
    setAddRemoveManyObservations(variables);
    setAddRemoveManyObservationUnits(variables);
    setAddRemoveManySeasons(variables);

    /*
      API Request: api.study.updateItem
    */
    let cancelableApiReq = makeCancelable(api.study.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.updateItem'}];
            newError.path=['Studies', `studyDbId:${item.studyDbId}`, 'update'];
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.updateItem'}];
          newError.path=['Studies', `studyDbId:${item.studyDbId}`, 'update'];
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
      .catch((err) => { //error: on api.study.updateItem
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.updateItem'}];
          newError.path=['Studies', `studyDbId:${item.studyDbId}`, 'update'];
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
      case 'environmentParameters':
        environmentParametersIdsToAdd.current.push(itemId);
        setEnvironmentParametersIdsToAddState([...environmentParametersIdsToAdd.current]);
        break;
      case 'events':
        eventsIdsToAdd.current.push(itemId);
        setEventsIdsToAddState([...eventsIdsToAdd.current]);
        break;
      case 'location':
        locationIdsToAdd.current = [];
        locationIdsToAdd.current.push(itemId);
        setLocationIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState([...observationsIdsToAdd.current]);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
        break;
      case 'seasons':
        seasonsIdsToAdd.current.push(itemId);
        setSeasonsIdsToAddState([...seasonsIdsToAdd.current]);
        break;
      case 'trial':
        trialIdsToAdd.current = [];
        trialIdsToAdd.current.push(itemId);
        setTrialIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: itemId});
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
    if(associationKey === 'environmentParameters') {
      for(let i=0; i<environmentParametersIdsToAdd.current.length; ++i)
      {
        if(environmentParametersIdsToAdd.current[i] === itemId) {
          environmentParametersIdsToAdd.current.splice(i, 1);
          setEnvironmentParametersIdsToAddState([...environmentParametersIdsToAdd.current]);
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
          setEventsIdsToAddState([...eventsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'events'
    if(associationKey === 'location') {
      if(locationIdsToAdd.current.length > 0
      && locationIdsToAdd.current[0] === itemId) {
        locationIdsToAdd.current = [];
        setLocationIdsToAddState([]);
        handleSetValue(null, -2, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: null});
      }
      return;
    }//end: case 'location'
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
    if(associationKey === 'seasons') {
      for(let i=0; i<seasonsIdsToAdd.current.length; ++i)
      {
        if(seasonsIdsToAdd.current[i] === itemId) {
          seasonsIdsToAdd.current.splice(i, 1);
          setSeasonsIdsToAddState([...seasonsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'seasons'
    if(associationKey === 'trial') {
      if(trialIdsToAdd.current.length > 0
      && trialIdsToAdd.current[0] === itemId) {
        trialIdsToAdd.current = [];
        setTrialIdsToAddState([]);
        handleSetValue(null, -2, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: null});
      }
      return;
    }//end: case 'trial'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'contacts':
  
        contactsIdsToRemove.current.push(itemId);
        setContactsIdsToRemoveState([...contactsIdsToRemove.current]);
        break;
        case 'environmentParameters':
  
        environmentParametersIdsToRemove.current.push(itemId);
        setEnvironmentParametersIdsToRemoveState([...environmentParametersIdsToRemove.current]);
        break;
        case 'events':
  
        eventsIdsToRemove.current.push(itemId);
        setEventsIdsToRemoveState([...eventsIdsToRemove.current]);
        break;
        case 'location':
          locationIdsToRemove.current = [];
          locationIdsToRemove.current.push(itemId);
          setLocationIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'locationDbId');
          setForeignKeys({...foreignKeys, locationDbId: null});
        break;
        case 'observations':
  
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
        break;
        case 'observationUnits':
  
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
        break;
        case 'seasons':
  
        seasonsIdsToRemove.current.push(itemId);
        setSeasonsIdsToRemoveState([...seasonsIdsToRemove.current]);
        break;
        case 'trial':
          trialIdsToRemove.current = [];
          trialIdsToRemove.current.push(itemId);
          setTrialIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'trialDbId');
          setForeignKeys({...foreignKeys, trialDbId: null});
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
    if(associationKey === 'environmentParameters') {
      for(let i=0; i<environmentParametersIdsToRemove.current.length; ++i)
      {
        if(environmentParametersIdsToRemove.current[i] === itemId) {
          environmentParametersIdsToRemove.current.splice(i, 1);
          setEnvironmentParametersIdsToRemoveState([...environmentParametersIdsToRemove.current]);
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
          setEventsIdsToRemoveState([...eventsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'events'
    if(associationKey === 'location') {
      if(locationIdsToRemove.current.length > 0
      && locationIdsToRemove.current[0] === itemId) {
        locationIdsToRemove.current = [];
        setLocationIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: itemId});
      }
      return;
    }//end: case 'location'
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
    if(associationKey === 'seasons') {
      for(let i=0; i<seasonsIdsToRemove.current.length; ++i)
      {
        if(seasonsIdsToRemove.current[i] === itemId) {
          seasonsIdsToRemove.current.splice(i, 1);
          setSeasonsIdsToRemoveState([...seasonsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'seasons'
    if(associationKey === 'trial') {
      if(trialIdsToRemove.current.length > 0
      && trialIdsToRemove.current[0] === itemId) {
        trialIdsToRemove.current = [];
        setTrialIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: itemId});
      }
      return;
    }//end: case 'trial'
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

  const handleClickOnSeasonRow = (event, item) => {
    setSeasonDetailItem(item);
  };

  const handleSeasonDetailDialogClose = (event) => {
    delayedCloseSeasonDetailPanel(event, 500);
  }

  const delayedCloseSeasonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSeasonDetailDialogOpen(false);
        setSeasonDetailItem(undefined);
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
    <Dialog id='StudyUpdatePanel-dialog' 
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
              id='StudyUpdatePanel-button-cancel'
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
                id='StudyUpdatePanel-fabButton-save' 
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
              <StudyAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                contactsIdsToAdd={contactsIdsToAddState}
                contactsIdsToRemove={contactsIdsToRemoveState}
                environmentParametersIdsToAdd={environmentParametersIdsToAddState}
                environmentParametersIdsToRemove={environmentParametersIdsToRemoveState}
                eventsIdsToAdd={eventsIdsToAddState}
                eventsIdsToRemove={eventsIdsToRemoveState}
                locationIdsToAdd={locationIdsToAddState}
                locationIdsToRemove={locationIdsToRemoveState}
                observationsIdsToAdd={observationsIdsToAddState}
                observationsIdsToRemove={observationsIdsToRemoveState}
                observationUnitsIdsToAdd={observationUnitsIdsToAddState}
                observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
                seasonsIdsToAdd={seasonsIdsToAddState}
                seasonsIdsToRemove={seasonsIdsToRemoveState}
                trialIdsToAdd={trialIdsToAddState}
                trialIdsToRemove={trialIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnContactRow={handleClickOnContactRow}
                handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
                handleClickOnEventRow={handleClickOnEventRow}
                handleClickOnLocationRow={handleClickOnLocationRow}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
                handleClickOnTrialRow={handleClickOnTrialRow}
              />
            </Grid>
          )}
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

        {/* Dialog: Contact Detail Panel */}
        {(contactDetailDialogOpen) && (
          <ContactDetailPanel
            permissions={permissions}
            item={contactDetailItem}
            dialog={true}
            handleClose={handleContactDetailDialogClose}
          />
        )}
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
        {/* Dialog: Season Detail Panel */}
        {(seasonDetailDialogOpen) && (
          <SeasonDetailPanel
            permissions={permissions}
            item={seasonDetailItem}
            dialog={true}
            handleClose={handleSeasonDetailDialogClose}
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
