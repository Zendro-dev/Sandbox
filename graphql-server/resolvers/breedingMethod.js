/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const breedingMethod = require(path.join(__dirname, '..', 'models', 'index.js')).breedingMethod;
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
    'addGermplasm': 'germplasm'
}




/**
 * breedingMethod.prototype.germplasmFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
breedingMethod.prototype.germplasmFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "breedingMethodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.germplasms({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * breedingMethod.prototype.countFilteredGermplasm - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
breedingMethod.prototype.countFilteredGermplasm = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "breedingMethodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countGermplasms({
        search: nsearch
    }, context);
}

/**
 * breedingMethod.prototype.germplasmConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
breedingMethod.prototype.germplasmConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "breedingMethodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.germplasmsConnection({
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
breedingMethod.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addGermplasm)) {
        promises_add.push(this.add_germplasm(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeGermplasm)) {
        promises_remove.push(this.remove_germplasm(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_germplasm - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
breedingMethod.prototype.add_germplasm = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addGermplasm.map(associatedRecordId => {
        return {
            breedingMethodDbId: this.getIdValue(),
            [models.germplasm.idAttribute()]: associatedRecordId
        }
    });
    await models.germplasm.bulkAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_germplasm - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
breedingMethod.prototype.remove_germplasm = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeGermplasm.map(associatedRecordId => {
        return {
            breedingMethodDbId: this.getIdValue(),
            [models.germplasm.idAttribute()]: associatedRecordId
        }
    });
    await models.germplasm.bulkDisAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput, benignErrorReporter, token);
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let breedingMethod = await resolvers.readOneBreedingMethod({
        breedingMethodDbId: id
    }, context);
    //check that record actually exists
    if (breedingMethod === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;
    promises_to_many.push(breedingMethod.countFilteredGermplasm({}, context));


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
        throw new Error(`breedingMethod with breedingMethodDbId ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const breedingMethod_record = await resolvers.readOneBreedingMethod({
            breedingMethodDbId: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * breedingMethods - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    breedingMethods: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "breedingMethods");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await breedingMethod.readAll(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * breedingMethodsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    breedingMethodsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "breedingMethodsConnection");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await breedingMethod.readAllCursor(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneBreedingMethod - Check user authorization and return one record with the specified breedingMethodDbId in the breedingMethodDbId argument.
     *
     * @param  {number} {breedingMethodDbId}    breedingMethodDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with breedingMethodDbId requested
     */
    readOneBreedingMethod: async function({
        breedingMethodDbId
    }, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneBreedingMethod");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await breedingMethod.readById(breedingMethodDbId, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countBreedingMethods - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countBreedingMethods: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await breedingMethod.countRecords(search, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateBreedingMethodForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateBreedingMethodForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'breedingMethod', 'read');
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
                    breedingMethod,
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
     * validateBreedingMethodForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateBreedingMethodForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'breedingMethod', 'read');
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
                    breedingMethod,
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
     * validateBreedingMethodForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {breedingMethodDbId} breedingMethodDbId of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateBreedingMethodForDeletion: async ({
        breedingMethodDbId
    }, context) => {
        if ((await checkAuthorization(context, 'breedingMethod', 'read')) === true) {
            try {
                await validForDeletion(breedingMethodDbId, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    breedingMethod,
                    breedingMethodDbId);
                return true;
            } catch (error) {
                error.input = {
                    breedingMethodDbId: breedingMethodDbId
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateBreedingMethodAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {breedingMethodDbId} breedingMethodDbId of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateBreedingMethodAfterReading: async ({
        breedingMethodDbId
    }, context) => {
        if ((await checkAuthorization(context, 'breedingMethod', 'read')) === true) {
            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    breedingMethod,
                    breedingMethodDbId);
                return true;
            } catch (error) {
                error.input = {
                    breedingMethodDbId: breedingMethodDbId
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addBreedingMethod - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addBreedingMethod: async function(input, context) {
        let authorization = await checkAuthorization(context, 'breedingMethod', 'create');
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
            let createdBreedingMethod = await breedingMethod.addOne(inputSanitized, context.benignErrors, token);
            await createdBreedingMethod.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdBreedingMethod;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteBreedingMethod - Check user authorization and delete a record with the specified breedingMethodDbId in the breedingMethodDbId argument.
     *
     * @param  {number} {breedingMethodDbId}    breedingMethodDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteBreedingMethod: async function({
        breedingMethodDbId
    }, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'delete') === true) {
            if (await validForDeletion(breedingMethodDbId, context)) {
                await updateAssociations(breedingMethodDbId, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return breedingMethod.deleteOne(breedingMethodDbId, context.benignErrors, token);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateBreedingMethod - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateBreedingMethod: async function(input, context) {
        let authorization = await checkAuthorization(context, 'breedingMethod', 'update');
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
            let updatedBreedingMethod = await breedingMethod.updateOne(inputSanitized, context.benignErrors, token);
            await updatedBreedingMethod.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedBreedingMethod;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateBreedingMethod - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateBreedingMethod: async function(_, context) {
        if (await checkAuthorization(context, 'breedingMethod', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return breedingMethod.csvTableTemplate(context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * breedingMethodsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    breedingMethodsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "breedingMethod", "read")) === true) {
            return breedingMethod.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

}