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

export default function EjemplarAttributesFormView(props) {
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
            {/* id*/}
            <CardContent key='id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
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
                text={item.region}
                valueOk={valueOkStates.region}
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

            {/* datum */}
            <CardContent key='datum' className={classes.cardContent} >
              <StringField
                itemKey='datum'
                name='datum'
                label='datum'
                text={item.datum}
                valueOk={valueOkStates.datum}
              />
            </CardContent>

            {/* validacionambiente */}
            <CardContent key='validacionambiente' className={classes.cardContent} >
              <StringField
                itemKey='validacionambiente'
                name='validacionambiente'
                label='validacionambiente'
                text={item.validacionambiente}
                valueOk={valueOkStates.validacionambiente}
              />
            </CardContent>

            {/* geovalidacion */}
            <CardContent key='geovalidacion' className={classes.cardContent} >
              <StringField
                itemKey='geovalidacion'
                name='geovalidacion'
                label='geovalidacion'
                text={item.geovalidacion}
                valueOk={valueOkStates.geovalidacion}
              />
            </CardContent>

            {/* paismapa */}
            <CardContent key='paismapa' className={classes.cardContent} >
              <StringField
                itemKey='paismapa'
                name='paismapa'
                label='paismapa'
                text={item.paismapa}
                valueOk={valueOkStates.paismapa}
              />
            </CardContent>

            {/* estadomapa */}
            <CardContent key='estadomapa' className={classes.cardContent} >
              <StringField
                itemKey='estadomapa'
                name='estadomapa'
                label='estadomapa'
                text={item.estadomapa}
                valueOk={valueOkStates.estadomapa}
              />
            </CardContent>

            {/* claveestadomapa */}
            <CardContent key='claveestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='claveestadomapa'
                name='claveestadomapa'
                label='claveestadomapa'
                text={item.claveestadomapa}
                valueOk={valueOkStates.claveestadomapa}
              />
            </CardContent>

            {/* mt24nombreestadomapa */}
            <CardContent key='mt24nombreestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24nombreestadomapa'
                name='mt24nombreestadomapa'
                label='mt24nombreestadomapa'
                text={item.mt24nombreestadomapa}
                valueOk={valueOkStates.mt24nombreestadomapa}
              />
            </CardContent>

            {/* mt24claveestadomapa */}
            <CardContent key='mt24claveestadomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24claveestadomapa'
                name='mt24claveestadomapa'
                label='mt24claveestadomapa'
                text={item.mt24claveestadomapa}
                valueOk={valueOkStates.mt24claveestadomapa}
              />
            </CardContent>

            {/* municipiomapa */}
            <CardContent key='municipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='municipiomapa'
                name='municipiomapa'
                label='municipiomapa'
                text={item.municipiomapa}
                valueOk={valueOkStates.municipiomapa}
              />
            </CardContent>

            {/* clavemunicipiomapa */}
            <CardContent key='clavemunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='clavemunicipiomapa'
                name='clavemunicipiomapa'
                label='clavemunicipiomapa'
                text={item.clavemunicipiomapa}
                valueOk={valueOkStates.clavemunicipiomapa}
              />
            </CardContent>

            {/* mt24nombremunicipiomapa */}
            <CardContent key='mt24nombremunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24nombremunicipiomapa'
                name='mt24nombremunicipiomapa'
                label='mt24nombremunicipiomapa'
                text={item.mt24nombremunicipiomapa}
                valueOk={valueOkStates.mt24nombremunicipiomapa}
              />
            </CardContent>

            {/* mt24clavemunicipiomapa */}
            <CardContent key='mt24clavemunicipiomapa' className={classes.cardContent} >
              <StringField
                itemKey='mt24clavemunicipiomapa'
                name='mt24clavemunicipiomapa'
                label='mt24clavemunicipiomapa'
                text={item.mt24clavemunicipiomapa}
                valueOk={valueOkStates.mt24clavemunicipiomapa}
              />
            </CardContent>

            {/* incertidumbrexy */}
            <CardContent key='incertidumbrexy' className={classes.cardContent} >
              <StringField
                itemKey='incertidumbrexy'
                name='incertidumbrexy'
                label='incertidumbrexy'
                text={item.incertidumbrexy}
                valueOk={valueOkStates.incertidumbrexy}
              />
            </CardContent>

            {/* altitudmapa */}
            <CardContent key='altitudmapa' className={classes.cardContent} >
              <StringField
                itemKey='altitudmapa'
                name='altitudmapa'
                label='altitudmapa'
                text={item.altitudmapa}
                valueOk={valueOkStates.altitudmapa}
              />
            </CardContent>

            {/* usvserieI */}
            <CardContent key='usvserieI' className={classes.cardContent} >
              <StringField
                itemKey='usvserieI'
                name='usvserieI'
                label='usvserieI'
                text={item.usvserieI}
                valueOk={valueOkStates.usvserieI}
              />
            </CardContent>

            {/* usvserieII */}
            <CardContent key='usvserieII' className={classes.cardContent} >
              <StringField
                itemKey='usvserieII'
                name='usvserieII'
                label='usvserieII'
                text={item.usvserieII}
                valueOk={valueOkStates.usvserieII}
              />
            </CardContent>

            {/* usvserieIII */}
            <CardContent key='usvserieIII' className={classes.cardContent} >
              <StringField
                itemKey='usvserieIII'
                name='usvserieIII'
                label='usvserieIII'
                text={item.usvserieIII}
                valueOk={valueOkStates.usvserieIII}
              />
            </CardContent>

            {/* usvserieIV */}
            <CardContent key='usvserieIV' className={classes.cardContent} >
              <StringField
                itemKey='usvserieIV'
                name='usvserieIV'
                label='usvserieIV'
                text={item.usvserieIV}
                valueOk={valueOkStates.usvserieIV}
              />
            </CardContent>

            {/* usvserieV */}
            <CardContent key='usvserieV' className={classes.cardContent} >
              <StringField
                itemKey='usvserieV'
                name='usvserieV'
                label='usvserieV'
                text={item.usvserieV}
                valueOk={valueOkStates.usvserieV}
              />
            </CardContent>

            {/* usvserieVI */}
            <CardContent key='usvserieVI' className={classes.cardContent} >
              <StringField
                itemKey='usvserieVI'
                name='usvserieVI'
                label='usvserieVI'
                text={item.usvserieVI}
                valueOk={valueOkStates.usvserieVI}
              />
            </CardContent>

            {/* anp */}
            <CardContent key='anp' className={classes.cardContent} >
              <StringField
                itemKey='anp'
                name='anp'
                label='anp'
                text={item.anp}
                valueOk={valueOkStates.anp}
              />
            </CardContent>

            {/* grupobio */}
            <CardContent key='grupobio' className={classes.cardContent} >
              <StringField
                itemKey='grupobio'
                name='grupobio'
                label='grupobio'
                text={item.grupobio}
                valueOk={valueOkStates.grupobio}
              />
            </CardContent>

            {/* subgrupobio */}
            <CardContent key='subgrupobio' className={classes.cardContent} >
              <StringField
                itemKey='subgrupobio'
                name='subgrupobio'
                label='subgrupobio'
                text={item.subgrupobio}
                valueOk={valueOkStates.subgrupobio}
              />
            </CardContent>

            {/* taxon */}
            <CardContent key='taxon' className={classes.cardContent} >
              <StringField
                itemKey='taxon'
                name='taxon'
                label='taxon'
                text={item.taxon}
                valueOk={valueOkStates.taxon}
              />
            </CardContent>

            {/* autor */}
            <CardContent key='autor' className={classes.cardContent} >
              <StringField
                itemKey='autor'
                name='autor'
                label='autor'
                text={item.autor}
                valueOk={valueOkStates.autor}
              />
            </CardContent>

            {/* estatustax */}
            <CardContent key='estatustax' className={classes.cardContent} >
              <StringField
                itemKey='estatustax'
                name='estatustax'
                label='estatustax'
                text={item.estatustax}
                valueOk={valueOkStates.estatustax}
              />
            </CardContent>

            {/* reftax */}
            <CardContent key='reftax' className={classes.cardContent} >
              <StringField
                itemKey='reftax'
                name='reftax'
                label='reftax'
                text={item.reftax}
                valueOk={valueOkStates.reftax}
              />
            </CardContent>

            {/* taxonvalido */}
            <CardContent key='taxonvalido' className={classes.cardContent} >
              <StringField
                itemKey='taxonvalido'
                name='taxonvalido'
                label='taxonvalido'
                text={item.taxonvalido}
                valueOk={valueOkStates.taxonvalido}
              />
            </CardContent>

            {/* autorvalido */}
            <CardContent key='autorvalido' className={classes.cardContent} >
              <StringField
                itemKey='autorvalido'
                name='autorvalido'
                label='autorvalido'
                text={item.autorvalido}
                valueOk={valueOkStates.autorvalido}
              />
            </CardContent>

            {/* reftaxvalido */}
            <CardContent key='reftaxvalido' className={classes.cardContent} >
              <StringField
                itemKey='reftaxvalido'
                name='reftaxvalido'
                label='reftaxvalido'
                text={item.reftaxvalido}
                valueOk={valueOkStates.reftaxvalido}
              />
            </CardContent>

            {/* taxonvalidado */}
            <CardContent key='taxonvalidado' className={classes.cardContent} >
              <StringField
                itemKey='taxonvalidado'
                name='taxonvalidado'
                label='taxonvalidado'
                text={item.taxonvalidado}
                valueOk={valueOkStates.taxonvalidado}
              />
            </CardContent>

            {/* endemismo */}
            <CardContent key='endemismo' className={classes.cardContent} >
              <StringField
                itemKey='endemismo'
                name='endemismo'
                label='endemismo'
                text={item.endemismo}
                valueOk={valueOkStates.endemismo}
              />
            </CardContent>

            {/* taxonextinto */}
            <CardContent key='taxonextinto' className={classes.cardContent} >
              <StringField
                itemKey='taxonextinto'
                name='taxonextinto'
                label='taxonextinto'
                text={item.taxonextinto}
                valueOk={valueOkStates.taxonextinto}
              />
            </CardContent>

            {/* ambiente */}
            <CardContent key='ambiente' className={classes.cardContent} >
              <StringField
                itemKey='ambiente'
                name='ambiente'
                label='ambiente'
                text={item.ambiente}
                valueOk={valueOkStates.ambiente}
              />
            </CardContent>

            {/* nombrecomun */}
            <CardContent key='nombrecomun' className={classes.cardContent} >
              <StringField
                itemKey='nombrecomun'
                name='nombrecomun'
                label='nombrecomun'
                text={item.nombrecomun}
                valueOk={valueOkStates.nombrecomun}
              />
            </CardContent>

            {/* formadecrecimiento */}
            <CardContent key='formadecrecimiento' className={classes.cardContent} >
              <StringField
                itemKey='formadecrecimiento'
                name='formadecrecimiento'
                label='formadecrecimiento'
                text={item.formadecrecimiento}
                valueOk={valueOkStates.formadecrecimiento}
              />
            </CardContent>

            {/* prioritaria */}
            <CardContent key='prioritaria' className={classes.cardContent} >
              <StringField
                itemKey='prioritaria'
                name='prioritaria'
                label='prioritaria'
                text={item.prioritaria}
                valueOk={valueOkStates.prioritaria}
              />
            </CardContent>

            {/* nivelprioridad */}
            <CardContent key='nivelprioridad' className={classes.cardContent} >
              <StringField
                itemKey='nivelprioridad'
                name='nivelprioridad'
                label='nivelprioridad'
                text={item.nivelprioridad}
                valueOk={valueOkStates.nivelprioridad}
              />
            </CardContent>

            {/* exoticainvasora */}
            <CardContent key='exoticainvasora' className={classes.cardContent} >
              <StringField
                itemKey='exoticainvasora'
                name='exoticainvasora'
                label='exoticainvasora'
                text={item.exoticainvasora}
                valueOk={valueOkStates.exoticainvasora}
              />
            </CardContent>

            {/* nom059 */}
            <CardContent key='nom059' className={classes.cardContent} >
              <StringField
                itemKey='nom059'
                name='nom059'
                label='nom059'
                text={item.nom059}
                valueOk={valueOkStates.nom059}
              />
            </CardContent>

            {/* cites */}
            <CardContent key='cites' className={classes.cardContent} >
              <StringField
                itemKey='cites'
                name='cites'
                label='cites'
                text={item.cites}
                valueOk={valueOkStates.cites}
              />
            </CardContent>

            {/* iucn */}
            <CardContent key='iucn' className={classes.cardContent} >
              <StringField
                itemKey='iucn'
                name='iucn'
                label='iucn'
                text={item.iucn}
                valueOk={valueOkStates.iucn}
              />
            </CardContent>

            {/* categoriaresidenciaaves */}
            <CardContent key='categoriaresidenciaaves' className={classes.cardContent} >
              <StringField
                itemKey='categoriaresidenciaaves'
                name='categoriaresidenciaaves'
                label='categoriaresidenciaaves'
                text={item.categoriaresidenciaaves}
                valueOk={valueOkStates.categoriaresidenciaaves}
              />
            </CardContent>

            {/* probablelocnodecampo */}
            <CardContent key='probablelocnodecampo' className={classes.cardContent} >
              <StringField
                itemKey='probablelocnodecampo'
                name='probablelocnodecampo'
                label='probablelocnodecampo'
                text={item.probablelocnodecampo}
                valueOk={valueOkStates.probablelocnodecampo}
              />
            </CardContent>

            {/* obsusoinfo */}
            <CardContent key='obsusoinfo' className={classes.cardContent} >
              <StringField
                itemKey='obsusoinfo'
                name='obsusoinfo'
                label='obsusoinfo'
                text={item.obsusoinfo}
                valueOk={valueOkStates.obsusoinfo}
              />
            </CardContent>

            {/* coleccion */}
            <CardContent key='coleccion' className={classes.cardContent} >
              <StringField
                itemKey='coleccion'
                name='coleccion'
                label='coleccion'
                text={item.coleccion}
                valueOk={valueOkStates.coleccion}
              />
            </CardContent>

            {/* institucion */}
            <CardContent key='institucion' className={classes.cardContent} >
              <StringField
                itemKey='institucion'
                name='institucion'
                label='institucion'
                text={item.institucion}
                valueOk={valueOkStates.institucion}
              />
            </CardContent>

            {/* paiscoleccion */}
            <CardContent key='paiscoleccion' className={classes.cardContent} >
              <StringField
                itemKey='paiscoleccion'
                name='paiscoleccion'
                label='paiscoleccion'
                text={item.paiscoleccion}
                valueOk={valueOkStates.paiscoleccion}
              />
            </CardContent>

            {/* numcatalogo */}
            <CardContent key='numcatalogo' className={classes.cardContent} >
              <StringField
                itemKey='numcatalogo'
                name='numcatalogo'
                label='numcatalogo'
                text={item.numcatalogo}
                valueOk={valueOkStates.numcatalogo}
              />
            </CardContent>

            {/* numcolecta */}
            <CardContent key='numcolecta' className={classes.cardContent} >
              <StringField
                itemKey='numcolecta'
                name='numcolecta'
                label='numcolecta'
                text={item.numcolecta}
                valueOk={valueOkStates.numcolecta}
              />
            </CardContent>

            {/* procedenciaejemplar */}
            <CardContent key='procedenciaejemplar' className={classes.cardContent} >
              <StringField
                itemKey='procedenciaejemplar'
                name='procedenciaejemplar'
                label='procedenciaejemplar'
                text={item.procedenciaejemplar}
                valueOk={valueOkStates.procedenciaejemplar}
              />
            </CardContent>

            {/* determinador */}
            <CardContent key='determinador' className={classes.cardContent} >
              <StringField
                itemKey='determinador'
                name='determinador'
                label='determinador'
                text={item.determinador}
                valueOk={valueOkStates.determinador}
              />
            </CardContent>

            {/* aniodeterminacion */}
            <CardContent key='aniodeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='aniodeterminacion'
                name='aniodeterminacion'
                label='aniodeterminacion'
                text={item.aniodeterminacion}
                valueOk={valueOkStates.aniodeterminacion}
              />
            </CardContent>

            {/* mesdeterminacion */}
            <CardContent key='mesdeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='mesdeterminacion'
                name='mesdeterminacion'
                label='mesdeterminacion'
                text={item.mesdeterminacion}
                valueOk={valueOkStates.mesdeterminacion}
              />
            </CardContent>

            {/* diadeterminacion */}
            <CardContent key='diadeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='diadeterminacion'
                name='diadeterminacion'
                label='diadeterminacion'
                text={item.diadeterminacion}
                valueOk={valueOkStates.diadeterminacion}
              />
            </CardContent>

            {/* fechadeterminacion */}
            <CardContent key='fechadeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='fechadeterminacion'
                name='fechadeterminacion'
                label='fechadeterminacion'
                text={item.fechadeterminacion}
                valueOk={valueOkStates.fechadeterminacion}
              />
            </CardContent>

            {/* calificadordeterminacion */}
            <CardContent key='calificadordeterminacion' className={classes.cardContent} >
              <StringField
                itemKey='calificadordeterminacion'
                name='calificadordeterminacion'
                label='calificadordeterminacion'
                text={item.calificadordeterminacion}
                valueOk={valueOkStates.calificadordeterminacion}
              />
            </CardContent>

            {/* colector */}
            <CardContent key='colector' className={classes.cardContent} >
              <StringField
                itemKey='colector'
                name='colector'
                label='colector'
                text={item.colector}
                valueOk={valueOkStates.colector}
              />
            </CardContent>

            {/* aniocolecta */}
            <CardContent key='aniocolecta' className={classes.cardContent} >
              <StringField
                itemKey='aniocolecta'
                name='aniocolecta'
                label='aniocolecta'
                text={item.aniocolecta}
                valueOk={valueOkStates.aniocolecta}
              />
            </CardContent>

            {/* mescolecta */}
            <CardContent key='mescolecta' className={classes.cardContent} >
              <StringField
                itemKey='mescolecta'
                name='mescolecta'
                label='mescolecta'
                text={item.mescolecta}
                valueOk={valueOkStates.mescolecta}
              />
            </CardContent>

            {/* diacolecta */}
            <CardContent key='diacolecta' className={classes.cardContent} >
              <StringField
                itemKey='diacolecta'
                name='diacolecta'
                label='diacolecta'
                text={item.diacolecta}
                valueOk={valueOkStates.diacolecta}
              />
            </CardContent>

            {/* fechacolecta */}
            <CardContent key='fechacolecta' className={classes.cardContent} >
              <StringField
                itemKey='fechacolecta'
                name='fechacolecta'
                label='fechacolecta'
                text={item.fechacolecta}
                valueOk={valueOkStates.fechacolecta}
              />
            </CardContent>

            {/* tipo */}
            <CardContent key='tipo' className={classes.cardContent} >
              <StringField
                itemKey='tipo'
                name='tipo'
                label='tipo'
                text={item.tipo}
                valueOk={valueOkStates.tipo}
              />
            </CardContent>

            {/* ejemplarfosil */}
            <CardContent key='ejemplarfosil' className={classes.cardContent} >
              <StringField
                itemKey='ejemplarfosil'
                name='ejemplarfosil'
                label='ejemplarfosil'
                text={item.ejemplarfosil}
                valueOk={valueOkStates.ejemplarfosil}
              />
            </CardContent>

            {/* proyecto */}
            <CardContent key='proyecto' className={classes.cardContent} >
              <StringField
                itemKey='proyecto'
                name='proyecto'
                label='proyecto'
                text={item.proyecto}
                valueOk={valueOkStates.proyecto}
              />
            </CardContent>

            {/* fuente */}
            <CardContent key='fuente' className={classes.cardContent} >
              <StringField
                itemKey='fuente'
                name='fuente'
                label='fuente'
                text={item.fuente}
                valueOk={valueOkStates.fuente}
              />
            </CardContent>

            {/* formadecitar */}
            <CardContent key='formadecitar' className={classes.cardContent} >
              <StringField
                itemKey='formadecitar'
                name='formadecitar'
                label='formadecitar'
                text={item.formadecitar}
                valueOk={valueOkStates.formadecitar}
              />
            </CardContent>

            {/* licenciauso */}
            <CardContent key='licenciauso' className={classes.cardContent} >
              <StringField
                itemKey='licenciauso'
                name='licenciauso'
                label='licenciauso'
                text={item.licenciauso}
                valueOk={valueOkStates.licenciauso}
              />
            </CardContent>

            {/* urlproyecto */}
            <CardContent key='urlproyecto' className={classes.cardContent} >
              <StringField
                itemKey='urlproyecto'
                name='urlproyecto'
                label='urlproyecto'
                text={item.urlproyecto}
                valueOk={valueOkStates.urlproyecto}
              />
            </CardContent>

            {/* urlorigen */}
            <CardContent key='urlorigen' className={classes.cardContent} >
              <StringField
                itemKey='urlorigen'
                name='urlorigen'
                label='urlorigen'
                text={item.urlorigen}
                valueOk={valueOkStates.urlorigen}
              />
            </CardContent>

            {/* urlejemplar */}
            <CardContent key='urlejemplar' className={classes.cardContent} >
              <StringField
                itemKey='urlejemplar'
                name='urlejemplar'
                label='urlejemplar'
                text={item.urlejemplar}
                valueOk={valueOkStates.urlejemplar}
              />
            </CardContent>

            {/* ultimafechaactualizacion */}
            <CardContent key='ultimafechaactualizacion' className={classes.cardContent} >
              <StringField
                itemKey='ultimafechaactualizacion'
                name='ultimafechaactualizacion'
                label='ultimafechaactualizacion'
                text={item.ultimafechaactualizacion}
                valueOk={valueOkStates.ultimafechaactualizacion}
              />
            </CardContent>

            {/* cuarentena */}
            <CardContent key='cuarentena' className={classes.cardContent} >
              <StringField
                itemKey='cuarentena'
                name='cuarentena'
                label='cuarentena'
                text={item.cuarentena}
                valueOk={valueOkStates.cuarentena}
              />
            </CardContent>

            {/* version */}
            <CardContent key='version' className={classes.cardContent} >
              <StringField
                itemKey='version'
                name='version'
                label='version'
                text={item.version}
                valueOk={valueOkStates.version}
              />
            </CardContent>

            {/* especie */}
            <CardContent key='especie' className={classes.cardContent} >
              <StringField
                itemKey='especie'
                name='especie'
                label='especie'
                text={item.especie}
                valueOk={valueOkStates.especie}
              />
            </CardContent>

            {/* especievalida */}
            <CardContent key='especievalida' className={classes.cardContent} >
              <StringField
                itemKey='especievalida'
                name='especievalida'
                label='especievalida'
                text={item.especievalida}
                valueOk={valueOkStates.especievalida}
              />
            </CardContent>

            {/* especievalidabusqueda */}
            <CardContent key='especievalidabusqueda' className={classes.cardContent} >
              <StringField
                itemKey='especievalidabusqueda'
                name='especievalidabusqueda'
                label='especievalidabusqueda'
                text={item.especievalidabusqueda}
                valueOk={valueOkStates.especievalidabusqueda}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
EjemplarAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};