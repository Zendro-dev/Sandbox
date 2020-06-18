import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import NucAcidLibraryResultsTransferLists from './nuc_acid_library_results-transfer-lists/Nuc_acid_library_resultsTransferLists'
import SamplesTransferLists from './samples-transfer-lists/SamplesTransferLists'
import SequencingExperimentAssociationsMenuTabs from './Sequencing_experimentAssociationsMenuTabs'
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

export default function SequencingExperimentAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    nuc_acid_library_resultsIdsToAdd,
    nuc_acid_library_resultsIdsToRemove,
    samplesIdsToAdd,
    samplesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnNuc_acid_library_resultRow,
    handleClickOnSampleRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('nuc_acid_library_results');

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
            <SequencingExperimentAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Nuc_acid_library_results Transfer Lists */}
          {(associationSelected === 'nuc_acid_library_results') && (
            <Grid item xs={12} sm={11}>
              <NucAcidLibraryResultsTransferLists
                item={item}
                idsToAdd={nuc_acid_library_resultsIdsToAdd}
                idsToRemove={nuc_acid_library_resultsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
              />
            </Grid>
          )}
          {/* Samples Transfer Lists */}
          {(associationSelected === 'samples') && (
            <Grid item xs={12} sm={11}>
              <SamplesTransferLists
                item={item}
                idsToAdd={samplesIdsToAdd}
                idsToRemove={samplesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnSampleRow={handleClickOnSampleRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
SequencingExperimentAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  nuc_acid_library_resultsIdsToAdd: PropTypes.array.isRequired,
  nuc_acid_library_resultsIdsToRemove: PropTypes.array.isRequired,
  samplesIdsToAdd: PropTypes.array.isRequired,
  samplesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired,
  handleClickOnSampleRow: PropTypes.func.isRequired,
};