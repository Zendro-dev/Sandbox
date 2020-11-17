import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GermplasmTransferLists from './germplasm-transfer-lists/GermplasmTransferLists'
import ImageTransferLists from './image-transfer-lists/ImageTransferLists'
import ObservationUnitTransferLists from './observationUnit-transfer-lists/ObservationUnitTransferLists'
import ObservationVariableTransferLists from './observationVariable-transfer-lists/ObservationVariableTransferLists'
import SeasonTransferLists from './season-transfer-lists/SeasonTransferLists'
import StudyTransferLists from './study-transfer-lists/StudyTransferLists'
import ObservationAssociationsMenuTabs from './ObservationAssociationsMenuTabs'
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

export default function ObservationAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    germplasmIdsToAdd,
    germplasmIdsToRemove,
    imageIdsToAdd,
    imageIdsToRemove,
    observationUnitIdsToAdd,
    observationUnitIdsToRemove,
    observationVariableIdsToAdd,
    observationVariableIdsToRemove,
    seasonIdsToAdd,
    seasonIdsToRemove,
    studyIdsToAdd,
    studyIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnGermplasmRow,
    handleClickOnImageRow,
    handleClickOnObservationUnitRow,
    handleClickOnObservationVariableRow,
    handleClickOnSeasonRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('germplasm');

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
            <ObservationAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Germplasm Transfer Lists */}
          {(associationSelected === 'germplasm') && (
            <Grid item xs={12} sm={11}>
              <GermplasmTransferLists
                item={item}
                idsToAdd={germplasmIdsToAdd}
                idsToRemove={germplasmIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Grid>
          )}
          {/* Image Transfer Lists */}
          {(associationSelected === 'image') && (
            <Grid item xs={12} sm={11}>
              <ImageTransferLists
                item={item}
                idsToAdd={imageIdsToAdd}
                idsToRemove={imageIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnImageRow={handleClickOnImageRow}
              />
            </Grid>
          )}
          {/* ObservationUnit Transfer Lists */}
          {(associationSelected === 'observationUnit') && (
            <Grid item xs={12} sm={11}>
              <ObservationUnitTransferLists
                item={item}
                idsToAdd={observationUnitIdsToAdd}
                idsToRemove={observationUnitIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Grid>
          )}
          {/* ObservationVariable Transfer Lists */}
          {(associationSelected === 'observationVariable') && (
            <Grid item xs={12} sm={11}>
              <ObservationVariableTransferLists
                item={item}
                idsToAdd={observationVariableIdsToAdd}
                idsToRemove={observationVariableIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
              />
            </Grid>
          )}
          {/* Season Transfer Lists */}
          {(associationSelected === 'season') && (
            <Grid item xs={12} sm={11}>
              <SeasonTransferLists
                item={item}
                idsToAdd={seasonIdsToAdd}
                idsToRemove={seasonIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnSeasonRow={handleClickOnSeasonRow}
              />
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={11}>
              <StudyTransferLists
                item={item}
                idsToAdd={studyIdsToAdd}
                idsToRemove={studyIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
ObservationAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  germplasmIdsToAdd: PropTypes.array.isRequired,
  germplasmIdsToRemove: PropTypes.array.isRequired,
  imageIdsToAdd: PropTypes.array.isRequired,
  imageIdsToRemove: PropTypes.array.isRequired,
  observationUnitIdsToAdd: PropTypes.array.isRequired,
  observationUnitIdsToRemove: PropTypes.array.isRequired,
  observationVariableIdsToAdd: PropTypes.array.isRequired,
  observationVariableIdsToRemove: PropTypes.array.isRequired,
  seasonIdsToAdd: PropTypes.array.isRequired,
  seasonIdsToRemove: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  studyIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnGermplasmRow: PropTypes.func.isRequired,
  handleClickOnImageRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
  handleClickOnObservationVariableRow: PropTypes.func.isRequired,
  handleClickOnSeasonRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};