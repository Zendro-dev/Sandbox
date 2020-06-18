import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
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

export default function SampleCreatePanel(props) {
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

  const [individualIdsToAddState, setIndividualIdsToAddState] = useState([]);
  const individualIdsToAdd = useRef([]);
  const [library_dataIdsToAddState, setLibrary_dataIdsToAddState] = useState([]);
  const library_dataIdsToAdd = useRef([]);
  const [sequencing_experimentIdsToAddState, setSequencing_experimentIdsToAddState] = useState([]);
  const sequencing_experimentIdsToAdd = useRef([]);
  const [transcript_countsIdsToAddState, setTranscript_countsIdsToAddState] = useState([]);
  const transcript_countsIdsToAdd = useRef([]);

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
    
    initialValues.name = null;
    initialValues.sampling_date = null;
    initialValues.type = null;
    initialValues.biological_replicate_no = null;
    initialValues.lab_code = null;
    initialValues.treatment = null;
    initialValues.tissue = null;
    initialValues.individual_id = null;
    initialValues.sequencing_experiment_id = null;

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
    initialValueOkStates.sampling_date = 0;
    initialValueOkStates.type = 0;
    initialValueOkStates.biological_replicate_no = 0;
    initialValueOkStates.lab_code = 0;
    initialValueOkStates.treatment = 0;
    initialValueOkStates.tissue = 0;
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

  function setAddIndividual(variables) {
    if(individualIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addIndividual = individualIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddSequencing_experiment(variables) {
    if(sequencing_experimentIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addSequencing_experiment = sequencing_experimentIdsToAdd.current[0];
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
    delete variables.individual_id;
    delete variables.sequencing_experiment_id;

    //add: to_one's
    setAddIndividual(variables);
    setAddSequencing_experiment(variables);
    
    //add: to_many's
    variables.addLibrary_data = library_dataIdsToAdd.current;
    variables.addTranscript_counts = transcript_countsIdsToAdd.current;

    /*
      API Request: addSample
    */
    let cancelableApiReq = makeCancelable(api.sample.createItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'sample', query: 'addSample', method: 'doSave()', request: 'api.sample.createItem'}];
          newError.path=['Samples', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addSample
        let addSample = response.data.data.addSample;
        if(addSample === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'addSample ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'sample', query: 'addSample', method: 'doSave()', request: 'api.sample.createItem'}];
          newError.path=['Samples', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addSample type
        if(typeof addSample !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'sample ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'sample', query: 'addSample', method: 'doSave()', request: 'api.sample.createItem'}];
          newError.path=['Samples', 'add'];
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
          newError.message = 'addSample ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'sample', query: 'addSample', method: 'doSave()', request: 'api.sample.createItem'}];
          newError.path=['Samples', 'add'];
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
        onClose(event, true, addSample);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.sample.createItem
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
          newError.locations=[{model: 'sample', query: 'addSample', method: 'doSave()', request: 'api.sample.createItem'}];
          newError.path=['Samples', 'add'];
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
      case 'individual':
        if(individualIdsToAdd.current.indexOf(itemId) === -1) {
          individualIdsToAdd.current = [];
          individualIdsToAdd.current.push(itemId);
          setIndividualIdsToAddState(individualIdsToAdd.current);
          handleSetValue(itemId, 1, 'individual_id');
          setForeignKeys({...foreignKeys, individual_id: itemId});
        }
        break;
      case 'library_data':
        if(library_dataIdsToAdd.current.indexOf(itemId) === -1) {
          library_dataIdsToAdd.current.push(itemId);
          setLibrary_dataIdsToAddState(library_dataIdsToAdd.current);
        }
        break;
      case 'sequencing_experiment':
        if(sequencing_experimentIdsToAdd.current.indexOf(itemId) === -1) {
          sequencing_experimentIdsToAdd.current = [];
          sequencing_experimentIdsToAdd.current.push(itemId);
          setSequencing_experimentIdsToAddState(sequencing_experimentIdsToAdd.current);
          handleSetValue(itemId, 1, 'sequencing_experiment_id');
          setForeignKeys({...foreignKeys, sequencing_experiment_id: itemId});
        }
        break;
      case 'transcript_counts':
        if(transcript_countsIdsToAdd.current.indexOf(itemId) === -1) {
          transcript_countsIdsToAdd.current.push(itemId);
          setTranscript_countsIdsToAddState(transcript_countsIdsToAdd.current);
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'individual') {
      if(individualIdsToAdd.current.length > 0) {
        individualIdsToAdd.current = [];
        setIndividualIdsToAddState([]);
        handleSetValue(null, 0, 'individual_id');
        setForeignKeys({...foreignKeys, individual_id: null});
      }
      return;
    }//end: case 'individual'
    if(associationKey === 'library_data') {
      let iof = library_dataIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        library_dataIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'library_data'
    if(associationKey === 'sequencing_experiment') {
      if(sequencing_experimentIdsToAdd.current.length > 0) {
        sequencing_experimentIdsToAdd.current = [];
        setSequencing_experimentIdsToAddState([]);
        handleSetValue(null, 0, 'sequencing_experiment_id');
        setForeignKeys({...foreignKeys, sequencing_experiment_id: null});
      }
      return;
    }//end: case 'sequencing_experiment'
    if(associationKey === 'transcript_counts') {
      let iof = transcript_countsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        transcript_countsIdsToAdd.current.splice(iof, 1);
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
            {t('modelPanels.new') + ' Sample'}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <SampleTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <SampleAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <SampleAssociationsPage
              hidden={tabsValue !== 1}
              individualIdsToAdd={individualIdsToAddState}
              library_dataIdsToAdd={library_dataIdsToAddState}
              sequencing_experimentIdsToAdd={sequencing_experimentIdsToAddState}
              transcript_countsIdsToAdd={transcript_countsIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
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
SampleCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};