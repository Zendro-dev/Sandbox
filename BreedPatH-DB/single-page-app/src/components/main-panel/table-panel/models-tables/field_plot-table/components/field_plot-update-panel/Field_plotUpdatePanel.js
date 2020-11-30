import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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

export default function FieldPlotUpdatePanel(props) {
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
  
  const [field_plot_treatmentIdsToAddState, setField_plot_treatmentIdsToAddState] = useState([]);
  const field_plot_treatmentIdsToAdd = useRef([]);
  const [field_plot_treatmentIdsToRemoveState, setField_plot_treatmentIdsToRemoveState] = useState([]);
  const field_plot_treatmentIdsToRemove = useRef([]);
  const genotypeIdsToAdd = useRef((item.genotype&& item.genotype.id) ? [item.genotype.id] : []);
  const [genotypeIdsToAddState, setGenotypeIdsToAddState] = useState((item.genotype&& item.genotype.id) ? [item.genotype.id] : []);
  const [measurementsIdsToAddState, setMeasurementsIdsToAddState] = useState([]);
  const measurementsIdsToAdd = useRef([]);
  const [measurementsIdsToRemoveState, setMeasurementsIdsToRemoveState] = useState([]);
  const measurementsIdsToRemove = useRef([]);

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
      lastModelChanged.field_plot&&
      lastModelChanged.field_plot[String(item.id)]) {

        //updated item
        if(lastModelChanged.field_plot[String(item.id)].op === "update"&&
            lastModelChanged.field_plot[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.field_plot[String(item.id)].op === "delete") {
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

    initialValues.field_name = item.field_name;
    initialValues.coordinates_or_name = item.coordinates_or_name;
    initialValues.year = item.year;
    initialValues.area_sqm = item.area_sqm;
    initialValues.type = item.type;
    initialValues.genotype_id = item.genotype_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.genotype_id = item.genotype_id;

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

  initialValueOkStates.field_name = (item.field_name!==null ? 1 : 0);
  initialValueOkStates.coordinates_or_name = (item.coordinates_or_name!==null ? 1 : 0);
  initialValueOkStates.year = (item.year!==null ? 1 : 0);
  initialValueOkStates.area_sqm = (item.area_sqm!==null ? 1 : 0);
  initialValueOkStates.type = (item.type!==null ? 1 : 0);
    initialValueOkStates.genotype_id = -2; //FK

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
    if(values.current.field_name !== item.field_name) { return true;}
    if(values.current.coordinates_or_name !== item.coordinates_or_name) { return true;}
    if(values.current.year !== item.year) { return true;}
    if(values.current.area_sqm !== item.area_sqm) { return true;}
    if(values.current.type !== item.type) { return true;}
    if(Number(values.current.genotype_id) !== Number(item.genotype_id)) { return true;}
    return false;
  }

  function setAddRemoveGenotype(variables) {
    //data to notify changes
    changedAssociations.current.genotype = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.genotype&&item.genotype.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(genotypeIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.genotype.id!== genotypeIdsToAdd.current[0]) {
          //set id to add
          variables.addGenotype = genotypeIdsToAdd.current[0];
          
          changedAssociations.current.genotype.added = true;
          changedAssociations.current.genotype.idsAdded = genotypeIdsToAdd.current;
          changedAssociations.current.genotype.removed = true;
          changedAssociations.current.genotype.idsRemoved = [item.genotype.id];
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
        variables.removeGenotype = item.genotype.id;
        
        changedAssociations.current.genotype.removed = true;
        changedAssociations.current.genotype.idsRemoved = [item.genotype.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(genotypeIdsToAdd.current.length>0) {
        //set id to add
        variables.addGenotype = genotypeIdsToAdd.current[0];
        
        changedAssociations.current.genotype.added = true;
        changedAssociations.current.genotype.idsAdded = genotypeIdsToAdd.current;
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

    //id
    variables.id = item.id;

    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's
    delete variables.genotype_id;

    //add & remove: to_one's
    setAddRemoveGenotype(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.field_plot_treatment = {added: false, removed: false};
    
    if(field_plot_treatmentIdsToAdd.current.length>0) {
      variables.addField_plot_treatment = field_plot_treatmentIdsToAdd.current;
      
      changedAssociations.current.field_plot_treatment.added = true;
      changedAssociations.current.field_plot_treatment.idsAdded = field_plot_treatmentIdsToAdd.current;
    }
    if(field_plot_treatmentIdsToRemove.current.length>0) {
      variables.removeField_plot_treatment = field_plot_treatmentIdsToRemove.current;
      
      changedAssociations.current.field_plot_treatment.removed = true;
      changedAssociations.current.field_plot_treatment.idsRemoved = field_plot_treatmentIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.measurements = {added: false, removed: false};
    
    if(measurementsIdsToAdd.current.length>0) {
      variables.addMeasurements = measurementsIdsToAdd.current;
      
      changedAssociations.current.measurements.added = true;
      changedAssociations.current.measurements.idsAdded = measurementsIdsToAdd.current;
    }
    if(measurementsIdsToRemove.current.length>0) {
      variables.removeMeasurements = measurementsIdsToRemove.current;
      
      changedAssociations.current.measurements.removed = true;
      changedAssociations.current.measurements.idsRemoved = measurementsIdsToRemove.current;
    }

    /*
      API Request: updateField_plot
    */
    let cancelableApiReq = makeCancelable(api.field_plot.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'field_plot', query: 'updateField_plot', method: 'doSave()', request: 'api.field_plot.updateItem'}];
          newError.path=['Field_plots', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateField_plot
        let updateField_plot = response.data.data.updateField_plot;
        if(updateField_plot === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateField_plot ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'field_plot', query: 'updateField_plot', method: 'doSave()', request: 'api.field_plot.updateItem'}];
          newError.path=['Field_plots', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateField_plot type
        if(typeof updateField_plot !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'field_plot ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'field_plot', query: 'updateField_plot', method: 'doSave()', request: 'api.field_plot.updateItem'}];
          newError.path=['Field_plots', `id:${item.id}`, 'update'];
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
          newError.message = 'updateField_plot ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'field_plot', query: 'updateField_plot', method: 'doSave()', request: 'api.field_plot.updateItem'}];
          newError.path=['Field_plots', `id:${item.id}`, 'update'];
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
        onClose(event, true, updateField_plot);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.field_plot.updateItem
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
          newError.locations=[{model: 'field_plot', query: 'updateField_plot', method: 'doSave()', request: 'api.field_plot.updateItem'}];
          newError.path=['Field_plots', `id:${item.id}`, 'update'];
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
      case 'field_plot_treatment':
        field_plot_treatmentIdsToAdd.current.push(itemId);
        setField_plot_treatmentIdsToAddState(field_plot_treatmentIdsToAdd.current);
        break;
      case 'genotype':
        genotypeIdsToAdd.current = [];
        genotypeIdsToAdd.current.push(itemId);
        setGenotypeIdsToAddState(genotypeIdsToAdd.current);
        handleSetValue(itemId, 1, 'genotype_id');
        setForeignKeys({...foreignKeys, genotype_id: itemId});
        break;
      case 'measurements':
        measurementsIdsToAdd.current.push(itemId);
        setMeasurementsIdsToAddState(measurementsIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'field_plot_treatment') {
      for(let i=0; i<field_plot_treatmentIdsToAdd.current.length; ++i)
      {
        if(field_plot_treatmentIdsToAdd.current[i] === itemId) {
          field_plot_treatmentIdsToAdd.current.splice(i, 1);
          setField_plot_treatmentIdsToAddState(field_plot_treatmentIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'field_plot_treatment'
    if(associationKey === 'genotype') {
      genotypeIdsToAdd.current = [];
      setGenotypeIdsToAddState([]);
      handleSetValue(null, 0, 'genotype_id');
      setForeignKeys({...foreignKeys, genotype_id: null});
      return;
    }//end: case 'genotype'
    if(associationKey === 'measurements') {
      for(let i=0; i<measurementsIdsToAdd.current.length; ++i)
      {
        if(measurementsIdsToAdd.current[i] === itemId) {
          measurementsIdsToAdd.current.splice(i, 1);
          setMeasurementsIdsToAddState(measurementsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'measurements'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'field_plot_treatment':
        field_plot_treatmentIdsToRemove.current.push(itemId);
        setField_plot_treatmentIdsToRemoveState(field_plot_treatmentIdsToRemove.current);
        break;
      case 'measurements':
        measurementsIdsToRemove.current.push(itemId);
        setMeasurementsIdsToRemoveState(measurementsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'field_plot_treatment') {
      for(let i=0; i<field_plot_treatmentIdsToRemove.current.length; ++i)
      {
        if(field_plot_treatmentIdsToRemove.current[i] === itemId) {
          field_plot_treatmentIdsToRemove.current.splice(i, 1);
          setField_plot_treatmentIdsToRemoveState(field_plot_treatmentIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'field_plot_treatment'
    if(associationKey === 'measurements') {
      for(let i=0; i<measurementsIdsToRemove.current.length; ++i)
      {
        if(measurementsIdsToRemove.current[i] === itemId) {
          measurementsIdsToRemove.current.splice(i, 1);
          setMeasurementsIdsToRemoveState(measurementsIdsToRemove.current);
          return;
        }
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
            { t('modelPanels.editing') +  ": Field_plot | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
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
            <FieldPlotTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <FieldPlotAttributesPage
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
            <FieldPlotAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              field_plot_treatmentIdsToAdd={field_plot_treatmentIdsToAddState}
              field_plot_treatmentIdsToRemove={field_plot_treatmentIdsToRemoveState}
              genotypeIdsToAdd={genotypeIdsToAddState}
              measurementsIdsToAdd={measurementsIdsToAddState}
              measurementsIdsToRemove={measurementsIdsToRemoveState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
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
FieldPlotUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
