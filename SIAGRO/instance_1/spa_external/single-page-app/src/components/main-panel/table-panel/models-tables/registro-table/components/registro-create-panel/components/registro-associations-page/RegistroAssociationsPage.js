import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import RegistroAssociationsMenuTabs from './RegistroAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const CaracteristicasCuantitativasTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-transfer-lists/Caracteristicas_cuantitativasTransferLists'));
const ReferenciasTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-Referencias" */ './referencias-transfer-lists/ReferenciasTransferLists'));
const InformacionTaxonomicaTransferLists = lazy(() => import(/* webpackChunkName: "Create-TransferLists-InformacionTaxonomica" */ './informacion_taxonomica-transfer-lists/Informacion_taxonomicaTransferLists'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function RegistroAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    caracteristicas_cuantitativasIdsToAdd,
    referenciasIdsToAdd,
    informacion_taxonomicaIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
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
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <RegistroAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Transfer Lists */}
          {/* Caracteristicas_cuantitativas Transfer Lists */}
          {(associationSelected === 'caracteristicas_cuantitativas') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <CaracteristicasCuantitativasTransferLists
                  idsToAdd={caracteristicas_cuantitativasIdsToAdd}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Referencias Transfer Lists */}
          {(associationSelected === 'referencias') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <ReferenciasTransferLists
                  idsToAdd={referenciasIdsToAdd}
                  handleClickOnReferenciaRow={handleClickOnReferenciaRow}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                />
              </Suspense>
            </Grid>
          )}
          {/* Informacion_taxonomica Transfer Lists */}
          {(associationSelected === 'informacion_taxonomica') && (
            <Grid item xs={12} sm={10} md={9}>
              <Suspense fallback={<div />}>
                <InformacionTaxonomicaTransferLists
                  idsToAdd={informacion_taxonomicaIdsToAdd}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
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
RegistroAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  caracteristicas_cuantitativasIdsToAdd: PropTypes.array.isRequired,
  referenciasIdsToAdd: PropTypes.array.isRequired,
  informacion_taxonomicaIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired,
  handleClickOnReferenciaRow: PropTypes.func.isRequired,
  handleClickOnTaxonRow: PropTypes.func.isRequired,
};