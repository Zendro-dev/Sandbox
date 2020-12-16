import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ContactsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Contacts" */ './contacts-transfer-lists/ContactsTransferLists'));
const EnvironmentParametersTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-EnvironmentParameters" */ './environmentParameters-transfer-lists/EnvironmentParametersTransferLists'));
const EventsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Events" */ './events-transfer-lists/EventsTransferLists'));
const LocationTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Location" */ './location-transfer-lists/LocationTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const ObservationUnitsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationUnits" */ './observationUnits-transfer-lists/ObservationUnitsTransferLists'));
const SeasonsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Seasons" */ './seasons-transfer-lists/SeasonsTransferLists'));
const TrialTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Trial" */ './trial-transfer-lists/TrialTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function StudyAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    contactsIdsToAdd,
    environmentParametersIdsToAdd,
    eventsIdsToAdd,
    locationIdsToAdd,
    observationsIdsToAdd,
    observationUnitsIdsToAdd,
    seasonsIdsToAdd,
    trialIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnContactRow,
    handleClickOnEnvironmentParameterRow,
    handleClickOnEventRow,
    handleClickOnLocationRow,
    handleClickOnObservationRow,
    handleClickOnObservationUnitRow,
    handleClickOnSeasonRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('contacts');

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
            <StudyAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* Contacts Transfer Lists */}
          {(associationSelected === 'contacts') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ContactsTransferLists
                  idsToAdd={contactsIdsToAdd}
                  handleClickOnContactRow={handleClickOnContactRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* EnvironmentParameters Transfer Lists */}
          {(associationSelected === 'environmentParameters') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <EnvironmentParametersTransferLists
                  idsToAdd={environmentParametersIdsToAdd}
                  handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Events Transfer Lists */}
          {(associationSelected === 'events') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <EventsTransferLists
                  idsToAdd={eventsIdsToAdd}
                  handleClickOnEventRow={handleClickOnEventRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Location Transfer Lists */}
          {(associationSelected === 'location') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <LocationTransferLists
                  idsToAdd={locationIdsToAdd}
                  handleClickOnLocationRow={handleClickOnLocationRow}
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
          {/* Seasons Transfer Lists */}
          {(associationSelected === 'seasons') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <SeasonsTransferLists
                  idsToAdd={seasonsIdsToAdd}
                  handleClickOnSeasonRow={handleClickOnSeasonRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Trial Transfer Lists */}
          {(associationSelected === 'trial') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <TrialTransferLists
                  idsToAdd={trialIdsToAdd}
                  handleClickOnTrialRow={handleClickOnTrialRow}
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
StudyAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  contactsIdsToAdd: PropTypes.array.isRequired,
  environmentParametersIdsToAdd: PropTypes.array.isRequired,
  eventsIdsToAdd: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  seasonsIdsToAdd: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnEnvironmentParameterRow: PropTypes.func.isRequired,
  handleClickOnEventRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
  handleClickOnSeasonRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};