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
   * Get assayResulttable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateAssayResult}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateAssayResult");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateAssayResult"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateAssayResult"];
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
   * Get assayResultsitems count from GraphQL Server.
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
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countAssayResults($search: searchAssayResultInput) { 
             countAssayResults( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countAssayResults");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countAssayResults"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countAssayResults"];
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
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `assayResult_id,
       unit,
       value_as_str,
       value_as_int,
       value_as_num,
       value_as_bool,
       value_as_float,
       assay_id,
       material_id,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `query assayResultsConnection($order: [orderAssayResultInput], $search: searchAssayResultInput, $pagination: paginationCursorInput!) { 
             assayResultsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "assayResultsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["assayResultsConnection"]
      || typeof response.data.data["assayResultsConnection"] !== 'object'
      || !Array.isArray(response.data.data["assayResultsConnection"].edges)
      || typeof response.data.data["assayResultsConnection"].pageInfo !== 'object' 
      || response.data.data["assayResultsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["assayResultsConnection"];
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
   * Add new AssayResult item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new AssayResult item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $assayResult_id:ID!,
          $unit:String,
          $value_as_str:String,
          $value_as_int:Int,
          $value_as_num:Float,
          $value_as_bool:Boolean,
          $value_as_float:Float,
          $addAssay: ID,
          $addObservedMaterial: ID,
          $addFileAttachments: [ID],
          $addOntologyAnnotations: [ID],
`;

    //set parameters assignation
    let qparameters = `
            assayResult_id:$assayResult_id,
            unit:$unit,
            value_as_str:$value_as_str,
            value_as_int:$value_as_int,
            value_as_num:$value_as_num,
            value_as_bool:$value_as_bool,
            value_as_float:$value_as_float,
            addAssay: $addAssay,
            addObservedMaterial: $addObservedMaterial,
            addFileAttachments: $addFileAttachments,
            addOntologyAnnotations: $addOntologyAnnotations,
`;

    //set attributes to fetch
    let qattributes = 
      `assayResult_id,
       unit,
       value_as_str,
       value_as_int,
       value_as_num,
       value_as_bool,
       value_as_float,
       assay_id,
       material_id,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `mutation addAssayResult(
          ${qvariables}
          ) { addAssayResult(
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
    let check = checkResponse(response, graphqlErrors, "addAssayResult");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addAssayResult"]
        || typeof response.data.data["addAssayResult"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addAssayResult"];
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
   * Update AssayResult item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given AssayResult item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $assayResult_id:ID!,
          $unit:String,
          $value_as_str:String,
          $value_as_int:Int,
          $value_as_num:Float,
          $value_as_bool:Boolean,
          $value_as_float:Float,
          $addAssay: ID,
          $removeAssay: ID,
          $addObservedMaterial: ID,
          $removeObservedMaterial: ID,
          $addFileAttachments: [ID],
          $removeFileAttachments: [ID],
          $addOntologyAnnotations: [ID],
          $removeOntologyAnnotations: [ID],
`;

    //set parameters assignation
    let qparameters = `
            assayResult_id:$assayResult_id,
            unit: $unit,
            value_as_str: $value_as_str,
            value_as_int: $value_as_int,
            value_as_num: $value_as_num,
            value_as_bool: $value_as_bool,
            value_as_float: $value_as_float,
            addAssay: $addAssay,
            removeAssay: $removeAssay,
            addObservedMaterial: $addObservedMaterial,
            removeObservedMaterial: $removeObservedMaterial,
            addFileAttachments: $addFileAttachments,
            removeFileAttachments: $removeFileAttachments,
            addOntologyAnnotations: $addOntologyAnnotations,
            removeOntologyAnnotations: $removeOntologyAnnotations,
`;

    //set attributes to fetch
    let qattributes = 
      `assayResult_id,
       unit,
       value_as_str,
       value_as_int,
       value_as_num,
       value_as_bool,
       value_as_float,
       assay_id,
       material_id,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `mutation updateAssayResult(
          ${qvariables}
          ) { updateAssayResult(
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
    let check = checkResponse(response, graphqlErrors, "updateAssayResult");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateAssayResult"]
        || typeof response.data.data["updateAssayResult"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateAssayResult"];
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
   * @param {Object} variables Object with values needed to delete the AssayResult item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteAssayResult(
              $assayResult_id:ID!
        ) { deleteAssayResult(
              assayResult_id:$assayResult_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteAssayResult");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteAssayResult"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteAssayResult"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAssay   *
   * Get assays records associated to the given assayResult record
   * through association 'Assay', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getAssay(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `assay_id,
     measurement,
     technology,
     platform,
     method,
     study_id,
     factor_ids,
     material_ids,
     ontologyAnnotation_ids,
     fileAttachment_ids,
`;

    variables = { "assayResult_id": itemId };
    //set query
    let query = 
      `query readOneAssayResult($assayResult_id:ID!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                assay{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAssay', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["assay"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["assay"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedAssayCount
   *
   * Get count of not associated Assay from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedAssayCount(url, itemId, searchText, ops) {
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
    let variables = {"assayResult_id": itemId};
    let query = 
      `query readOneAssayResult($assayResult_id:ID!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                assay{
                  assay_id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssayCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["assay"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["assay"];
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
    let s = getSearchArgument('assay', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "assay_id", valueType: "String", value: associatedItem["assay_id"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countAssays($search: searchAssayInput) {
             countAssays(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssayCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countAssays");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countAssays"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countAssays"];
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
 * getNotAssociatedAssay
 *
 * Get not associated Assay items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedAssay(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `assay_id,
     measurement,
     technology,
     platform,
     method,
     study_id,
     factor_ids,
     material_ids,
     ontologyAnnotation_ids,
     fileAttachment_ids,
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
      `{  readOneAssayResult(assayResult_id: "${itemId}") {
            assay{
              assay_id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssay.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["assay"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["assay"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "assay_id", valueType: "String", value: associatedItem["assay_id"], operator: "ne"};

    //search
    let s = getSearchArgument('assay', searchText, ops, 'object');
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
      `query assaysConnection($search: searchAssayInput, $pagination: paginationCursorInput!) {
             assaysConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssay.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "assaysConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["assaysConnection"]
      || typeof response.data.data["assaysConnection"] !== 'object'
      || !Array.isArray(response.data.data["assaysConnection"].edges)
      || typeof response.data.data["assaysConnection"].pageInfo !== 'object' 
      || response.data.data["assaysConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["assaysConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getFileAttachments   *
   * Get fileAttachments records associated to the given assayResult record
   * through association 'FileAttachments', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getFileAttachments(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `fileAttachment_id,
     fileName,
     mimeType,
     fileSizeKb,
     fileURL,
     isImage,
     smallThumbnailURL,
     bigThumbnailURL,
     investigation_ids,
     study_ids,
     assay_ids,
     assayResult_ids,
     factor_ids,
     material_ids,
     protocol_ids,
`;

    variables["assayResult_id"] = itemId;
    //set search
    let s = getSearchArgument('fileAttachment', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneAssayResult($assayResult_id:ID!, $search: searchFileAttachmentInput, $pagination: paginationCursorInput!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                fileAttachmentsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getFileAttachments', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || !response.data.data["readOneAssayResult"]["fileAttachmentsConnection"]
      || typeof response.data.data["readOneAssayResult"]["fileAttachmentsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneAssayResult"]["fileAttachmentsConnection"].edges)
      || typeof response.data.data["readOneAssayResult"]["fileAttachmentsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneAssayResult"]["fileAttachmentsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneAssayResult"]["fileAttachmentsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getFileAttachmentsCount
   * 
   * Get fileAttachments records count associated to the given assayResult record
   * through association 'FileAttachments', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getFileAttachmentsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"assayResult_id": itemId};
    //search
    let s = getSearchArgument('fileAttachment', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneAssayResult($assayResult_id:ID!, $search: searchFileAttachmentInput) { 
             readOneAssayResult(assayResult_id:$assayResult_id) {
              countFilteredFileAttachments(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getFileAttachmentsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || !Number.isInteger(response.data.data["readOneAssayResult"]["countFilteredFileAttachments"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneAssayResult"]["countFilteredFileAttachments"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedFileAttachmentsCount
   *
   * Get count of not associated FileAttachments from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedFileAttachmentsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('fileAttachment', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "assayResult_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "assayResult_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countFileAttachments($search: searchFileAttachmentInput) {
          countFileAttachments(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedFileAttachmentsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countFileAttachments");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countFileAttachments"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countFileAttachments"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedFileAttachments
 *
 * Get not associated FileAttachments items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedFileAttachments(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `fileAttachment_id,
     fileName,
     mimeType,
     fileSizeKb,
     fileURL,
     isImage,
     smallThumbnailURL,
     bigThumbnailURL,
     investigation_ids,
     study_ids,
     assay_ids,
     assayResult_ids,
     factor_ids,
     material_ids,
     protocol_ids,
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
  let s = getSearchArgument('fileAttachment', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "assayResult_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "assayResult_ids", valueType: "String", value: null, operator: "eq"};
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
    `query fileAttachmentsConnection($search: searchFileAttachmentInput, $pagination: paginationCursorInput!) {
           fileAttachmentsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedFileAttachments', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "fileAttachmentsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["fileAttachmentsConnection"]
    || typeof response.data.data["fileAttachmentsConnection"] !== 'object'
    || !Array.isArray(response.data.data["fileAttachmentsConnection"].edges)
    || typeof response.data.data["fileAttachmentsConnection"].pageInfo !== 'object' 
    || response.data.data["fileAttachmentsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["fileAttachmentsConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getObservedMaterial   *
   * Get materials records associated to the given assayResult record
   * through association 'ObservedMaterial', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getObservedMaterial(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `material_id,
     name,
     description,
     type,
     study_ids,
     assay_ids,
     ontologyAnnotation_ids,
     sourceSet_ids,
     element_ids,
     fileAttachment_ids,
`;

    variables = { "assayResult_id": itemId };
    //set query
    let query = 
      `query readOneAssayResult($assayResult_id:ID!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                observedMaterial{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getObservedMaterial', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["observedMaterial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["observedMaterial"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedObservedMaterialCount
   *
   * Get count of not associated ObservedMaterial from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedObservedMaterialCount(url, itemId, searchText, ops) {
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
    let variables = {"assayResult_id": itemId};
    let query = 
      `query readOneAssayResult($assayResult_id:ID!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                observedMaterial{
                  material_id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservedMaterialCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["observedMaterial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["observedMaterial"];
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
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "material_id", valueType: "String", value: associatedItem["material_id"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countMaterials($search: searchMaterialInput) {
             countMaterials(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservedMaterialCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countMaterials");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countMaterials"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countMaterials"];
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
 * getNotAssociatedObservedMaterial
 *
 * Get not associated ObservedMaterial items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedObservedMaterial(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `material_id,
     name,
     description,
     type,
     study_ids,
     assay_ids,
     ontologyAnnotation_ids,
     sourceSet_ids,
     element_ids,
     fileAttachment_ids,
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
      `{  readOneAssayResult(assayResult_id: "${itemId}") {
            observedMaterial{
              material_id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservedMaterial.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || typeof response.data.data["readOneAssayResult"]["observedMaterial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneAssayResult"]["observedMaterial"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "material_id", valueType: "String", value: associatedItem["material_id"], operator: "ne"};

    //search
    let s = getSearchArgument('material', searchText, ops, 'object');
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
      `query materialsConnection($search: searchMaterialInput, $pagination: paginationCursorInput!) {
             materialsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservedMaterial.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "materialsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["materialsConnection"]
      || typeof response.data.data["materialsConnection"] !== 'object'
      || !Array.isArray(response.data.data["materialsConnection"].edges)
      || typeof response.data.data["materialsConnection"].pageInfo !== 'object' 
      || response.data.data["materialsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["materialsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getOntologyAnnotations   *
   * Get ontologyAnnotations records associated to the given assayResult record
   * through association 'OntologyAnnotations', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getOntologyAnnotations(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `ontologyAnnotation_id,
     ontology,
     ontologyURL,
     term,
     termURL,
     investigation_ids,
     study_ids,
     assay_ids,
     assayResult_ids,
     factor_ids,
     material_ids,
     protocol_ids,
     contact_ids,
`;

    variables["assayResult_id"] = itemId;
    //set search
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneAssayResult($assayResult_id:ID!, $search: searchOntologyAnnotationInput, $pagination: paginationCursorInput!) {
             readOneAssayResult(assayResult_id:$assayResult_id) {
                ontologyAnnotationsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getOntologyAnnotations', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || !response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"]
      || typeof response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"].edges)
      || typeof response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneAssayResult"]["ontologyAnnotationsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getOntologyAnnotationsCount
   * 
   * Get ontologyAnnotations records count associated to the given assayResult record
   * through association 'OntologyAnnotations', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getOntologyAnnotationsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"assayResult_id": itemId};
    //search
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneAssayResult($assayResult_id:ID!, $search: searchOntologyAnnotationInput) { 
             readOneAssayResult(assayResult_id:$assayResult_id) {
              countFilteredOntologyAnnotations(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getOntologyAnnotationsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneAssayResult");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneAssayResult"]
      || typeof response.data.data["readOneAssayResult"] !== 'object'
      || !Number.isInteger(response.data.data["readOneAssayResult"]["countFilteredOntologyAnnotations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneAssayResult"]["countFilteredOntologyAnnotations"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedOntologyAnnotationsCount
   *
   * Get count of not associated OntologyAnnotations from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedOntologyAnnotationsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "assayResult_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "assayResult_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countOntologyAnnotations($search: searchOntologyAnnotationInput) {
          countOntologyAnnotations(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyAnnotationsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countOntologyAnnotations");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countOntologyAnnotations"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countOntologyAnnotations"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedOntologyAnnotations
 *
 * Get not associated OntologyAnnotations items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedOntologyAnnotations(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `ontologyAnnotation_id,
     ontology,
     ontologyURL,
     term,
     termURL,
     investigation_ids,
     study_ids,
     assay_ids,
     assayResult_ids,
     factor_ids,
     material_ids,
     protocol_ids,
     contact_ids,
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
  let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "assayResult_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "assayResult_ids", valueType: "String", value: null, operator: "eq"};
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
    `query ontologyAnnotationsConnection($search: searchOntologyAnnotationInput, $pagination: paginationCursorInput!) {
           ontologyAnnotationsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyAnnotations', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "ontologyAnnotationsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["ontologyAnnotationsConnection"]
    || typeof response.data.data["ontologyAnnotationsConnection"] !== 'object'
    || !Array.isArray(response.data.data["ontologyAnnotationsConnection"].edges)
    || typeof response.data.data["ontologyAnnotationsConnection"].pageInfo !== 'object' 
    || response.data.data["ontologyAnnotationsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["ontologyAnnotationsConnection"];
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
          `query assayResultsConnection($pagination: paginationCursorInput!) {
                 assayResultsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "assayResultsConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["assayResultsConnection"]
        || typeof response.data.data["assayResultsConnection"] !== 'object'
        || !Array.isArray(response.data.data["assayResultsConnection"].edges)
        || typeof response.data.data["assayResultsConnection"].pageInfo !== 'object' 
        || response.data.data["assayResultsConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["assayResultsConnection"];
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

