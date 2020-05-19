import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import MethodsTransferLists from './methods-transfer-lists/MethodsTransferLists'
import ObservationVariablesTransferLists from './observationVariables-transfer-lists/ObservationVariablesTransferLists'
import ScalesTransferLists from './scales-transfer-lists/ScalesTransferLists'
import TraitsTransferLists from './traits-transfer-lists/TraitsTransferLists'
import OntologyReferenceAssociationsMenuTabs from './OntologyReferenceAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function OntologyReferenceAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    methodsIdsToAdd,
    methodsIdsToRemove,
    observationVariablesIdsToAdd,
    observationVariablesIdsToRemove,
    scalesIdsToAdd,
    scalesIdsToRemove,
    traitsIdsToAdd,
    traitsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnMethodRow,
    handleClickOnObservationVariableRow,
    handleClickOnScaleRow,
    handleClickOnTraitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('methods');

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isDebouncingAssociationClick = useRef(false);
  const currentAssociationSelected = useRef(associationSelected);
  const lastAssociationSelected = useRef(associationSelected);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);

  const handleAssociationClick = (event, newValue) => {
    //save last value
    lastAssociationSelected.current = newValue;

    if(!isDebouncingAssociationClick.current){
      //set last value
      currentAssociationSelected.current = newValue;
      setAssociationSelected(newValue);

      //debounce
      isDebouncingAssociationClick.current = true;
      let cancelableTimer = startTimerToDebounceAssociationClick();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingAssociationClick.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastAssociationSelected.current !== currentAssociationSelected.current){
            setAssociationSelected(lastAssociationSelected.current);
            currentAssociationSelected.current = lastAssociationSelected.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };
  
  const startTimerToDebounceAssociationClick = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='center'
          alignItems='flex-start'
          alignContent='flex-start'
          spacing={0}
        > 

          {/* Menu Tabs: Associations */}
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <OntologyReferenceAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Methods Transfer Lists */}
          {(associationSelected === 'methods') && (
            <Grid item xs={12} sm={10} md={9}>
              <MethodsTransferLists
                item={item}
                idsToAdd={methodsIdsToAdd}
                idsToRemove={methodsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMethodRow={handleClickOnMethodRow}
              />
            </Grid>
          )}
          {/* ObservationVariables Transfer Lists */}
          {(associationSelected === 'observationVariables') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationVariablesTransferLists
                item={item}
                idsToAdd={observationVariablesIdsToAdd}
                idsToRemove={observationVariablesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
              />
            </Grid>
          )}
          {/* Scales Transfer Lists */}
          {(associationSelected === 'scales') && (
            <Grid item xs={12} sm={10} md={9}>
              <ScalesTransferLists
                item={item}
                idsToAdd={scalesIdsToAdd}
                idsToRemove={scalesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnScaleRow={handleClickOnScaleRow}
              />
            </Grid>
          )}
          {/* Traits Transfer Lists */}
          {(associationSelected === 'traits') && (
            <Grid item xs={12} sm={10} md={9}>
              <TraitsTransferLists
                item={item}
                idsToAdd={traitsIdsToAdd}
                idsToRemove={traitsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnTraitRow={handleClickOnTraitRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
OntologyReferenceAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  methodsIdsToAdd: PropTypes.array.isRequired,
  methodsIdsToRemove: PropTypes.array.isRequired,
  observationVariablesIdsToAdd: PropTypes.array.isRequired,
  observationVariablesIdsToRemove: PropTypes.array.isRequired,
  scalesIdsToAdd: PropTypes.array.isRequired,
  scalesIdsToRemove: PropTypes.array.isRequired,
  traitsIdsToAdd: PropTypes.array.isRequired,
  traitsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationVariableRow: PropTypes.func.isRequired,
  handleClickOnScaleRow: PropTypes.func.isRequired,
  handleClickOnTraitRow: PropTypes.func.isRequired,
};