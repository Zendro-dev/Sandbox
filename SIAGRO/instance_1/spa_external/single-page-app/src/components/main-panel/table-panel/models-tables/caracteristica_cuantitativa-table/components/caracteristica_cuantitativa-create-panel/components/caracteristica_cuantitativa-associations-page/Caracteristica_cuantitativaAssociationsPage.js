import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import CaracteristicaCuantitativaAssociationsMenuTabs from './Caracteristica_cuantitativaAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const MetodoTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Metodo" */ './metodo-transfer-lists/MetodoTransferLists'));
const RegistroTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Registro" */ './registro-transfer-lists/RegistroTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function CaracteristicaCuantitativaAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    metodoIdsToAdd,
    registroIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnMetodoRow,
    handleClickOnRegistroRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('metodo');

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
            <CaracteristicaCuantitativaAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* Metodo Transfer Lists */}
          {(associationSelected === 'metodo') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <MetodoTransferLists
                  idsToAdd={metodoIdsToAdd}
                  handleClickOnMetodoRow={handleClickOnMetodoRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Registro Transfer Lists */}
          {(associationSelected === 'registro') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <RegistroTransferLists
                  idsToAdd={registroIdsToAdd}
                  handleClickOnRegistroRow={handleClickOnRegistroRow}
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
CaracteristicaCuantitativaAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  metodoIdsToAdd: PropTypes.array.isRequired,
  registroIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnMetodoRow: PropTypes.func.isRequired,
  handleClickOnRegistroRow: PropTypes.func.isRequired,
};