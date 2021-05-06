import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import api from '../../../../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../../../../utils'
import GrupoEnfoqueCompactViewToolbar from './components/Grupo_enfoqueCompactViewToolbar';
import GrupoEnfoqueCompactViewCursorPagination from './components/Grupo_enfoqueCompactViewCursorPagination';
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

export default function GrupoEnfoqueCompactView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    handleClickOnGrupo_enfoqueRow,
  } = props;

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [isCountReady, setIsCountReady] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const lastFetchTime = useRef(null);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageInfo = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const isForwardPagination = useRef(true);
  const isCursorPaginating = useRef(false);
  const includeCursor = useRef(false);

  const cancelablePromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

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

  /**
   * getData
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retreived.
   * 
   */
  const getData = useCallback(() => {
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    /*
      API Request: readOneSitio
    */
    let label = 'grupo_id';
    let sublabel = 'fecha';
    let variables = {
      pagination: {
        after: isForwardPagination.current ? pageInfo.current.endCursor : null,
        before: !isForwardPagination.current ? pageInfo.current.startCursor : null,
        first: isForwardPagination.current ? rowsPerPage : null,
        last: !isForwardPagination.current ? rowsPerPage : null,
        includeCursor: includeCursor.current,
      }
    };
    let cancelableApiReq = makeCancelable(api.sitio.getGrupo_enfoqueConnection(
      graphqlServerUrl, 
      item.sitio_id,
      label,
      sublabel,
      search,
      variables
    ));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(!response.data ||!response.data.data) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{association: 'grupo_enfoque', query: 'readOneSitio', method: 'getData()', request: 'api.sitio.getGrupo_enfoqueConnection'}];
          newError.path=['detail', `sitio_id:${item.sitio_id}`, 'grupo_enfoque'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: readOneSitio
        let readOneSitio = response.data.data.readOneSitio;
        if(readOneSitio === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneSitio ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{association: 'grupo_enfoque', query: 'readOneSitio', method: 'getData()', request: 'api.sitio.getGrupo_enfoqueConnection'}];
          newError.path=['detail', `sitio_id:${item.sitio_id}`, 'grupo_enfoque'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: readOneSitio type
        if(typeof readOneSitio !== 'object'
        || !Number.isInteger(readOneSitio.countFilteredGrupo_enfoque)
        || typeof readOneSitio.grupo_enfoqueConnection !== 'object'
        || readOneSitio.grupo_enfoqueConnection === null
        || !Array.isArray(readOneSitio.grupo_enfoqueConnection.edges)
        || typeof readOneSitio.grupo_enfoqueConnection.pageInfo !== 'object'
        || readOneSitio.grupo_enfoqueConnection.pageInfo === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneSitio ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{association: 'grupo_enfoque', query: 'readOneSitio', method: 'getData()', request: 'api.sitio.getGrupo_enfoqueConnection'}];
          newError.path=['detail', `sitio_id:${item.sitio_id}`, 'grupo_enfoque'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        //get items
        let newCount = readOneSitio.countFilteredGrupo_enfoque;
        let its = readOneSitio.grupo_enfoqueConnection.edges.map(o => o.node);
        let pi = readOneSitio.grupo_enfoqueConnection.pageInfo;

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'readOneSitio ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{association: 'grupo_enfoque', query: 'readOneSitio', method: 'getData()', request: 'api.sitio.getGrupo_enfoqueConnection'}];
          newError.path=['detail', `sitio_id:${item.sitio_id}`, 'grupo_enfoque'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
        }

        /*
          Check: empty page
        */
        if( its.length === 0 && pi&&pi.hasPreviousPage ) 
        {
          //configure
          isOnApiRequestRef.current = false;
          isCursorPaginating.current = false;
          isForwardPagination.current = false;
          setIsOnApiRequest(false);
          
          //reload
          setDataTrigger(prevDataTrigger => !prevDataTrigger);
          return;
        }//else

        //update pageInfo
        pageInfo.current = pi;
        setHasPreviousPage(pageInfo.current.hasPreviousPage);
        setHasNextPage(pageInfo.current.hasNextPage);

        //ok
        setCount(newCount);
        setItems([...its]);

        //ends request
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        includeCursor.current = false;
        setIsOnApiRequest(false);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.sitio.getGrupo_enfoqueConnection
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{association: 'grupo_enfoque', query: 'readOneSitio', method: 'getData()', request: 'api.sitio.getGrupo_enfoqueConnection'}];
          newError.path=['detail', `sitio_id:${item.sitio_id}`, 'grupo_enfoque'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });

  }, [graphqlServerUrl, showMessage, t, dataTrigger, item.sitio_id, search, rowsPerPage]);

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
     * The relation 'grupo_enfoque' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'grupo_enfoque',
     * but this action happened on the peer relation, identified by 'grupo_enfoque_sitio_id'.
     * 
     * Conditions:
     * A: the current item 'internalId' attribute is in the removedIds of the updated 'grupo_enfoque'.
     * B: the current item 'internalId' attribute is in the addedIds of the updated 'grupo_enfoque'.
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
    if(lastModelChanged.grupo_enfoque) {
      let oens = Object.entries(lastModelChanged.grupo_enfoque);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.grupo_enfoque_sitio_id) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.grupo_enfoque_sitio_id.removed) {
              let idsRemoved = entry[1].changedAssociations.grupo_enfoque_sitio_id.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.sitio_id);
                if(iof !== -1) {
                  //reload
                  updateHeights();
                  //strict contention
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure
                    isForwardPagination.current = true;
                    pageInfo.current.endCursor = pageInfo.current.startCursor;
                    includeCursor.current = true;
                    //reload
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  }
                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.grupo_enfoque_sitio_id.added) {
              let idsAdded = entry[1].changedAssociations.grupo_enfoque_sitio_id.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.sitio_id);
                if(iof !== -1) {
                  //reload
                  updateHeights();
                  //strict contention
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure
                    isForwardPagination.current = true;
                    pageInfo.current.endCursor = pageInfo.current.startCursor;
                    includeCursor.current = true;
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
     * The attributes of some 'grupo_enfoque' were modified or the item was deleted.
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
    if(lastModelChanged.grupo_enfoque) {

      let oens = Object.entries(lastModelChanged.grupo_enfoque);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.grupo_id;
          
          //lookup item on table
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.grupo_id===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.grupo_id;

          //lookup item on table
          let iofA = items.findIndex((item) => item.grupo_id===idRemoved);
          if(iofA !== -1) {
            //reload
            updateHeights();
            //strict contention
            if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
              //configure
              isForwardPagination.current = true;
              pageInfo.current.endCursor = pageInfo.current.startCursor;
              includeCursor.current = true;
              //reload
              setDataTrigger(prevDataTrigger => !prevDataTrigger);
            }

            return;
          }
        }
      });
    }//end: Case 2
  }, [lastModelChanged, lastChangeTimestamp, items, item.sitio_id]);

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
      //configure
      isForwardPagination.current = true;
      pageInfo.current.endCursor = pageInfo.current.startCursor;
      includeCursor.current = true;
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

  useEffect(() => {
    if(count === 0) {
      setIsCountReady(false);

    } else {
      setIsCountReady(true);
    }
  }, [count]);

  /**
   * Utils
   */
  function clearRequestGetData() {
    //update pageInfo
    pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);
          
    setCount(0);
    setItems([]);
    isOnApiRequestRef.current = false;
    isCursorPaginating.current = false;
    includeCursor.current = false;
    setIsOnApiRequest(false);
  }

  function updateHeights() {
    if(lref.current) {
      let h =lref.current.clientHeight;
      setLh(h);
    }
  }

  function resetPageRefs() {
    isForwardPagination.current = true;
    pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);
    includeCursor.current = false;
    pageRef.current = 0;
  }

