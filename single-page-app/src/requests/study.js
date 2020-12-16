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
   * Get studytable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateStudy}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateStudy");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateStudy"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateStudy"];
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
   * Get studiesitems count from GraphQL Server.
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
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countStudies($search: searchStudyInput) { 
             countStudies( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

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
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `studyDbId,
       active,
       commonCropName,
       culturalPractices,
       documentationURL,
       endDate,
       license,
       observationUnitsDescription,
       startDate,
       studyDescription,
       studyName,
       studyType,
       trialDbId,
       locationDbId,
       contactDbIds,
       seasonDbIds,
`;

    //query
    let query =
      `query studiesConnection($order: [orderStudyInput], $search: searchStudyInput, $pagination: paginationCursorInput!) { 
             studiesConnection( order: $order, search: $search, pagination: $pagination ) {
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Study item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Study item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $studyDbId:ID!,
          $active:Boolean,
          $commonCropName:String,
          $culturalPractices:String,
          $documentationURL:String,
          $endDate:DateTime,
          $license:String,
          $observationUnitsDescription:String,
          $startDate:DateTime,
          $studyDescription:String,
          $studyName:String,
          $studyType:String,
          $addLocation: ID,
          $addTrial: ID,
          $addContacts: [ID],
          $addEnvironmentParameters: [ID],
          $addEvents: [ID],
          $addObservations: [ID],
          $addObservationUnits: [ID],
          $addSeasons: [ID],
`;

    //set parameters assignation
    let qparameters = `
            studyDbId:$studyDbId,
            active:$active,
            commonCropName:$commonCropName,
            culturalPractices:$culturalPractices,
            documentationURL:$documentationURL,
            endDate:$endDate,
            license:$license,
            observationUnitsDescription:$observationUnitsDescription,
            startDate:$startDate,
            studyDescription:$studyDescription,
            studyName:$studyName,
            studyType:$studyType,
            addLocation: $addLocation,
            addTrial: $addTrial,
            addContacts: $addContacts,
            addEnvironmentParameters: $addEnvironmentParameters,
            addEvents: $addEvents,
            addObservations: $addObservations,
            addObservationUnits: $addObservationUnits,
            addSeasons: $addSeasons,
`;

    //set attributes to fetch
    let qattributes = 
      `studyDbId,
       active,
       commonCropName,
       culturalPractices,
       documentationURL,
       endDate,
       license,
       observationUnitsDescription,
       startDate,
       studyDescription,
       studyName,
       studyType,
       trialDbId,
       locationDbId,
       contactDbIds,
       seasonDbIds,
`;

    //query
    let query =
      `mutation addStudy(
          ${qvariables}
          ) { addStudy(
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
    let check = checkResponse(response, graphqlErrors, "addStudy");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addStudy"]
        || typeof response.data.data["addStudy"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addStudy"];
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
   * Update Study item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Study item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $studyDbId:ID!,
          $active:Boolean,
          $commonCropName:String,
          $culturalPractices:String,
          $documentationURL:String,
          $endDate:DateTime,
          $license:String,
          $observationUnitsDescription:String,
          $startDate:DateTime,
          $studyDescription:String,
          $studyName:String,
          $studyType:String,
          $addLocation: ID,
          $removeLocation: ID,
          $addTrial: ID,
          $removeTrial: ID,
          $addContacts: [ID],
          $removeContacts: [ID],
          $addEnvironmentParameters: [ID],
          $removeEnvironmentParameters: [ID],
          $addEvents: [ID],
          $removeEvents: [ID],
          $addObservations: [ID],
          $removeObservations: [ID],
          $addObservationUnits: [ID],
          $removeObservationUnits: [ID],
          $addSeasons: [ID],
          $removeSeasons: [ID],
`;

    //set parameters assignation
    let qparameters = `
            studyDbId:$studyDbId,
            active: $active,
            commonCropName: $commonCropName,
            culturalPractices: $culturalPractices,
            documentationURL: $documentationURL,
            endDate: $endDate,
            license: $license,
            observationUnitsDescription: $observationUnitsDescription,
            startDate: $startDate,
            studyDescription: $studyDescription,
            studyName: $studyName,
            studyType: $studyType,
            addLocation: $addLocation,
            removeLocation: $removeLocation,
            addTrial: $addTrial,
            removeTrial: $removeTrial,
            addContacts: $addContacts,
            removeContacts: $removeContacts,
            addEnvironmentParameters: $addEnvironmentParameters,
            removeEnvironmentParameters: $removeEnvironmentParameters,
            addEvents: $addEvents,
            removeEvents: $removeEvents,
            addObservations: $addObservations,
            removeObservations: $removeObservations,
            addObservationUnits: $addObservationUnits,
            removeObservationUnits: $removeObservationUnits,
            addSeasons: $addSeasons,
            removeSeasons: $removeSeasons,
`;

    //set attributes to fetch
    let qattributes = 
      `studyDbId,
       active,
       commonCropName,
       culturalPractices,
       documentationURL,
       endDate,
       license,
       observationUnitsDescription,
       startDate,
       studyDescription,
       studyName,
       studyType,
       trialDbId,
       locationDbId,
       contactDbIds,
       seasonDbIds,
`;

    //query
    let query =
      `mutation updateStudy(
          ${qvariables}
          ) { updateStudy(
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
    let check = checkResponse(response, graphqlErrors, "updateStudy");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateStudy"]
        || typeof response.data.data["updateStudy"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateStudy"];
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
   * @param {Object} variables Object with values needed to delete the Study item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteStudy(
              $studyDbId:ID!
        ) { deleteStudy(
              studyDbId:$studyDbId        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteStudy");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteStudy"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteStudy"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getContacts   *
   * Get contacts records associated to the given study record
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
    `contactDbId,
     email,
     instituteName,
     name,
     orcid,
     type,
     studyDbIds,
     trialDbIds,
`;

    variables["studyDbId"] = itemId;
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
      `query readOneStudy($studyDbId:ID!, $search: searchContactInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["contactsConnection"]
      || typeof response.data.data["readOneStudy"]["contactsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["contactsConnection"].edges)
      || typeof response.data.data["readOneStudy"]["contactsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["contactsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["contactsConnection"];
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
   * Get contacts records count associated to the given study record
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

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('contact', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchContactInput) { 
             readOneStudy(studyDbId:$studyDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredContacts"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredContacts"];
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
  let f1 = {field: "stduyDbIds", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "stduyDbIds", valueType: "String", value: null, operator: "eq"};
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
    `contactDbId,
     email,
     instituteName,
     name,
     orcid,
     type,
     studyDbIds,
     trialDbIds,
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
  let f1 = {field: "stduyDbIds", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "stduyDbIds", valueType: "String", value: null, operator: "eq"};
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
   * getEnvironmentParameters   *
   * Get environmentParameters records associated to the given study record
   * through association 'EnvironmentParameters', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getEnvironmentParameters(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `environmentParameterDbId,
     description,
     parameterName,
     parameterPUI,
     unit,
     unitPUI,
     value,
     valuePUI,
     studyDbId,
`;

    variables["studyDbId"] = itemId;
    //set search
    let s = getSearchArgument('environmentParameter', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchEnvironmentParameterInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
                environmentParametersConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEnvironmentParameters', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["environmentParametersConnection"]
      || typeof response.data.data["readOneStudy"]["environmentParametersConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["environmentParametersConnection"].edges)
      || typeof response.data.data["readOneStudy"]["environmentParametersConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["environmentParametersConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["environmentParametersConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getEnvironmentParametersCount
   * 
   * Get environmentParameters records count associated to the given study record
   * through association 'EnvironmentParameters', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getEnvironmentParametersCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('environmentParameter', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchEnvironmentParameterInput) { 
             readOneStudy(studyDbId:$studyDbId) {
              countFilteredEnvironmentParameters(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEnvironmentParametersCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredEnvironmentParameters"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredEnvironmentParameters"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedEnvironmentParametersCount
   *
   * Get count of not associated EnvironmentParameters from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedEnvironmentParametersCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('environmentParameter', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countEnvironmentParameters($search: searchEnvironmentParameterInput) {
            countEnvironmentParameters(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedEnvironmentParametersCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countEnvironmentParameters");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countEnvironmentParameters"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countEnvironmentParameters"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedEnvironmentParameters
 *
 * Get not associated EnvironmentParameters items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedEnvironmentParameters(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `environmentParameterDbId,
     description,
     parameterName,
     parameterPUI,
     unit,
     unitPUI,
     value,
     valuePUI,
     studyDbId,
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
    let s = getSearchArgument('environmentParameter', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
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
      `query environmentParametersConnection($search: searchEnvironmentParameterInput, $pagination: paginationCursorInput!) {
             environmentParametersConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedEnvironmentParameters', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "environmentParametersConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["environmentParametersConnection"]
      || typeof response.data.data["environmentParametersConnection"] !== 'object'
      || !Array.isArray(response.data.data["environmentParametersConnection"].edges)
      || typeof response.data.data["environmentParametersConnection"].pageInfo !== 'object' 
      || response.data.data["environmentParametersConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["environmentParametersConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getEvents   *
   * Get events records associated to the given study record
   * through association 'Events', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getEvents(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `eventType,
     eventDbId,
     eventDescription,
     date,
     observationUnitDbIds,
     studyDbId,
`;

    variables["studyDbId"] = itemId;
    //set search
    let s = getSearchArgument('event', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchEventInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
                eventsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEvents', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["eventsConnection"]
      || typeof response.data.data["readOneStudy"]["eventsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["eventsConnection"].edges)
      || typeof response.data.data["readOneStudy"]["eventsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["eventsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["eventsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getEventsCount
   * 
   * Get events records count associated to the given study record
   * through association 'Events', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getEventsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('event', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchEventInput) { 
             readOneStudy(studyDbId:$studyDbId) {
              countFilteredEvents(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getEventsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredEvents"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredEvents"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedEventsCount
   *
   * Get count of not associated Events from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedEventsCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('event', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countEvents($search: searchEventInput) {
            countEvents(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedEventsCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countEvents");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countEvents"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countEvents"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedEvents
 *
 * Get not associated Events items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedEvents(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `eventType,
     eventDbId,
     eventDescription,
     date,
     observationUnitDbIds,
     studyDbId,
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
    let s = getSearchArgument('event', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
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
      `query eventsConnection($search: searchEventInput, $pagination: paginationCursorInput!) {
             eventsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedEvents', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "eventsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["eventsConnection"]
      || typeof response.data.data["eventsConnection"] !== 'object'
      || !Array.isArray(response.data.data["eventsConnection"].edges)
      || typeof response.data.data["eventsConnection"].pageInfo !== 'object' 
      || response.data.data["eventsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["eventsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getLocation   *
   * Get locations records associated to the given study record
   * through association 'Location', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getLocation(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `locationDbId,
     abbreviation,
     coordinateDescription,
     countryCode,
     countryName,
     documentationURL,
     environmentType,
     exposure,
     instituteAddress,
     instituteName,
     locationName,
     locationType,
     siteStatus,
     slope,
     topography,
`;

    variables = { "studyDbId": itemId };
    //set query
    let query = 
      `query readOneStudy($studyDbId:ID!) {
             readOneStudy(studyDbId:$studyDbId) {
                location{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getLocation', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["location"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["location"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedLocationCount
   *
   * Get count of not associated Location from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedLocationCount(url, itemId, searchText, ops) {
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
    let variables = {"studyDbId": itemId};
    let query = 
      `query readOneStudy($studyDbId:ID!) {
             readOneStudy(studyDbId:$studyDbId) {
                location{
                  locationDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedLocationCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["location"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["location"];
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
    let s = getSearchArgument('location', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "locationDbId", valueType: "String", value: associatedItem["locationDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countLocations($search: searchLocationInput) {
             countLocations(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedLocationCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countLocations");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countLocations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countLocations"];
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
 * getNotAssociatedLocation
 *
 * Get not associated Location items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedLocation(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `locationDbId,
     abbreviation,
     coordinateDescription,
     countryCode,
     countryName,
     documentationURL,
     environmentType,
     exposure,
     instituteAddress,
     instituteName,
     locationName,
     locationType,
     siteStatus,
     slope,
     topography,
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
      `{  readOneStudy(studyDbId: "${itemId}") {
            location{
              locationDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedLocation.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["location"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["location"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "locationDbId", valueType: "String", value: associatedItem["locationDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('location', searchText, ops, 'object');
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
      `query locationsConnection($search: searchLocationInput, $pagination: paginationCursorInput!) {
             locationsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedLocation.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "locationsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["locationsConnection"]
      || typeof response.data.data["locationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["locationsConnection"].edges)
      || typeof response.data.data["locationsConnection"].pageInfo !== 'object' 
      || response.data.data["locationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["locationsConnection"];
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
   * Get observations records associated to the given study record
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

    variables["studyDbId"] = itemId;
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
      `query readOneStudy($studyDbId:ID!, $search: searchObservationInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["observationsConnection"]
      || typeof response.data.data["readOneStudy"]["observationsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["observationsConnection"].edges)
      || typeof response.data.data["readOneStudy"]["observationsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["observationsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["observationsConnection"];
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
   * Get observations records count associated to the given study record
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

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('observation', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchObservationInput) { 
             readOneStudy(studyDbId:$studyDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredObservations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredObservations"];
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
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
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
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
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
   * getObservationUnits   *
   * Get observationUnits records associated to the given study record
   * through association 'ObservationUnits', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getObservationUnits(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `observationUnitDbId,
     observationLevel,
     observationUnitName,
     observationUnitPUI,
     plantNumber,
     plotNumber,
     programDbId,
     studyDbId,
     trialDbId,
     germplasmDbId,
     locationDbId,
     eventDbIds,
`;

    variables["studyDbId"] = itemId;
    //set search
    let s = getSearchArgument('observationUnit', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchObservationUnitInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
                observationUnitsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getObservationUnits', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["observationUnitsConnection"]
      || typeof response.data.data["readOneStudy"]["observationUnitsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["observationUnitsConnection"].edges)
      || typeof response.data.data["readOneStudy"]["observationUnitsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["observationUnitsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["observationUnitsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getObservationUnitsCount
   * 
   * Get observationUnits records count associated to the given study record
   * through association 'ObservationUnits', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getObservationUnitsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('observationUnit', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchObservationUnitInput) { 
             readOneStudy(studyDbId:$studyDbId) {
              countFilteredObservationUnits(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getObservationUnitsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredObservationUnits"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredObservationUnits"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedObservationUnitsCount
   *
   * Get count of not associated ObservationUnits from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedObservationUnitsCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('observationUnit', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countObservationUnits($search: searchObservationUnitInput) {
            countObservationUnits(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservationUnitsCount', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countObservationUnits");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countObservationUnits"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countObservationUnits"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedObservationUnits
 *
 * Get not associated ObservationUnits items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedObservationUnits(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `observationUnitDbId,
     observationLevel,
     observationUnitName,
     observationUnitPUI,
     plantNumber,
     plotNumber,
     programDbId,
     studyDbId,
     trialDbId,
     germplasmDbId,
     locationDbId,
     eventDbIds,
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
    let s = getSearchArgument('observationUnit', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "studyDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "studyDbId", valueType: "String", value: null, operator: "eq"};
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
      `query observationUnitsConnection($search: searchObservationUnitInput, $pagination: paginationCursorInput!) {
             observationUnitsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedObservationUnits', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "observationUnitsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["observationUnitsConnection"]
      || typeof response.data.data["observationUnitsConnection"] !== 'object'
      || !Array.isArray(response.data.data["observationUnitsConnection"].edges)
      || typeof response.data.data["observationUnitsConnection"].pageInfo !== 'object' 
      || response.data.data["observationUnitsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["observationUnitsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getSeasons   *
   * Get seasons records associated to the given study record
   * through association 'Seasons', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getSeasons(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `seasonDbId,
     season,
     year,
     studyDbIds,
`;

    variables["studyDbId"] = itemId;
    //set search
    let s = getSearchArgument('season', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchSeasonInput, $pagination: paginationCursorInput!) {
             readOneStudy(studyDbId:$studyDbId) {
                seasonsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getSeasons', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !response.data.data["readOneStudy"]["seasonsConnection"]
      || typeof response.data.data["readOneStudy"]["seasonsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneStudy"]["seasonsConnection"].edges)
      || typeof response.data.data["readOneStudy"]["seasonsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneStudy"]["seasonsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneStudy"]["seasonsConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getSeasonsCount
   * 
   * Get seasons records count associated to the given study record
   * through association 'Seasons', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getSeasonsCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"studyDbId": itemId};
    //search
    let s = getSearchArgument('season', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneStudy($studyDbId:ID!, $search: searchSeasonInput) { 
             readOneStudy(studyDbId:$studyDbId) {
              countFilteredSeasons(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getSeasonsCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || !Number.isInteger(response.data.data["readOneStudy"]["countFilteredSeasons"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneStudy"]["countFilteredSeasons"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedSeasonsCount
   *
   * Get count of not associated Seasons from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedSeasonsCount(url, itemId, searchText, ops) {
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
  let s = getSearchArgument('season', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "studyDbIds", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "studyDbIds", valueType: "String", value: null, operator: "eq"};
  let nf = {operator: "or", search: [ f1, f2 ]};
  
  //add new filter to ands array
  if(s) s.search.search.push(nf);
  else  s = {search: nf};

  //set search
  let variables = {search: s.search};

   //set query
  let query = 
   `query countSeasons($search: searchSeasonInput) {
          countSeasons(search: $search) }`;
  
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedSeasonsCount', query, variables);
  //request
  let response = await requestGraphql({ url, query, variables });
  let count = null;
  //check
  let check = checkResponse(response, graphqlErrors, "countSeasons");
  if(check === 'ok') {
    //check type
    if(!Number.isInteger(response.data.data["countSeasons"])) 
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    count = response.data.data["countSeasons"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedSeasons
 *
 * Get not associated Seasons items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedSeasons(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `seasonDbId,
     season,
     year,
     studyDbIds,
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
  let s = getSearchArgument('season', searchText, ops, 'object');

  //make filter to exclude itemId on FK & include null's
  let f1 = {field: "studyDbIds", valueType: "Array", value: itemId, operator: "notIn"};
  let f2 = {field: "studyDbIds", valueType: "String", value: null, operator: "eq"};
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
    `query seasonsConnection($search: searchSeasonInput, $pagination: paginationCursorInput!) {
           seasonsConnection(search: $search, pagination: $pagination) {
                ${qbody},
              },
           }`;
  /**
   * Debug
   */
  if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedSeasons', query, variables);

  //request
  let response = await requestGraphql({ url, query, variables });
  let items = null;
  //check
  let check = checkResponse(response, graphqlErrors, "seasonsConnection");
  if(check === 'ok') {
    //check type
    if(!response.data.data["seasonsConnection"]
    || typeof response.data.data["seasonsConnection"] !== 'object'
    || !Array.isArray(response.data.data["seasonsConnection"].edges)
    || typeof response.data.data["seasonsConnection"].pageInfo !== 'object' 
    || response.data.data["seasonsConnection"].pageInfo === null)
    return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //get value
    items = response.data.data["seasonsConnection"];
  } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //return value
  return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
},



/**
 * Filter
 * ------
 */

  /**
   * getTrial   *
   * Get trials records associated to the given study record
   * through association 'Trial', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getTrial(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `trialDbId,
     active,
     commonCropName,
     documentationURL,
     endDate,
     startDate,
     trialDescription,
     trialName,
     trialPUI,
     programDbId,
     contactDbIds,
`;

    variables = { "studyDbId": itemId };
    //set query
    let query = 
      `query readOneStudy($studyDbId:ID!) {
             readOneStudy(studyDbId:$studyDbId) {
                trial{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getTrial', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["trial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["trial"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedTrialCount
   *
   * Get count of not associated Trial from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedTrialCount(url, itemId, searchText, ops) {
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
    let variables = {"studyDbId": itemId};
    let query = 
      `query readOneStudy($studyDbId:ID!) {
             readOneStudy(studyDbId:$studyDbId) {
                trial{
                  trialDbId                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrialCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["trial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["trial"];
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
    let s = getSearchArgument('trial', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "trialDbId", valueType: "String", value: associatedItem["trialDbId"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countTrials($search: searchTrialInput) {
             countTrials(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrialCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countTrials");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countTrials"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countTrials"];
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
 * getNotAssociatedTrial
 *
 * Get not associated Trial items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedTrial(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `trialDbId,
     active,
     commonCropName,
     documentationURL,
     endDate,
     startDate,
     trialDescription,
     trialName,
     trialPUI,
     programDbId,
     contactDbIds,
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
      `{  readOneStudy(studyDbId: "${itemId}") {
            trial{
              trialDbId            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrial.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneStudy");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneStudy"]
      || typeof response.data.data["readOneStudy"] !== 'object'
      || typeof response.data.data["readOneStudy"]["trial"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneStudy"]["trial"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "trialDbId", valueType: "String", value: associatedItem["trialDbId"], operator: "ne"};

    //search
    let s = getSearchArgument('trial', searchText, ops, 'object');
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
      `query trialsConnection($search: searchTrialInput, $pagination: paginationCursorInput!) {
             trialsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedTrial.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "trialsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["trialsConnection"]
      || typeof response.data.data["trialsConnection"] !== 'object'
      || !Array.isArray(response.data.data["trialsConnection"].edges)
      || typeof response.data.data["trialsConnection"].pageInfo !== 'object' 
      || response.data.data["trialsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["trialsConnection"];
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
          `query studiesConnection($pagination: paginationCursorInput!) {
                 studiesConnection(pagination: $pagination) {
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

