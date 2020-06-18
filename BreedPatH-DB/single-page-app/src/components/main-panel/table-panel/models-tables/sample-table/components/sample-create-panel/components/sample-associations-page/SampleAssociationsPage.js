import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import IndividualTransferLists from './individual-transfer-lists/IndividualTransferLists'
import LibraryDataTransferLists from './library_data-transfer-lists/Library_dataTransferLists'
import SequencingExperimentTransferLists from './sequencing_experiment-transfer-lists/Sequencing_experimentTransferLists'
import TranscriptCountsTransferLists from './transcript_counts-transfer-lists/Transcript_countsTransferLists'
import SampleAssociationsMenuTabs from './SampleAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function SampleAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    individualIdsToAdd,
    library_dataIdsToAdd,
    sequencing_experimentIdsToAdd,
    transcript_countsIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnIndividualRow,
    handleClickOnNuc_acid_library_resultRow,
    handleClickOnSequencing_experimentRow,
    handleClickOnTranscript_countRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('individual');

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isDebouncingAssociationClick = useRef(false);
  const currentAssociationSelected = useRef(associationSelected);
  const lastAssociationSelected = useRef(associationSelected);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);

  const handleAssociationClick = (event, newValue) => {
    //save last value
    lastAssociationSelected.current = newValue;

    if(!isDebouncingAssociationClick.current){
      //set last value
      currentAssociationSelected.current = newValue;
      setAssociationSelected(newValue);

      //debounce
      isDebouncingAssociationClick.current = true;
      let cancelableTimer = startTimerToDebounceAssociationClick();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingAssociationClick.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastAssociationSelected.current !== currentAssociationSelected.current){
            setAssociationSelected(lastAssociationSelected.current);
            currentAssociationSelected.current = lastAssociationSelected.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };
  
  const startTimerToDebounceAssociationClick = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='center'
          alignItems='flex-start'
          alignContent='flex-start'
          spacing={0}
        > 

          {/* Menu Tabs: Associations */}
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <SampleAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Individual Transfer Lists */}
          {(associationSelected === 'individual') && (
            <Grid item xs={12} sm={10} md={9}>
              <IndividualTransferLists
                idsToAdd={individualIdsToAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Library_data Transfer Lists */}
          {(associationSelected === 'library_data') && (
            <Grid item xs={12} sm={10} md={9}>
              <LibraryDataTransferLists
                idsToAdd={library_dataIdsToAdd}
                handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Sequencing_experiment Transfer Lists */}
          {(associationSelected === 'sequencing_experiment') && (
            <Grid item xs={12} sm={10} md={9}>
              <SequencingExperimentTransferLists
                idsToAdd={sequencing_experimentIdsToAdd}
                handleClickOnSequencing_experimentRow={handleClickOnSequencing_experimentRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Transcript_counts Transfer Lists */}
          {(associationSelected === 'transcript_counts') && (
            <Grid item xs={12} sm={10} md={9}>
              <TranscriptCountsTransferLists
                idsToAdd={transcript_countsIdsToAdd}
                handleClickOnTranscript_countRow={handleClickOnTranscript_countRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
SampleAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  individualIdsToAdd: PropTypes.array.isRequired,
  library_dataIdsToAdd: PropTypes.array.isRequired,
  sequencing_experimentIdsToAdd: PropTypes.array.isRequired,
  transcript_countsIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnIndividualRow: PropTypes.func.isRequired,
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired,
  handleClickOnSequencing_experimentRow: PropTypes.func.isRequired,
  handleClickOnTranscript_countRow: PropTypes.func.isRequired,
};