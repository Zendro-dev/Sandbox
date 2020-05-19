import React from 'react';
import PropTypes from 'prop-types';
import ContactTostudiesCompactView from './contactTostudies-compact-view/ContactTostudiesCompactView'
import ContactToTrialsCompactView from './contactToTrials-compact-view/ContactToTrialsCompactView'
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs'
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

export default function ContactAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnStudy_to_contactRow,
    handleClickOnTrial_to_contactRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('contactTostudies');

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
          <ContactAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* ContactTostudies Compact View */}
        {(associationSelected === 'contactTostudies') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ContactTostudiesCompactView
              item={item}
              handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
            />
          </Grid>
        )}
        {/* ContactToTrials Compact View */}
        {(associationSelected === 'contactToTrials') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ContactToTrialsCompactView
              item={item}
              handleClickOnTrial_to_contactRow={handleClickOnTrial_to_contactRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ContactAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnStudy_to_contactRow: PropTypes.func.isRequired, 
  handleClickOnTrial_to_contactRow: PropTypes.func.isRequired, 
};
