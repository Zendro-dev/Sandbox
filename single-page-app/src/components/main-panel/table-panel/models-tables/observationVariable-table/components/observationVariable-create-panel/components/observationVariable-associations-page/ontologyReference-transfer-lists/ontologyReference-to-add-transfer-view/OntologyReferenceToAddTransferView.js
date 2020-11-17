import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import api from '../../../../../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../../../../../utils'
import OntologyReferenceToAddTransferViewToolbar from './components/OntologyReferenceToAddTransferViewToolbar';
import OntologyReferenceToAddTransferViewCursorPagination from './components/OntologyReferenceToAddTransferViewCursorPagination';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/AddCircle';
import Remove from '@material-ui/icons/RemoveCircle';
import TransferArrows from '@material-ui/icons/SettingsEthernetOutlined';
import Key from '@material-ui/icons/VpnKey';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    [theme.breakpoints.down('xs')]: {
      minWidth: 200,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 910,
    },
  },
  container: {
    margin: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(0),
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
  arrowsBox: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(0),
    
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3),
    },
  },
  arrowsV: {
    transform: "rotate(90deg)",
  },
  row: {
    maxHeight: 70,
  },
}));

export default function OntologyReferenceToAddTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    idsToAdd,
    handleTransfer,
    handleUntransfer,
    handleClickOnOntologyReferenceRow,
  } = props;

  /*
    State A (selectable list)
  */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(-1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(10);
  const lastFetchTime = useRef(null);
  const isCountingRef = useRef(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageInfo = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const paginationRef = useRef({first: rowsPerPage, after: null, last: null, before: null, includeCursor: false});
  const isForwardPagination = useRef(true);
  const isCursorPaginating = useRef(false);
const cancelableCountingPromises = useRef([]);

  /*
    State B (to add list)
  */
  const [itemsB, setItemsB] = useState([]);
  const [searchB, setSearchB] = useState('');
  const [pageB, setPageB] = useState(0);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);
  const [dataTriggerB, setDataTriggerB] = useState(false);
  const isPendingApiRequestRefB = useRef(false);
  const isOnApiRequestRefB = useRef(false);
  const isGettingFirstDataRefB = useRef(true);
  const pageRefB = useRef(0);
  const lastFetchTimeB = useRef(null);

  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState((idsToAdd && Array.isArray(idsToAdd) && idsToAdd.length > 0));
  const lidsToAdd = useRef((idsToAdd && Array.isArray(idsToAdd)) ? Array.from(idsToAdd) : []);

  const cancelablePromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

  const lref = useRef(null);
  const lrefB = useRef(null);
  const [lh, setLh] = useState(82);
  const [lhB, setLhB] = useState(82);

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

  //snackbar
  const variantB = useRef('info');
  const errorsB = useRef([]);
  const contentB = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsB.current}
    variant={variantB.current} />
  ));
  const actionTextB = useRef(t('modelPanels.gotIt', "Got it"));
  const actionB = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextB.current}
      </Button>
    </> 
  ));

  //snackbar (for: getCount)
  const variantC = useRef('info');
  const errorsC = useRef([]);
  const contentC = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsC.current}
    variant={variantC.current} />
  ));
  const actionTextC = useRef(t('modelPanels.gotIt', "Got it"));
  const actionC = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextC.current}
      </Button>
    </> 
  ));


  /**
    * Callbacks:
    *  showMessage
    *  showMessageB
    *  showMessageC
    *  configurePagination
    *  onEmptyPage
    *  clearRequestGetData
    *  clearRequestGetDataB
    *  getCount
    *  getData
    *  getDataB
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
   * showMessageB
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageB = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantB.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionB.current : undefined,
      content: withDetail ? contentB.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * showMessageC
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageC = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantC.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionC.current : undefined,
      content: withDetail ? contentC.current : undefined,
    });
  },[enqueueSnackbar]);


  /**
   * configurePagination
   * 
   * Set the configuration needed to perform a reload of data
   * in the given mode.
   */
  const configurePagination = useCallback((mode) => {
    switch(mode) {
      case "reset":
        //reset page info attributes
        pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
      
      case "reload":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: pageInfo.current.startCursor,
          last: null,
          before: null,
          includeCursor: true,
        }
        break;

      case "firstPage":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "lastPage":
        //set direction
        isForwardPagination.current = false;
        //set pagination attributes
        paginationRef.current = {
          first: null,
          after: null,
          last: rowsPerPageRef.current,
          before: null,
          includeCursor: false,
        }
        break;

      case "nextPage":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: pageInfo.current.endCursor,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "previousPage":
        //set direction
        isForwardPagination.current = false;
        //set pagination attributes
        paginationRef.current = {
          first: null,
          after: null,
          last: rowsPerPageRef.current,
          before: pageInfo.current.startCursor,
          includeCursor: false,
        }
        break;

      default: //reset
        //reset page info attributes
        pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
    }
  }, []);


  const onEmptyPage = useCallback((pi) => {
    //case: forward
    if(isForwardPagination.current) {
      if(pi && pi.hasPreviousPage) {
        //configure
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        setIsOnApiRequest(false);
        configurePagination('previousPage');
        
        //reload
        setDataTrigger(prevDataTrigger => !prevDataTrigger);
        return;
      }
    } else {//case: backward
      if(pi && pi.hasNextPage) {
        //configure
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        setIsOnApiRequest(false);
        configurePagination('nextPage');
        
        //reload
        setDataTrigger(prevDataTrigger => !prevDataTrigger);
        return;
      }
    }

    //update pageInfo
    pageInfo.current = pi;
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);

    //configure pagination (default)
    configurePagination('reload');

    //ok
    setItems([]);

    //ends request
    isOnApiRequestRef.current = false;
    isCursorPaginating.current = false;
    setIsOnApiRequest(false);
    return;

  }, [configurePagination]);


  const clearRequestGetData = useCallback(() => {
    //configure pagination
    configurePagination('reset');
          
    setItems([]);
    isOnApiRequestRef.current = false;
    setIsOnApiRequest(false);
  },[configurePagination]);

  const clearRequestGetDataB = useCallback(() => {
  
    setItemsB([]);
    isOnApiRequestRefB.current = false;
    setIsOnApiRequestB(false);
  },[]);

  /**
   * getCount
   * 
   * Get @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @count retreived.
   * 
   */
  const getCount = useCallback(async () => {
    //return if there is an active count operation
    if(isCountingRef.current) return;

    cancelCountingPromises();
    isCountingRef.current = true;
    errorsC.current = [];

    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'String',
          values: {"ontologyDbId": lidsToAdd.current}
        }]
      };
    }    

    /*
      API Request: api.ontologyReference.getCountItems
    */
    let cancelableApiReq = makeCancelable(api.ontologyReference.getCountItems(graphqlServerUrl, search, ops));
    cancelableCountingPromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelableCountingPromises.current.splice(cancelableCountingPromises.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantC.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getCount()', request: 'api.ontologyReference.getCountItems'}];
            newError.path=['add', 'ontologyReference'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsC.current.push(newError);
            console.log("Error: ", newError);

            showMessageC(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getCount()', request: 'api.ontologyReference.getCountItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageC(newError.message, withDetails);
          return;
        }

        //ok
        setCount(response.value);
        isCountingRef.current = false;
      
        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.ontologyReference.getCountItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getCount()', request: 'api.ontologyReference.getCountItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);

          showMessageC(newError.message, withDetails);
          return;
        }
      });
  }, [graphqlServerUrl, showMessageC, t, search]);

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

    //count (async)
    getCount();

    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'String',
          values: {"ontologyDbId": lidsToAdd.current}
        }]
      };
    }
    
    let variables = {
      pagination: {...paginationRef.current}
    };
    /*
      API Request: api.ontologyReference.getItems
    */
    let cancelableApiReq = makeCancelable(api.ontologyReference.getItems(
      graphqlServerUrl,
      search,
      null, //orderBy
      null, //orderDirection
      variables,
      ops
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
            newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getData()', request: 'api.ontologyReference.getItems'}];
            newError.path=['add', 'ontologyReference'];
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
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getData()', request: 'api.ontologyReference.getItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
  
          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //get items
        let its = response.value.edges.map(o => o.node);
        let pi = response.value.pageInfo;
      
        /*
          Check: empty page
        */
        if( its.length === 0 ) 
        {
          onEmptyPage(pi);
          return;
        }

        //update pageInfo
        pageInfo.current = pi;
        setHasPreviousPage(pageInfo.current.hasPreviousPage);
        setHasNextPage(pageInfo.current.hasNextPage);

        //configure pagination (default)
        configurePagination('reload');

        //ok
        setItems([...its]);

        //ends request
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        setIsOnApiRequest(false);
        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.ontologyReference.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'A', method: 'getData()', request: 'api.ontologyReference.getItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, clearRequestGetData, getCount, t, dataTrigger, search, configurePagination, onEmptyPage]);


  /**
   * getDataB
   * 
   * Get @items from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items retreived.
   * 
   */
  const getDataB = useCallback(async () => {
    updateHeights();
    isOnApiRequestRefB.current = true;
    setIsOnApiRequestB(true);
    Boolean(dataTriggerB); //avoid warning
    errorsB.current = [];


    //set ops: only ids
    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        only: [{
          type: 'String',
          values: {"ontologyDbId": lidsToAdd.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    let variables = {pagination: {first: 1}};
    /*
      API Request: api.ontologyReference.getItems
    */
    let cancelableApiReq = makeCancelable(api.ontologyReference.getItems(
      graphqlServerUrl,
      searchB,
      null, //orderBy
      null, //orderDirection
      variables,
      ops
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
            variantB.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'B', method: 'getDataB()', request: 'api.ontologyReference.getItems'}];
            newError.path=['add', 'ontologyReference'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsB.current.push(newError);
            console.log("Error: ", newError);

            showMessageB(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'B', method: 'getDataB()', request: 'api.ontologyReference.getItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }

        //get items
        let its = response.value.edges.map(o => o.node);
          
        //ok
        setItemsB([...its]);

        //ends request
        isOnApiRequestRefB.current = false;
        setIsOnApiRequestB(false);
        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.ontologyReference.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'ontologyReference', table:'B', method: 'getDataB()', request: 'api.ontologyReference.getItems'}];
          newError.path=['add', 'ontologyReference'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, clearRequestGetDataB, t, dataTriggerB, searchB]);

  /**
   * Effects
   */
  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
      cancelableCountingPromises.current.forEach(p => p.cancel());
      cancelableCountingPromises.current = [];
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
    if (!isOnApiRequestRefB.current) {
      getDataB();
    } 
    else { 
      isPendingApiRequestRefB.current = true; 
    }
  }, [getDataB]);

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
    if(!lastChangeTimestamp || !lastFetchTime.current || !lastFetchTimeB.current) {
      return;
    }
    let isNewChangeOnA = (lastFetchTime.current<lastChangeTimestamp);
    let isNewChangeOnB = (lastFetchTimeB.current<lastChangeTimestamp);
    if(!isNewChangeOnA && !isNewChangeOnB) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();
    lastFetchTimeB.current = Date.now();

    /*
     * Case 1: 
     * The attributes of some 'ontologyReference' were modified or the item was deleted.
     * 
     * Conditions:
     * A: the item was modified and is currently displayed in any of the lists.
     * B: the item was deleted and is currently displayed in any of the lists.
     * 
     * Actions:
     * if A:
     * - update the list with the new item.
     * - return
     * 
     * if B:
     * - remove the deleted internalId from idsToAdd[]
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.ontologyReference) {

      let oens = Object.entries(lastModelChanged.ontologyReference);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.ontologyDbId;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.ontologyDbId===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.ontologyDbId===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.ontologyDbId;

          //lookup item on table A
          let iofA = items.findIndex((item) => item.ontologyDbId===idRemoved);
          if(iofA !== -1) {
            //decrement A
            setCount(count-1);
          }


          //lookup item on ids to add
          let iofD = lidsToAdd.current.indexOf(idRemoved);
          //remove deleted item from lidsToAdd
          if(iofD !== -1) {
            lidsToAdd.current.splice(iofD, 1);
            if(lidsToAdd.current.length === 0) {
              setThereAreItemsToAdd(false);
            }
          }
          handleUntransfer('ontologyReference', idRemoved);

          //will count A
          cancelCountingPromises();
          isCountingRef.current = false;

          //strict contention
          if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
            //configure A
            configurePagination('reload');
            //reload A
            setDataTrigger(prevDataTrigger => !prevDataTrigger);
          } else {
            getCount();
          }
          //strict contention
          if (!isOnApiRequestRefB.current) {
            //reload B
            setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
          }
          return;
        }
      });
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, handleUntransfer, getCount, count, configurePagination]);
  
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
    //return on first render
    if(isGettingFirstDataRefB.current) { 
      isGettingFirstDataRefB.current = false; 
      return; 
    } 
    else {
      //get data from the new page
      pageRefB.current = pageB;
      if (!isOnApiRequestRefB.current) {
        setDataTriggerB(prevDataTriggerB => !prevDataTriggerB); 
      } 
      else { 
        isPendingApiRequestRefB.current = true; 
      }
    }
  }, [pageB]);

  useEffect(() => {
    //update ref
    rowsPerPageRef.current = rowsPerPage;

    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    
    //configure pagination
    configurePagination('reset');
    //reload    
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }, [rowsPerPage, configurePagination]);


  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequestRef.current) {
      isPendingApiRequestRef.current = false;
      //configure
      configurePagination('reload');
      //reload
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    }
    updateHeights();
  }, [isOnApiRequest, configurePagination]);

  useEffect(() => {
    if (!isOnApiRequestB && isPendingApiRequestRefB.current) {
      isPendingApiRequestRefB.current = false;
      //reload
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    }
    updateHeights();
  }, [isOnApiRequestB]);

  useEffect(() => {
    if(Array.isArray(items) && items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }
    lastFetchTime.current = Date.now();
  }, [items]);

  useEffect(() => {
    if(Array.isArray(itemsB) && itemsB.length > 0) { 
      setAreItemsReadyB(true); 
    } else { 
      setAreItemsReadyB(false); 
    }
    lastFetchTimeB.current = Date.now();
  }, [itemsB]);

  /**
   * Utils
   */
  function cancelCountingPromises() {
    cancelableCountingPromises.current.forEach(p => p.cancel());
    cancelableCountingPromises.current = [];    
  }

  function updateHeights() {
    if(lref.current) {
      let h =lref.current.clientHeight;
      setLh(h);
    }
    if(lrefB.current) {
      let hb =lrefB.current.clientHeight;
      setLhB(hb);
    }
  }


  function reloadDataA() {
    //configure A
    configurePagination('reload');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }

  function reloadDataB() {
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
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
      
      setCount(-1);
      //will count
      cancelCountingPromises();
      isCountingRef.current = false;

      setSearch(text);
    }
  };

  const handleSearchEnterB = text => {
    if(text !== searchB)
    {
      if(pageB !== 0) {
        isGettingFirstDataRefB.current = true; //avoids to get data on [pageB] effect
        setPageB(0);
      }

      setSearchB(text);
    }
  };

  /*
   * Pagination handlers
   */

  const handleFirstPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('firstPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };


  const handleLastPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('lastPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };


  const handleNextButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('nextPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };


  const handleBackButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('previousPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };


  const handleChangeRowsPerPage = event => {
    if(event.target.value !== rowsPerPage)
    {
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }

      setRowsPerPage(parseInt(event.target.value, 10));
    }
  };


  const handleReloadClick = (event) => {
    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure pagination
    configurePagination('reset');
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };
  const handleReloadClickB = (event) => {
    //check strict contention
    if(isOnApiRequestRefB.current) { return; }
    //reload
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  };
  
  /*
   * Items handlers
   */
  const handleRowClicked = (event, item) => {
    handleClickOnOntologyReferenceRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToAdd.current.indexOf(item.ontologyDbId) === -1) {
      let hasItem = (lidsToAdd.current&&lidsToAdd.current.length > 0);
      lidsToAdd.current = [];
      lidsToAdd.current.push(item.ontologyDbId);
      setThereAreItemsToAdd(true);

      if(!hasItem) {
        //decrement count A
        setCount(count-1);
        //will count A
        cancelCountingPromises();
        isCountingRef.current = false;
      }
      //reload A
      reloadDataA();
      //reload B
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
      handleTransfer('ontologyReference', item.ontologyDbId);
    }
  };

  const handleRemoveItem = (event, item) => {
    if(lidsToAdd.current.length > 0) {
      let hasItem = (lidsToAdd.current&&lidsToAdd.current.length > 0);
      lidsToAdd.current = [];
      setThereAreItemsToAdd(false);

      if(hasItem) {
        //increment count A
        setCount(count+1);
        //will count A
        cancelCountingPromises();
        isCountingRef.current = false;
      }
      //reload A
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
      //reload B
      reloadDataB();
      handleUntransfer('ontologyReference', item.ontologyDbId);
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.container} container spacing={0} alignItems='flex-start' justify='center'>
        {/*
          * Selectable list (A)
          */}
        <Grid item xs={12} sm={5} >
          <Card className={classes.card}>

            {/* Toolbar */}
            <OntologyReferenceToAddTransferViewToolbar 
              title={'OntologyReferences'}
              titleIcon={1}
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
                <div id='OntologyReferenceToAddTransferView-div-noDataA'>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" >{ t('modelPanels.noData') }</Typography>
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
                  <List id='OntologyReferenceToAddTransferView-list-listA'
                  dense component="div" role="list" >
                    {items.map(it => {
                      let key = it.ontologyDbId;
                      let label = it.ontologyName;
                      let sublabel = undefined;

                      return (
                        <ListItem 
                          id={'OntologyReferenceToAddTransferView-listA-listItem-'+it.ontologyDbId}
                          key={key} 
                          role="listitem" 
                          button 
                          className={classes.row}
                          onClick={(event) => {
                            handleRowClicked(event, it);
                          }}
                        >
                          <ListItemAvatar>
                            <Tooltip title={ 'ontologyReference' }>
                              <Avatar>{"ontologyReference".slice(0,1)}</Avatar>
                            </Tooltip>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <React.Fragment>
                                {/* observationVariableDbId*/}
                                <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                  <Grid item>
                                    <Tooltip title={ 'ontologyDbId' }>
                                      <Typography variant="body1" display="block" noWrap={true}>{it.ontologyDbId}</Typography>
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
                                  <Tooltip title={ 'ontologyName' }>
                                    <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                  </Tooltip>
                                )}
                                
                                {/* Sublabel */}
                                {(sublabel) && (
                                  <Tooltip title={ '' }>
                                    <Typography component="span" variant="body2" display="inline" color='textSecondary'>{" — "+sublabel} </Typography>
                                  </Tooltip>
                                )}
                              </React.Fragment>
                            }
                          />
                          {/* Button: Add */}
                          <ListItemSecondaryAction>
                            <Tooltip title={ t('modelPanels.transferToAdd') }>
                              <IconButton
                                id={'OntologyReferenceToAddTransferView-listA-listItem-'+it.ontologyDbId+'-button-add'}
                                color="primary"
                                className={classes.iconButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleAddItem(event, it);
                                }}
                              >
                                <Add htmlColor="#4CAF50" />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
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
            <OntologyReferenceToAddTransferViewCursorPagination
              count={count}
              rowsPerPageOptions={(count <=10) ? [] : (count <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
              rowsPerPage={(count <=10) ? '' : rowsPerPage}
              labelRowsPerPage = { t('modelPanels.rows', 'Rows') }
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              handleFirstPageButtonClick={handleFirstPageButtonClick}
              handleLastPageButtonClick={handleLastPageButtonClick}
              handleNextButtonClick={handleNextButtonClick}
              handleBackButtonClick={handleBackButtonClick}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
        {/*
          * Arrows
          */}
        <Hidden xsDown>
          <Grid item xs={1} >
            <Grid container className={classes.arrowsBox} justify='center'>
              <TransferArrows
                color="primary"
                fontSize="large"
                component={svgProps => {
                  return (
                    <svg {...svgProps}>
                      <defs>
                        <linearGradient id="gradient3">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient3)',
                      })}
                    </svg>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
            <Grid item xs={1} >
              <Grid container className={classes.arrowsBox} justify='center'>
                <TransferArrows
                  className={classes.arrowsV}
                  color="primary"
                  fontSize="large"
                  component={svgProps => {
                    return (
                      <svg {...svgProps}>
                        <defs>
                          <linearGradient id="gradient3b">
                            <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                            <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                          </linearGradient>
                        </defs>
                        {React.cloneElement(svgProps.children[0], {
                          fill: 'url(#gradient3b)',
                        })}
                      </svg>
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Hidden>

        {/*
          * To add list (B) 
          */}
        <Grid item xs={12} sm={5} >
          <Card className={classes.card}>

            {/* Toolbar */}
            <OntologyReferenceToAddTransferViewToolbar 
              title={'OntologyReference'}
              titleIcon={2}
              search={searchB}
              searchDisabled={true}
              onSearchEnter={handleSearchEnterB}
              onReloadClick={handleReloadClickB}
            />

            {/* Case: no items added */}
            {(!thereAreItemsToAdd) && (
              /* Label */
              <Fade
                in={true}
                unmountOnExit
              >
                <div id='OntologyReferenceToAddTransferView-div-noItemsB'>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" >{ t('modelPanels.noItemsToAdd', 'No records marked for association') }</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Fade>
            )}

            {/* Case: no data from search */}
            {(thereAreItemsToAdd && !isOnApiRequestB && (!areItemsReadyB)) && (
              /* Label */
              <Fade
                in={true}
                unmountOnExit
              >
                <div id='OntologyReferenceToAddTransferView-div-noDataB'>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" >{ t('modelPanels.noData') }</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Fade>
            )}

            {/* Case: data ready */}
            {(thereAreItemsToAdd && !isOnApiRequestB && areItemsReadyB) && (
            
              /* List */
              <Fade
                in={true}
                unmountOnExit
              >
                <Box className={classes.listBox} ref={lrefB}>
                  <List id='OntologyReferenceToAddTransferView-list-listB'
                  dense component="div" role="list">
                    {itemsB.map(it => {
                      let key = it.ontologyDbId;
                      let label = it.ontologyName;
                      let sublabel = undefined;

                      return (
                        <ListItem 
                          id={'OntologyReferenceToAddTransferView-listB-listItem-'+it.ontologyDbId}
                          key={key} 
                          role="listitem" 
                          button 
                          className={classes.row}
                          onClick={(event) => {
                            handleRowClicked(event, it);
                          }}
                        >
                          <ListItemAvatar>
                            <Tooltip title={ 'ontologyReference' }>
                              <Avatar>{"ontologyReference".slice(0,1)}</Avatar>
                            </Tooltip>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <React.Fragment>
                                {/* observationVariableDbId*/}
                                <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                  <Grid item>
                                    <Tooltip title={ 'ontologyDbId' }>
                                      <Typography variant="body1" display="block" noWrap={true}>{it.ontologyDbId}</Typography>
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
                                  <Tooltip title={ 'ontologyName' }>
                                    <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                  </Tooltip>
                                )}
                                
                                {/* Sublabel */}
                                {(sublabel) && (
                                  <Tooltip title={ '' }>
                                    <Typography component="span" variant="body2" display="inline" color='textSecondary'>{" — "+sublabel} </Typography>
                                  </Tooltip>
                                )}
                              </React.Fragment>
                            }
                          />
                          {/* Button: Remove */}
                          <ListItemSecondaryAction>
                            <Tooltip title={ t('modelPanels.untransferToAdd') }>
                              <IconButton
                                id={'OntologyReferenceToAddTransferView-listB-listItem-'+it.ontologyDbId+'-button-remove'}
                                color="primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleRemoveItem(event, it);
                                }}
                              >
                                <Remove color="primary" />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              </Fade>
            )}
            {/* Case: loading */}
            {( thereAreItemsToAdd && isOnApiRequestB) && (
              /* Progress */
              <Fade
                in={true}
                unmountOnExit
              >
                <div>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box height={lhB}>
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
        </Grid>
      </Grid>
    </div>
  );
}
OntologyReferenceToAddTransferView.propTypes = {
  idsToAdd: PropTypes.array.isRequired,
  handleTransfer: PropTypes.func.isRequired,
  handleUntransfer: PropTypes.func.isRequired,
  handleClickOnOntologyReferenceRow: PropTypes.func.isRequired,
};