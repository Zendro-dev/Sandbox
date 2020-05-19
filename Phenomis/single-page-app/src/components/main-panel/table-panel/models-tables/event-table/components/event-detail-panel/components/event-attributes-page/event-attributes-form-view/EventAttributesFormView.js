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

export default function EventAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Event' }
                </Typography>
              }
              subheader={getItemsOk()+' / 4 ' + t('modelPanels.completed')}
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
                text={item.eventDbId}
                valueOk={valueOkStates.eventDbId}
                autoFocus={true}
              />
            </CardContent>

            {/* eventDescription */}
            <CardContent key='eventDescription' className={classes.cardContent} >
              <StringField
                itemKey='eventDescription'
                name='eventDescription'
                label='eventDescription'
                text={item.eventDescription}
                valueOk={valueOkStates.eventDescription}
              />
            </CardContent>

            {/* eventType */}
            <CardContent key='eventType' className={classes.cardContent} >
              <StringField
                itemKey='eventType'
                name='eventType'
                label='eventType'
                text={item.eventType}
                valueOk={valueOkStates.eventType}
              />
            </CardContent>

            {/* date */}
            <CardContent key='date' className={classes.cardContent} >
              <DateTimeField
                itemKey='date'
                name='date'
                label='date'
                text={item.date}
                valueOk={valueOkStates.date}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
EventAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};