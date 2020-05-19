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

export default function LocationAttributesFormView(props) {
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
                text={item.abbreviation}
                valueOk={valueOkStates.abbreviation}
                autoFocus={true}
              />
            </CardContent>

            {/* coordinateDescription */}
            <CardContent key='coordinateDescription' className={classes.cardContent} >
              <StringField
                itemKey='coordinateDescription'
                name='coordinateDescription'
                label='coordinateDescription'
                text={item.coordinateDescription}
                valueOk={valueOkStates.coordinateDescription}
              />
            </CardContent>

            {/* countryCode */}
            <CardContent key='countryCode' className={classes.cardContent} >
              <StringField
                itemKey='countryCode'
                name='countryCode'
                label='countryCode'
                text={item.countryCode}
                valueOk={valueOkStates.countryCode}
              />
            </CardContent>

            {/* countryName */}
            <CardContent key='countryName' className={classes.cardContent} >
              <StringField
                itemKey='countryName'
                name='countryName'
                label='countryName'
                text={item.countryName}
                valueOk={valueOkStates.countryName}
              />
            </CardContent>

            {/* documentationURL */}
            <CardContent key='documentationURL' className={classes.cardContent} >
              <StringField
                itemKey='documentationURL'
                name='documentationURL'
                label='documentationURL'
                text={item.documentationURL}
                valueOk={valueOkStates.documentationURL}
              />
            </CardContent>

            {/* environmentType */}
            <CardContent key='environmentType' className={classes.cardContent} >
              <StringField
                itemKey='environmentType'
                name='environmentType'
                label='environmentType'
                text={item.environmentType}
                valueOk={valueOkStates.environmentType}
              />
            </CardContent>

            {/* exposure */}
            <CardContent key='exposure' className={classes.cardContent} >
              <StringField
                itemKey='exposure'
                name='exposure'
                label='exposure'
                text={item.exposure}
                valueOk={valueOkStates.exposure}
              />
            </CardContent>

            {/* instituteAddress */}
            <CardContent key='instituteAddress' className={classes.cardContent} >
              <StringField
                itemKey='instituteAddress'
                name='instituteAddress'
                label='instituteAddress'
                text={item.instituteAddress}
                valueOk={valueOkStates.instituteAddress}
              />
            </CardContent>

            {/* instituteName */}
            <CardContent key='instituteName' className={classes.cardContent} >
              <StringField
                itemKey='instituteName'
                name='instituteName'
                label='instituteName'
                text={item.instituteName}
                valueOk={valueOkStates.instituteName}
              />
            </CardContent>

            {/* locationName */}
            <CardContent key='locationName' className={classes.cardContent} >
              <StringField
                itemKey='locationName'
                name='locationName'
                label='locationName'
                text={item.locationName}
                valueOk={valueOkStates.locationName}
              />
            </CardContent>

            {/* locationType */}
            <CardContent key='locationType' className={classes.cardContent} >
              <StringField
                itemKey='locationType'
                name='locationType'
                label='locationType'
                text={item.locationType}
                valueOk={valueOkStates.locationType}
              />
            </CardContent>

            {/* siteStatus */}
            <CardContent key='siteStatus' className={classes.cardContent} >
              <StringField
                itemKey='siteStatus'
                name='siteStatus'
                label='siteStatus'
                text={item.siteStatus}
                valueOk={valueOkStates.siteStatus}
              />
            </CardContent>

            {/* slope */}
            <CardContent key='slope' className={classes.cardContent} >
              <StringField
                itemKey='slope'
                name='slope'
                label='slope'
                text={item.slope}
                valueOk={valueOkStates.slope}
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
              />
            </CardContent>

            {/* locationDbId */}
            <CardContent key='locationDbId' className={classes.cardContent} >
              <StringField
                itemKey='locationDbId'
                name='locationDbId'
                label='locationDbId'
                text={item.locationDbId}
                valueOk={valueOkStates.locationDbId}
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
};