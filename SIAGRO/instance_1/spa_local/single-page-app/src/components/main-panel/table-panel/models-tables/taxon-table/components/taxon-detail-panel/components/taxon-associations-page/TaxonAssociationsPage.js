import React from 'react';
import PropTypes from 'prop-types';
import CuadrantesCompactView from './cuadrantes-compact-view/CuadrantesCompactView'
import TaxonAssociationsMenuTabs from './TaxonAssociationsMenuTabs'
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

export default function TaxonAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnCuadranteRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('cuadrantes');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='TaxonAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <TaxonAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Cuadrantes Compact View */}
        {(associationSelected === 'cuadrantes') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <CuadrantesCompactView
              item={item}
              handleClickOnCuadranteRow={handleClickOnCuadranteRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
TaxonAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnCuadranteRow: PropTypes.func.isRequired, 
};
