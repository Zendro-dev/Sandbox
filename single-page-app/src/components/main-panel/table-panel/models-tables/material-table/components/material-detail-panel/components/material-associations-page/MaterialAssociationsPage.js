import React from 'react';
import PropTypes from 'prop-types';
import AssaysCompactView from './assays-compact-view/AssaysCompactView'
import AssayResultsCompactView from './assayResults-compact-view/AssayResultsCompactView'
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import SourceSetsCompactView from './sourceSets-compact-view/SourceSetsCompactView'
import ElementsCompactView from './elements-compact-view/ElementsCompactView'
import OntologyAnnotationCompactView from './ontologyAnnotation-compact-view/OntologyAnnotationCompactView'
import StudiesCompactView from './studies-compact-view/StudiesCompactView'
import MaterialAssociationsMenuTabs from './MaterialAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function MaterialAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnAssayRow,
    handleClickOnAssayResultRow,
    handleClickOnFileAttachmentRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assays');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='MaterialAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <MaterialAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Assays Compact View */}
        {(associationSelected === 'assays') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <AssaysCompactView
              item={item}
              handleClickOnAssayRow={handleClickOnAssayRow}
            />
          </Grid>
        )}
        {/* AssayResults Compact View */}
        {(associationSelected === 'assayResults') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <AssayResultsCompactView
              item={item}
              handleClickOnAssayResultRow={handleClickOnAssayResultRow}
            />
          </Grid>
        )}
        {/* FileAttachments Compact View */}
        {(associationSelected === 'fileAttachments') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FileAttachmentsCompactView
              item={item}
              handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
            />
          </Grid>
        )}
        {/* SourceSets Compact View */}
        {(associationSelected === 'sourceSets') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <SourceSetsCompactView
              item={item}
              handleClickOnMaterialRow={handleClickOnMaterialRow}
            />
          </Grid>
        )}
        {/* Elements Compact View */}
        {(associationSelected === 'elements') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ElementsCompactView
              item={item}
              handleClickOnMaterialRow={handleClickOnMaterialRow}
            />
          </Grid>
        )}
        {/* OntologyAnnotation Compact View */}
        {(associationSelected === 'ontologyAnnotation') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <OntologyAnnotationCompactView
              item={item}
              handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
            />
          </Grid>
        )}
        {/* Studies Compact View */}
        {(associationSelected === 'studies') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudiesCompactView
              item={item}
              handleClickOnStudyRow={handleClickOnStudyRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
MaterialAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAssayRow: PropTypes.func.isRequired, 
  handleClickOnAssayResultRow: PropTypes.func.isRequired, 
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnMaterialRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
