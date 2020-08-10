/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sample_string = require(path.join(__dirname, '..', 'models', 'index.js')).sample_string;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addParent': 'sample_string',
    'addSamples': 'sample_string'
}



/**
 * sample_string.prototype.parent - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample_string.prototype.parent = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sample_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSample_string({
                [models.sample_string.idAttribute()]: this.sample_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sample_string.idAttribute(),
                "value": {
                    "value": this.sample_id
                },
                "operator": "eq"
            });
            let found = await resolvers.sample_strings({
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
 * sample_string.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample_string.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.sample_strings({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * sample_string.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample_string.prototype.countFilteredSamples = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.countSample_strings({
        search: nsearch
    }, context);
}

/**
 * sample_string.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sample_string.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.sample_stringsConnection({
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
sample_string.prototype.handleAssociations = async function(input, benignErrorReporter) {

    // helper.checkSelfAssociations({
    //     to_one: "addParent",
    //     to_many: "addSamples"
    // }, input, `${this[sample_string.idAttribute()]}`, benignErrorReporter);

    let promises = [];
    if (helper.isNonEmptyArray(input.addSamples)) {
      if(helper.checkSelfAssociations({to_one: "addParent", to_many: "addSamples"},input, `${this[sample_string.idAttribute()]}`, benignErrorReporter) )
        promises.push(this.add_samples(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addParent)) {
       if(helper.checkSelfAssociations({to_one: "addParent", to_many: "addSamples"},input, `${this[sample_string.idAttribute()]}`, benignErrorReporter) )
        promises.push(this.add_parent(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises.push(this.remove_samples(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeParent)) {
        promises.push(this.remove_parent(input, benignErrorReporter));
    }
    await Promise.all(promises);
}
/**
 * add_samples - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample_string.prototype.add_samples = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addSamples) {
        results.push(models.sample_string.add_sample_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * add_parent - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample_string.prototype.add_parent = async function(input, benignErrorReporter) {
    await sample_string.add_sample_id(this.getIdValue(), input.addParent, benignErrorReporter);
    this.sample_id = input.addParent;
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample_string.prototype.remove_samples = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeSamples) {
        results.push(models.sample_string.remove_sample_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * remove_parent - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample_string.prototype.remove_parent = async function(input, benignErrorReporter) {
    if (input.removeParent == this.sample_id) {
        await sample_string.remove_sample_id(this.getIdValue(), input.removeParent, benignErrorReporter);
        this.sample_id = null;
    }
}




/**
 * checkCountAndReduceRecordsLimit({search, pagination}, context, resolverName, modelName) - Make sure that the current
 * set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} {search}  Search argument for filtering records
 * @param {object} {pagination}  If limit-offset pagination, this object will include 'offset' and 'limit' properties
 * to get the records from and to respectively. If cursor-based pagination, this object will include 'first' or 'last'
 * properties to indicate the number of records to fetch, and 'after' or 'before' cursors to indicate from which record
 * to start fetching.
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit({
    search,
    pagination
}, context, resolverName, modelName = 'sample_string') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "id", inputPaginationValues);
    //get records count
    let count = (await models[modelName].countRecords(paginationValues.search));
    //get effective records count
    let effectiveCount = helper.getEffectiveRecordsCount(count, paginationValues.limit, paginationValues.offset);
    //do check and reduce of record limit.
    helper.checkCountAndReduceRecordLimitHelper(effectiveCount, context, resolverName);
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneSample_string")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let sample_string = await resolvers.readOneSample_string({
        id: id
    }, context);
    //check that record actually exists
    if (sample_string === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(sample_string.countFilteredSamples({}, context));
    promises_to_one.push(sample_string.parent({}, context));

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
        throw new Error(`sample_string with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * sample_strings - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    sample_strings: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "sample_strings");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample_string.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * sample_stringsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    sample_stringsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "sample_stringsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample_string.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSample_string - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSample_string: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample_string.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSample_strings - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSample_strings: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample_string.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSample_string - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSample_string: async function(_, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            return helper.vueTable(context.request, sample_string, ["id", "id", "name", "material", "life_cycle_phase", "description", "library", "barcode_sequence", "sample_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSample_string - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSample_string: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample_string', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSample_string = await sample_string.addOne(inputSanitized, benignErrorReporter);
            await createdSample_string.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSample_string;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSample_stringCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSample_stringCsv: async function(_, context) {
        if (await checkAuthorization(context, 'sample_string', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample_string.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSample_string - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSample_string: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample_string', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sample_string.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSample_string - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSample_string: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample_string', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSample_string = await sample_string.updateOne(inputSanitized, benignErrorReporter);
            await updatedSample_string.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSample_string;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateSample_string - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSample_string: async function(_, context) {
        if (await checkAuthorization(context, 'sample_string', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample_string.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}
