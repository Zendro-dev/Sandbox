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
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function GenotypeAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    breeding_poolIdsToAdd,
    field_plotIdsToAdd,
    field_plotIdsToRemove,
    motherIdsToAdd,
    fatherIdsToAdd,
    individualIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <GenotypeAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Breeding_pool Transfer Lists */}
          {(associationSelected === 'breeding_pool') && (
            <Grid item xs={12} sm={11}>
              <BreedingPoolTransferLists
                item={item}
                idsToAdd={breeding_poolIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnBreeding_poolRow={handleClickOnBreeding_poolRow}
              />
            </Grid>
          )}
          {/* Field_plot Transfer Lists */}
          {(associationSelected === 'field_plot') && (
            <Grid item xs={12} sm={11}>
              <FieldPlotTransferLists
                item={item}
                idsToAdd={field_plotIdsToAdd}
                idsToRemove={field_plotIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnField_plotRow={handleClickOnField_plotRow}
              />
            </Grid>
          )}
          {/* Mother Transfer Lists */}
          {(associationSelected === 'mother') && (
            <Grid item xs={12} sm={11}>
              <MotherTransferLists
                item={item}
                idsToAdd={motherIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
              />
            </Grid>
          )}
          {/* Father Transfer Lists */}
          {(associationSelected === 'father') && (
            <Grid item xs={12} sm={11}>
              <FatherTransferLists
                item={item}
                idsToAdd={fatherIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnIndividualRow={handleClickOnIndividualRow}
              />
            </Grid>
          )}
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

        </Grid>
      </Fade>
    </div>
  );
}
GenotypeAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  breeding_poolIdsToAdd: PropTypes.array.isRequired,
  field_plotIdsToAdd: PropTypes.array.isRequired,
  field_plotIdsToRemove: PropTypes.array.isRequired,
  motherIdsToAdd: PropTypes.array.isRequired,
  fatherIdsToAdd: PropTypes.array.isRequired,
  individualIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnBreeding_poolRow: PropTypes.func.isRequired,
  handleClickOnField_plotRow: PropTypes.func.isRequired,
  handleClickOnIndividualRow: PropTypes.func.isRequired,
};