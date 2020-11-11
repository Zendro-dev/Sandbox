import React from 'react';
import PropTypes from 'prop-types';
import AssayResultsCompactView from './assayResults-compact-view/AssayResultsCompactView'
import FactorsCompactView from './factors-compact-view/FactorsCompactView'
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import MaterialsCompactView from './materials-compact-view/MaterialsCompactView'
import OntologyAnnotationsCompactView from './ontologyAnnotations-compact-view/OntologyAnnotationsCompactView'
import StudyCompactView from './study-compact-view/StudyCompactView'
import AssayAssociationsMenuTabs from './AssayAssociationsMenuTabs'
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

export default function AssayAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnAssayResultRow,
    handleClickOnFactorRow,
    handleClickOnFileAttachmentRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assayResults');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='AssayAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <AssayAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* AssayResults Compact View */}
        {(associationSelected === 'assayResults') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <AssayResultsCompactView
              item={item}
              handleClickOnAssayResultRow={handleClickOnAssayResultRow}
            />
          </Grid>
        )}
        {/* Factors Compact View */}
        {(associationSelected === 'factors') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FactorsCompactView
              item={item}
              handleClickOnFactorRow={handleClickOnFactorRow}
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
        {/* Materials Compact View */}
        {(associationSelected === 'materials') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <MaterialsCompactView
              item={item}
              handleClickOnMaterialRow={handleClickOnMaterialRow}
            />
          </Grid>
        )}
        {/* OntologyAnnotations Compact View */}
        {(associationSelected === 'ontologyAnnotations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <OntologyAnnotationsCompactView
              item={item}
              handleClickOnOntologyAnnotationRow={handleClickOnOntologyAnnotationRow}
            />
          </Grid>
        )}
        {/* Study Compact View */}
        {(associationSelected === 'study') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <StudyCompactView
              item={item}
              handleClickOnStudyRow={handleClickOnStudyRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
AssayAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAssayResultRow: PropTypes.func.isRequired, 
  handleClickOnFactorRow: PropTypes.func.isRequired, 
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnMaterialRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
