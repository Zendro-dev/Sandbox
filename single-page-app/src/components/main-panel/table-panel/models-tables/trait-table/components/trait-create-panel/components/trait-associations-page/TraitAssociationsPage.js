import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import TraitAssociationsMenuTabs from './TraitAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ObservationVariablesTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-ObservationVariables" */ './observationVariables-transfer-lists/ObservationVariablesTransferLists'));
const OntologyReferenceTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-OntologyReference" */ './ontologyReference-transfer-lists/OntologyReferenceTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function TraitAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    observationVariablesIdsToAdd,
    ontologyReferenceIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnObservationVariableRow,
    handleClickOnOntologyReferenceRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('observationVariables');

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
            <TraitAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
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
          {/* OntologyReference Transfer Lists */}
          {(associationSelected === 'ontologyReference') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <OntologyReferenceTransferLists
                  idsToAdd={ontologyReferenceIdsToAdd}
                  handleClickOnOntologyReferenceRow={handleClickOnOntologyReferenceRow}
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
TraitAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  observationVariablesIdsToAdd: PropTypes.array.isRequired,
  ontologyReferenceIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnObservationVariableRow: PropTypes.func.isRequired,
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired,
};