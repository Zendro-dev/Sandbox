import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import AssaysTransferLists from './assays-transfer-lists/AssaysTransferLists'
import AssayResultsTransferLists from './assayResults-transfer-lists/AssayResultsTransferLists'
import ContactsTransferLists from './contacts-transfer-lists/ContactsTransferLists'
import FactorsTransferLists from './factors-transfer-lists/FactorsTransferLists'
import InvestigationsTransferLists from './investigations-transfer-lists/InvestigationsTransferLists'
import MaterialsTransferLists from './materials-transfer-lists/MaterialsTransferLists'
import ProtocolsTransferLists from './protocols-transfer-lists/ProtocolsTransferLists'
import StudiesTransferLists from './studies-transfer-lists/StudiesTransferLists'
import OntologyAnnotationAssociationsMenuTabs from './OntologyAnnotationAssociationsMenuTabs'
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

export default function OntologyAnnotationAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    assaysIdsToAdd,
    assayResultsIdsToAdd,
    contactsIdsToAdd,
    factorsIdsToAdd,
    investigationsIdsToAdd,
    materialsIdsToAdd,
    protocolsIdsToAdd,
    studiesIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnAssayRow,
    handleClickOnAssayResultRow,
    handleClickOnContactRow,
    handleClickOnFactorRow,
    handleClickOnInvestigationRow,
    handleClickOnMaterialRow,
    handleClickOnProtocolRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assays');

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
            <OntologyAnnotationAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Assays Transfer Lists */}
          {(associationSelected === 'assays') && (
            <Grid item xs={12} sm={10} md={9}>
              <AssaysTransferLists
                idsToAdd={assaysIdsToAdd}
                handleClickOnAssayRow={handleClickOnAssayRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* AssayResults Transfer Lists */}
          {(associationSelected === 'assayResults') && (
            <Grid item xs={12} sm={10} md={9}>
              <AssayResultsTransferLists
                idsToAdd={assayResultsIdsToAdd}
                handleClickOnAssayResultRow={handleClickOnAssayResultRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Contacts Transfer Lists */}
          {(associationSelected === 'contacts') && (
            <Grid item xs={12} sm={10} md={9}>
              <ContactsTransferLists
                idsToAdd={contactsIdsToAdd}
                handleClickOnContactRow={handleClickOnContactRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Factors Transfer Lists */}
          {(associationSelected === 'factors') && (
            <Grid item xs={12} sm={10} md={9}>
              <FactorsTransferLists
                idsToAdd={factorsIdsToAdd}
                handleClickOnFactorRow={handleClickOnFactorRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Investigations Transfer Lists */}
          {(associationSelected === 'investigations') && (
            <Grid item xs={12} sm={10} md={9}>
              <InvestigationsTransferLists
                idsToAdd={investigationsIdsToAdd}
                handleClickOnInvestigationRow={handleClickOnInvestigationRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Materials Transfer Lists */}
          {(associationSelected === 'materials') && (
            <Grid item xs={12} sm={10} md={9}>
              <MaterialsTransferLists
                idsToAdd={materialsIdsToAdd}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Protocols Transfer Lists */}
          {(associationSelected === 'protocols') && (
            <Grid item xs={12} sm={10} md={9}>
              <ProtocolsTransferLists
                idsToAdd={protocolsIdsToAdd}
                handleClickOnProtocolRow={handleClickOnProtocolRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Studies Transfer Lists */}
          {(associationSelected === 'studies') && (
            <Grid item xs={12} sm={10} md={9}>
              <StudiesTransferLists
                idsToAdd={studiesIdsToAdd}
                handleClickOnStudyRow={handleClickOnStudyRow}
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
OntologyAnnotationAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  assaysIdsToAdd: PropTypes.array.isRequired,
  assayResultsIdsToAdd: PropTypes.array.isRequired,
  contactsIdsToAdd: PropTypes.array.isRequired,
  factorsIdsToAdd: PropTypes.array.isRequired,
  investigationsIdsToAdd: PropTypes.array.isRequired,
  materialsIdsToAdd: PropTypes.array.isRequired,
  protocolsIdsToAdd: PropTypes.array.isRequired,
  studiesIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnAssayRow: PropTypes.func.isRequired,
  handleClickOnAssayResultRow: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnFactorRow: PropTypes.func.isRequired,
  handleClickOnInvestigationRow: PropTypes.func.isRequired,
  handleClickOnMaterialRow: PropTypes.func.isRequired,
  handleClickOnProtocolRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};