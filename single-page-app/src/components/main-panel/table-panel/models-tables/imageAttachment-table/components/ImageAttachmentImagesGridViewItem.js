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
import Avatar from '@material-ui/core/Avatar';
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
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';


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
  gridItem: {
    width: `calc(100% - 16px)`,
    margin: theme.spacing(1),
  },
  skeletonRect: {
    height: 240,
  },
  media: {
    width: "100%",
    height: 240,
  },
  cardContent: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    minWidth: 200,
  },
  card: {
    maxHeight: 405,
    //minWidth: 345 //over effect
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function ImageAttachmentImagesGridViewItem(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item } = props;

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  /**
   * Effects
   */
  useEffect(() => {

    console.log("@@@ item: ", item);
  }, []);

  /**
   * Handlers
   */
  const handleOnLoad = async () => {
    setImageLoaded(true); 
    setImageLoading(false);
    return;
  };

  const handleOnError = async () => {
    console.log("onError");
    setImageError(true); 
    setImageLoading(false);
    return;
  };

  return (
    <div>
        <Card className={classes.card}>
          {/* 
            Header 
          */}
          <CardHeader
            avatar={
              <Tooltip title={ 'ImageAttachment' }>
                <Avatar className={classes.small}>
                  i
                </Avatar>
              </Tooltip>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={
              <Grid container alignItems='center' alignContent='center' spacing={1}>
                <Grid item>
                  <Typography variant="body2" display="inline">id:</Typography>
                  <Typography variant="body2" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            }
          />
          {/* 
            Media 
          */}
            <Link href={item.fileUrl} rel="noopener noreferrer" target="_blank" onClick={(event) => {event.stopPropagation()}}>
              <div className={classes.media}>
                {/* 
                  Skeleton 
                */}
                {imageLoading && (
                  <Skeleton animation="wave" variant="rect" className={classes.media} />
                )}
                {/* 
                  Image
                */}
                {(!imageError) && (
                  <Fade in={(imageLoaded)}>
                    <CardMedia
                      className={classes.media}
                      image={item.fileUrl}
                      title={item.fileName ? item.fileName : ""}
                      component="img"
                      alt=""
                      onLoad={handleOnLoad}
                      onError={handleOnError}
                    />
                  </Fade>
                )}
                {/* 
                  Image not available 
                */}
                {(imageError) && (
                  <CardContent>
                    <Grid container className={classes.media} justify='center' alignItems='center' spacing={1}>
                      {/*Broken image icon*/}
                      <Grid item>
                        <BrokenImage color="disabled" />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" color="textSecondary">{t('modelPanels.imageNotAvailable', 'Image not available')}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                )}
              </div>
            </Link>
            {/* id*/}
            <CardContent>
              <Typography variant="body2" color="textSecondary" noWrap={true} component="p">
                {item.description}
              </Typography>
            </CardContent>
        </Card>
    </div>
  );
}
ImageAttachmentImagesGridViewItem.propTypes = {};
