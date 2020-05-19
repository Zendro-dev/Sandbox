import React from 'react';
import PropTypes from 'prop-types';
import ObservationsCompactView from './observations-compact-view/ObservationsCompactView'
import SeasonToStudiesCompactView from './seasonToStudies-compact-view/SeasonToStudiesCompactView'
import SeasonAssociationsMenuTabs from './SeasonAssociationsMenuTabs'
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

export default function SeasonAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnObservationRow,
    handleClickOnStudy_to_seasonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observations');

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
          <SeasonAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Observations Compact View */}
        {(associationSelected === 'observations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservationsCompactView
              item={item}
              handleClickOnObservationRow={handleClickOnObservationRow}
            />
          </Grid>
        )}
        {/* SeasonToStudies Compact View */}
        {(associationSelected === 'seasonToStudies') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <SeasonToStudiesCompactView
              item={item}
              handleClickOnStudy_to_seasonRow={handleClickOnStudy_to_seasonRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
SeasonAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnObservationRow: PropTypes.func.isRequired, 
  handleClickOnStudy_to_seasonRow: PropTypes.func.isRequired, 
};
