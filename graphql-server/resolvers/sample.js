/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sample = require(path.join(__dirname, '..', 'models', 'index.js')).sample;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addObservation_unit': 'observation_unit',
    'addData_files': 'data_file'
}



/**
 * sample.prototype.observation_unit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.observation_unit = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.observation_unit_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneObservation_unit({
                [models.observation_unit.idAttribute()]: this.observation_unit_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.observation_unit.idAttribute(),
                "value": this.observation_unit_id,
                "operator": "eq"
            });
            let found = (await resolvers.observation_unitsConnection({
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
 * sample.prototype.data_filesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample.prototype.data_filesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.data_file_ids) || this.data_file_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data_file.idAttribute(),
        "value": this.data_file_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.data_files({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * sample.prototype.countFilteredData_files - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample.prototype.countFilteredData_files = function({
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
 * sample.prototype.data_filesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sample.prototype.data_filesConnection = function({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addData_files)) {
        promises_add.push(this.add_data_files(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addObservation_unit)) {
        promises_add.push(this.add_observation_unit(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeData_files)) {
        promises_remove.push(this.remove_data_files(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeObservation_unit)) {
        promises_remove.push(this.remove_observation_unit(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_data_files - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_data_files = async function(input, benignErrorReporter) {

    await sample.add_data_file_ids(this.getIdValue(), input.addData_files, benignErrorReporter);
    this.data_file_ids = helper.unionIds(this.data_file_ids, input.addData_files);
}

/**
 * add_observation_unit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_observation_unit = async function(input, benignErrorReporter) {
    await sample.add_observation_unit_id(this.getIdValue(), input.addObservation_unit, benignErrorReporter);
    this.observation_unit_id = input.addObservation_unit;
}

/**
 * remove_data_files - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_data_files = async function(input, benignErrorReporter) {

    await sample.remove_data_file_ids(this.getIdValue(), input.removeData_files, benignErrorReporter);
    this.data_file_ids = helper.differenceIds(this.data_file_ids, input.removeData_files);
}

/**
 * remove_observation_unit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_observation_unit = async function(input, benignErrorReporter) {
    if (input.removeObservation_unit == this.observation_unit_id) {
        await sample.remove_observation_unit_id(this.getIdValue(), input.removeObservation_unit, benignErrorReporter);
        this.observation_unit_id = null;
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

    let sample = await resolvers.readOneSample({
        id: id
    }, context);
    //check that record actually exists
    if (sample === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(sample.countFilteredData_files({}, context));
    promises_to_one.push(sample.observation_unit({}, context));

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
        throw new Error(`sample with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * samples - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    samples: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "samples");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    samplesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "samplesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSample - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSample: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSample");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSamples - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSamples: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSample - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSample: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            return helper.vueTable(context.request, sample, ["id", "id", "value", "plant_structure_development_stage", "plant_anatomical_entity", "description", "external_id", "observation_unit_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSample - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSample: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSample = await sample.addOne(inputSanitized, benignErrorReporter);
            await createdSample.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSample;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSampleCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSampleCsv: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSample - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSample: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sample.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSample - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSample: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSample = await sample.updateOne(inputSanitized, benignErrorReporter);
            await updatedSample.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSample;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateSampleWithObservation_unit_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSampleWithObservation_unit_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observation_unit_id
            }) => observation_unit_id)), models.observation_unit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkAssociateSampleWithObservation_unit_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateSampleWithObservation_unit_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSampleWithObservation_unit_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observation_unit_id
            }) => observation_unit_id)), models.observation_unit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkDisAssociateSampleWithObservation_unit_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateSample - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSample: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}