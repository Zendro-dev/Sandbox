import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const ProgramsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Programs" */ './programs-compact-view/ProgramsCompactView'));
const StudiesCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Studies" */ './studies-compact-view/StudiesCompactView'));
const TrialsCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Trials" */ './trials-compact-view/TrialsCompactView'));

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
    handleClickOnProgramRow,
    handleClickOnStudyRow,
    handleClickOnTrialRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('programs');

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

        {/* Programs Compact View */}
        {(associationSelected === 'programs') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ProgramsCompactView
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
        {/* Trials Compact View */}
        {(associationSelected === 'trials') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <TrialsCompactView
                item={item}
                handleClickOnTrialRow={handleClickOnTrialRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ContactAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnProgramRow: PropTypes.func.isRequired, 
  handleClickOnStudyRow: PropTypes.func.isRequired, 
  handleClickOnTrialRow: PropTypes.func.isRequired, 
};
