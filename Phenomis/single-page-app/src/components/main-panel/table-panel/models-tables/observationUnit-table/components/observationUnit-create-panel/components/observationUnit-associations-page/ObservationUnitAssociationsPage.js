import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GermplasmTransferLists from './germplasm-transfer-lists/GermplasmTransferLists'
import ImagesTransferLists from './images-transfer-lists/ImagesTransferLists'
import LocationTransferLists from './location-transfer-lists/LocationTransferLists'
import ObservationsTransferLists from './observations-transfer-lists/ObservationsTransferLists'
import ObservationTreatmentsTransferLists from './observationTreatments-transfer-lists/ObservationTreatmentsTransferLists'
import ObservationUnitPositionTransferLists from './observationUnitPosition-transfer-lists/ObservationUnitPositionTransferLists'
import ObservationUnitToEventsTransferLists from './observationUnitToEvents-transfer-lists/ObservationUnitToEventsTransferLists'
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
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function ObservationUnitAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    germplasmIdsToAdd,
    imagesIdsToAdd,
    locationIdsToAdd,
    observationsIdsToAdd,
    observationTreatmentsIdsToAdd,
    observationUnitPositionIdsToAdd,
    observationUnitToEventsIdsToAdd,
    programIdsToAdd,
    studyIdsToAdd,
    trialIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnGermplasmRow,
    handleClickOnImageRow,
    handleClickOnLocationRow,
    handleClickOnObservationRow,
    handleClickOnObservationTreatmentRow,
    handleClickOnObservationUnitPositionRow,
    handleClickOnObservationUnit_to_eventRow,
    handleClickOnProgramRow,
    handleClickOnStudyRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('germplasm');

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
            <ObservationUnitAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Germplasm Transfer Lists */}
          {(associationSelected === 'germplasm') && (
            <Grid item xs={12} sm={10} md={9}>
              <GermplasmTransferLists
                idsToAdd={germplasmIdsToAdd}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Images Transfer Lists */}
          {(associationSelected === 'images') && (
            <Grid item xs={12} sm={10} md={9}>
              <ImagesTransferLists
                idsToAdd={imagesIdsToAdd}
                handleClickOnImageRow={handleClickOnImageRow}
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
          {/* ObservationTreatments Transfer Lists */}
          {(associationSelected === 'observationTreatments') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationTreatmentsTransferLists
                idsToAdd={observationTreatmentsIdsToAdd}
                handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* ObservationUnitPosition Transfer Lists */}
          {(associationSelected === 'observationUnitPosition') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationUnitPositionTransferLists
                idsToAdd={observationUnitPositionIdsToAdd}
                handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* ObservationUnitToEvents Transfer Lists */}
          {(associationSelected === 'observationUnitToEvents') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationUnitToEventsTransferLists
                idsToAdd={observationUnitToEventsIdsToAdd}
                handleClickOnObservationUnit_to_eventRow={handleClickOnObservationUnit_to_eventRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Program Transfer Lists */}
          {(associationSelected === 'program') && (
            <Grid item xs={12} sm={10} md={9}>
              <ProgramTransferLists
                idsToAdd={programIdsToAdd}
                handleClickOnProgramRow={handleClickOnProgramRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={10} md={9}>
              <StudyTransferLists
                idsToAdd={studyIdsToAdd}
                handleClickOnStudyRow={handleClickOnStudyRow}
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
ObservationUnitAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  germplasmIdsToAdd: PropTypes.array.isRequired,
  imagesIdsToAdd: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationTreatmentsIdsToAdd: PropTypes.array.isRequired,
  observationUnitPositionIdsToAdd: PropTypes.array.isRequired,
  observationUnitToEventsIdsToAdd: PropTypes.array.isRequired,
  programIdsToAdd: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnGermplasmRow: PropTypes.func.isRequired,
  handleClickOnImageRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
  handleClickOnObservationRow: PropTypes.func.isRequired,
  handleClickOnObservationTreatmentRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitPositionRow: PropTypes.func.isRequired,
  handleClickOnObservationUnit_to_eventRow: PropTypes.func.isRequired,
  handleClickOnProgramRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};