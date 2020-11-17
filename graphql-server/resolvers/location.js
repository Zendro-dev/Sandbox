/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const location = require(path.join(__dirname, '..', 'models', 'index.js')).location;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addObservationUnits': 'observationUnit',
    'addStudies': 'study'
}




/**
 * location.prototype.observationUnitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
location.prototype.observationUnitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observationUnits({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * location.prototype.countFilteredObservationUnits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
location.prototype.countFilteredObservationUnits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationUnits({
        search: nsearch
    }, context);
}

/**
 * location.prototype.observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
location.prototype.observationUnitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationUnitsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * location.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
location.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.studies({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * location.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
location.prototype.countFilteredStudies = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * location.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
location.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "locationDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.studiesConnection({
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
location.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservationUnits)) {
        promises_add.push(this.add_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservationUnits)) {
        promises_remove.push(this.remove_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationUnits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
location.prototype.add_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationUnits.map(associatedRecordId => {
        return {
            locationDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
location.prototype.add_studies = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addStudies.map(associatedRecordId => {
        return {
            locationDbId: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkAssociateStudyWithLocationDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observationUnits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
location.prototype.remove_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationUnits.map(associatedRecordId => {
        return {
            locationDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
location.prototype.remove_studies = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeStudies.map(associatedRecordId => {
        return {
            locationDbId: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkDisAssociateStudyWithLocationDbId(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let location = await resolvers.readOneLocation({
        locationDbId: id
    }, context);
    //check that record actually exists
    if (location === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(location.countFilteredObservationUnits({}, context));
    promises_to_many.push(location.countFilteredStudies({}, context));

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
        throw new Error(`location with locationDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * locations - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    locations: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "locations");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await location.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * locationsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    locationsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "locationsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await location.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneLocation - Check user authorization and return one record with the specified locationDbId in the locationDbId argument.
     *
     * @param  {number} {locationDbId}    locationDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with locationDbId requested
     */
    readOneLocation: async function({
        locationDbId
    }, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneLocation");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await location.readById(locationDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countLocations - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countLocations: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await location.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableLocation - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableLocation: async function(_, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            return helper.vueTable(context.request, location, ["id", "abbreviation", "coordinateDescription", "countryCode", "countryName", "documentationURL", "environmentType", "exposure", "instituteAddress", "instituteName", "locationName", "locationType", "siteStatus", "slope", "topography", "locationDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addLocation - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addLocation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'location', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdLocation = await location.addOne(inputSanitized, benignErrorReporter);
            await createdLocation.handleAssociations(inputSanitized, benignErrorReporter);
            return createdLocation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddLocationCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddLocationCsv: async function(_, context) {
        if (await checkAuthorization(context, 'location', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return location.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteLocation - Check user authorization and delete a record with the specified locationDbId in the locationDbId argument.
     *
     * @param  {number} {locationDbId}    locationDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteLocation: async function({
        locationDbId
    }, context) {
        if (await checkAuthorization(context, 'location', 'delete') === true) {
            if (await validForDeletion(locationDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return location.deleteOne(locationDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateLocation - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateLocation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'location', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedLocation = await location.updateOne(inputSanitized, benignErrorReporter);
            await updatedLocation.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedLocation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateLocation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateLocation: async function(_, context) {
        if (await checkAuthorization(context, 'location', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return location.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}