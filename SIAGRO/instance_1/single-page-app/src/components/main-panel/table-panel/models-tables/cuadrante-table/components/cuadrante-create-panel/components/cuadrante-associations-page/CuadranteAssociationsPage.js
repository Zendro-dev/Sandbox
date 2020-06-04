import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import GrupoEnfoqueTransferLists from './grupo_enfoque-transfer-lists/Grupo_enfoqueTransferLists'
import TaxonomicInformationTransferLists from './taxonomic_information-transfer-lists/Taxonomic_informationTransferLists'
import CuadranteAssociationsMenuTabs from './CuadranteAssociationsMenuTabs'
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

export default function CuadranteAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    grupo_enfoqueIdsToAdd,
    taxonomic_informationIdsToAdd,
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
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <CuadranteAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Grupo_enfoque Transfer Lists */}
          {(associationSelected === 'grupo_enfoque') && (
            <Grid item xs={12} sm={10} md={9}>
              <GrupoEnfoqueTransferLists
                idsToAdd={grupo_enfoqueIdsToAdd}
                handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Taxonomic_information Transfer Lists */}
          {(associationSelected === 'taxonomic_information') && (
            <Grid item xs={12} sm={10} md={9}>
              <TaxonomicInformationTransferLists
                idsToAdd={taxonomic_informationIdsToAdd}
                handleClickOnTaxonRow={handleClickOnTaxonRow}
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
CuadranteAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  grupo_enfoqueIdsToAdd: PropTypes.array.isRequired,
  taxonomic_informationIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnGrupo_enfoqueRow: PropTypes.func.isRequired,
  handleClickOnTaxonRow: PropTypes.func.isRequired,
};