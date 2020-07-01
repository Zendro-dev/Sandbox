/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const tomato_Measurement = require(path.join(__dirname, '..', 'models', 'index.js')).tomato_Measurement;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addPlant_variant': 'plant_variant'
}



/**
 * tomato_Measurement.prototype.Plant_variant - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
tomato_Measurement.prototype.Plant_variant = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.plant_variant_ID)) {
        if (search === undefined) {
            return resolvers.readOnePlant_variant({
                [models.plant_variant.idAttribute()]: this.plant_variant_ID
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.plant_variant.idAttribute(),
                "value": {
                    "value": this.plant_variant_ID
                },
                "operator": "eq"
            });
            let found = await resolvers.plant_variants({
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
tomato_Measurement.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addPlant_variant)) {
        promises.push(this.add_plant_variant(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removePlant_variant)) {
        promises.push(this.remove_plant_variant(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_plant_variant - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
tomato_Measurement.prototype.add_plant_variant = async function(input, benignErrorReporter) {
    await tomato_Measurement.add_plant_variant_ID(this.getIdValue(), input.addPlant_variant, benignErrorReporter);
    this.plant_variant_ID = input.addPlant_variant;
}

/**
 * remove_plant_variant - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
tomato_Measurement.prototype.remove_plant_variant = async function(input, benignErrorReporter) {
    if (input.removePlant_variant == this.plant_variant_ID) {
        await tomato_Measurement.remove_plant_variant_ID(this.getIdValue(), input.removePlant_variant, benignErrorReporter);
        this.plant_variant_ID = null;
    }
}




/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit(search, context, resolverName, modelName = 'tomato_Measurement') {
    let count = (await models[modelName].countRecords(search));
    helper.checkCountAndReduceRecordLimitHelper(count, context, resolverName)
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneTomato_Measurement")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let tomato_Measurement = await resolvers.readOneTomato_Measurement({
        tomato_ID: id
    }, context);
    //check that record actually exists
    if (tomato_Measurement === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(tomato_Measurement.Plant_variant({}, context));

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
        throw new Error(`Tomato_Measurement with tomato_ID ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * tomato_Measurements - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    tomato_Measurements: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "tomato_Measurements");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await tomato_Measurement.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * tomato_MeasurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    tomato_MeasurementsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "tomato_MeasurementsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await tomato_Measurement.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneTomato_Measurement - Check user authorization and return one record with the specified tomato_ID in the tomato_ID argument.
     *
     * @param  {number} {tomato_ID}    tomato_ID of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with tomato_ID requested
     */
    readOneTomato_Measurement: async function({
        tomato_ID
    }, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await tomato_Measurement.readById(tomato_ID, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countTomato_Measurements - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countTomato_Measurements: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await tomato_Measurement.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableTomato_Measurement - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableTomato_Measurement: async function(_, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            return helper.vueTable(context.request, tomato_Measurement, ["id", "tomato_ID", "plant_variant_ID"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addTomato_Measurement - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addTomato_Measurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Tomato_Measurement', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdTomato_Measurement = await tomato_Measurement.addOne(inputSanitized, benignErrorReporter);
            await createdTomato_Measurement.handleAssociations(inputSanitized, context);
            return createdTomato_Measurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddTomato_MeasurementCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddTomato_MeasurementCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return tomato_Measurement.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteTomato_Measurement - Check user authorization and delete a record with the specified tomato_ID in the tomato_ID argument.
     *
     * @param  {number} {tomato_ID}    tomato_ID of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteTomato_Measurement: async function({
        tomato_ID
    }, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'delete') === true) {
            if (await validForDeletion(tomato_ID, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return tomato_Measurement.deleteOne(tomato_ID, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateTomato_Measurement - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateTomato_Measurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Tomato_Measurement', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedTomato_Measurement = await tomato_Measurement.updateOne(inputSanitized, benignErrorReporter);
            await updatedTomato_Measurement.handleAssociations(inputSanitized, context);
            return updatedTomato_Measurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateTomato_Measurement - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTomato_Measurement: async function(_, context) {
        if (await checkAuthorization(context, 'Tomato_Measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return tomato_Measurement.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}