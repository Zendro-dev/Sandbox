import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import FieldPlotAttributesPage from './components/field_plot-attributes-page/Field_plotAttributesPage'
import FieldPlotAssociationsPage from './components/field_plot-associations-page/Field_plotAssociationsPage'
import FieldPlotTabsA from './components/Field_plotTabsA'
import FieldPlotConfirmationDialog from './components/Field_plotConfirmationDialog'
import FieldPlotTreatmentDetailPanel from '../../../field_plot_treatment-table/components/field_plot_treatment-detail-panel/Field_plot_treatmentDetailPanel'
import GenotypeDetailPanel from '../../../genotype-table/components/genotype-detail-panel/GenotypeDetailPanel'
import MeasurementDetailPanel from '../../../measurement-table/components/measurement-detail-panel/MeasurementDetailPanel'
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

export default function FieldPlotCreatePanel(props) {
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

  const [field_plot_treatmentIdsToAddState, setField_plot_treatmentIdsToAddState] = useState([]);
  const field_plot_treatmentIdsToAdd = useRef([]);
  const [genotypeIdsToAddState, setGenotypeIdsToAddState] = useState([]);
  const genotypeIdsToAdd = useRef([]);
  const [measurementsIdsToAddState, setMeasurementsIdsToAddState] = useState([]);
  const measurementsIdsToAdd = useRef([]);

  const [field_plot_treatmentDetailDialogOpen, setField_plot_treatmentDetailDialogOpen] = useState(false);
  const [field_plot_treatmentDetailItem, setField_plot_treatmentDetailItem] = useState(undefined);
  const [genotypeDetailDialogOpen, setGenotypeDetailDialogOpen] = useState(false);
  const [genotypeDetailItem, setGenotypeDetailItem] = useState(undefined);
  const [measurementDetailDialogOpen, setMeasurementDetailDialogOpen] = useState(false);
  const [measurementDetailItem, setMeasurementDetailItem] = useState(undefined);

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
    if (field_plot_treatmentDetailItem !== undefined) {
      setField_plot_treatmentDetailDialogOpen(true);
    }
  }, [field_plot_treatmentDetailItem]);

  useEffect(() => {
    if (genotypeDetailItem !== undefined) {
      setGenotypeDetailDialogOpen(true);
    }
  }, [genotypeDetailItem]);

  useEffect(() => {
    if (measurementDetailItem !== undefined) {
      setMeasurementDetailDialogOpen(true);
    }
  }, [measurementDetailItem]);


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
    
    initialValues.field_name = null;
    initialValues.coordinates_or_name = null;
    initialValues.year = null;
    initialValues.area_sqm = null;
    initialValues.type = null;
    initialValues.genotype_id = null;
    initialValues.field_plot_treatment_id = null;

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

    initialValueOkStates.field_name = 0;
    initialValueOkStates.coordinates_or_name = 0;
    initialValueOkStates.year = 0;
    initialValueOkStates.area_sqm = 0;
    initialValueOkStates.type = 0;
    initialValueOkStates.genotype_id = -2; //FK
    initialValueOkStates.field_plot_treatment_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.field_name = {errors: []};
    _initialValueAjvStates.coordinates_or_name = {errors: []};
    _initialValueAjvStates.year = {errors: []};
    _initialValueAjvStates.area_sqm = {errors: []};
    _initialValueAjvStates.type = {errors: []};
    _initialValueAjvStates.genotype_id = {errors: []}; //FK
    _initialValueAjvStates.field_plot_treatment_id = {errors: []}; //FK

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

  function setAddField_plot_treatment(variables) {
    if(field_plot_treatmentIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addField_plot_treatment = field_plot_treatmentIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddGenotype(variables) {
    if(genotypeIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addGenotype = genotypeIdsToAdd.current[0];
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
    delete variables.genotype_id;
    delete variables.field_plot_treatment_id;

    //add: to_one's
    setAddField_plot_treatment(variables);
    setAddGenotype(variables);
    
    //add: to_many's
    variables.addMeasurements = measurementsIdsToAdd.current;

    /*
      API Request: addField_plot
    */
    let cancelableApiReq = makeCancelable(api.field_plot.createItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'field_plot', query: 'addField_plot', method: 'doSave()', request: 'api.field_plot.createItem'}];
          newError.path=['Field_plots', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addField_plot
        let addField_plot = response.data.data.addField_plot;
        if(addField_plot === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'addField_plot ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'field_plot', query: 'addField_plot', method: 'doSave()', request: 'api.field_plot.createItem'}];
          newError.path=['Field_plots', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addField_plot type
        if(typeof addField_plot !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'field_plot ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'field_plot', query: 'addField_plot', method: 'doSave()', request: 'api.field_plot.createItem'}];
          newError.path=['Field_plots', 'add'];
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
          newError.message = 'addField_plot ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'field_plot', query: 'addField_plot', method: 'doSave()', request: 'api.field_plot.createItem'}];
          newError.path=['Field_plots', 'add'];
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
        onClose(event, true, addField_plot);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.field_plot.createItem
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
          newError.locations=[{model: 'field_plot', query: 'addField_plot', method: 'doSave()', request: 'api.field_plot.createItem'}];
          newError.path=['Field_plots', 'add'];
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
      case 'field_plot_treatment':
        if(field_plot_treatmentIdsToAdd.current.indexOf(itemId) === -1) {
          field_plot_treatmentIdsToAdd.current = [];
          field_plot_treatmentIdsToAdd.current.push(itemId);
          setField_plot_treatmentIdsToAddState(field_plot_treatmentIdsToAdd.current);
          handleSetValue(itemId, 1, 'field_plot_treatment_id');
          setForeignKeys({...foreignKeys, field_plot_treatment_id: itemId});
        }
        break;
      case 'genotype':
        if(genotypeIdsToAdd.current.indexOf(itemId) === -1) {
          genotypeIdsToAdd.current = [];
          genotypeIdsToAdd.current.push(itemId);
          setGenotypeIdsToAddState(genotypeIdsToAdd.current);
          handleSetValue(itemId, 1, 'genotype_id');
          setForeignKeys({...foreignKeys, genotype_id: itemId});
        }
        break;
      case 'measurements':
        if(measurementsIdsToAdd.current.indexOf(itemId) === -1) {
          measurementsIdsToAdd.current.push(itemId);
          setMeasurementsIdsToAddState(measurementsIdsToAdd.current);
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'field_plot_treatment') {
      if(field_plot_treatmentIdsToAdd.current.length > 0) {
        field_plot_treatmentIdsToAdd.current = [];
        setField_plot_treatmentIdsToAddState([]);
        handleSetValue(null, 0, 'field_plot_treatment_id');
        setForeignKeys({...foreignKeys, field_plot_treatment_id: null});
      }
      return;
    }//end: case 'field_plot_treatment'
    if(associationKey === 'genotype') {
      if(genotypeIdsToAdd.current.length > 0) {
        genotypeIdsToAdd.current = [];
        setGenotypeIdsToAddState([]);
        handleSetValue(null, 0, 'genotype_id');
        setForeignKeys({...foreignKeys, genotype_id: null});
      }
      return;
    }//end: case 'genotype'
    if(associationKey === 'measurements') {
      let iof = measurementsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        measurementsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'measurements'
  }

  const handleClickOnField_plot_treatmentRow = (event, item) => {
    setField_plot_treatmentDetailItem(item);
  };

  const handleField_plot_treatmentDetailDialogClose = (event) => {
    delayedCloseField_plot_treatmentDetailPanel(event, 500);
  }

  const delayedCloseField_plot_treatmentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setField_plot_treatmentDetailDialogOpen(false);
        setField_plot_treatmentDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnGenotypeRow = (event, item) => {
    setGenotypeDetailItem(item);
  };

  const handleGenotypeDetailDialogClose = (event) => {
    delayedCloseGenotypeDetailPanel(event, 500);
  }

  const delayedCloseGenotypeDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setGenotypeDetailDialogOpen(false);
        setGenotypeDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnMeasurementRow = (event, item) => {
    setMeasurementDetailItem(item);
  };

  const handleMeasurementDetailDialogClose = (event) => {
    delayedCloseMeasurementDetailPanel(event, 500);
  }

  const delayedCloseMeasurementDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMeasurementDetailDialogOpen(false);
        setMeasurementDetailItem(undefined);
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
            {t('modelPanels.new') + ' Field_plot'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " field_plot" }>
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
              <FieldPlotTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <FieldPlotAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <FieldPlotAssociationsPage
              hidden={tabsValue !== 1}
              field_plot_treatmentIdsToAdd={field_plot_treatmentIdsToAddState}
              genotypeIdsToAdd={genotypeIdsToAddState}
              measurementsIdsToAdd={measurementsIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleClickOnField_plot_treatmentRow={handleClickOnField_plot_treatmentRow}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
              handleClickOnMeasurementRow={handleClickOnMeasurementRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <FieldPlotConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Field_plot_treatment Detail Panel */}
        {(field_plot_treatmentDetailDialogOpen) && (
          <FieldPlotTreatmentDetailPanel
            permissions={permissions}
            item={field_plot_treatmentDetailItem}
            dialog={true}
            handleClose={handleField_plot_treatmentDetailDialogClose}
          />
        )}
        {/* Dialog: Genotype Detail Panel */}
        {(genotypeDetailDialogOpen) && (
          <GenotypeDetailPanel
            permissions={permissions}
            item={genotypeDetailItem}
            dialog={true}
            handleClose={handleGenotypeDetailDialogClose}
          />
        )}
        {/* Dialog: Measurement Detail Panel */}
        {(measurementDetailDialogOpen) && (
          <MeasurementDetailPanel
            permissions={permissions}
            item={measurementDetailItem}
            dialog={true}
            handleClose={handleMeasurementDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
FieldPlotCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};