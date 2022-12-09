/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const snplocus = require(path.join(__dirname, '..', 'models', 'index.js')).snplocus;
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
    'addSnpmatrix': 'snpmatrix'
}



/**
 * snplocus.prototype.snpmatrix - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
snplocus.prototype.snpmatrix = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.snp_matrix_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSnpmatrix({
                [models.snpmatrix.idAttribute()]: this.snp_matrix_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.snpmatrix.idAttribute(),
                "value": this.snp_matrix_id,
                "operator": "eq"
            });
            let found = (await resolvers.snpmatricesConnection({
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
snplocus.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addSnpmatrix)) {
        promises_add.push(this.add_snpmatrix(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeSnpmatrix)) {
        promises_remove.push(this.remove_snpmatrix(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_snpmatrix - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snplocus.prototype.add_snpmatrix = async function(input, benignErrorReporter, token) {
    await snplocus.add_snp_matrix_id(this.getIdValue(), input.addSnpmatrix, benignErrorReporter, token);
    this.snp_matrix_id = input.addSnpmatrix;
}

/**
 * remove_snpmatrix - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snplocus.prototype.remove_snpmatrix = async function(input, benignErrorReporter, token) {
    if (input.removeSnpmatrix == this.snp_matrix_id) {
        await snplocus.remove_snp_matrix_id(this.getIdValue(), input.removeSnpmatrix, benignErrorReporter, token);
        this.snp_matrix_id = null;
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

    let snplocus = await resolvers.readOneSnplocus({
        id: id
    }, context);
    //check that record actually exists
    if (snplocus === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;
    promises_to_one.push(snplocus.snpmatrix({}, context));


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
        throw new Error(`snplocus with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const snplocus_record = await resolvers.readOneSnplocus({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * snplocus - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    snplocus: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'snplocus', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "snplocus");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snplocus.readAll(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * snplocusConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    snplocusConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'snplocus', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "snplocusConnection");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snplocus.readAllCursor(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSnplocus - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSnplocus: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'snplocus', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSnplocus");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snplocus.readById(id, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSnplocus - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSnplocus: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'snplocus', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snplocus.countRecords(search, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateSnplocusForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnplocusForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'snplocus', 'read');
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
                    snplocus,
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
     * validateSnplocusForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnplocusForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'snplocus', 'read');
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
                    snplocus,
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
     * validateSnplocusForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnplocusForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'snplocus', 'read')) === true) {
            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    snplocus,
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
     * validateSnplocusAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnplocusAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'snplocus', 'read')) === true) {
            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    snplocus,
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
     * addSnplocus - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSnplocus: async function(input, context) {
        let authorization = await checkAuthorization(context, 'snplocus', 'create');
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
            let createdSnplocus = await snplocus.addOne(inputSanitized, context.benignErrors, token);
            await createdSnplocus.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdSnplocus;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSnplocus - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSnplocus: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'snplocus', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return snplocus.deleteOne(id, context.benignErrors, token);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSnplocus - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSnplocus: async function(input, context) {
        let authorization = await checkAuthorization(context, 'snplocus', 'update');
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
            let updatedSnplocus = await snplocus.updateOne(inputSanitized, context.benignErrors, token);
            await updatedSnplocus.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedSnplocus;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateSnplocusWithSnp_matrix_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSnplocusWithSnp_matrix_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snp_matrix_id
            }) => snp_matrix_id)), models.snpmatrix, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), snplocus, token);
        }
        return await snplocus.bulkAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },
    /**
     * bulkDisAssociateSnplocusWithSnp_matrix_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSnplocusWithSnp_matrix_id: async function(bulkAssociationInput, context) {
        let token = context.request ?
            context.request.headers ?
            context.request.headers.authorization :
            undefined :
            undefined;
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snp_matrix_id
            }) => snp_matrix_id)), models.snpmatrix, token);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), snplocus, token);
        }
        return await snplocus.bulkDisAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },

    /**
     * csvTableTemplateSnplocus - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSnplocus: async function(_, context) {
        if (await checkAuthorization(context, 'snplocus', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return snplocus.csvTableTemplate(context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * snplocusZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    snplocusZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "snplocus", "read")) === true) {
            return snplocus.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

}