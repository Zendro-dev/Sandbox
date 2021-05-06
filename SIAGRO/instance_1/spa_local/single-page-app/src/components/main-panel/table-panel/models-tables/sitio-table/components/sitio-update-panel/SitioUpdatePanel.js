import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SitioAttributesPage from './components/sitio-attributes-page/SitioAttributesPage'
import SitioAssociationsPage from './components/sitio-associations-page/SitioAssociationsPage'
import SitioTabsA from './components/SitioTabsA'
import SitioConfirmationDialog from './components/SitioConfirmationDialog'
import GrupoEnfoqueDetailPanel from '../../../grupo_enfoque-table/components/grupo_enfoque-detail-panel/Grupo_enfoqueDetailPanel'
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

export default function SitioUpdatePanel(props) {
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
  
  const [grupo_enfoqueIdsToAddState, setGrupo_enfoqueIdsToAddState] = useState([]);
  const grupo_enfoqueIdsToAdd = useRef([]);
  const [grupo_enfoqueIdsToRemoveState, setGrupo_enfoqueIdsToRemoveState] = useState([]);
  const grupo_enfoqueIdsToRemove = useRef([]);

  const [grupo_enfoqueDetailDialogOpen, setGrupo_enfoqueDetailDialogOpen] = useState(false);
  const [grupo_enfoqueDetailItem, setGrupo_enfoqueDetailItem] = useState(undefined);

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
      lastModelChanged.sitio&&
      lastModelChanged.sitio[String(item.sitio_id)]) {

        //updated item
        if(lastModelChanged.sitio[String(item.sitio_id)].op === "update"&&
            lastModelChanged.sitio[String(item.sitio_id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.sitio[String(item.sitio_id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.sitio_id]);

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

    initialValues.sitio_id = item.sitio_id;
    initialValues.pais = item.pais;
    initialValues.estado = item.estado;
    initialValues.clave_estado = item.clave_estado;
    initialValues.municipio = item.municipio;
    initialValues.clave_municipio = item.clave_municipio;
    initialValues.localidad = item.localidad;
    initialValues.clave_localidad = item.clave_localidad;
    initialValues.latitud = item.latitud;
    initialValues.longitud = item.longitud;

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

  initialValueOkStates.sitio_id = (item.sitio_id!==null ? 1 : 0);
  initialValueOkStates.pais = (item.pais!==null ? 1 : 0);
  initialValueOkStates.estado = (item.estado!==null ? 1 : 0);
  initialValueOkStates.clave_estado = (item.clave_estado!==null ? 1 : 0);
  initialValueOkStates.municipio = (item.municipio!==null ? 1 : 0);
  initialValueOkStates.clave_municipio = (item.clave_municipio!==null ? 1 : 0);
  initialValueOkStates.localidad = (item.localidad!==null ? 1 : 0);
  initialValueOkStates.clave_localidad = (item.clave_localidad!==null ? 1 : 0);
  initialValueOkStates.latitud = (item.latitud!==null ? 1 : 0);
  initialValueOkStates.longitud = (item.longitud!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.sitio_id = {errors: []};
    _initialValueAjvStates.pais = {errors: []};
    _initialValueAjvStates.estado = {errors: []};
    _initialValueAjvStates.clave_estado = {errors: []};
    _initialValueAjvStates.municipio = {errors: []};
    _initialValueAjvStates.clave_municipio = {errors: []};
    _initialValueAjvStates.localidad = {errors: []};
    _initialValueAjvStates.clave_localidad = {errors: []};
    _initialValueAjvStates.latitud = {errors: []};
    _initialValueAjvStates.longitud = {errors: []};

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
    if(values.current.sitio_id !== item.sitio_id) { return true;}
    if(values.current.pais !== item.pais) { return true;}
    if(values.current.estado !== item.estado) { return true;}
    if(values.current.clave_estado !== item.clave_estado) { return true;}
    if(values.current.municipio !== item.municipio) { return true;}
    if(values.current.clave_municipio !== item.clave_municipio) { return true;}
    if(values.current.localidad !== item.localidad) { return true;}
    if(values.current.clave_localidad !== item.clave_localidad) { return true;}
    if(values.current.latitud !== item.latitud) { return true;}
    if(values.current.longitud !== item.longitud) { return true;}
    return false;
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
      if(valuesOkRefs.current[keys[i]] !== -1
      && valuesOkRefs.current[keys[i]] !== -2 //FK
      && valuesOkRefs.current[keys[i]] !== -3 //readOnly
      ) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }
    

    //add & remove: to_one's

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.grupo_enfoque_sitio_id = {added: false, removed: false};
    
    if(grupo_enfoqueIdsToAdd.current.length>0) {
      variables.addGrupo_enfoque = grupo_enfoqueIdsToAdd.current;
      
      changedAssociations.current.grupo_enfoque_sitio_id.added = true;
      changedAssociations.current.grupo_enfoque_sitio_id.idsAdded = grupo_enfoqueIdsToAdd.current;
    }
    if(grupo_enfoqueIdsToRemove.current.length>0) {
      variables.removeGrupo_enfoque = grupo_enfoqueIdsToRemove.current;
      
      changedAssociations.current.grupo_enfoque_sitio_id.removed = true;
      changedAssociations.current.grupo_enfoque_sitio_id.idsRemoved = grupo_enfoqueIdsToRemove.current;
    }

    /*
      API Request: updateSitio
    */
    let cancelableApiReq = makeCancelable(api.sitio.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'sitio', query: 'updateSitio', method: 'doSave()', request: 'api.sitio.updateItem'}];
          newError.path=['Sitios', `sitio_id:${item.sitio_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSitio
        let updateSitio = response.data.data.updateSitio;
        if(updateSitio === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateSitio ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'sitio', query: 'updateSitio', method: 'doSave()', request: 'api.sitio.updateItem'}];
          newError.path=['Sitios', `sitio_id:${item.sitio_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSitio type
        if(typeof updateSitio !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'sitio ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'sitio', query: 'updateSitio', method: 'doSave()', request: 'api.sitio.updateItem'}];
          newError.path=['Sitios', `sitio_id:${item.sitio_id}`, 'update'];
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
          newError.message = 'updateSitio ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'sitio', query: 'updateSitio', method: 'doSave()', request: 'api.sitio.updateItem'}];
          newError.path=['Sitios', `sitio_id:${item.sitio_id}`, 'update'];
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
        onClose(event, true, updateSitio);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.sitio.updateItem
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
          newError.locations=[{model: 'sitio', query: 'updateSitio', method: 'doSave()', request: 'api.sitio.updateItem'}];
          newError.path=['Sitios', `sitio_id:${item.sitio_id}`, 'update'];
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
        grupo_enfoqueIdsToAdd.current.push(itemId);
        setGrupo_enfoqueIdsToAddState(grupo_enfoqueIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'grupo_enfoque') {
      for(let i=0; i<grupo_enfoqueIdsToAdd.current.length; ++i)
      {
        if(grupo_enfoqueIdsToAdd.current[i] === itemId) {
          grupo_enfoqueIdsToAdd.current.splice(i, 1);
          setGrupo_enfoqueIdsToAddState(grupo_enfoqueIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'grupo_enfoque'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'grupo_enfoque':
        grupo_enfoqueIdsToRemove.current.push(itemId);
        setGrupo_enfoqueIdsToRemoveState(grupo_enfoqueIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'grupo_enfoque') {
      for(let i=0; i<grupo_enfoqueIdsToRemove.current.length; ++i)
      {
        if(grupo_enfoqueIdsToRemove.current[i] === itemId) {
          grupo_enfoqueIdsToRemove.current.splice(i, 1);
          setGrupo_enfoqueIdsToRemoveState(grupo_enfoqueIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'grupo_enfoque'
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='SitioUpdatePanel-dialog' 
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
              id='SitioUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Sitio | sitio_id: " + item.sitio_id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " sitio" }>
              <Fab
                id='SitioUpdatePanel-fabButton-save' 
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
            <SitioTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <SitioAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              handleSetValue={handleSetValue}
            />
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <SitioAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                grupo_enfoqueIdsToAdd={grupo_enfoqueIdsToAddState}
                grupo_enfoqueIdsToRemove={grupo_enfoqueIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <SitioConfirmationDialog
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
      </div>

    </Dialog>
  );
}
SitioUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
