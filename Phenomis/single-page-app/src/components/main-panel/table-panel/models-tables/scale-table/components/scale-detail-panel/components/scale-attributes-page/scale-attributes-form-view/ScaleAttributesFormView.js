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



import IntField from './components/IntField'

import StringField from './components/StringField'

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

export default function ScaleAttributesFormView(props) {
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
                    { t('modelPanels.model') + ': Scale' }
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

        

            {/* decimalPlaces */}
            <CardContent key='decimalPlaces' className={classes.cardContent} >
              <IntField
                itemKey='decimalPlaces'
                name='decimalPlaces'
                label='decimalPlaces'
                text={item.decimalPlaces}
                isForeignKey={false}
                valueOk={valueOkStates.decimalPlaces}
                autoFocus={true}
              />
            </CardContent>

            {/* scaleName */}
            <CardContent key='scaleName' className={classes.cardContent} >
              <StringField
                itemKey='scaleName'
                name='scaleName'
                label='scaleName'
                text={item.scaleName}
                valueOk={valueOkStates.scaleName}
              />
            </CardContent>

            {/* xref */}
            <CardContent key='xref' className={classes.cardContent} >
              <StringField
                itemKey='xref'
                name='xref'
                label='xref'
                text={item.xref}
                valueOk={valueOkStates.xref}
              />
            </CardContent>

            {/* scaleDbId */}
            <CardContent key='scaleDbId' className={classes.cardContent} >
              <StringField
                itemKey='scaleDbId'
                name='scaleDbId'
                label='scaleDbId'
                text={item.scaleDbId}
                valueOk={valueOkStates.scaleDbId}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ScaleAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};