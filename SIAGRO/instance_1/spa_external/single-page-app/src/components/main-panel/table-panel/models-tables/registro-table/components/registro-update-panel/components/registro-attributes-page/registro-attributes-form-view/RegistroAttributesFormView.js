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

export default function RegistroAttributesFormView(props) {
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
    <div id='RegistroAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Registro' }
                </Typography>
              }
              subheader={getItemsOk()+' / 7 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* conabio_id*/}
            <CardContent key='conabio_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">conabio_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.conabio_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* clave_original */}
            <CardContent key='clave_original' className={classes.cardContent} >
              <StringField
                itemKey='clave_original'
                name='clave_original'
                label='clave_original'
                text={item.clave_original}
                valueOk={valueOkStates.clave_original}
                valueAjv={valueAjvStates.clave_original}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* tipo_alimento */}
            <CardContent key='tipo_alimento' className={classes.cardContent} >
              <StringField
                itemKey='tipo_alimento'
                name='tipo_alimento'
                label='tipo_alimento'
                text={item.tipo_alimento}
                valueOk={valueOkStates.tipo_alimento}
                valueAjv={valueAjvStates.tipo_alimento}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* food_type */}
            <CardContent key='food_type' className={classes.cardContent} >
              <StringField
                itemKey='food_type'
                name='food_type'
                label='food_type'
                text={item.food_type}
                valueOk={valueOkStates.food_type}
                valueAjv={valueAjvStates.food_type}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* descripcion_alimento */}
            <CardContent key='descripcion_alimento' className={classes.cardContent} >
              <StringField
                itemKey='descripcion_alimento'
                name='descripcion_alimento'
                label='descripcion_alimento'
                text={item.descripcion_alimento}
                valueOk={valueOkStates.descripcion_alimento}
                valueAjv={valueAjvStates.descripcion_alimento}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* food_description */}
            <CardContent key='food_description' className={classes.cardContent} >
              <StringField
                itemKey='food_description'
                name='food_description'
                label='food_description'
                text={item.food_description}
                valueOk={valueOkStates.food_description}
                valueAjv={valueAjvStates.food_description}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* procedencia */}
            <CardContent key='procedencia' className={classes.cardContent} >
              <StringField
                itemKey='procedencia'
                name='procedencia'
                label='procedencia'
                text={item.procedencia}
                valueOk={valueOkStates.procedencia}
                valueAjv={valueAjvStates.procedencia}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
RegistroAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

