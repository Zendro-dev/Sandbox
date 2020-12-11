import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import MetodoAssociationsMenuTabs from './MetodoAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const CaracteristicasCualitativasCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-CaracteristicasCualitativas" */ './caracteristicas_cualitativas-compact-view/Caracteristicas_cualitativasCompactView'));
const CaracteristicasCuantitativasCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-compact-view/Caracteristicas_cuantitativasCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function MetodoAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnCaracteristica_cualitativaRow,
    handleClickOnCaracteristica_cuantitativaRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('caracteristicas_cualitativas');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='MetodoAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <MetodoAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Caracteristicas_cualitativas Compact View */}
        {(associationSelected === 'caracteristicas_cualitativas') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <CaracteristicasCualitativasCompactView
                item={item}
                handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Caracteristicas_cuantitativas Compact View */}
        {(associationSelected === 'caracteristicas_cuantitativas') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <CaracteristicasCuantitativasCompactView
                item={item}
                handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
MetodoAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnCaracteristica_cualitativaRow: PropTypes.func.isRequired, 
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired, 
};
