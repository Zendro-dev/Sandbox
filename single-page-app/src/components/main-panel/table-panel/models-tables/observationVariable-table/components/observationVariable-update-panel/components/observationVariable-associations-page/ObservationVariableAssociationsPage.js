import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ObservationVariableAssociationsMenuTabs from './ObservationVariableAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MethodTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Method" */ './method-transfer-lists/MethodTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const OntologyReferenceTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-OntologyReference" */ './ontologyReference-transfer-lists/OntologyReferenceTransferLists'));
const ScaleTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Scale" */ './scale-transfer-lists/ScaleTransferLists'));
const TraitTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Trait" */ './trait-transfer-lists/TraitTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  },
}));

export default function ObservationVariableAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    methodIdsToAdd,
    methodIdsToRemove,
    observationsIdsToAdd,
    observationsIdsToRemove,
    ontologyReferenceIdsToAdd,
    ontologyReferenceIdsToRemove,
    scaleIdsToAdd,
    scaleIdsToRemove,
    traitIdsToAdd,
    traitIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <ObservationVariableAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Method Transfer Lists */}
          {(associationSelected === 'method') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <MethodTransferLists
                  item={item}
                  idsToAdd={methodIdsToAdd}
                  idsToRemove={methodIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Observations Transfer Lists */}
          {(associationSelected === 'observations') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ObservationsTransferLists
                  item={item}
                  idsToAdd={observationsIdsToAdd}
                  idsToRemove={observationsIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnObservationRow={handleClickOnObservationRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* OntologyReference Transfer Lists */}
          {(associationSelected === 'ontologyReference') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <OntologyReferenceTransferLists
                  item={item}
                  idsToAdd={ontologyReferenceIdsToAdd}
                  idsToRemove={ontologyReferenceIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Scale Transfer Lists */}
          {(associationSelected === 'scale') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ScaleTransferLists
                  item={item}
                  idsToAdd={scaleIdsToAdd}
                  idsToRemove={scaleIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Trait Transfer Lists */}
          {(associationSelected === 'trait') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <TraitTransferLists
                  item={item}
                  idsToAdd={traitIdsToAdd}
                  idsToRemove={traitIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnTraitRow={handleClickOnTraitRow}
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
  item: PropTypes.object.isRequired,
  methodIdsToAdd: PropTypes.array.isRequired,
  methodIdsToRemove: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToRemove: PropTypes.array.isRequired,
  ontologyReferenceIdsToAdd: PropTypes.array.isRequired,
  ontologyReferenceIdsToRemove: PropTypes.array.isRequired,
  scaleIdsToAdd: PropTypes.array.isRequired,
  scaleIdsToRemove: PropTypes.array.isRequired,
  traitIdsToAdd: PropTypes.array.isRequired,
  traitIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired,
  handleClickOnScaleRow: PropTypes.func.isRequired,
  handleClickOnTraitRow: PropTypes.func.isRequired,
};