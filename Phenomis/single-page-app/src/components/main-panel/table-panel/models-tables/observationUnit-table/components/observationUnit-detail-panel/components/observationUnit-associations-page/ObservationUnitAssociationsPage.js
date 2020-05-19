import React from 'react';
import PropTypes from 'prop-types';
import GermplasmCompactView from './germplasm-compact-view/GermplasmCompactView'
import ImagesCompactView from './images-compact-view/ImagesCompactView'
import LocationCompactView from './location-compact-view/LocationCompactView'
import ObservationsCompactView from './observations-compact-view/ObservationsCompactView'
import ObservationTreatmentsCompactView from './observationTreatments-compact-view/ObservationTreatmentsCompactView'
import ObservationUnitPositionCompactView from './observationUnitPosition-compact-view/ObservationUnitPositionCompactView'
import ObservationUnitToEventsCompactView from './observationUnitToEvents-compact-view/ObservationUnitToEventsCompactView'
import ProgramCompactView from './program-compact-view/ProgramCompactView'
import StudyCompactView from './study-compact-view/StudyCompactView'
import TrialCompactView from './trial-compact-view/TrialCompactView'
import ObservationUnitAssociationsMenuTabs from './ObservationUnitAssociationsMenuTabs'
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

export default function ObservationUnitAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
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
          <ObservationUnitAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Germplasm Compact View */}
        {(associationSelected === 'germplasm') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <GermplasmCompactView
              item={item}
              handleClickOnGermplasmRow={handleClickOnGermplasmRow}
            />
          </Grid>
        )}
        {/* Images Compact View */}
        {(associationSelected === 'images') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ImagesCompactView
              item={item}
              handleClickOnImageRow={handleClickOnImageRow}
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
        {/* ObservationTreatments Compact View */}
        {(associationSelected === 'observationTreatments') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationTreatmentsCompactView
              item={item}
              handleClickOnObservationTreatmentRow={handleClickOnObservationTreatmentRow}
            />
          </Grid>
        )}
        {/* ObservationUnitPosition Compact View */}
        {(associationSelected === 'observationUnitPosition') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationUnitPositionCompactView
              item={item}
              handleClickOnObservationUnitPositionRow={handleClickOnObservationUnitPositionRow}
            />
          </Grid>
        )}
        {/* ObservationUnitToEvents Compact View */}
        {(associationSelected === 'observationUnitToEvents') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationUnitToEventsCompactView
              item={item}
              handleClickOnObservationUnit_to_eventRow={handleClickOnObservationUnit_to_eventRow}
            />
          </Grid>
        )}
        {/* Program Compact View */}
        {(associationSelected === 'program') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ProgramCompactView
              item={item}
              handleClickOnProgramRow={handleClickOnProgramRow}
            />
          </Grid>
        )}
        {/* Study Compact View */}
        {(associationSelected === 'study') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudyCompactView
              item={item}
              handleClickOnStudyRow={handleClickOnStudyRow}
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
ObservationUnitAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
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
