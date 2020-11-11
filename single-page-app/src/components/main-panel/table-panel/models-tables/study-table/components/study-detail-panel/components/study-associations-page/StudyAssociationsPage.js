import React from 'react';
import PropTypes from 'prop-types';
import AssaysCompactView from './assays-compact-view/AssaysCompactView'
import ContactsCompactView from './contacts-compact-view/ContactsCompactView'
import FactorsCompactView from './factors-compact-view/FactorsCompactView'
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import InvestigationCompactView from './investigation-compact-view/InvestigationCompactView'
import MaterialsCompactView from './materials-compact-view/MaterialsCompactView'
import OntologyAnnotationsCompactView from './ontologyAnnotations-compact-view/OntologyAnnotationsCompactView'
import ProtocolsCompactView from './protocols-compact-view/ProtocolsCompactView'
import StudyAssociationsMenuTabs from './StudyAssociationsMenuTabs'
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

export default function StudyAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
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

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='StudyAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <StudyAssociationsMenuTabs
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
        {/* Contacts Compact View */}
        {(associationSelected === 'contacts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ContactsCompactView
              item={item}
              handleClickOnContactRow={handleClickOnContactRow}
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
        {/* Investigation Compact View */}
        {(associationSelected === 'investigation') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <InvestigationCompactView
              item={item}
              handleClickOnInvestigationRow={handleClickOnInvestigationRow}
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
        {/* Protocols Compact View */}
        {(associationSelected === 'protocols') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ProtocolsCompactView
              item={item}
              handleClickOnProtocolRow={handleClickOnProtocolRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
StudyAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAssayRow: PropTypes.func.isRequired, 
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnFactorRow: PropTypes.func.isRequired, 
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnInvestigationRow: PropTypes.func.isRequired, 
  handleClickOnMaterialRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
  handleClickOnProtocolRow: PropTypes.func.isRequired, 
};
