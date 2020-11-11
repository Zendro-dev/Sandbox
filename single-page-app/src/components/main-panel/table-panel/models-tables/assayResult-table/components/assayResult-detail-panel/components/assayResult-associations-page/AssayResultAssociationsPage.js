import React from 'react';
import PropTypes from 'prop-types';
import AssayCompactView from './assay-compact-view/AssayCompactView'
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import ObservedMaterialCompactView from './observedMaterial-compact-view/ObservedMaterialCompactView'
import OntologyAnnotationsCompactView from './ontologyAnnotations-compact-view/OntologyAnnotationsCompactView'
import AssayResultAssociationsMenuTabs from './AssayResultAssociationsMenuTabs'
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

export default function AssayResultAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnAssayRow,
    handleClickOnFileAttachmentRow,
    handleClickOnMaterialRow,
    handleClickOnOntologyAnnotationRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assay');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='AssayResultAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <AssayResultAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Assay Compact View */}
        {(associationSelected === 'assay') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <AssayCompactView
              item={item}
              handleClickOnAssayRow={handleClickOnAssayRow}
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
        {/* ObservedMaterial Compact View */}
        {(associationSelected === 'observedMaterial') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ObservedMaterialCompactView
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

      </Grid>
    </Fade>
  );
}
AssayResultAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAssayRow: PropTypes.func.isRequired, 
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnMaterialRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
};
