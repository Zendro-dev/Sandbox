import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modelChange } from '../../../../../../../store/actions'
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
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
//lazy loading
const EjemplarAttributesPage = lazy(() => import(/* webpackChunkName: "Detail-Attributes-Ejemplar" */ './components/ejemplar-attributes-page/EjemplarAttributesPage'));
const EjemplarAssociationsPage = lazy(() => import(/* webpackChunkName: "Detail-Associations-Ejemplar" */ './components/ejemplar-associations-page/EjemplarAssociationsPage'));
const EjemplarUpdatePanel = lazy(() => import(/* webpackChunkName: "Detail-Update-Ejemplar" */ '../ejemplar-update-panel/EjemplarUpdatePanel'));
const EjemplarDeleteConfirmationDialog = lazy(() => import(/* webpackChunkName: "Detail-Delete-Ejemplar" */ '../EjemplarDeleteConfirmationDialog'));
const CaracteristicaCualitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Detail-Detail-CaracteristicaCualitativa" */ '../../../caracteristica_cualitativa-table/components/caracteristica_cualitativa-detail-panel/Caracteristica_cualitativaDetailPanel'));
const CaracteristicaCuantitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Detail-Detail-CaracteristicaCuantitativa" */ '../../../caracteristica_cuantitativa-table/components/caracteristica_cuantitativa-detail-panel/Caracteristica_cuantitativaDetailPanel'));
const TaxonDetailPanel = lazy(() => import(/* webpackChunkName: "Detail-Detail-Taxon" */ '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'));

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

