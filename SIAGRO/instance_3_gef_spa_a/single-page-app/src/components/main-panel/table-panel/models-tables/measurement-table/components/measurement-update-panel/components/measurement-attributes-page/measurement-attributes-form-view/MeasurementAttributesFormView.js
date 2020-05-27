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

import FloatField from './components/FloatField'

import IntField from './components/IntField'

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

export default function MeasurementAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Measurement' }
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
            {/* measurement_id*/}
            <CardContent key='measurement_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">measurement_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.measurement_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* name */}
            <CardContent key='name' className={classes.cardContent} >
              <StringField
                itemKey='name'
                name='name'
                label='name'
                text={item.name}
                valueOk={valueOkStates.name}
                valueAjv={valueAjvStates.name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* method */}
            <CardContent key='method' className={classes.cardContent} >
              <StringField
                itemKey='method'
                name='method'
                label='method'
                text={item.method}
                valueOk={valueOkStates.method}
                valueAjv={valueAjvStates.method}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* reference */}
            <CardContent key='reference' className={classes.cardContent} >
              <StringField
                itemKey='reference'
                name='reference'
                label='reference'
                text={item.reference}
                valueOk={valueOkStates.reference}
                valueAjv={valueAjvStates.reference}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* reference_link */}
            <CardContent key='reference_link' className={classes.cardContent} >
              <StringField
                itemKey='reference_link'
                name='reference_link'
                label='reference_link'
                text={item.reference_link}
                valueOk={valueOkStates.reference_link}
                valueAjv={valueAjvStates.reference_link}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* value */}
            <CardContent key='value' className={classes.cardContent} >
              <FloatField
                itemKey='value'
                name='value'
                label='value'
                text={item.value}
                valueOk={valueOkStates.value}
                valueAjv={valueAjvStates.value}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* unit */}
            <CardContent key='unit' className={classes.cardContent} >
              <StringField
                itemKey='unit'
                name='unit'
                label='unit'
                text={item.unit}
                valueOk={valueOkStates.unit}
                valueAjv={valueAjvStates.unit}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* short_name */}
            <CardContent key='short_name' className={classes.cardContent} >
              <StringField
                itemKey='short_name'
                name='short_name'
                label='short_name'
                text={item.short_name}
                valueOk={valueOkStates.short_name}
                valueAjv={valueAjvStates.short_name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* comments */}
            <CardContent key='comments' className={classes.cardContent} >
              <StringField
                itemKey='comments'
                name='comments'
                label='comments'
                text={item.comments}
                valueOk={valueOkStates.comments}
                valueAjv={valueAjvStates.comments}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* field_unit_id */}
            <CardContent key='field_unit_id' className={classes.cardContent} >
              <IntField
                itemKey='field_unit_id'
                name='field_unit_id'
                label='field_unit_id'
                text={item.field_unit_id}
                valueOk={valueOkStates.field_unit_id}
                valueAjv={valueAjvStates.field_unit_id}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
MeasurementAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

