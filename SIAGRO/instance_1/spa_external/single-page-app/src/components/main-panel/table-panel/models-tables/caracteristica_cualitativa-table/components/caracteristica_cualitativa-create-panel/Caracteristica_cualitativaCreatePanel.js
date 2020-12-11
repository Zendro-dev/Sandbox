import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import CaracteristicaCualitativaTabsA from './components/Caracteristica_cualitativaTabsA'
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
const CaracteristicaCualitativaAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesCaracteristicaCualitativa" */ './components/caracteristica_cualitativa-attributes-page/Caracteristica_cualitativaAttributesPage'));
const CaracteristicaCualitativaAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsCaracteristicaCualitativa" */ './components/caracteristica_cualitativa-associations-page/Caracteristica_cualitativaAssociationsPage'));
const CaracteristicaCualitativaConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationCaracteristicaCualitativa" */ './components/Caracteristica_cualitativaConfirmationDialog'));
const EjemplarDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailEjemplar" */ '../../../ejemplar-table/components/ejemplar-detail-panel/EjemplarDetailPanel'));
const MetodoDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailMetodo" */ '../../../metodo-table/components/metodo-detail-panel/MetodoDetailPanel'));

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

export default function CaracteristicaCualitativaCreatePanel(props) {
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

  const [registroIdsToAddState, setRegistroIdsToAddState] = useState([]);
  const registroIdsToAdd = useRef([]);
  const [metodoIdsToAddState, setMetodoIdsToAddState] = useState([]);
  const metodoIdsToAdd = useRef([]);

  const [ejemplarDetailDialogOpen, setEjemplarDetailDialogOpen] = useState(false);
  const [ejemplarDetailItem, setEjemplarDetailItem] = useState(undefined);
  const [metodoDetailDialogOpen, setMetodoDetailDialogOpen] = useState(false);
  const [metodoDetailItem, setMetodoDetailItem] = useState(undefined);

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
    if (ejemplarDetailItem !== undefined) {
      setEjemplarDetailDialogOpen(true);
    }
  }, [ejemplarDetailItem]);

  useEffect(() => {
    if (metodoDetailItem !== undefined) {
      setMetodoDetailDialogOpen(true);
    }
  }, [metodoDetailItem]);


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
    
    initialValues.nombre = null;
    initialValues.valor = null;
    initialValues.nombre_corto = null;
    initialValues.comentarios = null;
    initialValues.metodo_id = null;
    initialValues.registro_id = null;

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

    initialValueOkStates.nombre = 0;
    initialValueOkStates.valor = 0;
    initialValueOkStates.nombre_corto = 0;
    initialValueOkStates.comentarios = 0;
    initialValueOkStates.metodo_id = -2; //FK
    initialValueOkStates.registro_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.nombre = {errors: []};
    _initialValueAjvStates.valor = {errors: []};
    _initialValueAjvStates.nombre_corto = {errors: []};
    _initialValueAjvStates.comentarios = {errors: []};
    _initialValueAjvStates.metodo_id = {errors: []}; //FK
    _initialValueAjvStates.registro_id = {errors: []}; //FK

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

  function setAddRegistro(variables) {
    if(registroIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addRegistro = registroIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddMetodo(variables) {
    if(metodoIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addMetodo = metodoIdsToAdd.current[0];
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
    delete variables.metodo_id;
    delete variables.registro_id;

    //add: to_one's
    setAddRegistro(variables);
    setAddMetodo(variables);
    
    //add: to_many's

    /*
      API Request: api.caracteristica_cualitativa.createItem
    */
    let api = await loadApi("caracteristica_cualitativa");
    let cancelableApiReq = makeCancelable(api.caracteristica_cualitativa.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'caracteristica_cualitativa', method: 'doSave()', request: 'api.caracteristica_cualitativa.createItem'}];
            newError.path=['Caracteristica_cualitativas', 'add'];
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
          newError.locations=[{model: 'caracteristica_cualitativa', method: 'doSave()', request: 'api.caracteristica_cualitativa.createItem'}];
          newError.path=['Caracteristica_cualitativas', 'add'];
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
      .catch((err) => { //error: on api.caracteristica_cualitativa.createItem
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
          newError.locations=[{model: 'caracteristica_cualitativa', method: 'doSave()', request: 'api.caracteristica_cualitativa.createItem'}];
          newError.path=['Caracteristica_cualitativas', 'add'];
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
      case 'registro':
        if(registroIdsToAdd.current.indexOf(itemId) === -1) {
          registroIdsToAdd.current = [];
          registroIdsToAdd.current.push(itemId);
          setRegistroIdsToAddState(registroIdsToAdd.current);
          handleSetValue(itemId, -2, 'registro_id');
          setForeignKeys({...foreignKeys, registro_id: itemId});
        }
        break;
      case 'metodo':
        if(metodoIdsToAdd.current.indexOf(itemId) === -1) {
          metodoIdsToAdd.current = [];
          metodoIdsToAdd.current.push(itemId);
          setMetodoIdsToAddState(metodoIdsToAdd.current);
          handleSetValue(itemId, -2, 'metodo_id');
          setForeignKeys({...foreignKeys, metodo_id: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'registro') {
      if(registroIdsToAdd.current.length > 0) {
        registroIdsToAdd.current = [];
        setRegistroIdsToAddState([]);
        handleSetValue(null, -2, 'registro_id');
        setForeignKeys({...foreignKeys, registro_id: null});
      }
      return;
    }//end: case 'registro'
    if(associationKey === 'metodo') {
      if(metodoIdsToAdd.current.length > 0) {
        metodoIdsToAdd.current = [];
        setMetodoIdsToAddState([]);
        handleSetValue(null, -2, 'metodo_id');
        setForeignKeys({...foreignKeys, metodo_id: null});
      }
      return;
    }//end: case 'metodo'
  }

  const handleClickOnEjemplarRow = (event, item) => {
    setEjemplarDetailItem(item);
  };

  const handleEjemplarDetailDialogClose = (event) => {
    delayedCloseEjemplarDetailPanel(event, 500);
  }

  const delayedCloseEjemplarDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEjemplarDetailDialogOpen(false);
        setEjemplarDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnMetodoRow = (event, item) => {
    setMetodoDetailItem(item);
  };

  const handleMetodoDetailDialogClose = (event) => {
    delayedCloseMetodoDetailPanel(event, 500);
  }

  const delayedCloseMetodoDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMetodoDetailDialogOpen(false);
        setMetodoDetailItem(undefined);
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
    
    <Dialog id='CaracteristicaCualitativaCreatePanel-dialog'  
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
              id='CaracteristicaCualitativaCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Caracteristica_cualitativa'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " caracteristica_cualitativa" }>
            <Fab
              id='CaracteristicaCualitativaCreatePanel-fabButton-save' 
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
              <CaracteristicaCualitativaTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <CaracteristicaCualitativaAttributesPage
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
                <CaracteristicaCualitativaAssociationsPage
                  hidden={tabsValue !== 1}
                  registroIdsToAdd={registroIdsToAddState}
                  metodoIdsToAdd={metodoIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleClickOnEjemplarRow={handleClickOnEjemplarRow}
                  handleClickOnMetodoRow={handleClickOnMetodoRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <CaracteristicaCualitativaConfirmationDialog
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
        {/* Dialog: Ejemplar Detail Panel */}
        {(ejemplarDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <EjemplarDetailPanel
              permissions={permissions}
              item={ejemplarDetailItem}
              dialog={true}
              handleClose={handleEjemplarDetailDialogClose}
            />
          </Suspense>
        )}
        {/* Dialog: Metodo Detail Panel */}
        {(metodoDetailDialogOpen) && (
          <Suspense fallback={<div />}>
            <MetodoDetailPanel
              permissions={permissions}
              item={metodoDetailItem}
              dialog={true}
              handleClose={handleMetodoDetailDialogClose}
            />
          </Suspense>
        )}
      </div>

    </Dialog>
  );
}
CaracteristicaCualitativaCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};