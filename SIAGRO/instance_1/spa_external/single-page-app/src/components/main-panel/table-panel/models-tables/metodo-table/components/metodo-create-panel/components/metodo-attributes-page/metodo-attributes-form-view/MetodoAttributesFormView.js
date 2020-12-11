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
import ArrayField from './components/ArrayField'

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

export default function MetodoAttributesFormView(props) {
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
    <div id='MetodoAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Metodo' }
                </Typography>
              }
              subheader={getItemsOk()+' / 4 ' + t('modelPanels.completed')}
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


            {/* descripcion */}
            <CardContent key='descripcion' className={classes.cardContent} >
              <StringField
                itemKey='descripcion'
                name='descripcion'
                label='descripcion'
                valueOk={valueOkStates.descripcion}
                valueAjv={valueAjvStates.descripcion}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* referencias */}
            <CardContent key='referencias' className={classes.cardContent} >
              <ArrayField
                itemKey='referencias'
                name='referencias'
                label='referencias'
                valueOk={valueOkStates.referencias}
                valueAjv={valueAjvStates.referencias}
                handleSetValue={handleSetValue}
                arrayType='String'
              />
            </CardContent>

            {/* link_referencias */}
            <CardContent key='link_referencias' className={classes.cardContent} >
              <ArrayField
                itemKey='link_referencias'
                name='link_referencias'
                label='link_referencias'
                valueOk={valueOkStates.link_referencias}
                valueAjv={valueAjvStates.link_referencias}
                handleSetValue={handleSetValue}
                arrayType='String'
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
MetodoAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};