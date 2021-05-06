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

import IntField from './components/IntField'

import DateField from './components/DateField'

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

export default function GrupoEnfoqueAttributesFormView(props) {
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
    <div id='GrupoEnfoqueAttributesFormView-div-root' className={classes.root}>
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
              subheader={getItemsOk()+' / 5 ' + t('modelPanels.completed')}
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
            {/* grupo_id */}
            <CardContent key='grupo_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='grupo_id'
                    name='grupo_id'
                    label='grupo_id'
                    valueOk={valueOkStates.grupo_id}
                    valueAjv={valueAjvStates.grupo_id}
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


            {/* tipo_grupo */}
            <CardContent key='tipo_grupo' className={classes.cardContent} >
              <StringField
                itemKey='tipo_grupo'
                name='tipo_grupo'
                label='tipo_grupo'
                valueOk={valueOkStates.tipo_grupo}
                valueAjv={valueAjvStates.tipo_grupo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* numero_participantes */}
            <CardContent key='numero_participantes' className={classes.cardContent} >
              <IntField
                itemKey='numero_participantes'
                name='numero_participantes'
                label='numero_participantes'
                valueOk={valueOkStates.numero_participantes}
                valueAjv={valueAjvStates.numero_participantes}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fecha */}
            <CardContent key='fecha' className={classes.cardContent} >
              <DateField
                itemKey='fecha'
                name='fecha'
                label='fecha'
                valueOk={valueOkStates.fecha}
                valueAjv={valueAjvStates.fecha}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* lista_especies */}
            <CardContent key='lista_especies' className={classes.cardContent} >
              <StringField
                itemKey='lista_especies'
                name='lista_especies'
                label='lista_especies'
                valueOk={valueOkStates.lista_especies}
                valueAjv={valueAjvStates.lista_especies}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
GrupoEnfoqueAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};