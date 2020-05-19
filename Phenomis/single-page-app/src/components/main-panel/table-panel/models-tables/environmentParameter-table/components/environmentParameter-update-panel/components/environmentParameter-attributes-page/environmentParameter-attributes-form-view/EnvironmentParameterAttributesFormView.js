import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
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

export default function EnvironmentParameterAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, 
          valueOkStates,
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
                    { t('modelPanels.model') + ': EnvironmentParameter' }
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

            

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                text={item.description}
                valueOk={valueOkStates.description}
                autoFocus={true}
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
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
  handleSetValue: PropTypes.func.isRequired,
};

