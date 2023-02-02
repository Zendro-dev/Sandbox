/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observationUnitPosition = require(path.join(__dirname, '..', 'models', 'index.js')).observationUnitPosition;
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
    'addObservationUnit': 'observationUnit'
}



/**
 * observationUnitPosition.prototype.observationUnit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnitPosition.prototype.observationUnit = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.observationUnitDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneObservationUnit({
                [models.observationUnit.idAttribute()]: this.observationUnitDbId
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.observationUnit.idAttribute(),
                "value": this.observationUnitDbId,
                "operator": "eq"
            });
            let found = (await resolvers.observationUnitsConnection({
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
 * @param {string} token The token used for authorization
 */
observationUnitPosition.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addObservationUnit)) {
        promises_add.push(this.add_observationUnit(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeObservationUnit)) {
        promises_remove.push(this.remove_observationUnit(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationUnit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observationUnitPosition.prototype.add_observationUnit = async function(input, benignErrorReporter, token) {
    const associated = await observationUnitPosition.readAllCursor({
            field: "observationUnitDbId",
            operator: "eq",
            value: input.addObservationUnit
        },
        undefined, {
            first: 2
        },
        benignErrorReporter
    );
    const num = associated.observationUnitPositions.length;
    if (num > 0) {
        if (num > 1) {
            benignErrorReporter.push({
                message: `Please manually fix inconsistent data! Record has been added without association!`,
            });
            return 0;
        } else {
            const observationUnitPositionDbId = associated.observationUnitPositions[0].observationUnitPositionDbId;
            const removed = await observationUnitPosition.remove_observationUnitDbId(observationUnitPositionDbId, input.addObservationUnit, benignErrorReporter, token);
            benignErrorReporter.push({
                message: `Hint: update ${removed} existing association!`,
            });
        }
    }
    await observationUnitPosition.add_observationUnitDbId(this.getIdValue(), input.addObservationUnit, benignErrorReporter, token);
    this.observationUnitDbId = input.addObservationUnit;
}

/**
 * remove_observationUnit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observationUnitPosition.prototype.remove_observationUnit = async function(input, benignErrorReporter, token) {
    if (input.removeObservationUnit == this.observationUnitDbId) {
        await observationUnitPosition.remove_observationUnitDbId(this.getIdValue(), input.removeObservationUnit, benignErrorReporter, token);
        this.observationUnitDbId = null;
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

    let observationUnitPosition = await resolvers.readOneObservationUnitPosition({
        observationUnitPositionDbId: id
    }, context);
    //check that record actually exists
    if (observationUnitPosition === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;
    promises_to_one.push(observationUnitPosition.observationUnit({}, context));


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
        throw new Error(`observationUnitPosition with observationUnitPositionDbId ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const observationUnitPosition_record = await resolvers.readOneObservationUnitPosition({
            observationUnitPositionDbId: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * observationUnitPositions - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    observationUnitPositions: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "observationUnitPositions");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await observationUnitPosition.readAll(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationUnitPositionsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observationUnitPositionsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "observationUnitPositionsConnection");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await observationUnitPosition.readAllCursor(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneObservationUnitPosition - Check user authorization and return one record with the specified observationUnitPositionDbId in the observationUnitPositionDbId argument.
     *
     * @param  {number} {observationUnitPositionDbId}    observationUnitPositionDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with observationUnitPositionDbId requested
     */
    readOneObservationUnitPosition: async function({
        observationUnitPositionDbId
    }, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservationUnitPosition");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await observationUnitPosition.readById(observationUnitPositionDbId, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countObservationUnitPositions - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countObservationUnitPositions: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await observationUnitPosition.countRecords(search, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateObservationUnitPositionForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservationUnitPositionForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'observationUnitPosition', 'read');
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
                    observationUnitPosition,
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
     * validateObservationUnitPositionForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservationUnitPositionForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'observationUnitPosition', 'read');
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
                    observationUnitPosition,
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
     * validateObservationUnitPositionForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {observationUnitPositionDbId} observationUnitPositionDbId of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservationUnitPositionForDeletion: async ({
        observationUnitPositionDbId
    }, context) => {
        if ((await checkAuthorization(context, 'observationUnitPosition', 'read')) === true) {
            try {
                await validForDeletion(observationUnitPositionDbId, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    observationUnitPosition,
                    observationUnitPositionDbId);
                return true;
            } catch (error) {
                error.input = {
                    observationUnitPositionDbId: observationUnitPositionDbId
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateObservationUnitPositionAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {observationUnitPositionDbId} observationUnitPositionDbId of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservationUnitPositionAfterReading: async ({
        observationUnitPositionDbId
    }, context) => {
        if ((await checkAuthorization(context, 'observationUnitPosition', 'read')) === true) {
            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    observationUnitPosition,
                    observationUnitPositionDbId);
                return true;
            } catch (error) {
                error.input = {
                    observationUnitPositionDbId: observationUnitPositionDbId
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addObservationUnitPosition - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservationUnitPosition: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationUnitPosition', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let createdObservationUnitPosition = await observationUnitPosition.addOne(inputSanitized, context.benignErrors, token);
            await createdObservationUnitPosition.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdObservationUnitPosition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteObservationUnitPosition - Check user authorization and delete a record with the specified observationUnitPositionDbId in the observationUnitPositionDbId argument.
     *
     * @param  {number} {observationUnitPositionDbId}    observationUnitPositionDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservationUnitPosition: async function({
        observationUnitPositionDbId
    }, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'delete') === true) {
            if (await validForDeletion(observationUnitPositionDbId, context)) {
                await updateAssociations(observationUnitPositionDbId, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return observationUnitPosition.deleteOne(observationUnitPositionDbId, context.benignErrors, token);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateObservationUnitPosition - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservationUnitPosition: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationUnitPosition', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let updatedObservationUnitPosition = await observationUnitPosition.updateOne(inputSanitized, context.benignErrors, token);
            await updatedObservationUnitPosition.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedObservationUnitPosition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateObservationUnitPositionWithObservationUnitDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitPositionWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitPositionDbId
            }) => observationUnitPositionDbId)), observationUnitPosition, token);
        }
        return await observationUnitPosition.bulkAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },
    /**
     * bulkDisAssociateObservationUnitPositionWithObservationUnitDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitPositionWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitPositionDbId
            }) => observationUnitPositionDbId)), observationUnitPosition, token);
        }
        return await observationUnitPosition.bulkDisAssociateObservationUnitPositionWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },

    /**
     * csvTableTemplateObservationUnitPosition - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservationUnitPosition: async function(_, context) {
        if (await checkAuthorization(context, 'observationUnitPosition', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return observationUnitPosition.csvTableTemplate(context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationUnitPositionsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    observationUnitPositionsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "observationUnitPosition", "read")) === true) {
            return observationUnitPosition.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

}