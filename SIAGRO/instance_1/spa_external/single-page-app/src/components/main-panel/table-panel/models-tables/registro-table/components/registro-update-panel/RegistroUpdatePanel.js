import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import RegistroTabsA from './components/RegistroTabsA';
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
const RegistroAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-Registro" */ './components/registro-attributes-page/RegistroAttributesPage'));
const RegistroAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-Registro" */ './components/registro-associations-page/RegistroAssociationsPage'));
const RegistroConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-Registro" */ './components/RegistroConfirmationDialog'));
const CaracteristicaCuantitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-CaracteristicaCuantitativa" */ '../../../caracteristica_cuantitativa-table/components/caracteristica_cuantitativa-detail-panel/Caracteristica_cuantitativaDetailPanel'));
const ReferenciaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Referencia" */ '../../../referencia-table/components/referencia-detail-panel/ReferenciaDetailPanel'));
const TaxonDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Taxon" */ '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'));

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

export default function RegistroUpdatePanel(props) {
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
  
  const [caracteristicas_cuantitativasIdsToAddState, setCaracteristicas_cuantitativasIdsToAddState] = useState([]);
  const caracteristicas_cuantitativasIdsToAdd = useRef([]);
  const [caracteristicas_cuantitativasIdsToRemoveState, setCaracteristicas_cuantitativasIdsToRemoveState] = useState([]);
  const caracteristicas_cuantitativasIdsToRemove = useRef([]);
  const [referenciasIdsToAddState, setReferenciasIdsToAddState] = useState([]);
  const referenciasIdsToAdd = useRef([]);
  const [referenciasIdsToRemoveState, setReferenciasIdsToRemoveState] = useState([]);
  const referenciasIdsToRemove = useRef([]);
  const [informacion_taxonomicaIdsToAddState, setInformacion_taxonomicaIdsToAddState] = useState([]);
  const informacion_taxonomicaIdsToAdd = useRef([]);
  const [informacion_taxonomicaIdsToRemoveState, setInformacion_taxonomicaIdsToRemoveState] = useState([]);
  const informacion_taxonomicaIdsToRemove = useRef([]);

  const [caracteristica_cuantitativaDetailDialogOpen, setCaracteristica_cuantitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cuantitativaDetailItem, setCaracteristica_cuantitativaDetailItem] = useState(undefined);
  const [referenciaDetailDialogOpen, setReferenciaDetailDialogOpen] = useState(false);
  const [referenciaDetailItem, setReferenciaDetailItem] = useState(undefined);
  const [taxonDetailDialogOpen, setTaxonDetailDialogOpen] = useState(false);
  const [taxonDetailItem, setTaxonDetailItem] = useState(undefined);

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
      lastModelChanged.registro&&
      lastModelChanged.registro[String(item.conabio_id)]) {

        //updated item
        if(lastModelChanged.registro[String(item.conabio_id)].op === "update"&&
            lastModelChanged.registro[String(item.conabio_id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.registro[String(item.conabio_id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.conabio_id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (caracteristica_cuantitativaDetailItem !== undefined) {
      setCaracteristica_cuantitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cuantitativaDetailItem]);
  useEffect(() => {
    if (referenciaDetailItem !== undefined) {
      setReferenciaDetailDialogOpen(true);
    }
  }, [referenciaDetailItem]);
  useEffect(() => {
    if (taxonDetailItem !== undefined) {
      setTaxonDetailDialogOpen(true);
    }
  }, [taxonDetailItem]);

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

    initialValues.conabio_id = item.conabio_id;
    initialValues.clave_original = item.clave_original;
    initialValues.tipo_alimento = item.tipo_alimento;
    initialValues.food_type = item.food_type;
    initialValues.descripcion_alimento = item.descripcion_alimento;
    initialValues.food_description = item.food_description;
    initialValues.procedencia = item.procedencia;
    initialValues.taxon_id = item.taxon_id;
    initialValues.referencias_ids = item.referencias_ids;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.taxon_id = item.taxon_id;
    initialForeignKeys.referencias_ids = item.referencias_ids;

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

  initialValueOkStates.conabio_id = (item.conabio_id!==null ? 1 : 0);
  initialValueOkStates.clave_original = (item.clave_original!==null ? 1 : 0);
  initialValueOkStates.tipo_alimento = (item.tipo_alimento!==null ? 1 : 0);
  initialValueOkStates.food_type = (item.food_type!==null ? 1 : 0);
  initialValueOkStates.descripcion_alimento = (item.descripcion_alimento!==null ? 1 : 0);
  initialValueOkStates.food_description = (item.food_description!==null ? 1 : 0);
  initialValueOkStates.procedencia = (item.procedencia!==null ? 1 : 0);
    initialValueOkStates.taxon_id = -2; //FK
    initialValueOkStates.referencias_ids = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.conabio_id = {errors: []};
    _initialValueAjvStates.clave_original = {errors: []};
    _initialValueAjvStates.tipo_alimento = {errors: []};
    _initialValueAjvStates.food_type = {errors: []};
    _initialValueAjvStates.descripcion_alimento = {errors: []};
    _initialValueAjvStates.food_description = {errors: []};
    _initialValueAjvStates.procedencia = {errors: []};
    _initialValueAjvStates.taxon_id = {errors: []}; //FK
    _initialValueAjvStates.referencias_ids = {errors: []}; //FK

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
    if(values.current.conabio_id !== item.conabio_id) { return true;}
    if(values.current.clave_original !== item.clave_original) { return true;}
    if(values.current.tipo_alimento !== item.tipo_alimento) { return true;}
    if(values.current.food_type !== item.food_type) { return true;}
    if(values.current.descripcion_alimento !== item.descripcion_alimento) { return true;}
    if(values.current.food_description !== item.food_description) { return true;}
    if(values.current.procedencia !== item.procedencia) { return true;}
    if(values.current.taxon_id !== item.taxon_id) { return true;}
    if(values.current.referencias_ids !== item.referencias_ids) { return true;}
    return false;
  }

  function setAddRemoveOneInformacion_taxonomica(variables) {
    //data to notify changes
    if(!changedAssociations.current.registro_taxon_id) changedAssociations.current.registro_taxon_id = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(informacion_taxonomicaIdsToAdd.current.length>0) {
      //set id to add
      variables.addInformacion_taxonomica = informacion_taxonomicaIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.registro_taxon_id.added = true;
      changedAssociations.current.registro_taxon_id.idsAdded = [informacion_taxonomicaIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(informacion_taxonomicaIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeInformacion_taxonomica = informacion_taxonomicaIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.registro_taxon_id.removed = true;
      changedAssociations.current.registro_taxon_id.idsRemoved = [informacion_taxonomicaIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyCaracteristicas_cuantitativas(variables) {
    //data to notify changes
    if(!changedAssociations.current.caracteristica_cuantitativa_registro_id) changedAssociations.current.caracteristica_cuantitativa_registro_id = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_registro_id.added = true;
      if(changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded){
        caracteristicas_cuantitativasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded.includes(it)) changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded = [...caracteristicas_cuantitativasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_registro_id.removed = true;
      if(changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved){
        caracteristicas_cuantitativasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved.includes(it)) changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved = [...caracteristicas_cuantitativasIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyReferencias(variables) {
    //data to notify changes
    if(!changedAssociations.current.referencia_registros_ids) changedAssociations.current.referencia_registros_ids = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(referenciasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addReferencias = [ ...referenciasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.referencia_registros_ids.added = true;
      if(changedAssociations.current.referencia_registros_ids.idsAdded){
        referenciasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.referencia_registros_ids.idsAdded.includes(it)) changedAssociations.current.referencia_registros_ids.idsAdded.push(it);});
      } else {
        changedAssociations.current.referencia_registros_ids.idsAdded = [...referenciasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(referenciasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeReferencias = [ ...referenciasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.referencia_registros_ids.removed = true;
      if(changedAssociations.current.referencia_registros_ids.idsRemoved){
        referenciasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.referencia_registros_ids.idsRemoved.includes(it)) changedAssociations.current.referencia_registros_ids.idsRemoved.push(it);});
      } else {
        changedAssociations.current.referencia_registros_ids.idsRemoved = [...referenciasIdsToRemove.current];
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
    
    delete variables.taxon_id; //FK
    delete variables.referencias_ids; //FK

    //add & remove: to_one's
    setAddRemoveOneInformacion_taxonomica(variables);

    //add & remove: to_many's
    setAddRemoveManyCaracteristicas_cuantitativas(variables);
    setAddRemoveManyReferencias(variables);

    /*
      API Request: api.registro.updateItem
    */
    let api = await loadApi("registro");
    let cancelableApiReq = makeCancelable(api.registro.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'registro', method: 'doSave()', request: 'api.registro.updateItem'}];
            newError.path=['Registros', `conabio_id:${item.conabio_id}`, 'update'];
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
          newError.locations=[{model: 'registro', method: 'doSave()', request: 'api.registro.updateItem'}];
          newError.path=['Registros', `conabio_id:${item.conabio_id}`, 'update'];
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
      .catch((err) => { //error: on api.registro.updateItem
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
          newError.locations=[{model: 'registro', method: 'doSave()', request: 'api.registro.updateItem'}];
          newError.path=['Registros', `conabio_id:${item.conabio_id}`, 'update'];
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
      case 'caracteristicas_cuantitativas':
        caracteristicas_cuantitativasIdsToAdd.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToAddState([...caracteristicas_cuantitativasIdsToAdd.current]);
        break;
      case 'referencias':
        referenciasIdsToAdd.current.push(itemId);
        setReferenciasIdsToAddState([...referenciasIdsToAdd.current]);
        break;
      case 'informacion_taxonomica':
        informacion_taxonomicaIdsToAdd.current = [];
        informacion_taxonomicaIdsToAdd.current.push(itemId);
        setInformacion_taxonomicaIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'taxon_id');
        setForeignKeys({...foreignKeys, taxon_id: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
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
    if(associationKey === 'referencias') {
      for(let i=0; i<referenciasIdsToAdd.current.length; ++i)
      {
        if(referenciasIdsToAdd.current[i] === itemId) {
          referenciasIdsToAdd.current.splice(i, 1);
          setReferenciasIdsToAddState([...referenciasIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'referencias'
    if(associationKey === 'informacion_taxonomica') {
      if(informacion_taxonomicaIdsToAdd.current.length > 0
      && informacion_taxonomicaIdsToAdd.current[0] === itemId) {
        informacion_taxonomicaIdsToAdd.current = [];
        setInformacion_taxonomicaIdsToAddState([]);
        handleSetValue(null, -2, 'taxon_id');
        setForeignKeys({...foreignKeys, taxon_id: null});
      }
      return;
    }//end: case 'informacion_taxonomica'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'caracteristicas_cuantitativas':
  
        caracteristicas_cuantitativasIdsToRemove.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToRemoveState([...caracteristicas_cuantitativasIdsToRemove.current]);
        break;
        case 'referencias':
  
        referenciasIdsToRemove.current.push(itemId);
        setReferenciasIdsToRemoveState([...referenciasIdsToRemove.current]);
        break;
        case 'informacion_taxonomica':
          informacion_taxonomicaIdsToRemove.current = [];
          informacion_taxonomicaIdsToRemove.current.push(itemId);
          setInformacion_taxonomicaIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'taxon_id');
          setForeignKeys({...foreignKeys, taxon_id: null});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
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
    if(associationKey === 'referencias') {
      for(let i=0; i<referenciasIdsToRemove.current.length; ++i)
      {
        if(referenciasIdsToRemove.current[i] === itemId) {
          referenciasIdsToRemove.current.splice(i, 1);
          setReferenciasIdsToRemoveState([...referenciasIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'referencias'
    if(associationKey === 'informacion_taxonomica') {
      if(informacion_taxonomicaIdsToRemove.current.length > 0
      && informacion_taxonomicaIdsToRemove.current[0] === itemId) {
        informacion_taxonomicaIdsToRemove.current = [];
        setInformacion_taxonomicaIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'taxon_id');
        setForeignKeys({...foreignKeys, taxon_id: itemId});
      }
      return;
    }//end: case 'informacion_taxonomica'
  }

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

  const handleClickOnReferenciaRow = (event, item) => {
    setReferenciaDetailItem(item);
  };

  const handleReferenciaDetailDialogClose = (event) => {
    delayedCloseReferenciaDetailPanel(event, 500);
  }

  const delayedCloseReferenciaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setReferenciaDetailDialogOpen(false);
        setReferenciaDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnTaxonRow = (event, item) => {
    setTaxonDetailItem(item);
  };

  const handleTaxonDetailDialogClose = (event) => {
    delayedCloseTaxonDetailPanel(event, 500);
  }

  const delayedCloseTaxonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTaxonDetailDialogOpen(false);
        setTaxonDetailItem(undefined);
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
    <Dialog id='RegistroUpdatePanel-dialog' 
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
              id='RegistroUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Registro | conabio_id: " + item.conabio_id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " registro" }>
              <Fab
                id='RegistroUpdatePanel-fabButton-save' 
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
            <RegistroTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <RegistroAttributesPage
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
                <RegistroAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  caracteristicas_cuantitativasIdsToAdd={caracteristicas_cuantitativasIdsToAddState}
                  caracteristicas_cuantitativasIdsToRemove={caracteristicas_cuantitativasIdsToRemoveState}
                  referenciasIdsToAdd={referenciasIdsToAddState}
                  referenciasIdsToRemove={referenciasIdsToRemoveState}
                  informacion_taxonomicaIdsToAdd={informacion_taxonomicaIdsToAddState}
                  informacion_taxonomicaIdsToRemove={informacion_taxonomicaIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                  handleClickOnReferenciaRow={handleClickOnReferenciaRow}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <RegistroConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

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
        {/* Dialog: Referencia Detail Panel */}
        {(referenciaDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <ReferenciaDetailPanel
              permissions={permissions}
              item={referenciaDetailItem}
              dialog={true}
              handleClose={handleReferenciaDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Taxon Detail Panel */}
        {(taxonDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <TaxonDetailPanel
              permissions={permissions}
              item={taxonDetailItem}
              dialog={true}
              handleClose={handleTaxonDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
RegistroUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
