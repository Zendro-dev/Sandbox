import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import AssaysTransferLists from './assays-transfer-lists/AssaysTransferLists'
import ContactsTransferLists from './contacts-transfer-lists/ContactsTransferLists'
import FactorsTransferLists from './factors-transfer-lists/FactorsTransferLists'
import FileAttachmentsTransferLists from './fileAttachments-transfer-lists/FileAttachmentsTransferLists'
import InvestigationTransferLists from './investigation-transfer-lists/InvestigationTransferLists'
import MaterialsTransferLists from './materials-transfer-lists/MaterialsTransferLists'
import OntologyAnnotationsTransferLists from './ontologyAnnotations-transfer-lists/OntologyAnnotationsTransferLists'
import ProtocolsTransferLists from './protocols-transfer-lists/ProtocolsTransferLists'
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
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

export default function StudyAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    assaysIdsToAdd,
    contactsIdsToAdd,
    factorsIdsToAdd,
    fileAttachmentsIdsToAdd,
    investigationIdsToAdd,
    materialsIdsToAdd,
    ontologyAnnotationsIdsToAdd,
    protocolsIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnAssayRow,
    handleClickOnContactRow,
    handleClickOnFactorRow,
    handleClickOnFileAttachmentRow,
    handleClickOnInvestigationRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnProtocolRow,
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
            <StudyAssociationsMenuTabs
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
          {/* FileAttachments Transfer Lists */}
          {(associationSelected === 'fileAttachments') && (
            <Grid item xs={12} sm={10} md={9}>
              <FileAttachmentsTransferLists
                idsToAdd={fileAttachmentsIdsToAdd}
                handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Investigation Transfer Lists */}
          {(associationSelected === 'investigation') && (
            <Grid item xs={12} sm={10} md={9}>
              <InvestigationTransferLists
                idsToAdd={investigationIdsToAdd}
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
          {/* OntologyAnnotations Transfer Lists */}
          {(associationSelected === 'ontologyAnnotations') && (
            <Grid item xs={12} sm={10} md={9}>
              <OntologyAnnotationsTransferLists
                idsToAdd={ontologyAnnotationsIdsToAdd}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
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

        </Grid>
      </Fade>
    </div>
  );
}
StudyAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  assaysIdsToAdd: PropTypes.array.isRequired,
  contactsIdsToAdd: PropTypes.array.isRequired,
  factorsIdsToAdd: PropTypes.array.isRequired,
  fileAttachmentsIdsToAdd: PropTypes.array.isRequired,
  investigationIdsToAdd: PropTypes.array.isRequired,
  materialsIdsToAdd: PropTypes.array.isRequired,
  ontologyAnnotationsIdsToAdd: PropTypes.array.isRequired,
  protocolsIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnAssayRow: PropTypes.func.isRequired,
  handleClickOnContactRow: PropTypes.func.isRequired,
  handleClickOnFactorRow: PropTypes.func.isRequired,
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired,
  handleClickOnInvestigationRow: PropTypes.func.isRequired,
  handleClickOnMaterialRow: PropTypes.func.isRequired,
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired,
  handleClickOnProtocolRow: PropTypes.func.isRequired,
};