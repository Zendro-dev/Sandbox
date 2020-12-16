import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import TraitAssociationsMenuTabs from './TraitAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ObservationVariablesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationVariables" */ './observationVariables-compact-view/ObservationVariablesCompactView'));
const OntologyReferenceCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-OntologyReference" */ './ontologyReference-compact-view/OntologyReferenceCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function TraitAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnObservationVariableRow,
    handleClickOnOntologyReferenceRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observationVariables');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='TraitAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <TraitAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

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

      </Grid>
    </Fade>
  );
}
TraitAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnObservationVariableRow: PropTypes.func.isRequired, 
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired, 
};
