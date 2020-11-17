import React from 'react';
import PropTypes from 'prop-types';
import BreedingMethodCompactView from './breedingMethod-compact-view/BreedingMethodCompactView'
import ObservationsCompactView from './observations-compact-view/ObservationsCompactView'
import ObservationUnitsCompactView from './observationUnits-compact-view/ObservationUnitsCompactView'
import GermplasmAssociationsMenuTabs from './GermplasmAssociationsMenuTabs'
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

export default function GermplasmAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnBreedingMethodRow,
    handleClickOnObservationRow,
    handleClickOnObservationUnitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('breedingMethod');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='GermplasmAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <GermplasmAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* BreedingMethod Compact View */}
        {(associationSelected === 'breedingMethod') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <BreedingMethodCompactView
              item={item}
              handleClickOnBreedingMethodRow={handleClickOnBreedingMethodRow}
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

      </Grid>
    </Fade>
  );
}
GermplasmAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnBreedingMethodRow: PropTypes.func.isRequired, 
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
};
