/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const process_parameter_value = require(path.join(__dirname, '..', 'models', 'index.js')).process_parameter_value;
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
    'addCategory': 'protocol_parameter',
    'addUnit': 'ontology_annotation',
    'addProcess_parameterValues': 'process',
    'addComments': 'comment'
}



/**
 * process_parameter_value.prototype.category - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process_parameter_value.prototype.category = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.category_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProtocol_parameter({
                [models.protocol_parameter.idAttribute()]: this.category_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.protocol_parameter.idAttribute(),
                "value": this.category_fk,
                "operator": "eq"
            });
            let found = (await resolvers.protocol_parametersConnection({
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
 * process_parameter_value.prototype.unit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process_parameter_value.prototype.unit = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.unit_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntology_annotation({
                [models.ontology_annotation.idAttribute()]: this.unit_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontology_annotation.idAttribute(),
                "value": this.unit_fk,
                "operator": "eq"
            });
            let found = (await resolvers.ontology_annotationsConnection({
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
 * process_parameter_value.prototype.process_parameterValues - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process_parameter_value.prototype.process_parameterValues = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.process_parameterValues_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProcess({
                [models.process.idAttribute()]: this.process_parameterValues_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.process.idAttribute(),
                "value": this.process_parameterValues_fk,
                "operator": "eq"
            });
            let found = (await resolvers.processesConnection({
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
 * process_parameter_value.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process_parameter_value.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameter_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.comments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process_parameter_value.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process_parameter_value.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameter_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * process_parameter_value.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process_parameter_value.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameter_value_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.commentsConnection({
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
process_parameter_value.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCategory)) {
        promises_add.push(this.add_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addUnit)) {
        promises_add.push(this.add_unit(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProcess_parameterValues)) {
        promises_add.push(this.add_process_parameterValues(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCategory)) {
        promises_remove.push(this.remove_category(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeUnit)) {
        promises_remove.push(this.remove_unit(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProcess_parameterValues)) {
        promises_remove.push(this.remove_process_parameterValues(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            process_parameter_value_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_category - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.add_category = async function(input, benignErrorReporter) {
    await process_parameter_value.add_category_fk(this.getIdValue(), input.addCategory, benignErrorReporter);
    this.category_fk = input.addCategory;
}

/**
 * add_unit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.add_unit = async function(input, benignErrorReporter) {
    await process_parameter_value.add_unit_fk(this.getIdValue(), input.addUnit, benignErrorReporter);
    this.unit_fk = input.addUnit;
}

/**
 * add_process_parameterValues - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.add_process_parameterValues = async function(input, benignErrorReporter) {
    await process_parameter_value.add_process_parameterValues_fk(this.getIdValue(), input.addProcess_parameterValues, benignErrorReporter);
    this.process_parameterValues_fk = input.addProcess_parameterValues;
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            process_parameter_value_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_category - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.remove_category = async function(input, benignErrorReporter) {
    if (input.removeCategory == this.category_fk) {
        await process_parameter_value.remove_category_fk(this.getIdValue(), input.removeCategory, benignErrorReporter);
        this.category_fk = null;
    }
}

/**
 * remove_unit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.remove_unit = async function(input, benignErrorReporter) {
    if (input.removeUnit == this.unit_fk) {
        await process_parameter_value.remove_unit_fk(this.getIdValue(), input.removeUnit, benignErrorReporter);
        this.unit_fk = null;
    }
}

/**
 * remove_process_parameterValues - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process_parameter_value.prototype.remove_process_parameterValues = async function(input, benignErrorReporter) {
    if (input.removeProcess_parameterValues == this.process_parameterValues_fk) {
        await process_parameter_value.remove_process_parameterValues_fk(this.getIdValue(), input.removeProcess_parameterValues, benignErrorReporter);
        this.process_parameterValues_fk = null;
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

    let process_parameter_value = await resolvers.readOneProcess_parameter_value({
        id: id
    }, context);
    //check that record actually exists
    if (process_parameter_value === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    promises_to_many.push(process_parameter_value.countFilteredComments({}, context));
    promises_to_one.push(process_parameter_value.category({}, context));
    promises_to_one.push(process_parameter_value.unit({}, context));
    promises_to_one.push(process_parameter_value.process_parameterValues({}, context));


    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated;
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
        throw new Error(`process_parameter_value with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
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
    const process_parameter_value_record = await resolvers.readOneProcess_parameter_value({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * process_parameter_values - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    process_parameter_values: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "process_parameter_values");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process_parameter_value.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * process_parameter_valuesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    process_parameter_valuesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "process_parameter_valuesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process_parameter_value.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneProcess_parameter_value - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneProcess_parameter_value: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneProcess_parameter_value");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process_parameter_value.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countProcess_parameter_values - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countProcess_parameter_values: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process_parameter_value.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateProcess_parameter_valueForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcess_parameter_valueForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'process_parameter_value', 'read');
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
                    process_parameter_value,
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
     * validateProcess_parameter_valueForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcess_parameter_valueForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'process_parameter_value', 'read');
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
                    process_parameter_value,
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
     * validateProcess_parameter_valueForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcess_parameter_valueForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'process_parameter_value', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    process_parameter_value,
                    id);
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
     * validateProcess_parameter_valueAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcess_parameter_valueAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'process_parameter_value', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    process_parameter_value,
                    id);
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
     * addProcess_parameter_value - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addProcess_parameter_value: async function(input, context) {
        let authorization = await checkAuthorization(context, 'process_parameter_value', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdProcess_parameter_value = await process_parameter_value.addOne(inputSanitized, benignErrorReporter);
            await createdProcess_parameter_value.handleAssociations(inputSanitized, benignErrorReporter);
            return createdProcess_parameter_value;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddProcess_parameter_valueCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddProcess_parameter_valueCsv: async function(_, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return process_parameter_value.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteProcess_parameter_value - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteProcess_parameter_value: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return process_parameter_value.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateProcess_parameter_value - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateProcess_parameter_value: async function(input, context) {
        let authorization = await checkAuthorization(context, 'process_parameter_value', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedProcess_parameter_value = await process_parameter_value.updateOne(inputSanitized, benignErrorReporter);
            await updatedProcess_parameter_value.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedProcess_parameter_value;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateProcess_parameter_valueWithCategory_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcess_parameter_valueWithCategory_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                category_fk
            }) => category_fk)), models.protocol_parameter);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkAssociateProcess_parameter_valueWithCategory_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcess_parameter_valueWithUnit_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcess_parameter_valueWithUnit_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                unit_fk
            }) => unit_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcess_parameter_valueWithProcess_parameterValues_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcess_parameter_valueWithProcess_parameterValues_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_parameterValues_fk
            }) => process_parameterValues_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcess_parameter_valueWithCategory_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcess_parameter_valueWithCategory_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                category_fk
            }) => category_fk)), models.protocol_parameter);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkDisAssociateProcess_parameter_valueWithCategory_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcess_parameter_valueWithUnit_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcess_parameter_valueWithUnit_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                unit_fk
            }) => unit_fk)), models.ontology_annotation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkDisAssociateProcess_parameter_valueWithUnit_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcess_parameter_valueWithProcess_parameterValues_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcess_parameter_valueWithProcess_parameterValues_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                process_parameterValues_fk
            }) => process_parameterValues_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process_parameter_value);
        }
        return await process_parameter_value.bulkDisAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateProcess_parameter_value - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateProcess_parameter_value: async function(_, context) {
        if (await checkAuthorization(context, 'process_parameter_value', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return process_parameter_value.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}