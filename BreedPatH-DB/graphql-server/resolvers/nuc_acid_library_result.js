/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const nuc_acid_library_result = require(path.join(__dirname, '..', 'models', 'index.js')).nuc_acid_library_result;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addSample': 'sample',
    'addSequencing_experiment': 'sequencing_experiment'
}



/**
 * nuc_acid_library_result.prototype.sample - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
nuc_acid_library_result.prototype.sample = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sample_id)) {
        if (search === undefined) {
            return resolvers.readOneSample({
                [models.sample.idAttribute()]: this.sample_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sample.idAttribute(),
                "value": {
                    "value": this.sample_id
                },
                "operator": "eq"
            });
            let found = await resolvers.samples({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}
/**
 * nuc_acid_library_result.prototype.sequencing_experiment - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
nuc_acid_library_result.prototype.sequencing_experiment = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sequencing_experiment_id)) {
        if (search === undefined) {
            return resolvers.readOneSequencing_experiment({
                [models.sequencing_experiment.idAttribute()]: this.sequencing_experiment_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sequencing_experiment.idAttribute(),
                "value": {
                    "value": this.sequencing_experiment_id
                },
                "operator": "eq"
            });
            let found = await resolvers.sequencing_experiments({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}





/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
nuc_acid_library_result.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addSample)) {
        promises.push(this.add_sample(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addSequencing_experiment)) {
        promises.push(this.add_sequencing_experiment(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeSample)) {
        promises.push(this.remove_sample(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeSequencing_experiment)) {
        promises.push(this.remove_sequencing_experiment(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_sample - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
nuc_acid_library_result.prototype.add_sample = async function(input, benignErrorReporter) {
    await nuc_acid_library_result.add_sample_id(this.getIdValue(), input.addSample, benignErrorReporter);
    this.sample_id = input.addSample;
}

/**
 * add_sequencing_experiment - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
nuc_acid_library_result.prototype.add_sequencing_experiment = async function(input, benignErrorReporter) {
    await nuc_acid_library_result.add_sequencing_experiment_id(this.getIdValue(), input.addSequencing_experiment, benignErrorReporter);
    this.sequencing_experiment_id = input.addSequencing_experiment;
}

/**
 * remove_sample - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
nuc_acid_library_result.prototype.remove_sample = async function(input, benignErrorReporter) {
    if (input.removeSample == this.sample_id) {
        await nuc_acid_library_result.remove_sample_id(this.getIdValue(), input.removeSample, benignErrorReporter);
        this.sample_id = null;
    }
}

/**
 * remove_sequencing_experiment - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
nuc_acid_library_result.prototype.remove_sequencing_experiment = async function(input, benignErrorReporter) {
    if (input.removeSequencing_experiment == this.sequencing_experiment_id) {
        await nuc_acid_library_result.remove_sequencing_experiment_id(this.getIdValue(), input.removeSequencing_experiment, benignErrorReporter);
        this.sequencing_experiment_id = null;
    }
}



/**
 * errorMessageForRecordsLimit(query) - returns error message in case the record limit is exceeded.
 *
 * @param {string} query The query that failed
 */
function errorMessageForRecordsLimit(query) {
    return "Max record limit of " + globals.LIMIT_RECORDS + " exceeded in " + query;
}

/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCountAndReduceRecordsLimit(search, context, query) {
    let count = (await nuc_acid_library_result.countRecords(search));
    if (count > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= count;
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneNuc_acid_library_result"));
    }
    context.recordsLimit -= 1;
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let nuc_acid_library_result = await resolvers.readOneNuc_acid_library_result({
        id: id
    }, context);
    //check that record actually exists
    if (nuc_acid_library_result === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(nuc_acid_library_result.sample({}, context));
    promises_to_one.push(nuc_acid_library_result.sequencing_experiment({}, context));

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
        throw new Error(`nuc_acid_library_result with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * nuc_acid_library_results - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    nuc_acid_library_results: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "nuc_acid_library_results");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await nuc_acid_library_result.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * nuc_acid_library_resultsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    nuc_acid_library_resultsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "nuc_acid_library_resultsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await nuc_acid_library_result.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneNuc_acid_library_result - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneNuc_acid_library_result: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await nuc_acid_library_result.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countNuc_acid_library_results - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countNuc_acid_library_results: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await nuc_acid_library_result.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableNuc_acid_library_result - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableNuc_acid_library_result: async function(_, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            return helper.vueTable(context.request, nuc_acid_library_result, ["id", "lab_code", "file_name", "file_uri", "type"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addNuc_acid_library_result - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addNuc_acid_library_result: async function(input, context) {
        let authorization = await checkAuthorization(context, 'nuc_acid_library_result', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdNuc_acid_library_result = await nuc_acid_library_result.addOne(inputSanitized, benignErrorReporter);
            await createdNuc_acid_library_result.handleAssociations(inputSanitized, context);
            return createdNuc_acid_library_result;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddNuc_acid_library_resultCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddNuc_acid_library_resultCsv: async function(_, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return nuc_acid_library_result.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteNuc_acid_library_result - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteNuc_acid_library_result: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return nuc_acid_library_result.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateNuc_acid_library_result - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateNuc_acid_library_result: async function(input, context) {
        let authorization = await checkAuthorization(context, 'nuc_acid_library_result', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedNuc_acid_library_result = await nuc_acid_library_result.updateOne(inputSanitized, benignErrorReporter);
            await updatedNuc_acid_library_result.handleAssociations(inputSanitized, context);
            return updatedNuc_acid_library_result;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateNuc_acid_library_result - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateNuc_acid_library_result: async function(_, context) {
        if (await checkAuthorization(context, 'nuc_acid_library_result', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return nuc_acid_library_result.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}