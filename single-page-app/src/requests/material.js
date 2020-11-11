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
   * Get materialtable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateMaterial}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateMaterial");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateMaterial"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateMaterial"];
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
   * Get materialsitems count from GraphQL Server.
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
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countMaterials($search: searchMaterialInput) { 
             countMaterials( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countMaterials");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countMaterials"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countMaterials"];
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
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query materialsConnection($order: [orderMaterialInput], $search: searchMaterialInput, $pagination: paginationCursorInput!) { 
             materialsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "materialsConnection");
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Material item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Material item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $material_id:ID!,
          $name:String,
          $description:String,
          $type:String,
          $addAssays: [ID],
          $addAssayResults: [ID],
          $addFileAttachments: [ID],
          $addSourceSets: [ID],
          $addElements: [ID],
          $addOntologyAnnotation: [ID],
          $addStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            material_id:$material_id,
            name:$name,
            description:$description,
            type:$type,
            addAssays: $addAssays,
            addAssayResults: $addAssayResults,
            addFileAttachments: $addFileAttachments,
            addSourceSets: $addSourceSets,
            addElements: $addElements,
            addOntologyAnnotation: $addOntologyAnnotation,
            addStudies: $addStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation addMaterial(
          ${qvariables}
          ) { addMaterial(
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
    let check = checkResponse(response, graphqlErrors, "addMaterial");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addMaterial"]
        || typeof response.data.data["addMaterial"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addMaterial"];
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
   * Update Material item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Material item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $material_id:ID!,
          $name:String,
          $description:String,
          $type:String,
          $addAssays: [ID],
          $removeAssays: [ID],
          $addAssayResults: [ID],
          $removeAssayResults: [ID],
          $addFileAttachments: [ID],
          $removeFileAttachments: [ID],
          $addSourceSets: [ID],
          $removeSourceSets: [ID],
          $addElements: [ID],
          $removeElements: [ID],
          $addOntologyAnnotation: [ID],
          $removeOntologyAnnotation: [ID],
          $addStudies: [ID],
          $removeStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            material_id:$material_id,
            name: $name,
            description: $description,
            type: $type,
            addAssays: $addAssays,
            removeAssays: $removeAssays,
            addAssayResults: $addAssayResults,
            removeAssayResults: $removeAssayResults,
            addFileAttachments: $addFileAttachments,
            removeFileAttachments: $removeFileAttachments,
            addSourceSets: $addSourceSets,
            removeSourceSets: $removeSourceSets,
            addElements: $addElements,
            removeElements: $removeElements,
            addOntologyAnnotation: $addOntologyAnnotation,
            removeOntologyAnnotation: $removeOntologyAnnotation,
            addStudies: $addStudies,
            removeStudies: $removeStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation updateMaterial(
          ${qvariables}
          ) { updateMaterial(
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
    let check = checkResponse(response, graphqlErrors, "updateMaterial");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateMaterial"]
        || typeof response.data.data["updateMaterial"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateMaterial"];
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
   * @param {Object} variables Object with values needed to delete the Material item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteMaterial(
              $material_id:ID!
        ) { deleteMaterial(
              material_id:$material_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteMaterial");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteMaterial"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteMaterial"];
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
   * Get assays records associated to the given material record
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

    variables["material_id"] = itemId;
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
      `query readOneMaterial($material_id:ID!, $search: searchAssayInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["assaysConnection"]
      || typeof response.data.data["readOneMaterial"]["assaysConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["assaysConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["assaysConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["assaysConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["assaysConnection"];
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
   * Get assays records count associated to the given material record
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

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('assay', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchAssayInput) { 
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredAssays"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredAssays"];
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
   * getAssayResults   *
   * Get assayResults records associated to the given material record
   * through association 'AssayResults', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getAssayResults(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

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

    variables["material_id"] = itemId;
    //set search
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneMaterial($material_id:ID!, $search: searchAssayResultInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
                assayResultsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAssayResults', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["assayResultsConnection"]
      || typeof response.data.data["readOneMaterial"]["assayResultsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["assayResultsConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["assayResultsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["assayResultsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["assayResultsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAssayResultsCount
   * 
   * Get assayResults records count associated to the given material record
   * through association 'AssayResults', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getAssayResultsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchAssayResultInput) { 
             readOneMaterial(material_id:$material_id) {
              countFilteredAssayResults(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAssayResultsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredAssayResults"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredAssayResults"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedAssayResultsCount
   *
   * Get count of not associated AssayResults from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedAssayResultsCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "material_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "material_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countAssayResults($search: searchAssayResultInput) {
            countAssayResults(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssayResultsCount', query, variables);
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
 * Filter
 * ------
 */

/**
 * getNotAssociatedAssayResults
 *
 * Get not associated AssayResults items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedAssayResults(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

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
    /**
     * Algorithm:
     *    1. get a filtered items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered items. 
     */
    //search
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "material_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "material_id", valueType: "String", value: null, operator: "eq"};
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
      `query assayResultsConnection($search: searchAssayResultInput, $pagination: paginationCursorInput!) {
             assayResultsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAssayResults', query, variables);

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
 * Filter
 * ------
 */

  /**
   * getFileAttachments   *
   * Get fileAttachments records associated to the given material record
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

    variables["material_id"] = itemId;
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
      `query readOneMaterial($material_id:ID!, $search: searchFileAttachmentInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["fileAttachmentsConnection"]
      || typeof response.data.data["readOneMaterial"]["fileAttachmentsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["fileAttachmentsConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["fileAttachmentsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["fileAttachmentsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["fileAttachmentsConnection"];
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
   * Get fileAttachments records count associated to the given material record
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

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('fileAttachment', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchFileAttachmentInput) { 
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredFileAttachments"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredFileAttachments"];
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
   * getSourceSets   *
   * Get materials records associated to the given material record
   * through association 'SourceSets', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getSourceSets(url, itemId, searchText, variables, ops) {
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

    variables["material_id"] = itemId;
    //set search
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneMaterial($material_id:ID!, $search: searchMaterialInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
                sourceSetsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getSourceSets', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["sourceSetsConnection"]
      || typeof response.data.data["readOneMaterial"]["sourceSetsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["sourceSetsConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["sourceSetsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["sourceSetsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["sourceSetsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getSourceSetsCount
   * 
   * Get materials records count associated to the given material record
   * through association 'SourceSets', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getSourceSetsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchMaterialInput) { 
             readOneMaterial(material_id:$material_id) {
              countFilteredSourceSets(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getSourceSetsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredSourceSets"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredSourceSets"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedSourceSetsCount
   *
   * Get count of not associated SourceSets from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedSourceSetsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('material', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "element_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "element_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countMaterials($search: searchMaterialInput) {
          countMaterials(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedSourceSetsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countMaterials");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countMaterials"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countMaterials"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedSourceSets
 *
 * Get not associated SourceSets items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedSourceSets(url, itemId, searchText, variables, ops, batchSize) {
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
   *    1. get a filtered items.
   *       filters:
   *          1.1: exclude itemId in association.targetKey field.
   *          1.2: include null values in association.targetKey field.  
   *    2. @return filtered items. 
   */
  //search
  let s = getSearchArgument('material', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "element_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "element_ids", valueType: "String", value: null, operator: "eq"};
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
    `query materialsConnection($search: searchMaterialInput, $pagination: paginationCursorInput!) {
           materialsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedSourceSets', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "materialsConnection");
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
   * getElements   *
   * Get materials records associated to the given material record
   * through association 'Elements', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getElements(url, itemId, searchText, variables, ops) {
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

    variables["material_id"] = itemId;
    //set search
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneMaterial($material_id:ID!, $search: searchMaterialInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
                elementsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getElements', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["elementsConnection"]
      || typeof response.data.data["readOneMaterial"]["elementsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["elementsConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["elementsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["elementsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["elementsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getElementsCount
   * 
   * Get materials records count associated to the given material record
   * through association 'Elements', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getElementsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchMaterialInput) { 
             readOneMaterial(material_id:$material_id) {
              countFilteredElements(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getElementsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredElements"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredElements"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedElementsCount
   *
   * Get count of not associated Elements from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedElementsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('material', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "sourceSet_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "sourceSet_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countMaterials($search: searchMaterialInput) {
          countMaterials(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedElementsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countMaterials");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countMaterials"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countMaterials"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedElements
 *
 * Get not associated Elements items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedElements(url, itemId, searchText, variables, ops, batchSize) {
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
   *    1. get a filtered items.
   *       filters:
   *          1.1: exclude itemId in association.targetKey field.
   *          1.2: include null values in association.targetKey field.  
   *    2. @return filtered items. 
   */
  //search
  let s = getSearchArgument('material', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "sourceSet_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "sourceSet_ids", valueType: "String", value: null, operator: "eq"};
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
    `query materialsConnection($search: searchMaterialInput, $pagination: paginationCursorInput!) {
           materialsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedElements', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "materialsConnection");
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
   * getOntologyAnnotation   *
   * Get ontologyAnnotations records associated to the given material record
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

    variables["material_id"] = itemId;
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
      `query readOneMaterial($material_id:ID!, $search: searchOntologyAnnotationInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["ontologyAnnotationConnection"]
      || typeof response.data.data["readOneMaterial"]["ontologyAnnotationConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["ontologyAnnotationConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["ontologyAnnotationConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["ontologyAnnotationConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["ontologyAnnotationConnection"];
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
   * Get ontologyAnnotations records count associated to the given material record
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

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchOntologyAnnotationInput) { 
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredOntologyAnnotation"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredOntologyAnnotation"];
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
   * Get studies records associated to the given material record
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

    variables["material_id"] = itemId;
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
      `query readOneMaterial($material_id:ID!, $search: searchStudyInput, $pagination: paginationCursorInput!) {
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !response.data.data["readOneMaterial"]["studiesConnection"]
      || typeof response.data.data["readOneMaterial"]["studiesConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneMaterial"]["studiesConnection"].edges)
      || typeof response.data.data["readOneMaterial"]["studiesConnection"].pageInfo !== 'object' 
      || response.data.data["readOneMaterial"]["studiesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneMaterial"]["studiesConnection"];
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
   * Get studies records count associated to the given material record
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

    let variables = {"material_id": itemId};
    //search
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneMaterial($material_id:ID!, $search: searchStudyInput) { 
             readOneMaterial(material_id:$material_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneMaterial");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneMaterial"]
      || typeof response.data.data["readOneMaterial"] !== 'object'
      || !Number.isInteger(response.data.data["readOneMaterial"]["countFilteredStudies"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneMaterial"]["countFilteredStudies"];
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "material_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "material_ids", valueType: "String", value: null, operator: "eq"};
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
          `query materialsConnection($pagination: paginationCursorInput!) {
                 materialsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "materialsConnection");
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

