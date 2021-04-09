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
   * Get taxontable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateTaxon}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateTaxon");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateTaxon"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateTaxon"];
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
   * Get taxonsitems count from GraphQL Server.
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
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countTaxons($search: searchTaxonInput) { 
             countTaxons( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countTaxons");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countTaxons"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countTaxons"];
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
    let s = getSearchArgument('taxon', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

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

    //query
    let query =
      `query taxonsConnection($order: [orderTaxonInput], $search: searchTaxonInput, $pagination: paginationCursorInput!) { 
             taxonsConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "taxonsConnection");
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
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new Taxon item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Taxon item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $taxon:String,
          $categoria:String,
          $estatus:String,
          $nombreAutoridad:String,
          $citaNomenclatural:String,
          $fuente:String,
          $ambiente:String,
          $grupoSNIB:String,
          $categoriaResidencia:String,
          $nom:String,
          $cites:String,
          $iucn:String,
          $prioritarias:String,
          $endemismo:String,
          $categoriaSorter:String,
          $bibliografia:[String],
          $addAlimentos: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            taxon:$taxon,
            categoria:$categoria,
            estatus:$estatus,
            nombreAutoridad:$nombreAutoridad,
            citaNomenclatural:$citaNomenclatural,
            fuente:$fuente,
            ambiente:$ambiente,
            grupoSNIB:$grupoSNIB,
            categoriaResidencia:$categoriaResidencia,
            nom:$nom,
            cites:$cites,
            iucn:$iucn,
            prioritarias:$prioritarias,
            endemismo:$endemismo,
            categoriaSorter:$categoriaSorter,
            bibliografia:$bibliografia,
            addAlimentos: $addAlimentos,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation addTaxon(
          ${qvariables}
          ) { addTaxon(
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
    let check = checkResponse(response, graphqlErrors, "addTaxon");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addTaxon"]
        || typeof response.data.data["addTaxon"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addTaxon"];
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
   * Update Taxon item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Taxon item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $taxon:String,
          $categoria:String,
          $estatus:String,
          $nombreAutoridad:String,
          $citaNomenclatural:String,
          $fuente:String,
          $ambiente:String,
          $grupoSNIB:String,
          $categoriaResidencia:String,
          $nom:String,
          $cites:String,
          $iucn:String,
          $prioritarias:String,
          $endemismo:String,
          $categoriaSorter:String,
          $bibliografia:[String],
          $addAlimentos: [ID],
          $removeAlimentos: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            taxon: $taxon,
            categoria: $categoria,
            estatus: $estatus,
            nombreAutoridad: $nombreAutoridad,
            citaNomenclatural: $citaNomenclatural,
            fuente: $fuente,
            ambiente: $ambiente,
            grupoSNIB: $grupoSNIB,
            categoriaResidencia: $categoriaResidencia,
            nom: $nom,
            cites: $cites,
            iucn: $iucn,
            prioritarias: $prioritarias,
            endemismo: $endemismo,
            categoriaSorter: $categoriaSorter,
            bibliografia: $bibliografia,
            addAlimentos: $addAlimentos,
            removeAlimentos: $removeAlimentos,
`;

    //set attributes to fetch
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

    //query
    let query =
      `mutation updateTaxon(
          ${qvariables}
          ) { updateTaxon(
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
    let check = checkResponse(response, graphqlErrors, "updateTaxon");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateTaxon"]
        || typeof response.data.data["updateTaxon"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateTaxon"];
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
   * @param {Object} variables Object with values needed to delete the Taxon item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteTaxon(
              $id:ID!
        ) { deleteTaxon(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteTaxon");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteTaxon"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteTaxon"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAlimentos   *
   * Get registros records associated to the given taxon record
   * through association 'Alimentos', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getAlimentos(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

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

    variables["id"] = itemId;
    //set search
    let s = getSearchArgument('registro', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneTaxon($id:ID!, $search: searchRegistroInput, $pagination: paginationCursorInput!) {
             readOneTaxon(id:$id) {
                alimentosConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAlimentos', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneTaxon");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneTaxon"]
      || typeof response.data.data["readOneTaxon"] !== 'object'
      || !response.data.data["readOneTaxon"]["alimentosConnection"]
      || typeof response.data.data["readOneTaxon"]["alimentosConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneTaxon"]["alimentosConnection"].edges)
      || typeof response.data.data["readOneTaxon"]["alimentosConnection"].pageInfo !== 'object' 
      || response.data.data["readOneTaxon"]["alimentosConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneTaxon"]["alimentosConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getAlimentosCount
   * 
   * Get registros records count associated to the given taxon record
   * through association 'Alimentos', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getAlimentosCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"id": itemId};
    //search
    let s = getSearchArgument('registro', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneTaxon($id:ID!, $search: searchRegistroInput) { 
             readOneTaxon(id:$id) {
              countFilteredAlimentos(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getAlimentosCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneTaxon");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneTaxon"]
      || typeof response.data.data["readOneTaxon"] !== 'object'
      || !Number.isInteger(response.data.data["readOneTaxon"]["countFilteredAlimentos"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneTaxon"]["countFilteredAlimentos"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedAlimentosCount
   *
   * Get count of not associated Alimentos from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedAlimentosCount(url, itemId, searchText, ops) {
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
    let s = getSearchArgument('registro', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "taxon_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "taxon_id", valueType: "String", value: null, operator: "eq"};
    let nf = {operator: "or", search: [ f1, f2 ]};
    
    //add new filter to ands array
    if(s) s.search.search.push(nf);
    else  s = {search: nf};

    //set search
    let variables = {search: s.search};

     //set query
    let query = 
     `query countRegistros($search: searchRegistroInput) {
            countRegistros(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAlimentosCount', query, variables);
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
 * Filter
 * ------
 */

/**
 * getNotAssociatedAlimentos
 *
 * Get not associated Alimentos items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedAlimentos(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

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
    /**
     * Algorithm:
     *    1. get a filtered items.
     *       filters:
     *          1.1: exclude itemId in association.targetKey field.
     *          1.2: include null values in association.targetKey field.  
     *    2. @return filtered items. 
     */
    //search
    let s = getSearchArgument('registro', searchText, ops, 'object');
  
    //make filter to exclude itemId on FK & include null's
    let f1 = {field: "taxon_id", valueType: "String", value: itemId, operator: "ne"};
    let f2 = {field: "taxon_id", valueType: "String", value: null, operator: "eq"};
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
      `query registrosConnection($search: searchRegistroInput, $pagination: paginationCursorInput!) {
             registrosConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedAlimentos', query, variables);

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
          `query taxonsConnection($pagination: paginationCursorInput!) {
                 taxonsConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "taxonsConnection");
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

