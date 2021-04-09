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
   * Get registrotable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateRegistro}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateRegistro");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateRegistro"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateRegistro"];
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
   * Get registrositems count from GraphQL Server.
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
    let s = getSearchArgument('registro', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countRegistros($search: searchRegistroInput) { 
             countRegistros( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countRegistros");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countRegistros"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countRegistros"];
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
    let s = getSearchArgument('registro', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `conabio_id,
       clave_original,
       tipo_alimento,
       food_type,
       descripcion_alimento,
       food_description,
       procedencia,
       taxon_id,
       referencias_ids,
`;

    //query
    let query =
      `query registrosConnection($order: [orderRegistroInput], $search: searchRegistroInput, $pagination: paginationCursorInput!) { 
             registrosConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "registrosConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["registrosConnection"]
      || typeof response.data.data["registrosConnection"] !== 'object'
      || !Array.isArray(response.data.data["registrosConnection"].edges)
      || typeof response.data.data["registrosConnection"].pageInfo !== 'object' 
      || response.data.data["registrosConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["registrosConnection"];
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
   * Add new Registro item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Registro item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $conabio_id:ID!,
          $clave_original:String,
          $tipo_alimento:String,
          $food_type:String,
          $descripcion_alimento:String,
          $food_description:String,
          $procedencia:String,
          $addInformacion_taxonomica: ID,
          $addCaracteristicas_cuantitativas: [ID],
          $addReferencias: [ID],
`;

    //set parameters assignation
    let qparameters = `
            conabio_id:$conabio_id,
            clave_original:$clave_original,
            tipo_alimento:$tipo_alimento,
            food_type:$food_type,
            descripcion_alimento:$descripcion_alimento,
            food_description:$food_description,
            procedencia:$procedencia,
            addInformacion_taxonomica: $addInformacion_taxonomica,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
            addReferencias: $addReferencias,
`;

    //set attributes to fetch
    let qattributes = 
      `conabio_id,
       clave_original,
       tipo_alimento,
       food_type,
       descripcion_alimento,
       food_description,
       procedencia,
       taxon_id,
       referencias_ids,
`;

    //query
    let query =
      `mutation addRegistro(
          ${qvariables}
          ) { addRegistro(
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
    let check = checkResponse(response, graphqlErrors, "addRegistro");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addRegistro"]
        || typeof response.data.data["addRegistro"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addRegistro"];
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
   * Update Registro item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Registro item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $conabio_id:ID!,
          $clave_original:String,
          $tipo_alimento:String,
          $food_type:String,
          $descripcion_alimento:String,
          $food_description:String,
          $procedencia:String,
          $addInformacion_taxonomica: ID,
          $removeInformacion_taxonomica: ID,
          $addCaracteristicas_cuantitativas: [ID],
          $removeCaracteristicas_cuantitativas: [ID],
          $addReferencias: [ID],
          $removeReferencias: [ID],
`;

    //set parameters assignation
    let qparameters = `
            conabio_id:$conabio_id,
            clave_original: $clave_original,
            tipo_alimento: $tipo_alimento,
            food_type: $food_type,
            descripcion_alimento: $descripcion_alimento,
            food_description: $food_description,
            procedencia: $procedencia,
            addInformacion_taxonomica: $addInformacion_taxonomica,
            removeInformacion_taxonomica: $removeInformacion_taxonomica,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
            removeCaracteristicas_cuantitativas: $removeCaracteristicas_cuantitativas,
            addReferencias: $addReferencias,
            removeReferencias: $removeReferencias,
`;

    //set attributes to fetch
    let qattributes = 
      `conabio_id,
       clave_original,
       tipo_alimento,
       food_type,
       descripcion_alimento,
       food_description,
       procedencia,
       taxon_id,
       referencias_ids,
`;

    //query
    let query =
      `mutation updateRegistro(
          ${qvariables}
          ) { updateRegistro(
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
    let check = checkResponse(response, graphqlErrors, "updateRegistro");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateRegistro"]
        || typeof response.data.data["updateRegistro"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateRegistro"];
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
   * @param {Object} variables Object with values needed to delete the Registro item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteRegistro(
              $conabio_id:ID!
        ) { deleteRegistro(
              conabio_id:$conabio_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteRegistro");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteRegistro"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteRegistro"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getCaracteristicas_cuantitativas   *
   * Get caracteristica_cuantitativas records associated to the given registro record
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

    variables["conabio_id"] = itemId;
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
      `query readOneRegistro($conabio_id:ID!, $search: searchCaracteristica_cuantitativaInput, $pagination: paginationCursorInput!) {
             readOneRegistro(conabio_id:$conabio_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || !response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"]
      || typeof response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"].edges)
      || typeof response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneRegistro"]["caracteristicas_cuantitativasConnection"];
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
   * Get caracteristica_cuantitativas records count associated to the given registro record
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

    let variables = {"conabio_id": itemId};
    //search
    let s = getSearchArgument('caracteristica_cuantitativa', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneRegistro($conabio_id:ID!, $search: searchCaracteristica_cuantitativaInput) { 
             readOneRegistro(conabio_id:$conabio_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || !Number.isInteger(response.data.data["readOneRegistro"]["countFilteredCaracteristicas_cuantitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneRegistro"]["countFilteredCaracteristicas_cuantitativas"];
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
   * getReferencias   *
   * Get referencia records associated to the given registro record
   * through association 'Referencias', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getReferencias(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `referencia_id,
     referencia,
     registros_ids,
`;

    variables["conabio_id"] = itemId;
    //set search
    let s = getSearchArgument('referencia', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneRegistro($conabio_id:ID!, $search: searchReferenciaInput, $pagination: paginationCursorInput!) {
             readOneRegistro(conabio_id:$conabio_id) {
                referenciasConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getReferencias', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || !response.data.data["readOneRegistro"]["referenciasConnection"]
      || typeof response.data.data["readOneRegistro"]["referenciasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneRegistro"]["referenciasConnection"].edges)
      || typeof response.data.data["readOneRegistro"]["referenciasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneRegistro"]["referenciasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneRegistro"]["referenciasConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getReferenciasCount
   * 
   * Get referencia records count associated to the given registro record
   * through association 'Referencias', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getReferenciasCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"conabio_id": itemId};
    //search
    let s = getSearchArgument('referencia', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneRegistro($conabio_id:ID!, $search: searchReferenciaInput) { 
             readOneRegistro(conabio_id:$conabio_id) {
              countFilteredReferencias(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getReferenciasCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || !Number.isInteger(response.data.data["readOneRegistro"]["countFilteredReferencias"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneRegistro"]["countFilteredReferencias"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedReferenciasCount
   *
   * Get count of not associated Referencias from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedReferenciasCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('referencia', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "registros_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "registros_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countReferencia($search: searchReferenciaInput) {
          countReferencia(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedReferenciasCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countReferencia");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countReferencia"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countReferencia"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedReferencias
 *
 * Get not associated Referencias items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedReferencias(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `referencia_id,
     referencia,
     registros_ids,
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
  let s = getSearchArgument('referencia', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "registros_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "registros_ids", valueType: "String", value: null, operator: "eq"};
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
    `query referenciaConnection($search: searchReferenciaInput, $pagination: paginationCursorInput!) {
           referenciaConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedReferencias', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "referenciaConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["referenciaConnection"]
    || typeof response.data.data["referenciaConnection"] !== 'object'
    || !Array.isArray(response.data.data["referenciaConnection"].edges)
    || typeof response.data.data["referenciaConnection"].pageInfo !== 'object' 
    || response.data.data["referenciaConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["referenciaConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getInformacion_taxonomica   *
   * Get taxons records associated to the given registro record
   * through association 'Informacion_taxonomica', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getInformacion_taxonomica(url, itemId, searchText, variables, ops) {
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

    variables = { "conabio_id": itemId };
    //set query
    let query = 
      `query readOneRegistro($conabio_id:ID!) {
             readOneRegistro(conabio_id:$conabio_id) {
                informacion_taxonomica{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getInformacion_taxonomica', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || typeof response.data.data["readOneRegistro"]["informacion_taxonomica"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneRegistro"]["informacion_taxonomica"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedInformacion_taxonomicaCount
   *
   * Get count of not associated Informacion_taxonomica from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedInformacion_taxonomicaCount(url, itemId, searchText, ops) {
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
    let variables = {"conabio_id": itemId};
    let query = 
      `query readOneRegistro($conabio_id:ID!) {
             readOneRegistro(conabio_id:$conabio_id) {
                informacion_taxonomica{
                  id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInformacion_taxonomicaCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || typeof response.data.data["readOneRegistro"]["informacion_taxonomica"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneRegistro"]["informacion_taxonomica"];
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
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInformacion_taxonomicaCount.query2', query, variables);
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
 * getNotAssociatedInformacion_taxonomica
 *
 * Get not associated Informacion_taxonomica items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedInformacion_taxonomica(url, itemId, searchText, variables, ops, batchSize) {
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
      `{  readOneRegistro(conabio_id: "${itemId}") {
            informacion_taxonomica{
              id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInformacion_taxonomica.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneRegistro");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneRegistro"]
      || typeof response.data.data["readOneRegistro"] !== 'object'
      || typeof response.data.data["readOneRegistro"]["informacion_taxonomica"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneRegistro"]["informacion_taxonomica"];
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
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInformacion_taxonomica.query2', query, variables);

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
          `query registrosConnection($pagination: paginationCursorInput!) {
                 registrosConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "registrosConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["registrosConnection"]
        || typeof response.data.data["registrosConnection"] !== 'object'
        || !Array.isArray(response.data.data["registrosConnection"].edges)
        || typeof response.data.data["registrosConnection"].pageInfo !== 'object' 
        || response.data.data["registrosConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["registrosConnection"];
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

