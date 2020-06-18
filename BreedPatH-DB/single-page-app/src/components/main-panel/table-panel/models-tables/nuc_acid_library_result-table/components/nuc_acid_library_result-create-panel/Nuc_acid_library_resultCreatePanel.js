import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import NucAcidLibraryResultAttributesPage from './components/nuc_acid_library_result-attributes-page/Nuc_acid_library_resultAttributesPage'
import NucAcidLibraryResultAssociationsPage from './components/nuc_acid_library_result-associations-page/Nuc_acid_library_resultAssociationsPage'
import NucAcidLibraryResultTabsA from './components/Nuc_acid_library_resultTabsA'
import NucAcidLibraryResultConfirmationDialog from './components/Nuc_acid_library_resultConfirmationDialog'
import SampleDetailPanel from '../../../sample-table/components/sample-detail-panel/SampleDetailPanel'
import SequencingExperimentDetailPanel from '../../../sequencing_experiment-table/components/sequencing_experiment-detail-panel/Sequencing_experimentDetailPanel'
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

export default function NucAcidLibraryResultCreatePanel(props) {
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

  const [sampleIdsToAddState, setSampleIdsToAddState] = useState([]);
  const sampleIdsToAdd = useRef([]);
  const [sequencing_experimentIdsToAddState, setSequencing_experimentIdsToAddState] = useState([]);
  const sequencing_experimentIdsToAdd = useRef([]);

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
    
    initialValues.lab_code = null;
    initialValues.file_name = null;
    initialValues.file_uri = null;
    initialValues.type = null;
    initialValues.insert_size = null;
    initialValues.technical_replicate = null;
    initialValues.trimmed = null;
    initialValues.sample_id = null;
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

    initialValueOkStates.lab_code = 0;
    initialValueOkStates.file_name = 0;
    initialValueOkStates.file_uri = 0;
    initialValueOkStates.type = 0;
    initialValueOkStates.insert_size = 0;
    initialValueOkStates.technical_replicate = 0;
    initialValueOkStates.trimmed = 0;
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

  function setAddSample(variables) {
    if(sampleIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addSample = sampleIdsToAdd.current[0];
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
    delete variables.sample_id;
    delete variables.sequencing_experiment_id;

    //add: to_one's
    setAddSample(variables);
    setAddSequencing_experiment(variables);
    
    //add: to_many's

    /*
      API Request: addNuc_acid_library_result
    */
    let cancelableApiReq = makeCancelable(api.nuc_acid_library_result.createItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'nuc_acid_library_result', query: 'addNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.createItem'}];
          newError.path=['Nuc_acid_library_results', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addNuc_acid_library_result
        let addNuc_acid_library_result = response.data.data.addNuc_acid_library_result;
        if(addNuc_acid_library_result === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'addNuc_acid_library_result ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'addNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.createItem'}];
          newError.path=['Nuc_acid_library_results', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: addNuc_acid_library_result type
        if(typeof addNuc_acid_library_result !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'nuc_acid_library_result ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'addNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.createItem'}];
          newError.path=['Nuc_acid_library_results', 'add'];
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
          newError.message = 'addNuc_acid_library_result ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'nuc_acid_library_result', query: 'addNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.createItem'}];
          newError.path=['Nuc_acid_library_results', 'add'];
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
        onClose(event, true, addNuc_acid_library_result);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.nuc_acid_library_result.createItem
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
          newError.locations=[{model: 'nuc_acid_library_result', query: 'addNuc_acid_library_result', method: 'doSave()', request: 'api.nuc_acid_library_result.createItem'}];
          newError.path=['Nuc_acid_library_results', 'add'];
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
      case 'sample':
        if(sampleIdsToAdd.current.indexOf(itemId) === -1) {
          sampleIdsToAdd.current = [];
          sampleIdsToAdd.current.push(itemId);
          setSampleIdsToAddState(sampleIdsToAdd.current);
          handleSetValue(itemId, 1, 'sample_id');
          setForeignKeys({...foreignKeys, sample_id: itemId});
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

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'sample') {
      if(sampleIdsToAdd.current.length > 0) {
        sampleIdsToAdd.current = [];
        setSampleIdsToAddState([]);
        handleSetValue(null, 0, 'sample_id');
        setForeignKeys({...foreignKeys, sample_id: null});
      }
      return;
    }//end: case 'sample'
    if(associationKey === 'sequencing_experiment') {
      if(sequencing_experimentIdsToAdd.current.length > 0) {
        sequencing_experimentIdsToAdd.current = [];
        setSequencing_experimentIdsToAddState([]);
        handleSetValue(null, 0, 'sequencing_experiment_id');
        setForeignKeys({...foreignKeys, sequencing_experiment_id: null});
      }
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
            {t('modelPanels.new') + ' Nuc_acid_library_result'}
          </Typography>
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
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <NucAcidLibraryResultTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <NucAcidLibraryResultAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <NucAcidLibraryResultAssociationsPage
              hidden={tabsValue !== 1}
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
NucAcidLibraryResultCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};