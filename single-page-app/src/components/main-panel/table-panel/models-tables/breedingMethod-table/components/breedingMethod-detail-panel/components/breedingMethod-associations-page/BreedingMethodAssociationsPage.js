import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import BreedingMethodAssociationsMenuTabs from './BreedingMethodAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const GermplasmCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Germplasm" */ './germplasm-compact-view/GermplasmCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function BreedingMethodAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnGermplasmRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('germplasm');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='BreedingMethodAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <BreedingMethodAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Germplasm Compact View */}
        {(associationSelected === 'germplasm') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <GermplasmCompactView
                item={item}
                handleClickOnGermplasmRow={handleClickOnGermplasmRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
BreedingMethodAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnGermplasmRow: PropTypes.func.isRequired, 
};
