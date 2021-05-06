import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import CuadrantesTransferLists from './cuadrantes-transfer-lists/CuadrantesTransferLists'
import TipoPlantaAssociationsMenuTabs from './Tipo_plantaAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function TipoPlantaAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    cuadrantesIdsToAdd,
    cuadrantesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnCuadranteRow,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <TipoPlantaAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Cuadrantes Transfer Lists */}
          {(associationSelected === 'cuadrantes') && (
            <Grid item xs={12} sm={11}>
              <CuadrantesTransferLists
                item={item}
                idsToAdd={cuadrantesIdsToAdd}
                idsToRemove={cuadrantesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnCuadranteRow={handleClickOnCuadranteRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
TipoPlantaAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  cuadrantesIdsToAdd: PropTypes.array.isRequired,
  cuadrantesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnCuadranteRow: PropTypes.func.isRequired,
};