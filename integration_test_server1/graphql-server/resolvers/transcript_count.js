/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const transcript_count = require(path.join(__dirname, '..', 'models_index.js')).transcript_count;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models_index.js'));
const globals = require('../config/globals');

const associationArgsDef = {
    'addIndividual': 'individual',
    'addAminoacidsequence': 'aminoacidsequence'
}



/**
 * transcript_count.prototype.individual - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
transcript_count.prototype.individual = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.individual_id)) {
        if (search === undefined) {
            return resolvers.readOneIndividual({
                [models.individual.idAttribute()]: this.individual_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.individual.idAttribute(),
                "value": {
                    "value": this.individual_id
                },
                "operator": "eq"
            });
            let found = await resolvers.individuals({
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
 * transcript_count.prototype.aminoacidsequence - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
transcript_count.prototype.aminoacidsequence = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.aminoacidsequence_id)) {
        if (search === undefined) {
            return resolvers.readOneAminoacidsequence({
                [models.aminoacidsequence.idAttribute()]: this.aminoacidsequence_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.aminoacidsequence.idAttribute(),
                "value": {
                    "value": this.aminoacidsequence_id
                },
                "operator": "eq"
            });
            let found = await resolvers.aminoacidsequences({
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
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
transcript_count.prototype.handleAssociations = async function(input, context) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addIndividual)) {
        promises.push(this.add_individual(input, context));
    }
    if (helper.isNotUndefinedAndNotNull(input.addAminoacidsequence)) {
        promises.push(this.add_aminoacidsequence(input, context));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeIndividual)) {
        promises.push(this.remove_individual(input, context));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeAminoacidsequence)) {
        promises.push(this.remove_aminoacidsequence(input, context));
    }

    await Promise.all(promises);
}
/**
 * add_individual - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
transcript_count.prototype.add_individual = async function(input) {
    await transcript_count.add_individual_id(this.getIdValue(), input.addIndividual);
    this.individual_id = input.addIndividual;
}
/**
 * add_aminoacidsequence - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
transcript_count.prototype.add_aminoacidsequence = async function(input) {
    await transcript_count.add_aminoacidsequence_id(this.getIdValue(), input.addAminoacidsequence);
    this.aminoacidsequence_id = input.addAminoacidsequence;
}
/**
 * remove_individual - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
transcript_count.prototype.remove_individual = async function(input) {
    if (input.removeIndividual == this.individual_id) {
        await transcript_count.remove_individual_id(this.getIdValue(), input.removeIndividual);
        this.individual_id = null;
    }
}
/**
 * remove_aminoacidsequence - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
transcript_count.prototype.remove_aminoacidsequence = async function(input) {
    if (input.removeAminoacidsequence == this.aminoacidsequence_id) {
        await transcript_count.remove_aminoacidsequence_id(this.getIdValue(), input.removeAminoacidsequence);
        this.aminoacidsequence_id = null;
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
    let count = (await transcript_count.countRecords(search)).sum;
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
        throw new Error(errorMessageForRecordsLimit("readOneTranscript_count"));
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

    let transcript_count = await resolvers.readOneTranscript_count({
        id: id
    }, context);
    //check that record actually exists
    if (transcript_count === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(transcript_count.individual({}, context));
    promises_to_one.push(transcript_count.aminoacidsequence({}, context));

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
        throw new Error(`transcript_count with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * transcript_counts - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    transcript_counts: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "transcript_counts");
            return await transcript_count.readAll(search, order, pagination);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * transcript_countsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    transcript_countsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "transcript_countsConnection");
            return transcript_count.readAllCursor(search, order, pagination);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneTranscript_count - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneTranscript_count: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            return transcript_count.readById(id);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countTranscript_counts - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countTranscript_counts: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            return (await transcript_count.countRecords(search)).sum;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableTranscript_count - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableTranscript_count: async function(_, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            return helper.vueTable(context.request, transcript_count, ["id", "gene", "variable", "tissue_or_condition"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addTranscript_count - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addTranscript_count: async function(input, context) {
        let authorization = await checkAuthorization(context, 'transcript_count', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let createdTranscript_count = await transcript_count.addOne(inputSanitized);
            await createdTranscript_count.handleAssociations(inputSanitized, context);
            return createdTranscript_count;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddTranscript_countCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddTranscript_countCsv: async function(_, context) {
        if (await checkAuthorization(context, 'transcript_count', 'create') === true) {
            return transcript_count.bulkAddCsv(context);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteTranscript_count - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteTranscript_count: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'transcript_count', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                return transcript_count.deleteOne(id);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateTranscript_count - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateTranscript_count: async function(input, context) {
        let authorization = await checkAuthorization(context, 'transcript_count', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let updatedTranscript_count = await transcript_count.updateOne(inputSanitized);
            await updatedTranscript_count.handleAssociations(inputSanitized, context);
            return updatedTranscript_count;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateTranscript_count - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTranscript_count: async function(_, context) {
        if (await checkAuthorization(context, 'transcript_count', 'read') === true) {
            return transcript_count.csvTableTemplate();
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}