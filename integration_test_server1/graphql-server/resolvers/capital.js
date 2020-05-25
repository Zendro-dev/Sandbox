/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const capital = require(path.join(__dirname, '..', 'models_index.js')).capital;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models_index.js'));
const globals = require('../config/globals');



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
        if (search === undefined) {
            return resolvers.readOneCountry({
                [models.country.idAttribute()]: this.country_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.country.idAttribute(),
                "value": {
                    "value": this.country_id
                },
                "operator": "eq"
            });
            let found = await resolvers.countries({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}



/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
capital.prototype.handleAssociations = async function(input, context) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addUnique_country)) {
        promises.push(this.add_unique_country(input, context));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeUnique_country)) {
        promises.push(this.remove_unique_country(input, context));
    }

    await Promise.all(promises);
}
/**
 * add_unique_country - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
capital.prototype.add_unique_country = async function(input) {
    await capital.add_country_id(this.getIdValue(), input.addUnique_country);
    this.country_id = input.addUnique_country;
}

/**
 * remove_unique_country - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
capital.prototype.remove_unique_country = async function(input) {
    if (input.removeUnique_country == this.country_id) {
        await capital.remove_country_id(this.getIdValue(), input.removeUnique_country);
        this.country_id = null;
    }
}


/**
 * errorMessageForRecordsLimit(query) - returns error message in case the record limit is exceeded.
 *
 * @param {string} query The query that failed
 */
function errorMessageForRecordsLimit(query) {
    return "Max record limit of " + globals.LIMIT_RECORDS + " exceeded in " + query;
}

/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCountAndReduceRecordsLimit(search, context, query) {
    let count = (await capital.countRecords(search)).sum;
    if (count > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= count;
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneCapital"));
    }
    context.recordsLimit -= 1;
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
        if (await checkAuthorization(context, 'capital', 'read' === true)) {
            await checkCountAndReduceRecordsLimit(search, context, "capitals");
            return await capital.readAll(search, order, pagination);
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
            await checkCountAndReduceRecordsLimit(search, context, "capitalsConnection");
            return capital.readAllCursor(search, order, pagination);
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
            checkCountForOneAndReduceRecordsLimit(context);
            return capital.readById(capital_id);
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
            return (await capital.countRecords(search)).sum;
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
            return helper.vueTable(context.request, capital, ["id", "name", "country_id", "capital_id"]);
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
            let createdCapital = await capital.addOne(inputSanitized);
            await createdCapital.handleAssociations(inputSanitized, context);
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
            return capital.bulkAddCsv(context);
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
                return capital.deleteOne(capital_id);
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
            let updatedCapital = await capital.updateOne(inputSanitized);
            await updatedCapital.handleAssociations(inputSanitized, context);
            return updatedCapital;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
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
            return capital.csvTableTemplate();
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}