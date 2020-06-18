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
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function SequencingExperimentAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    nuc_acid_library_resultsIdsToAdd,
    samplesIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
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
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <SequencingExperimentAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Nuc_acid_library_results Transfer Lists */}
          {(associationSelected === 'nuc_acid_library_results') && (
            <Grid item xs={12} sm={10} md={9}>
              <NucAcidLibraryResultsTransferLists
                idsToAdd={nuc_acid_library_resultsIdsToAdd}
                handleClickOnNuc_acid_library_resultRow={handleClickOnNuc_acid_library_resultRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Samples Transfer Lists */}
          {(associationSelected === 'samples') && (
            <Grid item xs={12} sm={10} md={9}>
              <SamplesTransferLists
                idsToAdd={samplesIdsToAdd}
                handleClickOnSampleRow={handleClickOnSampleRow}
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
SequencingExperimentAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  nuc_acid_library_resultsIdsToAdd: PropTypes.array.isRequired,
  samplesIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnNuc_acid_library_resultRow: PropTypes.func.isRequired,
  handleClickOnSampleRow: PropTypes.func.isRequired,
};