import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ContactsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Contacts" */ './contacts-compact-view/ContactsCompactView'));
const EnvironmentParametersCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-EnvironmentParameters" */ './environmentParameters-compact-view/EnvironmentParametersCompactView'));
const EventsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Events" */ './events-compact-view/EventsCompactView'));
const LocationCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Location" */ './location-compact-view/LocationCompactView'));
const ObservationsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Observations" */ './observations-compact-view/ObservationsCompactView'));
const ObservationUnitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnits" */ './observationUnits-compact-view/ObservationUnitsCompactView'));
const SeasonsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Seasons" */ './seasons-compact-view/SeasonsCompactView'));
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

export default function StudyAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
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

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='StudyAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <StudyAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Contacts Compact View */}
        {(associationSelected === 'contacts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ContactsCompactView
                item={item}
                handleClickOnContactRow={handleClickOnContactRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* EnvironmentParameters Compact View */}
        {(associationSelected === 'environmentParameters') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <EnvironmentParametersCompactView
                item={item}
                handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
              />
            </Suspense>
          </Grid>
        )}
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
        {/* ObservationUnits Compact View */}
        {(associationSelected === 'observationUnits') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationUnitsCompactView
                item={item}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Seasons Compact View */}
        {(associationSelected === 'seasons') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <SeasonsCompactView
                item={item}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
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
StudyAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnEnvironmentParameterRow: PropTypes.func.isRequired, 
  handleClickOnEventRow: PropTypes.func.isRequired, 
  handleClickOnLocationRow: PropTypes.func.isRequired, 
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnSeasonRow: PropTypes.func.isRequired, 
  handleClickOnTrialRow: PropTypes.func.isRequired, 
};
