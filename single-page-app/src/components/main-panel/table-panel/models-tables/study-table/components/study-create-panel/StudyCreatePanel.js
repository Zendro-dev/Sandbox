import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import StudyAttributesPage from './components/study-attributes-page/StudyAttributesPage'
import StudyAssociationsPage from './components/study-associations-page/StudyAssociationsPage'
import StudyTabsA from './components/StudyTabsA'
import StudyConfirmationDialog from './components/StudyConfirmationDialog'
import AssayDetailPanel from '../../../assay-table/components/assay-detail-panel/AssayDetailPanel'
import ContactDetailPanel from '../../../contact-table/components/contact-detail-panel/ContactDetailPanel'
import FactorDetailPanel from '../../../factor-table/components/factor-detail-panel/FactorDetailPanel'
import FileAttachmentDetailPanel from '../../../fileAttachment-table/components/fileAttachment-detail-panel/FileAttachmentDetailPanel'
import InvestigationDetailPanel from '../../../investigation-table/components/investigation-detail-panel/InvestigationDetailPanel'
import MaterialDetailPanel from '../../../material-table/components/material-detail-panel/MaterialDetailPanel'
import OntologyAnnotationDetailPanel from '../../../ontologyAnnotation-table/components/ontologyAnnotation-detail-panel/OntologyAnnotationDetailPanel'
import ProtocolDetailPanel from '../../../protocol-table/components/protocol-detail-panel/ProtocolDetailPanel'
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

