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

export default function TipoPlantaAttributesFormView(props) {
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
    <div id='TipoPlantaAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Tipo_planta' }
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
            {/* tipo_planta_id */}
            <CardContent key='tipo_planta_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='tipo_planta_id'
                    name='tipo_planta_id'
                    label='tipo_planta_id'
                    valueOk={valueOkStates.tipo_planta_id}
                    valueAjv={valueAjvStates.tipo_planta_id}
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


            {/* tipo_planta */}
            <CardContent key='tipo_planta' className={classes.cardContent} >
              <StringField
                itemKey='tipo_planta'
                name='tipo_planta'
                label='tipo_planta'
                valueOk={valueOkStates.tipo_planta}
                valueAjv={valueAjvStates.tipo_planta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* foto_produccion */}
            <CardContent key='foto_produccion' className={classes.cardContent} >
              <StringField
                itemKey='foto_produccion'
                name='foto_produccion'
                label='foto_produccion'
                valueOk={valueOkStates.foto_produccion}
                valueAjv={valueAjvStates.foto_produccion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* foto_autoconsumo */}
            <CardContent key='foto_autoconsumo' className={classes.cardContent} >
              <StringField
                itemKey='foto_autoconsumo'
                name='foto_autoconsumo'
                label='foto_autoconsumo'
                valueOk={valueOkStates.foto_autoconsumo}
                valueAjv={valueAjvStates.foto_autoconsumo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* foto_venta */}
            <CardContent key='foto_venta' className={classes.cardContent} >
              <StringField
                itemKey='foto_venta'
                name='foto_venta'
                label='foto_venta'
                valueOk={valueOkStates.foto_venta}
                valueAjv={valueAjvStates.foto_venta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* foto_compra */}
            <CardContent key='foto_compra' className={classes.cardContent} >
              <StringField
                itemKey='foto_compra'
                name='foto_compra'
                label='foto_compra'
                valueOk={valueOkStates.foto_compra}
                valueAjv={valueAjvStates.foto_compra}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante1 */}
            <CardContent key='justificacion_produccion_cuadrante1' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante1'
                name='justificacion_produccion_cuadrante1'
                label='justificacion_produccion_cuadrante1'
                valueOk={valueOkStates.justificacion_produccion_cuadrante1}
                valueAjv={valueAjvStates.justificacion_produccion_cuadrante1}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante2 */}
            <CardContent key='justificacion_produccion_cuadrante2' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante2'
                name='justificacion_produccion_cuadrante2'
                label='justificacion_produccion_cuadrante2'
                valueOk={valueOkStates.justificacion_produccion_cuadrante2}
                valueAjv={valueAjvStates.justificacion_produccion_cuadrante2}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante3 */}
            <CardContent key='justificacion_produccion_cuadrante3' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante3'
                name='justificacion_produccion_cuadrante3'
                label='justificacion_produccion_cuadrante3'
                valueOk={valueOkStates.justificacion_produccion_cuadrante3}
                valueAjv={valueAjvStates.justificacion_produccion_cuadrante3}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* justificacion_produccion_cuadrante4 */}
            <CardContent key='justificacion_produccion_cuadrante4' className={classes.cardContent} >
              <StringField
                itemKey='justificacion_produccion_cuadrante4'
                name='justificacion_produccion_cuadrante4'
                label='justificacion_produccion_cuadrante4'
                valueOk={valueOkStates.justificacion_produccion_cuadrante4}
                valueAjv={valueAjvStates.justificacion_produccion_cuadrante4}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
TipoPlantaAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};