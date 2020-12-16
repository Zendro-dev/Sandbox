import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ProgramAssociationsMenuTabs from './ProgramAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const LeadPersonCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-LeadPerson" */ './leadPerson-compact-view/LeadPersonCompactView'));
const ObservationUnitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnits" */ './observationUnits-compact-view/ObservationUnitsCompactView'));
const TrialsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Trials" */ './trials-compact-view/TrialsCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function ProgramAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnContactRow,
    handleClickOnObservationUnitRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('leadPerson');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ProgramAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ProgramAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* LeadPerson Compact View */}
        {(associationSelected === 'leadPerson') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <LeadPersonCompactView
                item={item}
                handleClickOnContactRow={handleClickOnContactRow}
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
        {/* Trials Compact View */}
        {(associationSelected === 'trials') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <TrialsCompactView
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
ProgramAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnTrialRow: PropTypes.func.isRequired, 
};
