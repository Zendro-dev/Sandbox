import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import CaracteristicaCuantitativaAssociationsMenuTabs from './Caracteristica_cuantitativaAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const RegistroCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Registro" */ './registro-compact-view/RegistroCompactView'));
const MetodoCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Metodo" */ './metodo-compact-view/MetodoCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function CaracteristicaCuantitativaAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnEjemplarRow,
    handleClickOnMetodoRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('registro');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='CaracteristicaCuantitativaAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <CaracteristicaCuantitativaAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Registro Compact View */}
        {(associationSelected === 'registro') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <RegistroCompactView
                item={item}
                handleClickOnEjemplarRow={handleClickOnEjemplarRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Metodo Compact View */}
        {(associationSelected === 'metodo') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <MetodoCompactView
                item={item}
                handleClickOnMetodoRow={handleClickOnMetodoRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
CaracteristicaCuantitativaAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnEjemplarRow: PropTypes.func.isRequired, 
  handleClickOnMetodoRow: PropTypes.func.isRequired, 
};
