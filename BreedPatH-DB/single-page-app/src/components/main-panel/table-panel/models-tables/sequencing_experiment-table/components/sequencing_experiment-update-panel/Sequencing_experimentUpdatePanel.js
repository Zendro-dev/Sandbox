import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SequencingExperimentAttributesPage from './components/sequencing_experiment-attributes-page/Sequencing_experimentAttributesPage'
import SequencingExperimentAssociationsPage from './components/sequencing_experiment-associations-page/Sequencing_experimentAssociationsPage'
import SequencingExperimentTabsA from './components/Sequencing_experimentTabsA'
import SequencingExperimentConfirmationDialog from './components/Sequencing_experimentConfirmationDialog'
import NucAcidLibraryResultDetailPanel from '../../../nuc_acid_library_result-table/components/nuc_acid_library_result-detail-panel/Nuc_acid_library_resultDetailPanel'
import SampleDetailPanel from '../../../sample-table/components/sample-detail-panel/SampleDetailPanel'
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

export default function SequencingExperimentUpdatePanel(props) {
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
  
  const [nuc_acid_library_resultsIdsToAddState, setNuc_acid_library_resultsIdsToAddState] = useState([]);
  const nuc_acid_library_resultsIdsToAdd = useRef([]);
  const [nuc_acid_library_resultsIdsToRemoveState, setNuc_acid_library_resultsIdsToRemoveState] = useState([]);
  const nuc_acid_library_resultsIdsToRemove = useRef([]);
  const [samplesIdsToAddState, setSamplesIdsToAddState] = useState([]);
  const samplesIdsToAdd = useRef([]);
  const [samplesIdsToRemoveState, setSamplesIdsToRemoveState] = useState([]);
  const samplesIdsToRemove = useRef([]);

  const [nuc_acid_library_resultDetailDialogOpen, setNuc_acid_library_resultDetailDialogOpen] = useState(false);
  const [nuc_acid_library_resultDetailItem, setNuc_acid_library_resultDetailItem] = useState(undefined);
  const [sampleDetailDialogOpen, setSampleDetailDialogOpen] = useState(false);
  const [sampleDetailItem, setSampleDetailItem] = useState(undefined);

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
      lastModelChanged.sequencing_experiment&&
      lastModelChanged.sequencing_experiment[String(item.id)]) {

        //updated item
        if(lastModelChanged.sequencing_experiment[String(item.id)].op === "update"&&
            lastModelChanged.sequencing_experiment[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.sequencing_experiment[String(item.id)].op === "delete") {
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
    if (nuc_acid_library_resultDetailItem !== undefined) {
      setNuc_acid_library_resultDetailDialogOpen(true);
    }
  }, [nuc_acid_library_resultDetailItem]);
  useEffect(() => {
    if (sampleDetailItem !== undefined) {
      setSampleDetailDialogOpen(true);
    }
  }, [sampleDetailItem]);

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

    initialValues.name = item.name;
    initialValues.description = item.description;
    initialValues.start_date = item.start_date;
    initialValues.end_date = item.end_date;
    initialValues.protocol = item.protocol;
    initialValues.platform = item.platform;
    initialValues.data_type = item.data_type;
    initialValues.library_type = item.library_type;
    initialValues.library_preparation = item.library_preparation;
    initialValues.aimed_coverage = item.aimed_coverage;
    initialValues.resulting_coverage = item.resulting_coverage;
    initialValues.insert_size = item.insert_size;
    initialValues.aimed_read_length = item.aimed_read_length;
    initialValues.genome_complexity_reduction = item.genome_complexity_reduction;
    initialValues.contamination = item.contamination;

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

  initialValueOkStates.name = (item.name!==null ? 1 : 0);
  initialValueOkStates.description = (item.description!==null ? 1 : 0);
  initialValueOkStates.start_date = (item.start_date!==null ? 1 : 0);
  initialValueOkStates.end_date = (item.end_date!==null ? 1 : 0);
  initialValueOkStates.protocol = (item.protocol!==null ? 1 : 0);
  initialValueOkStates.platform = (item.platform!==null ? 1 : 0);
  initialValueOkStates.data_type = (item.data_type!==null ? 1 : 0);
  initialValueOkStates.library_type = (item.library_type!==null ? 1 : 0);
  initialValueOkStates.library_preparation = (item.library_preparation!==null ? 1 : 0);
  initialValueOkStates.aimed_coverage = (item.aimed_coverage!==null ? 1 : 0);
  initialValueOkStates.resulting_coverage = (item.resulting_coverage!==null ? 1 : 0);
  initialValueOkStates.insert_size = (item.insert_size!==null ? 1 : 0);
  initialValueOkStates.aimed_read_length = (item.aimed_read_length!==null ? 1 : 0);
  initialValueOkStates.genome_complexity_reduction = (item.genome_complexity_reduction!==null ? 1 : 0);
  initialValueOkStates.contamination = (item.contamination!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.name = {errors: []};
    _initialValueAjvStates.description = {errors: []};
    _initialValueAjvStates.start_date = {errors: []};
    _initialValueAjvStates.end_date = {errors: []};
    _initialValueAjvStates.protocol = {errors: []};
    _initialValueAjvStates.platform = {errors: []};
    _initialValueAjvStates.data_type = {errors: []};
    _initialValueAjvStates.library_type = {errors: []};
    _initialValueAjvStates.library_preparation = {errors: []};
    _initialValueAjvStates.aimed_coverage = {errors: []};
    _initialValueAjvStates.resulting_coverage = {errors: []};
    _initialValueAjvStates.insert_size = {errors: []};
    _initialValueAjvStates.aimed_read_length = {errors: []};
    _initialValueAjvStates.genome_complexity_reduction = {errors: []};
    _initialValueAjvStates.contamination = {errors: []};

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
    if(values.current.name !== item.name) { return true;}
    if(values.current.description !== item.description) { return true;}
    if(values.current.start_date !== item.start_date) { return true;}
    if(values.current.end_date !== item.end_date) { return true;}
    if(values.current.protocol !== item.protocol) { return true;}
    if(values.current.platform !== item.platform) { return true;}
    if(values.current.data_type !== item.data_type) { return true;}
    if(values.current.library_type !== item.library_type) { return true;}
    if(values.current.library_preparation !== item.library_preparation) { return true;}
    if(values.current.aimed_coverage !== item.aimed_coverage) { return true;}
    if(values.current.resulting_coverage !== item.resulting_coverage) { return true;}
    if(values.current.insert_size !== item.insert_size) { return true;}
    if(values.current.aimed_read_length !== item.aimed_read_length) { return true;}
    if(values.current.genome_complexity_reduction !== item.genome_complexity_reduction) { return true;}
    if(values.current.contamination !== item.contamination) { return true;}
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

    //add & remove: to_one's

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.nuc_acid_library_results = {added: false, removed: false};
    
    if(nuc_acid_library_resultsIdsToAdd.current.length>0) {
      variables.addNuc_acid_library_results = nuc_acid_library_resultsIdsToAdd.current;
      
      changedAssociations.current.nuc_acid_library_results.added = true;
      changedAssociations.current.nuc_acid_library_results.idsAdded = nuc_acid_library_resultsIdsToAdd.current;
    }
    if(nuc_acid_library_resultsIdsToRemove.current.length>0) {
      variables.removeNuc_acid_library_results = nuc_acid_library_resultsIdsToRemove.current;
      
      changedAssociations.current.nuc_acid_library_results.removed = true;
      changedAssociations.current.nuc_acid_library_results.idsRemoved = nuc_acid_library_resultsIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.samples = {added: false, removed: false};
    
    if(samplesIdsToAdd.current.length>0) {
      variables.addSamples = samplesIdsToAdd.current;
      
      changedAssociations.current.samples.added = true;
      changedAssociations.current.samples.idsAdded = samplesIdsToAdd.current;
    }
    if(samplesIdsToRemove.current.length>0) {
      variables.removeSamples = samplesIdsToRemove.current;
      
      changedAssociations.current.samples.removed = true;
      changedAssociations.current.samples.idsRemoved = samplesIdsToRemove.current;
    }

    /*
      API Request: updateSequencing_experiment
    */
    let cancelableApiReq = makeCancelable(api.sequencing_experiment.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'sequencing_experiment', query: 'updateSequencing_experiment', method: 'doSave()', request: 'api.sequencing_experiment.updateItem'}];
          newError.path=['Sequencing_experiments', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSequencing_experiment
        let updateSequencing_experiment = response.data.data.updateSequencing_experiment;
        if(updateSequencing_experiment === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateSequencing_experiment ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'sequencing_experiment', query: 'updateSequencing_experiment', method: 'doSave()', request: 'api.sequencing_experiment.updateItem'}];
          newError.path=['Sequencing_experiments', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSequencing_experiment type
        if(typeof updateSequencing_experiment !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'sequencing_experiment ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'sequencing_experiment', query: 'updateSequencing_experiment', method: 'doSave()', request: 'api.sequencing_experiment.updateItem'}];
          newError.path=['Sequencing_experiments', `id:${item.id}`, 'update'];
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
          newError.message = 'updateSequencing_experiment ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'sequencing_experiment', query: 'updateSequencing_experiment', method: 'doSave()', request: 'api.sequencing_experiment.updateItem'}];
          newError.path=['Sequencing_experiments', `id:${item.id}`, 'update'];
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
        onClose(event, true, updateSequencing_experiment);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.sequencing_experiment.updateItem
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
          newError.locations=[{model: 'sequencing_experiment', query: 'updateSequencing_experiment', method: 'doSave()', request: 'api.sequencing_experiment.updateItem'}];
          newError.path=['Sequencing_experiments', `id:${item.id}`, 'update'];
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
      case 'nuc_acid_library_results':
        nuc_acid_library_resultsIdsToAdd.current.push(itemId);
        setNuc_acid_library_resultsIdsToAddState(nuc_acid_library_resultsIdsToAdd.current);
        break;
      case 'samples':
        samplesIdsToAdd.current.push(itemId);
        setSamplesIdsToAddState(samplesIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'nuc_acid_library_results') {
      for(let i=0; i<nuc_acid_library_resultsIdsToAdd.current.length; ++i)
      {
        if(nuc_acid_library_resultsIdsToAdd.current[i] === itemId) {
          nuc_acid_library_resultsIdsToAdd.current.splice(i, 1);
          setNuc_acid_library_resultsIdsToAddState(nuc_acid_library_resultsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'nuc_acid_library_results'
    if(associationKey === 'samples') {
      for(let i=0; i<samplesIdsToAdd.current.length; ++i)
      {
        if(samplesIdsToAdd.current[i] === itemId) {
          samplesIdsToAdd.current.splice(i, 1);
          setSamplesIdsToAddState(samplesIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'samples'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'nuc_acid_library_results':
        nuc_acid_library_resultsIdsToRemove.current.push(itemId);
        setNuc_acid_library_resultsIdsToRemoveState(nuc_acid_library_resultsIdsToRemove.current);
        break;
      case 'samples':
        samplesIdsToRemove.current.push(itemId);
        setSamplesIdsToRemoveState(samplesIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'nuc_acid_library_results') {
      for(let i=0; i<nuc_acid_library_resultsIdsToRemove.current.length; ++i)
      {
        if(nuc_acid_library_resultsIdsToRemove.current[i] === itemId) {
          nuc_acid_library_resultsIdsToRemove.current.splice(i, 1);
          setNuc_acid_library_resultsIdsToRemoveState(nuc_acid_library_resultsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'nuc_acid_library_results'
    if(associationKey === 'samples') {
      for(let i=0; i<samplesIdsToRemove.current.length; ++i)
      {
        if(samplesIdsToRemove.current[i] === itemId) {
          samplesIdsToRemove.current.splice(i, 1);
          setSamplesIdsToRemoveState(samplesIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'samples'
  }

  const handleClickOnNuc_acid_library_resultRow = (event, item) => {
    setNuc_acid_library_resultDetailItem(item);
  };

  const handleNuc_acid_library_resultDetailDialogClose = (event) => {
    delayedCloseNuc_acid_library_resultDetailPanel(event, 500);
  }

  const delayedCloseNuc_acid_library_resultDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setNuc_acid_library_resultDetailDialogOpen(false);
        setNuc_acid_library_resultDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnSampleRow = (event, item) => {
    setSampleDetailItem(item);
  };

  const handleSampleDetailDialogClose = (event) => {
    delayedCloseSampleDetailPanel(event, 500);
  }

  const delayedCloseSampleDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSampleDetailDialogOpen(false);
        setSampleDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Sequencing_experiment | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " sequencing_experiment" }>
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
            <SequencingExperimentTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <SequencingExperimentAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <SequencingExperimentAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              nuc_acid_library_resultsIdsToAdd={nuc_acid_library_resultsIdsToAddState}
              nuc_acid_library_resultsIdsToRemove={nuc_acid_library_resultsIdsToRemoveState}
              samplesIdsToAdd={samplesIdsToAddState}
              samplesIdsToRemove={samplesIdsToRemoveState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
              handleClickOnSampleRow={handleClickOnSampleRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <SequencingExperimentConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Nuc_acid_library_result Detail Panel */}
        {(nuc_acid_library_resultDetailDialogOpen) && (
          <NucAcidLibraryResultDetailPanel
            permissions={permissions}
            item={nuc_acid_library_resultDetailItem}
            dialog={true}
            handleClose={handleNuc_acid_library_resultDetailDialogClose}
          />
        )}
        {/* Dialog: Sample Detail Panel */}
        {(sampleDetailDialogOpen) && (
          <SampleDetailPanel
            permissions={permissions}
            item={sampleDetailItem}
            dialog={true}
            handleClose={handleSampleDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
SequencingExperimentUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
