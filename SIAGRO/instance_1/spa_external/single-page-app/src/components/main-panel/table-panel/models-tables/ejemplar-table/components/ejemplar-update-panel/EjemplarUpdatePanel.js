import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import EjemplarTabsA from './components/EjemplarTabsA';
import { loadApi } from '../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../utils';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateWarning from '@material-ui/icons/ErrorOutline';
import { amber, red } from '@material-ui/core/colors';
//lazy loading
const EjemplarAttributesPage = lazy(() => import(/* webpackChunkName: "Update-Attributes-Ejemplar" */ './components/ejemplar-attributes-page/EjemplarAttributesPage'));
const EjemplarAssociationsPage = lazy(() => import(/* webpackChunkName: "Update-Associations-Ejemplar" */ './components/ejemplar-associations-page/EjemplarAssociationsPage'));
const EjemplarConfirmationDialog = lazy(() => import(/* webpackChunkName: "Update-Confirmation-Ejemplar" */ './components/EjemplarConfirmationDialog'));
const CaracteristicaCualitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-CaracteristicaCualitativa" */ '../../../caracteristica_cualitativa-table/components/caracteristica_cualitativa-detail-panel/Caracteristica_cualitativaDetailPanel'));
const CaracteristicaCuantitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-CaracteristicaCuantitativa" */ '../../../caracteristica_cuantitativa-table/components/caracteristica_cuantitativa-detail-panel/Caracteristica_cuantitativaDetailPanel'));
const TaxonDetailPanel = lazy(() => import(/* webpackChunkName: "Update-Detail-Taxon" */ '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'));

