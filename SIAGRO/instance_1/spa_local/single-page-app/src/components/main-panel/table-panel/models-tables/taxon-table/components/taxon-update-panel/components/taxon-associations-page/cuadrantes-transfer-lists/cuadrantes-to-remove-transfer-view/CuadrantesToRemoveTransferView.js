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
import CuadrantesToRemoveTransferViewToolbar from './components/CuadrantesToRemoveTransferViewToolbar';
import CuadrantesToRemoveTransferViewCursorPagination from './components/CuadrantesToRemoveTransferViewCursorPagination';
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

export default function CuadrantesToRemoveTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    idsToRemove,
    handleTransfer,
    handleUntransfer,
    handleClickOnCuadranteRow,
  } = props;

  /*
    State Table A (associated)
  */
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

  /*
    State Table B (to remove)
  */
  const [itemsB, setItemsB] = useState([]);
  const [countB, setCountB] = useState(0);
  const [searchB, setSearchB] = useState('');
  const [pageB, setPageB] = useState(0);
  const [rowsPerPageB, setRowsPerPageB] = useState(10);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(false);
  const [isCountReadyB, setIsCountReadyB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);
  const [dataTriggerB, setDataTriggerB] = useState(false);
  const isPendingApiRequestRefB = useRef(false);
  const isOnApiRequestRefB = useRef(false);
  const isGettingFirstDataRefB = useRef(true);
  const pageRefB = useRef(0);
  const lastFetchTimeB = useRef(null);
  const [hasPreviousPageB, setHasPreviousPageB] = useState(false);
  const [hasNextPageB, setHasNextPageB] = useState(false);
  const pageInfoB = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const isForwardPaginationB = useRef(true);
  const isCursorPaginatingB = useRef(false);
  const includeCursorB = useRef(false);

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

