/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const factor = require(path.join(__dirname, '..', 'models', 'index.js')).factor;
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
    'addStudy': 'study',
    'addObservation_units': 'observation_unit'
}

/**
 * factor.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
factor.prototype.study = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.study_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.study_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.study_id,
                "operator": "eq"
            });
            let found = (await resolvers.studiesConnection({
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
 * factor.prototype.countFilteredObservation_units - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
factor.prototype.countFilteredObservation_units = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observation_unit_ids) || this.observation_unit_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observation_unit.idAttribute(),
        "value": this.observation_unit_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countObservation_units({
        search: nsearch
    }, context);
}


/**
 * factor.prototype.observation_unitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
factor.prototype.observation_unitsConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observation_unit_ids) || this.observation_unit_ids.length === 0) {
        return {
            edges: [],
            observation_units: [],
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
        "field": models.observation_unit.idAttribute(),
        "value": this.observation_unit_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observation_unitsConnection({
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
 * @param {string} token The token used for authorization
 */
factor.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservation_units)) {
        promises_add.push(this.add_observation_units(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservation_units)) {
        promises_remove.push(this.remove_observation_units(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observation_units - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
factor.prototype.add_observation_units = async function(input, benignErrorReporter, token) {

    await factor.add_observation_unit_ids(this.getIdValue(), input.addObservation_units, benignErrorReporter, token);
    this.observation_unit_ids = helper.unionIds(this.observation_unit_ids, input.addObservation_units);
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
factor.prototype.add_study = async function(input, benignErrorReporter, token) {
    await factor.add_study_id(this.getIdValue(), input.addStudy, benignErrorReporter, token);
    this.study_id = input.addStudy;
}

/**
 * remove_observation_units - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
factor.prototype.remove_observation_units = async function(input, benignErrorReporter, token) {

    await factor.remove_observation_unit_ids(this.getIdValue(), input.removeObservation_units, benignErrorReporter, token);
    this.observation_unit_ids = helper.differenceIds(this.observation_unit_ids, input.removeObservation_units);
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
factor.prototype.remove_study = async function(input, benignErrorReporter, token) {
    if (input.removeStudy == this.study_id) {
        await factor.remove_study_id(this.getIdValue(), input.removeStudy, benignErrorReporter, token);
        this.study_id = null;
    }
}


/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let factor = await resolvers.readOneFactor({
        id: id
    }, context);
    //check that record actually exists
    if (factor === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;


    get_to_many_associated_fk += Array.isArray(factor.observation_unit_ids) ? factor.observation_unit_ids.length : 0;
    promises_to_one.push(factor.study({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated + get_to_one_associated_fk;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAssociatedRecordsWithRejectReaction(id, context) > 0) {
        throw new Error(`factor with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }

    return true;
}

/**
 * updateAssociations - update associations for a given record
 *
 * @param  {ID} id      Id of record
 * @param  {object} context Default context by resolver
 */
const updateAssociations = async (id, context) => {
    const factor_record = await resolvers.readOneFactor({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;


}

module.exports = {

    /**
     * factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    factorsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "factorsConnection");

        //check: adapters
        let registeredAdapters = Object.values(factor.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "factor"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "factor"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors.push(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await factor.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "factor" ');
            }
        }
    },


    /**
     * readOneFactor - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneFactor: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, factor.adapterForIri(id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneFactor");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return factor.readById(id, context.benignErrors, token);
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addFactor - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addFactor: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, factor.adapterForIri(input.id), 'create');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let createdRecord = await factor.addOne(inputSanitized, context.benignErrors, token);
            await createdRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * deleteFactor - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteFactor: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, factor.adapterForIri(id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return factor.deleteOne(id, context.benignErrors, token);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updateFactor - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateFactor: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, factor.adapterForIri(input.id), 'update');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let updatedRecord = await factor.updateOne(inputSanitized, context.benignErrors, token);
            await updatedRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countFactors - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countFactors: async function({
        search
    }, context) {

        //check: adapters
        let registeredAdapters = Object.values(factor.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "factor"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "factor"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors.push(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await factor.countRecords(search, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "factor"');
            }
        }
    },

    /**
     * bulkAssociateFactorWithStudy_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFactorWithStudy_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), factor, token);
        }
        return await factor.bulkAssociateFactorWithStudy_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },
    /**
     * bulkDisAssociateFactorWithStudy_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFactorWithStudy_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), factor, token);
        }
        return await factor.bulkDisAssociateFactorWithStudy_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },

    /**
     * csvTableTemplateFactor - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateFactor: async function(_, context) {
        if (await checkAuthorization(context, 'factor', 'read') === true) {
            return factor.csvTableTemplate(context.benignErrors);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * factorsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    factorsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "factor", "read")) === true) {
            return factor.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * factorsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    factorsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "factor", "read")) === true) {
            return factor.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateFactorForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateFactorForCreation: async (input, context) => {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        let authorization = await checkAuthorization(context, factor.adapterForIri(input.id), 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

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
                    factor,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateFactorForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateFactorForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, factor.adapterForIri(input.id), 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

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
                    factor,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateFactorForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateFactorForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, factor.adapterForIri(id), 'read')) === true) {

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    factor,
                    id);
                return true;
            } catch (error) {
                error.input = {
                    id: id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateFactorAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateFactorAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, factor.adapterForIri(id), 'read')) === true) {

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    factor,
                    id);
                return true;
            } catch (error) {
                error.input = {
                    id: id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
}