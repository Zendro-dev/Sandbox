import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AssayResultAttributesPage from './components/assayResult-attributes-page/AssayResultAttributesPage'
import AssayResultAssociationsPage from './components/assayResult-associations-page/AssayResultAssociationsPage'
import AssayResultTabsA from './components/AssayResultTabsA'
import AssayResultConfirmationDialog from './components/AssayResultConfirmationDialog'
import AssayDetailPanel from '../../../assay-table/components/assay-detail-panel/AssayDetailPanel'
import FileAttachmentDetailPanel from '../../../fileAttachment-table/components/fileAttachment-detail-panel/FileAttachmentDetailPanel'
import MaterialDetailPanel from '../../../material-table/components/material-detail-panel/MaterialDetailPanel'
import OntologyAnnotationDetailPanel from '../../../ontologyAnnotation-table/components/ontologyAnnotation-detail-panel/OntologyAnnotationDetailPanel'
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

export default function AssayResultUpdatePanel(props) {
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
  
  const [assayIdsToAddState, setAssayIdsToAddState] = useState([]);
  const assayIdsToAdd = useRef([]);
  const [assayIdsToRemoveState, setAssayIdsToRemoveState] = useState([]);
  const assayIdsToRemove = useRef([]);
  const [fileAttachmentsIdsToAddState, setFileAttachmentsIdsToAddState] = useState([]);
  const fileAttachmentsIdsToAdd = useRef([]);
  const [fileAttachmentsIdsToRemoveState, setFileAttachmentsIdsToRemoveState] = useState([]);
  const fileAttachmentsIdsToRemove = useRef([]);
  const [observedMaterialIdsToAddState, setObservedMaterialIdsToAddState] = useState([]);
  const observedMaterialIdsToAdd = useRef([]);
  const [observedMaterialIdsToRemoveState, setObservedMaterialIdsToRemoveState] = useState([]);
  const observedMaterialIdsToRemove = useRef([]);
  const [ontologyAnnotationsIdsToAddState, setOntologyAnnotationsIdsToAddState] = useState([]);
  const ontologyAnnotationsIdsToAdd = useRef([]);
  const [ontologyAnnotationsIdsToRemoveState, setOntologyAnnotationsIdsToRemoveState] = useState([]);
  const ontologyAnnotationsIdsToRemove = useRef([]);

  const [assayDetailDialogOpen, setAssayDetailDialogOpen] = useState(false);
  const [assayDetailItem, setAssayDetailItem] = useState(undefined);
  const [fileAttachmentDetailDialogOpen, setFileAttachmentDetailDialogOpen] = useState(false);
  const [fileAttachmentDetailItem, setFileAttachmentDetailItem] = useState(undefined);
  const [materialDetailDialogOpen, setMaterialDetailDialogOpen] = useState(false);
  const [materialDetailItem, setMaterialDetailItem] = useState(undefined);
  const [ontologyAnnotationDetailDialogOpen, setOntologyAnnotationDetailDialogOpen] = useState(false);
  const [ontologyAnnotationDetailItem, setOntologyAnnotationDetailItem] = useState(undefined);

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
      lastModelChanged.assayResult&&
      lastModelChanged.assayResult[String(item.assayResult_id)]) {

        //updated item
        if(lastModelChanged.assayResult[String(item.assayResult_id)].op === "update"&&
            lastModelChanged.assayResult[String(item.assayResult_id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.assayResult[String(item.assayResult_id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.assayResult_id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (assayDetailItem !== undefined) {
      setAssayDetailDialogOpen(true);
    }
  }, [assayDetailItem]);
  useEffect(() => {
    if (fileAttachmentDetailItem !== undefined) {
      setFileAttachmentDetailDialogOpen(true);
    }
  }, [fileAttachmentDetailItem]);
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

    initialValues.assayResult_id = item.assayResult_id;
    initialValues.unit = item.unit;
    initialValues.value_as_str = item.value_as_str;
    initialValues.value_as_int = item.value_as_int;
    initialValues.value_as_num = item.value_as_num;
    initialValues.value_as_bool = item.value_as_bool;
    initialValues.value_as_float = item.value_as_float;
    initialValues.assay_id = item.assay_id;
    initialValues.material_id = item.material_id;
    initialValues.ontologyAnnotation_ids = item.ontologyAnnotation_ids;
    initialValues.fileAttachment_ids = item.fileAttachment_ids;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.assay_id = item.assay_id;
    initialForeignKeys.material_id = item.material_id;
    initialForeignKeys.fileAttachment_ids = item.fileAttachment_ids;
    initialForeignKeys.ontologyAnnotation_ids = item.ontologyAnnotation_ids;

    return initialForeignKeys;
  }

  function getInitialValueOkStates() {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
       -3: readOnly
    */
    let initialValueOkStates = {};

  initialValueOkStates.assayResult_id = (item.assayResult_id!==null ? 1 : 0);
  initialValueOkStates.unit = (item.unit!==null ? 1 : 0);
  initialValueOkStates.value_as_str = (item.value_as_str!==null ? 1 : 0);
  initialValueOkStates.value_as_int = (item.value_as_int!==null ? 1 : 0);
  initialValueOkStates.value_as_num = (item.value_as_num!==null ? 1 : 0);
  initialValueOkStates.value_as_bool = (item.value_as_bool!==null ? 1 : 0);
  initialValueOkStates.value_as_float = (item.value_as_float!==null ? 1 : 0);
    initialValueOkStates.assay_id = -2; //FK
    initialValueOkStates.material_id = -2; //FK
    initialValueOkStates.ontologyAnnotation_ids = -2; //FK
    initialValueOkStates.fileAttachment_ids = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.assayResult_id = {errors: []};
    _initialValueAjvStates.unit = {errors: []};
    _initialValueAjvStates.value_as_str = {errors: []};
    _initialValueAjvStates.value_as_int = {errors: []};
    _initialValueAjvStates.value_as_num = {errors: []};
    _initialValueAjvStates.value_as_bool = {errors: []};
    _initialValueAjvStates.value_as_float = {errors: []};
    _initialValueAjvStates.assay_id = {errors: []}; //FK
    _initialValueAjvStates.material_id = {errors: []}; //FK
    _initialValueAjvStates.ontologyAnnotation_ids = {errors: []}; //FK
    _initialValueAjvStates.fileAttachment_ids = {errors: []}; //FK

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
    if(values.current.assayResult_id !== item.assayResult_id) { return true;}
    if(values.current.unit !== item.unit) { return true;}
    if(values.current.value_as_str !== item.value_as_str) { return true;}
    if(Number(values.current.value_as_int) !== Number(item.value_as_int)) { return true;}
    if(values.current.value_as_num !== item.value_as_num) { return true;}
    if(values.current.value_as_bool !== item.value_as_bool) { return true;}
    if(values.current.value_as_float !== item.value_as_float) { return true;}
    if(values.current.assay_id !== item.assay_id) { return true;}
    if(values.current.material_id !== item.material_id) { return true;}
    if(values.current.ontologyAnnotation_ids !== item.ontologyAnnotation_ids) { return true;}
    if(values.current.fileAttachment_ids !== item.fileAttachment_ids) { return true;}
    return false;
  }

  function setAddRemoveOneAssay(variables) {
    //data to notify changes
    if(!changedAssociations.current.assayResult_assay_id) changedAssociations.current.assayResult_assay_id = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(assayIdsToAdd.current.length>0) {
      //set id to add
      variables.addAssay = assayIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.assayResult_assay_id.added = true;
      changedAssociations.current.assayResult_assay_id.idsAdded = [assayIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(assayIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeAssay = assayIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.assayResult_assay_id.removed = true;
      changedAssociations.current.assayResult_assay_id.idsRemoved = [assayIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneObservedMaterial(variables) {
    //data to notify changes
    if(!changedAssociations.current.assayResult_material_id) changedAssociations.current.assayResult_material_id = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(observedMaterialIdsToAdd.current.length>0) {
      //set id to add
      variables.addObservedMaterial = observedMaterialIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.assayResult_material_id.added = true;
      changedAssociations.current.assayResult_material_id.idsAdded = [observedMaterialIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observedMaterialIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeObservedMaterial = observedMaterialIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.assayResult_material_id.removed = true;
      changedAssociations.current.assayResult_material_id.idsRemoved = [observedMaterialIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyFileAttachments(variables) {
    //data to notify changes
    if(!changedAssociations.current.assayResult_fileAttachment_ids) changedAssociations.current.assayResult_fileAttachment_ids = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(fileAttachmentsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addFileAttachments = [ ...fileAttachmentsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.assayResult_fileAttachment_ids.added = true;
      if(changedAssociations.current.assayResult_fileAttachment_ids.idsAdded){
        fileAttachmentsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.assayResult_fileAttachment_ids.idsAdded.includes(it)) changedAssociations.current.assayResult_fileAttachment_ids.idsAdded.push(it);});
      } else {
        changedAssociations.current.assayResult_fileAttachment_ids.idsAdded = [...fileAttachmentsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(fileAttachmentsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeFileAttachments = [ ...fileAttachmentsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.assayResult_fileAttachment_ids.removed = true;
      if(changedAssociations.current.assayResult_fileAttachment_ids.idsRemoved){
        fileAttachmentsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.assayResult_fileAttachment_ids.idsRemoved.includes(it)) changedAssociations.current.assayResult_fileAttachment_ids.idsRemoved.push(it);});
      } else {
        changedAssociations.current.assayResult_fileAttachment_ids.idsRemoved = [...fileAttachmentsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyOntologyAnnotations(variables) {
    //data to notify changes
    if(!changedAssociations.current.assayResult_ontologyAnnotation_ids) changedAssociations.current.assayResult_ontologyAnnotation_ids = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(ontologyAnnotationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addOntologyAnnotations = [ ...ontologyAnnotationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.assayResult_ontologyAnnotation_ids.added = true;
      if(changedAssociations.current.assayResult_ontologyAnnotation_ids.idsAdded){
        ontologyAnnotationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.assayResult_ontologyAnnotation_ids.idsAdded.includes(it)) changedAssociations.current.assayResult_ontologyAnnotation_ids.idsAdded.push(it);});
      } else {
        changedAssociations.current.assayResult_ontologyAnnotation_ids.idsAdded = [...ontologyAnnotationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(ontologyAnnotationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeOntologyAnnotations = [ ...ontologyAnnotationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.assayResult_ontologyAnnotation_ids.removed = true;
      if(changedAssociations.current.assayResult_ontologyAnnotation_ids.idsRemoved){
        ontologyAnnotationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.assayResult_ontologyAnnotation_ids.idsRemoved.includes(it)) changedAssociations.current.assayResult_ontologyAnnotation_ids.idsRemoved.push(it);});
      } else {
        changedAssociations.current.assayResult_ontologyAnnotation_ids.idsRemoved = [...ontologyAnnotationsIdsToRemove.current];
      }
    }
    
    return;
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
    * Update new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item updated.
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
      if(valuesOkRefs.current[keys[i]] !== -1
      && valuesOkRefs.current[keys[i]] !== -2 //FK
      && valuesOkRefs.current[keys[i]] !== -3 //readOnly
      ) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }
    
    delete variables.assay_id; //FK
    delete variables.material_id; //FK
    delete variables.ontologyAnnotation_ids; //FK
    delete variables.fileAttachment_ids; //FK

    //add & remove: to_one's
    setAddRemoveOneAssay(variables);
    setAddRemoveOneObservedMaterial(variables);

    //add & remove: to_many's
    setAddRemoveManyFileAttachments(variables);
    setAddRemoveManyOntologyAnnotations(variables);

    /*
      API Request: api.assayResult.updateItem
    */
    let cancelableApiReq = makeCancelable(api.assayResult.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'assayResult', method: 'doSave()', request: 'api.assayResult.updateItem'}];
            newError.path=['AssayResults', `assayResult_id:${item.assayResult_id}`, 'update'];
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
          newError.locations=[{model: 'assayResult', method: 'doSave()', request: 'api.assayResult.updateItem'}];
          newError.path=['AssayResults', `assayResult_id:${item.assayResult_id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return false;
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
        onClose(event, true, response.value);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.assayResult.updateItem
        if(err.isCanceled) {
          return;
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'assayResult', method: 'doSave()', request: 'api.assayResult.updateItem'}];
          newError.path=['AssayResults', `assayResult_id:${item.assayResult_id}`, 'update'];
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
      case 'assay':
        assayIdsToAdd.current = [];
        assayIdsToAdd.current.push(itemId);
        setAssayIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'assay_id');
        setForeignKeys({...foreignKeys, assay_id: itemId});
        break;
      case 'fileAttachments':
        fileAttachmentsIdsToAdd.current.push(itemId);
        setFileAttachmentsIdsToAddState([...fileAttachmentsIdsToAdd.current]);
        handleSetValue(itemId, -2, 'fileAttachment_ids');
        setForeignKeys({...foreignKeys, fileAttachment_ids: itemId});
        break;
      case 'observedMaterial':
        observedMaterialIdsToAdd.current = [];
        observedMaterialIdsToAdd.current.push(itemId);
        setObservedMaterialIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'material_id');
        setForeignKeys({...foreignKeys, material_id: itemId});
        break;
      case 'ontologyAnnotations':
        ontologyAnnotationsIdsToAdd.current.push(itemId);
        setOntologyAnnotationsIdsToAddState([...ontologyAnnotationsIdsToAdd.current]);
        handleSetValue(itemId, -2, 'ontologyAnnotation_ids');
        setForeignKeys({...foreignKeys, ontologyAnnotation_ids: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'assay') {
      if(assayIdsToAdd.current.length > 0
      && assayIdsToAdd.current[0] === itemId) {
        assayIdsToAdd.current = [];
        setAssayIdsToAddState([]);
        handleSetValue(null, -2, 'assay_id');
        setForeignKeys({...foreignKeys, assay_id: null});
      }
      return;
    }//end: case 'assay'
    if(associationKey === 'fileAttachments') {
      for(let i=0; i<fileAttachmentsIdsToAdd.current.length; ++i)
      {
        if(fileAttachmentsIdsToAdd.current[i] === itemId) {
          fileAttachmentsIdsToAdd.current.splice(i, 1);
          setFileAttachmentsIdsToAddState([...fileAttachmentsIdsToAdd.current]);
          handleSetValue(null, -2, 'fileAttachment_ids');
          setForeignKeys({...foreignKeys, fileAttachment_ids: null});
          return;
        }
      }
      return;
    }//end: case 'fileAttachments'
    if(associationKey === 'observedMaterial') {
      if(observedMaterialIdsToAdd.current.length > 0
      && observedMaterialIdsToAdd.current[0] === itemId) {
        observedMaterialIdsToAdd.current = [];
        setObservedMaterialIdsToAddState([]);
        handleSetValue(null, -2, 'material_id');
        setForeignKeys({...foreignKeys, material_id: null});
      }
      return;
    }//end: case 'observedMaterial'
    if(associationKey === 'ontologyAnnotations') {
      for(let i=0; i<ontologyAnnotationsIdsToAdd.current.length; ++i)
      {
        if(ontologyAnnotationsIdsToAdd.current[i] === itemId) {
          ontologyAnnotationsIdsToAdd.current.splice(i, 1);
          setOntologyAnnotationsIdsToAddState([...ontologyAnnotationsIdsToAdd.current]);
          handleSetValue(null, -2, 'ontologyAnnotation_ids');
          setForeignKeys({...foreignKeys, ontologyAnnotation_ids: null});
          return;
        }
      }
      return;
    }//end: case 'ontologyAnnotations'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'assay':
          assayIdsToRemove.current = [];
          assayIdsToRemove.current.push(itemId);
          setAssayIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'assay_id');
          setForeignKeys({...foreignKeys, assay_id: null});
        break;
        case 'fileAttachments':
  
        fileAttachmentsIdsToRemove.current.push(itemId);
        setFileAttachmentsIdsToRemoveState([...fileAttachmentsIdsToRemove.current]);
        break;
        case 'observedMaterial':
          observedMaterialIdsToRemove.current = [];
          observedMaterialIdsToRemove.current.push(itemId);
          setObservedMaterialIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'material_id');
          setForeignKeys({...foreignKeys, material_id: null});
        break;
        case 'ontologyAnnotations':
  
        ontologyAnnotationsIdsToRemove.current.push(itemId);
        setOntologyAnnotationsIdsToRemoveState([...ontologyAnnotationsIdsToRemove.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'assay') {
      if(assayIdsToRemove.current.length > 0
      && assayIdsToRemove.current[0] === itemId) {
        assayIdsToRemove.current = [];
        setAssayIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'assay_id');
        setForeignKeys({...foreignKeys, assay_id: itemId});
      }
      return;
    }//end: case 'assay'
    if(associationKey === 'fileAttachments') {
      for(let i=0; i<fileAttachmentsIdsToRemove.current.length; ++i)
      {
        if(fileAttachmentsIdsToRemove.current[i] === itemId) {
          fileAttachmentsIdsToRemove.current.splice(i, 1);
          setFileAttachmentsIdsToRemoveState([...fileAttachmentsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'fileAttachments'
    if(associationKey === 'observedMaterial') {
      if(observedMaterialIdsToRemove.current.length > 0
      && observedMaterialIdsToRemove.current[0] === itemId) {
        observedMaterialIdsToRemove.current = [];
        setObservedMaterialIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'material_id');
        setForeignKeys({...foreignKeys, material_id: itemId});
      }
      return;
    }//end: case 'observedMaterial'
    if(associationKey === 'ontologyAnnotations') {
      for(let i=0; i<ontologyAnnotationsIdsToRemove.current.length; ++i)
      {
        if(ontologyAnnotationsIdsToRemove.current[i] === itemId) {
          ontologyAnnotationsIdsToRemove.current.splice(i, 1);
          setOntologyAnnotationsIdsToRemoveState([...ontologyAnnotationsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'ontologyAnnotations'
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='AssayResultUpdatePanel-dialog' 
      fullScreen open={open} TransitionComponent={Transition}
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
              id='AssayResultUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": AssayResult | assayResult_id: " + item.assayResult_id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " assayResult" }>
              <Fab
                id='AssayResultUpdatePanel-fabButton-save' 
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
            <AssayResultTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <AssayResultAttributesPage
              hidden={tabsValue !== 0}
              item={item}
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
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <AssayResultAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                assayIdsToAdd={assayIdsToAddState}
                assayIdsToRemove={assayIdsToRemoveState}
                fileAttachmentsIdsToAdd={fileAttachmentsIdsToAddState}
                fileAttachmentsIdsToRemove={fileAttachmentsIdsToRemoveState}
                observedMaterialIdsToAdd={observedMaterialIdsToAddState}
                observedMaterialIdsToRemove={observedMaterialIdsToRemoveState}
                ontologyAnnotationsIdsToAdd={ontologyAnnotationsIdsToAddState}
                ontologyAnnotationsIdsToRemove={ontologyAnnotationsIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnAssayRow={handleClickOnAssayRow}
                handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <AssayResultConfirmationDialog
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
        {/* Dialog: FileAttachment Detail Panel */}
        {(fileAttachmentDetailDialogOpen) && (
          <FileAttachmentDetailPanel
            permissions={permissions}
            item={fileAttachmentDetailItem}
            dialog={true}
            handleClose={handleFileAttachmentDetailDialogClose}
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
      </div>

    </Dialog>
  );
}
AssayResultUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