const debounceTimeout = 700;
const appBarHeight = 64;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
  },
  tabsA: {
    backgroundColor: "#ffffff",
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: -26+3,
    right: 10,
    margin: '0 auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EjemplarUpdatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    permissions,
 
    item,
    handleClose,
  } = props;
  
  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const [valueAjvStates, setValueAjvStates] = useState(getInitialValueAjvStates());
  const lastFetchTime = useRef(Date.now());

  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);

  const values = useRef(getInitialValues());
  const valuesOkRefs = useRef(getInitialValueOkStates());
  const valuesAjvRefs = useRef(getInitialValueAjvStates());
  const changedAssociations = useRef({});
  
  const [caracteristicas_cualitativasIdsToAddState, setCaracteristicas_cualitativasIdsToAddState] = useState([]);
  const caracteristicas_cualitativasIdsToAdd = useRef([]);
  const [caracteristicas_cualitativasIdsToRemoveState, setCaracteristicas_cualitativasIdsToRemoveState] = useState([]);
  const caracteristicas_cualitativasIdsToRemove = useRef([]);
  const [caracteristicas_cuantitativasIdsToAddState, setCaracteristicas_cuantitativasIdsToAddState] = useState([]);
  const caracteristicas_cuantitativasIdsToAdd = useRef([]);
  const [caracteristicas_cuantitativasIdsToRemoveState, setCaracteristicas_cuantitativasIdsToRemoveState] = useState([]);
  const caracteristicas_cuantitativasIdsToRemove = useRef([]);
  const [taxonIdsToAddState, setTaxonIdsToAddState] = useState([]);
  const taxonIdsToAdd = useRef([]);
  const [taxonIdsToRemoveState, setTaxonIdsToRemoveState] = useState([]);
  const taxonIdsToRemove = useRef([]);

  const [caracteristica_cualitativaDetailDialogOpen, setCaracteristica_cualitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cualitativaDetailItem, setCaracteristica_cualitativaDetailItem] = useState(undefined);
  const [caracteristica_cuantitativaDetailDialogOpen, setCaracteristica_cuantitativaDetailDialogOpen] = useState(false);
  const [caracteristica_cuantitativaDetailItem, setCaracteristica_cuantitativaDetailItem] = useState(undefined);
  const [taxonDetailDialogOpen, setTaxonDetailDialogOpen] = useState(false);
  const [taxonDetailItem, setTaxonDetailItem] = useState(undefined);

  //debouncing & event contention
  const cancelablePromises = useRef([]);
  const isSaving = useRef(false);
  const isCanceling = useRef(false);
  const isClosing = useRef(false);
  const isDebouncingTabsChange = useRef(false);
  const currentTabValue = useRef(tabsValue);
  const lastTabValue = useRef(tabsValue);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

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
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged.Ejemplar&&
      lastModelChanged.Ejemplar[String(item.id)]) {

        //updated item
        if(lastModelChanged.Ejemplar[String(item.id)].op === "update"&&
            lastModelChanged.Ejemplar[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.Ejemplar[String(item.id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);

  useEffect(() => {
    if (caracteristica_cualitativaDetailItem !== undefined) {
      setCaracteristica_cualitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cualitativaDetailItem]);
  useEffect(() => {
    if (caracteristica_cuantitativaDetailItem !== undefined) {
      setCaracteristica_cuantitativaDetailDialogOpen(true);
    }
  }, [caracteristica_cuantitativaDetailItem]);
  useEffect(() => {
    if (taxonDetailItem !== undefined) {
      setTaxonDetailDialogOpen(true);
    }
  }, [taxonDetailItem]);

  /**
   * Utils
   */

  function clearRequestDoSave() {
    //reset contention flags
    isSaving.current = false;
    isClosing.current = false;
  }

  function getInitialValues() {
    let initialValues = {};

    initialValues.id = item.id;
    initialValues.region = item.region;
    initialValues.localidad = item.localidad;
    initialValues.longitud = item.longitud;
    initialValues.latitud = item.latitud;
    initialValues.datum = item.datum;
    initialValues.validacionambiente = item.validacionambiente;
    initialValues.geovalidacion = item.geovalidacion;
    initialValues.paismapa = item.paismapa;
    initialValues.estadomapa = item.estadomapa;
    initialValues.claveestadomapa = item.claveestadomapa;
    initialValues.mt24nombreestadomapa = item.mt24nombreestadomapa;
    initialValues.mt24claveestadomapa = item.mt24claveestadomapa;
    initialValues.municipiomapa = item.municipiomapa;
    initialValues.clavemunicipiomapa = item.clavemunicipiomapa;
    initialValues.mt24nombremunicipiomapa = item.mt24nombremunicipiomapa;
    initialValues.mt24clavemunicipiomapa = item.mt24clavemunicipiomapa;
    initialValues.incertidumbrexy = item.incertidumbrexy;
    initialValues.altitudmapa = item.altitudmapa;
    initialValues.usvserieI = item.usvserieI;
    initialValues.usvserieII = item.usvserieII;
    initialValues.usvserieIII = item.usvserieIII;
    initialValues.usvserieIV = item.usvserieIV;
    initialValues.usvserieV = item.usvserieV;
    initialValues.usvserieVI = item.usvserieVI;
    initialValues.anp = item.anp;
    initialValues.grupobio = item.grupobio;
    initialValues.subgrupobio = item.subgrupobio;
    initialValues.taxon = item.taxon;
    initialValues.autor = item.autor;
    initialValues.estatustax = item.estatustax;
    initialValues.reftax = item.reftax;
    initialValues.taxonvalido = item.taxonvalido;
    initialValues.autorvalido = item.autorvalido;
    initialValues.reftaxvalido = item.reftaxvalido;
    initialValues.taxonvalidado = item.taxonvalidado;
    initialValues.endemismo = item.endemismo;
    initialValues.taxonextinto = item.taxonextinto;
    initialValues.ambiente = item.ambiente;
    initialValues.nombrecomun = item.nombrecomun;
    initialValues.formadecrecimiento = item.formadecrecimiento;
    initialValues.prioritaria = item.prioritaria;
    initialValues.nivelprioridad = item.nivelprioridad;
    initialValues.exoticainvasora = item.exoticainvasora;
    initialValues.nom059 = item.nom059;
    initialValues.cites = item.cites;
    initialValues.iucn = item.iucn;
    initialValues.categoriaresidenciaaves = item.categoriaresidenciaaves;
    initialValues.probablelocnodecampo = item.probablelocnodecampo;
    initialValues.obsusoinfo = item.obsusoinfo;
    initialValues.coleccion = item.coleccion;
    initialValues.institucion = item.institucion;
    initialValues.paiscoleccion = item.paiscoleccion;
    initialValues.numcatalogo = item.numcatalogo;
    initialValues.numcolecta = item.numcolecta;
    initialValues.procedenciaejemplar = item.procedenciaejemplar;
    initialValues.determinador = item.determinador;
    initialValues.aniodeterminacion = item.aniodeterminacion;
    initialValues.mesdeterminacion = item.mesdeterminacion;
    initialValues.diadeterminacion = item.diadeterminacion;
    initialValues.fechadeterminacion = item.fechadeterminacion;
    initialValues.calificadordeterminacion = item.calificadordeterminacion;
    initialValues.colector = item.colector;
    initialValues.aniocolecta = item.aniocolecta;
    initialValues.mescolecta = item.mescolecta;
    initialValues.diacolecta = item.diacolecta;
    initialValues.fechacolecta = item.fechacolecta;
    initialValues.tipo = item.tipo;
    initialValues.ejemplarfosil = item.ejemplarfosil;
    initialValues.proyecto = item.proyecto;
    initialValues.fuente = item.fuente;
    initialValues.formadecitar = item.formadecitar;
    initialValues.licenciauso = item.licenciauso;
    initialValues.urlproyecto = item.urlproyecto;
    initialValues.urlorigen = item.urlorigen;
    initialValues.urlejemplar = item.urlejemplar;
    initialValues.ultimafechaactualizacion = item.ultimafechaactualizacion;
    initialValues.cuarentena = item.cuarentena;
    initialValues.version = item.version;
    initialValues.especie = item.especie;
    initialValues.especievalida = item.especievalida;
    initialValues.especievalidabusqueda = item.especievalidabusqueda;

    return initialValues;
  }


  function getInitialValueOkStates() {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
       -3: readOnly
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

  function getInitialValueAjvStates() {
    let _initialValueAjvStates = {};

    _initialValueAjvStates.id = {errors: []};
    _initialValueAjvStates.region = {errors: []};
    _initialValueAjvStates.localidad = {errors: []};
    _initialValueAjvStates.longitud = {errors: []};
    _initialValueAjvStates.latitud = {errors: []};
    _initialValueAjvStates.datum = {errors: []};
    _initialValueAjvStates.validacionambiente = {errors: []};
    _initialValueAjvStates.geovalidacion = {errors: []};
    _initialValueAjvStates.paismapa = {errors: []};
    _initialValueAjvStates.estadomapa = {errors: []};
    _initialValueAjvStates.claveestadomapa = {errors: []};
    _initialValueAjvStates.mt24nombreestadomapa = {errors: []};
    _initialValueAjvStates.mt24claveestadomapa = {errors: []};
    _initialValueAjvStates.municipiomapa = {errors: []};
    _initialValueAjvStates.clavemunicipiomapa = {errors: []};
    _initialValueAjvStates.mt24nombremunicipiomapa = {errors: []};
    _initialValueAjvStates.mt24clavemunicipiomapa = {errors: []};
    _initialValueAjvStates.incertidumbrexy = {errors: []};
    _initialValueAjvStates.altitudmapa = {errors: []};
    _initialValueAjvStates.usvserieI = {errors: []};
    _initialValueAjvStates.usvserieII = {errors: []};
    _initialValueAjvStates.usvserieIII = {errors: []};
    _initialValueAjvStates.usvserieIV = {errors: []};
    _initialValueAjvStates.usvserieV = {errors: []};
    _initialValueAjvStates.usvserieVI = {errors: []};
    _initialValueAjvStates.anp = {errors: []};
    _initialValueAjvStates.grupobio = {errors: []};
    _initialValueAjvStates.subgrupobio = {errors: []};
    _initialValueAjvStates.taxon = {errors: []};
    _initialValueAjvStates.autor = {errors: []};
    _initialValueAjvStates.estatustax = {errors: []};
    _initialValueAjvStates.reftax = {errors: []};
    _initialValueAjvStates.taxonvalido = {errors: []};
    _initialValueAjvStates.autorvalido = {errors: []};
    _initialValueAjvStates.reftaxvalido = {errors: []};
    _initialValueAjvStates.taxonvalidado = {errors: []};
    _initialValueAjvStates.endemismo = {errors: []};
    _initialValueAjvStates.taxonextinto = {errors: []};
    _initialValueAjvStates.ambiente = {errors: []};
    _initialValueAjvStates.nombrecomun = {errors: []};
    _initialValueAjvStates.formadecrecimiento = {errors: []};
    _initialValueAjvStates.prioritaria = {errors: []};
    _initialValueAjvStates.nivelprioridad = {errors: []};
    _initialValueAjvStates.exoticainvasora = {errors: []};
    _initialValueAjvStates.nom059 = {errors: []};
    _initialValueAjvStates.cites = {errors: []};
    _initialValueAjvStates.iucn = {errors: []};
    _initialValueAjvStates.categoriaresidenciaaves = {errors: []};
    _initialValueAjvStates.probablelocnodecampo = {errors: []};
    _initialValueAjvStates.obsusoinfo = {errors: []};
    _initialValueAjvStates.coleccion = {errors: []};
    _initialValueAjvStates.institucion = {errors: []};
    _initialValueAjvStates.paiscoleccion = {errors: []};
    _initialValueAjvStates.numcatalogo = {errors: []};
    _initialValueAjvStates.numcolecta = {errors: []};
    _initialValueAjvStates.procedenciaejemplar = {errors: []};
    _initialValueAjvStates.determinador = {errors: []};
    _initialValueAjvStates.aniodeterminacion = {errors: []};
    _initialValueAjvStates.mesdeterminacion = {errors: []};
    _initialValueAjvStates.diadeterminacion = {errors: []};
    _initialValueAjvStates.fechadeterminacion = {errors: []};
    _initialValueAjvStates.calificadordeterminacion = {errors: []};
    _initialValueAjvStates.colector = {errors: []};
    _initialValueAjvStates.aniocolecta = {errors: []};
    _initialValueAjvStates.mescolecta = {errors: []};
    _initialValueAjvStates.diacolecta = {errors: []};
    _initialValueAjvStates.fechacolecta = {errors: []};
    _initialValueAjvStates.tipo = {errors: []};
    _initialValueAjvStates.ejemplarfosil = {errors: []};
    _initialValueAjvStates.proyecto = {errors: []};
    _initialValueAjvStates.fuente = {errors: []};
    _initialValueAjvStates.formadecitar = {errors: []};
    _initialValueAjvStates.licenciauso = {errors: []};
    _initialValueAjvStates.urlproyecto = {errors: []};
    _initialValueAjvStates.urlorigen = {errors: []};
    _initialValueAjvStates.urlejemplar = {errors: []};
    _initialValueAjvStates.ultimafechaactualizacion = {errors: []};
    _initialValueAjvStates.cuarentena = {errors: []};
    _initialValueAjvStates.version = {errors: []};
    _initialValueAjvStates.especie = {errors: []};
    _initialValueAjvStates.especievalida = {errors: []};
    _initialValueAjvStates.especievalidabusqueda = {errors: []};

    return _initialValueAjvStates;
  }

  function areThereNotAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === -1) {
        return true;
      }
    }
    return false;
  }

  function areThereIncompleteFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 0) {
        return true;
      }
    }
    return false;
  }

  function areThereChangedFields() {
    if(values.current.id !== item.id) { return true;}
    if(values.current.region !== item.region) { return true;}
    if(values.current.localidad !== item.localidad) { return true;}
    if(values.current.longitud !== item.longitud) { return true;}
    if(values.current.latitud !== item.latitud) { return true;}
    if(values.current.datum !== item.datum) { return true;}
    if(values.current.validacionambiente !== item.validacionambiente) { return true;}
    if(values.current.geovalidacion !== item.geovalidacion) { return true;}
    if(values.current.paismapa !== item.paismapa) { return true;}
    if(values.current.estadomapa !== item.estadomapa) { return true;}
    if(values.current.claveestadomapa !== item.claveestadomapa) { return true;}
    if(values.current.mt24nombreestadomapa !== item.mt24nombreestadomapa) { return true;}
    if(values.current.mt24claveestadomapa !== item.mt24claveestadomapa) { return true;}
    if(values.current.municipiomapa !== item.municipiomapa) { return true;}
    if(values.current.clavemunicipiomapa !== item.clavemunicipiomapa) { return true;}
    if(values.current.mt24nombremunicipiomapa !== item.mt24nombremunicipiomapa) { return true;}
    if(values.current.mt24clavemunicipiomapa !== item.mt24clavemunicipiomapa) { return true;}
    if(values.current.incertidumbrexy !== item.incertidumbrexy) { return true;}
    if(values.current.altitudmapa !== item.altitudmapa) { return true;}
    if(values.current.usvserieI !== item.usvserieI) { return true;}
    if(values.current.usvserieII !== item.usvserieII) { return true;}
    if(values.current.usvserieIII !== item.usvserieIII) { return true;}
    if(values.current.usvserieIV !== item.usvserieIV) { return true;}
    if(values.current.usvserieV !== item.usvserieV) { return true;}
    if(values.current.usvserieVI !== item.usvserieVI) { return true;}
    if(values.current.anp !== item.anp) { return true;}
    if(values.current.grupobio !== item.grupobio) { return true;}
    if(values.current.subgrupobio !== item.subgrupobio) { return true;}
    if(values.current.taxon !== item.taxon) { return true;}
    if(values.current.autor !== item.autor) { return true;}
    if(values.current.estatustax !== item.estatustax) { return true;}
    if(values.current.reftax !== item.reftax) { return true;}
    if(values.current.taxonvalido !== item.taxonvalido) { return true;}
    if(values.current.autorvalido !== item.autorvalido) { return true;}
    if(values.current.reftaxvalido !== item.reftaxvalido) { return true;}
    if(values.current.taxonvalidado !== item.taxonvalidado) { return true;}
    if(values.current.endemismo !== item.endemismo) { return true;}
    if(values.current.taxonextinto !== item.taxonextinto) { return true;}
    if(values.current.ambiente !== item.ambiente) { return true;}
    if(values.current.nombrecomun !== item.nombrecomun) { return true;}
    if(values.current.formadecrecimiento !== item.formadecrecimiento) { return true;}
    if(values.current.prioritaria !== item.prioritaria) { return true;}
    if(values.current.nivelprioridad !== item.nivelprioridad) { return true;}
    if(values.current.exoticainvasora !== item.exoticainvasora) { return true;}
    if(values.current.nom059 !== item.nom059) { return true;}
    if(values.current.cites !== item.cites) { return true;}
    if(values.current.iucn !== item.iucn) { return true;}
    if(values.current.categoriaresidenciaaves !== item.categoriaresidenciaaves) { return true;}
    if(values.current.probablelocnodecampo !== item.probablelocnodecampo) { return true;}
    if(values.current.obsusoinfo !== item.obsusoinfo) { return true;}
    if(values.current.coleccion !== item.coleccion) { return true;}
    if(values.current.institucion !== item.institucion) { return true;}
    if(values.current.paiscoleccion !== item.paiscoleccion) { return true;}
    if(values.current.numcatalogo !== item.numcatalogo) { return true;}
    if(values.current.numcolecta !== item.numcolecta) { return true;}
    if(values.current.procedenciaejemplar !== item.procedenciaejemplar) { return true;}
    if(values.current.determinador !== item.determinador) { return true;}
    if(values.current.aniodeterminacion !== item.aniodeterminacion) { return true;}
    if(values.current.mesdeterminacion !== item.mesdeterminacion) { return true;}
    if(values.current.diadeterminacion !== item.diadeterminacion) { return true;}
    if(values.current.fechadeterminacion !== item.fechadeterminacion) { return true;}
    if(values.current.calificadordeterminacion !== item.calificadordeterminacion) { return true;}
    if(values.current.colector !== item.colector) { return true;}
    if(values.current.aniocolecta !== item.aniocolecta) { return true;}
    if(values.current.mescolecta !== item.mescolecta) { return true;}
    if(values.current.diacolecta !== item.diacolecta) { return true;}
    if(values.current.fechacolecta !== item.fechacolecta) { return true;}
    if(values.current.tipo !== item.tipo) { return true;}
    if(values.current.ejemplarfosil !== item.ejemplarfosil) { return true;}
    if(values.current.proyecto !== item.proyecto) { return true;}
    if(values.current.fuente !== item.fuente) { return true;}
    if(values.current.formadecitar !== item.formadecitar) { return true;}
    if(values.current.licenciauso !== item.licenciauso) { return true;}
    if(values.current.urlproyecto !== item.urlproyecto) { return true;}
    if(values.current.urlorigen !== item.urlorigen) { return true;}
    if(values.current.urlejemplar !== item.urlejemplar) { return true;}
    if(values.current.ultimafechaactualizacion !== item.ultimafechaactualizacion) { return true;}
    if(values.current.cuarentena !== item.cuarentena) { return true;}
    if(values.current.version !== item.version) { return true;}
    if(values.current.especie !== item.especie) { return true;}
    if(values.current.especievalida !== item.especievalida) { return true;}
    if(values.current.especievalidabusqueda !== item.especievalidabusqueda) { return true;}
    return false;
  }

  function setAddRemoveOneTaxon(variables) {
    //data to notify changes
    if(!changedAssociations.current.Ejemplar_Taxon) changedAssociations.current.Ejemplar_Taxon = {};
    
    /**
     * Case: The toAdd list isn't empty.
     */
    if(taxonIdsToAdd.current.length>0) {
      //set id to add
      variables.addTaxon = taxonIdsToAdd.current[0];      
      //changes to nofity
      changedAssociations.current.Ejemplar_Taxon.added = true;
      changedAssociations.current.Ejemplar_Taxon.idsAdded = [taxonIdsToAdd.current[0]];
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(taxonIdsToRemove.current.length>0) {
      //set id to remove
      variables.removeTaxon = taxonIdsToRemove.current[0];
      //changes to nofity
      changedAssociations.current.Ejemplar_Taxon.removed = true;
      changedAssociations.current.Ejemplar_Taxon.idsRemoved = [taxonIdsToRemove.current[0]];
    }

    return;
  }

  function setAddRemoveManyCaracteristicas_cualitativas(variables) {
    //data to notify changes
    if(!changedAssociations.current.caracteristica_cualitativa_registro_id) changedAssociations.current.caracteristica_cualitativa_registro_id = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(caracteristicas_cualitativasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addCaracteristicas_cualitativas = [ ...caracteristicas_cualitativasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cualitativa_registro_id.added = true;
      if(changedAssociations.current.caracteristica_cualitativa_registro_id.idsAdded){
        caracteristicas_cualitativasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cualitativa_registro_id.idsAdded.includes(it)) changedAssociations.current.caracteristica_cualitativa_registro_id.idsAdded.push(it);});
      } else {
        changedAssociations.current.caracteristica_cualitativa_registro_id.idsAdded = [...caracteristicas_cualitativasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(caracteristicas_cualitativasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeCaracteristicas_cualitativas = [ ...caracteristicas_cualitativasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cualitativa_registro_id.removed = true;
      if(changedAssociations.current.caracteristica_cualitativa_registro_id.idsRemoved){
        caracteristicas_cualitativasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cualitativa_registro_id.idsRemoved.includes(it)) changedAssociations.current.caracteristica_cualitativa_registro_id.idsRemoved.push(it);});
      } else {
        changedAssociations.current.caracteristica_cualitativa_registro_id.idsRemoved = [...caracteristicas_cualitativasIdsToRemove.current];
      }
    }
    
    return;
  }
  function setAddRemoveManyCaracteristicas_cuantitativas(variables) {
    //data to notify changes
    if(!changedAssociations.current.caracteristica_cuantitativa_registro_id) changedAssociations.current.caracteristica_cuantitativa_registro_id = {};

    /**
     * Case: The toAdd list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToAdd.current.length>0) {
      //set ids to add
      variables.addCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToAdd.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_registro_id.added = true;
      if(changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded){
        caracteristicas_cuantitativasIdsToAdd.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded.includes(it)) changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_registro_id.idsAdded = [...caracteristicas_cuantitativasIdsToAdd.current];
      }
    }
    /**
     * Case: The toRemove list isn't empty.
     */
    if(caracteristicas_cuantitativasIdsToRemove.current.length>0) {
      //set ids to remove
      variables.removeCaracteristicas_cuantitativas = [ ...caracteristicas_cuantitativasIdsToRemove.current];
      //changes to nofity
      changedAssociations.current.caracteristica_cuantitativa_registro_id.removed = true;
      if(changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved){
        caracteristicas_cuantitativasIdsToRemove.current.forEach((it) => {if(!changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved.includes(it)) changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved.push(it);});
      } else {
        changedAssociations.current.caracteristica_cuantitativa_registro_id.idsRemoved = [...caracteristicas_cuantitativasIdsToRemove.current];
      }
    }
    
    return;
  }

