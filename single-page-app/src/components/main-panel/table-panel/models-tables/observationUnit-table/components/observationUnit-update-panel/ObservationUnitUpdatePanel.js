import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ObservationUnitAttributesPage from './components/observationUnit-attributes-page/ObservationUnitAttributesPage'
import ObservationUnitAssociationsPage from './components/observationUnit-associations-page/ObservationUnitAssociationsPage'
import ObservationUnitTabsA from './components/ObservationUnitTabsA'
import ObservationUnitConfirmationDialog from './components/ObservationUnitConfirmationDialog'
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

export default function ObservationUnitUpdatePanel(props) {
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
  
  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
  const [eventsIdsToRemoveState, setEventsIdsToRemoveState] = useState([]);
  const eventsIdsToRemove = useRef([]);
  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState([]);
  const germplasmIdsToAdd = useRef([]);
  const [germplasmIdsToRemoveState, setGermplasmIdsToRemoveState] = useState([]);
  const germplasmIdsToRemove = useRef([]);
  const [imagesIdsToAddState, setImagesIdsToAddState] = useState([]);
  const imagesIdsToAdd = useRef([]);
  const [imagesIdsToRemoveState, setImagesIdsToRemoveState] = useState([]);
  const imagesIdsToRemove = useRef([]);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState([]);
  const locationIdsToAdd = useRef([]);
  const [locationIdsToRemoveState, setLocationIdsToRemoveState] = useState([]);
  const locationIdsToRemove = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationTreatmentsIdsToAddState, setObservationTreatmentsIdsToAddState] = useState([]);
  const observationTreatmentsIdsToAdd = useRef([]);
  const [observationTreatmentsIdsToRemoveState, setObservationTreatmentsIdsToRemoveState] = useState([]);
  const observationTreatmentsIdsToRemove = useRef([]);
  const [observationUnitPositionIdsToAddState, setObservationUnitPositionIdsToAddState] = useState([]);
  const observationUnitPositionIdsToAdd = useRef([]);
  const [observationUnitPositionIdsToRemoveState, setObservationUnitPositionIdsToRemoveState] = useState([]);
  const observationUnitPositionIdsToRemove = useRef([]);
  const [programIdsToAddState, setProgramIdsToAddState] = useState([]);
  const programIdsToAdd = useRef([]);
  const [programIdsToRemoveState, setProgramIdsToRemoveState] = useState([]);
  const programIdsToRemove = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);
  const [studyIdsToRemoveState, setStudyIdsToRemoveState] = useState([]);
  const studyIdsToRemove = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);
  const [trialIdsToRemoveState, setTrialIdsToRemoveState] = useState([]);
  const trialIdsToRemove = useRef([]);

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
      lastModelChanged.observationUnit&&
      lastModelChanged.observationUnit[String(item.observationUnitDbId)]) {

        //updated item
        if(lastModelChanged.observationUnit[String(item.observationUnitDbId)].op === "update"&&
            lastModelChanged.observationUnit[String(item.observationUnitDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.observationUnit[String(item.observationUnitDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.observationUnitDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (eventDetailItem !== undefined) {
      setEventDetailDialogOpen(true);
    }
  }, [eventDetailItem]);
  useEffect(() => {
    if (germplasmDetailItem !== undefined) {
      setGermplasmDetailDialogOpen(true);
    }
  }, [germplasmDetailItem]);
  useEffect(() => {
    if (imageDetailItem !== undefined) {
      setImageDetailDialogOpen(true);
    }
  }, [imageDetailItem]);
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
    if (observationTreatmentDetailItem !== undefined) {
      setObservationTreatmentDetailDialogOpen(true);
    }
  }, [observationTreatmentDetailItem]);
  useEffect(() => {
    if (observationUnitPositionDetailItem !== undefined) {
      setObservationUnitPositionDetailDialogOpen(true);
    }
  }, [observationUnitPositionDetailItem]);
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

    initialValues.observationLevel = item.observationLevel;
    initialValues.observationUnitName = item.observationUnitName;
    initialValues.observationUnitPUI = item.observationUnitPUI;
    initialValues.plantNumber = item.plantNumber;
    initialValues.plotNumber = item.plotNumber;
    initialValues.programDbId = item.programDbId;
    initialValues.studyDbId = item.studyDbId;
    initialValues.trialDbId = item.trialDbId;
    initialValues.observationUnitDbId = item.observationUnitDbId;
    initialValues.germplasmDbId = item.germplasmDbId;
    initialValues.locationDbId = item.locationDbId;
    initialValues.eventDbIds = item.eventDbIds;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.germplasmDbId = item.germplasmDbId;
    initialForeignKeys.locationDbId = item.locationDbId;
    initialForeignKeys.programDbId = item.programDbId;
    initialForeignKeys.studyDbId = item.studyDbId;
    initialForeignKeys.trialDbId = item.trialDbId;
    initialForeignKeys.eventDbIds = item.eventDbIds;

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

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.observationLevel = {errors: []};
    _initialValueAjvStates.observationUnitName = {errors: []};
    _initialValueAjvStates.observationUnitPUI = {errors: []};
    _initialValueAjvStates.plantNumber = {errors: []};
    _initialValueAjvStates.plotNumber = {errors: []};
    _initialValueAjvStates.programDbId = {errors: []}; //FK
    _initialValueAjvStates.studyDbId = {errors: []}; //FK
    _initialValueAjvStates.trialDbId = {errors: []}; //FK
    _initialValueAjvStates.observationUnitDbId = {errors: []};
    _initialValueAjvStates.germplasmDbId = {errors: []}; //FK
    _initialValueAjvStates.locationDbId = {errors: []}; //FK
    _initialValueAjvStates.eventDbIds = {errors: []}; //FK

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
    if(values.current.observationLevel !== item.observationLevel) { return true;}
    if(values.current.observationUnitName !== item.observationUnitName) { return true;}
    if(values.current.observationUnitPUI !== item.observationUnitPUI) { return true;}
    if(values.current.plantNumber !== item.plantNumber) { return true;}
    if(values.current.plotNumber !== item.plotNumber) { return true;}
    if(values.current.programDbId !== item.programDbId) { return true;}
    if(values.current.studyDbId !== item.studyDbId) { return true;}
    if(values.current.trialDbId !== item.trialDbId) { return true;}
    if(values.current.observationUnitDbId !== item.observationUnitDbId) { return true;}
    if(values.current.germplasmDbId !== item.germplasmDbId) { return true;}
    if(values.current.locationDbId !== item.locationDbId) { return true;}
    if(values.current.eventDbIds !== item.eventDbIds) { return true;}
    return false;
  }

  function setAddRemoveOneGermplasm(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_germplasmDbId) changedAssociations.current.observationUnit_germplasmDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(germplasmIdsToAdd.current.length>0) {
      //set id to add
      variables.addGermplasm = germplasmIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnit_germplasmDbId.added = true;
      changedAssociations.current.observationUnit_germplasmDbId.idsAdded = [germplasmIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(germplasmIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeGermplasm = germplasmIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnit_germplasmDbId.removed = true;
      changedAssociations.current.observationUnit_germplasmDbId.idsRemoved = [germplasmIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneLocation(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_locationDbId) changedAssociations.current.observationUnit_locationDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(locationIdsToAdd.current.length>0) {
      //set id to add
      variables.addLocation = locationIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnit_locationDbId.added = true;
      changedAssociations.current.observationUnit_locationDbId.idsAdded = [locationIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(locationIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeLocation = locationIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnit_locationDbId.removed = true;
      changedAssociations.current.observationUnit_locationDbId.idsRemoved = [locationIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneObservationUnitPosition(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnitPosition_observationUnitDbId) changedAssociations.current.observationUnitPosition_observationUnitDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitPositionIdsToAdd.current.length>0) {
      //set id to add
      variables.addObservationUnitPosition = observationUnitPositionIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnitPosition_observationUnitDbId.added = true;
      changedAssociations.current.observationUnitPosition_observationUnitDbId.idsAdded = [observationUnitPositionIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitPositionIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeObservationUnitPosition = observationUnitPositionIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnitPosition_observationUnitDbId.removed = true;
      changedAssociations.current.observationUnitPosition_observationUnitDbId.idsRemoved = [observationUnitPositionIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneProgram(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_programDbId) changedAssociations.current.observationUnit_programDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(programIdsToAdd.current.length>0) {
      //set id to add
      variables.addProgram = programIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnit_programDbId.added = true;
      changedAssociations.current.observationUnit_programDbId.idsAdded = [programIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(programIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeProgram = programIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnit_programDbId.removed = true;
      changedAssociations.current.observationUnit_programDbId.idsRemoved = [programIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneStudy(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_studyDbId) changedAssociations.current.observationUnit_studyDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(studyIdsToAdd.current.length>0) {
      //set id to add
      variables.addStudy = studyIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnit_studyDbId.added = true;
      changedAssociations.current.observationUnit_studyDbId.idsAdded = [studyIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(studyIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeStudy = studyIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnit_studyDbId.removed = true;
      changedAssociations.current.observationUnit_studyDbId.idsRemoved = [studyIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneTrial(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_trialDbId) changedAssociations.current.observationUnit_trialDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(trialIdsToAdd.current.length>0) {
      //set id to add
      variables.addTrial = trialIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationUnit_trialDbId.added = true;
      changedAssociations.current.observationUnit_trialDbId.idsAdded = [trialIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(trialIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeTrial = trialIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationUnit_trialDbId.removed = true;
      changedAssociations.current.observationUnit_trialDbId.idsRemoved = [trialIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyEvents(variables) {
    //data to notify changes
    if(!changedAssociations.current.event_observationUnitDbIds) changedAssociations.current.event_observationUnitDbIds = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(eventsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addEvents = [ ...eventsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.event_observationUnitDbIds.added = true;
      if(changedAssociations.current.event_observationUnitDbIds.idsAdded){
        eventsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.event_observationUnitDbIds.idsAdded.includes(it)) changedAssociations.current.event_observationUnitDbIds.idsAdded.push(it);});
      } else {
        changedAssociations.current.event_observationUnitDbIds.idsAdded = [...eventsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(eventsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeEvents = [ ...eventsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.event_observationUnitDbIds.removed = true;
      if(changedAssociations.current.event_observationUnitDbIds.idsRemoved){
        eventsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.event_observationUnitDbIds.idsRemoved.includes(it)) changedAssociations.current.event_observationUnitDbIds.idsRemoved.push(it);});
      } else {
        changedAssociations.current.event_observationUnitDbIds.idsRemoved = [...eventsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyImages(variables) {
    //data to notify changes
    if(!changedAssociations.current.image_observationUnitDbId) changedAssociations.current.image_observationUnitDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(imagesIdsToAdd.current.length>0) {
      //set ids to add
      variables.addImages = [ ...imagesIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.image_observationUnitDbId.added = true;
      if(changedAssociations.current.image_observationUnitDbId.idsAdded){
        imagesIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.image_observationUnitDbId.idsAdded.includes(it)) changedAssociations.current.image_observationUnitDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.image_observationUnitDbId.idsAdded = [...imagesIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(imagesIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeImages = [ ...imagesIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.image_observationUnitDbId.removed = true;
      if(changedAssociations.current.image_observationUnitDbId.idsRemoved){
        imagesIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.image_observationUnitDbId.idsRemoved.includes(it)) changedAssociations.current.image_observationUnitDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.image_observationUnitDbId.idsRemoved = [...imagesIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservations(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_observationUnitDbId) changedAssociations.current.observation_observationUnitDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservations = [ ...observationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observation_observationUnitDbId.added = true;
      if(changedAssociations.current.observation_observationUnitDbId.idsAdded){
        observationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observation_observationUnitDbId.idsAdded.includes(it)) changedAssociations.current.observation_observationUnitDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observation_observationUnitDbId.idsAdded = [...observationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservations = [ ...observationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observation_observationUnitDbId.removed = true;
      if(changedAssociations.current.observation_observationUnitDbId.idsRemoved){
        observationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observation_observationUnitDbId.idsRemoved.includes(it)) changedAssociations.current.observation_observationUnitDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observation_observationUnitDbId.idsRemoved = [...observationsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationTreatments(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationTreatment_observationUnitDbId) changedAssociations.current.observationTreatment_observationUnitDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationTreatmentsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationTreatments = [ ...observationTreatmentsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationTreatment_observationUnitDbId.added = true;
      if(changedAssociations.current.observationTreatment_observationUnitDbId.idsAdded){
        observationTreatmentsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationTreatment_observationUnitDbId.idsAdded.includes(it)) changedAssociations.current.observationTreatment_observationUnitDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationTreatment_observationUnitDbId.idsAdded = [...observationTreatmentsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationTreatmentsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationTreatments = [ ...observationTreatmentsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationTreatment_observationUnitDbId.removed = true;
      if(changedAssociations.current.observationTreatment_observationUnitDbId.idsRemoved){
        observationTreatmentsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationTreatment_observationUnitDbId.idsRemoved.includes(it)) changedAssociations.current.observationTreatment_observationUnitDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationTreatment_observationUnitDbId.idsRemoved = [...observationTreatmentsIdsToRemove.current];
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
    delete variables.studyDbId; //FK
    delete variables.trialDbId; //FK
    delete variables.germplasmDbId; //FK
    delete variables.locationDbId; //FK
    delete variables.eventDbIds; //FK

    //add & remove: to_one's
    setAddRemoveOneGermplasm(variables);
    setAddRemoveOneLocation(variables);
    setAddRemoveOneObservationUnitPosition(variables);
    setAddRemoveOneProgram(variables);
    setAddRemoveOneStudy(variables);
    setAddRemoveOneTrial(variables);

    //add & remove: to_many's
    setAddRemoveManyEvents(variables);
    setAddRemoveManyImages(variables);
    setAddRemoveManyObservations(variables);
    setAddRemoveManyObservationTreatments(variables);

    /*
      API Request: api.observationUnit.updateItem
    */
    let cancelableApiReq = makeCancelable(api.observationUnit.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.updateItem'}];
            newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}`, 'update'];
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
          newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.updateItem'}];
          newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}`, 'update'];
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
      .catch((err) => { //error: on api.observationUnit.updateItem
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
          newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.updateItem'}];
          newError.path=['ObservationUnits', `observationUnitDbId:${item.observationUnitDbId}`, 'update'];
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
      case 'events':
        eventsIdsToAdd.current.push(itemId);
        setEventsIdsToAddState([...eventsIdsToAdd.current]);
        break;
      case 'germplasm':
        germplasmIdsToAdd.current = [];
        germplasmIdsToAdd.current.push(itemId);
        setGermplasmIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        break;
      case 'images':
        imagesIdsToAdd.current.push(itemId);
        setImagesIdsToAddState([...imagesIdsToAdd.current]);
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
      case 'observationTreatments':
        observationTreatmentsIdsToAdd.current.push(itemId);
        setObservationTreatmentsIdsToAddState([...observationTreatmentsIdsToAdd.current]);
        break;
      case 'observationUnitPosition':
        observationUnitPositionIdsToAdd.current = [];
        observationUnitPositionIdsToAdd.current.push(itemId);
        setObservationUnitPositionIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        break;
      case 'program':
        programIdsToAdd.current = [];
        programIdsToAdd.current.push(itemId);
        setProgramIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: itemId});
        break;
      case 'study':
        studyIdsToAdd.current = [];
        studyIdsToAdd.current.push(itemId);
        setStudyIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
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
    if(associationKey === 'germplasm') {
      if(germplasmIdsToAdd.current.length > 0
      && germplasmIdsToAdd.current[0] === itemId) {
        germplasmIdsToAdd.current = [];
        setGermplasmIdsToAddState([]);
        handleSetValue(null, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: null});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'images') {
      for(let i=0; i<imagesIdsToAdd.current.length; ++i)
      {
        if(imagesIdsToAdd.current[i] === itemId) {
          imagesIdsToAdd.current.splice(i, 1);
          setImagesIdsToAddState([...imagesIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'images'
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
    if(associationKey === 'observationTreatments') {
      for(let i=0; i<observationTreatmentsIdsToAdd.current.length; ++i)
      {
        if(observationTreatmentsIdsToAdd.current[i] === itemId) {
          observationTreatmentsIdsToAdd.current.splice(i, 1);
          setObservationTreatmentsIdsToAddState([...observationTreatmentsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observationTreatments'
    if(associationKey === 'observationUnitPosition') {
      if(observationUnitPositionIdsToAdd.current.length > 0
      && observationUnitPositionIdsToAdd.current[0] === itemId) {
        observationUnitPositionIdsToAdd.current = [];
        setObservationUnitPositionIdsToAddState([]);
        handleSetValue(null, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: null});
      }
      return;
    }//end: case 'observationUnitPosition'
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
        case 'events':
  
        eventsIdsToRemove.current.push(itemId);
        setEventsIdsToRemoveState([...eventsIdsToRemove.current]);
        break;
        case 'germplasm':
          germplasmIdsToRemove.current = [];
          germplasmIdsToRemove.current.push(itemId);
          setGermplasmIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'germplasmDbId');
          setForeignKeys({...foreignKeys, germplasmDbId: null});
        break;
        case 'images':
  
        imagesIdsToRemove.current.push(itemId);
        setImagesIdsToRemoveState([...imagesIdsToRemove.current]);
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
        case 'observationTreatments':
  
        observationTreatmentsIdsToRemove.current.push(itemId);
        setObservationTreatmentsIdsToRemoveState([...observationTreatmentsIdsToRemove.current]);
        break;
        case 'observationUnitPosition':
          observationUnitPositionIdsToRemove.current = [];
          observationUnitPositionIdsToRemove.current.push(itemId);
          setObservationUnitPositionIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'observationUnitDbId');
          setForeignKeys({...foreignKeys, observationUnitDbId: null});
        break;
        case 'program':
          programIdsToRemove.current = [];
          programIdsToRemove.current.push(itemId);
          setProgramIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'programDbId');
          setForeignKeys({...foreignKeys, programDbId: null});
        break;
        case 'study':
          studyIdsToRemove.current = [];
          studyIdsToRemove.current.push(itemId);
          setStudyIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'studyDbId');
          setForeignKeys({...foreignKeys, studyDbId: null});
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
    if(associationKey === 'germplasm') {
      if(germplasmIdsToRemove.current.length > 0
      && germplasmIdsToRemove.current[0] === itemId) {
        germplasmIdsToRemove.current = [];
        setGermplasmIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'images') {
      for(let i=0; i<imagesIdsToRemove.current.length; ++i)
      {
        if(imagesIdsToRemove.current[i] === itemId) {
          imagesIdsToRemove.current.splice(i, 1);
          setImagesIdsToRemoveState([...imagesIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'images'
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
    if(associationKey === 'observationTreatments') {
      for(let i=0; i<observationTreatmentsIdsToRemove.current.length; ++i)
      {
        if(observationTreatmentsIdsToRemove.current[i] === itemId) {
          observationTreatmentsIdsToRemove.current.splice(i, 1);
          setObservationTreatmentsIdsToRemoveState([...observationTreatmentsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observationTreatments'
    if(associationKey === 'observationUnitPosition') {
      if(observationUnitPositionIdsToRemove.current.length > 0
      && observationUnitPositionIdsToRemove.current[0] === itemId) {
        observationUnitPositionIdsToRemove.current = [];
        setObservationUnitPositionIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
      }
      return;
    }//end: case 'observationUnitPosition'
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='ObservationUnitUpdatePanel-dialog' 
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
              id='ObservationUnitUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": ObservationUnit | observationUnitDbId: " + item.observationUnitDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observationUnit" }>
              <Fab
                id='ObservationUnitUpdatePanel-fabButton-save' 
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
            <ObservationUnitTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ObservationUnitAttributesPage
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
              <ObservationUnitAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                eventsIdsToAdd={eventsIdsToAddState}
                eventsIdsToRemove={eventsIdsToRemoveState}
                germplasmIdsToAdd={germplasmIdsToAddState}
                germplasmIdsToRemove={germplasmIdsToRemoveState}
                imagesIdsToAdd={imagesIdsToAddState}
                imagesIdsToRemove={imagesIdsToRemoveState}
                locationIdsToAdd={locationIdsToAddState}
                locationIdsToRemove={locationIdsToRemoveState}
                observationsIdsToAdd={observationsIdsToAddState}
                observationsIdsToRemove={observationsIdsToRemoveState}
                observationTreatmentsIdsToAdd={observationTreatmentsIdsToAddState}
                observationTreatmentsIdsToRemove={observationTreatmentsIdsToRemoveState}
                observationUnitPositionIdsToAdd={observationUnitPositionIdsToAddState}
                observationUnitPositionIdsToRemove={observationUnitPositionIdsToRemoveState}
                programIdsToAdd={programIdsToAddState}
                programIdsToRemove={programIdsToRemoveState}
                studyIdsToAdd={studyIdsToAddState}
                studyIdsToRemove={studyIdsToRemoveState}
                trialIdsToAdd={trialIdsToAddState}
                trialIdsToRemove={trialIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
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
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <ObservationUnitConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

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

    </Dialog>
  );
}
ObservationUnitUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
