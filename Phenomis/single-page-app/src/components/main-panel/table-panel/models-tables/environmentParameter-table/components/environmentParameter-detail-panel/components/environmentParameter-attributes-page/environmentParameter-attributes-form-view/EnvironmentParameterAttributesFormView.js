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

export default function EnvironmentParameterAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': EnvironmentParameter' }
                </Typography>
              }
              subheader={getItemsOk()+' / 8 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}

        

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                text={item.description}
                valueOk={valueOkStates.description}
                autoFocus={true}
              />
            </CardContent>

            {/* parameterName */}
            <CardContent key='parameterName' className={classes.cardContent} >
              <StringField
                itemKey='parameterName'
                name='parameterName'
                label='parameterName'
                text={item.parameterName}
                valueOk={valueOkStates.parameterName}
              />
            </CardContent>

            {/* parameterPUI */}
            <CardContent key='parameterPUI' className={classes.cardContent} >
              <StringField
                itemKey='parameterPUI'
                name='parameterPUI'
                label='parameterPUI'
                text={item.parameterPUI}
                valueOk={valueOkStates.parameterPUI}
              />
            </CardContent>

            {/* unit */}
            <CardContent key='unit' className={classes.cardContent} >
              <StringField
                itemKey='unit'
                name='unit'
                label='unit'
                text={item.unit}
                valueOk={valueOkStates.unit}
              />
            </CardContent>

            {/* unitPUI */}
            <CardContent key='unitPUI' className={classes.cardContent} >
              <StringField
                itemKey='unitPUI'
                name='unitPUI'
                label='unitPUI'
                text={item.unitPUI}
                valueOk={valueOkStates.unitPUI}
              />
            </CardContent>

            {/* value */}
            <CardContent key='value' className={classes.cardContent} >
              <StringField
                itemKey='value'
                name='value'
                label='value'
                text={item.value}
                valueOk={valueOkStates.value}
              />
            </CardContent>

            {/* valuePUI */}
            <CardContent key='valuePUI' className={classes.cardContent} >
              <StringField
                itemKey='valuePUI'
                name='valuePUI'
                label='valuePUI'
                text={item.valuePUI}
                valueOk={valueOkStates.valuePUI}
              />
            </CardContent>

            {/* environmentParameterDbId */}
            <CardContent key='environmentParameterDbId' className={classes.cardContent} >
              <StringField
                itemKey='environmentParameterDbId'
                name='environmentParameterDbId'
                label='environmentParameterDbId'
                text={item.environmentParameterDbId}
                valueOk={valueOkStates.environmentParameterDbId}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
EnvironmentParameterAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};