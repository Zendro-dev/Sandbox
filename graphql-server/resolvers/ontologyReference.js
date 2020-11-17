/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const ontologyReference = require(path.join(__dirname, '..', 'models', 'index.js')).ontologyReference;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addScales': 'scale',
    'addMethods': 'method',
    'addTraits': 'trait',
    'addObservationVariables': 'observationVariable'
}




/**
 * ontologyReference.prototype.scalesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.scalesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.scales({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontologyReference.prototype.countFilteredScales - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyReference.prototype.countFilteredScales = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countScales({
        search: nsearch
    }, context);
}

/**
 * ontologyReference.prototype.scalesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.scalesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.scalesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontologyReference.prototype.methodsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.methodsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.methods({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontologyReference.prototype.countFilteredMethods - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyReference.prototype.countFilteredMethods = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countMethods({
        search: nsearch
    }, context);
}

/**
 * ontologyReference.prototype.methodsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.methodsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.methodsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontologyReference.prototype.traitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.traitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.traits({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ontologyReference.prototype.countFilteredTraits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyReference.prototype.countFilteredTraits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countTraits({
        search: nsearch
    }, context);
}

/**
 * ontologyReference.prototype.traitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.traitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.traitsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * ontologyReference.prototype.observationVariablesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.observationVariablesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
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
 * ontologyReference.prototype.countFilteredObservationVariables - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ontologyReference.prototype.countFilteredObservationVariables = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationVariables({
        search: nsearch
    }, context);
}

/**
 * ontologyReference.prototype.observationVariablesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ontologyReference.prototype.observationVariablesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "ontologyDbId",
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
ontologyReference.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addScales)) {
        promises_add.push(this.add_scales(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMethods)) {
        promises_add.push(this.add_methods(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addTraits)) {
        promises_add.push(this.add_traits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservationVariables)) {
        promises_add.push(this.add_observationVariables(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeScales)) {
        promises_remove.push(this.remove_scales(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMethods)) {
        promises_remove.push(this.remove_methods(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeTraits)) {
        promises_remove.push(this.remove_traits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservationVariables)) {
        promises_remove.push(this.remove_observationVariables(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_scales - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.add_scales = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addScales.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.scale.idAttribute()]: associatedRecordId
        }
    });
    await models.scale.bulkAssociateScaleWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_methods - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.add_methods = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addMethods.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.method.idAttribute()]: associatedRecordId
        }
    });
    await models.method.bulkAssociateMethodWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_traits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.add_traits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addTraits.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.trait.idAttribute()]: associatedRecordId
        }
    });
    await models.trait.bulkAssociateTraitWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observationVariables - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.add_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationVariables.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkAssociateObservationVariableWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_scales - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.remove_scales = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeScales.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.scale.idAttribute()]: associatedRecordId
        }
    });
    await models.scale.bulkDisAssociateScaleWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_methods - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.remove_methods = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeMethods.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.method.idAttribute()]: associatedRecordId
        }
    });
    await models.method.bulkDisAssociateMethodWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_traits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.remove_traits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeTraits.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.trait.idAttribute()]: associatedRecordId
        }
    });
    await models.trait.bulkDisAssociateTraitWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observationVariables - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ontologyReference.prototype.remove_observationVariables = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationVariables.map(associatedRecordId => {
        return {
            ontologyDbId: this.getIdValue(),
            [models.observationVariable.idAttribute()]: associatedRecordId
        }
    });
    await models.observationVariable.bulkDisAssociateObservationVariableWithOntologyDbId(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let ontologyReference = await resolvers.readOneOntologyReference({
        ontologyDbId: id
    }, context);
    //check that record actually exists
    if (ontologyReference === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(ontologyReference.countFilteredScales({}, context));
    promises_to_many.push(ontologyReference.countFilteredMethods({}, context));
    promises_to_many.push(ontologyReference.countFilteredTraits({}, context));
    promises_to_many.push(ontologyReference.countFilteredObservationVariables({}, context));

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
        throw new Error(`ontologyReference with ontologyDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * ontologyReferences - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    ontologyReferences: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "ontologyReferences");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyReference.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * ontologyReferencesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    ontologyReferencesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "ontologyReferencesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyReference.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneOntologyReference - Check user authorization and return one record with the specified ontologyDbId in the ontologyDbId argument.
     *
     * @param  {number} {ontologyDbId}    ontologyDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with ontologyDbId requested
     */
    readOneOntologyReference: async function({
        ontologyDbId
    }, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneOntologyReference");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyReference.readById(ontologyDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countOntologyReferences - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countOntologyReferences: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ontologyReference.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableOntologyReference - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableOntologyReference: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            return helper.vueTable(context.request, ontologyReference, ["id", "documentationURL", "ontologyDbId", "ontologyName", "version"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addOntologyReference - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addOntologyReference: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontologyReference', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdOntologyReference = await ontologyReference.addOne(inputSanitized, benignErrorReporter);
            await createdOntologyReference.handleAssociations(inputSanitized, benignErrorReporter);
            return createdOntologyReference;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddOntologyReferenceCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddOntologyReferenceCsv: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontologyReference.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteOntologyReference - Check user authorization and delete a record with the specified ontologyDbId in the ontologyDbId argument.
     *
     * @param  {number} {ontologyDbId}    ontologyDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteOntologyReference: async function({
        ontologyDbId
    }, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'delete') === true) {
            if (await validForDeletion(ontologyDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return ontologyReference.deleteOne(ontologyDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateOntologyReference - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateOntologyReference: async function(input, context) {
        let authorization = await checkAuthorization(context, 'ontologyReference', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedOntologyReference = await ontologyReference.updateOne(inputSanitized, benignErrorReporter);
            await updatedOntologyReference.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedOntologyReference;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateOntologyReference - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateOntologyReference: async function(_, context) {
        if (await checkAuthorization(context, 'ontologyReference', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ontologyReference.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}