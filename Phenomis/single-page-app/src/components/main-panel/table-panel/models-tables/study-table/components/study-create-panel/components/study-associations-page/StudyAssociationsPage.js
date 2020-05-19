import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import EnvironmentParametersTransferLists from './environmentParameters-transfer-lists/EnvironmentParametersTransferLists'
import EventsTransferLists from './events-transfer-lists/EventsTransferLists'
import LocationTransferLists from './location-transfer-lists/LocationTransferLists'
import ObservationsTransferLists from './observations-transfer-lists/ObservationsTransferLists'
import ObservationUnitsTransferLists from './observationUnits-transfer-lists/ObservationUnitsTransferLists'
import StudyToContactsTransferLists from './studyToContacts-transfer-lists/StudyToContactsTransferLists'
import StudyToSeasonsTransferLists from './studyToSeasons-transfer-lists/StudyToSeasonsTransferLists'
import TrialTransferLists from './trial-transfer-lists/TrialTransferLists'
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
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

export default function StudyAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    environmentParametersIdsToAdd,
    eventsIdsToAdd,
    locationIdsToAdd,
    observationsIdsToAdd,
    observationUnitsIdsToAdd,
    studyToContactsIdsToAdd,
    studyToSeasonsIdsToAdd,
    trialIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnEnvironmentParameterRow,
    handleClickOnEventRow,
    handleClickOnLocationRow,
    handleClickOnObservationRow,
    handleClickOnObservationUnitRow,
    handleClickOnStudy_to_contactRow,
    handleClickOnStudy_to_seasonRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('environmentParameters');

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

          {/* EnvironmentParameters Transfer Lists */}
          {(associationSelected === 'environmentParameters') && (
            <Grid item xs={12} sm={10} md={9}>
              <EnvironmentParametersTransferLists
                idsToAdd={environmentParametersIdsToAdd}
                handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Events Transfer Lists */}
          {(associationSelected === 'events') && (
            <Grid item xs={12} sm={10} md={9}>
              <EventsTransferLists
                idsToAdd={eventsIdsToAdd}
                handleClickOnEventRow={handleClickOnEventRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Location Transfer Lists */}
          {(associationSelected === 'location') && (
            <Grid item xs={12} sm={10} md={9}>
              <LocationTransferLists
                idsToAdd={locationIdsToAdd}
                handleClickOnLocationRow={handleClickOnLocationRow}
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
          {/* ObservationUnits Transfer Lists */}
          {(associationSelected === 'observationUnits') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationUnitsTransferLists
                idsToAdd={observationUnitsIdsToAdd}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* StudyToContacts Transfer Lists */}
          {(associationSelected === 'studyToContacts') && (
            <Grid item xs={12} sm={10} md={9}>
              <StudyToContactsTransferLists
                idsToAdd={studyToContactsIdsToAdd}
                handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* StudyToSeasons Transfer Lists */}
          {(associationSelected === 'studyToSeasons') && (
            <Grid item xs={12} sm={10} md={9}>
              <StudyToSeasonsTransferLists
                idsToAdd={studyToSeasonsIdsToAdd}
                handleClickOnStudy_to_seasonRow={handleClickOnStudy_to_seasonRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Trial Transfer Lists */}
          {(associationSelected === 'trial') && (
            <Grid item xs={12} sm={10} md={9}>
              <TrialTransferLists
                idsToAdd={trialIdsToAdd}
                handleClickOnTrialRow={handleClickOnTrialRow}
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
StudyAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  environmentParametersIdsToAdd: PropTypes.array.isRequired,
  eventsIdsToAdd: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  studyToContactsIdsToAdd: PropTypes.array.isRequired,
  studyToSeasonsIdsToAdd: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnEnvironmentParameterRow: PropTypes.func.isRequired,
  handleClickOnEventRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
  handleClickOnStudy_to_contactRow: PropTypes.func.isRequired,
  handleClickOnStudy_to_seasonRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};