/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const trait = require(path.join(__dirname, '..', 'models', 'index.js')).trait;
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
 * trait.prototype.ontologyReference - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
trait.prototype.ontologyReference = async function({
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
 * trait.prototype.observationVariablesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
trait.prototype.observationVariablesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "traitDbId",
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
 * trait.prototype.countFilteredObservationVariables - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
trait.prototype.countFilteredObservationVariables = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "traitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationVariables({
        search: nsearch
    }, context);
}

/**
 * trait.prototype.observationVariablesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
trait.prototype.observationVariablesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "traitDbId",
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
trait.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
trait.prototype.add_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationVariables.map(associatedRecordId => {
        return {
            traitDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkAssociateObservationVariableWithTraitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_ontologyReference - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trait.prototype.add_ontologyReference = async function(input, benignErrorReporter) {
    await trait.add_ontologyDbId(this.getIdValue(), input.addOntologyReference, benignErrorReporter);
    this.ontologyDbId = input.addOntologyReference;
}

/**
 * remove_observationVariables - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trait.prototype.remove_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationVariables.map(associatedRecordId => {
        return {
            traitDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkDisAssociateObservationVariableWithTraitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_ontologyReference - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trait.prototype.remove_ontologyReference = async function(input, benignErrorReporter) {
    if (input.removeOntologyReference == this.ontologyDbId) {
        await trait.remove_ontologyDbId(this.getIdValue(), input.removeOntologyReference, benignErrorReporter);
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

    let trait = await resolvers.readOneTrait({
        traitDbId: id
    }, context);
    //check that record actually exists
    if (trait === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(trait.countFilteredObservationVariables({}, context));
    promises_to_one.push(trait.ontologyReference({}, context));

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
        throw new Error(`trait with traitDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * traits - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    traits: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "traits");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trait.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * traitsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    traitsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "traitsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trait.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneTrait - Check user authorization and return one record with the specified traitDbId in the traitDbId argument.
     *
     * @param  {number} {traitDbId}    traitDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with traitDbId requested
     */
    readOneTrait: async function({
        traitDbId
    }, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneTrait");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trait.readById(traitDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countTraits - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countTraits: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trait.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableTrait - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableTrait: async function(_, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            return helper.vueTable(context.request, trait, ["id", "attribute", "entity", "mainAbbreviation", "status", "traitClass", "traitDescription", "traitName", "xref", "traitDbId", "ontologyDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addTrait - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addTrait: async function(input, context) {
        let authorization = await checkAuthorization(context, 'trait', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdTrait = await trait.addOne(inputSanitized, benignErrorReporter);
            await createdTrait.handleAssociations(inputSanitized, benignErrorReporter);
            return createdTrait;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddTraitCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddTraitCsv: async function(_, context) {
        if (await checkAuthorization(context, 'trait', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return trait.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteTrait - Check user authorization and delete a record with the specified traitDbId in the traitDbId argument.
     *
     * @param  {number} {traitDbId}    traitDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteTrait: async function({
        traitDbId
    }, context) {
        if (await checkAuthorization(context, 'trait', 'delete') === true) {
            if (await validForDeletion(traitDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return trait.deleteOne(traitDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateTrait - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateTrait: async function(input, context) {
        let authorization = await checkAuthorization(context, 'trait', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedTrait = await trait.updateOne(inputSanitized, benignErrorReporter);
            await updatedTrait.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedTrait;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateTraitWithOntologyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateTraitWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                traitDbId
            }) => traitDbId)), trait);
        }
        return await trait.bulkAssociateTraitWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateTraitWithOntologyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateTraitWithOntologyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                ontologyDbId
            }) => ontologyDbId)), models.ontologyReference);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                traitDbId
            }) => traitDbId)), trait);
        }
        return await trait.bulkDisAssociateTraitWithOntologyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateTrait - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTrait: async function(_, context) {
        if (await checkAuthorization(context, 'trait', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return trait.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}