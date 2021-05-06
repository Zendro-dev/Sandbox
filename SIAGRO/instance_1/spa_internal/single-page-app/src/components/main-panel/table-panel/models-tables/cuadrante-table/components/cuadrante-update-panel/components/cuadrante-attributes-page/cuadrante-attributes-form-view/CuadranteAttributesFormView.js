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

import IntField from './components/IntField'

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

export default function CuadranteAttributesFormView(props) {
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
    <div id='CuadranteAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Cuadrante' }
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
            {/* cuadrante_id*/}
            <CardContent key='cuadrante_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">cuadrante_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.cuadrante_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* produccion_valor */}
            <CardContent key='produccion_valor' className={classes.cardContent} >
              <IntField
                itemKey='produccion_valor'
                name='produccion_valor'
                label='produccion_valor'
                text={item.produccion_valor}
                valueOk={valueOkStates.produccion_valor}
                valueAjv={valueAjvStates.produccion_valor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* produccion_etiqueta */}
            <CardContent key='produccion_etiqueta' className={classes.cardContent} >
              <StringField
                itemKey='produccion_etiqueta'
                name='produccion_etiqueta'
                label='produccion_etiqueta'
                text={item.produccion_etiqueta}
                valueOk={valueOkStates.produccion_etiqueta}
                valueAjv={valueAjvStates.produccion_etiqueta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* autoconsumo_valor */}
            <CardContent key='autoconsumo_valor' className={classes.cardContent} >
              <IntField
                itemKey='autoconsumo_valor'
                name='autoconsumo_valor'
                label='autoconsumo_valor'
                text={item.autoconsumo_valor}
                valueOk={valueOkStates.autoconsumo_valor}
                valueAjv={valueAjvStates.autoconsumo_valor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* autoconsumo_etiqueta */}
            <CardContent key='autoconsumo_etiqueta' className={classes.cardContent} >
              <StringField
                itemKey='autoconsumo_etiqueta'
                name='autoconsumo_etiqueta'
                label='autoconsumo_etiqueta'
                text={item.autoconsumo_etiqueta}
                valueOk={valueOkStates.autoconsumo_etiqueta}
                valueAjv={valueAjvStates.autoconsumo_etiqueta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* compra_valor */}
            <CardContent key='compra_valor' className={classes.cardContent} >
              <IntField
                itemKey='compra_valor'
                name='compra_valor'
                label='compra_valor'
                text={item.compra_valor}
                valueOk={valueOkStates.compra_valor}
                valueAjv={valueAjvStates.compra_valor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* compra_etiqueta */}
            <CardContent key='compra_etiqueta' className={classes.cardContent} >
              <StringField
                itemKey='compra_etiqueta'
                name='compra_etiqueta'
                label='compra_etiqueta'
                text={item.compra_etiqueta}
                valueOk={valueOkStates.compra_etiqueta}
                valueAjv={valueAjvStates.compra_etiqueta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* venta_valor */}
            <CardContent key='venta_valor' className={classes.cardContent} >
              <IntField
                itemKey='venta_valor'
                name='venta_valor'
                label='venta_valor'
                text={item.venta_valor}
                valueOk={valueOkStates.venta_valor}
                valueAjv={valueAjvStates.venta_valor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* venta_etiqueta */}
            <CardContent key='venta_etiqueta' className={classes.cardContent} >
              <StringField
                itemKey='venta_etiqueta'
                name='venta_etiqueta'
                label='venta_etiqueta'
                text={item.venta_etiqueta}
                valueOk={valueOkStates.venta_etiqueta}
                valueAjv={valueAjvStates.venta_etiqueta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nombre_comun_grupo_enfoque */}
            <CardContent key='nombre_comun_grupo_enfoque' className={classes.cardContent} >
              <StringField
                itemKey='nombre_comun_grupo_enfoque'
                name='nombre_comun_grupo_enfoque'
                label='nombre_comun_grupo_enfoque'
                text={item.nombre_comun_grupo_enfoque}
                valueOk={valueOkStates.nombre_comun_grupo_enfoque}
                valueAjv={valueAjvStates.nombre_comun_grupo_enfoque}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
CuadranteAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

