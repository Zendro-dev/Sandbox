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
import ImageAttachmentEnhancedTableHead from './components/ImageAttachmentEnhancedTableHead'
import ImageAttachmentEnhancedTableToolbar from './components/ImageAttachmentEnhancedTableToolbar'
import ImageAttachmentCreatePanel from './components/imageAttachment-create-panel/ImageAttachmentCreatePanel'
import ImageAttachmentUpdatePanel from './components/imageAttachment-update-panel/ImageAttachmentUpdatePanel'
import ImageAttachmentDetailPanel from './components/imageAttachment-detail-panel/ImageAttachmentDetailPanel'
import ImageAttachmentDeleteConfirmationDialog from './components/ImageAttachmentDeleteConfirmationDialog'
import ImageAttachmentUploadFileDialog from './components/ImageAttachmentUploadFileDialog'
import ImageAttachmentUploadImageDialog from './components/ImageAttachmentUploadImageDialog'
import ImageAttachmentUpdateImageDialog from './components/ImageAttachmentUpdateImageDialog'
import ImageAttachmentCursorPagination from './components/ImageAttachmentCursorPagination'
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
import ImageAttachmentPlotly from '../../../../plots/ImageAttachmentPlotly';

//#imgs
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import ImageAttachmentImagesGridView from './components/ImageAttachmentImagesGridView'
//imgs#

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