export default function StudyCreatePanel(props) {
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

  const [assaysIdsToAddState, setAssaysIdsToAddState] = useState([]);
  const assaysIdsToAdd = useRef([]);
  const [contactsIdsToAddState, setContactsIdsToAddState] = useState([]);
  const contactsIdsToAdd = useRef([]);
  const [factorsIdsToAddState, setFactorsIdsToAddState] = useState([]);
  const factorsIdsToAdd = useRef([]);
  const [fileAttachmentsIdsToAddState, setFileAttachmentsIdsToAddState] = useState([]);
  const fileAttachmentsIdsToAdd = useRef([]);
  const [investigationIdsToAddState, setInvestigationIdsToAddState] = useState([]);
  const investigationIdsToAdd = useRef([]);
  const [materialsIdsToAddState, setMaterialsIdsToAddState] = useState([]);
  const materialsIdsToAdd = useRef([]);
  const [ontologyAnnotationsIdsToAddState, setOntologyAnnotationsIdsToAddState] = useState([]);
  const ontologyAnnotationsIdsToAdd = useRef([]);
  const [protocolsIdsToAddState, setProtocolsIdsToAddState] = useState([]);
  const protocolsIdsToAdd = useRef([]);

  const [assayDetailDialogOpen, setAssayDetailDialogOpen] = useState(false);
  const [assayDetailItem, setAssayDetailItem] = useState(undefined);
  const [contactDetailDialogOpen, setContactDetailDialogOpen] = useState(false);
  const [contactDetailItem, setContactDetailItem] = useState(undefined);
  const [factorDetailDialogOpen, setFactorDetailDialogOpen] = useState(false);
  const [factorDetailItem, setFactorDetailItem] = useState(undefined);
  const [fileAttachmentDetailDialogOpen, setFileAttachmentDetailDialogOpen] = useState(false);
  const [fileAttachmentDetailItem, setFileAttachmentDetailItem] = useState(undefined);
  const [investigationDetailDialogOpen, setInvestigationDetailDialogOpen] = useState(false);
  const [investigationDetailItem, setInvestigationDetailItem] = useState(undefined);
  const [materialDetailDialogOpen, setMaterialDetailDialogOpen] = useState(false);
  const [materialDetailItem, setMaterialDetailItem] = useState(undefined);
  const [ontologyAnnotationDetailDialogOpen, setOntologyAnnotationDetailDialogOpen] = useState(false);
  const [ontologyAnnotationDetailItem, setOntologyAnnotationDetailItem] = useState(undefined);
  const [protocolDetailDialogOpen, setProtocolDetailDialogOpen] = useState(false);
  const [protocolDetailItem, setProtocolDetailItem] = useState(undefined);

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
    if (assayDetailItem !== undefined) {
      setAssayDetailDialogOpen(true);
    }
  }, [assayDetailItem]);

  useEffect(() => {
    if (contactDetailItem !== undefined) {
      setContactDetailDialogOpen(true);
    }
  }, [contactDetailItem]);

  useEffect(() => {
    if (factorDetailItem !== undefined) {
      setFactorDetailDialogOpen(true);
    }
  }, [factorDetailItem]);

  useEffect(() => {
    if (fileAttachmentDetailItem !== undefined) {
      setFileAttachmentDetailDialogOpen(true);
    }
  }, [fileAttachmentDetailItem]);

  useEffect(() => {
    if (investigationDetailItem !== undefined) {
      setInvestigationDetailDialogOpen(true);
    }
  }, [investigationDetailItem]);

  useEffect(() => {
    if (materialDetailItem !== undefined) {
      setMaterialDetailDialogOpen(true);
    }
  }, [materialDetailItem]);

  useEffect(() => {
    if (ontologyAnnotationDetailItem !== undefined) {
      setOntologyAnnotationDetailDialogOpen(true);
    }
  }, [ontologyAnnotationDetailItem]);

  useEffect(() => {
    if (protocolDetailItem !== undefined) {
      setProtocolDetailDialogOpen(true);
    }
  }, [protocolDetailItem]);


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
    
    initialValues.study_id = null;
    initialValues.name = null;
    initialValues.description = null;
    initialValues.startDate = null;
    initialValues.endDate = null;
    initialValues.investigation_id = null;
    initialValues.factor_ids = null;
    initialValues.protocol_ids = null;
    initialValues.contact_ids = null;
    initialValues.material_ids = null;
    initialValues.ontologyAnnotation_ids = null;
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

    initialValueOkStates.study_id = 0;
    initialValueOkStates.name = 0;
    initialValueOkStates.description = 0;
    initialValueOkStates.startDate = 0;
    initialValueOkStates.endDate = 0;
    initialValueOkStates.investigation_id = -2; //FK
    initialValueOkStates.factor_ids = -2; //FK
    initialValueOkStates.protocol_ids = -2; //FK
    initialValueOkStates.contact_ids = -2; //FK
    initialValueOkStates.material_ids = -2; //FK
    initialValueOkStates.ontologyAnnotation_ids = -2; //FK
    initialValueOkStates.fileAttachment_ids = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.study_id = {errors: []};
    _initialValueAjvStates.name = {errors: []};
    _initialValueAjvStates.description = {errors: []};
    _initialValueAjvStates.startDate = {errors: []};
    _initialValueAjvStates.endDate = {errors: []};
    _initialValueAjvStates.investigation_id = {errors: []}; //FK
    _initialValueAjvStates.factor_ids = {errors: []}; //FK
    _initialValueAjvStates.protocol_ids = {errors: []}; //FK
    _initialValueAjvStates.contact_ids = {errors: []}; //FK
    _initialValueAjvStates.material_ids = {errors: []}; //FK
    _initialValueAjvStates.ontologyAnnotation_ids = {errors: []}; //FK
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

  function setAddInvestigation(variables) {
    if(investigationIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addInvestigation = investigationIdsToAdd.current[0];
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
    delete variables.investigation_id;
    delete variables.factor_ids;
    delete variables.protocol_ids;
    delete variables.contact_ids;
    delete variables.material_ids;
    delete variables.ontologyAnnotation_ids;
    delete variables.fileAttachment_ids;

    //add: to_one's
    setAddInvestigation(variables);
    
    //add: to_many's
    variables.addAssays = [...assaysIdsToAdd.current];
    variables.addContacts = [...contactsIdsToAdd.current];
    variables.addFactors = [...factorsIdsToAdd.current];
    variables.addFileAttachments = [...fileAttachmentsIdsToAdd.current];
    variables.addMaterials = [...materialsIdsToAdd.current];
    variables.addOntologyAnnotations = [...ontologyAnnotationsIdsToAdd.current];
    variables.addProtocols = [...protocolsIdsToAdd.current];

    /*
      API Request: api.study.createItem
    */
    let cancelableApiReq = makeCancelable(api.study.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
            newError.path=['Studies', 'add'];
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
          newError.path=['Studies', 'add'];
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
      .catch((err) => { //error: on api.study.createItem
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
          newError.locations=[{model: 'study', method: 'doSave()', request: 'api.study.createItem'}];
          newError.path=['Studies', 'add'];
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
      case 'assays':
        if(assaysIdsToAdd.current.indexOf(itemId) === -1) {
          assaysIdsToAdd.current.push(itemId);
          setAssaysIdsToAddState(assaysIdsToAdd.current);
          handleSetValue(itemId, -2, 'study_id');
          setForeignKeys({...foreignKeys, study_id: itemId});
        }
        break;
      case 'contacts':
        if(contactsIdsToAdd.current.indexOf(itemId) === -1) {
          contactsIdsToAdd.current.push(itemId);
          setContactsIdsToAddState(contactsIdsToAdd.current);
          handleSetValue(itemId, -2, 'contact_ids');
          setForeignKeys({...foreignKeys, contact_ids: itemId});
        }
        break;
      case 'factors':
        if(factorsIdsToAdd.current.indexOf(itemId) === -1) {
          factorsIdsToAdd.current.push(itemId);
          setFactorsIdsToAddState(factorsIdsToAdd.current);
          handleSetValue(itemId, -2, 'factor_ids');
          setForeignKeys({...foreignKeys, factor_ids: itemId});
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
      case 'investigation':
        if(investigationIdsToAdd.current.indexOf(itemId) === -1) {
          investigationIdsToAdd.current = [];
          investigationIdsToAdd.current.push(itemId);
          setInvestigationIdsToAddState(investigationIdsToAdd.current);
          handleSetValue(itemId, -2, 'investigation_id');
          setForeignKeys({...foreignKeys, investigation_id: itemId});
        }
        break;
      case 'materials':
        if(materialsIdsToAdd.current.indexOf(itemId) === -1) {
          materialsIdsToAdd.current.push(itemId);
          setMaterialsIdsToAddState(materialsIdsToAdd.current);
          handleSetValue(itemId, -2, 'material_ids');
          setForeignKeys({...foreignKeys, material_ids: itemId});
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
      case 'protocols':
        if(protocolsIdsToAdd.current.indexOf(itemId) === -1) {
          protocolsIdsToAdd.current.push(itemId);
          setProtocolsIdsToAddState(protocolsIdsToAdd.current);
          handleSetValue(itemId, -2, 'protocol_ids');
          setForeignKeys({...foreignKeys, protocol_ids: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'assays') {
      let iof = assaysIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        assaysIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'study_id');
        setForeignKeys({...foreignKeys, study_id: null});
      }
      return;
    }//end: case 'assays'
    if(associationKey === 'contacts') {
      let iof = contactsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        contactsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'contact_ids');
        setForeignKeys({...foreignKeys, contact_ids: null});
      }
      return;
    }//end: case 'contacts'
    if(associationKey === 'factors') {
      let iof = factorsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        factorsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'factor_ids');
        setForeignKeys({...foreignKeys, factor_ids: null});
      }
      return;
    }//end: case 'factors'
    if(associationKey === 'fileAttachments') {
      let iof = fileAttachmentsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        fileAttachmentsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'fileAttachment_ids');
        setForeignKeys({...foreignKeys, fileAttachment_ids: null});
      }
      return;
    }//end: case 'fileAttachments'
    if(associationKey === 'investigation') {
      if(investigationIdsToAdd.current.length > 0) {
        investigationIdsToAdd.current = [];
        setInvestigationIdsToAddState([]);
        handleSetValue(null, -2, 'investigation_id');
        setForeignKeys({...foreignKeys, investigation_id: null});
      }
      return;
    }//end: case 'investigation'
    if(associationKey === 'materials') {
      let iof = materialsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        materialsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'material_ids');
        setForeignKeys({...foreignKeys, material_ids: null});
      }
      return;
    }//end: case 'materials'
    if(associationKey === 'ontologyAnnotations') {
      let iof = ontologyAnnotationsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        ontologyAnnotationsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'ontologyAnnotation_ids');
        setForeignKeys({...foreignKeys, ontologyAnnotation_ids: null});
      }
      return;
    }//end: case 'ontologyAnnotations'
    if(associationKey === 'protocols') {
      let iof = protocolsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        protocolsIdsToAdd.current.splice(iof, 1);
        handleSetValue(null, -2, 'protocol_ids');
        setForeignKeys({...foreignKeys, protocol_ids: null});
      }
      return;
    }//end: case 'protocols'
  }

  const handleClickOnAssayRow = (event, item) => {
    setAssayDetailItem(item);
  };

  const handleAssayDetailDialogClose = (event) => {
    delayedCloseAssayDetailPanel(event, 500);
  }

  const delayedCloseAssayDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setAssayDetailDialogOpen(false);
        setAssayDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
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
  const handleClickOnFactorRow = (event, item) => {
    setFactorDetailItem(item);
  };

  const handleFactorDetailDialogClose = (event) => {
    delayedCloseFactorDetailPanel(event, 500);
  }

  const delayedCloseFactorDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setFactorDetailDialogOpen(false);
        setFactorDetailItem(undefined);
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
  const handleClickOnInvestigationRow = (event, item) => {
    setInvestigationDetailItem(item);
  };

  const handleInvestigationDetailDialogClose = (event) => {
    delayedCloseInvestigationDetailPanel(event, 500);
  }

  const delayedCloseInvestigationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setInvestigationDetailDialogOpen(false);
        setInvestigationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnMaterialRow = (event, item) => {
    setMaterialDetailItem(item);
  };

  const handleMaterialDetailDialogClose = (event) => {
    delayedCloseMaterialDetailPanel(event, 500);
  }

  const delayedCloseMaterialDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMaterialDetailDialogOpen(false);
        setMaterialDetailItem(undefined);
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
  const handleClickOnProtocolRow = (event, item) => {
    setProtocolDetailItem(item);
  };

  const handleProtocolDetailDialogClose = (event) => {
    delayedCloseProtocolDetailPanel(event, 500);
  }

  const delayedCloseProtocolDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setProtocolDetailDialogOpen(false);
        setProtocolDetailItem(undefined);
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
    
    <Dialog id='StudyCreatePanel-dialog'  
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
              id='StudyCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Study'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " study" }>
            <Fab
              id='StudyCreatePanel-fabButton-save' 
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
              <StudyTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <StudyAttributesPage
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
              <StudyAssociationsPage
                hidden={tabsValue !== 1}
                assaysIdsToAdd={assaysIdsToAddState}
                contactsIdsToAdd={contactsIdsToAddState}
                factorsIdsToAdd={factorsIdsToAddState}
                fileAttachmentsIdsToAdd={fileAttachmentsIdsToAddState}
                investigationIdsToAdd={investigationIdsToAddState}
                materialsIdsToAdd={materialsIdsToAddState}
                ontologyAnnotationsIdsToAdd={ontologyAnnotationsIdsToAddState}
                protocolsIdsToAdd={protocolsIdsToAddState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnAssayRow={handleClickOnAssayRow}
                handleClickOnContactRow={handleClickOnContactRow}
                handleClickOnFactorRow={handleClickOnFactorRow}
                handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
                handleClickOnInvestigationRow={handleClickOnInvestigationRow}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
                handleClickOnProtocolRow={handleClickOnProtocolRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <StudyConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Assay Detail Panel */}
        {(assayDetailDialogOpen) && (
          <AssayDetailPanel
            permissions={permissions}
            item={assayDetailItem}
            dialog={true}
            handleClose={handleAssayDetailDialogClose}
          />
        )}
        {/* Dialog: Contact Detail Panel */}
        {(contactDetailDialogOpen) && (
          <ContactDetailPanel
            permissions={permissions}
            item={contactDetailItem}
            dialog={true}
            handleClose={handleContactDetailDialogClose}
          />
        )}
        {/* Dialog: Factor Detail Panel */}
        {(factorDetailDialogOpen) && (
          <FactorDetailPanel
            permissions={permissions}
            item={factorDetailItem}
            dialog={true}
            handleClose={handleFactorDetailDialogClose}
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
        {/* Dialog: Investigation Detail Panel */}
        {(investigationDetailDialogOpen) && (
          <InvestigationDetailPanel
            permissions={permissions}
            item={investigationDetailItem}
            dialog={true}
            handleClose={handleInvestigationDetailDialogClose}
          />
        )}
        {/* Dialog: Material Detail Panel */}
        {(materialDetailDialogOpen) && (
          <MaterialDetailPanel
            permissions={permissions}
            item={materialDetailItem}
            dialog={true}
            handleClose={handleMaterialDetailDialogClose}
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
        {/* Dialog: Protocol Detail Panel */}
        {(protocolDetailDialogOpen) && (
          <ProtocolDetailPanel
            permissions={permissions}
            item={protocolDetailItem}
            dialog={true}
            handleClose={handleProtocolDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
StudyCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};