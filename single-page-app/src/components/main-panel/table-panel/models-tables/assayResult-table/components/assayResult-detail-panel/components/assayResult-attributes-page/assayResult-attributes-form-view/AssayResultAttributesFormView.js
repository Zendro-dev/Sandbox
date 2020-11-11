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

import IntField from './components/IntField'

import FloatField from './components/FloatField'

import BoolField from './components/BoolField'

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

export default function AssayResultAttributesFormView(props) {
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
            {/* assayResult_id*/}
            <CardContent key='assayResult_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">assayResult_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.assayResult_id}</Typography>
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
                text={item.unit}
                valueOk={valueOkStates.unit}
              />
            </CardContent>

            {/* value_as_str */}
            <CardContent key='value_as_str' className={classes.cardContent} >
              <StringField
                itemKey='value_as_str'
                name='value_as_str'
                label='value_as_str'
                text={item.value_as_str}
                valueOk={valueOkStates.value_as_str}
              />
            </CardContent>

            {/* value_as_int */}
            <CardContent key='value_as_int' className={classes.cardContent} >
              <IntField
                itemKey='value_as_int'
                name='value_as_int'
                label='value_as_int'
                text={item.value_as_int}
                isForeignKey={false}
                valueOk={valueOkStates.value_as_int}
              />
            </CardContent>

            {/* value_as_num */}
            <CardContent key='value_as_num' className={classes.cardContent} >
              <FloatField
                itemKey='value_as_num'
                name='value_as_num'
                label='value_as_num'
                text={item.value_as_num}
                valueOk={valueOkStates.value_as_num}
              />
            </CardContent>

            {/* value_as_bool */}
            <CardContent key='value_as_bool' className={classes.cardContent} >
              <BoolField
                itemKey='value_as_bool'
                name='value_as_bool'
                label='value_as_bool'
                text={item.value_as_bool}
                valueOk={valueOkStates.value_as_bool}
              />
            </CardContent>

            {/* value_as_float */}
            <CardContent key='value_as_float' className={classes.cardContent} >
              <FloatField
                itemKey='value_as_float'
                name='value_as_float'
                label='value_as_float'
                text={item.value_as_float}
                valueOk={valueOkStates.value_as_float}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
AssayResultAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};