import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../../../../../utils';
import AlimentosToRemoveTransferViewToolbar from './components/AlimentosToRemoveTransferViewToolbar';
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

export default function AlimentosToRemoveTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    idsToRemove,
    handleTransfer,
    handleUntransfer,
    handleClickOnRegistroRow,
  } = props;

  /*
    State Table A (associated)
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
  const cancelableCountingPromises = useRef([]);

  /*
    State Table B (to remove)
  */
  const [itemsB, setItemsB] = useState([]);
  const [countB, setCountB] = useState(-1);
  const [searchB, setSearchB] = useState('');
  const [pageB, setPageB] = useState(0);
  const [rowsPerPageB, setRowsPerPageB] = useState(10);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);
  const [dataTriggerB, setDataTriggerB] = useState(false);
  const isPendingApiRequestRefB = useRef(false);
  const isOnApiRequestRefB = useRef(false);
  const isGettingFirstDataRefB = useRef(true);
  const pageRefB = useRef(0);
  const rowsPerPageRefB = useRef(10);
  const lastFetchTimeB = useRef(null);
  const isCountingRefB = useRef(false);
  const cancelableCountingPromisesB = useRef([]);

  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState((idsToRemove && Array.isArray(idsToRemove) && idsToRemove.length > 0));
  const lidsToRemove = useRef((idsToRemove && Array.isArray(idsToRemove)) ? Array.from(idsToRemove) : []);

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

  //snackbar (for: getCountB)
  const variantD = useRef('info');
  const errorsD = useRef([]);
  const contentD = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsD.current}
    variant={variantD.current} />
  ));
  const actionTextD = useRef(t('modelPanels.gotIt', "Got it"));
  const actionD = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextD.current}
      </Button>
    </> 
  ));

