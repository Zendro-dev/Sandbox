import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';
import Tooltip from '@material-ui/core/Tooltip';

import StringField from './components/StringField'

import IntField from './components/IntField'

import BoolField from './components/BoolField'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(0),
    maxHeight: '70vh',
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
}));

export default function FileAttachmentAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { valueOkStates,
          valueAjvStates,
          handleSetValue,
        } = props;

  function getItemsOk() {
    let countOk=0;
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 1) {
        countOk++;
      }
    }
    return countOk;
  }

  return (
    <div id='FileAttachmentAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': FileAttachment' }
                </Typography>
              }
              subheader={getItemsOk()+' / 8 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/*
              Internal ID
            */}
            {/* fileAttachment_id */}
            <CardContent key='fileAttachment_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='fileAttachment_id'
                    name='fileAttachment_id'
                    label='fileAttachment_id'
                    valueOk={valueOkStates.fileAttachment_id}
                    valueAjv={valueAjvStates.fileAttachment_id}
                    autoFocus={true}
                    handleSetValue={handleSetValue}
                  />

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
                valueOk={valueOkStates.fileName}
                valueAjv={valueAjvStates.fileName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mimeType */}
            <CardContent key='mimeType' className={classes.cardContent} >
              <StringField
                itemKey='mimeType'
                name='mimeType'
                label='mimeType'
                valueOk={valueOkStates.mimeType}
                valueAjv={valueAjvStates.mimeType}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fileSizeKb */}
            <CardContent key='fileSizeKb' className={classes.cardContent} >
              <IntField
                itemKey='fileSizeKb'
                name='fileSizeKb'
                label='fileSizeKb'
                valueOk={valueOkStates.fileSizeKb}
                valueAjv={valueAjvStates.fileSizeKb}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fileURL */}
            <CardContent key='fileURL' className={classes.cardContent} >
              <StringField
                itemKey='fileURL'
                name='fileURL'
                label='fileURL'
                valueOk={valueOkStates.fileURL}
                valueAjv={valueAjvStates.fileURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* isImage */}
            <CardContent key='isImage' className={classes.cardContent} >
              <BoolField
                itemKey='isImage'
                name='isImage'
                label='isImage'
                valueOk={valueOkStates.isImage}
                valueAjv={valueAjvStates.isImage}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* smallThumbnailURL */}
            <CardContent key='smallThumbnailURL' className={classes.cardContent} >
              <StringField
                itemKey='smallThumbnailURL'
                name='smallThumbnailURL'
                label='smallThumbnailURL'
                valueOk={valueOkStates.smallThumbnailURL}
                valueAjv={valueAjvStates.smallThumbnailURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* bigThumbnailURL */}
            <CardContent key='bigThumbnailURL' className={classes.cardContent} >
              <StringField
                itemKey='bigThumbnailURL'
                name='bigThumbnailURL'
                label='bigThumbnailURL'
                valueOk={valueOkStates.bigThumbnailURL}
                valueAjv={valueAjvStates.bigThumbnailURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
FileAttachmentAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};