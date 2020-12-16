import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import OntologyReferenceTabsA from './components/OntologyReferenceTabsA'
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
const OntologyReferenceAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesOntologyReference" */ './components/ontologyReference-attributes-page/OntologyReferenceAttributesPage'));
const OntologyReferenceAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsOntologyReference" */ './components/ontologyReference-associations-page/OntologyReferenceAssociationsPage'));
const OntologyReferenceConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationOntologyReference" */ './components/OntologyReferenceConfirmationDialog'));
const MethodDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailMethod" */ '../../../method-table/components/method-detail-panel/MethodDetailPanel'));
const ObservationVariableDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailObservationVariable" */ '../../../observationVariable-table/components/observationVariable-detail-panel/ObservationVariableDetailPanel'));
const ScaleDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailScale" */ '../../../scale-table/components/scale-detail-panel/ScaleDetailPanel'));
const TraitDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailTrait" */ '../../../trait-table/components/trait-detail-panel/TraitDetailPanel'));

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

export default function OntologyReferenceCreatePanel(props) {
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

  const [methodsIdsToAddState, setMethodsIdsToAddState] = useState([]);
  const methodsIdsToAdd = useRef([]);
  const [observationVariablesIdsToAddState, setObservationVariablesIdsToAddState] = useState([]);
  const observationVariablesIdsToAdd = useRef([]);
  const [scalesIdsToAddState, setScalesIdsToAddState] = useState([]);
  const scalesIdsToAdd = useRef([]);
  const [traitsIdsToAddState, setTraitsIdsToAddState] = useState([]);
  const traitsIdsToAdd = useRef([]);

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
    
    initialValues.documentationURL = null;
    initialValues.ontologyDbId = null;
    initialValues.ontologyName = null;
    initialValues.version = null;

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

    initialValueOkStates.documentationURL = 0;
    initialValueOkStates.ontologyDbId = 0;
    initialValueOkStates.ontologyName = 0;
    initialValueOkStates.version = 0;

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

    //add: to_one's
    
    //add: to_many's
    variables.addMethods = [...methodsIdsToAdd.current];
    variables.addObservationVariables = [...observationVariablesIdsToAdd.current];
    variables.addScales = [...scalesIdsToAdd.current];
    variables.addTraits = [...traitsIdsToAdd.current];

    /*
      API Request: api.ontologyReference.createItem
    */
    let api = await loadApi("ontologyReference");
    let cancelableApiReq = makeCancelable(api.ontologyReference.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.createItem'}];
            newError.path=['OntologyReferences', 'add'];
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
          newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.createItem'}];
          newError.path=['OntologyReferences', 'add'];
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
      .catch((err) => { //error: on api.ontologyReference.createItem
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
          newError.locations=[{model: 'ontologyReference', method: 'doSave()', request: 'api.ontologyReference.createItem'}];
          newError.path=['OntologyReferences', 'add'];
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
      case 'methods':
        if(methodsIdsToAdd.current.indexOf(itemId) === -1) {
          methodsIdsToAdd.current.push(itemId);
          setMethodsIdsToAddState(methodsIdsToAdd.current);
        }
        break;
      case 'observationVariables':
        if(observationVariablesIdsToAdd.current.indexOf(itemId) === -1) {
          observationVariablesIdsToAdd.current.push(itemId);
          setObservationVariablesIdsToAddState(observationVariablesIdsToAdd.current);
        }
        break;
      case 'scales':
        if(scalesIdsToAdd.current.indexOf(itemId) === -1) {
          scalesIdsToAdd.current.push(itemId);
          setScalesIdsToAddState(scalesIdsToAdd.current);
        }
        break;
      case 'traits':
        if(traitsIdsToAdd.current.indexOf(itemId) === -1) {
          traitsIdsToAdd.current.push(itemId);
          setTraitsIdsToAddState(traitsIdsToAdd.current);
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'methods') {
      let iof = methodsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        methodsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'methods'
    if(associationKey === 'observationVariables') {
      let iof = observationVariablesIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationVariablesIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observationVariables'
    if(associationKey === 'scales') {
      let iof = scalesIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        scalesIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'scales'
    if(associationKey === 'traits') {
      let iof = traitsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        traitsIdsToAdd.current.splice(iof, 1);
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
    
    <Dialog id='OntologyReferenceCreatePanel-dialog'  
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
              id='OntologyReferenceCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' OntologyReference'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " ontologyReference" }>
            <Fab
              id='OntologyReferenceCreatePanel-fabButton-save' 
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
              <OntologyReferenceTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <OntologyReferenceAttributesPage
                hidden={tabsValue !== 0}
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
          {(tabsValue === 1) && (
            <Grid item xs={12}>
              <Suspense fallback={<div />}>
                {/* Associations Page [1] */}
                <OntologyReferenceAssociationsPage
                  hidden={tabsValue !== 1}
                  methodsIdsToAdd={methodsIdsToAddState}
                  observationVariablesIdsToAdd={observationVariablesIdsToAddState}
                  scalesIdsToAdd={scalesIdsToAddState}
                  traitsIdsToAdd={traitsIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
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

        {/* Detail Panels */}
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
OntologyReferenceCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};