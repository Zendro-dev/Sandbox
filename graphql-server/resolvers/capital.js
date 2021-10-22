/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const capital = require(path.join(__dirname, '..', 'models', 'index.js')).capital;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
const validatorUtil = require("../utils/validatorUtil");
const associationArgsDef = {
    'addUnique_country': 'country'
}



/**
 * capital.prototype.unique_country - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
capital.prototype.unique_country = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.country_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneCountry({
                [models.country.idAttribute()]: this.country_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.country.idAttribute(),
                "value": this.country_id,
                "operator": "eq"
            });
            let found = (await resolvers.countriesConnection({
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
capital.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addUnique_country)) {
        promises_add.push(this.add_unique_country(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeUnique_country)) {
        promises_remove.push(this.remove_unique_country(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_unique_country - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
capital.prototype.add_unique_country = async function(input, benignErrorReporter) {
    await capital.add_country_id(this.getIdValue(), input.addUnique_country, benignErrorReporter);
    this.country_id = input.addUnique_country;
}

/**
 * remove_unique_country - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
capital.prototype.remove_unique_country = async function(input, benignErrorReporter) {
    if (input.removeUnique_country == this.country_id) {
        await capital.remove_country_id(this.getIdValue(), input.removeUnique_country, benignErrorReporter);
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

    let capital = await resolvers.readOneCapital({
        capital_id: id
    }, context);
    //check that record actually exists
    if (capital === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(capital.unique_country({}, context));

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
        throw new Error(`capital with capital_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * capitals - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    capitals: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "capitals");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await capital.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * capitalsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    capitalsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "capitalsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await capital.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCapital - Check user authorization and return one record with the specified capital_id in the capital_id argument.
     *
     * @param  {number} {capital_id}    capital_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with capital_id requested
     */
    readOneCapital: async function({
        capital_id
    }, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCapital");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await capital.readById(capital_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCapitals - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCapitals: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await capital.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCapital - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCapital: async function(_, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            return helper.vueTable(context.request, capital, ["id", "name", "capital_id", "country_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCapitalForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCapitalForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'capital', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForCreate",
                    capital,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCapitalForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCapitalForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'capital', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForUpdate",
                    capital,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCapitalForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {capital_id} capital_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCapitalForDeletion: async ({
        capital_id
    }, context) => {
        if ((await checkAuthorization(context, 'capital', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(capital_id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    capital,
                    capital_id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCapitalAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {capital_id} capital_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCapitalAfterReading: async ({
        capital_id
    }, context) => {
        if ((await checkAuthorization(context, 'capital', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    capital,
                    capital_id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addCapital - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCapital: async function(input, context) {
        let authorization = await checkAuthorization(context, 'capital', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCapital = await capital.addOne(inputSanitized, benignErrorReporter);
            await createdCapital.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCapital;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCapitalCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCapitalCsv: async function(_, context) {
        if (await checkAuthorization(context, 'capital', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return capital.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCapital - Check user authorization and delete a record with the specified capital_id in the capital_id argument.
     *
     * @param  {number} {capital_id}    capital_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCapital: async function({
        capital_id
    }, context) {
        if (await checkAuthorization(context, 'capital', 'delete') === true) {
            if (await validForDeletion(capital_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return capital.deleteOne(capital_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCapital - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCapital: async function(input, context) {
        let authorization = await checkAuthorization(context, 'capital', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCapital = await capital.updateOne(inputSanitized, benignErrorReporter);
            await updatedCapital.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCapital;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCapitalWithCountry_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCapitalWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), capital);
        }
        return await capital.bulkAssociateCapitalWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCapitalWithCountry_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCapitalWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                capital_id
            }) => capital_id)), capital);
        }
        return await capital.bulkDisAssociateCapitalWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCapital - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCapital: async function(_, context) {
        if (await checkAuthorization(context, 'capital', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return capital.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}