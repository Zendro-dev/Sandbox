import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import ErrorBoundary from '../../../../../../pages/ErrorBoundary';
import CountryTabsA from './components/CountryTabsA';
import { loadApi } from '../../../../../../../requests/requests.index.js';
import { makeCancelable, retry } from '../../../../../../../utils';
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
const CountryAttributesPage = lazy(() => retry(() => import(/* webpackChunkName: "Create-AttributesCountry" */ './components/country-attributes-page/CountryAttributesPage')));
const CountryAssociationsPage = lazy(() => retry(() => import(/* webpackChunkName: "Create-AssociationsCountry" */ './components/country-associations-page/CountryAssociationsPage')));
const CountryConfirmationDialog = lazy(() => retry(() => import(/* webpackChunkName: "Create-ConfirmationCountry" */ './components/CountryConfirmationDialog')));
const CapitalDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Create-DetailCapital" */ '../../../capital-table/components/capital-detail-panel/CapitalDetailPanel')));
const ContinentDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Create-DetailContinent" */ '../../../continent-table/components/continent-detail-panel/ContinentDetailPanel')));
const RiverDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Create-DetailRiver" */ '../../../river-table/components/river-detail-panel/RiverDetailPanel')));

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

export default function CountryCreatePanel(props) {
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
  Boolean(setForeignKeys); //avoids 'unused' warning

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

  const [unique_capitalIdsToAddState, setUnique_capitalIdsToAddState] = useState([]);
  const unique_capitalIdsToAdd = useRef([]);
  const [continentIdsToAddState, setContinentIdsToAddState] = useState([]);
  const continentIdsToAdd = useRef([]);
  const [riversIdsToAddState, setRiversIdsToAddState] = useState([]);
  const riversIdsToAdd = useRef([]);

  const [capitalDetailDialogOpen, setCapitalDetailDialogOpen] = useState(false);
  const [capitalDetailItem, setCapitalDetailItem] = useState(undefined);
  const [continentDetailDialogOpen, setContinentDetailDialogOpen] = useState(false);
  const [continentDetailItem, setContinentDetailItem] = useState(undefined);
  const [riverDetailDialogOpen, setRiverDetailDialogOpen] = useState(false);
  const [riverDetailItem, setRiverDetailItem] = useState(undefined);

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
    if (capitalDetailItem !== undefined) {
      setCapitalDetailDialogOpen(true);
    }
  }, [capitalDetailItem]);

  useEffect(() => {
    if (continentDetailItem !== undefined) {
      setContinentDetailDialogOpen(true);
    }
  }, [continentDetailItem]);

  useEffect(() => {
    if (riverDetailItem !== undefined) {
      setRiverDetailDialogOpen(true);
    }
  }, [riverDetailItem]);


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
    
    initialValues.name = null;
    initialValues.country_id = null;
    initialValues.continent_id = null;
    initialValues.river_ids = null;

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

    initialValueOkStates.name = 0;
    initialValueOkStates.country_id = 0;
    initialValueOkStates.continent_id = -2; //FK
    initialValueOkStates.river_ids = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.name = {errors: []};
    _initialValueAjvStates.country_id = {errors: []};
    _initialValueAjvStates.continent_id = {errors: []}; //FK
    _initialValueAjvStates.river_ids = {errors: []}; //FK

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

  function setAddUnique_capital(variables) {
    if(unique_capitalIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addUnique_capital = unique_capitalIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddContinent(variables) {
    if(continentIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addContinent = continentIdsToAdd.current[0];
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
    delete variables.continent_id;
    delete variables.river_ids;

    //add: to_one's
    setAddUnique_capital(variables);
    setAddContinent(variables);
    
    //add: to_many's
    variables.addRivers = [...riversIdsToAdd.current];

    /*
      API Request: api.country.createItem
    */
    let api = await loadApi("country");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variant.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errors.current.push(newError);
      showMessage(newError.message, withDetails);
      clearRequestDoSave();
      return;
    }

    let cancelableApiReq = makeCancelable(api.country.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'country', method: 'doSave()', request: 'api.country.createItem'}];
            newError.path=['Countries', 'add'];
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
          newError.locations=[{model: 'country', method: 'doSave()', request: 'api.country.createItem'}];
          newError.path=['Countries', 'add'];
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
      .catch((err) => { //error: on api.country.createItem
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
          newError.locations=[{model: 'country', method: 'doSave()', request: 'api.country.createItem'}];
          newError.path=['Countries', 'add'];
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
      case 'unique_capital':
        if(unique_capitalIdsToAdd.current.indexOf(itemId) === -1) {
          unique_capitalIdsToAdd.current = [];
          unique_capitalIdsToAdd.current.push(itemId);
          setUnique_capitalIdsToAddState(unique_capitalIdsToAdd.current);
          handleSetValue(itemId, -2, 'country_id');
          setForeignKeys({...foreignKeys, country_id: itemId});
        }
        break;
      case 'continent':
        if(continentIdsToAdd.current.indexOf(itemId) === -1) {
          continentIdsToAdd.current = [];
          continentIdsToAdd.current.push(itemId);
          setContinentIdsToAddState(continentIdsToAdd.current);
          handleSetValue(itemId, -2, 'continent_id');
          setForeignKeys({...foreignKeys, continent_id: itemId});
        }
        break;
      case 'rivers':
        if(riversIdsToAdd.current.indexOf(itemId) === -1) {
          riversIdsToAdd.current.push(itemId);
          setRiversIdsToAddState(riversIdsToAdd.current);
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'unique_capital') {
      if(unique_capitalIdsToAdd.current.length > 0) {
        unique_capitalIdsToAdd.current = [];
        setUnique_capitalIdsToAddState([]);
        handleSetValue(null, -2, 'country_id');
        setForeignKeys({...foreignKeys, country_id: null});
      }
      return;
    }//end: case 'unique_capital'
    if(associationKey === 'continent') {
      if(continentIdsToAdd.current.length > 0) {
        continentIdsToAdd.current = [];
        setContinentIdsToAddState([]);
        handleSetValue(null, -2, 'continent_id');
        setForeignKeys({...foreignKeys, continent_id: null});
      }
      return;
    }//end: case 'continent'
    if(associationKey === 'rivers') {
      let iof = riversIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        riversIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'rivers'
  }

  const handleClickOnCapitalRow = (event, item) => {
    setCapitalDetailItem(item);
  };

  const handleCapitalDetailDialogClose = (event) => {
    delayedCloseCapitalDetailPanel(event, 500);
  }

  const delayedCloseCapitalDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCapitalDetailDialogOpen(false);
        setCapitalDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnContinentRow = (event, item) => {
    setContinentDetailItem(item);
  };

  const handleContinentDetailDialogClose = (event) => {
    delayedCloseContinentDetailPanel(event, 500);
  }

  const delayedCloseContinentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setContinentDetailDialogOpen(false);
        setContinentDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnRiverRow = (event, item) => {
    setRiverDetailItem(item);
  };

  const handleRiverDetailDialogClose = (event) => {
    delayedCloseRiverDetailPanel(event, 500);
  }

  const delayedCloseRiverDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setRiverDetailDialogOpen(false);
        setRiverDetailItem(undefined);
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
    
    <Dialog id='CountryCreatePanel-dialog'  
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
              id='CountryCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Country'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " country" }>
            <Fab
              id='CountryCreatePanel-fabButton-save' 
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
              <CountryTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} hidden={tabsValue !== 0}>
              <CountryAttributesPage
                hidden={tabsValue !== 0}
                valueOkStates={valueOkStates}
                valueAjvStates={valueAjvStates}
                foreignKeys = {foreignKeys}
                handleSetValue={handleSetValue}
              />
            </ErrorBoundary></Suspense>
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1) && (
            <Grid item xs={12}>
              <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} hidden={tabsValue !== 1}>
                {/* Associations Page [1] */}
                <CountryAssociationsPage
                  hidden={tabsValue !== 1}
                  unique_capitalIdsToAdd={unique_capitalIdsToAddState}
                  continentIdsToAdd={continentIdsToAddState}
                  riversIdsToAdd={riversIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleClickOnCapitalRow={handleClickOnCapitalRow}
                  handleClickOnContinentRow={handleClickOnContinentRow}
                  handleClickOnRiverRow={handleClickOnRiverRow}
                />
              </ErrorBoundary></Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={confirmationOpen} handleClose={(event) => { onClose(event, false, null) }}>
          <CountryConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </ErrorBoundary></Suspense>

        {/* Detail Panels */}
        {/* Dialog: Capital Detail Panel */}
        {(capitalDetailDialogOpen) && (
          <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={capitalDetailDialogOpen} handleClose={handleCapitalDetailDialogClose}>
            <CapitalDetailPanel
              permissions={permissions}
              item={capitalDetailItem}
              dialog={true}
              handleClose={handleCapitalDetailDialogClose}
            />
          </ErrorBoundary></Suspense>
        )}
        {/* Dialog: Continent Detail Panel */}
        {(continentDetailDialogOpen) && (
          <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={continentDetailDialogOpen} handleClose={handleContinentDetailDialogClose}>
            <ContinentDetailPanel
              permissions={permissions}
              item={continentDetailItem}
              dialog={true}
              handleClose={handleContinentDetailDialogClose}
            />
          </ErrorBoundary></Suspense>
        )}
        {/* Dialog: River Detail Panel */}
        {(riverDetailDialogOpen) && (
          <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true} dialog={true} open={riverDetailDialogOpen} handleClose={handleRiverDetailDialogClose}>
            <RiverDetailPanel
              permissions={permissions}
              item={riverDetailItem}
              dialog={true}
              handleClose={handleRiverDetailDialogClose}
            />
          </ErrorBoundary></Suspense>
        )}
      </div>

    </Dialog>
  );
}
CountryCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};