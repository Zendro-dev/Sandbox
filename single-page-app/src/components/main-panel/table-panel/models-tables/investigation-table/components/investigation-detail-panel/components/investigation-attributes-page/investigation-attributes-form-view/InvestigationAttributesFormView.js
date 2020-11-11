import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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

import DateField from './components/DateField'

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

export default function InvestigationAttributesFormView(props) {
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
    <div id='InvestigationAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Investigation' }
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
            {/* investigation_id*/}
            <CardContent key='investigation_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">investigation_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.investigation_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* title */}
            <CardContent key='title' className={classes.cardContent} >
              <StringField
                itemKey='title'
                name='title'
                label='title'
                text={item.title}
                valueOk={valueOkStates.title}
              />
            </CardContent>

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                text={item.description}
                valueOk={valueOkStates.description}
              />
            </CardContent>

            {/* startDate */}
            <CardContent key='startDate' className={classes.cardContent} >
              <DateField
                itemKey='startDate'
                name='startDate'
                label='startDate'
                text={item.startDate}
                valueOk={valueOkStates.startDate}
              />
            </CardContent>

            {/* endDate */}
            <CardContent key='endDate' className={classes.cardContent} >
              <DateField
                itemKey='endDate'
                name='endDate'
                label='endDate'
                text={item.endDate}
                valueOk={valueOkStates.endDate}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
InvestigationAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};