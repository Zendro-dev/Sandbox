import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
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
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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

export default function ObservationUnitCreatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    permissions,
    handleClose,
  } = props;

  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const [foreignKeys, setForeignKeys] = useState({});

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);

  const values = useRef(getInitialValues());
  const valuesOkRefs = useRef(getInitialValueOkStates());

  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState([]);
  const germplasmIdsToAdd = useRef([]);
  const [imagesIdsToAddState, setImagesIdsToAddState] = useState([]);
  const imagesIdsToAdd = useRef([]);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState([]);
  const locationIdsToAdd = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationTreatmentsIdsToAddState, setObservationTreatmentsIdsToAddState] = useState([]);
  const observationTreatmentsIdsToAdd = useRef([]);
  const [observationUnitPositionIdsToAddState, setObservationUnitPositionIdsToAddState] = useState([]);
  const observationUnitPositionIdsToAdd = useRef([]);
  const [observationUnitToEventsIdsToAddState, setObservationUnitToEventsIdsToAddState] = useState([]);
  const observationUnitToEventsIdsToAdd = useRef([]);
  const [programIdsToAddState, setProgramIdsToAddState] = useState([]);
  const programIdsToAdd = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);

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

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

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
    
    initialValues.germplasmDbId = null;
    initialValues.locationDbId = null;
    initialValues.observationLevel = null;
    initialValues.observationUnitName = null;
    initialValues.observationUnitPUI = null;
    initialValues.plantNumber = null;
    initialValues.plotNumber = null;
    initialValues.programDbId = null;
    initialValues.studyDbId = null;
    initialValues.trialDbId = null;
    initialValues.observationUnitDbId = null;

    return initialValues;
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
    initialValueOkStates.observationLevel = 0;
    initialValueOkStates.observationUnitName = 0;
    initialValueOkStates.observationUnitPUI = 0;
    initialValueOkStates.plantNumber = 0;
    initialValueOkStates.plotNumber = 0;
    initialValueOkStates.programDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
    initialValueOkStates.trialDbId = -2; //FK
    initialValueOkStates.observationUnitDbId = 0;

    return initialValueOkStates;
  }

  function areThereAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 1) {
        return true;
      }
    }
    return false;
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

  function setAddGermplasm(variables) {
    if(germplasmIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addGermplasm = germplasmIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddLocation(variables) {
    if(locationIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addLocation = locationIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddObservationUnitPosition(variables) {
    if(observationUnitPositionIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addObservationUnitPosition = observationUnitPositionIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddProgram(variables) {
    if(programIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addProgram = programIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddStudy(variables) {
    if(studyIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addStudy = studyIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddTrial(variables) {
    if(trialIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addTrial = trialIdsToAdd.current[0];
    } else {
      //do nothing
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

    //add: to_one's
    setAddGermplasm(variables);
    setAddLocation(variables);
    setAddObservationUnitPosition(variables);
    setAddProgram(variables);
    setAddStudy(variables);
    setAddTrial(variables);
    
    //add: to_many's
    variables.addImages = imagesIdsToAdd.current;
    variables.addObservations = observationsIdsToAdd.current;
    variables.addObservationTreatments = observationTreatmentsIdsToAdd.current;
    variables.addObservationUnitToEvents = observationUnitToEventsIdsToAdd.current;

    /*
      API Request: createItem
    */
    let cancelableApiReq = makeCancelable(api.observationUnit.createItem(graphqlServerUrl, variables));
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
            enqueueSnackbar( t('modelPanels.messages.msg6', "Record created successfully."), {
              variant: 'success',
              preventDuplicate: false,
              persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
            onClose(event, true, response.data.data.addObservationUnit);
          }
          return;

        } else { //error: bad response on createItem()
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
      .catch(({isCanceled, ...err}) => { //error: on createItem()
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
    if(areThereAcceptableFields()) {
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
    handleClose(event, status, newItem);
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
        if(germplasmIdsToAdd.current.indexOf(itemId) === -1) {
          germplasmIdsToAdd.current = [];
          germplasmIdsToAdd.current.push(itemId);
          setGermplasmIdsToAddState(germplasmIdsToAdd.current);
          handleSetValue(itemId, 1, 'germplasmDbId');
          setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        }
        break;
      case 'images':
        if(imagesIdsToAdd.current.indexOf(itemId) === -1) {
          imagesIdsToAdd.current.push(itemId);
          setImagesIdsToAddState(imagesIdsToAdd.current);
        }
        break;
      case 'location':
        if(locationIdsToAdd.current.indexOf(itemId) === -1) {
          locationIdsToAdd.current = [];
          locationIdsToAdd.current.push(itemId);
          setLocationIdsToAddState(locationIdsToAdd.current);
          handleSetValue(itemId, 1, 'locationDbId');
          setForeignKeys({...foreignKeys, locationDbId: itemId});
        }
        break;
      case 'observations':
        if(observationsIdsToAdd.current.indexOf(itemId) === -1) {
          observationsIdsToAdd.current.push(itemId);
          setObservationsIdsToAddState(observationsIdsToAdd.current);
        }
        break;
      case 'observationTreatments':
        if(observationTreatmentsIdsToAdd.current.indexOf(itemId) === -1) {
          observationTreatmentsIdsToAdd.current.push(itemId);
          setObservationTreatmentsIdsToAddState(observationTreatmentsIdsToAdd.current);
        }
        break;
      case 'observationUnitPosition':
        if(observationUnitPositionIdsToAdd.current.indexOf(itemId) === -1) {
          observationUnitPositionIdsToAdd.current = [];
          observationUnitPositionIdsToAdd.current.push(itemId);
          setObservationUnitPositionIdsToAddState(observationUnitPositionIdsToAdd.current);
        }
        break;
      case 'observationUnitToEvents':
        if(observationUnitToEventsIdsToAdd.current.indexOf(itemId) === -1) {
          observationUnitToEventsIdsToAdd.current.push(itemId);
          setObservationUnitToEventsIdsToAddState(observationUnitToEventsIdsToAdd.current);
        }
        break;
      case 'program':
        if(programIdsToAdd.current.indexOf(itemId) === -1) {
          programIdsToAdd.current = [];
          programIdsToAdd.current.push(itemId);
          setProgramIdsToAddState(programIdsToAdd.current);
          handleSetValue(itemId, 1, 'programDbId');
          setForeignKeys({...foreignKeys, programDbId: itemId});
        }
        break;
      case 'study':
        if(studyIdsToAdd.current.indexOf(itemId) === -1) {
          studyIdsToAdd.current = [];
          studyIdsToAdd.current.push(itemId);
          setStudyIdsToAddState(studyIdsToAdd.current);
          handleSetValue(itemId, 1, 'studyDbId');
          setForeignKeys({...foreignKeys, studyDbId: itemId});
        }
        break;
      case 'trial':
        if(trialIdsToAdd.current.indexOf(itemId) === -1) {
          trialIdsToAdd.current = [];
          trialIdsToAdd.current.push(itemId);
          setTrialIdsToAddState(trialIdsToAdd.current);
          handleSetValue(itemId, 1, 'trialDbId');
          setForeignKeys({...foreignKeys, trialDbId: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'germplasm') {
      if(germplasmIdsToAdd.current.length > 0) {
        germplasmIdsToAdd.current = [];
        setGermplasmIdsToAddState([]);
        handleSetValue(null, 0, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: null});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'images') {
      let iof = imagesIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        imagesIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'images'
    if(associationKey === 'location') {
      if(locationIdsToAdd.current.length > 0) {
        locationIdsToAdd.current = [];
        setLocationIdsToAddState([]);
        handleSetValue(null, 0, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: null});
      }
      return;
    }//end: case 'location'
    if(associationKey === 'observations') {
      let iof = observationsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationTreatments') {
      let iof = observationTreatmentsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationTreatmentsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observationTreatments'
    if(associationKey === 'observationUnitPosition') {
      observationUnitPositionIdsToAdd.current = [];
      setObservationUnitPositionIdsToAddState([]);
      return;
    }//end: case 'observationUnitPosition'
    if(associationKey === 'observationUnitToEvents') {
      let iof = observationUnitToEventsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationUnitToEventsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observationUnitToEvents'
    if(associationKey === 'program') {
      if(programIdsToAdd.current.length > 0) {
        programIdsToAdd.current = [];
        setProgramIdsToAddState([]);
        handleSetValue(null, 0, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: null});
      }
      return;
    }//end: case 'program'
    if(associationKey === 'study') {
      if(studyIdsToAdd.current.length > 0) {
        studyIdsToAdd.current = [];
        setStudyIdsToAddState([]);
        handleSetValue(null, 0, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: null});
      }
      return;
    }//end: case 'study'
    if(associationKey === 'trial') {
      if(trialIdsToAdd.current.length > 0) {
        trialIdsToAdd.current = [];
        setTrialIdsToAddState([]);
        handleSetValue(null, 0, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: null});
      }
      return;
    }//end: case 'trial'
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
      <CssBaseline />
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
            {t('modelPanels.new') + ' ObservationUnit'}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <ObservationUnitTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ObservationUnitAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <ObservationUnitAssociationsPage
              hidden={tabsValue !== 1}
              germplasmIdsToAdd={germplasmIdsToAddState}
              imagesIdsToAdd={imagesIdsToAddState}
              locationIdsToAdd={locationIdsToAddState}
              observationsIdsToAdd={observationsIdsToAddState}
              observationTreatmentsIdsToAdd={observationTreatmentsIdsToAddState}
              observationUnitPositionIdsToAdd={observationUnitPositionIdsToAddState}
              observationUnitToEventsIdsToAdd={observationUnitToEventsIdsToAddState}
              programIdsToAdd={programIdsToAddState}
              studyIdsToAdd={studyIdsToAddState}
              trialIdsToAdd={trialIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
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
ObservationUnitCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};