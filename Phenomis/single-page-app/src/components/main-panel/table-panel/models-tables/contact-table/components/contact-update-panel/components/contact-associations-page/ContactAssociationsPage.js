import React, { useRef, useEffect } from 'react';
import { makeCancelable } from '../../../../../../../../../utils'
import PropTypes from 'prop-types';
import ContactTostudiesTransferLists from './contactTostudies-transfer-lists/ContactTostudiesTransferLists'
import ContactToTrialsTransferLists from './contactToTrials-transfer-lists/ContactToTrialsTransferLists'
import ContactAssociationsMenuTabs from './ContactAssociationsMenuTabs'
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

export default function ContactAssociationsPage(props) {
  const classes = useStyles();
  const {
    hidden,
    item,
    contactTostudiesIdsToAdd,
    contactTostudiesIdsToRemove,
    contactToTrialsIdsToAdd,
    contactToTrialsIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnStudy_to_contactRow,
    handleClickOnTrial_to_contactRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('contactTostudies');

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
            <ContactAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* ContactTostudies Transfer Lists */}
          {(associationSelected === 'contactTostudies') && (
            <Grid item xs={12} sm={10} md={9}>
              <ContactTostudiesTransferLists
                item={item}
                idsToAdd={contactTostudiesIdsToAdd}
                idsToRemove={contactTostudiesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
              />
            </Grid>
          )}
          {/* ContactToTrials Transfer Lists */}
          {(associationSelected === 'contactToTrials') && (
            <Grid item xs={12} sm={10} md={9}>
              <ContactToTrialsTransferLists
                item={item}
                idsToAdd={contactToTrialsIdsToAdd}
                idsToRemove={contactToTrialsIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
                handleClickOnTrial_to_contactRow={handleClickOnTrial_to_contactRow}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
ContactAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  contactTostudiesIdsToAdd: PropTypes.array.isRequired,
  contactTostudiesIdsToRemove: PropTypes.array.isRequired,
  contactToTrialsIdsToAdd: PropTypes.array.isRequired,
  contactToTrialsIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnStudy_to_contactRow: PropTypes.func.isRequired,
  handleClickOnTrial_to_contactRow: PropTypes.func.isRequired,
};