/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const measurement = require(path.join(__dirname, '..', 'models', 'index.js')).measurement;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addAccession': 'accession'
}



/**
 * measurement.prototype.accession - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
measurement.prototype.accession = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.accessionId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneAccession({
                [models.accession.idAttribute()]: this.accessionId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.accession.idAttribute(),
                "value": {
                    "value": this.accessionId
                },
                "operator": "eq"
            });
            let found = await resolvers.accessions({
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
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
measurement.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addAccession)) {
        promises.push(this.add_accession(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeAccession)) {
        promises.push(this.remove_accession(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_accession - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
measurement.prototype.add_accession = async function(input, benignErrorReporter) {
    await measurement.add_accessionId(this.getIdValue(), input.addAccession, benignErrorReporter);
    this.accessionId = input.addAccession;
}

/**
 * remove_accession - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
measurement.prototype.remove_accession = async function(input, benignErrorReporter) {
    if (input.removeAccession == this.accessionId) {
        await measurement.remove_accessionId(this.getIdValue(), input.removeAccession, benignErrorReporter);
        this.accessionId = null;
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
}, context, resolverName, modelName = 'measurement') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["measurement_id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "measurement_id", inputPaginationValues);
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
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneMeasurement")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let measurement = await resolvers.readOneMeasurement({
        measurement_id: id
    }, context);
    //check that record actually exists
    if (measurement === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(measurement.accession({}, context));

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
        throw new Error(`Measurement with measurement_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * measurements - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    measurements: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "measurements");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await measurement.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    measurementsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "measurementsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await measurement.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMeasurement - Check user authorization and return one record with the specified measurement_id in the measurement_id argument.
     *
     * @param  {number} {measurement_id}    measurement_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with measurement_id requested
     */
    readOneMeasurement: async function({
        measurement_id
    }, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await measurement.readById(measurement_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMeasurements - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMeasurements: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await measurement.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableMeasurement - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMeasurement: async function(_, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            return helper.vueTable(context.request, measurement, ["id", "measurement_id", "name", "method", "reference", "accessionId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addMeasurement - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMeasurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Measurement', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMeasurement = await measurement.addOne(inputSanitized, benignErrorReporter);
            await createdMeasurement.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMeasurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMeasurementCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMeasurementCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Measurement', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return measurement.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMeasurement - Check user authorization and delete a record with the specified measurement_id in the measurement_id argument.
     *
     * @param  {number} {measurement_id}    measurement_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMeasurement: async function({
        measurement_id
    }, context) {
        if (await checkAuthorization(context, 'Measurement', 'delete') === true) {
            if (await validForDeletion(measurement_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return measurement.deleteOne(measurement_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMeasurement - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMeasurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Measurement', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMeasurement = await measurement.updateOne(inputSanitized, benignErrorReporter);
            await updatedMeasurement.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMeasurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateMeasurementWithAccessionId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMeasurementWithAccessionId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                accessionId
            }) => accessionId)), models.accession);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                measurement_id
            }) => measurement_id)), measurement);
        }
        return await measurement.bulkAssociateMeasurementWithAccessionId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMeasurementWithAccessionId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMeasurementWithAccessionId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                accessionId
            }) => accessionId)), models.accession);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                measurement_id
            }) => measurement_id)), measurement);
        }
        return await measurement.bulkDisAssociateMeasurementWithAccessionId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateMeasurement - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMeasurement: async function(_, context) {
        if (await checkAuthorization(context, 'Measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return measurement.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}