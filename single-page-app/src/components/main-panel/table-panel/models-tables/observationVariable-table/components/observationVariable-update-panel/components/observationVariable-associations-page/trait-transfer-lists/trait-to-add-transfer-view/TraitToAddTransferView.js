
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
import TraitToAddTransferViewToolbar from './components/TraitToAddTransferViewToolbar';
import TraitToAddTransferViewCursorPagination from './components/TraitToAddTransferViewCursorPagination';
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
import { green, grey } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

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
  paper: {
    marginTop: theme.spacing(2),
    borderColor: "#eeeeee"
  },
  associatedItemTitle: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export default function TraitToAddTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    idsToAdd,
    idsToRemove,
    handleDisassociateItem,
    handleReassociateItem,
    handleTransfer,
    handleUntransfer,
    handleClickOnTraitRow,
  } = props;

  /*
    State Table A (available)
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
  const lidsToRemove = useRef((idsToRemove && Array.isArray(idsToRemove)) ? Array.from(idsToRemove) : []);

  //associated id
  const [associatedItem, setAssociatedItem] = useState(undefined);
  const [checked, setChecked] = useState(lidsToRemove.current.length===0);

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


  //snackbar (for: getAssociatedItem)
  const variantE = useRef('info');
  const errorsE = useRef([]);
  const contentE = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsE.current}
    variant={variantE.current} />
  ));
  const actionTextE = useRef(t('modelPanels.gotIt', "Got it"));
  const actionE = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextE.current}
      </Button>
    </> 
  ));

  /**
    * Callbacks:
    *  showMessage
    *  showMessageB
    *  showMessageC
    *  showMessageE
    *  configurePagination
    *  onEmptyPage
    *  clearRequestGetData
    *  clearRequestGetDataB
    *  getAssociatedItem
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
   * showMessageE
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageE = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantE.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionE.current : undefined,
      content: withDetail ? contentE.current : undefined,
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
   * getAssociatedItem
   * 
   * Get associated @item from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform associated @item.
   * 
   */
  const getAssociatedItem = useCallback(async () => {
    errorsE.current = [];
    let currentId = item.observationVariableDbId;

    /*
      API Request: api.observationVariable.getTrait
    */
    let cancelableApiReq = makeCancelable(api.observationVariable.getTrait(graphqlServerUrl, item.observationVariableDbId));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantE.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'observationVariable', association: 'trait', table:'Associated Item', method: 'getAssociatedItem()', request: 'api.observationVariable.getTrait'}];
            newError.path=['update', `observationVariableDbId:${currentId}`, 'add', 'trait'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsE.current.push(newError);
            console.log("Error: ", newError);

            showMessageE(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantE.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'Associated Item', method: 'getAssociatedItem()', request: 'api.observationVariable.getTrait'}];
          newError.path=['update', `observationVariableDbId:${currentId}`, 'add', 'trait'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsE.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageE(newError.message, withDetails);
          return;
        }

        //get item
        let item = response.value;

        //ok
        setAssociatedItem((item !== null) ? {...item} : null);    
        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.observationVariable.getTrait
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variantE.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'Associated Item', method: 'getAssociatedItem()', request: 'api.observationVariable.getTrait'}];
          newError.path=['update', `observationVariableDbId:${currentId}`, 'add', 'trait'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsE.current.push(newError);
          console.log("Error: ", newError);

          showMessageE(newError.message, withDetails);
          return;
        }
      });
  }, [graphqlServerUrl, showMessageE, t, item.observationVariableDbId]);

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
          values: {"traitDbId": lidsToAdd.current}
        }]
      };
    }    

    /*
      API Request: api.observationVariable.getNotAssociatedTraitCount
    */
    let cancelableApiReq = makeCancelable(api.observationVariable.getNotAssociatedTraitCount(graphqlServerUrl, item.observationVariableDbId, search, ops));
    cancelableCountingPromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelableCountingPromises.current.splice(cancelableCountingPromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantC.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getCount()', request: 'api.observationVariable.getNotAssociatedTraitCount'}];
            newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
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
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getCount()', request: 'api.observationVariable.getNotAssociatedTraitCount'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
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
      .catch((err) => { //error: on api.observationVariable.getNotAssociatedTraitCount
        if(err.isCanceled) {
          return;
        } else {
          //show error
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getCount()', request: 'api.observationVariable.getNotAssociatedTraitCount'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);

          showMessageC(newError.message, withDetails);
          return;
        }
      });
  }, [graphqlServerUrl, showMessageC, t, item.observationVariableDbId, search]);

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
    //associated item (async)
    getAssociatedItem();

    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'String',
          values: {"traitDbId": lidsToAdd.current}
        }]
      };
    }    

    let variables = {
      pagination: {...paginationRef.current}
    };
    /*
      API Request: api.observationVariable.getNotAssociatedTrait
    */
    let cancelableApiReq = makeCancelable(api.observationVariable.getNotAssociatedTrait(
      graphqlServerUrl,
      item.observationVariableDbId,
      search,
      variables,
      ops,
    ));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getData()', request: 'api.observationVariable.getNotAssociatedTrait'}];
            newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else {
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getData()', request: 'api.observationVariable.getNotAssociatedTrait'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
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
      .catch((err) => { //error: on api.observationVariable.getNotAssociatedTrait
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'A', method: 'getData()', request: 'api.observationVariable.getNotAssociatedTrait'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, clearRequestGetData, getCount, t, item.observationVariableDbId, dataTrigger, search, configurePagination, onEmptyPage, getAssociatedItem]);


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
          values: {"traitDbId": lidsToAdd.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    let variables = {pagination: {first: 1}};
    /*
      API Request: api.trait.getItems
    */
    let cancelableApiReq = makeCancelable(api.trait.getItems(
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
            newError.locations=[{model: 'observationVariable', association: 'trait', table:'B', method: 'getDataB()', request: 'api.trait.getItems'}];
            newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
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
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'B', method: 'getDataB()', request: 'api.trait.getItems'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
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
      .catch((err) => { //error: on api.trait.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'observationVariable', association: 'trait', table:'B', method: 'getDataB()', request: 'api.trait.getItems'}];
          newError.path=['update', `observationVariableDbId:${item.observationVariableDbId}`, 'add', 'trait'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, clearRequestGetDataB, t, item.observationVariableDbId, dataTriggerB, searchB]);

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
     * The relation 'trait' for this item was updated.
     * That is to say that the current item was associated or dis-associated with some 'traits', 
     * from this relation (in another place).
     * 
     * Actions:
     * - remove any associated internalId from idsToAdd[]
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.observationVariable&&
        lastModelChanged.observationVariable[String(item.observationVariableDbId)]&&
        lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations&&
        lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations.observationVariable_traitDbId&&
        (lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations.observationVariable_traitDbId.added ||
         lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations.observationVariable_traitDbId.removed)) {
          
          //remove any associated internalId from idsToAdd[] & update counts
          let idsAdded = lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations.observationVariable_traitDbId.idsAdded;
          if(idsAdded) {
            idsAdded.forEach( (idAdded) => {
              //remove from lidsToAdd
              let iof = lidsToAdd.current.indexOf(idAdded);
              if(iof !== -1) { 
                lidsToAdd.current.splice(iof, 1);
                if(lidsToAdd.current.length === 0) {
                  setThereAreItemsToAdd(false);
                }
                handleUntransfer('trait', idAdded);
              }
            });
            /**
             * If currently the associated item is marked for disassociate,
             * i.e. is in the lidsToRemove array, then update the id in
             * lidsToRemove with the new id associated.
             * 
             * This event occurs if the current record was associated with
             * another item.
             */
            //update idsToRemove
            if(lidsToRemove.current && lidsToRemove.current.length>0) {
              lidsToRemove.current = [idsAdded[0]];
              handleDisassociateItem('trait', idsAdded[0]);
            }
          }

          //update count for each dis-associated internalId from idsToAdd[]
          let idsRemoved = lastModelChanged.observationVariable[String(item.observationVariableDbId)].changedAssociations.observationVariable_traitDbId.idsRemoved;
          if(idsRemoved) {
            //increment A
            setCount(count+idsRemoved.length);

            /**
             * If currently the associated item is marked for disassociate,
             * i.e. is in the lidsToRemove array, and there is no item added, 
             * then clear the lidsToRemove list.
             * 
             * This event occurs if the current record was disassociated and
             * no other record was associated.
             */
            //update idsToRemove
            if(!idsAdded && lidsToRemove.current && lidsToRemove.current.length>0) {
              handleReassociateItem('trait', lidsToRemove.current[0]);
              lidsToRemove.current = [];
            } 
          }

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
    }//end: Case 1

    /*
     * Case 2: 
     * The relation 'trait' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'trait',
     * but this action happened on the peer relation, identified by 'observationVariable_traitDbId'.
     * 
     * Conditions:
     * A: the current item internalId is in the removedIds of the updated 'trait'.
     * B: the current item internalId is in the addedIds of the updated 'trait'.
     * 
     * Actions:
     * if A:
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     * 
     * else if B:
     * - remove the internalId of the 'trait' from idsToAdd[].
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.trait) {
      let oens = Object.entries(lastModelChanged.trait);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.observationVariable_traitDbId) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.observationVariable_traitDbId.removed) {
              let idsRemoved = entry[1].changedAssociations.observationVariable_traitDbId.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.observationVariableDbId);
                if(iof !== -1) {
                  //update idsToRemove
                  if(lidsToRemove.current && lidsToRemove.current.length>0) {
                    handleReassociateItem('trait', lidsToRemove.current[0]);
                    lidsToRemove.current = [];
                  } 

                  //increment A
                  setCount(count+1);

                  //will count A
                  cancelCountingPromises();
                  isCountingRef.current = false;

                  //strict contention reload
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure A
                    configurePagination('reload');
                    //reload A
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  } else {
                    getCount();
                  }
                  //strict contention reload
                  if (!isOnApiRequestRefB.current) {
                    //reload B
                    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
                  }
                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.observationVariable_traitDbId.added) {
              let idsAdded = entry[1].changedAssociations.observationVariable_traitDbId.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.observationVariableDbId);
                if(iof !== -1) {
                  //remove changed item from lidsToAdd
                  let idAdded = entry[1].newItem.traitDbId;
                  let iofB = lidsToAdd.current.indexOf(idAdded);
                  if(iofB !== -1) {
                    lidsToAdd.current.splice(iofB, 1);
                    if(lidsToAdd.current.length === 0) {
                      setThereAreItemsToAdd(false);
                    }
                  }
                  handleUntransfer('trait', idAdded);
                  //update idsToRemove
                  if(lidsToRemove.current && lidsToRemove.current.length>0) {
                    lidsToRemove.current = [idAdded];
                    handleDisassociateItem('trait', idAdded);
                  } 

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
              }
            }//end: case B
        }
      })
    }//end: Case 2

    /*
     * Case 3: 
     * The attributes of some 'trait' were modified or the item was deleted.
     * 
     * Conditions:
     * A: the item was modified and is currently displayed in any of the lists.
     * B: the item was deleted and is currently displayed in any of the lists or associated ids.
     * 
     * Actions:
     * if A:
     * - update the list with the new item.
     * - return
     * 
     * if B:
     * - remove the deleted internalId from idsToAdd[]
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.trait) {

      let oens = Object.entries(lastModelChanged.trait);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.traitDbId;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.traitDbId===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.traitDbId===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }

          //lookup on associated item
          if(associatedItem && associatedItem.traitDbId===idUpdated) {
            //update associated item
            setAssociatedItem(entry[1].newItem);
          }
          return;
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.traitDbId;

          //lookup item on table A
          let iofA = items.findIndex((item) => item.traitDbId===idRemoved);
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
          handleUntransfer('trait', idRemoved);

          //lookup on associated item
          if(associatedItem && associatedItem.traitDbId===idRemoved) {
            //update associated item
            setAssociatedItem(undefined);
          }

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
    }//end: Case 3
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, item.observationVariableDbId, handleUntransfer, getCount, count, configurePagination, associatedItem, handleDisassociateItem, handleReassociateItem]);

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
    handleClickOnTraitRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToAdd.current&&lidsToAdd.current.indexOf(item.traitDbId) === -1) {
      let hasItem = (lidsToAdd.current.length > 0);
      lidsToAdd.current = [];
      lidsToAdd.current.push(item.traitDbId);
      setThereAreItemsToAdd(true);

      if(!hasItem) {
        //decrement count A
        setCount(count-1);
        //will count A
        cancelCountingPromises();
        isCountingRef.current = false;
      }

      if(associatedItem && checked) {
        setChecked(false);
        lidsToRemove.current = [associatedItem.traitDbId];
        handleDisassociateItem('trait', associatedItem.traitDbId);
      }

      //reload A
      reloadDataA();
      //reload B
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
      handleTransfer('trait', item.traitDbId);
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
      handleUntransfer('trait', item.traitDbId);
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.container} container spacing={0} alignItems='flex-start' justify='center'>
        {/*
          * Selectable list (A)
          */}
        <Grid item xs={12} sm={5} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <TraitToAddTransferViewToolbar
                title={'Traits'}
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
                  <div id='TraitToAddTransferView-div-noDataA'>
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
                    <List id='TraitToAddTransferView-list-listA'
                    dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.traitDbId;
                        let label = it.traitName;
                        let sublabel = undefined;
                        
                        return (
                          <ListItem 
                            id={'TraitToAddTransferView-listA-listItem-'+it.traitDbId}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? 'trait — ' + t('modelPanels.associatedRecord', 'Associated record') : 'trait '}>
                                <Avatar>
                                  {"trait".slice(0,1)}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* observationVariableDbId*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'traitDbId' }>
                                        <Typography 
                                        id={'TraitToAddTransferView-listA-listItem-id-'+it.traitDbId}
                                        variant="body1" display="block" noWrap={true}>{it.traitDbId}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? t('modelPanels.internalId', 'Unique Identifier') + ' — ' + t('modelPanels.associatedRecord', 'Associated record') : t('modelPanels.internalId', 'Unique Identifier')}>
                                        <Key fontSize="small" style={{ marginTop:8, color: (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? green[500] : grey[400]}} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'traitName' }>
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
                                  id={'TraitToAddTransferView-listA-listItem-'+it.traitDbId+'-button-add'}
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
              <TraitToAddTransferViewCursorPagination
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
          )}
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
                        <linearGradient id="gradient1">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient1)',
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
                        <linearGradient id="gradient1b">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient1b)',
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
          {(item!==undefined) && (
            <div>
            <Card className={classes.card}>

              {/* Toolbar */}
              <TraitToAddTransferViewToolbar 
                title={'Trait'}
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
                  <div id='TraitToAddTransferView-div-noItemsB'>
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
                  <div id='TraitToAddTransferView-div-noDataB'>
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
                    <List id='TraitToAddTransferView-list-listB'
                      dense component="div" role="list">
                      {itemsB.map(it => {
                        let key = it.traitDbId;
                        let label = it.traitName;
                        let sublabel = undefined;

                        
                        return (
                          <ListItem 
                            id={'TraitToAddTransferView-listB-listItem-'+it.traitDbId}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? 'trait — ' + t('modelPanels.associatedRecord', 'Associated record') : 'trait '}>
                                <Avatar>
                                  {"trait".slice(0,1)}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* observationVariableDbId*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'traitDbId' }>
                                        <Typography 
                                        id={'TraitToAddTransferView-listB-listItem-id-'+it.traitDbId}
                                        variant="body1" display="block" noWrap={true}>{it.traitDbId}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? t('modelPanels.internalId', 'Unique Identifier') + ' — ' + t('modelPanels.associatedRecord', 'Associated record') : t('modelPanels.internalId', 'Unique Identifier')}>
                                        <Key fontSize="small" style={{ marginTop:8, color: (associatedItem&&associatedItem.traitDbId===it.traitDbId) ? green[500] : grey[400]}} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'traitName' }>
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
                                  id={'TraitToAddTransferView-listB-listItem-'+it.traitDbId+'-button-remove'}
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
            <Paper className={classes.paper} variant='outlined'>
              {/* Case: associated item */}
              {(associatedItem !== undefined && associatedItem !== null) && (
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox}>
                    {/* Title */}
                    <Grid className={classes.associatedItemTitle} container justify='flex-start' alignItems='center' wrap='wrap' spacing={2}>
                      <Grid item>
                        <Typography variant="body2" display="inline" color="textSecondary">
                          Trait
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" display="inline">
                          { t('modelPanels.associated', 'Associated') }
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* List */}
                    <List id='TraitToAddTransferView-associatedItem-list'
                      dense component="div" role="list">
                      {[associatedItem].map(associatedItem => {
                        let key = associatedItem.traitDbId;
                        let label = associatedItem.traitName;
                        let sublabel = undefined;

                        return (
                          <ListItem 
                            id={'TraitToAddTransferView-associatedItem-list-listItem-'+associatedItem.traitDbId}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, {...associatedItem});
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'trait — ' + t('modelPanels.associatedRecord', 'Associated record') }>
                                <Avatar>
                                  {"trait".slice(0,1)}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* observationVariableDbId*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'traitDbId' }>
                                        <Typography 
                                        id={'TraitToAddTransferView-listB-listItem-id-'+associatedItem.traitDbId}
                                        variant="body1" display="block" noWrap={true}>{associatedItem.traitDbId}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') + ' — ' + t('modelPanels.associatedRecord', 'Associated record') }>
                                        <Key fontSize="small" style={{ marginTop:8, color: green[500] }} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'traitName' }>
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
                            {/* Checkbox */}
                            <ListItemSecondaryAction>
                              <Tooltip title={ checked ? t('modelPanels.uncheckToDissasociate', 'Uncheck to disassociate') : t('modelPanels.checkToReassociate', 'Check to keep associated') }>
                                <Checkbox
                                  id={'TraitToAddTransferView-associatedItem-list-listItem-'+associatedItem.traitDbId+'-checkbox'}
                                  className={classes.checkbox}
                                  checked={checked}
                                  color="primary"
                                  onChange={(event) => {
                                    setChecked(event.target.checked);
                                    
                                    if(event.target.checked) {
                                      if(lidsToAdd.current&&lidsToAdd.current.length>0
                                      && itemsB&&itemsB.length>0
                                      && itemsB[0].traitDbId===lidsToAdd.current[0]) {
                                        handleRemoveItem(null, itemsB[0]);
                                      }
                                      lidsToRemove.current = [];
                                      handleReassociateItem('trait', associatedItem.traitDbId);
                                    } else {
                                      lidsToRemove.current = [associatedItem.traitDbId];
                                      handleDisassociateItem('trait', associatedItem.traitDbId);
                                    }
                                  }}
                                />  
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
              {( associatedItem === undefined ) && (
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
              {/* Case: no associated item */}
              {( associatedItem === null ) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='TraitToAddTransferView-div-noAssociatedItem'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center" wrap='nowrap' spacing={1}>
                          {/*Key icon*/}
                          <Grid item>
                            <Tooltip title={ t('modelPanels.noAssociatedItemB', 'No associated record') }>
                              <Key fontSize="small" style={{ marginTop:8, color: grey[400]}} />
                            </Tooltip>
                          </Grid>
                          {/*Msg*/}
                          <Grid item>
                              <Typography variant="body2" color='textSecondary' >
                                { t('modelPanels.noAssociatedItem', 'There is no associated record currently') }
                              </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}
            </Paper>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
TraitToAddTransferView.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  handleTransfer: PropTypes.func.isRequired,
  handleUntransfer: PropTypes.func.isRequired,
  handleClickOnTraitRow: PropTypes.func.isRequired,
};