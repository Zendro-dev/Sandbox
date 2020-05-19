import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
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

export default function TraitAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, 
          valueOkStates,
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
                    { t('modelPanels.model') + ': Trait' }
                </Typography>
              }
              subheader={getItemsOk()+' / 10 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}

            

            {/* attribute */}
            <CardContent key='attribute' className={classes.cardContent} >
              <StringField
                itemKey='attribute'
                name='attribute'
                label='attribute'
                text={item.attribute}
                valueOk={valueOkStates.attribute}
                autoFocus={true}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* entity */}
            <CardContent key='entity' className={classes.cardContent} >
              <StringField
                itemKey='entity'
                name='entity'
                label='entity'
                text={item.entity}
                valueOk={valueOkStates.entity}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* mainAbbreviation */}
            <CardContent key='mainAbbreviation' className={classes.cardContent} >
              <StringField
                itemKey='mainAbbreviation'
                name='mainAbbreviation'
                label='mainAbbreviation'
                text={item.mainAbbreviation}
                valueOk={valueOkStates.mainAbbreviation}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* status */}
            <CardContent key='status' className={classes.cardContent} >
              <StringField
                itemKey='status'
                name='status'
                label='status'
                text={item.status}
                valueOk={valueOkStates.status}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitClass */}
            <CardContent key='traitClass' className={classes.cardContent} >
              <StringField
                itemKey='traitClass'
                name='traitClass'
                label='traitClass'
                text={item.traitClass}
                valueOk={valueOkStates.traitClass}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitDescription */}
            <CardContent key='traitDescription' className={classes.cardContent} >
              <StringField
                itemKey='traitDescription'
                name='traitDescription'
                label='traitDescription'
                text={item.traitDescription}
                valueOk={valueOkStates.traitDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitName */}
            <CardContent key='traitName' className={classes.cardContent} >
              <StringField
                itemKey='traitName'
                name='traitName'
                label='traitName'
                text={item.traitName}
                valueOk={valueOkStates.traitName}
                handleSetValue={handleSetValue}
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
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* traitDbId */}
            <CardContent key='traitDbId' className={classes.cardContent} >
              <StringField
                itemKey='traitDbId'
                name='traitDbId'
                label='traitDbId'
                text={item.traitDbId}
                valueOk={valueOkStates.traitDbId}
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
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};

