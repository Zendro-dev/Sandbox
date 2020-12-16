import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ImageAssociationsMenuTabs from './ImageAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ObservationsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Observations" */ './observations-compact-view/ObservationsCompactView'));
const ObservationUnitCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnit" */ './observationUnit-compact-view/ObservationUnitCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function ImageAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnObservationRow,
    handleClickOnObservationUnitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observations');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ImageAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ImageAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

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
        {/* ObservationUnit Compact View */}
        {(associationSelected === 'observationUnit') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationUnitCompactView
                item={item}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ImageAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
};
