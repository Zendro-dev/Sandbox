import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
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
  notiErrorActionText: {
    color: '#eba0a0',
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
  
  const breedingMethodIdsToAdd = useRef((item.breedingMethod&& item.breedingMethod.breedingMethodDbId) ? [item.breedingMethod.breedingMethodDbId] : []);
  const [breedingMethodIdsToAddState, setBreedingMethodIdsToAddState] = useState((item.breedingMethod&& item.breedingMethod.breedingMethodDbId) ? [item.breedingMethod.breedingMethodDbId] : []);
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

  function setAddRemoveBreedingMethod(variables) {
    //data to notify changes
    changedAssociations.current.breedingMethod = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.breedingMethod&&item.breedingMethod.breedingMethodDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(breedingMethodIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.breedingMethod.breedingMethodDbId!== breedingMethodIdsToAdd.current[0]) {
          //set id to add
          variables.addBreedingMethod = breedingMethodIdsToAdd.current[0];
          
          changedAssociations.current.breedingMethod.added = true;
          changedAssociations.current.breedingMethod.idsAdded = breedingMethodIdsToAdd.current;
          changedAssociations.current.breedingMethod.removed = true;
          changedAssociations.current.breedingMethod.idsRemoved = [item.breedingMethod.breedingMethodDbId];
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
        variables.removeBreedingMethod = item.breedingMethod.breedingMethodDbId;
        
        changedAssociations.current.breedingMethod.removed = true;
        changedAssociations.current.breedingMethod.idsRemoved = [item.breedingMethod.breedingMethodDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(breedingMethodIdsToAdd.current.length>0) {
        //set id to add
        variables.addBreedingMethod = breedingMethodIdsToAdd.current[0];
        
        changedAssociations.current.breedingMethod.added = true;
        changedAssociations.current.breedingMethod.idsAdded = breedingMethodIdsToAdd.current;
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
    delete variables.breedingMethodDbId;

    //add & remove: to_one's
    setAddRemoveBreedingMethod(variables);

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
    //data to notify changes
    changedAssociations.current.observationUnits = {added: false, removed: false};
    
    if(observationUnitsIdsToAdd.current.length>0) {
      variables.addObservationUnits = observationUnitsIdsToAdd.current;
      
      changedAssociations.current.observationUnits.added = true;
      changedAssociations.current.observationUnits.idsAdded = observationUnitsIdsToAdd.current;
    }
    if(observationUnitsIdsToRemove.current.length>0) {
      variables.removeObservationUnits = observationUnitsIdsToRemove.current;
      
      changedAssociations.current.observationUnits.removed = true;
      changedAssociations.current.observationUnits.idsRemoved = observationUnitsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.germplasm.updateItem(graphqlServerUrl, variables));
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
            onClose(event, true, response.data.data.updateGermplasm);
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
      case 'breedingMethod':
        breedingMethodIdsToAdd.current = [];
        breedingMethodIdsToAdd.current.push(itemId);
        setBreedingMethodIdsToAddState(breedingMethodIdsToAdd.current);
        handleSetValue(itemId, 1, 'breedingMethodDbId');
        setForeignKeys({...foreignKeys, breedingMethodDbId: itemId});
        break;
      case 'observations':
        observationsIdsToAdd.current.push(itemId);
        setObservationsIdsToAddState(observationsIdsToAdd.current);
        break;
      case 'observationUnits':
        observationUnitsIdsToAdd.current.push(itemId);
        setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'breedingMethod') {
      breedingMethodIdsToAdd.current = [];
      setBreedingMethodIdsToAddState([]);
      handleSetValue(null, 0, 'breedingMethodDbId');
      setForeignKeys({...foreignKeys, breedingMethodDbId: null});
      return;
    }//end: case 'breedingMethod'
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
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToAdd.current.length; ++i)
      {
        if(observationUnitsIdsToAdd.current[i] === itemId) {
          observationUnitsIdsToAdd.current.splice(i, 1);
          setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'observationUnits'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'observations':
        observationsIdsToRemove.current.push(itemId);
        setObservationsIdsToRemoveState(observationsIdsToRemove.current);
        break;
      case 'observationUnits':
        observationUnitsIdsToRemove.current.push(itemId);
        setObservationUnitsIdsToRemoveState(observationUnitsIdsToRemove.current);
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
    if(associationKey === 'observationUnits') {
      for(let i=0; i<observationUnitsIdsToRemove.current.length; ++i)
      {
        if(observationUnitsIdsToRemove.current[i] === itemId) {
          observationUnitsIdsToRemove.current.splice(i, 1);
          setObservationUnitsIdsToRemoveState(observationUnitsIdsToRemove.current);
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
            { t('modelPanels.editing') +  ": Germplasm | germplasmDbId: " + item.germplasmDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " germplasm" }>
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
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <GermplasmAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              breedingMethodIdsToAdd={breedingMethodIdsToAddState}
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
