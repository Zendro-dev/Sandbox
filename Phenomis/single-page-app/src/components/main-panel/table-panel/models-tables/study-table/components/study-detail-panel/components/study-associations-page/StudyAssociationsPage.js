import React from 'react';
import PropTypes from 'prop-types';
import EnvironmentParametersCompactView from './environmentParameters-compact-view/EnvironmentParametersCompactView'
import EventsCompactView from './events-compact-view/EventsCompactView'
import LocationCompactView from './location-compact-view/LocationCompactView'
import ObservationsCompactView from './observations-compact-view/ObservationsCompactView'
import ObservationUnitsCompactView from './observationUnits-compact-view/ObservationUnitsCompactView'
import StudyToContactsCompactView from './studyToContacts-compact-view/StudyToContactsCompactView'
import StudyToSeasonsCompactView from './studyToSeasons-compact-view/StudyToSeasonsCompactView'
import TrialCompactView from './trial-compact-view/TrialCompactView'
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

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

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
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

        {/* EnvironmentParameters Compact View */}
        {(associationSelected === 'environmentParameters') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <EnvironmentParametersCompactView
              item={item}
              handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
            />
          </Grid>
        )}
        {/* Events Compact View */}
        {(associationSelected === 'events') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <EventsCompactView
              item={item}
              handleClickOnEventRow={handleClickOnEventRow}
            />
          </Grid>
        )}
        {/* Location Compact View */}
        {(associationSelected === 'location') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <LocationCompactView
              item={item}
              handleClickOnLocationRow={handleClickOnLocationRow}
            />
          </Grid>
        )}
        {/* Observations Compact View */}
        {(associationSelected === 'observations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationsCompactView
              item={item}
              handleClickOnObservationRow={handleClickOnObservationRow}
            />
          </Grid>
        )}
        {/* ObservationUnits Compact View */}
        {(associationSelected === 'observationUnits') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationUnitsCompactView
              item={item}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
            />
          </Grid>
        )}
        {/* StudyToContacts Compact View */}
        {(associationSelected === 'studyToContacts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudyToContactsCompactView
              item={item}
              handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
            />
          </Grid>
        )}
        {/* StudyToSeasons Compact View */}
        {(associationSelected === 'studyToSeasons') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudyToSeasonsCompactView
              item={item}
              handleClickOnStudy_to_seasonRow={handleClickOnStudy_to_seasonRow}
            />
          </Grid>
        )}
        {/* Trial Compact View */}
        {(associationSelected === 'trial') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <TrialCompactView
              item={item}
              handleClickOnTrialRow={handleClickOnTrialRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
StudyAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnEnvironmentParameterRow: PropTypes.func.isRequired, 
  handleClickOnEventRow: PropTypes.func.isRequired, 
  handleClickOnLocationRow: PropTypes.func.isRequired, 
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnStudy_to_contactRow: PropTypes.func.isRequired, 
  handleClickOnStudy_to_seasonRow: PropTypes.func.isRequired, 
  handleClickOnTrialRow: PropTypes.func.isRequired, 
};
