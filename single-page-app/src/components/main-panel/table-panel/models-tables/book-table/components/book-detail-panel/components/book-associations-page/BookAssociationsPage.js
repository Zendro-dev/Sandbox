import React, { Suspense, lazy } from 'react';
import { retry } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../pages/ErrorBoundary';
import BookAssociationsMenuTabs from './BookAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const BooksCompactView = lazy(() => retry(() => import(/* webpackChunkName: "Detail-CompactView-Books" */ './books-compact-view/BooksCompactView')));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function BookAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnAuthorRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('books');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='BookAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <BookAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Books Compact View */}
        {(associationSelected === 'books') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
              <BooksCompactView
                item={item}
                handleClickOnAuthorRow={handleClickOnAuthorRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
BookAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnAuthorRow: PropTypes.func.isRequired, 
};
