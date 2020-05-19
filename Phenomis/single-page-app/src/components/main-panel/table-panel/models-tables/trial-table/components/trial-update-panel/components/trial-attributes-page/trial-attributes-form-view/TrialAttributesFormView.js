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


import BoolField from './components/BoolField'

import StringField from './components/StringField'

import DateTimeField from './components/DateTimeField'

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

export default function TrialAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, 
          valueOkStates,
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
                    { t('modelPanels.model') + ': Trial' }
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

            

            {/* active */}
            <CardContent key='active' className={classes.cardContent} >
              <BoolField
                itemKey='active'
                name='active'
                label='active'
                text={item.active}
                valueOk={valueOkStates.active}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* commonCropName */}
            <CardContent key='commonCropName' className={classes.cardContent} >
              <StringField
                itemKey='commonCropName'
                name='commonCropName'
                label='commonCropName'
                text={item.commonCropName}
                valueOk={valueOkStates.commonCropName}
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* endDate */}
            <CardContent key='endDate' className={classes.cardContent} >
              <DateTimeField
                itemKey='endDate'
                name='endDate'
                label='endDate'
                text={item.endDate}
                valueOk={valueOkStates.endDate}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* startDate */}
            <CardContent key='startDate' className={classes.cardContent} >
              <DateTimeField
                itemKey='startDate'
                name='startDate'
                label='startDate'
                text={item.startDate}
                valueOk={valueOkStates.startDate}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* trialDescription */}
            <CardContent key='trialDescription' className={classes.cardContent} >
              <StringField
                itemKey='trialDescription'
                name='trialDescription'
                label='trialDescription'
                text={item.trialDescription}
                valueOk={valueOkStates.trialDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* trialName */}
            <CardContent key='trialName' className={classes.cardContent} >
              <StringField
                itemKey='trialName'
                name='trialName'
                label='trialName'
                text={item.trialName}
                valueOk={valueOkStates.trialName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* trialPUI */}
            <CardContent key='trialPUI' className={classes.cardContent} >
              <StringField
                itemKey='trialPUI'
                name='trialPUI'
                label='trialPUI'
                text={item.trialPUI}
                valueOk={valueOkStates.trialPUI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* trialDbId */}
            <CardContent key='trialDbId' className={classes.cardContent} >
              <StringField
                itemKey='trialDbId'
                name='trialDbId'
                label='trialDbId'
                text={item.trialDbId}
                valueOk={valueOkStates.trialDbId}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
TrialAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

