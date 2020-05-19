import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ContactAttributesPage from './components/contact-attributes-page/ContactAttributesPage'
import ContactAssociationsPage from './components/contact-associations-page/ContactAssociationsPage'
import ContactTabsA from './components/ContactTabsA'
import ContactConfirmationDialog from './components/ContactConfirmationDialog'
import StudyToContactDetailPanel from '../../../study_to_contact-table/components/study_to_contact-detail-panel/Study_to_contactDetailPanel'
import TrialToContactDetailPanel from '../../../trial_to_contact-table/components/trial_to_contact-detail-panel/Trial_to_contactDetailPanel'
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateWarning from '@material-ui/icons/ErrorOutline';
import { amber, red } from '@material-ui/core/colors';

const debounceTimeout = 700;
const appBarHeight = 64;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
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

export default function ContactUpdatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    permissions,
 
    item,
    handleClose,
  } = props;
  
  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const lastFetchTime = useRef(Date.now());
  
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);

  const values = useRef(getInitialValues());
  const valuesOkRefs = useRef(getInitialValueOkStates());
  const changedAssociations = useRef({});
  
  const [contactTostudiesIdsToAddState, setContactTostudiesIdsToAddState] = useState([]);
  const contactTostudiesIdsToAdd = useRef([]);
  const [contactTostudiesIdsToRemoveState, setContactTostudiesIdsToRemoveState] = useState([]);
  const contactTostudiesIdsToRemove = useRef([]);
  const [contactToTrialsIdsToAddState, setContactToTrialsIdsToAddState] = useState([]);
  const contactToTrialsIdsToAdd = useRef([]);
  const [contactToTrialsIdsToRemoveState, setContactToTrialsIdsToRemoveState] = useState([]);
  const contactToTrialsIdsToRemove = useRef([]);

  const [study_to_contactDetailDialogOpen, setStudy_to_contactDetailDialogOpen] = useState(false);
  const [study_to_contactDetailItem, setStudy_to_contactDetailItem] = useState(undefined);
  const [trial_to_contactDetailDialogOpen, setTrial_to_contactDetailDialogOpen] = useState(false);
  const [trial_to_contactDetailItem, setTrial_to_contactDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isSaving = useRef(false);
  const isCanceling = useRef(false);
  const isClosing = useRef(false);
  const isDebouncingTabsChange = useRef(false);
  const currentTabValue = useRef(tabsValue);
  const lastTabValue = useRef(tabsValue);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

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
    /*
     * Handle changes 
     */
    
    /*
     * Checks
     */
    if(!lastModelChanged) {
      return;
    }
    if(!lastChangeTimestamp || !lastFetchTime.current) {
      return;
    }
    let isNewChange = (lastFetchTime.current<lastChangeTimestamp);
    if(!isNewChange) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();
    
    /*
     * Case 1: 
     * This item was updated, either in his attributes or in his associations, or was deleted.
     * 
     * Conditions:
     * A: the item was modified.
     * B: the item was deleted.
     * 
     * Actions:
     * if A:
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged.contact&&
      lastModelChanged.contact[String(item.contactDbId)]) {

        //updated item
        if(lastModelChanged.contact[String(item.contactDbId)].op === "update"&&
            lastModelChanged.contact[String(item.contactDbId)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.contact[String(item.contactDbId)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.contactDbId]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (study_to_contactDetailItem !== undefined) {
      setStudy_to_contactDetailDialogOpen(true);
    }
  }, [study_to_contactDetailItem]);
  useEffect(() => {
    if (trial_to_contactDetailItem !== undefined) {
      setTrial_to_contactDetailDialogOpen(true);
    }
  }, [trial_to_contactDetailItem]);

  function getInitialValues() {
    let initialValues = {};

    initialValues.contactDbId = item.contactDbId;
    initialValues.email = item.email;
    initialValues.instituteName = item.instituteName;
    initialValues.name = item.name;
    initialValues.orcid = item.orcid;
    initialValues.type = item.type;

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

  initialValueOkStates.contactDbId = (item.contactDbId!==null ? 1 : 0);
  initialValueOkStates.email = (item.email!==null ? 1 : 0);
  initialValueOkStates.instituteName = (item.instituteName!==null ? 1 : 0);
  initialValueOkStates.name = (item.name!==null ? 1 : 0);
  initialValueOkStates.orcid = (item.orcid!==null ? 1 : 0);
  initialValueOkStates.type = (item.type!==null ? 1 : 0);

    return initialValueOkStates;
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

  function areThereChangedFields() {
    if(values.current.contactDbId !== item.contactDbId) { return true;}
    if(values.current.email !== item.email) { return true;}
    if(values.current.instituteName !== item.instituteName) { return true;}
    if(values.current.name !== item.name) { return true;}
    if(values.current.orcid !== item.orcid) { return true;}
    if(values.current.type !== item.type) { return true;}
    return false;
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

    //add & remove: to_one's

    //add & remove: to_many's
    //data to notify changes
    changedAssociations.current.ContactTostudies = {added: false, removed: false};
    
    if(contactTostudiesIdsToAdd.current.length>0) {
      variables.addContactTostudies = contactTostudiesIdsToAdd.current;
      
      changedAssociations.current.ContactTostudies.added = true;
      changedAssociations.current.ContactTostudies.idsAdded = contactTostudiesIdsToAdd.current;
    }
    if(contactTostudiesIdsToRemove.current.length>0) {
      variables.removeContactTostudies = contactTostudiesIdsToRemove.current;
      
      changedAssociations.current.ContactTostudies.removed = true;
      changedAssociations.current.ContactTostudies.idsRemoved = contactTostudiesIdsToRemove.current;
    }
    //data to notify changes
    changedAssociations.current.ContactToTrials = {added: false, removed: false};
    
    if(contactToTrialsIdsToAdd.current.length>0) {
      variables.addContactToTrials = contactToTrialsIdsToAdd.current;
      
      changedAssociations.current.ContactToTrials.added = true;
      changedAssociations.current.ContactToTrials.idsAdded = contactToTrialsIdsToAdd.current;
    }
    if(contactToTrialsIdsToRemove.current.length>0) {
      variables.removeContactToTrials = contactToTrialsIdsToRemove.current;
      
      changedAssociations.current.ContactToTrials.removed = true;
      changedAssociations.current.ContactToTrials.idsRemoved = contactToTrialsIdsToRemove.current;
    }

    /*
      API Request: updateItem
    */
    let cancelableApiReq = makeCancelable(api.contact.updateItem(graphqlServerUrl, variables));
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
            enqueueSnackbar( t('modelPanels.messages.msg5', "Record updated successfully."), {
              variant: 'success',
              preventDuplicate: false,
              persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            });
            onClose(event, true, response.data.data.updateContact);
          }
          return;

        } else { //error: bad response on updateItem()
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
      .catch(({isCanceled, ...err}) => { //error: on updateItem()
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
    if(areThereChangedFields()) {
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
    handleClose(event, status, item, newItem, changedAssociations.current);
  }

  const handleConfirmationAccept = (event) => {
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    handleReject.current();
  }

  const handleTransferToAdd = (associationKey, itemId) => {
    switch(associationKey) {
      case 'ContactTostudies':
        contactTostudiesIdsToAdd.current.push(itemId);
        setContactTostudiesIdsToAddState(contactTostudiesIdsToAdd.current);
        break;
      case 'ContactToTrials':
        contactToTrialsIdsToAdd.current.push(itemId);
        setContactToTrialsIdsToAddState(contactToTrialsIdsToAdd.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'ContactTostudies') {
      for(let i=0; i<contactTostudiesIdsToAdd.current.length; ++i)
      {
        if(contactTostudiesIdsToAdd.current[i] === itemId) {
          contactTostudiesIdsToAdd.current.splice(i, 1);
          setContactTostudiesIdsToAddState(contactTostudiesIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'ContactTostudies'
    if(associationKey === 'ContactToTrials') {
      for(let i=0; i<contactToTrialsIdsToAdd.current.length; ++i)
      {
        if(contactToTrialsIdsToAdd.current[i] === itemId) {
          contactToTrialsIdsToAdd.current.splice(i, 1);
          setContactToTrialsIdsToAddState(contactToTrialsIdsToAdd.current);
          return;
        }
      }
      return;
    }//end: case 'ContactToTrials'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
      case 'ContactTostudies':
        contactTostudiesIdsToRemove.current.push(itemId);
        setContactTostudiesIdsToRemoveState(contactTostudiesIdsToRemove.current);
        break;
      case 'ContactToTrials':
        contactToTrialsIdsToRemove.current.push(itemId);
        setContactToTrialsIdsToRemoveState(contactToTrialsIdsToRemove.current);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'ContactTostudies') {
      for(let i=0; i<contactTostudiesIdsToRemove.current.length; ++i)
      {
        if(contactTostudiesIdsToRemove.current[i] === itemId) {
          contactTostudiesIdsToRemove.current.splice(i, 1);
          setContactTostudiesIdsToRemoveState(contactTostudiesIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'ContactTostudies'
    if(associationKey === 'ContactToTrials') {
      for(let i=0; i<contactToTrialsIdsToRemove.current.length; ++i)
      {
        if(contactToTrialsIdsToRemove.current[i] === itemId) {
          contactToTrialsIdsToRemove.current.splice(i, 1);
          setContactToTrialsIdsToRemoveState(contactToTrialsIdsToRemove.current);
          return;
        }
      }
      return;
    }//end: case 'ContactToTrials'
  }

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

  const handleClickOnTrial_to_contactRow = (event, item) => {
    setTrial_to_contactDetailItem(item);
  };

  const handleTrial_to_contactDetailDialogClose = (event) => {
    delayedCloseTrial_to_contactDetailPanel(event, 500);
  }

  const delayedCloseTrial_to_contactDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTrial_to_contactDetailDialogOpen(false);
        setTrial_to_contactDetailItem(undefined);
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
            { t('modelPanels.editing') +  ": Contact | contactDbId: " + item.contactDbId}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " contact" }>
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
          )}

        </Toolbar>
      </AppBar>
      <Toolbar/>

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>

          <Grid item xs={12}>
            {/* Delete warning */}
            <Box
              width="100%"
              p={0}
              position="fixed"
              top={appBarHeight}
              left={0}
              zIndex="speedDial"
            >
              <Collapse in={deleted}>
                <Card className={classes.warningCard} square={true}>
                  <CardHeader
                    avatar={
                      <DeletedWarning style={{ color: red[700] }} />
                    }
                    title={ t('modelPanels.deletedWarning', "This item no longer exists. It was deleted elsewhere.") }
                    subheader="Deleted"
                  />
                </Card>
              </Collapse>
            </Box>
          </Grid>
  
          <Grid item xs={12}>
            {/* Update warning */}
            <Box
              width="100%"
              p={0}
              position="fixed"
              top={appBarHeight}
              left={0}
              zIndex="speedDial"
            >
              <Collapse in={updated}>
                <Card className={classes.warningCard} square={true}>
                  <CardHeader
                    avatar={
                      <UpdateWarning style={{ color: amber[700] }} />
                    }
                    title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                    subheader="Updated"
                  />
                </Card>
              </Collapse>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Collapse in={updated||deleted}>
              <Card className={classes.warningCard} square={true} elevation={0}>
              </Card>
            </Collapse>
          </Grid>
            
          {/* TabsA: Menú */}
          <Grid item xs={12}>
            <ContactTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <ContactAttributesPage
              hidden={tabsValue !== 0}
              item={item}
              valueOkStates={valueOkStates}
              handleSetValue={handleSetValue}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Associations Page [1] */}
            <ContactAssociationsPage
              hidden={tabsValue !== 1 || deleted}
              item={item}
              contactTostudiesIdsToAdd={contactTostudiesIdsToAddState}
              contactTostudiesIdsToRemove={contactTostudiesIdsToRemoveState}
              contactToTrialsIdsToAdd={contactToTrialsIdsToAddState}
              contactToTrialsIdsToRemove={contactToTrialsIdsToRemoveState}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
              handleTransferToRemove={handleTransferToRemove}
              handleUntransferFromRemove={handleUntransferFromRemove}
              handleClickOnStudy_to_contactRow={handleClickOnStudy_to_contactRow}
              handleClickOnTrial_to_contactRow={handleClickOnTrial_to_contactRow}
            />
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <ContactConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />

        {/* Dialog: Study_to_contact Detail Panel */}
        {(study_to_contactDetailDialogOpen) && (
          <StudyToContactDetailPanel
            permissions={permissions}
            item={study_to_contactDetailItem}
            dialog={true}
            handleClose={handleStudy_to_contactDetailDialogClose}
          />
        )}
        {/* Dialog: Trial_to_contact Detail Panel */}
        {(trial_to_contactDetailDialogOpen) && (
          <TrialToContactDetailPanel
            permissions={permissions}
            item={trial_to_contactDetailItem}
            dialog={true}
            handleClose={handleTrial_to_contactDetailDialogClose}
          />
        )}
      </div>

    </Dialog>
  );
}
ContactUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
