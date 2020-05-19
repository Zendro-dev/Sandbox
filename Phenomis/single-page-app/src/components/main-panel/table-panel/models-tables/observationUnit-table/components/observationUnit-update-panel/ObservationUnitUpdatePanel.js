import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ObservationUnitAttributesPage from './components/observationUnit-attributes-page/ObservationUnitAttributesPage'
import ObservationUnitAssociationsPage from './components/observationUnit-associations-page/ObservationUnitAssociationsPage'
import ObservationUnitTabsA from './components/ObservationUnitTabsA'
import ObservationUnitConfirmationDialog from './components/ObservationUnitConfirmationDialog'
import GermplasmDetailPanel from '../../../germplasm-table/components/germplasm-detail-panel/GermplasmDetailPanel'
import ImageDetailPanel from '../../../image-table/components/image-detail-panel/ImageDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationTreatmentDetailPanel from '../../../observationTreatment-table/components/observationTreatment-detail-panel/ObservationTreatmentDetailPanel'
import ObservationUnitPositionDetailPanel from '../../../observationUnitPosition-table/components/observationUnitPosition-detail-panel/ObservationUnitPositionDetailPanel'
import ObservationUnitToEventDetailPanel from '../../../observationUnit_to_event-table/components/observationUnit_to_event-detail-panel/ObservationUnit_to_eventDetailPanel'
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
  notiErrorActionText: {
    color: '#eba0a0',
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
  
  const germplasmIdsToAdd = useRef((item.germplasm&& item.germplasm.germplasmDbId) ? [item.germplasm.germplasmDbId] : []);
  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState((item.germplasm&& item.germplasm.germplasmDbId) ? [item.germplasm.germplasmDbId] : []);
  const [imagesIdsToAddState, setImagesIdsToAddState] = useState([]);
  const imagesIdsToAdd = useRef([]);
  const [imagesIdsToRemoveState, setImagesIdsToRemoveState] = useState([]);
  const imagesIdsToRemove = useRef([]);
  const locationIdsToAdd = useRef((item.location&& item.location.locationDbId) ? [item.location.locationDbId] : []);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState((item.location&& item.location.locationDbId) ? [item.location.locationDbId] : []);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationTreatmentsIdsToAddState, setObservationTreatmentsIdsToAddState] = useState([]);
  const observationTreatmentsIdsToAdd = useRef([]);
  const [observationTreatmentsIdsToRemoveState, setObservationTreatmentsIdsToRemoveState] = useState([]);
  const observationTreatmentsIdsToRemove = useRef([]);
  const observationUnitPositionIdsToAdd = useRef((item.observationUnitPosition&& item.observationUnitPosition.observationUnitPositionDbId) ? [item.observationUnitPosition.observationUnitPositionDbId] : []);
  const [observationUnitPositionIdsToAddState, setObservationUnitPositionIdsToAddState] = useState((item.observationUnitPosition&& item.observationUnitPosition.observationUnitPositionDbId) ? [item.observationUnitPosition.observationUnitPositionDbId] : []);
  const [observationUnitToEventsIdsToAddState, setObservationUnitToEventsIdsToAddState] = useState([]);
  const observationUnitToEventsIdsToAdd = useRef([]);
  const [observationUnitToEventsIdsToRemoveState, setObservationUnitToEventsIdsToRemoveState] = useState([]);
  const observationUnitToEventsIdsToRemove = useRef([]);
  const programIdsToAdd = useRef((item.program&& item.program.programDbId) ? [item.program.programDbId] : []);
  const [programIdsToAddState, setProgramIdsToAddState] = useState((item.program&& item.program.programDbId) ? [item.program.programDbId] : []);
  const studyIdsToAdd = useRef((item.study&& item.study.studyDbId) ? [item.study.studyDbId] : []);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState((item.study&& item.study.studyDbId) ? [item.study.studyDbId] : []);
  const trialIdsToAdd = useRef((item.trial&& item.trial.trialDbId) ? [item.trial.trialDbId] : []);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState((item.trial&& item.trial.trialDbId) ? [item.trial.trialDbId] : []);

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
  const [observationUnit_to_eventDetailDialogOpen, setObservationUnit_to_eventDetailDialogOpen] = useState(false);
  const [observationUnit_to_eventDetailItem, setObservationUnit_to_eventDetailItem] = useState(undefined);
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
    if (observationUnit_to_eventDetailItem !== undefined) {
      setObservationUnit_to_eventDetailDialogOpen(true);
    }
  }, [observationUnit_to_eventDetailItem]);
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

  function getInitialValues() {
    let initialValues = {};

    initialValues.germplasmDbId = item.germplasmDbId;
    initialValues.locationDbId = item.locationDbId;
    initialValues.observationLevel = item.observationLevel;
    initialValues.observationUnitName = item.observationUnitName;
    initialValues.observationUnitPUI = item.observationUnitPUI;
    initialValues.plantNumber = item.plantNumber;
    initialValues.plotNumber = item.plotNumber;
    initialValues.programDbId = item.programDbId;
    initialValues.studyDbId = item.studyDbId;
    initialValues.trialDbId = item.trialDbId;
    initialValues.observationUnitDbId = item.observationUnitDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.germplasmDbId = item.germplasmDbId;
    initialForeignKeys.locationDbId = item.locationDbId;
    initialForeignKeys.programDbId = item.programDbId;
    initialForeignKeys.studyDbId = item.studyDbId;
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

    initialValueOkStates.germplasmDbId = -2; //FK
    initialValueOkStates.locationDbId = -2; //FK
  initialValueOkStates.observationLevel = (item.observationLevel!==null ? 1 : 0);
  initialValueOkStates.observationUnitName = (item.observationUnitName!==null ? 1 : 0);
  initialValueOkStates.observationUnitPUI = (item.observationUnitPUI!==null ? 1 : 0);
  initialValueOkStates.plantNumber = (item.plantNumber!==null ? 1 : 0);
  initialValueOkStates.plotNumber = (item.plotNumber!==null ? 1 : 0);
    initialValueOkStates.programDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
    initialValueOkStates.trialDbId = -2; //FK
  initialValueOkStates.observationUnitDbId = (item.observationUnitDbId!==null ? 1 : 0);

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
    if(values.current.germplasmDbId !== item.germplasmDbId) { return true;}
    if(values.current.locationDbId !== item.locationDbId) { return true;}
    if(values.current.observationLevel !== item.observationLevel) { return true;}
    if(values.current.observationUnitName !== item.observationUnitName) { return true;}
    if(values.current.observationUnitPUI !== item.observationUnitPUI) { return true;}
    if(values.current.plantNumber !== item.plantNumber) { return true;}
    if(values.current.plotNumber !== item.plotNumber) { return true;}
    if(values.current.programDbId !== item.programDbId) { return true;}
    if(values.current.studyDbId !== item.studyDbId) { return true;}
    if(values.current.trialDbId !== item.trialDbId) { return true;}
    if(values.current.observationUnitDbId !== item.observationUnitDbId) { return true;}
    return false;
  }

  function setAddRemoveGermplasm(variables) {
    //data to notify changes
    changedAssociations.current.germplasm = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.germplasm&&item.germplasm.germplasmDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(germplasmIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.germplasm.germplasmDbId!== germplasmIdsToAdd.current[0]) {
          //set id to add
          variables.addGermplasm = germplasmIdsToAdd.current[0];
          
          changedAssociations.current.germplasm.added = true;
          changedAssociations.current.germplasm.idsAdded = germplasmIdsToAdd.current;
          changedAssociations.current.germplasm.removed = true;
          changedAssociations.current.germplasm.idsRemoved = [item.germplasm.germplasmDbId];
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
        variables.removeGermplasm = item.germplasm.germplasmDbId;
        
        changedAssociations.current.germplasm.removed = true;
        changedAssociations.current.germplasm.idsRemoved = [item.germplasm.germplasmDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(germplasmIdsToAdd.current.length>0) {
        //set id to add
        variables.addGermplasm = germplasmIdsToAdd.current[0];
        
        changedAssociations.current.germplasm.added = true;
        changedAssociations.current.germplasm.idsAdded = germplasmIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
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
  function setAddRemoveObservationUnitPosition(variables) {
    //data to notify changes
    changedAssociations.current.observationUnitPosition = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.observationUnitPosition&&item.observationUnitPosition.observationUnitPositionDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(observationUnitPositionIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.observationUnitPosition.observationUnitPositionDbId!== observationUnitPositionIdsToAdd.current[0]) {
          //set id to add
          variables.addObservationUnitPosition = observationUnitPositionIdsToAdd.current[0];
          
          changedAssociations.current.observationUnitPosition.added = true;
          changedAssociations.current.observationUnitPosition.idsAdded = observationUnitPositionIdsToAdd.current;
          changedAssociations.current.observationUnitPosition.removed = true;
          changedAssociations.current.observationUnitPosition.idsRemoved = [item.observationUnitPosition.observationUnitPositionDbId];
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
        variables.removeObservationUnitPosition = item.observationUnitPosition.observationUnitPositionDbId;
        
        changedAssociations.current.observationUnitPosition.removed = true;
        changedAssociations.current.observationUnitPosition.idsRemoved = [item.observationUnitPosition.observationUnitPositionDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(observationUnitPositionIdsToAdd.current.length>0) {
        //set id to add
        variables.addObservationUnitPosition = observationUnitPositionIdsToAdd.current[0];
        
        changedAssociations.current.observationUnitPosition.added = true;
        changedAssociations.current.observationUnitPosition.idsAdded = observationUnitPositionIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
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
  function setAddRemoveStudy(variables) {
    //data to notify changes
    changedAssociations.current.study = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.study&&item.study.studyDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(studyIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.study.studyDbId!== studyIdsToAdd.current[0]) {
          //set id to add
          variables.addStudy = studyIdsToAdd.current[0];
          
          changedAssociations.current.study.added = true;
          changedAssociations.current.study.idsAdded = studyIdsToAdd.current;
          changedAssociations.current.study.removed = true;
          changedAssociations.current.study.idsRemoved = [item.study.studyDbId];
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
        variables.removeStudy = item.study.studyDbId;
        
        changedAssociations.current.study.removed = true;
        changedAssociations.current.study.idsRemoved = [item.study.studyDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(studyIdsToAdd.current.length>0) {
        //set id to add
        variables.addStudy = studyIdsToAdd.current[0];
        
        changedAssociations.current.study.added = true;
        changedAssociations.current.study.idsAdded = studyIdsToAdd.current;
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
    delete variables.germplasmDbId;
    delete variables.locationDbId;
    delete variables.programDbId;
    delete variables.studyDbId;
    delete variables.trialDbId;

    //add & remove: to_one's
    setAddRemoveGermplasm(variables);
    setAddRemoveLocation(variables);
    setAddRemoveObservationUnitPosition(variables);
    setAddRemoveProgram(variables);
    setAddRemoveStudy(variables);
    setAddRemoveTrial(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.images = {added: false, removed: false};
    
    if(imagesIdsToAdd.current.length>0) {
      variables.addImages = imagesIdsToAdd.current;
      
      changedAssociations.current.images.added = true;
      changedAssociations.current.images.idsAdded = imagesIdsToAdd.current;
    }
    if(imagesIdsToRemove.current.length>0) {
      variables.removeImages = imagesIdsToRemove.current;
      
      changedAssociations.current.images.removed = true;
      changedAssociations.current.images.idsRemoved = imagesIdsToRemove.current;
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
    changedAssociations.current.observationTreatments = {added: false, removed: false};
    
    if(observationTreatmentsIdsToAdd.current.length>0) {
      variables.addObservationTreatments = observationTreatmentsIdsToAdd.current;
      
      changedAssociations.current.observationTreatments.added = true;
      changedAssociations.current.observationTreatments.idsAdded = observationTreatmentsIdsToAdd.current;
    }
    if(observationTreatmentsIdsToRemove.current.length>0) {
      variables.removeObservationTreatments = observationTreatmentsIdsToRemove.current;
      
      changedAssociations.current.observationTreatments.removed = true;
      changedAssociations.current.observationTreatments.idsRemoved = observationTreatmentsIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.observationUnitToEvents = {added: false, removed: false};
    
    if(observationUnitToEventsIdsToAdd.current.length>0) {
      variables.addObservationUnitToEvents = observationUnitToEventsIdsToAdd.current;
      
      changedAssociations.current.observationUnitToEvents.added = true;
      changedAssociations.current.observationUnitToEvents.idsAdded = observationUnitToEventsIdsToAdd.current;
    }
    if(observationUnitToEventsIdsToRemove.current.length>0) {
      variables.removeObservationUnitToEvents = observationUnitToEventsIdsToRemove.current;
      
      changedAssociations.current.observationUnitToEvents.removed = true;
      changedAssociations.current.observationUnitToEvents.idsRemoved = observationUnitToEventsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.observationUnit.updateItem(graphqlServerUrl, variables));
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
            onClose(event, true, response.data.data.updateObservationUnit);
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
      case 'germplasm':
        germplasmIdsToAdd.current = [];
        germplasmIdsToAdd.current.push(itemId);
        setGermplasmIdsToAddState(germplasmIdsToAdd.current);
        handleSetValue(itemId, 1, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        break;
      case 'images':
        imagesIdsToAdd.current.push(itemId);
        setImagesIdsToAddState(imagesIdsToAdd.current);
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
      case 'observationTreatments':
        observationTreatmentsIdsToAdd.current.push(itemId);
        setObservationTreatmentsIdsToAddState(observationTreatmentsIdsToAdd.current);
        break;
      case 'observationUnitPosition':
        observationUnitPositionIdsToAdd.current = [];
        observationUnitPositionIdsToAdd.current.push(itemId);
        setObservationUnitPositionIdsToAddState(observationUnitPositionIdsToAdd.current);
        break;
      case 'observationUnitToEvents':
        observationUnitToEventsIdsToAdd.current.push(itemId);
        setObservationUnitToEventsIdsToAddState(observationUnitToEventsIdsToAdd.current);
        break;
      case 'program':
        programIdsToAdd.current = [];
        programIdsToAdd.current.push(itemId);
        setProgramIdsToAddState(programIdsToAdd.current);
        handleSetValue(itemId, 1, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: itemId});
        break;
      case 'study':
        studyIdsToAdd.current = [];
        studyIdsToAdd.current.push(itemId);
        setStudyIdsToAddState(studyIdsToAdd.current);
        handleSetValue(itemId, 1, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
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
    if(associationKey === 'germplasm') {
      germplasmIdsToAdd.current = [];
      setGermplasmIdsToAddState([]);
      handleSetValue(null, 0, 'germplasmDbId');
      setForeignKeys({...foreignKeys, germplasmDbId: null});
      return;
    }//end: case 'germplasm'
    if(associationKey === 'images') {
      for(let i=0; i<imagesIdsToAdd.current.length; ++i)
      {
        if(imagesIdsToAdd.current[i] === itemId) {
          imagesIdsToAdd.current.splice(i, 1);
          setImagesIdsToAddState(imagesIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'images'
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
    if(associationKey === 'observationTreatments') {
      for(let i=0; i<observationTreatmentsIdsToAdd.current.length; ++i)
      {
        if(observationTreatmentsIdsToAdd.current[i] === itemId) {
          observationTreatmentsIdsToAdd.current.splice(i, 1);
          setObservationTreatmentsIdsToAddState(observationTreatmentsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observationTreatments'
    if(associationKey === 'observationUnitPosition') {
      observationUnitPositionIdsToAdd.current = [];
      setObservationUnitPositionIdsToAddState([]);
      return;
    }//end: case 'observationUnitPosition'
    if(associationKey === 'observationUnitToEvents') {
      for(let i=0; i<observationUnitToEventsIdsToAdd.current.length; ++i)
      {
        if(observationUnitToEventsIdsToAdd.current[i] === itemId) {
          observationUnitToEventsIdsToAdd.current.splice(i, 1);
          setObservationUnitToEventsIdsToAddState(observationUnitToEventsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observationUnitToEvents'
    if(associationKey === 'program') {
      programIdsToAdd.current = [];
      setProgramIdsToAddState([]);
      handleSetValue(null, 0, 'programDbId');
      setForeignKeys({...foreignKeys, programDbId: null});
      return;
    }//end: case 'program'
    if(associationKey === 'study') {
      studyIdsToAdd.current = [];
      setStudyIdsToAddState([]);
      handleSetValue(null, 0, 'studyDbId');
      setForeignKeys({...foreignKeys, studyDbId: null});
      return;
    }//end: case 'study'
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
      case 'images':
        imagesIdsToRemove.current.push(itemId);
        setImagesIdsToRemoveState(imagesIdsToRemove.current);
        break;
      case 'observations':
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState(observationsIdsToRemove.current);
        break;
      case 'observationTreatments':
        observationTreatmentsIdsToRemove.current.push(itemId);
        setObservationTreatmentsIdsToRemoveState(observationTreatmentsIdsToRemove.current);
        break;
      case 'observationUnitToEvents':
        observationUnitToEventsIdsToRemove.current.push(itemId);
        setObservationUnitToEventsIdsToRemoveState(observationUnitToEventsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'images') {
      for(let i=0; i<imagesIdsToRemove.current.length; ++i)
      {
        if(imagesIdsToRemove.current[i] === itemId) {
          imagesIdsToRemove.current.splice(i, 1);
          setImagesIdsToRemoveState(imagesIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'images'
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
    if(associationKey === 'observationTreatments') {
      for(let i=0; i<observationTreatmentsIdsToRemove.current.length; ++i)
      {
        if(observationTreatmentsIdsToRemove.current[i] === itemId) {
          observationTreatmentsIdsToRemove.current.splice(i, 1);
          setObservationTreatmentsIdsToRemoveState(observationTreatmentsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'observationTreatments'
    if(associationKey === 'observationUnitToEvents') {
      for(let i=0; i<observationUnitToEventsIdsToRemove.current.length; ++i)
      {
        if(observationUnitToEventsIdsToRemove.current[i] === itemId) {
          observationUnitToEventsIdsToRemove.current.splice(i, 1);
          setObservationUnitToEventsIdsToRemoveState(observationUnitToEventsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'observationUnitToEvents'
  }

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

  const handleClickOnObservationUnit_to_eventRow = (event, item) => {
    setObservationUnit_to_eventDetailItem(item);
  };

  const handleObservationUnit_to_eventDetailDialogClose = (event) => {
    delayedCloseObservationUnit_to_eventDetailPanel(event, 500);
  }

  const delayedCloseObservationUnit_to_eventDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationUnit_to_eventDetailDialogOpen(false);
        setObservationUnit_to_eventDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": ObservationUnit | observationUnitDbId: " + item.observationUnitDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observationUnit" }>
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
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <ObservationUnitAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              germplasmIdsToAdd={germplasmIdsToAddState}
              imagesIdsToAdd={imagesIdsToAddState}
              imagesIdsToRemove={imagesIdsToRemoveState}
              locationIdsToAdd={locationIdsToAddState}
              observationsIdsToAdd={observationsIdsToAddState}
              observationsIdsToRemove={observationsIdsToRemoveState}
              observationTreatmentsIdsToAdd={observationTreatmentsIdsToAddState}
              observationTreatmentsIdsToRemove={observationTreatmentsIdsToRemoveState}
              observationUnitPositionIdsToAdd={observationUnitPositionIdsToAddState}
              observationUnitToEventsIdsToAdd={observationUnitToEventsIdsToAddState}
              observationUnitToEventsIdsToRemove={observationUnitToEventsIdsToRemoveState}
              programIdsToAdd={programIdsToAddState}
              studyIdsToAdd={studyIdsToAddState}
              trialIdsToAdd={trialIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              handleClickOnImageRow={handleClickOnImageRow}
              handleClickOnLocationRow={handleClickOnLocationRow}
              handleClickOnObservationRow={handleClickOnObservationRow}
              handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
              handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
              handleClickOnObservationUnit_to_eventRow={handleClickOnObservationUnit_to_eventRow}
              handleClickOnProgramRow={handleClickOnProgramRow}
              handleClickOnStudyRow={handleClickOnStudyRow}
              handleClickOnTrialRow={handleClickOnTrialRow}
            />
          </Grid>
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
        {/* Dialog: ObservationUnit_to_event Detail Panel */}
        {(observationUnit_to_eventDetailDialogOpen) && (
          <ObservationUnitToEventDetailPanel
            permissions={permissions}
            item={observationUnit_to_eventDetailItem}
            dialog={true}
            handleClose={handleObservationUnit_to_eventDetailDialogClose}
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
