/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const method = require(path.join(__dirname, '..', 'models', 'index.js')).method;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addOntologyReference': 'ontologyReference',
    'addObservationVariables': 'observationVariable'
}



/**
 * method.prototype.ontologyReference - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
method.prototype.ontologyReference = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.ontologyDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneOntologyReference({
                [models.ontologyReference.idAttribute()]: this.ontologyDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.ontologyReference.idAttribute(),
                "value": this.ontologyDbId,
                "operator": "eq"
            });
            let found = await resolvers.ontologyReferences({
                search: nsearch,
                pagination: {
                    limit: 1
                }
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}

/**
 * method.prototype.observationVariablesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
method.prototype.observationVariablesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "methodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observationVariables({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * method.prototype.countFilteredObservationVariables - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
method.prototype.countFilteredObservationVariables = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "methodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationVariables({
        search: nsearch
    }, context);
}

/**
 * method.prototype.observationVariablesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
method.prototype.observationVariablesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "methodDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationVariablesConnection({
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
method.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservationVariables)) {
        promises_add.push(this.add_observationVariables(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addOntologyReference)) {
        promises_add.push(this.add_ontologyReference(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservationVariables)) {
        promises_remove.push(this.remove_observationVariables(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeOntologyReference)) {
        promises_remove.push(this.remove_ontologyReference(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationVariables - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
method.prototype.add_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationVariables.map(associatedRecordId => {
        return {
            methodDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkAssociateObservationVariableWithMethodDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_ontologyReference - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
method.prototype.add_ontologyReference = async function(input, benignErrorReporter) {
    await method.add_ontologyDbId(this.getIdValue(), input.addOntologyReference, benignErrorReporter);
    this.ontologyDbId = input.addOntologyReference;
}

/**
 * remove_observationVariables - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
method.prototype.remove_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationVariables.map(associatedRecordId => {
        return {
            methodDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkDisAssociateObservationVariableWithMethodDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_ontologyReference - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
method.prototype.remove_ontologyReference = async function(input, benignErrorReporter) {
    if (input.removeOntologyReference == this.ontologyDbId) {
        await method.remove_ontologyDbId(this.getIdValue(), input.removeOntologyReference, benignErrorReporter);
        this.ontologyDbId = null;
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

    let method = await resolvers.readOneMethod({
        methodDbId: id
    }, context);
    //check that record actually exists
    if (method === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(method.countFilteredObservationVariables({}, context));
    promises_to_one.push(method.ontologyReference({}, context));

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
        throw new Error(`method with methodDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * methods - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    methods: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "methods");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await method.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * methodsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    methodsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "methodsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await method.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMethod - Check user authorization and return one record with the specified methodDbId in the methodDbId argument.
     *
     * @param  {number} {methodDbId}    methodDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with methodDbId requested
     */
    readOneMethod: async function({
        methodDbId
    }, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMethod");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await method.readById(methodDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMethods - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMethods: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await method.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableMethod - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMethod: async function(_, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            return helper.vueTable(context.request, method, ["id", "description", "formula", "methodClass", "methodName", "reference", "methodDbId", "ontologyDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addMethod - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMethod: async function(input, context) {
        let authorization = await checkAuthorization(context, 'method', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMethod = await method.addOne(inputSanitized, benignErrorReporter);
            await createdMethod.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMethod;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMethodCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMethodCsv: async function(_, context) {
        if (await checkAuthorization(context, 'method', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return method.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMethod - Check user authorization and delete a record with the specified methodDbId in the methodDbId argument.
     *
     * @param  {number} {methodDbId}    methodDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMethod: async function({
        methodDbId
    }, context) {
        if (await checkAuthorization(context, 'method', 'delete') === true) {
            if (await validForDeletion(methodDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return method.deleteOne(methodDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMethod - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMethod: async function(input, context) {
        let authorization = await checkAuthorization(context, 'method', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMethod = await method.updateOne(inputSanitized, benignErrorReporter);
            await updatedMethod.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMethod;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateMethodWithOntologyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMethodWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                methodDbId
            }) => methodDbId)), method);
        }
        return await method.bulkAssociateMethodWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMethodWithOntologyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMethodWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                methodDbId
            }) => methodDbId)), method);
        }
        return await method.bulkDisAssociateMethodWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateMethod - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMethod: async function(_, context) {
        if (await checkAuthorization(context, 'method', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return method.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}