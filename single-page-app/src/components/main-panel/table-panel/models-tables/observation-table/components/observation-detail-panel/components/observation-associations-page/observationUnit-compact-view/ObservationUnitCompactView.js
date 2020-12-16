
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../../../../utils'
import ObservationUnitCompactViewToolbar from './components/ObservationUnitCompactViewToolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Key from '@material-ui/icons/VpnKey';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minWidth: 200,
  },
  card: {
    margin: theme.spacing(1),
    height: 'auto',
    maxHeight: `calc(64vh + 52px)`,
    overflow: 'auto',
    position: "relative",
  },
  listBox: {
    height: 'auto',
    minHeight: 82,
    maxHeight: '33vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  noDataBox: {
    width: "100%",
    height: 'auto',
    minHeight: 82,
    maxHeight: '33vh',
  },
  loadingBox: {
    width: "100%",
    height: '100%',
    maxHeight: '33vh',
  },
  row: {
    maxHeight: 70,
  },
}));

export default function ObservationUnitCompactView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    handleClickOnObservationUnitRow,
  } = props;

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const cancelablePromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);
  const lastFetchTime = useRef(null);

  const lref = useRef(null);
  const [lh, setLh] = useState(82);

  //snackbar
  const variant = useRef('info');
  const errors = useRef([]);
  const content = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errors.current}
    variant={variant.current} />
  ));
  const actionText = useRef(t('modelPanels.gotIt', "Got it"));
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));


   /**
    * Callbacks:
    *  showMessage
    *  clearRequestGetData
    *  getData
    */

  /**
   * showMessage
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessage = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variant.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? action.current : undefined,
      content: withDetail ? content.current : undefined,
    });
  },[enqueueSnackbar]);




  const clearRequestGetData = useCallback(() => {
          
    setItems([]);
    isOnApiRequestRef.current = false;
    setIsOnApiRequest(false);
  },[]);


  /**
   * getData
   * 
   * Get @items from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items retreived.
   * 
   */
  const getData = useCallback(async () => {
    updateHeights();
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];


    /*
      API Request: api.observation.getObservationUnit
    */
    let variables = null;
    /*
      API Request: api.observation.getObservationUnit
    */
    let api = await loadApi("observation");
    let cancelableApiReq = makeCancelable(api.observation.getObservationUnit(
      graphqlServerUrl, 
      item.observationDbId,
      search,
      variables,
    ));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{association: 'observationUnit', method: 'getData()', request: 'api.observation.getObservationUnit'}];
            newError.path=['detail', `observationDbId:${item.observationDbId}`, 'observationUnit'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{association: 'observationUnit', method: 'getData()', request: 'api.observation.getObservationUnit'}];
          newError.path=['detail', `observationDbId:${item.observationDbId}`, 'observationUnit'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
  
          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

 
        //get item
        let it = response.value;
        //ok
        setItems((it) ? [it] : []);

        //ends request
        isOnApiRequestRef.current = false;
        setIsOnApiRequest(false);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.observation.getObservationUnit
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{association: 'observationUnit', method: 'getData()', request: 'api.observation.getObservationUnit'}];
          newError.path=['detail', `observationDbId:${item.observationDbId}`, 'observationUnit'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });

  }, [graphqlServerUrl, showMessage, clearRequestGetData, t, dataTrigger, item.observationDbId, search]);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);
  
  useEffect(() => {
    if (!isOnApiRequestRef.current) {
      getData();
    } 
    else { 
      isPendingApiRequestRef.current = true; 
    }
  }, [getData]);

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
     * The relation 'observationUnit' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'observationUnit',
     * but this action happened on the peer relation, identified by 'observation_observationUnitDbId'.
     * 
     * Conditions:
     * A: the current item 'internalId' attribute is in the removedIds of the updated 'observationUnit'.
     * B: the current item 'internalId' attribute is in the addedIds of the updated 'observationUnit'.
     * 
     * Actions:
     * if A:
     * - reload table.
     * - return
     * 
     * else if B:
     * - reload table.
     * - return
     */
    if(lastModelChanged.observationUnit) {
      let oens = Object.entries(lastModelChanged.observationUnit);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.observation_observationUnitDbId) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.observation_observationUnitDbId.removed) {
              let idsRemoved = entry[1].changedAssociations.observation_observationUnitDbId.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.observationDbId);
                if(iof !== -1) {

                  //strict contention
                  if (!isOnApiRequestRef.current) {
                    //reload
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  }
                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.observation_observationUnitDbId.added) {
              let idsAdded = entry[1].changedAssociations.observation_observationUnitDbId.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.observationDbId);
                if(iof !== -1) {
                  //strict contention
                  if (!isOnApiRequestRef.current) {
                    //reload
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  }
                  return;
                }
              }
            }//end: case B
        }
      })
    }//end: Case 1

    /*
     * Case 2: 
     * The attributes of some 'observationUnit' were modified or the item was deleted.
     * 
     * Conditions:
     * A: the item was modified and is currently displayed in the list.
     * B: the item was deleted and is currently displayed the  list.
     * 
     * Actions:
     * if A:
     * - update the list with the new item.
     * - return
     * 
     * if B:
     * - reload table.
     * - return
     */
    if(lastModelChanged.observationUnit) {

      let oens = Object.entries(lastModelChanged.observationUnit);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.observationUnitDbId;
          
          //lookup item on table
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.observationUnitDbId===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {

          //strict contention
          if (!isOnApiRequestRef.current) {
            //reload
            setDataTrigger(prevDataTrigger => !prevDataTrigger);
          }
          return;
        }
      });
    }//end: Case 2
  }, [lastModelChanged, lastChangeTimestamp, items, item.observationDbId]);

  useEffect(() => {
    //return if this flag is set
    if(isGettingFirstDataRef.current) { 
      isGettingFirstDataRef.current = false; 
      return; 
    } 
    else {
      //get data from the new page
      pageRef.current = page;
      if (!isOnApiRequestRef.current) {
        setDataTrigger(prevDataTrigger => !prevDataTrigger); 
      } 
      else { 
        isPendingApiRequestRef.current = true; 
      }
    }
  }, [page]);


  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequestRef.current) {
      isPendingApiRequestRef.current = false;
      //reload
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    }
    updateHeights();
  }, [isOnApiRequest]);

  useEffect(() => {
    if(Array.isArray(items) && items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }
    lastFetchTime.current = Date.now();
  }, [items]);

  /**
   * Utils
   */

  function updateHeights() {
    if(lref.current) {
      let h =lref.current.clientHeight;
      setLh(h);
    }
  }


  /**
   * Handlers
   */

  /*
   * Search handlers
   */
  const handleSearchEnter = text => {
    if(text !== search)
    {
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }

      setSearch(text);
    }
  };

  /*
   * Pagination handlers
   */




  const handleReloadClick = (event) => {
    //check strict contention
    if(isOnApiRequestRef.current) { return; }
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  /**
   * Items handlers
   */
  const handleRowClicked = (event, item) => {
    handleClickOnObservationUnitRow(event, item);
  }

  return (
    <div className={classes.root}>
      <Grid container>
        {/*
          * Compact List
          */}
        <Grid item xs={12} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <ObservationUnitCompactViewToolbar 
                title={'ObservationUnit'}
                search={search}
                onSearchEnter={handleSearchEnter}
                onReloadClick={handleReloadClick}
              />

              {/* Case: no data */}
              {(!isOnApiRequest && (!areItemsReady)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='ObservationUnitCompactView-div-noDataA'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                          <Grid item>
                            <Typography variant="body1" >{ t('modelPanels.noData') }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Case: data ready */}
              {(!isOnApiRequest && areItemsReady) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lref}>
                    <List id='ObservationUnitCompactView-list-listA'
                    dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.observationUnitDbId;
                        let label = it.observationUnitName;
                        let sublabel = undefined;
       
                        return (
                          <ListItem 
                            id={'ObservationUnitCompactView-listA-listItem-'+it.observationUnitDbId}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'observationUnit' }>
                                <Avatar>{"observationUnit".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* observationDbId*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'observationUnitDbId' }>
                                        <Typography
                                        id={'ObservationUnitCompactView-listA-listItem-id-'+it.observationUnitDbId}
                                        variant="body1" display="block" noWrap={true}>{it.observationUnitDbId}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                                        <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'observationUnitName' }>
                                      <Typography
                                      id={'ObservationUnitCompactView-listA-listItem-label-'+it.observationUnitDbId}
                                      component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ '' }>
                                      <Typography
                                      id={'ObservationUnitCompactView-listA-listItem-sublabel-'+it.observationUnitDbId}
                                      component="span" variant="body2" display="inline" color='textSecondary'>{" — "+sublabel} </Typography>
                                    </Tooltip>
                                  )}
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                </Fade>
              )}
              {/* Case: loading */}
              {(isOnApiRequest) && (
                /* Progress */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div>
                    <Grid container>
                      <Grid item xs={12}>
                        <Box height={lh}>
                          <Grid container className={classes.loadingBox} justify="center" alignItems="center">
                            <Grid item>
                              <CircularProgress color='primary' disableShrink />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
ObservationUnitCompactView.propTypes = {
  item: PropTypes.object.isRequired,
  handleClickOnObservationUnitRow: PropTypes.func,
};