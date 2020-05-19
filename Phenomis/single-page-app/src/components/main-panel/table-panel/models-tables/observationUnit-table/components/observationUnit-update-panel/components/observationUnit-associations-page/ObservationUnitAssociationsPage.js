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
    germplasmIdsToAdd,
    imagesIdsToAdd,
    imagesIdsToRemove,
    locationIdsToAdd,
    observationsIdsToAdd,
    observationsIdsToRemove,
    observationTreatmentsIdsToAdd,
    observationTreatmentsIdsToRemove,
    observationUnitPositionIdsToAdd,
    observationUnitToEventsIdsToAdd,
    observationUnitToEventsIdsToRemove,
    programIdsToAdd,
    studyIdsToAdd,
    trialIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
                item={item}
                idsToAdd={germplasmIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Grid>
          )}
          {/* Images Transfer Lists */}
          {(associationSelected === 'images') && (
            <Grid item xs={12} sm={10} md={9}>
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
            <Grid item xs={12} sm={10} md={9}>
              <LocationTransferLists
                item={item}
                idsToAdd={locationIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnLocationRow={handleClickOnLocationRow}
              />
            </Grid>
          )}
          {/* Observations Transfer Lists */}
          {(associationSelected === 'observations') && (
            <Grid item xs={12} sm={10} md={9}>
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
            <Grid item xs={12} sm={10} md={9}>
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
            <Grid item xs={12} sm={10} md={9}>
              <ObservationUnitPositionTransferLists
                item={item}
                idsToAdd={observationUnitPositionIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
              />
            </Grid>
          )}
          {/* ObservationUnitToEvents Transfer Lists */}
          {(associationSelected === 'observationUnitToEvents') && (
            <Grid item xs={12} sm={10} md={9}>
              <ObservationUnitToEventsTransferLists
                item={item}
                idsToAdd={observationUnitToEventsIdsToAdd}
                idsToRemove={observationUnitToEventsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationUnit_to_eventRow={handleClickOnObservationUnit_to_eventRow}
              />
            </Grid>
          )}
          {/* Program Transfer Lists */}
          {(associationSelected === 'program') && (
            <Grid item xs={12} sm={10} md={9}>
              <ProgramTransferLists
                item={item}
                idsToAdd={programIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnProgramRow={handleClickOnProgramRow}
              />
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={10} md={9}>
              <StudyTransferLists
                item={item}
                idsToAdd={studyIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Grid>
          )}
          {/* Trial Transfer Lists */}
          {(associationSelected === 'trial') && (
            <Grid item xs={12} sm={10} md={9}>
              <TrialTransferLists
                item={item}
                idsToAdd={trialIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
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
  germplasmIdsToAdd: PropTypes.array.isRequired,
  imagesIdsToAdd: PropTypes.array.isRequired,
  imagesIdsToRemove: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToRemove: PropTypes.array.isRequired,
  observationTreatmentsIdsToAdd: PropTypes.array.isRequired,
  observationTreatmentsIdsToRemove: PropTypes.array.isRequired,
  observationUnitPositionIdsToAdd: PropTypes.array.isRequired,
  observationUnitToEventsIdsToAdd: PropTypes.array.isRequired,
  observationUnitToEventsIdsToRemove: PropTypes.array.isRequired,
  programIdsToAdd: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
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