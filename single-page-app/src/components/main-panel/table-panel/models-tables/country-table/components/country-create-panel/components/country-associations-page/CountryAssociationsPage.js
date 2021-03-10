import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable, retry } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../pages/ErrorBoundary';
import CountryAssociationsMenuTabs from './CountryAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const UniqueCapitalTransferLists = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-UniqueCapital" */ './unique_capital-transfer-lists/Unique_capitalTransferLists')));
const ContinentTransferLists = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-Continent" */ './continent-transfer-lists/ContinentTransferLists')));
const RiversTransferLists = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-Rivers" */ './rivers-transfer-lists/RiversTransferLists')));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function CountryAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    unique_capitalIdsToAdd,
    continentIdsToAdd,
    riversIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnCapitalRow,
    handleClickOnContinentRow,
    handleClickOnRiverRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('unique_capital');

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
            <CountryAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* Unique_capital Transfer Lists */}
          {(associationSelected === 'unique_capital') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
                <UniqueCapitalTransferLists
                  idsToAdd={unique_capitalIdsToAdd}
                  handleClickOnCapitalRow={handleClickOnCapitalRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </ErrorBoundary></Suspense>
            </Grid>
          )}
          {/* Continent Transfer Lists */}
          {(associationSelected === 'continent') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
                <ContinentTransferLists
                  idsToAdd={continentIdsToAdd}
                  handleClickOnContinentRow={handleClickOnContinentRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </ErrorBoundary></Suspense>
            </Grid>
          )}
          {/* Rivers Transfer Lists */}
          {(associationSelected === 'rivers') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
                <RiversTransferLists
                  idsToAdd={riversIdsToAdd}
                  handleClickOnRiverRow={handleClickOnRiverRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </ErrorBoundary></Suspense>
            </Grid>
          )}
        </Grid>
      </Fade>
    </div>
  );
}
CountryAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  unique_capitalIdsToAdd: PropTypes.array.isRequired,
  continentIdsToAdd: PropTypes.array.isRequired,
  riversIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnCapitalRow: PropTypes.func.isRequired,
  handleClickOnContinentRow: PropTypes.func.isRequired,
  handleClickOnRiverRow: PropTypes.func.isRequired,
};