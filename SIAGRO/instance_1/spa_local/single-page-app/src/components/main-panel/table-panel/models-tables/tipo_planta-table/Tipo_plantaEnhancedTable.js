import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changesCompleted, clearChanges } from '../../../../../store/actions'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import api from '../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../utils'
import TipoPlantaEnhancedTableHead from './components/Tipo_plantaEnhancedTableHead'
import TipoPlantaEnhancedTableToolbar from './components/Tipo_plantaEnhancedTableToolbar'
import TipoPlantaCreatePanel from './components/tipo_planta-create-panel/Tipo_plantaCreatePanel'
import TipoPlantaUpdatePanel from './components/tipo_planta-update-panel/Tipo_plantaUpdatePanel'
import TipoPlantaDetailPanel from './components/tipo_planta-detail-panel/Tipo_plantaDetailPanel'
import TipoPlantaDeleteConfirmationDialog from './components/Tipo_plantaDeleteConfirmationDialog'
import TipoPlantaUploadFileDialog from './components/Tipo_plantaUploadFileDialog'
import TipoPlantaCursorPagination from './components/Tipo_plantaCursorPagination'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import SwipeableViews from 'react-swipeable-views';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import SeeInfo from '@material-ui/icons/VisibilityTwoTone';
//Plotly
import TipoPlantaPlotly from '../../../../plots/Tipo_plantaPlotly';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(7),
    },
    paper: {
        overflowX: 'auto',
    },
    tableWrapper: {
      height: '64vh',
      maxHeight: '64vh',
      overflow: 'auto',
      position: 'relative',
    },
    loading: {
      height: '64vh',
      maxHeight: '64vh',
    },
    noData: {
      height: '64vh',
      maxHeight: '64vh',
    },
    iconSee: {
      '&:hover': {
        color: '#3f51b5'
      }
    },
    iconEdit: {
      '&:hover': {
        color: '#3f51b5'
      }
    },
    iconDelete: {
      '&:hover': {
        color: '#f50057'
      }
    },
    tableBackdrop: {
      WebkitTapHighlightColor: 'transparent',
      minWidth: '100%',
      minHeight: '100%'
    },
    tableBackdropContent: {
      width: '100%',
      height: '100%'
    },
}));

