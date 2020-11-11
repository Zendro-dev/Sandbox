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

export default function ContactAttributesFormView(props) {
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
            {/* contact_id*/}
            <CardContent key='contact_id' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">contact_id:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.contact_id}</Typography>
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
              />
            </CardContent>

            {/* email */}
            <CardContent key='email' className={classes.cardContent} >
              <StringField
                itemKey='email'
                name='email'
                label='email'
                text={item.email}
                valueOk={valueOkStates.email}
              />
            </CardContent>

            {/* phone */}
            <CardContent key='phone' className={classes.cardContent} >
              <StringField
                itemKey='phone'
                name='phone'
                label='phone'
                text={item.phone}
                valueOk={valueOkStates.phone}
              />
            </CardContent>

            {/* address */}
            <CardContent key='address' className={classes.cardContent} >
              <StringField
                itemKey='address'
                name='address'
                label='address'
                text={item.address}
                valueOk={valueOkStates.address}
              />
            </CardContent>

            {/* affiliation */}
            <CardContent key='affiliation' className={classes.cardContent} >
              <StringField
                itemKey='affiliation'
                name='affiliation'
                label='affiliation'
                text={item.affiliation}
                valueOk={valueOkStates.affiliation}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
ContactAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};