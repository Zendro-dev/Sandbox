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

import BoolField from './components/BoolField'

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
    <div id='TrialAttributesFormView-div-root' className={classes.root}>
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
              subheader={getItemsOk()+' / 9 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* trialDbId*/}
            <CardContent key='trialDbId' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">trialDbId:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.trialDbId}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* active */}
            <CardContent key='active' className={classes.cardContent} >
              <BoolField
                itemKey='active'
                name='active'
                label='active'
                text={item.active}
                valueOk={valueOkStates.active}
                valueAjv={valueAjvStates.active}
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
                valueAjv={valueAjvStates.commonCropName}
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
                valueAjv={valueAjvStates.documentationURL}
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
                valueAjv={valueAjvStates.endDate}
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
                valueAjv={valueAjvStates.startDate}
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
                valueAjv={valueAjvStates.trialDescription}
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
                valueAjv={valueAjvStates.trialName}
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
                valueAjv={valueAjvStates.trialPUI}
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
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};
