import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import ObservationUnitAssociationsMenuTabs from './ObservationUnitAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const EventsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Events" */ './events-transfer-lists/EventsTransferLists'));
const GermplasmTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Germplasm" */ './germplasm-transfer-lists/GermplasmTransferLists'));
const ImagesTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Images" */ './images-transfer-lists/ImagesTransferLists'));
const LocationTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Location" */ './location-transfer-lists/LocationTransferLists'));
const ObservationsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Observations" */ './observations-transfer-lists/ObservationsTransferLists'));
const ObservationTreatmentsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationTreatments" */ './observationTreatments-transfer-lists/ObservationTreatmentsTransferLists'));
const ObservationUnitPositionTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationUnitPosition" */ './observationUnitPosition-transfer-lists/ObservationUnitPositionTransferLists'));
const ProgramTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Program" */ './program-transfer-lists/ProgramTransferLists'));
const StudyTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Study" */ './study-transfer-lists/StudyTransferLists'));
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

export default function ObservationUnitAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    eventsIdsToAdd,
    germplasmIdsToAdd,
    imagesIdsToAdd,
    locationIdsToAdd,
    observationsIdsToAdd,
    observationTreatmentsIdsToAdd,
    observationUnitPositionIdsToAdd,
    programIdsToAdd,
    studyIdsToAdd,
    trialIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
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
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <ObservationUnitAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
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
          {/* Germplasm Transfer Lists */}
          {(associationSelected === 'germplasm') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <GermplasmTransferLists
                  idsToAdd={germplasmIdsToAdd}
                  handleClickOnGermplasmRow={handleClickOnGermplasmRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Images Transfer Lists */}
          {(associationSelected === 'images') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ImagesTransferLists
                  idsToAdd={imagesIdsToAdd}
                  handleClickOnImageRow={handleClickOnImageRow}
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
          {/* ObservationTreatments Transfer Lists */}
          {(associationSelected === 'observationTreatments') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ObservationTreatmentsTransferLists
                  idsToAdd={observationTreatmentsIdsToAdd}
                  handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* ObservationUnitPosition Transfer Lists */}
          {(associationSelected === 'observationUnitPosition') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ObservationUnitPositionTransferLists
                  idsToAdd={observationUnitPositionIdsToAdd}
                  handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Program Transfer Lists */}
          {(associationSelected === 'program') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ProgramTransferLists
                  idsToAdd={programIdsToAdd}
                  handleClickOnProgramRow={handleClickOnProgramRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <StudyTransferLists
                  idsToAdd={studyIdsToAdd}
                  handleClickOnStudyRow={handleClickOnStudyRow}
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
ObservationUnitAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  eventsIdsToAdd: PropTypes.array.isRequired,
  germplasmIdsToAdd: PropTypes.array.isRequired,
  imagesIdsToAdd: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  observationsIdsToAdd: PropTypes.array.isRequired,
  observationTreatmentsIdsToAdd: PropTypes.array.isRequired,
  observationUnitPositionIdsToAdd: PropTypes.array.isRequired,
  programIdsToAdd: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  trialIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
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