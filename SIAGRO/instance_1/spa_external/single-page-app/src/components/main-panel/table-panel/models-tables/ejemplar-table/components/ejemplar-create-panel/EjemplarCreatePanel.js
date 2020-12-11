import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../snackbar/Snackbar';
import EjemplarTabsA from './components/EjemplarTabsA'
import { loadApi } from '../../../../../../../requests/requests.index.js'
import { makeCancelable } from '../../../../../../../utils'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import SaveIcon from '@material-ui/icons/Save';
//lazy loading
const EjemplarAttributesPage = lazy(() => import(/* webpackChunkName: "Create-AttributesEjemplar" */ './components/ejemplar-attributes-page/EjemplarAttributesPage'));
const EjemplarAssociationsPage = lazy(() => import(/* webpackChunkName: "Create-AssociationsEjemplar" */ './components/ejemplar-associations-page/EjemplarAssociationsPage'));
const EjemplarConfirmationDialog = lazy(() => import(/* webpackChunkName: "Create-ConfirmationEjemplar" */ './components/EjemplarConfirmationDialog'));
const CaracteristicaCualitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailCaracteristicaCualitativa" */ '../../../caracteristica_cualitativa-table/components/caracteristica_cualitativa-detail-panel/Caracteristica_cualitativaDetailPanel'));
const CaracteristicaCuantitativaDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailCaracteristicaCuantitativa" */ '../../../caracteristica_cuantitativa-table/components/caracteristica_cuantitativa-detail-panel/Caracteristica_cuantitativaDetailPanel'));
const TaxonDetailPanel = lazy(() => import(/* webpackChunkName: "Create-DetailTaxon" */ '../../../taxon-table/components/taxon-detail-panel/TaxonDetailPanel'));

const debounceTimeout = 700;

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 450,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
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

