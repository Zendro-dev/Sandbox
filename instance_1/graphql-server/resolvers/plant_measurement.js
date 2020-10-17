/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const plant_measurement = require(path.join(__dirname, '..', 'models', 'index.js')).plant_measurement;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addIndividual': 'individual'
}



/**
 * plant_measurement.prototype.individual - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
plant_measurement.prototype.individual = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.individual_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneIndividual({
                [models.individual.idAttribute()]: this.individual_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.individual.idAttribute(),
                "value": this.individual_id,
                "operator": "eq"
            });
            let found = await resolvers.individuals({
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
plant_measurement.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addIndividual)) {
        promises.push(this.add_individual(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeIndividual)) {
        promises.push(this.remove_individual(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_individual - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
plant_measurement.prototype.add_individual = async function(input, benignErrorReporter) {
    await plant_measurement.add_individual_id(this.getIdValue(), input.addIndividual, benignErrorReporter);
    this.individual_id = input.addIndividual;
}

/**
 * remove_individual - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
plant_measurement.prototype.remove_individual = async function(input, benignErrorReporter) {
    if (input.removeIndividual == this.individual_id) {
        await plant_measurement.remove_individual_id(this.getIdValue(), input.removeIndividual, benignErrorReporter);
        this.individual_id = null;
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

    let plant_measurement = await resolvers.readOnePlant_measurement({
        id: id
    }, context);
    //check that record actually exists
    if (plant_measurement === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(plant_measurement.individual({}, context));

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
        throw new Error(`plant_measurement with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * plant_measurements - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    plant_measurements: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "plant_measurements");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_measurement.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * plant_measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    plant_measurementsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "plant_measurementsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_measurement.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOnePlant_measurement - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOnePlant_measurement: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOnePlant_measurement");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_measurement.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countPlant_measurements - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPlant_measurements: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await plant_measurement.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTablePlant_measurement - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTablePlant_measurement: async function(_, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            return helper.vueTable(context.request, plant_measurement, ["id", "variable", "unit"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addPlant_measurement - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPlant_measurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'plant_measurement', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdPlant_measurement = await plant_measurement.addOne(inputSanitized, benignErrorReporter);
            await createdPlant_measurement.handleAssociations(inputSanitized, benignErrorReporter);
            return createdPlant_measurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddPlant_measurementCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPlant_measurementCsv: async function(_, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return plant_measurement.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deletePlant_measurement - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePlant_measurement: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return plant_measurement.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updatePlant_measurement - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePlant_measurement: async function(input, context) {
        let authorization = await checkAuthorization(context, 'plant_measurement', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedPlant_measurement = await plant_measurement.updateOne(inputSanitized, benignErrorReporter);
            await updatedPlant_measurement.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedPlant_measurement;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociatePlant_measurementWithIndividual_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociatePlant_measurementWithIndividual_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                individual_id
            }) => individual_id)), models.individual);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), plant_measurement);
        }
        return await plant_measurement.bulkAssociatePlant_measurementWithIndividual_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociatePlant_measurementWithIndividual_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociatePlant_measurementWithIndividual_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                individual_id
            }) => individual_id)), models.individual);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), plant_measurement);
        }
        return await plant_measurement.bulkDisAssociatePlant_measurementWithIndividual_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplatePlant_measurement - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePlant_measurement: async function(_, context) {
        if (await checkAuthorization(context, 'plant_measurement', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return plant_measurement.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}