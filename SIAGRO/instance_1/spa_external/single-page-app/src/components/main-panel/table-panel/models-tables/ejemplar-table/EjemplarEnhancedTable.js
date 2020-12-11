import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changesCompleted, clearChanges } from '../../../../../store/actions'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../utils'
import EjemplarEnhancedTableHead from './components/EjemplarEnhancedTableHead'
import EjemplarEnhancedTableToolbar from './components/EjemplarEnhancedTableToolbar'
import EjemplarUploadFileDialog from './components/EjemplarUploadFileDialog'
import EjemplarCursorPagination from './components/EjemplarCursorPagination'
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
//lazy loading
const EjemplarCreatePanel = lazy(() => import(/* webpackChunkName: "Create-Ejemplar" */ './components/ejemplar-create-panel/EjemplarCreatePanel'));
const EjemplarUpdatePanel = lazy(() => import(/* webpackChunkName: "Update-Ejemplar" */ './components/ejemplar-update-panel/EjemplarUpdatePanel'));
const EjemplarDetailPanel = lazy(() => import(/* webpackChunkName: "Detail-Ejemplar" */ './components/ejemplar-detail-panel/EjemplarDetailPanel'));
const EjemplarDeleteConfirmationDialog = lazy(() => import(/* webpackChunkName: "Delete-Ejemplar" */ './components/EjemplarDeleteConfirmationDialog'));
//Plotly
const EjemplarPlotly = lazy(() => import(/* webpackChunkName: "Plotly-Ejemplar" */ '../../../../plots/EjemplarPlotly'));

