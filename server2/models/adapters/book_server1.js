const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://cassandra_test_box_gql_1:3000/graphql";
const iriRegex = new RegExp('server1');

module.exports = class book_server1 {

    static get adapterName() {
        return 'book_server1';
    }

    static get adapterType() {
        return 'ddm-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(iri, benignErrorReporter) {
        let query = `
          query
            readOneBook
            {
              readOneBook(book_id:"${iri}")
              {
                book_id 
                title 
                author_id 
              }
            }`;

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.readOneBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `
      query countBooks($search: searchBookInput){
        countBooks(search: $search)
      }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search
                }
            });

            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.countBooks;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        let query = `query booksConnection($search: searchBookInput $pagination: paginationCursorInput! $order: [orderBookInput]){
      booksConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  book_id  title
         author_id
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data && response.data.data.booksConnection !== null) {
                return response.data.data.booksConnection;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async addOne(input, benignErrorReporter) {
        let query = `
          mutation addBook(
              $book_id:ID!  
            $title:String          ){
            addBook(            book_id:$book_id  
            title:$title){
              book_id                title
                author_id
              }
          }`;

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.addBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async deleteOne(id, benignErrorReporter) {
        let query = `
          mutation
            deleteBook{
              deleteBook(
                book_id: "${id}" )}`;


        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.deleteBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async updateOne(input, benignErrorReporter) {
        let query = `
          mutation
            updateBook(
              $book_id:ID! 
              $title:String             ){
              updateBook(
                book_id:$book_id 
                title:$title               ){
                book_id 
                title 
                author_id 
              }
            }`


        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.updateBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_author_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   author_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services   
     */

    static async add_author_id(book_id, author_id, benignErrorReporter) {
        let query = `
              mutation
                updateBook{
                  updateBook(
                    book_id:"${book_id}"
                    addAuthor:"${author_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    book_id                    author_id                  }
                }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.updateBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * remove_author_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   author_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services   
     */

    static async remove_author_id(book_id, author_id, benignErrorReporter) {
        let query = `
              mutation
                updateBook{
                  updateBook(
                    book_id:"${book_id}"
                    removeAuthor:"${author_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    book_id                    author_id                  }
                }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.updateBook;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }






    static bulkAddCsv(context) {
        throw new Error("book.bulkAddCsv is not implemented.")
    }

    static async csvTableTemplate(benignErrorReporter) {
        let query = `query { csvTableTemplateBook }`;

        try {
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.csvTableTemplateBook;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * bulkAssociateBookWithAuthor_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateBookWithAuthor_id(bulkAssociationInput, benignErrorReporter) {
        let query = `mutation  bulkAssociateBookWithAuthor_id($bulkAssociationInput: [bulkAssociationBookWithAuthor_idInput]){
          bulkAssociateBookWithAuthor_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
        }`
        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    bulkAssociationInput: bulkAssociationInput
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send

            if (response && response.data && response.data.data) {
                return response.data.data.bulkAssociateBookWithAuthor_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * bulkDisAssociateBookWithAuthor_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateBookWithAuthor_id(bulkAssociationInput, benignErrorReporter) {
        let query = `mutation  bulkDisAssociateBookWithAuthor_id($bulkAssociationInput: [bulkAssociationBookWithAuthor_idInput]){
          bulkDisAssociateBookWithAuthor_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
        }`
        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    bulkAssociationInput: bulkAssociationInput
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send

            if (response && response.data && response.data.data) {
                return response.data.data.bulkDisAssociateBookWithAuthor_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


}