/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const measurement = require(path.join(__dirname, '..', 'models_index.js')).measurement;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models_index.js'));



const associationArgsDef = {
    'addIndividual': 'individual',
    'addAccession': 'accession'
}



/**
 * measurement.prototype.individual - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
measurement.prototype.individual = async function({
    search
}, context) {
    if (helper.isNotUndefinedAndNotNull(this.individual_id)) {
        try {
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
        } catch (error) {
            console.error(error);
            handleError(error);
        };
    }
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
    if (helper.isNotUndefinedAndNotNull(this.accession_id)) {
        try {
            if (search === undefined) {
                return resolvers.readOneAccession({
                    [models.accession.idAttribute()]: this.accession_id
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.accession.idAttribute(),
                    "value": {
                        "value": this.accession_id
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
        } catch (error) {
            console.error(error);
            handleError(error);
        };
    }
}



/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
measurement.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];

        if (helper.isNotUndefinedAndNotNull(input.addIndividual)) {
            promises.push(this.add_individual(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addAccession)) {
            promises.push(this.add_accession(input, context));
        }

        if (helper.isNotUndefinedAndNotNull(input.removeIndividual)) {
            promises.push(this.remove_individual(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeAccession)) {
            promises.push(this.remove_accession(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}

/**
 * add_individual - field Mutation for to_one associations to add 
 *
 * @param {object} input   Info of input Ids to add  the association
 */
measurement.prototype.add_individual = async function(input) {
    await measurement._addIndividual(this.getIdValue(), input.addIndividual);
    this.individual_id = input.addIndividual;
}

/**
 * add_accession - field Mutation for to_one associations to add 
 *
 * @param {object} input   Info of input Ids to add  the association
 */
measurement.prototype.add_accession = async function(input) {
    await measurement._addAccession(this.getIdValue(), input.addAccession);
    this.accession_id = input.addAccession;
}



/**
 * remove_individual - field Mutation for to_one associations to remove 
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
measurement.prototype.remove_individual = async function(input) {
    if (input.removeIndividual === this.individual_id) {
        await measurement._removeIndividual(this.getIdValue(), input.removeIndividual);
        this.individual_id = null;
    }
}

/**
 * remove_accession - field Mutation for to_one associations to remove 
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
measurement.prototype.remove_accession = async function(input) {
    if (input.removeAccession === this.accession_id) {
        await measurement._removeAccession(this.getIdValue(), input.removeAccession);
        this.accession_id = null;
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
 * checkCount(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCount(search, context, query) {
    if (await measurement.countRecords(search) > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
}

/**
 * checkCountForOne(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOne(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneMeasurement"));
    }
}

/**
 * checkCountAgainAndAdaptLimit(context, numberOfFoundItems, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {number} numberOfFoundItems number of items that were found, to be subtracted from the current record limit
 * @param {string} query The query that makes this check
 */
function checkCountAgainAndAdaptLimit(context, numberOfFoundItems, query) {
    if (numberOfFoundItems > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= numberOfFoundItems;
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

    promises_to_one.push(measurement.individual({}, context));
    promises_to_one.push(measurement.accession({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => r !== null).length;

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
        throw new Error(`Accession with accession_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
    measurements: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "measurements");
                let resultRecords = await measurement.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "measurements");
                return resultRecords;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
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
    measurementsConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "measurementsConnection");
                let resultRecords = await measurement.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "measurementsConnection");
                return measurement.readAllCursor(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * readOneMeasurement - Check user authorization and return one record with the specified measurement_id in the measurement_id argument.
     *
     * @param  {number} {measurement_id}    measurement_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with measurement_id requested
     */
    readOneMeasurement: function({
        measurement_id
    }, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(authorization => {
            if (authorization === true) {
                checkCountForOne(context);
                let resultRecords = measurement.readById(measurement_id);
                checkCountForOne(context);
                context.recordsLimit = context.recordsLimit - 1;
                return resultRecords;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * countMeasurements - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMeasurements: function({
        search
    }, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(authorization => {
            if (authorization === true) {
                return measurement.countRecords(search);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * vueTableMeasurement - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMeasurement: function(_, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, measurement, ["id", "measurement_id", "name", "method", "reference", "reference_link", "unit", "short_name", "comments", "individual_id", "accession_id"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
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
        try {
            let authorization = await checkAuthorization(context, 'Measurement', 'create');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef)
                let createdMeasurement = await measurement.addOne(inputSanitized);
                await createdMeasurement.handleAssociations(inputSanitized, context);
                return createdMeasurement;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddMeasurementCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMeasurementCsv: function(_, context) {
        return checkAuthorization(context, 'Measurement', 'create').then(authorization => {
            if (authorization === true) {
                return measurement.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteMeasurement - Check user authorization and delete a record with the specified measurement_id in the measurement_id argument.
     *
     * @param  {number} {measurement_id}    measurement_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMeasurement: function({
        measurement_id
    }, context) {
        return checkAuthorization(context, 'Measurement', 'delete').then(async authorization => {
            if (authorization === true) {
                if (await measurement.validForDeletion(measurement_id, context)) {
                    return measurement.deleteOne(measurement_id);
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
     * updateMeasurement - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMeasurement: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Measurement', 'update');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                let updatedMeasurement = await measurement.updateOne(inputSanitized);
                await updatedMeasurement.handleAssociations(inputSanitized, context);
                return updatedMeasurement;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateMeasurement - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMeasurement: function(_, context) {
        return checkAuthorization(context, 'Measurement', 'read').then(authorization => {
            if (authorization === true) {
                return measurement.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}