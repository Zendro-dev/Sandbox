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

export default function ObservationVariableAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': ObservationVariable' }
                </Typography>
              }
              subheader={getItemsOk()+' / 16 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* commonCropName */}
            <CardContent key='commonCropName' className={classes.cardContent} >
              <StringField
                itemKey='commonCropName'
                name='commonCropName'
                label='commonCropName'
                valueOk={valueOkStates.commonCropName}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* defaultValue */}
            <CardContent key='defaultValue' className={classes.cardContent} >
              <StringField
                itemKey='defaultValue'
                name='defaultValue'
                label='defaultValue'
                valueOk={valueOkStates.defaultValue}
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

            {/* growthStage */}
            <CardContent key='growthStage' className={classes.cardContent} >
              <StringField
                itemKey='growthStage'
                name='growthStage'
                label='growthStage'
                valueOk={valueOkStates.growthStage}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* institution */}
            <CardContent key='institution' className={classes.cardContent} >
              <StringField
                itemKey='institution'
                name='institution'
                label='institution'
                valueOk={valueOkStates.institution}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* language */}
            <CardContent key='language' className={classes.cardContent} >
              <StringField
                itemKey='language'
                name='language'
                label='language'
                valueOk={valueOkStates.language}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* scientist */}
            <CardContent key='scientist' className={classes.cardContent} >
              <StringField
                itemKey='scientist'
                name='scientist'
                label='scientist'
                valueOk={valueOkStates.scientist}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* status */}
            <CardContent key='status' className={classes.cardContent} >
              <StringField
                itemKey='status'
                name='status'
                label='status'
                valueOk={valueOkStates.status}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* submissionTimestamp */}
            <CardContent key='submissionTimestamp' className={classes.cardContent} >
              <DateTimeField
                itemKey='submissionTimestamp'
                name='submissionTimestamp'
                label='submissionTimestamp'
                valueOk={valueOkStates.submissionTimestamp}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* xref */}
            <CardContent key='xref' className={classes.cardContent} >
              <StringField
                itemKey='xref'
                name='xref'
                label='xref'
                valueOk={valueOkStates.xref}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationVariableDbId */}
            <CardContent key='observationVariableDbId' className={classes.cardContent} >
              <StringField
                itemKey='observationVariableDbId'
                name='observationVariableDbId'
                label='observationVariableDbId'
                valueOk={valueOkStates.observationVariableDbId}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationVariableName */}
            <CardContent key='observationVariableName' className={classes.cardContent} >
              <StringField
                itemKey='observationVariableName'
                name='observationVariableName'
                label='observationVariableName'
                valueOk={valueOkStates.observationVariableName}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ObservationVariableAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};