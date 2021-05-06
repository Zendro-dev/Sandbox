import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modelChange } from '../../../../../../../store/actions'
import PropTypes from 'prop-types';
import api from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import CuadranteAttributesPage from './components/cuadrante-attributes-page/CuadranteAttributesPage'
import CuadranteAssociationsPage from './components/cuadrante-associations-page/CuadranteAssociationsPage'
import CuadranteUpdatePanel from '../cuadrante-update-panel/CuadranteUpdatePanel'
import CuadranteDeleteConfirmationDialog from '../CuadranteDeleteConfirmationDialog'
import GrupoEnfoqueDetailPanel from '../../../grupo_enfoque-table/components/grupo_enfoque-detail-panel/Grupo_enfoqueDetailPanel'
import TaxonDetailPanel from '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'
import TipoPlantaDetailPanel from '../../../tipo_planta-table/components/tipo_planta-detail-panel/Tipo_plantaDetailPanel'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateOk from '@material-ui/icons/CheckCircleOutlined';
import { red, green } from '@material-ui/core/colors';

const appBarHeight = 72;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
    minHeight: 1200,
    paddingTop: theme.spacing(1),
  },
  appBar: {
    height: appBarHeight,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
  },
  divider: {
    marginTop: theme.spacing(2),
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CuadranteDetailPanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    permissions, 
    item,
    dialog,
    handleClose,
  } = props;
  
  const [open, setOpen] = useState(true);
  const [itemState, setItemState] = useState(item);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates(item));
  const lastFetchTime = useRef(Date.now());

  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(undefined);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteConfirmationItem, setDeleteConfirmationItem] = useState(undefined);

  const [grupo_enfoqueDetailDialogOpen, setGrupo_enfoqueDetailDialogOpen] = useState(false);
  const [grupo_enfoqueDetailItem, setGrupo_enfoqueDetailItem] = useState(undefined);
  const [taxonDetailDialogOpen, setTaxonDetailDialogOpen] = useState(false);
  const [taxonDetailItem, setTaxonDetailItem] = useState(undefined);
  const [tipo_plantaDetailDialogOpen, setTipo_plantaDetailDialogOpen] = useState(false);
  const [tipo_plantaDetailItem, setTipo_plantaDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isCanceling = useRef(false);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);
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

   /**
    * Callbacks:
    *  showMessage
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
    let isNewChange = (lastFetchTime.current<lastChangeTimestamp);
    if(!isNewChange) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();

    /*
     * Case 1: 
     * This item was updated, either in his attributes or in his associations, or was deleted.
     * 
     * Conditions:
     * A: the item was modified.
     * B: the item was deleted.
     * 
     * Actions:
     * if A:
     * - replace item
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged['cuadrante']&&
      lastModelChanged['cuadrante'][String(item['cuadrante_id'])]) {
          
        //updated item
        if(lastModelChanged['cuadrante'][String(item['cuadrante_id'])].op === "update"&&
            lastModelChanged['cuadrante'][String(item['cuadrante_id'])].newItem) {
              //replace item
              setItemState(lastModelChanged['cuadrante'][String(item['cuadrante_id'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['cuadrante'][String(item['cuadrante_id'])].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);
  
  useEffect(() => {
    if(grupo_enfoqueDetailItem !== undefined) {
      setGrupo_enfoqueDetailDialogOpen(true);
    }
  }, [grupo_enfoqueDetailItem]);

  useEffect(() => {
    if(taxonDetailItem !== undefined) {
      setTaxonDetailDialogOpen(true);
    }
  }, [taxonDetailItem]);

  useEffect(() => {
    if(tipo_plantaDetailItem !== undefined) {
      setTipo_plantaDetailDialogOpen(true);
    }
  }, [tipo_plantaDetailItem]);


  useEffect(() => {
    if(updateItem !== undefined) {
      setUpdateDialogOpen(true);
    }
  }, [updateItem]);

  useEffect(() => {
    if(deleteConfirmationItem !== undefined) {
      setDeleteConfirmationDialogOpen(true);
    }
  }, [deleteConfirmationItem]);

  useEffect(() => {
    if(itemState) {
      setValueOkStates(getInitialValueOkStates(itemState));
    }
    lastFetchTime.current = Date.now();
  }, [itemState]);

  /**
   * Utils
   */

  function clearRequestDoDelete() {
    delayedCloseDeleteConfirmationAccept(null, 500);
  }

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
    
    //variables
    let variables = {};
    //cuadrante_id
    variables.cuadrante_id = item.cuadrante_id;

    /*
      API Request: deleteCuadrante
    */
    let cancelableApiReq = makeCancelable(api.cuadrante.deleteItem(graphqlServerUrl, variables));
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
          newError.locations=[{model: 'cuadrante', query: 'deleteCuadrante', method: 'doDelete()', request: 'api.cuadrante.deleteItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}`, 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        //check: deleteCuadrante
        let deleteCuadrante = response.data.data.deleteCuadrante;
        if(deleteCuadrante === null) {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = 'deleteCuadrante ' + t('modelPanels.errors.data.e5', 'could not be completed.');
          newError.locations=[{model: 'cuadrante', query: 'deleteCuadrante', method: 'doDelete()', request: 'api.cuadrante.deleteItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}` , 'delete'];
          newError.extensions = {graphqlResponse:{data:response.data.data, errors:response.data.errors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }

        /**
         * Type of deleteCuadrante is not validated. Only not null is
         * checked above to confirm successfull operation.
         */

        //check: graphql errors
        if(response.data.errors) {
          let newError = {};
          let withDetails=true;
          variant.current='info';
          newError.message = 'deleteCuadrante ' + t('modelPanels.errors.data.e6', 'completed with errors.');
          newError.locations=[{model: 'cuadrante', query: 'deleteCuadrante', method: 'doDelete()', request: 'api.cuadrante.deleteItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}` ,'delete'];
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
        onSuccessDelete(event, item);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on deleteCuadrante
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'cuadrante', query: 'deleteCuadrante', method: 'doDelete()', request: 'api.cuadrante.deleteItem'}];
          newError.path=['Cuadrantes', `cuadrante_id:${item.cuadrante_id}` ,'delete'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoDelete();
          return;
        }
      });
      
  }

  function getInitialValueOkStates(item) {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
    */
    let initialValueOkStates = {};

    initialValueOkStates.cuadrante_id = (item.cuadrante_id!==null ? 1 : 0);
    initialValueOkStates.produccion_valor = (item.produccion_valor!==null ? 1 : 0);
    initialValueOkStates.produccion_etiqueta = (item.produccion_etiqueta!==null ? 1 : 0);
    initialValueOkStates.autoconsumo_valor = (item.autoconsumo_valor!==null ? 1 : 0);
    initialValueOkStates.autoconsumo_etiqueta = (item.autoconsumo_etiqueta!==null ? 1 : 0);
    initialValueOkStates.compra_valor = (item.compra_valor!==null ? 1 : 0);
    initialValueOkStates.compra_etiqueta = (item.compra_etiqueta!==null ? 1 : 0);
    initialValueOkStates.venta_valor = (item.venta_valor!==null ? 1 : 0);
    initialValueOkStates.venta_etiqueta = (item.venta_etiqueta!==null ? 1 : 0);
    initialValueOkStates.nombre_comun_grupo_enfoque = (item.nombre_comun_grupo_enfoque!==null ? 1 : 0);
    initialValueOkStates.grupo_enfoque_id = -2; //FK
    initialValueOkStates.taxon_id = -2; //FK
    initialValueOkStates.tipo_planta_id = -2; //FK

    return initialValueOkStates;
  }

  const handleCancel = (event) => {
    setOpen(false);
    handleClose(event);
  }

  const handleUpdateClicked = (event, item) => {
    setOpen(false);
    delayedOpenUpdatePanel(event, item, 50);
  }

  const delayedOpenUpdatePanel = async (event, item, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateItem(item);
        resolve("ok");
      }, ms);
    });
  };

  const handleUpdateDialogClose = (event, status, item, newItem, changedAssociations) => {
    if(status) {
      dispatch(modelChange('cuadrante', 'update', item, newItem, changedAssociations))
    }
    delayedCloseUpdatePanel(event, 500);
  }

  const delayedCloseUpdatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateDialogOpen(false);
        setUpdateItem(undefined);
        handleClose(event);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteClicked = (event, item) => {
    setDeleteConfirmationItem(item);
  }

  const handleDeleteConfirmationAccept = (event, item) => {
    setOpen(false);
    doDelete(event, item);
  }

  const onSuccessDelete = (event, item) => {
    dispatch(modelChange('cuadrante', 'delete', item, null))
    delayedCloseDeleteConfirmationAccept(event, 500);
  }

  const delayedCloseDeleteConfirmationAccept = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        handleClose(event);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteConfirmationReject = (event) => {
    delayedCloseDeleteConfirmationReject(event, 500);
  }

  const delayedCloseDeleteConfirmationReject = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleClickOnGrupo_enfoqueRow = (event, item) => {
    setGrupo_enfoqueDetailItem(item);
  };

  const handleGrupo_enfoqueDetailDialogClose = (event) => {
    delayedCloseGrupo_enfoqueDetailPanel(event, 500);
  }

  const delayedCloseGrupo_enfoqueDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setGrupo_enfoqueDetailDialogOpen(false);
        setGrupo_enfoqueDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnTaxonRow = (event, item) => {
    setTaxonDetailItem(item);
  };

  const handleTaxonDetailDialogClose = (event) => {
    delayedCloseTaxonDetailPanel(event, 500);
  }

  const delayedCloseTaxonDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTaxonDetailDialogOpen(false);
        setTaxonDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnTipo_plantaRow = (event, item) => {
    setTipo_plantaDetailItem(item);
  };

  const handleTipo_plantaDetailDialogClose = (event) => {
    delayedCloseTipo_plantaDetailPanel(event, 500);
  }

  const delayedCloseTipo_plantaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setTipo_plantaDetailDialogOpen(false);
        setTipo_plantaDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  return (
    <div>
      {/* Dialog Mode */}
      {(dialog !== undefined && dialog === true) && (
        
        <Dialog fullScreen open={open} TransitionComponent={Transition}
          onClose={(event) => {
            if(!isCanceling.current){
              isCanceling.current = true;
              handleCancel(event);
            }
          }}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Tooltip title={ t('modelPanels.close') }>
                <IconButton
                  id='CuadranteDetailPanel-button-close'
                  edge="start"
                  color="inherit"
                  onClick={(event) => {
                    if(!isCanceling.current){
                      isCanceling.current = true;
                      handleCancel(event);
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" className={classes.title}>
                { t('modelPanels.detailOf') +  ": Cuadrante | cuadrante_id: " + itemState['cuadrante_id'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.cuadrante&&Array.isArray(permissions.cuadrante)
                &&(permissions.cuadrante.includes('update') || permissions.cuadrante.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='CuadranteDetailPanel-button-edit'
                        color='inherit'
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUpdateClicked(event, itemState);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                )
              }
              {
                /* acl check */
                (permissions&&permissions.cuadrante&&Array.isArray(permissions.cuadrante)
                &&(permissions.cuadrante.includes('delete') || permissions.cuadrante.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='CuadranteDetailPanel-button-delete'
                        color='inherit'
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteClicked(event, itemState);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                )
              }
              
            </Toolbar>
          </AppBar>
          <Toolbar className={classes.appBar}/>

          <div className={classes.root}>
            <Grid container justify='center' alignItems='flex-start' alignContent='flex-start' spacing={0}>

              <Grid item xs={12}>
                {/* Delete warning */}
                <Box
                  width="100%"
                  p={0}
                  position="fixed"
                  top={appBarHeight}
                  left={0}
                  zIndex="speedDial"
                >
                  <Collapse in={deleted}>
                    <Card className={classes.warningCard} square={true}>
                      <CardHeader
                        avatar={
                          <DeletedWarning style={{ color: red[700] }} />
                        }
                        title={ t('modelPanels.deletedWarning', "This item no longer exists. It was deleted elsewhere.") }
                        subheader="Deleted"
                      />
                    </Card>
                  </Collapse>
                </Box>
              </Grid>
  
              <Grid item xs={12}>
                {/* Update warning */}
                <Box
                  width="100%"
                  p={0}
                  position="fixed"
                  top={appBarHeight}
                  left={0}
                  zIndex="speedDial"
                >
                  <Collapse in={updated}>
                    <Card className={classes.warningCard} square={true}>
                      <CardHeader
                        avatar={
                          <UpdateOk style={{ color: green[700] }} />
                        }
                        title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                        subheader="Updated"
                      />
                      <CardActions>
                        <Button size="small" color="primary" onClick={()=>{setUpdated(false)}}>
                          Got it
                        </Button>
                      </CardActions>
                    </Card>
                  </Collapse>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Collapse in={updated||deleted}>
                  <Card className={classes.warningCard} square={true} elevation={0}>
                  </Card>
                </Collapse>
              </Grid>

              <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
                <Divider className={classes.divider} />
                <Grid container justify='flex-start'>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      { t('modelPanels.attributes') }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                {/* Attributes Page */}
                <CuadranteAttributesPage
                  item={itemState}
                  valueOkStates={valueOkStates}
                />
              </Grid>

              <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
                <Divider />
                <Grid container justify='flex-start'>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      { t('modelPanels.associations') }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
    
              <Grid item xs={12}>
                {/* Associations Page */}
                <CuadranteAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
                  handleClickOnTipo_plantaRow={handleClickOnTipo_plantaRow}
                />
              </Grid>
            </Grid>
          </div>
        </Dialog>
      )}

      {/* No-Dialog Mode */}
      {(dialog !== undefined && dialog === false) && (
    
        <div className={classes.root}>
          <Grid container justify='center' alignItems='flex-start' alignContent='flex-start' spacing={0}>

            <Grid item xs={12}>
              {/* Attributes Page */}
              <CuadranteAttributesPage
                item={itemState}
                valueOkStates={valueOkStates}
              />
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <CuadranteAssociationsPage
                item={itemState}
                deleted={deleted}
                handleClickOnGrupo_enfoqueRow={handleClickOnGrupo_enfoqueRow}
                handleClickOnTaxonRow={handleClickOnTaxonRow}
                handleClickOnTipo_plantaRow={handleClickOnTipo_plantaRow}
              />
            </Grid>

          </Grid>
        </div>
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <CuadranteUpdatePanel
          permissions={permissions}
          item={updateItem}
          handleClose={handleUpdateDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <CuadranteDeleteConfirmationDialog
          permissions={permissions}
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Grupo_enfoque Detail Panel */}
      {(grupo_enfoqueDetailDialogOpen) && (
        <GrupoEnfoqueDetailPanel
          permissions={permissions}
          item={grupo_enfoqueDetailItem}
          dialog={true}
          handleClose={handleGrupo_enfoqueDetailDialogClose}
        />
      )}
      {/* Dialog: Taxon Detail Panel */}
      {(taxonDetailDialogOpen) && (
        <TaxonDetailPanel
          permissions={permissions}
          item={taxonDetailItem}
          dialog={true}
          handleClose={handleTaxonDetailDialogClose}
        />
      )}
      {/* Dialog: Tipo_planta Detail Panel */}
      {(tipo_plantaDetailDialogOpen) && (
        <TipoPlantaDetailPanel
          permissions={permissions}
          item={tipo_plantaDetailItem}
          dialog={true}
          handleClose={handleTipo_plantaDetailDialogClose}
        />
      )}
    </div>
  );
}
CuadranteDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};