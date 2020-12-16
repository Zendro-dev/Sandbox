import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import TrialAssociationsMenuTabs from './TrialAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ContactsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Contacts" */ './contacts-compact-view/ContactsCompactView'));
const ObservationUnitsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-ObservationUnits" */ './observationUnits-compact-view/ObservationUnitsCompactView'));
const ProgramCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Program" */ './program-compact-view/ProgramCompactView'));
const StudiesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Studies" */ './studies-compact-view/StudiesCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function TrialAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnContactRow,
    handleClickOnObservationUnitRow,
    handleClickOnProgramRow,
    handleClickOnStudyRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('contacts');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='TrialAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <TrialAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Contacts Compact View */}
        {(associationSelected === 'contacts') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ContactsCompactView
                item={item}
                handleClickOnContactRow={handleClickOnContactRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* ObservationUnits Compact View */}
        {(associationSelected === 'observationUnits') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ObservationUnitsCompactView
                item={item}
                handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Program Compact View */}
        {(associationSelected === 'program') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ProgramCompactView
                item={item}
                handleClickOnProgramRow={handleClickOnProgramRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Studies Compact View */}
        {(associationSelected === 'studies') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <StudiesCompactView
                item={item}
                handleClickOnStudyRow={handleClickOnStudyRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
TrialAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnContactRow: PropTypes.func.isRequired, 
  handleClickOnObservationUnitRow: PropTypes.func.isRequired, 
  handleClickOnProgramRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
};
