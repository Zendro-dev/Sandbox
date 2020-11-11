import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import FileAttachmentsTransferLists from './fileAttachments-transfer-lists/FileAttachmentsTransferLists'
import InvestigationsTransferLists from './investigations-transfer-lists/InvestigationsTransferLists'
import OntologyAnnotationsTransferLists from './ontologyAnnotations-transfer-lists/OntologyAnnotationsTransferLists'
import StudiesTransferLists from './studies-transfer-lists/StudiesTransferLists'
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs'
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

export default function ContactAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    fileAttachmentsIdsToAdd,
    investigationsIdsToAdd,
    ontologyAnnotationsIdsToAdd,
    studiesIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnFileAttachmentRow,
    handleClickOnInvestigationRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('fileAttachments');

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
            <ContactAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

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
ContactAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  fileAttachmentsIdsToAdd: PropTypes.array.isRequired,
  investigationsIdsToAdd: PropTypes.array.isRequired,
  ontologyAnnotationsIdsToAdd: PropTypes.array.isRequired,
  studiesIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired,
  handleClickOnInvestigationRow: PropTypes.func.isRequired,
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};