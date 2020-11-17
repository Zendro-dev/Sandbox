import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import ObservationAttributesPage from './components/observation-attributes-page/ObservationAttributesPage'
import ObservationAssociationsPage from './components/observation-associations-page/ObservationAssociationsPage'
import ObservationTabsA from './components/ObservationTabsA'
import ObservationConfirmationDialog from './components/ObservationConfirmationDialog'
import GermplasmDetailPanel from '../../../germplasm-table/components/germplasm-detail-panel/GermplasmDetailPanel'
import ImageDetailPanel from '../../../image-table/components/image-detail-panel/ImageDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import ObservationVariableDetailPanel from '../../../observationVariable-table/components/observationVariable-detail-panel/ObservationVariableDetailPanel'
import SeasonDetailPanel from '../../../season-table/components/season-detail-panel/SeasonDetailPanel'
import StudyDetailPanel from '../../../study-table/components/study-detail-panel/StudyDetailPanel'
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

export default function ObservationUpdatePanel(props) {
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
  
  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState([]);
  const germplasmIdsToAdd = useRef([]);
  const [germplasmIdsToRemoveState, setGermplasmIdsToRemoveState] = useState([]);
  const germplasmIdsToRemove = useRef([]);
  const [imageIdsToAddState, setImageIdsToAddState] = useState([]);
  const imageIdsToAdd = useRef([]);
  const [imageIdsToRemoveState, setImageIdsToRemoveState] = useState([]);
  const imageIdsToRemove = useRef([]);
  const [observationUnitIdsToAddState, setObservationUnitIdsToAddState] = useState([]);
  const observationUnitIdsToAdd = useRef([]);
  const [observationUnitIdsToRemoveState, setObservationUnitIdsToRemoveState] = useState([]);
  const observationUnitIdsToRemove = useRef([]);
  const [observationVariableIdsToAddState, setObservationVariableIdsToAddState] = useState([]);
  const observationVariableIdsToAdd = useRef([]);
  const [observationVariableIdsToRemoveState, setObservationVariableIdsToRemoveState] = useState([]);
  const observationVariableIdsToRemove = useRef([]);
  const [seasonIdsToAddState, setSeasonIdsToAddState] = useState([]);
  const seasonIdsToAdd = useRef([]);
  const [seasonIdsToRemoveState, setSeasonIdsToRemoveState] = useState([]);
  const seasonIdsToRemove = useRef([]);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState([]);
  const studyIdsToAdd = useRef([]);
  const [studyIdsToRemoveState, setStudyIdsToRemoveState] = useState([]);
  const studyIdsToRemove = useRef([]);

  const [germplasmDetailDialogOpen, setGermplasmDetailDialogOpen] = useState(false);
  const [germplasmDetailItem, setGermplasmDetailItem] = useState(undefined);
  const [imageDetailDialogOpen, setImageDetailDialogOpen] = useState(false);
  const [imageDetailItem, setImageDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [observationVariableDetailDialogOpen, setObservationVariableDetailDialogOpen] = useState(false);
  const [observationVariableDetailItem, setObservationVariableDetailItem] = useState(undefined);
  const [seasonDetailDialogOpen, setSeasonDetailDialogOpen] = useState(false);
  const [seasonDetailItem, setSeasonDetailItem] = useState(undefined);
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
      lastModelChanged.observation&&
      lastModelChanged.observation[String(item.observationDbId)]) {

        //updated item
        if(lastModelChanged.observation[String(item.observationDbId)].op === "update"&&
            lastModelChanged.observation[String(item.observationDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.observation[String(item.observationDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.observationDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (germplasmDetailItem !== undefined) {
      setGermplasmDetailDialogOpen(true);
    }
  }, [germplasmDetailItem]);
  useEffect(() => {
    if (imageDetailItem !== undefined) {
      setImageDetailDialogOpen(true);
    }
  }, [imageDetailItem]);
  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);
  useEffect(() => {
    if (observationVariableDetailItem !== undefined) {
      setObservationVariableDetailDialogOpen(true);
    }
  }, [observationVariableDetailItem]);
  useEffect(() => {
    if (seasonDetailItem !== undefined) {
      setSeasonDetailDialogOpen(true);
    }
  }, [seasonDetailItem]);
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

    initialValues.collector = item.collector;
    initialValues.germplasmDbId = item.germplasmDbId;
    initialValues.observationTimeStamp = item.observationTimeStamp;
    initialValues.observationUnitDbId = item.observationUnitDbId;
    initialValues.observationVariableDbId = item.observationVariableDbId;
    initialValues.studyDbId = item.studyDbId;
    initialValues.uploadedBy = item.uploadedBy;
    initialValues.value = item.value;
    initialValues.observationDbId = item.observationDbId;
    initialValues.seasonDbId = item.seasonDbId;
    initialValues.imageDbId = item.imageDbId;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.seasonDbId = item.seasonDbId;
    initialForeignKeys.germplasmDbId = item.germplasmDbId;
    initialForeignKeys.observationUnitDbId = item.observationUnitDbId;
    initialForeignKeys.observationVariableDbId = item.observationVariableDbId;
    initialForeignKeys.studyDbId = item.studyDbId;
    initialForeignKeys.imageDbId = item.imageDbId;

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

  initialValueOkStates.collector = (item.collector!==null ? 1 : 0);
    initialValueOkStates.germplasmDbId = -2; //FK
  initialValueOkStates.observationTimeStamp = (item.observationTimeStamp!==null ? 1 : 0);
    initialValueOkStates.observationUnitDbId = -2; //FK
    initialValueOkStates.observationVariableDbId = -2; //FK
    initialValueOkStates.studyDbId = -2; //FK
  initialValueOkStates.uploadedBy = (item.uploadedBy!==null ? 1 : 0);
  initialValueOkStates.value = (item.value!==null ? 1 : 0);
  initialValueOkStates.observationDbId = (item.observationDbId!==null ? 1 : 0);
    initialValueOkStates.seasonDbId = -2; //FK
    initialValueOkStates.imageDbId = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.collector = {errors: []};
    _initialValueAjvStates.germplasmDbId = {errors: []}; //FK
    _initialValueAjvStates.observationTimeStamp = {errors: []};
    _initialValueAjvStates.observationUnitDbId = {errors: []}; //FK
    _initialValueAjvStates.observationVariableDbId = {errors: []}; //FK
    _initialValueAjvStates.studyDbId = {errors: []}; //FK
    _initialValueAjvStates.uploadedBy = {errors: []};
    _initialValueAjvStates.value = {errors: []};
    _initialValueAjvStates.observationDbId = {errors: []};
    _initialValueAjvStates.seasonDbId = {errors: []}; //FK
    _initialValueAjvStates.imageDbId = {errors: []}; //FK

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
    if(values.current.collector !== item.collector) { return true;}
    if(values.current.germplasmDbId !== item.germplasmDbId) { return true;}
    if((values.current.observationTimeStamp === null || item.observationTimeStamp === null) && item.observationTimeStamp !== values.current.observationTimeStamp) { return true; }
    if(values.current.observationTimeStamp !== null && item.observationTimeStamp !== null && !moment(values.current.observationTimeStamp).isSame(item.observationTimeStamp)) { return true; }
    if(values.current.observationUnitDbId !== item.observationUnitDbId) { return true;}
    if(values.current.observationVariableDbId !== item.observationVariableDbId) { return true;}
    if(values.current.studyDbId !== item.studyDbId) { return true;}
    if(values.current.uploadedBy !== item.uploadedBy) { return true;}
    if(values.current.value !== item.value) { return true;}
    if(values.current.observationDbId !== item.observationDbId) { return true;}
    if(values.current.seasonDbId !== item.seasonDbId) { return true;}
    if(values.current.imageDbId !== item.imageDbId) { return true;}
    return false;
  }

  function setAddRemoveOneGermplasm(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_germplasmDbId) changedAssociations.current.observation_germplasmDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(germplasmIdsToAdd.current.length>0) {
      //set id to add
      variables.addGermplasm = germplasmIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_germplasmDbId.added = true;
      changedAssociations.current.observation_germplasmDbId.idsAdded = [germplasmIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(germplasmIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeGermplasm = germplasmIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_germplasmDbId.removed = true;
      changedAssociations.current.observation_germplasmDbId.idsRemoved = [germplasmIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneImage(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_imageDbId) changedAssociations.current.observation_imageDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(imageIdsToAdd.current.length>0) {
      //set id to add
      variables.addImage = imageIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_imageDbId.added = true;
      changedAssociations.current.observation_imageDbId.idsAdded = [imageIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(imageIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeImage = imageIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_imageDbId.removed = true;
      changedAssociations.current.observation_imageDbId.idsRemoved = [imageIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneObservationUnit(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_observationUnitDbId) changedAssociations.current.observation_observationUnitDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitIdsToAdd.current.length>0) {
      //set id to add
      variables.addObservationUnit = observationUnitIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_observationUnitDbId.added = true;
      changedAssociations.current.observation_observationUnitDbId.idsAdded = [observationUnitIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeObservationUnit = observationUnitIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_observationUnitDbId.removed = true;
      changedAssociations.current.observation_observationUnitDbId.idsRemoved = [observationUnitIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneObservationVariable(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_observationVariableDbId) changedAssociations.current.observation_observationVariableDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationVariableIdsToAdd.current.length>0) {
      //set id to add
      variables.addObservationVariable = observationVariableIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_observationVariableDbId.added = true;
      changedAssociations.current.observation_observationVariableDbId.idsAdded = [observationVariableIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationVariableIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeObservationVariable = observationVariableIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_observationVariableDbId.removed = true;
      changedAssociations.current.observation_observationVariableDbId.idsRemoved = [observationVariableIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneSeason(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_seasonDbId) changedAssociations.current.observation_seasonDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(seasonIdsToAdd.current.length>0) {
      //set id to add
      variables.addSeason = seasonIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_seasonDbId.added = true;
      changedAssociations.current.observation_seasonDbId.idsAdded = [seasonIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(seasonIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeSeason = seasonIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_seasonDbId.removed = true;
      changedAssociations.current.observation_seasonDbId.idsRemoved = [seasonIdsToRemove.current[0]];
    }

    return;
  }
  function setAddRemoveOneStudy(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_studyDbId) changedAssociations.current.observation_studyDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(studyIdsToAdd.current.length>0) {
      //set id to add
      variables.addStudy = studyIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.observation_studyDbId.added = true;
      changedAssociations.current.observation_studyDbId.idsAdded = [studyIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(studyIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeStudy = studyIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.observation_studyDbId.removed = true;
      changedAssociations.current.observation_studyDbId.idsRemoved = [studyIdsToRemove.current[0]];
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
    
    delete variables.germplasmDbId; //FK
    delete variables.observationUnitDbId; //FK
    delete variables.observationVariableDbId; //FK
    delete variables.studyDbId; //FK
    delete variables.seasonDbId; //FK
    delete variables.imageDbId; //FK

    //add & remove: to_one's
    setAddRemoveOneGermplasm(variables);
    setAddRemoveOneImage(variables);
    setAddRemoveOneObservationUnit(variables);
    setAddRemoveOneObservationVariable(variables);
    setAddRemoveOneSeason(variables);
    setAddRemoveOneStudy(variables);

    //add & remove: to_many's

    /*
      API Request: api.observation.updateItem
    */
    let cancelableApiReq = makeCancelable(api.observation.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.updateItem'}];
            newError.path=['Observations', `observationDbId:${item.observationDbId}`, 'update'];
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
          newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.updateItem'}];
          newError.path=['Observations', `observationDbId:${item.observationDbId}`, 'update'];
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
      .catch((err) => { //error: on api.observation.updateItem
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
          newError.locations=[{model: 'observation', method: 'doSave()', request: 'api.observation.updateItem'}];
          newError.path=['Observations', `observationDbId:${item.observationDbId}`, 'update'];
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
      case 'germplasm':
        germplasmIdsToAdd.current = [];
        germplasmIdsToAdd.current.push(itemId);
        setGermplasmIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        break;
      case 'image':
        imageIdsToAdd.current = [];
        imageIdsToAdd.current.push(itemId);
        setImageIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'imageDbId');
        setForeignKeys({...foreignKeys, imageDbId: itemId});
        break;
      case 'observationUnit':
        observationUnitIdsToAdd.current = [];
        observationUnitIdsToAdd.current.push(itemId);
        setObservationUnitIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        break;
      case 'observationVariable':
        observationVariableIdsToAdd.current = [];
        observationVariableIdsToAdd.current.push(itemId);
        setObservationVariableIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'observationVariableDbId');
        setForeignKeys({...foreignKeys, observationVariableDbId: itemId});
        break;
      case 'season':
        seasonIdsToAdd.current = [];
        seasonIdsToAdd.current.push(itemId);
        setSeasonIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'seasonDbId');
        setForeignKeys({...foreignKeys, seasonDbId: itemId});
        break;
      case 'study':
        studyIdsToAdd.current = [];
        studyIdsToAdd.current.push(itemId);
        setStudyIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'germplasm') {
      if(germplasmIdsToAdd.current.length > 0
      && germplasmIdsToAdd.current[0] === itemId) {
        germplasmIdsToAdd.current = [];
        setGermplasmIdsToAddState([]);
        handleSetValue(null, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: null});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'image') {
      if(imageIdsToAdd.current.length > 0
      && imageIdsToAdd.current[0] === itemId) {
        imageIdsToAdd.current = [];
        setImageIdsToAddState([]);
        handleSetValue(null, -2, 'imageDbId');
        setForeignKeys({...foreignKeys, imageDbId: null});
      }
      return;
    }//end: case 'image'
    if(associationKey === 'observationUnit') {
      if(observationUnitIdsToAdd.current.length > 0
      && observationUnitIdsToAdd.current[0] === itemId) {
        observationUnitIdsToAdd.current = [];
        setObservationUnitIdsToAddState([]);
        handleSetValue(null, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: null});
      }
      return;
    }//end: case 'observationUnit'
    if(associationKey === 'observationVariable') {
      if(observationVariableIdsToAdd.current.length > 0
      && observationVariableIdsToAdd.current[0] === itemId) {
        observationVariableIdsToAdd.current = [];
        setObservationVariableIdsToAddState([]);
        handleSetValue(null, -2, 'observationVariableDbId');
        setForeignKeys({...foreignKeys, observationVariableDbId: null});
      }
      return;
    }//end: case 'observationVariable'
    if(associationKey === 'season') {
      if(seasonIdsToAdd.current.length > 0
      && seasonIdsToAdd.current[0] === itemId) {
        seasonIdsToAdd.current = [];
        setSeasonIdsToAddState([]);
        handleSetValue(null, -2, 'seasonDbId');
        setForeignKeys({...foreignKeys, seasonDbId: null});
      }
      return;
    }//end: case 'season'
    if(associationKey === 'study') {
      if(studyIdsToAdd.current.length > 0
      && studyIdsToAdd.current[0] === itemId) {
        studyIdsToAdd.current = [];
        setStudyIdsToAddState([]);
        handleSetValue(null, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: null});
      }
      return;
    }//end: case 'study'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'germplasm':
          germplasmIdsToRemove.current = [];
          germplasmIdsToRemove.current.push(itemId);
          setGermplasmIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'germplasmDbId');
          setForeignKeys({...foreignKeys, germplasmDbId: null});
        break;
        case 'image':
          imageIdsToRemove.current = [];
          imageIdsToRemove.current.push(itemId);
          setImageIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'imageDbId');
          setForeignKeys({...foreignKeys, imageDbId: null});
        break;
        case 'observationUnit':
          observationUnitIdsToRemove.current = [];
          observationUnitIdsToRemove.current.push(itemId);
          setObservationUnitIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'observationUnitDbId');
          setForeignKeys({...foreignKeys, observationUnitDbId: null});
        break;
        case 'observationVariable':
          observationVariableIdsToRemove.current = [];
          observationVariableIdsToRemove.current.push(itemId);
          setObservationVariableIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'observationVariableDbId');
          setForeignKeys({...foreignKeys, observationVariableDbId: null});
        break;
        case 'season':
          seasonIdsToRemove.current = [];
          seasonIdsToRemove.current.push(itemId);
          setSeasonIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'seasonDbId');
          setForeignKeys({...foreignKeys, seasonDbId: null});
        break;
        case 'study':
          studyIdsToRemove.current = [];
          studyIdsToRemove.current.push(itemId);
          setStudyIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'studyDbId');
          setForeignKeys({...foreignKeys, studyDbId: null});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'germplasm') {
      if(germplasmIdsToRemove.current.length > 0
      && germplasmIdsToRemove.current[0] === itemId) {
        germplasmIdsToRemove.current = [];
        setGermplasmIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
      }
      return;
    }//end: case 'germplasm'
    if(associationKey === 'image') {
      if(imageIdsToRemove.current.length > 0
      && imageIdsToRemove.current[0] === itemId) {
        imageIdsToRemove.current = [];
        setImageIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'imageDbId');
        setForeignKeys({...foreignKeys, imageDbId: itemId});
      }
      return;
    }//end: case 'image'
    if(associationKey === 'observationUnit') {
      if(observationUnitIdsToRemove.current.length > 0
      && observationUnitIdsToRemove.current[0] === itemId) {
        observationUnitIdsToRemove.current = [];
        setObservationUnitIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
      }
      return;
    }//end: case 'observationUnit'
    if(associationKey === 'observationVariable') {
      if(observationVariableIdsToRemove.current.length > 0
      && observationVariableIdsToRemove.current[0] === itemId) {
        observationVariableIdsToRemove.current = [];
        setObservationVariableIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'observationVariableDbId');
        setForeignKeys({...foreignKeys, observationVariableDbId: itemId});
      }
      return;
    }//end: case 'observationVariable'
    if(associationKey === 'season') {
      if(seasonIdsToRemove.current.length > 0
      && seasonIdsToRemove.current[0] === itemId) {
        seasonIdsToRemove.current = [];
        setSeasonIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'seasonDbId');
        setForeignKeys({...foreignKeys, seasonDbId: itemId});
      }
      return;
    }//end: case 'season'
    if(associationKey === 'study') {
      if(studyIdsToRemove.current.length > 0
      && studyIdsToRemove.current[0] === itemId) {
        studyIdsToRemove.current = [];
        setStudyIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
      }
      return;
    }//end: case 'study'
  }

  const handleClickOnGermplasmRow = (event, item) => {
    setGermplasmDetailItem(item);
  };

  const handleGermplasmDetailDialogClose = (event) => {
    delayedCloseGermplasmDetailPanel(event, 500);
  }

  const delayedCloseGermplasmDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setGermplasmDetailDialogOpen(false);
        setGermplasmDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnImageRow = (event, item) => {
    setImageDetailItem(item);
  };

  const handleImageDetailDialogClose = (event) => {
    delayedCloseImageDetailPanel(event, 500);
  }

  const delayedCloseImageDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setImageDetailDialogOpen(false);
        setImageDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnObservationUnitRow = (event, item) => {
    setObservationUnitDetailItem(item);
  };

  const handleObservationUnitDetailDialogClose = (event) => {
    delayedCloseObservationUnitDetailPanel(event, 500);
  }

  const delayedCloseObservationUnitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationUnitDetailDialogOpen(false);
        setObservationUnitDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnObservationVariableRow = (event, item) => {
    setObservationVariableDetailItem(item);
  };

  const handleObservationVariableDetailDialogClose = (event) => {
    delayedCloseObservationVariableDetailPanel(event, 500);
  }

  const delayedCloseObservationVariableDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationVariableDetailDialogOpen(false);
        setObservationVariableDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnSeasonRow = (event, item) => {
    setSeasonDetailItem(item);
  };

  const handleSeasonDetailDialogClose = (event) => {
    delayedCloseSeasonDetailPanel(event, 500);
  }

  const delayedCloseSeasonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSeasonDetailDialogOpen(false);
        setSeasonDetailItem(undefined);
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
    <Dialog id='ObservationUpdatePanel-dialog' 
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
              id='ObservationUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Observation | observationDbId: " + item.observationDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observation" }>
              <Fab
                id='ObservationUpdatePanel-fabButton-save' 
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
            <ObservationTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ObservationAttributesPage
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
              <ObservationAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                germplasmIdsToAdd={germplasmIdsToAddState}
                germplasmIdsToRemove={germplasmIdsToRemoveState}
                imageIdsToAdd={imageIdsToAddState}
                imageIdsToRemove={imageIdsToRemoveState}
                observationUnitIdsToAdd={observationUnitIdsToAddState}
                observationUnitIdsToRemove={observationUnitIdsToRemoveState}
                observationVariableIdsToAdd={observationVariableIdsToAddState}
                observationVariableIdsToRemove={observationVariableIdsToRemoveState}
                seasonIdsToAdd={seasonIdsToAddState}
                seasonIdsToRemove={seasonIdsToRemoveState}
                studyIdsToAdd={studyIdsToAddState}
                studyIdsToRemove={studyIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                handleClickOnImageRow={handleClickOnImageRow}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <ObservationConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Germplasm Detail Panel */}
        {(germplasmDetailDialogOpen) && (
          <GermplasmDetailPanel
            permissions={permissions}
            item={germplasmDetailItem}
            dialog={true}
            handleClose={handleGermplasmDetailDialogClose}
          />
        )}
        {/* Dialog: Image Detail Panel */}
        {(imageDetailDialogOpen) && (
          <ImageDetailPanel
            permissions={permissions}
            item={imageDetailItem}
            dialog={true}
            handleClose={handleImageDetailDialogClose}
          />
        )}
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <ObservationUnitDetailPanel
            permissions={permissions}
            item={observationUnitDetailItem}
            dialog={true}
            handleClose={handleObservationUnitDetailDialogClose}
          />
        )}
        {/* Dialog: ObservationVariable Detail Panel */}
        {(observationVariableDetailDialogOpen) && (
          <ObservationVariableDetailPanel
            permissions={permissions}
            item={observationVariableDetailItem}
            dialog={true}
            handleClose={handleObservationVariableDetailDialogClose}
          />
        )}
        {/* Dialog: Season Detail Panel */}
        {(seasonDetailDialogOpen) && (
          <SeasonDetailPanel
            permissions={permissions}
            item={seasonDetailItem}
            dialog={true}
            handleClose={handleSeasonDetailDialogClose}
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
ObservationUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
