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

export default function ContactAttributesFormView(props) {
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
    <div id='ContactAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Contact' }
                </Typography>
              }
              subheader={getItemsOk()+' / 6 ' + t('modelPanels.completed')}
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
            {/* contactDbId */}
            <CardContent key='contactDbId' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='contactDbId'
                    name='contactDbId'
                    label='contactDbId'
                    valueOk={valueOkStates.contactDbId}
                    valueAjv={valueAjvStates.contactDbId}
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


            {/* email */}
            <CardContent key='email' className={classes.cardContent} >
              <StringField
                itemKey='email'
                name='email'
                label='email'
                valueOk={valueOkStates.email}
                valueAjv={valueAjvStates.email}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* instituteName */}
            <CardContent key='instituteName' className={classes.cardContent} >
              <StringField
                itemKey='instituteName'
                name='instituteName'
                label='instituteName'
                valueOk={valueOkStates.instituteName}
                valueAjv={valueAjvStates.instituteName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* name */}
            <CardContent key='name' className={classes.cardContent} >
              <StringField
                itemKey='name'
                name='name'
                label='name'
                valueOk={valueOkStates.name}
                valueAjv={valueAjvStates.name}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* orcid */}
            <CardContent key='orcid' className={classes.cardContent} >
              <StringField
                itemKey='orcid'
                name='orcid'
                label='orcid'
                valueOk={valueOkStates.orcid}
                valueAjv={valueAjvStates.orcid}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* type */}
            <CardContent key='type' className={classes.cardContent} >
              <StringField
                itemKey='type'
                name='type'
                label='type'
                valueOk={valueOkStates.type}
                valueAjv={valueAjvStates.type}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ContactAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};