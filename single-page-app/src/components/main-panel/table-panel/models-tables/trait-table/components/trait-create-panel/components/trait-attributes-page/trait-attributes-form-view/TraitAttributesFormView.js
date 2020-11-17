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

export default function TraitAttributesFormView(props) {
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
    <div id='TraitAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Trait' }
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
            {/*
              Internal ID
            */}
            {/* traitDbId */}
            <CardContent key='traitDbId' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='traitDbId'
                    name='traitDbId'
                    label='traitDbId'
                    valueOk={valueOkStates.traitDbId}
                    valueAjv={valueAjvStates.traitDbId}
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


            {/* attribute */}
            <CardContent key='attribute' className={classes.cardContent} >
              <StringField
                itemKey='attribute'
                name='attribute'
                label='attribute'
                valueOk={valueOkStates.attribute}
                valueAjv={valueAjvStates.attribute}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* entity */}
            <CardContent key='entity' className={classes.cardContent} >
              <StringField
                itemKey='entity'
                name='entity'
                label='entity'
                valueOk={valueOkStates.entity}
                valueAjv={valueAjvStates.entity}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mainAbbreviation */}
            <CardContent key='mainAbbreviation' className={classes.cardContent} >
              <StringField
                itemKey='mainAbbreviation'
                name='mainAbbreviation'
                label='mainAbbreviation'
                valueOk={valueOkStates.mainAbbreviation}
                valueAjv={valueAjvStates.mainAbbreviation}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* status */}
            <CardContent key='status' className={classes.cardContent} >
              <StringField
                itemKey='status'
                name='status'
                label='status'
                valueOk={valueOkStates.status}
                valueAjv={valueAjvStates.status}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitClass */}
            <CardContent key='traitClass' className={classes.cardContent} >
              <StringField
                itemKey='traitClass'
                name='traitClass'
                label='traitClass'
                valueOk={valueOkStates.traitClass}
                valueAjv={valueAjvStates.traitClass}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitDescription */}
            <CardContent key='traitDescription' className={classes.cardContent} >
              <StringField
                itemKey='traitDescription'
                name='traitDescription'
                label='traitDescription'
                valueOk={valueOkStates.traitDescription}
                valueAjv={valueAjvStates.traitDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitName */}
            <CardContent key='traitName' className={classes.cardContent} >
              <StringField
                itemKey='traitName'
                name='traitName'
                label='traitName'
                valueOk={valueOkStates.traitName}
                valueAjv={valueAjvStates.traitName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* xref */}
            <CardContent key='xref' className={classes.cardContent} >
              <StringField
                itemKey='xref'
                name='xref'
                label='xref'
                valueOk={valueOkStates.xref}
                valueAjv={valueAjvStates.xref}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
TraitAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};