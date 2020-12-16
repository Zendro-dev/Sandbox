import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ObservationUnitAssociationsMenuTabs from './ObservationUnitAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const EventsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Events" */ './events-compact-view/EventsCompactView'));
const GermplasmCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Germplasm" */ './germplasm-compact-view/GermplasmCompactView'));
const ImagesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Images" */ './images-compact-view/ImagesCompactView'));
const LocationCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Location" */ './location-compact-view/LocationCompactView'));
const ObservationsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Observations" */ './observations-compact-view/ObservationsCompactView'));
const ObservationTreatmentsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationTreatments" */ './observationTreatments-compact-view/ObservationTreatmentsCompactView'));
const ObservationUnitPositionCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnitPosition" */ './observationUnitPosition-compact-view/ObservationUnitPositionCompactView'));
const ProgramCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Program" */ './program-compact-view/ProgramCompactView'));
const StudyCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Study" */ './study-compact-view/StudyCompactView'));
const TrialCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Trial" */ './trial-compact-view/TrialCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function ObservationUnitAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
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

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ObservationUnitAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ObservationUnitAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Events Compact View */}
        {(associationSelected === 'events') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <EventsCompactView
                item={item}
                handleClickOnEventRow={handleClickOnEventRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Germplasm Compact View */}
        {(associationSelected === 'germplasm') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <GermplasmCompactView
                item={item}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Images Compact View */}
        {(associationSelected === 'images') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ImagesCompactView
                item={item}
                handleClickOnImageRow={handleClickOnImageRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Location Compact View */}
        {(associationSelected === 'location') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <LocationCompactView
                item={item}
                handleClickOnLocationRow={handleClickOnLocationRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Observations Compact View */}
        {(associationSelected === 'observations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationsCompactView
                item={item}
                handleClickOnObservationRow={handleClickOnObservationRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* ObservationTreatments Compact View */}
        {(associationSelected === 'observationTreatments') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationTreatmentsCompactView
                item={item}
                handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* ObservationUnitPosition Compact View */}
        {(associationSelected === 'observationUnitPosition') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationUnitPositionCompactView
                item={item}
                handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Program Compact View */}
        {(associationSelected === 'program') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ProgramCompactView
                item={item}
                handleClickOnProgramRow={handleClickOnProgramRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Study Compact View */}
        {(associationSelected === 'study') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <StudyCompactView
                item={item}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Trial Compact View */}
        {(associationSelected === 'trial') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <TrialCompactView
                item={item}
                handleClickOnTrialRow={handleClickOnTrialRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ObservationUnitAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
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
