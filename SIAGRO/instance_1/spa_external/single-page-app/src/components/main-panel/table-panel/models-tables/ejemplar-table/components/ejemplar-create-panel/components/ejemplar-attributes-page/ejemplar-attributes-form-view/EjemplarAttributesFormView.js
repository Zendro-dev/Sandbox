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

export default function EjemplarAttributesFormView(props) {
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
    <div id='EjemplarAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Ejemplar' }
                </Typography>
              }
              subheader={getItemsOk()+' / 82 ' + t('modelPanels.completed')}
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
            {/* id */}
            <CardContent key='id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='id'
                    name='id'
                    label='id'
                    valueOk={valueOkStates.id}
                    valueAjv={valueAjvStates.id}
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


            {/* region */}
            <CardContent key='region' className={classes.cardContent} >
              <StringField
                itemKey='region'
                name='region'
                label='region'
                valueOk={valueOkStates.region}
                valueAjv={valueAjvStates.region}
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

            {/* datum */}
            <CardContent key='datum' className={classes.cardContent} >
              <StringField
                itemKey='datum'
                name='datum'
                label='datum'
                valueOk={valueOkStates.datum}
                valueAjv={valueAjvStates.datum}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* validacionambiente */}
            <CardContent key='validacionambiente' className={classes.cardContent} >
              <StringField
                itemKey='validacionambiente'
                name='validacionambiente'
                label='validacionambiente'
                valueOk={valueOkStates.validacionambiente}
                valueAjv={valueAjvStates.validacionambiente}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* geovalidacion */}
            <CardContent key='geovalidacion' className={classes.cardContent} >
              <StringField
                itemKey='geovalidacion'
                name='geovalidacion'
                label='geovalidacion'
                valueOk={valueOkStates.geovalidacion}
                valueAjv={valueAjvStates.geovalidacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* paismapa */}
            <CardContent key='paismapa' className={classes.cardContent} >
              <StringField
                itemKey='paismapa'
                name='paismapa'
                label='paismapa'
                valueOk={valueOkStates.paismapa}
                valueAjv={valueAjvStates.paismapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* estadomapa */}
            <CardContent key='estadomapa' className={classes.cardContent} >
              <StringField
                itemKey='estadomapa'
                name='estadomapa'
                label='estadomapa'
                valueOk={valueOkStates.estadomapa}
                valueAjv={valueAjvStates.estadomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* claveestadomapa */}
            <CardContent key='claveestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='claveestadomapa'
                name='claveestadomapa'
                label='claveestadomapa'
                valueOk={valueOkStates.claveestadomapa}
                valueAjv={valueAjvStates.claveestadomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mt24nombreestadomapa */}
            <CardContent key='mt24nombreestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24nombreestadomapa'
                name='mt24nombreestadomapa'
                label='mt24nombreestadomapa'
                valueOk={valueOkStates.mt24nombreestadomapa}
                valueAjv={valueAjvStates.mt24nombreestadomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mt24claveestadomapa */}
            <CardContent key='mt24claveestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24claveestadomapa'
                name='mt24claveestadomapa'
                label='mt24claveestadomapa'
                valueOk={valueOkStates.mt24claveestadomapa}
                valueAjv={valueAjvStates.mt24claveestadomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* municipiomapa */}
            <CardContent key='municipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='municipiomapa'
                name='municipiomapa'
                label='municipiomapa'
                valueOk={valueOkStates.municipiomapa}
                valueAjv={valueAjvStates.municipiomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* clavemunicipiomapa */}
            <CardContent key='clavemunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='clavemunicipiomapa'
                name='clavemunicipiomapa'
                label='clavemunicipiomapa'
                valueOk={valueOkStates.clavemunicipiomapa}
                valueAjv={valueAjvStates.clavemunicipiomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mt24nombremunicipiomapa */}
            <CardContent key='mt24nombremunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24nombremunicipiomapa'
                name='mt24nombremunicipiomapa'
                label='mt24nombremunicipiomapa'
                valueOk={valueOkStates.mt24nombremunicipiomapa}
                valueAjv={valueAjvStates.mt24nombremunicipiomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mt24clavemunicipiomapa */}
            <CardContent key='mt24clavemunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24clavemunicipiomapa'
                name='mt24clavemunicipiomapa'
                label='mt24clavemunicipiomapa'
                valueOk={valueOkStates.mt24clavemunicipiomapa}
                valueAjv={valueAjvStates.mt24clavemunicipiomapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* incertidumbrexy */}
            <CardContent key='incertidumbrexy' className={classes.cardContent} >
              <StringField
                itemKey='incertidumbrexy'
                name='incertidumbrexy'
                label='incertidumbrexy'
                valueOk={valueOkStates.incertidumbrexy}
                valueAjv={valueAjvStates.incertidumbrexy}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* altitudmapa */}
            <CardContent key='altitudmapa' className={classes.cardContent} >
              <StringField
                itemKey='altitudmapa'
                name='altitudmapa'
                label='altitudmapa'
                valueOk={valueOkStates.altitudmapa}
                valueAjv={valueAjvStates.altitudmapa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieI */}
            <CardContent key='usvserieI' className={classes.cardContent} >
              <StringField
                itemKey='usvserieI'
                name='usvserieI'
                label='usvserieI'
                valueOk={valueOkStates.usvserieI}
                valueAjv={valueAjvStates.usvserieI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieII */}
            <CardContent key='usvserieII' className={classes.cardContent} >
              <StringField
                itemKey='usvserieII'
                name='usvserieII'
                label='usvserieII'
                valueOk={valueOkStates.usvserieII}
                valueAjv={valueAjvStates.usvserieII}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieIII */}
            <CardContent key='usvserieIII' className={classes.cardContent} >
              <StringField
                itemKey='usvserieIII'
                name='usvserieIII'
                label='usvserieIII'
                valueOk={valueOkStates.usvserieIII}
                valueAjv={valueAjvStates.usvserieIII}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieIV */}
            <CardContent key='usvserieIV' className={classes.cardContent} >
              <StringField
                itemKey='usvserieIV'
                name='usvserieIV'
                label='usvserieIV'
                valueOk={valueOkStates.usvserieIV}
                valueAjv={valueAjvStates.usvserieIV}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieV */}
            <CardContent key='usvserieV' className={classes.cardContent} >
              <StringField
                itemKey='usvserieV'
                name='usvserieV'
                label='usvserieV'
                valueOk={valueOkStates.usvserieV}
                valueAjv={valueAjvStates.usvserieV}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* usvserieVI */}
            <CardContent key='usvserieVI' className={classes.cardContent} >
              <StringField
                itemKey='usvserieVI'
                name='usvserieVI'
                label='usvserieVI'
                valueOk={valueOkStates.usvserieVI}
                valueAjv={valueAjvStates.usvserieVI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* anp */}
            <CardContent key='anp' className={classes.cardContent} >
              <StringField
                itemKey='anp'
                name='anp'
                label='anp'
                valueOk={valueOkStates.anp}
                valueAjv={valueAjvStates.anp}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* grupobio */}
            <CardContent key='grupobio' className={classes.cardContent} >
              <StringField
                itemKey='grupobio'
                name='grupobio'
                label='grupobio'
                valueOk={valueOkStates.grupobio}
                valueAjv={valueAjvStates.grupobio}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* subgrupobio */}
            <CardContent key='subgrupobio' className={classes.cardContent} >
              <StringField
                itemKey='subgrupobio'
                name='subgrupobio'
                label='subgrupobio'
                valueOk={valueOkStates.subgrupobio}
                valueAjv={valueAjvStates.subgrupobio}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* taxon */}
            <CardContent key='taxon' className={classes.cardContent} >
              <StringField
                itemKey='taxon'
                name='taxon'
                label='taxon'
                valueOk={valueOkStates.taxon}
                valueAjv={valueAjvStates.taxon}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* autor */}
            <CardContent key='autor' className={classes.cardContent} >
              <StringField
                itemKey='autor'
                name='autor'
                label='autor'
                valueOk={valueOkStates.autor}
                valueAjv={valueAjvStates.autor}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* estatustax */}
            <CardContent key='estatustax' className={classes.cardContent} >
              <StringField
                itemKey='estatustax'
                name='estatustax'
                label='estatustax'
                valueOk={valueOkStates.estatustax}
                valueAjv={valueAjvStates.estatustax}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* reftax */}
            <CardContent key='reftax' className={classes.cardContent} >
              <StringField
                itemKey='reftax'
                name='reftax'
                label='reftax'
                valueOk={valueOkStates.reftax}
                valueAjv={valueAjvStates.reftax}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* taxonvalido */}
            <CardContent key='taxonvalido' className={classes.cardContent} >
              <StringField
                itemKey='taxonvalido'
                name='taxonvalido'
                label='taxonvalido'
                valueOk={valueOkStates.taxonvalido}
                valueAjv={valueAjvStates.taxonvalido}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* autorvalido */}
            <CardContent key='autorvalido' className={classes.cardContent} >
              <StringField
                itemKey='autorvalido'
                name='autorvalido'
                label='autorvalido'
                valueOk={valueOkStates.autorvalido}
                valueAjv={valueAjvStates.autorvalido}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* reftaxvalido */}
            <CardContent key='reftaxvalido' className={classes.cardContent} >
              <StringField
                itemKey='reftaxvalido'
                name='reftaxvalido'
                label='reftaxvalido'
                valueOk={valueOkStates.reftaxvalido}
                valueAjv={valueAjvStates.reftaxvalido}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* taxonvalidado */}
            <CardContent key='taxonvalidado' className={classes.cardContent} >
              <StringField
                itemKey='taxonvalidado'
                name='taxonvalidado'
                label='taxonvalidado'
                valueOk={valueOkStates.taxonvalidado}
                valueAjv={valueAjvStates.taxonvalidado}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* endemismo */}
            <CardContent key='endemismo' className={classes.cardContent} >
              <StringField
                itemKey='endemismo'
                name='endemismo'
                label='endemismo'
                valueOk={valueOkStates.endemismo}
                valueAjv={valueAjvStates.endemismo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* taxonextinto */}
            <CardContent key='taxonextinto' className={classes.cardContent} >
              <StringField
                itemKey='taxonextinto'
                name='taxonextinto'
                label='taxonextinto'
                valueOk={valueOkStates.taxonextinto}
                valueAjv={valueAjvStates.taxonextinto}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* ambiente */}
            <CardContent key='ambiente' className={classes.cardContent} >
              <StringField
                itemKey='ambiente'
                name='ambiente'
                label='ambiente'
                valueOk={valueOkStates.ambiente}
                valueAjv={valueAjvStates.ambiente}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nombrecomun */}
            <CardContent key='nombrecomun' className={classes.cardContent} >
              <StringField
                itemKey='nombrecomun'
                name='nombrecomun'
                label='nombrecomun'
                valueOk={valueOkStates.nombrecomun}
                valueAjv={valueAjvStates.nombrecomun}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* formadecrecimiento */}
            <CardContent key='formadecrecimiento' className={classes.cardContent} >
              <StringField
                itemKey='formadecrecimiento'
                name='formadecrecimiento'
                label='formadecrecimiento'
                valueOk={valueOkStates.formadecrecimiento}
                valueAjv={valueAjvStates.formadecrecimiento}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* prioritaria */}
            <CardContent key='prioritaria' className={classes.cardContent} >
              <StringField
                itemKey='prioritaria'
                name='prioritaria'
                label='prioritaria'
                valueOk={valueOkStates.prioritaria}
                valueAjv={valueAjvStates.prioritaria}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nivelprioridad */}
            <CardContent key='nivelprioridad' className={classes.cardContent} >
              <StringField
                itemKey='nivelprioridad'
                name='nivelprioridad'
                label='nivelprioridad'
                valueOk={valueOkStates.nivelprioridad}
                valueAjv={valueAjvStates.nivelprioridad}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* exoticainvasora */}
            <CardContent key='exoticainvasora' className={classes.cardContent} >
              <StringField
                itemKey='exoticainvasora'
                name='exoticainvasora'
                label='exoticainvasora'
                valueOk={valueOkStates.exoticainvasora}
                valueAjv={valueAjvStates.exoticainvasora}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nom059 */}
            <CardContent key='nom059' className={classes.cardContent} >
              <StringField
                itemKey='nom059'
                name='nom059'
                label='nom059'
                valueOk={valueOkStates.nom059}
                valueAjv={valueAjvStates.nom059}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* cites */}
            <CardContent key='cites' className={classes.cardContent} >
              <StringField
                itemKey='cites'
                name='cites'
                label='cites'
                valueOk={valueOkStates.cites}
                valueAjv={valueAjvStates.cites}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* iucn */}
            <CardContent key='iucn' className={classes.cardContent} >
              <StringField
                itemKey='iucn'
                name='iucn'
                label='iucn'
                valueOk={valueOkStates.iucn}
                valueAjv={valueAjvStates.iucn}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* categoriaresidenciaaves */}
            <CardContent key='categoriaresidenciaaves' className={classes.cardContent} >
              <StringField
                itemKey='categoriaresidenciaaves'
                name='categoriaresidenciaaves'
                label='categoriaresidenciaaves'
                valueOk={valueOkStates.categoriaresidenciaaves}
                valueAjv={valueAjvStates.categoriaresidenciaaves}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* probablelocnodecampo */}
            <CardContent key='probablelocnodecampo' className={classes.cardContent} >
              <StringField
                itemKey='probablelocnodecampo'
                name='probablelocnodecampo'
                label='probablelocnodecampo'
                valueOk={valueOkStates.probablelocnodecampo}
                valueAjv={valueAjvStates.probablelocnodecampo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* obsusoinfo */}
            <CardContent key='obsusoinfo' className={classes.cardContent} >
              <StringField
                itemKey='obsusoinfo'
                name='obsusoinfo'
                label='obsusoinfo'
                valueOk={valueOkStates.obsusoinfo}
                valueAjv={valueAjvStates.obsusoinfo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* coleccion */}
            <CardContent key='coleccion' className={classes.cardContent} >
              <StringField
                itemKey='coleccion'
                name='coleccion'
                label='coleccion'
                valueOk={valueOkStates.coleccion}
                valueAjv={valueAjvStates.coleccion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* institucion */}
            <CardContent key='institucion' className={classes.cardContent} >
              <StringField
                itemKey='institucion'
                name='institucion'
                label='institucion'
                valueOk={valueOkStates.institucion}
                valueAjv={valueAjvStates.institucion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* paiscoleccion */}
            <CardContent key='paiscoleccion' className={classes.cardContent} >
              <StringField
                itemKey='paiscoleccion'
                name='paiscoleccion'
                label='paiscoleccion'
                valueOk={valueOkStates.paiscoleccion}
                valueAjv={valueAjvStates.paiscoleccion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* numcatalogo */}
            <CardContent key='numcatalogo' className={classes.cardContent} >
              <StringField
                itemKey='numcatalogo'
                name='numcatalogo'
                label='numcatalogo'
                valueOk={valueOkStates.numcatalogo}
                valueAjv={valueAjvStates.numcatalogo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* numcolecta */}
            <CardContent key='numcolecta' className={classes.cardContent} >
              <StringField
                itemKey='numcolecta'
                name='numcolecta'
                label='numcolecta'
                valueOk={valueOkStates.numcolecta}
                valueAjv={valueAjvStates.numcolecta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* procedenciaejemplar */}
            <CardContent key='procedenciaejemplar' className={classes.cardContent} >
              <StringField
                itemKey='procedenciaejemplar'
                name='procedenciaejemplar'
                label='procedenciaejemplar'
                valueOk={valueOkStates.procedenciaejemplar}
                valueAjv={valueAjvStates.procedenciaejemplar}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* determinador */}
            <CardContent key='determinador' className={classes.cardContent} >
              <StringField
                itemKey='determinador'
                name='determinador'
                label='determinador'
                valueOk={valueOkStates.determinador}
                valueAjv={valueAjvStates.determinador}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* aniodeterminacion */}
            <CardContent key='aniodeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='aniodeterminacion'
                name='aniodeterminacion'
                label='aniodeterminacion'
                valueOk={valueOkStates.aniodeterminacion}
                valueAjv={valueAjvStates.aniodeterminacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mesdeterminacion */}
            <CardContent key='mesdeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='mesdeterminacion'
                name='mesdeterminacion'
                label='mesdeterminacion'
                valueOk={valueOkStates.mesdeterminacion}
                valueAjv={valueAjvStates.mesdeterminacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* diadeterminacion */}
            <CardContent key='diadeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='diadeterminacion'
                name='diadeterminacion'
                label='diadeterminacion'
                valueOk={valueOkStates.diadeterminacion}
                valueAjv={valueAjvStates.diadeterminacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fechadeterminacion */}
            <CardContent key='fechadeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='fechadeterminacion'
                name='fechadeterminacion'
                label='fechadeterminacion'
                valueOk={valueOkStates.fechadeterminacion}
                valueAjv={valueAjvStates.fechadeterminacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* calificadordeterminacion */}
            <CardContent key='calificadordeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='calificadordeterminacion'
                name='calificadordeterminacion'
                label='calificadordeterminacion'
                valueOk={valueOkStates.calificadordeterminacion}
                valueAjv={valueAjvStates.calificadordeterminacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* colector */}
            <CardContent key='colector' className={classes.cardContent} >
              <StringField
                itemKey='colector'
                name='colector'
                label='colector'
                valueOk={valueOkStates.colector}
                valueAjv={valueAjvStates.colector}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* aniocolecta */}
            <CardContent key='aniocolecta' className={classes.cardContent} >
              <StringField
                itemKey='aniocolecta'
                name='aniocolecta'
                label='aniocolecta'
                valueOk={valueOkStates.aniocolecta}
                valueAjv={valueAjvStates.aniocolecta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mescolecta */}
            <CardContent key='mescolecta' className={classes.cardContent} >
              <StringField
                itemKey='mescolecta'
                name='mescolecta'
                label='mescolecta'
                valueOk={valueOkStates.mescolecta}
                valueAjv={valueAjvStates.mescolecta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* diacolecta */}
            <CardContent key='diacolecta' className={classes.cardContent} >
              <StringField
                itemKey='diacolecta'
                name='diacolecta'
                label='diacolecta'
                valueOk={valueOkStates.diacolecta}
                valueAjv={valueAjvStates.diacolecta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fechacolecta */}
            <CardContent key='fechacolecta' className={classes.cardContent} >
              <StringField
                itemKey='fechacolecta'
                name='fechacolecta'
                label='fechacolecta'
                valueOk={valueOkStates.fechacolecta}
                valueAjv={valueAjvStates.fechacolecta}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* tipo */}
            <CardContent key='tipo' className={classes.cardContent} >
              <StringField
                itemKey='tipo'
                name='tipo'
                label='tipo'
                valueOk={valueOkStates.tipo}
                valueAjv={valueAjvStates.tipo}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* ejemplarfosil */}
            <CardContent key='ejemplarfosil' className={classes.cardContent} >
              <StringField
                itemKey='ejemplarfosil'
                name='ejemplarfosil'
                label='ejemplarfosil'
                valueOk={valueOkStates.ejemplarfosil}
                valueAjv={valueAjvStates.ejemplarfosil}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* proyecto */}
            <CardContent key='proyecto' className={classes.cardContent} >
              <StringField
                itemKey='proyecto'
                name='proyecto'
                label='proyecto'
                valueOk={valueOkStates.proyecto}
                valueAjv={valueAjvStates.proyecto}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* fuente */}
            <CardContent key='fuente' className={classes.cardContent} >
              <StringField
                itemKey='fuente'
                name='fuente'
                label='fuente'
                valueOk={valueOkStates.fuente}
                valueAjv={valueAjvStates.fuente}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* formadecitar */}
            <CardContent key='formadecitar' className={classes.cardContent} >
              <StringField
                itemKey='formadecitar'
                name='formadecitar'
                label='formadecitar'
                valueOk={valueOkStates.formadecitar}
                valueAjv={valueAjvStates.formadecitar}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* licenciauso */}
            <CardContent key='licenciauso' className={classes.cardContent} >
              <StringField
                itemKey='licenciauso'
                name='licenciauso'
                label='licenciauso'
                valueOk={valueOkStates.licenciauso}
                valueAjv={valueAjvStates.licenciauso}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* urlproyecto */}
            <CardContent key='urlproyecto' className={classes.cardContent} >
              <StringField
                itemKey='urlproyecto'
                name='urlproyecto'
                label='urlproyecto'
                valueOk={valueOkStates.urlproyecto}
                valueAjv={valueAjvStates.urlproyecto}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* urlorigen */}
            <CardContent key='urlorigen' className={classes.cardContent} >
              <StringField
                itemKey='urlorigen'
                name='urlorigen'
                label='urlorigen'
                valueOk={valueOkStates.urlorigen}
                valueAjv={valueAjvStates.urlorigen}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* urlejemplar */}
            <CardContent key='urlejemplar' className={classes.cardContent} >
              <StringField
                itemKey='urlejemplar'
                name='urlejemplar'
                label='urlejemplar'
                valueOk={valueOkStates.urlejemplar}
                valueAjv={valueAjvStates.urlejemplar}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* ultimafechaactualizacion */}
            <CardContent key='ultimafechaactualizacion' className={classes.cardContent} >
              <StringField
                itemKey='ultimafechaactualizacion'
                name='ultimafechaactualizacion'
                label='ultimafechaactualizacion'
                valueOk={valueOkStates.ultimafechaactualizacion}
                valueAjv={valueAjvStates.ultimafechaactualizacion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* cuarentena */}
            <CardContent key='cuarentena' className={classes.cardContent} >
              <StringField
                itemKey='cuarentena'
                name='cuarentena'
                label='cuarentena'
                valueOk={valueOkStates.cuarentena}
                valueAjv={valueAjvStates.cuarentena}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* version */}
            <CardContent key='version' className={classes.cardContent} >
              <StringField
                itemKey='version'
                name='version'
                label='version'
                valueOk={valueOkStates.version}
                valueAjv={valueAjvStates.version}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* especie */}
            <CardContent key='especie' className={classes.cardContent} >
              <StringField
                itemKey='especie'
                name='especie'
                label='especie'
                valueOk={valueOkStates.especie}
                valueAjv={valueAjvStates.especie}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* especievalida */}
            <CardContent key='especievalida' className={classes.cardContent} >
              <StringField
                itemKey='especievalida'
                name='especievalida'
                label='especievalida'
                valueOk={valueOkStates.especievalida}
                valueAjv={valueAjvStates.especievalida}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* especievalidabusqueda */}
            <CardContent key='especievalidabusqueda' className={classes.cardContent} >
              <StringField
                itemKey='especievalidabusqueda'
                name='especievalidabusqueda'
                label='especievalidabusqueda'
                valueOk={valueOkStates.especievalidabusqueda}
                valueAjv={valueAjvStates.especievalidabusqueda}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
EjemplarAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};