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

import IntField from './components/IntField'

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

export default function CuadranteAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Cuadrante' }
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

            {/* tipo_planta */}
            <CardContent key='tipo_planta' className={classes.cardContent} >
              <StringField
                itemKey='tipo_planta'
                name='tipo_planta'
                label='tipo_planta'
                text={item.tipo_planta}
                valueOk={valueOkStates.tipo_planta}
              />
            </CardContent>

            {/* produccion_valor */}
            <CardContent key='produccion_valor' className={classes.cardContent} >
              <IntField
                itemKey='produccion_valor'
                name='produccion_valor'
                label='produccion_valor'
                text={item.produccion_valor}
                isForeignKey={false}
                valueOk={valueOkStates.produccion_valor}
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
              />
            </CardContent>

            {/* autoconsumo_valor */}
            <CardContent key='autoconsumo_valor' className={classes.cardContent} >
              <IntField
                itemKey='autoconsumo_valor'
                name='autoconsumo_valor'
                label='autoconsumo_valor'
                text={item.autoconsumo_valor}
                isForeignKey={false}
                valueOk={valueOkStates.autoconsumo_valor}
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
              />
            </CardContent>

            {/* compra_valor */}
            <CardContent key='compra_valor' className={classes.cardContent} >
              <IntField
                itemKey='compra_valor'
                name='compra_valor'
                label='compra_valor'
                text={item.compra_valor}
                isForeignKey={false}
                valueOk={valueOkStates.compra_valor}
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
              />
            </CardContent>

            {/* venta_valor */}
            <CardContent key='venta_valor' className={classes.cardContent} >
              <IntField
                itemKey='venta_valor'
                name='venta_valor'
                label='venta_valor'
                text={item.venta_valor}
                isForeignKey={false}
                valueOk={valueOkStates.venta_valor}
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
};