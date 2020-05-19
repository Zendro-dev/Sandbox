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

export default function ObservationUnitAttributesFormView(props) {
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

        

            {/* observationLevel */}
            <CardContent key='observationLevel' className={classes.cardContent} >
              <StringField
                itemKey='observationLevel'
                name='observationLevel'
                label='observationLevel'
                text={item.observationLevel}
                valueOk={valueOkStates.observationLevel}
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
              />
            </CardContent>

            {/* observationUnitDbId */}
            <CardContent key='observationUnitDbId' className={classes.cardContent} >
              <StringField
                itemKey='observationUnitDbId'
                name='observationUnitDbId'
                label='observationUnitDbId'
                text={item.observationUnitDbId}
                valueOk={valueOkStates.observationUnitDbId}
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
};