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

export default function OntologyAnnotationAttributesFormView(props) {
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
    <div id='OntologyAnnotationAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': OntologyAnnotation' }
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
            {/* ontologyAnnotation_id*/}
            <CardContent key='ontologyAnnotation_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">ontologyAnnotation_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.ontologyAnnotation_id}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* ontology */}
            <CardContent key='ontology' className={classes.cardContent} >
              <StringField
                itemKey='ontology'
                name='ontology'
                label='ontology'
                text={item.ontology}
                valueOk={valueOkStates.ontology}
                valueAjv={valueAjvStates.ontology}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* ontologyURL */}
            <CardContent key='ontologyURL' className={classes.cardContent} >
              <StringField
                itemKey='ontologyURL'
                name='ontologyURL'
                label='ontologyURL'
                text={item.ontologyURL}
                valueOk={valueOkStates.ontologyURL}
                valueAjv={valueAjvStates.ontologyURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* term */}
            <CardContent key='term' className={classes.cardContent} >
              <StringField
                itemKey='term'
                name='term'
                label='term'
                text={item.term}
                valueOk={valueOkStates.term}
                valueAjv={valueAjvStates.term}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* termURL */}
            <CardContent key='termURL' className={classes.cardContent} >
              <StringField
                itemKey='termURL'
                name='termURL'
                label='termURL'
                text={item.termURL}
                valueOk={valueOkStates.termURL}
                valueAjv={valueAjvStates.termURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
OntologyAnnotationAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

