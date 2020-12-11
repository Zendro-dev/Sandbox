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

export default function CaracteristicaCualitativaAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { valueOkStates,
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
    <div id='CaracteristicaCualitativaAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Caracteristica_cualitativa' }
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


            {/* nombre */}
            <CardContent key='nombre' className={classes.cardContent} >
              <StringField
                itemKey='nombre'
                name='nombre'
                label='nombre'
                valueOk={valueOkStates.nombre}
                valueAjv={valueAjvStates.nombre}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* valor */}
            <CardContent key='valor' className={classes.cardContent} >
              <StringField
                itemKey='valor'
                name='valor'
                label='valor'
                valueOk={valueOkStates.valor}
                valueAjv={valueAjvStates.valor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nombre_corto */}
            <CardContent key='nombre_corto' className={classes.cardContent} >
              <StringField
                itemKey='nombre_corto'
                name='nombre_corto'
                label='nombre_corto'
                valueOk={valueOkStates.nombre_corto}
                valueAjv={valueAjvStates.nombre_corto}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* comentarios */}
            <CardContent key='comentarios' className={classes.cardContent} >
              <StringField
                itemKey='comentarios'
                name='comentarios'
                label='comentarios'
                valueOk={valueOkStates.comentarios}
                valueAjv={valueAjvStates.comentarios}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
CaracteristicaCualitativaAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};