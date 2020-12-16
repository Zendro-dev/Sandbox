/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const eventParameter = require(path.join(__dirname, '..', 'models', 'index.js')).eventParameter;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addEvent': 'event'
}



/**
 * eventParameter.prototype.event - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
eventParameter.prototype.event = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.eventDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneEvent({
                [models.event.idAttribute()]: this.eventDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.event.idAttribute(),
                "value": this.eventDbId,
                "operator": "eq"
            });
            let found = await resolvers.events({
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
eventParameter.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addEvent)) {
        promises_add.push(this.add_event(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeEvent)) {
        promises_remove.push(this.remove_event(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_event - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
eventParameter.prototype.add_event = async function(input, benignErrorReporter) {
    await eventParameter.add_eventDbId(this.getIdValue(), input.addEvent, benignErrorReporter);
    this.eventDbId = input.addEvent;
}

/**
 * remove_event - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
eventParameter.prototype.remove_event = async function(input, benignErrorReporter) {
    if (input.removeEvent == this.eventDbId) {
        await eventParameter.remove_eventDbId(this.getIdValue(), input.removeEvent, benignErrorReporter);
        this.eventDbId = null;
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

    let eventParameter = await resolvers.readOneEventParameter({
        eventParameterDbId: id
    }, context);
    //check that record actually exists
    if (eventParameter === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(eventParameter.event({}, context));

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
        throw new Error(`eventParameter with eventParameterDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * eventParameters - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    eventParameters: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "eventParameters");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await eventParameter.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * eventParametersConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    eventParametersConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "eventParametersConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await eventParameter.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneEventParameter - Check user authorization and return one record with the specified eventParameterDbId in the eventParameterDbId argument.
     *
     * @param  {number} {eventParameterDbId}    eventParameterDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with eventParameterDbId requested
     */
    readOneEventParameter: async function({
        eventParameterDbId
    }, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneEventParameter");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await eventParameter.readById(eventParameterDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countEventParameters - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countEventParameters: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await eventParameter.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableEventParameter - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableEventParameter: async function(_, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            return helper.vueTable(context.request, eventParameter, ["id", "key", "rdfValue", "value", "eventDbId", "eventParameterDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addEventParameter - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addEventParameter: async function(input, context) {
        let authorization = await checkAuthorization(context, 'eventParameter', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdEventParameter = await eventParameter.addOne(inputSanitized, benignErrorReporter);
            await createdEventParameter.handleAssociations(inputSanitized, benignErrorReporter);
            return createdEventParameter;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddEventParameterCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddEventParameterCsv: async function(_, context) {
        if (await checkAuthorization(context, 'eventParameter', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return eventParameter.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteEventParameter - Check user authorization and delete a record with the specified eventParameterDbId in the eventParameterDbId argument.
     *
     * @param  {number} {eventParameterDbId}    eventParameterDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteEventParameter: async function({
        eventParameterDbId
    }, context) {
        if (await checkAuthorization(context, 'eventParameter', 'delete') === true) {
            if (await validForDeletion(eventParameterDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return eventParameter.deleteOne(eventParameterDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateEventParameter - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateEventParameter: async function(input, context) {
        let authorization = await checkAuthorization(context, 'eventParameter', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedEventParameter = await eventParameter.updateOne(inputSanitized, benignErrorReporter);
            await updatedEventParameter.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedEventParameter;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateEventParameterWithEventDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateEventParameterWithEventDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                eventDbId
            }) => eventDbId)), models.event);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                eventParameterDbId
            }) => eventParameterDbId)), eventParameter);
        }
        return await eventParameter.bulkAssociateEventParameterWithEventDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateEventParameterWithEventDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateEventParameterWithEventDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                eventDbId
            }) => eventDbId)), models.event);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                eventParameterDbId
            }) => eventParameterDbId)), eventParameter);
        }
        return await eventParameter.bulkDisAssociateEventParameterWithEventDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateEventParameter - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateEventParameter: async function(_, context) {
        if (await checkAuthorization(context, 'eventParameter', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return eventParameter.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}