export default function EjemplarDetailPanel(props) {
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

  const [caracteristica_cualitativaDetailDialogOpen, setCaracteristica_cualitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cualitativaDetailItem, setCaracteristica_cualitativaDetailItem] = useState(undefined);
  const [caracteristica_cuantitativaDetailDialogOpen, setCaracteristica_cuantitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cuantitativaDetailItem, setCaracteristica_cuantitativaDetailItem] = useState(undefined);
  const [taxonDetailDialogOpen, setTaxonDetailDialogOpen] = useState(false);
  const [taxonDetailItem, setTaxonDetailItem] = useState(undefined);

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
      lastModelChanged['Ejemplar']&&
      lastModelChanged['Ejemplar'][String(item['id'])]) {
          
        //updated item
        if(lastModelChanged['Ejemplar'][String(item['id'])].op === "update"&&
            lastModelChanged['Ejemplar'][String(item['id'])].newItem) {
              //replace item
              setItemState(lastModelChanged['Ejemplar'][String(item['id'])].newItem);
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged['Ejemplar'][String(item['id'])].op === "delete") {
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
    if(caracteristica_cualitativaDetailItem !== undefined) {
      setCaracteristica_cualitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cualitativaDetailItem]);

  useEffect(() => {
    if(caracteristica_cuantitativaDetailItem !== undefined) {
      setCaracteristica_cuantitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cuantitativaDetailItem]);

  useEffect(() => {
    if(taxonDetailItem !== undefined) {
      setTaxonDetailDialogOpen(true);
    }
  }, [taxonDetailItem]);


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
  async function doDelete(event, item) {
    errors.current = [];
    
    //variables
    let variables = {};
    //id
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
        //check: response
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
        onSuccessDelete(event, item);
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

  function getInitialValueOkStates(item) {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
    */
    let initialValueOkStates = {};

    initialValueOkStates.id = (item.id!==null ? 1 : 0);
    initialValueOkStates.region = (item.region!==null ? 1 : 0);
    initialValueOkStates.localidad = (item.localidad!==null ? 1 : 0);
    initialValueOkStates.longitud = (item.longitud!==null ? 1 : 0);
    initialValueOkStates.latitud = (item.latitud!==null ? 1 : 0);
    initialValueOkStates.datum = (item.datum!==null ? 1 : 0);
    initialValueOkStates.validacionambiente = (item.validacionambiente!==null ? 1 : 0);
    initialValueOkStates.geovalidacion = (item.geovalidacion!==null ? 1 : 0);
    initialValueOkStates.paismapa = (item.paismapa!==null ? 1 : 0);
    initialValueOkStates.estadomapa = (item.estadomapa!==null ? 1 : 0);
    initialValueOkStates.claveestadomapa = (item.claveestadomapa!==null ? 1 : 0);
    initialValueOkStates.mt24nombreestadomapa = (item.mt24nombreestadomapa!==null ? 1 : 0);
    initialValueOkStates.mt24claveestadomapa = (item.mt24claveestadomapa!==null ? 1 : 0);
    initialValueOkStates.municipiomapa = (item.municipiomapa!==null ? 1 : 0);
    initialValueOkStates.clavemunicipiomapa = (item.clavemunicipiomapa!==null ? 1 : 0);
    initialValueOkStates.mt24nombremunicipiomapa = (item.mt24nombremunicipiomapa!==null ? 1 : 0);
    initialValueOkStates.mt24clavemunicipiomapa = (item.mt24clavemunicipiomapa!==null ? 1 : 0);
    initialValueOkStates.incertidumbrexy = (item.incertidumbrexy!==null ? 1 : 0);
    initialValueOkStates.altitudmapa = (item.altitudmapa!==null ? 1 : 0);
    initialValueOkStates.usvserieI = (item.usvserieI!==null ? 1 : 0);
    initialValueOkStates.usvserieII = (item.usvserieII!==null ? 1 : 0);
    initialValueOkStates.usvserieIII = (item.usvserieIII!==null ? 1 : 0);
    initialValueOkStates.usvserieIV = (item.usvserieIV!==null ? 1 : 0);
    initialValueOkStates.usvserieV = (item.usvserieV!==null ? 1 : 0);
    initialValueOkStates.usvserieVI = (item.usvserieVI!==null ? 1 : 0);
    initialValueOkStates.anp = (item.anp!==null ? 1 : 0);
    initialValueOkStates.grupobio = (item.grupobio!==null ? 1 : 0);
    initialValueOkStates.subgrupobio = (item.subgrupobio!==null ? 1 : 0);
    initialValueOkStates.taxon = (item.taxon!==null ? 1 : 0);
    initialValueOkStates.autor = (item.autor!==null ? 1 : 0);
    initialValueOkStates.estatustax = (item.estatustax!==null ? 1 : 0);
    initialValueOkStates.reftax = (item.reftax!==null ? 1 : 0);
    initialValueOkStates.taxonvalido = (item.taxonvalido!==null ? 1 : 0);
    initialValueOkStates.autorvalido = (item.autorvalido!==null ? 1 : 0);
    initialValueOkStates.reftaxvalido = (item.reftaxvalido!==null ? 1 : 0);
    initialValueOkStates.taxonvalidado = (item.taxonvalidado!==null ? 1 : 0);
    initialValueOkStates.endemismo = (item.endemismo!==null ? 1 : 0);
    initialValueOkStates.taxonextinto = (item.taxonextinto!==null ? 1 : 0);
    initialValueOkStates.ambiente = (item.ambiente!==null ? 1 : 0);
    initialValueOkStates.nombrecomun = (item.nombrecomun!==null ? 1 : 0);
    initialValueOkStates.formadecrecimiento = (item.formadecrecimiento!==null ? 1 : 0);
    initialValueOkStates.prioritaria = (item.prioritaria!==null ? 1 : 0);
    initialValueOkStates.nivelprioridad = (item.nivelprioridad!==null ? 1 : 0);
    initialValueOkStates.exoticainvasora = (item.exoticainvasora!==null ? 1 : 0);
    initialValueOkStates.nom059 = (item.nom059!==null ? 1 : 0);
    initialValueOkStates.cites = (item.cites!==null ? 1 : 0);
    initialValueOkStates.iucn = (item.iucn!==null ? 1 : 0);
    initialValueOkStates.categoriaresidenciaaves = (item.categoriaresidenciaaves!==null ? 1 : 0);
    initialValueOkStates.probablelocnodecampo = (item.probablelocnodecampo!==null ? 1 : 0);
    initialValueOkStates.obsusoinfo = (item.obsusoinfo!==null ? 1 : 0);
    initialValueOkStates.coleccion = (item.coleccion!==null ? 1 : 0);
    initialValueOkStates.institucion = (item.institucion!==null ? 1 : 0);
    initialValueOkStates.paiscoleccion = (item.paiscoleccion!==null ? 1 : 0);
    initialValueOkStates.numcatalogo = (item.numcatalogo!==null ? 1 : 0);
    initialValueOkStates.numcolecta = (item.numcolecta!==null ? 1 : 0);
    initialValueOkStates.procedenciaejemplar = (item.procedenciaejemplar!==null ? 1 : 0);
    initialValueOkStates.determinador = (item.determinador!==null ? 1 : 0);
    initialValueOkStates.aniodeterminacion = (item.aniodeterminacion!==null ? 1 : 0);
    initialValueOkStates.mesdeterminacion = (item.mesdeterminacion!==null ? 1 : 0);
    initialValueOkStates.diadeterminacion = (item.diadeterminacion!==null ? 1 : 0);
    initialValueOkStates.fechadeterminacion = (item.fechadeterminacion!==null ? 1 : 0);
    initialValueOkStates.calificadordeterminacion = (item.calificadordeterminacion!==null ? 1 : 0);
    initialValueOkStates.colector = (item.colector!==null ? 1 : 0);
    initialValueOkStates.aniocolecta = (item.aniocolecta!==null ? 1 : 0);
    initialValueOkStates.mescolecta = (item.mescolecta!==null ? 1 : 0);
    initialValueOkStates.diacolecta = (item.diacolecta!==null ? 1 : 0);
    initialValueOkStates.fechacolecta = (item.fechacolecta!==null ? 1 : 0);
    initialValueOkStates.tipo = (item.tipo!==null ? 1 : 0);
    initialValueOkStates.ejemplarfosil = (item.ejemplarfosil!==null ? 1 : 0);
    initialValueOkStates.proyecto = (item.proyecto!==null ? 1 : 0);
    initialValueOkStates.fuente = (item.fuente!==null ? 1 : 0);
    initialValueOkStates.formadecitar = (item.formadecitar!==null ? 1 : 0);
    initialValueOkStates.licenciauso = (item.licenciauso!==null ? 1 : 0);
    initialValueOkStates.urlproyecto = (item.urlproyecto!==null ? 1 : 0);
    initialValueOkStates.urlorigen = (item.urlorigen!==null ? 1 : 0);
    initialValueOkStates.urlejemplar = (item.urlejemplar!==null ? 1 : 0);
    initialValueOkStates.ultimafechaactualizacion = (item.ultimafechaactualizacion!==null ? 1 : 0);
    initialValueOkStates.cuarentena = (item.cuarentena!==null ? 1 : 0);
    initialValueOkStates.version = (item.version!==null ? 1 : 0);
    initialValueOkStates.especie = (item.especie!==null ? 1 : 0);
    initialValueOkStates.especievalida = (item.especievalida!==null ? 1 : 0);
    initialValueOkStates.especievalidabusqueda = (item.especievalidabusqueda!==null ? 1 : 0);

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
      dispatch(modelChange('Ejemplar', 'update', item, newItem, changedAssociations))
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
    dispatch(modelChange('Ejemplar', 'delete', item, null))
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

  const handleClickOnCaracteristica_cualitativaRow = (event, item) => {
    setCaracteristica_cualitativaDetailItem(item);
  };

  const handleCaracteristica_cualitativaDetailDialogClose = (event) => {
    delayedCloseCaracteristica_cualitativaDetailPanel(event, 500);
  }

  const delayedCloseCaracteristica_cualitativaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCaracteristica_cualitativaDetailDialogOpen(false);
        setCaracteristica_cualitativaDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };
  const handleClickOnCaracteristica_cuantitativaRow = (event, item) => {
    setCaracteristica_cuantitativaDetailItem(item);
  };

  const handleCaracteristica_cuantitativaDetailDialogClose = (event) => {
    delayedCloseCaracteristica_cuantitativaDetailPanel(event, 500);
  }

  const delayedCloseCaracteristica_cuantitativaDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setCaracteristica_cuantitativaDetailDialogOpen(false);
        setCaracteristica_cuantitativaDetailItem(undefined);
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
                  id='EjemplarDetailPanel-button-close'
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
                { t('modelPanels.detailOf') +  ": Ejemplar | id: " + itemState['id'] }
              </Typography>
              {/*
                Actions:
                - Edit
                - Delete
              */}
              {
                /* acl check */
                (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
                &&(permissions.ejemplar.includes('update') || permissions.ejemplar.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.edit') }>
                      <IconButton
                        id='EjemplarDetailPanel-button-edit'
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
                (permissions&&permissions.ejemplar&&Array.isArray(permissions.ejemplar)
                &&(permissions.ejemplar.includes('delete') || permissions.ejemplar.includes('*')))
                &&(!deleted)&&(
                  
                    <Tooltip title={ t('modelPanels.delete') }>
                      <IconButton
                        id='EjemplarDetailPanel-button-delete'
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
                <EjemplarAttributesPage
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
                <Suspense fallback={<div />}>
                  {/* Associations Page */}
                  <EjemplarAssociationsPage
                    item={itemState}
                    deleted={deleted}
                    handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
                    handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                    handleClickOnTaxonRow={handleClickOnTaxonRow}
                  />
                </Suspense>
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
              <Suspense fallback={<div />}>
                <EjemplarAttributesPage
                  item={itemState}
                  valueOkStates={valueOkStates}
                />
              </Suspense>
            </Grid>
  
            <Grid item xs={12}>
              {/* Associations Page */}
              <Suspense fallback={<div />}>
                <EjemplarAssociationsPage
                  item={itemState}
                  deleted={deleted}
                  handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
                />
              </Suspense>
            </Grid>

          </Grid>
        </div>
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

      {/* Dialog: Caracteristica_cualitativa Detail Panel */}
      {(caracteristica_cualitativaDetailDialogOpen) && (
        <Suspense fallback={<div />}>
          <CaracteristicaCualitativaDetailPanel
            permissions={permissions}
            item={caracteristica_cualitativaDetailItem}
            dialog={true}
            handleClose={handleCaracteristica_cualitativaDetailDialogClose}
          />
        </Suspense>
      )}
      {/* Dialog: Caracteristica_cuantitativa Detail Panel */}
      {(caracteristica_cuantitativaDetailDialogOpen) && (
        <Suspense fallback={<div />}>
          <CaracteristicaCuantitativaDetailPanel
            permissions={permissions}
            item={caracteristica_cuantitativaDetailItem}
            dialog={true}
            handleClose={handleCaracteristica_cuantitativaDetailDialogClose}
          />
        </Suspense>
      )}
      {/* Dialog: Taxon Detail Panel */}
      {(taxonDetailDialogOpen) && (
        <Suspense fallback={<div />}>
          <TaxonDetailPanel
            permissions={permissions}
            item={taxonDetailItem}
            dialog={true}
            handleClose={handleTaxonDetailDialogClose}
          />
        </Suspense>
      )}
    </div>
  );
}
EjemplarDetailPanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};