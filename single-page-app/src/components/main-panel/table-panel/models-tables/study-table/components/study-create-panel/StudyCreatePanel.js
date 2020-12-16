import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import StudyTabsA from './components/StudyTabsA'
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
const StudyAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesStudy" */ './components/study-attributes-page/StudyAttributesPage'));
const StudyAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsStudy" */ './components/study-associations-page/StudyAssociationsPage'));
const StudyConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationStudy" */ './components/StudyConfirmationDialog'));
const ContactDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailContact" */ '../../../contact-table/components/contact-detail-panel/ContactDetailPanel'));
const EnvironmentParameterDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailEnvironmentParameter" */ '../../../environmentParameter-table/components/environmentParameter-detail-panel/EnvironmentParameterDetailPanel'));
const EventDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailEvent" */ '../../../event-table/components/event-detail-panel/EventDetailPanel'));
const LocationDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailLocation" */ '../../../location-table/components/location-detail-panel/LocationDetailPanel'));
const ObservationDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservation" */ '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'));
const ObservationUnitDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationUnit" */ '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'));
const SeasonDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailSeason" */ '../../../season-table/components/season-detail-panel/SeasonDetailPanel'));
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

export default function StudyCreatePanel(props) {
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

  const [contactsIdsToAddState, setContactsIdsToAddState] = useState([]);
  const contactsIdsToAdd = useRef([]);
  const [environmentParametersIdsToAddState, setEnvironmentParametersIdsToAddState] = useState([]);
  const environmentParametersIdsToAdd = useRef([]);
  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState([]);
  const locationIdsToAdd = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [seasonsIdsToAddState, setSeasonsIdsToAddState] = useState([]);
  const seasonsIdsToAdd = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);

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
    
    initialValues.studyDbId = null;
    initialValues.active = null;
    initialValues.commonCropName = null;
    initialValues.culturalPractices = null;
    initialValues.documentationURL = null;
    initialValues.endDate = null;
    initialValues.license = null;
    initialValues.observationUnitsDescription = null;
    initialValues.startDate = null;
    initialValues.studyDescription = null;
    initialValues.studyName = null;
    initialValues.studyType = null;
    initialValues.trialDbId = null;
    initialValues.locationDbId = null;
    initialValues.contactDbIds = null;
    initialValues.seasonDbIds = null;

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

    initialValueOkStates.studyDbId = 0;
    initialValueOkStates.active = 0;
    initialValueOkStates.commonCropName = 0;
    initialValueOkStates.culturalPractices = 0;
    initialValueOkStates.documentationURL = 0;
    initialValueOkStates.endDate = 0;
    initialValueOkStates.license = 0;
    initialValueOkStates.observationUnitsDescription = 0;
    initialValueOkStates.startDate = 0;
    initialValueOkStates.studyDescription = 0;
    initialValueOkStates.studyName = 0;
    initialValueOkStates.studyType = 0;
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

  function setAddLocation(variables) {
    if(locationIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addLocation = locationIdsToAdd.current[0];
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
    delete variables.trialDbId;
    delete variables.locationDbId;
    delete variables.contactDbIds;
    delete variables.seasonDbIds;

    //add: to_one's
    setAddLocation(variables);
    setAddTrial(variables);
    
    //add: to_many's
    variables.addContacts = [...contactsIdsToAdd.current];
    variables.addEnvironmentParameters = [...environmentParametersIdsToAdd.current];
    variables.addEvents = [...eventsIdsToAdd.current];
    variables.addObservations = [...observationsIdsToAdd.current];
    variables.addObservationUnits = [...observationUnitsIdsToAdd.current];
    variables.addSeasons = [...seasonsIdsToAdd.current];

    /*
      API Request: api.study.createItem
    */
    let api = await loadApi("study");
    let cancelableApiReq = makeCancelable(api.study.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
            newError.path=['Studies', 'add'];
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
          newError.path=['Studies', 'add'];
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
      .catch((err) => { //error: on api.study.createItem
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
          newError.path=['Studies', 'add'];
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
      case 'contacts':
        if(contactsIdsToAdd.current.indexOf(itemId) === -1) {
          contactsIdsToAdd.current.push(itemId);
          setContactsIdsToAddState(contactsIdsToAdd.current);
        }
        break;
      case 'environmentParameters':
        if(environmentParametersIdsToAdd.current.indexOf(itemId) === -1) {
          environmentParametersIdsToAdd.current.push(itemId);
          setEnvironmentParametersIdsToAddState(environmentParametersIdsToAdd.current);
        }
        break;
      case 'events':
        if(eventsIdsToAdd.current.indexOf(itemId) === -1) {
          eventsIdsToAdd.current.push(itemId);
          setEventsIdsToAddState(eventsIdsToAdd.current);
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
      case 'observationUnits':
        if(observationUnitsIdsToAdd.current.indexOf(itemId) === -1) {
          observationUnitsIdsToAdd.current.push(itemId);
          setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
        }
        break;
      case 'seasons':
        if(seasonsIdsToAdd.current.indexOf(itemId) === -1) {
          seasonsIdsToAdd.current.push(itemId);
          setSeasonsIdsToAddState(seasonsIdsToAdd.current);
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
    if(associationKey === 'contacts') {
      let iof = contactsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        contactsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'contacts'
    if(associationKey === 'environmentParameters') {
      let iof = environmentParametersIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        environmentParametersIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'environmentParameters'
    if(associationKey === 'events') {
      let iof = eventsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        eventsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'events'
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
    if(associationKey === 'observationUnits') {
      let iof = observationUnitsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationUnitsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'seasons') {
      let iof = seasonsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        seasonsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'seasons'
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
    
    <Dialog id='StudyCreatePanel-dialog'  
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
              id='StudyCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Study'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " study" }>
            <Fab
              id='StudyCreatePanel-fabButton-save' 
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
              <StudyTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <StudyAttributesPage
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
                <StudyAssociationsPage
                  hidden={tabsValue !== 1}
                  contactsIdsToAdd={contactsIdsToAddState}
                  environmentParametersIdsToAdd={environmentParametersIdsToAddState}
                  eventsIdsToAdd={eventsIdsToAddState}
                  locationIdsToAdd={locationIdsToAddState}
                  observationsIdsToAdd={observationsIdsToAddState}
                  observationUnitsIdsToAdd={observationUnitsIdsToAddState}
                  seasonsIdsToAdd={seasonsIdsToAddState}
                  trialIdsToAdd={trialIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleClickOnContactRow={handleClickOnContactRow}
                  handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
                  handleClickOnEventRow={handleClickOnEventRow}
                  handleClickOnLocationRow={handleClickOnLocationRow}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                  handleClickOnSeasonRow={handleClickOnSeasonRow}
                  handleClickOnTrialRow={handleClickOnTrialRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <StudyConfirmationDialog
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
        {/* Dialog: Contact Detail Panel */}
        {(contactDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ContactDetailPanel
              permissions={permissions}
              item={contactDetailItem}
              dialog={true}
              handleClose={handleContactDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: EnvironmentParameter Detail Panel */}
        {(environmentParameterDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <EnvironmentParameterDetailPanel
              permissions={permissions}
              item={environmentParameterDetailItem}
              dialog={true}
              handleClose={handleEnvironmentParameterDetailDialogClose}
            />
          </Suspense>
        )}
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
        {/* Dialog: Season Detail Panel */}
        {(seasonDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <SeasonDetailPanel
              permissions={permissions}
              item={seasonDetailItem}
              dialog={true}
              handleClose={handleSeasonDetailDialogClose}
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
StudyCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};