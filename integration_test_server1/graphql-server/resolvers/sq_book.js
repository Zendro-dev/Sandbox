/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sq_book = require(path.join(__dirname, '..', 'models', 'index.js')).sq_book;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addAuthors': 'sq_author'
}




/**
 * sq_book.prototype.authorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sq_book.prototype.authorsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.author_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.sq_author.idAttribute(),
            "value": this.author_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.sq_authors({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * sq_book.prototype.countFilteredAuthors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sq_book.prototype.countFilteredAuthors = function({
    search
}, context) {


    if (this.author_ids.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sq_author.idAttribute(),
        "value": this.author_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countSq_authors({
        search: nsearch
    }, context);
}

/**
 * sq_book.prototype.authorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sq_book.prototype.authorsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.author_ids.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.sq_author.idAttribute(),
            "value": this.author_ids.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.sq_authorsConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sq_book.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addAuthors)) {
        promises.push(this.add_authors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAuthors)) {
        promises.push(this.remove_authors(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_authors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sq_book.prototype.add_authors = async function(input, benignErrorReporter) {

    await sq_book.add_author_ids(this.getIdValue(), input.addAuthors, benignErrorReporter);
    this.author_ids = helper.unionIds(this.author_ids, input.addAuthors);
}

/**
 * remove_authors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sq_book.prototype.remove_authors = async function(input, benignErrorReporter) {

    await sq_book.remove_author_ids(this.getIdValue(), input.removeAuthors, benignErrorReporter);
    this.author_ids = helper.differenceIds(this.author_ids, input.removeAuthors);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let sq_book = await resolvers.readOneSq_book({
        id: id
    }, context);
    //check that record actually exists
    if (sq_book === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(sq_book.countFilteredAuthors({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAllAssociatedRecords(id, context) > 0) {
        throw new Error(`sq_book with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * sq_books - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    sq_books: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "sq_books");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sq_book.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * sq_booksConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    sq_booksConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "sq_booksConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sq_book.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSq_book - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSq_book: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSq_book");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sq_book.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSq_books - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSq_books: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sq_book.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSq_book - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSq_book: async function(_, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            return helper.vueTable(context.request, sq_book, ["id", "id", "title", "genre", "ISBN"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSq_book - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSq_book: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sq_book', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSq_book = await sq_book.addOne(inputSanitized, benignErrorReporter);
            await createdSq_book.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSq_book;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSq_bookCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSq_bookCsv: async function(_, context) {
        if (await checkAuthorization(context, 'sq_book', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sq_book.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSq_book - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSq_book: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sq_book', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sq_book.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSq_book - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSq_book: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sq_book', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSq_book = await sq_book.updateOne(inputSanitized, benignErrorReporter);
            await updatedSq_book.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSq_book;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateSq_book - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSq_book: async function(_, context) {
        if (await checkAuthorization(context, 'sq_book', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sq_book.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}