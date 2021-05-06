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
import TipoPlantaToAddTransferViewToolbar from './components/Tipo_plantaToAddTransferViewToolbar';
import TipoPlantaToAddTransferViewCursorPagination from './components/Tipo_plantaToAddTransferViewCursorPagination';
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

export default function TipoPlantaToAddTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    idsToAdd,
    handleTransfer,
    handleUntransfer,
    handleClickOnTipo_plantaRow,
  } = props;

  /*
    State Table A (available)
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
    State Table B (to add)
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

  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState((idsToAdd && Array.isArray(idsToAdd) && idsToAdd.length > 0));
  const lidsToAdd = useRef((idsToAdd && Array.isArray(idsToAdd)) ? Array.from(idsToAdd) : []);
  
  //associated ids
  const lidsAssociated = useRef(undefined);
  const [associatedItem, setAssociatedItem] = useState(null);


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
      API Request: readOneCuadrante
    */
    let cancelableApiReq = makeCancelable(api.cuadrante.getAssociatedTipo_plantaConnection(graphqlServerUrl, item.cuadrante_id));  
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
          variant.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'readOneCuadrante', method: 'getData()', request: 'api.cuadrante.getAssociatedTipo_plantaConnection'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: readOneCuadrante
        let readOneCuadrante = response.data.data.readOneCuadrante;
        if(readOneCuadrante === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneCuadrante ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'readOneCuadrante', method: 'getData()', request: 'api.cuadrante.getAssociatedTipo_plantaConnection'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        //check: readOneCuadrante type
        if(typeof readOneCuadrante !== 'object'
        || typeof readOneCuadrante.tipo_planta!== 'object' //can be null
        ) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'readOneCuadrante ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'readOneCuadrante', method: 'getData()', request: 'api.cuadrante.getAssociatedTipo_plantaConnection'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        //get item
        let idso = readOneCuadrante.tipo_planta;

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          newError.message = 'readOneCuadrante ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'readOneCuadrante', method: 'getData()', request: 'api.cuadrante.getAssociatedTipo_plantaConnection'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
        }

        //ok
        //set associated id
        lidsAssociated.current = (idso !== null) ? [idso.tipo_planta_id] : [];
        setAssociatedItem((idso !== null) ? {...idso} : null);
        
        /**
         * To do:
         * Associated id, if exist, will be excluded from 
         * TableA (to associate items).
         * 
         * The current associated item will be deleted if:
         * a) is marked to delete in the current associated item component, or
         * b) another item is in the to_add list.
         */
        //set ops: excluded ids: toAddId + associatedId
        let ops = null;
        //let exIds = lidsToAdd.current.concat(lidsAssociated.current);
        let exIds = lidsToAdd.current;
        if(exIds.length > 0) {
          ops = {
            exclude: [{
              type: 'String',
              values: {tipo_planta_id: exIds}
            }]
          };
        }
        /*
          API Request: countTipo_planta
        */
        let cancelableApiReqB = makeCancelable(api.tipo_planta.getCountItems(graphqlServerUrl, search, ops));
        cancelablePromises.current.push(cancelableApiReqB);
        cancelableApiReqB
          .promise
          .then(
          //resolved
          (response)=> {
            //delete from cancelables
            cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReqB), 1);
            
            //check: response data
            if(!response.data ||!response.data.data) {
              let newError = {};
              let withDetails=true;
              variant.current='error';
              newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
              newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
              newError.path=['add', 'tipo_planta'];
              newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
              errors.current.push(newError);
              console.log("Error: ", newError);

              showMessage(newError.message, withDetails);
              clearRequestGetData();
              return;
            }

            //check: countTipo_planta
            let countTipo_planta = response.data.data.countTipo_planta;
            if(countTipo_planta === null) {
              let newError = {};
              let withDetails=true;
              variant.current='error';
              newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
              newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
              newError.path=['add', 'tipo_planta'];
              newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
              errors.current.push(newError);
              console.log("Error: ", newError);

              showMessage(newError.message, withDetails);
              clearRequestGetData();
              return;
            }
            
            //check: countTipo_planta type
            if(!Number.isInteger(countTipo_planta)) {
              let newError = {};
              let withDetails=true;
              variant.current='error';
              newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
              newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
              newError.path=['add', 'tipo_planta'];
              newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
              errors.current.push(newError);
              console.log("Error: ", newError);

              showMessage(newError.message, withDetails);
              clearRequestGetData();
              return;
            }

            //check: graphql errors
            if(response.data.errors) {
              let newError = {};
              newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
              newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
              newError.path=['add', 'tipo_planta'];
              newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
              errors.current.push(newError);
              console.log("Error: ", newError);
            }

            //ok
            setCount(countTipo_planta);


            /*
              API Request: tipo_plantaConnection
            */
            let variables = {
              pagination: {
                after: isForwardPagination.current ? pageInfo.current.endCursor : null,
                before: !isForwardPagination.current ? pageInfo.current.startCursor : null,
                first: isForwardPagination.current ? rowsPerPage : null,
                last: !isForwardPagination.current ? rowsPerPage : null,
                includeCursor: includeCursor.current,
              }
            };
            let cancelableApiReqC = makeCancelable(api.tipo_planta.getItemsConnection(
              graphqlServerUrl,
              search,
              null, //orderBy
              null, //orderDirection
              variables,
              ops
            ));
            cancelablePromises.current.push(cancelableApiReqC);
            cancelableApiReqC
              .promise
              .then(
              //resolved
              (response) => {
                //delete from cancelables
                cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReqC), 1);
                
                //check: response data
                if(!response.data ||!response.data.data) {
                  let newError = {};
                  let withDetails=true;
                  variant.current='error';
                  newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
                  newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                  newError.path=['add', 'tipo_planta'];
                  newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                  errors.current.push(newError);
                  console.log("Error: ", newError);

                  showMessage(newError.message, withDetails);
                  clearRequestGetData();
                  return;
                }

                //check: tipo_plantaConnection
                let tipo_plantaConnection = response.data.data.tipo_plantaConnection;
                if(tipo_plantaConnection === null) {
                  let newError = {};
                  let withDetails=true;
                  variant.current='error';
                  newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
                  newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                  newError.path=['add', 'tipo_planta'];
                  newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                  errors.current.push(newError);
                  console.log("Error: ", newError);

                  showMessage(newError.message, withDetails);
                  clearRequestGetData();
                  return;
                }

                  //check: tipo_plantaConnection type
                  if(typeof tipo_plantaConnection !== 'object'
                  || !Array.isArray(tipo_plantaConnection.edges)
                  || typeof tipo_plantaConnection.pageInfo !== 'object' 
                  || tipo_plantaConnection.pageInfo === null) {
                    let newError = {};
                    let withDetails=true;
                    variant.current='error';
                    newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
                    newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                    newError.path=['add', 'tipo_planta'];
                    newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                    errors.current.push(newError);
                    console.log("Error: ", newError);

                    showMessage(newError.message, withDetails);
                    clearRequestGetData();
                    return;
                  }
                  //get items
                  let its = tipo_plantaConnection.edges.map(o => o.node);
                  let pi = tipo_plantaConnection.pageInfo;                      

                  //check: graphql errors
                  if(response.data.errors) {
                    let newError = {};
                    newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
                    newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                    newError.path=['add', 'tipo_planta'];
                    newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
                    errors.current.push(newError);
                    console.log("Error: ", newError);
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
                  setItems([...its]);

                  //ends request
                  isOnApiRequestRef.current = false;
                  isCursorPaginating.current = false;
                  includeCursor.current = false;
                  setIsOnApiRequest(false);

                  /**
                   * Display graphql errors
                   */
                  if(errors.current.length > 0) {
                    let newError = {};
                    let withDetails=true;
                    variant.current='info';
                    newError.message = 'getData() ' + t('modelPanels.errors.data.e3', 'fetched with errors.') + ' ('+errors.current.length+')';
                    newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', method: 'getData()'}];
                    newError.path=['add', 'tipo_planta'];
                    newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
                    errors.current.push(newError);
                    console.log("Error: ", newError);

                    showMessage(newError.message, withDetails);
                  }

                  return;
                },
                //rejected
                (err) => {
                  throw err;
                })
                //error
                .catch((err) => { //error: on api.tipo_planta.getItemsConnection
                  if(err.isCanceled) {
                    return;
                  } else {
                    let newError = {};
                    let withDetails=true;
                    variant.current='error';
                    newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
                    newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                    newError.path=['add', 'tipo_planta'];
                    newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
                    errors.current.push(newError);
                    console.log("Error: ", newError);
    
                    showMessage(newError.message, withDetails);
                    clearRequestGetData();
                    return;
                  }
                });
          },
          //rejected
          (err) => {
            throw err;
          })
          //error
          .catch((err) => { //error: on api.tipo_planta.getCountItems
            if(err.isCanceled) {
              return
            } else {
              let newError = {};
              let withDetails=true;
              variant.current='error';
              newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
              newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
              newError.path=['add', 'tipo_planta'];
              newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
              errors.current.push(newError);
              console.log("Error: ", newError);

              showMessage(newError.message, withDetails);
              clearRequestGetData();
              return;
            }
          });
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.cuadrante.getAssociatedTipo_plantaConnection
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'A', query: 'readOneCuadrante', method: 'getData()', request: 'api.cuadrante.getAssociatedTipo_plantaConnection'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, t, dataTrigger, item.cuadrante_id, search, rowsPerPage]);

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

    //set ops: only ids
    let ops = null;
    if(lidsToAdd.current !== undefined && lidsToAdd.current.length > 0) {
      ops = {
        only: [{
          type: 'String',
          values: {tipo_planta_id: lidsToAdd.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    /*
      API Request: countItems
    */
    let cancelableApiReq = makeCancelable(api.tipo_planta.getCountItems(graphqlServerUrl, searchB, ops));
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
          variantB.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'countTipo_planta', method: 'getDataB()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }

        //check: countTipo_planta
        let countTipo_planta = response.data.data.countTipo_planta;
        if(countTipo_planta === null) {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'countTipo_planta', method: 'getDataB()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
        
        //check: countTipo_planta type
        if(!Number.isInteger(countTipo_planta)) {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'countTipo_planta', method: 'getDataB()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['add', 'tipo_planta'];
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
          newError.message = 'countTipo_planta ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'countTipo_planta', method: 'getDataB()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);
        }
        
        //ok
        setCountB(countTipo_planta);


          /*
            API Request: items
          */
          /*
            API Request: tipo_plantaConnection
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
          let cancelableApiReqB = makeCancelable(api.tipo_planta.getItemsConnection(
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
            (response) => {
              //delete from cancelables
              cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReqB), 1);
              
              //check: response data
              if(!response.data ||!response.data.data) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'tipo_plantaConnection', method: 'getDataB()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['add', 'tipo_planta'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }

              //check: tipo_plantaConnection
              let tipo_plantaConnection = response.data.data.tipo_plantaConnection;
              if(tipo_plantaConnection === null) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'tipo_plantaConnection', method: 'getDataB()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['add', 'tipo_planta'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }

              //check: tipo_plantaConnection type
              if(typeof tipo_plantaConnection !== 'object'
              || !Array.isArray(tipo_plantaConnection.edges)
              || typeof tipo_plantaConnection.pageInfo !== 'object' 
              || tipo_plantaConnection.pageInfo === null) {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'tipo_plantaConnection', method: 'getDataB()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['add', 'tipo_planta'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errorsB.current.push(newError);
                console.log("Error: ", newError);

                showMessageB(newError.message, withDetails);
                clearRequestGetDataB();
                return;
              }
              //get items
              let its = tipo_plantaConnection.edges.map(o => o.node);
              let pi = tipo_plantaConnection.pageInfo;

              //check: graphql errors
              if(response.data.errors) {
                let newError = {};
                newError.message = 'tipo_plantaConnection ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'tipo_plantaConnection', method: 'getDataB()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['add', 'tipo_planta'];
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
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', method: 'getDataB()'}];
                newError.path=['add', 'tipo_planta'];
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
            .catch((err) => { //error: on api.tipo_planta.getItemsConnection
              if(err.isCanceled) {
                return;
              } else {
                let newError = {};
                let withDetails=true;
                variantB.current='error';
                newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
                newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'tipo_plantaConnection', method: 'getDataB()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['add', 'tipo_planta'];
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
      .catch((err) => { //error: on api.tipo_planta.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'cuadrante', association: 'tipo_planta', table:'B', query: 'countTipo_planta', method: 'getDataB()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['add', 'tipo_planta'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, t, dataTriggerB, searchB, rowsPerPageB]);

  /**
   * Effects
   */

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
     * The relation 'tipo_planta' for this item was updated.
     * That is to say that the current item was associated or dis-associated with some 'tipo_planta', 
     * from this relation (in another place).
     * 
     * Actions:
     * - remove any dis-associated internalId from idsToAdd[]
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.cuadrante&&
        lastModelChanged.cuadrante[String(item.cuadrante_id)]&&
        lastModelChanged.cuadrante[String(item.cuadrante_id)].changedAssociations&&
        lastModelChanged.cuadrante[String(item.cuadrante_id)].changedAssociations.cuadrante_tipo_planta_id&&
        (lastModelChanged.cuadrante[String(item.cuadrante_id)].changedAssociations.cuadrante_tipo_planta_id.added ||
         lastModelChanged.cuadrante[String(item.cuadrante_id)].changedAssociations.cuadrante_tipo_planta_id.removed)) {
          
          //remove any dis-associated internalId from idsToAdd[]
          let idsRemoved = lastModelChanged.cuadrante[String(item.cuadrante_id)].changedAssociations.cuadrante_tipo_planta_id.idsRemoved;
          if(idsRemoved) {
            idsRemoved.forEach( (idRemoved) => {
              //remove from lidsToAdd
              let iof = lidsToAdd.current.indexOf(idRemoved);
              if(iof !== -1) { 
                lidsToAdd.current.splice(iof, 1);
                if(lidsToAdd.current.length === 0) {
                  setThereAreItemsToAdd(false);
                }
              }
              handleUntransfer('tipo_planta', idRemoved);
            });
          }

          //clear associatedIds[] (they will be re-fetch on next getData()).
          lidsAssociated.current = undefined;

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
     * The relation 'tipo_planta' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'tipo_planta',
     * but this action happened on the peer relation, identified by 'cuadrante_tipo_planta_id'.
     * 
     * Conditions:
     * A: the current item internalId is in the removedIds of the updated 'tipo_planta'.
     * B: the current item internalId is in the addedIds of the updated 'tipo_planta'.
     * 
     * Actions:
     * if A:
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     * 
     * else if B:
     * - remove the internalId of the 'tipo_planta' from idsToAdd[].
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.tipo_planta) {
      let oens = Object.entries(lastModelChanged.tipo_planta);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.cuadrante_tipo_planta_id) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.cuadrante_tipo_planta_id.removed) {
              let idsRemoved = entry[1].changedAssociations.cuadrante_tipo_planta_id.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.cuadrante_id);
                if(iof !== -1) {
                  //clear associatedIds[] (they will be re-fetched on next getData()).
                  lidsAssociated.current = undefined;

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
            if(entry[1].changedAssociations.cuadrante_tipo_planta_id.added) {
              let idsAdded = entry[1].changedAssociations.cuadrante_tipo_planta_id.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.cuadrante_id);
                if(iof !== -1) {
                  //remove changed item from lidsToAdd
                  let idAdded = entry[1].newItem.tipo_planta_id;
                  let iofB = lidsToAdd.current.indexOf(idAdded);
                  if(iofB !== -1) {
                    lidsToAdd.current.splice(iofB, 1);
                    if(lidsToAdd.current.length === 0) {
                      setThereAreItemsToAdd(false);
                    }
                  }
                  handleUntransfer('tipo_planta', idAdded);

                  //clear associatedIds[] (they will be re-fetch on next getData()).
                  lidsAssociated.current = undefined;

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
     * The attributes of some 'tipo_planta' were modified or the item was deleted.
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
    if(lastModelChanged.tipo_planta) {

      let oens = Object.entries(lastModelChanged.tipo_planta);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.tipo_planta_id;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.tipo_planta_id===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.tipo_planta_id===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.tipo_planta_id;

          //lookup item on any tables or associated ids
          let iofA = items.findIndex((item) => item.tipo_planta_id===idRemoved);
          let iofB = itemsB.findIndex((item) => item.tipo_planta_id===idRemoved);
          let iofC = lidsAssociated.current.indexOf(idRemoved);
          if(iofA !== -1 || iofB !== -1 || iofC !== -1) {
            
            //remove deleted item from lidsToAdd
            let iofD = lidsToAdd.current.indexOf(idRemoved);
            if(iofD !== -1) {
              lidsToAdd.current.splice(iofD, 1);
              if(lidsToAdd.current.length === 0) {
                setThereAreItemsToAdd(false);
              }
            }
            handleUntransfer('tipo_planta', idRemoved);

            //clear associatedIds[] (they will be re-fetch on next getData()).
            lidsAssociated.current = undefined;

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
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, item.cuadrante_id, handleUntransfer]);

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
    handleClickOnTipo_plantaRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToAdd.current.indexOf(item.tipo_planta_id) === -1) {
      lidsToAdd.current = [];
      lidsToAdd.current.push(item.tipo_planta_id);
      setThereAreItemsToAdd(true);
      updateHeights();
      //reload A
      reloadDataA();
      //reload B (full)
      resetReloadDataB();
      handleTransfer('tipo_planta', item.tipo_planta_id);
    }
  };

  const handleRemoveItem = (event, item) => {
    if(lidsToAdd.current.length > 0) {
      lidsToAdd.current = [];
      setThereAreItemsToAdd(false);
      updateHeights();
      //reload A (full)
      resetReloadDataA();
      //reload B
      reloadDataB();
      handleUntransfer('tipo_planta', item.tipo_planta_id);
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
              <TipoPlantaToAddTransferViewToolbar
                title={'Tipo_planta'}
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
                  <div id='TipoPlantaToAddTransferView-div-noDataA'>
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
                    <List id='TipoPlantaToAddTransferView-list-listA'
                    dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.tipo_planta_id;
                        let label = it.grupo_id;
                        let sublabel = it.fecha;
                        
                        return (
                          <ListItem 
                            id={'TipoPlantaToAddTransferView-listA-listItem-'+it.tipo_planta_id}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? 'tipo_planta — ' + t('modelPanels.associatedRecord', 'Associated record') : 'tipo_planta '}>
                                <Avatar>
                                  {"tipo_planta".slice(0,1)}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* cuadrante_id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'tipo_planta_id' }>
                                        <Typography 
                                        id={'TipoPlantaToAddTransferView-listA-listItem-id-'+it.tipo_planta_id}
                                        variant="body1" display="block" noWrap={true}>{it.tipo_planta_id}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? t('modelPanels.internalId', 'Unique Identifier') + ' — ' + t('modelPanels.associatedRecord', 'Associated record') : t('modelPanels.internalId', 'Unique Identifier')}>
                                        <Key fontSize="small" style={{ marginTop:8, color: (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? green[500] : grey[400]}} />
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
                                      <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ 'fecha' }>
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
                                  id={'TipoPlantaToAddTransferView-listA-listItem-'+it.tipo_planta_id+'-button-add'}
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
              <TipoPlantaToAddTransferViewCursorPagination
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
                        <linearGradient id="gradient1">
                          <stop offset="30%" stopColor={(countB&&countB>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(count&&count>0) ? "#4CAF50" : blueGrey[200]} />
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
                          <stop offset="30%" stopColor={(countB&&countB>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(count&&count>0) ? "#4CAF50" : blueGrey[200]} />
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
            <Card className={classes.card}>

              {/* Toolbar */}
              <TipoPlantaToAddTransferViewToolbar 
                title={'Tipo_planta'}
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
                  <div id='TipoPlantaToAddTransferView-div-noItemsB'>
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
              {(thereAreItemsToAdd && !isOnApiRequestB && (!areItemsReadyB || !isCountReadyB)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='TipoPlantaToAddTransferView-div-noDataB'>
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
                    <List id='TipoPlantaToAddTransferView-list-listB'
                      dense component="div" role="list">
                      {itemsB.map(it => {
                        let key = it.tipo_planta_id;
                        let label = it.grupo_id;
                        let sublabel = it.fecha;

                        
                        return (
                          <ListItem 
                            id={'TipoPlantaToAddTransferView-listB-listItem-'+it.tipo_planta_id}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? 'tipo_planta — ' + t('modelPanels.associatedRecord', 'Associated record') : 'tipo_planta '}>
                                <Avatar>
                                  {"tipo_planta".slice(0,1)}
                                </Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* cuadrante_id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'tipo_planta_id' }>
                                        <Typography 
                                        id={'TipoPlantaToAddTransferView-listB-listItem-id-'+it.tipo_planta_id}
                                        variant="body1" display="block" noWrap={true}>{it.tipo_planta_id}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? t('modelPanels.internalId', 'Unique Identifier') + ' — ' + t('modelPanels.associatedRecord', 'Associated record') : t('modelPanels.internalId', 'Unique Identifier')}>
                                        <Key fontSize="small" style={{ marginTop:8, color: (associatedItem&&associatedItem.tipo_planta_id===it.tipo_planta_id) ? green[500] : grey[400]}} />
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
                                      <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ 'fecha' }>
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
                                  id={'TipoPlantaToAddTransferView-listB-listItem-'+it.tipo_planta_id+'-button-remove'}
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
              {(false) && (
                
                <TipoPlantaToAddTransferViewCursorPagination
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
TipoPlantaToAddTransferView.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  handleTransfer: PropTypes.func.isRequired,
  handleUntransfer: PropTypes.func.isRequired,
  handleClickOnTipo_plantaRow: PropTypes.func.isRequired,
};