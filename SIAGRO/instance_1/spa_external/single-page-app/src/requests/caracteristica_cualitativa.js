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
   * Get caracteristica_cualitativatable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateCaracteristica_cualitativa}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateCaracteristica_cualitativa");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateCaracteristica_cualitativa"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateCaracteristica_cualitativa"];
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
   * Get caracteristica_cualitativasitems count from GraphQL Server.
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
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countCaracteristica_cualitativas($search: searchCaracteristica_cualitativaInput) { 
             countCaracteristica_cualitativas( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

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
    let s = getSearchArgument('caracteristica_cualitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query caracteristica_cualitativasConnection($order: [orderCaracteristica_cualitativaInput], $search: searchCaracteristica_cualitativaInput, $pagination: paginationCursorInput!) { 
             caracteristica_cualitativasConnection( order: $order, search: $search, pagination: $pagination ) {
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Caracteristica_cualitativa item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Caracteristica_cualitativa item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $nombre:String,
          $valor:String,
          $nombre_corto:String,
          $comentarios:String,
          $addRegistro: ID,
          $addMetodo: ID,
`;

    //set parameters assignation
    let qparameters = `
            nombre:$nombre,
            valor:$valor,
            nombre_corto:$nombre_corto,
            comentarios:$comentarios,
            addRegistro: $addRegistro,
            addMetodo: $addMetodo,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       nombre,
       valor,
       nombre_corto,
       comentarios,
       metodo_id,
       registro_id,
`;

    //query
    let query =
      `mutation addCaracteristica_cualitativa(
          ${qvariables}
          ) { addCaracteristica_cualitativa(
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
    let check = checkResponse(response, graphqlErrors, "addCaracteristica_cualitativa");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addCaracteristica_cualitativa"]
        || typeof response.data.data["addCaracteristica_cualitativa"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addCaracteristica_cualitativa"];
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
   * Update Caracteristica_cualitativa item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Caracteristica_cualitativa item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $nombre:String,
          $valor:String,
          $nombre_corto:String,
          $comentarios:String,
          $addRegistro: ID,
          $removeRegistro: ID,
          $addMetodo: ID,
          $removeMetodo: ID,
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            nombre: $nombre,
            valor: $valor,
            nombre_corto: $nombre_corto,
            comentarios: $comentarios,
            addRegistro: $addRegistro,
            removeRegistro: $removeRegistro,
            addMetodo: $addMetodo,
            removeMetodo: $removeMetodo,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       nombre,
       valor,
       nombre_corto,
       comentarios,
       metodo_id,
       registro_id,
`;

    //query
    let query =
      `mutation updateCaracteristica_cualitativa(
          ${qvariables}
          ) { updateCaracteristica_cualitativa(
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
    let check = checkResponse(response, graphqlErrors, "updateCaracteristica_cualitativa");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateCaracteristica_cualitativa"]
        || typeof response.data.data["updateCaracteristica_cualitativa"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateCaracteristica_cualitativa"];
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
   * @param {Object} variables Object with values needed to delete the Caracteristica_cualitativa item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteCaracteristica_cualitativa(
              $id:ID!
        ) { deleteCaracteristica_cualitativa(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteCaracteristica_cualitativa");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteCaracteristica_cualitativa"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteCaracteristica_cualitativa"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getRegistro   *
   * Get ejemplars records associated to the given caracteristica_cualitativa record
   * through association 'Registro', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getRegistro(url, itemId, searchText, variables, ops) {
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

    variables = { "id": itemId };
    //set query
    let query = 
      `query readOneCaracteristica_cualitativa($id:ID!) {
             readOneCaracteristica_cualitativa(id:$id) {
                registro{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getRegistro', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["registro"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["registro"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedRegistroCount
   *
   * Get count of not associated Registro from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedRegistroCount(url, itemId, searchText, ops) {
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
      `query readOneCaracteristica_cualitativa($id:ID!) {
             readOneCaracteristica_cualitativa(id:$id) {
                registro{
                  id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedRegistroCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["registro"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["registro"];
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
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
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
      `query countEjemplars($search: searchEjemplarInput) {
             countEjemplars(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedRegistroCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countEjemplars");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countEjemplars"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countEjemplars"];
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
 * getNotAssociatedRegistro
 *
 * Get not associated Registro items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedRegistro(url, itemId, searchText, variables, ops, batchSize) {
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
      `{  readOneCaracteristica_cualitativa(id: ${itemId}) {
            registro{
              id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedRegistro.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["registro"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["registro"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "id", valueType: "String", value: associatedItem["id"], operator: "ne"};

    //search
    let s = getSearchArgument('ejemplar', searchText, ops, 'object');
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
      `query ejemplarsConnection($search: searchEjemplarInput, $pagination: paginationCursorInput!) {
             ejemplarsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedRegistro.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "ejemplarsConnection");
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
 * Filter
 * ------
 */

  /**
   * getMetodo   *
   * Get metodos records associated to the given caracteristica_cualitativa record
   * through association 'Metodo', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getMetodo(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `id,
     descripcion,
     referencias,
     link_referencias,
`;

    variables = { "id": itemId };
    //set query
    let query = 
      `query readOneCaracteristica_cualitativa($id:ID!) {
             readOneCaracteristica_cualitativa(id:$id) {
                metodo{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getMetodo', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["metodo"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["metodo"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedMetodoCount
   *
   * Get count of not associated Metodo from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedMetodoCount(url, itemId, searchText, ops) {
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
      `query readOneCaracteristica_cualitativa($id:ID!) {
             readOneCaracteristica_cualitativa(id:$id) {
                metodo{
                  id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMetodoCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["metodo"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["metodo"];
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
    let s = getSearchArgument('metodo', searchText, ops, 'object');
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
      `query countMetodos($search: searchMetodoInput) {
             countMetodos(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMetodoCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countMetodos");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countMetodos"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countMetodos"];
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
 * getNotAssociatedMetodo
 *
 * Get not associated Metodo items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedMetodo(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `id,
     descripcion,
     referencias,
     link_referencias,
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
      `{  readOneCaracteristica_cualitativa(id: ${itemId}) {
            metodo{
              id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMetodo.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneCaracteristica_cualitativa");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneCaracteristica_cualitativa"]
      || typeof response.data.data["readOneCaracteristica_cualitativa"] !== 'object'
      || typeof response.data.data["readOneCaracteristica_cualitativa"]["metodo"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneCaracteristica_cualitativa"]["metodo"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "id", valueType: "String", value: associatedItem["id"], operator: "ne"};

    //search
    let s = getSearchArgument('metodo', searchText, ops, 'object');
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
      `query metodosConnection($search: searchMetodoInput, $pagination: paginationCursorInput!) {
             metodosConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMetodo.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "metodosConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["metodosConnection"]
      || typeof response.data.data["metodosConnection"] !== 'object'
      || !Array.isArray(response.data.data["metodosConnection"].edges)
      || typeof response.data.data["metodosConnection"].pageInfo !== 'object' 
      || response.data.data["metodosConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["metodosConnection"];
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
          `query caracteristica_cualitativasConnection($pagination: paginationCursorInput!) {
                 caracteristica_cualitativasConnection(pagination: $pagination) {
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

