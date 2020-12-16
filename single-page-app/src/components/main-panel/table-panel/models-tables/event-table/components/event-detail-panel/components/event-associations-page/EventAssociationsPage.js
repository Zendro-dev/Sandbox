import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import EventAssociationsMenuTabs from './EventAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const EventParametersCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-EventParameters" */ './eventParameters-compact-view/EventParametersCompactView'));
const ObservationUnitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnits" */ './observationUnits-compact-view/ObservationUnitsCompactView'));
const StudyCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Study" */ './study-compact-view/StudyCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function EventAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnEventParameterRow,
    handleClickOnObservationUnitRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('eventParameters');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='EventAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <EventAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* EventParameters Compact View */}
        {(associationSelected === 'eventParameters') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <EventParametersCompactView
                item={item}
                handleClickOnEventParameterRow={handleClickOnEventParameterRow}
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

      </Grid>
    </Fade>
  );
}
EventAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnEventParameterRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
