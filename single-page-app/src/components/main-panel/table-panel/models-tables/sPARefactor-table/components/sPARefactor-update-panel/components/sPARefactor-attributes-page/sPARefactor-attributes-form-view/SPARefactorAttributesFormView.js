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
import ArrayField from './components/ArrayField'

import StringField from './components/StringField'

import IntField from './components/IntField'

import FloatField from './components/FloatField'

import DateField from './components/DateField'

import TimeField from './components/TimeField'

import DateTimeField from './components/DateTimeField'

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

export default function SPARefactorAttributesFormView(props) {
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
              subheader={getItemsOk()+' / 8 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* string*/}
            <CardContent key='string' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">string:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.string}</Typography>
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
                valueAjv={valueAjvStates.array}
                handleSetValue={handleSetValue}
                arrayType='String'
              />
            </CardContent>

            {/* int */}
            <CardContent key='int' className={classes.cardContent} >
              <IntField
                itemKey='int'
                name='int'
                label='int'
                text={item.int}
                valueOk={valueOkStates.int}
                valueAjv={valueAjvStates.int}
                handleSetValue={handleSetValue}
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
                valueAjv={valueAjvStates.float}
                handleSetValue={handleSetValue}
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
                valueAjv={valueAjvStates.date}
                handleSetValue={handleSetValue}
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
                valueAjv={valueAjvStates.time}
                handleSetValue={handleSetValue}
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
                valueAjv={valueAjvStates.datetime}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* boolean */}
            <CardContent key='boolean' className={classes.cardContent} >
              <BoolField
                itemKey='boolean'
                name='boolean'
                label='boolean'
                text={item.boolean}
                valueOk={valueOkStates.boolean}
                valueAjv={valueAjvStates.boolean}
                handleSetValue={handleSetValue}
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
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

