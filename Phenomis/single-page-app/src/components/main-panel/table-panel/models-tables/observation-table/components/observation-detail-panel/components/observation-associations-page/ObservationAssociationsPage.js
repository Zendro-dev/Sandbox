import React from 'react';
import PropTypes from 'prop-types';
import GermplasmCompactView from './germplasm-compact-view/GermplasmCompactView'
import ImageCompactView from './image-compact-view/ImageCompactView'
import ObservationUnitCompactView from './observationUnit-compact-view/ObservationUnitCompactView'
import ObservationVariableCompactView from './observationVariable-compact-view/ObservationVariableCompactView'
import SeasonCompactView from './season-compact-view/SeasonCompactView'
import StudyCompactView from './study-compact-view/StudyCompactView'
import ObservationAssociationsMenuTabs from './ObservationAssociationsMenuTabs'
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
            <GermplasmCompactView
              item={item}
              handleClickOnGermplasmRow={handleClickOnGermplasmRow}
            />
          </Grid>
        )}
        {/* Image Compact View */}
        {(associationSelected === 'image') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ImageCompactView
              item={item}
              handleClickOnImageRow={handleClickOnImageRow}
            />
          </Grid>
        )}
        {/* ObservationUnit Compact View */}
        {(associationSelected === 'observationUnit') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationUnitCompactView
              item={item}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
            />
          </Grid>
        )}
        {/* ObservationVariable Compact View */}
        {(associationSelected === 'observationVariable') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationVariableCompactView
              item={item}
              handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
            />
          </Grid>
        )}
        {/* Season Compact View */}
        {(associationSelected === 'season') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <SeasonCompactView
              item={item}
              handleClickOnSeasonRow={handleClickOnSeasonRow}
            />
          </Grid>
        )}
        {/* Study Compact View */}
        {(associationSelected === 'study') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudyCompactView
              item={item}
              handleClickOnStudyRow={handleClickOnStudyRow}
            />
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
