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

import FloatField from './components/FloatField'

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

export default function FieldPlotAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Field_plot' }
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
            {/* id*/}
            <CardContent key='id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* field_name */}
            <CardContent key='field_name' className={classes.cardContent} >
              <StringField
                itemKey='field_name'
                name='field_name'
                label='field_name'
                text={item.field_name}
                valueOk={valueOkStates.field_name}
                autoFocus={true}
              />
            </CardContent>

            {/* coordinates_or_name */}
            <CardContent key='coordinates_or_name' className={classes.cardContent} >
              <StringField
                itemKey='coordinates_or_name'
                name='coordinates_or_name'
                label='coordinates_or_name'
                text={item.coordinates_or_name}
                valueOk={valueOkStates.coordinates_or_name}
              />
            </CardContent>

            {/* year */}
            <CardContent key='year' className={classes.cardContent} >
              <StringField
                itemKey='year'
                name='year'
                label='year'
                text={item.year}
                valueOk={valueOkStates.year}
              />
            </CardContent>

            {/* area_sqm */}
            <CardContent key='area_sqm' className={classes.cardContent} >
              <FloatField
                itemKey='area_sqm'
                name='area_sqm'
                label='area_sqm'
                text={item.area_sqm}
                valueOk={valueOkStates.area_sqm}
              />
            </CardContent>

            {/* type */}
            <CardContent key='type' className={classes.cardContent} >
              <StringField
                itemKey='type'
                name='type'
                label='type'
                text={item.type}
                valueOk={valueOkStates.type}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
FieldPlotAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};