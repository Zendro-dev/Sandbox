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
   * Get booktable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateBook}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateBook");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateBook"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateBook"];
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
   * Get booksitems count from GraphQL Server.
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
    let s = getSearchArgument('book', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countBooks($search: searchBookInput) { 
             countBooks( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countBooks");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countBooks"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countBooks"];
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
    let s = getSearchArgument('book', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `book_id,
       name,
       fk_books_authors,
`;

    //query
    let query =
      `query booksConnection($order: [orderBookInput], $search: searchBookInput, $pagination: paginationCursorInput!) { 
             booksConnection( order: $order, search: $search, pagination: $pagination ) {
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
    let check = checkResponse(response, graphqlErrors, "booksConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["booksConnection"]
      || typeof response.data.data["booksConnection"] !== 'object'
      || !Array.isArray(response.data.data["booksConnection"].edges)
      || typeof response.data.data["booksConnection"].pageInfo !== 'object' 
      || response.data.data["booksConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["booksConnection"];
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
   * Add new Book item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Book item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $book_id:ID!,
          $name:String,
          $addBooks: ID,
`;

    //set parameters assignation
    let qparameters = `
            book_id:$book_id,
            name:$name,
            addBooks: $addBooks,
`;

    //set attributes to fetch
    let qattributes = 
      `book_id,
       name,
       fk_books_authors,
`;

    //query
    let query =
      `mutation addBook(
          ${qvariables}
          ) { addBook(
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
    let check = checkResponse(response, graphqlErrors, "addBook");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addBook"]
        || typeof response.data.data["addBook"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addBook"];
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
   * Update Book item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Book item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $book_id:ID!,
          $name:String,
          $addBooks: ID,
          $removeBooks: ID,
`;

    //set parameters assignation
    let qparameters = `
            book_id:$book_id,
            name: $name,
            addBooks: $addBooks,
            removeBooks: $removeBooks,
`;

    //set attributes to fetch
    let qattributes = 
      `book_id,
       name,
       fk_books_authors,
`;

    //query
    let query =
      `mutation updateBook(
          ${qvariables}
          ) { updateBook(
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
    let check = checkResponse(response, graphqlErrors, "updateBook");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateBook"]
        || typeof response.data.data["updateBook"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateBook"];
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
   * @param {Object} variables Object with values needed to delete the Book item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteBook(
              $book_id:ID!
        ) { deleteBook(
              book_id:$book_id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteBook");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteBook"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteBook"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getBooks   *
   * Get authors records associated to the given book record
   * through association 'Books', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getBooks(url, itemId, searchText, variables, ops) {
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `author_id,
     name,
`;

    variables = { "book_id": itemId };
    //set query
    let query = 
      `query readOneBook($book_id:ID!) {
             readOneBook(book_id:$book_id) {
                books{
                  ${qattributes}
                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getBooks', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneBook");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneBook"]
      || typeof response.data.data["readOneBook"] !== 'object'
      || typeof response.data.data["readOneBook"]["books"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneBook"]["books"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: associatedItem, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },



/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedBooksCount
   *
   * Get count of not associated Books from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedBooksCount(url, itemId, searchText, ops) {
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
    let variables = {"book_id": itemId};
    let query = 
      `query readOneBook($book_id:ID!) {
             readOneBook(book_id:$book_id) {
                books{
                  author_id                }
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedBooksCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneBook");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneBook"]
      || typeof response.data.data["readOneBook"] !== 'object'
      || typeof response.data.data["readOneBook"]["books"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneBook"]["books"];
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
    let s = getSearchArgument('author', searchText, ops, 'object');
    if(s) {
      if(associatedItem) {
        //make filter to exclude associated item
        let f1 = {field: "author_id", valueType: "String", value: associatedItem["author_id"], operator: "ne"};
        //add new filter to ands array
        s.search.search.push(f1)        
      }
      //set search
      variables.search = s.search;
    }
    //set query
    query = 
      `query countAuthors($search: searchAuthorInput) {
             countAuthors(search: $search) }
      `;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedBooksCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    check = checkResponse(response, graphqlErrors, "countAuthors");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countAuthors"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countAuthors"];
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
 * getNotAssociatedBooks
 *
 * Get not associated Books items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedBooks(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `author_id,
     name,
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
      `{  readOneBook(book_id: "${itemId}") {
            books{
              author_id            }
          }
        }`;
     /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedBooks.query1', query);
    //request
    let response = await requestGraphql({ url, query });
    let associatedItem = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneBook");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneBook"]
      || typeof response.data.data["readOneBook"] !== 'object'
      || typeof response.data.data["readOneBook"]["books"] !== 'object' //can be null
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      associatedItem = response.data.data["readOneBook"]["books"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get all items exluding associated item if there is one.
     * 
     */
    //make filter to exclude associated item
    let f1 = null;
    if(associatedItem) f1 = {field: "author_id", valueType: "String", value: associatedItem["author_id"], operator: "ne"};

    //search
    let s = getSearchArgument('author', searchText, ops, 'object');
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
      `query authorsConnection($search: searchAuthorInput, $pagination: paginationCursorInput!) {
             authorsConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedBooks.query2', query, variables);

    //request
    response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    check = checkResponse(response, graphqlErrors, "authorsConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["authorsConnection"]
      || typeof response.data.data["authorsConnection"] !== 'object'
      || !Array.isArray(response.data.data["authorsConnection"].edges)
      || typeof response.data.data["authorsConnection"].pageInfo !== 'object' 
      || response.data.data["authorsConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["authorsConnection"];
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
          `query booksConnection($pagination: paginationCursorInput!) {
                 booksConnection(pagination: $pagination) {
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
      let check = checkResponse(response, graphqlErrors, "booksConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["booksConnection"]
        || typeof response.data.data["booksConnection"] !== 'object'
        || !Array.isArray(response.data.data["booksConnection"].edges)
        || typeof response.data.data["booksConnection"].pageInfo !== 'object' 
        || response.data.data["booksConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["booksConnection"];
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

