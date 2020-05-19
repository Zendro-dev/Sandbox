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

export default function ObservationUnitAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': ObservationUnit' }
                </Typography>
              }
              subheader={getItemsOk()+' / 11 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* observationLevel */}
            <CardContent key='observationLevel' className={classes.cardContent} >
              <StringField
                itemKey='observationLevel'
                name='observationLevel'
                label='observationLevel'
                valueOk={valueOkStates.observationLevel}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationUnitName */}
            <CardContent key='observationUnitName' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitName'
                name='observationUnitName'
                label='observationUnitName'
                valueOk={valueOkStates.observationUnitName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationUnitPUI */}
            <CardContent key='observationUnitPUI' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitPUI'
                name='observationUnitPUI'
                label='observationUnitPUI'
                valueOk={valueOkStates.observationUnitPUI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* plantNumber */}
            <CardContent key='plantNumber' className={classes.cardContent} >
              <StringField
                itemKey='plantNumber'
                name='plantNumber'
                label='plantNumber'
                valueOk={valueOkStates.plantNumber}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* plotNumber */}
            <CardContent key='plotNumber' className={classes.cardContent} >
              <StringField
                itemKey='plotNumber'
                name='plotNumber'
                label='plotNumber'
                valueOk={valueOkStates.plotNumber}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* observationUnitDbId */}
            <CardContent key='observationUnitDbId' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitDbId'
                name='observationUnitDbId'
                label='observationUnitDbId'
                valueOk={valueOkStates.observationUnitDbId}
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
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};