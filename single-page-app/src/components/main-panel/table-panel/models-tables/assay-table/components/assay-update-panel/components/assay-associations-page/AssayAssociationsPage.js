import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import AssayResultsTransferLists from './assayResults-transfer-lists/AssayResultsTransferLists'
import FactorsTransferLists from './factors-transfer-lists/FactorsTransferLists'
import FileAttachmentsTransferLists from './fileAttachments-transfer-lists/FileAttachmentsTransferLists'
import MaterialsTransferLists from './materials-transfer-lists/MaterialsTransferLists'
import OntologyAnnotationsTransferLists from './ontologyAnnotations-transfer-lists/OntologyAnnotationsTransferLists'
import StudyTransferLists from './study-transfer-lists/StudyTransferLists'
import AssayAssociationsMenuTabs from './AssayAssociationsMenuTabs'
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

export default function AssayAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    assayResultsIdsToAdd,
    assayResultsIdsToRemove,
    factorsIdsToAdd,
    factorsIdsToRemove,
    fileAttachmentsIdsToAdd,
    fileAttachmentsIdsToRemove,
    materialsIdsToAdd,
    materialsIdsToRemove,
    ontologyAnnotationsIdsToAdd,
    ontologyAnnotationsIdsToRemove,
    studyIdsToAdd,
    studyIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnAssayResultRow,
    handleClickOnFactorRow,
    handleClickOnFileAttachmentRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assayResults');

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
            <AssayAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

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
          {/* FileAttachments Transfer Lists */}
          {(associationSelected === 'fileAttachments') && (
            <Grid item xs={12} sm={11}>
              <FileAttachmentsTransferLists
                item={item}
                idsToAdd={fileAttachmentsIdsToAdd}
                idsToRemove={fileAttachmentsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
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
          {/* OntologyAnnotations Transfer Lists */}
          {(associationSelected === 'ontologyAnnotations') && (
            <Grid item xs={12} sm={11}>
              <OntologyAnnotationsTransferLists
                item={item}
                idsToAdd={ontologyAnnotationsIdsToAdd}
                idsToRemove={ontologyAnnotationsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
              />
            </Grid>
          )}
          {/* Study Transfer Lists */}
          {(associationSelected === 'study') && (
            <Grid item xs={12} sm={11}>
              <StudyTransferLists
                item={item}
                idsToAdd={studyIdsToAdd}
                idsToRemove={studyIdsToRemove}
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
AssayAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  assayResultsIdsToAdd: PropTypes.array.isRequired,
  assayResultsIdsToRemove: PropTypes.array.isRequired,
  factorsIdsToAdd: PropTypes.array.isRequired,
  factorsIdsToRemove: PropTypes.array.isRequired,
  fileAttachmentsIdsToAdd: PropTypes.array.isRequired,
  fileAttachmentsIdsToRemove: PropTypes.array.isRequired,
  materialsIdsToAdd: PropTypes.array.isRequired,
  materialsIdsToRemove: PropTypes.array.isRequired,
  ontologyAnnotationsIdsToAdd: PropTypes.array.isRequired,
  ontologyAnnotationsIdsToRemove: PropTypes.array.isRequired,
  studyIdsToAdd: PropTypes.array.isRequired,
  studyIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnAssayResultRow: PropTypes.func.isRequired,
  handleClickOnFactorRow: PropTypes.func.isRequired,
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired,
  handleClickOnMaterialRow: PropTypes.func.isRequired,
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};