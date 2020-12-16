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

import DateField from './components/DateField'

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

export default function GermplasmAttributesFormView(props) {
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
    <div id='GermplasmAttributesFormView-div-root' className={classes.root}>
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
                    { t('modelPanels.model') + ': Germplasm' }
                </Typography>
              }
              subheader={getItemsOk()+' / 22 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* germplasmDbId*/}
            <CardContent key='germplasmDbId' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">germplasmDbId:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.germplasmDbId}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>


            {/* accessionNumber */}
            <CardContent key='accessionNumber' className={classes.cardContent} >
              <StringField
                itemKey='accessionNumber'
                name='accessionNumber'
                label='accessionNumber'
                text={item.accessionNumber}
                valueOk={valueOkStates.accessionNumber}
                valueAjv={valueAjvStates.accessionNumber}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* acquisitionDate */}
            <CardContent key='acquisitionDate' className={classes.cardContent} >
              <DateField
                itemKey='acquisitionDate'
                name='acquisitionDate'
                label='acquisitionDate'
                text={item.acquisitionDate}
                valueOk={valueOkStates.acquisitionDate}
                valueAjv={valueAjvStates.acquisitionDate}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* commonCropName */}
            <CardContent key='commonCropName' className={classes.cardContent} >
              <StringField
                itemKey='commonCropName'
                name='commonCropName'
                label='commonCropName'
                text={item.commonCropName}
                valueOk={valueOkStates.commonCropName}
                valueAjv={valueAjvStates.commonCropName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* countryOfOriginCode */}
            <CardContent key='countryOfOriginCode' className={classes.cardContent} >
              <StringField
                itemKey='countryOfOriginCode'
                name='countryOfOriginCode'
                label='countryOfOriginCode'
                text={item.countryOfOriginCode}
                valueOk={valueOkStates.countryOfOriginCode}
                valueAjv={valueAjvStates.countryOfOriginCode}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* defaultDisplayName */}
            <CardContent key='defaultDisplayName' className={classes.cardContent} >
              <StringField
                itemKey='defaultDisplayName'
                name='defaultDisplayName'
                label='defaultDisplayName'
                text={item.defaultDisplayName}
                valueOk={valueOkStates.defaultDisplayName}
                valueAjv={valueAjvStates.defaultDisplayName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* documentationURL */}
            <CardContent key='documentationURL' className={classes.cardContent} >
              <StringField
                itemKey='documentationURL'
                name='documentationURL'
                label='documentationURL'
                text={item.documentationURL}
                valueOk={valueOkStates.documentationURL}
                valueAjv={valueAjvStates.documentationURL}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmGenus */}
            <CardContent key='germplasmGenus' className={classes.cardContent} >
              <StringField
                itemKey='germplasmGenus'
                name='germplasmGenus'
                label='germplasmGenus'
                text={item.germplasmGenus}
                valueOk={valueOkStates.germplasmGenus}
                valueAjv={valueAjvStates.germplasmGenus}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmName */}
            <CardContent key='germplasmName' className={classes.cardContent} >
              <StringField
                itemKey='germplasmName'
                name='germplasmName'
                label='germplasmName'
                text={item.germplasmName}
                valueOk={valueOkStates.germplasmName}
                valueAjv={valueAjvStates.germplasmName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmPUI */}
            <CardContent key='germplasmPUI' className={classes.cardContent} >
              <StringField
                itemKey='germplasmPUI'
                name='germplasmPUI'
                label='germplasmPUI'
                text={item.germplasmPUI}
                valueOk={valueOkStates.germplasmPUI}
                valueAjv={valueAjvStates.germplasmPUI}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmPreprocessing */}
            <CardContent key='germplasmPreprocessing' className={classes.cardContent} >
              <StringField
                itemKey='germplasmPreprocessing'
                name='germplasmPreprocessing'
                label='germplasmPreprocessing'
                text={item.germplasmPreprocessing}
                valueOk={valueOkStates.germplasmPreprocessing}
                valueAjv={valueAjvStates.germplasmPreprocessing}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmSpecies */}
            <CardContent key='germplasmSpecies' className={classes.cardContent} >
              <StringField
                itemKey='germplasmSpecies'
                name='germplasmSpecies'
                label='germplasmSpecies'
                text={item.germplasmSpecies}
                valueOk={valueOkStates.germplasmSpecies}
                valueAjv={valueAjvStates.germplasmSpecies}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* germplasmSubtaxa */}
            <CardContent key='germplasmSubtaxa' className={classes.cardContent} >
              <StringField
                itemKey='germplasmSubtaxa'
                name='germplasmSubtaxa'
                label='germplasmSubtaxa'
                text={item.germplasmSubtaxa}
                valueOk={valueOkStates.germplasmSubtaxa}
                valueAjv={valueAjvStates.germplasmSubtaxa}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* instituteCode */}
            <CardContent key='instituteCode' className={classes.cardContent} >
              <StringField
                itemKey='instituteCode'
                name='instituteCode'
                label='instituteCode'
                text={item.instituteCode}
                valueOk={valueOkStates.instituteCode}
                valueAjv={valueAjvStates.instituteCode}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* instituteName */}
            <CardContent key='instituteName' className={classes.cardContent} >
              <StringField
                itemKey='instituteName'
                name='instituteName'
                label='instituteName'
                text={item.instituteName}
                valueOk={valueOkStates.instituteName}
                valueAjv={valueAjvStates.instituteName}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* pedigree */}
            <CardContent key='pedigree' className={classes.cardContent} >
              <StringField
                itemKey='pedigree'
                name='pedigree'
                label='pedigree'
                text={item.pedigree}
                valueOk={valueOkStates.pedigree}
                valueAjv={valueAjvStates.pedigree}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* seedSource */}
            <CardContent key='seedSource' className={classes.cardContent} >
              <StringField
                itemKey='seedSource'
                name='seedSource'
                label='seedSource'
                text={item.seedSource}
                valueOk={valueOkStates.seedSource}
                valueAjv={valueAjvStates.seedSource}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* seedSourceDescription */}
            <CardContent key='seedSourceDescription' className={classes.cardContent} >
              <StringField
                itemKey='seedSourceDescription'
                name='seedSourceDescription'
                label='seedSourceDescription'
                text={item.seedSourceDescription}
                valueOk={valueOkStates.seedSourceDescription}
                valueAjv={valueAjvStates.seedSourceDescription}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* speciesAuthority */}
            <CardContent key='speciesAuthority' className={classes.cardContent} >
              <StringField
                itemKey='speciesAuthority'
                name='speciesAuthority'
                label='speciesAuthority'
                text={item.speciesAuthority}
                valueOk={valueOkStates.speciesAuthority}
                valueAjv={valueAjvStates.speciesAuthority}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* subtaxaAuthority */}
            <CardContent key='subtaxaAuthority' className={classes.cardContent} >
              <StringField
                itemKey='subtaxaAuthority'
                name='subtaxaAuthority'
                label='subtaxaAuthority'
                text={item.subtaxaAuthority}
                valueOk={valueOkStates.subtaxaAuthority}
                valueAjv={valueAjvStates.subtaxaAuthority}
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
                valueAjv={valueAjvStates.xref}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* biologicalStatusOfAccessionCode */}
            <CardContent key='biologicalStatusOfAccessionCode' className={classes.cardContent} >
              <StringField
                itemKey='biologicalStatusOfAccessionCode'
                name='biologicalStatusOfAccessionCode'
                label='biologicalStatusOfAccessionCode'
                text={item.biologicalStatusOfAccessionCode}
                valueOk={valueOkStates.biologicalStatusOfAccessionCode}
                valueAjv={valueAjvStates.biologicalStatusOfAccessionCode}
                handleSetValue={handleSetValue}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
GermplasmAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};
