import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import GermplasmAttributesPage from './components/germplasm-attributes-page/GermplasmAttributesPage'
import GermplasmAssociationsPage from './components/germplasm-associations-page/GermplasmAssociationsPage'
import GermplasmTabsA from './components/GermplasmTabsA'
import GermplasmConfirmationDialog from './components/GermplasmConfirmationDialog'
import BreedingMethodDetailPanel from '../../../breedingMethod-table/components/breedingMethod-detail-panel/BreedingMethodDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
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

export default function GermplasmUpdatePanel(props) {
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
  Boolean(setForeignKeys); //avoids 'unused' warning

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
  
  const [breedingMethodIdsToAddState, setBreedingMethodIdsToAddState] = useState([]);
  const breedingMethodIdsToAdd = useRef([]);
  const [breedingMethodIdsToRemoveState, setBreedingMethodIdsToRemoveState] = useState([]);
  const breedingMethodIdsToRemove = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationsIdsToRemoveState, setObservationsIdsToRemoveState] = useState([]);
  const observationsIdsToRemove = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [observationUnitsIdsToRemoveState, setObservationUnitsIdsToRemoveState] = useState([]);
  const observationUnitsIdsToRemove = useRef([]);

  const [breedingMethodDetailDialogOpen, setBreedingMethodDetailDialogOpen] = useState(false);
  const [breedingMethodDetailItem, setBreedingMethodDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);

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
      lastModelChanged.germplasm&&
      lastModelChanged.germplasm[String(item.germplasmDbId)]) {

        //updated item
        if(lastModelChanged.germplasm[String(item.germplasmDbId)].op === "update"&&
            lastModelChanged.germplasm[String(item.germplasmDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.germplasm[String(item.germplasmDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.germplasmDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (breedingMethodDetailItem !== undefined) {
      setBreedingMethodDetailDialogOpen(true);
    }
  }, [breedingMethodDetailItem]);
  useEffect(() => {
    if (observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);
  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);

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

    initialValues.accessionNumber = item.accessionNumber;
    initialValues.acquisitionDate = item.acquisitionDate;
    initialValues.breedingMethodDbId = item.breedingMethodDbId;
    initialValues.commonCropName = item.commonCropName;
    initialValues.countryOfOriginCode = item.countryOfOriginCode;
    initialValues.defaultDisplayName = item.defaultDisplayName;
    initialValues.documentationURL = item.documentationURL;
    initialValues.germplasmGenus = item.germplasmGenus;
    initialValues.germplasmName = item.germplasmName;
    initialValues.germplasmPUI = item.germplasmPUI;
    initialValues.germplasmPreprocessing = item.germplasmPreprocessing;
    initialValues.germplasmSpecies = item.germplasmSpecies;
    initialValues.germplasmSubtaxa = item.germplasmSubtaxa;
    initialValues.instituteCode = item.instituteCode;
    initialValues.instituteName = item.instituteName;
    initialValues.pedigree = item.pedigree;
    initialValues.seedSource = item.seedSource;
    initialValues.seedSourceDescription = item.seedSourceDescription;
    initialValues.speciesAuthority = item.speciesAuthority;
    initialValues.subtaxaAuthority = item.subtaxaAuthority;
    initialValues.xref = item.xref;
    initialValues.germplasmDbId = item.germplasmDbId;
    initialValues.biologicalStatusOfAccessionCode = item.biologicalStatusOfAccessionCode;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.breedingMethodDbId = item.breedingMethodDbId;

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

  initialValueOkStates.accessionNumber = (item.accessionNumber!==null ? 1 : 0);
  initialValueOkStates.acquisitionDate = (item.acquisitionDate!==null ? 1 : 0);
    initialValueOkStates.breedingMethodDbId = -2; //FK
  initialValueOkStates.commonCropName = (item.commonCropName!==null ? 1 : 0);
  initialValueOkStates.countryOfOriginCode = (item.countryOfOriginCode!==null ? 1 : 0);
  initialValueOkStates.defaultDisplayName = (item.defaultDisplayName!==null ? 1 : 0);
  initialValueOkStates.documentationURL = (item.documentationURL!==null ? 1 : 0);
  initialValueOkStates.germplasmGenus = (item.germplasmGenus!==null ? 1 : 0);
  initialValueOkStates.germplasmName = (item.germplasmName!==null ? 1 : 0);
  initialValueOkStates.germplasmPUI = (item.germplasmPUI!==null ? 1 : 0);
  initialValueOkStates.germplasmPreprocessing = (item.germplasmPreprocessing!==null ? 1 : 0);
  initialValueOkStates.germplasmSpecies = (item.germplasmSpecies!==null ? 1 : 0);
  initialValueOkStates.germplasmSubtaxa = (item.germplasmSubtaxa!==null ? 1 : 0);
  initialValueOkStates.instituteCode = (item.instituteCode!==null ? 1 : 0);
  initialValueOkStates.instituteName = (item.instituteName!==null ? 1 : 0);
  initialValueOkStates.pedigree = (item.pedigree!==null ? 1 : 0);
  initialValueOkStates.seedSource = (item.seedSource!==null ? 1 : 0);
  initialValueOkStates.seedSourceDescription = (item.seedSourceDescription!==null ? 1 : 0);
  initialValueOkStates.speciesAuthority = (item.speciesAuthority!==null ? 1 : 0);
  initialValueOkStates.subtaxaAuthority = (item.subtaxaAuthority!==null ? 1 : 0);
  initialValueOkStates.xref = (item.xref!==null ? 1 : 0);
  initialValueOkStates.germplasmDbId = (item.germplasmDbId!==null ? 1 : 0);
  initialValueOkStates.biologicalStatusOfAccessionCode = (item.biologicalStatusOfAccessionCode!==null ? 1 : 0);

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.accessionNumber = {errors: []};
    _initialValueAjvStates.acquisitionDate = {errors: []};
    _initialValueAjvStates.breedingMethodDbId = {errors: []}; //FK
    _initialValueAjvStates.commonCropName = {errors: []};
    _initialValueAjvStates.countryOfOriginCode = {errors: []};
    _initialValueAjvStates.defaultDisplayName = {errors: []};
    _initialValueAjvStates.documentationURL = {errors: []};
    _initialValueAjvStates.germplasmGenus = {errors: []};
    _initialValueAjvStates.germplasmName = {errors: []};
    _initialValueAjvStates.germplasmPUI = {errors: []};
    _initialValueAjvStates.germplasmPreprocessing = {errors: []};
    _initialValueAjvStates.germplasmSpecies = {errors: []};
    _initialValueAjvStates.germplasmSubtaxa = {errors: []};
    _initialValueAjvStates.instituteCode = {errors: []};
    _initialValueAjvStates.instituteName = {errors: []};
    _initialValueAjvStates.pedigree = {errors: []};
    _initialValueAjvStates.seedSource = {errors: []};
    _initialValueAjvStates.seedSourceDescription = {errors: []};
    _initialValueAjvStates.speciesAuthority = {errors: []};
    _initialValueAjvStates.subtaxaAuthority = {errors: []};
    _initialValueAjvStates.xref = {errors: []};
    _initialValueAjvStates.germplasmDbId = {errors: []};
    _initialValueAjvStates.biologicalStatusOfAccessionCode = {errors: []};

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
    if(values.current.accessionNumber !== item.accessionNumber) { return true;}
    if(values.current.acquisitionDate !== item.acquisitionDate) { return true;}
    if(values.current.breedingMethodDbId !== item.breedingMethodDbId) { return true;}
    if(values.current.commonCropName !== item.commonCropName) { return true;}
    if(values.current.countryOfOriginCode !== item.countryOfOriginCode) { return true;}
    if(values.current.defaultDisplayName !== item.defaultDisplayName) { return true;}
    if(values.current.documentationURL !== item.documentationURL) { return true;}
    if(values.current.germplasmGenus !== item.germplasmGenus) { return true;}
    if(values.current.germplasmName !== item.germplasmName) { return true;}
    if(values.current.germplasmPUI !== item.germplasmPUI) { return true;}
    if(values.current.germplasmPreprocessing !== item.germplasmPreprocessing) { return true;}
    if(values.current.germplasmSpecies !== item.germplasmSpecies) { return true;}
    if(values.current.germplasmSubtaxa !== item.germplasmSubtaxa) { return true;}
    if(values.current.instituteCode !== item.instituteCode) { return true;}
    if(values.current.instituteName !== item.instituteName) { return true;}
    if(values.current.pedigree !== item.pedigree) { return true;}
    if(values.current.seedSource !== item.seedSource) { return true;}
    if(values.current.seedSourceDescription !== item.seedSourceDescription) { return true;}
    if(values.current.speciesAuthority !== item.speciesAuthority) { return true;}
    if(values.current.subtaxaAuthority !== item.subtaxaAuthority) { return true;}
    if(values.current.xref !== item.xref) { return true;}
    if(values.current.germplasmDbId !== item.germplasmDbId) { return true;}
    if(values.current.biologicalStatusOfAccessionCode !== item.biologicalStatusOfAccessionCode) { return true;}
    return false;
  }

  function setAddRemoveOneBreedingMethod(variables) {
    //data to notify changes
    if(!changedAssociations.current.germplasm_breedingMethodDbId) changedAssociations.current.germplasm_breedingMethodDbId = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(breedingMethodIdsToAdd.current.length>0) {
      //set id to add
      variables.addBreedingMethod = breedingMethodIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.germplasm_breedingMethodDbId.added = true;
      changedAssociations.current.germplasm_breedingMethodDbId.idsAdded = [breedingMethodIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(breedingMethodIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeBreedingMethod = breedingMethodIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.germplasm_breedingMethodDbId.removed = true;
      changedAssociations.current.germplasm_breedingMethodDbId.idsRemoved = [breedingMethodIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyObservations(variables) {
    //data to notify changes
    if(!changedAssociations.current.observation_germplasmDbId) changedAssociations.current.observation_germplasmDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservations = [ ...observationsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observation_germplasmDbId.added = true;
      if(changedAssociations.current.observation_germplasmDbId.idsAdded){
        observationsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observation_germplasmDbId.idsAdded.includes(it)) changedAssociations.current.observation_germplasmDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observation_germplasmDbId.idsAdded = [...observationsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservations = [ ...observationsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observation_germplasmDbId.removed = true;
      if(changedAssociations.current.observation_germplasmDbId.idsRemoved){
        observationsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observation_germplasmDbId.idsRemoved.includes(it)) changedAssociations.current.observation_germplasmDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observation_germplasmDbId.idsRemoved = [...observationsIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyObservationUnits(variables) {
    //data to notify changes
    if(!changedAssociations.current.observationUnit_germplasmDbId) changedAssociations.current.observationUnit_germplasmDbId = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(observationUnitsIdsToAdd.current.length>0) {
      //set ids to add
      variables.addObservationUnits = [ ...observationUnitsIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.observationUnit_germplasmDbId.added = true;
      if(changedAssociations.current.observationUnit_germplasmDbId.idsAdded){
        observationUnitsIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.observationUnit_germplasmDbId.idsAdded.includes(it)) changedAssociations.current.observationUnit_germplasmDbId.idsAdded.push(it);});
      } else {
        changedAssociations.current.observationUnit_germplasmDbId.idsAdded = [...observationUnitsIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(observationUnitsIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeObservationUnits = [ ...observationUnitsIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.observationUnit_germplasmDbId.removed = true;
      if(changedAssociations.current.observationUnit_germplasmDbId.idsRemoved){
        observationUnitsIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.observationUnit_germplasmDbId.idsRemoved.includes(it)) changedAssociations.current.observationUnit_germplasmDbId.idsRemoved.push(it);});
      } else {
        changedAssociations.current.observationUnit_germplasmDbId.idsRemoved = [...observationUnitsIdsToRemove.current];
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
    
    delete variables.breedingMethodDbId; //FK

    //add & remove: to_one's
    setAddRemoveOneBreedingMethod(variables);

    //add & remove: to_many's
    setAddRemoveManyObservations(variables);
    setAddRemoveManyObservationUnits(variables);

    /*
      API Request: api.germplasm.updateItem
    */
    let cancelableApiReq = makeCancelable(api.germplasm.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'germplasm', method: 'doSave()', request: 'api.germplasm.updateItem'}];
            newError.path=['Germplasms', `germplasmDbId:${item.germplasmDbId}`, 'update'];
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
          newError.locations=[{model: 'germplasm', method: 'doSave()', request: 'api.germplasm.updateItem'}];
          newError.path=['Germplasms', `germplasmDbId:${item.germplasmDbId}`, 'update'];
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
      .catch((err) => { //error: on api.germplasm.updateItem
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
          newError.locations=[{model: 'germplasm', method: 'doSave()', request: 'api.germplasm.updateItem'}];
          newError.path=['Germplasms', `germplasmDbId:${item.germplasmDbId}`, 'update'];
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
      case 'breedingMethod':
        breedingMethodIdsToAdd.current = [];
        breedingMethodIdsToAdd.current.push(itemId);
        setBreedingMethodIdsToAddState([itemId]);
        handleSetValue(itemId, -2, 'breedingMethodDbId');
        setForeignKeys({...foreignKeys, breedingMethodDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState([...observationsIdsToAdd.current]);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'breedingMethod') {
      if(breedingMethodIdsToAdd.current.length > 0
      && breedingMethodIdsToAdd.current[0] === itemId) {
        breedingMethodIdsToAdd.current = [];
        setBreedingMethodIdsToAddState([]);
        handleSetValue(null, -2, 'breedingMethodDbId');
        setForeignKeys({...foreignKeys, breedingMethodDbId: null});
      }
      return;
    }//end: case 'breedingMethod'
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToAdd.current.length; ++i)
      {
        if(observationsIdsToAdd.current[i] === itemId) {
          observationsIdsToAdd.current.splice(i, 1);
          setObservationsIdsToAddState([...observationsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToAdd.current.length; ++i)
      {
        if(observationUnitsIdsToAdd.current[i] === itemId) {
          observationUnitsIdsToAdd.current.splice(i, 1);
          setObservationUnitsIdsToAddState([...observationUnitsIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'breedingMethod':
          breedingMethodIdsToRemove.current = [];
          breedingMethodIdsToRemove.current.push(itemId);
          setBreedingMethodIdsToRemoveState([itemId]);
          handleSetValue(null, -2, 'breedingMethodDbId');
          setForeignKeys({...foreignKeys, breedingMethodDbId: null});
        break;
        case 'observations':
  
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
        break;
        case 'observationUnits':
  
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'breedingMethod') {
      if(breedingMethodIdsToRemove.current.length > 0
      && breedingMethodIdsToRemove.current[0] === itemId) {
        breedingMethodIdsToRemove.current = [];
        setBreedingMethodIdsToRemoveState([]);
        handleSetValue(itemId, -2, 'breedingMethodDbId');
        setForeignKeys({...foreignKeys, breedingMethodDbId: itemId});
      }
      return;
    }//end: case 'breedingMethod'
    if(associationKey === 'observations') {
      for(let i=0; i<observationsIdsToRemove.current.length; ++i)
      {
        if(observationsIdsToRemove.current[i] === itemId) {
          observationsIdsToRemove.current.splice(i, 1);
          setObservationsIdsToRemoveState([...observationsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToRemove.current.length; ++i)
      {
        if(observationUnitsIdsToRemove.current[i] === itemId) {
          observationUnitsIdsToRemove.current.splice(i, 1);
          setObservationUnitsIdsToRemoveState([...observationUnitsIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
  }

  const handleClickOnBreedingMethodRow = (event, item) => {
    setBreedingMethodDetailItem(item);
  };

  const handleBreedingMethodDetailDialogClose = (event) => {
    delayedCloseBreedingMethodDetailPanel(event, 500);
  }

  const delayedCloseBreedingMethodDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setBreedingMethodDetailDialogOpen(false);
        setBreedingMethodDetailItem(undefined);
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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='GermplasmUpdatePanel-dialog' 
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
              id='GermplasmUpdatePanel-button-cancel'
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
            { t('modelPanels.editing') +  ": Germplasm | germplasmDbId: " + item.germplasmDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " germplasm" }>
              <Fab
                id='GermplasmUpdatePanel-fabButton-save' 
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
            <GermplasmTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <GermplasmAttributesPage
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
              <GermplasmAssociationsPage
                hidden={tabsValue !== 1 || deleted}
                item={item}
                breedingMethodIdsToAdd={breedingMethodIdsToAddState}
                breedingMethodIdsToRemove={breedingMethodIdsToRemoveState}
                observationsIdsToAdd={observationsIdsToAddState}
                observationsIdsToRemove={observationsIdsToRemoveState}
                observationUnitsIdsToAdd={observationUnitsIdsToAddState}
                observationUnitsIdsToRemove={observationUnitsIdsToRemoveState}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnBreedingMethodRow={handleClickOnBreedingMethodRow}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <GermplasmConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: BreedingMethod Detail Panel */}
        {(breedingMethodDetailDialogOpen) && (
          <BreedingMethodDetailPanel
            permissions={permissions}
            item={breedingMethodDetailItem}
            dialog={true}
            handleClose={handleBreedingMethodDetailDialogClose}
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
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <ObservationUnitDetailPanel
            permissions={permissions}
            item={observationUnitDetailItem}
            dialog={true}
            handleClose={handleObservationUnitDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
GermplasmUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
