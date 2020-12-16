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

export default function ObservationUnitAttributesFormView(props) {
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
    <div id='ObservationUnitAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': ObservationUnit' }
                </Typography>
              }
              subheader={getItemsOk()+' / 6 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* observationUnitDbId*/}
            <CardContent key='observationUnitDbId' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">observationUnitDbId:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.observationUnitDbId}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* observationLevel */}
            <CardContent key='observationLevel' className={classes.cardContent} >
              <StringField
                itemKey='observationLevel'
                name='observationLevel'
                label='observationLevel'
                text={item.observationLevel}
                valueOk={valueOkStates.observationLevel}
                valueAjv={valueAjvStates.observationLevel}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationUnitName */}
            <CardContent key='observationUnitName' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitName'
                name='observationUnitName'
                label='observationUnitName'
                text={item.observationUnitName}
                valueOk={valueOkStates.observationUnitName}
                valueAjv={valueAjvStates.observationUnitName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationUnitPUI */}
            <CardContent key='observationUnitPUI' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitPUI'
                name='observationUnitPUI'
                label='observationUnitPUI'
                text={item.observationUnitPUI}
                valueOk={valueOkStates.observationUnitPUI}
                valueAjv={valueAjvStates.observationUnitPUI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* plantNumber */}
            <CardContent key='plantNumber' className={classes.cardContent} >
              <StringField
                itemKey='plantNumber'
                name='plantNumber'
                label='plantNumber'
                text={item.plantNumber}
                valueOk={valueOkStates.plantNumber}
                valueAjv={valueAjvStates.plantNumber}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* plotNumber */}
            <CardContent key='plotNumber' className={classes.cardContent} >
              <StringField
                itemKey='plotNumber'
                name='plotNumber'
                label='plotNumber'
                text={item.plotNumber}
                valueOk={valueOkStates.plotNumber}
                valueAjv={valueAjvStates.plotNumber}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ObservationUnitAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

