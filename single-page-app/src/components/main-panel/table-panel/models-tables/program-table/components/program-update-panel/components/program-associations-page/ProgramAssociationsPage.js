import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ProgramAssociationsMenuTabs from './ProgramAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const LeadPersonTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-LeadPerson" */ './leadPerson-transfer-lists/LeadPersonTransferLists'));
const ObservationUnitsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-ObservationUnits" */ './observationUnits-transfer-lists/ObservationUnitsTransferLists'));
const TrialsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Trials" */ './trials-transfer-lists/TrialsTransferLists'));

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

export default function ProgramAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    leadPersonIdsToAdd,
    leadPersonIdsToRemove,
    observationUnitsIdsToAdd,
    observationUnitsIdsToRemove,
    trialsIdsToAdd,
    trialsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnContactRow,
    handleClickOnObservationUnitRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('leadPerson');

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
            <ProgramAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* LeadPerson Transfer Lists */}
          {(associationSelected === 'leadPerson') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <LeadPersonTransferLists
                  item={item}
                  idsToAdd={leadPersonIdsToAdd}
                  idsToRemove={leadPersonIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnContactRow={handleClickOnContactRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* ObservationUnits Transfer Lists */}
          {(associationSelected === 'observationUnits') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ObservationUnitsTransferLists
                  item={item}
                  idsToAdd={observationUnitsIdsToAdd}
                  idsToRemove={observationUnitsIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Trials Transfer Lists */}
          {(associationSelected === 'trials') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <TrialsTransferLists
                  item={item}
                  idsToAdd={trialsIdsToAdd}
                  idsToRemove={trialsIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnTrialRow={handleClickOnTrialRow}
                />
              </Suspense>
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
ProgramAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  leadPersonIdsToAdd: PropTypes.array.isRequired,
  leadPersonIdsToRemove: PropTypes.array.isRequired,
  observationUnitsIdsToAdd: PropTypes.array.isRequired,
  observationUnitsIdsToRemove: PropTypes.array.isRequired,
  trialsIdsToAdd: PropTypes.array.isRequired,
  trialsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};