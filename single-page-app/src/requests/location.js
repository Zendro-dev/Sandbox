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
   * Get locationtable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateLocation}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateLocation");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateLocation"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateLocation"];
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
   * Get locationsitems count from GraphQL Server.
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
    let s = getSearchArgument('location', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countLocations($search: searchLocationInput) { 
             countLocations( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countLocations");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countLocations"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countLocations"];
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
    let s = getSearchArgument('location', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query locationsConnection($order: [orderLocationInput], $search: searchLocationInput, $pagination: paginationCursorInput!) { 
             locationsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "locationsConnection");
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Location item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Location item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $locationDbId:ID!,
          $abbreviation:String,
          $coordinateDescription:String,
          $countryCode:String,
          $countryName:String,
          $documentationURL:String,
          $environmentType:String,
          $exposure:String,
          $instituteAddress:String,
          $instituteName:String,
          $locationName:String,
          $locationType:String,
          $siteStatus:String,
          $slope:String,
          $topography:String,
          $addObservationUnits: [ID],
          $addStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            locationDbId:$locationDbId,
            abbreviation:$abbreviation,
            coordinateDescription:$coordinateDescription,
            countryCode:$countryCode,
            countryName:$countryName,
            documentationURL:$documentationURL,
            environmentType:$environmentType,
            exposure:$exposure,
            instituteAddress:$instituteAddress,
            instituteName:$instituteName,
            locationName:$locationName,
            locationType:$locationType,
            siteStatus:$siteStatus,
            slope:$slope,
            topography:$topography,
            addObservationUnits: $addObservationUnits,
            addStudies: $addStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation addLocation(
          ${qvariables}
          ) { addLocation(
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
    let check = checkResponse(response, graphqlErrors, "addLocation");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addLocation"]
        || typeof response.data.data["addLocation"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addLocation"];
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
   * Update Location item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Location item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $locationDbId:ID!,
          $abbreviation:String,
          $coordinateDescription:String,
          $countryCode:String,
          $countryName:String,
          $documentationURL:String,
          $environmentType:String,
          $exposure:String,
          $instituteAddress:String,
          $instituteName:String,
          $locationName:String,
          $locationType:String,
          $siteStatus:String,
          $slope:String,
          $topography:String,
          $addObservationUnits: [ID],
          $removeObservationUnits: [ID],
          $addStudies: [ID],
          $removeStudies: [ID],
`;

    //set parameters assignation
    let qparameters = `
            locationDbId:$locationDbId,
            abbreviation: $abbreviation,
            coordinateDescription: $coordinateDescription,
            countryCode: $countryCode,
            countryName: $countryName,
            documentationURL: $documentationURL,
            environmentType: $environmentType,
            exposure: $exposure,
            instituteAddress: $instituteAddress,
            instituteName: $instituteName,
            locationName: $locationName,
            locationType: $locationType,
            siteStatus: $siteStatus,
            slope: $slope,
            topography: $topography,
            addObservationUnits: $addObservationUnits,
            removeObservationUnits: $removeObservationUnits,
            addStudies: $addStudies,
            removeStudies: $removeStudies,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation updateLocation(
          ${qvariables}
          ) { updateLocation(
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
    let check = checkResponse(response, graphqlErrors, "updateLocation");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateLocation"]
        || typeof response.data.data["updateLocation"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateLocation"];
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
   * @param {Object} variables Object with values needed to delete the Location item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteLocation(
              $locationDbId:ID!
        ) { deleteLocation(
              locationDbId:$locationDbId        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteLocation");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteLocation"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteLocation"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getObservationUnits   *
   * Get observationUnits records associated to the given location record
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

    variables["locationDbId"] = itemId;
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
      `query readOneLocation($locationDbId:ID!, $search: searchObservationUnitInput, $pagination: paginationCursorInput!) {
             readOneLocation(locationDbId:$locationDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneLocation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneLocation"]
      || typeof response.data.data["readOneLocation"] !== 'object'
      || !response.data.data["readOneLocation"]["observationUnitsConnection"]
      || typeof response.data.data["readOneLocation"]["observationUnitsConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneLocation"]["observationUnitsConnection"].edges)
      || typeof response.data.data["readOneLocation"]["observationUnitsConnection"].pageInfo !== 'object' 
      || response.data.data["readOneLocation"]["observationUnitsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneLocation"]["observationUnitsConnection"];
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
   * Get observationUnits records count associated to the given location record
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

    let variables = {"locationDbId": itemId};
    //search
    let s = getSearchArgument('observationUnit', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneLocation($locationDbId:ID!, $search: searchObservationUnitInput) { 
             readOneLocation(locationDbId:$locationDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneLocation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneLocation"]
      || typeof response.data.data["readOneLocation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneLocation"]["countFilteredObservationUnits"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneLocation"]["countFilteredObservationUnits"];
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
    let f1 = {field: "locationDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "locationDbId", valueType: "String", value: null, operator: "eq"};
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
    let f1 = {field: "locationDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "locationDbId", valueType: "String", value: null, operator: "eq"};
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
   * getStudies   *
   * Get studies records associated to the given location record
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

    variables["locationDbId"] = itemId;
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
      `query readOneLocation($locationDbId:ID!, $search: searchStudyInput, $pagination: paginationCursorInput!) {
             readOneLocation(locationDbId:$locationDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneLocation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneLocation"]
      || typeof response.data.data["readOneLocation"] !== 'object'
      || !response.data.data["readOneLocation"]["studiesConnection"]
      || typeof response.data.data["readOneLocation"]["studiesConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneLocation"]["studiesConnection"].edges)
      || typeof response.data.data["readOneLocation"]["studiesConnection"].pageInfo !== 'object' 
      || response.data.data["readOneLocation"]["studiesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneLocation"]["studiesConnection"];
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
   * Get studies records count associated to the given location record
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

    let variables = {"locationDbId": itemId};
    //search
    let s = getSearchArgument('study', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneLocation($locationDbId:ID!, $search: searchStudyInput) { 
             readOneLocation(locationDbId:$locationDbId) {
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
    let check = checkResponse(response, graphqlErrors, "readOneLocation");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneLocation"]
      || typeof response.data.data["readOneLocation"] !== 'object'
      || !Number.isInteger(response.data.data["readOneLocation"]["countFilteredStudies"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneLocation"]["countFilteredStudies"];
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
    let f1 = {field: "locationDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "locationDbId", valueType: "String", value: null, operator: "eq"};
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
    let f1 = {field: "locationDbId", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "locationDbId", valueType: "String", value: null, operator: "eq"};
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
          `query locationsConnection($pagination: paginationCursorInput!) {
                 locationsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "locationsConnection");
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

