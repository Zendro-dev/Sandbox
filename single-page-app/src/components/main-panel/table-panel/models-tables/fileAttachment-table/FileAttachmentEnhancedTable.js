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
import FileAttachmentEnhancedTableHead from './components/FileAttachmentEnhancedTableHead'
import FileAttachmentEnhancedTableToolbar from './components/FileAttachmentEnhancedTableToolbar'
import FileAttachmentCreatePanel from './components/fileAttachment-create-panel/FileAttachmentCreatePanel'
import FileAttachmentUpdatePanel from './components/fileAttachment-update-panel/FileAttachmentUpdatePanel'
import FileAttachmentDetailPanel from './components/fileAttachment-detail-panel/FileAttachmentDetailPanel'
import FileAttachmentDeleteConfirmationDialog from './components/FileAttachmentDeleteConfirmationDialog'
import FileAttachmentUploadFileDialog from './components/FileAttachmentUploadFileDialog'
import FileAttachmentCursorPagination from './components/FileAttachmentCursorPagination'
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
import FileAttachmentPlotly from '../../../../plots/FileAttachmentPlotly';

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

export default function FileAttachmentEnhancedTable(props) {
  const classes = useStyles();
  const { permissions } = props;
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
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
      API Request: countFileAttachments
    */
    let cancelableApiReq = makeCancelable(api.fileAttachment.getCountItems(graphqlServerUrl, search));
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
          newError.locations=[{model: 'FileAttachment', query: 'countFileAttachments', method: 'getData()', request: 'api.fileAttachment.getCountItems'}];
          newError.path=['FileAttachments'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        
        //check: countFileAttachments
        let countFileAttachments = response.data.data.countFileAttachments;
        if(countFileAttachments === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'countFileAttachments ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'FileAttachment', query: 'countFileAttachments', method: 'getData()', request: 'api.fileAttachment.getCountItems'}];
          newError.path=['FileAttachments'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: countFileAttachments type
        if(!Number.isInteger(countFileAttachments)) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'countFileAttachments ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'FileAttachment', query: 'countFileAttachments', method: 'getData()', request: 'api.fileAttachment.getCountItems'}];
          newError.path=['FileAttachments'];
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
          newError.message = 'countFileAttachments ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'FileAttachment', query: 'countFileAttachments', method: 'getData()', request: 'api.fileAttachment.getCountItems'}];
          newError.path=['FileAttachments'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
        }

        //ok
        setCount(countFileAttachments);


          /*
            API Request: fileAttachmentsConnection
          */
          let variables = {
            pagination: {...paginationRef.current}
          };
          let cancelableApiReqB = makeCancelable(api.fileAttachment.getItemsConnection(
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
                newError.locations=[{model: 'FileAttachment', query: 'fileAttachmentsConnection', method: 'getData()', request: 'api.fileAttachment.getItemsConnection'}];
                newError.path=['FileAttachments'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }

              //check: fileAttachmentsConnection
              let fileAttachmentsConnection = response.data.data.fileAttachmentsConnection;
              if(fileAttachmentsConnection === null) {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = 'fileAttachmentsConnection ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
                newError.locations=[{model: 'FileAttachment', query: 'fileAttachmentsConnection', method: 'getData()', request: 'api.fileAttachment.getItemsConnection'}];
                newError.path=['FileAttachments'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }

              //check: fileAttachmentsConnection type
              if(typeof fileAttachmentsConnection !== 'object'
              || !Array.isArray(fileAttachmentsConnection.edges)
              || typeof fileAttachmentsConnection.pageInfo !== 'object' 
              || fileAttachmentsConnection.pageInfo === null) {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = 'fileAttachmentsConnection ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
                newError.locations=[{model: 'FileAttachment', query: 'fileAttachmentsConnection', method: 'getData()', request: 'api.fileAttachment.getItemsConnection'}];
                newError.path=['FileAttachments'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }
              //get items
              let its = fileAttachmentsConnection.edges.map(o => o.node);
              let pi = fileAttachmentsConnection.pageInfo;

              //check: graphql errors
              if(response.data.errors) {
                let newError = {};
                newError.message = 'fileAttachmentsConnection ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
                newError.locations=[{model: 'FileAttachment', query: 'fileAttachmentsConnection', method: 'getData()', request: 'api.fileAttachment.getItemsConnection'}];
                newError.path=['FileAttachments'];
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
                newError.locations=[{model: 'FileAttachment', method: 'getData()'}];
                newError.path=['FileAttachments'];
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
            .catch((err) => { //error: on api.fileAttachment.getItemsConnection
              if(err.isCanceled) {
                return;
              } else {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
                newError.locations=[{model: 'FileAttachment', query: 'fileAttachmentsConnection', method: 'getData()', request: 'api.fileAttachment.getItemsConnection'}];
                newError.path=['FileAttachments'];
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
      .catch((err) => { //error: on api.fileAttachment.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'FileAttachment', query: 'countFileAttachments', method: 'getData()', request: 'api.fileAttachment.getCountItems'}];
          newError.path=['FileAttachments'];
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
    //set id (internalId)
    variables.id = item.id;

    /*
      API Request: deleteFileAttachment
    */
    let cancelableApiReq = makeCancelable(api.fileAttachment.deleteItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'FileAttachment', query: 'deleteFileAttachment', method: 'doDelete()', request: 'api.fileAttachment.deleteItem'}];
          newError.path=['FileAttachments', `id:${item.id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        //check: deleteFileAttachment
        let deleteFileAttachment = response.data.data.deleteFileAttachment;
        if(deleteFileAttachment === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'deleteFileAttachment ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'FileAttachment', query: 'deleteFileAttachment', method: 'doDelete()', request: 'api.fileAttachment.deleteItem'}];
          newError.path=['FileAttachments', `id:${item.id}` ,'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        /**
         * Type of deleteFileAttachment is not validated. Only not null is
         * checked above to confirm successfull operation.
         */

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'deleteFileAttachment ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'FileAttachment', query: 'deleteFileAttachment', method: 'doDelete()', request: 'api.fileAttachment.deleteItem'}];
          newError.path=['FileAttachments', `id:${item.id}` ,'delete'];
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
      .catch((err) => { //error: on api.fileAttachment.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'FileAttachment', query: 'deleteFileAttachment', method: 'doDelete()', request: 'api.fileAttachment.deleteItem'}];
          newError.path=['FileAttachments', `id:${item.id}` ,'delete'];
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
      API Request: csvTableTemplateFileAttachment
    */
    let cancelableApiReq = makeCancelable(api.fileAttachment.tableTemplate(graphqlServerUrl));
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
          newError.locations=[{model: 'FileAttachment', query: 'csvTableTemplateFileAttachment', method: 'getCsvTemplate()', request: 'api.fileAttachment.tableTemplate'}];
          newError.path=['FileAttachments', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          clearRequestGetCsvTemplate();
          showMessage(newError.message, withDetails);
          return;
        }

        //check: csvTableTemplateFileAttachment
        let csvTableTemplateFileAttachment = response.data.data.csvTableTemplateFileAttachment;
        if(csvTableTemplateFileAttachment === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateFileAttachment ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'FileAttachment', query: 'csvTableTemplateFileAttachment', method: 'getCsvTemplate()', request: 'api.fileAttachment.tableTemplate'}];
          newError.path=['FileAttachments', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
        }

        //check: csvTableTemplateFileAttachment type
        if(!Array.isArray(csvTableTemplateFileAttachment)) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateFileAttachment ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'FileAttachment', query: 'csvTableTemplateFileAttachment', method: 'getCsvTemplate()', request: 'api.fileAttachment.tableTemplate'}];
          newError.path=['FileAttachments', 'csvTemplate'];
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
          newError.message = 'csvTableTemplateFileAttachment ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'FileAttachment', query: 'csvTableTemplateFileAttachment', method: 'getCsvTemplate()', request: 'api.fileAttachment.tableTemplate'}];
          newError.path=['FileAttachments', 'csvTemplate'];
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
        let file = response.data.data.csvTableTemplateFileAttachment.join("\n");
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "fileAttachment-template.csv");
        document.body.appendChild(link);
        link.click();
        return;

      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.fileAttachment.tableTemplate
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'FileAttachment', query: 'csvTableTemplateFileAttachment', method: 'getCsvTemplate()', request: 'api.fileAttachment.tableTemplate'}];
          newError.path=['FileAttachments', 'csvTemplate'];
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
        (permissions&&permissions.fileAttachment&&Array.isArray(permissions.fileAttachment)
        &&(permissions.fileAttachment.includes('read') || permissions.fileAttachment.includes('*')))
        &&(
          <Grid container justify='center'>
            <Grid item xs={12}>
              <Paper className={classes.paper}>

                {/* Toolbar */}
                <FileAttachmentEnhancedTableToolbar
                  permissions={permissions}
                  search={search}
                  showToggleButtons={Boolean(FileAttachmentPlotly)}
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
                          id='FileAttachmentEnhancedTable-box-noData'
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
                      <Table id='FileAttachmentEnhancedTable-table' stickyHeader size='small' ref={tref}>

                        {/* Table Head */}
                        <FileAttachmentEnhancedTableHead
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
                          <TableBody id='FileAttachmentEnhancedTable-tableBody'>
                            {
                              items.map((item, index) => {
                                return ([
                                  /*
                                    Table Row
                                  */
                                  <TableRow
                                    id={'FileAttachmentEnhancedTable-row-'+item.id}
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
                                          id={'FileAttachmentEnhancedTable-row-iconButton-detail-'+item.id}
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
                                      (permissions&&permissions.fileAttachment&&Array.isArray(permissions.fileAttachment)
                                      &&(permissions.fileAttachment.includes('update') || permissions.fileAttachment.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.edit') }>
                                            <IconButton
                                              id={'FileAttachmentEnhancedTable-row-iconButton-edit-'+item.id}
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
                                      (permissions&&permissions.fileAttachment&&Array.isArray(permissions.fileAttachment)
                                      &&(permissions.fileAttachment.includes('delete') || permissions.fileAttachment.includes('*')))
                                      &&(
                                        <TableCell padding='checkbox' align='center'>
                                          <Tooltip title={ t('modelPanels.delete') }>
                                            <IconButton
                                              id={'FileAttachmentEnhancedTable-row-iconButton-delete-'+item.id}
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
                                      align='left'
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

                                    {/* fileUrl */}
                                    <TableCell
                                      key='fileUrl'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.fileUrl!==null)?item.fileUrl:'')}
                                    </TableCell>

                                    {/* smallTnUrl */}
                                    <TableCell
                                      key='smallTnUrl'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.smallTnUrl!==null)?item.smallTnUrl:'')}
                                    </TableCell>

                                    {/* mediumTnUrl */}
                                    <TableCell
                                      key='mediumTnUrl'
                                      align='left'
                                      padding="default"
                                    >
                                      {String((item.mediumTnUrl!==null)?item.mediumTnUrl:'')}
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
                    <FileAttachmentCursorPagination
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
                    {(Boolean(FileAttachmentPlotly)) && (
                      <FileAttachmentPlotly />
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
        <FileAttachmentCreatePanel
          permissions={permissions}
          handleClose={handleCreateDialogClose}
        />
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <FileAttachmentUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <FileAttachmentDetailPanel
          permissions={permissions}
          item={detailItem}
          dialog={true}
          handleClose={handleDetailDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <FileAttachmentDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <FileAttachmentUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}
    </div>
  );
}

FileAttachmentEnhancedTable.propTypes = {
  permissions: PropTypes.object,
};