function setAjvErrors(err) {
    //check
    if(err&&err.response&&err.response.data&&Array.isArray(err.response.data.errors)) {
      let errors = err.response.data.errors;
 
      //for each error
      for(let i=0; i<errors.length; ++i) {
        let e=errors[i];
        //check
        if(e && typeof e === 'object'
        && e.extensions && typeof e.extensions === 'object' 
        && Array.isArray(e.extensions.validationErrors)){
          let validationErrors = e.extensions.validationErrors;
          
          for(let j=0; j<validationErrors.length; ++j) {
            let validationError = validationErrors[j];

            //check
            if(validationError && typeof validationError === 'object' 
            && validationError.dataPath && validationError.message) {
              /**
               * In this point, the error is considered as an AJV error.
               * 
               * It will be set in a ajvStatus reference and at the end of this function 
               * the ajvStatus state will be updated.
               */
              //set reference
              addAjvErrorToField(validationError);
            }
          }
        }
      }
      //update state
      setValueAjvStates({...valuesAjvRefs.current});
    }
  }

  function addAjvErrorToField(error) {
    let dataPath = error.dataPath.slice(1);
    
    if(valuesAjvRefs.current[dataPath] !== undefined){
      valuesAjvRefs.current[dataPath].errors.push(error.message);
    }
  }
  
  /**
    * doSave
    * 
    * Update new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item updated.
    * 
    */
  async function doSave(event) {
    errors.current = [];
    valuesAjvRefs.current = getInitialValueAjvStates();

    /*
      Variables setup
    */
    //variables
    let keys = Object.keys(values.current);
    let variables = {};


    //attributes
    for(let i=0; i<keys.length; i++) {
      if(valuesOkRefs.current[keys[i]] !== -1
      && valuesOkRefs.current[keys[i]] !== -2 //FK
      && valuesOkRefs.current[keys[i]] !== -3 //readOnly
      ) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }
    

    //add & remove: to_one's
    setAddRemoveOneTaxon(variables);

    //add & remove: to_many's
    setAddRemoveManyCaracteristicas_cualitativas(variables);
    setAddRemoveManyCaracteristicas_cuantitativas(variables);

    /*
      API Request: api.ejemplar.updateItem
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.updateItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.updateItem'}];
            newError.path=['Ejemplars', `id:${item.id}`, 'update'];
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
          newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.updateItem'}];
          newError.path=['Ejemplars', `id:${item.id}`, 'update'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return false;
        } 

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg5', "Record updated successfully."), {
          variant: 'success',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        onClose(event, true, response.value);
        return;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.ejemplar.updateItem
        if(err.isCanceled) {
          return;
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.updateItem'}];
          newError.path=['Ejemplars', `id:${item.id}`, 'update'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }
      });
  }

  const handleTabsChange = (event, newValue) => {
    //save last value
    lastTabValue.current = newValue;

    if(!isDebouncingTabsChange.current){
      //set last value
      currentTabValue.current = newValue;
      setTabsValue(newValue);
      
      //debounce
      isDebouncingTabsChange.current = true;
      let cancelableTimer = startTimerToDebounceTabsChange();
      cancelablePromises.current.push(cancelableTimer);
      cancelableTimer
        .promise
        .then(() => {
          //clear flag
          isDebouncingTabsChange.current = false;
          //delete from cancelables
          cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableTimer), 1);
          //check
          if(lastTabValue.current !== currentTabValue.current){
            setTabsValue(lastTabValue.current);
            currentTabValue.current = lastTabValue.current;
          }
        })
        .catch(() => {
          return;
        })
    }
  };

  const handleSetValue = (value, status, key) => {
    values.current[key] = value;
    if(status !== valuesOkRefs.current[key]) {
      valuesOkRefs.current[key] = status;
      setValueOkStates({...valuesOkRefs.current});
    }
  }

  const handleSave = (event) => {
    if(areThereNotAcceptableFields()) {
      setConfirmationTitle( t('modelPanels.invalidFields', "Some fields are not valid") );
      setConfirmationText( t('modelPanels.invalidFieldsB', "To continue, please correct these fields.") );
      setConfirmationAcceptText("");
      setConfirmationRejectText( t('modelPanels.updateAccept', "I UNDERSTAND"));
      handleAccept.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
      return;
    }

    if(areThereIncompleteFields()) {
      setConfirmationTitle( t('modelPanels.incompleteFields', "Some fields are empty") );
      setConfirmationText( t('modelPanels.incompleteFieldsB', "Do you want to continue anyway?") );
      setConfirmationAcceptText( t('modelPanels.saveIncompleteAccept', "YES, SAVE") );
      setConfirmationRejectText( t('modelPanels.saveIncompleteReject', "DON'T SAVE YET") );
      handleAccept.current = () => {
        if(!isClosing.current) {
          isClosing.current = true;
          doSave(event);
          setConfirmationOpen(false);
        }
      }
      handleReject.current = () => {
        isSaving.current = false;
        setConfirmationOpen(false);
      }
      setConfirmationOpen(true);
    } else {
      doSave(event);
    }
  }

  const handleCancel = (event) => {
    if(areThereChangedFields()) {
        setConfirmationTitle( t('modelPanels.cancelChanges', "The edited information has not been saved") );
        setConfirmationText( t('modelPanels.cancelChangesB', "Some fields have been edited, if you continue without save, the changes will be lost, you want to continue?") );
        setConfirmationAcceptText( t('modelPanels.cancelChangesAccept', "YES, EXIT") );
        setConfirmationRejectText( t('modelPanels.cancelChangesReject', "STAY") );
        handleAccept.current = () => {
          if(!isClosing.current) {
            isClosing.current = true;
            setConfirmationOpen(false);
            onClose(event, false, null);
          }
        }
        handleReject.current = () => {
          isCanceling.current = false;
          setConfirmationOpen(false);
        }
        setConfirmationOpen(true);
        return;
    } else {
      onClose(event, false, null);
    }
  }

  const onClose = (event, status, newItem) => {
    setOpen(false);
    handleClose(event, status, item, newItem, changedAssociations.current);
  }

  const handleConfirmationAccept = (event) => {
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    handleReject.current();
  }

  const handleTransferToAdd = (associationKey, itemId) => {
    switch(associationKey) {
      case 'caracteristicas_cualitativas':
        caracteristicas_cualitativasIdsToAdd.current.push(itemId);
        setCaracteristicas_cualitativasIdsToAddState([...caracteristicas_cualitativasIdsToAdd.current]);
        break;
      case 'caracteristicas_cuantitativas':
        caracteristicas_cuantitativasIdsToAdd.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToAddState([...caracteristicas_cuantitativasIdsToAdd.current]);
        break;
      case 'Taxon':
        taxonIdsToAdd.current = [];
        taxonIdsToAdd.current.push(itemId);
        setTaxonIdsToAddState([itemId]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'caracteristicas_cualitativas') {
      for(let i=0; i<caracteristicas_cualitativasIdsToAdd.current.length; ++i)
      {
        if(caracteristicas_cualitativasIdsToAdd.current[i] === itemId) {
          caracteristicas_cualitativasIdsToAdd.current.splice(i, 1);
          setCaracteristicas_cualitativasIdsToAddState([...caracteristicas_cualitativasIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cualitativas'
    if(associationKey === 'caracteristicas_cuantitativas') {
      for(let i=0; i<caracteristicas_cuantitativasIdsToAdd.current.length; ++i)
      {
        if(caracteristicas_cuantitativasIdsToAdd.current[i] === itemId) {
          caracteristicas_cuantitativasIdsToAdd.current.splice(i, 1);
          setCaracteristicas_cuantitativasIdsToAddState([...caracteristicas_cuantitativasIdsToAdd.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cuantitativas'
    if(associationKey === 'Taxon') {
      if(taxonIdsToAdd.current.length > 0
      && taxonIdsToAdd.current[0] === itemId) {
        taxonIdsToAdd.current = [];
        setTaxonIdsToAddState([]);
      }
      return;
    }//end: case 'Taxon'
  }

  const handleTransferToRemove = (associationKey, itemId) => {
    switch(associationKey) {
        case 'caracteristicas_cualitativas':
  
        caracteristicas_cualitativasIdsToRemove.current.push(itemId);
        setCaracteristicas_cualitativasIdsToRemoveState([...caracteristicas_cualitativasIdsToRemove.current]);
        break;
        case 'caracteristicas_cuantitativas':
  
        caracteristicas_cuantitativasIdsToRemove.current.push(itemId);
        setCaracteristicas_cuantitativasIdsToRemoveState([...caracteristicas_cuantitativasIdsToRemove.current]);
        break;
        case 'Taxon':
          taxonIdsToRemove.current = [];
          taxonIdsToRemove.current.push(itemId);
          setTaxonIdsToRemoveState([itemId]);
        break;

      default:
        break;
    }
  }

  const handleUntransferFromRemove =(associationKey, itemId) => {
    if(associationKey === 'caracteristicas_cualitativas') {
      for(let i=0; i<caracteristicas_cualitativasIdsToRemove.current.length; ++i)
      {
        if(caracteristicas_cualitativasIdsToRemove.current[i] === itemId) {
          caracteristicas_cualitativasIdsToRemove.current.splice(i, 1);
          setCaracteristicas_cualitativasIdsToRemoveState([...caracteristicas_cualitativasIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cualitativas'
    if(associationKey === 'caracteristicas_cuantitativas') {
      for(let i=0; i<caracteristicas_cuantitativasIdsToRemove.current.length; ++i)
      {
        if(caracteristicas_cuantitativasIdsToRemove.current[i] === itemId) {
          caracteristicas_cuantitativasIdsToRemove.current.splice(i, 1);
          setCaracteristicas_cuantitativasIdsToRemoveState([...caracteristicas_cuantitativasIdsToRemove.current]);
          return;
        }
      }
      return;
    }//end: case 'caracteristicas_cuantitativas'
    if(associationKey === 'Taxon') {
      if(taxonIdsToRemove.current.length > 0
      && taxonIdsToRemove.current[0] === itemId) {
        taxonIdsToRemove.current = [];
        setTaxonIdsToRemoveState([]);
      }
      return;
    }//end: case 'Taxon'
  }

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


  const startTimerToDebounceTabsChange = () => {
    return makeCancelable( new Promise(resolve => {
      window.setTimeout(function() { 
        resolve(); 
      }, debounceTimeout);
    }));
  };

  return (
    <Dialog id='EjemplarUpdatePanel-dialog' 
      fullScreen open={open} TransitionComponent={Transition}
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      <AppBar>
        <Toolbar>
          <Tooltip title={ t('modelPanels.cancel') }>
            <IconButton
              id='EjemplarUpdatePanel-button-cancel'
              edge="start" 
              color="inherit" 
              onClick={(event) => {
                if(!isCanceling.current){
                  isCanceling.current = true;
                  handleCancel(event);
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title}>
            { t('modelPanels.editing') +  ": Ejemplar | id: " + item.id}
          </Typography>
          
          {(!deleted)&&(
            <Tooltip title={ t('modelPanels.save') + " ejemplar" }>
              <Fab
                id='EjemplarUpdatePanel-fabButton-save' 
                color="secondary" 
                className={classes.fabButton}
                onClick={(event) => {
                  if(!isSaving.current){
                    isSaving.current = true;
                    handleSave(event);
                  }
                }}
              >
                <SaveIcon />
              </Fab>
            </Tooltip>
          )}

        </Toolbar>
      </AppBar>
      <Toolbar/>

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>

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
                      <UpdateWarning style={{ color: amber[700] }} />
                    }
                    title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                    subheader="Updated"
                  />
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
            
          {/* TabsA: Menú */}
          <Grid item xs={12}>
            <EjemplarTabsA
              value={tabsValue}
              handleChange={handleTabsChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <EjemplarAttributesPage
                hidden={tabsValue !== 0}
                item={item}
                valueOkStates={valueOkStates}
                valueAjvStates={valueAjvStates}
                handleSetValue={handleSetValue}
              />
            </Suspense>
          </Grid>

          {/*
            * Conditional rendering:
            * Associations Page [1] 
            */}
          {(tabsValue === 1 && !deleted) && (
            <Grid item xs={12}>
              {/* Associations Page [1] */}
              <Suspense fallback={<div />}>
                <EjemplarAssociationsPage
                  hidden={tabsValue !== 1 || deleted}
                  item={item}
                  caracteristicas_cualitativasIdsToAdd={caracteristicas_cualitativasIdsToAddState}
                  caracteristicas_cualitativasIdsToRemove={caracteristicas_cualitativasIdsToRemoveState}
                  caracteristicas_cuantitativasIdsToAdd={caracteristicas_cuantitativasIdsToAddState}
                  caracteristicas_cuantitativasIdsToRemove={caracteristicas_cuantitativasIdsToRemoveState}
                  taxonIdsToAdd={taxonIdsToAddState}
                  taxonIdsToRemove={taxonIdsToRemoveState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
                  handleTransferToRemove={handleTransferToRemove}
                  handleUntransferFromRemove={handleUntransferFromRemove}
                  handleClickOnCaracteristica_cualitativaRow={handleClickOnCaracteristica_cualitativaRow}
                  handleClickOnCaracteristica_cuantitativaRow={handleClickOnCaracteristica_cuantitativaRow}
                  handleClickOnTaxonRow={handleClickOnTaxonRow}
                />
              </Suspense>
            </Grid>
          )}
        </Grid>

        {/* Confirmation Dialog */}
        <Suspense fallback={<div />}>
          <EjemplarConfirmationDialog
            open={confirmationOpen}
            title={confirmationTitle}
            text={confirmationText}
            acceptText={confirmationAcceptText}
            rejectText={confirmationRejectText}
            handleAccept={handleConfirmationAccept}
            handleReject={handleConfirmationReject}
          />
        </Suspense>

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

    </Dialog>
  );
}
EjemplarUpdatePanel.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};
