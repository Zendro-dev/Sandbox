import React from 'react';
import PropTypes from 'prop-types';
import PersonCompactView from './person-compact-view/PersonCompactView'
import ImageAttachmentAssociationsMenuTabs from './ImageAttachmentAssociationsMenuTabs'
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

export default function ImageAttachmentAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnPersonRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('person');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='ImageAttachmentAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <ImageAttachmentAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Person Compact View */}
        {(associationSelected === 'person') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <PersonCompactView
              item={item}
              handleClickOnPersonRow={handleClickOnPersonRow}
            />
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
ImageAttachmentAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnPersonRow: PropTypes.func.isRequired, 
};
