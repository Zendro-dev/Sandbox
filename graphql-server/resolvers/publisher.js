/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const publisher = require(path.join(__dirname, '..', 'models', 'index.js')).publisher;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addBooks': 'book'
}



/**
 * publisher.prototype.countFilteredBooks - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
publisher.prototype.countFilteredBooks = async function({
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
    const res = await resolvers.countBooks({
        search: nsearch
    }, context);
    const measuredTime = (new Date()) - startTime
    console.log(`countFilteredBooks*publisher&${this.getIdValue().slice(0, 9)}:`, measuredTime)
    return res
}


/**
 * publisher.prototype.booksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
publisher.prototype.booksConnection = async function({
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
    const res = await resolvers.booksConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
    const measuredTime = (new Date()) - startTime
    console.log(`booksConnection*publisher&${this.getIdValue().slice(0, 9)}:`, measuredTime)
    return res
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
publisher.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
publisher.prototype.add_books = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addBooks.map(associatedRecordId => {
        return {
            publisher_id: this.getIdValue(),
            [models.book.idAttribute()]: associatedRecordId
        }
    });
    await models.book.bulkAssociateBookWithPublisher_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_books - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
publisher.prototype.remove_books = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeBooks.map(associatedRecordId => {
        return {
            publisher_id: this.getIdValue(),
            [models.book.idAttribute()]: associatedRecordId
        }
    });
    await models.book.bulkDisAssociateBookWithPublisher_id(bulkAssociationInput, benignErrorReporter);
}


/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let publisher = await resolvers.readOnePublisher({
        publisher_id: id
    }, context);
    //check that record actually exists
    if (publisher === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(publisher.countFilteredBooks({}, context));

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
        throw new Error(`publisher with publisher_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }

    if (context.benignErrors.length > 0) {
        throw new Error('Errors occurred when counting associated records. No deletion permitted for reasons of security.');
    }

    return true;
}

module.exports = {

    /**
     * publishersConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    publishersConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "publishersConnection");

        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        //check: adapters
        let registeredAdapters = Object.values(publisher.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "publisher"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "publisher"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await publisher.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "publisher" ');
            }
        }
    },


    /**
     * readOnePublisher - Check user authorization and return one record with the specified publisher_id in the publisher_id argument.
     *
     * @param  {number} {publisher_id}    publisher_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with publisher_id requested
     */
    readOnePublisher: async function({
        publisher_id
    }, context) {
        const startTime = new Date()
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, publisher.adapterForIri(publisher_id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOnePublisher");
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            const res = await publisher.readById(publisher_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            if (!context['field']){
                console.log(`readOnePublisher&${publisher_id.slice(0, 9)}:`, measuredTime)
            }
            return res
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addPublisher - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPublisher: async function(input, context) {
        //check: input has idAttribute
        if (!input.publisher_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'publisher_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, publisher.adapterForIri(input.publisher_id), 'create');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            let createdRecord = await publisher.addOne(inputSanitized, benignErrorReporter);
            await createdRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },


    /**
     * bulkAddPublisherCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPublisherCsv: async function(_, context) {
        if (await checkAuthorization(context, 'publisher', 'create') === true) {
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return publisher.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deletePublisher - Check user authorization and delete a record with the specified publisher_id in the publisher_id argument.
     *
     * @param  {number} {publisher_id}    publisher_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePublisher: async function({
        publisher_id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, publisher.adapterForIri(publisher_id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(publisher_id, context)) {
                //construct benignErrors reporter with context
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return publisher.deleteOne(publisher_id, benignErrorReporter);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updatePublisher - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePublisher: async function(input, context) {
        //check: input has idAttribute
        if (!input.publisher_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'publisher_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, publisher.adapterForIri(input.publisher_id), 'update');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRecord = await publisher.updateOne(inputSanitized, benignErrorReporter);
            await updatedRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countPublishers - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countPublishers: async function({
        search
    }, context) {
        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

        //check: adapters
        let registeredAdapters = Object.values(publisher.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "publisher"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "publisher"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await publisher.countRecords(search, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "publisher"');
            }
        }
    },


    /**
     * csvTableTemplatePublisher - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePublisher: async function(_, context) {
        if (await checkAuthorization(context, 'publisher', 'read') === true) {
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return publisher.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}