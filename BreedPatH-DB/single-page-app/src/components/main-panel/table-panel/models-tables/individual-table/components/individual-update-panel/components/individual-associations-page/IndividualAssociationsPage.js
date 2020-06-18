import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GenotypeTransferLists from './genotype-transfer-lists/GenotypeTransferLists'
import MotherToTransferLists from './mother_to-transfer-lists/Mother_toTransferLists'
import FatherToTransferLists from './father_to-transfer-lists/Father_toTransferLists'
import MarkerDataSnpsTransferLists from './marker_data_snps-transfer-lists/Marker_data_snpsTransferLists'
import SamplesTransferLists from './samples-transfer-lists/SamplesTransferLists'
import IndividualAssociationsMenuTabs from './IndividualAssociationsMenuTabs'
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

export default function IndividualAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    genotypeIdsToAdd,
    mother_toIdsToAdd,
    father_toIdsToAdd,
    marker_data_snpsIdsToAdd,
    marker_data_snpsIdsToRemove,
    samplesIdsToAdd,
    samplesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnGenotypeRow,
    handleClickOnMarker_dataRow,
    handleClickOnSampleRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('genotype');

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
            <IndividualAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Genotype Transfer Lists */}
          {(associationSelected === 'genotype') && (
            <Grid item xs={12} sm={11}>
              <GenotypeTransferLists
                item={item}
                idsToAdd={genotypeIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGenotypeRow={handleClickOnGenotypeRow}
              />
            </Grid>
          )}
          {/* Mother_to Transfer Lists */}
          {(associationSelected === 'mother_to') && (
            <Grid item xs={12} sm={11}>
              <MotherToTransferLists
                item={item}
                idsToAdd={mother_toIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGenotypeRow={handleClickOnGenotypeRow}
              />
            </Grid>
          )}
          {/* Father_to Transfer Lists */}
          {(associationSelected === 'father_to') && (
            <Grid item xs={12} sm={11}>
              <FatherToTransferLists
                item={item}
                idsToAdd={father_toIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGenotypeRow={handleClickOnGenotypeRow}
              />
            </Grid>
          )}
          {/* Marker_data_snps Transfer Lists */}
          {(associationSelected === 'marker_data_snps') && (
            <Grid item xs={12} sm={11}>
              <MarkerDataSnpsTransferLists
                item={item}
                idsToAdd={marker_data_snpsIdsToAdd}
                idsToRemove={marker_data_snpsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMarker_dataRow={handleClickOnMarker_dataRow}
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
IndividualAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  genotypeIdsToAdd: PropTypes.array.isRequired,
  mother_toIdsToAdd: PropTypes.array.isRequired,
  father_toIdsToAdd: PropTypes.array.isRequired,
  marker_data_snpsIdsToAdd: PropTypes.array.isRequired,
  marker_data_snpsIdsToRemove: PropTypes.array.isRequired,
  samplesIdsToAdd: PropTypes.array.isRequired,
  samplesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnGenotypeRow: PropTypes.func.isRequired,
  handleClickOnMarker_dataRow: PropTypes.func.isRequired,
  handleClickOnSampleRow: PropTypes.func.isRequired,
};