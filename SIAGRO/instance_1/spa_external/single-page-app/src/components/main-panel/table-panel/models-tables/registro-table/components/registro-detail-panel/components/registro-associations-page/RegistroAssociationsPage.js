import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import RegistroAssociationsMenuTabs from './RegistroAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const CaracteristicasCuantitativasCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-CaracteristicasCuantitativas" */ './caracteristicas_cuantitativas-compact-view/Caracteristicas_cuantitativasCompactView'));
const ReferenciasCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-Referencias" */ './referencias-compact-view/ReferenciasCompactView'));
const InformacionTaxonomicaCompactView = lazy(() => import(/* webpackChunkName: "Detail-CompactView-InformacionTaxonomica" */ './informacion_taxonomica-compact-view/Informacion_taxonomicaCompactView'));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function RegistroAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnCaracteristica_cuantitativaRow,
    handleClickOnReferenciaRow,
    handleClickOnTaxonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('caracteristicas_cuantitativas');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='RegistroAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <RegistroAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

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
        {/* Referencias Compact View */}
        {(associationSelected === 'referencias') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <ReferenciasCompactView
                item={item}
                handleClickOnReferenciaRow={handleClickOnReferenciaRow}
              />
            </Suspense>
          </Grid>
        )}
        {/* Informacion_taxonomica Compact View */}
        {(associationSelected === 'informacion_taxonomica') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}>
              <InformacionTaxonomicaCompactView
                item={item}
                handleClickOnTaxonRow={handleClickOnTaxonRow}
              />
            </Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
RegistroAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnCaracteristica_cuantitativaRow: PropTypes.func.isRequired, 
  handleClickOnReferenciaRow: PropTypes.func.isRequired, 
  handleClickOnTaxonRow: PropTypes.func.isRequired, 
};