// const drawerWidth = 280;
// const appBarHeight = 72;
// const mainMargin = 48;
// const tableFooter = 80;
// const tableToolbar = 128;

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: 72,
        height: `calc(100vh - 72px - 48px)`,
    },
    paper: {
      overflow: 'auto',
      height: `calc(100vh - 72px  - 48px)`,
      minWidth: 570,
    },
    tableWrapper: {
      height: `calc(100vh - 72px - 48px - 128px - 80px)`,
      minWidth: 570,
      overflow: 'auto',
      position: 'relative',
    },
    swipe: {
      overflow: 'hidden',
      height: `calc(100vh - 72px - 48px)`,
    },
    loading: {
      height: `calc(100vh - 72px - 48px - 128px - 80px)`,
    },
    noData: {
      height: `calc(100vh - 72px - 48px - 128px - 80px)`,
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

export default function EjemplarEnhancedTable(props) {
  const classes = useStyles();
  const { permissions } = props;
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(-1);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(25);
  const isCountingRef = useRef(false);
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
  const cancelableCountingPromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const changes = useSelector(state => state.changes);
  const lastFetchTime = useRef(Date.now());
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

  //snackbar (for: getCount)
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
   *  showMessageB
   *  configurePagination
   *  onEmptyPage
   *  clearRequestGetData
   *  getCount
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

  /**
   * clearRequestGetData
   *
   * Clear all configurations related to an api request.
   * Also clears table data and count.
   */
  const clearRequestGetData = useCallback(() => {
    //configure pagination
    configurePagination('reset');

    setItems([]);
    isOnApiRequestRef.current = false;
    isCursorPaginating.current = false;
    setIsOnApiRequest(false);
  },[configurePagination]);

  /**
    * getCount
    *
    * Get @count from GrahpQL Server (async).
    * Uses current state properties to fill query request.
    * Updates state to inform new @count retreived.
    *
    */
  const getCount = useCallback(async () => {
    //return if there is an active count operation
    if(isCountingRef.current) return;

    cancelCountingPromises();
    isCountingRef.current = true;
    errorsB.current = [];

    /*
      API Request: api.ejemplar.getCountItems
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.getCountItems(graphqlServerUrl, search));
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
            variantB.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'Ejemplar', method: 'getCount()', request: 'api.ejemplar.getCountItems'}];
            newError.path=['Ejemplars'];
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
          newError.locations=[{model: 'Ejemplar', method: 'getCount()', request: 'api.ejemplar.getCountItems'}];
          newError.path=['Ejemplars'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
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
      .catch((err) => { //error: on api.ejemplar.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'getCount()', request: 'api.ejemplar.getCountItems'}];
          newError.path=['Ejemplars'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          return;
        }
      });
  }, [graphqlServerUrl, t, search, showMessageB]);

  /**
    * getData
    *
    * Get @items from GrahpQL Server.
    * Uses current state properties to fill query request.
    * Updates state to inform new @items retreived.
    *
    */
  const getData = useCallback(async () => {
    updateSizes();
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    //count (async)
    getCount();

    let variables = {
      pagination: {...paginationRef.current}
    };
    /*
      API Request: api.ejemplar.getItems
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.getItems(
      graphqlServerUrl,
      search,
      orderBy,
      order,
      variables
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
            newError.locations=[{model: 'Ejemplar', method: 'getData()', request: 'api.ejemplar.getItems'}];
            newError.path=['Ejemplars'];
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
          newError.locations=[{model: 'Ejemplar', method: 'getData()', request: 'api.ejemplar.getItems'}];
          newError.path=['Ejemplars'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //get items
        let its = response.value.edges.map(o => o.node);
        let pi =  response.value.pageInfo;

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
        throw err;
      })
      //error
      .catch((err) => { //error: on api.ejemplar.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'getData()', request: 'api.ejemplar.getItems'}];
          newError.path=['Ejemplars'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, t, dataTrigger, search, orderBy, order, getCount, showMessage, clearRequestGetData, configurePagination, onEmptyPage]);

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
    /**
     * Checks
     */
    if(!changes) {
      return;
    }
    if(!changes.lastChangeTimestamp || !lastFetchTime.current) {
      return;
    }
    let isNewChange = (lastFetchTime.current<changes.lastChangeTimestamp);

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();

    /**
     * on: individual delete
     */
    if(isNewChange&&!changes.changesCompleted&&changes.lastModelChanged&&changes.lastModelChanged['Ejemplar']
    &&(Object.keys(changes.lastModelChanged['Ejemplar']).length===1)
    &&(changes.lastModelChanged['Ejemplar'][Object.keys(changes.lastModelChanged['Ejemplar'])[0]].op === "delete")
    ) {
      //decrement count
      setCount(count-1);
      //count
      cancelCountingPromises();
      isCountingRef.current = false;
      getCount();
    }

    /**
     * on: changes completed
     */
    if(changes.changesCompleted) {
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
  }, [changes, count, getCount, dispatch, configurePagination]);

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
  async function doDelete(event, item) {
    errors.current = [];

    let variables = {};
    //set id (internalId)
    variables.id = item.id;

    /*
      API Request: api.ejemplar.deleteItem
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.deleteItem(graphqlServerUrl, variables));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'Ejemplar', method: 'doDelete()', request: 'api.ejemplar.deleteItem'}];
            newError.path=['Ejemplars', `id:${item.id}`, 'delete'];
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
          newError.locations=[{model: 'Ejemplar', method: 'doDelete()', request: 'api.ejemplar.deleteItem'}];
          newError.path=['Ejemplars', `id:${item.id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
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
        //decrement count
        setCount(count-1);
        //will count
        cancelCountingPromises();
        isCountingRef.current = false;

        reloadData();
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.ejemplar.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'doDelete()', request: 'api.ejemplar.deleteItem'}];
          newError.path=['Ejemplars', `id:${item.id}` ,'delete'];
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
  async function getCsvTemplate() {
    errors.current = [];

    /*
      API Request: api.ejemplar.tableTemplate
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.tableTemplate(graphqlServerUrl));
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
            newError.locations=[{model: 'Ejemplar', method: 'getCsvTemplate()', request: 'api.ejemplar.tableTemplate'}];
            newError.path=['Ejemplars', 'csvTemplate'];
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
          newError.locations=[{model: 'Ejemplar', method: 'getCsvTemplate()', request: 'api.ejemplar.tableTemplate'}];
          newError.path=['Ejemplars', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
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
        let file = response.data.data.csvTableTemplateEjemplar.join("\n");
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ejemplar-template.csv");
        document.body.appendChild(link);
        link.click();
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.ejemplar.tableTemplate
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'getCsvTemplate()', request: 'api.ejemplar.tableTemplate'}];
          newError.path=['Ejemplars', 'csvTemplate'];
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
  function cancelCountingPromises() {
    cancelableCountingPromises.current.forEach(p => p.cancel());
    cancelableCountingPromises.current = [];
  }

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
      setCount(-1);
      //will count
      cancelCountingPromises();
      isCountingRef.current = false;

      //search
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
      setCount(count+1);
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
        (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
        &&(permissions.ejemplar.includes('read') || permissions.ejemplar.includes('*')))
        &&(
          <Grid container justify='center'>
            <Grid item xs={12}>
              <Paper className={classes.paper}>

                {/* Toolbar */}
                <EjemplarEnhancedTableToolbar
                  permissions={permissions}
                  search={search}
                  showToggleButtons={true}
                  toggleButtonValue={toggleButtonValue}
                  onSearchEnter={handleSearchEnter}
                  onReloadClick={handleReloadClick}
                  handleAddClicked={handleCreateClicked}
                  handleBulkImportClicked={handleBulkImportClicked}
                  handleCsvTemplateClicked={handleCsvTemplateClicked}
                  handleToggleButtonValueChange={handleToggleButtonValueChange}
                />

                <SwipeableViews 
                  style={{maxHeight: `calc(100vh - (72px + 48px + 128px))`}} 
                  className={classes.swipe} 
                  index={getSwipeIndex()} disabled={true}
                >
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
                        in={(!isOnApiRequest && items.length === 0)}
                      >
                        <Box
                          id='EjemplarEnhancedTable-box-noData'
                          className={classes.tableBackdrop}
                          bgcolor='rgba(255, 255, 255, 0.0)'
                          width={(!isOnApiRequest && items.length === 0)?'100%':0}
                          height={(!isOnApiRequest && items.length === 0)?'100%':0}
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
                      <Table id='EjemplarEnhancedTable-table' stickyHeader size='small' ref={tref}>

                        {/* Table Head */}
                        <EjemplarEnhancedTableHead
                          permissions={permissions}
                          order={order}
                          orderBy={orderBy}
                          rowCount={items.length}
                          onRequestSort={handleRequestSort}
                        />

                        {/* Table Body */}
                        <Fade
                          in={(!isOnApiRequest && items.length > 0)}
                        >
                          <TableBody id='EjemplarEnhancedTable-tableBody'>
                            {
                              items.map((item, index) => {
                                return ([
                                  /*
                                    Table Row
                                  */
                                  <TableRow
                                    id={'EjemplarEnhancedTable-row-'+item.id}
                                    hover
                                    onClick={event => handleClickOnRow(event, item)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={item.id}
                                  >

                                    {/* SeeInfo icon */}
                                    <TableCell padding="checkbox">
                                      <Tooltip title={ t('modelPanels.viewDetails') }>
                                        <IconButton
                                          id={'EjemplarEnhancedTable-row-iconButton-detail-'+item.id}
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
                                      (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
                                      &&(permissions.ejemplar.includes('update') || permissions.ejemplar.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.edit') }>
                                            <IconButton
                                              id={'EjemplarEnhancedTable-row-iconButton-edit-'+item.id}
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
                                      (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
                                      &&(permissions.ejemplar.includes('delete') || permissions.ejemplar.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.delete') }>
                                            <IconButton
                                              id={'EjemplarEnhancedTable-row-iconButton-delete-'+item.id}
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
                                    {/* id*/}
                                    <TableCell
                                      key='id'
                                      align='left'
                                      padding="checkbox"
                                    >
                                      <Tooltip title={ 'id: ' + item.id}>
                                        <Typography variant='body2' color='textSecondary' display='block' noWrap={true}>{item.id}</Typography>
                                      </Tooltip>
                                    </TableCell>

                                    {/* region */}
                                    <TableCell
                                      key='region'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.region!==null)?item.region:'')}
                                    </TableCell>

                                    {/* localidad */}
                                    <TableCell
                                      key='localidad'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.localidad!==null)?item.localidad:'')}
                                    </TableCell>

                                    {/* longitud */}
                                    <TableCell
                                      key='longitud'
                                      align='right'
                                      padding="default"
                                    >
                                      {String((item.longitud!==null)?item.longitud:'')}
                                    </TableCell>

                                    {/* latitud */}
                                    <TableCell
                                      key='latitud'
                                      align='right'
                                      padding="default"
                                    >
                                      {String((item.latitud!==null)?item.latitud:'')}
                                    </TableCell>

                                    {/* datum */}
                                    <TableCell
                                      key='datum'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.datum!==null)?item.datum:'')}
                                    </TableCell>

                                    {/* validacionambiente */}
                                    <TableCell
                                      key='validacionambiente'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.validacionambiente!==null)?item.validacionambiente:'')}
                                    </TableCell>

                                    {/* geovalidacion */}
                                    <TableCell
                                      key='geovalidacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.geovalidacion!==null)?item.geovalidacion:'')}
                                    </TableCell>

                                    {/* paismapa */}
                                    <TableCell
                                      key='paismapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.paismapa!==null)?item.paismapa:'')}
                                    </TableCell>

                                    {/* estadomapa */}
                                    <TableCell
                                      key='estadomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.estadomapa!==null)?item.estadomapa:'')}
                                    </TableCell>

                                    {/* claveestadomapa */}
                                    <TableCell
                                      key='claveestadomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.claveestadomapa!==null)?item.claveestadomapa:'')}
                                    </TableCell>

                                    {/* mt24nombreestadomapa */}
                                    <TableCell
                                      key='mt24nombreestadomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mt24nombreestadomapa!==null)?item.mt24nombreestadomapa:'')}
                                    </TableCell>

                                    {/* mt24claveestadomapa */}
                                    <TableCell
                                      key='mt24claveestadomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mt24claveestadomapa!==null)?item.mt24claveestadomapa:'')}
                                    </TableCell>

                                    {/* municipiomapa */}
                                    <TableCell
                                      key='municipiomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.municipiomapa!==null)?item.municipiomapa:'')}
                                    </TableCell>

                                    {/* clavemunicipiomapa */}
                                    <TableCell
                                      key='clavemunicipiomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.clavemunicipiomapa!==null)?item.clavemunicipiomapa:'')}
                                    </TableCell>

                                    {/* mt24nombremunicipiomapa */}
                                    <TableCell
                                      key='mt24nombremunicipiomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mt24nombremunicipiomapa!==null)?item.mt24nombremunicipiomapa:'')}
                                    </TableCell>

                                    {/* mt24clavemunicipiomapa */}
                                    <TableCell
                                      key='mt24clavemunicipiomapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mt24clavemunicipiomapa!==null)?item.mt24clavemunicipiomapa:'')}
                                    </TableCell>

                                    {/* incertidumbrexy */}
                                    <TableCell
                                      key='incertidumbrexy'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.incertidumbrexy!==null)?item.incertidumbrexy:'')}
                                    </TableCell>

                                    {/* altitudmapa */}
                                    <TableCell
                                      key='altitudmapa'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.altitudmapa!==null)?item.altitudmapa:'')}
                                    </TableCell>

                                    {/* usvserieI */}
                                    <TableCell
                                      key='usvserieI'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieI!==null)?item.usvserieI:'')}
                                    </TableCell>

                                    {/* usvserieII */}
                                    <TableCell
                                      key='usvserieII'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieII!==null)?item.usvserieII:'')}
                                    </TableCell>

                                    {/* usvserieIII */}
                                    <TableCell
                                      key='usvserieIII'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieIII!==null)?item.usvserieIII:'')}
                                    </TableCell>

                                    {/* usvserieIV */}
                                    <TableCell
                                      key='usvserieIV'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieIV!==null)?item.usvserieIV:'')}
                                    </TableCell>

                                    {/* usvserieV */}
                                    <TableCell
                                      key='usvserieV'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieV!==null)?item.usvserieV:'')}
                                    </TableCell>

                                    {/* usvserieVI */}
                                    <TableCell
                                      key='usvserieVI'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.usvserieVI!==null)?item.usvserieVI:'')}
                                    </TableCell>

                                    {/* anp */}
                                    <TableCell
                                      key='anp'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.anp!==null)?item.anp:'')}
                                    </TableCell>

                                    {/* grupobio */}
                                    <TableCell
                                      key='grupobio'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.grupobio!==null)?item.grupobio:'')}
                                    </TableCell>

                                    {/* subgrupobio */}
                                    <TableCell
                                      key='subgrupobio'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.subgrupobio!==null)?item.subgrupobio:'')}
                                    </TableCell>

                                    {/* taxon */}
                                    <TableCell
                                      key='taxon'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.taxon!==null)?item.taxon:'')}
                                    </TableCell>

                                    {/* autor */}
                                    <TableCell
                                      key='autor'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.autor!==null)?item.autor:'')}
                                    </TableCell>

                                    {/* estatustax */}
                                    <TableCell
                                      key='estatustax'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.estatustax!==null)?item.estatustax:'')}
                                    </TableCell>

                                    {/* reftax */}
                                    <TableCell
                                      key='reftax'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.reftax!==null)?item.reftax:'')}
                                    </TableCell>

                                    {/* taxonvalido */}
                                    <TableCell
                                      key='taxonvalido'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.taxonvalido!==null)?item.taxonvalido:'')}
                                    </TableCell>

                                    {/* autorvalido */}
                                    <TableCell
                                      key='autorvalido'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.autorvalido!==null)?item.autorvalido:'')}
                                    </TableCell>

                                    {/* reftaxvalido */}
                                    <TableCell
                                      key='reftaxvalido'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.reftaxvalido!==null)?item.reftaxvalido:'')}
                                    </TableCell>

                                    {/* taxonvalidado */}
                                    <TableCell
                                      key='taxonvalidado'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.taxonvalidado!==null)?item.taxonvalidado:'')}
                                    </TableCell>

                                    {/* endemismo */}
                                    <TableCell
                                      key='endemismo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.endemismo!==null)?item.endemismo:'')}
                                    </TableCell>

                                    {/* taxonextinto */}
                                    <TableCell
                                      key='taxonextinto'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.taxonextinto!==null)?item.taxonextinto:'')}
                                    </TableCell>

                                    {/* ambiente */}
                                    <TableCell
                                      key='ambiente'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.ambiente!==null)?item.ambiente:'')}
                                    </TableCell>

                                    {/* nombrecomun */}
                                    <TableCell
                                      key='nombrecomun'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.nombrecomun!==null)?item.nombrecomun:'')}
                                    </TableCell>

                                    {/* formadecrecimiento */}
                                    <TableCell
                                      key='formadecrecimiento'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.formadecrecimiento!==null)?item.formadecrecimiento:'')}
                                    </TableCell>

                                    {/* prioritaria */}
                                    <TableCell
                                      key='prioritaria'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.prioritaria!==null)?item.prioritaria:'')}
                                    </TableCell>

                                    {/* nivelprioridad */}
                                    <TableCell
                                      key='nivelprioridad'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.nivelprioridad!==null)?item.nivelprioridad:'')}
                                    </TableCell>

                                    {/* exoticainvasora */}
                                    <TableCell
                                      key='exoticainvasora'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.exoticainvasora!==null)?item.exoticainvasora:'')}
                                    </TableCell>

                                    {/* nom059 */}
                                    <TableCell
                                      key='nom059'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.nom059!==null)?item.nom059:'')}
                                    </TableCell>

                                    {/* cites */}
                                    <TableCell
                                      key='cites'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.cites!==null)?item.cites:'')}
                                    </TableCell>

                                    {/* iucn */}
                                    <TableCell
                                      key='iucn'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.iucn!==null)?item.iucn:'')}
                                    </TableCell>

                                    {/* categoriaresidenciaaves */}
                                    <TableCell
                                      key='categoriaresidenciaaves'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.categoriaresidenciaaves!==null)?item.categoriaresidenciaaves:'')}
                                    </TableCell>

                                    {/* probablelocnodecampo */}
                                    <TableCell
                                      key='probablelocnodecampo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.probablelocnodecampo!==null)?item.probablelocnodecampo:'')}
                                    </TableCell>

                                    {/* obsusoinfo */}
                                    <TableCell
                                      key='obsusoinfo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.obsusoinfo!==null)?item.obsusoinfo:'')}
                                    </TableCell>

                                    {/* coleccion */}
                                    <TableCell
                                      key='coleccion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.coleccion!==null)?item.coleccion:'')}
                                    </TableCell>

                                    {/* institucion */}
                                    <TableCell
                                      key='institucion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.institucion!==null)?item.institucion:'')}
                                    </TableCell>

                                    {/* paiscoleccion */}
                                    <TableCell
                                      key='paiscoleccion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.paiscoleccion!==null)?item.paiscoleccion:'')}
                                    </TableCell>

                                    {/* numcatalogo */}
                                    <TableCell
                                      key='numcatalogo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.numcatalogo!==null)?item.numcatalogo:'')}
                                    </TableCell>

                                    {/* numcolecta */}
                                    <TableCell
                                      key='numcolecta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.numcolecta!==null)?item.numcolecta:'')}
                                    </TableCell>

                                    {/* procedenciaejemplar */}
                                    <TableCell
                                      key='procedenciaejemplar'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.procedenciaejemplar!==null)?item.procedenciaejemplar:'')}
                                    </TableCell>

                                    {/* determinador */}
                                    <TableCell
                                      key='determinador'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.determinador!==null)?item.determinador:'')}
                                    </TableCell>

                                    {/* aniodeterminacion */}
                                    <TableCell
                                      key='aniodeterminacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.aniodeterminacion!==null)?item.aniodeterminacion:'')}
                                    </TableCell>

                                    {/* mesdeterminacion */}
                                    <TableCell
                                      key='mesdeterminacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mesdeterminacion!==null)?item.mesdeterminacion:'')}
                                    </TableCell>

                                    {/* diadeterminacion */}
                                    <TableCell
                                      key='diadeterminacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.diadeterminacion!==null)?item.diadeterminacion:'')}
                                    </TableCell>

                                    {/* fechadeterminacion */}
                                    <TableCell
                                      key='fechadeterminacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.fechadeterminacion!==null)?item.fechadeterminacion:'')}
                                    </TableCell>

                                    {/* calificadordeterminacion */}
                                    <TableCell
                                      key='calificadordeterminacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.calificadordeterminacion!==null)?item.calificadordeterminacion:'')}
                                    </TableCell>

                                    {/* colector */}
                                    <TableCell
                                      key='colector'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.colector!==null)?item.colector:'')}
                                    </TableCell>

                                    {/* aniocolecta */}
                                    <TableCell
                                      key='aniocolecta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.aniocolecta!==null)?item.aniocolecta:'')}
                                    </TableCell>

                                    {/* mescolecta */}
                                    <TableCell
                                      key='mescolecta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mescolecta!==null)?item.mescolecta:'')}
                                    </TableCell>

                                    {/* diacolecta */}
                                    <TableCell
                                      key='diacolecta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.diacolecta!==null)?item.diacolecta:'')}
                                    </TableCell>

                                    {/* fechacolecta */}
                                    <TableCell
                                      key='fechacolecta'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.fechacolecta!==null)?item.fechacolecta:'')}
                                    </TableCell>

                                    {/* tipo */}
                                    <TableCell
                                      key='tipo'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.tipo!==null)?item.tipo:'')}
                                    </TableCell>

                                    {/* ejemplarfosil */}
                                    <TableCell
                                      key='ejemplarfosil'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.ejemplarfosil!==null)?item.ejemplarfosil:'')}
                                    </TableCell>

                                    {/* proyecto */}
                                    <TableCell
                                      key='proyecto'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.proyecto!==null)?item.proyecto:'')}
                                    </TableCell>

                                    {/* fuente */}
                                    <TableCell
                                      key='fuente'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.fuente!==null)?item.fuente:'')}
                                    </TableCell>

                                    {/* formadecitar */}
                                    <TableCell
                                      key='formadecitar'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.formadecitar!==null)?item.formadecitar:'')}
                                    </TableCell>

                                    {/* licenciauso */}
                                    <TableCell
                                      key='licenciauso'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.licenciauso!==null)?item.licenciauso:'')}
                                    </TableCell>

                                    {/* urlproyecto */}
                                    <TableCell
                                      key='urlproyecto'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.urlproyecto!==null)?item.urlproyecto:'')}
                                    </TableCell>

                                    {/* urlorigen */}
                                    <TableCell
                                      key='urlorigen'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.urlorigen!==null)?item.urlorigen:'')}
                                    </TableCell>

                                    {/* urlejemplar */}
                                    <TableCell
                                      key='urlejemplar'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.urlejemplar!==null)?item.urlejemplar:'')}
                                    </TableCell>

                                    {/* ultimafechaactualizacion */}
                                    <TableCell
                                      key='ultimafechaactualizacion'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.ultimafechaactualizacion!==null)?item.ultimafechaactualizacion:'')}
                                    </TableCell>

                                    {/* cuarentena */}
                                    <TableCell
                                      key='cuarentena'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.cuarentena!==null)?item.cuarentena:'')}
                                    </TableCell>

                                    {/* version */}
                                    <TableCell
                                      key='version'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.version!==null)?item.version:'')}
                                    </TableCell>

                                    {/* especie */}
                                    <TableCell
                                      key='especie'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.especie!==null)?item.especie:'')}
                                    </TableCell>

                                    {/* especievalida */}
                                    <TableCell
                                      key='especievalida'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.especievalida!==null)?item.especievalida:'')}
                                    </TableCell>

                                    {/* especievalidabusqueda */}
                                    <TableCell
                                      key='especievalidabusqueda'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.especievalidabusqueda!==null)?item.especievalidabusqueda:'')}
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
                    <EjemplarCursorPagination
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
                  </div>

                  {/*
                    Swipe page 2: Plot
                    Conditional rendered
                  */}
                  <div>
                    {(Boolean(EjemplarPlotly)) && (
                      <Suspense fallback={<div />}>
                        <EjemplarPlotly />
                      </Suspense>
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
        <Suspense fallback={<div />}>
          <EjemplarCreatePanel
            permissions={permissions}
            handleClose={handleCreateDialogClose}
          />
        </Suspense>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <Suspense fallback={<div />}>
          <EjemplarUpdatePanel
            permissions={permissions}
            item={updateItem}
            handleClose={handleUpdateDialogClose}
          />
        </Suspense>
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <Suspense fallback={<div />}>
          <EjemplarDetailPanel
            permissions={permissions}
            item={detailItem}
            dialog={true}
            handleClose={handleDetailDialogClose}
          />
        </Suspense>
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <Suspense fallback={<div />}>
          <EjemplarDeleteConfirmationDialog
            permissions={permissions}
            item={deleteConfirmationItem}
            handleAccept={handleDeleteConfirmationAccept}
            handleReject={handleDeleteConfirmationReject}
          />
        </Suspense>
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <EjemplarUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}
    </div>
  );
}

EjemplarEnhancedTable.propTypes = {
  permissions: PropTypes.object,
};
