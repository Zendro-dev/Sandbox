/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const local_publisher = require(path.join(__dirname, '..', 'models', 'index.js')).local_publisher;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addBooks': 'local_book'
}




/**
 * local_publisher.prototype.booksFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
local_publisher.prototype.booksFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "publisher_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.local_books({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * local_publisher.prototype.countFilteredBooks - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
local_publisher.prototype.countFilteredBooks = async function({
    search
}, context) {
    const startTime = new Date()
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "publisher_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    const res = await resolvers.countLocal_books({
        search: nsearch
    }, context);
    const measuredTime = (new Date()) - startTime
    console.log('countFilteredBooks*local_publisher:', measuredTime)
    return res
}

/**
 * local_publisher.prototype.booksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
local_publisher.prototype.booksConnection = async function({
    search,
    order,
    pagination
}, context) {
    const startTime = new Date()

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "publisher_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    const res = await resolvers.local_booksConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
    const measuredTime = (new Date()) - startTime
    console.log('booksConnection*local_publisher:', measuredTime)
    return res
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_publisher.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
local_publisher.prototype.add_books = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addBooks.map(associatedRecordId => {
        return {
            publisher_id: this.getIdValue(),
            [models.local_book.idAttribute()]: associatedRecordId
        }
    });
    await models.local_book.bulkAssociateLocal_bookWithPublisher_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_books - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_publisher.prototype.remove_books = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeBooks.map(associatedRecordId => {
        return {
            publisher_id: this.getIdValue(),
            [models.local_book.idAttribute()]: associatedRecordId
        }
    });
    await models.local_book.bulkDisAssociateLocal_bookWithPublisher_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let local_publisher = await resolvers.readOneLocal_publisher({
        publisher_id: id
    }, context);
    //check that record actually exists
    if (local_publisher === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(local_publisher.countFilteredBooks({}, context));

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
        throw new Error(`local_publisher with publisher_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * local_publishers - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    local_publishers: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "local_publishers");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_publisher.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * local_publishersConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    local_publishersConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "local_publishersConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_publisher.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneLocal_publisher - Check user authorization and return one record with the specified publisher_id in the publisher_id argument.
     *
     * @param  {number} {publisher_id}    publisher_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with publisher_id requested
     */
    readOneLocal_publisher: async function({
        publisher_id
    }, context) {
        const startTime = new Date()
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneLocal_publisher");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            const res = await local_publisher.readById(publisher_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            if (!context['field']){
                console.log('readOneLocal_publisher:', measuredTime)
            }
            return res
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countLocal_publishers - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countLocal_publishers: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_publisher.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableLocal_publisher - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableLocal_publisher: async function(_, context) {
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            return helper.vueTable(context.request, local_publisher, ["id", "publisher_id", "name"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addLocal_publisher - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addLocal_publisher: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_publisher', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdLocal_publisher = await local_publisher.addOne(inputSanitized, benignErrorReporter);
            await createdLocal_publisher.handleAssociations(inputSanitized, benignErrorReporter);
            return createdLocal_publisher;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddLocal_publisherCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddLocal_publisherCsv: async function(_, context) {
        if (await checkAuthorization(context, 'local_publisher', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_publisher.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteLocal_publisher - Check user authorization and delete a record with the specified publisher_id in the publisher_id argument.
     *
     * @param  {number} {publisher_id}    publisher_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteLocal_publisher: async function({
        publisher_id
    }, context) {
        if (await checkAuthorization(context, 'local_publisher', 'delete') === true) {
            if (await validForDeletion(publisher_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return local_publisher.deleteOne(publisher_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateLocal_publisher - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateLocal_publisher: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_publisher', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedLocal_publisher = await local_publisher.updateOne(inputSanitized, benignErrorReporter);
            await updatedLocal_publisher.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedLocal_publisher;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateLocal_publisher - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateLocal_publisher: async function(_, context) {
        if (await checkAuthorization(context, 'local_publisher', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_publisher.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}