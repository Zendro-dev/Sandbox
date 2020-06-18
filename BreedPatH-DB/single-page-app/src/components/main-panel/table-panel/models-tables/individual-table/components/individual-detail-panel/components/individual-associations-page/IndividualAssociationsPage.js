import React from 'react';
import PropTypes from 'prop-types';
import GenotypeCompactView from './genotype-compact-view/GenotypeCompactView'
import MotherToCompactView from './mother_to-compact-view/Mother_toCompactView'
import FatherToCompactView from './father_to-compact-view/Father_toCompactView'
import MarkerDataSnpsCompactView from './marker_data_snps-compact-view/Marker_data_snpsCompactView'
import SamplesCompactView from './samples-compact-view/SamplesCompactView'
import IndividualAssociationsMenuTabs from './IndividualAssociationsMenuTabs'
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

export default function IndividualAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnGenotypeRow,
    handleClickOnMarker_dataRow,
    handleClickOnSampleRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('genotype');

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
          <IndividualAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Genotype Compact View */}
        {(associationSelected === 'genotype') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <GenotypeCompactView
              item={item}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
            />
          </Grid>
        )}
        {/* Mother_to Compact View */}
        {(associationSelected === 'mother_to') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MotherToCompactView
              item={item}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
            />
          </Grid>
        )}
        {/* Father_to Compact View */}
        {(associationSelected === 'father_to') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FatherToCompactView
              item={item}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
            />
          </Grid>
        )}
        {/* Marker_data_snps Compact View */}
        {(associationSelected === 'marker_data_snps') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MarkerDataSnpsCompactView
              item={item}
              handleClickOnMarker_dataRow={handleClickOnMarker_dataRow}
            />
          </Grid>
        )}
        {/* Samples Compact View */}
        {(associationSelected === 'samples') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <SamplesCompactView
              item={item}
              handleClickOnSampleRow={handleClickOnSampleRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
IndividualAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnGenotypeRow: PropTypes.func.isRequired, 
  handleClickOnMarker_dataRow: PropTypes.func.isRequired, 
  handleClickOnSampleRow: PropTypes.func.isRequired, 
};
