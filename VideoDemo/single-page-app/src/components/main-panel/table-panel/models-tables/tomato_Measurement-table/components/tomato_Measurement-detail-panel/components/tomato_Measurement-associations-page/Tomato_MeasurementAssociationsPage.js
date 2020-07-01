import React from 'react';
import PropTypes from 'prop-types';
import PlantVariantCompactView from './plant_variant-compact-view/Plant_variantCompactView'
import TomatoMeasurementAssociationsMenuTabs from './Tomato_MeasurementAssociationsMenuTabs'
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

export default function TomatoMeasurementAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnPlant_variantRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('plant_variant');

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
          <TomatoMeasurementAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Plant_variant Compact View */}
        {(associationSelected === 'plant_variant') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <PlantVariantCompactView
              item={item}
              handleClickOnPlant_variantRow={handleClickOnPlant_variantRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
TomatoMeasurementAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnPlant_variantRow: PropTypes.func.isRequired, 
};
