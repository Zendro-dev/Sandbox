import React from 'react';
import PropTypes from 'prop-types';
import NucAcidLibraryResultsCompactView from './nuc_acid_library_results-compact-view/Nuc_acid_library_resultsCompactView'
import SamplesCompactView from './samples-compact-view/SamplesCompactView'
import SequencingExperimentAssociationsMenuTabs from './Sequencing_experimentAssociationsMenuTabs'
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

export default function SequencingExperimentAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnNuc_acid_library_resultRow,
    handleClickOnSampleRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('nuc_acid_library_results');

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
          <SequencingExperimentAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Nuc_acid_library_results Compact View */}
        {(associationSelected === 'nuc_acid_library_results') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <NucAcidLibraryResultsCompactView
              item={item}
              handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
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
SequencingExperimentAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired, 
  handleClickOnSampleRow: PropTypes.func.isRequired, 
};
