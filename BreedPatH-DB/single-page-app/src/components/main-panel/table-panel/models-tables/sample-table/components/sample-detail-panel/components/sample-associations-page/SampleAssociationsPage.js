import React from 'react';
import PropTypes from 'prop-types';
import IndividualCompactView from './individual-compact-view/IndividualCompactView'
import LibraryDataCompactView from './library_data-compact-view/Library_dataCompactView'
import SequencingExperimentCompactView from './sequencing_experiment-compact-view/Sequencing_experimentCompactView'
import TranscriptCountsCompactView from './transcript_counts-compact-view/Transcript_countsCompactView'
import SampleAssociationsMenuTabs from './SampleAssociationsMenuTabs'
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

export default function SampleAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnIndividualRow,
    handleClickOnNuc_acid_library_resultRow,
    handleClickOnSequencing_experimentRow,
    handleClickOnTranscript_countRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('individual');

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
          <SampleAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Individual Compact View */}
        {(associationSelected === 'individual') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <IndividualCompactView
              item={item}
              handleClickOnIndividualRow={handleClickOnIndividualRow}
            />
          </Grid>
        )}
        {/* Library_data Compact View */}
        {(associationSelected === 'library_data') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <LibraryDataCompactView
              item={item}
              handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
            />
          </Grid>
        )}
        {/* Sequencing_experiment Compact View */}
        {(associationSelected === 'sequencing_experiment') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <SequencingExperimentCompactView
              item={item}
              handleClickOnSequencing_experimentRow={handleClickOnSequencing_experimentRow}
            />
          </Grid>
        )}
        {/* Transcript_counts Compact View */}
        {(associationSelected === 'transcript_counts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <TranscriptCountsCompactView
              item={item}
              handleClickOnTranscript_countRow={handleClickOnTranscript_countRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
SampleAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnIndividualRow: PropTypes.func.isRequired, 
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired, 
  handleClickOnSequencing_experimentRow: PropTypes.func.isRequired, 
  handleClickOnTranscript_countRow: PropTypes.func.isRequired, 
};
