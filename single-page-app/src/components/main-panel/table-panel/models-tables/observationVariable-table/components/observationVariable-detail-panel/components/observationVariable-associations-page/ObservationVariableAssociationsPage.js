import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ObservationVariableAssociationsMenuTabs from './ObservationVariableAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MethodCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Method" */ './method-compact-view/MethodCompactView'));
const ObservationsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Observations" */ './observations-compact-view/ObservationsCompactView'));
const OntologyReferenceCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-OntologyReference" */ './ontologyReference-compact-view/OntologyReferenceCompactView'));
const ScaleCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Scale" */ './scale-compact-view/ScaleCompactView'));
const TraitCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Trait" */ './trait-compact-view/TraitCompactView'));

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
        id='ObservationVariableAssociationsPage-div-root'
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
            <Suspense fallback={<div />}>
              <MethodCompactView
                item={item}
                handleClickOnMethodRow={handleClickOnMethodRow}
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
        {/* OntologyReference Compact View */}
        {(associationSelected === 'ontologyReference') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <OntologyReferenceCompactView
                item={item}
                handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Scale Compact View */}
        {(associationSelected === 'scale') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ScaleCompactView
                item={item}
                handleClickOnScaleRow={handleClickOnScaleRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Trait Compact View */}
        {(associationSelected === 'trait') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <TraitCompactView
                item={item}
                handleClickOnTraitRow={handleClickOnTraitRow}
              />
            </Suspense>
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
