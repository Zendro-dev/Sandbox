import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ProgramsTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Programs" */ './programs-transfer-lists/ProgramsTransferLists'));
const StudiesTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Studies" */ './studies-transfer-lists/StudiesTransferLists'));
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

export default function ContactAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    programsIdsToAdd,
    programsIdsToRemove,
    studiesIdsToAdd,
    studiesIdsToRemove,
    trialsIdsToAdd,
    trialsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnProgramRow,
    handleClickOnStudyRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('programs');

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
            <ContactAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Programs Transfer Lists */}
          {(associationSelected === 'programs') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ProgramsTransferLists
                  item={item}
                  idsToAdd={programsIdsToAdd}
                  idsToRemove={programsIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnProgramRow={handleClickOnProgramRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Studies Transfer Lists */}
          {(associationSelected === 'studies') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <StudiesTransferLists
                  item={item}
                  idsToAdd={studiesIdsToAdd}
                  idsToRemove={studiesIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnStudyRow={handleClickOnStudyRow}
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
ContactAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  programsIdsToAdd: PropTypes.array.isRequired,
  programsIdsToRemove: PropTypes.array.isRequired,
  studiesIdsToAdd: PropTypes.array.isRequired,
  studiesIdsToRemove: PropTypes.array.isRequired,
  trialsIdsToAdd: PropTypes.array.isRequired,
  trialsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnProgramRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
  handleClickOnTrialRow: PropTypes.func.isRequired,
};