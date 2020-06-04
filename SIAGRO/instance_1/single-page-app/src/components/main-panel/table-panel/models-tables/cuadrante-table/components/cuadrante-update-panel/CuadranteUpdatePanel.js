import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CuadranteAttributesPage from './components/cuadrante-attributes-page/CuadranteAttributesPage'
import CuadranteAssociationsPage from './components/cuadrante-associations-page/CuadranteAssociationsPage'
import CuadranteTabsA from './components/CuadranteTabsA'
import CuadranteConfirmationDialog from './components/CuadranteConfirmationDialog'
import GrupoEnfoqueDetailPanel from '../../../grupo_enfoque-table/components/grupo_enfoque-detail-panel/Grupo_enfoqueDetailPanel'
import TaxonDetailPanel from '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'
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

export default function CuadranteUpdatePanel(props) {
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
  
  const grupo_enfoqueIdsToAdd = useRef((item.grupo_enfoque&& item.grupo_enfoque.grupo_id) ? [item.grupo_enfoque.grupo_id] : []);
  const [grupo_enfoqueIdsToAddState, setGrupo_enfoqueIdsToAddState] = useState((item.grupo_enfoque&& item.grupo_enfoque.grupo_id) ? [item.grupo_enfoque.grupo_id] : []);
  const taxonomic_informationIdsToAdd = useRef((item.taxonomic_information&& item.taxonomic_information.id) ? [item.taxonomic_information.id] : []);
  const [taxonomic_informationIdsToAddState, setTaxonomic_informationIdsToAddState] = useState((item.taxonomic_information&& item.taxonomic_information.id) ? [item.taxonomic_information.id] : []);

  const [grupo_enfoqueDetailDialogOpen, setGrupo_enfoqueDetailDialogOpen] = useState(false);
  const [grupo_enfoqueDetailItem, setGrupo_enfoqueDetailItem] = useState(undefined);
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
      lastModelChanged.cuadrante&&
      lastModelChanged.cuadrante[String(item.cuadrante_id)]) {

        //updated item
        if(lastModelChanged.cuadrante[String(item.cuadrante_id)].op === "update"&&
            lastModelChanged.cuadrante[String(item.cuadrante_id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.cuadrante[String(item.cuadrante_id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.cuadrante_id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (grupo_enfoqueDetailItem !== undefined) {
      setGrupo_enfoqueDetailDialogOpen(true);
    }
  }, [grupo_enfoqueDetailItem]);
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

    initialValues.cuadrante_id = item.cuadrante_id;
    initialValues.tipo_planta = item.tipo_planta;
    initialValues.produccion_valor = item.produccion_valor;
    initialValues.produccion_etiqueta = item.produccion_etiqueta;
    initialValues.autoconsumo_valor = item.autoconsumo_valor;
    initialValues.autoconsumo_etiqueta = item.autoconsumo_etiqueta;
    initialValues.compra_valor = item.compra_valor;
    initialValues.compra_etiqueta = item.compra_etiqueta;
    initialValues.venta_valor = item.venta_valor;
    initialValues.venta_etiqueta = item.venta_etiqueta;
    initialValues.nombre_comun_grupo_enfoque = item.nombre_comun_grupo_enfoque;
    initialValues.grupo_enfoque_id = item.grupo_enfoque_id;
    initialValues.taxon_id = item.taxon_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.grupo_enfoque_id = item.grupo_enfoque_id;
    initialForeignKeys.taxon_id = item.taxon_id;

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

  initialValueOkStates.cuadrante_id = (item.cuadrante_id!==null ? 1 : 0);
  initialValueOkStates.tipo_planta = (item.tipo_planta!==null ? 1 : 0);
  initialValueOkStates.produccion_valor = (item.produccion_valor!==null ? 1 : 0);
  initialValueOkStates.produccion_etiqueta = (item.produccion_etiqueta!==null ? 1 : 0);
  initialValueOkStates.autoconsumo_valor = (item.autoconsumo_valor!==null ? 1 : 0);
  initialValueOkStates.autoconsumo_etiqueta = (item.autoconsumo_etiqueta!==null ? 1 : 0);
  initialValueOkStates.compra_valor = (item.compra_valor!==null ? 1 : 0);
  initialValueOkStates.compra_etiqueta = (item.compra_etiqueta!==null ? 1 : 0);
  initialValueOkStates.venta_valor = (item.venta_valor!==null ? 1 : 0);
  initialValueOkStates.venta_etiqueta = (item.venta_etiqueta!==null ? 1 : 0);
  initialValueOkStates.nombre_comun_grupo_enfoque = (item.nombre_comun_grupo_enfoque!==null ? 1 : 0);
    initialValueOkStates.grupo_enfoque_id = -2; //FK
    initialValueOkStates.taxon_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.cuadrante_id = {errors: []};
    _initialValueAjvStates.tipo_planta = {errors: []};
    _initialValueAjvStates.produccion_valor = {errors: []};
    _initialValueAjvStates.produccion_etiqueta = {errors: []};
    _initialValueAjvStates.autoconsumo_valor = {errors: []};
    _initialValueAjvStates.autoconsumo_etiqueta = {errors: []};
    _initialValueAjvStates.compra_valor = {errors: []};
    _initialValueAjvStates.compra_etiqueta = {errors: []};
    _initialValueAjvStates.venta_valor = {errors: []};
    _initialValueAjvStates.venta_etiqueta = {errors: []};
    _initialValueAjvStates.nombre_comun_grupo_enfoque = {errors: []};
    _initialValueAjvStates.grupo_enfoque_id = {errors: []}; //FK
    _initialValueAjvStates.taxon_id = {errors: []}; //FK

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
    if(values.current.cuadrante_id !== item.cuadrante_id) { return true;}
    if(values.current.tipo_planta !== item.tipo_planta) { return true;}
    if(Number(values.current.produccion_valor) !== Number(item.produccion_valor)) { return true;}
    if(values.current.produccion_etiqueta !== item.produccion_etiqueta) { return true;}
    if(Number(values.current.autoconsumo_valor) !== Number(item.autoconsumo_valor)) { return true;}
    if(values.current.autoconsumo_etiqueta !== item.autoconsumo_etiqueta) { return true;}
    if(Number(values.current.compra_valor) !== Number(item.compra_valor)) { return true;}
    if(values.current.compra_etiqueta !== item.compra_etiqueta) { return true;}
    if(Number(values.current.venta_valor) !== Number(item.venta_valor)) { return true;}
    if(values.current.venta_etiqueta !== item.venta_etiqueta) { return true;}
    if(values.current.nombre_comun_grupo_enfoque !== item.nombre_comun_grupo_enfoque) { return true;}
    if(values.current.grupo_enfoque_id !== item.grupo_enfoque_id) { return true;}
    if(values.current.taxon_id !== item.taxon_id) { return true;}
    return false;
  }

  function setAddRemoveGrupo_enfoque(variables) {
    //data to notify changes
    changedAssociations.current.grupo_enfoque = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.grupo_enfoque&&item.grupo_enfoque.grupo_id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(grupo_enfoqueIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.grupo_enfoque.grupo_id!== grupo_enfoqueIdsToAdd.current[0]) {
          //set id to add
          variables.addGrupo_enfoque = grupo_enfoqueIdsToAdd.current[0];
          
          changedAssociations.current.grupo_enfoque.added = true;
          changedAssociations.current.grupo_enfoque.idsAdded = grupo_enfoqueIdsToAdd.current;
          changedAssociations.current.grupo_enfoque.removed = true;
          changedAssociations.current.grupo_enfoque.idsRemoved = [item.grupo_enfoque.grupo_id];
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
        variables.removeGrupo_enfoque = item.grupo_enfoque.grupo_id;
        
        changedAssociations.current.grupo_enfoque.removed = true;
        changedAssociations.current.grupo_enfoque.idsRemoved = [item.grupo_enfoque.grupo_id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(grupo_enfoqueIdsToAdd.current.length>0) {
        //set id to add
        variables.addGrupo_enfoque = grupo_enfoqueIdsToAdd.current[0];
        
        changedAssociations.current.grupo_enfoque.added = true;
        changedAssociations.current.grupo_enfoque.idsAdded = grupo_enfoqueIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveTaxonomic_information(variables) {
    //data to notify changes
    changedAssociations.current.taxonomic_information = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.taxonomic_information&&item.taxonomic_information.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(taxonomic_informationIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.taxonomic_information.id!== taxonomic_informationIdsToAdd.current[0]) {
          //set id to add
          variables.addTaxonomic_information = taxonomic_informationIdsToAdd.current[0];
          
          changedAssociations.current.taxonomic_information.added = true;
          changedAssociations.current.taxonomic_information.idsAdded = taxonomic_informationIdsToAdd.current;
          changedAssociations.current.taxonomic_information.removed = true;
          changedAssociations.current.taxonomic_information.idsRemoved = [item.taxonomic_information.id];
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
        variables.removeTaxonomic_information = item.taxonomic_information.id;
        
        changedAssociations.current.taxonomic_information.removed = true;
        changedAssociations.current.taxonomic_information.idsRemoved = [item.taxonomic_information.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(taxonomic_informationIdsToAdd.current.length>0) {
        //set id to add
        variables.addTaxonomic_information = taxonomic_informationIdsToAdd.current[0];
        
        changedAssociations.current.taxonomic_information.added = true;
        changedAssociations.current.taxonomic_information.idsAdded = taxonomic_informationIdsToAdd.current;
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
    delete variables.grupo_enfoque_id;
    delete variables.taxon_id;

    //add & remove: to_one's
    setAddRemoveGrupo_enfoque(variables);
    setAddRemoveTaxonomic_information(variables);

    //add & remove: to_many's

    /*
      API Request: updateCuadrante
    */
    let cancelableApiReq = makeCancelable(api.cuadrante.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'cuadrante', query: 'updateCuadrante', method: 'doSave()', request: 'api.cuadrante.updateItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateCuadrante
        let updateCuadrante = response.data.data.updateCuadrante;
        if(updateCuadrante === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateCuadrante ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'cuadrante', query: 'updateCuadrante', method: 'doSave()', request: 'api.cuadrante.updateItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateCuadrante type
        if(typeof updateCuadrante !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'cuadrante ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'cuadrante', query: 'updateCuadrante', method: 'doSave()', request: 'api.cuadrante.updateItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'update'];
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
          newError.message = 'updateCuadrante ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'cuadrante', query: 'updateCuadrante', method: 'doSave()', request: 'api.cuadrante.updateItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'update'];
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
        onClose(event, true, updateCuadrante);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.cuadrante.updateItem
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
          newError.locations=[{model: 'cuadrante', query: 'updateCuadrante', method: 'doSave()', request: 'api.cuadrante.updateItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'update'];
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
      case 'grupo_enfoque':
        grupo_enfoqueIdsToAdd.current = [];
        grupo_enfoqueIdsToAdd.current.push(itemId);
        setGrupo_enfoqueIdsToAddState(grupo_enfoqueIdsToAdd.current);
        handleSetValue(itemId, 1, 'grupo_enfoque_id');
        setForeignKeys({...foreignKeys, grupo_enfoque_id: itemId});
        break;
      case 'taxonomic_information':
        taxonomic_informationIdsToAdd.current = [];
        taxonomic_informationIdsToAdd.current.push(itemId);
        setTaxonomic_informationIdsToAddState(taxonomic_informationIdsToAdd.current);
        handleSetValue(itemId, 1, 'taxon_id');
        setForeignKeys({...foreignKeys, taxon_id: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'grupo_enfoque') {
      grupo_enfoqueIdsToAdd.current = [];
      setGrupo_enfoqueIdsToAddState([]);
      handleSetValue(null, 0, 'grupo_enfoque_id');
      setForeignKeys({...foreignKeys, grupo_enfoque_id: null});
      return;
    }//end: case 'grupo_enfoque'
    if(associationKey === 'taxonomic_information') {
      taxonomic_informationIdsToAdd.current = [];
      setTaxonomic_informationIdsToAddState([]);
      handleSetValue(null, 0, 'taxon_id');
      setForeignKeys({...foreignKeys, taxon_id: null});
      return;
    }//end: case 'taxonomic_information'
  }


  const handleClickOnGrupo_enfoqueRow = (event, item) => {
    setGrupo_enfoqueDetailItem(item);
  };

  const handleGrupo_enfoqueDetailDialogClose = (event) => {
    delayedCloseGrupo_enfoqueDetailPanel(event, 500);
  }

  const delayedCloseGrupo_enfoqueDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setGrupo_enfoqueDetailDialogOpen(false);
        setGrupo_enfoqueDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Cuadrante | cuadrante_id: " + item.cuadrante_id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " cuadrante" }>
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
            <CuadranteTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <CuadranteAttributesPage
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
            <CuadranteAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              grupo_enfoqueIdsToAdd={grupo_enfoqueIdsToAddState}
              taxonomic_informationIdsToAdd={taxonomic_informationIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
              handleClickOnTaxonRow={handleClickOnTaxonRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <CuadranteConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Grupo_enfoque Detail Panel */}
        {(grupo_enfoqueDetailDialogOpen) && (
          <GrupoEnfoqueDetailPanel
            permissions={permissions}
            item={grupo_enfoqueDetailItem}
            dialog={true}
            handleClose={handleGrupo_enfoqueDetailDialogClose}
          />
        )}
        {/* Dialog: Taxon Detail Panel */}
        {(taxonDetailDialogOpen) && (
          <TaxonDetailPanel
            permissions={permissions}
            item={taxonDetailItem}
            dialog={true}
            handleClose={handleTaxonDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
CuadranteUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
