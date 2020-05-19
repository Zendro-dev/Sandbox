import React from 'react';
import PropTypes from 'prop-types';
import MethodCompactView from './method-compact-view/MethodCompactView'
import ObservationsCompactView from './observations-compact-view/ObservationsCompactView'
import OntologyReferenceCompactView from './ontologyReference-compact-view/OntologyReferenceCompactView'
import ScaleCompactView from './scale-compact-view/ScaleCompactView'
import TraitCompactView from './trait-compact-view/TraitCompactView'
import ObservationVariableAssociationsMenuTabs from './ObservationVariableAssociationsMenuTabs'
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

export default function ObservationVariableAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnMethodRow,
    handleClickOnObservationRow,
    handleClickOnOntologyReferenceRow,
    handleClickOnScaleRow,
    handleClickOnTraitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('method');

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
          <ObservationVariableAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Method Compact View */}
        {(associationSelected === 'method') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MethodCompactView
              item={item}
              handleClickOnMethodRow={handleClickOnMethodRow}
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
        {/* OntologyReference Compact View */}
        {(associationSelected === 'ontologyReference') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <OntologyReferenceCompactView
              item={item}
              handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
            />
          </Grid>
        )}
        {/* Scale Compact View */}
        {(associationSelected === 'scale') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ScaleCompactView
              item={item}
              handleClickOnScaleRow={handleClickOnScaleRow}
            />
          </Grid>
        )}
        {/* Trait Compact View */}
        {(associationSelected === 'trait') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <TraitCompactView
              item={item}
              handleClickOnTraitRow={handleClickOnTraitRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ObservationVariableAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnMethodRow: PropTypes.func.isRequired, 
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired, 
  handleClickOnScaleRow: PropTypes.func.isRequired, 
  handleClickOnTraitRow: PropTypes.func.isRequired, 
};
