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

export default function ProgramAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { valueOkStates,
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
                    { t('modelPanels.model') + ': Program' }
                </Typography>
              }
              subheader={getItemsOk()+' / 8 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>
            
          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            {/* abbreviation */}
            <CardContent key='abbreviation' className={classes.cardContent} >
              <StringField
                itemKey='abbreviation'
                name='abbreviation'
                label='abbreviation'
                valueOk={valueOkStates.abbreviation}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* commonCropName */}
            <CardContent key='commonCropName' className={classes.cardContent} >
              <StringField
                itemKey='commonCropName'
                name='commonCropName'
                label='commonCropName'
                valueOk={valueOkStates.commonCropName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* documentationURL */}
            <CardContent key='documentationURL' className={classes.cardContent} >
              <StringField
                itemKey='documentationURL'
                name='documentationURL'
                label='documentationURL'
                valueOk={valueOkStates.documentationURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* leadPersonDbId */}
            <CardContent key='leadPersonDbId' className={classes.cardContent} >
              <StringField
                itemKey='leadPersonDbId'
                name='leadPersonDbId'
                label='leadPersonDbId'
                valueOk={valueOkStates.leadPersonDbId}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* leadPersonName */}
            <CardContent key='leadPersonName' className={classes.cardContent} >
              <StringField
                itemKey='leadPersonName'
                name='leadPersonName'
                label='leadPersonName'
                valueOk={valueOkStates.leadPersonName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* objective */}
            <CardContent key='objective' className={classes.cardContent} >
              <StringField
                itemKey='objective'
                name='objective'
                label='objective'
                valueOk={valueOkStates.objective}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* programName */}
            <CardContent key='programName' className={classes.cardContent} >
              <StringField
                itemKey='programName'
                name='programName'
                label='programName'
                valueOk={valueOkStates.programName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* programDbId */}
            <CardContent key='programDbId' className={classes.cardContent} >
              <StringField
                itemKey='programDbId'
                name='programDbId'
                label='programDbId'
                valueOk={valueOkStates.programDbId}
                handleSetValue={handleSetValue}
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ProgramAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};