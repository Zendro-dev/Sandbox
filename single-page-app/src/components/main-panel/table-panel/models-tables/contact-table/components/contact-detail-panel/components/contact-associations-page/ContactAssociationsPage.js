import React from 'react';
import PropTypes from 'prop-types';
import FileAttachmentsCompactView from './fileAttachments-compact-view/FileAttachmentsCompactView'
import InvestigationsCompactView from './investigations-compact-view/InvestigationsCompactView'
import OntologyAnnotationsCompactView from './ontologyAnnotations-compact-view/OntologyAnnotationsCompactView'
import StudiesCompactView from './studies-compact-view/StudiesCompactView'
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs'
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

export default function ContactAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnFileAttachmentRow,
    handleClickOnInvestigationRow,
    handleClickOnOntologyAnnotationRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('fileAttachments');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ContactAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ContactAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* FileAttachments Compact View */}
        {(associationSelected === 'fileAttachments') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FileAttachmentsCompactView
              item={item}
              handleClickOnFileAttachmentRow={handleClickOnFileAttachmentRow}
            />
          </Grid>
        )}
        {/* Investigations Compact View */}
        {(associationSelected === 'investigations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <InvestigationsCompactView
              item={item}
              handleClickOnInvestigationRow={handleClickOnInvestigationRow}
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
ContactAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnFileAttachmentRow: PropTypes.func.isRequired, 
  handleClickOnInvestigationRow: PropTypes.func.isRequired, 
  handleClickOnOntologyAnnotationRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
