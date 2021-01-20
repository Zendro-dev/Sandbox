/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sPARefactor = require(path.join(__dirname, '..', 'models', 'index.js')).sPARefactor;
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
sPARefactor.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];


    await Promise.all(promises_add);
    let promises_remove = [];


    await Promise.all(promises_remove);

}


/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let sPARefactor = await resolvers.readOneSPARefactor({
        string: id
    }, context);
    //check that record actually exists
    if (sPARefactor === null) throw new Error(`Record with ID = ${id} does not exist`);
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
        throw new Error(`SPARefactor with string ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * sPARefactors - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    sPARefactors: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "sPARefactors");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sPARefactor.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * sPARefactorsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    sPARefactorsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "sPARefactorsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sPARefactor.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSPARefactor - Check user authorization and return one record with the specified string in the string argument.
     *
     * @param  {number} {string}    string of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with string requested
     */
    readOneSPARefactor: async function({
        string
    }, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSPARefactor");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sPARefactor.readById(string, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSPARefactors - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSPARefactors: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sPARefactor.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSPARefactor - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSPARefactor: async function(_, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            return helper.vueTable(context.request, sPARefactor, ["id", "string"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSPARefactor - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSPARefactor: async function(input, context) {
        let authorization = await checkAuthorization(context, 'SPARefactor', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSPARefactor = await sPARefactor.addOne(inputSanitized, benignErrorReporter);
            await createdSPARefactor.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSPARefactor;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSPARefactorCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSPARefactorCsv: async function(_, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sPARefactor.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSPARefactor - Check user authorization and delete a record with the specified string in the string argument.
     *
     * @param  {number} {string}    string of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSPARefactor: async function({
        string
    }, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'delete') === true) {
            if (await validForDeletion(string, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sPARefactor.deleteOne(string, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSPARefactor - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSPARefactor: async function(input, context) {
        let authorization = await checkAuthorization(context, 'SPARefactor', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSPARefactor = await sPARefactor.updateOne(inputSanitized, benignErrorReporter);
            await updatedSPARefactor.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSPARefactor;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateSPARefactor - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSPARefactor: async function(_, context) {
        if (await checkAuthorization(context, 'SPARefactor', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sPARefactor.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}