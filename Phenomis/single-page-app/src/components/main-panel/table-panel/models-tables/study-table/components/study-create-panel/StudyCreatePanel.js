import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import StudyAttributesPage from './components/study-attributes-page/StudyAttributesPage'
import StudyAssociationsPage from './components/study-associations-page/StudyAssociationsPage'
import StudyTabsA from './components/StudyTabsA'
import StudyConfirmationDialog from './components/StudyConfirmationDialog'
import EnvironmentParameterDetailPanel from '../../../environmentParameter-table/components/environmentParameter-detail-panel/EnvironmentParameterDetailPanel'
import EventDetailPanel from '../../../event-table/components/event-detail-panel/EventDetailPanel'
import LocationDetailPanel from '../../../location-table/components/location-detail-panel/LocationDetailPanel'
import ObservationDetailPanel from '../../../observation-table/components/observation-detail-panel/ObservationDetailPanel'
import ObservationUnitDetailPanel from '../../../observationUnit-table/components/observationUnit-detail-panel/ObservationUnitDetailPanel'
import StudyToContactDetailPanel from '../../../study_to_contact-table/components/study_to_contact-detail-panel/Study_to_contactDetailPanel'
import StudyToSeasonDetailPanel from '../../../study_to_season-table/components/study_to_season-detail-panel/Study_to_seasonDetailPanel'
import TrialDetailPanel from '../../../trial-table/components/trial-detail-panel/TrialDetailPanel'
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  tabsA: {
    backgroundColor: "#ffffff",
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: -26+3,
    right: 10,
    margin: '0 auto',
  },
  notiErrorActionText: {
    color: '#eba0a0',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StudyCreatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    permissions,
    handleClose,
  } = props;

  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const [foreignKeys, setForeignKeys] = useState({});

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);

  const values = useRef(getInitialValues());
  const valuesOkRefs = useRef(getInitialValueOkStates());

  const [environmentParametersIdsToAddState, setEnvironmentParametersIdsToAddState] = useState([]);
  const environmentParametersIdsToAdd = useRef([]);
  const [eventsIdsToAddState, setEventsIdsToAddState] = useState([]);
  const eventsIdsToAdd = useRef([]);
  const [locationIdsToAddState, setLocationIdsToAddState] = useState([]);
  const locationIdsToAdd = useRef([]);
  const [observationsIdsToAddState, setObservationsIdsToAddState] = useState([]);
  const observationsIdsToAdd = useRef([]);
  const [observationUnitsIdsToAddState, setObservationUnitsIdsToAddState] = useState([]);
  const observationUnitsIdsToAdd = useRef([]);
  const [studyToContactsIdsToAddState, setStudyToContactsIdsToAddState] = useState([]);
  const studyToContactsIdsToAdd = useRef([]);
  const [studyToSeasonsIdsToAddState, setStudyToSeasonsIdsToAddState] = useState([]);
  const studyToSeasonsIdsToAdd = useRef([]);
  const [trialIdsToAddState, setTrialIdsToAddState] = useState([]);
  const trialIdsToAdd = useRef([]);

  const [environmentParameterDetailDialogOpen, setEnvironmentParameterDetailDialogOpen] = useState(false);
  const [environmentParameterDetailItem, setEnvironmentParameterDetailItem] = useState(undefined);
  const [eventDetailDialogOpen, setEventDetailDialogOpen] = useState(false);
  const [eventDetailItem, setEventDetailItem] = useState(undefined);
  const [locationDetailDialogOpen, setLocationDetailDialogOpen] = useState(false);
  const [locationDetailItem, setLocationDetailItem] = useState(undefined);
  const [observationDetailDialogOpen, setObservationDetailDialogOpen] = useState(false);
  const [observationDetailItem, setObservationDetailItem] = useState(undefined);
  const [observationUnitDetailDialogOpen, setObservationUnitDetailDialogOpen] = useState(false);
  const [observationUnitDetailItem, setObservationUnitDetailItem] = useState(undefined);
  const [study_to_contactDetailDialogOpen, setStudy_to_contactDetailDialogOpen] = useState(false);
  const [study_to_contactDetailItem, setStudy_to_contactDetailItem] = useState(undefined);
  const [study_to_seasonDetailDialogOpen, setStudy_to_seasonDetailDialogOpen] = useState(false);
  const [study_to_seasonDetailItem, setStudy_to_seasonDetailItem] = useState(undefined);
  const [trialDetailDialogOpen, setTrialDetailDialogOpen] = useState(false);
  const [trialDetailItem, setTrialDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isSaving = useRef(false);
  const isCanceling = useRef(false);
  const isClosing = useRef(false);
  const isDebouncingTabsChange = useRef(false);
  const currentTabValue = useRef(tabsValue);
  const lastTabValue = useRef(tabsValue);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

  const actionText = useRef(null);
  const action = (key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  );

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);
  
  useEffect(() => {
    if (environmentParameterDetailItem !== undefined) {
      setEnvironmentParameterDetailDialogOpen(true);
    }
  }, [environmentParameterDetailItem]);

  useEffect(() => {
    if (eventDetailItem !== undefined) {
      setEventDetailDialogOpen(true);
    }
  }, [eventDetailItem]);

  useEffect(() => {
    if (locationDetailItem !== undefined) {
      setLocationDetailDialogOpen(true);
    }
  }, [locationDetailItem]);

  useEffect(() => {
    if (observationDetailItem !== undefined) {
      setObservationDetailDialogOpen(true);
    }
  }, [observationDetailItem]);

  useEffect(() => {
    if (observationUnitDetailItem !== undefined) {
      setObservationUnitDetailDialogOpen(true);
    }
  }, [observationUnitDetailItem]);

  useEffect(() => {
    if (study_to_contactDetailItem !== undefined) {
      setStudy_to_contactDetailDialogOpen(true);
    }
  }, [study_to_contactDetailItem]);

  useEffect(() => {
    if (study_to_seasonDetailItem !== undefined) {
      setStudy_to_seasonDetailDialogOpen(true);
    }
  }, [study_to_seasonDetailItem]);

  useEffect(() => {
    if (trialDetailItem !== undefined) {
      setTrialDetailDialogOpen(true);
    }
  }, [trialDetailItem]);


  function getInitialValues() {
    let initialValues = {};
    
    initialValues.active = null;
    initialValues.commonCropName = null;
    initialValues.culturalPractices = null;
    initialValues.documentationURL = null;
    initialValues.endDate = null;
    initialValues.license = null;
    initialValues.observationUnitsDescription = null;
    initialValues.startDate = null;
    initialValues.studyDescription = null;
    initialValues.studyName = null;
    initialValues.studyType = null;
    initialValues.trialDbId = null;
    initialValues.studyDbId = null;
    initialValues.locationDbId = null;

    return initialValues;
  }

  function getInitialValueOkStates() {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
    */
    let initialValueOkStates = {};

    initialValueOkStates.active = 0;
    initialValueOkStates.commonCropName = 0;
    initialValueOkStates.culturalPractices = 0;
    initialValueOkStates.documentationURL = 0;
    initialValueOkStates.endDate = 0;
    initialValueOkStates.license = 0;
    initialValueOkStates.observationUnitsDescription = 0;
    initialValueOkStates.startDate = 0;
    initialValueOkStates.studyDescription = 0;
    initialValueOkStates.studyName = 0;
    initialValueOkStates.studyType = 0;
    initialValueOkStates.trialDbId = -2; //FK
    initialValueOkStates.studyDbId = 0;
    initialValueOkStates.locationDbId = -2; //FK

    return initialValueOkStates;
  }

  function areThereAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 1) {
        return true;
      }
    }
    return false;
  }

  function areThereNotAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === -1) {
        return true;
      }
    }
    return false;
  }

  function areThereIncompleteFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 0) {
        return true;
      }
    }
    return false;
  }

  function setAddLocation(variables) {
    if(locationIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addLocation = locationIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }
  function setAddTrial(variables) {
    if(trialIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addTrial = trialIdsToAdd.current[0];
    } else {
      //do nothing
    }
  }

  function doSave(event) {
    /*
      Variables setup
    */
    //variables
    let keys = Object.keys(values.current);
    let variables = {};

    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's
    delete variables.trialDbId;
    delete variables.locationDbId;

    //add: to_one's
    setAddLocation(variables);
    setAddTrial(variables);
    
    //add: to_many's
    variables.addEnvironmentParameters = environmentParametersIdsToAdd.current;
    variables.addEvents = eventsIdsToAdd.current;
    variables.addObservations = observationsIdsToAdd.current;
    variables.addObservationUnits = observationUnitsIdsToAdd.current;
    variables.addStudyToContacts = studyToContactsIdsToAdd.current;
    variables.addStudyToSeasons = studyToSeasonsIdsToAdd.current;

    /*
      API Request: createItem
    */
    let cancelableApiReq = makeCancelable(api.study.createItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(response => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response
        if (
          response.data &&
          response.data.data
        ) {
          //notify graphql errors
          if(response.data.errors) {
            actionText.current = t('modelPanels.gotIt', "Got it");
            enqueueSnackbar( t('modelPanels.errors.e3', "The GraphQL query returned a response with errors. Please contact your administrator."), {
              variant: 'error',
              preventDuplicate: false,
              persist: true,
              action,
            });
            console.log("Errors: ", response.data.errors);
          } else {

            //ok
            enqueueSnackbar( t('modelPanels.messages.msg6', "Record created successfully."), {
              variant: 'success',
              preventDuplicate: false,
              persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
            onClose(event, true, response.data.data.addStudy);
          }
          return;

        } else { //error: bad response on createItem()
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", t('modelPanels.errors.e2', "An error ocurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator."));
          
          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
          return;
        }
      })
      .catch(({isCanceled, ...err}) => { //error: on createItem()
        if(isCanceled) {
          return;
        } else {
          actionText.current = t('modelPanels.gotIt', "Got it");
          enqueueSnackbar( t('modelPanels.errors.e1', "An error occurred while trying to execute the GraphQL query. Please contact your administrator."), {
            variant: 'error',
            preventDuplicate: false,
            persist: true,
            action,
          });
          console.log("Error: ", err);

          //reset contention flags
          isSaving.current = false;
          isClosing.current = false;
          return;
        }
      });
  }

  const handleTabsChange = (event, newValue) => {
    //save last value
    lastTabValue.current = newValue;
    
    if(!isDebouncingTabsChange.current){
      //set last value
      currentTabValue.current = newValue;
      setTabsValue(newValue);

      //debounce
      isDebouncingTabsChange.current = true;
      let cancelableTimer = startTimerToDebounceTabsChange();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingTabsChange.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastTabValue.current !== currentTabValue.current){
            setTabsValue(lastTabValue.current);
            currentTabValue.current = lastTabValue.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };

  const handleSetValue = (value, status, key) => {
    values.current[key] = value;
    if(status !== valuesOkRefs.current[key]) {
      valuesOkRefs.current[key] = status;
      setValueOkStates({...valuesOkRefs.current});
    }
  }

  const handleSave = (event) => {
    if(areThereNotAcceptableFields()) {
      setConfirmationTitle( t('modelPanels.invalidFields', "Some fields are not valid") );
      setConfirmationText( t('modelPanels.invalidFieldsB', "To continue, please correct these fields.") );
      setConfirmationAcceptText("");
      setConfirmationRejectText( t('modelPanels.updateAccept', "I UNDERSTAND"));
      handleAccept.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
      return;
    }

    if(areThereIncompleteFields()) {
      setConfirmationTitle( t('modelPanels.incompleteFields', "Some fields are empty") );
      setConfirmationText( t('modelPanels.incompleteFieldsB', "Do you want to continue anyway?") );
      setConfirmationAcceptText( t('modelPanels.saveIncompleteAccept', "YES, SAVE") );
      setConfirmationRejectText( t('modelPanels.saveIncompleteReject', "DON'T SAVE YET") );
      handleAccept.current = () => {
        if(!isClosing.current) {
          isClosing.current = true;
          doSave(event);
          setConfirmationOpen(false);
        }
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
    } else {
      doSave(event);
    }
  }

  const handleCancel = (event) => {
    if(areThereAcceptableFields()) {
      setConfirmationTitle( t('modelPanels.cancelChanges', "The edited information has not been saved") );
      setConfirmationText( t('modelPanels.cancelChangesB', "Some fields have been edited, if you continue without save, the changes will be lost, you want to continue?") );
      setConfirmationAcceptText( t('modelPanels.cancelChangesAccept', "YES, EXIT") );
      setConfirmationRejectText( t('modelPanels.cancelChangesReject', "STAY") );
      handleAccept.current = () => {
        if(!isClosing.current) {
          isClosing.current = true;
          setConfirmationOpen(false);
          onClose(event, false, null);
        }
      }
      handleReject.current = () => {
        isCanceling.current = false;
        setConfirmationOpen(false);
      }
        setConfirmationOpen(true);
        return;
    } else {
      onClose(event, false, null);
    }
  }

  const onClose = (event, status, newItem) => {
    setOpen(false);
    handleClose(event, status, newItem);
  }

  const handleConfirmationAccept = (event) => {
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    handleReject.current();
  }
  
  const handleTransferToAdd = (associationKey, itemId) => {
    switch(associationKey) {
      case 'environmentParameters':
        if(environmentParametersIdsToAdd.current.indexOf(itemId) === -1) {
          environmentParametersIdsToAdd.current.push(itemId);
          setEnvironmentParametersIdsToAddState(environmentParametersIdsToAdd.current);
        }
        break;
      case 'events':
        if(eventsIdsToAdd.current.indexOf(itemId) === -1) {
          eventsIdsToAdd.current.push(itemId);
          setEventsIdsToAddState(eventsIdsToAdd.current);
        }
        break;
      case 'location':
        if(locationIdsToAdd.current.indexOf(itemId) === -1) {
          locationIdsToAdd.current = [];
          locationIdsToAdd.current.push(itemId);
          setLocationIdsToAddState(locationIdsToAdd.current);
          handleSetValue(itemId, 1, 'locationDbId');
          setForeignKeys({...foreignKeys, locationDbId: itemId});
        }
        break;
      case 'observations':
        if(observationsIdsToAdd.current.indexOf(itemId) === -1) {
          observationsIdsToAdd.current.push(itemId);
          setObservationsIdsToAddState(observationsIdsToAdd.current);
        }
        break;
      case 'observationUnits':
        if(observationUnitsIdsToAdd.current.indexOf(itemId) === -1) {
          observationUnitsIdsToAdd.current.push(itemId);
          setObservationUnitsIdsToAddState(observationUnitsIdsToAdd.current);
        }
        break;
      case 'studyToContacts':
        if(studyToContactsIdsToAdd.current.indexOf(itemId) === -1) {
          studyToContactsIdsToAdd.current.push(itemId);
          setStudyToContactsIdsToAddState(studyToContactsIdsToAdd.current);
        }
        break;
      case 'studyToSeasons':
        if(studyToSeasonsIdsToAdd.current.indexOf(itemId) === -1) {
          studyToSeasonsIdsToAdd.current.push(itemId);
          setStudyToSeasonsIdsToAddState(studyToSeasonsIdsToAdd.current);
        }
        break;
      case 'trial':
        if(trialIdsToAdd.current.indexOf(itemId) === -1) {
          trialIdsToAdd.current = [];
          trialIdsToAdd.current.push(itemId);
          setTrialIdsToAddState(trialIdsToAdd.current);
          handleSetValue(itemId, 1, 'trialDbId');
          setForeignKeys({...foreignKeys, trialDbId: itemId});
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'environmentParameters') {
      let iof = environmentParametersIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        environmentParametersIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'environmentParameters'
    if(associationKey === 'events') {
      let iof = eventsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        eventsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'events'
    if(associationKey === 'location') {
      if(locationIdsToAdd.current.length > 0) {
        locationIdsToAdd.current = [];
        setLocationIdsToAddState([]);
        handleSetValue(null, 0, 'locationDbId');
        setForeignKeys({...foreignKeys, locationDbId: null});
      }
      return;
    }//end: case 'location'
    if(associationKey === 'observations') {
      let iof = observationsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observations'
    if(associationKey === 'observationUnits') {
      let iof = observationUnitsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        observationUnitsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'observationUnits'
    if(associationKey === 'studyToContacts') {
      let iof = studyToContactsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        studyToContactsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'studyToContacts'
    if(associationKey === 'studyToSeasons') {
      let iof = studyToSeasonsIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        studyToSeasonsIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'studyToSeasons'
    if(associationKey === 'trial') {
      if(trialIdsToAdd.current.length > 0) {
        trialIdsToAdd.current = [];
        setTrialIdsToAddState([]);
        handleSetValue(null, 0, 'trialDbId');
        setForeignKeys({...foreignKeys, trialDbId: null});
      }
      return;
    }//end: case 'trial'
  }

  const handleClickOnEnvironmentParameterRow = (event, item) => {
    setEnvironmentParameterDetailItem(item);
  };

  const handleEnvironmentParameterDetailDialogClose = (event) => {
    delayedCloseEnvironmentParameterDetailPanel(event, 500);
  }

  const delayedCloseEnvironmentParameterDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEnvironmentParameterDetailDialogOpen(false);
        setEnvironmentParameterDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnEventRow = (event, item) => {
    setEventDetailItem(item);
  };

  const handleEventDetailDialogClose = (event) => {
    delayedCloseEventDetailPanel(event, 500);
  }

  const delayedCloseEventDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setEventDetailDialogOpen(false);
        setEventDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnLocationRow = (event, item) => {
    setLocationDetailItem(item);
  };

  const handleLocationDetailDialogClose = (event) => {
    delayedCloseLocationDetailPanel(event, 500);
  }

  const delayedCloseLocationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setLocationDetailDialogOpen(false);
        setLocationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnObservationRow = (event, item) => {
    setObservationDetailItem(item);
  };

  const handleObservationDetailDialogClose = (event) => {
    delayedCloseObservationDetailPanel(event, 500);
  }

  const delayedCloseObservationDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationDetailDialogOpen(false);
        setObservationDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnObservationUnitRow = (event, item) => {
    setObservationUnitDetailItem(item);
  };

  const handleObservationUnitDetailDialogClose = (event) => {
    delayedCloseObservationUnitDetailPanel(event, 500);
  }

  const delayedCloseObservationUnitDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setObservationUnitDetailDialogOpen(false);
        setObservationUnitDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnStudy_to_contactRow = (event, item) => {
    setStudy_to_contactDetailItem(item);
  };

  const handleStudy_to_contactDetailDialogClose = (event) => {
    delayedCloseStudy_to_contactDetailPanel(event, 500);
  }

  const delayedCloseStudy_to_contactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudy_to_contactDetailDialogOpen(false);
        setStudy_to_contactDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnStudy_to_seasonRow = (event, item) => {
    setStudy_to_seasonDetailItem(item);
  };

  const handleStudy_to_seasonDetailDialogClose = (event) => {
    delayedCloseStudy_to_seasonDetailPanel(event, 500);
  }

  const delayedCloseStudy_to_seasonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setStudy_to_seasonDetailDialogOpen(false);
        setStudy_to_seasonDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnTrialRow = (event, item) => {
    setTrialDetailItem(item);
  };

  const handleTrialDetailDialogClose = (event) => {
    delayedCloseTrialDetailPanel(event, 500);
  }

  const delayedCloseTrialDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTrialDetailDialogOpen(false);
        setTrialDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    
    <Dialog fullScreen open={open} TransitionComponent={Transition}
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Tooltip title={ t('modelPanels.cancel') }>
            <IconButton 
              edge="start" 
              color="inherit"
              onClick={(event) => {
                if(!isCanceling.current){
                  isCanceling.current = true;
                  handleCancel(event);
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            {t('modelPanels.new') + ' Study'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " study" }>
            <Fab 
              color="secondary" 
              className={classes.fabButton}
              onClick={(event) => {
                if(!isSaving.current){
                  isSaving.current = true;
                  handleSave(event);
                }
              }}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <StudyTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <StudyAttributesPage
              hidden={tabsValue !== 0}
              valueOkStates={valueOkStates}
              foreignKeys = {foreignKeys}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <StudyAssociationsPage
              hidden={tabsValue !== 1}
              environmentParametersIdsToAdd={environmentParametersIdsToAddState}
              eventsIdsToAdd={eventsIdsToAddState}
              locationIdsToAdd={locationIdsToAddState}
              observationsIdsToAdd={observationsIdsToAddState}
              observationUnitsIdsToAdd={observationUnitsIdsToAddState}
              studyToContactsIdsToAdd={studyToContactsIdsToAddState}
              studyToSeasonsIdsToAdd={studyToSeasonsIdsToAddState}
              trialIdsToAdd={trialIdsToAddState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleClickOnEnvironmentParameterRow={handleClickOnEnvironmentParameterRow}
              handleClickOnEventRow={handleClickOnEventRow}
              handleClickOnLocationRow={handleClickOnLocationRow}
              handleClickOnObservationRow={handleClickOnObservationRow}
              handleClickOnObservationUnitRow={handleClickOnObservationUnitRow}
              handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
              handleClickOnStudy_to_seasonRow={handleClickOnStudy_to_seasonRow}
              handleClickOnTrialRow={handleClickOnTrialRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <StudyConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: EnvironmentParameter Detail Panel */}
        {(environmentParameterDetailDialogOpen) && (
          <EnvironmentParameterDetailPanel
            permissions={permissions}
            item={environmentParameterDetailItem}
            dialog={true}
            handleClose={handleEnvironmentParameterDetailDialogClose}
          />
        )}
        {/* Dialog: Event Detail Panel */}
        {(eventDetailDialogOpen) && (
          <EventDetailPanel
            permissions={permissions}
            item={eventDetailItem}
            dialog={true}
            handleClose={handleEventDetailDialogClose}
          />
        )}
        {/* Dialog: Location Detail Panel */}
        {(locationDetailDialogOpen) && (
          <LocationDetailPanel
            permissions={permissions}
            item={locationDetailItem}
            dialog={true}
            handleClose={handleLocationDetailDialogClose}
          />
        )}
        {/* Dialog: Observation Detail Panel */}
        {(observationDetailDialogOpen) && (
          <ObservationDetailPanel
            permissions={permissions}
            item={observationDetailItem}
            dialog={true}
            handleClose={handleObservationDetailDialogClose}
          />
        )}
        {/* Dialog: ObservationUnit Detail Panel */}
        {(observationUnitDetailDialogOpen) && (
          <ObservationUnitDetailPanel
            permissions={permissions}
            item={observationUnitDetailItem}
            dialog={true}
            handleClose={handleObservationUnitDetailDialogClose}
          />
        )}
        {/* Dialog: Study_to_contact Detail Panel */}
        {(study_to_contactDetailDialogOpen) && (
          <StudyToContactDetailPanel
            permissions={permissions}
            item={study_to_contactDetailItem}
            dialog={true}
            handleClose={handleStudy_to_contactDetailDialogClose}
          />
        )}
        {/* Dialog: Study_to_season Detail Panel */}
        {(study_to_seasonDetailDialogOpen) && (
          <StudyToSeasonDetailPanel
            permissions={permissions}
            item={study_to_seasonDetailItem}
            dialog={true}
            handleClose={handleStudy_to_seasonDetailDialogClose}
          />
        )}
        {/* Dialog: Trial Detail Panel */}
        {(trialDetailDialogOpen) && (
          <TrialDetailPanel
            permissions={permissions}
            item={trialDetailItem}
            dialog={true}
            handleClose={handleTrialDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
StudyCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};