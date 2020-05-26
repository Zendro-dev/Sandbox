import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
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

export default function LocationAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Location' }
                </Typography>
              }
              subheader={getItemsOk()+' / 18 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            

            {/* locationId */}
            <CardContent key='locationId' className={classes.cardContent} >
              <StringField
                itemKey='locationId'
                name='locationId'
                label='locationId'
                text={item.locationId}
                valueOk={valueOkStates.locationId}
                valueAjv={valueAjvStates.locationId}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* country */}
            <CardContent key='country' className={classes.cardContent} >
              <StringField
                itemKey='country'
                name='country'
                label='country'
                text={item.country}
                valueOk={valueOkStates.country}
                valueAjv={valueAjvStates.country}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* state */}
            <CardContent key='state' className={classes.cardContent} >
              <StringField
                itemKey='state'
                name='state'
                label='state'
                text={item.state}
                valueOk={valueOkStates.state}
                valueAjv={valueAjvStates.state}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* municipality */}
            <CardContent key='municipality' className={classes.cardContent} >
              <StringField
                itemKey='municipality'
                name='municipality'
                label='municipality'
                text={item.municipality}
                valueOk={valueOkStates.municipality}
                valueAjv={valueAjvStates.municipality}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* locality */}
            <CardContent key='locality' className={classes.cardContent} >
              <StringField
                itemKey='locality'
                name='locality'
                label='locality'
                text={item.locality}
                valueOk={valueOkStates.locality}
                valueAjv={valueAjvStates.locality}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* latitude */}
            <CardContent key='latitude' className={classes.cardContent} >
              <FloatField
                itemKey='latitude'
                name='latitude'
                label='latitude'
                text={item.latitude}
                valueOk={valueOkStates.latitude}
                valueAjv={valueAjvStates.latitude}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* longitude */}
            <CardContent key='longitude' className={classes.cardContent} >
              <FloatField
                itemKey='longitude'
                name='longitude'
                label='longitude'
                text={item.longitude}
                valueOk={valueOkStates.longitude}
                valueAjv={valueAjvStates.longitude}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* altitude */}
            <CardContent key='altitude' className={classes.cardContent} >
              <FloatField
                itemKey='altitude'
                name='altitude'
                label='altitude'
                text={item.altitude}
                valueOk={valueOkStates.altitude}
                valueAjv={valueAjvStates.altitude}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* natural_area */}
            <CardContent key='natural_area' className={classes.cardContent} >
              <StringField
                itemKey='natural_area'
                name='natural_area'
                label='natural_area'
                text={item.natural_area}
                valueOk={valueOkStates.natural_area}
                valueAjv={valueAjvStates.natural_area}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* natural_area_name */}
            <CardContent key='natural_area_name' className={classes.cardContent} >
              <StringField
                itemKey='natural_area_name'
                name='natural_area_name'
                label='natural_area_name'
                text={item.natural_area_name}
                valueOk={valueOkStates.natural_area_name}
                valueAjv={valueAjvStates.natural_area_name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* georeference_method */}
            <CardContent key='georeference_method' className={classes.cardContent} >
              <StringField
                itemKey='georeference_method'
                name='georeference_method'
                label='georeference_method'
                text={item.georeference_method}
                valueOk={valueOkStates.georeference_method}
                valueAjv={valueAjvStates.georeference_method}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* georeference_source */}
            <CardContent key='georeference_source' className={classes.cardContent} >
              <StringField
                itemKey='georeference_source'
                name='georeference_source'
                label='georeference_source'
                text={item.georeference_source}
                valueOk={valueOkStates.georeference_source}
                valueAjv={valueAjvStates.georeference_source}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* datum */}
            <CardContent key='datum' className={classes.cardContent} >
              <StringField
                itemKey='datum'
                name='datum'
                label='datum'
                text={item.datum}
                valueOk={valueOkStates.datum}
                valueAjv={valueAjvStates.datum}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* vegetation */}
            <CardContent key='vegetation' className={classes.cardContent} >
              <StringField
                itemKey='vegetation'
                name='vegetation'
                label='vegetation'
                text={item.vegetation}
                valueOk={valueOkStates.vegetation}
                valueAjv={valueAjvStates.vegetation}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* stoniness */}
            <CardContent key='stoniness' className={classes.cardContent} >
              <StringField
                itemKey='stoniness'
                name='stoniness'
                label='stoniness'
                text={item.stoniness}
                valueOk={valueOkStates.stoniness}
                valueAjv={valueAjvStates.stoniness}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* sewer */}
            <CardContent key='sewer' className={classes.cardContent} >
              <StringField
                itemKey='sewer'
                name='sewer'
                label='sewer'
                text={item.sewer}
                valueOk={valueOkStates.sewer}
                valueAjv={valueAjvStates.sewer}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* topography */}
            <CardContent key='topography' className={classes.cardContent} >
              <StringField
                itemKey='topography'
                name='topography'
                label='topography'
                text={item.topography}
                valueOk={valueOkStates.topography}
                valueAjv={valueAjvStates.topography}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* slope */}
            <CardContent key='slope' className={classes.cardContent} >
              <FloatField
                itemKey='slope'
                name='slope'
                label='slope'
                text={item.slope}
                valueOk={valueOkStates.slope}
                valueAjv={valueAjvStates.slope}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
LocationAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};
