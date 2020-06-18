import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SampleAttributesPage from './components/sample-attributes-page/SampleAttributesPage'
import SampleAssociationsPage from './components/sample-associations-page/SampleAssociationsPage'
import SampleTabsA from './components/SampleTabsA'
import SampleConfirmationDialog from './components/SampleConfirmationDialog'
import IndividualDetailPanel from '../../../individual-table/components/individual-detail-panel/IndividualDetailPanel'
import NucAcidLibraryResultDetailPanel from '../../../nuc_acid_library_result-table/components/nuc_acid_library_result-detail-panel/Nuc_acid_library_resultDetailPanel'
import SequencingExperimentDetailPanel from '../../../sequencing_experiment-table/components/sequencing_experiment-detail-panel/Sequencing_experimentDetailPanel'
import TranscriptCountDetailPanel from '../../../transcript_count-table/components/transcript_count-detail-panel/Transcript_countDetailPanel'
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

export default function SampleUpdatePanel(props) {
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
  
  const individualIdsToAdd = useRef((item.individual&& item.individual.id) ? [item.individual.id] : []);
  const [individualIdsToAddState, setIndividualIdsToAddState] = useState((item.individual&& item.individual.id) ? [item.individual.id] : []);
  const [library_dataIdsToAddState, setLibrary_dataIdsToAddState] = useState([]);
  const library_dataIdsToAdd = useRef([]);
  const [library_dataIdsToRemoveState, setLibrary_dataIdsToRemoveState] = useState([]);
  const library_dataIdsToRemove = useRef([]);
  const sequencing_experimentIdsToAdd = useRef((item.sequencing_experiment&& item.sequencing_experiment.id) ? [item.sequencing_experiment.id] : []);
  const [sequencing_experimentIdsToAddState, setSequencing_experimentIdsToAddState] = useState((item.sequencing_experiment&& item.sequencing_experiment.id) ? [item.sequencing_experiment.id] : []);
  const [transcript_countsIdsToAddState, setTranscript_countsIdsToAddState] = useState([]);
  const transcript_countsIdsToAdd = useRef([]);
  const [transcript_countsIdsToRemoveState, setTranscript_countsIdsToRemoveState] = useState([]);
  const transcript_countsIdsToRemove = useRef([]);

  const [individualDetailDialogOpen, setIndividualDetailDialogOpen] = useState(false);
  const [individualDetailItem, setIndividualDetailItem] = useState(undefined);
  const [nuc_acid_library_resultDetailDialogOpen, setNuc_acid_library_resultDetailDialogOpen] = useState(false);
  const [nuc_acid_library_resultDetailItem, setNuc_acid_library_resultDetailItem] = useState(undefined);
  const [sequencing_experimentDetailDialogOpen, setSequencing_experimentDetailDialogOpen] = useState(false);
  const [sequencing_experimentDetailItem, setSequencing_experimentDetailItem] = useState(undefined);
  const [transcript_countDetailDialogOpen, setTranscript_countDetailDialogOpen] = useState(false);
  const [transcript_countDetailItem, setTranscript_countDetailItem] = useState(undefined);

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
      lastModelChanged.sample&&
      lastModelChanged.sample[String(item.id)]) {

        //updated item
        if(lastModelChanged.sample[String(item.id)].op === "update"&&
            lastModelChanged.sample[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.sample[String(item.id)].op === "delete") {
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
    if (individualDetailItem !== undefined) {
      setIndividualDetailDialogOpen(true);
    }
  }, [individualDetailItem]);
  useEffect(() => {
    if (nuc_acid_library_resultDetailItem !== undefined) {
      setNuc_acid_library_resultDetailDialogOpen(true);
    }
  }, [nuc_acid_library_resultDetailItem]);
  useEffect(() => {
    if (sequencing_experimentDetailItem !== undefined) {
      setSequencing_experimentDetailDialogOpen(true);
    }
  }, [sequencing_experimentDetailItem]);
  useEffect(() => {
    if (transcript_countDetailItem !== undefined) {
      setTranscript_countDetailDialogOpen(true);
    }
  }, [transcript_countDetailItem]);

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
    initialValues.sampling_date = item.sampling_date;
    initialValues.type = item.type;
    initialValues.biological_replicate_no = item.biological_replicate_no;
    initialValues.lab_code = item.lab_code;
    initialValues.treatment = item.treatment;
    initialValues.tissue = item.tissue;
    initialValues.individual_id = item.individual_id;
    initialValues.sequencing_experiment_id = item.sequencing_experiment_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.individual_id = item.individual_id;
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

  initialValueOkStates.name = (item.name!==null ? 1 : 0);
  initialValueOkStates.sampling_date = (item.sampling_date!==null ? 1 : 0);
  initialValueOkStates.type = (item.type!==null ? 1 : 0);
  initialValueOkStates.biological_replicate_no = (item.biological_replicate_no!==null ? 1 : 0);
  initialValueOkStates.lab_code = (item.lab_code!==null ? 1 : 0);
  initialValueOkStates.treatment = (item.treatment!==null ? 1 : 0);
  initialValueOkStates.tissue = (item.tissue!==null ? 1 : 0);
    initialValueOkStates.individual_id = -2; //FK
    initialValueOkStates.sequencing_experiment_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.name = {errors: []};
    _initialValueAjvStates.sampling_date = {errors: []};
    _initialValueAjvStates.type = {errors: []};
    _initialValueAjvStates.biological_replicate_no = {errors: []};
    _initialValueAjvStates.lab_code = {errors: []};
    _initialValueAjvStates.treatment = {errors: []};
    _initialValueAjvStates.tissue = {errors: []};
    _initialValueAjvStates.individual_id = {errors: []}; //FK
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
    if(values.current.name !== item.name) { return true;}
    if(values.current.sampling_date !== item.sampling_date) { return true;}
    if(values.current.type !== item.type) { return true;}
    if(Number(values.current.biological_replicate_no) !== Number(item.biological_replicate_no)) { return true;}
    if(values.current.lab_code !== item.lab_code) { return true;}
    if(values.current.treatment !== item.treatment) { return true;}
    if(values.current.tissue !== item.tissue) { return true;}
    if(Number(values.current.individual_id) !== Number(item.individual_id)) { return true;}
    if(Number(values.current.sequencing_experiment_id) !== Number(item.sequencing_experiment_id)) { return true;}
    return false;
  }

  function setAddRemoveIndividual(variables) {
    //data to notify changes
    changedAssociations.current.individual = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.individual&&item.individual.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(individualIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.individual.id!== individualIdsToAdd.current[0]) {
          //set id to add
          variables.addIndividual = individualIdsToAdd.current[0];
          
          changedAssociations.current.individual.added = true;
          changedAssociations.current.individual.idsAdded = individualIdsToAdd.current;
          changedAssociations.current.individual.removed = true;
          changedAssociations.current.individual.idsRemoved = [item.individual.id];
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
        variables.removeIndividual = item.individual.id;
        
        changedAssociations.current.individual.removed = true;
        changedAssociations.current.individual.idsRemoved = [item.individual.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(individualIdsToAdd.current.length>0) {
        //set id to add
        variables.addIndividual = individualIdsToAdd.current[0];
        
        changedAssociations.current.individual.added = true;
        changedAssociations.current.individual.idsAdded = individualIdsToAdd.current;
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
    delete variables.individual_id;
    delete variables.sequencing_experiment_id;

    //add & remove: to_one's
    setAddRemoveIndividual(variables);
    setAddRemoveSequencing_experiment(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.library_data = {added: false, removed: false};
    
    if(library_dataIdsToAdd.current.length>0) {
      variables.addLibrary_data = library_dataIdsToAdd.current;
      
      changedAssociations.current.library_data.added = true;
      changedAssociations.current.library_data.idsAdded = library_dataIdsToAdd.current;
    }
    if(library_dataIdsToRemove.current.length>0) {
      variables.removeLibrary_data = library_dataIdsToRemove.current;
      
      changedAssociations.current.library_data.removed = true;
      changedAssociations.current.library_data.idsRemoved = library_dataIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.transcript_counts = {added: false, removed: false};
    
    if(transcript_countsIdsToAdd.current.length>0) {
      variables.addTranscript_counts = transcript_countsIdsToAdd.current;
      
      changedAssociations.current.transcript_counts.added = true;
      changedAssociations.current.transcript_counts.idsAdded = transcript_countsIdsToAdd.current;
    }
    if(transcript_countsIdsToRemove.current.length>0) {
      variables.removeTranscript_counts = transcript_countsIdsToRemove.current;
      
      changedAssociations.current.transcript_counts.removed = true;
      changedAssociations.current.transcript_counts.idsRemoved = transcript_countsIdsToRemove.current;
    }

    /*
      API Request: updateSample
    */
    let cancelableApiReq = makeCancelable(api.sample.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'sample', query: 'updateSample', method: 'doSave()', request: 'api.sample.updateItem'}];
          newError.path=['Samples', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSample
        let updateSample = response.data.data.updateSample;
        if(updateSample === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateSample ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'sample', query: 'updateSample', method: 'doSave()', request: 'api.sample.updateItem'}];
          newError.path=['Samples', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateSample type
        if(typeof updateSample !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'sample ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'sample', query: 'updateSample', method: 'doSave()', request: 'api.sample.updateItem'}];
          newError.path=['Samples', `id:${item.id}`, 'update'];
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
          newError.message = 'updateSample ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'sample', query: 'updateSample', method: 'doSave()', request: 'api.sample.updateItem'}];
          newError.path=['Samples', `id:${item.id}`, 'update'];
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
        onClose(event, true, updateSample);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.sample.updateItem
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
          newError.locations=[{model: 'sample', query: 'updateSample', method: 'doSave()', request: 'api.sample.updateItem'}];
          newError.path=['Samples', `id:${item.id}`, 'update'];
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
      case 'individual':
        individualIdsToAdd.current = [];
        individualIdsToAdd.current.push(itemId);
        setIndividualIdsToAddState(individualIdsToAdd.current);
        handleSetValue(itemId, 1, 'individual_id');
        setForeignKeys({...foreignKeys, individual_id: itemId});
        break;
      case 'library_data':
        library_dataIdsToAdd.current.push(itemId);
        setLibrary_dataIdsToAddState(library_dataIdsToAdd.current);
        break;
      case 'sequencing_experiment':
        sequencing_experimentIdsToAdd.current = [];
        sequencing_experimentIdsToAdd.current.push(itemId);
        setSequencing_experimentIdsToAddState(sequencing_experimentIdsToAdd.current);
        handleSetValue(itemId, 1, 'sequencing_experiment_id');
        setForeignKeys({...foreignKeys, sequencing_experiment_id: itemId});
        break;
      case 'transcript_counts':
        transcript_countsIdsToAdd.current.push(itemId);
        setTranscript_countsIdsToAddState(transcript_countsIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'individual') {
      individualIdsToAdd.current = [];
      setIndividualIdsToAddState([]);
      handleSetValue(null, 0, 'individual_id');
      setForeignKeys({...foreignKeys, individual_id: null});
      return;
    }//end: case 'individual'
    if(associationKey === 'library_data') {
      for(let i=0; i<library_dataIdsToAdd.current.length; ++i)
      {
        if(library_dataIdsToAdd.current[i] === itemId) {
          library_dataIdsToAdd.current.splice(i, 1);
          setLibrary_dataIdsToAddState(library_dataIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'library_data'
    if(associationKey === 'sequencing_experiment') {
      sequencing_experimentIdsToAdd.current = [];
      setSequencing_experimentIdsToAddState([]);
      handleSetValue(null, 0, 'sequencing_experiment_id');
      setForeignKeys({...foreignKeys, sequencing_experiment_id: null});
      return;
    }//end: case 'sequencing_experiment'
    if(associationKey === 'transcript_counts') {
      for(let i=0; i<transcript_countsIdsToAdd.current.length; ++i)
      {
        if(transcript_countsIdsToAdd.current[i] === itemId) {
          transcript_countsIdsToAdd.current.splice(i, 1);
          setTranscript_countsIdsToAddState(transcript_countsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'transcript_counts'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'library_data':
        library_dataIdsToRemove.current.push(itemId);
        setLibrary_dataIdsToRemoveState(library_dataIdsToRemove.current);
        break;
      case 'transcript_counts':
        transcript_countsIdsToRemove.current.push(itemId);
        setTranscript_countsIdsToRemoveState(transcript_countsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'library_data') {
      for(let i=0; i<library_dataIdsToRemove.current.length; ++i)
      {
        if(library_dataIdsToRemove.current[i] === itemId) {
          library_dataIdsToRemove.current.splice(i, 1);
          setLibrary_dataIdsToRemoveState(library_dataIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'library_data'
    if(associationKey === 'transcript_counts') {
      for(let i=0; i<transcript_countsIdsToRemove.current.length; ++i)
      {
        if(transcript_countsIdsToRemove.current[i] === itemId) {
          transcript_countsIdsToRemove.current.splice(i, 1);
          setTranscript_countsIdsToRemoveState(transcript_countsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'transcript_counts'
  }

  const handleClickOnIndividualRow = (event, item) => {
    setIndividualDetailItem(item);
  };

  const handleIndividualDetailDialogClose = (event) => {
    delayedCloseIndividualDetailPanel(event, 500);
  }

  const delayedCloseIndividualDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setIndividualDetailDialogOpen(false);
        setIndividualDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

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

  const handleClickOnTranscript_countRow = (event, item) => {
    setTranscript_countDetailItem(item);
  };

  const handleTranscript_countDetailDialogClose = (event) => {
    delayedCloseTranscript_countDetailPanel(event, 500);
  }

  const delayedCloseTranscript_countDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTranscript_countDetailDialogOpen(false);
        setTranscript_countDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Sample | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " sample" }>
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
            <SampleTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <SampleAttributesPage
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
            <SampleAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              individualIdsToAdd={individualIdsToAddState}
              library_dataIdsToAdd={library_dataIdsToAddState}
              library_dataIdsToRemove={library_dataIdsToRemoveState}
              sequencing_experimentIdsToAdd={sequencing_experimentIdsToAddState}
              transcript_countsIdsToAdd={transcript_countsIdsToAddState}
              transcript_countsIdsToRemove={transcript_countsIdsToRemoveState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
              handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
              handleClickOnSequencing_experimentRow={handleClickOnSequencing_experimentRow}
              handleClickOnTranscript_countRow={handleClickOnTranscript_countRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <SampleConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Individual Detail Panel */}
        {(individualDetailDialogOpen) && (
          <IndividualDetailPanel
            permissions={permissions}
            item={individualDetailItem}
            dialog={true}
            handleClose={handleIndividualDetailDialogClose}
          />
        )}
        {/* Dialog: Nuc_acid_library_result Detail Panel */}
        {(nuc_acid_library_resultDetailDialogOpen) && (
          <NucAcidLibraryResultDetailPanel
            permissions={permissions}
            item={nuc_acid_library_resultDetailItem}
            dialog={true}
            handleClose={handleNuc_acid_library_resultDetailDialogClose}
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
        {/* Dialog: Transcript_count Detail Panel */}
        {(transcript_countDetailDialogOpen) && (
          <TranscriptCountDetailPanel
            permissions={permissions}
            item={transcript_countDetailItem}
            dialog={true}
            handleClose={handleTranscript_countDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
SampleUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
