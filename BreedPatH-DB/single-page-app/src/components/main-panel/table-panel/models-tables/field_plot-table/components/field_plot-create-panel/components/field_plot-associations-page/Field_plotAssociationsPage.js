import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import FieldPlotTreatmentTransferLists from './field_plot_treatment-transfer-lists/Field_plot_treatmentTransferLists'
import GenotypeTransferLists from './genotype-transfer-lists/GenotypeTransferLists'
import MeasurementsTransferLists from './measurements-transfer-lists/MeasurementsTransferLists'
import FieldPlotAssociationsMenuTabs from './Field_plotAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function FieldPlotAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    field_plot_treatmentIdsToAdd,
    genotypeIdsToAdd,
    measurementsIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleClickOnField_plot_treatmentRow,
    handleClickOnGenotypeRow,
    handleClickOnMeasurementRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('field_plot_treatment');

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isDebouncingAssociationClick = useRef(false);
  const currentAssociationSelected = useRef(associationSelected);
  const lastAssociationSelected = useRef(associationSelected);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);

  const handleAssociationClick = (event, newValue) => {
    //save last value
    lastAssociationSelected.current = newValue;

    if(!isDebouncingAssociationClick.current){
      //set last value
      currentAssociationSelected.current = newValue;
      setAssociationSelected(newValue);

      //debounce
      isDebouncingAssociationClick.current = true;
      let cancelableTimer = startTimerToDebounceAssociationClick();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingAssociationClick.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastAssociationSelected.current !== currentAssociationSelected.current){
            setAssociationSelected(lastAssociationSelected.current);
            currentAssociationSelected.current = lastAssociationSelected.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };
  
  const startTimerToDebounceAssociationClick = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='center'
          alignItems='flex-start'
          alignContent='flex-start'
          spacing={0}
        > 

          {/* Menu Tabs: Associations */}
          <Grid item xs={12} sm={10} md={9} className={classes.menu}>
            <FieldPlotAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Field_plot_treatment Transfer Lists */}
          {(associationSelected === 'field_plot_treatment') && (
            <Grid item xs={12} sm={10} md={9}>
              <FieldPlotTreatmentTransferLists
                idsToAdd={field_plot_treatmentIdsToAdd}
                handleClickOnField_plot_treatmentRow={handleClickOnField_plot_treatmentRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Genotype Transfer Lists */}
          {(associationSelected === 'genotype') && (
            <Grid item xs={12} sm={10} md={9}>
              <GenotypeTransferLists
                idsToAdd={genotypeIdsToAdd}
                handleClickOnGenotypeRow={handleClickOnGenotypeRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}
          {/* Measurements Transfer Lists */}
          {(associationSelected === 'measurements') && (
            <Grid item xs={12} sm={10} md={9}>
              <MeasurementsTransferLists
                idsToAdd={measurementsIdsToAdd}
                handleClickOnMeasurementRow={handleClickOnMeasurementRow}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
FieldPlotAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  field_plot_treatmentIdsToAdd: PropTypes.array.isRequired,
  genotypeIdsToAdd: PropTypes.array.isRequired,
  measurementsIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleClickOnField_plot_treatmentRow: PropTypes.func.isRequired,
  handleClickOnGenotypeRow: PropTypes.func.isRequired,
  handleClickOnMeasurementRow: PropTypes.func.isRequired,
};