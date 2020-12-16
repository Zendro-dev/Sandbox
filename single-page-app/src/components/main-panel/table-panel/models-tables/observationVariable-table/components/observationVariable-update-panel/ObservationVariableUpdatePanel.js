import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import ObservationVariableTabsA from './components/ObservationVariableTabsA';
import { loadApi } from '../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../utils';
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
//lazy loading
const ObservationVariableAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-ObservationVariable" */ './components/observationVariable-attributes-page/ObservationVariableAttributesPage'));
const ObservationVariableAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-ObservationVariable" */ './components/observationVariable-associations-page/ObservationVariableAssociationsPage'));
const ObservationVariableConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-ObservationVariable" */ './components/ObservationVariableConfirmationDialog'));
const MethodDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Method" */ '../../../method-table/components/method-detail-panel/MethodDetailPanel'));
const ObservationDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Observation" */ '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'));
const OntologyReferenceDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-OntologyReference" */ '../../../ontologyReference-table/components/ontologyReference-detail-panel/OntologyReferenceDetailPanel'));
const ScaleDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Scale" */ '../../../scale-table/components/scale-detail-panel/ScaleDetailPanel'));
const TraitDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Trait" */ '../../../trait-table/components/trait-detail-panel/TraitDetailPanel'));

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

export default function ObservationVariableUpdatePanel(props) {
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
  
  const [methodIdsToAddState, setMethodIdsToAddState] = useState([]);
  const methodIdsToAdd = useRef([]);
  const [methodIdsToRemoveState, setMethodIdsToRemoveState] = useState([]);
  const methodIdsToRemove = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [ontologyReferenceIdsToAddState, setOntologyReferenceIdsToAddState] = useState([]);
  const ontologyReferenceIdsToAdd = useRef([]);
  const [ontologyReferenceIdsToRemoveState, setOntologyReferenceIdsToRemoveState] = useState([]);
  const ontologyReferenceIdsToRemove = useRef([]);
  const [scaleIdsToAddState, setScaleIdsToAddState] = useState([]);
  const scaleIdsToAdd = useRef([]);
  const [scaleIdsToRemoveState, setScaleIdsToRemoveState] = useState([]);
  const scaleIdsToRemove = useRef([]);
  const [traitIdsToAddState, setTraitIdsToAddState] = useState([]);
  const traitIdsToAdd = useRef([]);
  const [traitIdsToRemoveState, setTraitIdsToRemoveState] = useState([]);
  const traitIdsToRemove = useRef([]);

  const [methodDetailDialogOpen, setMethodDetailDialogOpen] = useState(false);
  const [methodDetailItem, setMethodDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [ontologyReferenceDetailDialogOpen, setOntologyReferenceDetailDialogOpen] = useState(false);
  const [ontologyReferenceDetailItem, setOntologyReferenceDetailItem] = useState(undefined);
  const [scaleDetailDialogOpen, setScaleDetailDialogOpen] = useState(false);
  const [scaleDetailItem, setScaleDetailItem] = useState(undefined);
  const [traitDetailDialogOpen, setTraitDetailDialogOpen] = useState(false);
  const [traitDetailItem, setTraitDetailItem] = useState(undefined);

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
      lastModelChanged.observationVariable&&
      lastModelChanged.observationVariable[String(item.observationVariableDbId)]) {

        //updated item
        if(lastModelChanged.observationVariable[String(item.observationVariableDbId)].op === "update"&&
            lastModelChanged.observationVariable[String(item.observationVariableDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.observationVariable[String(item.observationVariableDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.observationVariableDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (methodDetailItem !== undefined) {
      setMethodDetailDialogOpen(true);
    }
  }, [methodDetailItem]);
  useEffect(() => {
    if (observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);
  useEffect(() => {
    if (ontologyReferenceDetailItem !== undefined) {
      setOntologyReferenceDetailDialogOpen(true);
    }
  }, [ontologyReferenceDetailItem]);
  useEffect(() => {
    if (scaleDetailItem !== undefined) {
      setScaleDetailDialogOpen(true);
    }
  }, [scaleDetailItem]);
  useEffect(() => {
    if (traitDetailItem !== undefined) {
      setTraitDetailDialogOpen(true);
    }
  }, [traitDetailItem]);

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

    initialValues.commonCropName = item.commonCropName;
    initialValues.defaultValue = item.defaultValue;
    initialValues.documentationURL = item.documentationURL;
    initialValues.growthStage = item.growthStage;
    initialValues.institution = item.institution;
    initialValues.language = item.language;
    initialValues.scientist = item.scientist;
    initialValues.status = item.status;
    initialValues.submissionTimestamp = item.submissionTimestamp;
    initialValues.xref = item.xref;
    initialValues.observationVariableDbId = item.observationVariableDbId;
    initialValues.observationVariableName = item.observationVariableName;
    initialValues.methodDbId = item.methodDbId;
    initialValues.scaleDbId = item.scaleDbId;
    initialValues.traitDbId = item.traitDbId;
    initialValues.ontologyDbId = item.ontologyDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.methodDbId = item.methodDbId;
    initialForeignKeys.ontologyDbId = item.ontologyDbId;
    initialForeignKeys.scaleDbId = item.scaleDbId;
    initialForeignKeys.traitDbId = item.traitDbId;

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

  initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
  initialValueOkStates.defaultValue = (item.defaultValue!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.growthStage = (item.growthStage!==null ? 1 : 0);
  initialValueOkStates.institution = (item.institution!==null ? 1 : 0);
  initialValueOkStates.language = (item.language!==null ? 1 : 0);
  initialValueOkStates.scientist = (item.scientist!==null ? 1 : 0);
  initialValueOkStates.status = (item.status!==null ? 1 : 0);
  initialValueOkStates.submissionTimestamp = (item.submissionTimestamp!==null ? 1 : 0);
  initialValueOkStates.xref = (item.xref!==null ? 1 : 0);
  initialValueOkStates.observationVariableDbId = (item.observationVariableDbId!==null ? 1 : 0);
  initialValueOkStates.observationVariableName = (item.observationVariableName!==null ? 1 : 0);
    initialValueOkStates.methodDbId = -2; //FK
    initialValueOkStates.scaleDbId = -2; //FK
    initialValueOkStates.traitDbId = -2; //FK
    initialValueOkStates.ontologyDbId = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.commonCropName = {errors: []};
    _initialValueAjvStates.defaultValue = {errors: []};
    _initialValueAjvStates.documentationURL = {errors: []};
    _initialValueAjvStates.growthStage = {errors: []};
    _initialValueAjvStates.institution = {errors: []};
    _initialValueAjvStates.language = {errors: []};
    _initialValueAjvStates.scientist = {errors: []};
    _initialValueAjvStates.status = {errors: []};
    _initialValueAjvStates.submissionTimestamp = {errors: []};
    _initialValueAjvStates.xref = {errors: []};
    _initialValueAjvStates.observationVariableDbId = {errors: []};
    _initialValueAjvStates.observationVariableName = {errors: []};
    _initialValueAjvStates.methodDbId = {errors: []}; //FK
    _initialValueAjvStates.scaleDbId = {errors: []}; //FK
    _initialValueAjvStates.traitDbId = {errors: []}; //FK
    _initialValueAjvStates.ontologyDbId = {errors: []}; //FK

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
    if(values.current.commonCropName !== item.commonCropName) { return true;}
    if(values.current.defaultValue !== item.defaultValue) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if(values.current.growthStage !== item.growthStage) { return true;}
    if(values.current.institution !== item.institution) { return true;}
    if(values.current.language !== item.language) { return true;}
    if(values.current.scientist !== item.scientist) { return true;}
    if(values.current.status !== item.status) { return true;}
    if((values.current.submissionTimestamp === null || item.submissionTimestamp === null) && item.submissionTimestamp !== values.current.submissionTimestamp) { return true; }
    if(values.current.submissionTimestamp !== null && item.submissionTimestamp !== null && !moment(values.current.submissionTimestamp).isSame(item.submissionTimestamp)) { return true; }
    if(values.current.xref !== item.xref) { return true;}
    if(values.current.observationVariableDbId !== item.observationVariableDbId) { return true;}
    if(values.current.observationVariableName !== item.observationVariableName) { return true;}
    if(values.current.methodDbId !== item.methodDbId) { return true;}
    if(values.current.scaleDbId !== item.scaleDbId) { return true;}
    if(values.current.traitDbId !== item.traitDbId) { return true;}
    if(values.current.ontologyDbId !== item.ontologyDbId) { return true;}
    return false;
  }

  function setAddRemoveOneMethod(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationVariable_methodDbId) changedAssociations.current.observationVariable_methodDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(methodIdsToAdd.current.length>0) {
      //set id to add
      variables.addMethod = methodIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationVariable_methodDbId.added = true;
      changedAssociations.current.observationVariable_methodDbId.idsAdded = [methodIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(methodIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeMethod = methodIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationVariable_methodDbId.removed = true;
      changedAssociations.current.observationVariable_methodDbId.idsRemoved = [methodIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneOntologyReference(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationVariable_ontologyDbId) changedAssociations.current.observationVariable_ontologyDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(ontologyReferenceIdsToAdd.current.length>0) {
      //set id to add
      variables.addOntologyReference = ontologyReferenceIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationVariable_ontologyDbId.added = true;
      changedAssociations.current.observationVariable_ontologyDbId.idsAdded = [ontologyReferenceIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(ontologyReferenceIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeOntologyReference = ontologyReferenceIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationVariable_ontologyDbId.removed = true;
      changedAssociations.current.observationVariable_ontologyDbId.idsRemoved = [ontologyReferenceIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneScale(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationVariable_scaleDbId) changedAssociations.current.observationVariable_scaleDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(scaleIdsToAdd.current.length>0) {
      //set id to add
      variables.addScale = scaleIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationVariable_scaleDbId.added = true;
      changedAssociations.current.observationVariable_scaleDbId.idsAdded = [scaleIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(scaleIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeScale = scaleIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationVariable_scaleDbId.removed = true;
      changedAssociations.current.observationVariable_scaleDbId.idsRemoved = [scaleIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneTrait(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationVariable_traitDbId) changedAssociations.current.observationVariable_traitDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(traitIdsToAdd.current.length>0) {
      //set id to add
      variables.addTrait = traitIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observationVariable_traitDbId.added = true;
      changedAssociations.current.observationVariable_traitDbId.idsAdded = [traitIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(traitIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeTrait = traitIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observationVariable_traitDbId.removed = true;
      changedAssociations.current.observationVariable_traitDbId.idsRemoved = [traitIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyObservations(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_observationVariableDbId) changedAssociations.current.observation_observationVariableDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservations = [ ...observationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observation_observationVariableDbId.added = true;
      if(changedAssociations.current.observation_observationVariableDbId.idsAdded){
        observationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observation_observationVariableDbId.idsAdded.includes(it)) changedAssociations.current.observation_observationVariableDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observation_observationVariableDbId.idsAdded = [...observationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservations = [ ...observationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observation_observationVariableDbId.removed = true;
      if(changedAssociations.current.observation_observationVariableDbId.idsRemoved){
        observationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observation_observationVariableDbId.idsRemoved.includes(it)) changedAssociations.current.observation_observationVariableDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observation_observationVariableDbId.idsRemoved = [...observationsIdsToRemove.current];
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
    
    delete variables.methodDbId; //FK
    delete variables.scaleDbId; //FK
    delete variables.traitDbId; //FK
    delete variables.ontologyDbId; //FK

    //add & remove: to_one's
    setAddRemoveOneMethod(variables);
    setAddRemoveOneOntologyReference(variables);
    setAddRemoveOneScale(variables);
    setAddRemoveOneTrait(variables);

    //add & remove: to_many's
    setAddRemoveManyObservations(variables);

    /*
      API Request: api.observationVariable.updateItem
    */
    let api = await loadApi("observationVariable");
    let cancelableApiReq = makeCancelable(api.observationVariable.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observationVariable', method: 'doSave()', request: 'api.observationVariable.updateItem'}];
            newError.path=['ObservationVariables', `observationVariableDbId:${item.observationVariableDbId}`, 'update'];
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
          newError.locations=[{model: 'observationVariable', method: 'doSave()', request: 'api.observationVariable.updateItem'}];
          newError.path=['ObservationVariables', `observationVariableDbId:${item.observationVariableDbId}`, 'update'];
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
      .catch((err) => { //error: on api.observationVariable.updateItem
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
          newError.locations=[{model: 'observationVariable', method: 'doSave()', request: 'api.observationVariable.updateItem'}];
          newError.path=['ObservationVariables', `observationVariableDbId:${item.observationVariableDbId}`, 'update'];
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
      case 'method':
        methodIdsToAdd.current = [];
        methodIdsToAdd.current.push(itemId);
        setMethodIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'methodDbId');
        setForeignKeys({...foreignKeys, methodDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState([...observationsIdsToAdd.current]);
        break;
      case 'ontologyReference':
        ontologyReferenceIdsToAdd.current = [];
        ontologyReferenceIdsToAdd.current.push(itemId);
        setOntologyReferenceIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'ontologyDbId');
        setForeignKeys({...foreignKeys, ontologyDbId: itemId});
        break;
      case 'scale':
        scaleIdsToAdd.current = [];
        scaleIdsToAdd.current.push(itemId);
        setScaleIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'scaleDbId');
        setForeignKeys({...foreignKeys, scaleDbId: itemId});
        break;
      case 'trait':
        traitIdsToAdd.current = [];
        traitIdsToAdd.current.push(itemId);
        setTraitIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'traitDbId');
        setForeignKeys({...foreignKeys, traitDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'method') {
      if(methodIdsToAdd.current.length > 0
      && methodIdsToAdd.current[0] === itemId) {
        methodIdsToAdd.current = [];
        setMethodIdsToAddState([]);
        handleSetValue(null, -2, 'methodDbId');
        setForeignKeys({...foreignKeys, methodDbId: null});
      }
      return;
    }//end: case 'method'
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
    if(associationKey === 'ontologyReference') {
      if(ontologyReferenceIdsToAdd.current.length > 0
      && ontologyReferenceIdsToAdd.current[0] === itemId) {
        ontologyReferenceIdsToAdd.current = [];
        setOntologyReferenceIdsToAddState([]);
        handleSetValue(null, -2, 'ontologyDbId');
        setForeignKeys({...foreignKeys, ontologyDbId: null});
      }
      return;
    }//end: case 'ontologyReference'
    if(associationKey === 'scale') {
      if(scaleIdsToAdd.current.length > 0
      && scaleIdsToAdd.current[0] === itemId) {
        scaleIdsToAdd.current = [];
        setScaleIdsToAddState([]);
        handleSetValue(null, -2, 'scaleDbId');
        setForeignKeys({...foreignKeys, scaleDbId: null});
      }
      return;
    }//end: case 'scale'
    if(associationKey === 'trait') {
      if(traitIdsToAdd.current.length > 0
      && traitIdsToAdd.current[0] === itemId) {
        traitIdsToAdd.current = [];
        setTraitIdsToAddState([]);
        handleSetValue(null, -2, 'traitDbId');
        setForeignKeys({...foreignKeys, traitDbId: null});
      }
      return;
    }//end: case 'trait'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'method':
          methodIdsToRemove.current = [];
          methodIdsToRemove.current.push(itemId);
          setMethodIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'methodDbId');
          setForeignKeys({...foreignKeys, methodDbId: null});
        break;
        case 'observations':
  
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
        break;
        case 'ontologyReference':
          ontologyReferenceIdsToRemove.current = [];
          ontologyReferenceIdsToRemove.current.push(itemId);
          setOntologyReferenceIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'ontologyDbId');
          setForeignKeys({...foreignKeys, ontologyDbId: null});
        break;
        case 'scale':
          scaleIdsToRemove.current = [];
          scaleIdsToRemove.current.push(itemId);
          setScaleIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'scaleDbId');
          setForeignKeys({...foreignKeys, scaleDbId: null});
        break;
        case 'trait':
          traitIdsToRemove.current = [];
          traitIdsToRemove.current.push(itemId);
          setTraitIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'traitDbId');
          setForeignKeys({...foreignKeys, traitDbId: null});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'method') {
      if(methodIdsToRemove.current.length > 0
      && methodIdsToRemove.current[0] === itemId) {
        methodIdsToRemove.current = [];
        setMethodIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'methodDbId');
        setForeignKeys({...foreignKeys, methodDbId: itemId});
      }
      return;
    }//end: case 'method'
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
    if(associationKey === 'ontologyReference') {
      if(ontologyReferenceIdsToRemove.current.length > 0
      && ontologyReferenceIdsToRemove.current[0] === itemId) {
        ontologyReferenceIdsToRemove.current = [];
        setOntologyReferenceIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'ontologyDbId');
        setForeignKeys({...foreignKeys, ontologyDbId: itemId});
      }
      return;
    }//end: case 'ontologyReference'
    if(associationKey === 'scale') {
      if(scaleIdsToRemove.current.length > 0
      && scaleIdsToRemove.current[0] === itemId) {
        scaleIdsToRemove.current = [];
        setScaleIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'scaleDbId');
        setForeignKeys({...foreignKeys, scaleDbId: itemId});
      }
      return;
    }//end: case 'scale'
    if(associationKey === 'trait') {
      if(traitIdsToRemove.current.length > 0
      && traitIdsToRemove.current[0] === itemId) {
        traitIdsToRemove.current = [];
        setTraitIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'traitDbId');
        setForeignKeys({...foreignKeys, traitDbId: itemId});
      }
      return;
    }//end: case 'trait'
  }

  const handleClickOnMethodRow = (event, item) => {
    setMethodDetailItem(item);
  };

  const handleMethodDetailDialogClose = (event) => {
    delayedCloseMethodDetailPanel(event, 500);
  }

  const delayedCloseMethodDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMethodDetailDialogOpen(false);
        setMethodDetailItem(undefined);
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

  const handleClickOnOntologyReferenceRow = (event, item) => {
    setOntologyReferenceDetailItem(item);
  };

  const handleOntologyReferenceDetailDialogClose = (event) => {
    delayedCloseOntologyReferenceDetailPanel(event, 500);
  }

  const delayedCloseOntologyReferenceDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setOntologyReferenceDetailDialogOpen(false);
        setOntologyReferenceDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnScaleRow = (event, item) => {
    setScaleDetailItem(item);
  };

  const handleScaleDetailDialogClose = (event) => {
    delayedCloseScaleDetailPanel(event, 500);
  }

  const delayedCloseScaleDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setScaleDetailDialogOpen(false);
        setScaleDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnTraitRow = (event, item) => {
    setTraitDetailItem(item);
  };

  const handleTraitDetailDialogClose = (event) => {
    delayedCloseTraitDetailPanel(event, 500);
  }

  const delayedCloseTraitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTraitDetailDialogOpen(false);
        setTraitDetailItem(undefined);
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
    <Dialog id='ObservationVariableUpdatePanel-dialog' 
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
              id='ObservationVariableUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": ObservationVariable | observationVariableDbId: " + item.observationVariableDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observationVariable" }>
              <Fab
                id='ObservationVariableUpdatePanel-fabButton-save' 
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
            <ObservationVariableTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <ObservationVariableAttributesPage
                hidden={tabsValue !== 0}
                item={item}
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
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <Suspense fallback={<div />}>
                <ObservationVariableAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  methodIdsToAdd={methodIdsToAddState}
                  methodIdsToRemove={methodIdsToRemoveState}
                  observationsIdsToAdd={observationsIdsToAddState}
                  observationsIdsToRemove={observationsIdsToRemoveState}
                  ontologyReferenceIdsToAdd={ontologyReferenceIdsToAddState}
                  ontologyReferenceIdsToRemove={ontologyReferenceIdsToRemoveState}
                  scaleIdsToAdd={scaleIdsToAddState}
                  scaleIdsToRemove={scaleIdsToRemoveState}
                  traitIdsToAdd={traitIdsToAddState}
                  traitIdsToRemove={traitIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                  handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                  handleClickOnTraitRow={handleClickOnTraitRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <ObservationVariableConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

        {/* Dialog: Method Detail Panel */}
        {(methodDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <MethodDetailPanel
              permissions={permissions}
              item={methodDetailItem}
              dialog={true}
              handleClose={handleMethodDetailDialogClose}
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
        {/* Dialog: OntologyReference Detail Panel */}
        {(ontologyReferenceDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <OntologyReferenceDetailPanel
              permissions={permissions}
              item={ontologyReferenceDetailItem}
              dialog={true}
              handleClose={handleOntologyReferenceDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Scale Detail Panel */}
        {(scaleDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ScaleDetailPanel
              permissions={permissions}
              item={scaleDetailItem}
              dialog={true}
              handleClose={handleScaleDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Trait Detail Panel */}
        {(traitDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <TraitDetailPanel
              permissions={permissions}
              item={traitDetailItem}
              dialog={true}
              handleClose={handleTraitDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
ObservationVariableUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
