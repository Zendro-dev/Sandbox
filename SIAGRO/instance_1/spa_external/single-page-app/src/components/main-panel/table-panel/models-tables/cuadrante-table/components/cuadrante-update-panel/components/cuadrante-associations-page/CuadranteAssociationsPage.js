import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GrupoEnfoqueTransferLists from './grupo_enfoque-transfer-lists/Grupo_enfoqueTransferLists'
import InformacionTaxonomicaTransferLists from './informacion_taxonomica-transfer-lists/Informacion_taxonomicaTransferLists'
import CuadranteAssociationsMenuTabs from './CuadranteAssociationsMenuTabs'
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

export default function CuadranteAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    grupo_enfoqueIdsToAdd,
    informacion_taxonomicaIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnGrupo_enfoqueRow,
    handleClickOnTaxonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('grupo_enfoque');

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
            <CuadranteAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Grupo_enfoque Transfer Lists */}
          {(associationSelected === 'grupo_enfoque') && (
            <Grid item xs={12} sm={11}>
              <GrupoEnfoqueTransferLists
                item={item}
                idsToAdd={grupo_enfoqueIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
              />
            </Grid>
          )}
          {/* Informacion_taxonomica Transfer Lists */}
          {(associationSelected === 'informacion_taxonomica') && (
            <Grid item xs={12} sm={11}>
              <InformacionTaxonomicaTransferLists
                item={item}
                idsToAdd={informacion_taxonomicaIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnTaxonRow={handleClickOnTaxonRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
CuadranteAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  grupo_enfoqueIdsToAdd: PropTypes.array.isRequired,
  informacion_taxonomicaIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnGrupo_enfoqueRow: PropTypes.func.isRequired,
  handleClickOnTaxonRow: PropTypes.func.isRequired,
};