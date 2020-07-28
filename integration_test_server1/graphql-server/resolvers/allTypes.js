/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const allTypes = require(path.join(__dirname, '..', 'models', 'index.js')).allTypes;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {}








/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
allTypes.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];



    await Promise.all(promises);
}



/**
 * checkCountAndReduceRecordsLimit({search, pagination}, context, resolverName, modelName) - Make sure that the current
 * set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} {search}  Search argument for filtering records
 * @param {object} {pagination}  If limit-offset pagination, this object will include 'offset' and 'limit' properties
 * to get the records from and to respectively. If cursor-based pagination, this object will include 'first' or 'last'
 * properties to indicate the number of records to fetch, and 'after' or 'before' cursors to indicate from which record
 * to start fetching.
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit({
    search,
    pagination
}, context, resolverName, modelName = 'allTypes') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["record_id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "record_id", inputPaginationValues);
    //get records count
    let count = (await models[modelName].countRecords(paginationValues.search));
    //get effective records count
    let effectiveCount = helper.getEffectiveRecordsCount(count, paginationValues.limit, paginationValues.offset);
    //do check and reduce of record limit.
    helper.checkCountAndReduceRecordLimitHelper(effectiveCount, context, resolverName);
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneAllTypes")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let allTypes = await resolvers.readOneAllTypes({
        record_id: id
    }, context);
    //check that record actually exists
    if (allTypes === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];


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
        throw new Error(`AllTypes with record_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * allTypes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    allTypes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "allTypes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await allTypes.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * allTypesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    allTypesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "allTypesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await allTypes.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAllTypes - Check user authorization and return one record with the specified record_id in the record_id argument.
     *
     * @param  {number} {record_id}    record_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with record_id requested
     */
    readOneAllTypes: async function({
        record_id
    }, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await allTypes.readById(record_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countAllTypes - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAllTypes: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await allTypes.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableAllTypes - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAllTypes: async function(_, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            return helper.vueTable(context.request, allTypes, ["id", "record_id", "record_string"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addAllTypes - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAllTypes: async function(input, context) {
      console.log("RESOLVER INPUT", input);
        let authorization = await checkAuthorization(context, 'AllTypes', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAllTypes = await allTypes.addOne(inputSanitized, benignErrorReporter);
            await createdAllTypes.handleAssociations(inputSanitized, benignErrorReporter);
            return createdAllTypes;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddAllTypesCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAllTypesCsv: async function(_, context) {
        if (await checkAuthorization(context, 'AllTypes', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return allTypes.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAllTypes - Check user authorization and delete a record with the specified record_id in the record_id argument.
     *
     * @param  {number} {record_id}    record_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAllTypes: async function({
        record_id
    }, context) {
        if (await checkAuthorization(context, 'AllTypes', 'delete') === true) {
            if (await validForDeletion(record_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return allTypes.deleteOne(record_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateAllTypes - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAllTypes: async function(input, context) {
        let authorization = await checkAuthorization(context, 'AllTypes', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAllTypes = await allTypes.updateOne(inputSanitized, benignErrorReporter);
            await updatedAllTypes.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedAllTypes;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateAllTypes - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAllTypes: async function(_, context) {
        if (await checkAuthorization(context, 'AllTypes', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return allTypes.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}
