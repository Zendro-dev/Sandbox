import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import SampleTransferLists from './sample-transfer-lists/SampleTransferLists'
import SequencingExperimentTransferLists from './sequencing_experiment-transfer-lists/Sequencing_experimentTransferLists'
import NucAcidLibraryResultAssociationsMenuTabs from './Nuc_acid_library_resultAssociationsMenuTabs'
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

export default function NucAcidLibraryResultAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    sampleIdsToAdd,
    sequencing_experimentIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnSampleRow,
    handleClickOnSequencing_experimentRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('sample');

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
            <NucAcidLibraryResultAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Sample Transfer Lists */}
          {(associationSelected === 'sample') && (
            <Grid item xs={12} sm={10} md={9}>
              <SampleTransferLists
                idsToAdd={sampleIdsToAdd}
                handleClickOnSampleRow={handleClickOnSampleRow}
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

        </Grid>
      </Fade>
    </div>
  );
}
NucAcidLibraryResultAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  sampleIdsToAdd: PropTypes.array.isRequired,
  sequencing_experimentIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnSampleRow: PropTypes.func.isRequired,
  handleClickOnSequencing_experimentRow: PropTypes.func.isRequired,
};