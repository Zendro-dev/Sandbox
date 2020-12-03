/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const post_author = require(path.join(__dirname, '..', 'models', 'index.js')).post_author;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addBooks': 'post_book'
}




/**
 * post_author.prototype.booksFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
post_author.prototype.booksFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.post_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.post_books({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * post_author.prototype.countFilteredBooks - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
post_author.prototype.countFilteredBooks = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.post_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countPost_books({
        search: nsearch
    }, context);
}

/**
 * post_author.prototype.booksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
post_author.prototype.booksConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.post_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.post_booksConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
post_author.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addBooks)) {
        promises_add.push(this.add_books(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeBooks)) {
        promises_remove.push(this.remove_books(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_books - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
post_author.prototype.add_books = async function(input, benignErrorReporter) {

    await post_author.add_book_ids(this.getIdValue(), input.addBooks, benignErrorReporter);
    this.book_ids = helper.unionIds(this.book_ids, input.addBooks);
}

/**
 * remove_books - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
post_author.prototype.remove_books = async function(input, benignErrorReporter) {

    await post_author.remove_book_ids(this.getIdValue(), input.removeBooks, benignErrorReporter);
    this.book_ids = helper.differenceIds(this.book_ids, input.removeBooks);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let post_author = await resolvers.readOnePost_author({
        id: id
    }, context);
    //check that record actually exists
    if (post_author === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(post_author.countFilteredBooks({}, context));

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
        throw new Error(`post_author with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * post_authors - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    post_authors: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "post_authors");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await post_author.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * post_authorsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    post_authorsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "post_authorsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await post_author.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOnePost_author - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOnePost_author: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOnePost_author");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await post_author.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countPost_authors - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPost_authors: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await post_author.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTablePost_author - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTablePost_author: async function(_, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            return helper.vueTable(context.request, post_author, ["id", "id", "name", "lastname", "email"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addPost_author - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPost_author: async function(input, context) {
        let authorization = await checkAuthorization(context, 'post_author', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdPost_author = await post_author.addOne(inputSanitized, benignErrorReporter);
            await createdPost_author.handleAssociations(inputSanitized, benignErrorReporter);
            return createdPost_author;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddPost_authorCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPost_authorCsv: async function(_, context) {
        if (await checkAuthorization(context, 'post_author', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return post_author.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deletePost_author - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePost_author: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'post_author', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return post_author.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updatePost_author - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePost_author: async function(input, context) {
        let authorization = await checkAuthorization(context, 'post_author', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedPost_author = await post_author.updateOne(inputSanitized, benignErrorReporter);
            await updatedPost_author.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedPost_author;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplatePost_author - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePost_author: async function(_, context) {
        if (await checkAuthorization(context, 'post_author', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return post_author.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}