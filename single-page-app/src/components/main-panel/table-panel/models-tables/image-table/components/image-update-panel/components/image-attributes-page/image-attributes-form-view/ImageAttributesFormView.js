import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';

import StringField from './components/StringField'

import IntField from './components/IntField'

import DateTimeField from './components/DateTimeField'

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

export default function ImageAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, 
          valueOkStates,
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
    <div id='ImageAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Image' }
                </Typography>
              }
              subheader={getItemsOk()+' / 11 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* imageDbId*/}
            <CardContent key='imageDbId' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">imageDbId:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.imageDbId}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* copyright */}
            <CardContent key='copyright' className={classes.cardContent} >
              <StringField
                itemKey='copyright'
                name='copyright'
                label='copyright'
                text={item.copyright}
                valueOk={valueOkStates.copyright}
                valueAjv={valueAjvStates.copyright}
                handleSetValue={handleSetValue}
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
                valueAjv={valueAjvStates.description}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageFileName */}
            <CardContent key='imageFileName' className={classes.cardContent} >
              <StringField
                itemKey='imageFileName'
                name='imageFileName'
                label='imageFileName'
                text={item.imageFileName}
                valueOk={valueOkStates.imageFileName}
                valueAjv={valueAjvStates.imageFileName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageFileSize */}
            <CardContent key='imageFileSize' className={classes.cardContent} >
              <IntField
                itemKey='imageFileSize'
                name='imageFileSize'
                label='imageFileSize'
                text={item.imageFileSize}
                valueOk={valueOkStates.imageFileSize}
                valueAjv={valueAjvStates.imageFileSize}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageHeight */}
            <CardContent key='imageHeight' className={classes.cardContent} >
              <IntField
                itemKey='imageHeight'
                name='imageHeight'
                label='imageHeight'
                text={item.imageHeight}
                valueOk={valueOkStates.imageHeight}
                valueAjv={valueAjvStates.imageHeight}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageName */}
            <CardContent key='imageName' className={classes.cardContent} >
              <StringField
                itemKey='imageName'
                name='imageName'
                label='imageName'
                text={item.imageName}
                valueOk={valueOkStates.imageName}
                valueAjv={valueAjvStates.imageName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageTimeStamp */}
            <CardContent key='imageTimeStamp' className={classes.cardContent} >
              <DateTimeField
                itemKey='imageTimeStamp'
                name='imageTimeStamp'
                label='imageTimeStamp'
                text={item.imageTimeStamp}
                valueOk={valueOkStates.imageTimeStamp}
                valueAjv={valueAjvStates.imageTimeStamp}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageURL */}
            <CardContent key='imageURL' className={classes.cardContent} >
              <StringField
                itemKey='imageURL'
                name='imageURL'
                label='imageURL'
                text={item.imageURL}
                valueOk={valueOkStates.imageURL}
                valueAjv={valueAjvStates.imageURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageWidth */}
            <CardContent key='imageWidth' className={classes.cardContent} >
              <IntField
                itemKey='imageWidth'
                name='imageWidth'
                label='imageWidth'
                text={item.imageWidth}
                valueOk={valueOkStates.imageWidth}
                valueAjv={valueAjvStates.imageWidth}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mimeType */}
            <CardContent key='mimeType' className={classes.cardContent} >
              <StringField
                itemKey='mimeType'
                name='mimeType'
                label='mimeType'
                text={item.mimeType}
                valueOk={valueOkStates.mimeType}
                valueAjv={valueAjvStates.mimeType}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ImageAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};
