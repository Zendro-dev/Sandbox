import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import RegistroAssociationsMenuTabs from './RegistroAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const CaracteristicasCuantitativasTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-transfer-lists/Caracteristicas_cuantitativasTransferLists'));
const ReferenciasTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-Referencias" */ './referencias-transfer-lists/ReferenciasTransferLists'));
const InformacionTaxonomicaTransferLists = lazy(() => import(/* webpackChunkName: "Update-TransferLists-InformacionTaxonomica" */ './informacion_taxonomica-transfer-lists/Informacion_taxonomicaTransferLists'));

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

export default function RegistroAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    caracteristicas_cuantitativasIdsToAdd,
    caracteristicas_cuantitativasIdsToRemove,
    referenciasIdsToAdd,
    referenciasIdsToRemove,
    informacion_taxonomicaIdsToAdd,
    informacion_taxonomicaIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnCaracteristica_cuantitativaRow,
    handleClickOnReferenciaRow,
    handleClickOnTaxonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('caracteristicas_cuantitativas');

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
            <RegistroAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

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
          {/* Referencias Transfer Lists */}
          {(associationSelected === 'referencias') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <ReferenciasTransferLists
                  item={item}
                  idsToAdd={referenciasIdsToAdd}
                  idsToRemove={referenciasIdsToRemove}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnReferenciaRow={handleClickOnReferenciaRow}
                />
              </Suspense>
            </Grid>
          )}
          {/* Informacion_taxonomica Transfer Lists */}
          {(associationSelected === 'informacion_taxonomica') && (
            <Grid item xs={12} sm={11}>
              <Suspense fallback={<div />}>
                <InformacionTaxonomicaTransferLists
                  item={item}
                  idsToAdd={informacion_taxonomicaIdsToAdd}
                  idsToRemove={informacion_taxonomicaIdsToRemove}
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
RegistroAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  caracteristicas_cuantitativasIdsToAdd: PropTypes.array.isRequired,
  caracteristicas_cuantitativasIdsToRemove: PropTypes.array.isRequired,
  referenciasIdsToAdd: PropTypes.array.isRequired,
  referenciasIdsToRemove: PropTypes.array.isRequired,
  informacion_taxonomicaIdsToAdd: PropTypes.array.isRequired,
  informacion_taxonomicaIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired,
  handleClickOnReferenciaRow: PropTypes.func.isRequired,
  handleClickOnTaxonRow: PropTypes.func.isRequired,
};