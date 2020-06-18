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

import FloatField from './components/FloatField'

import IntField from './components/IntField'

import BoolField from './components/BoolField'

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

export default function NucAcidLibraryResultAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Nuc_acid_library_result' }
                </Typography>
              }
              subheader={getItemsOk()+' / 9 ' + t('modelPanels.completed')}
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


            {/* lab_code */}
            <CardContent key='lab_code' className={classes.cardContent} >
              <StringField
                itemKey='lab_code'
                name='lab_code'
                label='lab_code'
                text={item.lab_code}
                valueOk={valueOkStates.lab_code}
                valueAjv={valueAjvStates.lab_code}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* file_name */}
            <CardContent key='file_name' className={classes.cardContent} >
              <StringField
                itemKey='file_name'
                name='file_name'
                label='file_name'
                text={item.file_name}
                valueOk={valueOkStates.file_name}
                valueAjv={valueAjvStates.file_name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* file_uri */}
            <CardContent key='file_uri' className={classes.cardContent} >
              <StringField
                itemKey='file_uri'
                name='file_uri'
                label='file_uri'
                text={item.file_uri}
                valueOk={valueOkStates.file_uri}
                valueAjv={valueAjvStates.file_uri}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* type */}
            <CardContent key='type' className={classes.cardContent} >
              <StringField
                itemKey='type'
                name='type'
                label='type'
                text={item.type}
                valueOk={valueOkStates.type}
                valueAjv={valueAjvStates.type}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* insert_size */}
            <CardContent key='insert_size' className={classes.cardContent} >
              <FloatField
                itemKey='insert_size'
                name='insert_size'
                label='insert_size'
                text={item.insert_size}
                valueOk={valueOkStates.insert_size}
                valueAjv={valueAjvStates.insert_size}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* technical_replicate */}
            <CardContent key='technical_replicate' className={classes.cardContent} >
              <IntField
                itemKey='technical_replicate'
                name='technical_replicate'
                label='technical_replicate'
                text={item.technical_replicate}
                valueOk={valueOkStates.technical_replicate}
                valueAjv={valueAjvStates.technical_replicate}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* trimmed */}
            <CardContent key='trimmed' className={classes.cardContent} >
              <BoolField
                itemKey='trimmed'
                name='trimmed'
                label='trimmed'
                text={item.trimmed}
                valueOk={valueOkStates.trimmed}
                valueAjv={valueAjvStates.trimmed}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
NucAcidLibraryResultAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

