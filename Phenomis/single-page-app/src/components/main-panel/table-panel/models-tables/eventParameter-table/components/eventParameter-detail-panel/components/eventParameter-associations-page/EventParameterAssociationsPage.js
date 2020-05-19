import React from 'react';
import PropTypes from 'prop-types';
import EventCompactView from './event-compact-view/EventCompactView'
import EventParameterAssociationsMenuTabs from './EventParameterAssociationsMenuTabs'
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

export default function EventParameterAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnEventRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('event');

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
          <EventParameterAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Event Compact View */}
        {(associationSelected === 'event') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <EventCompactView
              item={item}
              handleClickOnEventRow={handleClickOnEventRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
EventParameterAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnEventRow: PropTypes.func.isRequired, 
};