export default function ImageAttachmentEnhancedTable(props) {
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
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);
  const [updateImageDialogOpen, setUpdateImageDialogOpen] = useState(false);
  const [viewTypeValue, setViewTypeValue] = useState('table');

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
      API Request: api.imageAttachment.getCountItems
    */
    let cancelableApiReq = makeCancelable(api.imageAttachment.getCountItems(graphqlServerUrl, search));
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
            newError.locations=[{model: 'ImageAttachment', method: 'getCount()', request: 'api.imageAttachment.getCountItems'}];
            newError.path=['ImageAttachments'];
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
          newError.locations=[{model: 'ImageAttachment', method: 'getCount()', request: 'api.imageAttachment.getCountItems'}];
          newError.path=['ImageAttachments'];
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
      .catch((err) => { //error: on api.imageAttachment.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'ImageAttachment', method: 'getCount()', request: 'api.imageAttachment.getCountItems'}];
          newError.path=['ImageAttachments'];
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
      API Request: api.imageAttachment.getItems
    */
    let cancelableApiReq = makeCancelable(api.imageAttachment.getItems(
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
            newError.locations=[{model: 'ImageAttachment', method: 'getData()', request: 'api.imageAttachment.getItems'}];
            newError.path=['ImageAttachments'];
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
          newError.locations=[{model: 'ImageAttachment', method: 'getData()', request: 'api.imageAttachment.getItems'}];
          newError.path=['ImageAttachments'];
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
      .catch((err) => { //error: on api.imageAttachment.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'ImageAttachment', method: 'getData()', request: 'api.imageAttachment.getItems'}];
          newError.path=['ImageAttachments'];
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
    if(isNewChange&&!changes.changesCompleted&&changes.lastModelChanged&&changes.lastModelChanged['ImageAttachment']
    &&(Object.keys(changes.lastModelChanged['ImageAttachment']).length===1)
    &&(changes.lastModelChanged['ImageAttachment'][Object.keys(changes.lastModelChanged['ImageAttachment'])[0]].op === "delete")
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
      API Request: api.imageAttachment.deleteItem
    */
    let cancelableApiReq = makeCancelable(api.imageAttachment.deleteItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
            newError.path=['ImageAttachments', `id:${item.id}`, 'delete'];
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
          newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
          newError.path=['ImageAttachments', `id:${item.id}`, 'delete'];
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
      .catch((err) => { //error: on api.imageAttachment.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'ImageAttachment', method: 'doDelete()', request: 'api.imageAttachment.deleteItem'}];
          newError.path=['ImageAttachments', `id:${item.id}` ,'delete'];
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
      API Request: api.imageAttachment.tableTemplate
    */
    let cancelableApiReq = makeCancelable(api.imageAttachment.tableTemplate(graphqlServerUrl));
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
            newError.locations=[{model: 'ImageAttachment', method: 'getCsvTemplate()', request: 'api.imageAttachment.tableTemplate'}];
            newError.path=['ImageAttachments', 'csvTemplate'];
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
          newError.locations=[{model: 'ImageAttachment', method: 'getCsvTemplate()', request: 'api.imageAttachment.tableTemplate'}];
          newError.path=['ImageAttachments', 'csvTemplate'];
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
        let file = response.data.data.csvTableTemplateImageAttachment.join("\n");
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "imageAttachment-template.csv");
        document.body.appendChild(link);
        link.click();
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.imageAttachment.tableTemplate
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'ImageAttachment', method: 'getCsvTemplate()', request: 'api.imageAttachment.tableTemplate'}];
          newError.path=['ImageAttachments', 'csvTemplate'];
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
    }
    reloadData();
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
    reloadData();
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

  /**
   * Image Upload-Dialog handlers
   */
  const handleImageUploadClicked = (event) => {
    setUploadImageDialogOpen(true);
  }

  const handleImageUploadCancel = (event) => {
    delayedCloseImageUploadDialog(event, 500);
  }

  const handleImageUploadDone = (event) => {
    delayedCloseImageUploadDialog(event, 500);
    reloadData();
  }

  const delayedCloseImageUploadDialog = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUploadImageDialogOpen(false);
        resolve("ok");
      }, ms);
    });
  };

  /**
   * Image Update-Dialog handlers
   */
  const handleImageUpdateClicked = (event) => {
    setUpdateImageDialogOpen(true);
  }

  const handleImageUpdateCancel = (event) => {
    delayedCloseImageUpdateDialog(event, 500);
  }

  const handleImageUpdateDone = (event, newItem) => {
    delayedCloseImageUpdateDialog(event, 500);
    if(newItem && typeof newItem === 'object'
    && updateItem && updateItem.id === newItem.id) {
      setUpdateItem({...updateItem, ...newItem});
    }
  }

  const delayedCloseImageUpdateDialog = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateImageDialogOpen(false);
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

  /*
   * View type (table or grid) switch handler
   */
  const handleViewTypeClicked = (value) => {
    console.log("@@ value: ", value);
    setViewTypeValue(value);
  }

  return (
    <div id='imageAttachmentEnhancedTable-div-root' className={classes.root}>
      {
        /* acl check */
        (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
        &&(permissions.imageAttachment.includes('read') || permissions.imageAttachment.includes('*')))
        &&(
          <Grid container justify='center'>
            <Grid item xs={12}>
              <Paper id='imageAttachmentEnhancedTable-paper-root' className={classes.paper}>

                {/* Toolbar */}
                <ImageAttachmentEnhancedTableToolbar
                  id='imageAttachmentEnhancedTable-tableToolbar'
                  className={classes.tableToolbar}
                  permissions={permissions}
                  search={search}
                  showToggleButtons={Boolean(ImageAttachmentPlotly)}
                  toggleButtonValue={toggleButtonValue}
                  viewTypeValue={viewTypeValue}
                  onSearchEnter={handleSearchEnter}
                  onReloadClick={handleReloadClick}
                  handleAddClicked={handleImageUploadClicked}
                  handleBulkImportClicked={handleBulkImportClicked}
                  handleCsvTemplateClicked={handleCsvTemplateClicked}
                  handleToggleButtonValueChange={handleToggleButtonValueChange}
                  handleViewTypeClicked={handleViewTypeClicked}
                />

                <SwipeableViews style={{maxHeight: `calc(100vh - (72px + 48px + 128px))`}} id='imageAttachmentEnhancedTable-swipeableViews' className={classes.swipe} index={getSwipeIndex()} disabled={true}>
                  {/*
                    Swipe page 1: Table
                  */}
                  <div>

                    {/* Table components*/}
                    <div id='imageAttachmentEnhancedTable-div-tableWrapper' className={classes.tableWrapper} ref={twref}>

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
                          id='ImageAttachmentEnhancedTable-box-noData'
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

                      {/*
                        Table view 
                      */}
                      {(viewTypeValue==='table') && (
                        <Table id='ImageAttachmentEnhancedTable-table' stickyHeader size='small' ref={tref}>

                          {/* Table Head */}
                          <ImageAttachmentEnhancedTableHead
                            permissions={permissions}
                            order={order}
                            orderBy={orderBy}
                            rowCount={items.length}
                            onRequestSort={handleRequestSort}
                          />

                          
                          {/* Table Body */}
                          <Fade in={(!isOnApiRequest && items.length > 0)}>
                            <TableBody id='ImageAttachmentEnhancedTable-tableBody'>
                              {
                                items.map((item, index) => {
                                  return ([
                                    /*
                                      Table Row
                                    */
                                    <TableRow
                                      id={'ImageAttachmentEnhancedTable-row-'+item.id}
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
                                            id={'ImageAttachmentEnhancedTable-row-iconButton-detail-'+item.id}
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
                                        (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                                        &&(permissions.imageAttachment.includes('update') || permissions.imageAttachment.includes('*')))
                                        &&(
                                          <TableCell padding='checkbox' align='center'>
                                            <Tooltip title={ t('modelPanels.edit') }>
                                              <IconButton
                                                id={'ImageAttachmentEnhancedTable-row-iconButton-edit-'+item.id}
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
                                        (permissions&&permissions.imageAttachment&&Array.isArray(permissions.imageAttachment)
                                        &&(permissions.imageAttachment.includes('delete') || permissions.imageAttachment.includes('*')))
                                        &&(
                                          <TableCell padding='checkbox' align='center'>
                                            <Tooltip title={ t('modelPanels.delete') }>
                                              <IconButton
                                                id={'ImageAttachmentEnhancedTable-row-iconButton-delete-'+item.id}
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


{/* #imgs */}
                                      {/* thumbnail */}
                                      <TableCell 
                                        key='thumbnail'
                                        padding='checkbox' 
                                        align='center'>
                                          <Link href={item.fileUrl} rel="noopener noreferrer" target="_blank" onClick={(event) => {event.stopPropagation();}}>
                                            <Avatar alt="Image" src={item.smallTnUrl} />
                                          </Link>
                                      </TableCell>
{/* #imgs */}


                                      {/* fileName */}
                                      <TableCell
                                        key='fileName'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.fileName!==null)?item.fileName:'')}
                                      </TableCell>

                                      {/* fileSizeKb */}
                                      <TableCell
                                        key='fileSizeKb'
                                        align='right'
                                        padding="default"
                                      >
                                        {String((item.fileSizeKb!==null)?item.fileSizeKb:'')}
                                      </TableCell>

                                      {/* fileType */}
                                      <TableCell
                                        key='fileType'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.fileType!==null)?item.fileType:'')}
                                      </TableCell>

                                      {/* filePath */}
                                      <TableCell
                                        key='filePath'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.filePath!==null)?item.filePath:'')}
                                      </TableCell>

                                      {/* smallTnPath */}
                                      <TableCell
                                        key='smallTnPath'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.smallTnPath!==null)?item.smallTnPath:'')}
                                      </TableCell>

                                      {/* mediumTnPath */}
                                      <TableCell
                                        key='mediumTnPath'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.mediumTnPath!==null)?item.mediumTnPath:'')}
                                      </TableCell>

                                      {/* licence */}
                                      <TableCell
                                        key='licence'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.licence!==null)?item.licence:'')}
                                      </TableCell>

                                      {/* description */}
                                      <TableCell
                                        key='description'
                                        align='left'
                                        padding="default"
                                      >
                                        {String((item.description!==null)?item.description:'')}
                                      </TableCell>

                                      {/* personId */}
                                      <TableCell
                                        key='personId'
                                        align='right'
                                        padding="default"
                                      >
                                        {String((item.personId!==null)?item.personId:'')}
                                      </TableCell>

                                    </TableRow>,
                                  ]);
                                })
                              }
                            </TableBody>
                          </Fade>
                        </Table>
                      )}
                      {/*
                        Grid view 
                      */}
                      {(viewTypeValue==='grid') && (
                          <Fade in={(!isOnApiRequest && items.length > 0)}>
                            <ImageAttachmentImagesGridView 
                              items={items}
                              permissions={permissions}
                              handleClickOnRow={handleClickOnRow}
                              handleUpdateClicked={handleUpdateClicked}
                              handleDeleteClicked={handleDeleteClicked}
                            />
                          </Fade>
                      )}

                    </div>
                    {/*
                      Pagination
                    */}
                    <ImageAttachmentCursorPagination
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
                    {(Boolean(ImageAttachmentPlotly)) && (
                      <ImageAttachmentPlotly />
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
        <ImageAttachmentCreatePanel
          permissions={permissions}
          handleClose={handleCreateDialogClose}
        />
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <ImageAttachmentUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
          handleImageUpdateClicked={handleImageUpdateClicked}
        />
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <ImageAttachmentDetailPanel
          permissions={permissions}
          item={detailItem}
          dialog={true}
          handleClose={handleDetailDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <ImageAttachmentDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <ImageAttachmentUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}

      {/* Dialog: Upload Image */}
      {(uploadImageDialogOpen) && (
        <ImageAttachmentUploadImageDialog
          handleCancel={handleImageUploadCancel}
          handleDone={handleImageUploadDone}
        />
      )}

      {/* Dialog: Update Image */}
      {(updateImageDialogOpen) && (
        <ImageAttachmentUpdateImageDialog
          item={updateItem}
          handleCancel={handleImageUpdateCancel}
          handleDone={handleImageUpdateDone}
        />
      )}
    </div>
  );
}

ImageAttachmentEnhancedTable.propTypes = {
  permissions: PropTypes.object,
};