/**
  * Callbacks:
  *  showMessage
  *  showMessageB
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
   * getData
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retrieved.
   * 
   */
  const getData = useCallback(() => {
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    /*
     * Uncomment following lines to exclude (hide) in this list, the records that are on to-remove list.
     */
    //set ops: excluded ids: toRemoveIds
    // let ops = null;
    // if(lidsToRemove.current !== undefined && lidsToRemove.current.length > 0) {
    //   ops = {
    //     exclude: [{
    //       type: 'String',
    //       values: {cuadrante_id: lidsToRemove.current}
    //     }]
    //   };
    // }

    /*
      API Request: readOneTaxon
    */
    let label = 'nombre_comun_grupo_enfoque';
    let sublabel = '';
    let variables = {
      pagination: {
        after: isForwardPagination.current ? pageInfo.current.endCursor : null,
        before: !isForwardPagination.current ? pageInfo.current.startCursor : null,
        first: isForwardPagination.current ? rowsPerPage : null,
        last: !isForwardPagination.current ? rowsPerPage : null,
        includeCursor: includeCursor.current,
      }
    };
    let cancelableApiReq = makeCancelable(api.taxon.getCuadrantesConnection(
      graphqlServerUrl, 
      item.id,
      label,
      sublabel,
      search,
      variables,
      // ops
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
          newError.locations=[{association: 'cuadrantes', query: 'readOneTaxon', method: 'getData()', request: 'api.taxon.getCuadrantesConnection'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: readOneTaxon
        let readOneTaxon = response.data.data.readOneTaxon;
        if(readOneTaxon === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneTaxon ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{association: 'cuadrantes', query: 'readOneTaxon', method: 'getData()', request: 'api.taxon.getCuadrantesConnection'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        
        //check: readOneTaxon type
        if(typeof readOneTaxon !== 'object'
        || !Number.isInteger(readOneTaxon.countFilteredCuadrantes)
        || typeof readOneTaxon.cuadrantesConnection !== 'object'
        || readOneTaxon.cuadrantesConnection === null
        || !Array.isArray(readOneTaxon.cuadrantesConnection.edges)
        || typeof readOneTaxon.cuadrantesConnection.pageInfo !== 'object'
        || readOneTaxon.cuadrantesConnection.pageInfo === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneTaxon ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{association: 'cuadrantes', query: 'readOneTaxon', method: 'getData()', request: 'api.taxon.getCuadrantesConnection'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        //get items
        let newCount = readOneTaxon.countFilteredCuadrantes;
        let its = readOneTaxon.cuadrantesConnection.edges.map(o => o.node);
        let pi = readOneTaxon.cuadrantesConnection.pageInfo;

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'readOneTaxon ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{association: 'cuadrantes', query: 'readOneTaxon', method: 'getData()', request: 'api.taxon.getCuadrantesConnection'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
        }

        /*
          Check: empty page
        */
        if( its.length === 0 && pi.hasPreviousPage ) 
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
      .catch((err) => { //error: on api.taxon.getCuadrantesConnection
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{association: 'cuadrantes', query: 'readOneTaxon', method: 'getData()', request: 'api.taxon.getCuadrantesConnection'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, t, dataTrigger, item.id, search, rowsPerPage]);

  /**
   * getDataB
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retreived.
   * 
   */
  const getDataB = useCallback(() => {
    isOnApiRequestRefB.current = true;
    setIsOnApiRequestB(true);
    Boolean(dataTriggerB); //avoid warning
    errorsB.current = [];

    //set ops: only ids: idsToRemove
    let ops = null;
    if(lidsToRemove.current !== undefined && lidsToRemove.current.length > 0) {
      ops = {
        only: [{
          type: 'String',
          values: {cuadrante_id: lidsToRemove.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    /*
      API Request: countCuadrantes
    */
    let cancelableApiReq = makeCancelable(api.cuadrante.getCountItems(graphqlServerUrl, searchB, ops));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(!response.data ||!response.data.data) {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'countCuadrantes', method: 'getDataB()', request: 'api.cuadrante.getCountItems'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }

        //check: countCuadrantes
        let countCuadrantes = response.data.data.countCuadrantes;
        if(countCuadrantes === null) {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = 'countCuadrantes ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'countCuadrantes', method: 'getDataB()', request: 'api.cuadrante.getCountItems'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
        
        //check: countCuadrantes type
        if(!Number.isInteger(countCuadrantes)) {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = 'countCuadrantes ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'countCuadrantes', method: 'getDataB()', request: 'api.cuadrante.getCountItems'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          newError.message = 'countCuadrantes ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'countCuadrantes', method: 'getDataB()', request: 'api.cuadrante.getCountItems'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);
        }

        //ok
        setCountB(countCuadrantes);
        

        /*
          API Request: cuadrantesConnection
        */
        let variables = {
          pagination: {
            after: isForwardPaginationB.current ? pageInfoB.current.endCursor : null,
            before: !isForwardPaginationB.current ? pageInfoB.current.startCursor : null,
            first: isForwardPaginationB.current ? rowsPerPageB : null,
            last: !isForwardPaginationB.current ? rowsPerPageB : null,
            includeCursor: includeCursorB.current,
          }
        };
        let cancelableApiReqB = makeCancelable(api.cuadrante.getItemsConnection(
          graphqlServerUrl,
          searchB,
          null, //orderBy
          null, //orderDirection
          variables,
          ops
        ));
          cancelablePromises.current.push(cancelableApiReqB);
          cancelableApiReqB
            .promise
            .then(
            //resolved
            (response) => {
              //delete from cancelables
              cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReqB), 1);
              
              //check: response data
              if(!response.data ||!response.data.data) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
                newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'cuadrantesConnection', method: 'getDataB()', request: 'api.cuadrante.getItemsConnection'}];
                newError.path=['remove', 'cuadrantes'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }
              
              //check: cuadrantesConnection
              let cuadrantesConnection = response.data.data.cuadrantesConnection;
              if(cuadrantesConnection === null) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = 'cuadrantesConnection ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
                newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'cuadrantesConnection', method: 'getDataB()', request: 'api.cuadrante.getItemsConnection'}];
                newError.path=['remove', 'cuadrantes'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }
              
                //check: cuadrantesConnection type
              if(typeof cuadrantesConnection !== 'object'
              || !Array.isArray(cuadrantesConnection.edges)
              || typeof cuadrantesConnection.pageInfo !== 'object' 
              || cuadrantesConnection.pageInfo === null) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = 'cuadrantesConnection ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
                newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'cuadrantesConnection', method: 'getDataB()', request: 'api.cuadrante.getItemsConnection'}];
                newError.path=['remove', 'cuadrantes'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }
              //get items
              let its = cuadrantesConnection.edges.map(o => o.node);
              let pi = cuadrantesConnection.pageInfo;

              //check: graphql errors
              if(response.data.errors) {
                let newError = {};
                newError.message = 'cuadrantesConnection ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
                newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'cuadrantesConnection', method: 'getDataB()', request: 'api.cuadrante.getItemsConnection'}];
                newError.path=['remove', 'cuadrantes'];
                newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);
              }

              /*
                Check: empty page
              */
              if( its.length === 0 && pi.hasPreviousPage ) 
              {
                //configure
                isOnApiRequestRefB.current = false;
                isCursorPaginatingB.current = false;
                isForwardPaginationB.current = false;
                setIsOnApiRequestB(false);
                
                //reload
                setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
                return;
              }//else

              //update pageInfo
              pageInfoB.current = pi;
              setHasPreviousPageB(pageInfoB.current.hasPreviousPage);
              setHasNextPageB(pageInfoB.current.hasNextPage);
                //ok
              setItemsB([...its]);

              //ends request
              isOnApiRequestRefB.current = false;
                isCursorPaginatingB.current = false;
              isForwardPaginationB.current = false;
                setIsOnApiRequestB(false);

              /**
                * Display graphql errors
                */
              if(errorsB.current.length > 0) {
                let newError = {};
                let withDetails=true;
                variantB.current='info';
                newError.message = 'getDataB() ' + t('modelPanels.errors.data.e3', 'fetched with errors.') + ' ('+errorsB.current.length+')';
                newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', method: 'getDataB()'}];
                newError.path=['remove', 'cuadrantes'];
                newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
              }
              return;
          },
          //rejected
          (err) => {
            throw err;
          })
          //error
          .catch((err) => { //error: on api.cuadrante.getItemsConnection
            if(err.isCanceled) {
              return;
            } else {
              let newError = {};
              let withDetails=true;
              variantB.current='error';
              newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
              newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'cuadrantesConnection', method: 'getDataB()', request: 'api.cuadrante.getItemsConnection'}];
              newError.path=['remove', 'cuadrantes'];
              newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
              errorsB.current.push(newError);
              console.log("Error: ", newError);

              showMessageB(newError.message, withDetails);
              clearRequestGetDataB();
              return;
            }
          });
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.cuadrante.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'taxon', association: 'cuadrantes', table:'B', query: 'countCuadrantes', method: 'getDataB()', request: 'api.cuadrante.getCountItems'}];
          newError.path=['remove', 'cuadrantes'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, t, dataTriggerB, searchB, rowsPerPageB]);

  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
    };
  }, []);

  useEffect(() => {
    if(idsToRemove !== undefined && Array.isArray(idsToRemove) && idsToRemove.length > 0) {
      lidsToRemove.current = Array.from(idsToRemove);
      setThereAreItemsToAdd(true);
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);

      //strict reload
      
      //configure B
      isForwardPaginationB.current = true;
      pageInfoB.current.endCursor = pageInfoB.current.startCursor;
      includeCursorB.current = true;
      //reload B
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    } else {
      isGettingFirstDataRefB.current = false; 
    }
  }, [idsToRemove]);

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
    if(!lastChangeTimestamp || !lastFetchTime.current) {
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
     * The relation 'cuadrantes' for this item was updated.
     * That is to say that the current item was associated or dis-associated with some 'cuadrantes' (from another place).
     * 
     * Actions:
     * - remove any dis-associated internalId from idsToRemove[]
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.taxon&&
        lastModelChanged.taxon[String(item.id)]&&
        lastModelChanged.taxon[String(item.id)].changedAssociations&&
        lastModelChanged.taxon[String(item.id)].changedAssociations.cuadrante_taxon_id&&
        (lastModelChanged.taxon[String(item.id)].changedAssociations.cuadrante_taxon_id.added ||
         lastModelChanged.taxon[String(item.id)].changedAssociations.cuadrante_taxon_id.removed)) {
          
          //remove any dis-associated id from idsToRemove[]
          let idsRemoved = lastModelChanged.taxon[String(item.id)].changedAssociations.cuadrante_taxon_id.idsRemoved;
          if(idsRemoved) {
            idsRemoved.forEach( (idRemoved) => {
              //remove from lidsToRemove
              let iof = lidsToRemove.current.indexOf(idRemoved);
              if(iof !== -1) { 
                lidsToRemove.current.splice(iof, 1);
                if(lidsToRemove.current.length === 0) {
                  setThereAreItemsToAdd(false);
                }
              }
              handleUntransfer('cuadrantes', idRemoved);
            });
          }

          //reload
          updateHeights();
          //strict contention
          if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
            //configure A
            isForwardPagination.current = true;
            pageInfo.current.endCursor = pageInfo.current.startCursor;
            includeCursor.current = true;
            //reload A
            setDataTrigger(prevDataTrigger => !prevDataTrigger);
          }
          //strict contention
          if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
            //configure B
            isForwardPaginationB.current = true;
            pageInfoB.current.endCursor = pageInfoB.current.startCursor;
            includeCursorB.current = true;
            //reload B
            setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
          }

          return;
    }//end: Case 1

    /*
     * Case 2:
     * The relation 'cuadrantes' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'cuadrante',
     * but this action happened on the peer relation, identified by 'cuadrante_taxon_id'.
     * 
     * Conditions:
     * A: the current item internalId is in the removedIds of the updated 'cuadrante'.
     * B: the current item internalId is in the addedIds of the updated 'cuadrante'.
     * 
     * Actions:
     * if A:
     * - remove the internalId of the 'cuadrante' from idsToRemove[].
     * - reload both transfer tables.
     * - return
     * 
     * else if B:
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.cuadrante) {
      let oens = Object.entries(lastModelChanged.cuadrante);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.cuadrante_taxon_id) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.cuadrante_taxon_id.removed) {
              let idsRemoved = entry[1].changedAssociations.cuadrante_taxon_id.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.id);
                if(iof !== -1) {
                  //remove changed item from lidsToRemove
                  let idRemoved = entry[1].newItem.cuadrante_id;
                  let iofB = lidsToRemove.current.indexOf(idRemoved);
                  if(iofB !== -1) {
                    lidsToRemove.current.splice(iofB, 1);
                    if(lidsToRemove.current.length === 0) {
                      setThereAreItemsToAdd(false);
                    }
                  }
                  handleUntransfer('cuadrantes', idRemoved);

                  //reload
                  updateHeights();
                  //strict contention
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure A
                    isForwardPagination.current = true;
                    pageInfo.current.endCursor = pageInfo.current.startCursor;
                    includeCursor.current = true;
                    //reload A
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  }
                  //strict contention
                  if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
                    //configure B
                    isForwardPaginationB.current = true;
                    pageInfoB.current.endCursor = pageInfoB.current.startCursor;
                    includeCursorB.current = true;
                    //reload B
                    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
                  }
                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.cuadrante_taxon_id.added) {
              let idsAdded = entry[1].changedAssociations.cuadrante_taxon_id.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.id);
                if(iof !== -1) {
                  //reload
                  updateHeights();
                  //strict contention
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure A
                    isForwardPagination.current = true;
                    pageInfo.current.endCursor = pageInfo.current.startCursor;
                    includeCursor.current = true;
                    //reload A
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  }
                  //strict contention
                  if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
                    //configure B
                    isForwardPaginationB.current = true;
                    pageInfoB.current.endCursor = pageInfoB.current.startCursor;
                    includeCursorB.current = true;
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
     * The attributes of some 'cuadrante' were modified or the item was deleted.
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
    if(lastModelChanged.cuadrante) {

      let oens = Object.entries(lastModelChanged.cuadrante);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.cuadrante_id;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.cuadrante_id===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.cuadrante_id===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.cuadrante_id;

          //lookup item on any tables
          let iofA = items.findIndex((item) => item.cuadrante_id===idRemoved);
          let iofB = itemsB.findIndex((item) => item.cuadrante_id===idRemoved);
          if(iofA !== -1 || iofB !== -1) {
            
            //remove deleted item from lidsToRemove
            let iofD = lidsToRemove.current.indexOf(idRemoved);
            if(iofD !== -1) {
              lidsToRemove.current.splice(iofD, 1);
              if(lidsToRemove.current.length === 0) {
                setThereAreItemsToAdd(false);
              }
            }
            handleUntransfer('cuadrantes', idRemoved);

            //reload
            updateHeights();
            //strict contention
            if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
              //configure A
              isForwardPagination.current = true;
              pageInfo.current.endCursor = pageInfo.current.startCursor;
              includeCursor.current = true;
              //reload A
              setDataTrigger(prevDataTrigger => !prevDataTrigger);
            }
            //strict contention
            if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
              //configure B
              isForwardPaginationB.current = true;
              pageInfoB.current.endCursor = pageInfoB.current.startCursor;
              includeCursorB.current = true;
              //reload B
              setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
            }
            return;
          }
        }
      });
    }//end: Case 3
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, item.id, handleUntransfer]);

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
    if (!isOnApiRequestB && isPendingApiRequestRefB.current) {
      isPendingApiRequestRefB.current = false;
      //configure
      isForwardPaginationB.current = true;
      pageInfoB.current.endCursor = pageInfoB.current.startCursor;
      includeCursorB.current = true;
      //reload
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    }
    updateHeights();
  }, [isOnApiRequestB]);

  useEffect(() => {
    if(items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }
    lastFetchTime.current = Date.now();
  }, [items]);

  useEffect(() => {
    if(itemsB.length > 0) { 
      setAreItemsReadyB(true); 
    } else { 
      setAreItemsReadyB(false); 
    }
    lastFetchTimeB.current = Date.now();
  }, [itemsB]);

  useEffect(() => {
    if(count === 0) {
      setIsCountReady(false);

    } else {
      setIsCountReady(true);
    }
  }, [count]);

  useEffect(() => {
    if(countB === 0) {
      setIsCountReadyB(false);

    } else {
      setIsCountReadyB(true);
    }
  }, [countB]);

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

  function clearRequestGetDataB() {
    //update pageInfo
    pageInfoB.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPageB(pageInfoB.current.hasPreviousPage);
    setHasNextPageB(pageInfoB.current.hasNextPage);
  
    setCountB(0);
    setItemsB([]);
    isOnApiRequestRefB.current = false;
    isCursorPaginatingB.current = false;
    includeCursorB.current = false;
    setIsOnApiRequestB(false);
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
  
  function resetPageRefs() {
    isForwardPagination.current = true;
    pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);
    includeCursor.current = false;
    pageRef.current = 0;
  }

  function resetPageRefsB() {
    isForwardPaginationB.current = true;
    pageInfoB.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPageB(pageInfoB.current.hasPreviousPage);
    setHasNextPageB(pageInfoB.current.hasNextPage);
    includeCursorB.current = false;
    pageRefB.current = 0;
  }

  function resetReloadDataA() {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure A
    resetPageRefs();
    isCursorPaginating.current = true;
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
    updateHeights();
  }

  function resetReloadDataB() {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }

    //configure B
    resetPageRefsB();
    isCursorPaginatingB.current = true;
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    updateHeights();
  }

  function reloadDataA() {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }

    //configure A
    isForwardPagination.current = true;
    pageInfo.current.endCursor = pageInfo.current.startCursor;
    includeCursor.current = true;
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
    updateHeights();
  }

  function reloadDataB() {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    
    //configure B
    isForwardPaginationB.current = true;
    pageInfoB.current.endCursor = pageInfoB.current.startCursor;
    includeCursorB.current = true;
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    updateHeights();
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

  const handleSearchEnterB = text => {
    updateHeights();

    if(text !== searchB)
    {
      resetPageRefsB();
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
  
      //configure
      isCursorPaginating.current = true;
      includeCursor.current = false;
      isForwardPagination.current = true;
      pageInfo.current.endCursor = null;
  
      //reload A
      updateHeights();
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    };
    const handleFirstPageButtonClickB = (event) => {
      //strict contention
      if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
  
      //configure
      isCursorPaginatingB.current = true;
      includeCursorB.current = false;
      isForwardPaginationB.current = true;
      pageInfoB.current.endCursor = null;
  
      //reload B
      updateHeights();
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    };
  
    const handleLastPageButtonClick = (event) => {
      //strict contention
      if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
  
      //configure
      isCursorPaginating.current = true;
      includeCursor.current = false;
      isForwardPagination.current = false;
      pageInfo.current.startCursor = null;
  
      //reload A
      updateHeights();
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    };
    const handleLastPageButtonClickB = (event) => {
      //strict contention
      if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
  
      //configure
      isCursorPaginatingB.current = true;
      includeCursorB.current = false;
      isForwardPaginationB.current = false;
      pageInfoB.current.startCursor = null;
  
      //reload B
      updateHeights();
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    };
  
    const handleNextButtonClick = (event) => {
      //strict contention
      if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
  
      //configure
      isCursorPaginating.current = true;
      includeCursor.current = false;
      isForwardPagination.current = true;
  
      //reload A
      updateHeights();
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    };
    const handleNextButtonClickB = (event) => {
      //strict contention
      if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
  
      //configure
      isCursorPaginatingB.current = true;
      includeCursorB.current = false;
      isForwardPaginationB.current = true;
  
      //reload B
      updateHeights();
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    };
  
    const handleBackButtonClick = (event) => {
      //strict contention
      if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
  
      //configure
      isCursorPaginating.current = true;
      includeCursor.current = false;
      isForwardPagination.current = false;
  
      //reload A
      updateHeights();
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    };
    const handleBackButtonClickB = (event) => {
      //strict contention
      if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
  
      //configure
      isCursorPaginatingB.current = true;
      includeCursorB.current = false;
      isForwardPaginationB.current = false;
  
      //reload B
      updateHeights();
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    };
    

  const handleChangeRowsPerPage = event => {
    if(event.target.value !== rowsPerPage)
    {
      resetPageRefs();
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }

      updateHeights();
      setRowsPerPage(parseInt(event.target.value, 10));
    }
  };

  const handleChangeRowsPerPageB = event => {
    if(event.target.value !== rowsPerPageB)
    {
      resetPageRefsB();
      if(pageB !== 0) {
        isGettingFirstDataRefB.current = true; //avoids to get data on [pageB] effect
        setPageB(0);
      }
      setRowsPerPageB(parseInt(event.target.value, 10));
    }
  };

  const handleReloadClick = (event) => {
    resetReloadDataA();
  };
  const handleReloadClickB = (event) => {
    resetReloadDataB();
  };

  /*
   * Items handlers
   */
  const handleRowClicked = (event, item) => {
    handleClickOnCuadranteRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToRemove.current.indexOf(item.cuadrante_id) === -1) {
      lidsToRemove.current.push(item.cuadrante_id);
      setThereAreItemsToAdd(true);
      updateHeights();
      //reload A
      reloadDataA();
      //reload B (full)
      resetReloadDataB();
      handleTransfer('cuadrantes', item.cuadrante_id);
    }
  };

  const handleRemoveItem = (event, item) => {
    let iof = lidsToRemove.current.indexOf(item.cuadrante_id);
    if(iof !== -1) { 
      lidsToRemove.current.splice(iof, 1);

      if(lidsToRemove.current.length === 0) {
        setThereAreItemsToAdd(false);
      }
      updateHeights();
      //reload A (full)
      resetReloadDataA();
      //reload B
      reloadDataB();
      handleUntransfer('cuadrantes', item.cuadrante_id);
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
              <CuadrantesToRemoveTransferViewToolbar
                title={'Cuadrantes'}
                titleIcon={1}
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
                  <div id='CuadrantesToRemoveTransferView-div-noDataA'>
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
              {(!isOnApiRequest && areItemsReady && isCountReady) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lref}>
                    <List id='CuadrantesToRemoveTransferView-list-listA'
                      dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.cuadrante_id;
                        let label = it.nombre_comun_grupo_enfoque;
                        let sublabel = undefined;
                        let disabled = lidsToRemove.current.find(cuadrante_id=> cuadrante_id=== it.cuadrante_id) !== undefined;

                        return (
                          <ListItem 
                            id={'CuadrantesToRemoveTransferView-listA-listItem-'+it.cuadrante_id}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'cuadrante' }>
                                <Avatar>{"cuadrante".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'cuadrante_id' }>
                                        <Typography variant="body1" display="block" noWrap={true}>{it.cuadrante_id}</Typography>
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
                                    <Tooltip title={ 'nombre_comun_grupo_enfoque' }>
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
                                    id={'CuadrantesToRemoveTransferView-listA-listItem-'+it.cuadrante_id+'-button-remove'}
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
              <CuadrantesToRemoveTransferViewCursorPagination
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
                          <stop offset="30%" stopColor={(countB&&countB>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(count&&count>0) ? "#F50057" : blueGrey[200]} />
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
                          <stop offset="30%" stopColor={(countB&&countB>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(count&&count>0) ? "#F50057" : blueGrey[200]} />
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
              <CuadrantesToRemoveTransferViewToolbar 
                title={'Cuadrantes'}
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
                  <div id='CuadrantesToRemoveTransferView-div-noItemsB'>
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
              {(thereAreItemsToAdd && !isOnApiRequestB && (!areItemsReadyB || !isCountReadyB)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='CuadrantesToRemoveTransferView-div-noDataB'>
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
              {(thereAreItemsToAdd && !isOnApiRequestB && areItemsReadyB && isCountReadyB) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lrefB}>
                    <List id='CuadrantesToRemoveTransferView-list-listB'
                      dense component="div" role="list">
                      {itemsB.map(it => {
                        let key = it.cuadrante_id;
                        let label = it.nombre_comun_grupo_enfoque;
                        let sublabel = undefined;

                        return (
                          <ListItem 
                            id={'CuadrantesToRemoveTransferView-listB-listItem-'+it.cuadrante_id}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'cuadrante' }>
                                <Avatar>{"cuadrante".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'cuadrante_id' }>
                                        <Typography variant="body1" display="block" noWrap={true}>{it.cuadrante_id}</Typography>
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
                                    <Tooltip title={ 'nombre_comun_grupo_enfoque' }>
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
                                  id={'CuadrantesToRemoveTransferView-listB-listItem-'+it.cuadrante_id+'-button-remove'}
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
              {(true) && (
                
                <CuadrantesToRemoveTransferViewCursorPagination
                  count={countB}
                  rowsPerPageOptions={(countB <=10) ? [] : (count <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
                  rowsPerPage={(countB <=10) ? '' : rowsPerPageB}
                  labelRowsPerPage = { t('modelPanels.rows') }
                  hasNextPage={hasNextPageB}
                  hasPreviousPage={hasPreviousPageB}
                  handleFirstPageButtonClick={handleFirstPageButtonClickB}
                  handleLastPageButtonClick={handleLastPageButtonClickB}
                  handleNextButtonClick={handleNextButtonClickB}
                  handleBackButtonClick={handleBackButtonClickB}
                  handleChangeRowsPerPage={handleChangeRowsPerPageB}
                />
              )}
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

CuadrantesToRemoveTransferView.propTypes = {
    item: PropTypes.object.isRequired,
    idsToRemove: PropTypes.array.isRequired,
    handleTransfer: PropTypes.func.isRequired,
    handleUntransfer: PropTypes.func.isRequired,
    handleClickOnCuadranteRow: PropTypes.func.isRequired,
};