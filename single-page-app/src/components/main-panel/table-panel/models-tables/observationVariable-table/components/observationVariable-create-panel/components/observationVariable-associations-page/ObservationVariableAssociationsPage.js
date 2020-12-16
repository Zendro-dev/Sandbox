import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import ObservationVariableAssociationsMenuTabs from './ObservationVariableAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MethodTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Method" */ './method-transfer-lists/MethodTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const OntologyReferenceTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-OntologyReference" */ './ontologyReference-transfer-lists/OntologyReferenceTransferLists'));
const ScaleTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Scale" */ './scale-transfer-lists/ScaleTransferLists'));
const TraitTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Trait" */ './trait-transfer-lists/TraitTransferLists'));

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

          {/* Transfer Lists */}
          {/* Method Transfer Lists */}
          {(associationSelected === 'method') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <MethodTransferLists
                  idsToAdd={methodIdsToAdd}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Observations Transfer Lists */}
          {(associationSelected === 'observations') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ObservationsTransferLists
                  idsToAdd={observationsIdsToAdd}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* OntologyReference Transfer Lists */}
          {(associationSelected === 'ontologyReference') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <OntologyReferenceTransferLists
                  idsToAdd={ontologyReferenceIdsToAdd}
                  handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Scale Transfer Lists */}
          {(associationSelected === 'scale') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ScaleTransferLists
                  idsToAdd={scaleIdsToAdd}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Trait Transfer Lists */}
          {(associationSelected === 'trait') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <TraitTransferLists
                  idsToAdd={traitIdsToAdd}
                  handleClickOnTraitRow={handleClickOnTraitRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
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