/**
  * Callbacks:
  *  showMessage
  *  showMessageB
  *  showMessageC
  *  showMessageD
  *  clearRequestGetData
  *  clearRequestGetDataB
  *  getCount
  *  getCountB
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
   * showMessageD
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageD = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantD.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionD.current : undefined,
      content: withDetail ? contentD.current : undefined,
    });
  },[enqueueSnackbar]);




  const clearRequestGetData = useCallback(() => {
          
    setItems([]);
    isOnApiRequestRef.current = false;
    setIsOnApiRequest(false);
  },[]);

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

    /*
      API Request: api.taxon.getAlimentosCount
    */
    let api = await loadApi("taxon");
    let cancelableApiReq = makeCancelable(api.taxon.getAlimentosCount(
      graphqlServerUrl, 
      item.id,
      search,
    ));
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
            newError.locations=[{association: 'alimentos', method: 'getCount()', request: 'api.taxon.getAlimentosCount'}];
            newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
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
          newError.locations=[{association: 'alimentos', method: 'getCount()', request: 'api.taxon.getAlimentosCount'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageC(newError.message, withDetails);
          return;
        }

        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.taxon.getAlimentosCount
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{association: 'alimentos', method: 'getCount()', request: 'api.taxon.getAlimentosCount'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);

          showMessageC(newError.message, withDetails);
          return;
        }
      });

  }, [graphqlServerUrl, showMessageC, t, item.id, search]);

  /**
   * getData
   * 
   * Get @items from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items retrieved.
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

    /*
     * Uncomment following lines to exclude (hide) in this list, the records that are on to-remove list.
     */
    //set ops: excluded ids: toRemoveIds
    // let ops = null;
    // if(lidsToRemove.current && lidsToRemove.current.length > 0) {
    //   ops = {
    //     exclude: [{
    //       type: '',
    //       values: {: lidsToRemove.current}
    //     }]
    //   };
    // }

    /*
      API Request: api.taxon.getAlimentos
    */
    let api = await loadApi("taxon");
    let cancelableApiReq = makeCancelable(api.taxon.getAlimentos(
      graphqlServerUrl, 
      item.id,
      search,
      variables,
      //ops  //uncomment to send ops
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
            newError.locations=[{association: 'alimentos', method: 'getData()', request: 'api.taxon.getAlimentos'}];
            newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
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
          newError.locations=[{association: 'alimentos', method: 'getData()', request: 'api.taxon.getAlimentos'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
  
          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        
          
          //ok
          setItems([...its]);

          //ends request
          isOnApiRequestRef.current = false;
          setIsOnApiRequest(false);
          return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.taxon.getAlimentos
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{association: 'alimentos', method: 'getData()', request: 'api.taxon.getAlimentos'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, clearRequestGetData, t, dataTrigger, item.id, search, getCount]);

  /**
   * getDataB
   * 
   * Get @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @count retreived.
   * 
   */
  const getCountB = useCallback(async () => {
    //return if there is an active count operation
    if(isCountingRefB.current) return;

    cancelCountingPromisesB();
    isCountingRefB.current = true;
    errorsD.current = [];

    //set ops: only ids
    let ops = null;
    if(lidsToRemove.current && lidsToRemove.current.length > 0) {
      ops = {
        only: [{
          type: '',
          values: {"": lidsToRemove.current}
        }]
      };
    } else {
      isCountingRefB.current = false;
      return;
    }

    /*
      API Request: api.registro.getCountItems
    */
    let api = await loadApi("registro");
    let cancelableApiReq = makeCancelable(api.registro.getCountItems(graphqlServerUrl, searchB, ops));
    cancelableCountingPromisesB.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelableCountingPromisesB.current.splice(cancelableCountingPromisesB.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantD.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getCountB()', request: 'api.registro.getCountItems'}];
            newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsD.current.push(newError);
            console.log("Error: ", newError);

            showMessageD(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantD.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getCountB()', request: 'api.registro.getCountItems'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsD.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageD(newError.message, withDetails);
          return;
        }

        //ok
        setCountB(response.value);
        isCountingRefB.current = false;
      return;
    },
    //rejected
    (err) => {
      if(err.isCanceled) return;
      else throw err;
    })
    //error
    .catch((err) => { //error: on api.registro.getCountItems
      if(err.isCanceled) {
        return;
      } else {
        let newError = {};
        let withDetails=true;
        variantD.current='error';
        newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
        newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getCountB()', request: 'api.registro.getCountItems'}];
        newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
        newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
        errorsD.current.push(newError);
        console.log("Error: ", newError);

        showMessageD(newError.message, withDetails);
        return;
      }
    });
  }, [graphqlServerUrl, showMessageD, t, item.id, searchB]);

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

    //count (async)
    getCountB();

    //set ops: only ids: idsToRemove
    let ops = null;
    if(lidsToRemove.current && lidsToRemove.current.length > 0) {
      ops = {
        only: [{
          type: '',
          values: {"": lidsToRemove.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    /*
      API Request: api.registro.getItems
    */
    let api = await loadApi("registro");
    let cancelableApiReq = makeCancelable(api.registro.getItems(
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
              newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getDataB()', request: 'api.registro.getItems'}];
              newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
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
            newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getDataB()', request: 'api.registro.getItems'}];
            newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
            newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
            errorsB.current.push(newError);
            console.log("Error: ", newError);
  
            showMessageB(newError.message, withDetails);
            clearRequestGetDataB();
            return;
          }
          

          //ok
          setItemsB([...its]);

          //ends request
          isOnApiRequestRefB.current = false;
          setIsOnApiRequestB(false);
          return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.registro.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Taxon', association: 'alimentos', table:'B', method: 'getDataB()', request: 'api.registro.getItems'}];
          newError.path=['update', `id:${item.id}`, 'remove', 'alimentos'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, clearRequestGetDataB, t, item.id, dataTriggerB, searchB, getCountB]);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
      cancelableCountingPromises.current.forEach(p => p.cancel());
      cancelableCountingPromises.current = [];
      cancelableCountingPromisesB.current.forEach(p => p.cancel());
      cancelableCountingPromisesB.current = [];
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
     * The relation 'alimentos' for this item was updated.
     * That is to say that the current item was associated or dis-associated with some 'registros' 
     * (from another place).
     * 
     * Actions:
     * - remove any dis-associated internalId from idsToRemove[]
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.Taxon&&
        lastModelChanged.Taxon[String(item.id)]&&
        lastModelChanged.Taxon[String(item.id)].changedAssociations&&
        lastModelChanged.Taxon[String(item.id)].changedAssociations.registro_taxon_id&&
        (lastModelChanged.Taxon[String(item.id)].changedAssociations.registro_taxon_id.added ||
         lastModelChanged.Taxon[String(item.id)].changedAssociations.registro_taxon_id.removed)) {
          
          //remove any dis-associated id from idsToRemove[] & update counts
          let idsRemoved = lastModelChanged.Taxon[String(item.id)].changedAssociations.registro_taxon_id.idsRemoved;
          if(idsRemoved) {
            idsRemoved.forEach( (idRemoved) => {
              //remove from lidsToRemove
              let iof = lidsToRemove.current.indexOf(idRemoved);
              if(iof !== -1) { 
                lidsToRemove.current.splice(iof, 1);
                if(lidsToRemove.current.length === 0) {
                  setThereAreItemsToAdd(false);
                }
                //decrement B
                setCountB(countB-1);
              }
              handleUntransfer('alimentos', idRemoved);

              //decrement A
              setCount(count-1);
            });
          }

          //update count for each associated internalId
          let idsAdded = lastModelChanged.Taxon[String(item.id)].changedAssociations.registro_taxon_id.idsAdded;
          if(idsAdded) {
            //increment A
            setCount(count+idsAdded.length);
          }

          //will count A
          cancelCountingPromises();
          isCountingRef.current = false;
          //will count B
          cancelCountingPromisesB();
          isCountingRefB.current = false;

          return;
    }//end: Case 1

    /*
     * Case 2:
     * The relation 'alimentos' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'registro',
     * but this action happened on the peer relation, identified by 'registro_taxon_id'.
     * 
     * Conditions:
     * A: the current item internalId is in the removedIds of the updated 'registro'.
     * B: the current item internalId is in the addedIds of the updated 'registro'.
     * 
     * Actions:
     * if A:
     * - remove the internalId of the 'registro' from idsToRemove[].
     * - reload both transfer tables.
     * - return
     * 
     * else if B:
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.registro) {
      let oens = Object.entries(lastModelChanged.registro);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.registro_taxon_id) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.registro_taxon_id.removed) {
              let idsRemoved = entry[1].changedAssociations.registro_taxon_id.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.id);
                if(iof !== -1) {
                  //remove changed item from lidsToRemove
                  let idRemoved = entry[1].newItem.;
                  let iofB = lidsToRemove.current.indexOf(idRemoved);
                  if(iofB !== -1) {
                    lidsToRemove.current.splice(iofB, 1);
                    if(lidsToRemove.current.length === 0) {
                      setThereAreItemsToAdd(false);
                    }
                    //decrement B
                    setCountB(countB-1);
                  }
                  handleUntransfer('alimentos', idRemoved);

                  //will count A
                  cancelCountingPromises();
                  isCountingRef.current = false;
                  //will count B
                  cancelCountingPromisesB();
                  isCountingRefB.current = false;

                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.registro_taxon_id.added) {
              let idsAdded = entry[1].changedAssociations.registro_taxon_id.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.id);
                if(iof !== -1) {

                  //increment A
                  setCount(count+1);

                  //will count A
                  cancelCountingPromises();
                  isCountingRef.current = false;
                  //will count B
                  cancelCountingPromisesB();
                  isCountingRefB.current = false;

                  return;
                }
              }
            }//end: case B
        }
      })
    }//end: Case 2

    /*
     * Case 3: 
     * The attributes of some 'registro' were modified or the item was deleted.
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
     * - remove the deleted internalId from idsToRemove[]
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.registro) {

      let oens = Object.entries(lastModelChanged.registro);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.;

          //lookup item on table A
          let iofA = items.findIndex((item) => item.===idRemoved);
          if(iofA !== -1) {
            //decrement A
            setCount(count-1);
          }

          //lookup item on table B
          let iofB = itemsB.findIndex((item) => item.===idRemoved);
          if(iofB !== -1) {
            //decrement B
            setCountB(countB-1);
          }

          //lookup item on ids to remove
          let iofD = lidsToRemove.current.indexOf(idRemoved);
          //remove deleted item from lidsToAdd
          if(iofD !== -1) {
            lidsToRemove.current.splice(iofD, 1);
            if(lidsToRemove.current.length === 0) {
              setThereAreItemsToAdd(false);
            }
            if(iofB === -1) {
              //decrement B
              setCountB(countB-1);
            }
          }
          handleUntransfer('alimentos', idRemoved);

          //will count A
          cancelCountingPromises();
          isCountingRef.current = false;
          //will count B
          cancelCountingPromisesB();
          isCountingRefB.current = false;

          return;
        }
      });
    }//end: Case 3
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, item.id, handleUntransfer, getCount, count, getCountB, countB]);

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
    if (!isOnApiRequest && isPendingApiRequestRef.current) {
      isPendingApiRequestRef.current = false;
    }
    updateHeights();
  }, [isOnApiRequest]);

  useEffect(() => {
    if (!isOnApiRequestB && isPendingApiRequestRefB.current) {
      isPendingApiRequestRefB.current = false;
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
  function cancelCountingPromisesB() {
    cancelableCountingPromisesB.current.forEach(p => p.cancel());
    cancelableCountingPromisesB.current = [];    
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
  }

  function reloadDataB() {
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

      setCountB(-1);
      //will count
      cancelCountingPromisesB();
      isCountingRefB.current = false;

      setSearchB(text);
    }
  };

  /*
   * Pagination handlers
   */
  

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

  const handleChangeRowsPerPageB = event => {
    if(event.target.value !== rowsPerPageB)
    {
      if(pageB !== 0) {
        isGettingFirstDataRefB.current = true; //avoids to get data on [pageB] effect
        setPageB(0);
      }
      setRowsPerPageB(parseInt(event.target.value, 10));
    }
  };


  /*
   * Items handlers
   */
  const handleRowClicked = (event, item) => {
    handleClickOnRegistroRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToRemove.current.indexOf(item.) === -1) {
      lidsToRemove.current.push(item.);
      setThereAreItemsToAdd(true);
      
      //will count A
      cancelCountingPromises();
      isCountingRef.current = false;
      //reload A
      reloadDataA();

      //increment count B
      if(countB > 0) setCountB(countB+1);
      //will count B
      cancelCountingPromisesB();
      isCountingRefB.current = false;
      handleTransfer('alimentos', item.);
    }
  };

  const handleRemoveItem = (event, item) => {
    let iof = lidsToRemove.current.indexOf(item.);
    if(iof !== -1) { 
      lidsToRemove.current.splice(iof, 1);

      if(lidsToRemove.current.length === 0) {
        setThereAreItemsToAdd(false);
      }
      
      //will count A
      cancelCountingPromises();
      isCountingRef.current = false;

      //decrement count B
      if(countB > 0) setCountB(countB-1);
      //will count B
      cancelCountingPromisesB();
      isCountingRefB.current = false;
      //reload B
      reloadDataB();
      handleUntransfer('alimentos', item.);
    }
  }

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
              <AlimentosToRemoveTransferViewToolbar
                title={'Registros'}
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
                  <div id='AlimentosToRemoveTransferView-div-noDataA'>
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
                    <List id='AlimentosToRemoveTransferView-list-listA'
                      dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.;
                        let label = it.descripcion_alimento;
                        let sublabel = undefined;
                        let disabled = lidsToRemove.current.find(=> === it.) !== undefined;

                        return (
                          <ListItem 
                            id={'AlimentosToRemoveTransferView-listA-listItem-'+it.}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'registro' }>
                                <Avatar>{"registro".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ '' }>
                                        <Typography variant="body1" display="block" noWrap={true}>{it.}</Typography>
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
                                    <Tooltip title={ 'descripcion_alimento' }>
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
                              <Tooltip title={!disabled ? t('modelPanels.transferToRemove') : t('modelPanels.alreadyToRemove') }>
                                <span>
                                  <IconButton
                                    id={'AlimentosToRemoveTransferView-listA-listItem-'+it.+'-button-remove'}
                                    color="primary"
                                    className={classes.iconButton}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleAddItem(event, it);
                                    }}
                                    disabled={disabled}
                                  >
                                    <Remove color={!disabled ? "secondary" : "disabled"} />
                                  </IconButton>
                                </span>
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
                        <linearGradient id="gradient2">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#F50057" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient2)',
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
                        <linearGradient id="gradient2b">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#F50057" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient2b)',
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
            <Card className={classes.card}>

              {/* Toolbar */}
              <AlimentosToRemoveTransferViewToolbar 
                title={'Registros'}
                titleIcon={2}
                search={searchB}
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
                  <div id='AlimentosToRemoveTransferView-div-noItemsB'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" >{ t('modelPanels.noItemsToRemove', 'No records marked for dis-association') }</Typography>
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
                  <div id='AlimentosToRemoveTransferView-div-noDataB'>
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
                    <List id='AlimentosToRemoveTransferView-list-listB'
                      dense component="div" role="list">
                      {itemsB.map(it => {
                        let key = it.;
                        let label = it.descripcion_alimento;
                        let sublabel = undefined;

                        return (
                          <ListItem 
                            id={'AlimentosToRemoveTransferView-listB-listItem-'+it.}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'registro' }>
                                <Avatar>{"registro".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ '' }>
                                        <Typography variant="body1" display="block" noWrap={true}>{it.}</Typography>
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
                                    <Tooltip title={ 'descripcion_alimento' }>
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
                              <Tooltip title={ t('modelPanels.untransferToRemove') }>
                                <IconButton
                                  id={'AlimentosToRemoveTransferView-listB-listItem-'+it.+'-button-remove'}
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

              {/* Pagination */}
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

AlimentosToRemoveTransferView.propTypes = {
    item: PropTypes.object.isRequired,
    idsToRemove: PropTypes.array.isRequired,
    handleTransfer: PropTypes.func.isRequired,
    handleUntransfer: PropTypes.func.isRequired,
    handleClickOnRegistroRow: PropTypes.func.isRequired,
};