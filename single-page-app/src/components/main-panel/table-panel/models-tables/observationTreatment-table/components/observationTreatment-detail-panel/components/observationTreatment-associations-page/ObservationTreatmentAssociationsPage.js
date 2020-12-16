import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ObservationTreatmentAssociationsMenuTabs from './ObservationTreatmentAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
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

export default function ObservationTreatmentAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnObservationUnitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observationUnit');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ObservationTreatmentAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ObservationTreatmentAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

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
ObservationTreatmentAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
};