export default function TipoPlantaEnhancedTable(props) {
  const classes = useStyles();
  const { permissions } = props;
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('tipo_planta_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(25);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageInfo = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const paginationRef = useRef({first: rowsPerPage, after: null, last: null, before: null, includeCursor: false});
  const isForwardPagination = useRef(true);
  const isCursorPaginating = useRef(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(undefined);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(undefined);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteConfirmationItem, setDeleteConfirmationItem] = useState(undefined);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);

  const cancelablePromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const changes = useSelector(state => state.changes);
  const dispatch = useDispatch();

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

  //toggle buttons
  const [toggleButtonValue, setToggleButtonValue] = useState('table');

  //table w&h
  const tref = useRef(null);
  const [tw, setTw] = useState('100%');
  const [th, setTh] = useState('100%');

  //table wrapper scroll left position
  const twref = useRef(null);
  const [tscl, setTscl] = useState(0);

  /**
   * Callbacks:
   *  showMessage
   *  configurePagination
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

  /**
   * clearRequestGetData
   * 
   * Clear all configurations related to an api request.
   * Also clears table data and count.
   */
  const clearRequestGetData = useCallback(() => {
    //configure pagination
    configurePagination('reset');

    setCount(0);
    setItems([]);
    isOnApiRequestRef.current = false;
    isCursorPaginating.current = false;
    setIsOnApiRequest(false);
  },[configurePagination])

  /**
    * getData
    * 
    * Get @items and @count from GrahpQL Server.
    * Uses current state properties to fill query request.
    * Updates state to inform new @items and @count retreived.
    * 
    */
  const getData = useCallback(() => {
    updateSizes();
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    /*
      API Request: countTipo_planta
    */
    let cancelableApiReq = makeCancelable(api.tipo_planta.getCountItems(graphqlServerUrl, search));
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
          newError.locations=[{model: 'tipo_planta', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['Tipo_planta'];
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
          newError.locations=[{model: 'tipo_planta', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['Tipo_planta'];
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
          newError.locations=[{model: 'tipo_planta', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['Tipo_planta'];
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
          newError.locations=[{model: 'tipo_planta', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['Tipo_planta'];
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
            pagination: {...paginationRef.current}
          };
          let cancelableApiReqB = makeCancelable(api.tipo_planta.getItemsConnection(
            graphqlServerUrl,
            search,
            orderBy,
            order,
            variables
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
                variant.current='error';
                newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
                newError.locations=[{model: 'tipo_planta', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['Tipo_planta'];
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
                newError.locations=[{model: 'tipo_planta', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['Tipo_planta'];
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
                newError.locations=[{model: 'tipo_planta', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['Tipo_planta'];
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
                newError.locations=[{model: 'tipo_planta', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['Tipo_planta'];
                newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);
              }
                
              /*
                Check: empty page
              */
              if( its.length === 0 && pi && pi.hasPreviousPage ) 
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

              //configure pagination (default)
              configurePagination('reload');
              
              //ok
              setItems([...its]);

              //ends request
              isOnApiRequestRef.current = false;
              isCursorPaginating.current = false;
              setIsOnApiRequest(false);

              /**
               * Display graphql errors
               */
              if(errors.current.length > 0) {
                let newError = {};
                let withDetails=true;
                variant.current='info';
                newError.message = 'getData() ' + t('modelPanels.errors.data.e3', 'fetched with errors.') + ' ('+errors.current.length+')';
                newError.locations=[{model: 'tipo_planta', method: 'getData()'}];
                newError.path=['Tipo_planta'];
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
                newError.locations=[{model: 'tipo_planta', query: 'tipo_plantaConnection', method: 'getData()', request: 'api.tipo_planta.getItemsConnection'}];
                newError.path=['Tipo_planta'];
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
          newError.locations=[{model: 'tipo_planta', query: 'countTipo_planta', method: 'getData()', request: 'api.tipo_planta.getCountItems'}];
          newError.path=['Tipo_planta'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, t, dataTrigger, search, orderBy, order, showMessage, clearRequestGetData, configurePagination]);

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
    if(changes&&changes.changesCompleted) {
      //if there were changes
      if(changes.models&&
          (Object.keys(changes.models).length>0)) {
            //strict contention
            if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
              //configure pagination
              configurePagination('reload');
              //reload
              setDataTrigger(prevDataTrigger => !prevDataTrigger);
            }
      }
      //clear changes state
      dispatch(clearChanges());
    }
  }, [changes, dispatch, configurePagination]);

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

      //configure pagination
      configurePagination('reload');
      //reload    
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    }
    updateSizes();
  }, [isOnApiRequest, configurePagination]);

  useEffect(() => {
    if (updateItem !== undefined) {
      setUpdateDialogOpen(true);
    }
  }, [updateItem]);

  useEffect(() => {
    if (detailItem !== undefined) {
      setDetailDialogOpen(true);
    }
  }, [detailItem]);

  useEffect(() => {
    if (deleteConfirmationItem !== undefined) {
      setDeleteConfirmationDialogOpen(true);
    }
  }, [deleteConfirmationItem]);

  /**
    * doDelete
    * 
    * Delete @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item deleted.
    * 
    */
  function doDelete(event, item) {
    errors.current = [];

    let variables = {};
    //set tipo_planta_id (internalId)
    variables.tipo_planta_id = item.tipo_planta_id;

    /*
      API Request: deleteTipo_planta
    */
    let cancelableApiReq = makeCancelable(api.tipo_planta.deleteItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response

        //check: response data
        if(!response.data ||!response.data.data) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.data.e1', 'No data was received from the server.');
          newError.locations=[{model: 'tipo_planta', query: 'deleteTipo_planta', method: 'doDelete()', request: 'api.tipo_planta.deleteItem'}];
          newError.path=['Tipo_planta', `tipo_planta_id:${item.tipo_planta_id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        //check: deleteTipo_planta
        let deleteTipo_planta = response.data.data.deleteTipo_planta;
        if(deleteTipo_planta === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'deleteTipo_planta ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'tipo_planta', query: 'deleteTipo_planta', method: 'doDelete()', request: 'api.tipo_planta.deleteItem'}];
          newError.path=['Tipo_planta', `tipo_planta_id:${item.tipo_planta_id}` ,'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        /**
         * Type of deleteTipo_planta is not validated. Only not null is
         * checked above to confirm successfull operation.
         */

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'deleteTipo_planta ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'tipo_planta', query: 'deleteTipo_planta', method: 'doDelete()', request: 'api.tipo_planta.deleteItem'}];
          newError.path=['Tipo_planta', `tipo_planta_id:${item.tipo_planta_id}` ,'delete'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
        }

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg4', "Record deleted successfully."), {
          variant: 'success',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        reloadData();
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.tipo_planta.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'tipo_planta', query: 'deleteTipo_planta', method: 'doDelete()', request: 'api.tipo_planta.deleteItem'}];
          newError.path=['Tipo_planta', `tipo_planta_id:${item.tipo_planta_id}` ,'delete'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }
      });
  }

  /**
    * getCsvTemplate
    * 
    * Get @csvTemplate using GrahpQL Server query.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item received.
    * 
    */
  function getCsvTemplate() {
    errors.current = [];

    /*
      API Request: csvTableTemplateTipo_planta
    */
    let cancelableApiReq = makeCancelable(api.tipo_planta.tableTemplate(graphqlServerUrl));
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
          newError.locations=[{model: 'tipo_planta', query: 'csvTableTemplateTipo_planta', method: 'getCsvTemplate()', request: 'api.tipo_planta.tableTemplate'}];
          newError.path=['Tipo_planta', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          clearRequestGetCsvTemplate();
          showMessage(newError.message, withDetails);
          return;
        }

        //check: csvTableTemplateTipo_planta
        let csvTableTemplateTipo_planta = response.data.data.csvTableTemplateTipo_planta;
        if(csvTableTemplateTipo_planta === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateTipo_planta ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'tipo_planta', query: 'csvTableTemplateTipo_planta', method: 'getCsvTemplate()', request: 'api.tipo_planta.tableTemplate'}];
          newError.path=['Tipo_planta', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
        }

        //check: csvTableTemplateTipo_planta type
        if(!Array.isArray(csvTableTemplateTipo_planta)) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateTipo_planta ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'tipo_planta', query: 'csvTableTemplateTipo_planta', method: 'getCsvTemplate()', request: 'api.tipo_planta.tableTemplate'}];
          newError.path=['Tipo_planta', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
        }
        
        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'csvTableTemplateTipo_planta ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'tipo_planta', query: 'csvTableTemplateTipo_planta', method: 'getCsvTemplate()', request: 'api.tipo_planta.tableTemplate'}];
          newError.path=['Tipo_planta', 'csvTemplate'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
        }

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg7', "Template downloaded successfully."), {
          variant: 'success',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        //download
        let file = response.data.data.csvTableTemplateTipo_planta.join("\n");
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "tipo_planta-template.csv");
        document.body.appendChild(link);
        link.click();
        return;

      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.tipo_planta.tableTemplate
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'tipo_planta', query: 'csvTableTemplateTipo_planta', method: 'getCsvTemplate()', request: 'api.tipo_planta.tableTemplate'}];
          newError.path=['Tipo_planta', 'csvTemplate'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
        }
      });
  }

  /**
    * Utils
    */

  function clearRequestDoDelete() {
    //nothing to do.
  }

  function clearRequestGetCsvTemplate() {
    //nothing to do.
  }


  function reloadData() {
    //configure pagination
    configurePagination('reload');
    //reload    
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }



  function updateSizes() {
    //update tw & th & tscl
    if(tref.current) {
      let w = tref.current.clientWidth;
      let h = tref.current.clientHeight;
      setTw(w);
      setTh(h);
    } else {
      setTw('100%');
      setTh('100%');
    }

    if(twref.current) {
      let l = twref.current.scrollLeft;
      setTscl(l);
    } else {
      setTscl(0);
    }
  }

  function getSwipeIndex() {
    switch(toggleButtonValue) {
      case 'table':
        return 0;
      
      case 'plot':
        return 1;

      default:
        return 0;
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
      //configure pagination
      configurePagination('reset');
      
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }
      setSearch(text);
    }
  };

  /*
   * Sort handlers
   */
  const handleRequestSort = (event, property) => {
    //configure pagination
    configurePagination('reset');

    if(page !== 0) {
      isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
      setPage(0);
    }

    const isDesc = (order === 'desc');
    setOrder(isDesc ? 'asc' : 'desc');

    if (orderBy !== property) {
      setOrderBy(property);
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

  const handleFirstPageButtonClick = (event) => {
    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;

    //configure pagination
    configurePagination('firstPage');
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleLastPageButtonClick = (event) => {
    //check strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;

    //configure pagination
    configurePagination('lastPage');
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleNextButtonClick = (event) => {
    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;

    //configure pagination
    configurePagination('nextPage');
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleBackButtonClick = (event) => {
    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;

    //configure pagination
    configurePagination('previousPage');
    //reload
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  /**
   * Detail-Panel handlers
   */
  const handleClickOnRow = (event, item) => {
    setDetailItem(item);
  };

  const handleDetailDialogClose = (event) => {
    dispatch(changesCompleted());
    delayedCloseDetailPanel(event, 500);
  }

  const delayedCloseDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDetailDialogOpen(false);
        setDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Create-Panel handlers
   */
  const handleCreateClicked = (event) => {
    setCreateDialogOpen(true);
  }

  const handleCreateDialogClose = (event, status, newItem) => {
    dispatch(changesCompleted());
    delayedCloseCreatePanel(event, 500);
    if(status) {
      reloadData();
    }
  }

  const delayedCloseCreatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setCreateDialogOpen(false);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Update-Panel handlers
   */
  const handleUpdateClicked = (event, item) => {
    setUpdateItem(item);
  }

  const handleUpdateDialogClose = (event, status, oldItem, newItem) => {
    dispatch(changesCompleted());
    delayedCloseUpdatePanel(event, 500);
    if(status) {
      reloadData();
    }
  }

  const delayedCloseUpdatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateDialogOpen(false);
        setUpdateItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Delete-Panel handlers
   */
  const handleDeleteClicked = (event, item) => {
    setDeleteConfirmationItem(item);
  }

  const handleDeleteConfirmationAccept = (event, item) => {
    dispatch(changesCompleted());
    doDelete(event, item);
    delayedCloseDeleteConfirmation(event, 500);
  }

  const handleDeleteConfirmationReject = (event) => {
    dispatch(changesCompleted());
    delayedCloseDeleteConfirmation(event, 500);
  }

  const delayedCloseDeleteConfirmation = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Bulk Upload-Dialog handlers
   */
  const handleBulkImportClicked = (event) => {
    setUploadFileDialogOpen(true);
  }

  const handleBulkUploadCancel = (event) => {
    delayedCloseBulkUploadDialog(event, 500);
  }

  const handleBulkUploadDone = (event) => {
    delayedCloseBulkUploadDialog(event, 500);
    reloadData();
  }

  const delayedCloseBulkUploadDialog = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUploadFileDialogOpen(false);
        resolve("ok");
      }, ms);
    });
  };

  /*
   * Download CSV Template handlers
   */
  const handleCsvTemplateClicked = (event) => {
    getCsvTemplate();
  }

  /*
   * Toggle buttons handlers
   */
  const handleToggleButtonValueChange = (event, newValue) => {
    if(newValue){
      setToggleButtonValue(newValue);
    }
  }

  return (
    <div className={classes.root}>
      {
        /* acl check */
        (permissions&&permissions.tipo_planta&&Array.isArray(permissions.tipo_planta)
        &&(permissions.tipo_planta.includes('read') || permissions.tipo_planta.includes('*')))
        &&(
          <Grid container justify='center'>
            <Grid item xs={12}>
              <Paper className={classes.paper}>

                {/* Toolbar */}
                <TipoPlantaEnhancedTableToolbar
                  permissions={permissions}
                  search={search}
                  showToggleButtons={Boolean(TipoPlantaPlotly)}
                  toggleButtonValue={toggleButtonValue}
                  onSearchEnter={handleSearchEnter}
                  onReloadClick={handleReloadClick}
                  handleAddClicked={handleCreateClicked}
                  handleBulkImportClicked={handleBulkImportClicked}
                  handleCsvTemplateClicked={handleCsvTemplateClicked}
                  handleToggleButtonValueChange={handleToggleButtonValueChange}
                />

                <SwipeableViews index={getSwipeIndex()} disabled={true}>
                  {/*
                    Swipe page 1: Table
                  */}
                  <div>
                    {/* Table components*/}
                    <div className={classes.tableWrapper} ref={twref}>

                      {/* Table backdrop */}
                      <Fade in={(isOnApiRequest)}>
                        <Box
                          className={classes.tableBackdrop}
                          bgcolor='rgba(255, 255, 255, 0.4)'
                          width={isOnApiRequest?tw:0}
                          height={isOnApiRequest?th:0}
                          p={0}
                          position="absolute"
                          top={0}
                          left={0}
                          zIndex="modal"
                        />
                      </Fade>

                      {/* Progress indicator */}
                      <Fade
                        in={(isOnApiRequest)}
                      >
                        <Box
                          className={classes.tableBackdrop}
                          bgcolor='rgba(255, 255, 255, 0.0)'
                          width={isOnApiRequest?'100%':0}
                          height={isOnApiRequest?'100%':0}
                          p={0}
                          position="absolute"
                          top={0}
                          left={tscl}
                          zIndex="modal"
                        >
                          <Grid container className={classes.tableBackdropContent} justify='center' alignContent='center' alignItems='center'>
                            <Grid item>
                              <CircularProgress color="primary" disableShrink={true} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Fade>

                      {/* No-data message */}
                      <Fade
                        in={(!isOnApiRequest && count === 0)}
                      >
                        <Box
                          id='TipoPlantaEnhancedTable-box-noData'
                          className={classes.tableBackdrop}
                          bgcolor='rgba(255, 255, 255, 0.0)'
                          width={(!isOnApiRequest && count === 0)?'100%':0}
                          height={(!isOnApiRequest && count === 0)?'100%':0}
                          p={0}
                          position="absolute"
                          top={0}
                          left={tscl}
                          zIndex="modal"
                        >
                          <Grid container className={classes.tableBackdropContent} justify='center' alignContent='center' alignItems='center'>
                            <Grid item>
                              <Typography variant="body1" >{ t('modelPanels.noData', 'No data to display') }</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Fade>

                      {/* Table */}
                      <Table id='TipoPlantaEnhancedTable-table' stickyHeader size='small' ref={tref}>

                        {/* Table Head */}
                        <TipoPlantaEnhancedTableHead
                          permissions={permissions}
                          order={order}
                          orderBy={orderBy}
                          rowCount={count}
                          onRequestSort={handleRequestSort}
                        />

                        {/* Table Body */}
                        <Fade
                          in={(!isOnApiRequest && count > 0)}
                        >
                          <TableBody id='TipoPlantaEnhancedTable-tableBody'>
                            {
                              items.map((item, index) => {
                                return ([
                                  /*
                                    Table Row
                                  */
                                  <TableRow
                                    id={'TipoPlantaEnhancedTable-row-'+item.tipo_planta_id}
                                    hover
                                    onClick={event => handleClickOnRow(event, item)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={item.tipo_planta_id}
                                  >

                                    {/* SeeInfo icon */}
                                    <TableCell padding="checkbox">
                                      <Tooltip title={ t('modelPanels.viewDetails') }>
                                        <IconButton
                                          id={'TipoPlantaEnhancedTable-row-iconButton-detail-'+item.tipo_planta_id}
                                          color="default"
                                          onClick={event => {
                                            event.stopPropagation();
                                            handleClickOnRow(event, item);
                                          }}
                                        >
                                          <SeeInfo fontSize="small" className={classes.iconSee}/>
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>

                                    {/*
                                      Actions:
                                      - Edit
                                      - Delete
                                    */}
                                    {
                                      /* acl check */
                                      (permissions&&permissions.tipo_planta&&Array.isArray(permissions.tipo_planta)
                                      &&(permissions.tipo_planta.includes('update') || permissions.tipo_planta.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.edit') }>
                                            <IconButton
                                              id={'TipoPlantaEnhancedTable-row-iconButton-edit-'+item.tipo_planta_id}
                                              color="default"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleUpdateClicked(event, item);
                                              }}
                                            >
                                              <Edit fontSize="small" className={classes.iconEdit} />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                      )
                                    }

                                    {
                                      /* acl check */
                                      (permissions&&permissions.tipo_planta&&Array.isArray(permissions.tipo_planta)
                                      &&(permissions.tipo_planta.includes('delete') || permissions.tipo_planta.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.delete') }>
                                            <IconButton
                                              id={'TipoPlantaEnhancedTable-row-iconButton-delete-'+item.tipo_planta_id}
                                              color="default"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteClicked(event, item);
                                              }}
                                            >
                                              <Delete fontSize="small" className={classes.iconDelete} />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                      )
                                    }

                                    {/* Item fields */}
                                    {/* tipo_planta_id*/}
                                    <TableCell
                                      key='tipo_planta_id'
                                      align='left'
                                      padding="checkbox"
                                    >
                                      <Tooltip title={ 'tipo_planta_id: ' + item.tipo_planta_id}>
                                        <Typography variant='body2' color='textSecondary' display='block' noWrap={true}>{item.tipo_planta_id}</Typography>
                                      </Tooltip>
                                    </TableCell>

                                    {/* tipo_planta */}
                                    <TableCell
                                      key='tipo_planta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.tipo_planta!==null)?item.tipo_planta:'')}
                                    </TableCell>

                                    {/* foto_produccion */}
                                    <TableCell
                                      key='foto_produccion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.foto_produccion!==null)?item.foto_produccion:'')}
                                    </TableCell>

                                    {/* foto_autoconsumo */}
                                    <TableCell
                                      key='foto_autoconsumo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.foto_autoconsumo!==null)?item.foto_autoconsumo:'')}
                                    </TableCell>

                                    {/* foto_venta */}
                                    <TableCell
                                      key='foto_venta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.foto_venta!==null)?item.foto_venta:'')}
                                    </TableCell>

                                    {/* foto_compra */}
                                    <TableCell
                                      key='foto_compra'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.foto_compra!==null)?item.foto_compra:'')}
                                    </TableCell>

                                    {/* justificacion_produccion_cuadrante1 */}
                                    <TableCell
                                      key='justificacion_produccion_cuadrante1'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.justificacion_produccion_cuadrante1!==null)?item.justificacion_produccion_cuadrante1:'')}
                                    </TableCell>

                                    {/* justificacion_produccion_cuadrante2 */}
                                    <TableCell
                                      key='justificacion_produccion_cuadrante2'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.justificacion_produccion_cuadrante2!==null)?item.justificacion_produccion_cuadrante2:'')}
                                    </TableCell>

                                    {/* justificacion_produccion_cuadrante3 */}
                                    <TableCell
                                      key='justificacion_produccion_cuadrante3'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.justificacion_produccion_cuadrante3!==null)?item.justificacion_produccion_cuadrante3:'')}
                                    </TableCell>

                                    {/* justificacion_produccion_cuadrante4 */}
                                    <TableCell
                                      key='justificacion_produccion_cuadrante4'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.justificacion_produccion_cuadrante4!==null)?item.justificacion_produccion_cuadrante4:'')}
                                    </TableCell>

                                  </TableRow>,
                                ]);
                              })
                            }
                          </TableBody>
                        </Fade>
                      </Table>
                    </div>

                    {/*
                      Pagination
                    */}
                    <TipoPlantaCursorPagination
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
                  </div>

                  {/*
                    Swipe page 2: Plot
                    Conditional rendered
                  */}
                  <div>
                    {(Boolean(TipoPlantaPlotly)) && (
                      <TipoPlantaPlotly />
                    )}
                  </div>
                </SwipeableViews>
              </Paper>
            </Grid>
          </Grid>
        )
      }

      {/* Dialog: Create Panel */}
      {(createDialogOpen) && (
        <TipoPlantaCreatePanel
          permissions={permissions}
          handleClose={handleCreateDialogClose}
        />
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <TipoPlantaUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <TipoPlantaDetailPanel
          permissions={permissions}
          item={detailItem}
          dialog={true}
          handleClose={handleDetailDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <TipoPlantaDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <TipoPlantaUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}
    </div>
  );
}

TipoPlantaEnhancedTable.propTypes = {
  permissions: PropTypes.object,
};
