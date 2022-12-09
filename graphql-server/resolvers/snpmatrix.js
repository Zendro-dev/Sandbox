/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const snpmatrix = require(path.join(__dirname, '..', 'models', 'index.js')).snpmatrix;
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
    'addSnplocus': 'snplocus',
    'addSnpgenotype': 'snpgenotype'
}




/**
 * snpmatrix.prototype.snplocusFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
snpmatrix.prototype.snplocusFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.snplocus({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * snpmatrix.prototype.countFilteredSnplocus - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
snpmatrix.prototype.countFilteredSnplocus = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countSnplocus({
        search: nsearch
    }, context);
}

/**
 * snpmatrix.prototype.snplocusConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
snpmatrix.prototype.snplocusConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.snplocusConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * snpmatrix.prototype.snpgenotypeFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
snpmatrix.prototype.snpgenotypeFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.snpgenotypes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * snpmatrix.prototype.countFilteredSnpgenotype - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
snpmatrix.prototype.countFilteredSnpgenotype = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countSnpgenotypes({
        search: nsearch
    }, context);
}

/**
 * snpmatrix.prototype.snpgenotypeConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
snpmatrix.prototype.snpgenotypeConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snp_matrix_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.snpgenotypesConnection({
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
snpmatrix.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addSnplocus)) {
        promises_add.push(this.add_snplocus(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addSnpgenotype)) {
        promises_add.push(this.add_snpgenotype(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeSnplocus)) {
        promises_remove.push(this.remove_snplocus(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeSnpgenotype)) {
        promises_remove.push(this.remove_snpgenotype(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_snplocus - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snpmatrix.prototype.add_snplocus = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addSnplocus.map(associatedRecordId => {
        return {
            snp_matrix_id: this.getIdValue(),
            [models.snplocus.idAttribute()]: associatedRecordId
        }
    });
    await models.snplocus.bulkAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * add_snpgenotype - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snpmatrix.prototype.add_snpgenotype = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addSnpgenotype.map(associatedRecordId => {
        return {
            snp_matrix_id: this.getIdValue(),
            [models.snpgenotype.idAttribute()]: associatedRecordId
        }
    });
    await models.snpgenotype.bulkAssociateSnpgenotypeWithSnp_matrix_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_snplocus - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snpmatrix.prototype.remove_snplocus = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeSnplocus.map(associatedRecordId => {
        return {
            snp_matrix_id: this.getIdValue(),
            [models.snplocus.idAttribute()]: associatedRecordId
        }
    });
    await models.snplocus.bulkDisAssociateSnplocusWithSnp_matrix_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_snpgenotype - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
snpmatrix.prototype.remove_snpgenotype = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeSnpgenotype.map(associatedRecordId => {
        return {
            snp_matrix_id: this.getIdValue(),
            [models.snpgenotype.idAttribute()]: associatedRecordId
        }
    });
    await models.snpgenotype.bulkDisAssociateSnpgenotypeWithSnp_matrix_id(bulkAssociationInput, benignErrorReporter, token);
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let snpmatrix = await resolvers.readOneSnpmatrix({
        id: id
    }, context);
    //check that record actually exists
    if (snpmatrix === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;
    promises_to_many.push(snpmatrix.countFilteredSnplocus({}, context));
    promises_to_many.push(snpmatrix.countFilteredSnpgenotype({}, context));


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
        throw new Error(`snpmatrix with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const snpmatrix_record = await resolvers.readOneSnpmatrix({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * snpmatrices - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    snpmatrices: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "snpmatrices");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snpmatrix.readAll(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * snpmatricesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    snpmatricesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "snpmatricesConnection");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snpmatrix.readAllCursor(search, order, pagination, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSnpmatrix - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSnpmatrix: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSnpmatrix");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snpmatrix.readById(id, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSnpmatrices - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSnpmatrices: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await snpmatrix.countRecords(search, context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateSnpmatrixForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnpmatrixForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'snpmatrix', 'read');
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
                    snpmatrix,
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
     * validateSnpmatrixForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnpmatrixForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'snpmatrix', 'read');
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
                    snpmatrix,
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
     * validateSnpmatrixForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnpmatrixForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'snpmatrix', 'read')) === true) {
            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    snpmatrix,
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
     * validateSnpmatrixAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateSnpmatrixAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'snpmatrix', 'read')) === true) {
            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    snpmatrix,
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
     * addSnpmatrix - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSnpmatrix: async function(input, context) {
        let authorization = await checkAuthorization(context, 'snpmatrix', 'create');
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
            let createdSnpmatrix = await snpmatrix.addOne(inputSanitized, context.benignErrors, token);
            await createdSnpmatrix.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdSnpmatrix;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSnpmatrix - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSnpmatrix: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return snpmatrix.deleteOne(id, context.benignErrors, token);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSnpmatrix - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSnpmatrix: async function(input, context) {
        let authorization = await checkAuthorization(context, 'snpmatrix', 'update');
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
            let updatedSnpmatrix = await snpmatrix.updateOne(inputSanitized, context.benignErrors, token);
            await updatedSnpmatrix.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedSnpmatrix;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateSnpmatrix - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSnpmatrix: async function(_, context) {
        if (await checkAuthorization(context, 'snpmatrix', 'read') === true) {
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return snpmatrix.csvTableTemplate(context.benignErrors, token);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * snpmatricesZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    snpmatricesZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "snpmatrix", "read")) === true) {
            return snpmatrix.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

}