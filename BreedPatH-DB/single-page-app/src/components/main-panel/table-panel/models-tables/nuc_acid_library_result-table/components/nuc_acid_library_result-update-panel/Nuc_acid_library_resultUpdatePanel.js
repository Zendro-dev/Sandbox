import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import NucAcidLibraryResultAttributesPage from './components/nuc_acid_library_result-attributes-page/Nuc_acid_library_resultAttributesPage'
import NucAcidLibraryResultAssociationsPage from './components/nuc_acid_library_result-associations-page/Nuc_acid_library_resultAssociationsPage'
import NucAcidLibraryResultTabsA from './components/Nuc_acid_library_resultTabsA'
import NucAcidLibraryResultConfirmationDialog from './components/Nuc_acid_library_resultConfirmationDialog'
import SampleDetailPanel from '../../../sample-table/components/sample-detail-panel/SampleDetailPanel'
import SequencingExperimentDetailPanel from '../../../sequencing_experiment-table/components/sequencing_experiment-detail-panel/Sequencing_experimentDetailPanel'
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

export default function NucAcidLibraryResultUpdatePanel(props) {
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
  
  const sampleIdsToAdd = useRef((item.sample&& item.sample.id) ? [item.sample.id] : []);
  const [sampleIdsToAddState, setSampleIdsToAddState] = useState((item.sample&& item.sample.id) ? [item.sample.id] : []);
  const sequencing_experimentIdsToAdd = useRef((item.sequencing_experiment&& item.sequencing_experiment.id) ? [item.sequencing_experiment.id] : []);
  const [sequencing_experimentIdsToAddState, setSequencing_experimentIdsToAddState] = useState((item.sequencing_experiment&& item.sequencing_experiment.id) ? [item.sequencing_experiment.id] : []);

  const [sampleDetailDialogOpen, setSampleDetailDialogOpen] = useState(false);
  const [sampleDetailItem, setSampleDetailItem] = useState(undefined);
  const [sequencing_experimentDetailDialogOpen, setSequencing_experimentDetailDialogOpen] = useState(false);
  const [sequencing_experimentDetailItem, setSequencing_experimentDetailItem] = useState(undefined);

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
      lastModelChanged.nuc_acid_library_result&&
      lastModelChanged.nuc_acid_library_result[String(item.id)]) {

        //updated item
        if(lastModelChanged.nuc_acid_library_result[String(item.id)].op === "update"&&
            lastModelChanged.nuc_acid_library_result[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.nuc_acid_library_result[String(item.id)].op === "delete") {
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
    if (sampleDetailItem !== undefined) {
      setSampleDetailDialogOpen(true);
    }
  }, [sampleDetailItem]);
  useEffect(() => {
    if (sequencing_experimentDetailItem !== undefined) {
      setSequencing_experimentDetailDialogOpen(true);
    }
  }, [sequencing_experimentDetailItem]);

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

    initialValues.lab_code = item.lab_code;
    initialValues.file_name = item.file_name;
    initialValues.file_uri = item.file_uri;
    initialValues.type = item.type;
    initialValues.insert_size = item.insert_size;
    initialValues.technical_replicate = item.technical_replicate;
    initialValues.trimmed = item.trimmed;
    initialValues.sample_id = item.sample_id;
    initialValues.sequencing_experiment_id = item.sequencing_experiment_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.sample_id = item.sample_id;
    initialForeignKeys.sequencing_experiment_id = item.sequencing_experiment_id;

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

  initialValueOkStates.lab_code = (item.lab_code!==null ? 1 : 0);
  initialValueOkStates.file_name = (item.file_name!==null ? 1 : 0);
  initialValueOkStates.file_uri = (item.file_uri!==null ? 1 : 0);
  initialValueOkStates.type = (item.type!==null ? 1 : 0);
  initialValueOkStates.insert_size = (item.insert_size!==null ? 1 : 0);
  initialValueOkStates.technical_replicate = (item.technical_replicate!==null ? 1 : 0);
  initialValueOkStates.trimmed = (item.trimmed!==null ? 1 : 0);
    initialValueOkStates.sample_id = -2; //FK
    initialValueOkStates.sequencing_experiment_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.lab_code = {errors: []};
    _initialValueAjvStates.file_name = {errors: []};
    _initialValueAjvStates.file_uri = {errors: []};
    _initialValueAjvStates.type = {errors: []};
    _initialValueAjvStates.insert_size = {errors: []};
    _initialValueAjvStates.technical_replicate = {errors: []};
    _initialValueAjvStates.trimmed = {errors: []};
    _initialValueAjvStates.sample_id = {errors: []}; //FK
    _initialValueAjvStates.sequencing_experiment_id = {errors: []}; //FK

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
    if(values.current.lab_code !== item.lab_code) { return true;}
    if(values.current.file_name !== item.file_name) { return true;}
    if(values.current.file_uri !== item.file_uri) { return true;}
    if(values.current.type !== item.type) { return true;}
    if(values.current.insert_size !== item.insert_size) { return true;}
    if(Number(values.current.technical_replicate) !== Number(item.technical_replicate)) { return true;}
    if(values.current.trimmed !== item.trimmed) { return true;}
    if(Number(values.current.sample_id) !== Number(item.sample_id)) { return true;}
    if(Number(values.current.sequencing_experiment_id) !== Number(item.sequencing_experiment_id)) { return true;}
    return false;
  }

  function setAddRemoveSample(variables) {
    //data to notify changes
    changedAssociations.current.sample = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.sample&&item.sample.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(sampleIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.sample.id!== sampleIdsToAdd.current[0]) {
          //set id to add
          variables.addSample = sampleIdsToAdd.current[0];
          
          changedAssociations.current.sample.added = true;
          changedAssociations.current.sample.idsAdded = sampleIdsToAdd.current;
          changedAssociations.current.sample.removed = true;
          changedAssociations.current.sample.idsRemoved = [item.sample.id];
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
        variables.removeSample = item.sample.id;
        
        changedAssociations.current.sample.removed = true;
        changedAssociations.current.sample.idsRemoved = [item.sample.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(sampleIdsToAdd.current.length>0) {
        //set id to add
        variables.addSample = sampleIdsToAdd.current[0];
        
        changedAssociations.current.sample.added = true;
        changedAssociations.current.sample.idsAdded = sampleIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveSequencing_experiment(variables) {
    //data to notify changes
    changedAssociations.current.sequencing_experiment = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.sequencing_experiment&&item.sequencing_experiment.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(sequencing_experimentIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.sequencing_experiment.id!== sequencing_experimentIdsToAdd.current[0]) {
          //set id to add
          variables.addSequencing_experiment = sequencing_experimentIdsToAdd.current[0];
          
          changedAssociations.current.sequencing_experiment.added = true;
          changedAssociations.current.sequencing_experiment.idsAdded = sequencing_experimentIdsToAdd.current;
          changedAssociations.current.sequencing_experiment.removed = true;
          changedAssociations.current.sequencing_experiment.idsRemoved = [item.sequencing_experiment.id];
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
        variables.removeSequencing_experiment = item.sequencing_experiment.id;
        
        changedAssociations.current.sequencing_experiment.removed = true;
        changedAssociations.current.sequencing_experiment.idsRemoved = [item.sequencing_experiment.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(sequencing_experimentIdsToAdd.current.length>0) {
        //set id to add
        variables.addSequencing_experiment = sequencing_experimentIdsToAdd.current[0];
        
        changedAssociations.current.sequencing_experiment.added = true;
        changedAssociations.current.sequencing_experiment.idsAdded = sequencing_experimentIdsToAdd.current;
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
    delete variables.sample_id;
    delete variables.sequencing_experiment_id;

    //add & remove: to_one's
    setAddRemoveSample(variables);
    setAddRemoveSequencing_experiment(variables);

    //add & remove: to_many's

    /*
      API Request: updateNuc_acid_library_result
    */
    let cancelableApiReq = makeCancelable(api.nuc_acid_library_result.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'nuc_acid_library_result', query: 'updateNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.updateItem'}];
          newError.path=['Nuc_acid_library_results', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateNuc_acid_library_result
        let updateNuc_acid_library_result = response.data.data.updateNuc_acid_library_result;
        if(updateNuc_acid_library_result === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateNuc_acid_library_result ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'updateNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.updateItem'}];
          newError.path=['Nuc_acid_library_results', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateNuc_acid_library_result type
        if(typeof updateNuc_acid_library_result !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'nuc_acid_library_result ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'updateNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.updateItem'}];
          newError.path=['Nuc_acid_library_results', `id:${item.id}`, 'update'];
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
          newError.message = 'updateNuc_acid_library_result ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'updateNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.updateItem'}];
          newError.path=['Nuc_acid_library_results', `id:${item.id}`, 'update'];
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
        onClose(event, true, updateNuc_acid_library_result);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.nuc_acid_library_result.updateItem
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
          newError.locations=[{model: 'nuc_acid_library_result', query: 'updateNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.updateItem'}];
          newError.path=['Nuc_acid_library_results', `id:${item.id}`, 'update'];
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
      case 'sample':
        sampleIdsToAdd.current = [];
        sampleIdsToAdd.current.push(itemId);
        setSampleIdsToAddState(sampleIdsToAdd.current);
        handleSetValue(itemId, 1, 'sample_id');
        setForeignKeys({...foreignKeys, sample_id: itemId});
        break;
      case 'sequencing_experiment':
        sequencing_experimentIdsToAdd.current = [];
        sequencing_experimentIdsToAdd.current.push(itemId);
        setSequencing_experimentIdsToAddState(sequencing_experimentIdsToAdd.current);
        handleSetValue(itemId, 1, 'sequencing_experiment_id');
        setForeignKeys({...foreignKeys, sequencing_experiment_id: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'sample') {
      sampleIdsToAdd.current = [];
      setSampleIdsToAddState([]);
      handleSetValue(null, 0, 'sample_id');
      setForeignKeys({...foreignKeys, sample_id: null});
      return;
    }//end: case 'sample'
    if(associationKey === 'sequencing_experiment') {
      sequencing_experimentIdsToAdd.current = [];
      setSequencing_experimentIdsToAddState([]);
      handleSetValue(null, 0, 'sequencing_experiment_id');
      setForeignKeys({...foreignKeys, sequencing_experiment_id: null});
      return;
    }//end: case 'sequencing_experiment'
  }


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

  const handleClickOnSequencing_experimentRow = (event, item) => {
    setSequencing_experimentDetailItem(item);
  };

  const handleSequencing_experimentDetailDialogClose = (event) => {
    delayedCloseSequencing_experimentDetailPanel(event, 500);
  }

  const delayedCloseSequencing_experimentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSequencing_experimentDetailDialogOpen(false);
        setSequencing_experimentDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Nuc_acid_library_result | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " nuc_acid_library_result" }>
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
            <NucAcidLibraryResultTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <NucAcidLibraryResultAttributesPage
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
            <NucAcidLibraryResultAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              sampleIdsToAdd={sampleIdsToAddState}
              sequencing_experimentIdsToAdd={sequencing_experimentIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleClickOnSampleRow={handleClickOnSampleRow}
              handleClickOnSequencing_experimentRow={handleClickOnSequencing_experimentRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <NucAcidLibraryResultConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Sample Detail Panel */}
        {(sampleDetailDialogOpen) && (
          <SampleDetailPanel
            permissions={permissions}
            item={sampleDetailItem}
            dialog={true}
            handleClose={handleSampleDetailDialogClose}
          />
        )}
        {/* Dialog: Sequencing_experiment Detail Panel */}
        {(sequencing_experimentDetailDialogOpen) && (
          <SequencingExperimentDetailPanel
            permissions={permissions}
            item={sequencing_experimentDetailItem}
            dialog={true}
            handleClose={handleSequencing_experimentDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
NucAcidLibraryResultUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
