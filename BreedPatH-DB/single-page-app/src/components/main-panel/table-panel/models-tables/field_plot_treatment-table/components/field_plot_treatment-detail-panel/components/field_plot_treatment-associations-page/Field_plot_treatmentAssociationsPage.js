import React from 'react';
import PropTypes from 'prop-types';
import FieldPlotCompactView from './field_plot-compact-view/Field_plotCompactView'
import FieldPlotTreatmentAssociationsMenuTabs from './Field_plot_treatmentAssociationsMenuTabs'
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

export default function FieldPlotTreatmentAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnField_plotRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('field_plot');

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
          <FieldPlotTreatmentAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Field_plot Compact View */}
        {(associationSelected === 'field_plot') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <FieldPlotCompactView
              item={item}
              handleClickOnField_plotRow={handleClickOnField_plotRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
FieldPlotTreatmentAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnField_plotRow: PropTypes.func.isRequired, 
};
