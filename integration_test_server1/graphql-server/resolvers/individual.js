/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const individual = require(path.join(__dirname, '..', 'models_index.js')).individual;
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
    'addTranscript_counts': 'transcript_count'
}




/**
 * individual.prototype.transcript_countsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
individual.prototype.transcript_countsFilter = function({
    search,
    order,
    pagination
}, context) {
    try {
        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "individual_id",
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
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * individual.prototype.countFilteredTranscript_counts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
individual.prototype.countFilteredTranscript_counts = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "individual_id",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countTranscript_counts({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * individual.prototype.transcript_countsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
individual.prototype.transcript_countsConnection = function({
    search,
    order,
    pagination
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "individual_id",
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
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
individual.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];
        if (helper.isNonEmptyArray(input.addTranscript_counts)) {
            promises.push(this.add_transcript_counts(input, context));
        }
        if (helper.isNonEmptyArray(input.removeTranscript_counts)) {
            promises.push(this.remove_transcript_counts(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}
/**
 * add_transcript_counts - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
individual.prototype.add_transcript_counts = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addTranscript_counts) {
        results.push(models.transcript_count.add_individual_id(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}


/**
 * remove_transcript_counts - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
individual.prototype.remove_transcript_counts = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeTranscript_counts) {
        results.push(models.transcript_count.remove_individual_id(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
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
    let count = (await individual.countRecords(search)).sum;
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
        throw new Error(errorMessageForRecordsLimit("readOneIndividual"));
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

    let individual = await resolvers.readOneIndividual({
        id: id
    }, context);
    //check that record actually exists
    if (individual === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(individual.countFilteredTranscript_counts({}, context));

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
        throw new Error(`individual with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * individuals - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    individuals: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'individual', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCountAndReduceRecordsLimit(search, context, "individuals");
                return await individual.readAll(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * individualsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    individualsConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'individual', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCountAndReduceRecordsLimit(search, context, "individualsConnection");
                return individual.readAllCursor(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * readOneIndividual - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneIndividual: function({
        id
    }, context) {
        return checkAuthorization(context, 'individual', 'read').then(authorization => {
            if (authorization === true) {
                checkCountForOneAndReduceRecordsLimit(context);
                return individual.readById(id);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * countIndividuals - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countIndividuals: async function({
        search
    }, context) {
        return await checkAuthorization(context, 'individual', 'read').then(async authorization => {
            if (authorization === true) {
                return (await individual.countRecords(search)).sum;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * vueTableIndividual - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableIndividual: function(_, context) {
        return checkAuthorization(context, 'individual', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, individual, ["id", "name"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * addIndividual - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addIndividual: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'individual', 'create');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let createdIndividual = await individual.addOne(inputSanitized);
                await createdIndividual.handleAssociations(inputSanitized, context);
                return createdIndividual;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddIndividualCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddIndividualCsv: function(_, context) {
        return checkAuthorization(context, 'individual', 'create').then(authorization => {
            if (authorization === true) {
                return individual.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteIndividual - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteIndividual: function({
        id
    }, context) {
        return checkAuthorization(context, 'individual', 'delete').then(async authorization => {
            if (authorization === true) {
                if (await validForDeletion(id, context)) {
                    return individual.deleteOne(id);
                }
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * updateIndividual - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateIndividual: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'individual', 'update');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let updatedIndividual = await individual.updateOne(inputSanitized);
                await updatedIndividual.handleAssociations(inputSanitized, context);
                return updatedIndividual;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateIndividual - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateIndividual: function(_, context) {
        return checkAuthorization(context, 'individual', 'read').then(authorization => {
            if (authorization === true) {
                return individual.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}