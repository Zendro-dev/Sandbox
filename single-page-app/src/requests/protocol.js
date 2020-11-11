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
   * Get protocoltable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateProtocol}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateProtocol");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateProtocol"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateProtocol"];
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
   * Get protocolsitems count from GraphQL Server.
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
    let s = getSearchArgument('protocol', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countProtocols($search: searchProtocolInput) { 
             countProtocols( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countProtocols");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countProtocols"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countProtocols"];
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
    let s = getSearchArgument('protocol', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `protocol_id,
       name,
       description,
       type,
       study_ids,
       assay_ids,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `query protocolsConnection($order: [orderProtocolInput], $search: searchProtocolInput, $pagination: paginationCursorInput!) { 
             protocolsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "protocolsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["protocolsConnection"]
      || typeof response.data.data["protocolsConnection"] !== 'object'
      || !Array.isArray(response.data.data["protocolsConnection"].edges)
      || typeof response.data.data["protocolsConnection"].pageInfo !== 'object' 
      || response.data.data["protocolsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["protocolsConnection"];
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
   * Add new Protocol item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Protocol item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $protocol_id:ID!,
          $name:String,
          $description:String,
          $type:Date,
          $addAssays: [ID],
          $addFileAttachments: [ID],
          $addOntologyAnnotation: [ID],
          $addStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            protocol_id:$protocol_id,
            name:$name,
            description:$description,
            type:$type,
            addAssays: $addAssays,
            addFileAttachments: $addFileAttachments,
            addOntologyAnnotation: $addOntologyAnnotation,
            addStudies: $addStudies,
`;

    //set attributes to fetch
    let qattributes = 
      `protocol_id,
       name,
       description,
       type,
       study_ids,
       assay_ids,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `mutation addProtocol(
          ${qvariables}
          ) { addProtocol(
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
    let check = checkResponse(response, graphqlErrors, "addProtocol");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addProtocol"]
        || typeof response.data.data["addProtocol"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addProtocol"];
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
   * Update Protocol item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Protocol item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $protocol_id:ID!,
          $name:String,
          $description:String,
          $type:Date,
          $addAssays: [ID],
          $removeAssays: [ID],
          $addFileAttachments: [ID],
          $removeFileAttachments: [ID],
          $addOntologyAnnotation: [ID],
          $removeOntologyAnnotation: [ID],
          $addStudies: [ID],
          $removeStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            protocol_id:$protocol_id,
            name: $name,
            description: $description,
            type: $type,
            addAssays: $addAssays,
            removeAssays: $removeAssays,
            addFileAttachments: $addFileAttachments,
            removeFileAttachments: $removeFileAttachments,
            addOntologyAnnotation: $addOntologyAnnotation,
            removeOntologyAnnotation: $removeOntologyAnnotation,
            addStudies: $addStudies,
            removeStudies: $removeStudies,
`;

    //set attributes to fetch
    let qattributes = 
      `protocol_id,
       name,
       description,
       type,
       study_ids,
       assay_ids,
       ontologyAnnotation_ids,
       fileAttachment_ids,
`;

    //query
    let query =
      `mutation updateProtocol(
          ${qvariables}
          ) { updateProtocol(
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
    let check = checkResponse(response, graphqlErrors, "updateProtocol");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateProtocol"]
        || typeof response.data.data["updateProtocol"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateProtocol"];
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
   * @param {Object} variables Object with values needed to delete the Protocol item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteProtocol(
              $protocol_id:ID!
        ) { deleteProtocol(
              protocol_id:$protocol_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteProtocol");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteProtocol"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteProtocol"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAssays   *
   * Get assays records associated to the given protocol record
   * through association 'Assays', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getAssays(url, itemId, searchText, variables, ops) {
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

    variables["protocol_id"] = itemId;
    //set search
    let s = getSearchArgument('assay', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchAssayInput, $pagination: paginationCursorInput!) {
             readOneProtocol(protocol_id:$protocol_id) {
                assaysConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAssays', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !response.data.data["readOneProtocol"]["assaysConnection"]
      || typeof response.data.data["readOneProtocol"]["assaysConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneProtocol"]["assaysConnection"].edges)
      || typeof response.data.data["readOneProtocol"]["assaysConnection"].pageInfo !== 'object' 
      || response.data.data["readOneProtocol"]["assaysConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneProtocol"]["assaysConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAssaysCount
   * 
   * Get assays records count associated to the given protocol record
   * through association 'Assays', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getAssaysCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"protocol_id": itemId};
    //search
    let s = getSearchArgument('assay', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchAssayInput) { 
             readOneProtocol(protocol_id:$protocol_id) {
              countFilteredAssays(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAssaysCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !Number.isInteger(response.data.data["readOneProtocol"]["countFilteredAssays"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneProtocol"]["countFilteredAssays"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedAssaysCount
   *
   * Get count of not associated Assays from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedAssaysCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('assay', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countAssays($search: searchAssayInput) {
          countAssays(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssaysCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countAssays");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countAssays"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countAssays"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedAssays
 *
 * Get not associated Assays items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedAssays(url, itemId, searchText, variables, ops, batchSize) {
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
   *    1. get a filtered items.
   *       filters:
   *          1.1: exclude itemId in association.targetKey field.
   *          1.2: include null values in association.targetKey field.  
   *    2. @return filtered items. 
   */
  //search
  let s = getSearchArgument('assay', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
    `query assaysConnection($search: searchAssayInput, $pagination: paginationCursorInput!) {
           assaysConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssays', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "assaysConnection");
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
   * Get fileAttachments records associated to the given protocol record
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

    variables["protocol_id"] = itemId;
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
      `query readOneProtocol($protocol_id:ID!, $search: searchFileAttachmentInput, $pagination: paginationCursorInput!) {
             readOneProtocol(protocol_id:$protocol_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !response.data.data["readOneProtocol"]["fileAttachmentsConnection"]
      || typeof response.data.data["readOneProtocol"]["fileAttachmentsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneProtocol"]["fileAttachmentsConnection"].edges)
      || typeof response.data.data["readOneProtocol"]["fileAttachmentsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneProtocol"]["fileAttachmentsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneProtocol"]["fileAttachmentsConnection"];
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
   * Get fileAttachments records count associated to the given protocol record
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

    let variables = {"protocol_id": itemId};
    //search
    let s = getSearchArgument('fileAttachment', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchFileAttachmentInput) { 
             readOneProtocol(protocol_id:$protocol_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !Number.isInteger(response.data.data["readOneProtocol"]["countFilteredFileAttachments"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneProtocol"]["countFilteredFileAttachments"];
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
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
   * getOntologyAnnotation   *
   * Get ontologyAnnotations records associated to the given protocol record
   * through association 'OntologyAnnotation', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getOntologyAnnotation(url, itemId, searchText, variables, ops) {
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

    variables["protocol_id"] = itemId;
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
      `query readOneProtocol($protocol_id:ID!, $search: searchOntologyAnnotationInput, $pagination: paginationCursorInput!) {
             readOneProtocol(protocol_id:$protocol_id) {
                ontologyAnnotationConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getOntologyAnnotation', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !response.data.data["readOneProtocol"]["ontologyAnnotationConnection"]
      || typeof response.data.data["readOneProtocol"]["ontologyAnnotationConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneProtocol"]["ontologyAnnotationConnection"].edges)
      || typeof response.data.data["readOneProtocol"]["ontologyAnnotationConnection"].pageInfo !== 'object' 
      || response.data.data["readOneProtocol"]["ontologyAnnotationConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneProtocol"]["ontologyAnnotationConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getOntologyAnnotationCount
   * 
   * Get ontologyAnnotations records count associated to the given protocol record
   * through association 'OntologyAnnotation', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getOntologyAnnotationCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"protocol_id": itemId};
    //search
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchOntologyAnnotationInput) { 
             readOneProtocol(protocol_id:$protocol_id) {
              countFilteredOntologyAnnotation(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getOntologyAnnotationCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !Number.isInteger(response.data.data["readOneProtocol"]["countFilteredOntologyAnnotation"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneProtocol"]["countFilteredOntologyAnnotation"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedOntologyAnnotationCount
   *
   * Get count of not associated OntologyAnnotation from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedOntologyAnnotationCount(url, itemId, searchText, ops) {
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
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyAnnotationCount', query, variables);
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
 * getNotAssociatedOntologyAnnotation
 *
 * Get not associated OntologyAnnotation items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedOntologyAnnotation(url, itemId, searchText, variables, ops, batchSize) {
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
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedOntologyAnnotation', query, variables);

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
 * Filter
 * ------
 */

  /**
   * getStudies   *
   * Get studies records associated to the given protocol record
   * through association 'Studies', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getStudies(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `study_id,
     name,
     description,
     startDate,
     endDate,
     investigation_id,
     factor_ids,
     protocol_ids,
     contact_ids,
     material_ids,
     ontologyAnnotation_ids,
     fileAttachment_ids,
`;

    variables["protocol_id"] = itemId;
    //set search
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchStudyInput, $pagination: paginationCursorInput!) {
             readOneProtocol(protocol_id:$protocol_id) {
                studiesConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getStudies', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !response.data.data["readOneProtocol"]["studiesConnection"]
      || typeof response.data.data["readOneProtocol"]["studiesConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneProtocol"]["studiesConnection"].edges)
      || typeof response.data.data["readOneProtocol"]["studiesConnection"].pageInfo !== 'object' 
      || response.data.data["readOneProtocol"]["studiesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneProtocol"]["studiesConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getStudiesCount
   * 
   * Get studies records count associated to the given protocol record
   * through association 'Studies', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getStudiesCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"protocol_id": itemId};
    //search
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneProtocol($protocol_id:ID!, $search: searchStudyInput) { 
             readOneProtocol(protocol_id:$protocol_id) {
              countFilteredStudies(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getStudiesCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneProtocol");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneProtocol"]
      || typeof response.data.data["readOneProtocol"] !== 'object'
      || !Number.isInteger(response.data.data["readOneProtocol"]["countFilteredStudies"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneProtocol"]["countFilteredStudies"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedStudiesCount
   *
   * Get count of not associated Studies from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedStudiesCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('study', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countStudies($search: searchStudyInput) {
          countStudies(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedStudiesCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countStudies");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countStudies"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countStudies"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedStudies
 *
 * Get not associated Studies items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedStudies(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `study_id,
     name,
     description,
     startDate,
     endDate,
     investigation_id,
     factor_ids,
     protocol_ids,
     contact_ids,
     material_ids,
     ontologyAnnotation_ids,
     fileAttachment_ids,
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
  let s = getSearchArgument('study', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "protocol_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "protocol_ids", valueType: "String", value: null, operator: "eq"};
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
    `query studiesConnection($search: searchStudyInput, $pagination: paginationCursorInput!) {
           studiesConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedStudies', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "studiesConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["studiesConnection"]
    || typeof response.data.data["studiesConnection"] !== 'object'
    || !Array.isArray(response.data.data["studiesConnection"].edges)
    || typeof response.data.data["studiesConnection"].pageInfo !== 'object' 
    || response.data.data["studiesConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["studiesConnection"];
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
          `query protocolsConnection($pagination: paginationCursorInput!) {
                 protocolsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "protocolsConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["protocolsConnection"]
        || typeof response.data.data["protocolsConnection"] !== 'object'
        || !Array.isArray(response.data.data["protocolsConnection"].edges)
        || typeof response.data.data["protocolsConnection"].pageInfo !== 'object' 
        || response.data.data["protocolsConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["protocolsConnection"];
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

