import React from 'react';
import PropTypes from 'prop-types';
import BreedingPoolCompactView from './breeding_pool-compact-view/Breeding_poolCompactView'
import FieldPlotCompactView from './field_plot-compact-view/Field_plotCompactView'
import MotherCompactView from './mother-compact-view/MotherCompactView'
import FatherCompactView from './father-compact-view/FatherCompactView'
import IndividualCompactView from './individual-compact-view/IndividualCompactView'
import GenotypeAssociationsMenuTabs from './GenotypeAssociationsMenuTabs'
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

export default function GenotypeAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnBreeding_poolRow,
    handleClickOnField_plotRow,
    handleClickOnIndividualRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('breeding_pool');

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
          <GenotypeAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Breeding_pool Compact View */}
        {(associationSelected === 'breeding_pool') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <BreedingPoolCompactView
              item={item}
              handleClickOnBreeding_poolRow={handleClickOnBreeding_poolRow}
            />
          </Grid>
        )}
        {/* Field_plot Compact View */}
        {(associationSelected === 'field_plot') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FieldPlotCompactView
              item={item}
              handleClickOnField_plotRow={handleClickOnField_plotRow}
            />
          </Grid>
        )}
        {/* Mother Compact View */}
        {(associationSelected === 'mother') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MotherCompactView
              item={item}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
            />
          </Grid>
        )}
        {/* Father Compact View */}
        {(associationSelected === 'father') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FatherCompactView
              item={item}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
            />
          </Grid>
        )}
        {/* Individual Compact View */}
        {(associationSelected === 'individual') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <IndividualCompactView
              item={item}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
GenotypeAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnBreeding_poolRow: PropTypes.func.isRequired, 
  handleClickOnField_plotRow: PropTypes.func.isRequired, 
  handleClickOnIndividualRow: PropTypes.func.isRequired, 
};
