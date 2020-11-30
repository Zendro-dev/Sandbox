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

export default function FieldPlotAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Field_plot' }
                </Typography>
              }
              subheader={getItemsOk()+' / 6 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}


            {/* field_name */}
            <CardContent key='field_name' className={classes.cardContent} >
              <StringField
                itemKey='field_name'
                name='field_name'
                label='field_name'
                valueOk={valueOkStates.field_name}
                valueAjv={valueAjvStates.field_name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* coordinates_or_name */}
            <CardContent key='coordinates_or_name' className={classes.cardContent} >
              <StringField
                itemKey='coordinates_or_name'
                name='coordinates_or_name'
                label='coordinates_or_name'
                valueOk={valueOkStates.coordinates_or_name}
                valueAjv={valueAjvStates.coordinates_or_name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* year */}
            <CardContent key='year' className={classes.cardContent} >
              <StringField
                itemKey='year'
                name='year'
                label='year'
                valueOk={valueOkStates.year}
                valueAjv={valueAjvStates.year}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* area_sqm */}
            <CardContent key='area_sqm' className={classes.cardContent} >
              <FloatField
                itemKey='area_sqm'
                name='area_sqm'
                label='area_sqm'
                valueOk={valueOkStates.area_sqm}
                valueAjv={valueAjvStates.area_sqm}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* type */}
            <CardContent key='type' className={classes.cardContent} >
              <StringField
                itemKey='type'
                name='type'
                label='type'
                valueOk={valueOkStates.type}
                valueAjv={valueAjvStates.type}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
FieldPlotAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};