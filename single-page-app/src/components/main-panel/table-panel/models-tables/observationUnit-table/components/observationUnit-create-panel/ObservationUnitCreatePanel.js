import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import ObservationUnitTabsA from './components/ObservationUnitTabsA'
import { loadApi } from '../../../../../../../requests/requests.index.js'
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
//lazy loading
const ObservationUnitAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesObservationUnit" */ './components/observationUnit-attributes-page/ObservationUnitAttributesPage'));
const ObservationUnitAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsObservationUnit" */ './components/observationUnit-associations-page/ObservationUnitAssociationsPage'));
const ObservationUnitConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationObservationUnit" */ './components/ObservationUnitConfirmationDialog'));
const EventDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailEvent" */ '../../../event-table/components/event-detail-panel/EventDetailPanel'));
const GermplasmDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailGermplasm" */ '../../../germplasm-table/components/germplasm-detail-panel/GermplasmDetailPanel'));
const ImageDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailImage" */ '../../../image-table/components/image-detail-panel/ImageDetailPanel'));
const LocationDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailLocation" */ '../../../location-table/components/location-detail-panel/LocationDetailPanel'));
const ObservationDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservation" */ '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'));
const ObservationTreatmentDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationTreatment" */ '../../../observationTreatment-table/components/observationTreatment-detail-panel/ObservationTreatmentDetailPanel'));
const ObservationUnitPositionDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationUnitPosition" */ '../../../observationUnitPosition-table/components/observationUnitPosition-detail-panel/ObservationUnitPositionDetailPanel'));
const ProgramDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailProgram" */ '../../../program-table/components/program-detail-panel/ProgramDetailPanel'));
const StudyDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailStudy" */ '../../../study-table/components/study-detail-panel/StudyDetailPanel'));
const TrialDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailTrial" */ '../../../trial-table/components/trial-detail-panel/TrialDetailPanel'));

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
  const [valueAjvStates, setValueAjvStates] = useState(getInitialValueAjvStates());
  const [foreignKeys, setForeignKeys] = useState({});
  Boolean(setForeignKeys); //avoids 'unused' warning

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

  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
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
  const [programIdsToAddState, setProgramIdsToAddState] = useState([]);
  const programIdsToAdd = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);

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

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

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
    
    initialValues.observationLevel = null;
    initialValues.observationUnitName = null;
    initialValues.observationUnitPUI = null;
    initialValues.plantNumber = null;
    initialValues.plotNumber = null;
    initialValues.programDbId = null;
    initialValues.studyDbId = null;
    initialValues.trialDbId = null;
    initialValues.observationUnitDbId = null;
    initialValues.germplasmDbId = null;
    initialValues.locationDbId = null;
    initialValues.eventDbIds = null;

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

    initialValueOkStates.observationLevel = 0;
    initialValueOkStates.observationUnitName = 0;
    initialValueOkStates.observationUnitPUI = 0;
    initialValueOkStates.plantNumber = 0;
    initialValueOkStates.plotNumber = 0;
    initialValueOkStates.programDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
    initialValueOkStates.trialDbId = -2; //FK
    initialValueOkStates.observationUnitDbId = 0;
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
    * Add new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item added.
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
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's
    delete variables.programDbId;
    delete variables.studyDbId;
    delete variables.trialDbId;
    delete variables.germplasmDbId;
    delete variables.locationDbId;
    delete variables.eventDbIds;

    //add: to_one's
    setAddGermplasm(variables);
    setAddLocation(variables);
    setAddObservationUnitPosition(variables);
    setAddProgram(variables);
    setAddStudy(variables);
    setAddTrial(variables);
    
    //add: to_many's
    variables.addEvents = [...eventsIdsToAdd.current];
    variables.addImages = [...imagesIdsToAdd.current];
    variables.addObservations = [...observationsIdsToAdd.current];
    variables.addObservationTreatments = [...observationTreatmentsIdsToAdd.current];

    /*
      API Request: api.observationUnit.createItem
    */
    let api = await loadApi("observationUnit");
    let cancelableApiReq = makeCancelable(api.observationUnit.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.createItem'}];
            newError.path=['ObservationUnits', 'add'];
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
          newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.createItem'}];
          newError.path=['ObservationUnits', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
 
          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

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
        onClose(event, true, response.value);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.observationUnit.createItem
        if(err.isCanceled) {
          return
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationUnit', method: 'doSave()', request: 'api.observationUnit.createItem'}];
          newError.path=['ObservationUnits', 'add'];
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
      case 'events':
        if(eventsIdsToAdd.current.indexOf(itemId) === -1) {
          eventsIdsToAdd.current.push(itemId);
          setEventsIdsToAddState(eventsIdsToAdd.current);
        }
        break;
      case 'germplasm':
        if(germplasmIdsToAdd.current.indexOf(itemId) === -1) {
          germplasmIdsToAdd.current = [];
          germplasmIdsToAdd.current.push(itemId);
          setGermplasmIdsToAddState(germplasmIdsToAdd.current);
          handleSetValue(itemId, -2, 'germplasmDbId');
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
          handleSetValue(itemId, -2, 'locationDbId');
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
          handleSetValue(itemId, -2, 'observationUnitDbId');
          setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        }
        break;
      case 'program':
        if(programIdsToAdd.current.indexOf(itemId) === -1) {
          programIdsToAdd.current = [];
          programIdsToAdd.current.push(itemId);
          setProgramIdsToAddState(programIdsToAdd.current);
          handleSetValue(itemId, -2, 'programDbId');
          setForeignKeys({...foreignKeys, programDbId: itemId});
        }
        break;
      case 'study':
        if(studyIdsToAdd.current.indexOf(itemId) === -1) {
          studyIdsToAdd.current = [];
          studyIdsToAdd.current.push(itemId);
          setStudyIdsToAddState(studyIdsToAdd.current);
          handleSetValue(itemId, -2, 'studyDbId');
          setForeignKeys({...foreignKeys, studyDbId: itemId});
        }
        break;
      case 'trial':
        if(trialIdsToAdd.current.indexOf(itemId) === -1) {
          trialIdsToAdd.current = [];
          trialIdsToAdd.current.push(itemId);
          setTrialIdsToAddState(trialIdsToAdd.current);
          handleSetValue(itemId, -2, 'trialDbId');
          setForeignKeys({...foreignKeys, trialDbId: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'events') {
      let iof = eventsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        eventsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'events'
    if(associationKey === 'germplasm') {
      if(germplasmIdsToAdd.current.length > 0) {
        germplasmIdsToAdd.current = [];
        setGermplasmIdsToAddState([]);
        handleSetValue(null, -2, 'germplasmDbId');
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
        handleSetValue(null, -2, 'locationDbId');
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
      if(observationUnitPositionIdsToAdd.current.length > 0) {
        observationUnitPositionIdsToAdd.current = [];
        setObservationUnitPositionIdsToAddState([]);
        handleSetValue(null, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: null});
      }
      return;
    }//end: case 'observationUnitPosition'
    if(associationKey === 'program') {
      if(programIdsToAdd.current.length > 0) {
        programIdsToAdd.current = [];
        setProgramIdsToAddState([]);
        handleSetValue(null, -2, 'programDbId');
        setForeignKeys({...foreignKeys, programDbId: null});
      }
      return;
    }//end: case 'program'
    if(associationKey === 'study') {
      if(studyIdsToAdd.current.length > 0) {
        studyIdsToAdd.current = [];
        setStudyIdsToAddState([]);
        handleSetValue(null, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: null});
      }
      return;
    }//end: case 'study'
    if(associationKey === 'trial') {
      if(trialIdsToAdd.current.length > 0) {
        trialIdsToAdd.current = [];
        setTrialIdsToAddState([]);
        handleSetValue(null, -2, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: null});
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
    
    <Dialog id='ObservationUnitCreatePanel-dialog'  
      fullScreen open={open} TransitionComponent={Transition}
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
              id='ObservationUnitCreatePanel-button-cancel'
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
              id='ObservationUnitCreatePanel-fabButton-save' 
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
            <Suspense fallback={<div />}>
              <ObservationUnitAttributesPage
                hidden={tabsValue !== 0}
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
          {(tabsValue === 1) && (
            <Grid item xs={12}>
              <Suspense fallback={<div />}>
                {/* Associations Page [1] */}
                <ObservationUnitAssociationsPage
                  hidden={tabsValue !== 1}
                  eventsIdsToAdd={eventsIdsToAddState}
                  germplasmIdsToAdd={germplasmIdsToAddState}
                  imagesIdsToAdd={imagesIdsToAddState}
                  locationIdsToAdd={locationIdsToAddState}
                  observationsIdsToAdd={observationsIdsToAddState}
                  observationTreatmentsIdsToAdd={observationTreatmentsIdsToAddState}
                  observationUnitPositionIdsToAdd={observationUnitPositionIdsToAddState}
                  programIdsToAdd={programIdsToAddState}
                  studyIdsToAdd={studyIdsToAddState}
                  trialIdsToAdd={trialIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
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
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <ObservationUnitConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

        {/* Detail Panels */}
        {/* Dialog: Event Detail Panel */}
        {(eventDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <EventDetailPanel
              permissions={permissions}
              item={eventDetailItem}
              dialog={true}
              handleClose={handleEventDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Germplasm Detail Panel */}
        {(germplasmDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <GermplasmDetailPanel
              permissions={permissions}
              item={germplasmDetailItem}
              dialog={true}
              handleClose={handleGermplasmDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Image Detail Panel */}
        {(imageDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ImageDetailPanel
              permissions={permissions}
              item={imageDetailItem}
              dialog={true}
              handleClose={handleImageDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Location Detail Panel */}
        {(locationDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <LocationDetailPanel
              permissions={permissions}
              item={locationDetailItem}
              dialog={true}
              handleClose={handleLocationDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Observation Detail Panel */}
        {(observationDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ObservationDetailPanel
              permissions={permissions}
              item={observationDetailItem}
              dialog={true}
              handleClose={handleObservationDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: ObservationTreatment Detail Panel */}
        {(observationTreatmentDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ObservationTreatmentDetailPanel
              permissions={permissions}
              item={observationTreatmentDetailItem}
              dialog={true}
              handleClose={handleObservationTreatmentDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: ObservationUnitPosition Detail Panel */}
        {(observationUnitPositionDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ObservationUnitPositionDetailPanel
              permissions={permissions}
              item={observationUnitPositionDetailItem}
              dialog={true}
              handleClose={handleObservationUnitPositionDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Program Detail Panel */}
        {(programDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ProgramDetailPanel
              permissions={permissions}
              item={programDetailItem}
              dialog={true}
              handleClose={handleProgramDetailDialogClose}
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
        {/* Dialog: Trial Detail Panel */}
        {(trialDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <TrialDetailPanel
              permissions={permissions}
              item={trialDetailItem}
              dialog={true}
              handleClose={handleTrialDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
ObservationUnitCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};