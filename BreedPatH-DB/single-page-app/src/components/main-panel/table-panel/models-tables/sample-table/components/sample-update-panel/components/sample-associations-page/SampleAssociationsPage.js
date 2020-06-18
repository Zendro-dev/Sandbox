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
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function SampleAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    individualIdsToAdd,
    library_dataIdsToAdd,
    library_dataIdsToRemove,
    sequencing_experimentIdsToAdd,
    transcript_countsIdsToAdd,
    transcript_countsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <SampleAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Individual Transfer Lists */}
          {(associationSelected === 'individual') && (
            <Grid item xs={12} sm={11}>
              <IndividualTransferLists
                item={item}
                idsToAdd={individualIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
              />
            </Grid>
          )}
          {/* Library_data Transfer Lists */}
          {(associationSelected === 'library_data') && (
            <Grid item xs={12} sm={11}>
              <LibraryDataTransferLists
                item={item}
                idsToAdd={library_dataIdsToAdd}
                idsToRemove={library_dataIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
              />
            </Grid>
          )}
          {/* Sequencing_experiment Transfer Lists */}
          {(associationSelected === 'sequencing_experiment') && (
            <Grid item xs={12} sm={11}>
              <SequencingExperimentTransferLists
                item={item}
                idsToAdd={sequencing_experimentIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnSequencing_experimentRow={handleClickOnSequencing_experimentRow}
              />
            </Grid>
          )}
          {/* Transcript_counts Transfer Lists */}
          {(associationSelected === 'transcript_counts') && (
            <Grid item xs={12} sm={11}>
              <TranscriptCountsTransferLists
                item={item}
                idsToAdd={transcript_countsIdsToAdd}
                idsToRemove={transcript_countsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnTranscript_countRow={handleClickOnTranscript_countRow}
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
  item: PropTypes.object.isRequired,
  individualIdsToAdd: PropTypes.array.isRequired,
  library_dataIdsToAdd: PropTypes.array.isRequired,
  library_dataIdsToRemove: PropTypes.array.isRequired,
  sequencing_experimentIdsToAdd: PropTypes.array.isRequired,
  transcript_countsIdsToAdd: PropTypes.array.isRequired,
  transcript_countsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnIndividualRow: PropTypes.func.isRequired,
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired,
  handleClickOnSequencing_experimentRow: PropTypes.func.isRequired,
  handleClickOnTranscript_countRow: PropTypes.func.isRequired,
};