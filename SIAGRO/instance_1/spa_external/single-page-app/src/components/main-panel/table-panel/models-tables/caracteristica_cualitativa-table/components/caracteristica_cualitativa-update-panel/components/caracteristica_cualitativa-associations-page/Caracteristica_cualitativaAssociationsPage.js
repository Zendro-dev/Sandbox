import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import CaracteristicaCualitativaAssociationsMenuTabs from './Caracteristica_cualitativaAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const RegistroTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Registro" */ './registro-transfer-lists/RegistroTransferLists'));
const MetodoTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Metodo" */ './metodo-transfer-lists/MetodoTransferLists'));

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

export default function CaracteristicaCualitativaAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    registroIdsToAdd,
    registroIdsToRemove,
    metodoIdsToAdd,
    metodoIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnEjemplarRow,
    handleClickOnMetodoRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('registro');

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
            <CaracteristicaCualitativaAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Registro Transfer Lists */}
          {(associationSelected === 'registro') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <RegistroTransferLists
                  item={item}
                  idsToAdd={registroIdsToAdd}
                  idsToRemove={registroIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnEjemplarRow={handleClickOnEjemplarRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Metodo Transfer Lists */}
          {(associationSelected === 'metodo') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <MetodoTransferLists
                  item={item}
                  idsToAdd={metodoIdsToAdd}
                  idsToRemove={metodoIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnMetodoRow={handleClickOnMetodoRow}
                />
              </Suspense>
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
CaracteristicaCualitativaAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  registroIdsToAdd: PropTypes.array.isRequired,
  registroIdsToRemove: PropTypes.array.isRequired,
  metodoIdsToAdd: PropTypes.array.isRequired,
  metodoIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnEjemplarRow: PropTypes.func.isRequired,
  handleClickOnMetodoRow: PropTypes.func.isRequired,
};