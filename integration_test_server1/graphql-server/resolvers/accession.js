/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const accession = require(path.join(__dirname, '..', 'models', 'index.js')).accession;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

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
        if (search === undefined || search === null) {
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
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
accession.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addMeasurements)) {
        promises.push(this.add_measurements(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLocation)) {
        promises.push(this.add_location(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMeasurements)) {
        promises.push(this.remove_measurements(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLocation)) {
        promises.push(this.remove_location(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_measurements - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
accession.prototype.add_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addMeasurements.map(associatedRecordId => {
        return {
            accessionId: this.getIdValue(),
            [models.measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.measurement.bulkAssociateMeasurementWithAccessionId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_location - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
accession.prototype.add_location = async function(input, benignErrorReporter) {
    await accession.add_locationId(this.getIdValue(), input.addLocation, benignErrorReporter);
    this.locationId = input.addLocation;
}

/**
 * remove_measurements - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
accession.prototype.remove_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeMeasurements.map(associatedRecordId => {
        return {
            accessionId: this.getIdValue(),
            [models.measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.measurement.bulkDisAssociateMeasurementWithAccessionId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_location - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
accession.prototype.remove_location = async function(input, benignErrorReporter) {
    if (input.removeLocation == this.locationId) {
        await accession.remove_locationId(this.getIdValue(), input.removeLocation, benignErrorReporter);
        this.locationId = null;
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
}, context, resolverName, modelName = 'accession') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["accession_id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "accession_id", inputPaginationValues);
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
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneAccession")
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
    accessions: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "accessions");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await accession.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
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
    accessionsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "accessionsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await accession.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAccession - Check user authorization and return one record with the specified accession_id in the accession_id argument.
     *
     * @param  {number} {accession_id}    accession_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with accession_id requested
     */
    readOneAccession: async function({
        accession_id
    }, context) {
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await accession.readById(accession_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
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
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await accession.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableAccession - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAccession: async function(_, context) {
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            return helper.vueTable(context.request, accession, ["id", "accession_id", "collectors_name", "collectors_initials", "locationId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
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
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAccession = await accession.addOne(inputSanitized, benignErrorReporter);
            await createdAccession.handleAssociations(inputSanitized, benignErrorReporter);
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
    bulkAddAccessionCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Accession', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return accession.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAccession - Check user authorization and delete a record with the specified accession_id in the accession_id argument.
     *
     * @param  {number} {accession_id}    accession_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAccession: async function({
        accession_id
    }, context) {
        if (await checkAuthorization(context, 'Accession', 'delete') === true) {
            if (await validForDeletion(accession_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return accession.deleteOne(accession_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
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
        let authorization = await checkAuthorization(context, 'Accession', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAccession = await accession.updateOne(inputSanitized, benignErrorReporter);
            await updatedAccession.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedAccession;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateAccessionWithLocationId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAccessionWithLocationId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationId
            }) => locationId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                accession_id
            }) => accession_id)), accession);
        }
        return await accession.bulkAssociateAccessionWithLocationId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAccessionWithLocationId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAccessionWithLocationId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationId
            }) => locationId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                accession_id
            }) => accession_id)), accession);
        }
        return await accession.bulkDisAssociateAccessionWithLocationId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateAccession - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAccession: async function(_, context) {
        if (await checkAuthorization(context, 'Accession', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return accession.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}