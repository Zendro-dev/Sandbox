import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ObservationAssociationsMenuTabs from './ObservationAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const GermplasmCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Germplasm" */ './germplasm-compact-view/GermplasmCompactView'));
const ImageCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Image" */ './image-compact-view/ImageCompactView'));
const ObservationUnitCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnit" */ './observationUnit-compact-view/ObservationUnitCompactView'));
const ObservationVariableCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationVariable" */ './observationVariable-compact-view/ObservationVariableCompactView'));
const SeasonCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Season" */ './season-compact-view/SeasonCompactView'));
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

export default function ObservationAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnGermplasmRow,
    handleClickOnImageRow,
    handleClickOnObservationUnitRow,
    handleClickOnObservationVariableRow,
    handleClickOnSeasonRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('germplasm');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ObservationAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ObservationAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Germplasm Compact View */}
        {(associationSelected === 'germplasm') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <GermplasmCompactView
                item={item}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Image Compact View */}
        {(associationSelected === 'image') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ImageCompactView
                item={item}
                handleClickOnImageRow={handleClickOnImageRow}
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
        {/* ObservationVariable Compact View */}
        {(associationSelected === 'observationVariable') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationVariableCompactView
                item={item}
                handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Season Compact View */}
        {(associationSelected === 'season') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <SeasonCompactView
                item={item}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
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
ObservationAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnGermplasmRow: PropTypes.func.isRequired, 
  handleClickOnImageRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnObservationVariableRow: PropTypes.func.isRequired, 
  handleClickOnSeasonRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
