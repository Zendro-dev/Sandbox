import React from 'react';
import PropTypes from 'prop-types';
import GrupoEnfoqueCompactView from './grupo_enfoque-compact-view/Grupo_enfoqueCompactView'
import InformacionTaxonomicaCompactView from './informacion_taxonomica-compact-view/Informacion_taxonomicaCompactView'
import CuadranteAssociationsMenuTabs from './CuadranteAssociationsMenuTabs'
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

export default function CuadranteAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnGrupo_enfoqueRow,
    handleClickOnTaxonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('grupo_enfoque');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <CuadranteAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Grupo_enfoque Compact View */}
        {(associationSelected === 'grupo_enfoque') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <GrupoEnfoqueCompactView
              item={item}
              handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
            />
          </Grid>
        )}
        {/* Informacion_taxonomica Compact View */}
        {(associationSelected === 'informacion_taxonomica') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <InformacionTaxonomicaCompactView
              item={item}
              handleClickOnTaxonRow={handleClickOnTaxonRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
CuadranteAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnGrupo_enfoqueRow: PropTypes.func.isRequired, 
  handleClickOnTaxonRow: PropTypes.func.isRequired, 
};
