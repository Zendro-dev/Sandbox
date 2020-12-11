import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MetodoTabsA from './components/MetodoTabsA';
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
const MetodoAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-Metodo" */ './components/metodo-attributes-page/MetodoAttributesPage'));
const MetodoAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-Metodo" */ './components/metodo-associations-page/MetodoAssociationsPage'));
const MetodoConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-Metodo" */ './components/MetodoConfirmationDialog'));
const CaracteristicaCualitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-CaracteristicaCualitativa" */ '../../../caracteristica_cualitativa-table/components/caracteristica_cualitativa-detail-panel/Caracteristica_cualitativaDetailPanel'));
const CaracteristicaCuantitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-CaracteristicaCuantitativa" */ '../../../caracteristica_cuantitativa-table/components/caracteristica_cuantitativa-detail-panel/Caracteristica_cuantitativaDetailPanel'));

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

export default function MetodoUpdatePanel(props) {
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
  
  const [caracteristicas_cualitativasIdsToAddState, setCaracteristicas_cualitativasIdsToAddState] = useState([]);
  const caracteristicas_cualitativasIdsToAdd = useRef([]);
  const [caracteristicas_cualitativasIdsToRemoveState, setCaracteristicas_cualitativasIdsToRemoveState] = useState([]);
  const caracteristicas_cualitativasIdsToRemove = useRef([]);
  const [caracteristicas_cuantitativasIdsToAddState, setCaracteristicas_cuantitativasIdsToAddState] = useState([]);
  const caracteristicas_cuantitativasIdsToAdd = useRef([]);
  const [caracteristicas_cuantitativasIdsToRemoveState, setCaracteristicas_cuantitativasIdsToRemoveState] = useState([]);
  const caracteristicas_cuantitativasIdsToRemove = useRef([]);

  const [caracteristica_cualitativaDetailDialogOpen, setCaracteristica_cualitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cualitativaDetailItem, setCaracteristica_cualitativaDetailItem] = useState(undefined);
  const [caracteristica_cuantitativaDetailDialogOpen, setCaracteristica_cuantitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cuantitativaDetailItem, setCaracteristica_cuantitativaDetailItem] = useState(undefined);

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
      lastModelChanged.metodo&&
      lastModelChanged.metodo[String(item.id)]) {

        //updated item
        if(lastModelChanged.metodo[String(item.id)].op === "update"&&
            lastModelChanged.metodo[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.metodo[String(item.id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (caracteristica_cualitativaDetailItem !== undefined) {
      setCaracteristica_cualitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cualitativaDetailItem]);
  useEffect(() => {
    if (caracteristica_cuantitativaDetailItem !== undefined) {
      setCaracteristica_cuantitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cuantitativaDetailItem]);

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

    initialValues.id = item.id;
    initialValues.descripcion = item.descripcion;
    initialValues.referencias = item.referencias;
    initialValues.link_referencias = item.link_referencias;

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

  initialValueOkStates.id = (item.id!==null ? 1 : 0);
  initialValueOkStates.descripcion = (item.descripcion!==null ? 1 : 0);
  initialValueOkStates.referencias = (item.referencias!==null ? 1 : 0);
  initialValueOkStates.link_referencias = (item.link_referencias!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.id = {errors: []};
    _initialValueAjvStates.descripcion = {errors: []};
    _initialValueAjvStates.referencias = {errors: []};
    _initialValueAjvStates.link_referencias = {errors: []};

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
    if(values.current.id !== item.id) { return true;}
    if(values.current.descripcion !== item.descripcion) { return true;}
    if(values.current.referencias !== item.referencias) { return true;}
    if(values.current.link_referencias !== item.link_referencias) { return true;}
    return false;
  }


  function setAddRemoveManyCaracteristicas_cualitativas(variables) {
    //data to notify changes
    if(!changedAssociations.current.caracteristica_cualitativa_metodo_id) changedAssociations.current.caracteristica_cualitativa_metodo_id = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(caracteristicas_cualitativasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addCaracteristicas_cualitativas = [ ...caracteristicas_cualitativasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cualitativa_metodo_id.added = true;
      if(changedAssociations.current.caracteristica_cualitativa_metodo_id.idsAdded){
        caracteristicas_cualitativasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cualitativa_metodo_id.idsAdded.includes(it)) changedAssociations.current.caracteristica_cualitativa_metodo_id.idsAdded.push(it);});
      } else {
        changedAssociations.current.caracteristica_cualitativa_metodo_id.idsAdded = [...caracteristicas_cualitativasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(caracteristicas_cualitativasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeCaracteristicas_cualitativas = [ ...caracteristicas_cualitativasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cualitativa_metodo_id.removed = true;
      if(changedAssociations.current.caracteristica_cualitativa_metodo_id.idsRemoved){
        caracteristicas_cualitativasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cualitativa_metodo_id.idsRemoved.includes(it)) changedAssociations.current.caracteristica_cualitativa_metodo_id.idsRemoved.push(it);});
      } else {
        changedAssociations.current.caracteristica_cualitativa_metodo_id.idsRemoved = [...caracteristicas_cualitativasIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyCaracteristicas_cuantitativas(variables) {
    //data to notify changes
    if(!changedAssociations.current.caracteristica_cuantitativa_metodo_id) changedAssociations.current.caracteristica_cuantitativa_metodo_id = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_metodo_id.added = true;
      if(changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsAdded){
        caracteristicas_cuantitativasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsAdded.includes(it)) changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsAdded.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsAdded = [...caracteristicas_cuantitativasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_metodo_id.removed = true;
      if(changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsRemoved){
        caracteristicas_cuantitativasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsRemoved.includes(it)) changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsRemoved.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_metodo_id.idsRemoved = [...caracteristicas_cuantitativasIdsToRemove.current];
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
    setAddRemoveManyCaracteristicas_cualitativas(variables);
    setAddRemoveManyCaracteristicas_cuantitativas(variables);

    /*
      API Request: api.metodo.updateItem
    */
    let api = await loadApi("metodo");
    let cancelableApiReq = makeCancelable(api.metodo.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'metodo', method: 'doSave()', request: 'api.metodo.updateItem'}];
            newError.path=['Metodos', `id:${item.id}`, 'update'];
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
          newError.locations=[{model: 'metodo', method: 'doSave()', request: 'api.metodo.updateItem'}];
          newError.path=['Metodos', `id:${item.id}`, 'update'];
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
      .catch((err) => { //error: on api.metodo.updateItem
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
          newError.locations=[{model: 'metodo', method: 'doSave()', request: 'api.metodo.updateItem'}];
          newError.path=['Metodos', `id:${item.id}`, 'update'];
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
      case 'caracteristicas_cualitativas':
        caracteristicas_cualitativasIdsToAdd.current.push(itemId);
        setCaracteristicas_cualitativasIdsToAddState([...caracteristicas_cualitativasIdsToAdd.current]);
        break;
      case 'caracteristicas_cuantitativas':
        caracteristicas_cuantitativasIdsToAdd.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToAddState([...caracteristicas_cuantitativasIdsToAdd.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'caracteristicas_cualitativas') {
      for(let i=0; i<caracteristicas_cualitativasIdsToAdd.current.length; ++i)
      {
        if(caracteristicas_cualitativasIdsToAdd.current[i] === itemId) {
          caracteristicas_cualitativasIdsToAdd.current.splice(i, 1);
          setCaracteristicas_cualitativasIdsToAddState([...caracteristicas_cualitativasIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cualitativas'
    if(associationKey === 'caracteristicas_cuantitativas') {
      for(let i=0; i<caracteristicas_cuantitativasIdsToAdd.current.length; ++i)
      {
        if(caracteristicas_cuantitativasIdsToAdd.current[i] === itemId) {
          caracteristicas_cuantitativasIdsToAdd.current.splice(i, 1);
          setCaracteristicas_cuantitativasIdsToAddState([...caracteristicas_cuantitativasIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cuantitativas'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'caracteristicas_cualitativas':
  
        caracteristicas_cualitativasIdsToRemove.current.push(itemId);
        setCaracteristicas_cualitativasIdsToRemoveState([...caracteristicas_cualitativasIdsToRemove.current]);
        break;
        case 'caracteristicas_cuantitativas':
  
        caracteristicas_cuantitativasIdsToRemove.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToRemoveState([...caracteristicas_cuantitativasIdsToRemove.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'caracteristicas_cualitativas') {
      for(let i=0; i<caracteristicas_cualitativasIdsToRemove.current.length; ++i)
      {
        if(caracteristicas_cualitativasIdsToRemove.current[i] === itemId) {
          caracteristicas_cualitativasIdsToRemove.current.splice(i, 1);
          setCaracteristicas_cualitativasIdsToRemoveState([...caracteristicas_cualitativasIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cualitativas'
    if(associationKey === 'caracteristicas_cuantitativas') {
      for(let i=0; i<caracteristicas_cuantitativasIdsToRemove.current.length; ++i)
      {
        if(caracteristicas_cuantitativasIdsToRemove.current[i] === itemId) {
          caracteristicas_cuantitativasIdsToRemove.current.splice(i, 1);
          setCaracteristicas_cuantitativasIdsToRemoveState([...caracteristicas_cuantitativasIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cuantitativas'
  }

  const handleClickOnCaracteristica_cualitativaRow = (event, item) => {
    setCaracteristica_cualitativaDetailItem(item);
  };

  const handleCaracteristica_cualitativaDetailDialogClose = (event) => {
    delayedCloseCaracteristica_cualitativaDetailPanel(event, 500);
  }

  const delayedCloseCaracteristica_cualitativaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCaracteristica_cualitativaDetailDialogOpen(false);
        setCaracteristica_cualitativaDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnCaracteristica_cuantitativaRow = (event, item) => {
    setCaracteristica_cuantitativaDetailItem(item);
  };

  const handleCaracteristica_cuantitativaDetailDialogClose = (event) => {
    delayedCloseCaracteristica_cuantitativaDetailPanel(event, 500);
  }

  const delayedCloseCaracteristica_cuantitativaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCaracteristica_cuantitativaDetailDialogOpen(false);
        setCaracteristica_cuantitativaDetailItem(undefined);
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
    <Dialog id='MetodoUpdatePanel-dialog' 
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
              id='MetodoUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Metodo | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " metodo" }>
              <Fab
                id='MetodoUpdatePanel-fabButton-save' 
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
            <MetodoTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <MetodoAttributesPage
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
                <MetodoAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  caracteristicas_cualitativasIdsToAdd={caracteristicas_cualitativasIdsToAddState}
                  caracteristicas_cualitativasIdsToRemove={caracteristicas_cualitativasIdsToRemoveState}
                  caracteristicas_cuantitativasIdsToAdd={caracteristicas_cuantitativasIdsToAddState}
                  caracteristicas_cuantitativasIdsToRemove={caracteristicas_cuantitativasIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <MetodoConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

        {/* Dialog: Caracteristica_cualitativa Detail Panel */}
        {(caracteristica_cualitativaDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <CaracteristicaCualitativaDetailPanel
              permissions={permissions}
              item={caracteristica_cualitativaDetailItem}
              dialog={true}
              handleClose={handleCaracteristica_cualitativaDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Caracteristica_cuantitativa Detail Panel */}
        {(caracteristica_cuantitativaDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <CaracteristicaCuantitativaDetailPanel
              permissions={permissions}
              item={caracteristica_cuantitativaDetailItem}
              dialog={true}
              handleClose={handleCaracteristica_cuantitativaDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
MetodoUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
