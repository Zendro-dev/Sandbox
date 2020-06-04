import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import CuadrantesTransferLists from './cuadrantes-transfer-lists/CuadrantesTransferLists'
import LocationTransferLists from './location-transfer-lists/LocationTransferLists'
import GrupoEnfoqueAssociationsMenuTabs from './Grupo_enfoqueAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function GrupoEnfoqueAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    cuadrantesIdsToAdd,
    locationIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnCuadranteRow,
    handleClickOnLocationRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('cuadrantes');

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
            <GrupoEnfoqueAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Cuadrantes Transfer Lists */}
          {(associationSelected === 'cuadrantes') && (
            <Grid item xs={12} sm={10} md={9}>
              <CuadrantesTransferLists
                idsToAdd={cuadrantesIdsToAdd}
                handleClickOnCuadranteRow={handleClickOnCuadranteRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Location Transfer Lists */}
          {(associationSelected === 'location') && (
            <Grid item xs={12} sm={10} md={9}>
              <LocationTransferLists
                idsToAdd={locationIdsToAdd}
                handleClickOnLocationRow={handleClickOnLocationRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
GrupoEnfoqueAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  cuadrantesIdsToAdd: PropTypes.array.isRequired,
  locationIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnCuadranteRow: PropTypes.func.isRequired,
  handleClickOnLocationRow: PropTypes.func.isRequired,
};