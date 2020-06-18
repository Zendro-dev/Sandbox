import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import GenotypeAttributesPage from './components/genotype-attributes-page/GenotypeAttributesPage'
import GenotypeAssociationsPage from './components/genotype-associations-page/GenotypeAssociationsPage'
import GenotypeTabsA from './components/GenotypeTabsA'
import GenotypeConfirmationDialog from './components/GenotypeConfirmationDialog'
import BreedingPoolDetailPanel from '../../../breeding_pool-table/components/breeding_pool-detail-panel/Breeding_poolDetailPanel'
import FieldPlotDetailPanel from '../../../field_plot-table/components/field_plot-detail-panel/Field_plotDetailPanel'
import IndividualDetailPanel from '../../../individual-table/components/individual-detail-panel/IndividualDetailPanel'
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

export default function GenotypeUpdatePanel(props) {
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
  
  const breeding_poolIdsToAdd = useRef((item.breeding_pool&& item.breeding_pool.id) ? [item.breeding_pool.id] : []);
  const [breeding_poolIdsToAddState, setBreeding_poolIdsToAddState] = useState((item.breeding_pool&& item.breeding_pool.id) ? [item.breeding_pool.id] : []);
  const [field_plotIdsToAddState, setField_plotIdsToAddState] = useState([]);
  const field_plotIdsToAdd = useRef([]);
  const [field_plotIdsToRemoveState, setField_plotIdsToRemoveState] = useState([]);
  const field_plotIdsToRemove = useRef([]);
  const motherIdsToAdd = useRef((item.mother&& item.mother.id) ? [item.mother.id] : []);
  const [motherIdsToAddState, setMotherIdsToAddState] = useState((item.mother&& item.mother.id) ? [item.mother.id] : []);
  const fatherIdsToAdd = useRef((item.father&& item.father.id) ? [item.father.id] : []);
  const [fatherIdsToAddState, setFatherIdsToAddState] = useState((item.father&& item.father.id) ? [item.father.id] : []);
  const individualIdsToAdd = useRef((item.individual&& item.individual.id) ? [item.individual.id] : []);
  const [individualIdsToAddState, setIndividualIdsToAddState] = useState((item.individual&& item.individual.id) ? [item.individual.id] : []);

  const [breeding_poolDetailDialogOpen, setBreeding_poolDetailDialogOpen] = useState(false);
  const [breeding_poolDetailItem, setBreeding_poolDetailItem] = useState(undefined);
  const [field_plotDetailDialogOpen, setField_plotDetailDialogOpen] = useState(false);
  const [field_plotDetailItem, setField_plotDetailItem] = useState(undefined);
  const [individualDetailDialogOpen, setIndividualDetailDialogOpen] = useState(false);
  const [individualDetailItem, setIndividualDetailItem] = useState(undefined);

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
      lastModelChanged.genotype&&
      lastModelChanged.genotype[String(item.id)]) {

        //updated item
        if(lastModelChanged.genotype[String(item.id)].op === "update"&&
            lastModelChanged.genotype[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.genotype[String(item.id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (breeding_poolDetailItem !== undefined) {
      setBreeding_poolDetailDialogOpen(true);
    }
  }, [breeding_poolDetailItem]);
  useEffect(() => {
    if (field_plotDetailItem !== undefined) {
      setField_plotDetailDialogOpen(true);
    }
  }, [field_plotDetailItem]);
  useEffect(() => {
    if (individualDetailItem !== undefined) {
      setIndividualDetailDialogOpen(true);
    }
  }, [individualDetailItem]);

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

    initialValues.name = item.name;
    initialValues.description = item.description;
    initialValues.pedigree_type = item.pedigree_type;
    initialValues.mother_id = item.mother_id;
    initialValues.father_id = item.father_id;
    initialValues.breeding_pool_id = item.breeding_pool_id;

    return initialValues;
  }

  function getInitialForeignKeys() {
    let initialForeignKeys = {};
    
    initialForeignKeys.mother_id = item.mother_id;
    initialForeignKeys.father_id = item.father_id;
    initialForeignKeys.breeding_pool_id = item.breeding_pool_id;

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

  initialValueOkStates.name = (item.name!==null ? 1 : 0);
  initialValueOkStates.description = (item.description!==null ? 1 : 0);
  initialValueOkStates.pedigree_type = (item.pedigree_type!==null ? 1 : 0);
    initialValueOkStates.mother_id = -2; //FK
    initialValueOkStates.father_id = -2; //FK
    initialValueOkStates.breeding_pool_id = -2; //FK

    return initialValueOkStates;
  }

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.name = {errors: []};
    _initialValueAjvStates.description = {errors: []};
    _initialValueAjvStates.pedigree_type = {errors: []};
    _initialValueAjvStates.mother_id = {errors: []}; //FK
    _initialValueAjvStates.father_id = {errors: []}; //FK
    _initialValueAjvStates.breeding_pool_id = {errors: []}; //FK

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
    if(values.current.name !== item.name) { return true;}
    if(values.current.description !== item.description) { return true;}
    if(values.current.pedigree_type !== item.pedigree_type) { return true;}
    if(Number(values.current.mother_id) !== Number(item.mother_id)) { return true;}
    if(Number(values.current.father_id) !== Number(item.father_id)) { return true;}
    if(Number(values.current.breeding_pool_id) !== Number(item.breeding_pool_id)) { return true;}
    return false;
  }

  function setAddRemoveBreeding_pool(variables) {
    //data to notify changes
    changedAssociations.current.breeding_pool = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.breeding_pool&&item.breeding_pool.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(breeding_poolIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.breeding_pool.id!== breeding_poolIdsToAdd.current[0]) {
          //set id to add
          variables.addBreeding_pool = breeding_poolIdsToAdd.current[0];
          
          changedAssociations.current.breeding_pool.added = true;
          changedAssociations.current.breeding_pool.idsAdded = breeding_poolIdsToAdd.current;
          changedAssociations.current.breeding_pool.removed = true;
          changedAssociations.current.breeding_pool.idsRemoved = [item.breeding_pool.id];
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
        variables.removeBreeding_pool = item.breeding_pool.id;
        
        changedAssociations.current.breeding_pool.removed = true;
        changedAssociations.current.breeding_pool.idsRemoved = [item.breeding_pool.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(breeding_poolIdsToAdd.current.length>0) {
        //set id to add
        variables.addBreeding_pool = breeding_poolIdsToAdd.current[0];
        
        changedAssociations.current.breeding_pool.added = true;
        changedAssociations.current.breeding_pool.idsAdded = breeding_poolIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveMother(variables) {
    //data to notify changes
    changedAssociations.current.mother = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.mother&&item.mother.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(motherIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.mother.id!== motherIdsToAdd.current[0]) {
          //set id to add
          variables.addMother = motherIdsToAdd.current[0];
          
          changedAssociations.current.mother.added = true;
          changedAssociations.current.mother.idsAdded = motherIdsToAdd.current;
          changedAssociations.current.mother.removed = true;
          changedAssociations.current.mother.idsRemoved = [item.mother.id];
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
        variables.removeMother = item.mother.id;
        
        changedAssociations.current.mother.removed = true;
        changedAssociations.current.mother.idsRemoved = [item.mother.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(motherIdsToAdd.current.length>0) {
        //set id to add
        variables.addMother = motherIdsToAdd.current[0];
        
        changedAssociations.current.mother.added = true;
        changedAssociations.current.mother.idsAdded = motherIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveFather(variables) {
    //data to notify changes
    changedAssociations.current.father = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.father&&item.father.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(fatherIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.father.id!== fatherIdsToAdd.current[0]) {
          //set id to add
          variables.addFather = fatherIdsToAdd.current[0];
          
          changedAssociations.current.father.added = true;
          changedAssociations.current.father.idsAdded = fatherIdsToAdd.current;
          changedAssociations.current.father.removed = true;
          changedAssociations.current.father.idsRemoved = [item.father.id];
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
        variables.removeFather = item.father.id;
        
        changedAssociations.current.father.removed = true;
        changedAssociations.current.father.idsRemoved = [item.father.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(fatherIdsToAdd.current.length>0) {
        //set id to add
        variables.addFather = fatherIdsToAdd.current[0];
        
        changedAssociations.current.father.added = true;
        changedAssociations.current.father.idsAdded = fatherIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
    }
  }
  function setAddRemoveIndividual(variables) {
    //data to notify changes
    changedAssociations.current.individual = {added: false, removed: false};
    
    /*
     * Case I: Currently, this record is associated.
     */
    if(item.individual&&item.individual.id) {
      /*
       * Case I.a: The toAdd list isn't empty.
       */      
      if(individualIdsToAdd.current.length>0) {
        /*
         * Case I.a.1: There is a new ID (current association changed).
         */
        if(item.individual.id!== individualIdsToAdd.current[0]) {
          //set id to add
          variables.addIndividual = individualIdsToAdd.current[0];
          
          changedAssociations.current.individual.added = true;
          changedAssociations.current.individual.idsAdded = individualIdsToAdd.current;
          changedAssociations.current.individual.removed = true;
          changedAssociations.current.individual.idsRemoved = [item.individual.id];
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
        variables.removeIndividual = item.individual.id;
        
        changedAssociations.current.individual.removed = true;
        changedAssociations.current.individual.idsRemoved = [item.individual.id];
      }
    } else { //currently not to-one-associated
      /*
       * Case II: Currently, this record is not associated.
       */
      
      /*
       * Case II.a: The toAdd list isn't empty (has new id to add).
       */
      if(individualIdsToAdd.current.length>0) {
        //set id to add
        variables.addIndividual = individualIdsToAdd.current[0];
        
        changedAssociations.current.individual.added = true;
        changedAssociations.current.individual.idsAdded = individualIdsToAdd.current;
      } else {
        /*
         * Case II.b: The toAdd list is empty.
         */
        //do nothing here (nothing changes).
      }
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
    * Update new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item updated.
    * 
    */
  function doSave(event) {
    errors.current = [];
    valuesAjvRefs.current = getInitialValueAjvStates();

    /*
      Variables setup
    */
    //variables
    let keys = Object.keys(values.current);
    let variables = {};

    //id
    variables.id = item.id;

    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's
    delete variables.mother_id;
    delete variables.father_id;
    delete variables.breeding_pool_id;

    //add & remove: to_one's
    setAddRemoveBreeding_pool(variables);
    setAddRemoveMother(variables);
    setAddRemoveFather(variables);
    setAddRemoveIndividual(variables);

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.field_plot = {added: false, removed: false};
    
    if(field_plotIdsToAdd.current.length>0) {
      variables.addField_plot = field_plotIdsToAdd.current;
      
      changedAssociations.current.field_plot.added = true;
      changedAssociations.current.field_plot.idsAdded = field_plotIdsToAdd.current;
    }
    if(field_plotIdsToRemove.current.length>0) {
      variables.removeField_plot = field_plotIdsToRemove.current;
      
      changedAssociations.current.field_plot.removed = true;
      changedAssociations.current.field_plot.idsRemoved = field_plotIdsToRemove.current;
    }

    /*
      API Request: updateGenotype
    */
    let cancelableApiReq = makeCancelable(api.genotype.updateItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'genotype', query: 'updateGenotype', method: 'doSave()', request: 'api.genotype.updateItem'}];
          newError.path=['Genotypes', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateGenotype
        let updateGenotype = response.data.data.updateGenotype;
        if(updateGenotype === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'updateGenotype ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'genotype', query: 'updateGenotype', method: 'doSave()', request: 'api.genotype.updateItem'}];
          newError.path=['Genotypes', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //check: updateGenotype type
        if(typeof updateGenotype !== 'object') {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'genotype ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'genotype', query: 'updateGenotype', method: 'doSave()', request: 'api.genotype.updateItem'}];
          newError.path=['Genotypes', `id:${item.id}`, 'update'];
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
          newError.message = 'updateGenotype ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'genotype', query: 'updateGenotype', method: 'doSave()', request: 'api.genotype.updateItem'}];
          newError.path=['Genotypes', `id:${item.id}`, 'update'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
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
        onClose(event, true, updateGenotype);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.genotype.updateItem
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
          newError.locations=[{model: 'genotype', query: 'updateGenotype', method: 'doSave()', request: 'api.genotype.updateItem'}];
          newError.path=['Genotypes', `id:${item.id}`, 'update'];
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
      case 'breeding_pool':
        breeding_poolIdsToAdd.current = [];
        breeding_poolIdsToAdd.current.push(itemId);
        setBreeding_poolIdsToAddState(breeding_poolIdsToAdd.current);
        handleSetValue(itemId, 1, 'breeding_pool_id');
        setForeignKeys({...foreignKeys, breeding_pool_id: itemId});
        break;
      case 'field_plot':
        field_plotIdsToAdd.current.push(itemId);
        setField_plotIdsToAddState(field_plotIdsToAdd.current);
        break;
      case 'mother':
        motherIdsToAdd.current = [];
        motherIdsToAdd.current.push(itemId);
        setMotherIdsToAddState(motherIdsToAdd.current);
        handleSetValue(itemId, 1, 'mother_id');
        setForeignKeys({...foreignKeys, mother_id: itemId});
        break;
      case 'father':
        fatherIdsToAdd.current = [];
        fatherIdsToAdd.current.push(itemId);
        setFatherIdsToAddState(fatherIdsToAdd.current);
        handleSetValue(itemId, 1, 'father_id');
        setForeignKeys({...foreignKeys, father_id: itemId});
        break;
      case 'individual':
        individualIdsToAdd.current = [];
        individualIdsToAdd.current.push(itemId);
        setIndividualIdsToAddState(individualIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'breeding_pool') {
      breeding_poolIdsToAdd.current = [];
      setBreeding_poolIdsToAddState([]);
      handleSetValue(null, 0, 'breeding_pool_id');
      setForeignKeys({...foreignKeys, breeding_pool_id: null});
      return;
    }//end: case 'breeding_pool'
    if(associationKey === 'field_plot') {
      for(let i=0; i<field_plotIdsToAdd.current.length; ++i)
      {
        if(field_plotIdsToAdd.current[i] === itemId) {
          field_plotIdsToAdd.current.splice(i, 1);
          setField_plotIdsToAddState(field_plotIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'field_plot'
    if(associationKey === 'mother') {
      motherIdsToAdd.current = [];
      setMotherIdsToAddState([]);
      handleSetValue(null, 0, 'mother_id');
      setForeignKeys({...foreignKeys, mother_id: null});
      return;
    }//end: case 'mother'
    if(associationKey === 'father') {
      fatherIdsToAdd.current = [];
      setFatherIdsToAddState([]);
      handleSetValue(null, 0, 'father_id');
      setForeignKeys({...foreignKeys, father_id: null});
      return;
    }//end: case 'father'
    if(associationKey === 'individual') {
      individualIdsToAdd.current = [];
      setIndividualIdsToAddState([]);
      return;
    }//end: case 'individual'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'field_plot':
        field_plotIdsToRemove.current.push(itemId);
        setField_plotIdsToRemoveState(field_plotIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'field_plot') {
      for(let i=0; i<field_plotIdsToRemove.current.length; ++i)
      {
        if(field_plotIdsToRemove.current[i] === itemId) {
          field_plotIdsToRemove.current.splice(i, 1);
          setField_plotIdsToRemoveState(field_plotIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'field_plot'
  }

  const handleClickOnBreeding_poolRow = (event, item) => {
    setBreeding_poolDetailItem(item);
  };

  const handleBreeding_poolDetailDialogClose = (event) => {
    delayedCloseBreeding_poolDetailPanel(event, 500);
  }

  const delayedCloseBreeding_poolDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setBreeding_poolDetailDialogOpen(false);
        setBreeding_poolDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnField_plotRow = (event, item) => {
    setField_plotDetailItem(item);
  };

  const handleField_plotDetailDialogClose = (event) => {
    delayedCloseField_plotDetailPanel(event, 500);
  }

  const delayedCloseField_plotDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setField_plotDetailDialogOpen(false);
        setField_plotDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

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
            { t('modelPanels.editing') +  ": Genotype | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " genotype" }>
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
            <GenotypeTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <GenotypeAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              valueAjvStates={valueAjvStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <GenotypeAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              breeding_poolIdsToAdd={breeding_poolIdsToAddState}
              field_plotIdsToAdd={field_plotIdsToAddState}
              field_plotIdsToRemove={field_plotIdsToRemoveState}
              motherIdsToAdd={motherIdsToAddState}
              fatherIdsToAdd={fatherIdsToAddState}
              individualIdsToAdd={individualIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnBreeding_poolRow={handleClickOnBreeding_poolRow}
              handleClickOnField_plotRow={handleClickOnField_plotRow}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <GenotypeConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Breeding_pool Detail Panel */}
        {(breeding_poolDetailDialogOpen) && (
          <BreedingPoolDetailPanel
            permissions={permissions}
            item={breeding_poolDetailItem}
            dialog={true}
            handleClose={handleBreeding_poolDetailDialogClose}
          />
        )}
        {/* Dialog: Field_plot Detail Panel */}
        {(field_plotDetailDialogOpen) && (
          <FieldPlotDetailPanel
            permissions={permissions}
            item={field_plotDetailItem}
            dialog={true}
            handleClose={handleField_plotDetailDialogClose}
          />
        )}
        {/* Dialog: Individual Detail Panel */}
        {(individualDetailDialogOpen) && (
          <IndividualDetailPanel
            permissions={permissions}
            item={individualDetailItem}
            dialog={true}
            handleClose={handleIndividualDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
GenotypeUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
