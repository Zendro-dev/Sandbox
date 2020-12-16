import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import ObservationTabsA from './components/ObservationTabsA'
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
const ObservationAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesObservation" */ './components/observation-attributes-page/ObservationAttributesPage'));
const ObservationAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsObservation" */ './components/observation-associations-page/ObservationAssociationsPage'));
const ObservationConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationObservation" */ './components/ObservationConfirmationDialog'));
const GermplasmDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailGermplasm" */ '../../../germplasm-table/components/germplasm-detail-panel/GermplasmDetailPanel'));
const ImageDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailImage" */ '../../../image-table/components/image-detail-panel/ImageDetailPanel'));
const ObservationUnitDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationUnit" */ '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'));
const ObservationVariableDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationVariable" */ '../../../observationVariable-table/components/observationVariable-detail-panel/ObservationVariableDetailPanel'));
const SeasonDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailSeason" */ '../../../season-table/components/season-detail-panel/SeasonDetailPanel'));
const StudyDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailStudy" */ '../../../study-table/components/study-detail-panel/StudyDetailPanel'));

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

export default function ObservationCreatePanel(props) {
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

  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState([]);
  const germplasmIdsToAdd = useRef([]);
  const [imageIdsToAddState, setImageIdsToAddState] = useState([]);
  const imageIdsToAdd = useRef([]);
  const [observationUnitIdsToAddState, setObservationUnitIdsToAddState] = useState([]);
  const observationUnitIdsToAdd = useRef([]);
  const [observationVariableIdsToAddState, setObservationVariableIdsToAddState] = useState([]);
  const observationVariableIdsToAdd = useRef([]);
  const [seasonIdsToAddState, setSeasonIdsToAddState] = useState([]);
  const seasonIdsToAdd = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);

  const [germplasmDetailDialogOpen, setGermplasmDetailDialogOpen] = useState(false);
  const [germplasmDetailItem, setGermplasmDetailItem] = useState(undefined);
  const [imageDetailDialogOpen, setImageDetailDialogOpen] = useState(false);
  const [imageDetailItem, setImageDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [observationVariableDetailDialogOpen, setObservationVariableDetailDialogOpen] = useState(false);
  const [observationVariableDetailItem, setObservationVariableDetailItem] = useState(undefined);
  const [seasonDetailDialogOpen, setSeasonDetailDialogOpen] = useState(false);
  const [seasonDetailItem, setSeasonDetailItem] = useState(undefined);
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
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);

  useEffect(() => {
    if (observationVariableDetailItem !== undefined) {
      setObservationVariableDetailDialogOpen(true);
    }
  }, [observationVariableDetailItem]);

  useEffect(() => {
    if (seasonDetailItem !== undefined) {
      setSeasonDetailDialogOpen(true);
    }
  }, [seasonDetailItem]);

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
    
    initialValues.collector = null;
    initialValues.germplasmDbId = null;
    initialValues.observationTimeStamp = null;
    initialValues.observationUnitDbId = null;
    initialValues.observationVariableDbId = null;
    initialValues.studyDbId = null;
    initialValues.uploadedBy = null;
    initialValues.value = null;
    initialValues.observationDbId = null;
    initialValues.seasonDbId = null;
    initialValues.imageDbId = null;

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

    initialValueOkStates.collector = 0;
    initialValueOkStates.germplasmDbId = -2; //FK
    initialValueOkStates.observationTimeStamp = 0;
    initialValueOkStates.observationUnitDbId = -2; //FK
    initialValueOkStates.observationVariableDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
    initialValueOkStates.uploadedBy = 0;
    initialValueOkStates.value = 0;
    initialValueOkStates.observationDbId = 0;
    initialValueOkStates.seasonDbId = -2; //FK
    initialValueOkStates.imageDbId = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.collector = {errors: []};
    _initialValueAjvStates.germplasmDbId = {errors: []}; //FK
    _initialValueAjvStates.observationTimeStamp = {errors: []};
    _initialValueAjvStates.observationUnitDbId = {errors: []}; //FK
    _initialValueAjvStates.observationVariableDbId = {errors: []}; //FK
    _initialValueAjvStates.studyDbId = {errors: []}; //FK
    _initialValueAjvStates.uploadedBy = {errors: []};
    _initialValueAjvStates.value = {errors: []};
    _initialValueAjvStates.observationDbId = {errors: []};
    _initialValueAjvStates.seasonDbId = {errors: []}; //FK
    _initialValueAjvStates.imageDbId = {errors: []}; //FK

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
  function setAddImage(variables) {
    if(imageIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addImage = imageIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddObservationUnit(variables) {
    if(observationUnitIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addObservationUnit = observationUnitIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddObservationVariable(variables) {
    if(observationVariableIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addObservationVariable = observationVariableIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddSeason(variables) {
    if(seasonIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addSeason = seasonIdsToAdd.current[0];
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
    delete variables.germplasmDbId;
    delete variables.observationUnitDbId;
    delete variables.observationVariableDbId;
    delete variables.studyDbId;
    delete variables.seasonDbId;
    delete variables.imageDbId;

    //add: to_one's
    setAddGermplasm(variables);
    setAddImage(variables);
    setAddObservationUnit(variables);
    setAddObservationVariable(variables);
    setAddSeason(variables);
    setAddStudy(variables);
    
    //add: to_many's

    /*
      API Request: api.observation.createItem
    */
    let api = await loadApi("observation");
    let cancelableApiReq = makeCancelable(api.observation.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.createItem'}];
            newError.path=['Observations', 'add'];
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
          newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.createItem'}];
          newError.path=['Observations', 'add'];
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
      .catch((err) => { //error: on api.observation.createItem
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
          newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.createItem'}];
          newError.path=['Observations', 'add'];
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
      case 'germplasm':
        if(germplasmIdsToAdd.current.indexOf(itemId) === -1) {
          germplasmIdsToAdd.current = [];
          germplasmIdsToAdd.current.push(itemId);
          setGermplasmIdsToAddState(germplasmIdsToAdd.current);
          handleSetValue(itemId, -2, 'germplasmDbId');
          setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        }
        break;
      case 'image':
        if(imageIdsToAdd.current.indexOf(itemId) === -1) {
          imageIdsToAdd.current = [];
          imageIdsToAdd.current.push(itemId);
          setImageIdsToAddState(imageIdsToAdd.current);
          handleSetValue(itemId, -2, 'imageDbId');
          setForeignKeys({...foreignKeys, imageDbId: itemId});
        }
        break;
      case 'observationUnit':
        if(observationUnitIdsToAdd.current.indexOf(itemId) === -1) {
          observationUnitIdsToAdd.current = [];
          observationUnitIdsToAdd.current.push(itemId);
          setObservationUnitIdsToAddState(observationUnitIdsToAdd.current);
          handleSetValue(itemId, -2, 'observationUnitDbId');
          setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        }
        break;
      case 'observationVariable':
        if(observationVariableIdsToAdd.current.indexOf(itemId) === -1) {
          observationVariableIdsToAdd.current = [];
          observationVariableIdsToAdd.current.push(itemId);
          setObservationVariableIdsToAddState(observationVariableIdsToAdd.current);
          handleSetValue(itemId, -2, 'observationVariableDbId');
          setForeignKeys({...foreignKeys, observationVariableDbId: itemId});
        }
        break;
      case 'season':
        if(seasonIdsToAdd.current.indexOf(itemId) === -1) {
          seasonIdsToAdd.current = [];
          seasonIdsToAdd.current.push(itemId);
          setSeasonIdsToAddState(seasonIdsToAdd.current);
          handleSetValue(itemId, -2, 'seasonDbId');
          setForeignKeys({...foreignKeys, seasonDbId: itemId});
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

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'germplasm') {
      if(germplasmIdsToAdd.current.length > 0) {
        germplasmIdsToAdd.current = [];
        setGermplasmIdsToAddState([]);
        handleSetValue(null, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: null});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'image') {
      if(imageIdsToAdd.current.length > 0) {
        imageIdsToAdd.current = [];
        setImageIdsToAddState([]);
        handleSetValue(null, -2, 'imageDbId');
        setForeignKeys({...foreignKeys, imageDbId: null});
      }
      return;
    }//end: case 'image'
    if(associationKey === 'observationUnit') {
      if(observationUnitIdsToAdd.current.length > 0) {
        observationUnitIdsToAdd.current = [];
        setObservationUnitIdsToAddState([]);
        handleSetValue(null, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: null});
      }
      return;
    }//end: case 'observationUnit'
    if(associationKey === 'observationVariable') {
      if(observationVariableIdsToAdd.current.length > 0) {
        observationVariableIdsToAdd.current = [];
        setObservationVariableIdsToAddState([]);
        handleSetValue(null, -2, 'observationVariableDbId');
        setForeignKeys({...foreignKeys, observationVariableDbId: null});
      }
      return;
    }//end: case 'observationVariable'
    if(associationKey === 'season') {
      if(seasonIdsToAdd.current.length > 0) {
        seasonIdsToAdd.current = [];
        setSeasonIdsToAddState([]);
        handleSetValue(null, -2, 'seasonDbId');
        setForeignKeys({...foreignKeys, seasonDbId: null});
      }
      return;
    }//end: case 'season'
    if(associationKey === 'study') {
      if(studyIdsToAdd.current.length > 0) {
        studyIdsToAdd.current = [];
        setStudyIdsToAddState([]);
        handleSetValue(null, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: null});
      }
      return;
    }//end: case 'study'
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
  const handleClickOnObservationVariableRow = (event, item) => {
    setObservationVariableDetailItem(item);
  };

  const handleObservationVariableDetailDialogClose = (event) => {
    delayedCloseObservationVariableDetailPanel(event, 500);
  }

  const delayedCloseObservationVariableDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationVariableDetailDialogOpen(false);
        setObservationVariableDetailItem(undefined);
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
    
    <Dialog id='ObservationCreatePanel-dialog'  
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
              id='ObservationCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Observation'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " observation" }>
            <Fab
              id='ObservationCreatePanel-fabButton-save' 
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
              <ObservationTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <ObservationAttributesPage
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
                <ObservationAssociationsPage
                  hidden={tabsValue !== 1}
                  germplasmIdsToAdd={germplasmIdsToAddState}
                  imageIdsToAdd={imageIdsToAddState}
                  observationUnitIdsToAdd={observationUnitIdsToAddState}
                  observationVariableIdsToAdd={observationVariableIdsToAddState}
                  seasonIdsToAdd={seasonIdsToAddState}
                  studyIdsToAdd={studyIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                  handleClickOnImageRow={handleClickOnImageRow}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                  handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
                  handleClickOnSeasonRow={handleClickOnSeasonRow}
                  handleClickOnStudyRow={handleClickOnStudyRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <ObservationConfirmationDialog
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
        {/* Dialog: ObservationVariable Detail Panel */}
        {(observationVariableDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ObservationVariableDetailPanel
              permissions={permissions}
              item={observationVariableDetailItem}
              dialog={true}
              handleClose={handleObservationVariableDetailDialogClose}
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
ObservationCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};