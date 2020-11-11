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

import FloatField from './components/FloatField'

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

export default function AssayResultAttributesFormView(props) {
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
    <div id='AssayResultAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': AssayResult' }
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
            {/*
              Internal ID
            */}
            {/* assayResult_id */}
            <CardContent key='assayResult_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='assayResult_id'
                    name='assayResult_id'
                    label='assayResult_id'
                    valueOk={valueOkStates.assayResult_id}
                    valueAjv={valueAjvStates.assayResult_id}
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


            {/* unit */}
            <CardContent key='unit' className={classes.cardContent} >
              <StringField
                itemKey='unit'
                name='unit'
                label='unit'
                valueOk={valueOkStates.unit}
                valueAjv={valueAjvStates.unit}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value_as_str */}
            <CardContent key='value_as_str' className={classes.cardContent} >
              <StringField
                itemKey='value_as_str'
                name='value_as_str'
                label='value_as_str'
                valueOk={valueOkStates.value_as_str}
                valueAjv={valueAjvStates.value_as_str}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value_as_int */}
            <CardContent key='value_as_int' className={classes.cardContent} >
              <IntField
                itemKey='value_as_int'
                name='value_as_int'
                label='value_as_int'
                valueOk={valueOkStates.value_as_int}
                valueAjv={valueAjvStates.value_as_int}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value_as_num */}
            <CardContent key='value_as_num' className={classes.cardContent} >
              <FloatField
                itemKey='value_as_num'
                name='value_as_num'
                label='value_as_num'
                valueOk={valueOkStates.value_as_num}
                valueAjv={valueAjvStates.value_as_num}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value_as_bool */}
            <CardContent key='value_as_bool' className={classes.cardContent} >
              <BoolField
                itemKey='value_as_bool'
                name='value_as_bool'
                label='value_as_bool'
                valueOk={valueOkStates.value_as_bool}
                valueAjv={valueAjvStates.value_as_bool}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value_as_float */}
            <CardContent key='value_as_float' className={classes.cardContent} >
              <FloatField
                itemKey='value_as_float'
                name='value_as_float'
                label='value_as_float'
                valueOk={valueOkStates.value_as_float}
                valueAjv={valueAjvStates.value_as_float}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
AssayResultAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};