export default function EjemplarCreatePanel(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    permissions,
    handleClose,
  } = props;

  const [open, setOpen] = useState(true);
  const [tabsValue, setTabsValue] = useState(0);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());
  const [valueAjvStates, setValueAjvStates] = useState(getInitialValueAjvStates());

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

  const [caracteristicas_cualitativasIdsToAddState, setCaracteristicas_cualitativasIdsToAddState] = useState([]);
  const caracteristicas_cualitativasIdsToAdd = useRef([]);
  const [caracteristicas_cuantitativasIdsToAddState, setCaracteristicas_cuantitativasIdsToAddState] = useState([]);
  const caracteristicas_cuantitativasIdsToAdd = useRef([]);
  const [taxonIdsToAddState, setTaxonIdsToAddState] = useState([]);
  const taxonIdsToAdd = useRef([]);

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

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

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
    
    initialValues.id = null;
    initialValues.region = null;
    initialValues.localidad = null;
    initialValues.longitud = null;
    initialValues.latitud = null;
    initialValues.datum = null;
    initialValues.validacionambiente = null;
    initialValues.geovalidacion = null;
    initialValues.paismapa = null;
    initialValues.estadomapa = null;
    initialValues.claveestadomapa = null;
    initialValues.mt24nombreestadomapa = null;
    initialValues.mt24claveestadomapa = null;
    initialValues.municipiomapa = null;
    initialValues.clavemunicipiomapa = null;
    initialValues.mt24nombremunicipiomapa = null;
    initialValues.mt24clavemunicipiomapa = null;
    initialValues.incertidumbrexy = null;
    initialValues.altitudmapa = null;
    initialValues.usvserieI = null;
    initialValues.usvserieII = null;
    initialValues.usvserieIII = null;
    initialValues.usvserieIV = null;
    initialValues.usvserieV = null;
    initialValues.usvserieVI = null;
    initialValues.anp = null;
    initialValues.grupobio = null;
    initialValues.subgrupobio = null;
    initialValues.taxon = null;
    initialValues.autor = null;
    initialValues.estatustax = null;
    initialValues.reftax = null;
    initialValues.taxonvalido = null;
    initialValues.autorvalido = null;
    initialValues.reftaxvalido = null;
    initialValues.taxonvalidado = null;
    initialValues.endemismo = null;
    initialValues.taxonextinto = null;
    initialValues.ambiente = null;
    initialValues.nombrecomun = null;
    initialValues.formadecrecimiento = null;
    initialValues.prioritaria = null;
    initialValues.nivelprioridad = null;
    initialValues.exoticainvasora = null;
    initialValues.nom059 = null;
    initialValues.cites = null;
    initialValues.iucn = null;
    initialValues.categoriaresidenciaaves = null;
    initialValues.probablelocnodecampo = null;
    initialValues.obsusoinfo = null;
    initialValues.coleccion = null;
    initialValues.institucion = null;
    initialValues.paiscoleccion = null;
    initialValues.numcatalogo = null;
    initialValues.numcolecta = null;
    initialValues.procedenciaejemplar = null;
    initialValues.determinador = null;
    initialValues.aniodeterminacion = null;
    initialValues.mesdeterminacion = null;
    initialValues.diadeterminacion = null;
    initialValues.fechadeterminacion = null;
    initialValues.calificadordeterminacion = null;
    initialValues.colector = null;
    initialValues.aniocolecta = null;
    initialValues.mescolecta = null;
    initialValues.diacolecta = null;
    initialValues.fechacolecta = null;
    initialValues.tipo = null;
    initialValues.ejemplarfosil = null;
    initialValues.proyecto = null;
    initialValues.fuente = null;
    initialValues.formadecitar = null;
    initialValues.licenciauso = null;
    initialValues.urlproyecto = null;
    initialValues.urlorigen = null;
    initialValues.urlejemplar = null;
    initialValues.ultimafechaactualizacion = null;
    initialValues.cuarentena = null;
    initialValues.version = null;
    initialValues.especie = null;
    initialValues.especievalida = null;
    initialValues.especievalidabusqueda = null;

    return initialValues;
  }

  function getInitialValueOkStates() {
    /*
      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable
       -2: foreing key
    */
    let initialValueOkStates = {};

    initialValueOkStates.id = 0;
    initialValueOkStates.region = 0;
    initialValueOkStates.localidad = 0;
    initialValueOkStates.longitud = 0;
    initialValueOkStates.latitud = 0;
    initialValueOkStates.datum = 0;
    initialValueOkStates.validacionambiente = 0;
    initialValueOkStates.geovalidacion = 0;
    initialValueOkStates.paismapa = 0;
    initialValueOkStates.estadomapa = 0;
    initialValueOkStates.claveestadomapa = 0;
    initialValueOkStates.mt24nombreestadomapa = 0;
    initialValueOkStates.mt24claveestadomapa = 0;
    initialValueOkStates.municipiomapa = 0;
    initialValueOkStates.clavemunicipiomapa = 0;
    initialValueOkStates.mt24nombremunicipiomapa = 0;
    initialValueOkStates.mt24clavemunicipiomapa = 0;
    initialValueOkStates.incertidumbrexy = 0;
    initialValueOkStates.altitudmapa = 0;
    initialValueOkStates.usvserieI = 0;
    initialValueOkStates.usvserieII = 0;
    initialValueOkStates.usvserieIII = 0;
    initialValueOkStates.usvserieIV = 0;
    initialValueOkStates.usvserieV = 0;
    initialValueOkStates.usvserieVI = 0;
    initialValueOkStates.anp = 0;
    initialValueOkStates.grupobio = 0;
    initialValueOkStates.subgrupobio = 0;
    initialValueOkStates.taxon = 0;
    initialValueOkStates.autor = 0;
    initialValueOkStates.estatustax = 0;
    initialValueOkStates.reftax = 0;
    initialValueOkStates.taxonvalido = 0;
    initialValueOkStates.autorvalido = 0;
    initialValueOkStates.reftaxvalido = 0;
    initialValueOkStates.taxonvalidado = 0;
    initialValueOkStates.endemismo = 0;
    initialValueOkStates.taxonextinto = 0;
    initialValueOkStates.ambiente = 0;
    initialValueOkStates.nombrecomun = 0;
    initialValueOkStates.formadecrecimiento = 0;
    initialValueOkStates.prioritaria = 0;
    initialValueOkStates.nivelprioridad = 0;
    initialValueOkStates.exoticainvasora = 0;
    initialValueOkStates.nom059 = 0;
    initialValueOkStates.cites = 0;
    initialValueOkStates.iucn = 0;
    initialValueOkStates.categoriaresidenciaaves = 0;
    initialValueOkStates.probablelocnodecampo = 0;
    initialValueOkStates.obsusoinfo = 0;
    initialValueOkStates.coleccion = 0;
    initialValueOkStates.institucion = 0;
    initialValueOkStates.paiscoleccion = 0;
    initialValueOkStates.numcatalogo = 0;
    initialValueOkStates.numcolecta = 0;
    initialValueOkStates.procedenciaejemplar = 0;
    initialValueOkStates.determinador = 0;
    initialValueOkStates.aniodeterminacion = 0;
    initialValueOkStates.mesdeterminacion = 0;
    initialValueOkStates.diadeterminacion = 0;
    initialValueOkStates.fechadeterminacion = 0;
    initialValueOkStates.calificadordeterminacion = 0;
    initialValueOkStates.colector = 0;
    initialValueOkStates.aniocolecta = 0;
    initialValueOkStates.mescolecta = 0;
    initialValueOkStates.diacolecta = 0;
    initialValueOkStates.fechacolecta = 0;
    initialValueOkStates.tipo = 0;
    initialValueOkStates.ejemplarfosil = 0;
    initialValueOkStates.proyecto = 0;
    initialValueOkStates.fuente = 0;
    initialValueOkStates.formadecitar = 0;
    initialValueOkStates.licenciauso = 0;
    initialValueOkStates.urlproyecto = 0;
    initialValueOkStates.urlorigen = 0;
    initialValueOkStates.urlejemplar = 0;
    initialValueOkStates.ultimafechaactualizacion = 0;
    initialValueOkStates.cuarentena = 0;
    initialValueOkStates.version = 0;
    initialValueOkStates.especie = 0;
    initialValueOkStates.especievalida = 0;
    initialValueOkStates.especievalidabusqueda = 0;

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

  function areThereAcceptableFields() {
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
      if(a[i][1] === 1) {
        return true;
      }
    }
    return false;
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

  function setAddTaxon(variables) {
    if(taxonIdsToAdd.current.length>0) {
      //set the new id on toAdd property
      variables.addTaxon = taxonIdsToAdd.current[0];
    } else {
      //do nothing
    }
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
    * Add new @item using GrahpQL Server mutation.
    * Uses current state properties to fill query request.
    * Updates state to inform new @item added.
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
      if(valuesOkRefs.current[keys[i]] !== -1) {
        variables[keys[i]] = values.current[keys[i]];
      }
    }

    //delete: fk's

    //add: to_one's
    setAddTaxon(variables);
    
    //add: to_many's
    variables.addCaracteristicas_cualitativas = [...caracteristicas_cualitativasIdsToAdd.current];
    variables.addCaracteristicas_cuantitativas = [...caracteristicas_cuantitativasIdsToAdd.current];

    /*
      API Request: api.ejemplar.createItem
    */
    let api = await loadApi("ejemplar");
    let cancelableApiReq = makeCancelable(api.ejemplar.createItem(graphqlServerUrl, variables));
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
            newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.createItem'}];
            newError.path=['Ejemplars', 'add'];
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
          newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.createItem'}];
          newError.path=['Ejemplars', 'add'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);
 
          showMessage(newError.message, withDetails);
          clearRequestDoSave();
          return;
        }

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg6', "Record created successfully."), {
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
      .catch((err) => { //error: on api.ejemplar.createItem
        if(err.isCanceled) {
          return
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'Ejemplar', method: 'doSave()', request: 'api.ejemplar.createItem'}];
          newError.path=['Ejemplars', 'add'];
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
    if(areThereAcceptableFields()) {
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
    handleClose(event, status, newItem);
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
        if(caracteristicas_cualitativasIdsToAdd.current.indexOf(itemId) === -1) {
          caracteristicas_cualitativasIdsToAdd.current.push(itemId);
          setCaracteristicas_cualitativasIdsToAddState(caracteristicas_cualitativasIdsToAdd.current);
        }
        break;
      case 'caracteristicas_cuantitativas':
        if(caracteristicas_cuantitativasIdsToAdd.current.indexOf(itemId) === -1) {
          caracteristicas_cuantitativasIdsToAdd.current.push(itemId);
          setCaracteristicas_cuantitativasIdsToAddState(caracteristicas_cuantitativasIdsToAdd.current);
        }
        break;
      case 'Taxon':
        if(taxonIdsToAdd.current.indexOf(itemId) === -1) {
          taxonIdsToAdd.current = [];
          taxonIdsToAdd.current.push(itemId);
          setTaxonIdsToAddState(taxonIdsToAdd.current);
        }
        break;

      default:
        break;
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    if(associationKey === 'caracteristicas_cualitativas') {
      let iof = caracteristicas_cualitativasIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        caracteristicas_cualitativasIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'caracteristicas_cualitativas'
    if(associationKey === 'caracteristicas_cuantitativas') {
      let iof = caracteristicas_cuantitativasIdsToAdd.current.indexOf(itemId);
      if(iof !== -1) {
        caracteristicas_cuantitativasIdsToAdd.current.splice(iof, 1);
      }
      return;
    }//end: case 'caracteristicas_cuantitativas'
    if(associationKey === 'Taxon') {
      if(taxonIdsToAdd.current.length > 0) {
        taxonIdsToAdd.current = [];
        setTaxonIdsToAddState([]);
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
    
    <Dialog id='EjemplarCreatePanel-dialog'  
      fullScreen open={open} TransitionComponent={Transition}
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Tooltip title={ t('modelPanels.cancel') }>
            <IconButton
              id='EjemplarCreatePanel-button-cancel'
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
            {t('modelPanels.new') + ' Ejemplar'}
          </Typography>
          <Tooltip title={ t('modelPanels.save') + " ejemplar" }>
            <Fab
              id='EjemplarCreatePanel-fabButton-save' 
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
        </Toolbar>
      </AppBar>
      <Toolbar />

      <div className={classes.root}>
        <Grid container justify='center' alignItems='flex-start' alignContent='flex-start'>
          <Grid item xs={12}>  
            {/* TabsA: Menú */}
            <div className={classes.tabsA}>
              <EjemplarTabsA
                value={tabsValue}
                handleChange={handleTabsChange}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {/* Attributes Page [0] */}
            <Suspense fallback={<div />}>
              <EjemplarAttributesPage
                hidden={tabsValue !== 0}
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
          {(tabsValue === 1) && (
            <Grid item xs={12}>
              <Suspense fallback={<div />}>
                {/* Associations Page [1] */}
                <EjemplarAssociationsPage
                  hidden={tabsValue !== 1}
                  caracteristicas_cualitativasIdsToAdd={caracteristicas_cualitativasIdsToAddState}
                  caracteristicas_cuantitativasIdsToAdd={caracteristicas_cuantitativasIdsToAddState}
                  taxonIdsToAdd={taxonIdsToAddState}
                  handleTransferToAdd={handleTransferToAdd}
                  handleUntransferFromAdd={handleUntransferFromAdd}
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

        {/* Detail Panels */}
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
EjemplarCreatePanel.propTypes = {
  permissions: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};