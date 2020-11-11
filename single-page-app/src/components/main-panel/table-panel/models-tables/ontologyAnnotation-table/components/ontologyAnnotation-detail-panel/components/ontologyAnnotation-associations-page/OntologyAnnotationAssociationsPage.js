import React from 'react';
import PropTypes from 'prop-types';
import AssaysCompactView from './assays-compact-view/AssaysCompactView'
import AssayResultsCompactView from './assayResults-compact-view/AssayResultsCompactView'
import ContactsCompactView from './contacts-compact-view/ContactsCompactView'
import FactorsCompactView from './factors-compact-view/FactorsCompactView'
import InvestigationsCompactView from './investigations-compact-view/InvestigationsCompactView'
import MaterialsCompactView from './materials-compact-view/MaterialsCompactView'
import ProtocolsCompactView from './protocols-compact-view/ProtocolsCompactView'
import StudiesCompactView from './studies-compact-view/StudiesCompactView'
import OntologyAnnotationAssociationsMenuTabs from './OntologyAnnotationAssociationsMenuTabs'
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

export default function OntologyAnnotationAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnAssayRow,
    handleClickOnAssayResultRow,
    handleClickOnContactRow,
    handleClickOnFactorRow,
    handleClickOnInvestigationRow,
    handleClickOnMaterialRow,
    handleClickOnProtocolRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('assays');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='OntologyAnnotationAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <OntologyAnnotationAssociationsMenuTabs
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
        {/* Investigations Compact View */}
        {(associationSelected === 'investigations') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <InvestigationsCompactView
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
        {/* Protocols Compact View */}
        {(associationSelected === 'protocols') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ProtocolsCompactView
              item={item}
              handleClickOnProtocolRow={handleClickOnProtocolRow}
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
OntologyAnnotationAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAssayRow: PropTypes.func.isRequired, 
  handleClickOnAssayResultRow: PropTypes.func.isRequired, 
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnFactorRow: PropTypes.func.isRequired, 
  handleClickOnInvestigationRow: PropTypes.func.isRequired, 
  handleClickOnMaterialRow: PropTypes.func.isRequired, 
  handleClickOnProtocolRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
