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
import Key from '@material-ui/icons/VpnKey';
import Tooltip from '@material-ui/core/Tooltip';

import StringField from './components/StringField'

import FloatField from './components/FloatField'

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

export default function SitioAttributesFormView(props) {
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
            {/*
              Internal ID
            */}
            {/* sitio_id */}
            <CardContent key='sitio_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='sitio_id'
                    name='sitio_id'
                    label='sitio_id'
                    valueOk={valueOkStates.sitio_id}
                    valueAjv={valueAjvStates.sitio_id}
                    autoFocus={true}
                    handleSetValue={handleSetValue}
                  />

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
                valueOk={valueOkStates.pais}
                valueAjv={valueAjvStates.pais}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* estado */}
            <CardContent key='estado' className={classes.cardContent} >
              <StringField
                itemKey='estado'
                name='estado'
                label='estado'
                valueOk={valueOkStates.estado}
                valueAjv={valueAjvStates.estado}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* clave_estado */}
            <CardContent key='clave_estado' className={classes.cardContent} >
              <StringField
                itemKey='clave_estado'
                name='clave_estado'
                label='clave_estado'
                valueOk={valueOkStates.clave_estado}
                valueAjv={valueAjvStates.clave_estado}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* municipio */}
            <CardContent key='municipio' className={classes.cardContent} >
              <StringField
                itemKey='municipio'
                name='municipio'
                label='municipio'
                valueOk={valueOkStates.municipio}
                valueAjv={valueAjvStates.municipio}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* clave_municipio */}
            <CardContent key='clave_municipio' className={classes.cardContent} >
              <StringField
                itemKey='clave_municipio'
                name='clave_municipio'
                label='clave_municipio'
                valueOk={valueOkStates.clave_municipio}
                valueAjv={valueAjvStates.clave_municipio}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* localidad */}
            <CardContent key='localidad' className={classes.cardContent} >
              <StringField
                itemKey='localidad'
                name='localidad'
                label='localidad'
                valueOk={valueOkStates.localidad}
                valueAjv={valueAjvStates.localidad}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* clave_localidad */}
            <CardContent key='clave_localidad' className={classes.cardContent} >
              <StringField
                itemKey='clave_localidad'
                name='clave_localidad'
                label='clave_localidad'
                valueOk={valueOkStates.clave_localidad}
                valueAjv={valueAjvStates.clave_localidad}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* latitud */}
            <CardContent key='latitud' className={classes.cardContent} >
              <FloatField
                itemKey='latitud'
                name='latitud'
                label='latitud'
                valueOk={valueOkStates.latitud}
                valueAjv={valueAjvStates.latitud}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* longitud */}
            <CardContent key='longitud' className={classes.cardContent} >
              <FloatField
                itemKey='longitud'
                name='longitud'
                label='longitud'
                valueOk={valueOkStates.longitud}
                valueAjv={valueAjvStates.longitud}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
SitioAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};