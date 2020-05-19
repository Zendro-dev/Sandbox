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
  const { valueOkStates,
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
    <div className={classes.root}>
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
              subheader={getItemsOk()+' / 12 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* copyright */}
            <CardContent key='copyright' className={classes.cardContent} >
              <StringField
                itemKey='copyright'
                name='copyright'
                label='copyright'
                valueOk={valueOkStates.copyright}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                valueOk={valueOkStates.description}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageFileName */}
            <CardContent key='imageFileName' className={classes.cardContent} >
              <StringField
                itemKey='imageFileName'
                name='imageFileName'
                label='imageFileName'
                valueOk={valueOkStates.imageFileName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageFileSize */}
            <CardContent key='imageFileSize' className={classes.cardContent} >
              <IntField
                itemKey='imageFileSize'
                name='imageFileSize'
                label='imageFileSize'
                valueOk={valueOkStates.imageFileSize}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageHeight */}
            <CardContent key='imageHeight' className={classes.cardContent} >
              <IntField
                itemKey='imageHeight'
                name='imageHeight'
                label='imageHeight'
                valueOk={valueOkStates.imageHeight}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageName */}
            <CardContent key='imageName' className={classes.cardContent} >
              <StringField
                itemKey='imageName'
                name='imageName'
                label='imageName'
                valueOk={valueOkStates.imageName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageTimeStamp */}
            <CardContent key='imageTimeStamp' className={classes.cardContent} >
              <DateTimeField
                itemKey='imageTimeStamp'
                name='imageTimeStamp'
                label='imageTimeStamp'
                valueOk={valueOkStates.imageTimeStamp}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageURL */}
            <CardContent key='imageURL' className={classes.cardContent} >
              <StringField
                itemKey='imageURL'
                name='imageURL'
                label='imageURL'
                valueOk={valueOkStates.imageURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageWidth */}
            <CardContent key='imageWidth' className={classes.cardContent} >
              <IntField
                itemKey='imageWidth'
                name='imageWidth'
                label='imageWidth'
                valueOk={valueOkStates.imageWidth}
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
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* imageDbId */}
            <CardContent key='imageDbId' className={classes.cardContent} >
              <StringField
                itemKey='imageDbId'
                name='imageDbId'
                label='imageDbId'
                valueOk={valueOkStates.imageDbId}
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
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};