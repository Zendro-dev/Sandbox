import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import CuadranteAttributesPage from './components/cuadrante-attributes-page/CuadranteAttributesPage'
import CuadranteAssociationsPage from './components/cuadrante-associations-page/CuadranteAssociationsPage'
import CuadranteTabsA from './components/CuadranteTabsA'
import CuadranteConfirmationDialog from './components/CuadranteConfirmationDialog'
import GrupoEnfoqueDetailPanel from '../../../grupo_enfoque-table/components/grupo_enfoque-detail-panel/Grupo_enfoqueDetailPanel'
import TaxonDetailPanel from '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'
import api from '../../../../../../../requests/requests.index.js'
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

export default function CuadranteCreatePanel(props) {
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

  const [grupo_enfoqueIdsToAddState, setGrupo_enfoqueIdsToAddState] = useState([]);
  const grupo_enfoqueIdsToAdd = useRef([]);
  const [informacion_taxonomicaIdsToAddState, setInformacion_taxonomicaIdsToAddState] = useState([]);
  const informacion_taxonomicaIdsToAdd = useRef([]);

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
    
    initialValues.cuadrante_id = null;
    initialValues.tipo_planta = null;
    initialValues.produccion_valor = null;
    initialValues.produccion_etiqueta = null;
    initialValues.autoconsumo_valor = null;
    initialValues.autoconsumo_etiqueta = null;
    initialValues.compra_valor = null;
    initialValues.compra_etiqueta = null;
    initialValues.venta_valor = null;
    initialValues.venta_etiqueta = null;
    initialValues.nombre_comun_grupo_enfoque = null;
    initialValues.grupo_enfoque_id = null;
    initialValues.taxon_id = null;

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

    initialValueOkStates.cuadrante_id = 0;
    initialValueOkStates.tipo_planta = 0;
    initialValueOkStates.produccion_valor = 0;
    initialValueOkStates.produccion_etiqueta = 0;
    initialValueOkStates.autoconsumo_valor = 0;
    initialValueOkStates.autoconsumo_etiqueta = 0;
    initialValueOkStates.compra_valor = 0;
    initialValueOkStates.compra_etiqueta = 0;
    initialValueOkStates.venta_valor = 0;
    initialValueOkStates.venta_etiqueta = 0;
    initialValueOkStates.nombre_comun_grupo_enfoque = 0;
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

  function setAddGrupo_enfoque(variables) {
    if(grupo_enfoqueIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addGrupo_enfoque = grupo_enfoqueIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddInformacion_taxonomica(variables) {
    if(informacion_taxonomicaIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addInformacion_taxonomica = informacion_taxonomicaIdsToAdd.current[0];
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
    * Add new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item added.
    * 
    */
  function doSave(event) {
    errors.current = [];

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

    //add: to_one's
    setAddGrupo_enfoque(variables);
    setAddInformacion_taxonomica(variables);
    
    //add: to_many's

    /*
      API Request: addCuadrante
    */
    let cancelableApiReq = makeCancelable(api.cuadrante.createItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'cuadrante', query: 'addCuadrante', method: 'doSave()', request: 'api.cuadrante.createItem'}];
          newError.path=['Cuadrantes', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addCuadrante
        let addCuadrante = response.data.data.addCuadrante;
        if(addCuadrante === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'addCuadrante ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'cuadrante', query: 'addCuadrante', method: 'doSave()', request: 'api.cuadrante.createItem'}];
          newError.path=['Cuadrantes', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addCuadrante type
        if(typeof addCuadrante !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'cuadrante ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'cuadrante', query: 'addCuadrante', method: 'doSave()', request: 'api.cuadrante.createItem'}];
          newError.path=['Cuadrantes', 'add'];
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
          newError.message = 'addCuadrante ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'cuadrante', query: 'addCuadrante', method: 'doSave()', request: 'api.cuadrante.createItem'}];
          newError.path=['Cuadrantes', 'add'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
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
        onClose(event, true, addCuadrante);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.cuadrante.createItem
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
          newError.locations=[{model: 'cuadrante', query: 'addCuadrante', method: 'doSave()', request: 'api.cuadrante.createItem'}];
          newError.path=['Cuadrantes', 'add'];
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
      case 'grupo_enfoque':
        if(grupo_enfoqueIdsToAdd.current.indexOf(itemId) === -1) {
          grupo_enfoqueIdsToAdd.current = [];
          grupo_enfoqueIdsToAdd.current.push(itemId);
          setGrupo_enfoqueIdsToAddState(grupo_enfoqueIdsToAdd.current);
          handleSetValue(itemId, 1, 'grupo_enfoque_id');
          setForeignKeys({...foreignKeys, grupo_enfoque_id: itemId});
        }
        break;
      case 'informacion_taxonomica':
        if(informacion_taxonomicaIdsToAdd.current.indexOf(itemId) === -1) {
          informacion_taxonomicaIdsToAdd.current = [];
          informacion_taxonomicaIdsToAdd.current.push(itemId);
          setInformacion_taxonomicaIdsToAddState(informacion_taxonomicaIdsToAdd.current);
          handleSetValue(itemId, 1, 'taxon_id');
          setForeignKeys({...foreignKeys, taxon_id: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'grupo_enfoque') {
      if(grupo_enfoqueIdsToAdd.current.length > 0) {
        grupo_enfoqueIdsToAdd.current = [];
        setGrupo_enfoqueIdsToAddState([]);
        handleSetValue(null, 0, 'grupo_enfoque_id');
        setForeignKeys({...foreignKeys, grupo_enfoque_id: null});
      }
      return;
    }//end: case 'grupo_enfoque'
    if(associationKey === 'informacion_taxonomica') {
      if(informacion_taxonomicaIdsToAdd.current.length > 0) {
        informacion_taxonomicaIdsToAdd.current = [];
        setInformacion_taxonomicaIdsToAddState([]);
        handleSetValue(null, 0, 'taxon_id');
        setForeignKeys({...foreignKeys, taxon_id: null});
      }
      return;
    }//end: case 'informacion_taxonomica'
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
      <CssBaseline />
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
            {t('modelPanels.new') + ' Cuadrante'}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <CuadranteTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <CuadranteAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <CuadranteAssociationsPage
              hidden={tabsValue !== 1}
              grupo_enfoqueIdsToAdd={grupo_enfoqueIdsToAddState}
              informacion_taxonomicaIdsToAdd={informacion_taxonomicaIdsToAddState}
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
CuadranteCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};