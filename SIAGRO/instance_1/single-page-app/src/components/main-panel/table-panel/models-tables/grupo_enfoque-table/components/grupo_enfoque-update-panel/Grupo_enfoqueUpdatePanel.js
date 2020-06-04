import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import GrupoEnfoqueAttributesPage from './components/grupo_enfoque-attributes-page/Grupo_enfoqueAttributesPage'
import GrupoEnfoqueAssociationsPage from './components/grupo_enfoque-associations-page/Grupo_enfoqueAssociationsPage'
import GrupoEnfoqueTabsA from './components/Grupo_enfoqueTabsA'
import GrupoEnfoqueConfirmationDialog from './components/Grupo_enfoqueConfirmationDialog'
import CuadranteDetailPanel from '../../../cuadrante-table/components/cuadrante-detail-panel/CuadranteDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
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

export default function GrupoEnfoqueUpdatePanel(props) {
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
  
  const [cuadrantesIdsToAddState, setCuadrantesIdsToAddState] = useState([]);
  const cuadrantesIdsToAdd = useRef([]);
  const [cuadrantesIdsToRemoveState, setCuadrantesIdsToRemoveState] = useState([]);
  const cuadrantesIdsToRemove = useRef([]);
  const locationIdsToAdd = useRef((item.location&& item.location.location_id) ? [item.location.location_id] : []);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState((item.location&& item.location.location_id) ? [item.location.location_id] : []);

  const [cuadranteDetailDialogOpen, setCuadranteDetailDialogOpen] = useState(false);
  const [cuadranteDetailItem, setCuadranteDetailItem] = useState(undefined);
  const [locationDetailDialogOpen, setLocationDetailDialogOpen] = useState(false);
  const [locationDetailItem, setLocationDetailItem] = useState(undefined);

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
      lastModelChanged.grupo_enfoque&&
      lastModelChanged.grupo_enfoque[String(item.grupo_id)]) {

        //updated item
        if(lastModelChanged.grupo_enfoque[String(item.grupo_id)].op === "update"&&
            lastModelChanged.grupo_enfoque[String(item.grupo_id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.grupo_enfoque[String(item.grupo_id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.grupo_id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (cuadranteDetailItem !== undefined) {
      setCuadranteDetailDialogOpen(true);
    }
  }, [cuadranteDetailItem]);
  useEffect(() => {
    if (locationDetailItem !== undefined) {
      setLocationDetailDialogOpen(true);
    }
  }, [locationDetailItem]);

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

    initialValues.grupo_id = item.grupo_id;
    initialValues.tipo_grupo = item.tipo_grupo;
    initialValues.numero_participantes = item.numero_participantes;
    initialValues.fecha = item.fecha;
    initialValues.lista_especies = item.lista_especies;
    initialValues.foto_produccion = item.foto_produccion;
    initialValues.foto_autoconsumo = item.foto_autoconsumo;
    initialValues.foto_venta = item.foto_venta;
    initialValues.foto_compra = item.foto_compra;
    initialValues.observaciones = item.observaciones;
    initialValues.justificacion_produccion_cuadrante1 = item.justificacion_produccion_cuadrante1;
    initialValues.justificacion_produccion_cuadrante2 = item.justificacion_produccion_cuadrante2;
    initialValues.justificacion_produccion_cuadrante3 = item.justificacion_produccion_cuadrante3;
    initialValues.justificacion_produccion_cuadrante4 = item.justificacion_produccion_cuadrante4;
    initialValues.location_id = item.location_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.location_id = item.location_id;

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

  initialValueOkStates.grupo_id = (item.grupo_id!==null ? 1 : 0);
  initialValueOkStates.tipo_grupo = (item.tipo_grupo!==null ? 1 : 0);
  initialValueOkStates.numero_participantes = (item.numero_participantes!==null ? 1 : 0);
  initialValueOkStates.fecha = (item.fecha!==null ? 1 : 0);
  initialValueOkStates.lista_especies = (item.lista_especies!==null ? 1 : 0);
  initialValueOkStates.foto_produccion = (item.foto_produccion!==null ? 1 : 0);
  initialValueOkStates.foto_autoconsumo = (item.foto_autoconsumo!==null ? 1 : 0);
  initialValueOkStates.foto_venta = (item.foto_venta!==null ? 1 : 0);
  initialValueOkStates.foto_compra = (item.foto_compra!==null ? 1 : 0);
  initialValueOkStates.observaciones = (item.observaciones!==null ? 1 : 0);
  initialValueOkStates.justificacion_produccion_cuadrante1 = (item.justificacion_produccion_cuadrante1!==null ? 1 : 0);
  initialValueOkStates.justificacion_produccion_cuadrante2 = (item.justificacion_produccion_cuadrante2!==null ? 1 : 0);
  initialValueOkStates.justificacion_produccion_cuadrante3 = (item.justificacion_produccion_cuadrante3!==null ? 1 : 0);
  initialValueOkStates.justificacion_produccion_cuadrante4 = (item.justificacion_produccion_cuadrante4!==null ? 1 : 0);
    initialValueOkStates.location_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.grupo_id = {errors: []};
    _initialValueAjvStates.tipo_grupo = {errors: []};
    _initialValueAjvStates.numero_participantes = {errors: []};
    _initialValueAjvStates.fecha = {errors: []};
    _initialValueAjvStates.lista_especies = {errors: []};
    _initialValueAjvStates.foto_produccion = {errors: []};
    _initialValueAjvStates.foto_autoconsumo = {errors: []};
    _initialValueAjvStates.foto_venta = {errors: []};
    _initialValueAjvStates.foto_compra = {errors: []};
    _initialValueAjvStates.observaciones = {errors: []};
    _initialValueAjvStates.justificacion_produccion_cuadrante1 = {errors: []};
    _initialValueAjvStates.justificacion_produccion_cuadrante2 = {errors: []};
    _initialValueAjvStates.justificacion_produccion_cuadrante3 = {errors: []};
    _initialValueAjvStates.justificacion_produccion_cuadrante4 = {errors: []};
    _initialValueAjvStates.location_id = {errors: []}; //FK

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
    if(values.current.grupo_id !== item.grupo_id) { return true;}
    if(values.current.tipo_grupo !== item.tipo_grupo) { return true;}
    if(Number(values.current.numero_participantes) !== Number(item.numero_participantes)) { return true;}
    if(values.current.fecha !== item.fecha) { return true;}
    if(values.current.lista_especies !== item.lista_especies) { return true;}
    if(values.current.foto_produccion !== item.foto_produccion) { return true;}
    if(values.current.foto_autoconsumo !== item.foto_autoconsumo) { return true;}
    if(values.current.foto_venta !== item.foto_venta) { return true;}
    if(values.current.foto_compra !== item.foto_compra) { return true;}
    if(values.current.observaciones !== item.observaciones) { return true;}
    if(values.current.justificacion_produccion_cuadrante1 !== item.justificacion_produccion_cuadrante1) { return true;}
    if(values.current.justificacion_produccion_cuadrante2 !== item.justificacion_produccion_cuadrante2) { return true;}
    if(values.current.justificacion_produccion_cuadrante3 !== item.justificacion_produccion_cuadrante3) { return true;}
    if(values.current.justificacion_produccion_cuadrante4 !== item.justificacion_produccion_cuadrante4) { return true;}
    if(values.current.location_id !== item.location_id) { return true;}
    return false;
  }

  function setAddRemoveLocation(variables) {
    //data to notify changes
    changedAssociations.current.location = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.location&&item.location.location_id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(locationIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.location.location_id!== locationIdsToAdd.current[0]) {
          //set id to add
          variables.addLocation = locationIdsToAdd.current[0];
          
          changedAssociations.current.location.added = true;
          changedAssociations.current.location.idsAdded = locationIdsToAdd.current;
          changedAssociations.current.location.removed = true;
          changedAssociations.current.location.idsRemoved = [item.location.location_id];
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
        variables.removeLocation = item.location.location_id;
        
        changedAssociations.current.location.removed = true;
        changedAssociations.current.location.idsRemoved = [item.location.location_id];
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

function setAjvErrors(err) {
    //check
    if(err&&err.response&&err.response.data&&Array.isArray(err.response.data.errors)) {
      let errors = err.response.data.errors;
      
      //for each error
      for(let i=0; i<errors.length; ++i) {
        let e=errors[i];
        //check
        if(e && typeof e === 'object' && Array.isArray(e.details)){
          let details = e.details;
          
          for(let d=0; d<details.length; ++d) {
            let detail = details[d];

            //check
            if(detail && typeof detail === 'object' && detail.dataPath && detail.message) {
              /**
               * In this point, the error is considered as an AJV error.
               * 
               * It will be set in a ajvStatus reference and at the end of this function 
               * the ajvStatus state will be updated.
               */
              //set reference
              addAjvErrorToField(detail);
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
  function doSave(event) {
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
    delete variables.location_id;

    //add & remove: to_one's
    setAddRemoveLocation(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.cuadrantes = {added: false, removed: false};
    
    if(cuadrantesIdsToAdd.current.length>0) {
      variables.addCuadrantes = cuadrantesIdsToAdd.current;
      
      changedAssociations.current.cuadrantes.added = true;
      changedAssociations.current.cuadrantes.idsAdded = cuadrantesIdsToAdd.current;
    }
    if(cuadrantesIdsToRemove.current.length>0) {
      variables.removeCuadrantes = cuadrantesIdsToRemove.current;
      
      changedAssociations.current.cuadrantes.removed = true;
      changedAssociations.current.cuadrantes.idsRemoved = cuadrantesIdsToRemove.current;
    }

    /*
      API Request: updateGrupo_enfoque
    */
    let cancelableApiReq = makeCancelable(api.grupo_enfoque.updateItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(!response.data ||!response.data.data) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'grupo_enfoque', query: 'updateGrupo_enfoque', method: 'doSave()', request: 'api.grupo_enfoque.updateItem'}];
          newError.path=['Grupo_enfoques', `grupo_id:${item.grupo_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateGrupo_enfoque
        let updateGrupo_enfoque = response.data.data.updateGrupo_enfoque;
        if(updateGrupo_enfoque === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateGrupo_enfoque ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'grupo_enfoque', query: 'updateGrupo_enfoque', method: 'doSave()', request: 'api.grupo_enfoque.updateItem'}];
          newError.path=['Grupo_enfoques', `grupo_id:${item.grupo_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateGrupo_enfoque type
        if(typeof updateGrupo_enfoque !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'grupo_enfoque ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'grupo_enfoque', query: 'updateGrupo_enfoque', method: 'doSave()', request: 'api.grupo_enfoque.updateItem'}];
          newError.path=['Grupo_enfoques', `grupo_id:${item.grupo_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'updateGrupo_enfoque ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'grupo_enfoque', query: 'updateGrupo_enfoque', method: 'doSave()', request: 'api.grupo_enfoque.updateItem'}];
          newError.path=['Grupo_enfoques', `grupo_id:${item.grupo_id}`, 'update'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
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
        onClose(event, true, updateGrupo_enfoque);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.grupo_enfoque.updateItem
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
          newError.locations=[{model: 'grupo_enfoque', query: 'updateGrupo_enfoque', method: 'doSave()', request: 'api.grupo_enfoque.updateItem'}];
          newError.path=['Grupo_enfoques', `grupo_id:${item.grupo_id}`, 'update'];
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
      case 'cuadrantes':
        cuadrantesIdsToAdd.current.push(itemId);
        setCuadrantesIdsToAddState(cuadrantesIdsToAdd.current);
        break;
      case 'location':
        locationIdsToAdd.current = [];
        locationIdsToAdd.current.push(itemId);
        setLocationIdsToAddState(locationIdsToAdd.current);
        handleSetValue(itemId, 1, 'location_id');
        setForeignKeys({...foreignKeys, location_id: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'cuadrantes') {
      for(let i=0; i<cuadrantesIdsToAdd.current.length; ++i)
      {
        if(cuadrantesIdsToAdd.current[i] === itemId) {
          cuadrantesIdsToAdd.current.splice(i, 1);
          setCuadrantesIdsToAddState(cuadrantesIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'cuadrantes'
    if(associationKey === 'location') {
      locationIdsToAdd.current = [];
      setLocationIdsToAddState([]);
      handleSetValue(null, 0, 'location_id');
      setForeignKeys({...foreignKeys, location_id: null});
      return;
    }//end: case 'location'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'cuadrantes':
        cuadrantesIdsToRemove.current.push(itemId);
        setCuadrantesIdsToRemoveState(cuadrantesIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'cuadrantes') {
      for(let i=0; i<cuadrantesIdsToRemove.current.length; ++i)
      {
        if(cuadrantesIdsToRemove.current[i] === itemId) {
          cuadrantesIdsToRemove.current.splice(i, 1);
          setCuadrantesIdsToRemoveState(cuadrantesIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'cuadrantes'
  }

  const handleClickOnCuadranteRow = (event, item) => {
    setCuadranteDetailItem(item);
  };

  const handleCuadranteDetailDialogClose = (event) => {
    delayedCloseCuadranteDetailPanel(event, 500);
  }

  const delayedCloseCuadranteDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCuadranteDetailDialogOpen(false);
        setCuadranteDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Grupo_enfoque | grupo_id: " + item.grupo_id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " grupo_enfoque" }>
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
            <GrupoEnfoqueTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <GrupoEnfoqueAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <GrupoEnfoqueAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              cuadrantesIdsToAdd={cuadrantesIdsToAddState}
              cuadrantesIdsToRemove={cuadrantesIdsToRemoveState}
              locationIdsToAdd={locationIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnCuadranteRow={handleClickOnCuadranteRow}
              handleClickOnLocationRow={handleClickOnLocationRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <GrupoEnfoqueConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Cuadrante Detail Panel */}
        {(cuadranteDetailDialogOpen) && (
          <CuadranteDetailPanel
            permissions={permissions}
            item={cuadranteDetailItem}
            dialog={true}
            handleClose={handleCuadranteDetailDialogClose}
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
      </div>

    </Dialog>
  );
}
GrupoEnfoqueUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
