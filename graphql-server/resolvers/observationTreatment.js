/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observationTreatment = require(path.join(__dirname, '..', 'models', 'index.js')).observationTreatment;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addObservationUnit': 'observationUnit'
}



/**
 * observationTreatment.prototype.observationUnit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationTreatment.prototype.observationUnit = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.observationUnitDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneObservationUnit({
                [models.observationUnit.idAttribute()]: this.observationUnitDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.observationUnit.idAttribute(),
                "value": this.observationUnitDbId,
                "operator": "eq"
            });
            let found = await resolvers.observationUnits({
                search: nsearch,
                pagination: {
                    limit: 1
                }
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
observationTreatment.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addObservationUnit)) {
        promises_add.push(this.add_observationUnit(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeObservationUnit)) {
        promises_remove.push(this.remove_observationUnit(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationUnit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationTreatment.prototype.add_observationUnit = async function(input, benignErrorReporter) {
    await observationTreatment.add_observationUnitDbId(this.getIdValue(), input.addObservationUnit, benignErrorReporter);
    this.observationUnitDbId = input.addObservationUnit;
}

/**
 * remove_observationUnit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationTreatment.prototype.remove_observationUnit = async function(input, benignErrorReporter) {
    if (input.removeObservationUnit == this.observationUnitDbId) {
        await observationTreatment.remove_observationUnitDbId(this.getIdValue(), input.removeObservationUnit, benignErrorReporter);
        this.observationUnitDbId = null;
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

    let observationTreatment = await resolvers.readOneObservationTreatment({
        observationTreatmentDbId: id
    }, context);
    //check that record actually exists
    if (observationTreatment === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(observationTreatment.observationUnit({}, context));

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
        throw new Error(`observationTreatment with observationTreatmentDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * observationTreatments - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    observationTreatments: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "observationTreatments");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationTreatment.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationTreatmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observationTreatmentsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "observationTreatmentsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationTreatment.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneObservationTreatment - Check user authorization and return one record with the specified observationTreatmentDbId in the observationTreatmentDbId argument.
     *
     * @param  {number} {observationTreatmentDbId}    observationTreatmentDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with observationTreatmentDbId requested
     */
    readOneObservationTreatment: async function({
        observationTreatmentDbId
    }, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservationTreatment");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationTreatment.readById(observationTreatmentDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countObservationTreatments - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countObservationTreatments: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationTreatment.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableObservationTreatment - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableObservationTreatment: async function(_, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            return helper.vueTable(context.request, observationTreatment, ["id", "factor", "modality", "observationUnitDbId", "observationTreatmentDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addObservationTreatment - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservationTreatment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationTreatment', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdObservationTreatment = await observationTreatment.addOne(inputSanitized, benignErrorReporter);
            await createdObservationTreatment.handleAssociations(inputSanitized, benignErrorReporter);
            return createdObservationTreatment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddObservationTreatmentCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationTreatmentCsv: async function(_, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationTreatment.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteObservationTreatment - Check user authorization and delete a record with the specified observationTreatmentDbId in the observationTreatmentDbId argument.
     *
     * @param  {number} {observationTreatmentDbId}    observationTreatmentDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservationTreatment: async function({
        observationTreatmentDbId
    }, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'delete') === true) {
            if (await validForDeletion(observationTreatmentDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return observationTreatment.deleteOne(observationTreatmentDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateObservationTreatment - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservationTreatment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationTreatment', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedObservationTreatment = await observationTreatment.updateOne(inputSanitized, benignErrorReporter);
            await updatedObservationTreatment.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedObservationTreatment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateObservationTreatmentWithObservationUnitDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationTreatmentWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationTreatmentDbId
            }) => observationTreatmentDbId)), observationTreatment);
        }
        return await observationTreatment.bulkAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationTreatmentWithObservationUnitDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationTreatmentWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationTreatmentDbId
            }) => observationTreatmentDbId)), observationTreatment);
        }
        return await observationTreatment.bulkDisAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateObservationTreatment - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservationTreatment: async function(_, context) {
        if (await checkAuthorization(context, 'observationTreatment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationTreatment.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}