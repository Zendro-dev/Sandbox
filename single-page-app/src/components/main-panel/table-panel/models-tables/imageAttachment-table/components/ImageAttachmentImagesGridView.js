import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import BrokenImage from '@material-ui/icons/BrokenImage';
import ImageAttachmentImagesGridViewItem from './ImageAttachmentImagesGridViewItem'



const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
    width: 500
  },
  text: {
    margin: theme.spacing(1),
    maxWidth: 500
  },
  notiErrorActionText: {
    color: '#eba0a0',
  },
  skeleton: {
    width: `calc(100% - 16px)`,
    height: 240,
    margin: theme.spacing(1),
  },
  gridViewItem: {
    width: `calc(100% - 16px)`,
    margin: theme.spacing(1),
  },
}));

export default function ImageAttachmentImagesGridView(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    items,
    permissions,
    handleClickOnRow,
    handleUpdateClicked,
    handleDeleteClicked,
  } = props;

  /**
   * Effects
   */
  useEffect(() => {

    console.log("@@@ items: ", items);
  }, []);

  return (
    <div className={classes.root}>
      <Grid className={classes.container} container alignItems='center' spacing={0}>
        {items.map((item, index) => {
          return (
            <Grid key={item.id} item sm={12} md={6} lg={3}>
              <div className={classes.gridViewItem}>
                <ImageAttachmentImagesGridViewItem 
                  item={item}
                  permissions={permissions}
                  handleClickOnRow={handleClickOnRow}
                  handleUpdateClicked={handleUpdateClicked}
                  handleDeleteClicked={handleDeleteClicked} 
                />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
ImageAttachmentImagesGridView.propTypes = {
  
};
