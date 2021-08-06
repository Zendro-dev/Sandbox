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

const associationArgsDef = {
    'addCountry': 'country'
}

/**
 * capital.prototype.country - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
capital.prototype.country = async function({
    search
}, context) {
    const startTime = new Date()
    if (helper.isNotUndefinedAndNotNull(this.country_id)) {
        if (search === undefined || search === null) {
            context['field']=true
            const res = await resolvers.readOneCountry({
                [models.country.idAttribute()]: this.country_id
            }, context)
            const measuredTime = (new Date()) - startTime
            console.log(`country*capital&${this.getIdValue().slice(0, 9)}:`, measuredTime)
            return res
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

    if (helper.isNotUndefinedAndNotNull(input.addCountry)) {
        promises_add.push(this.add_country(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeCountry)) {
        promises_remove.push(this.remove_country(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_country - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
capital.prototype.add_country = async function(input, benignErrorReporter) {
    await capital.add_country_id(this.getIdValue(), input.addCountry, benignErrorReporter);
    this.country_id = input.addCountry;
}

/**
 * remove_country - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
capital.prototype.remove_country = async function(input, benignErrorReporter) {
    if (input.removeCountry == this.country_id) {
        await capital.remove_country_id(this.getIdValue(), input.removeCountry, benignErrorReporter);
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

    promises_to_one.push(capital.country({}, context));

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

    if (context.benignErrors.length > 0) {
        throw new Error('Errors occurred when counting associated records. No deletion permitted for reasons of security.');
    }

    return true;
}

module.exports = {

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
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "capitalsConnection");

        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        //check: adapters
        let registeredAdapters = Object.values(capital.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "capital"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "capital"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await capital.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "capital" ');
            }
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
        const startTime = new Date()
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, capital.adapterForIri(capital_id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCapital");
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            const res = await capital.readById(capital_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            console.log(`readOneCapital&${capital_id.slice(0, 9)}:`, measuredTime)
            return res
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addCapital - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCapital: async function(input, context) {
        //check: input has idAttribute
        if (!input.capital_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'capital_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, capital.adapterForIri(input.capital_id), 'create');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            let createdRecord = await capital.addOne(inputSanitized, benignErrorReporter);
            await createdRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
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
            //construct benignErrors reporter with context
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
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, capital.adapterForIri(capital_id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(capital_id, context)) {
                //construct benignErrors reporter with context
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return capital.deleteOne(capital_id, benignErrorReporter);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updateCapital - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCapital: async function(input, context) {
        //check: input has idAttribute
        if (!input.capital_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'capital_id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, capital.adapterForIri(input.capital_id), 'update');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRecord = await capital.updateOne(inputSanitized, benignErrorReporter);
            await updatedRecord.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
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
        //construct benignErrors reporter with context
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

        //check: adapters
        let registeredAdapters = Object.values(capital.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "capital"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "capital"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            return await capital.countRecords(search, authorizationCheck.authorizedAdapters, benignErrorReporter, searchAuthorizationCheck.authorizedAdapters);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "capital"');
            }
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
            //construct benignErrors reporter with context
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return capital.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}