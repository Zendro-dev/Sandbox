/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const local_capital = require(path.join(__dirname, '..', 'models', 'index.js')).local_capital;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addLocal_country': 'local_country'
}



/**
 * local_capital.prototype.local_country - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
local_capital.prototype.local_country = async function({
    search
}, context) {
    const startTime = new Date()
    if (helper.isNotUndefinedAndNotNull(this.country_id)) {
        if (search === undefined || search === null) {
            context['field']=true
            const res = await resolvers.readOneLocal_country({
                [models.local_country.idAttribute()]: this.country_id
            }, context)
            const measuredTime = (new Date()) - startTime
            console.log('local_country*local_capital:', measuredTime)
            return res
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.local_country.idAttribute(),
                "value": this.country_id,
                "operator": "eq"
            });
            let found = (await resolvers.local_countriesConnection({
                search: nsearch,
                pagination: {
                    first: 1
                }
            }, context)).edges;
            if (found.length > 0) {
                return found[0].node
            }
            return found;
        }
    }
}





/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_capital.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addLocal_country)) {
        promises_add.push(this.add_local_country(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeLocal_country)) {
        promises_remove.push(this.remove_local_country(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_local_country - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_capital.prototype.add_local_country = async function(input, benignErrorReporter) {
    await local_capital.add_country_id(this.getIdValue(), input.addLocal_country, benignErrorReporter);
    this.country_id = input.addLocal_country;
}

/**
 * remove_local_country - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_capital.prototype.remove_local_country = async function(input, benignErrorReporter) {
    if (input.removeLocal_country == this.country_id) {
        await local_capital.remove_country_id(this.getIdValue(), input.removeLocal_country, benignErrorReporter);
        this.country_id = null;
    }
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let local_capital = await resolvers.readOneLocal_capital({
        capital_id: id
    }, context);
    //check that record actually exists
    if (local_capital === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(local_capital.local_country({}, context));

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
        throw new Error(`local_capital with capital_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * local_capitals - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    local_capitals: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "local_capitals");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_capital.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * local_capitalsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    local_capitalsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "local_capitalsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_capital.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneLocal_capital - Check user authorization and return one record with the specified capital_id in the capital_id argument.
     *
     * @param  {number} {capital_id}    capital_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with capital_id requested
     */
    readOneLocal_capital: async function({
        capital_id
    }, context) {
        const startTime = new Date()
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneLocal_capital");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            const res = await local_capital.readById(capital_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            console.log('readOneLocal_capital:', measuredTime)
            return res
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countLocal_capitals - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countLocal_capitals: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_capital.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableLocal_capital - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableLocal_capital: async function(_, context) {
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            return helper.vueTable(context.request, local_capital, ["id", "capital_id", "name", "country_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addLocal_capital - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addLocal_capital: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_capital', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdLocal_capital = await local_capital.addOne(inputSanitized, benignErrorReporter);
            await createdLocal_capital.handleAssociations(inputSanitized, benignErrorReporter);
            return createdLocal_capital;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddLocal_capitalCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddLocal_capitalCsv: async function(_, context) {
        if (await checkAuthorization(context, 'local_capital', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_capital.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteLocal_capital - Check user authorization and delete a record with the specified capital_id in the capital_id argument.
     *
     * @param  {number} {capital_id}    capital_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteLocal_capital: async function({
        capital_id
    }, context) {
        if (await checkAuthorization(context, 'local_capital', 'delete') === true) {
            if (await validForDeletion(capital_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return local_capital.deleteOne(capital_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateLocal_capital - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateLocal_capital: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_capital', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedLocal_capital = await local_capital.updateOne(inputSanitized, benignErrorReporter);
            await updatedLocal_capital.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedLocal_capital;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateLocal_capitalWithCountry_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateLocal_capitalWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.local_country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), local_capital);
        }
        return await local_capital.bulkAssociateLocal_capitalWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateLocal_capitalWithCountry_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateLocal_capitalWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.local_country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), local_capital);
        }
        return await local_capital.bulkDisAssociateLocal_capitalWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateLocal_capital - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateLocal_capital: async function(_, context) {
        if (await checkAuthorization(context, 'local_capital', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_capital.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}