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

export default function MeasurementAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Measurement' }
                </Typography>
              }
              subheader={getItemsOk()+' / 10 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}

        

            {/* measurement_id */}
            <CardContent key='measurement_id' className={classes.cardContent} >
              <StringField
                itemKey='measurement_id'
                name='measurement_id'
                label='measurement_id'
                text={item.measurement_id}
                valueOk={valueOkStates.measurement_id}
                autoFocus={true}
              />
            </CardContent>

            {/* name */}
            <CardContent key='name' className={classes.cardContent} >
              <StringField
                itemKey='name'
                name='name'
                label='name'
                text={item.name}
                valueOk={valueOkStates.name}
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
              />
            </CardContent>

            {/* field_unit_id */}
            <CardContent key='field_unit_id' className={classes.cardContent} >
              <IntField
                itemKey='field_unit_id'
                name='field_unit_id'
                label='field_unit_id'
                text={item.field_unit_id}
                isForeignKey={false}
                valueOk={valueOkStates.field_unit_id}
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
};