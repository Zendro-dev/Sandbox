/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const accession = require(path.join(__dirname, '..', 'models_index.js')).accession;
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
    'addLocation': 'location',
    'addMeasurements': 'measurement'
}



/**
 * accession.prototype.location - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
accession.prototype.location = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.locationId)) {
        try {
            if (search === undefined) {
                return resolvers.readOneLocation({
                    [models.location.idAttribute()]: this.locationId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.location.idAttribute(),
                    "value": {
                        "value": this.locationId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.locations({
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
 * accession.prototype.measurementsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
accession.prototype.measurementsFilter = function({
    search,
    order,
    pagination
}, context) {
    try {
        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "accessionId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.measurements({
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
 * accession.prototype.countFilteredMeasurements - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
accession.prototype.countFilteredMeasurements = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "accessionId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countMeasurements({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * accession.prototype.measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
accession.prototype.measurementsConnection = function({
    search,
    order,
    pagination
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "accessionId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.measurementsConnection({
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
accession.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];
        if (helper.isNonEmptyArray(input.addMeasurements)) {
            promises.push(this.add_measurements(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addLocation)) {
            promises.push(this.add_location(input, context));
        }
        if (helper.isNonEmptyArray(input.removeMeasurements)) {
            promises.push(this.remove_measurements(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeLocation)) {
            promises.push(this.remove_location(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}
/**
 * add_measurements - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
accession.prototype.add_measurements = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addMeasurements) {
        results.push(models.measurement.add_accessionId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * add_location - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
accession.prototype.add_location = async function(input) {
    await accession.add_locationId(this.getIdValue(), input.addLocation);
    this.locationId = input.addLocation;
}

/**
 * remove_measurements - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
accession.prototype.remove_measurements = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeMeasurements) {
        results.push(models.measurement.remove_accessionId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * remove_location - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
accession.prototype.remove_location = async function(input) {
    if (input.removeLocation == this.locationId) {
        await accession.remove_locationId(this.getIdValue(), input.removeLocation);
        this.locationId = null;
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
    let count = (await accession.countRecords(search)).sum;
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
        throw new Error(errorMessageForRecordsLimit("readOneAccession"));
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

    let accession = await resolvers.readOneAccession({
        accession_id: id
    }, context);
    //check that record actually exists
    if (accession === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(accession.countFilteredMeasurements({}, context));
    promises_to_one.push(accession.location({}, context));

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
        throw new Error(`Accession with accession_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * accessions - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    accessions: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Accession', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCountAndReduceRecordsLimit(search, context, "accessions");
                return await accession.readAll(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * accessionsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    accessionsConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Accession', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCountAndReduceRecordsLimit(search, context, "accessionsConnection");
                return accession.readAllCursor(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * readOneAccession - Check user authorization and return one record with the specified accession_id in the accession_id argument.
     *
     * @param  {number} {accession_id}    accession_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with accession_id requested
     */
    readOneAccession: function({
        accession_id
    }, context) {
        return checkAuthorization(context, 'Accession', 'read').then(authorization => {
            if (authorization === true) {
                checkCountForOneAndReduceRecordsLimit(context);
                return accession.readById(accession_id);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * countAccessions - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAccessions: async function({
        search
    }, context) {
        return await checkAuthorization(context, 'Accession', 'read').then(async authorization => {
            if (authorization === true) {
                return (await accession.countRecords(search)).sum;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * vueTableAccession - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAccession: function(_, context) {
        return checkAuthorization(context, 'Accession', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, accession, ["id", "accession_id", "collectors_name", "collectors_initials", "locationId"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * addAccession - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAccession: async function(input, context) {
            let authorization = await checkAuthorization(context, 'Accession', 'create');
            if (authorization === true) {
              let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
              await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
              await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
              if (!input.skipAssociationsExistenceChecks) {
                  await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
              }
              let createdAccessionAndErrors = await accession.addOne(inputSanitized).catch(err => {throw (err)});
              console.log("createdAccessionAndErrors: " + JSON.stringify(createdAccessionAndErrors));
              let createdAccession = createdAccessionAndErrors.data;
              await createdAccession.handleAssociations(inputSanitized, context);
              return createdAccession;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }

    },

    /**
     * bulkAddAccessionCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAccessionCsv: function(_, context) {
        return checkAuthorization(context, 'Accession', 'create').then(authorization => {
            if (authorization === true) {
                return accession.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteAccession - Check user authorization and delete a record with the specified accession_id in the accession_id argument.
     *
     * @param  {number} {accession_id}    accession_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAccession: function({
        accession_id
    }, context) {
        return checkAuthorization(context, 'Accession', 'delete').then(async authorization => {
            if (authorization === true) {
                if (await validForDeletion(accession_id, context)) {
                    return accession.deleteOne(accession_id);
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
     * updateAccession - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAccession: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Accession', 'update');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let updatedAccession = await accession.updateOne(inputSanitized);
                await updatedAccession.handleAssociations(inputSanitized, context);
                return updatedAccession;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateAccession - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAccession: function(_, context) {
        return checkAuthorization(context, 'Accession', 'read').then(authorization => {
            if (authorization === true) {
                return accession.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}
