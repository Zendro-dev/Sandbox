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
import ArrayField from './components/ArrayField'

import StringField from './components/StringField'

import IntField from './components/IntField'

import FloatField from './components/FloatField'

import DateField from './components/DateField'

import TimeField from './components/TimeField'

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

export default function SPARefactorAttributesFormView(props) {
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
    <div id='SPARefactorAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': SPARefactor' }
                </Typography>
              }
              subheader={getItemsOk()+' / 7 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* int*/}
            <CardContent key='int' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">int:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.int}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* array */}
            <CardContent key='array' className={classes.cardContent} >
              <ArrayField
                itemKey='array'
                name='array'
                label='array'
                text={item.array}
                valueOk={valueOkStates.array}
              />
            </CardContent>

            {/* string */}
            <CardContent key='string' className={classes.cardContent} >
              <StringField
                itemKey='string'
                name='string'
                label='string'
                text={item.string}
                valueOk={valueOkStates.string}
              />
            </CardContent>

            {/* float */}
            <CardContent key='float' className={classes.cardContent} >
              <FloatField
                itemKey='float'
                name='float'
                label='float'
                text={item.float}
                valueOk={valueOkStates.float}
              />
            </CardContent>

            {/* date */}
            <CardContent key='date' className={classes.cardContent} >
              <DateField
                itemKey='date'
                name='date'
                label='date'
                text={item.date}
                valueOk={valueOkStates.date}
              />
            </CardContent>

            {/* time */}
            <CardContent key='time' className={classes.cardContent} >
              <TimeField
                itemKey='time'
                name='time'
                label='time'
                text={item.time}
                valueOk={valueOkStates.time}
              />
            </CardContent>

            {/* datetime */}
            <CardContent key='datetime' className={classes.cardContent} >
              <DateTimeField
                itemKey='datetime'
                name='datetime'
                label='datetime'
                text={item.datetime}
                valueOk={valueOkStates.datetime}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
SPARefactorAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};