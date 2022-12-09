/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observation_unit = require(path.join(__dirname, '..', 'models', 'index.js')).observation_unit;
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
    'addBiological_materials': 'biological_material',
    'addData_files': 'data_file',
    'addEvents': 'event',
    'addFactors': 'factor',
    'addSamples': 'sample'
}

/**
 * observation_unit.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation_unit.prototype.study = async function({
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
 * observation_unit.prototype.countFilteredBiological_materials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observation_unit.prototype.countFilteredBiological_materials = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.biological_material_ids) || this.biological_material_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.biological_material.idAttribute(),
        "value": this.biological_material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countBiological_materials({
        search: nsearch
    }, context);
}


/**
 * observation_unit.prototype.biological_materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observation_unit.prototype.biological_materialsConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.biological_material_ids) || this.biological_material_ids.length === 0) {
        return {
            edges: [],
            biological_materials: [],
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
        "field": models.biological_material.idAttribute(),
        "value": this.biological_material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.biological_materialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observation_unit.prototype.countFilteredData_files - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observation_unit.prototype.countFilteredData_files = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.data_file_ids) || this.data_file_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data_file.idAttribute(),
        "value": this.data_file_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countData_files({
        search: nsearch
    }, context);
}


/**
 * observation_unit.prototype.data_filesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observation_unit.prototype.data_filesConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.data_file_ids) || this.data_file_ids.length === 0) {
        return {
            edges: [],
            data_files: [],
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
        "field": models.data_file.idAttribute(),
        "value": this.data_file_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.data_filesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observation_unit.prototype.countFilteredEvents - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observation_unit.prototype.countFilteredEvents = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.event_ids) || this.event_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.event.idAttribute(),
        "value": this.event_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countEvents({
        search: nsearch
    }, context);
}


/**
 * observation_unit.prototype.eventsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observation_unit.prototype.eventsConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.event_ids) || this.event_ids.length === 0) {
        return {
            edges: [],
            events: [],
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
        "field": models.event.idAttribute(),
        "value": this.event_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.eventsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observation_unit.prototype.countFilteredFactors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observation_unit.prototype.countFilteredFactors = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countFactors({
        search: nsearch
    }, context);
}


/**
 * observation_unit.prototype.factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observation_unit.prototype.factorsConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return {
            edges: [],
            factors: [],
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
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.factorsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observation_unit.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observation_unit.prototype.countFilteredSamples = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observation_unit_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countSamples({
        search: nsearch
    }, context);
}


/**
 * observation_unit.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observation_unit.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observation_unit_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.samplesConnection({
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
observation_unit.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addBiological_materials)) {
        promises_add.push(this.add_biological_materials(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addData_files)) {
        promises_add.push(this.add_data_files(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addEvents)) {
        promises_add.push(this.add_events(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises_add.push(this.add_factors(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addSamples)) {
        promises_add.push(this.add_samples(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeBiological_materials)) {
        promises_remove.push(this.remove_biological_materials(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeData_files)) {
        promises_remove.push(this.remove_data_files(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeEvents)) {
        promises_remove.push(this.remove_events(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises_remove.push(this.remove_factors(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises_remove.push(this.remove_samples(input, benignErrorReporter, token));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_biological_materials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_biological_materials = async function(input, benignErrorReporter, token) {

    await observation_unit.add_biological_material_ids(this.getIdValue(), input.addBiological_materials, benignErrorReporter, token);
    this.biological_material_ids = helper.unionIds(this.biological_material_ids, input.addBiological_materials);
}

/**
 * add_data_files - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_data_files = async function(input, benignErrorReporter, token) {

    await observation_unit.add_data_file_ids(this.getIdValue(), input.addData_files, benignErrorReporter, token);
    this.data_file_ids = helper.unionIds(this.data_file_ids, input.addData_files);
}

/**
 * add_events - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_events = async function(input, benignErrorReporter, token) {

    await observation_unit.add_event_ids(this.getIdValue(), input.addEvents, benignErrorReporter, token);
    this.event_ids = helper.unionIds(this.event_ids, input.addEvents);
}

/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_factors = async function(input, benignErrorReporter, token) {

    await observation_unit.add_factor_ids(this.getIdValue(), input.addFactors, benignErrorReporter, token);
    this.factor_ids = helper.unionIds(this.factor_ids, input.addFactors);
}

/**
 * add_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_samples = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addSamples.map(associatedRecordId => {
        return {
            observation_unit_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkAssociateSampleWithObservation_unit_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.add_study = async function(input, benignErrorReporter, token) {
    await observation_unit.add_study_id(this.getIdValue(), input.addStudy, benignErrorReporter, token);
    this.study_id = input.addStudy;
}

/**
 * remove_biological_materials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_biological_materials = async function(input, benignErrorReporter, token) {

    await observation_unit.remove_biological_material_ids(this.getIdValue(), input.removeBiological_materials, benignErrorReporter, token);
    this.biological_material_ids = helper.differenceIds(this.biological_material_ids, input.removeBiological_materials);
}

/**
 * remove_data_files - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_data_files = async function(input, benignErrorReporter, token) {

    await observation_unit.remove_data_file_ids(this.getIdValue(), input.removeData_files, benignErrorReporter, token);
    this.data_file_ids = helper.differenceIds(this.data_file_ids, input.removeData_files);
}

/**
 * remove_events - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_events = async function(input, benignErrorReporter, token) {

    await observation_unit.remove_event_ids(this.getIdValue(), input.removeEvents, benignErrorReporter, token);
    this.event_ids = helper.differenceIds(this.event_ids, input.removeEvents);
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_factors = async function(input, benignErrorReporter, token) {

    await observation_unit.remove_factor_ids(this.getIdValue(), input.removeFactors, benignErrorReporter, token);
    this.factor_ids = helper.differenceIds(this.factor_ids, input.removeFactors);
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_samples = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeSamples.map(associatedRecordId => {
        return {
            observation_unit_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkDisAssociateSampleWithObservation_unit_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
observation_unit.prototype.remove_study = async function(input, benignErrorReporter, token) {
    if (input.removeStudy == this.study_id) {
        await observation_unit.remove_study_id(this.getIdValue(), input.removeStudy, benignErrorReporter, token);
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

    let observation_unit = await resolvers.readOneObservation_unit({
        id: id
    }, context);
    //check that record actually exists
    if (observation_unit === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;


    get_to_many_associated_fk += Array.isArray(observation_unit.biological_material_ids) ? observation_unit.biological_material_ids.length : 0;

    get_to_many_associated_fk += Array.isArray(observation_unit.data_file_ids) ? observation_unit.data_file_ids.length : 0;

    get_to_many_associated_fk += Array.isArray(observation_unit.event_ids) ? observation_unit.event_ids.length : 0;

    get_to_many_associated_fk += Array.isArray(observation_unit.factor_ids) ? observation_unit.factor_ids.length : 0;
    promises_to_many.push(observation_unit.countFilteredSamples({}, context));
    promises_to_one.push(observation_unit.study({}, context));

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
        throw new Error(`observation_unit with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
    const observation_unit_record = await resolvers.readOneObservation_unit({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;


}

module.exports = {

    /**
     * observation_unitsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observation_unitsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "observation_unitsConnection");

        //check: adapters
        let registeredAdapters = Object.values(observation_unit.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observation_unit"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "observation_unit"');
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
            return await observation_unit.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "observation_unit" ');
            }
        }
    },


    /**
     * readOneObservation_unit - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneObservation_unit: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, observation_unit.adapterForIri(id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservation_unit");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return observation_unit.readById(id, context.benignErrors, token);
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addObservation_unit - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservation_unit: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, observation_unit.adapterForIri(input.id), 'create');
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
            let createdRecord = await observation_unit.addOne(inputSanitized, context.benignErrors, token);
            await createdRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * deleteObservation_unit - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservation_unit: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, observation_unit.adapterForIri(id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return observation_unit.deleteOne(id, context.benignErrors, token);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updateObservation_unit - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservation_unit: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, observation_unit.adapterForIri(input.id), 'update');
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
            let updatedRecord = await observation_unit.updateOne(inputSanitized, context.benignErrors, token);
            await updatedRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countObservation_units - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countObservation_units: async function({
        search
    }, context) {

        //check: adapters
        let registeredAdapters = Object.values(observation_unit.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observation_unit"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "observation_unit"');
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
            return await observation_unit.countRecords(search, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "observation_unit"');
            }
        }
    },

    /**
     * bulkAssociateObservation_unitWithStudy_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservation_unitWithStudy_id: async function(bulkAssociationInput, context) {
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
            }) => id)), observation_unit, token);
        }
        return await observation_unit.bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },
    /**
     * bulkDisAssociateObservation_unitWithStudy_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservation_unitWithStudy_id: async function(bulkAssociationInput, context) {
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
            }) => id)), observation_unit, token);
        }
        return await observation_unit.bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput.bulkAssociationInput, context.benignErrors, token);
    },

    /**
     * csvTableTemplateObservation_unit - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservation_unit: async function(_, context) {
        if (await checkAuthorization(context, 'observation_unit', 'read') === true) {
            return observation_unit.csvTableTemplate(context.benignErrors);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observation_unitsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    observation_unitsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "observation_unit", "read")) === true) {
            return observation_unit.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observation_unitsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    observation_unitsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "observation_unit", "read")) === true) {
            return observation_unit.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateObservation_unitForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservation_unitForCreation: async (input, context) => {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        let authorization = await checkAuthorization(context, observation_unit.adapterForIri(input.id), 'read');
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
                    observation_unit,
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
     * validateObservation_unitForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservation_unitForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, observation_unit.adapterForIri(input.id), 'read');
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
                    observation_unit,
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
     * validateObservation_unitForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservation_unitForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, observation_unit.adapterForIri(id), 'read')) === true) {

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    observation_unit,
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
     * validateObservation_unitAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateObservation_unitAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, observation_unit.adapterForIri(id), 'read')) === true) {

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    observation_unit,
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