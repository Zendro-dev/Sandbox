/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const data_file = require(path.join(__dirname, '..', 'models', 'index.js')).data_file;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addStudy': 'study',
    'addObservation_units': 'observation_unit',
    'addObserved_variables': 'observed_variable',
    'addSamples': 'sample'
}



/**
 * data_file.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
data_file.prototype.study = async function({
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
 * data_file.prototype.observation_unitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
data_file.prototype.observation_unitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observation_unit_ids) || this.observation_unit_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observation_unit.idAttribute(),
        "value": this.observation_unit_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observation_units({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * data_file.prototype.countFilteredObservation_units - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
data_file.prototype.countFilteredObservation_units = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observation_unit_ids) || this.observation_unit_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observation_unit.idAttribute(),
        "value": this.observation_unit_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countObservation_units({
        search: nsearch
    }, context);
}

/**
 * data_file.prototype.observation_unitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
data_file.prototype.observation_unitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observation_unit_ids) || this.observation_unit_ids.length === 0) {
        return {
            edges: [],
            observation_units: [],
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
        "field": models.observation_unit.idAttribute(),
        "value": this.observation_unit_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observation_unitsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * data_file.prototype.observed_variablesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
data_file.prototype.observed_variablesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observed_variables({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * data_file.prototype.countFilteredObserved_variables - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
data_file.prototype.countFilteredObserved_variables = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countObserved_variables({
        search: nsearch
    }, context);
}

/**
 * data_file.prototype.observed_variablesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
data_file.prototype.observed_variablesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return {
            edges: [],
            observed_variables: [],
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
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observed_variablesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * data_file.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
data_file.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_ids) || this.sample_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.sample_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samples({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * data_file.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
data_file.prototype.countFilteredSamples = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_ids) || this.sample_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.sample_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * data_file.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
data_file.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.sample_ids) || this.sample_ids.length === 0) {
        return {
            edges: [],
            samples: [],
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
        "field": models.sample.idAttribute(),
        "value": this.sample_ids.join(','),
        "valueType": "Array",
        "operator": "in"
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
 */
data_file.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservation_units)) {
        promises_add.push(this.add_observation_units(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObserved_variables)) {
        promises_add.push(this.add_observed_variables(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSamples)) {
        promises_add.push(this.add_samples(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservation_units)) {
        promises_remove.push(this.remove_observation_units(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObserved_variables)) {
        promises_remove.push(this.remove_observed_variables(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises_remove.push(this.remove_samples(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observation_units - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.add_observation_units = async function(input, benignErrorReporter) {

    await data_file.add_observation_unit_ids(this.getIdValue(), input.addObservation_units, benignErrorReporter);
    this.observation_unit_ids = helper.unionIds(this.observation_unit_ids, input.addObservation_units);
}

/**
 * add_observed_variables - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.add_observed_variables = async function(input, benignErrorReporter) {

    await data_file.add_observed_variable_ids(this.getIdValue(), input.addObserved_variables, benignErrorReporter);
    this.observed_variable_ids = helper.unionIds(this.observed_variable_ids, input.addObserved_variables);
}

/**
 * add_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.add_samples = async function(input, benignErrorReporter) {

    await data_file.add_sample_ids(this.getIdValue(), input.addSamples, benignErrorReporter);
    this.sample_ids = helper.unionIds(this.sample_ids, input.addSamples);
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.add_study = async function(input, benignErrorReporter) {
    await data_file.add_study_id(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.study_id = input.addStudy;
}

/**
 * remove_observation_units - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.remove_observation_units = async function(input, benignErrorReporter) {

    await data_file.remove_observation_unit_ids(this.getIdValue(), input.removeObservation_units, benignErrorReporter);
    this.observation_unit_ids = helper.differenceIds(this.observation_unit_ids, input.removeObservation_units);
}

/**
 * remove_observed_variables - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.remove_observed_variables = async function(input, benignErrorReporter) {

    await data_file.remove_observed_variable_ids(this.getIdValue(), input.removeObserved_variables, benignErrorReporter);
    this.observed_variable_ids = helper.differenceIds(this.observed_variable_ids, input.removeObserved_variables);
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.remove_samples = async function(input, benignErrorReporter) {

    await data_file.remove_sample_ids(this.getIdValue(), input.removeSamples, benignErrorReporter);
    this.sample_ids = helper.differenceIds(this.sample_ids, input.removeSamples);
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
data_file.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.study_id) {
        await data_file.remove_study_id(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.study_id = null;
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

    let data_file = await resolvers.readOneData_file({
        id: id
    }, context);
    //check that record actually exists
    if (data_file === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(data_file.countFilteredObservation_units({}, context));
    promises_to_many.push(data_file.countFilteredObserved_variables({}, context));
    promises_to_many.push(data_file.countFilteredSamples({}, context));
    promises_to_one.push(data_file.study({}, context));

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
        throw new Error(`data_file with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * data_files - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    data_files: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "data_files");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await data_file.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * data_filesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    data_filesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "data_filesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await data_file.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneData_file - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneData_file: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneData_file");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await data_file.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countData_files - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countData_files: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await data_file.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableData_file - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableData_file: async function(_, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            return helper.vueTable(context.request, data_file, ["id", "id", "url", "description", "version", "study_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addData_file - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addData_file: async function(input, context) {
        let authorization = await checkAuthorization(context, 'data_file', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdData_file = await data_file.addOne(inputSanitized, benignErrorReporter);
            await createdData_file.handleAssociations(inputSanitized, benignErrorReporter);
            return createdData_file;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddData_fileCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddData_fileCsv: async function(_, context) {
        if (await checkAuthorization(context, 'data_file', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return data_file.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteData_file - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteData_file: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'data_file', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return data_file.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateData_file - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateData_file: async function(input, context) {
        let authorization = await checkAuthorization(context, 'data_file', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedData_file = await data_file.updateOne(inputSanitized, benignErrorReporter);
            await updatedData_file.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedData_file;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateData_fileWithStudy_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateData_fileWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), data_file);
        }
        return await data_file.bulkAssociateData_fileWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateData_fileWithStudy_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateData_fileWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), data_file);
        }
        return await data_file.bulkDisAssociateData_fileWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateData_file - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateData_file: async function(_, context) {
        if (await checkAuthorization(context, 'data_file', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return data_file.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}