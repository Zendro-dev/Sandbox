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

export default function EventAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Event' }
                </Typography>
              }
              subheader={getItemsOk()+' / 5 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* eventDbId */}
            <CardContent key='eventDbId' className={classes.cardContent} >
              <StringField
                itemKey='eventDbId'
                name='eventDbId'
                label='eventDbId'
                valueOk={valueOkStates.eventDbId}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* eventDescription */}
            <CardContent key='eventDescription' className={classes.cardContent} >
              <StringField
                itemKey='eventDescription'
                name='eventDescription'
                label='eventDescription'
                valueOk={valueOkStates.eventDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* eventType */}
            <CardContent key='eventType' className={classes.cardContent} >
              <StringField
                itemKey='eventType'
                name='eventType'
                label='eventType'
                valueOk={valueOkStates.eventType}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* date */}
            <CardContent key='date' className={classes.cardContent} >
              <DateTimeField
                itemKey='date'
                name='date'
                label='date'
                valueOk={valueOkStates.date}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
EventAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};