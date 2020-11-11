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
   * Get ontologyAnnotationtable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateOntologyAnnotation}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateOntologyAnnotation"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateOntologyAnnotation"];
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
   * Get ontologyAnnotationsitems count from GraphQL Server.
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
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countOntologyAnnotations($search: searchOntologyAnnotationInput) { 
             countOntologyAnnotations( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

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
    let s = getSearchArgument('ontologyAnnotation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query ontologyAnnotationsConnection($order: [orderOntologyAnnotationInput], $search: searchOntologyAnnotationInput, $pagination: paginationCursorInput!) { 
             ontologyAnnotationsConnection( order: $order, search: $search, pagination: $pagination ) {
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new OntologyAnnotation item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new OntologyAnnotation item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $ontologyAnnotation_id:ID!,
          $ontology:String,
          $ontologyURL:String,
          $term:String,
          $termURL:String,
          $addAssays: [ID],
          $addAssayResults: [ID],
          $addContacts: [ID],
          $addFactors: [ID],
          $addInvestigations: [ID],
          $addMaterials: [ID],
          $addProtocols: [ID],
          $addStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            ontologyAnnotation_id:$ontologyAnnotation_id,
            ontology:$ontology,
            ontologyURL:$ontologyURL,
            term:$term,
            termURL:$termURL,
            addAssays: $addAssays,
            addAssayResults: $addAssayResults,
            addContacts: $addContacts,
            addFactors: $addFactors,
            addInvestigations: $addInvestigations,
            addMaterials: $addMaterials,
            addProtocols: $addProtocols,
            addStudies: $addStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation addOntologyAnnotation(
          ${qvariables}
          ) { addOntologyAnnotation(
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
    let check = checkResponse(response, graphqlErrors, "addOntologyAnnotation");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addOntologyAnnotation"]
        || typeof response.data.data["addOntologyAnnotation"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addOntologyAnnotation"];
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
   * Update OntologyAnnotation item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given OntologyAnnotation item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $ontologyAnnotation_id:ID!,
          $ontology:String,
          $ontologyURL:String,
          $term:String,
          $termURL:String,
          $addAssays: [ID],
          $removeAssays: [ID],
          $addAssayResults: [ID],
          $removeAssayResults: [ID],
          $addContacts: [ID],
          $removeContacts: [ID],
          $addFactors: [ID],
          $removeFactors: [ID],
          $addInvestigations: [ID],
          $removeInvestigations: [ID],
          $addMaterials: [ID],
          $removeMaterials: [ID],
          $addProtocols: [ID],
          $removeProtocols: [ID],
          $addStudies: [ID],
          $removeStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            ontologyAnnotation_id:$ontologyAnnotation_id,
            ontology: $ontology,
            ontologyURL: $ontologyURL,
            term: $term,
            termURL: $termURL,
            addAssays: $addAssays,
            removeAssays: $removeAssays,
            addAssayResults: $addAssayResults,
            removeAssayResults: $removeAssayResults,
            addContacts: $addContacts,
            removeContacts: $removeContacts,
            addFactors: $addFactors,
            removeFactors: $removeFactors,
            addInvestigations: $addInvestigations,
            removeInvestigations: $removeInvestigations,
            addMaterials: $addMaterials,
            removeMaterials: $removeMaterials,
            addProtocols: $addProtocols,
            removeProtocols: $removeProtocols,
            addStudies: $addStudies,
            removeStudies: $removeStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation updateOntologyAnnotation(
          ${qvariables}
          ) { updateOntologyAnnotation(
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
    let check = checkResponse(response, graphqlErrors, "updateOntologyAnnotation");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateOntologyAnnotation"]
        || typeof response.data.data["updateOntologyAnnotation"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateOntologyAnnotation"];
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
   * @param {Object} variables Object with values needed to delete the OntologyAnnotation item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteOntologyAnnotation(
              $ontologyAnnotation_id:ID!
        ) { deleteOntologyAnnotation(
              ontologyAnnotation_id:$ontologyAnnotation_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteOntologyAnnotation"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteOntologyAnnotation"];
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
   * Get assays records associated to the given ontologyAnnotation record
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

    variables["ontologyAnnotation_id"] = itemId;
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
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchAssayInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["assaysConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["assaysConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["assaysConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["assaysConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["assaysConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["assaysConnection"];
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
   * Get assays records count associated to the given ontologyAnnotation record
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

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('assay', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchAssayInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredAssays"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredAssays"];
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
   * Get assayResults records associated to the given ontologyAnnotation record
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

    variables["ontologyAnnotation_id"] = itemId;
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
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchAssayResultInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["assayResultsConnection"];
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
   * Get assayResults records count associated to the given ontologyAnnotation record
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

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('assayResult', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchAssayResultInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredAssayResults"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredAssayResults"];
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
   * getContacts   *
   * Get contacts records associated to the given ontologyAnnotation record
   * through association 'Contacts', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getContacts(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `contact_id,
     name,
     email,
     phone,
     address,
     affiliation,
     study_ids,
     investigation_ids,
     fileAttachment_ids,
     ontologyAnnotation_ids,
`;

    variables["ontologyAnnotation_id"] = itemId;
    //set search
    let s = getSearchArgument('contact', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchContactInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
                contactsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getContacts', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["contactsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["contactsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["contactsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["contactsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["contactsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["contactsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getContactsCount
   * 
   * Get contacts records count associated to the given ontologyAnnotation record
   * through association 'Contacts', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getContactsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('contact', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchContactInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
              countFilteredContacts(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getContactsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredContacts"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredContacts"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedContactsCount
   *
   * Get count of not associated Contacts from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedContactsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('contact', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countContacts($search: searchContactInput) {
          countContacts(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedContactsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countContacts");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countContacts"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countContacts"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedContacts
 *
 * Get not associated Contacts items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedContacts(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `contact_id,
     name,
     email,
     phone,
     address,
     affiliation,
     study_ids,
     investigation_ids,
     fileAttachment_ids,
     ontologyAnnotation_ids,
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
  let s = getSearchArgument('contact', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
    `query contactsConnection($search: searchContactInput, $pagination: paginationCursorInput!) {
           contactsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedContacts', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "contactsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["contactsConnection"]
    || typeof response.data.data["contactsConnection"] !== 'object'
    || !Array.isArray(response.data.data["contactsConnection"].edges)
    || typeof response.data.data["contactsConnection"].pageInfo !== 'object' 
    || response.data.data["contactsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["contactsConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getFactors   *
   * Get factors records associated to the given ontologyAnnotation record
   * through association 'Factors', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getFactors(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `factor_id,
     name,
     description,
     type,
     assay_ids,
     study_ids,
     ontologyAnnotation_ids,
     fileAttachment_ids,
`;

    variables["ontologyAnnotation_id"] = itemId;
    //set search
    let s = getSearchArgument('factor', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchFactorInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
                factorsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getFactors', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["factorsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["factorsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["factorsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["factorsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["factorsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["factorsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getFactorsCount
   * 
   * Get factors records count associated to the given ontologyAnnotation record
   * through association 'Factors', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getFactorsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('factor', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchFactorInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
              countFilteredFactors(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getFactorsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredFactors"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredFactors"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedFactorsCount
   *
   * Get count of not associated Factors from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedFactorsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('factor', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countFactors($search: searchFactorInput) {
          countFactors(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedFactorsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countFactors");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countFactors"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countFactors"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedFactors
 *
 * Get not associated Factors items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedFactors(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `factor_id,
     name,
     description,
     type,
     assay_ids,
     study_ids,
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
  let s = getSearchArgument('factor', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
    `query factorsConnection($search: searchFactorInput, $pagination: paginationCursorInput!) {
           factorsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedFactors', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "factorsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["factorsConnection"]
    || typeof response.data.data["factorsConnection"] !== 'object'
    || !Array.isArray(response.data.data["factorsConnection"].edges)
    || typeof response.data.data["factorsConnection"].pageInfo !== 'object' 
    || response.data.data["factorsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["factorsConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getInvestigations   *
   * Get investigations records associated to the given ontologyAnnotation record
   * through association 'Investigations', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getInvestigations(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `investigation_id,
     title,
     description,
     startDate,
     endDate,
     ontologyAnnotation_ids,
     contact_ids,
     fileAttachment_ids,
`;

    variables["ontologyAnnotation_id"] = itemId;
    //set search
    let s = getSearchArgument('investigation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchInvestigationInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
                investigationsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getInvestigations', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["investigationsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["investigationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["investigationsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["investigationsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["investigationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["investigationsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getInvestigationsCount
   * 
   * Get investigations records count associated to the given ontologyAnnotation record
   * through association 'Investigations', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getInvestigationsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('investigation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchInvestigationInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
              countFilteredInvestigations(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getInvestigationsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredInvestigations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredInvestigations"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedInvestigationsCount
   *
   * Get count of not associated Investigations from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedInvestigationsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('investigation', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countInvestigations($search: searchInvestigationInput) {
          countInvestigations(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInvestigationsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countInvestigations");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countInvestigations"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countInvestigations"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedInvestigations
 *
 * Get not associated Investigations items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedInvestigations(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `investigation_id,
     title,
     description,
     startDate,
     endDate,
     ontologyAnnotation_ids,
     contact_ids,
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
  let s = getSearchArgument('investigation', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
    `query investigationsConnection($search: searchInvestigationInput, $pagination: paginationCursorInput!) {
           investigationsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedInvestigations', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "investigationsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["investigationsConnection"]
    || typeof response.data.data["investigationsConnection"] !== 'object'
    || !Array.isArray(response.data.data["investigationsConnection"].edges)
    || typeof response.data.data["investigationsConnection"].pageInfo !== 'object' 
    || response.data.data["investigationsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["investigationsConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getMaterials   *
   * Get materials records associated to the given ontologyAnnotation record
   * through association 'Materials', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getMaterials(url, itemId, searchText, variables, ops) {
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

    variables["ontologyAnnotation_id"] = itemId;
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
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchMaterialInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
                materialsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getMaterials', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["materialsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["materialsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["materialsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["materialsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["materialsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["materialsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getMaterialsCount
   * 
   * Get materials records count associated to the given ontologyAnnotation record
   * through association 'Materials', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getMaterialsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('material', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchMaterialInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
              countFilteredMaterials(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getMaterialsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredMaterials"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredMaterials"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedMaterialsCount
   *
   * Get count of not associated Materials from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedMaterialsCount(url, itemId, searchText, ops) {
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMaterialsCount', query, variables);
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
 * getNotAssociatedMaterials
 *
 * Get not associated Materials items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedMaterials(url, itemId, searchText, variables, ops, batchSize) {
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedMaterials', query, variables);

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
   * getProtocols   *
   * Get protocols records associated to the given ontologyAnnotation record
   * through association 'Protocols', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getProtocols(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

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

    variables["ontologyAnnotation_id"] = itemId;
    //set search
    let s = getSearchArgument('protocol', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchProtocolInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
                protocolsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getProtocols', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["protocolsConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["protocolsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["protocolsConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["protocolsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["protocolsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["protocolsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getProtocolsCount
   * 
   * Get protocols records count associated to the given ontologyAnnotation record
   * through association 'Protocols', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getProtocolsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('protocol', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchProtocolInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
              countFilteredProtocols(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getProtocolsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredProtocols"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredProtocols"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedProtocolsCount
   *
   * Get count of not associated Protocols from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedProtocolsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('protocol', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countProtocols($search: searchProtocolInput) {
          countProtocols(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedProtocolsCount', query, variables);
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
 * Filter
 * ------
 */

/**
 * getNotAssociatedProtocols
 *
 * Get not associated Protocols items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedProtocols(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

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
  /**
   * Algorithm:
   *    1. get a filtered items.
   *       filters:
   *          1.1: exclude itemId in association.targetKey field.
   *          1.2: include null values in association.targetKey field.  
   *    2. @return filtered items. 
   */
  //search
  let s = getSearchArgument('protocol', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
    `query protocolsConnection($search: searchProtocolInput, $pagination: paginationCursorInput!) {
           protocolsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedProtocols', query, variables);

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
 * Filter
 * ------
 */

  /**
   * getStudies   *
   * Get studies records associated to the given ontologyAnnotation record
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

    variables["ontologyAnnotation_id"] = itemId;
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
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchStudyInput, $pagination: paginationCursorInput!) {
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !response.data.data["readOneOntologyAnnotation"]["studiesConnection"]
      || typeof response.data.data["readOneOntologyAnnotation"]["studiesConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneOntologyAnnotation"]["studiesConnection"].edges)
      || typeof response.data.data["readOneOntologyAnnotation"]["studiesConnection"].pageInfo !== 'object' 
      || response.data.data["readOneOntologyAnnotation"]["studiesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneOntologyAnnotation"]["studiesConnection"];
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
   * Get studies records count associated to the given ontologyAnnotation record
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

    let variables = {"ontologyAnnotation_id": itemId};
    //search
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneOntologyAnnotation($ontologyAnnotation_id:ID!, $search: searchStudyInput) { 
             readOneOntologyAnnotation(ontologyAnnotation_id:$ontologyAnnotation_id) {
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
    let check = checkResponse(response, graphqlErrors, "readOneOntologyAnnotation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneOntologyAnnotation"]
      || typeof response.data.data["readOneOntologyAnnotation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneOntologyAnnotation"]["countFilteredStudies"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneOntologyAnnotation"]["countFilteredStudies"];
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
  let f1 = {field: "ontologyAnnotation_ids", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "ontologyAnnotation_ids", valueType: "String", value: null, operator: "eq"};
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
          `query ontologyAnnotationsConnection($pagination: paginationCursorInput!) {
                 ontologyAnnotationsConnection(pagination: $pagination) {
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

