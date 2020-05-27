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

export default function TaxonAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Taxon' }
                </Typography>
              }
              subheader={getItemsOk()+' / 15 ' + t('modelPanels.completed')}
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

            {/* categoria */}
            <CardContent key='categoria' className={classes.cardContent} >
              <StringField
                itemKey='categoria'
                name='categoria'
                label='categoria'
                valueOk={valueOkStates.categoria}
                valueAjv={valueAjvStates.categoria}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* estatus */}
            <CardContent key='estatus' className={classes.cardContent} >
              <StringField
                itemKey='estatus'
                name='estatus'
                label='estatus'
                valueOk={valueOkStates.estatus}
                valueAjv={valueAjvStates.estatus}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nombreAutoridad */}
            <CardContent key='nombreAutoridad' className={classes.cardContent} >
              <StringField
                itemKey='nombreAutoridad'
                name='nombreAutoridad'
                label='nombreAutoridad'
                valueOk={valueOkStates.nombreAutoridad}
                valueAjv={valueAjvStates.nombreAutoridad}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* citaNomenclatural */}
            <CardContent key='citaNomenclatural' className={classes.cardContent} >
              <StringField
                itemKey='citaNomenclatural'
                name='citaNomenclatural'
                label='citaNomenclatural'
                valueOk={valueOkStates.citaNomenclatural}
                valueAjv={valueAjvStates.citaNomenclatural}
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

            {/* grupoSNIB */}
            <CardContent key='grupoSNIB' className={classes.cardContent} >
              <StringField
                itemKey='grupoSNIB'
                name='grupoSNIB'
                label='grupoSNIB'
                valueOk={valueOkStates.grupoSNIB}
                valueAjv={valueAjvStates.grupoSNIB}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* categoriaResidencia */}
            <CardContent key='categoriaResidencia' className={classes.cardContent} >
              <StringField
                itemKey='categoriaResidencia'
                name='categoriaResidencia'
                label='categoriaResidencia'
                valueOk={valueOkStates.categoriaResidencia}
                valueAjv={valueAjvStates.categoriaResidencia}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* nom */}
            <CardContent key='nom' className={classes.cardContent} >
              <StringField
                itemKey='nom'
                name='nom'
                label='nom'
                valueOk={valueOkStates.nom}
                valueAjv={valueAjvStates.nom}
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

            {/* prioritarias */}
            <CardContent key='prioritarias' className={classes.cardContent} >
              <StringField
                itemKey='prioritarias'
                name='prioritarias'
                label='prioritarias'
                valueOk={valueOkStates.prioritarias}
                valueAjv={valueAjvStates.prioritarias}
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
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
TaxonAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};