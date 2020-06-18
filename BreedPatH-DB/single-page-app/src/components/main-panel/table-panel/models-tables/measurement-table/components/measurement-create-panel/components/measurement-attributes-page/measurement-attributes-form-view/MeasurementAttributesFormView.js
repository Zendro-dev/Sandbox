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
              subheader={getItemsOk()+' / 7 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}


            {/* method */}
            <CardContent key='method' className={classes.cardContent} >
              <StringField
                itemKey='method'
                name='method'
                label='method'
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
                valueOk={valueOkStates.reference}
                valueAjv={valueAjvStates.reference}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* float_value */}
            <CardContent key='float_value' className={classes.cardContent} >
              <FloatField
                itemKey='float_value'
                name='float_value'
                label='float_value'
                valueOk={valueOkStates.float_value}
                valueAjv={valueAjvStates.float_value}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* int_value */}
            <CardContent key='int_value' className={classes.cardContent} >
              <IntField
                itemKey='int_value'
                name='int_value'
                label='int_value'
                valueOk={valueOkStates.int_value}
                valueAjv={valueAjvStates.int_value}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* text_value */}
            <CardContent key='text_value' className={classes.cardContent} >
              <StringField
                itemKey='text_value'
                name='text_value'
                label='text_value'
                valueOk={valueOkStates.text_value}
                valueAjv={valueAjvStates.text_value}
                handleSetValue={handleSetValue}
              />
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
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
MeasurementAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};