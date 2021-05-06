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

export default function SitioAttributesFormView(props) {
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
    <div id='SitioAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Sitio' }
                </Typography>
              }
              subheader={getItemsOk()+' / 10 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* sitio_id*/}
            <CardContent key='sitio_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">sitio_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.sitio_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* pais */}
            <CardContent key='pais' className={classes.cardContent} >
              <StringField
                itemKey='pais'
                name='pais'
                label='pais'
                text={item.pais}
                valueOk={valueOkStates.pais}
              />
            </CardContent>

            {/* estado */}
            <CardContent key='estado' className={classes.cardContent} >
              <StringField
                itemKey='estado'
                name='estado'
                label='estado'
                text={item.estado}
                valueOk={valueOkStates.estado}
              />
            </CardContent>

            {/* clave_estado */}
            <CardContent key='clave_estado' className={classes.cardContent} >
              <StringField
                itemKey='clave_estado'
                name='clave_estado'
                label='clave_estado'
                text={item.clave_estado}
                valueOk={valueOkStates.clave_estado}
              />
            </CardContent>

            {/* municipio */}
            <CardContent key='municipio' className={classes.cardContent} >
              <StringField
                itemKey='municipio'
                name='municipio'
                label='municipio'
                text={item.municipio}
                valueOk={valueOkStates.municipio}
              />
            </CardContent>

            {/* clave_municipio */}
            <CardContent key='clave_municipio' className={classes.cardContent} >
              <StringField
                itemKey='clave_municipio'
                name='clave_municipio'
                label='clave_municipio'
                text={item.clave_municipio}
                valueOk={valueOkStates.clave_municipio}
              />
            </CardContent>

            {/* localidad */}
            <CardContent key='localidad' className={classes.cardContent} >
              <StringField
                itemKey='localidad'
                name='localidad'
                label='localidad'
                text={item.localidad}
                valueOk={valueOkStates.localidad}
              />
            </CardContent>

            {/* clave_localidad */}
            <CardContent key='clave_localidad' className={classes.cardContent} >
              <StringField
                itemKey='clave_localidad'
                name='clave_localidad'
                label='clave_localidad'
                text={item.clave_localidad}
                valueOk={valueOkStates.clave_localidad}
              />
            </CardContent>

            {/* latitud */}
            <CardContent key='latitud' className={classes.cardContent} >
              <FloatField
                itemKey='latitud'
                name='latitud'
                label='latitud'
                text={item.latitud}
                valueOk={valueOkStates.latitud}
              />
            </CardContent>

            {/* longitud */}
            <CardContent key='longitud' className={classes.cardContent} >
              <FloatField
                itemKey='longitud'
                name='longitud'
                label='longitud'
                text={item.longitud}
                valueOk={valueOkStates.longitud}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
SitioAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};