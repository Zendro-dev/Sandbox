import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import MethodTransferLists from './method-transfer-lists/MethodTransferLists'
import ObservationsTransferLists from './observations-transfer-lists/ObservationsTransferLists'
import OntologyReferenceTransferLists from './ontologyReference-transfer-lists/OntologyReferenceTransferLists'
import ScaleTransferLists from './scale-transfer-lists/ScaleTransferLists'
import TraitTransferLists from './trait-transfer-lists/TraitTransferLists'
import ObservationVariableAssociationsMenuTabs from './ObservationVariableAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function ObservationVariableAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    methodIdsToAdd,
    observationsIdsToAdd,
    ontologyReferenceIdsToAdd,
    scaleIdsToAdd,
    traitIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnMethodRow,
    handleClickOnObservationRow,
    handleClickOnOntologyReferenceRow,
    handleClickOnScaleRow,
    handleClickOnTraitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('method');

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
            <ObservationVariableAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Method Transfer Lists */}
          {(associationSelected === 'method') && (
            <Grid item xs={12} sm={10} md={9}>
              <MethodTransferLists
                idsToAdd={methodIdsToAdd}
                handleClickOnMethodRow={handleClickOnMethodRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Observations Transfer Lists */}
          {(associationSelected === 'observations') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationsTransferLists
                idsToAdd={observationsIdsToAdd}
                handleClickOnObservationRow={handleClickOnObservationRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* OntologyReference Transfer Lists */}
          {(associationSelected === 'ontologyReference') && (
            <Grid item xs={12} sm={10} md={9}>
              <OntologyReferenceTransferLists
                idsToAdd={ontologyReferenceIdsToAdd}
                handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Scale Transfer Lists */}
          {(associationSelected === 'scale') && (
            <Grid item xs={12} sm={10} md={9}>
              <ScaleTransferLists
                idsToAdd={scaleIdsToAdd}
                handleClickOnScaleRow={handleClickOnScaleRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Trait Transfer Lists */}
          {(associationSelected === 'trait') && (
            <Grid item xs={12} sm={10} md={9}>
              <TraitTransferLists
                idsToAdd={traitIdsToAdd}
                handleClickOnTraitRow={handleClickOnTraitRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
ObservationVariableAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  methodIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  ontologyReferenceIdsToAdd: PropTypes.array.isRequired,
  scaleIdsToAdd: PropTypes.array.isRequired,
  traitIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired,
  handleClickOnScaleRow: PropTypes.func.isRequired,
  handleClickOnTraitRow: PropTypes.func.isRequired,
};