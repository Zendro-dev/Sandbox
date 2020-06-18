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

export default function SequencingExperimentAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Sequencing_experiment' }
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

            {/* name */}
            <CardContent key='name' className={classes.cardContent} >
              <StringField
                itemKey='name'
                name='name'
                label='name'
                text={item.name}
                valueOk={valueOkStates.name}
                autoFocus={true}
              />
            </CardContent>

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                text={item.description}
                valueOk={valueOkStates.description}
              />
            </CardContent>

            {/* start_date */}
            <CardContent key='start_date' className={classes.cardContent} >
              <StringField
                itemKey='start_date'
                name='start_date'
                label='start_date'
                text={item.start_date}
                valueOk={valueOkStates.start_date}
              />
            </CardContent>

            {/* end_date */}
            <CardContent key='end_date' className={classes.cardContent} >
              <StringField
                itemKey='end_date'
                name='end_date'
                label='end_date'
                text={item.end_date}
                valueOk={valueOkStates.end_date}
              />
            </CardContent>

            {/* protocol */}
            <CardContent key='protocol' className={classes.cardContent} >
              <StringField
                itemKey='protocol'
                name='protocol'
                label='protocol'
                text={item.protocol}
                valueOk={valueOkStates.protocol}
              />
            </CardContent>

            {/* platform */}
            <CardContent key='platform' className={classes.cardContent} >
              <StringField
                itemKey='platform'
                name='platform'
                label='platform'
                text={item.platform}
                valueOk={valueOkStates.platform}
              />
            </CardContent>

            {/* data_type */}
            <CardContent key='data_type' className={classes.cardContent} >
              <StringField
                itemKey='data_type'
                name='data_type'
                label='data_type'
                text={item.data_type}
                valueOk={valueOkStates.data_type}
              />
            </CardContent>

            {/* library_type */}
            <CardContent key='library_type' className={classes.cardContent} >
              <StringField
                itemKey='library_type'
                name='library_type'
                label='library_type'
                text={item.library_type}
                valueOk={valueOkStates.library_type}
              />
            </CardContent>

            {/* library_preparation */}
            <CardContent key='library_preparation' className={classes.cardContent} >
              <StringField
                itemKey='library_preparation'
                name='library_preparation'
                label='library_preparation'
                text={item.library_preparation}
                valueOk={valueOkStates.library_preparation}
              />
            </CardContent>

            {/* aimed_coverage */}
            <CardContent key='aimed_coverage' className={classes.cardContent} >
              <FloatField
                itemKey='aimed_coverage'
                name='aimed_coverage'
                label='aimed_coverage'
                text={item.aimed_coverage}
                valueOk={valueOkStates.aimed_coverage}
              />
            </CardContent>

            {/* resulting_coverage */}
            <CardContent key='resulting_coverage' className={classes.cardContent} >
              <FloatField
                itemKey='resulting_coverage'
                name='resulting_coverage'
                label='resulting_coverage'
                text={item.resulting_coverage}
                valueOk={valueOkStates.resulting_coverage}
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
              />
            </CardContent>

            {/* aimed_read_length */}
            <CardContent key='aimed_read_length' className={classes.cardContent} >
              <StringField
                itemKey='aimed_read_length'
                name='aimed_read_length'
                label='aimed_read_length'
                text={item.aimed_read_length}
                valueOk={valueOkStates.aimed_read_length}
              />
            </CardContent>

            {/* genome_complexity_reduction */}
            <CardContent key='genome_complexity_reduction' className={classes.cardContent} >
              <StringField
                itemKey='genome_complexity_reduction'
                name='genome_complexity_reduction'
                label='genome_complexity_reduction'
                text={item.genome_complexity_reduction}
                valueOk={valueOkStates.genome_complexity_reduction}
              />
            </CardContent>

            {/* contamination */}
            <CardContent key='contamination' className={classes.cardContent} >
              <StringField
                itemKey='contamination'
                name='contamination'
                label='contamination'
                text={item.contamination}
                valueOk={valueOkStates.contamination}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
SequencingExperimentAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};