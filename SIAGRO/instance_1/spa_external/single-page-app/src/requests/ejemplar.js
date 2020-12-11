import { requestGraphql, checkResponse, getSearchArgument, logRequest } from '../utils'
import globals from '../config/globals';

export default {

/**
 * Root query
 * ----------
 */
  /**
   * tableTemplate
   *
   * Get ejemplartable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateEjemplar}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateEjemplar");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateEjemplar"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateEjemplar"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: headers, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root query
 * ----------
 */

  /**
   * getCountItems
   *
   * Get ejemplarsitems count from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getCountItems(url, searchText, ops) {
    let graphqlErrors = [];
    let variables = {};
    //search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countEjemplars($search: searchEjemplarInput) { 
             countEjemplars( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countEjemplars");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countEjemplars"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countEjemplars"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root query
 * ----------
 */

  /**
   * getItems
   *
   * Get items from GraphQL Server.
   *
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} orderBy Order field string.
   * @param {String} orderDirection Text string: asc | desc.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with additional query options.
   */
  async getItems(url, searchText, orderBy, orderDirection, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `id,
       region,
       localidad,
       longitud,
       latitud,
       datum,
       validacionambiente,
       geovalidacion,
       paismapa,
       estadomapa,
       claveestadomapa,
       mt24nombreestadomapa,
       mt24claveestadomapa,
       municipiomapa,
       clavemunicipiomapa,
       mt24nombremunicipiomapa,
       mt24clavemunicipiomapa,
       incertidumbrexy,
       altitudmapa,
       usvserieI,
       usvserieII,
       usvserieIII,
       usvserieIV,
       usvserieV,
       usvserieVI,
       anp,
       grupobio,
       subgrupobio,
       taxon,
       autor,
       estatustax,
       reftax,
       taxonvalido,
       autorvalido,
       reftaxvalido,
       taxonvalidado,
       endemismo,
       taxonextinto,
       ambiente,
       nombrecomun,
       formadecrecimiento,
       prioritaria,
       nivelprioridad,
       exoticainvasora,
       nom059,
       cites,
       iucn,
       categoriaresidenciaaves,
       probablelocnodecampo,
       obsusoinfo,
       coleccion,
       institucion,
       paiscoleccion,
       numcatalogo,
       numcolecta,
       procedenciaejemplar,
       determinador,
       aniodeterminacion,
       mesdeterminacion,
       diadeterminacion,
       fechadeterminacion,
       calificadordeterminacion,
       colector,
       aniocolecta,
       mescolecta,
       diacolecta,
       fechacolecta,
       tipo,
       ejemplarfosil,
       proyecto,
       fuente,
       formadecitar,
       licenciauso,
       urlproyecto,
       urlorigen,
       urlejemplar,
       ultimafechaactualizacion,
       cuarentena,
       version,
       especie,
       especievalida,
       especievalidabusqueda,
`;

    //query
    let query =
      `query ejemplarsConnection($order: [orderEjemplarInput], $search: searchEjemplarInput, $pagination: paginationCursorInput!) { 
             ejemplarsConnection( order: $order, search: $search, pagination: $pagination ) {
                pageInfo { startCursor, endCursor, hasPreviousPage, hasNextPage }
                edges { node { ${qattributes} }}
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "ejemplarsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["ejemplarsConnection"]
      || typeof response.data.data["ejemplarsConnection"] !== 'object'
      || !Array.isArray(response.data.data["ejemplarsConnection"].edges)
      || typeof response.data.data["ejemplarsConnection"].pageInfo !== 'object' 
      || response.data.data["ejemplarsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["ejemplarsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Ejemplar item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Ejemplar item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $region:String,
          $localidad:String,
          $longitud:Float,
          $latitud:Float,
          $datum:String,
          $validacionambiente:String,
          $geovalidacion:String,
          $paismapa:String,
          $estadomapa:String,
          $claveestadomapa:String,
          $mt24nombreestadomapa:String,
          $mt24claveestadomapa:String,
          $municipiomapa:String,
          $clavemunicipiomapa:String,
          $mt24nombremunicipiomapa:String,
          $mt24clavemunicipiomapa:String,
          $incertidumbrexy:String,
          $altitudmapa:String,
          $usvserieI:String,
          $usvserieII:String,
          $usvserieIII:String,
          $usvserieIV:String,
          $usvserieV:String,
          $usvserieVI:String,
          $anp:String,
          $grupobio:String,
          $subgrupobio:String,
          $taxon:String,
          $autor:String,
          $estatustax:String,
          $reftax:String,
          $taxonvalido:String,
          $autorvalido:String,
          $reftaxvalido:String,
          $taxonvalidado:String,
          $endemismo:String,
          $taxonextinto:String,
          $ambiente:String,
          $nombrecomun:String,
          $formadecrecimiento:String,
          $prioritaria:String,
          $nivelprioridad:String,
          $exoticainvasora:String,
          $nom059:String,
          $cites:String,
          $iucn:String,
          $categoriaresidenciaaves:String,
          $probablelocnodecampo:String,
          $obsusoinfo:String,
          $coleccion:String,
          $institucion:String,
          $paiscoleccion:String,
          $numcatalogo:String,
          $numcolecta:String,
          $procedenciaejemplar:String,
          $determinador:String,
          $aniodeterminacion:String,
          $mesdeterminacion:String,
          $diadeterminacion:String,
          $fechadeterminacion:String,
          $calificadordeterminacion:String,
          $colector:String,
          $aniocolecta:String,
          $mescolecta:String,
          $diacolecta:String,
          $fechacolecta:String,
          $tipo:String,
          $ejemplarfosil:String,
          $proyecto:String,
          $fuente:String,
          $formadecitar:String,
          $licenciauso:String,
          $urlproyecto:String,
          $urlorigen:String,
          $urlejemplar:String,
          $ultimafechaactualizacion:String,
          $cuarentena:String,
          $version:String,
          $especie:String,
          $especievalida:String,
          $especievalidabusqueda:String,
          $addTaxon: ID,
          $addCaracteristicas_cualitativas: [ID],
          $addCaracteristicas_cuantitativas: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            region:$region,
            localidad:$localidad,
            longitud:$longitud,
            latitud:$latitud,
            datum:$datum,
            validacionambiente:$validacionambiente,
            geovalidacion:$geovalidacion,
            paismapa:$paismapa,
            estadomapa:$estadomapa,
            claveestadomapa:$claveestadomapa,
            mt24nombreestadomapa:$mt24nombreestadomapa,
            mt24claveestadomapa:$mt24claveestadomapa,
            municipiomapa:$municipiomapa,
            clavemunicipiomapa:$clavemunicipiomapa,
            mt24nombremunicipiomapa:$mt24nombremunicipiomapa,
            mt24clavemunicipiomapa:$mt24clavemunicipiomapa,
            incertidumbrexy:$incertidumbrexy,
            altitudmapa:$altitudmapa,
            usvserieI:$usvserieI,
            usvserieII:$usvserieII,
            usvserieIII:$usvserieIII,
            usvserieIV:$usvserieIV,
            usvserieV:$usvserieV,
            usvserieVI:$usvserieVI,
            anp:$anp,
            grupobio:$grupobio,
            subgrupobio:$subgrupobio,
            taxon:$taxon,
            autor:$autor,
            estatustax:$estatustax,
            reftax:$reftax,
            taxonvalido:$taxonvalido,
            autorvalido:$autorvalido,
            reftaxvalido:$reftaxvalido,
            taxonvalidado:$taxonvalidado,
            endemismo:$endemismo,
            taxonextinto:$taxonextinto,
            ambiente:$ambiente,
            nombrecomun:$nombrecomun,
            formadecrecimiento:$formadecrecimiento,
            prioritaria:$prioritaria,
            nivelprioridad:$nivelprioridad,
            exoticainvasora:$exoticainvasora,
            nom059:$nom059,
            cites:$cites,
            iucn:$iucn,
            categoriaresidenciaaves:$categoriaresidenciaaves,
            probablelocnodecampo:$probablelocnodecampo,
            obsusoinfo:$obsusoinfo,
            coleccion:$coleccion,
            institucion:$institucion,
            paiscoleccion:$paiscoleccion,
            numcatalogo:$numcatalogo,
            numcolecta:$numcolecta,
            procedenciaejemplar:$procedenciaejemplar,
            determinador:$determinador,
            aniodeterminacion:$aniodeterminacion,
            mesdeterminacion:$mesdeterminacion,
            diadeterminacion:$diadeterminacion,
            fechadeterminacion:$fechadeterminacion,
            calificadordeterminacion:$calificadordeterminacion,
            colector:$colector,
            aniocolecta:$aniocolecta,
            mescolecta:$mescolecta,
            diacolecta:$diacolecta,
            fechacolecta:$fechacolecta,
            tipo:$tipo,
            ejemplarfosil:$ejemplarfosil,
            proyecto:$proyecto,
            fuente:$fuente,
            formadecitar:$formadecitar,
            licenciauso:$licenciauso,
            urlproyecto:$urlproyecto,
            urlorigen:$urlorigen,
            urlejemplar:$urlejemplar,
            ultimafechaactualizacion:$ultimafechaactualizacion,
            cuarentena:$cuarentena,
            version:$version,
            especie:$especie,
            especievalida:$especievalida,
            especievalidabusqueda:$especievalidabusqueda,
            addTaxon: $addTaxon,
            addCaracteristicas_cualitativas: $addCaracteristicas_cualitativas,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       region,
       localidad,
       longitud,
       latitud,
       datum,
       validacionambiente,
       geovalidacion,
       paismapa,
       estadomapa,
       claveestadomapa,
       mt24nombreestadomapa,
       mt24claveestadomapa,
       municipiomapa,
       clavemunicipiomapa,
       mt24nombremunicipiomapa,
       mt24clavemunicipiomapa,
       incertidumbrexy,
       altitudmapa,
       usvserieI,
       usvserieII,
       usvserieIII,
       usvserieIV,
       usvserieV,
       usvserieVI,
       anp,
       grupobio,
       subgrupobio,
       taxon,
       autor,
       estatustax,
       reftax,
       taxonvalido,
       autorvalido,
       reftaxvalido,
       taxonvalidado,
       endemismo,
       taxonextinto,
       ambiente,
       nombrecomun,
       formadecrecimiento,
       prioritaria,
       nivelprioridad,
       exoticainvasora,
       nom059,
       cites,
       iucn,
       categoriaresidenciaaves,
       probablelocnodecampo,
       obsusoinfo,
       coleccion,
       institucion,
       paiscoleccion,
       numcatalogo,
       numcolecta,
       procedenciaejemplar,
       determinador,
       aniodeterminacion,
       mesdeterminacion,
       diadeterminacion,
       fechadeterminacion,
       calificadordeterminacion,
       colector,
       aniocolecta,
       mescolecta,
       diacolecta,
       fechacolecta,
       tipo,
       ejemplarfosil,
       proyecto,
       fuente,
       formadecitar,
       licenciauso,
       urlproyecto,
       urlorigen,
       urlejemplar,
       ultimafechaactualizacion,
       cuarentena,
       version,
       especie,
       especievalida,
       especievalidabusqueda,
`;

    //query
    let query =
      `mutation addEjemplar(
          ${qvariables}
          ) { addEjemplar(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('createItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, "addEjemplar");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addEjemplar"]
        || typeof response.data.data["addEjemplar"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addEjemplar"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: item, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

  /**
   * updateItem
   *
   * Update Ejemplar item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Ejemplar item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $region:String,
          $localidad:String,
          $longitud:Float,
          $latitud:Float,
          $datum:String,
          $validacionambiente:String,
          $geovalidacion:String,
          $paismapa:String,
          $estadomapa:String,
          $claveestadomapa:String,
          $mt24nombreestadomapa:String,
          $mt24claveestadomapa:String,
          $municipiomapa:String,
          $clavemunicipiomapa:String,
          $mt24nombremunicipiomapa:String,
          $mt24clavemunicipiomapa:String,
          $incertidumbrexy:String,
          $altitudmapa:String,
          $usvserieI:String,
          $usvserieII:String,
          $usvserieIII:String,
          $usvserieIV:String,
          $usvserieV:String,
          $usvserieVI:String,
          $anp:String,
          $grupobio:String,
          $subgrupobio:String,
          $taxon:String,
          $autor:String,
          $estatustax:String,
          $reftax:String,
          $taxonvalido:String,
          $autorvalido:String,
          $reftaxvalido:String,
          $taxonvalidado:String,
          $endemismo:String,
          $taxonextinto:String,
          $ambiente:String,
          $nombrecomun:String,
          $formadecrecimiento:String,
          $prioritaria:String,
          $nivelprioridad:String,
          $exoticainvasora:String,
          $nom059:String,
          $cites:String,
          $iucn:String,
          $categoriaresidenciaaves:String,
          $probablelocnodecampo:String,
          $obsusoinfo:String,
          $coleccion:String,
          $institucion:String,
          $paiscoleccion:String,
          $numcatalogo:String,
          $numcolecta:String,
          $procedenciaejemplar:String,
          $determinador:String,
          $aniodeterminacion:String,
          $mesdeterminacion:String,
          $diadeterminacion:String,
          $fechadeterminacion:String,
          $calificadordeterminacion:String,
          $colector:String,
          $aniocolecta:String,
          $mescolecta:String,
          $diacolecta:String,
          $fechacolecta:String,
          $tipo:String,
          $ejemplarfosil:String,
          $proyecto:String,
          $fuente:String,
          $formadecitar:String,
          $licenciauso:String,
          $urlproyecto:String,
          $urlorigen:String,
          $urlejemplar:String,
          $ultimafechaactualizacion:String,
          $cuarentena:String,
          $version:String,
          $especie:String,
          $especievalida:String,
          $especievalidabusqueda:String,
          $addTaxon: ID,
          $removeTaxon: ID,
          $addCaracteristicas_cualitativas: [ID],
          $removeCaracteristicas_cualitativas: [ID],
          $addCaracteristicas_cuantitativas: [ID],
          $removeCaracteristicas_cuantitativas: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            region: $region,
            localidad: $localidad,
            longitud: $longitud,
            latitud: $latitud,
            datum: $datum,
            validacionambiente: $validacionambiente,
            geovalidacion: $geovalidacion,
            paismapa: $paismapa,
            estadomapa: $estadomapa,
            claveestadomapa: $claveestadomapa,
            mt24nombreestadomapa: $mt24nombreestadomapa,
            mt24claveestadomapa: $mt24claveestadomapa,
            municipiomapa: $municipiomapa,
            clavemunicipiomapa: $clavemunicipiomapa,
            mt24nombremunicipiomapa: $mt24nombremunicipiomapa,
            mt24clavemunicipiomapa: $mt24clavemunicipiomapa,
            incertidumbrexy: $incertidumbrexy,
            altitudmapa: $altitudmapa,
            usvserieI: $usvserieI,
            usvserieII: $usvserieII,
            usvserieIII: $usvserieIII,
            usvserieIV: $usvserieIV,
            usvserieV: $usvserieV,
            usvserieVI: $usvserieVI,
            anp: $anp,
            grupobio: $grupobio,
            subgrupobio: $subgrupobio,
            taxon: $taxon,
            autor: $autor,
            estatustax: $estatustax,
            reftax: $reftax,
            taxonvalido: $taxonvalido,
            autorvalido: $autorvalido,
            reftaxvalido: $reftaxvalido,
            taxonvalidado: $taxonvalidado,
            endemismo: $endemismo,
            taxonextinto: $taxonextinto,
            ambiente: $ambiente,
            nombrecomun: $nombrecomun,
            formadecrecimiento: $formadecrecimiento,
            prioritaria: $prioritaria,
            nivelprioridad: $nivelprioridad,
            exoticainvasora: $exoticainvasora,
            nom059: $nom059,
            cites: $cites,
            iucn: $iucn,
            categoriaresidenciaaves: $categoriaresidenciaaves,
            probablelocnodecampo: $probablelocnodecampo,
            obsusoinfo: $obsusoinfo,
            coleccion: $coleccion,
            institucion: $institucion,
            paiscoleccion: $paiscoleccion,
            numcatalogo: $numcatalogo,
            numcolecta: $numcolecta,
            procedenciaejemplar: $procedenciaejemplar,
            determinador: $determinador,
            aniodeterminacion: $aniodeterminacion,
            mesdeterminacion: $mesdeterminacion,
            diadeterminacion: $diadeterminacion,
            fechadeterminacion: $fechadeterminacion,
            calificadordeterminacion: $calificadordeterminacion,
            colector: $colector,
            aniocolecta: $aniocolecta,
            mescolecta: $mescolecta,
            diacolecta: $diacolecta,
            fechacolecta: $fechacolecta,
            tipo: $tipo,
            ejemplarfosil: $ejemplarfosil,
            proyecto: $proyecto,
            fuente: $fuente,
            formadecitar: $formadecitar,
            licenciauso: $licenciauso,
            urlproyecto: $urlproyecto,
            urlorigen: $urlorigen,
            urlejemplar: $urlejemplar,
            ultimafechaactualizacion: $ultimafechaactualizacion,
            cuarentena: $cuarentena,
            version: $version,
            especie: $especie,
            especievalida: $especievalida,
            especievalidabusqueda: $especievalidabusqueda,
            addTaxon: $addTaxon,
            removeTaxon: $removeTaxon,
            addCaracteristicas_cualitativas: $addCaracteristicas_cualitativas,
            removeCaracteristicas_cualitativas: $removeCaracteristicas_cualitativas,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
            removeCaracteristicas_cuantitativas: $removeCaracteristicas_cuantitativas,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       region,
       localidad,
       longitud,
       latitud,
       datum,
       validacionambiente,
       geovalidacion,
       paismapa,
       estadomapa,
       claveestadomapa,
       mt24nombreestadomapa,
       mt24claveestadomapa,
       municipiomapa,
       clavemunicipiomapa,
       mt24nombremunicipiomapa,
       mt24clavemunicipiomapa,
       incertidumbrexy,
       altitudmapa,
       usvserieI,
       usvserieII,
       usvserieIII,
       usvserieIV,
       usvserieV,
       usvserieVI,
       anp,
       grupobio,
       subgrupobio,
       taxon,
       autor,
       estatustax,
       reftax,
       taxonvalido,
       autorvalido,
       reftaxvalido,
       taxonvalidado,
       endemismo,
       taxonextinto,
       ambiente,
       nombrecomun,
       formadecrecimiento,
       prioritaria,
       nivelprioridad,
       exoticainvasora,
       nom059,
       cites,
       iucn,
       categoriaresidenciaaves,
       probablelocnodecampo,
       obsusoinfo,
       coleccion,
       institucion,
       paiscoleccion,
       numcatalogo,
       numcolecta,
       procedenciaejemplar,
       determinador,
       aniodeterminacion,
       mesdeterminacion,
       diadeterminacion,
       fechadeterminacion,
       calificadordeterminacion,
       colector,
       aniocolecta,
       mescolecta,
       diacolecta,
       fechacolecta,
       tipo,
       ejemplarfosil,
       proyecto,
       fuente,
       formadecitar,
       licenciauso,
       urlproyecto,
       urlorigen,
       urlejemplar,
       ultimafechaactualizacion,
       cuarentena,
       version,
       especie,
       especievalida,
       especievalidabusqueda,
`;

    //query
    let query =
      `mutation updateEjemplar(
          ${qvariables}
          ) { updateEjemplar(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('updateItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, "updateEjemplar");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateEjemplar"]
        || typeof response.data.data["updateEjemplar"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateEjemplar"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: item, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

  /**
   * deleteItem
   *
   * Delete an item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values needed to delete the Ejemplar item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteEjemplar(
              $id:ID!
        ) { deleteEjemplar(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteEjemplar");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteEjemplar"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteEjemplar"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getCaracteristicas_cualitativas   *
   * Get caracteristica_cualitativas records associated to the given ejemplar record
   * through association 'Caracteristicas_cualitativas', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getCaracteristicas_cualitativas(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `id,
     nombre,
     valor,
     nombre_corto,
     comentarios,
     metodo_id,
     registro_id,
`;

    variables["id"] = itemId;
    //set search
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneEjemplar($id:ID!, $search: searchCaracteristica_cualitativaInput, $pagination: paginationCursorInput!) {
             readOneEjemplar(id:$id) {
                caracteristicas_cualitativasConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCaracteristicas_cualitativas', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || !response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"]
      || typeof response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"].edges)
      || typeof response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneEjemplar"]["caracteristicas_cualitativasConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getCaracteristicas_cualitativasCount
   * 
   * Get caracteristica_cualitativas records count associated to the given ejemplar record
   * through association 'Caracteristicas_cualitativas', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getCaracteristicas_cualitativasCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"id": itemId};
    //search
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneEjemplar($id:ID!, $search: searchCaracteristica_cualitativaInput) { 
             readOneEjemplar(id:$id) {
              countFilteredCaracteristicas_cualitativas(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCaracteristicas_cualitativasCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || !Number.isInteger(response.data.data["readOneEjemplar"]["countFilteredCaracteristicas_cualitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneEjemplar"]["countFilteredCaracteristicas_cualitativas"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedCaracteristicas_cualitativasCount
   *
   * Get count of not associated Caracteristicas_cualitativas from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedCaracteristicas_cualitativasCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];
    /**
     * Algorithm:
     *    1. get a filtered count over all items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered count. 
     */
    //search
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "registro_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "registro_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countCaracteristica_cualitativas($search: searchCaracteristica_cualitativaInput) {
            countCaracteristica_cualitativas(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedCaracteristicas_cualitativasCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countCaracteristica_cualitativas");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countCaracteristica_cualitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countCaracteristica_cualitativas"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedCaracteristicas_cualitativas
 *
 * Get not associated Caracteristicas_cualitativas items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedCaracteristicas_cualitativas(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `id,
     nombre,
     valor,
     nombre_corto,
     comentarios,
     metodo_id,
     registro_id,
`;
    /**
     * Algorithm:
     *    1. get a filtered items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered items. 
     */
    //search
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "registro_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "registro_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    variables.search = s.search;
    //set query
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;
    let query =
      `query caracteristica_cualitativasConnection($search: searchCaracteristica_cualitativaInput, $pagination: paginationCursorInput!) {
             caracteristica_cualitativasConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedCaracteristicas_cualitativas', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "caracteristica_cualitativasConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["caracteristica_cualitativasConnection"]
      || typeof response.data.data["caracteristica_cualitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["caracteristica_cualitativasConnection"].edges)
      || typeof response.data.data["caracteristica_cualitativasConnection"].pageInfo !== 'object' 
      || response.data.data["caracteristica_cualitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["caracteristica_cualitativasConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getCaracteristicas_cuantitativas   *
   * Get caracteristica_cuantitativas records associated to the given ejemplar record
   * through association 'Caracteristicas_cuantitativas', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getCaracteristicas_cuantitativas(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `id,
     nombre,
     valor,
     unidad,
     nombre_corto,
     comentarios,
     metodo_id,
     registro_id,
`;

    variables["id"] = itemId;
    //set search
    let s = getSearchArgument('caracteristica_cuantitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneEjemplar($id:ID!, $search: searchCaracteristica_cuantitativaInput, $pagination: paginationCursorInput!) {
             readOneEjemplar(id:$id) {
                caracteristicas_cuantitativasConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCaracteristicas_cuantitativas', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || !response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"]
      || typeof response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"].edges)
      || typeof response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneEjemplar"]["caracteristicas_cuantitativasConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getCaracteristicas_cuantitativasCount
   * 
   * Get caracteristica_cuantitativas records count associated to the given ejemplar record
   * through association 'Caracteristicas_cuantitativas', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getCaracteristicas_cuantitativasCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"id": itemId};
    //search
    let s = getSearchArgument('caracteristica_cuantitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneEjemplar($id:ID!, $search: searchCaracteristica_cuantitativaInput) { 
             readOneEjemplar(id:$id) {
              countFilteredCaracteristicas_cuantitativas(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCaracteristicas_cuantitativasCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || !Number.isInteger(response.data.data["readOneEjemplar"]["countFilteredCaracteristicas_cuantitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneEjemplar"]["countFilteredCaracteristicas_cuantitativas"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedCaracteristicas_cuantitativasCount
   *
   * Get count of not associated Caracteristicas_cuantitativas from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedCaracteristicas_cuantitativasCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];
    /**
     * Algorithm:
     *    1. get a filtered count over all items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered count. 
     */
    //search
    let s = getSearchArgument('caracteristica_cuantitativa', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "registro_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "registro_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countCaracteristica_cuantitativas($search: searchCaracteristica_cuantitativaInput) {
            countCaracteristica_cuantitativas(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedCaracteristicas_cuantitativasCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countCaracteristica_cuantitativas");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countCaracteristica_cuantitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countCaracteristica_cuantitativas"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedCaracteristicas_cuantitativas
 *
 * Get not associated Caracteristicas_cuantitativas items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedCaracteristicas_cuantitativas(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `id,
     nombre,
     valor,
     unidad,
     nombre_corto,
     comentarios,
     metodo_id,
     registro_id,
`;
    /**
     * Algorithm:
     *    1. get a filtered items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered items. 
     */
    //search
    let s = getSearchArgument('caracteristica_cuantitativa', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "registro_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "registro_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    variables.search = s.search;
    //set query
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;
    let query =
      `query caracteristica_cuantitativasConnection($search: searchCaracteristica_cuantitativaInput, $pagination: paginationCursorInput!) {
             caracteristica_cuantitativasConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedCaracteristicas_cuantitativas', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "caracteristica_cuantitativasConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["caracteristica_cuantitativasConnection"]
      || typeof response.data.data["caracteristica_cuantitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["caracteristica_cuantitativasConnection"].edges)
      || typeof response.data.data["caracteristica_cuantitativasConnection"].pageInfo !== 'object' 
      || response.data.data["caracteristica_cuantitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["caracteristica_cuantitativasConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getTaxon   *
   * Get taxons records associated to the given ejemplar record
   * through association 'Taxon', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getTaxon(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `id,
     taxon,
     categoria,
     estatus,
     nombreAutoridad,
     citaNomenclatural,
     fuente,
     ambiente,
     grupoSNIB,
     categoriaResidencia,
     nom,
     cites,
     iucn,
     prioritarias,
     endemismo,
     categoriaSorter,
     bibliografia,
`;

    variables = { "id": itemId };
    //set query
    let query = 
      `query readOneEjemplar($id:ID!) {
             readOneEjemplar(id:$id) {
                Taxon{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getTaxon', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || typeof response.data.data["readOneEjemplar"]["Taxon"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneEjemplar"]["Taxon"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedTaxonCount
   *
   * Get count of not associated Taxon from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedTaxonCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];
    /**
     * Algorithm:
     *    1. get associated item id.
     *    2. get count of all items with corresponding filters:
     *      2.1 if: there is search filter:
     *          2.1.1: if: there is associated item:
     *            2.1.1.1: add filter to exclude associated item id.
     *            2.1.1.2: get filtered count.
     *          2.1.2: @return filtered count.
     *      2.2 else: there isn't search filter:
     *          2.2.1: get all items count.
     *            2.2.1.1: if: there is associated item:
     *              2.2.1.1.1: @return count-1.
     *            2.2.1.2: else: there isn't associated item:
     *              2.2.1.2.1: @return count. 
     */
  
    /**
     *    1. get associated item id.
     * 
     */
    let variables = {"id": itemId};
    let query = 
      `query readOneEjemplar($id:ID!) {
             readOneEjemplar(id:$id) {
                Taxon{
                  id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTaxonCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || typeof response.data.data["readOneEjemplar"]["Taxon"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneEjemplar"]["Taxon"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

   /**
     *    2. get count of all items with corresponding filters:
     *      2.1 if: there is search filter:
     *          2.1.1: if: there is associated item:
     *            2.1.1.1: add filter to exclude associated item id.
     *            2.1.1.2: get filtered count.
     *          2.1.2: @return filtered count.
     *      2.2 else: there isn't search filter:
     *          2.2.1: get all items count.
     *            2.2.1.1: if: there is associated item:
     *              2.2.1.1.1: @return count-1.
     *            2.2.1.2: else: there isn't associated item:
     *              2.2.1.2.1: @return count. 
     */
    variables = {};
    //search
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "id", valueType: "String", value: associatedItem["id"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countTaxons($search: searchTaxonInput) {
             countTaxons(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTaxonCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countTaxons");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countTaxons"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countTaxons"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    if(!s && associatedItem)  return {value: count-1, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    else                      return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedTaxon
 *
 * Get not associated Taxon items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedTaxon(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `id,
     taxon,
     categoria,
     estatus,
     nombreAutoridad,
     citaNomenclatural,
     fuente,
     ambiente,
     grupoSNIB,
     categoriaResidencia,
     nom,
     cites,
     iucn,
     prioritarias,
     endemismo,
     categoriaSorter,
     bibliografia,
`;
    /**
     * Algorithm:
     *    1. get associated item id.
     *    2. get all items exluding associated item if there is one.
     *    3: @return filtered items.
     * 
     */
  
    /**
     *    1. get associated item id.
     * 
     */
    let query = 
      `{  readOneEjemplar(id: "${itemId}") {
            Taxon{
              id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTaxon.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneEjemplar");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneEjemplar"]
      || typeof response.data.data["readOneEjemplar"] !== 'object'
      || typeof response.data.data["readOneEjemplar"]["Taxon"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneEjemplar"]["Taxon"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "id", valueType: "String", value: associatedItem["id"], operator: "ne"};

    //search
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) {
      //add new filter to ands array
      if(f1) s.search.search.push(f1); 
      //set search
      variables.search = s.search;
    } else {
      if(f1) {
        //add new filter search
        s = {search: f1};        
        //set search
        variables.search = s.search;
      }
    }
    //set query
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;
    query =
      `query taxonsConnection($search: searchTaxonInput, $pagination: paginationCursorInput!) {
             taxonsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTaxon.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "taxonsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["taxonsConnection"]
      || typeof response.data.data["taxonsConnection"] !== 'object'
      || !Array.isArray(response.data.data["taxonsConnection"].edges)
      || typeof response.data.data["taxonsConnection"].pageInfo !== 'object' 
      || response.data.data["taxonsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["taxonsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Plotly query
 * ------------
 */

  /**
   * getBarchartData
   *
   * Given an @attribute, calculates the object {x1:y1, x2:y2, ...} where
   * @x is a value of the attribute and @y is the total ocurrences of the 
   * value, calculated over all records in the model's table.
   * 
   * The items attrbutes are fetched from GraphQL Server in paginatedbatches, 
   * using a cursor-based connection. Gets only the indicated attribute. 
   * No search nor order are specified.
   * 
   * @param {String} url GraphQL Server url
   * @param {String} attribute Name of the attribute to be retrieved.
   */
  async getBarchartData(url, attribute) {
    //internal checks
    if(!attribute||typeof attribute !== 'string') throw new Error("internal_error: expected string in 'attribute' argument");
    
    let graphqlErrors = [];
    let batchSize = globals.MAX_RECORD_LIMIT ? Math.floor(globals.MAX_RECORD_LIMIT/2) : 5000;
    
    /**
     * Initialize batch query
     * 
     */
    //pagination
    let batchPagination = {first: batchSize};
    //variables
    let batchVariables = {pagination: batchPagination};
    //query
    let batchQuery = 
          `query ejemplarsConnection($pagination: paginationCursorInput!) {
                 ejemplarsConnection(pagination: $pagination) {
                    pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
                    edges {node {${attribute}}}
                 }}`;
    
    //initialize results
    let data = {};

    /**
     *  Recursive fetch of items algorithm (cursor-based-pagination):
     *  1 while @thereAreMoreItems do:
     *    1.1 fetch @batchSize items.
     *    1.2 reduce items result to {x1:y1, x2:y2, ...} and accumulate in @data object.
     *    1.3 calculates new @thereAreMoreItems value.
     *    1.4 if @thereAreMoreItems
     *      1.4.1 adjust pagination and @continue with next iteration.
     *    1.5 else: !@thereAreMoreItems 
     *      1.5.1 return @data or null if there are no values in @data.
     * 
     */
    let thereAreMoreItems = true;
    let iteration = 1;
    while(thereAreMoreItems) {
      /**
       * 1.1 Get @batchSize associated ids.
       * 
       */

      /**
       * Debug
       */
      if(globals.REQUEST_LOGGER) logRequest(`getBarchartData#i-${iteration}#`, batchQuery, batchVariables);

      //request
      let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
      let items = null;
      //check
      let check = checkResponse(response, graphqlErrors, "ejemplarsConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["ejemplarsConnection"]
        || typeof response.data.data["ejemplarsConnection"] !== 'object'
        || !Array.isArray(response.data.data["ejemplarsConnection"].edges)
        || typeof response.data.data["ejemplarsConnection"].pageInfo !== 'object' 
        || response.data.data["ejemplarsConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["ejemplarsConnection"];
      } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //if there are results...
      if(items.edges.length > 0) {
        //reduce to {x1:y1, x2:y2, ...}
        data = items.edges.reduce((acc, item) => {
          let key = item.node[attribute];
          if(!acc[key]) acc[key] = 1; //first ocurrence
          else acc[key]++;
          return acc;
        }, data);
      }

      //set flag
      thereAreMoreItems = (items.edges.length > 0) && items.pageInfo.hasNextPage;

      //check
      if(thereAreMoreItems) {
        //adjust pagination for next batch
        batchPagination.after = items.pageInfo.endCursor;
        batchVariables.pagination = batchPagination;
        
        //continue with next iteration...
        iteration++;

      } else { //no more items...

        //return value
        return {value: data, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      }
    }//end: while()
  },

}//end: export default

