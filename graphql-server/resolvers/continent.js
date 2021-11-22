/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const continent = require(path.join(__dirname, '..', 'models', 'index.js')).continent;
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
    'addCountries': 'country'
}




/**
 * continent.prototype.countriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
continent.prototype.countriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "continent_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countries({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * continent.prototype.countFilteredCountries - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
continent.prototype.countFilteredCountries = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "continent_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countCountries({
        search: nsearch
    }, context);
}

/**
 * continent.prototype.countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
continent.prototype.countriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "continent_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countriesConnection({
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
continent.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCountries)) {
        promises_add.push(this.add_countries(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCountries)) {
        promises_remove.push(this.remove_countries(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_countries - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
continent.prototype.add_countries = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addCountries.map(associatedRecordId => {
        return {
            continent_id: this.getIdValue(),
            [models.country.idAttribute()]: associatedRecordId
        }
    });
    await models.country.bulkAssociateCountryWithContinent_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_countries - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
continent.prototype.remove_countries = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeCountries.map(associatedRecordId => {
        return {
            continent_id: this.getIdValue(),
            [models.country.idAttribute()]: associatedRecordId
        }
    });
    await models.country.bulkDisAssociateCountryWithContinent_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let continent = await resolvers.readOneContinent({
        continent_id: id
    }, context);
    //check that record actually exists
    if (continent === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(continent.countFilteredCountries({}, context));

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
        throw new Error(`continent with continent_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * continents - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    continents: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "continents");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await continent.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * continentsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    continentsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "continentsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await continent.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneContinent - Check user authorization and return one record with the specified continent_id in the continent_id argument.
     *
     * @param  {number} {continent_id}    continent_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with continent_id requested
     */
    readOneContinent: async function({
        continent_id
    }, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneContinent");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await continent.readById(continent_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countContinents - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countContinents: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await continent.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableContinent - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableContinent: async function(_, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            return helper.vueTable(context.request, continent, ["id", "continent_id", "name"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateContinentForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateContinentForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'continent', 'read');
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
                    continent,
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
     * validateContinentForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateContinentForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'continent', 'read');
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
                    continent,
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
     * validateContinentForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {continent_id} continent_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateContinentForDeletion: async ({
        continent_id
    }, context) => {
        if ((await checkAuthorization(context, 'continent', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(continent_id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    continent,
                    continent_id);
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
     * validateContinentAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {continent_id} continent_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateContinentAfterReading: async ({
        continent_id
    }, context) => {
        if ((await checkAuthorization(context, 'continent', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    continent,
                    continent_id);
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
     * addContinent - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addContinent: async function(input, context) {
        let authorization = await checkAuthorization(context, 'continent', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdContinent = await continent.addOne(inputSanitized, benignErrorReporter);
            await createdContinent.handleAssociations(inputSanitized, benignErrorReporter);
            return createdContinent;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddContinentCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddContinentCsv: async function(_, context) {
        if (await checkAuthorization(context, 'continent', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return continent.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteContinent - Check user authorization and delete a record with the specified continent_id in the continent_id argument.
     *
     * @param  {number} {continent_id}    continent_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteContinent: async function({
        continent_id
    }, context) {
        if (await checkAuthorization(context, 'continent', 'delete') === true) {
            if (await validForDeletion(continent_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return continent.deleteOne(continent_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateContinent - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateContinent: async function(input, context) {
        let authorization = await checkAuthorization(context, 'continent', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedContinent = await continent.updateOne(inputSanitized, benignErrorReporter);
            await updatedContinent.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedContinent;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateContinent - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateContinent: async function(_, context) {
        if (await checkAuthorization(context, 'continent', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return continent.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}