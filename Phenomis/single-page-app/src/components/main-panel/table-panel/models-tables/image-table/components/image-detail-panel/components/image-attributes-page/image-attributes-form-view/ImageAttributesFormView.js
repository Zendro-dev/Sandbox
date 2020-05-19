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
}));

export default function ImageAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, valueOkStates } = props;

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
              subheader={getItemsOk()+' / 11 ' + t('modelPanels.completed')}
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
                text={item.copyright}
                valueOk={valueOkStates.copyright}
                autoFocus={true}
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

            {/* imageFileName */}
            <CardContent key='imageFileName' className={classes.cardContent} >
              <StringField
                itemKey='imageFileName'
                name='imageFileName'
                label='imageFileName'
                text={item.imageFileName}
                valueOk={valueOkStates.imageFileName}
              />
            </CardContent>

            {/* imageFileSize */}
            <CardContent key='imageFileSize' className={classes.cardContent} >
              <IntField
                itemKey='imageFileSize'
                name='imageFileSize'
                label='imageFileSize'
                text={item.imageFileSize}
                isForeignKey={false}
                valueOk={valueOkStates.imageFileSize}
              />
            </CardContent>

            {/* imageHeight */}
            <CardContent key='imageHeight' className={classes.cardContent} >
              <IntField
                itemKey='imageHeight'
                name='imageHeight'
                label='imageHeight'
                text={item.imageHeight}
                isForeignKey={false}
                valueOk={valueOkStates.imageHeight}
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
              />
            </CardContent>

            {/* imageWidth */}
            <CardContent key='imageWidth' className={classes.cardContent} >
              <IntField
                itemKey='imageWidth'
                name='imageWidth'
                label='imageWidth'
                text={item.imageWidth}
                isForeignKey={false}
                valueOk={valueOkStates.imageWidth}
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
              />
            </CardContent>

            {/* imageDbId */}
            <CardContent key='imageDbId' className={classes.cardContent} >
              <StringField
                itemKey='imageDbId'
                name='imageDbId'
                label='imageDbId'
                text={item.imageDbId}
                valueOk={valueOkStates.imageDbId}
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
};