/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const aminoacidsequence = require(path.join(__dirname, '..', 'models', 'index.js')).aminoacidsequence;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addTranscript_counts': 'transcript_count'
}




/**
 * aminoacidsequence.prototype.transcript_countsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
aminoacidsequence.prototype.transcript_countsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "aminoacidsequence_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.transcript_counts({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * aminoacidsequence.prototype.countFilteredTranscript_counts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
aminoacidsequence.prototype.countFilteredTranscript_counts = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "aminoacidsequence_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.countTranscript_counts({
        search: nsearch
    }, context);
}

/**
 * aminoacidsequence.prototype.transcript_countsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
aminoacidsequence.prototype.transcript_countsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "aminoacidsequence_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.transcript_countsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
aminoacidsequence.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addTranscript_counts)) {
        promises.push(this.add_transcript_counts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeTranscript_counts)) {
        promises.push(this.remove_transcript_counts(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_transcript_counts - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
aminoacidsequence.prototype.add_transcript_counts = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addTranscript_counts) {
        results.push(models.transcript_count.add_aminoacidsequence_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * remove_transcript_counts - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
aminoacidsequence.prototype.remove_transcript_counts = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeTranscript_counts) {
        results.push(models.transcript_count.remove_aminoacidsequence_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}




/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit(search, context, resolverName, modelName = 'aminoacidsequence') {
    let count = (await models[modelName].countRecords(search));
    helper.checkCountAndReduceRecordLimitHelper(count, context, resolverName)
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneAminoacidsequence")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let aminoacidsequence = await resolvers.readOneAminoacidsequence({
        id: id
    }, context);
    //check that record actually exists
    if (aminoacidsequence === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(aminoacidsequence.countFilteredTranscript_counts({}, context));

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
        throw new Error(`aminoacidsequence with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * aminoacidsequences - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    aminoacidsequences: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "aminoacidsequences");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await aminoacidsequence.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * aminoacidsequencesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    aminoacidsequencesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "aminoacidsequencesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await aminoacidsequence.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAminoacidsequence - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneAminoacidsequence: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await aminoacidsequence.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countAminoacidsequences - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAminoacidsequences: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await aminoacidsequence.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableAminoacidsequence - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAminoacidsequence: async function(_, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            return helper.vueTable(context.request, aminoacidsequence, ["id", "accession", "sequence"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addAminoacidsequence - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAminoacidsequence: async function(input, context) {
        let authorization = await checkAuthorization(context, 'aminoacidsequence', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAminoacidsequence = await aminoacidsequence.addOne(inputSanitized, benignErrorReporter);
            await createdAminoacidsequence.handleAssociations(inputSanitized, context);
            return createdAminoacidsequence;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddAminoacidsequenceCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAminoacidsequenceCsv: async function(_, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return aminoacidsequence.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAminoacidsequence - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAminoacidsequence: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return aminoacidsequence.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateAminoacidsequence - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAminoacidsequence: async function(input, context) {
        let authorization = await checkAuthorization(context, 'aminoacidsequence', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAminoacidsequence = await aminoacidsequence.updateOne(inputSanitized, benignErrorReporter);
            await updatedAminoacidsequence.handleAssociations(inputSanitized, context);
            return updatedAminoacidsequence;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateAminoacidsequence - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAminoacidsequence: async function(_, context) {
        if (await checkAuthorization(context, 'aminoacidsequence', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return aminoacidsequence.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}