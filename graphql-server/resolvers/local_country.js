/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const local_country = require(path.join(__dirname, '..', 'models', 'index.js')).local_country;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addLocal_capital': 'local_capital',
    'addAvailable_local_books': 'local_book'
}



/**
 * local_country.prototype.local_capital - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
local_country.prototype.local_capital = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.local_capitalsConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;
    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 local_capitals matching local_country with country_id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the local_country model. Returning first local_capital.`
            ));
        }
        return found[0].node;
    }
    return null;
}

/**
 * local_country.prototype.available_local_booksFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
local_country.prototype.available_local_booksFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.book_ids) || this.book_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.local_books({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * local_country.prototype.countFilteredAvailable_local_books - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
local_country.prototype.countFilteredAvailable_local_books = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.book_ids) || this.book_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countLocal_books({
        search: nsearch
    }, context);
}

/**
 * local_country.prototype.available_local_booksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
local_country.prototype.available_local_booksConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.book_ids) || this.book_ids.length === 0) {
        return {
            edges: [],
            local_books: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.local_booksConnection({
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
local_country.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addAvailable_local_books)) {
        promises_add.push(this.add_available_local_books(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLocal_capital)) {
        promises_add.push(this.add_local_capital(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeAvailable_local_books)) {
        promises_remove.push(this.remove_available_local_books(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLocal_capital)) {
        promises_remove.push(this.remove_local_capital(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_available_local_books - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_country.prototype.add_available_local_books = async function(input, benignErrorReporter) {

    await local_country.add_book_ids(this.getIdValue(), input.addAvailable_local_books, benignErrorReporter);
    this.book_ids = helper.unionIds(this.book_ids, input.addAvailable_local_books);
}

/**
 * add_local_capital - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_country.prototype.add_local_capital = async function(input, benignErrorReporter) {
    await models.local_capital.add_country_id(input.addLocal_capital, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_available_local_books - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_country.prototype.remove_available_local_books = async function(input, benignErrorReporter) {

    await local_country.remove_book_ids(this.getIdValue(), input.removeAvailable_local_books, benignErrorReporter);
    this.book_ids = helper.differenceIds(this.book_ids, input.removeAvailable_local_books);
}

/**
 * remove_local_capital - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_country.prototype.remove_local_capital = async function(input, benignErrorReporter) {
    await models.local_capital.remove_country_id(input.removeLocal_capital, this.getIdValue(), benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let local_country = await resolvers.readOneLocal_country({
        country_id: id
    }, context);
    //check that record actually exists
    if (local_country === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(local_country.countFilteredAvailable_local_books({}, context));
    promises_to_one.push(local_country.local_capital({}, context));

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
        throw new Error(`local_country with country_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * local_countries - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    local_countries: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "local_countries");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_country.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * local_countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    local_countriesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "local_countriesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_country.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneLocal_country - Check user authorization and return one record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with country_id requested
     */
    readOneLocal_country: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneLocal_country");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_country.readById(country_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countLocal_countries - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countLocal_countries: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_country.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableLocal_country - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableLocal_country: async function(_, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            return helper.vueTable(context.request, local_country, ["id", "country_id", "name"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addLocal_country - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addLocal_country: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_country', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdLocal_country = await local_country.addOne(inputSanitized, benignErrorReporter);
            await createdLocal_country.handleAssociations(inputSanitized, benignErrorReporter);
            return createdLocal_country;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddLocal_countryCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddLocal_countryCsv: async function(_, context) {
        if (await checkAuthorization(context, 'local_country', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_country.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteLocal_country - Check user authorization and delete a record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteLocal_country: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'local_country', 'delete') === true) {
            if (await validForDeletion(country_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return local_country.deleteOne(country_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateLocal_country - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateLocal_country: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_country', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedLocal_country = await local_country.updateOne(inputSanitized, benignErrorReporter);
            await updatedLocal_country.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedLocal_country;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateLocal_country - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateLocal_country: async function(_, context) {
        if (await checkAuthorization(context, 'local_country', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_country.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}