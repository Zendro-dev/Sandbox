import React from 'react';
import PropTypes from 'prop-types';
import FieldPlotTreatmentCompactView from './field_plot_treatment-compact-view/Field_plot_treatmentCompactView'
import GenotypeCompactView from './genotype-compact-view/GenotypeCompactView'
import MeasurementsCompactView from './measurements-compact-view/MeasurementsCompactView'
import FieldPlotAssociationsMenuTabs from './Field_plotAssociationsMenuTabs'
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

export default function FieldPlotAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnField_plot_treatmentRow,
    handleClickOnGenotypeRow,
    handleClickOnMeasurementRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('field_plot_treatment');

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
          <FieldPlotAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Field_plot_treatment Compact View */}
        {(associationSelected === 'field_plot_treatment') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FieldPlotTreatmentCompactView
              item={item}
              handleClickOnField_plot_treatmentRow={handleClickOnField_plot_treatmentRow}
            />
          </Grid>
        )}
        {/* Genotype Compact View */}
        {(associationSelected === 'genotype') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <GenotypeCompactView
              item={item}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
            />
          </Grid>
        )}
        {/* Measurements Compact View */}
        {(associationSelected === 'measurements') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MeasurementsCompactView
              item={item}
              handleClickOnMeasurementRow={handleClickOnMeasurementRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
FieldPlotAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnField_plot_treatmentRow: PropTypes.func.isRequired, 
  handleClickOnGenotypeRow: PropTypes.func.isRequired, 
  handleClickOnMeasurementRow: PropTypes.func.isRequired, 
};
