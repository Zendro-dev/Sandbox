import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import BreedingPoolTransferLists from './breeding_pool-transfer-lists/Breeding_poolTransferLists'
import FieldPlotTransferLists from './field_plot-transfer-lists/Field_plotTransferLists'
import MotherTransferLists from './mother-transfer-lists/MotherTransferLists'
import FatherTransferLists from './father-transfer-lists/FatherTransferLists'
import IndividualTransferLists from './individual-transfer-lists/IndividualTransferLists'
import GenotypeAssociationsMenuTabs from './GenotypeAssociationsMenuTabs'
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

export default function GenotypeAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    breeding_poolIdsToAdd,
    field_plotIdsToAdd,
    motherIdsToAdd,
    fatherIdsToAdd,
    individualIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnBreeding_poolRow,
    handleClickOnField_plotRow,
    handleClickOnIndividualRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('breeding_pool');

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
            <GenotypeAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Breeding_pool Transfer Lists */}
          {(associationSelected === 'breeding_pool') && (
            <Grid item xs={12} sm={10} md={9}>
              <BreedingPoolTransferLists
                idsToAdd={breeding_poolIdsToAdd}
                handleClickOnBreeding_poolRow={handleClickOnBreeding_poolRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Field_plot Transfer Lists */}
          {(associationSelected === 'field_plot') && (
            <Grid item xs={12} sm={10} md={9}>
              <FieldPlotTransferLists
                idsToAdd={field_plotIdsToAdd}
                handleClickOnField_plotRow={handleClickOnField_plotRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Mother Transfer Lists */}
          {(associationSelected === 'mother') && (
            <Grid item xs={12} sm={10} md={9}>
              <MotherTransferLists
                idsToAdd={motherIdsToAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Father Transfer Lists */}
          {(associationSelected === 'father') && (
            <Grid item xs={12} sm={10} md={9}>
              <FatherTransferLists
                idsToAdd={fatherIdsToAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
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

        </Grid>
      </Fade>
    </div>
  );
}
GenotypeAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  breeding_poolIdsToAdd: PropTypes.array.isRequired,
  field_plotIdsToAdd: PropTypes.array.isRequired,
  motherIdsToAdd: PropTypes.array.isRequired,
  fatherIdsToAdd: PropTypes.array.isRequired,
  individualIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnBreeding_poolRow: PropTypes.func.isRequired,
  handleClickOnField_plotRow: PropTypes.func.isRequired,
  handleClickOnIndividualRow: PropTypes.func.isRequired,
};