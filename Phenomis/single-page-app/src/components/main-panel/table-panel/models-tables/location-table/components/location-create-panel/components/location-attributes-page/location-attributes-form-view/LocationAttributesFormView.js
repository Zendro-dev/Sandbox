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
  const { valueOkStates,
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
              subheader={getItemsOk()+' / 15 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* abbreviation */}
            <CardContent key='abbreviation' className={classes.cardContent} >
              <StringField
                itemKey='abbreviation'
                name='abbreviation'
                label='abbreviation'
                valueOk={valueOkStates.abbreviation}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* coordinateDescription */}
            <CardContent key='coordinateDescription' className={classes.cardContent} >
              <StringField
                itemKey='coordinateDescription'
                name='coordinateDescription'
                label='coordinateDescription'
                valueOk={valueOkStates.coordinateDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* countryCode */}
            <CardContent key='countryCode' className={classes.cardContent} >
              <StringField
                itemKey='countryCode'
                name='countryCode'
                label='countryCode'
                valueOk={valueOkStates.countryCode}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* countryName */}
            <CardContent key='countryName' className={classes.cardContent} >
              <StringField
                itemKey='countryName'
                name='countryName'
                label='countryName'
                valueOk={valueOkStates.countryName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* documentationURL */}
            <CardContent key='documentationURL' className={classes.cardContent} >
              <StringField
                itemKey='documentationURL'
                name='documentationURL'
                label='documentationURL'
                valueOk={valueOkStates.documentationURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* environmentType */}
            <CardContent key='environmentType' className={classes.cardContent} >
              <StringField
                itemKey='environmentType'
                name='environmentType'
                label='environmentType'
                valueOk={valueOkStates.environmentType}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* exposure */}
            <CardContent key='exposure' className={classes.cardContent} >
              <StringField
                itemKey='exposure'
                name='exposure'
                label='exposure'
                valueOk={valueOkStates.exposure}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* instituteAddress */}
            <CardContent key='instituteAddress' className={classes.cardContent} >
              <StringField
                itemKey='instituteAddress'
                name='instituteAddress'
                label='instituteAddress'
                valueOk={valueOkStates.instituteAddress}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* instituteName */}
            <CardContent key='instituteName' className={classes.cardContent} >
              <StringField
                itemKey='instituteName'
                name='instituteName'
                label='instituteName'
                valueOk={valueOkStates.instituteName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* locationName */}
            <CardContent key='locationName' className={classes.cardContent} >
              <StringField
                itemKey='locationName'
                name='locationName'
                label='locationName'
                valueOk={valueOkStates.locationName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* locationType */}
            <CardContent key='locationType' className={classes.cardContent} >
              <StringField
                itemKey='locationType'
                name='locationType'
                label='locationType'
                valueOk={valueOkStates.locationType}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* siteStatus */}
            <CardContent key='siteStatus' className={classes.cardContent} >
              <StringField
                itemKey='siteStatus'
                name='siteStatus'
                label='siteStatus'
                valueOk={valueOkStates.siteStatus}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* slope */}
            <CardContent key='slope' className={classes.cardContent} >
              <StringField
                itemKey='slope'
                name='slope'
                label='slope'
                valueOk={valueOkStates.slope}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* topography */}
            <CardContent key='topography' className={classes.cardContent} >
              <StringField
                itemKey='topography'
                name='topography'
                label='topography'
                valueOk={valueOkStates.topography}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* locationDbId */}
            <CardContent key='locationDbId' className={classes.cardContent} >
              <StringField
                itemKey='locationDbId'
                name='locationDbId'
                label='locationDbId'
                valueOk={valueOkStates.locationDbId}
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
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};