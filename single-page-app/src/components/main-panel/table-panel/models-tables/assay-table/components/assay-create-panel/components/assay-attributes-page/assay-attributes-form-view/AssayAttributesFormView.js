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

export default function AssayAttributesFormView(props) {
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
    <div id='AssayAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Assay' }
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
            {/* assay_id */}
            <CardContent key='assay_id' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='assay_id'
                    name='assay_id'
                    label='assay_id'
                    valueOk={valueOkStates.assay_id}
                    valueAjv={valueAjvStates.assay_id}
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


            {/* measurement */}
            <CardContent key='measurement' className={classes.cardContent} >
              <StringField
                itemKey='measurement'
                name='measurement'
                label='measurement'
                valueOk={valueOkStates.measurement}
                valueAjv={valueAjvStates.measurement}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* technology */}
            <CardContent key='technology' className={classes.cardContent} >
              <StringField
                itemKey='technology'
                name='technology'
                label='technology'
                valueOk={valueOkStates.technology}
                valueAjv={valueAjvStates.technology}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* platform */}
            <CardContent key='platform' className={classes.cardContent} >
              <StringField
                itemKey='platform'
                name='platform'
                label='platform'
                valueOk={valueOkStates.platform}
                valueAjv={valueAjvStates.platform}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* method */}
            <CardContent key='method' className={classes.cardContent} >
              <StringField
                itemKey='method'
                name='method'
                label='method'
                valueOk={valueOkStates.method}
                valueAjv={valueAjvStates.method}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
AssayAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};