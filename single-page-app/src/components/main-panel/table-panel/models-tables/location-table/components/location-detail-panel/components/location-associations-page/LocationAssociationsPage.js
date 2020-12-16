import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import LocationAssociationsMenuTabs from './LocationAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ObservationUnitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnits" */ './observationUnits-compact-view/ObservationUnitsCompactView'));
const StudiesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Studies" */ './studies-compact-view/StudiesCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function LocationAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnObservationUnitRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observationUnits');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='LocationAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <LocationAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

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
        {/* Studies Compact View */}
        {(associationSelected === 'studies') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <StudiesCompactView
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
LocationAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
