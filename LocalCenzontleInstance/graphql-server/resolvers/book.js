/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const book = require(path.join(__dirname, '..', 'models_index.js')).book;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');



/**
 * book.prototype.author - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
book.prototype.author = function({
    search
}, context) {
    try {
        return this.authorImpl(search);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}


module.exports = {

    /**
     * booksConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    booksConnection: async function({
        search,
        order,
        pagination
    }, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: booksConnection");

        //check: adapters
        let registeredAdapters = Object.values(book.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "Book"');
        } //else

        try {
            //exclude adapters
            let adapters = await helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "Book"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {
                let connectionObj = book.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters);
                if (authorizationCheck.authorizationErrors.length > 0) {
                    connectionObj.edges.nodes.push(authorizationCheck.authorizationErrors);
                }
                return connectionObj;
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "Book" ');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },


    /**
     * readOneBook - Check user authorization and return one record with the specified internalBookId in the internalBookId argument.
     *
     * @param  {number} {internalBookId}    internalBookId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with internalBookId requested
     */
    readOneBook: async function({
        internalBookId
    }, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: readOneBook");

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, book.adapterForIri(internalBookId), 'read');
            if (authorizationCheck === true) {
                return book.readById(internalBookId);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * addBook - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addBook: async function(input, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: addBook");

        //check: input has idAttribute
        if (!input.internalBookId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'internalBookId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, book.adapterForIri(input.internalBookId), 'create');
            if (authorizationCheck === true) {
                return book.addOne(input);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },


    /**
     * bulkAddBookCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddBookCsv: function(_, context) {
        return checkAuthorization(context, 'Book', 'create').then(authorization => {
            if (authorization === true) {
                return book.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteBook - Check user authorization and delete a record with the specified internalBookId in the internalBookId argument.
     *
     * @param  {number} {internalBookId}    internalBookId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteBook: async function({
        internalBookId
    }, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: deleteBook");

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, book.adapterForIri(internalBookId), 'delete');
            if (authorizationCheck === true) {
                return book.deleteOne(internalBookId);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * updateBook - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateBook: async function(input, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: updateBook");

        //check: input has idAttribute
        if (!input.internalBookId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'internalBookId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, book.adapterForIri(input.internalBookId), 'update');
            if (authorizationCheck === true) {
                return book.updateOne(input);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * countBooks - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countBooks: async function({
        search
    }, context) {
        /**
         * Debug
         */
        console.log("\n-@--resolver: on: countBook");

        //check: adapters
        let registeredAdapters = Object.values(book.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "Book"');
        } //else

        try {
            //exclude adapters
            let adapters = await helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "Book"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {
                return book.countRecords(search, authorizationCheck.authorizedAdapters);
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "Book"');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateBook - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateBook: function(_, context) {
        return checkAuthorization(context, 'Book', 'read').then(authorization => {
            if (authorization === true) {
                return book.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}