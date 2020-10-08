import React from 'react';
import PropTypes from 'prop-types';
import ImagesCompactView from './images-compact-view/ImagesCompactView'
import PersonAssociationsMenuTabs from './PersonAssociationsMenuTabs'
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

export default function PersonAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnImageAttachmentRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('images');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='PersonAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <PersonAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Images Compact View */}
        {(associationSelected === 'images') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <ImagesCompactView
              item={item}
              handleClickOnImageAttachmentRow={handleClickOnImageAttachmentRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
PersonAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnImageAttachmentRow: PropTypes.func.isRequired, 
};
