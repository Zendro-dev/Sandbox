import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
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
  notiErrorActionText: {
    color: '#eba0a0',
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
  
  const germplasmIdsToAdd = useRef((item.germplasm&& item.germplasm.germplasmDbId) ? [item.germplasm.germplasmDbId] : []);
  const [germplasmIdsToAddState, setGermplasmIdsToAddState] = useState((item.germplasm&& item.germplasm.germplasmDbId) ? [item.germplasm.germplasmDbId] : []);
  const imageIdsToAdd = useRef((item.image&& item.image.imageDbId) ? [item.image.imageDbId] : []);
  const [imageIdsToAddState, setImageIdsToAddState] = useState((item.image&& item.image.imageDbId) ? [item.image.imageDbId] : []);
  const observationUnitIdsToAdd = useRef((item.observationUnit&& item.observationUnit.observationUnitDbId) ? [item.observationUnit.observationUnitDbId] : []);
  const [observationUnitIdsToAddState, setObservationUnitIdsToAddState] = useState((item.observationUnit&& item.observationUnit.observationUnitDbId) ? [item.observationUnit.observationUnitDbId] : []);
  const observationVariableIdsToAdd = useRef((item.observationVariable&& item.observationVariable.observationVariableDbId) ? [item.observationVariable.observationVariableDbId] : []);
  const [observationVariableIdsToAddState, setObservationVariableIdsToAddState] = useState((item.observationVariable&& item.observationVariable.observationVariableDbId) ? [item.observationVariable.observationVariableDbId] : []);
  const seasonIdsToAdd = useRef((item.season&& item.season.seasonDbId) ? [item.season.seasonDbId] : []);
  const [seasonIdsToAddState, setSeasonIdsToAddState] = useState((item.season&& item.season.seasonDbId) ? [item.season.seasonDbId] : []);
  const studyIdsToAdd = useRef((item.study&& item.study.studyDbId) ? [item.study.studyDbId] : []);
  const [studyIdsToAddState, setStudyIdsToAddState] = useState((item.study&& item.study.studyDbId) ? [item.study.studyDbId] : []);

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

  function setAddRemoveGermplasm(variables) {
    //data to notify changes
    changedAssociations.current.germplasm = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.germplasm&&item.germplasm.germplasmDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(germplasmIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.germplasm.germplasmDbId!== germplasmIdsToAdd.current[0]) {
          //set id to add
          variables.addGermplasm = germplasmIdsToAdd.current[0];
          
          changedAssociations.current.germplasm.added = true;
          changedAssociations.current.germplasm.idsAdded = germplasmIdsToAdd.current;
          changedAssociations.current.germplasm.removed = true;
          changedAssociations.current.germplasm.idsRemoved = [item.germplasm.germplasmDbId];
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
        variables.removeGermplasm = item.germplasm.germplasmDbId;
        
        changedAssociations.current.germplasm.removed = true;
        changedAssociations.current.germplasm.idsRemoved = [item.germplasm.germplasmDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(germplasmIdsToAdd.current.length>0) {
        //set id to add
        variables.addGermplasm = germplasmIdsToAdd.current[0];
        
        changedAssociations.current.germplasm.added = true;
        changedAssociations.current.germplasm.idsAdded = germplasmIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveImage(variables) {
    //data to notify changes
    changedAssociations.current.image = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.image&&item.image.imageDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(imageIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.image.imageDbId!== imageIdsToAdd.current[0]) {
          //set id to add
          variables.addImage = imageIdsToAdd.current[0];
          
          changedAssociations.current.image.added = true;
          changedAssociations.current.image.idsAdded = imageIdsToAdd.current;
          changedAssociations.current.image.removed = true;
          changedAssociations.current.image.idsRemoved = [item.image.imageDbId];
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
        variables.removeImage = item.image.imageDbId;
        
        changedAssociations.current.image.removed = true;
        changedAssociations.current.image.idsRemoved = [item.image.imageDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(imageIdsToAdd.current.length>0) {
        //set id to add
        variables.addImage = imageIdsToAdd.current[0];
        
        changedAssociations.current.image.added = true;
        changedAssociations.current.image.idsAdded = imageIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveObservationUnit(variables) {
    //data to notify changes
    changedAssociations.current.observationUnit = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.observationUnit&&item.observationUnit.observationUnitDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(observationUnitIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.observationUnit.observationUnitDbId!== observationUnitIdsToAdd.current[0]) {
          //set id to add
          variables.addObservationUnit = observationUnitIdsToAdd.current[0];
          
          changedAssociations.current.observationUnit.added = true;
          changedAssociations.current.observationUnit.idsAdded = observationUnitIdsToAdd.current;
          changedAssociations.current.observationUnit.removed = true;
          changedAssociations.current.observationUnit.idsRemoved = [item.observationUnit.observationUnitDbId];
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
        variables.removeObservationUnit = item.observationUnit.observationUnitDbId;
        
        changedAssociations.current.observationUnit.removed = true;
        changedAssociations.current.observationUnit.idsRemoved = [item.observationUnit.observationUnitDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(observationUnitIdsToAdd.current.length>0) {
        //set id to add
        variables.addObservationUnit = observationUnitIdsToAdd.current[0];
        
        changedAssociations.current.observationUnit.added = true;
        changedAssociations.current.observationUnit.idsAdded = observationUnitIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveObservationVariable(variables) {
    //data to notify changes
    changedAssociations.current.observationVariable = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.observationVariable&&item.observationVariable.observationVariableDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(observationVariableIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.observationVariable.observationVariableDbId!== observationVariableIdsToAdd.current[0]) {
          //set id to add
          variables.addObservationVariable = observationVariableIdsToAdd.current[0];
          
          changedAssociations.current.observationVariable.added = true;
          changedAssociations.current.observationVariable.idsAdded = observationVariableIdsToAdd.current;
          changedAssociations.current.observationVariable.removed = true;
          changedAssociations.current.observationVariable.idsRemoved = [item.observationVariable.observationVariableDbId];
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
        variables.removeObservationVariable = item.observationVariable.observationVariableDbId;
        
        changedAssociations.current.observationVariable.removed = true;
        changedAssociations.current.observationVariable.idsRemoved = [item.observationVariable.observationVariableDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(observationVariableIdsToAdd.current.length>0) {
        //set id to add
        variables.addObservationVariable = observationVariableIdsToAdd.current[0];
        
        changedAssociations.current.observationVariable.added = true;
        changedAssociations.current.observationVariable.idsAdded = observationVariableIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveSeason(variables) {
    //data to notify changes
    changedAssociations.current.season = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.season&&item.season.seasonDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(seasonIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.season.seasonDbId!== seasonIdsToAdd.current[0]) {
          //set id to add
          variables.addSeason = seasonIdsToAdd.current[0];
          
          changedAssociations.current.season.added = true;
          changedAssociations.current.season.idsAdded = seasonIdsToAdd.current;
          changedAssociations.current.season.removed = true;
          changedAssociations.current.season.idsRemoved = [item.season.seasonDbId];
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
        variables.removeSeason = item.season.seasonDbId;
        
        changedAssociations.current.season.removed = true;
        changedAssociations.current.season.idsRemoved = [item.season.seasonDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(seasonIdsToAdd.current.length>0) {
        //set id to add
        variables.addSeason = seasonIdsToAdd.current[0];
        
        changedAssociations.current.season.added = true;
        changedAssociations.current.season.idsAdded = seasonIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveStudy(variables) {
    //data to notify changes
    changedAssociations.current.study = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.study&&item.study.studyDbId) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(studyIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.study.studyDbId!== studyIdsToAdd.current[0]) {
          //set id to add
          variables.addStudy = studyIdsToAdd.current[0];
          
          changedAssociations.current.study.added = true;
          changedAssociations.current.study.idsAdded = studyIdsToAdd.current;
          changedAssociations.current.study.removed = true;
          changedAssociations.current.study.idsRemoved = [item.study.studyDbId];
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
        variables.removeStudy = item.study.studyDbId;
        
        changedAssociations.current.study.removed = true;
        changedAssociations.current.study.idsRemoved = [item.study.studyDbId];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(studyIdsToAdd.current.length>0) {
        //set id to add
        variables.addStudy = studyIdsToAdd.current[0];
        
        changedAssociations.current.study.added = true;
        changedAssociations.current.study.idsAdded = studyIdsToAdd.current;
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
    delete variables.germplasmDbId;
    delete variables.observationUnitDbId;
    delete variables.observationVariableDbId;
    delete variables.studyDbId;
    delete variables.seasonDbId;
    delete variables.imageDbId;

    //add & remove: to_one's
    setAddRemoveGermplasm(variables);
    setAddRemoveImage(variables);
    setAddRemoveObservationUnit(variables);
    setAddRemoveObservationVariable(variables);
    setAddRemoveSeason(variables);
    setAddRemoveStudy(variables);

    //add & remove: to_many's

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.observation.updateItem(graphqlServerUrl, variables));
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
            onClose(event, true, response.data.data.updateObservation);
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
      case 'germplasm':
        germplasmIdsToAdd.current = [];
        germplasmIdsToAdd.current.push(itemId);
        setGermplasmIdsToAddState(germplasmIdsToAdd.current);
        handleSetValue(itemId, 1, 'germplasmDbId');
        setForeignKeys({...foreignKeys, germplasmDbId: itemId});
        break;
      case 'image':
        imageIdsToAdd.current = [];
        imageIdsToAdd.current.push(itemId);
        setImageIdsToAddState(imageIdsToAdd.current);
        handleSetValue(itemId, 1, 'imageDbId');
        setForeignKeys({...foreignKeys, imageDbId: itemId});
        break;
      case 'observationUnit':
        observationUnitIdsToAdd.current = [];
        observationUnitIdsToAdd.current.push(itemId);
        setObservationUnitIdsToAddState(observationUnitIdsToAdd.current);
        handleSetValue(itemId, 1, 'observationUnitDbId');
        setForeignKeys({...foreignKeys, observationUnitDbId: itemId});
        break;
      case 'observationVariable':
        observationVariableIdsToAdd.current = [];
        observationVariableIdsToAdd.current.push(itemId);
        setObservationVariableIdsToAddState(observationVariableIdsToAdd.current);
        handleSetValue(itemId, 1, 'observationVariableDbId');
        setForeignKeys({...foreignKeys, observationVariableDbId: itemId});
        break;
      case 'season':
        seasonIdsToAdd.current = [];
        seasonIdsToAdd.current.push(itemId);
        setSeasonIdsToAddState(seasonIdsToAdd.current);
        handleSetValue(itemId, 1, 'seasonDbId');
        setForeignKeys({...foreignKeys, seasonDbId: itemId});
        break;
      case 'study':
        studyIdsToAdd.current = [];
        studyIdsToAdd.current.push(itemId);
        setStudyIdsToAddState(studyIdsToAdd.current);
        handleSetValue(itemId, 1, 'studyDbId');
        setForeignKeys({...foreignKeys, studyDbId: itemId});
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'germplasm') {
      germplasmIdsToAdd.current = [];
      setGermplasmIdsToAddState([]);
      handleSetValue(null, 0, 'germplasmDbId');
      setForeignKeys({...foreignKeys, germplasmDbId: null});
      return;
    }//end: case 'germplasm'
    if(associationKey === 'image') {
      imageIdsToAdd.current = [];
      setImageIdsToAddState([]);
      handleSetValue(null, 0, 'imageDbId');
      setForeignKeys({...foreignKeys, imageDbId: null});
      return;
    }//end: case 'image'
    if(associationKey === 'observationUnit') {
      observationUnitIdsToAdd.current = [];
      setObservationUnitIdsToAddState([]);
      handleSetValue(null, 0, 'observationUnitDbId');
      setForeignKeys({...foreignKeys, observationUnitDbId: null});
      return;
    }//end: case 'observationUnit'
    if(associationKey === 'observationVariable') {
      observationVariableIdsToAdd.current = [];
      setObservationVariableIdsToAddState([]);
      handleSetValue(null, 0, 'observationVariableDbId');
      setForeignKeys({...foreignKeys, observationVariableDbId: null});
      return;
    }//end: case 'observationVariable'
    if(associationKey === 'season') {
      seasonIdsToAdd.current = [];
      setSeasonIdsToAddState([]);
      handleSetValue(null, 0, 'seasonDbId');
      setForeignKeys({...foreignKeys, seasonDbId: null});
      return;
    }//end: case 'season'
    if(associationKey === 'study') {
      studyIdsToAdd.current = [];
      setStudyIdsToAddState([]);
      handleSetValue(null, 0, 'studyDbId');
      setForeignKeys({...foreignKeys, studyDbId: null});
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
            { t('modelPanels.editing') +  ": Observation | observationDbId: " + item.observationDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " observation" }>
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
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <ObservationAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              germplasmIdsToAdd={germplasmIdsToAddState}
              imageIdsToAdd={imageIdsToAddState}
              observationUnitIdsToAdd={observationUnitIdsToAddState}
              observationVariableIdsToAdd={observationVariableIdsToAddState}
              seasonIdsToAdd={seasonIdsToAddState}
              studyIdsToAdd={studyIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              handleClickOnImageRow={handleClickOnImageRow}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
              handleClickOnSeasonRow={handleClickOnSeasonRow}
              handleClickOnStudyRow={handleClickOnStudyRow}
            />
          </Grid>
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
