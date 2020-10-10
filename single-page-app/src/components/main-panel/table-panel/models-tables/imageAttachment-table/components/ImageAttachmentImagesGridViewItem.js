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
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import SeeInfo from '@material-ui/icons/VisibilityTwoTone';
import Zoom from '@material-ui/core/Zoom';
import Collapse from '@material-ui/core/Collapse';
import Slide from '@material-ui/core/Slide';


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
  iconSee: {
    color: '#3f51b5',
  },
  iconEdit: {
    color: '#3f51b5'
  },
  iconDelete: {
    color: '#f50057'
  },
}));

export default function ImageAttachmentImagesGridViewItem(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { 
    item,
    permissions,
    handleClickOnRow,
    handleUpdateClicked,
    handleDeleteClicked,
  } = props;

  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isInCard, setIsInCard] = useState(false);

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
    setImageError(true); 
    setImageLoading(false);
    return;
  };

  const handleOnMouseEnterCard = async () => {
    setIsInCard(true);
  };

  const handleOnMouseLeaveCard = async () => {
    setIsInCard(false);
  };

  const handleOnMouseOverCard = async () => {
    if(!isInCard) setIsInCard(true);
  };

  return (
    <div>
        <Card className={classes.card} 
        raised={false}
        onMouseEnter={handleOnMouseEnterCard}
        onMouseLeave={handleOnMouseLeaveCard}
        onMouseOver={handleOnMouseOverCard}
        onClick={event => {
          event.stopPropagation();
          handleClickOnRow(event, item);
        }}
        >
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
              <div>
                {(isInCard) && (
                  <Slide in={(isInCard)} direction={'left'}>
                    <Grid container>
                      <Grid item>
                        {/* SeeInfo icon */}
                        <Tooltip title={ t('modelPanels.viewDetails') }>
                          <IconButton
                            id={'ImageAttachmentEnhancedTable-gridItem-iconButton-detail-'+item.id}
                            color="default"
                            onClick={event => {
                              event.stopPropagation();
                              handleClickOnRow(event, item);
                            }}
                          >
                            <SeeInfo fontSize="small" className={classes.iconSee}/>
                          </IconButton>
                        </Tooltip>
                      </Grid>

                      {/*
                        Actions:
                        - Edit
                        - Delete
                      */}
                      {
                        /* acl check */
                        (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                        &&(permissions.imageAttachment.includes('update') || permissions.imageAttachment.includes('*')))
                        &&(
                          <Grid item>
                            <Tooltip title={ t('modelPanels.edit') }>
                              <IconButton
                                id={'ImageAttachmentEnhancedTable-row-iconButton-edit-'+item.id}
                                color="default"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleUpdateClicked(event, item);
                                }}
                              >
                                <Edit fontSize="small" className={classes.iconEdit} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )
                      }

                      {
                        /* acl check */
                        (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                        &&(permissions.imageAttachment.includes('delete') || permissions.imageAttachment.includes('*')))
                        &&(
                          <Grid item>
                            <Tooltip title={ t('modelPanels.delete') }>
                              <IconButton
                                id={'ImageAttachmentEnhancedTable-row-iconButton-delete-'+item.id}
                                color="default"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDeleteClicked(event, item);
                                }}
                              >
                                <Delete fontSize="small" className={classes.iconDelete} />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        )
                      }
                    </Grid>
                  </Slide>
                )}

                {(!isInCard) && (
                  <Zoom in={!isInCard}>
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  </Zoom>
                )}
              </div>
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
            onClick={() => {console.log("click")}}
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
