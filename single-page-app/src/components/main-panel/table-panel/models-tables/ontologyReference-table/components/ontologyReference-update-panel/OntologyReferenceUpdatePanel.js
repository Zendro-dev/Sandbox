import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import OntologyReferenceTabsA from './components/OntologyReferenceTabsA';
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
const OntologyReferenceAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-OntologyReference" */ './components/ontologyReference-attributes-page/OntologyReferenceAttributesPage'));
const OntologyReferenceAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-OntologyReference" */ './components/ontologyReference-associations-page/OntologyReferenceAssociationsPage'));
const OntologyReferenceConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-OntologyReference" */ './components/OntologyReferenceConfirmationDialog'));
const MethodDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Method" */ '../../../method-table/components/method-detail-panel/MethodDetailPanel'));
const ObservationVariableDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-ObservationVariable" */ '../../../observationVariable-table/components/observationVariable-detail-panel/ObservationVariableDetailPanel'));
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

export default function OntologyReferenceUpdatePanel(props) {
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
  
  const [methodsIdsToAddState, setMethodsIdsToAddState] = useState([]);
  const methodsIdsToAdd = useRef([]);
  const [methodsIdsToRemoveState, setMethodsIdsToRemoveState] = useState([]);
  const methodsIdsToRemove = useRef([]);
  const [observationVariablesIdsToAddState, setObservationVariablesIdsToAddState] = useState([]);
  const observationVariablesIdsToAdd = useRef([]);
  const [observationVariablesIdsToRemoveState, setObservationVariablesIdsToRemoveState] = useState([]);
  const observationVariablesIdsToRemove = useRef([]);
  const [scalesIdsToAddState, setScalesIdsToAddState] = useState([]);
  const scalesIdsToAdd = useRef([]);
  const [scalesIdsToRemoveState, setScalesIdsToRemoveState] = useState([]);
  const scalesIdsToRemove = useRef([]);
  const [traitsIdsToAddState, setTraitsIdsToAddState] = useState([]);
  const traitsIdsToAdd = useRef([]);
  const [traitsIdsToRemoveState, setTraitsIdsToRemoveState] = useState([]);
  const traitsIdsToRemove = useRef([]);

  const [methodDetailDialogOpen, setMethodDetailDialogOpen] = useState(false);
  const [methodDetailItem, setMethodDetailItem] = useState(undefined);
  const [observationVariableDetailDialogOpen, setObservationVariableDetailDialogOpen] = useState(false);
  const [observationVariableDetailItem, setObservationVariableDetailItem] = useState(undefined);
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
      lastModelChanged.ontologyReference&&
      lastModelChanged.ontologyReference[String(item.ontologyDbId)]) {

        //updated item
        if(lastModelChanged.ontologyReference[String(item.ontologyDbId)].op === "update"&&
            lastModelChanged.ontologyReference[String(item.ontologyDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.ontologyReference[String(item.ontologyDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.ontologyDbId]);

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
    if (observationVariableDetailItem !== undefined) {
      setObservationVariableDetailDialogOpen(true);
    }
  }, [observationVariableDetailItem]);
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

    initialValues.documentationURL = item.documentationURL;
    initialValues.ontologyDbId = item.ontologyDbId;
    initialValues.ontologyName = item.ontologyName;
    initialValues.version = item.version;

    return initialValues;
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

  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.ontologyDbId = (item.ontologyDbId!==null ? 1 : 0);
  initialValueOkStates.ontologyName = (item.ontologyName!==null ? 1 : 0);
  initialValueOkStates.version = (item.version!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.documentationURL = {errors: []};
    _initialValueAjvStates.ontologyDbId = {errors: []};
    _initialValueAjvStates.ontologyName = {errors: []};
    _initialValueAjvStates.version = {errors: []};

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
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if(values.current.ontologyDbId !== item.ontologyDbId) { return true;}
    if(values.current.ontologyName !== item.ontologyName) { return true;}
    if(values.current.version !== item.version) { return true;}
    return false;
  }


  function setAddRemoveManyMethods(variables) {
    //data to notify changes
    if(!changedAssociations.current.method_ontologyDbId) changedAssociations.current.method_ontologyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(methodsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addMethods = [ ...methodsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.method_ontologyDbId.added = true;
      if(changedAssociations.current.method_ontologyDbId.idsAdded){
        methodsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.method_ontologyDbId.idsAdded.includes(it)) changedAssociations.current.method_ontologyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.method_ontologyDbId.idsAdded = [...methodsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(methodsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeMethods = [ ...methodsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.method_ontologyDbId.removed = true;
      if(changedAssociations.current.method_ontologyDbId.idsRemoved){
        methodsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.method_ontologyDbId.idsRemoved.includes(it)) changedAssociations.current.method_ontologyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.method_ontologyDbId.idsRemoved = [...methodsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationVariables(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationVariable_ontologyDbId) changedAssociations.current.observationVariable_ontologyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationVariablesIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationVariables = [ ...observationVariablesIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationVariable_ontologyDbId.added = true;
      if(changedAssociations.current.observationVariable_ontologyDbId.idsAdded){
        observationVariablesIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationVariable_ontologyDbId.idsAdded.includes(it)) changedAssociations.current.observationVariable_ontologyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationVariable_ontologyDbId.idsAdded = [...observationVariablesIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationVariablesIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationVariables = [ ...observationVariablesIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationVariable_ontologyDbId.removed = true;
      if(changedAssociations.current.observationVariable_ontologyDbId.idsRemoved){
        observationVariablesIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationVariable_ontologyDbId.idsRemoved.includes(it)) changedAssociations.current.observationVariable_ontologyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationVariable_ontologyDbId.idsRemoved = [...observationVariablesIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyScales(variables) {
    //data to notify changes
    if(!changedAssociations.current.scale_ontologyDbId) changedAssociations.current.scale_ontologyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(scalesIdsToAdd.current.length>0) {
      //set ids to add
      variables.addScales = [ ...scalesIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.scale_ontologyDbId.added = true;
      if(changedAssociations.current.scale_ontologyDbId.idsAdded){
        scalesIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.scale_ontologyDbId.idsAdded.includes(it)) changedAssociations.current.scale_ontologyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.scale_ontologyDbId.idsAdded = [...scalesIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(scalesIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeScales = [ ...scalesIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.scale_ontologyDbId.removed = true;
      if(changedAssociations.current.scale_ontologyDbId.idsRemoved){
        scalesIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.scale_ontologyDbId.idsRemoved.includes(it)) changedAssociations.current.scale_ontologyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.scale_ontologyDbId.idsRemoved = [...scalesIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyTraits(variables) {
    //data to notify changes
    if(!changedAssociations.current.trait_ontologyDbId) changedAssociations.current.trait_ontologyDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(traitsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addTraits = [ ...traitsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.trait_ontologyDbId.added = true;
      if(changedAssociations.current.trait_ontologyDbId.idsAdded){
        traitsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.trait_ontologyDbId.idsAdded.includes(it)) changedAssociations.current.trait_ontologyDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.trait_ontologyDbId.idsAdded = [...traitsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(traitsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeTraits = [ ...traitsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.trait_ontologyDbId.removed = true;
      if(changedAssociations.current.trait_ontologyDbId.idsRemoved){
        traitsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.trait_ontologyDbId.idsRemoved.includes(it)) changedAssociations.current.trait_ontologyDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.trait_ontologyDbId.idsRemoved = [...traitsIdsToRemove.current];
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
    

    //add & remove: to_one's

    //add & remove: to_many's
    setAddRemoveManyMethods(variables);
    setAddRemoveManyObservationVariables(variables);
    setAddRemoveManyScales(variables);
    setAddRemoveManyTraits(variables);

    /*
      API Request: api.ontologyReference.updateItem
    */
    let api = await loadApi("ontologyReference");
    let cancelableApiReq = makeCancelable(api.ontologyReference.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.updateItem'}];
            newError.path=['OntologyReferences', `ontologyDbId:${item.ontologyDbId}`, 'update'];
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
          newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.updateItem'}];
          newError.path=['OntologyReferences', `ontologyDbId:${item.ontologyDbId}`, 'update'];
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
      .catch((err) => { //error: on api.ontologyReference.updateItem
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
          newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.updateItem'}];
          newError.path=['OntologyReferences', `ontologyDbId:${item.ontologyDbId}`, 'update'];
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
      case 'methods':
        methodsIdsToAdd.current.push(itemId);
        setMethodsIdsToAddState([...methodsIdsToAdd.current]);
        break;
      case 'observationVariables':
        observationVariablesIdsToAdd.current.push(itemId);
        setObservationVariablesIdsToAddState([...observationVariablesIdsToAdd.current]);
        break;
      case 'scales':
        scalesIdsToAdd.current.push(itemId);
        setScalesIdsToAddState([...scalesIdsToAdd.current]);
        break;
      case 'traits':
        traitsIdsToAdd.current.push(itemId);
        setTraitsIdsToAddState([...traitsIdsToAdd.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'methods') {
      for(let i=0; i<methodsIdsToAdd.current.length; ++i)
      {
        if(methodsIdsToAdd.current[i] === itemId) {
          methodsIdsToAdd.current.splice(i, 1);
          setMethodsIdsToAddState([...methodsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'methods'
    if(associationKey === 'observationVariables') {
      for(let i=0; i<observationVariablesIdsToAdd.current.length; ++i)
      {
        if(observationVariablesIdsToAdd.current[i] === itemId) {
          observationVariablesIdsToAdd.current.splice(i, 1);
          setObservationVariablesIdsToAddState([...observationVariablesIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observationVariables'
    if(associationKey === 'scales') {
      for(let i=0; i<scalesIdsToAdd.current.length; ++i)
      {
        if(scalesIdsToAdd.current[i] === itemId) {
          scalesIdsToAdd.current.splice(i, 1);
          setScalesIdsToAddState([...scalesIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'scales'
    if(associationKey === 'traits') {
      for(let i=0; i<traitsIdsToAdd.current.length; ++i)
      {
        if(traitsIdsToAdd.current[i] === itemId) {
          traitsIdsToAdd.current.splice(i, 1);
          setTraitsIdsToAddState([...traitsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'traits'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'methods':
  
        methodsIdsToRemove.current.push(itemId);
        setMethodsIdsToRemoveState([...methodsIdsToRemove.current]);
        break;
        case 'observationVariables':
  
        observationVariablesIdsToRemove.current.push(itemId);
        setObservationVariablesIdsToRemoveState([...observationVariablesIdsToRemove.current]);
        break;
        case 'scales':
  
        scalesIdsToRemove.current.push(itemId);
        setScalesIdsToRemoveState([...scalesIdsToRemove.current]);
        break;
        case 'traits':
  
        traitsIdsToRemove.current.push(itemId);
        setTraitsIdsToRemoveState([...traitsIdsToRemove.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'methods') {
      for(let i=0; i<methodsIdsToRemove.current.length; ++i)
      {
        if(methodsIdsToRemove.current[i] === itemId) {
          methodsIdsToRemove.current.splice(i, 1);
          setMethodsIdsToRemoveState([...methodsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'methods'
    if(associationKey === 'observationVariables') {
      for(let i=0; i<observationVariablesIdsToRemove.current.length; ++i)
      {
        if(observationVariablesIdsToRemove.current[i] === itemId) {
          observationVariablesIdsToRemove.current.splice(i, 1);
          setObservationVariablesIdsToRemoveState([...observationVariablesIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observationVariables'
    if(associationKey === 'scales') {
      for(let i=0; i<scalesIdsToRemove.current.length; ++i)
      {
        if(scalesIdsToRemove.current[i] === itemId) {
          scalesIdsToRemove.current.splice(i, 1);
          setScalesIdsToRemoveState([...scalesIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'scales'
    if(associationKey === 'traits') {
      for(let i=0; i<traitsIdsToRemove.current.length; ++i)
      {
        if(traitsIdsToRemove.current[i] === itemId) {
          traitsIdsToRemove.current.splice(i, 1);
          setTraitsIdsToRemoveState([...traitsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'traits'
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
    <Dialog id='OntologyReferenceUpdatePanel-dialog' 
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
              id='OntologyReferenceUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": OntologyReference | ontologyDbId: " + item.ontologyDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " ontologyReference" }>
              <Fab
                id='OntologyReferenceUpdatePanel-fabButton-save' 
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
            <OntologyReferenceTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <OntologyReferenceAttributesPage
                hidden={tabsValue !== 0}
                item={item}
                valueOkStates={valueOkStates}
                valueAjvStates={valueAjvStates}
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
                <OntologyReferenceAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  methodsIdsToAdd={methodsIdsToAddState}
                  methodsIdsToRemove={methodsIdsToRemoveState}
                  observationVariablesIdsToAdd={observationVariablesIdsToAddState}
                  observationVariablesIdsToRemove={observationVariablesIdsToRemoveState}
                  scalesIdsToAdd={scalesIdsToAddState}
                  scalesIdsToRemove={scalesIdsToRemoveState}
                  traitsIdsToAdd={traitsIdsToAddState}
                  traitsIdsToRemove={traitsIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                  handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                  handleClickOnTraitRow={handleClickOnTraitRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <OntologyReferenceConfirmationDialog
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
OntologyReferenceUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
