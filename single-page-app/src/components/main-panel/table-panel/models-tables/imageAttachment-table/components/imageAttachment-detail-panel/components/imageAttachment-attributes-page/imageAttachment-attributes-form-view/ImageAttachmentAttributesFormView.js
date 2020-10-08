import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';

//#imgs
import { useState } from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import BrokenImage from '@material-ui/icons/BrokenImage';
//imgs#

import StringField from './components/StringField'
import FloatField from './components/FloatField'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  card: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    maxHeight: '57vh',
    overflow: 'auto',
  },
  cardB: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
  },
  cardContent: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    minWidth: 200,
  },
  ibox: {
    padding: theme.spacing(2),
  },

//#imgs
  cardMedia: {
    height: 140,
  },
//imgs#

}));

export default function ImageAttachmentAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, valueOkStates } = props;

//#imgs
  const [imageAvailable, setImageAvailable] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
//imgs#


  function getItemsOk() {
    let countOk=0;
    let a = Object.entries(valueOkStates);
    for( let i=0; i<a.length; ++i ) {
      if(a[i][1] === 1) {
        countOk++;
      }
    }
    return countOk;
  }

  return (
    <div id='ImageAttachmentAttributesFormView-div-root' className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
            
          <Card className={classes.cardB} elevation={0}>
            {/* Header */}
            <CardHeader
              avatar={
                <Attributes color="primary" fontSize="small" />
              }
              title={
                <Typography variant="h6">
                    { t('modelPanels.model') + ': ImageAttachment' }
                </Typography>
              }
              subheader={getItemsOk()+' / 8 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>


{/* #imgs */}
            {/* 
              Image 
            */}
            {imageAvailable && (
              <Link href={item.fileUrl} rel="noopener noreferrer" target="_blank" onClick={(event) => {event.stopPropagation()}}>
                <Fade in={(imageLoaded)}>
                  <CardMedia
                    component="img"
                    alt=""
                    height="350"
                    image={item.fileUrl}
                    title={item.fileName ? item.fileName : ""}
                    onLoad={() => {setImageLoaded(true)}}
                    onError={() => {setImageAvailable(false)}}
                  />
                </Fade>
              </Link>
            )}
            {!imageAvailable && (
              <CardContent key='broken-image' className={classes.cardContent}>
                <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                  {/*Broken image icon*/}
                  <Grid item>
                    <Link href={item.fileUrl} rel="noopener noreferrer" target="_blank" onClick={(event) => {event.stopPropagation()}}>
                      <BrokenImage color="disabled" />
                    </Link>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" display="inline" color="textSecondary">{t('modelPanels.imageNotAvailable', 'Image not available')}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            )}
{/* imgs# */}

            {/* 
              Fields 
            */}
            {/* id*/}
            <CardContent key='id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* fileName */}
            <CardContent key='fileName' className={classes.cardContent} >
              <StringField
                itemKey='fileName'
                name='fileName'
                label='fileName'
                text={item.fileName}
                valueOk={valueOkStates.fileName}
              />
            </CardContent>

            {/* fileSizeKb */}
            <CardContent key='fileSizeKb' className={classes.cardContent} >
              <FloatField
                itemKey='fileSizeKb'
                name='fileSizeKb'
                label='fileSizeKb'
                text={item.fileSizeKb}
                valueOk={valueOkStates.fileSizeKb}
              />
            </CardContent>

            {/* fileType */}
            <CardContent key='fileType' className={classes.cardContent} >
              <StringField
                itemKey='fileType'
                name='fileType'
                label='fileType'
                text={item.fileType}
                valueOk={valueOkStates.fileType}
              />
            </CardContent>

            {/* filePath */}
            <CardContent key='filePath' className={classes.cardContent} >
              <StringField
                itemKey='filePath'
                name='filePath'
                label='filePath'
                text={item.filePath}
                valueOk={valueOkStates.filePath}
              />
            </CardContent>

            {/* smallTnPath */}
            <CardContent key='smallTnPath' className={classes.cardContent} >
              <StringField
                itemKey='smallTnPath'
                name='smallTnPath'
                label='smallTnPath'
                text={item.smallTnPath}
                valueOk={valueOkStates.smallTnPath}
              />
            </CardContent>

            {/* mediumTnPath */}
            <CardContent key='mediumTnPath' className={classes.cardContent} >
              <StringField
                itemKey='mediumTnPath'
                name='mediumTnPath'
                label='mediumTnPath'
                text={item.mediumTnPath}
                valueOk={valueOkStates.mediumTnPath}
              />
            </CardContent>

            {/* licence */}
            <CardContent key='licence' className={classes.cardContent} >
              <StringField
                itemKey='licence'
                name='licence'
                label='licence'
                text={item.licence}
                valueOk={valueOkStates.licence}
              />
            </CardContent>

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                text={item.description}
                valueOk={valueOkStates.description}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ImageAttachmentAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};