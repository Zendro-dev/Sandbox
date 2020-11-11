import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import InvestigationAttributesPage from './components/investigation-attributes-page/InvestigationAttributesPage'
import InvestigationAssociationsPage from './components/investigation-associations-page/InvestigationAssociationsPage'
import InvestigationTabsA from './components/InvestigationTabsA'
import InvestigationConfirmationDialog from './components/InvestigationConfirmationDialog'
import ContactDetailPanel from '../../../contact-table/components/contact-detail-panel/ContactDetailPanel'
import FileAttachmentDetailPanel from '../../../fileAttachment-table/components/fileAttachment-detail-panel/FileAttachmentDetailPanel'
import OntologyAnnotationDetailPanel from '../../../ontologyAnnotation-table/components/ontologyAnnotation-detail-panel/OntologyAnnotationDetailPanel'
import StudyDetailPanel from '../../../study-table/components/study-detail-panel/StudyDetailPanel'
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

export default function InvestigationCreatePanel(props) {
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

  const [contactsIdsToAddState, setContactsIdsToAddState] = useState([]);
  const contactsIdsToAdd = useRef([]);
  const [fileAttachmentsIdsToAddState, setFileAttachmentsIdsToAddState] = useState([]);
  const fileAttachmentsIdsToAdd = useRef([]);
  const [ontologyAnnotationsIdsToAddState, setOntologyAnnotationsIdsToAddState] = useState([]);
  const ontologyAnnotationsIdsToAdd = useRef([]);
  const [studiesIdsToAddState, setStudiesIdsToAddState] = useState([]);
  const studiesIdsToAdd = useRef([]);

  const [contactDetailDialogOpen, setContactDetailDialogOpen] = useState(false);
  const [contactDetailItem, setContactDetailItem] = useState(undefined);
  const [fileAttachmentDetailDialogOpen, setFileAttachmentDetailDialogOpen] = useState(false);
  const [fileAttachmentDetailItem, setFileAttachmentDetailItem] = useState(undefined);
  const [ontologyAnnotationDetailDialogOpen, setOntologyAnnotationDetailDialogOpen] = useState(false);
  const [ontologyAnnotationDetailItem, setOntologyAnnotationDetailItem] = useState(undefined);
  const [studyDetailDialogOpen, setStudyDetailDialogOpen] = useState(false);
  const [studyDetailItem, setStudyDetailItem] = useState(undefined);

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
    if (contactDetailItem !== undefined) {
      setContactDetailDialogOpen(true);
    }
  }, [contactDetailItem]);

  useEffect(() => {
    if (fileAttachmentDetailItem !== undefined) {
      setFileAttachmentDetailDialogOpen(true);
    }
  }, [fileAttachmentDetailItem]);

  useEffect(() => {
    if (ontologyAnnotationDetailItem !== undefined) {
      setOntologyAnnotationDetailDialogOpen(true);
    }
  }, [ontologyAnnotationDetailItem]);

  useEffect(() => {
    if (studyDetailItem !== undefined) {
      setStudyDetailDialogOpen(true);
    }
  }, [studyDetailItem]);


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
    
    initialValues.investigation_id = null;
    initialValues.title = null;
    initialValues.description = null;
    initialValues.startDate = null;
    initialValues.endDate = null;
    initialValues.ontologyAnnotation_ids = null;
    initialValues.contact_ids = null;
    initialValues.fileAttachment_ids = null;

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

    initialValueOkStates.investigation_id = 0;
    initialValueOkStates.title = 0;
    initialValueOkStates.description = 0;
    initialValueOkStates.startDate = 0;
    initialValueOkStates.endDate = 0;
    initialValueOkStates.ontologyAnnotation_ids = -2; //FK
    initialValueOkStates.contact_ids = -2; //FK
    initialValueOkStates.fileAttachment_ids = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.investigation_id = {errors: []};
    _initialValueAjvStates.title = {errors: []};
    _initialValueAjvStates.description = {errors: []};
    _initialValueAjvStates.startDate = {errors: []};
    _initialValueAjvStates.endDate = {errors: []};
    _initialValueAjvStates.ontologyAnnotation_ids = {errors: []}; //FK
    _initialValueAjvStates.contact_ids = {errors: []}; //FK
    _initialValueAjvStates.fileAttachment_ids = {errors: []}; //FK

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
    delete variables.ontologyAnnotation_ids;
    delete variables.contact_ids;
    delete variables.fileAttachment_ids;

    //add: to_one's
    
    //add: to_many's
    variables.addContacts = [...contactsIdsToAdd.current];
    variables.addFileAttachments = [...fileAttachmentsIdsToAdd.current];
    variables.addOntologyAnnotations = [...ontologyAnnotationsIdsToAdd.current];
    variables.addStudies = [...studiesIdsToAdd.current];

    /*
      API Request: api.investigation.createItem
    */
    let cancelableApiReq = makeCancelable(api.investigation.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'investigation', method: 'doSave()', request: 'api.investigation.createItem'}];
            newError.path=['Investigations', 'add'];
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
          newError.locations=[{model: 'investigation', method: 'doSave()', request: 'api.investigation.createItem'}];
          newError.path=['Investigations', 'add'];
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
      .catch((err) => { //error: on api.investigation.createItem
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
          newError.locations=[{model: 'investigation', method: 'doSave()', request: 'api.investigation.createItem'}];
          newError.path=['Investigations', 'add'];
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
      case 'contacts':
        if(contactsIdsToAdd.current.indexOf(itemId) === -1) {
          contactsIdsToAdd.current.push(itemId);
          setContactsIdsToAddState(contactsIdsToAdd.current);
          handleSetValue(itemId, -2, 'contact_ids');
          setForeignKeys({...foreignKeys, contact_ids: itemId});
        }
        break;
      case 'fileAttachments':
        if(fileAttachmentsIdsToAdd.current.indexOf(itemId) === -1) {
          fileAttachmentsIdsToAdd.current.push(itemId);
          setFileAttachmentsIdsToAddState(fileAttachmentsIdsToAdd.current);
          handleSetValue(itemId, -2, 'fileAttachment_ids');
          setForeignKeys({...foreignKeys, fileAttachment_ids: itemId});
        }
        break;
      case 'ontologyAnnotations':
        if(ontologyAnnotationsIdsToAdd.current.indexOf(itemId) === -1) {
          ontologyAnnotationsIdsToAdd.current.push(itemId);
          setOntologyAnnotationsIdsToAddState(ontologyAnnotationsIdsToAdd.current);
          handleSetValue(itemId, -2, 'ontologyAnnotation_ids');
          setForeignKeys({...foreignKeys, ontologyAnnotation_ids: itemId});
        }
        break;
      case 'studies':
        if(studiesIdsToAdd.current.indexOf(itemId) === -1) {
          studiesIdsToAdd.current.push(itemId);
          setStudiesIdsToAddState(studiesIdsToAdd.current);
          handleSetValue(itemId, -2, 'investigation_id');
          setForeignKeys({...foreignKeys, investigation_id: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'contacts') {
      let iof = contactsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        contactsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'contact_ids');
        setForeignKeys({...foreignKeys, contact_ids: null});
      }
      return;
    }//end: case 'contacts'
    if(associationKey === 'fileAttachments') {
      let iof = fileAttachmentsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        fileAttachmentsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'fileAttachment_ids');
        setForeignKeys({...foreignKeys, fileAttachment_ids: null});
      }
      return;
    }//end: case 'fileAttachments'
    if(associationKey === 'ontologyAnnotations') {
      let iof = ontologyAnnotationsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        ontologyAnnotationsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'ontologyAnnotation_ids');
        setForeignKeys({...foreignKeys, ontologyAnnotation_ids: null});
      }
      return;
    }//end: case 'ontologyAnnotations'
    if(associationKey === 'studies') {
      let iof = studiesIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        studiesIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'investigation_id');
        setForeignKeys({...foreignKeys, investigation_id: null});
      }
      return;
    }//end: case 'studies'
  }

  const handleClickOnContactRow = (event, item) => {
    setContactDetailItem(item);
  };

  const handleContactDetailDialogClose = (event) => {
    delayedCloseContactDetailPanel(event, 500);
  }

  const delayedCloseContactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setContactDetailDialogOpen(false);
        setContactDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnFileAttachmentRow = (event, item) => {
    setFileAttachmentDetailItem(item);
  };

  const handleFileAttachmentDetailDialogClose = (event) => {
    delayedCloseFileAttachmentDetailPanel(event, 500);
  }

  const delayedCloseFileAttachmentDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setFileAttachmentDetailDialogOpen(false);
        setFileAttachmentDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnOntologyAnnotationRow = (event, item) => {
    setOntologyAnnotationDetailItem(item);
  };

  const handleOntologyAnnotationDetailDialogClose = (event) => {
    delayedCloseOntologyAnnotationDetailPanel(event, 500);
  }

  const delayedCloseOntologyAnnotationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setOntologyAnnotationDetailDialogOpen(false);
        setOntologyAnnotationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnStudyRow = (event, item) => {
    setStudyDetailItem(item);
  };

  const handleStudyDetailDialogClose = (event) => {
    delayedCloseStudyDetailPanel(event, 500);
  }

  const delayedCloseStudyDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudyDetailDialogOpen(false);
        setStudyDetailItem(undefined);
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
    
    <Dialog id='InvestigationCreatePanel-dialog'  
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
              id='InvestigationCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Investigation'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " investigation" }>
            <Fab
              id='InvestigationCreatePanel-fabButton-save' 
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
              <InvestigationTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <InvestigationAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <InvestigationAssociationsPage
                hidden={tabsValue !== 1}
                contactsIdsToAdd={contactsIdsToAddState}
                fileAttachmentsIdsToAdd={fileAttachmentsIdsToAddState}
                ontologyAnnotationsIdsToAdd={ontologyAnnotationsIdsToAddState}
                studiesIdsToAdd={studiesIdsToAddState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnContactRow={handleClickOnContactRow}
                handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <InvestigationConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Contact Detail Panel */}
        {(contactDetailDialogOpen) && (
          <ContactDetailPanel
            permissions={permissions}
            item={contactDetailItem}
            dialog={true}
            handleClose={handleContactDetailDialogClose}
          />
        )}
        {/* Dialog: FileAttachment Detail Panel */}
        {(fileAttachmentDetailDialogOpen) && (
          <FileAttachmentDetailPanel
            permissions={permissions}
            item={fileAttachmentDetailItem}
            dialog={true}
            handleClose={handleFileAttachmentDetailDialogClose}
          />
        )}
        {/* Dialog: OntologyAnnotation Detail Panel */}
        {(ontologyAnnotationDetailDialogOpen) && (
          <OntologyAnnotationDetailPanel
            permissions={permissions}
            item={ontologyAnnotationDetailItem}
            dialog={true}
            handleClose={handleOntologyAnnotationDetailDialogClose}
          />
        )}
        {/* Dialog: Study Detail Panel */}
        {(studyDetailDialogOpen) && (
          <StudyDetailPanel
            permissions={permissions}
            item={studyDetailItem}
            dialog={true}
            handleClose={handleStudyDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
InvestigationCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};