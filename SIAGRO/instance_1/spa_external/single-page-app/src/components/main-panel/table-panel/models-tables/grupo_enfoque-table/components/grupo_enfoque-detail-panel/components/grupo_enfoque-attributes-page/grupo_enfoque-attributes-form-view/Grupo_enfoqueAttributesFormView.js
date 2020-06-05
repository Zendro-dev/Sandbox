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

import DateField from './components/DateField'

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

export default function GrupoEnfoqueAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Grupo_enfoque' }
                </Typography>
              }
              subheader={getItemsOk()+' / 14 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* grupo_id*/}
            <CardContent key='grupo_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">grupo_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.grupo_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* tipo_grupo */}
            <CardContent key='tipo_grupo' className={classes.cardContent} >
              <StringField
                itemKey='tipo_grupo'
                name='tipo_grupo'
                label='tipo_grupo'
                text={item.tipo_grupo}
                valueOk={valueOkStates.tipo_grupo}
              />
            </CardContent>

            {/* numero_participantes */}
            <CardContent key='numero_participantes' className={classes.cardContent} >
              <IntField
                itemKey='numero_participantes'
                name='numero_participantes'
                label='numero_participantes'
                text={item.numero_participantes}
                isForeignKey={false}
                valueOk={valueOkStates.numero_participantes}
              />
            </CardContent>

            {/* fecha */}
            <CardContent key='fecha' className={classes.cardContent} >
              <DateField
                itemKey='fecha'
                name='fecha'
                label='fecha'
                text={item.fecha}
                valueOk={valueOkStates.fecha}
              />
            </CardContent>

            {/* lista_especies */}
            <CardContent key='lista_especies' className={classes.cardContent} >
              <StringField
                itemKey='lista_especies'
                name='lista_especies'
                label='lista_especies'
                text={item.lista_especies}
                valueOk={valueOkStates.lista_especies}
              />
            </CardContent>

            {/* foto_produccion */}
            <CardContent key='foto_produccion' className={classes.cardContent} >
              <StringField
                itemKey='foto_produccion'
                name='foto_produccion'
                label='foto_produccion'
                text={item.foto_produccion}
                valueOk={valueOkStates.foto_produccion}
              />
            </CardContent>

            {/* foto_autoconsumo */}
            <CardContent key='foto_autoconsumo' className={classes.cardContent} >
              <StringField
                itemKey='foto_autoconsumo'
                name='foto_autoconsumo'
                label='foto_autoconsumo'
                text={item.foto_autoconsumo}
                valueOk={valueOkStates.foto_autoconsumo}
              />
            </CardContent>

            {/* foto_venta */}
            <CardContent key='foto_venta' className={classes.cardContent} >
              <StringField
                itemKey='foto_venta'
                name='foto_venta'
                label='foto_venta'
                text={item.foto_venta}
                valueOk={valueOkStates.foto_venta}
              />
            </CardContent>

            {/* foto_compra */}
            <CardContent key='foto_compra' className={classes.cardContent} >
              <StringField
                itemKey='foto_compra'
                name='foto_compra'
                label='foto_compra'
                text={item.foto_compra}
                valueOk={valueOkStates.foto_compra}
              />
            </CardContent>

            {/* observaciones */}
            <CardContent key='observaciones' className={classes.cardContent} >
              <StringField
                itemKey='observaciones'
                name='observaciones'
                label='observaciones'
                text={item.observaciones}
                valueOk={valueOkStates.observaciones}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante1 */}
            <CardContent key='justificacion_produccion_cuadrante1' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante1'
                name='justificacion_produccion_cuadrante1'
                label='justificacion_produccion_cuadrante1'
                text={item.justificacion_produccion_cuadrante1}
                valueOk={valueOkStates.justificacion_produccion_cuadrante1}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante2 */}
            <CardContent key='justificacion_produccion_cuadrante2' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante2'
                name='justificacion_produccion_cuadrante2'
                label='justificacion_produccion_cuadrante2'
                text={item.justificacion_produccion_cuadrante2}
                valueOk={valueOkStates.justificacion_produccion_cuadrante2}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante3 */}
            <CardContent key='justificacion_produccion_cuadrante3' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante3'
                name='justificacion_produccion_cuadrante3'
                label='justificacion_produccion_cuadrante3'
                text={item.justificacion_produccion_cuadrante3}
                valueOk={valueOkStates.justificacion_produccion_cuadrante3}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante4 */}
            <CardContent key='justificacion_produccion_cuadrante4' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante4'
                name='justificacion_produccion_cuadrante4'
                label='justificacion_produccion_cuadrante4'
                text={item.justificacion_produccion_cuadrante4}
                valueOk={valueOkStates.justificacion_produccion_cuadrante4}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
GrupoEnfoqueAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};