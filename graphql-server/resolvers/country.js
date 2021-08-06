/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const country = require(path.join(__dirname, '..', 'models', 'index.js')).country;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addCapital': 'capital',
    'addAvailable_books': 'book'
}

/**
 * country.prototype.capital - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
country.prototype.capital = async function({
    search
}, context) {
    const startTime = new Date()
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.capitalsConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;

    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 capitals matching country with country_id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the country model. Returning first capital.`
            ));
        }
        const measuredTime = (new Date()) - startTime
        console.log(`capital*country&${this.getIdValue().slice(0, 9)}:`, measuredTime)
        return found[0].node;
    }
    return null;
}


/**
 * country.prototype.countFilteredAvailable_books - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
country.prototype.countFilteredAvailable_books = async function({
    search
}, context) {

    const startTime = new Date()
    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.book_ids) || this.book_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    const res = await resolvers.countBooks({search: nsearch}, context);
    const measuredTime = (new Date()) - startTime
    console.log(`countFilteredAvailable_books*country&${this.getIdValue().slice(0, 9)}:`, measuredTime)
    return res
}


/**
 * country.prototype.available_booksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
country.prototype.available_booksConnection = async function({
    search,
    order,
    pagination
}, context) {
    const startTime = new Date()
    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.book_ids) || this.book_ids.length === 0) {
        return {
            edges: [],
            books: [],
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
        "field": models.book.idAttribute(),
        "value": this.book_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    const res = await resolvers.booksConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
    const measuredTime = (new Date()) - startTime
    console.log(`available_booksConnection*country&${this.getIdValue().slice(0, 9)}:`, measuredTime)
    return res
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addAvailable_books)) {
        promises_add.push(this.add_available_books(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCapital)) {
        promises_add.push(this.add_capital(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeAvailable_books)) {
        promises_remove.push(this.remove_available_books(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCapital)) {
        promises_remove.push(this.remove_capital(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_available_books - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.add_available_books = async function(input, benignErrorReporter) {

    await country.add_book_ids(this.getIdValue(), input.addAvailable_books, benignErrorReporter);
    this.book_ids = helper.unionIds(this.book_ids, input.addAvailable_books);
}

/**
 * add_capital - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.add_capital = async function(input, benignErrorReporter) {
    await models.capital.add_country_id(input.addCapital, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_available_books - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.remove_available_books = async function(input, benignErrorReporter) {

    await country.remove_book_ids(this.getIdValue(), input.removeAvailable_books, benignErrorReporter);
    this.book_ids = helper.differenceIds(this.book_ids, input.removeAvailable_books);
}

/**
 * remove_capital - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.remove_capital = async function(input, benignErrorReporter) {
    await models.capital.remove_country_id(input.removeCapital, this.getIdValue(), benignErrorReporter);
}


/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let country = await resolvers.readOneCountry({
        country_id: id
    }, context);
    //check that record actually exists
    if (country === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(country.countFilteredAvailable_books({}, context));
    promises_to_one.push(country.capital({}, context));

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
        throw new Error(`country with country_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }

    if (context.benignErrors.length > 0) {
        throw new Error('Errors occurred when counting associated records. No deletion permitted for reasons of security.');
    }

    return true;
}

module.exports = {

    /**
     * countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    countriesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "countriesConnection");

        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        //check: adapters
        let registeredAdapters = Object.values(country.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "country"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "country"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await country.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "country" ');
            }
        }
    },


    /**
     * readOneCountry - Check user authorization and return one record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with country_id requested
     */
    readOneCountry: async function({
        country_id
    }, context) {
        const startTime = new Date()
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, country.adapterForIri(country_id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCountry");
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            const res = await country.readById(country_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            if (!context['field']){
                console.log(`readOneCountry&${country_id.slice(0, 9)}:`, measuredTime)
            }
            
            return res
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addCountry - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCountry: async function(input, context) {
        //check: input has idAttribute
        if (!input.country_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'country_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, country.adapterForIri(input.country_id), 'create');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            let createdRecord = await country.addOne(inputSanitized, benignErrorReporter);
            await createdRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },


    /**
     * bulkAddCountryCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCountryCsv: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'create') === true) {
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return country.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCountry - Check user authorization and delete a record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCountry: async function({
        country_id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, country.adapterForIri(country_id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(country_id, context)) {
                //construct benignErrors reporter with context
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return country.deleteOne(country_id, benignErrorReporter);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updateCountry - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCountry: async function(input, context) {
        //check: input has idAttribute
        if (!input.country_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'country_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, country.adapterForIri(input.country_id), 'update');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRecord = await country.updateOne(inputSanitized, benignErrorReporter);
            await updatedRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countCountries - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countCountries: async function({
        search
    }, context) {
        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

        //check: adapters
        let registeredAdapters = Object.values(country.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "country"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "country"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await country.countRecords(search, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "country"');
            }
        }
    },


    /**
     * csvTableTemplateCountry - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCountry: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return country.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}