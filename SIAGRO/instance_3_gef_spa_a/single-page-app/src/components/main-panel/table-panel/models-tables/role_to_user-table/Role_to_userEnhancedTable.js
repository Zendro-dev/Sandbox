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
import RoleToUserEnhancedTableHead from './components/Role_to_userEnhancedTableHead'
import RoleToUserEnhancedTableToolbar from './components/Role_to_userEnhancedTableToolbar'
import RoleToUserCreatePanel from './components/role_to_user-create-panel/Role_to_userCreatePanel'
import RoleToUserUpdatePanel from './components/role_to_user-update-panel/Role_to_userUpdatePanel'
import RoleToUserDetailPanel from './components/role_to_user-detail-panel/Role_to_userDetailPanel'
import RoleToUserDeleteConfirmationDialog from './components/Role_to_userDeleteConfirmationDialog'
import RoleToUserUploadFileDialog from './components/Role_to_userUploadFileDialog'
import RoleToUserCursorPagination from './components/Role_to_userCursorPagination'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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

export default function RoleToUserEnhancedTable(props) {
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
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageInfo = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const isForwardPagination = useRef(true);
  const isCursorPaginating = useRef(false);
  const includeCursor = useRef(false);

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
    updateSizes();
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    /*
      API Request: countRole_to_users
    */
    let cancelableApiReq = makeCancelable(api.role_to_user.getCountItems(graphqlServerUrl, search));
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
          newError.locations=[{model: 'role_to_user', query: 'countRole_to_users', method: 'getData()', request: 'api.role_to_user.getCountItems'}];
          newError.path=['Role_to_users'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
        
        //check: countRole_to_users
        let countRole_to_users = response.data.data.countRole_to_users;
        if(countRole_to_users === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'countRole_to_users ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'role_to_user', query: 'countRole_to_users', method: 'getData()', request: 'api.role_to_user.getCountItems'}];
          newError.path=['Role_to_users'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

        //check: countRole_to_users type
        if(!Number.isInteger(countRole_to_users)) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'countRole_to_users ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'role_to_user', query: 'countRole_to_users', method: 'getData()', request: 'api.role_to_user.getCountItems'}];
          newError.path=['Role_to_users'];
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
          let withDetails=true;
          variant.current='info';
          newError.message = 'countRole_to_users ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'role_to_user', query: 'countRole_to_users', method: 'getData()', request: 'api.role_to_user.getCountItems'}];
          newError.path=['Role_to_users'];
          newError.extensions = {graphQL:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
        }

        //ok
        setCount(countRole_to_users);


          /*
            API Request: role_to_usersConnection
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
          let cancelableApiReqB = makeCancelable(api.role_to_user.getItemsConnection(
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
                newError.locations=[{model: 'role_to_user', query: 'role_to_usersConnection', method: 'getData()', request: 'api.role_to_user.getItemsConnection'}];
                newError.path=['Role_to_users'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }

              //check: role_to_usersConnection
              let role_to_usersConnection = response.data.data.role_to_usersConnection;
              if(role_to_usersConnection === null) {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = 'role_to_usersConnection ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
                newError.locations=[{model: 'role_to_user', query: 'role_to_usersConnection', method: 'getData()', request: 'api.role_to_user.getItemsConnection'}];
                newError.path=['Role_to_users'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }

              //check: role_to_usersConnection type
              if(typeof role_to_usersConnection !== 'object'
              || !Array.isArray(role_to_usersConnection.edges)
              || typeof role_to_usersConnection.pageInfo !== 'object' 
              || role_to_usersConnection.pageInfo === null) {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = 'role_to_usersConnection ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
                newError.locations=[{model: 'role_to_user', query: 'role_to_usersConnection', method: 'getData()', request: 'api.role_to_user.getItemsConnection'}];
                newError.path=['Role_to_users'];
                newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
                errors.current.push(newError);
                console.log("Error: ", newError);

                showMessage(newError.message, withDetails);
                clearRequestGetData();
                return;
              }
              //get items
              let its = role_to_usersConnection.edges.map(o => o.node);
              let pi = role_to_usersConnection.pageInfo;

              //check: graphql errors
              if(response.data.errors) {
                let newError = {};
                let withDetails=true;
                variant.current='info';
                newError.message = 'role_to_usersConnection ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
                newError.locations=[{model: 'role_to_user', query: 'role_to_usersConnection', method: 'getData()', request: 'api.role_to_user.getItemsConnection'}];
                newError.path=['Role_to_users'];
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
            .catch((err) => { //error: on api.role_to_user.getItemsConnection
              if(err.isCanceled) {
                return;
              } else {
                let newError = {};
                let withDetails=true;
                variant.current='error';
                newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
                newError.locations=[{model: 'role_to_user', query: 'role_to_usersConnection', method: 'getData()', request: 'api.role_to_user.getItemsConnection'}];
                newError.path=['Role_to_users'];
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
      .catch((err) => { //error: on api.role_to_user.getCountItems
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'role_to_user', query: 'countRole_to_users', method: 'getData()', request: 'api.role_to_user.getCountItems'}];
          newError.path=['Role_to_users'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, t, dataTrigger, search, orderBy, order, rowsPerPage, showMessage]);

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
              //configure
              isForwardPagination.current = true;
              pageInfo.current.endCursor = pageInfo.current.startCursor;
              includeCursor.current = true;
              //reload
              setDataTrigger(prevDataTrigger => !prevDataTrigger);
            }
      }
      //clear changes state
      dispatch(clearChanges());
    }
  }, [changes, dispatch]);

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
    updateSizes();
  }, [isOnApiRequest]);

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
      API Request: deleteRole_to_user
    */
    let cancelableApiReq = makeCancelable(api.role_to_user.deleteItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'role_to_user', query: 'deleteRole_to_user', method: 'doDelete()', request: 'api.role_to_user.deleteItem'}];
          newError.path=['Role_to_users', `id:${item.id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        //check: deleteRole_to_user
        let deleteRole_to_user = response.data.data.deleteRole_to_user;
        if(deleteRole_to_user === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'deleteRole_to_user ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'role_to_user', query: 'deleteRole_to_user', method: 'doDelete()', request: 'api.role_to_user.deleteItem'}];
          newError.path=['Role_to_users', `id:${item.id}` ,'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        /**
         * Type of deleteRole_to_user is not validated. Only not null is
         * checked above to confirm successfull operation.
         */

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'deleteRole_to_user ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'role_to_user', query: 'deleteRole_to_user', method: 'doDelete()', request: 'api.role_to_user.deleteItem'}];
          newError.path=['Role_to_users', `id:${item.id}` ,'delete'];
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
      .catch((err) => { //error: on api.role_to_user.deleteItem
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'role_to_user', query: 'deleteRole_to_user', method: 'doDelete()', request: 'api.role_to_user.deleteItem'}];
          newError.path=['Role_to_users', `id:${item.id}` ,'delete'];
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
      API Request: csvTableTemplateRole_to_user
    */
    let cancelableApiReq = makeCancelable(api.role_to_user.tableTemplate(graphqlServerUrl));
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
          newError.locations=[{model: 'role_to_user', query: 'csvTableTemplateRole_to_user', method: 'getCsvTemplate()', request: 'api.role_to_user.tableTemplate'}];
          newError.path=['Role_to_users', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          clearRequestGetCsvTemplate();
          showMessage(newError.message, withDetails);
          return;
        }

        //check: csvTableTemplateRole_to_user
        let csvTableTemplateRole_to_user = response.data.data.csvTableTemplateRole_to_user;
        if(csvTableTemplateRole_to_user === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateRole_to_user ' + t('modelPanels.errors.data.e2', 'could not be fetched.');
          newError.locations=[{model: 'role_to_user', query: 'csvTableTemplateRole_to_user', method: 'getCsvTemplate()', request: 'api.role_to_user.tableTemplate'}];
          newError.path=['Role_to_users', 'csvTemplate'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetCsvTemplate();
          return;
        }

        //check: csvTableTemplateRole_to_user type
        if(!Array.isArray(csvTableTemplateRole_to_user)) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'csvTableTemplateRole_to_user ' + t('modelPanels.errors.data.e4', ' received, does not have the expected format.');
          newError.locations=[{model: 'role_to_user', query: 'csvTableTemplateRole_to_user', method: 'getCsvTemplate()', request: 'api.role_to_user.tableTemplate'}];
          newError.path=['Role_to_users', 'csvTemplate'];
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
          newError.message = 'csvTableTemplateRole_to_user ' + t('modelPanels.errors.data.e3', 'fetched with errors.');
          newError.locations=[{model: 'role_to_user', query: 'csvTableTemplateRole_to_user', method: 'getCsvTemplate()', request: 'api.role_to_user.tableTemplate'}];
          newError.path=['Role_to_users', 'csvTemplate'];
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
        let file = response.data.data.csvTableTemplateRole_to_user.join("\n");
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "role_to_user-template.csv");
        document.body.appendChild(link);
        link.click();
        return;

      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.role_to_user.tableTemplate
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'role_to_user', query: 'csvTableTemplateRole_to_user', method: 'getCsvTemplate()', request: 'api.role_to_user.tableTemplate'}];
          newError.path=['Role_to_users', 'csvTemplate'];
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

  function clearRequestGetData() {
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

  function clearRequestDoDelete() {
    reloadData();
  }

  function clearRequestGetCsvTemplate() {
    //nothing to do.
  }

  function resetPageRefs() {
    isForwardPagination.current = true;
    pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);
    includeCursor.current = false;
    pageRef.current = 0;
  }

  function reloadData() {
    //configure
    isForwardPagination.current = true;
    pageInfo.current.endCursor = pageInfo.current.startCursor;
    includeCursor.current = true;
    //reload    
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
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

  /**
   * Handlers
   */

  /*
   * Search handlers
   */
  const handleSearchEnter = text => {
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
   * Sort handlers
   */
  const handleRequestSort = (event, property) => {
    resetPageRefs();
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

  return (
    <div className={classes.root}>
      {
        /* acl check */
        (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
        &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
        &&(
          <Grid container justify='center'>
            <Grid item xs={12} md={11}>
              <Paper className={classes.paper}>

                {/* Toolbar */}
                <RoleToUserEnhancedTableToolbar
                  permissions={permissions}
                  search={search}
                  onSearchEnter={handleSearchEnter}
                  onReloadClick={handleReloadClick}
                  handleAddClicked={handleCreateClicked}
                  handleBulkImportClicked={handleBulkImportClicked}
                  handleCsvTemplateClicked={handleCsvTemplateClicked}
                />

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
                          <Typography variant="body1" >{ t('modelPanels.noData') }</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>

                  {/* Table */}
                  <Table stickyHeader size='small' ref={tref}>

                    {/* Table Head */}
                    <RoleToUserEnhancedTableHead
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
                      <TableBody>
                        {
                          items.map((item, index) => {
                            return ([
                              /*
                                Table Row
                              */
                              <TableRow
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
                                  (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
                                  &&(permissions.role_to_user.includes('update') || permissions.role_to_user.includes('*')))
                                  &&(
                                    <TableCell padding='checkbox' align='center'>
                                      <Tooltip title={ t('modelPanels.edit') }>
                                        <IconButton
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
                                  (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
                                  &&(permissions.role_to_user.includes('delete') || permissions.role_to_user.includes('*')))
                                  &&(
                                    <TableCell padding='checkbox' align='center'>
                                      <Tooltip title={ t('modelPanels.delete') }>
                                        <IconButton
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

                                {/* userId */}
                                <TableCell
                                  key='userId'
                                  align='right'
                                  padding="default"
                                >
                                  {String((item.userId!==null)?item.userId:'')}
                                </TableCell>

                                {/* roleId */}
                                <TableCell
                                  key='roleId'
                                  align='right'
                                  padding="default"
                                >
                                  {String((item.roleId!==null)?item.roleId:'')}
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
                <RoleToUserCursorPagination
                  count={count}
                  rowsPerPageOptions={(count <=10) ? [] : (count <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage = { t('modelPanels.rows') }
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  handleFirstPageButtonClick={handleFirstPageButtonClick}
                  handleLastPageButtonClick={handleLastPageButtonClick}
                  handleNextButtonClick={handleNextButtonClick}
                  handleBackButtonClick={handleBackButtonClick}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Paper>
            </Grid>
          </Grid>
        )
      }

      {/* Dialog: Create Panel */}
      {(createDialogOpen) && (
        <RoleToUserCreatePanel
          permissions={permissions}
          handleClose={handleCreateDialogClose}
        />
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <RoleToUserUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <RoleToUserDetailPanel
          permissions={permissions}
          item={detailItem}
          dialog={true}
          handleClose={handleDetailDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <RoleToUserDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <RoleToUserUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}
    </div>
  );
}

RoleToUserEnhancedTable.propTypes = {
  permissions: PropTypes.object,
};
