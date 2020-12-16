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
   * Get observationVariabletable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateObservationVariable}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateObservationVariable");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateObservationVariable"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateObservationVariable"];
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
   * Get observationVariablesitems count from GraphQL Server.
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
    let s = getSearchArgument('observationVariable', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countObservationVariables($search: searchObservationVariableInput) { 
             countObservationVariables( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countObservationVariables");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countObservationVariables"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countObservationVariables"];
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
    let s = getSearchArgument('observationVariable', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `observationVariableDbId,
       commonCropName,
       defaultValue,
       documentationURL,
       growthStage,
       institution,
       language,
       scientist,
       status,
       submissionTimestamp,
       xref,
       observationVariableName,
       methodDbId,
       scaleDbId,
       traitDbId,
       ontologyDbId,
`;

    //query
    let query =
      `query observationVariablesConnection($order: [orderObservationVariableInput], $search: searchObservationVariableInput, $pagination: paginationCursorInput!) { 
             observationVariablesConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "observationVariablesConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["observationVariablesConnection"]
      || typeof response.data.data["observationVariablesConnection"] !== 'object'
      || !Array.isArray(response.data.data["observationVariablesConnection"].edges)
      || typeof response.data.data["observationVariablesConnection"].pageInfo !== 'object' 
      || response.data.data["observationVariablesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["observationVariablesConnection"];
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
   * Add new ObservationVariable item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new ObservationVariable item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $observationVariableDbId:ID!,
          $commonCropName:String,
          $defaultValue:String,
          $documentationURL:String,
          $growthStage:String,
          $institution:String,
          $language:String,
          $scientist:String,
          $status:String,
          $submissionTimestamp:DateTime,
          $xref:String,
          $observationVariableName:String,
          $addMethod: ID,
          $addOntologyReference: ID,
          $addScale: ID,
          $addTrait: ID,
          $addObservations: [ID],
`;

    //set parameters assignation
    let qparameters = `
            observationVariableDbId:$observationVariableDbId,
            commonCropName:$commonCropName,
            defaultValue:$defaultValue,
            documentationURL:$documentationURL,
            growthStage:$growthStage,
            institution:$institution,
            language:$language,
            scientist:$scientist,
            status:$status,
            submissionTimestamp:$submissionTimestamp,
            xref:$xref,
            observationVariableName:$observationVariableName,
            addMethod: $addMethod,
            addOntologyReference: $addOntologyReference,
            addScale: $addScale,
            addTrait: $addTrait,
            addObservations: $addObservations,
`;

    //set attributes to fetch
    let qattributes = 
      `observationVariableDbId,
       commonCropName,
       defaultValue,
       documentationURL,
       growthStage,
       institution,
       language,
       scientist,
       status,
       submissionTimestamp,
       xref,
       observationVariableName,
       methodDbId,
       scaleDbId,
       traitDbId,
       ontologyDbId,
`;

    //query
    let query =
      `mutation addObservationVariable(
          ${qvariables}
          ) { addObservationVariable(
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
    let check = checkResponse(response, graphqlErrors, "addObservationVariable");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addObservationVariable"]
        || typeof response.data.data["addObservationVariable"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addObservationVariable"];
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
   * Update ObservationVariable item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given ObservationVariable item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $observationVariableDbId:ID!,
          $commonCropName:String,
          $defaultValue:String,
          $documentationURL:String,
          $growthStage:String,
          $institution:String,
          $language:String,
          $scientist:String,
          $status:String,
          $submissionTimestamp:DateTime,
          $xref:String,
          $observationVariableName:String,
          $addMethod: ID,
          $removeMethod: ID,
          $addOntologyReference: ID,
          $removeOntologyReference: ID,
          $addScale: ID,
          $removeScale: ID,
          $addTrait: ID,
          $removeTrait: ID,
          $addObservations: [ID],
          $removeObservations: [ID],
`;

    //set parameters assignation
    let qparameters = `
            observationVariableDbId:$observationVariableDbId,
            commonCropName: $commonCropName,
            defaultValue: $defaultValue,
            documentationURL: $documentationURL,
            growthStage: $growthStage,
            institution: $institution,
            language: $language,
            scientist: $scientist,
            status: $status,
            submissionTimestamp: $submissionTimestamp,
            xref: $xref,
            observationVariableName: $observationVariableName,
            addMethod: $addMethod,
            removeMethod: $removeMethod,
            addOntologyReference: $addOntologyReference,
            removeOntologyReference: $removeOntologyReference,
            addScale: $addScale,
            removeScale: $removeScale,
            addTrait: $addTrait,
            removeTrait: $removeTrait,
            addObservations: $addObservations,
            removeObservations: $removeObservations,
`;

    //set attributes to fetch
    let qattributes = 
      `observationVariableDbId,
       commonCropName,
       defaultValue,
       documentationURL,
       growthStage,
       institution,
       language,
       scientist,
       status,
       submissionTimestamp,
       xref,
       observationVariableName,
       methodDbId,
       scaleDbId,
       traitDbId,
       ontologyDbId,
`;

    //query
    let query =
      `mutation updateObservationVariable(
          ${qvariables}
          ) { updateObservationVariable(
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
    let check = checkResponse(response, graphqlErrors, "updateObservationVariable");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateObservationVariable"]
        || typeof response.data.data["updateObservationVariable"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateObservationVariable"];
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
   * @param {Object} variables Object with values needed to delete the ObservationVariable item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteObservationVariable(
              $observationVariableDbId:ID!
        ) { deleteObservationVariable(
              observationVariableDbId:$observationVariableDbId        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteObservationVariable");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteObservationVariable"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteObservationVariable"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getMethod   *
   * Get methods records associated to the given observationVariable record
   * through association 'Method', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getMethod(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `methodDbId,
     description,
     formula,
     methodClass,
     methodName,
     reference,
     ontologyDbId,
`;

    variables = { "observationVariableDbId": itemId };
    //set query
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                method{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getMethod', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["method"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["method"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedMethodCount
   *
   * Get count of not associated Method from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedMethodCount(url, itemId, searchText, ops) {
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
    let variables = {"observationVariableDbId": itemId};
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                method{
                  methodDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMethodCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["method"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["method"];
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
    let s = getSearchArgument('method', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "methodDbId", valueType: "String", value: associatedItem["methodDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countMethods($search: searchMethodInput) {
             countMethods(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMethodCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countMethods");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countMethods"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countMethods"];
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
 * getNotAssociatedMethod
 *
 * Get not associated Method items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedMethod(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `methodDbId,
     description,
     formula,
     methodClass,
     methodName,
     reference,
     ontologyDbId,
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
      `{  readOneObservationVariable(observationVariableDbId: "${itemId}") {
            method{
              methodDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMethod.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["method"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["method"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "methodDbId", valueType: "String", value: associatedItem["methodDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('method', searchText, ops, 'object');
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
      `query methodsConnection($search: searchMethodInput, $pagination: paginationCursorInput!) {
             methodsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMethod.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "methodsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["methodsConnection"]
      || typeof response.data.data["methodsConnection"] !== 'object'
      || !Array.isArray(response.data.data["methodsConnection"].edges)
      || typeof response.data.data["methodsConnection"].pageInfo !== 'object' 
      || response.data.data["methodsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["methodsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getObservations   *
   * Get observations records associated to the given observationVariable record
   * through association 'Observations', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getObservations(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `observationDbId,
     collector,
     germplasmDbId,
     observationTimeStamp,
     observationUnitDbId,
     observationVariableDbId,
     studyDbId,
     uploadedBy,
     value,
     seasonDbId,
     imageDbId,
`;

    variables["observationVariableDbId"] = itemId;
    //set search
    let s = getSearchArgument('observation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneObservationVariable($observationVariableDbId:ID!, $search: searchObservationInput, $pagination: paginationCursorInput!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                observationsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getObservations', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || !response.data.data["readOneObservationVariable"]["observationsConnection"]
      || typeof response.data.data["readOneObservationVariable"]["observationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneObservationVariable"]["observationsConnection"].edges)
      || typeof response.data.data["readOneObservationVariable"]["observationsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneObservationVariable"]["observationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneObservationVariable"]["observationsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getObservationsCount
   * 
   * Get observations records count associated to the given observationVariable record
   * through association 'Observations', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getObservationsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"observationVariableDbId": itemId};
    //search
    let s = getSearchArgument('observation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneObservationVariable($observationVariableDbId:ID!, $search: searchObservationInput) { 
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
              countFilteredObservations(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getObservationsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || !Number.isInteger(response.data.data["readOneObservationVariable"]["countFilteredObservations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneObservationVariable"]["countFilteredObservations"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedObservationsCount
   *
   * Get count of not associated Observations from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedObservationsCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('observation', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "observationVariableDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "observationVariableDbId", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countObservations($search: searchObservationInput) {
            countObservations(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservationsCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countObservations");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countObservations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countObservations"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedObservations
 *
 * Get not associated Observations items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedObservations(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `observationDbId,
     collector,
     germplasmDbId,
     observationTimeStamp,
     observationUnitDbId,
     observationVariableDbId,
     studyDbId,
     uploadedBy,
     value,
     seasonDbId,
     imageDbId,
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
    let s = getSearchArgument('observation', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "observationVariableDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "observationVariableDbId", valueType: "String", value: null, operator: "eq"};
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
      `query observationsConnection($search: searchObservationInput, $pagination: paginationCursorInput!) {
             observationsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservations', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "observationsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["observationsConnection"]
      || typeof response.data.data["observationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["observationsConnection"].edges)
      || typeof response.data.data["observationsConnection"].pageInfo !== 'object' 
      || response.data.data["observationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["observationsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getOntologyReference   *
   * Get ontologyReferences records associated to the given observationVariable record
   * through association 'OntologyReference', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getOntologyReference(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `ontologyDbId,
     documentationURL,
     ontologyName,
     version,
`;

    variables = { "observationVariableDbId": itemId };
    //set query
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                ontologyReference{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getOntologyReference', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["ontologyReference"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["ontologyReference"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedOntologyReferenceCount
   *
   * Get count of not associated OntologyReference from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedOntologyReferenceCount(url, itemId, searchText, ops) {
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
    let variables = {"observationVariableDbId": itemId};
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                ontologyReference{
                  ontologyDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyReferenceCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["ontologyReference"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["ontologyReference"];
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
    let s = getSearchArgument('ontologyReference', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "ontologyDbId", valueType: "String", value: associatedItem["ontologyDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countOntologyReferences($search: searchOntologyReferenceInput) {
             countOntologyReferences(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyReferenceCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countOntologyReferences");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countOntologyReferences"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countOntologyReferences"];
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
 * getNotAssociatedOntologyReference
 *
 * Get not associated OntologyReference items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedOntologyReference(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `ontologyDbId,
     documentationURL,
     ontologyName,
     version,
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
      `{  readOneObservationVariable(observationVariableDbId: "${itemId}") {
            ontologyReference{
              ontologyDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyReference.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["ontologyReference"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["ontologyReference"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "ontologyDbId", valueType: "String", value: associatedItem["ontologyDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('ontologyReference', searchText, ops, 'object');
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
      `query ontologyReferencesConnection($search: searchOntologyReferenceInput, $pagination: paginationCursorInput!) {
             ontologyReferencesConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyReference.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "ontologyReferencesConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["ontologyReferencesConnection"]
      || typeof response.data.data["ontologyReferencesConnection"] !== 'object'
      || !Array.isArray(response.data.data["ontologyReferencesConnection"].edges)
      || typeof response.data.data["ontologyReferencesConnection"].pageInfo !== 'object' 
      || response.data.data["ontologyReferencesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["ontologyReferencesConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getScale   *
   * Get scales records associated to the given observationVariable record
   * through association 'Scale', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getScale(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `scaleDbId,
     decimalPlaces,
     scaleName,
     xref,
     ontologyDbId,
`;

    variables = { "observationVariableDbId": itemId };
    //set query
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                scale{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getScale', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["scale"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["scale"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedScaleCount
   *
   * Get count of not associated Scale from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedScaleCount(url, itemId, searchText, ops) {
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
    let variables = {"observationVariableDbId": itemId};
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                scale{
                  scaleDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedScaleCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["scale"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["scale"];
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
    let s = getSearchArgument('scale', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "scaleDbId", valueType: "String", value: associatedItem["scaleDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countScales($search: searchScaleInput) {
             countScales(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedScaleCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countScales");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countScales"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countScales"];
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
 * getNotAssociatedScale
 *
 * Get not associated Scale items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedScale(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `scaleDbId,
     decimalPlaces,
     scaleName,
     xref,
     ontologyDbId,
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
      `{  readOneObservationVariable(observationVariableDbId: "${itemId}") {
            scale{
              scaleDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedScale.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["scale"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["scale"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "scaleDbId", valueType: "String", value: associatedItem["scaleDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('scale', searchText, ops, 'object');
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
      `query scalesConnection($search: searchScaleInput, $pagination: paginationCursorInput!) {
             scalesConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedScale.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "scalesConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["scalesConnection"]
      || typeof response.data.data["scalesConnection"] !== 'object'
      || !Array.isArray(response.data.data["scalesConnection"].edges)
      || typeof response.data.data["scalesConnection"].pageInfo !== 'object' 
      || response.data.data["scalesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["scalesConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getTrait   *
   * Get traits records associated to the given observationVariable record
   * through association 'Trait', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getTrait(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `traitDbId,
     attribute,
     entity,
     mainAbbreviation,
     status,
     traitClass,
     traitDescription,
     traitName,
     xref,
     ontologyDbId,
`;

    variables = { "observationVariableDbId": itemId };
    //set query
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                trait{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getTrait', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["trait"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["trait"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedTraitCount
   *
   * Get count of not associated Trait from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedTraitCount(url, itemId, searchText, ops) {
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
    let variables = {"observationVariableDbId": itemId};
    let query = 
      `query readOneObservationVariable($observationVariableDbId:ID!) {
             readOneObservationVariable(observationVariableDbId:$observationVariableDbId) {
                trait{
                  traitDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTraitCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["trait"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["trait"];
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
    let s = getSearchArgument('trait', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "traitDbId", valueType: "String", value: associatedItem["traitDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countTraits($search: searchTraitInput) {
             countTraits(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTraitCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countTraits");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countTraits"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countTraits"];
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
 * getNotAssociatedTrait
 *
 * Get not associated Trait items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedTrait(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `traitDbId,
     attribute,
     entity,
     mainAbbreviation,
     status,
     traitClass,
     traitDescription,
     traitName,
     xref,
     ontologyDbId,
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
      `{  readOneObservationVariable(observationVariableDbId: "${itemId}") {
            trait{
              traitDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrait.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneObservationVariable");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneObservationVariable"]
      || typeof response.data.data["readOneObservationVariable"] !== 'object'
      || typeof response.data.data["readOneObservationVariable"]["trait"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneObservationVariable"]["trait"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "traitDbId", valueType: "String", value: associatedItem["traitDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('trait', searchText, ops, 'object');
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
      `query traitsConnection($search: searchTraitInput, $pagination: paginationCursorInput!) {
             traitsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrait.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "traitsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["traitsConnection"]
      || typeof response.data.data["traitsConnection"] !== 'object'
      || !Array.isArray(response.data.data["traitsConnection"].edges)
      || typeof response.data.data["traitsConnection"].pageInfo !== 'object' 
      || response.data.data["traitsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["traitsConnection"];
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
          `query observationVariablesConnection($pagination: paginationCursorInput!) {
                 observationVariablesConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "observationVariablesConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["observationVariablesConnection"]
        || typeof response.data.data["observationVariablesConnection"] !== 'object'
        || !Array.isArray(response.data.data["observationVariablesConnection"].edges)
        || typeof response.data.data["observationVariablesConnection"].pageInfo !== 'object' 
        || response.data.data["observationVariablesConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["observationVariablesConnection"];
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

