import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ObservationAssociationsMenuTabs from './ObservationAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const GermplasmTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Germplasm" */ './germplasm-transfer-lists/GermplasmTransferLists'));
const ImageTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Image" */ './image-transfer-lists/ImageTransferLists'));
const ObservationUnitTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-ObservationUnit" */ './observationUnit-transfer-lists/ObservationUnitTransferLists'));
const ObservationVariableTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-ObservationVariable" */ './observationVariable-transfer-lists/ObservationVariableTransferLists'));
const SeasonTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Season" */ './season-transfer-lists/SeasonTransferLists'));
const StudyTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Study" */ './study-transfer-lists/StudyTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  },
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
              <Suspense fallback={<div />}>
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
              </Suspense>
            </Grid>
          )}
          {/* Image Transfer Lists */}
          {(associationSelected === 'image') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
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
              </Suspense>
            </Grid>
          )}
          {/* ObservationUnit Transfer Lists */}
          {(associationSelected === 'observationUnit') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
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
              </Suspense>
            </Grid>
          )}
          {/* ObservationVariable Transfer Lists */}
          {(associationSelected === 'observationVariable') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
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
              </Suspense>
            </Grid>
          )}
          {/* Season Transfer Lists */}
          {(associationSelected === 'season') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
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
              </Suspense>
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
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
              </Suspense>
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