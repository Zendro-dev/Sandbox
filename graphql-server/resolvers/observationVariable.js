/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observationVariable = require(path.join(__dirname, '..', 'models', 'index.js')).observationVariable;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addMethod': 'method',
    'addOntologyReference': 'ontologyReference',
    'addScale': 'scale',
    'addTrait': 'trait',
    'addObservations': 'observation'
}



/**
 * observationVariable.prototype.method - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationVariable.prototype.method = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.methodDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMethod({
                [models.method.idAttribute()]: this.methodDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.method.idAttribute(),
                "value": this.methodDbId,
                "operator": "eq"
            });
            let found = await resolvers.methods({
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
 * observationVariable.prototype.ontologyReference - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationVariable.prototype.ontologyReference = async function({
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
 * observationVariable.prototype.scale - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationVariable.prototype.scale = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.scaleDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneScale({
                [models.scale.idAttribute()]: this.scaleDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.scale.idAttribute(),
                "value": this.scaleDbId,
                "operator": "eq"
            });
            let found = await resolvers.scales({
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
 * observationVariable.prototype.trait - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationVariable.prototype.trait = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.traitDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneTrait({
                [models.trait.idAttribute()]: this.traitDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.trait.idAttribute(),
                "value": this.traitDbId,
                "operator": "eq"
            });
            let found = await resolvers.traits({
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
 * observationVariable.prototype.observationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
observationVariable.prototype.observationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationVariableDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observationVariable.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationVariable.prototype.countFilteredObservations = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationVariableDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservations({
        search: nsearch
    }, context);
}

/**
 * observationVariable.prototype.observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationVariable.prototype.observationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationVariableDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationsConnection({
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
observationVariable.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservations)) {
        promises_add.push(this.add_observations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMethod)) {
        promises_add.push(this.add_method(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addOntologyReference)) {
        promises_add.push(this.add_ontologyReference(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addScale)) {
        promises_add.push(this.add_scale(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTrait)) {
        promises_add.push(this.add_trait(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservations)) {
        promises_remove.push(this.remove_observations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMethod)) {
        promises_remove.push(this.remove_method(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeOntologyReference)) {
        promises_remove.push(this.remove_ontologyReference(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeScale)) {
        promises_remove.push(this.remove_scale(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTrait)) {
        promises_remove.push(this.remove_trait(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.add_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservations.map(associatedRecordId => {
        return {
            observationVariableDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkAssociateObservationWithObservationVariableDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_method - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.add_method = async function(input, benignErrorReporter) {
    await observationVariable.add_methodDbId(this.getIdValue(), input.addMethod, benignErrorReporter);
    this.methodDbId = input.addMethod;
}

/**
 * add_ontologyReference - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.add_ontologyReference = async function(input, benignErrorReporter) {
    await observationVariable.add_ontologyDbId(this.getIdValue(), input.addOntologyReference, benignErrorReporter);
    this.ontologyDbId = input.addOntologyReference;
}

/**
 * add_scale - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.add_scale = async function(input, benignErrorReporter) {
    await observationVariable.add_scaleDbId(this.getIdValue(), input.addScale, benignErrorReporter);
    this.scaleDbId = input.addScale;
}

/**
 * add_trait - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.add_trait = async function(input, benignErrorReporter) {
    await observationVariable.add_traitDbId(this.getIdValue(), input.addTrait, benignErrorReporter);
    this.traitDbId = input.addTrait;
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.remove_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservations.map(associatedRecordId => {
        return {
            observationVariableDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkDisAssociateObservationWithObservationVariableDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_method - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.remove_method = async function(input, benignErrorReporter) {
    if (input.removeMethod == this.methodDbId) {
        await observationVariable.remove_methodDbId(this.getIdValue(), input.removeMethod, benignErrorReporter);
        this.methodDbId = null;
    }
}

/**
 * remove_ontologyReference - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.remove_ontologyReference = async function(input, benignErrorReporter) {
    if (input.removeOntologyReference == this.ontologyDbId) {
        await observationVariable.remove_ontologyDbId(this.getIdValue(), input.removeOntologyReference, benignErrorReporter);
        this.ontologyDbId = null;
    }
}

/**
 * remove_scale - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.remove_scale = async function(input, benignErrorReporter) {
    if (input.removeScale == this.scaleDbId) {
        await observationVariable.remove_scaleDbId(this.getIdValue(), input.removeScale, benignErrorReporter);
        this.scaleDbId = null;
    }
}

/**
 * remove_trait - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationVariable.prototype.remove_trait = async function(input, benignErrorReporter) {
    if (input.removeTrait == this.traitDbId) {
        await observationVariable.remove_traitDbId(this.getIdValue(), input.removeTrait, benignErrorReporter);
        this.traitDbId = null;
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

    let observationVariable = await resolvers.readOneObservationVariable({
        observationVariableDbId: id
    }, context);
    //check that record actually exists
    if (observationVariable === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(observationVariable.countFilteredObservations({}, context));
    promises_to_one.push(observationVariable.method({}, context));
    promises_to_one.push(observationVariable.ontologyReference({}, context));
    promises_to_one.push(observationVariable.scale({}, context));
    promises_to_one.push(observationVariable.trait({}, context));

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
        throw new Error(`observationVariable with observationVariableDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * observationVariables - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    observationVariables: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "observationVariables");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationVariable.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationVariablesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observationVariablesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "observationVariablesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationVariable.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneObservationVariable - Check user authorization and return one record with the specified observationVariableDbId in the observationVariableDbId argument.
     *
     * @param  {number} {observationVariableDbId}    observationVariableDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with observationVariableDbId requested
     */
    readOneObservationVariable: async function({
        observationVariableDbId
    }, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservationVariable");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationVariable.readById(observationVariableDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countObservationVariables - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countObservationVariables: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationVariable.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableObservationVariable - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableObservationVariable: async function(_, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            return helper.vueTable(context.request, observationVariable, ["id", "commonCropName", "defaultValue", "documentationURL", "growthStage", "institution", "language", "scientist", "status", "xref", "observationVariableDbId", "observationVariableName", "methodDbId", "scaleDbId", "traitDbId", "ontologyDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addObservationVariable - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservationVariable: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationVariable', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdObservationVariable = await observationVariable.addOne(inputSanitized, benignErrorReporter);
            await createdObservationVariable.handleAssociations(inputSanitized, benignErrorReporter);
            return createdObservationVariable;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddObservationVariableCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationVariableCsv: async function(_, context) {
        if (await checkAuthorization(context, 'observationVariable', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationVariable.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteObservationVariable - Check user authorization and delete a record with the specified observationVariableDbId in the observationVariableDbId argument.
     *
     * @param  {number} {observationVariableDbId}    observationVariableDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservationVariable: async function({
        observationVariableDbId
    }, context) {
        if (await checkAuthorization(context, 'observationVariable', 'delete') === true) {
            if (await validForDeletion(observationVariableDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return observationVariable.deleteOne(observationVariableDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateObservationVariable - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservationVariable: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationVariable', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedObservationVariable = await observationVariable.updateOne(inputSanitized, benignErrorReporter);
            await updatedObservationVariable.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedObservationVariable;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateObservationVariableWithMethodDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationVariableWithMethodDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                methodDbId
            }) => methodDbId)), models.method);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkAssociateObservationVariableWithMethodDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationVariableWithOntologyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationVariableWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkAssociateObservationVariableWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationVariableWithScaleDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationVariableWithScaleDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                scaleDbId
            }) => scaleDbId)), models.scale);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkAssociateObservationVariableWithScaleDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationVariableWithTraitDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationVariableWithTraitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                traitDbId
            }) => traitDbId)), models.trait);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkAssociateObservationVariableWithTraitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationVariableWithMethodDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationVariableWithMethodDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                methodDbId
            }) => methodDbId)), models.method);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkDisAssociateObservationVariableWithMethodDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationVariableWithOntologyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationVariableWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkDisAssociateObservationVariableWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationVariableWithScaleDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationVariableWithScaleDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                scaleDbId
            }) => scaleDbId)), models.scale);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkDisAssociateObservationVariableWithScaleDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationVariableWithTraitDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationVariableWithTraitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                traitDbId
            }) => traitDbId)), models.trait);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), observationVariable);
        }
        return await observationVariable.bulkDisAssociateObservationVariableWithTraitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateObservationVariable - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservationVariable: async function(_, context) {
        if (await checkAuthorization(context, 'observationVariable', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationVariable.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}