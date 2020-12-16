import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import GermplasmAssociationsMenuTabs from './GermplasmAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const BreedingMethodTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-BreedingMethod" */ './breedingMethod-transfer-lists/BreedingMethodTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const ObservationUnitsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-ObservationUnits" */ './observationUnits-transfer-lists/ObservationUnitsTransferLists'));

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

export default function GermplasmAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    breedingMethodIdsToAdd,
    breedingMethodIdsToRemove,
    observationsIdsToAdd,
    observationsIdsToRemove,
    observationUnitsIdsToAdd,
    observationUnitsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnBreedingMethodRow,
    handleClickOnObservationRow,
    handleClickOnObservationUnitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('breedingMethod');

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
            <GermplasmAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* BreedingMethod Transfer Lists */}
          {(associationSelected === 'breedingMethod') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <BreedingMethodTransferLists
                  item={item}
                  idsToAdd={breedingMethodIdsToAdd}
                  idsToRemove={breedingMethodIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnBreedingMethodRow={handleClickOnBreedingMethodRow}
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
          {/* ObservationUnits Transfer Lists */}
          {(associationSelected === 'observationUnits') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ObservationUnitsTransferLists
                  item={item}
                  idsToAdd={observationUnitsIdsToAdd}
                  idsToRemove={observationUnitsIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                />
              </Suspense>
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
GermplasmAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  breedingMethodIdsToAdd: PropTypes.array.isRequired,
  breedingMethodIdsToRemove: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToRemove: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnBreedingMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
};