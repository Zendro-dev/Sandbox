import React from 'react';
import PropTypes from 'prop-types';
import GenotypesCompactView from './genotypes-compact-view/GenotypesCompactView'
import BreedingPoolAssociationsMenuTabs from './Breeding_poolAssociationsMenuTabs'
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

export default function BreedingPoolAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnGenotypeRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('genotypes');

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
          <BreedingPoolAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Genotypes Compact View */}
        {(associationSelected === 'genotypes') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <GenotypesCompactView
              item={item}
              handleClickOnGenotypeRow={handleClickOnGenotypeRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
BreedingPoolAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnGenotypeRow: PropTypes.func.isRequired, 
};
