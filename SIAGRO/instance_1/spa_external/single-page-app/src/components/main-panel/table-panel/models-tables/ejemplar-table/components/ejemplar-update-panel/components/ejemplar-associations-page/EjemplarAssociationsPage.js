import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import EjemplarAssociationsMenuTabs from './EjemplarAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const CaracteristicasCualitativasTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-CaracteristicasCualitativas" */ './caracteristicas_cualitativas-transfer-lists/Caracteristicas_cualitativasTransferLists'));
const CaracteristicasCuantitativasTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-transfer-lists/Caracteristicas_cuantitativasTransferLists'));
const TaxonTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Taxon" */ './taxon-transfer-lists/TaxonTransferLists'));

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

export default function EjemplarAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    caracteristicas_cualitativasIdsToAdd,
    caracteristicas_cualitativasIdsToRemove,
    caracteristicas_cuantitativasIdsToAdd,
    caracteristicas_cuantitativasIdsToRemove,
    taxonIdsToAdd,
    taxonIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnCaracteristica_cualitativaRow,
    handleClickOnCaracteristica_cuantitativaRow,
    handleClickOnTaxonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('caracteristicas_cualitativas');

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
            <EjemplarAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Caracteristicas_cualitativas Transfer Lists */}
          {(associationSelected === 'caracteristicas_cualitativas') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <CaracteristicasCualitativasTransferLists
                  item={item}
                  idsToAdd={caracteristicas_cualitativasIdsToAdd}
                  idsToRemove={caracteristicas_cualitativasIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Caracteristicas_cuantitativas Transfer Lists */}
          {(associationSelected === 'caracteristicas_cuantitativas') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <CaracteristicasCuantitativasTransferLists
                  item={item}
                  idsToAdd={caracteristicas_cuantitativasIdsToAdd}
                  idsToRemove={caracteristicas_cuantitativasIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Taxon Transfer Lists */}
          {(associationSelected === 'taxon') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <TaxonTransferLists
                  item={item}
                  idsToAdd={taxonIdsToAdd}
                  idsToRemove={taxonIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
                />
              </Suspense>
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
EjemplarAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  caracteristicas_cualitativasIdsToAdd: PropTypes.array.isRequired,
  caracteristicas_cualitativasIdsToRemove: PropTypes.array.isRequired,
  caracteristicas_cuantitativasIdsToAdd: PropTypes.array.isRequired,
  caracteristicas_cuantitativasIdsToRemove: PropTypes.array.isRequired,
  taxonIdsToAdd: PropTypes.array.isRequired,
  taxonIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnCaracteristica_cualitativaRow: PropTypes.func.isRequired,
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired,
  handleClickOnTaxonRow: PropTypes.func.isRequired,
};