import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import AssaysTransferLists from './assays-transfer-lists/AssaysTransferLists'
import AssayResultsTransferLists from './assayResults-transfer-lists/AssayResultsTransferLists'
import FileAttachmentsTransferLists from './fileAttachments-transfer-lists/FileAttachmentsTransferLists'
import SourceSetsTransferLists from './sourceSets-transfer-lists/SourceSetsTransferLists'
import ElementsTransferLists from './elements-transfer-lists/ElementsTransferLists'
import OntologyAnnotationTransferLists from './ontologyAnnotation-transfer-lists/OntologyAnnotationTransferLists'
import StudiesTransferLists from './studies-transfer-lists/StudiesTransferLists'
import MaterialAssociationsMenuTabs from './MaterialAssociationsMenuTabs'
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

export default function MaterialAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    assaysIdsToAdd,
    assaysIdsToRemove,
    assayResultsIdsToAdd,
    assayResultsIdsToRemove,
    fileAttachmentsIdsToAdd,
    fileAttachmentsIdsToRemove,
    sourceSetsIdsToAdd,
    sourceSetsIdsToRemove,
    elementsIdsToAdd,
    elementsIdsToRemove,
    ontologyAnnotationIdsToAdd,
    ontologyAnnotationIdsToRemove,
    studiesIdsToAdd,
    studiesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnAssayRow,
    handleClickOnAssayResultRow,
    handleClickOnFileAttachmentRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
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
            <MaterialAssociationsMenuTabs
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
          {/* SourceSets Transfer Lists */}
          {(associationSelected === 'sourceSets') && (
            <Grid item xs={12} sm={11}>
              <SourceSetsTransferLists
                item={item}
                idsToAdd={sourceSetsIdsToAdd}
                idsToRemove={sourceSetsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
              />
            </Grid>
          )}
          {/* Elements Transfer Lists */}
          {(associationSelected === 'elements') && (
            <Grid item xs={12} sm={11}>
              <ElementsTransferLists
                item={item}
                idsToAdd={elementsIdsToAdd}
                idsToRemove={elementsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMaterialRow={handleClickOnMaterialRow}
              />
            </Grid>
          )}
          {/* OntologyAnnotation Transfer Lists */}
          {(associationSelected === 'ontologyAnnotation') && (
            <Grid item xs={12} sm={11}>
              <OntologyAnnotationTransferLists
                item={item}
                idsToAdd={ontologyAnnotationIdsToAdd}
                idsToRemove={ontologyAnnotationIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
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
MaterialAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  assaysIdsToAdd: PropTypes.array.isRequired,
  assaysIdsToRemove: PropTypes.array.isRequired,
  assayResultsIdsToAdd: PropTypes.array.isRequired,
  assayResultsIdsToRemove: PropTypes.array.isRequired,
  fileAttachmentsIdsToAdd: PropTypes.array.isRequired,
  fileAttachmentsIdsToRemove: PropTypes.array.isRequired,
  sourceSetsIdsToAdd: PropTypes.array.isRequired,
  sourceSetsIdsToRemove: PropTypes.array.isRequired,
  elementsIdsToAdd: PropTypes.array.isRequired,
  elementsIdsToRemove: PropTypes.array.isRequired,
  ontologyAnnotationIdsToAdd: PropTypes.array.isRequired,
  ontologyAnnotationIdsToRemove: PropTypes.array.isRequired,
  studiesIdsToAdd: PropTypes.array.isRequired,
  studiesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnAssayRow: PropTypes.func.isRequired,
  handleClickOnAssayResultRow: PropTypes.func.isRequired,
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired,
  handleClickOnMaterialRow: PropTypes.func.isRequired,
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired,
  handleClickOnStudyRow: PropTypes.func.isRequired,
};