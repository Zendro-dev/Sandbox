/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const plant_variant = require(path.join(__dirname, '..', 'models', 'index.js')).plant_variant;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addTomato_measurements': 'tomato_Measurement'
}




/**
 * plant_variant.prototype.Tomato_measurementsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
plant_variant.prototype.Tomato_measurementsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "plant_variant_ID",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.tomato_Measurements({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * plant_variant.prototype.countFilteredTomato_measurements - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
plant_variant.prototype.countFilteredTomato_measurements = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "plant_variant_ID",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.countTomato_Measurements({
        search: nsearch
    }, context);
}

/**
 * plant_variant.prototype.Tomato_measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
plant_variant.prototype.Tomato_measurementsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "plant_variant_ID",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.tomato_MeasurementsConnection({
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
plant_variant.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addTomato_measurements)) {
        promises.push(this.add_tomato_measurements(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeTomato_measurements)) {
        promises.push(this.remove_tomato_measurements(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_tomato_measurements - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
plant_variant.prototype.add_tomato_measurements = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addTomato_measurements) {
        results.push(models.tomato_Measurement.add_plant_variant_ID(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * remove_tomato_measurements - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
plant_variant.prototype.remove_tomato_measurements = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeTomato_measurements) {
        results.push(models.tomato_Measurement.remove_plant_variant_ID(associatedRecordId, this.getIdValue(), benignErrorReporter));
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
async function checkCountAndReduceRecordsLimit(search, context, resolverName, modelName = 'plant_variant') {
    let count = (await models[modelName].countRecords(search));
    helper.checkCountAndReduceRecordLimitHelper(count, context, resolverName)
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOnePlant_variant")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let plant_variant = await resolvers.readOnePlant_variant({
        plant_variant_ID: id
    }, context);
    //check that record actually exists
    if (plant_variant === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(plant_variant.countFilteredTomato_measurements({}, context));

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
        throw new Error(`Plant_variant with plant_variant_ID ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * plant_variants - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    plant_variants: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "plant_variants");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_variant.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * plant_variantsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    plant_variantsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "plant_variantsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_variant.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOnePlant_variant - Check user authorization and return one record with the specified plant_variant_ID in the plant_variant_ID argument.
     *
     * @param  {number} {plant_variant_ID}    plant_variant_ID of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with plant_variant_ID requested
     */
    readOnePlant_variant: async function({
        plant_variant_ID
    }, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_variant.readById(plant_variant_ID, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countPlant_variants - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPlant_variants: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_variant.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTablePlant_variant - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTablePlant_variant: async function(_, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            return helper.vueTable(context.request, plant_variant, ["id", "name", "genotype", "disease_resistances", "plant_variant_ID"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addPlant_variant - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPlant_variant: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Plant_variant', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdPlant_variant = await plant_variant.addOne(inputSanitized, benignErrorReporter);
            await createdPlant_variant.handleAssociations(inputSanitized, context);
            return createdPlant_variant;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddPlant_variantCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPlant_variantCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return plant_variant.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deletePlant_variant - Check user authorization and delete a record with the specified plant_variant_ID in the plant_variant_ID argument.
     *
     * @param  {number} {plant_variant_ID}    plant_variant_ID of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePlant_variant: async function({
        plant_variant_ID
    }, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'delete') === true) {
            if (await validForDeletion(plant_variant_ID, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return plant_variant.deleteOne(plant_variant_ID, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updatePlant_variant - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePlant_variant: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Plant_variant', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedPlant_variant = await plant_variant.updateOne(inputSanitized, benignErrorReporter);
            await updatedPlant_variant.handleAssociations(inputSanitized, context);
            return updatedPlant_variant;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplatePlant_variant - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePlant_variant: async function(_, context) {
        if (await checkAuthorization(context, 'Plant_variant', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return plant_variant.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}