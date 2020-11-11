import React from 'react';
import PropTypes from 'prop-types';
import ContactsCompactView from './contacts-compact-view/ContactsCompactView'
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import OntologyAnnotationsCompactView from './ontologyAnnotations-compact-view/OntologyAnnotationsCompactView'
import StudiesCompactView from './studies-compact-view/StudiesCompactView'
import InvestigationAssociationsMenuTabs from './InvestigationAssociationsMenuTabs'
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

export default function InvestigationAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnContactRow,
    handleClickOnFileAttachmentRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('contacts');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='InvestigationAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <InvestigationAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Contacts Compact View */}
        {(associationSelected === 'contacts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ContactsCompactView
              item={item}
              handleClickOnContactRow={handleClickOnContactRow}
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
        {/* OntologyAnnotations Compact View */}
        {(associationSelected === 'ontologyAnnotations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <OntologyAnnotationsCompactView
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
InvestigationAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
