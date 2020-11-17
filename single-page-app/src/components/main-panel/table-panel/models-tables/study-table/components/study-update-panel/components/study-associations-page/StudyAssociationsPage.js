import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import ContactsTransferLists from './contacts-transfer-lists/ContactsTransferLists'
import EnvironmentParametersTransferLists from './environmentParameters-transfer-lists/EnvironmentParametersTransferLists'
import EventsTransferLists from './events-transfer-lists/EventsTransferLists'
import LocationTransferLists from './location-transfer-lists/LocationTransferLists'
import ObservationsTransferLists from './observations-transfer-lists/ObservationsTransferLists'
import ObservationUnitsTransferLists from './observationUnits-transfer-lists/ObservationUnitsTransferLists'
import SeasonsTransferLists from './seasons-transfer-lists/SeasonsTransferLists'
import TrialTransferLists from './trial-transfer-lists/TrialTransferLists'
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
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

export default function StudyAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    contactsIdsToAdd,
    contactsIdsToRemove,
    environmentParametersIdsToAdd,
    environmentParametersIdsToRemove,
    eventsIdsToAdd,
    eventsIdsToRemove,
    locationIdsToAdd,
    locationIdsToRemove,
    observationsIdsToAdd,
    observationsIdsToRemove,
    observationUnitsIdsToAdd,
    observationUnitsIdsToRemove,
    seasonsIdsToAdd,
    seasonsIdsToRemove,
    trialIdsToAdd,
    trialIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <StudyAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Contacts Transfer Lists */}
          {(associationSelected === 'contacts') && (
            <Grid item xs={12} sm={11}>
              <ContactsTransferLists
                item={item}
                idsToAdd={contactsIdsToAdd}
                idsToRemove={contactsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnContactRow={handleClickOnContactRow}
              />
            </Grid>
          )}
          {/* EnvironmentParameters Transfer Lists */}
          {(associationSelected === 'environmentParameters') && (
            <Grid item xs={12} sm={11}>
              <EnvironmentParametersTransferLists
                item={item}
                idsToAdd={environmentParametersIdsToAdd}
                idsToRemove={environmentParametersIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
              />
            </Grid>
          )}
          {/* Events Transfer Lists */}
          {(associationSelected === 'events') && (
            <Grid item xs={12} sm={11}>
              <EventsTransferLists
                item={item}
                idsToAdd={eventsIdsToAdd}
                idsToRemove={eventsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnEventRow={handleClickOnEventRow}
              />
            </Grid>
          )}
          {/* Location Transfer Lists */}
          {(associationSelected === 'location') && (
            <Grid item xs={12} sm={11}>
              <LocationTransferLists
                item={item}
                idsToAdd={locationIdsToAdd}
                idsToRemove={locationIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnLocationRow={handleClickOnLocationRow}
              />
            </Grid>
          )}
          {/* Observations Transfer Lists */}
          {(associationSelected === 'observations') && (
            <Grid item xs={12} sm={11}>
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
            </Grid>
          )}
          {/* ObservationUnits Transfer Lists */}
          {(associationSelected === 'observationUnits') && (
            <Grid item xs={12} sm={11}>
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
            </Grid>
          )}
          {/* Seasons Transfer Lists */}
          {(associationSelected === 'seasons') && (
            <Grid item xs={12} sm={11}>
              <SeasonsTransferLists
                item={item}
                idsToAdd={seasonsIdsToAdd}
                idsToRemove={seasonsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
              />
            </Grid>
          )}
          {/* Trial Transfer Lists */}
          {(associationSelected === 'trial') && (
            <Grid item xs={12} sm={11}>
              <TrialTransferLists
                item={item}
                idsToAdd={trialIdsToAdd}
                idsToRemove={trialIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnTrialRow={handleClickOnTrialRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
StudyAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  contactsIdsToAdd: PropTypes.array.isRequired,
  contactsIdsToRemove: PropTypes.array.isRequired,
  environmentParametersIdsToAdd: PropTypes.array.isRequired,
  environmentParametersIdsToRemove: PropTypes.array.isRequired,
  eventsIdsToAdd: PropTypes.array.isRequired,
  eventsIdsToRemove: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  locationIdsToRemove: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToRemove: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToRemove: PropTypes.array.isRequired,
  seasonsIdsToAdd: PropTypes.array.isRequired,
  seasonsIdsToRemove: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  trialIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnEnvironmentParameterRow: PropTypes.func.isRequired,
  handleClickOnEventRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
  handleClickOnSeasonRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};