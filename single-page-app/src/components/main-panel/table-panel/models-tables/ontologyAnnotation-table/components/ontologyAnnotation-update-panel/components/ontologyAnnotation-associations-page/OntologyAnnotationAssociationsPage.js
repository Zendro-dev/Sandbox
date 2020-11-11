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
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function OntologyAnnotationAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    assaysIdsToAdd,
    assaysIdsToRemove,
    assayResultsIdsToAdd,
    assayResultsIdsToRemove,
    contactsIdsToAdd,
    contactsIdsToRemove,
    factorsIdsToAdd,
    factorsIdsToRemove,
    investigationsIdsToAdd,
    investigationsIdsToRemove,
    materialsIdsToAdd,
    materialsIdsToRemove,
    protocolsIdsToAdd,
    protocolsIdsToRemove,
    studiesIdsToAdd,
    studiesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <OntologyAnnotationAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Assays Transfer Lists */}
          {(associationSelected === 'assays') && (
            <Grid item xs={12} sm={11}>
              <AssaysTransferLists
                item={item}
                idsToAdd={assaysIdsToAdd}
                idsToRemove={assaysIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnAssayRow={handleClickOnAssayRow}
              />
            </Grid>
          )}
          {/* AssayResults Transfer Lists */}
          {(associationSelected === 'assayResults') && (
            <Grid item xs={12} sm={11}>
              <AssayResultsTransferLists
                item={item}
                idsToAdd={assayResultsIdsToAdd}
                idsToRemove={assayResultsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnAssayResultRow={handleClickOnAssayResultRow}
              />
            </Grid>
          )}
          {/* Contacts Transfer Lists */}
          {(associationSelected === 'contacts') && (
            <Grid item xs={12} sm={11}>
              <ContactsTransferLists
                item={item}
                idsToAdd={contactsIdsToAdd}
                idsToRemove={contactsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnContactRow={handleClickOnContactRow}
              />
            </Grid>
          )}
          {/* Factors Transfer Lists */}
          {(associationSelected === 'factors') && (
            <Grid item xs={12} sm={11}>
              <FactorsTransferLists
                item={item}
                idsToAdd={factorsIdsToAdd}
                idsToRemove={factorsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnFactorRow={handleClickOnFactorRow}
              />
            </Grid>
          )}
          {/* Investigations Transfer Lists */}
          {(associationSelected === 'investigations') && (
            <Grid item xs={12} sm={11}>
              <InvestigationsTransferLists
                item={item}
                idsToAdd={investigationsIdsToAdd}
                idsToRemove={investigationsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnInvestigationRow={handleClickOnInvestigationRow}
              />
            </Grid>
          )}
          {/* Materials Transfer Lists */}
          {(associationSelected === 'materials') && (
            <Grid item xs={12} sm={11}>
              <MaterialsTransferLists
                item={item}
                idsToAdd={materialsIdsToAdd}
                idsToRemove={materialsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
              />
            </Grid>
          )}
          {/* Protocols Transfer Lists */}
          {(associationSelected === 'protocols') && (
            <Grid item xs={12} sm={11}>
              <ProtocolsTransferLists
                item={item}
                idsToAdd={protocolsIdsToAdd}
                idsToRemove={protocolsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnProtocolRow={handleClickOnProtocolRow}
              />
            </Grid>
          )}
          {/* Studies Transfer Lists */}
          {(associationSelected === 'studies') && (
            <Grid item xs={12} sm={11}>
              <StudiesTransferLists
                item={item}
                idsToAdd={studiesIdsToAdd}
                idsToRemove={studiesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnStudyRow={handleClickOnStudyRow}
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
  item: PropTypes.object.isRequired,
  assaysIdsToAdd: PropTypes.array.isRequired,
  assaysIdsToRemove: PropTypes.array.isRequired,
  assayResultsIdsToAdd: PropTypes.array.isRequired,
  assayResultsIdsToRemove: PropTypes.array.isRequired,
  contactsIdsToAdd: PropTypes.array.isRequired,
  contactsIdsToRemove: PropTypes.array.isRequired,
  factorsIdsToAdd: PropTypes.array.isRequired,
  factorsIdsToRemove: PropTypes.array.isRequired,
  investigationsIdsToAdd: PropTypes.array.isRequired,
  investigationsIdsToRemove: PropTypes.array.isRequired,
  materialsIdsToAdd: PropTypes.array.isRequired,
  materialsIdsToRemove: PropTypes.array.isRequired,
  protocolsIdsToAdd: PropTypes.array.isRequired,
  protocolsIdsToRemove: PropTypes.array.isRequired,
  studiesIdsToAdd: PropTypes.array.isRequired,
  studiesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnAssayRow: PropTypes.func.isRequired,
  handleClickOnAssayResultRow: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnFactorRow: PropTypes.func.isRequired,
  handleClickOnInvestigationRow: PropTypes.func.isRequired,
  handleClickOnMaterialRow: PropTypes.func.isRequired,
  handleClickOnProtocolRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};