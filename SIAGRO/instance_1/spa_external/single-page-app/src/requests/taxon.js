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
   * Get taxontable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateTaxon}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateTaxon");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateTaxon"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateTaxon"];
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
   * Get taxonsitems count from GraphQL Server.
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
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countTaxons($search: searchTaxonInput) { 
             countTaxons( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countTaxons");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countTaxons"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countTaxons"];
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
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query taxonsConnection($order: [orderTaxonInput], $search: searchTaxonInput, $pagination: paginationCursorInput!) { 
             taxonsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "taxonsConnection");
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Taxon item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Taxon item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $taxon:String,
          $categoria:String,
          $estatus:String,
          $nombreAutoridad:String,
          $citaNomenclatural:String,
          $fuente:String,
          $ambiente:String,
          $grupoSNIB:String,
          $categoriaResidencia:String,
          $nom:String,
          $cites:String,
          $iucn:String,
          $prioritarias:String,
          $endemismo:String,
          $categoriaSorter:String,
          $bibliografia:[String],
          $addEjemplares: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            taxon:$taxon,
            categoria:$categoria,
            estatus:$estatus,
            nombreAutoridad:$nombreAutoridad,
            citaNomenclatural:$citaNomenclatural,
            fuente:$fuente,
            ambiente:$ambiente,
            grupoSNIB:$grupoSNIB,
            categoriaResidencia:$categoriaResidencia,
            nom:$nom,
            cites:$cites,
            iucn:$iucn,
            prioritarias:$prioritarias,
            endemismo:$endemismo,
            categoriaSorter:$categoriaSorter,
            bibliografia:$bibliografia,
            addEjemplares: $addEjemplares,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation addTaxon(
          ${qvariables}
          ) { addTaxon(
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
    let check = checkResponse(response, graphqlErrors, "addTaxon");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addTaxon"]
        || typeof response.data.data["addTaxon"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addTaxon"];
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
   * Update Taxon item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Taxon item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $taxon:String,
          $categoria:String,
          $estatus:String,
          $nombreAutoridad:String,
          $citaNomenclatural:String,
          $fuente:String,
          $ambiente:String,
          $grupoSNIB:String,
          $categoriaResidencia:String,
          $nom:String,
          $cites:String,
          $iucn:String,
          $prioritarias:String,
          $endemismo:String,
          $categoriaSorter:String,
          $bibliografia:[String],
          $addEjemplares: [ID],
          $removeEjemplares: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            taxon: $taxon,
            categoria: $categoria,
            estatus: $estatus,
            nombreAutoridad: $nombreAutoridad,
            citaNomenclatural: $citaNomenclatural,
            fuente: $fuente,
            ambiente: $ambiente,
            grupoSNIB: $grupoSNIB,
            categoriaResidencia: $categoriaResidencia,
            nom: $nom,
            cites: $cites,
            iucn: $iucn,
            prioritarias: $prioritarias,
            endemismo: $endemismo,
            categoriaSorter: $categoriaSorter,
            bibliografia: $bibliografia,
            addEjemplares: $addEjemplares,
            removeEjemplares: $removeEjemplares,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation updateTaxon(
          ${qvariables}
          ) { updateTaxon(
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
    let check = checkResponse(response, graphqlErrors, "updateTaxon");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateTaxon"]
        || typeof response.data.data["updateTaxon"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateTaxon"];
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
   * @param {Object} variables Object with values needed to delete the Taxon item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteTaxon(
              $id:ID!
        ) { deleteTaxon(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteTaxon");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteTaxon"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteTaxon"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getEjemplares   *
   * Get ejemplars records associated to the given taxon record
   * through association 'Ejemplares', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getEjemplares(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

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

    variables["id"] = itemId;
    //set search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneTaxon($id:ID!, $search: searchEjemplarInput, $pagination: paginationCursorInput!) {
             readOneTaxon(id:$id) {
                ejemplaresConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEjemplares', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneTaxon");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneTaxon"]
      || typeof response.data.data["readOneTaxon"] !== 'object'
      || !response.data.data["readOneTaxon"]["ejemplaresConnection"]
      || typeof response.data.data["readOneTaxon"]["ejemplaresConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneTaxon"]["ejemplaresConnection"].edges)
      || typeof response.data.data["readOneTaxon"]["ejemplaresConnection"].pageInfo !== 'object' 
      || response.data.data["readOneTaxon"]["ejemplaresConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneTaxon"]["ejemplaresConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getEjemplaresCount
   * 
   * Get ejemplars records count associated to the given taxon record
   * through association 'Ejemplares', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getEjemplaresCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"id": itemId};
    //search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneTaxon($id:ID!, $search: searchEjemplarInput) { 
             readOneTaxon(id:$id) {
              countFilteredEjemplares(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEjemplaresCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneTaxon");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneTaxon"]
      || typeof response.data.data["readOneTaxon"] !== 'object'
      || !Number.isInteger(response.data.data["readOneTaxon"]["countFilteredEjemplares"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneTaxon"]["countFilteredEjemplares"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedEjemplaresCount
   *
   * Get count of not associated Ejemplares from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedEjemplaresCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];
    /**
     * Algorithm:
     *    1. get count of all associtation items (countA).
     *    2. get count of all associated items (countB).
     *    3. @return (countA - countB).
     *  
     */

    /**
     *    1. get count of all associtation items (countA).
     * 
     */
    let variables = {};
    //search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //set query
    let query = 
     `query countEjemplars($search: searchEjemplarInput) {
            countEjemplars(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedEjemplaresCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let countA = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countEjemplars");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countEjemplars"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      countA = response.data.data["countEjemplars"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get count of all associated items (countB).
     *  
     */
    variables = {};
    //id
    variables["id"] = itemId;
    //search
    if(s) variables.search = s.search;
    //query
    query =
      `query readOneTaxon($id:ID!, $search: searchEjemplarInput) { 
             readOneTaxon(id:$id) {
              countFilteredEjemplares(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEjemplaresCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let countB = null;
    //check
    check = checkResponse(response, graphqlErrors, "readOneTaxon");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneTaxon"]
      ||typeof response.data.data["readOneTaxon"] !== 'object'
      || !Number.isInteger(response.data.data["readOneTaxon"]["countFilteredEjemplares"])
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      countB = response.data.data["readOneTaxon"]["countFilteredEjemplares"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: (countA - countB), message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedEjemplares
 *
 * Get not associated Ejemplares items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedEjemplares(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

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
  /**
   * Recursive fetch of not associated items algorithm (cursor-based-pagination):
   *  1 Until @requiredItems are fetched, do:
   *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
   *        where each item will be fetched with the correspondent associationConnection, which in turn will be 
   *        filtered by the current itemId. The resulting associationConnection will contain a non-empty edges-array if
   *        the current item is associated or an empty edges-array otherwise.
   *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
   *        Only the items with an empty edges-array in its associationConnection will be added.
   *    1.4 Check number of fetched items:
   *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
   *               1.4.1.1 Adjust pagination to get the next batch of items.
   *               1.4.1.2 @continue with next iteration.
   *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items: 
   *               1.4.2.1 Return Connection with edges and pageInfo properly configured.  
   *               1.4.2.2 @done
   */
  //set direction
  let isForward = variables.pagination.first ? true : false;
  //set required number of items
  let requiredItems = isForward ? variables.pagination.first : variables.pagination.last;

  /**
   * Initialize batch query
   * 
   */
  //pagination
  let batchPagination = {...variables.pagination, first: isForward ? batchSize : null, last: !isForward ? batchSize : null};
  //search
  let batchSearch = getSearchArgument('ejemplar', searchText, ops, 'object');
  //variables
  let batchVariables = {"id": itemId, pagination: batchPagination};
  if(batchSearch) batchVariables.search = batchSearch.search;
  
  let batchQuery = 
        `query ejemplarsConnection($id: String, $search: searchEjemplarInput, $pagination: paginationCursorInput!) {
               ejemplarsConnection(search: $search, pagination: $pagination) {
                  pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
                  edges {node {
                    ${qattributes}
                    Connection(
                      search: {field: id, value: $id, valueType: String, operator: eq },
                      pagination: {first: 1}){ edges {node {id}}}
          }}}}`;

  //initialize results
  let nonaPageInfo = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
  let nonaEdges = [];

  //batch counter
  let iteration = 1;
  
   /**
   * Recursive fetch of not associated items algorithm (cursor-based-pagination):
   *  1 Until @requiredItems are fetched, do:
   * 
   */
  while(nonaEdges.length < requiredItems) {    
    /**
     *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
     *        where each item will be fetched with the correspondent associationConnection, which in turn will be 
     *        filtered by the current itemId. The resulting associationConnection will contain a non-empty edges-array if
     *        the current item is associated or an empty edges-array otherwise.
     * 
     */
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedEjemplares.batch.${iteration}`, batchQuery, batchVariables);

    //request
    let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
    let batchConnection = null;
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
      batchConnection = response.data.data["ejemplarsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    
    /**
     *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
     *        Only the items with an empty edges-array in its associationConnection will be added.
     * 
     */
    //get all not associated in current batch
    let batchEdges = [];
    for(let i=0; (i<batchConnection.edges.length && nonaEdges.length<requiredItems); i++) {          
        //check: not associated item
        if(batchConnection.edges[i].node["Connection"].edges.length === 0) {
        
          //new non-associated edge
          let edge = {...batchConnection.edges[i]};

          //push new edge
          batchEdges.push(edge);
        }
    }
    let thereAreMoreNonaItems = (batchEdges.length > (requiredItems - nonaEdges.length));

    if(batchEdges.length > 0) { //if there are new non-associated items... 
      //adjust pageInfo (start)
      if(nonaEdges.length === 0) {
        if(isForward) {
          nonaPageInfo.startCursor = batchEdges[0].cursor;
          nonaPageInfo.hasPreviousPage = batchConnection.pageInfo.hasPreviousPage;
        } else {
          nonaPageInfo.endCursor = batchEdges[batchEdges.length-1].cursor;
          nonaPageInfo.hasNextPage = batchConnection.pageInfo.hasNextPage;
        }
      } 
      //join new items
      if(isForward) nonaEdges = [...nonaEdges, ...batchEdges.slice(0, (requiredItems - nonaEdges.length)) ];
      else          nonaEdges = [...batchEdges.slice(-(requiredItems - nonaEdges.length)), ...nonaEdges ];
    }

    /**
     *    1.4 Check number of fetched items:
     *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
     *               1.4.1.1 Adjust pagination to get the next batch of items.
     *               1.4.1.2 @continue with next iteration.
     *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items: 
     *               1.4.2.1 Return Connection with edges and pageInfo properly configured.  
     *               1.4.2.2 @done
     * 
     */
    let thereAreMoreItems = isForward ? batchConnection.pageInfo.hasNextPage : batchConnection.pageInfo.hasPreviousPage;

    if(nonaEdges.length < requiredItems && thereAreMoreItems) {
      //adjust pagination for next batch associated ids
      batchPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
      batchPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
      batchPagination.includeCursor = false;
      batchVariables.pagination = batchPagination;

      //continue with next iteration...
      iteration++;
    } else {
      
      //adjust pagination info (end)
      if(nonaEdges.length > 0) {
        if(isForward) {
          nonaPageInfo.endCursor = nonaEdges[nonaEdges.length - 1].cursor;
          nonaPageInfo.hasNextPage = batchConnection.pageInfo.hasNextPage || thereAreMoreNonaItems;
        } else {
          nonaPageInfo.startCursor = nonaEdges[0].cursor;
          nonaPageInfo.hasPreviousPage = batchConnection.pageInfo.hasPreviousPage || thereAreMoreNonaItems;
        }
      }

      //delete innerConnecton and cursor
      for(let i=0; i<nonaEdges.length; i++) {
        delete nonaEdges[i].node["Connection"];
        delete nonaEdges[i].cursor;
      }

      //return value
      return {value: {pageInfo: nonaPageInfo, edges: nonaEdges}, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    }
  }//end: while()

  /////////////////////////////
  /**
   * Alternative algorithm.
   * 
   * Fetch not associated items excluding associated ones in batches.
   */
  /////////////////////////////
  // /**
  //  * Recursive fetch of not associated items algorithm (cursor-based-pagination):
  //  *  1 Until @requiredItems are fetched, do:
  //  *    1.1 Get @batchSize associated ids.
  //  *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
  //  *        with a search filter excluding the set of associated ids fetched at 1.1 and not exceeding the last (or first) 
  //  *        associated id in this set.
  //  *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
  //  *    1.4 Check number of items fetched:
  //  *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
  //  *               1.4.1.1 Adjust pagination to get the next batch of associated ids and next not-associated items page.
  //  *               1.4.1.2 @continue with next iteration.
  //  *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items:
  //  *               1.4.2.1 Return Connection with edges and pageInfo properly configured. 
  //  *               1.4.2.2 @done
  //  */

  // //set direction
  // let isForward = variables.pagination.first ? true : false;
  // //set required number of items
  // let requiredItems = isForward ? variables.pagination.first : variables.pagination.last;
  // //set general search filters
  // let s = getSearchArgument('ejemplar', searchText, ops, 'object');

  // /**
  //  * Initialize batch query
  //  * 
  //  */
  // //pagination
  // let batchPagination = {...variables.pagination, first: isForward ? batchSize : null, last: !isForward ? batchSize : null, includeCursor: false};
  // //search
  // let batchSearch = s ? {...s} : null;
  // //variables
  // let batchVariables = {"id": itemId, pagination: batchPagination};
  // if(batchSearch) batchVariables.search = batchSearch.search;
  // //query
  // let batchQuery = 
  //       `query readOneTaxon($id:ID!, $search: searchEjemplarInput, $pagination: paginationCursorInput!) {
  //              readOneTaxon(id: $id) {
  //                 ejemplaresConnection( search: $search, pagination: $pagination ) {
  //                   pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
  //                   edges {node {id}}
  //         }}}`;

  // /**
  //  * Initialize non-associated items query
  //  * 
  //  */
  // //pagination
  // let nonaPagination = {...variables.pagination};
  // //search
  // let nonaSearch = null; //will be set in each iteration
  // //variables
  // let nonaVariables = {pagination: nonaPagination};
  // //query
  // let nonaQuery =
  //       `query ejemplarsConnection($search: searchEjemplarInput, $pagination: paginationCursorInput!) {
  //              ejemplarsConnection( search: $search, pagination: $pagination ) {
  //                 pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
  //                 edges {node {${qattributes}}}
  //         }}`;

  // //initialize final results
  // let nonaPageInfo = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
  // let nonaEdges = [];

  // /**
  //  * Recursive fetch of not associated items algorithm (cursor-based-pagination):
  //  *  1 Until @requiredItems are fetched, do:
  //  * 
  //  */
  // let iteration = 1;
  // while(nonaEdges.length < requiredItems) {
  //   /**
  //    * 1.1 Get @batchSize associated ids.
  //    * 
  //    */

  //   /**
  //    * Debug
  //    */
  //   if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedEjemplares.batch.${iteration}`, batchQuery, batchVariables);

  //   //request
  //   let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
  //   let batchConnection = null;
  //   //check
  //   let check = checkResponse(response, graphqlErrors, "readOneTaxon");
  //   if(check === 'ok') {
  //     //check type
  //     if(!response.data.data["readOneTaxon"]
  //     || typeof response.data.data["readOneTaxon"] !== 'object'
  //     || response.data.data["readOneTaxon"]["ejemplaresConnection"] === null
  //     || typeof response.data.data["readOneTaxon"]["ejemplaresConnection"] !== 'object'
  //     || !Array.isArray(response.data.data["readOneTaxon"]["ejemplaresConnection"].edges)
  //     || typeof response.data.data["readOneTaxon"]["ejemplaresConnection"].pageInfo !== 'object' 
  //     || response.data.data["readOneTaxon"]["ejemplaresConnection"].pageInfo === null)
  //     return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //     //get value
  //     batchConnection = response.data.data["readOneTaxon"]["ejemplaresConnection"];
  //   } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    
  //   //get ids to exclude
  //   let idsToExclude = batchConnection.edges.map(o => o.node.id);

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- iteration: ", iteration);
  //   console.log("@@-- requiredItems: ", requiredItems);
  //   console.log("@@-- batchConnection: ", batchConnection);
  //   console.log("@@-- idsToExclude: ", idsToExclude);

  //   /**
  //    * 1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
  //    *      with a search filter excluding the set of associated ids fetched at 1.1 and not exceeding the last (or first) 
  //    *      associated id in this set.
  //    */
  //   //init with general search
  //   nonaSearch = s ? {...s} : null;
  
  //   //case: there are associated items to exclude...
  //   if(idsToExclude.length > 0) {
  //     //add exclusions
  //     let nonaOps = {
  //       exclude: [{
  //         type: 'String',
  //         values: {"id": idsToExclude}
  //       }]
  //     };
      
  //     //set exclusion filters (ands)
  //     let nonaSearchB = getSearchArgument('ejemplar', null, nonaOps, 'object');

  //     //set filter to limit results
  //     if(isForward) {
  //       //case: there are more associated ids...
  //       if(batchConnection.pageInfo.hasNextPage) {
  //         //make filter to limit results to before the last associated id.
  //         let f1 = {field: "id", valueType: String, value: idsToExclude[idsToExclude.length-1], operator: "lt"};
  //         //add filter
  //         nonaSearchB.search.search.push(f1);
  //       }
  //     } else { //isBackward
  //       //case: there are more associated ids...
  //       if(batchConnection.pageInfo.hasPreviousPage) {
  //         //make filter to limit results to after the first associated id.
  //         let f1 = {field: "id", valueType: String, value: idsToExclude[0], operator: "gt"};
  //         //add filter
  //         nonaSearchB.search.search.push(f1);
  //       }
  //     }

  //     //join search filters
  //     if(nonaSearch) nonaSearch.search.search = [...nonaSearch.search.search, ...nonaSearchB.search.search];
  //     else           nonaSearch = nonaSearchB;
  //   }
  //   //add search to variables
  //   if(nonaSearch) nonaVariables.search = nonaSearch.search;

  //   /**
  //    * Debug
  //    */
  //   if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedEjemplares.nonAssociatedBatch.${iteration}`, nonaQuery, nonaVariables);
    
  //   //request
  //   response = await requestGraphql({ url, query:nonaQuery, variables:nonaVariables });
  //   let nonaConnection = null;
  //   //check
  //   check = checkResponse(response, graphqlErrors, "ejemplarsConnection");
  //   if(check === 'ok') {
  //     //check type
  //     if(!response.data.data["ejemplarsConnection"]
  //     || typeof response.data.data["ejemplarsConnection"] !== 'object'
  //     || !Array.isArray(response.data.data["ejemplarsConnection"].edges)
  //     || typeof response.data.data["ejemplarsConnection"].pageInfo !== 'object' 
  //     || response.data.data["ejemplarsConnection"].pageInfo === null)
  //     return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //     //get value
  //     nonaConnection = response.data.data["ejemplarsConnection"];
  //   } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- nonaConnection: ", nonaConnection);

  //   /**
  //    * 1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
  //    */
  //   if(nonaConnection.edges.length > 0) { //if there are new items...
  //     //adjust pageInfo for the first non associated items
  //     if(nonaEdges.length === 0) {
  //       nonaPageInfo = { ...nonaConnection.pageInfo};
  //     } else {  //adjust pageInfo for the last non associated items
  //       if(isForward) {
  //         nonaPageInfo.endCursor = nonaConnection.pageInfo.endCursor;
  //         nonaPageInfo.hasNextPage = nonaConnection.pageInfo.hasNextPage;
  //       } else {
  //         nonaPageInfo.startCursor = nonaConnection.pageInfo.startCursor;
  //         nonaPageInfo.hasPreviousPage = nonaConnection.pageInfo.hasPreviousPage;
  //       }
  //     } 
  //     //join new items      
  //     if(isForward) nonaEdges = [...nonaEdges, ...nonaConnection.edges ];
  //     else          nonaEdges = [...nonaConnection.edges, ...nonaEdges ];
  //   }

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- nonaEdges: ", nonaEdges);

  //   /**
  //    * 1.4 Check number of items fetched:
  //    *    1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
  //    *           1.4.1.1 Adjust pagination to get the next batch of associated ids and next not-associated items page.
  //    *           1.4.1.2 @continue with next iteration.
  //    *    1.4.2  If: fetched items are equal to the requested number of items in 1.2 or there are no more items:
  //    *           1.4.2.1 Return Connection with edges and pageInfo properly configured. 
  //    *           1.4.2.2 @done
  //    */
  //   let thereAreMoreItems = isForward ? batchConnection.pageInfo.hasNextPage : batchConnection.pageInfo.hasPreviousPage;

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- thereAreMoreItems: ", thereAreMoreItems);
  //   console.log("@@-- nonaEdges.length : ", nonaEdges.length);

  //   if(nonaEdges.length < requiredItems && thereAreMoreItems) {
  //     //adjust pagination for next batch associated ids
  //     batchPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
  //     batchPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
  //     batchVariables.pagination = batchPagination;
      
  //     //adjust pagination for the next non-associated items
  //     nonaPagination.first = isForward ? (requiredItems - nonaEdges.length) : null;
  //     nonaPagination.last = !isForward ? (requiredItems - nonaEdges.length) : null;
  //     nonaPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
  //     nonaPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
  //     nonaPagination.includeCursor = false;
  //     nonaVariables = {pagination: nonaPagination}; //search will be set in next iteration

  //     //continue with next iteration...
  //     iteration++;
  //   } else {        
  //     //return value
  //     return {value: {pageInfo: nonaPageInfo, edges: nonaEdges}, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  //   }
  // }//end: while()
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
          `query taxonsConnection($pagination: paginationCursorInput!) {
                 taxonsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "taxonsConnection");
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

