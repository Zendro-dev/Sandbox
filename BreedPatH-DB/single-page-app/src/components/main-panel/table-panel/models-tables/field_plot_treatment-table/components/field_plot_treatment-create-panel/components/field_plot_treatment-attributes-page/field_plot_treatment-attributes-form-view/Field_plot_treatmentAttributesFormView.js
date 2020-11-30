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

export default function FieldPlotTreatmentAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Field_plot_treatment' }
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


            {/* start_date */}
            <CardContent key='start_date' className={classes.cardContent} >
              <StringField
                itemKey='start_date'
                name='start_date'
                label='start_date'
                valueOk={valueOkStates.start_date}
                valueAjv={valueAjvStates.start_date}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* end_date */}
            <CardContent key='end_date' className={classes.cardContent} >
              <StringField
                itemKey='end_date'
                name='end_date'
                label='end_date'
                valueOk={valueOkStates.end_date}
                valueAjv={valueAjvStates.end_date}
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

            {/* description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='description'
                valueOk={valueOkStates.description}
                valueAjv={valueAjvStates.description}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* chemical */}
            <CardContent key='chemical' className={classes.cardContent} >
              <StringField
                itemKey='chemical'
                name='chemical'
                label='chemical'
                valueOk={valueOkStates.chemical}
                valueAjv={valueAjvStates.chemical}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* pesticide_type */}
            <CardContent key='pesticide_type' className={classes.cardContent} >
              <StringField
                itemKey='pesticide_type'
                name='pesticide_type'
                label='pesticide_type'
                valueOk={valueOkStates.pesticide_type}
                valueAjv={valueAjvStates.pesticide_type}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
FieldPlotTreatmentAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};