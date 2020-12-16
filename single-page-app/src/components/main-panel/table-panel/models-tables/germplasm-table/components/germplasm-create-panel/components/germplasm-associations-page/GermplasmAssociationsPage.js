import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GermplasmAssociationsMenuTabs from './GermplasmAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const BreedingMethodTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-BreedingMethod" */ './breedingMethod-transfer-lists/BreedingMethodTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const ObservationUnitsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationUnits" */ './observationUnits-transfer-lists/ObservationUnitsTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function GermplasmAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    breedingMethodIdsToAdd,
    observationsIdsToAdd,
    observationUnitsIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
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
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <GermplasmAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* BreedingMethod Transfer Lists */}
          {(associationSelected === 'breedingMethod') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <BreedingMethodTransferLists
                  idsToAdd={breedingMethodIdsToAdd}
                  handleClickOnBreedingMethodRow={handleClickOnBreedingMethodRow}
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
          {/* ObservationUnits Transfer Lists */}
          {(associationSelected === 'observationUnits') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ObservationUnitsTransferLists
                  idsToAdd={observationUnitsIdsToAdd}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
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
GermplasmAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  breedingMethodIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnBreedingMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
};