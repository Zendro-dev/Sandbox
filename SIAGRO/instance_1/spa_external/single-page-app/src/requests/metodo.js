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
   * Get metodotable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateMetodo}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateMetodo");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateMetodo"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateMetodo"];
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
   * Get metodositems count from GraphQL Server.
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
    let s = getSearchArgument('metodo', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countMetodos($search: searchMetodoInput) { 
             countMetodos( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countMetodos");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countMetodos"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countMetodos"];
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
    let s = getSearchArgument('metodo', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `id,
       descripcion,
       referencias,
       link_referencias,
`;

    //query
    let query =
      `query metodosConnection($order: [orderMetodoInput], $search: searchMetodoInput, $pagination: paginationCursorInput!) { 
             metodosConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "metodosConnection");
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Metodo item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Metodo item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $descripcion:String,
          $referencias:[String],
          $link_referencias:[String],
          $addCaracteristicas_cualitativas: [ID],
          $addCaracteristicas_cuantitativas: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            descripcion:$descripcion,
            referencias:$referencias,
            link_referencias:$link_referencias,
            addCaracteristicas_cualitativas: $addCaracteristicas_cualitativas,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       descripcion,
       referencias,
       link_referencias,
`;

    //query
    let query =
      `mutation addMetodo(
          ${qvariables}
          ) { addMetodo(
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
    let check = checkResponse(response, graphqlErrors, "addMetodo");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addMetodo"]
        || typeof response.data.data["addMetodo"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addMetodo"];
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
   * Update Metodo item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Metodo item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $descripcion:String,
          $referencias:[String],
          $link_referencias:[String],
          $addCaracteristicas_cualitativas: [ID],
          $removeCaracteristicas_cualitativas: [ID],
          $addCaracteristicas_cuantitativas: [ID],
          $removeCaracteristicas_cuantitativas: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            descripcion: $descripcion,
            referencias: $referencias,
            link_referencias: $link_referencias,
            addCaracteristicas_cualitativas: $addCaracteristicas_cualitativas,
            removeCaracteristicas_cualitativas: $removeCaracteristicas_cualitativas,
            addCaracteristicas_cuantitativas: $addCaracteristicas_cuantitativas,
            removeCaracteristicas_cuantitativas: $removeCaracteristicas_cuantitativas,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       descripcion,
       referencias,
       link_referencias,
`;

    //query
    let query =
      `mutation updateMetodo(
          ${qvariables}
          ) { updateMetodo(
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
    let check = checkResponse(response, graphqlErrors, "updateMetodo");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateMetodo"]
        || typeof response.data.data["updateMetodo"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateMetodo"];
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
   * @param {Object} variables Object with values needed to delete the Metodo item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteMetodo(
              $id:ID!
        ) { deleteMetodo(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteMetodo");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteMetodo"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteMetodo"];
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
   * Get caracteristica_cualitativas records associated to the given metodo record
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
      `query readOneMetodo($id:ID!, $search: searchCaracteristica_cualitativaInput, $pagination: paginationCursorInput!) {
             readOneMetodo(id:$id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMetodo");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMetodo"]
      || typeof response.data.data["readOneMetodo"] !== 'object'
      || !response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"]
      || typeof response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"].edges)
      || typeof response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMetodo"]["caracteristicas_cualitativasConnection"];
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
   * Get caracteristica_cualitativas records count associated to the given metodo record
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
      `query readOneMetodo($id:ID!, $search: searchCaracteristica_cualitativaInput) { 
             readOneMetodo(id:$id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMetodo");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMetodo"]
      || typeof response.data.data["readOneMetodo"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMetodo"]["countFilteredCaracteristicas_cualitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMetodo"]["countFilteredCaracteristicas_cualitativas"];
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
    let f1 = {field: "metodo_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "metodo_id", valueType: "String", value: null, operator: "eq"};
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
    let f1 = {field: "metodo_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "metodo_id", valueType: "String", value: null, operator: "eq"};
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
   * Get caracteristica_cuantitativas records associated to the given metodo record
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
      `query readOneMetodo($id:ID!, $search: searchCaracteristica_cuantitativaInput, $pagination: paginationCursorInput!) {
             readOneMetodo(id:$id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMetodo");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMetodo"]
      || typeof response.data.data["readOneMetodo"] !== 'object'
      || !response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"]
      || typeof response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"].edges)
      || typeof response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMetodo"]["caracteristicas_cuantitativasConnection"];
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
   * Get caracteristica_cuantitativas records count associated to the given metodo record
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
      `query readOneMetodo($id:ID!, $search: searchCaracteristica_cuantitativaInput) { 
             readOneMetodo(id:$id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMetodo");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMetodo"]
      || typeof response.data.data["readOneMetodo"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMetodo"]["countFilteredCaracteristicas_cuantitativas"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMetodo"]["countFilteredCaracteristicas_cuantitativas"];
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
    let f1 = {field: "metodo_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "metodo_id", valueType: "String", value: null, operator: "eq"};
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
    let f1 = {field: "metodo_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "metodo_id", valueType: "String", value: null, operator: "eq"};
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
          `query metodosConnection($pagination: paginationCursorInput!) {
                 metodosConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "metodosConnection");
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

