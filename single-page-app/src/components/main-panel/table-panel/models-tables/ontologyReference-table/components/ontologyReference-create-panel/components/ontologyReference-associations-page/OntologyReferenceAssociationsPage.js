import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import OntologyReferenceAssociationsMenuTabs from './OntologyReferenceAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MethodsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Methods" */ './methods-transfer-lists/MethodsTransferLists'));
const ObservationVariablesTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationVariables" */ './observationVariables-transfer-lists/ObservationVariablesTransferLists'));
const ScalesTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Scales" */ './scales-transfer-lists/ScalesTransferLists'));
const TraitsTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Traits" */ './traits-transfer-lists/TraitsTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function OntologyReferenceAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    methodsIdsToAdd,
    observationVariablesIdsToAdd,
    scalesIdsToAdd,
    traitsIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnMethodRow,
    handleClickOnObservationVariableRow,
    handleClickOnScaleRow,
    handleClickOnTraitRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('methods');

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
            <OntologyReferenceAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* Methods Transfer Lists */}
          {(associationSelected === 'methods') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <MethodsTransferLists
                  idsToAdd={methodsIdsToAdd}
                  handleClickOnMethodRow={handleClickOnMethodRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* ObservationVariables Transfer Lists */}
          {(associationSelected === 'observationVariables') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ObservationVariablesTransferLists
                  idsToAdd={observationVariablesIdsToAdd}
                  handleClickOnObservationVariableRow={handleClickOnObservationVariableRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Scales Transfer Lists */}
          {(associationSelected === 'scales') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ScalesTransferLists
                  idsToAdd={scalesIdsToAdd}
                  handleClickOnScaleRow={handleClickOnScaleRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Traits Transfer Lists */}
          {(associationSelected === 'traits') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <TraitsTransferLists
                  idsToAdd={traitsIdsToAdd}
                  handleClickOnTraitRow={handleClickOnTraitRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>
      </Fade>
    </div>
  );
}
OntologyReferenceAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  methodsIdsToAdd: PropTypes.array.isRequired,
  observationVariablesIdsToAdd: PropTypes.array.isRequired,
  scalesIdsToAdd: PropTypes.array.isRequired,
  traitsIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnMethodRow: PropTypes.func.isRequired,
  handleClickOnObservationVariableRow: PropTypes.func.isRequired,
  handleClickOnScaleRow: PropTypes.func.isRequired,
  handleClickOnTraitRow: PropTypes.func.isRequired,
};