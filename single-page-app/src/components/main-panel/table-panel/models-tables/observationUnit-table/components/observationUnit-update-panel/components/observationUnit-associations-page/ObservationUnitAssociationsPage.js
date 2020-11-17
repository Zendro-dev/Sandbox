import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import EventsTransferLists from './events-transfer-lists/EventsTransferLists'
import GermplasmTransferLists from './germplasm-transfer-lists/GermplasmTransferLists'
import ImagesTransferLists from './images-transfer-lists/ImagesTransferLists'
import LocationTransferLists from './location-transfer-lists/LocationTransferLists'
import ObservationsTransferLists from './observations-transfer-lists/ObservationsTransferLists'
import ObservationTreatmentsTransferLists from './observationTreatments-transfer-lists/ObservationTreatmentsTransferLists'
import ObservationUnitPositionTransferLists from './observationUnitPosition-transfer-lists/ObservationUnitPositionTransferLists'
import ProgramTransferLists from './program-transfer-lists/ProgramTransferLists'
import StudyTransferLists from './study-transfer-lists/StudyTransferLists'
import TrialTransferLists from './trial-transfer-lists/TrialTransferLists'
import ObservationUnitAssociationsMenuTabs from './ObservationUnitAssociationsMenuTabs'
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

export default function ObservationUnitAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    eventsIdsToAdd,
    eventsIdsToRemove,
    germplasmIdsToAdd,
    germplasmIdsToRemove,
    imagesIdsToAdd,
    imagesIdsToRemove,
    locationIdsToAdd,
    locationIdsToRemove,
    observationsIdsToAdd,
    observationsIdsToRemove,
    observationTreatmentsIdsToAdd,
    observationTreatmentsIdsToRemove,
    observationUnitPositionIdsToAdd,
    observationUnitPositionIdsToRemove,
    programIdsToAdd,
    programIdsToRemove,
    studyIdsToAdd,
    studyIdsToRemove,
    trialIdsToAdd,
    trialIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnEventRow,
    handleClickOnGermplasmRow,
    handleClickOnImageRow,
    handleClickOnLocationRow,
    handleClickOnObservationRow,
    handleClickOnObservationTreatmentRow,
    handleClickOnObservationUnitPositionRow,
    handleClickOnProgramRow,
    handleClickOnStudyRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('events');

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
            <ObservationUnitAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

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
          {/* Germplasm Transfer Lists */}
          {(associationSelected === 'germplasm') && (
            <Grid item xs={12} sm={11}>
              <GermplasmTransferLists
                item={item}
                idsToAdd={germplasmIdsToAdd}
                idsToRemove={germplasmIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Grid>
          )}
          {/* Images Transfer Lists */}
          {(associationSelected === 'images') && (
            <Grid item xs={12} sm={11}>
              <ImagesTransferLists
                item={item}
                idsToAdd={imagesIdsToAdd}
                idsToRemove={imagesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnImageRow={handleClickOnImageRow}
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
          {/* ObservationTreatments Transfer Lists */}
          {(associationSelected === 'observationTreatments') && (
            <Grid item xs={12} sm={11}>
              <ObservationTreatmentsTransferLists
                item={item}
                idsToAdd={observationTreatmentsIdsToAdd}
                idsToRemove={observationTreatmentsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
              />
            </Grid>
          )}
          {/* ObservationUnitPosition Transfer Lists */}
          {(associationSelected === 'observationUnitPosition') && (
            <Grid item xs={12} sm={11}>
              <ObservationUnitPositionTransferLists
                item={item}
                idsToAdd={observationUnitPositionIdsToAdd}
                idsToRemove={observationUnitPositionIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
              />
            </Grid>
          )}
          {/* Program Transfer Lists */}
          {(associationSelected === 'program') && (
            <Grid item xs={12} sm={11}>
              <ProgramTransferLists
                item={item}
                idsToAdd={programIdsToAdd}
                idsToRemove={programIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnProgramRow={handleClickOnProgramRow}
              />
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={11}>
              <StudyTransferLists
                item={item}
                idsToAdd={studyIdsToAdd}
                idsToRemove={studyIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnStudyRow={handleClickOnStudyRow}
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
ObservationUnitAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  eventsIdsToAdd: PropTypes.array.isRequired,
  eventsIdsToRemove: PropTypes.array.isRequired,
  germplasmIdsToAdd: PropTypes.array.isRequired,
  germplasmIdsToRemove: PropTypes.array.isRequired,
  imagesIdsToAdd: PropTypes.array.isRequired,
  imagesIdsToRemove: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  locationIdsToRemove: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToRemove: PropTypes.array.isRequired,
  observationTreatmentsIdsToAdd: PropTypes.array.isRequired,
  observationTreatmentsIdsToRemove: PropTypes.array.isRequired,
  observationUnitPositionIdsToAdd: PropTypes.array.isRequired,
  observationUnitPositionIdsToRemove: PropTypes.array.isRequired,
  programIdsToAdd: PropTypes.array.isRequired,
  programIdsToRemove: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  studyIdsToRemove: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  trialIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnEventRow: PropTypes.func.isRequired,
  handleClickOnGermplasmRow: PropTypes.func.isRequired,
  handleClickOnImageRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationTreatmentRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitPositionRow: PropTypes.func.isRequired,
  handleClickOnProgramRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};