function resetReloadData() {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure
    resetPageRefs();
    isCursorPaginating.current = true;
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }

  /**
   * Handlers
   */

  /*
   * Search handlers
   */
  const handleSearchEnter = text => {
    updateHeights();

    if(text !== search)
    {
      resetPageRefs();
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

  const handleChangeRowsPerPage = event => {
    if(event.target.value !== rowsPerPage)
    {
      resetPageRefs();
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }
      setRowsPerPage(parseInt(event.target.value, 10));
    }
  };

  const handleReloadClick = (event) => {
    resetReloadData();
  };

    const handleFirstPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure
    isCursorPaginating.current = true;
    includeCursor.current = false;
    isForwardPagination.current = true;
    pageInfo.current.endCursor = null;

    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleLastPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure
    isCursorPaginating.current = true;
    includeCursor.current = false;
    isForwardPagination.current = false;
    pageInfo.current.startCursor = null;

    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleNextButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure
    isCursorPaginating.current = true;
    includeCursor.current = false;
    isForwardPagination.current = true;

    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleBackButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure
    isCursorPaginating.current = true;
    includeCursor.current = false;
    isForwardPagination.current = false;

    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  /**
   * Items handlers
   */

  const handleRowClicked = (event, item) => {
    handleClickOnGrupo_enfoqueRow(event, item);
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
              <GrupoEnfoqueCompactViewToolbar 
                title={'Grupo_enfoques'}
                search={search}
                onSearchEnter={handleSearchEnter}
                onReloadClick={handleReloadClick}
              />

              {/* Case: no data */}
              {(!isOnApiRequest && (!areItemsReady || !isCountReady)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='GrupoEnfoqueCompactView-div-noDataA'>
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
              {(!isOnApiRequest && areItemsReady && isCountReady) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lref}>
                    <List id='GrupoEnfoqueCompactView-list-listA'
                    dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.grupo_id;
                        let label = undefined;
                        let sublabel = it.fecha;
       
                        return (
                          <ListItem 
                            id={'GrupoEnfoqueCompactView-listA-listItem-'+it.grupo_id}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'grupo_enfoque' }>
                                <Avatar>{"grupo_enfoque".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* sitio_id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'grupo_id' }>
                                        <Typography
                                        id={'GrupoEnfoqueCompactView-listA-listItem-id-'+it.grupo_id}
                                        variant="body1" display="block" noWrap={true}>{it.grupo_id}</Typography>
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
                                    <Tooltip title={ 'grupo_id' }>
                                      <Typography
                                      id={'GrupoEnfoqueCompactView-listA-listItem-label-'+it.grupo_id}
                                      component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ 'fecha' }>
                                      <Typography
                                      id={'GrupoEnfoqueCompactView-listA-listItem-sublabel-'+it.grupo_id}
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

              {/* Pagination */}
              {(true) && (
                
                <GrupoEnfoqueCompactViewCursorPagination
                  count={count}
                  rowsPerPageOptions={(count <=10) ? [] : (count <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
                  rowsPerPage={(count <=10) ? '' : rowsPerPage}
                  labelRowsPerPage = { t('modelPanels.rows') }
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  handleFirstPageButtonClick={handleFirstPageButtonClick}
                  handleLastPageButtonClick={handleLastPageButtonClick}
                  handleNextButtonClick={handleNextButtonClick}
                  handleBackButtonClick={handleBackButtonClick}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
GrupoEnfoqueCompactView.propTypes = {
  item: PropTypes.object.isRequired,
  handleClickOnGrupo_enfoqueRow: PropTypes.func,
};