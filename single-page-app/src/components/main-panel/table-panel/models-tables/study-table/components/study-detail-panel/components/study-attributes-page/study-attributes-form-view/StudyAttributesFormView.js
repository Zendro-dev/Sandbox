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

import StringField from './components/StringField'

import BoolField from './components/BoolField'

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

export default function StudyAttributesFormView(props) {
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
    <div id='StudyAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Study' }
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
            {/* studyDbId*/}
            <CardContent key='studyDbId' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">studyDbId:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.studyDbId}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* active */}
            <CardContent key='active' className={classes.cardContent} >
              <BoolField
                itemKey='active'
                name='active'
                label='active'
                text={item.active}
                valueOk={valueOkStates.active}
              />
            </CardContent>

            {/* commonCropName */}
            <CardContent key='commonCropName' className={classes.cardContent} >
              <StringField
                itemKey='commonCropName'
                name='commonCropName'
                label='commonCropName'
                text={item.commonCropName}
                valueOk={valueOkStates.commonCropName}
              />
            </CardContent>

            {/* culturalPractices */}
            <CardContent key='culturalPractices' className={classes.cardContent} >
              <StringField
                itemKey='culturalPractices'
                name='culturalPractices'
                label='culturalPractices'
                text={item.culturalPractices}
                valueOk={valueOkStates.culturalPractices}
              />
            </CardContent>

            {/* documentationURL */}
            <CardContent key='documentationURL' className={classes.cardContent} >
              <StringField
                itemKey='documentationURL'
                name='documentationURL'
                label='documentationURL'
                text={item.documentationURL}
                valueOk={valueOkStates.documentationURL}
              />
            </CardContent>

            {/* endDate */}
            <CardContent key='endDate' className={classes.cardContent} >
              <DateTimeField
                itemKey='endDate'
                name='endDate'
                label='endDate'
                text={item.endDate}
                valueOk={valueOkStates.endDate}
              />
            </CardContent>

            {/* license */}
            <CardContent key='license' className={classes.cardContent} >
              <StringField
                itemKey='license'
                name='license'
                label='license'
                text={item.license}
                valueOk={valueOkStates.license}
              />
            </CardContent>

            {/* observationUnitsDescription */}
            <CardContent key='observationUnitsDescription' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitsDescription'
                name='observationUnitsDescription'
                label='observationUnitsDescription'
                text={item.observationUnitsDescription}
                valueOk={valueOkStates.observationUnitsDescription}
              />
            </CardContent>

            {/* startDate */}
            <CardContent key='startDate' className={classes.cardContent} >
              <DateTimeField
                itemKey='startDate'
                name='startDate'
                label='startDate'
                text={item.startDate}
                valueOk={valueOkStates.startDate}
              />
            </CardContent>

            {/* studyDescription */}
            <CardContent key='studyDescription' className={classes.cardContent} >
              <StringField
                itemKey='studyDescription'
                name='studyDescription'
                label='studyDescription'
                text={item.studyDescription}
                valueOk={valueOkStates.studyDescription}
              />
            </CardContent>

            {/* studyName */}
            <CardContent key='studyName' className={classes.cardContent} >
              <StringField
                itemKey='studyName'
                name='studyName'
                label='studyName'
                text={item.studyName}
                valueOk={valueOkStates.studyName}
              />
            </CardContent>

            {/* studyType */}
            <CardContent key='studyType' className={classes.cardContent} >
              <StringField
                itemKey='studyType'
                name='studyType'
                label='studyType'
                text={item.studyType}
                valueOk={valueOkStates.studyType}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
StudyAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};