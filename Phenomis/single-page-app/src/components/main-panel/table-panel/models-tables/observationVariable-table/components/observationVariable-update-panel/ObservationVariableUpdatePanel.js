import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import ObservationVariableAttributesPage from './components/observationVariable-attributes-page/ObservationVariableAttributesPage'
import ObservationVariableAssociationsPage from './components/observationVariable-associations-page/ObservationVariableAssociationsPage'
import ObservationVariableTabsA from './components/ObservationVariableTabsA'
import ObservationVariableConfirmationDialog from './components/ObservationVariableConfirmationDialog'
import MethodDetailPanel from '../../../method-table/components/method-detail-panel/MethodDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import OntologyReferenceDetailPanel from '../../../ontologyReference-table/components/ontologyReference-detail-panel/OntologyReferenceDetailPanel'
import ScaleDetailPanel from '../../../scale-table/components/scale-detail-panel/ScaleDetailPanel'
import TraitDetailPanel from '../../../trait-table/components/trait-detail-panel/TraitDetailPanel'
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
  notiErrorActionText: {
    color: '#eba0a0',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ObservationVariableUpdatePanel(props) {
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
  const changedAssociations = useRef({});
  
  const methodIdsToAdd = useRef((item.method&& item.method.methodDbId) ? [item.method.methodDbId] : []);
  const [methodIdsToAddState, setMethodIdsToAddState] = useState((item.method&& item.method.methodDbId) ? [item.method.methodDbId] : []);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const ontologyReferenceIdsToAdd = useRef((item.ontologyReference&& item.ontologyReference.ontologyDbId) ? [item.ontologyReference.ontologyDbId] : []);
  const [ontologyReferenceIdsToAddState, setOntologyReferenceIdsToAddState] = useState((item.ontologyReference&& item.ontologyReference.ontologyDbId) ? [item.ontologyReference.ontologyDbId] : []);
  const scaleIdsToAdd = useRef((item.scale&& item.scale.scaleDbId) ? [item.scale.scaleDbId] : []);
  const [scaleIdsToAddState, setScaleIdsToAddState] = useState((item.scale&& item.scale.scaleDbId) ? [item.scale.scaleDbId] : []);
  const traitIdsToAdd = useRef((item.trait&& item.trait.traitDbId) ? [item.trait.traitDbId] : []);
  const [traitIdsToAddState, setTraitIdsToAddState] = useState((item.trait&& item.trait.traitDbId) ? [item.trait.traitDbId] : []);

  const [methodDetailDialogOpen, setMethodDetailDialogOpen] = useState(false);
  const [methodDetailItem, setMethodDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [ontologyReferenceDetailDialogOpen, setOntologyReferenceDetailDialogOpen] = useState(false);
  const [ontologyReferenceDetailItem, setOntologyReferenceDetailItem] = useState(undefined);
  const [scaleDetailDialogOpen, setScaleDetailDialogOpen] = useState(false);
  const [scaleDetailItem, setScaleDetailItem] = useState(undefined);
  const [traitDetailDialogOpen, setTraitDetailDialogOpen] = useState(false);
  const [traitDetailItem, setTraitDetailItem] = useState(undefined);

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

  const actionText = useRef(null);
  const action = (key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  );

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
      lastModelChanged.observationVariable&&
      lastModelChanged.observationVariable[String(item.observationVariableDbId)]) {

        //updated item
        if(lastModelChanged.observationVariable[String(item.observationVariableDbId)].op === "update"&&
            lastModelChanged.observationVariable[String(item.observationVariableDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.observationVariable[String(item.observationVariableDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.observationVariableDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (methodDetailItem !== undefined) {
      setMethodDetailDialogOpen(true);
    }
  }, [methodDetailItem]);
  useEffect(() => {
    if (observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);
  useEffect(() => {
    if (ontologyReferenceDetailItem !== undefined) {
      setOntologyReferenceDetailDialogOpen(true);
    }
  }, [ontologyReferenceDetailItem]);
  useEffect(() => {
    if (scaleDetailItem !== undefined) {
      setScaleDetailDialogOpen(true);
    }
  }, [scaleDetailItem]);
  useEffect(() => {
    if (traitDetailItem !== undefined) {
      setTraitDetailDialogOpen(true);
    }
  }, [traitDetailItem]);

  function getInitialValues() {
    let initialValues = {};

    initialValues.commonCropName = item.commonCropName;
    initialValues.defaultValue = item.defaultValue;
    initialValues.documentationURL = item.documentationURL;
    initialValues.growthStage = item.growthStage;
    initialValues.institution = item.institution;
    initialValues.language = item.language;
    initialValues.scientist = item.scientist;
    initialValues.status = item.status;
    initialValues.submissionTimestamp = item.submissionTimestamp;
    initialValues.xref = item.xref;
    initialValues.observationVariableDbId = item.observationVariableDbId;
    initialValues.observationVariableName = item.observationVariableName;
    initialValues.methodDbId = item.methodDbId;
    initialValues.scaleDbId = item.scaleDbId;
    initialValues.traitDbId = item.traitDbId;
    initialValues.ontologyDbId = item.ontologyDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.methodDbId = item.methodDbId;
    initialForeignKeys.ontologyDbId = item.ontologyDbId;
    initialForeignKeys.scaleDbId = item.scaleDbId;
    initialForeignKeys.traitDbId = item.traitDbId;

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

  initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
  initialValueOkStates.defaultValue = (item.defaultValue!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.growthStage = (item.growthStage!==null ? 1 : 0);
  initialValueOkStates.institution = (item.institution!==null ? 1 : 0);
  initialValueOkStates.language = (item.language!==null ? 1 : 0);
  initialValueOkStates.scientist = (item.scientist!==null ? 1 : 0);
  initialValueOkStates.status = (item.status!==null ? 1 : 0);
  initialValueOkStates.submissionTimestamp = (item.submissionTimestamp!==null ? 1 : 0);
  initialValueOkStates.xref = (item.xref!==null ? 1 : 0);
  initialValueOkStates.observationVariableDbId = (item.observationVariableDbId!==null ? 1 : 0);
  initialValueOkStates.observationVariableName = (item.observationVariableName!==null ? 1 : 0);
    initialValueOkStates.methodDbId = -2; //FK
    initialValueOkStates.scaleDbId = -2; //FK
    initialValueOkStates.traitDbId = -2; //FK
    initialValueOkStates.ontologyDbId = -2; //FK

    return initialValueOkStates;
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
    if(values.current.commonCropName !== item.commonCropName) { return true;}
    if(values.current.defaultValue !== item.defaultValue) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if(values.current.growthStage !== item.growthStage) { return true;}
    if(values.current.institution !== item.institution) { return true;}
    if(values.current.language !== item.language) { return true;}
    if(values.current.scientist !== item.scientist) { return true;}
    if(values.current.status !== item.status) { return true;}
    if((values.current.submissionTimestamp === null || item.submissionTimestamp === null) && item.submissionTimestamp !== values.current.submissionTimestamp) { return true; }
    if(values.current.submissionTimestamp !== null && item.submissionTimestamp !== null && !moment(values.current.submissionTimestamp).isSame(item.submissionTimestamp)) { return true; }
    if(values.current.xref !== item.xref) { return true;}
    if(values.current.observationVariableDbId !== item.observationVariableDbId) { return true;}
    if(values.current.observationVariableName !== item.observationVariableName) { return true;}
    if(values.current.methodDbId !== item.methodDbId) { return true;}
    if(values.current.scaleDbId !== item.scaleDbId) { return true;}
    if(values.current.traitDbId !== item.traitDbId) { return true;}
    if(values.current.ontologyDbId !== item.ontologyDbId) { return true;}
    return false;
  }

  function setAddRemoveMethod(variables) {
    //data to notify changes
    changedAssociations.current.method = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.method&&item.method.methodDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(methodIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.method.methodDbId!== methodIdsToAdd.current[0]) {
          //set id to add
          variables.addMethod = methodIdsToAdd.current[0];
          
          changedAssociations.current.method.added = true;
          changedAssociations.current.method.idsAdded = methodIdsToAdd.current;
          changedAssociations.current.method.removed = true;
          changedAssociations.current.method.idsRemoved = [item.method.methodDbId];
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
        variables.removeMethod = item.method.methodDbId;
        
        changedAssociations.current.method.removed = true;
        changedAssociations.current.method.idsRemoved = [item.method.methodDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(methodIdsToAdd.current.length>0) {
        //set id to add
        variables.addMethod = methodIdsToAdd.current[0];
        
        changedAssociations.current.method.added = true;
        changedAssociations.current.method.idsAdded = methodIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveOntologyReference(variables) {
    //data to notify changes
    changedAssociations.current.ontologyReference = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.ontologyReference&&item.ontologyReference.ontologyDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(ontologyReferenceIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.ontologyReference.ontologyDbId!== ontologyReferenceIdsToAdd.current[0]) {
          //set id to add
          variables.addOntologyReference = ontologyReferenceIdsToAdd.current[0];
          
          changedAssociations.current.ontologyReference.added = true;
          changedAssociations.current.ontologyReference.idsAdded = ontologyReferenceIdsToAdd.current;
          changedAssociations.current.ontologyReference.removed = true;
          changedAssociations.current.ontologyReference.idsRemoved = [item.ontologyReference.ontologyDbId];
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
        variables.removeOntologyReference = item.ontologyReference.ontologyDbId;
        
        changedAssociations.current.ontologyReference.removed = true;
        changedAssociations.current.ontologyReference.idsRemoved = [item.ontologyReference.ontologyDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(ontologyReferenceIdsToAdd.current.length>0) {
        //set id to add
        variables.addOntologyReference = ontologyReferenceIdsToAdd.current[0];
        
        changedAssociations.current.ontologyReference.added = true;
        changedAssociations.current.ontologyReference.idsAdded = ontologyReferenceIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveScale(variables) {
    //data to notify changes
    changedAssociations.current.scale = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.scale&&item.scale.scaleDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(scaleIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.scale.scaleDbId!== scaleIdsToAdd.current[0]) {
          //set id to add
          variables.addScale = scaleIdsToAdd.current[0];
          
          changedAssociations.current.scale.added = true;
          changedAssociations.current.scale.idsAdded = scaleIdsToAdd.current;
          changedAssociations.current.scale.removed = true;
          changedAssociations.current.scale.idsRemoved = [item.scale.scaleDbId];
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
        variables.removeScale = item.scale.scaleDbId;
        
        changedAssociations.current.scale.removed = true;
        changedAssociations.current.scale.idsRemoved = [item.scale.scaleDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(scaleIdsToAdd.current.length>0) {
        //set id to add
        variables.addScale = scaleIdsToAdd.current[0];
        
        changedAssociations.current.scale.added = true;
        changedAssociations.current.scale.idsAdded = scaleIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveTrait(variables) {
    //data to notify changes
    changedAssociations.current.trait = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.trait&&item.trait.traitDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(traitIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.trait.traitDbId!== traitIdsToAdd.current[0]) {
          //set id to add
          variables.addTrait = traitIdsToAdd.current[0];
          
          changedAssociations.current.trait.added = true;
          changedAssociations.current.trait.idsAdded = traitIdsToAdd.current;
          changedAssociations.current.trait.removed = true;
          changedAssociations.current.trait.idsRemoved = [item.trait.traitDbId];
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
        variables.removeTrait = item.trait.traitDbId;
        
        changedAssociations.current.trait.removed = true;
        changedAssociations.current.trait.idsRemoved = [item.trait.traitDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(traitIdsToAdd.current.length>0) {
        //set id to add
        variables.addTrait = traitIdsToAdd.current[0];
        
        changedAssociations.current.trait.added = true;
        changedAssociations.current.trait.idsAdded = traitIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }

  function doSave(event) {
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
    delete variables.methodDbId;
    delete variables.scaleDbId;
    delete variables.traitDbId;
    delete variables.ontologyDbId;

    //add & remove: to_one's
    setAddRemoveMethod(variables);
    setAddRemoveOntologyReference(variables);
    setAddRemoveScale(variables);
    setAddRemoveTrait(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.observations = {added: false, removed: false};
    
    if(observationsIdsToAdd.current.length>0) {
      variables.addObservations = observationsIdsToAdd.current;
      
      changedAssociations.current.observations.added = true;
      changedAssociations.current.observations.idsAdded = observationsIdsToAdd.current;
    }
    if(observationsIdsToRemove.current.length>0) {
      variables.removeObservations = observationsIdsToRemove.current;
      
      changedAssociations.current.observations.removed = true;
      changedAssociations.current.observations.idsRemoved = observationsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.observationVariable.updateItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(response => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response
        if (
          response.data &&
          response.data.data
        ) {
          //notify graphql errors
          if(response.data.errors) {
            actionText.current = t('modelPanels.gotIt', "Got it");
            enqueueSnackbar( t('modelPanels.errors.e3', "The GraphQL query returned a response with errors. Please contact your administrator."), {
              variant: 'error',
              preventDuplicate: false,
              persist: true,
              action,
            });
            console.log("Errors: ", response.data.errors);
          } else {

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
            onClose(event, true, response.data.data.updateObservationVariable);
          }
          return;

        } else { //error: bad response on updateItem()
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."));
          
          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
          return;
        }
      })
      .catch(({isCanceled, ...err}) => { //error: on updateItem()
        if(isCanceled) {
          return;
        } else {
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e1', "An error occurred while trying to execute the GraphQL query. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", err);
          
          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
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
      case 'method':
        methodIdsToAdd.current = [];
        methodIdsToAdd.current.push(itemId);
        setMethodIdsToAddState(methodIdsToAdd.current);
        handleSetValue(itemId, 1, 'methodDbId');
        setForeignKeys({...foreignKeys, methodDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState(observationsIdsToAdd.current);
        break;
      case 'ontologyReference':
        ontologyReferenceIdsToAdd.current = [];
        ontologyReferenceIdsToAdd.current.push(itemId);
        setOntologyReferenceIdsToAddState(ontologyReferenceIdsToAdd.current);
        handleSetValue(itemId, 1, 'ontologyDbId');
        setForeignKeys({...foreignKeys, ontologyDbId: itemId});
        break;
      case 'scale':
        scaleIdsToAdd.current = [];
        scaleIdsToAdd.current.push(itemId);
        setScaleIdsToAddState(scaleIdsToAdd.current);
        handleSetValue(itemId, 1, 'scaleDbId');
        setForeignKeys({...foreignKeys, scaleDbId: itemId});
        break;
      case 'trait':
        traitIdsToAdd.current = [];
        traitIdsToAdd.current.push(itemId);
        setTraitIdsToAddState(traitIdsToAdd.current);
        handleSetValue(itemId, 1, 'traitDbId');
        setForeignKeys({...foreignKeys, traitDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'method') {
      methodIdsToAdd.current = [];
      setMethodIdsToAddState([]);
      handleSetValue(null, 0, 'methodDbId');
      setForeignKeys({...foreignKeys, methodDbId: null});
      return;
    }//end: case 'method'
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToAdd.current.length; ++i)
      {
        if(observationsIdsToAdd.current[i] === itemId) {
          observationsIdsToAdd.current.splice(i, 1);
          setObservationsIdsToAddState(observationsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'ontologyReference') {
      ontologyReferenceIdsToAdd.current = [];
      setOntologyReferenceIdsToAddState([]);
      handleSetValue(null, 0, 'ontologyDbId');
      setForeignKeys({...foreignKeys, ontologyDbId: null});
      return;
    }//end: case 'ontologyReference'
    if(associationKey === 'scale') {
      scaleIdsToAdd.current = [];
      setScaleIdsToAddState([]);
      handleSetValue(null, 0, 'scaleDbId');
      setForeignKeys({...foreignKeys, scaleDbId: null});
      return;
    }//end: case 'scale'
    if(associationKey === 'trait') {
      traitIdsToAdd.current = [];
      setTraitIdsToAddState([]);
      handleSetValue(null, 0, 'traitDbId');
      setForeignKeys({...foreignKeys, traitDbId: null});
      return;
    }//end: case 'trait'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'observations':
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState(observationsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToRemove.current.length; ++i)
      {
        if(observationsIdsToRemove.current[i] === itemId) {
          observationsIdsToRemove.current.splice(i, 1);
          setObservationsIdsToRemoveState(observationsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'observations'
  }

  const handleClickOnMethodRow = (event, item) => {
    setMethodDetailItem(item);
  };

  const handleMethodDetailDialogClose = (event) => {
    delayedCloseMethodDetailPanel(event, 500);
  }

  const delayedCloseMethodDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setMethodDetailDialogOpen(false);
        setMethodDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnObservationRow = (event, item) => {
    setObservationDetailItem(item);
  };

  const handleObservationDetailDialogClose = (event) => {
    delayedCloseObservationDetailPanel(event, 500);
  }

  const delayedCloseObservationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationDetailDialogOpen(false);
        setObservationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnOntologyReferenceRow = (event, item) => {
    setOntologyReferenceDetailItem(item);
  };

  const handleOntologyReferenceDetailDialogClose = (event) => {
    delayedCloseOntologyReferenceDetailPanel(event, 500);
  }

  const delayedCloseOntologyReferenceDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setOntologyReferenceDetailDialogOpen(false);
        setOntologyReferenceDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnScaleRow = (event, item) => {
    setScaleDetailItem(item);
  };

  const handleScaleDetailDialogClose = (event) => {
    delayedCloseScaleDetailPanel(event, 500);
  }

  const delayedCloseScaleDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setScaleDetailDialogOpen(false);
        setScaleDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnTraitRow = (event, item) => {
    setTraitDetailItem(item);
  };

  const handleTraitDetailDialogClose = (event) => {
    delayedCloseTraitDetailPanel(event, 500);
  }

  const delayedCloseTraitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTraitDetailDialogOpen(false);
        setTraitDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": ObservationVariable | observationVariableDbId: " + item.observationVariableDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observationVariable" }>
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
            <ObservationVariableTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ObservationVariableAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <ObservationVariableAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              methodIdsToAdd={methodIdsToAddState}
              observationsIdsToAdd={observationsIdsToAddState}
              observationsIdsToRemove={observationsIdsToRemoveState}
              ontologyReferenceIdsToAdd={ontologyReferenceIdsToAddState}
              scaleIdsToAdd={scaleIdsToAddState}
              traitIdsToAdd={traitIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnMethodRow={handleClickOnMethodRow}
              handleClickOnObservationRow={handleClickOnObservationRow}
              handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
              handleClickOnScaleRow={handleClickOnScaleRow}
              handleClickOnTraitRow={handleClickOnTraitRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <ObservationVariableConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Method Detail Panel */}
        {(methodDetailDialogOpen) && (
          <MethodDetailPanel
            permissions={permissions}
            item={methodDetailItem}
            dialog={true}
            handleClose={handleMethodDetailDialogClose}
          />
        )}
        {/* Dialog: Observation Detail Panel */}
        {(observationDetailDialogOpen) && (
          <ObservationDetailPanel
            permissions={permissions}
            item={observationDetailItem}
            dialog={true}
            handleClose={handleObservationDetailDialogClose}
          />
        )}
        {/* Dialog: OntologyReference Detail Panel */}
        {(ontologyReferenceDetailDialogOpen) && (
          <OntologyReferenceDetailPanel
            permissions={permissions}
            item={ontologyReferenceDetailItem}
            dialog={true}
            handleClose={handleOntologyReferenceDetailDialogClose}
          />
        )}
        {/* Dialog: Scale Detail Panel */}
        {(scaleDetailDialogOpen) && (
          <ScaleDetailPanel
            permissions={permissions}
            item={scaleDetailItem}
            dialog={true}
            handleClose={handleScaleDetailDialogClose}
          />
        )}
        {/* Dialog: Trait Detail Panel */}
        {(traitDetailDialogOpen) && (
          <TraitDetailPanel
            permissions={permissions}
            item={traitDetailItem}
            dialog={true}
            handleClose={handleTraitDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
ObservationVariableUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
