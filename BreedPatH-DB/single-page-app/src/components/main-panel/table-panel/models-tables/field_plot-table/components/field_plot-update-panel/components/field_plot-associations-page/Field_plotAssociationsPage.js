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
    minHeight: 1200,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function FieldPlotAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    field_plot_treatmentIdsToAdd,
    genotypeIdsToAdd,
    measurementsIdsToAdd,
    measurementsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
          <Grid item xs={12} sm={11} className={classes.menu}>
            <FieldPlotAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Field_plot_treatment Transfer Lists */}
          {(associationSelected === 'field_plot_treatment') && (
            <Grid item xs={12} sm={11}>
              <FieldPlotTreatmentTransferLists
                item={item}
                idsToAdd={field_plot_treatmentIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnField_plot_treatmentRow={handleClickOnField_plot_treatmentRow}
              />
            </Grid>
          )}
          {/* Genotype Transfer Lists */}
          {(associationSelected === 'genotype') && (
            <Grid item xs={12} sm={11}>
              <GenotypeTransferLists
                item={item}
                idsToAdd={genotypeIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleClickOnGenotypeRow={handleClickOnGenotypeRow}
              />
            </Grid>
          )}
          {/* Measurements Transfer Lists */}
          {(associationSelected === 'measurements') && (
            <Grid item xs={12} sm={11}>
              <MeasurementsTransferLists
                item={item}
                idsToAdd={measurementsIdsToAdd}
                idsToRemove={measurementsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnMeasurementRow={handleClickOnMeasurementRow}
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
  item: PropTypes.object.isRequired,
  field_plot_treatmentIdsToAdd: PropTypes.array.isRequired,
  genotypeIdsToAdd: PropTypes.array.isRequired,
  measurementsIdsToAdd: PropTypes.array.isRequired,
  measurementsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnField_plot_treatmentRow: PropTypes.func.isRequired,
  handleClickOnGenotypeRow: PropTypes.func.isRequired,
  handleClickOnMeasurementRow: PropTypes.func.isRequired,
};