import React, { Suspense, lazy } from 'react';
import { retry } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../pages/ErrorBoundary';
import CountryAssociationsMenuTabs from './CountryAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const UniqueCapitalCompactView = lazy(() => retry(() => import(/* webpackChunkName: "Detail-CompactView-UniqueCapital" */ './unique_capital-compact-view/Unique_capitalCompactView')));
const ContinentCompactView = lazy(() => retry(() => import(/* webpackChunkName: "Detail-CompactView-Continent" */ './continent-compact-view/ContinentCompactView')));
const RiversCompactView = lazy(() => retry(() => import(/* webpackChunkName: "Detail-CompactView-Rivers" */ './rivers-compact-view/RiversCompactView')));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function CountryAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnCapitalRow,
    handleClickOnContinentRow,
    handleClickOnRiverRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('unique_capital');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='CountryAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <CountryAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Unique_capital Compact View */}
        {(associationSelected === 'unique_capital') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
              <UniqueCapitalCompactView
                item={item}
                handleClickOnCapitalRow={handleClickOnCapitalRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>
        )}
        {/* Continent Compact View */}
        {(associationSelected === 'continent') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
              <ContinentCompactView
                item={item}
                handleClickOnContinentRow={handleClickOnContinentRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>
        )}
        {/* Rivers Compact View */}
        {(associationSelected === 'rivers') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
              <RiversCompactView
                item={item}
                handleClickOnRiverRow={handleClickOnRiverRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
CountryAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnCapitalRow: PropTypes.func.isRequired, 
  handleClickOnContinentRow: PropTypes.func.isRequired, 
  handleClickOnRiverRow: PropTypes.func.isRequired, 
};
