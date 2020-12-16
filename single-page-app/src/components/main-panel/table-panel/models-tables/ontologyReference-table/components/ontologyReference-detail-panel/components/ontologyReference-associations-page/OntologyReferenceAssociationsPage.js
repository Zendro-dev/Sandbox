import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import OntologyReferenceAssociationsMenuTabs from './OntologyReferenceAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MethodsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Methods" */ './methods-compact-view/MethodsCompactView'));
const ObservationVariablesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationVariables" */ './observationVariables-compact-view/ObservationVariablesCompactView'));
const ScalesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Scales" */ './scales-compact-view/ScalesCompactView'));
const TraitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Traits" */ './traits-compact-view/TraitsCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function OntologyReferenceAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnMethodRow,
    handleClickOnObservationVariableRow,
    handleClickOnScaleRow,
    handleClickOnTraitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('methods');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='OntologyReferenceAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <OntologyReferenceAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Methods Compact View */}
        {(associationSelected === 'methods') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <MethodsCompactView
                item={item}
                handleClickOnMethodRow={handleClickOnMethodRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* ObservationVariables Compact View */}
        {(associationSelected === 'observationVariables') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationVariablesCompactView
                item={item}
                handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Scales Compact View */}
        {(associationSelected === 'scales') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ScalesCompactView
                item={item}
                handleClickOnScaleRow={handleClickOnScaleRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Traits Compact View */}
        {(associationSelected === 'traits') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <TraitsCompactView
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
OntologyReferenceAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnMethodRow: PropTypes.func.isRequired, 
  handleClickOnObservationVariableRow: PropTypes.func.isRequired, 
  handleClickOnScaleRow: PropTypes.func.isRequired, 
  handleClickOnTraitRow: PropTypes.func.isRequired, 
};
