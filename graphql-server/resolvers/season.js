/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const season = require(path.join(__dirname, '..', 'models', 'index.js')).season;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addObservations': 'observation',
    'addStudies': 'study'
}




/**
 * season.prototype.observationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
season.prototype.observationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "seasonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * season.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
season.prototype.countFilteredObservations = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "seasonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservations({
        search: nsearch
    }, context);
}

/**
 * season.prototype.observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
season.prototype.observationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "seasonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * season.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
season.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.studies({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * season.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
season.prototype.countFilteredStudies = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * season.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
season.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
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
season.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservations)) {
        promises_add.push(this.add_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservations)) {
        promises_remove.push(this.remove_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
season.prototype.add_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservations.map(associatedRecordId => {
        return {
            seasonDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkAssociateObservationWithSeasonDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
season.prototype.add_studies = async function(input, benignErrorReporter) {

    await season.add_studyDbIds(this.getIdValue(), input.addStudies, benignErrorReporter);
    this.studyDbIds = helper.unionIds(this.studyDbIds, input.addStudies);
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
season.prototype.remove_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservations.map(associatedRecordId => {
        return {
            seasonDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkDisAssociateObservationWithSeasonDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
season.prototype.remove_studies = async function(input, benignErrorReporter) {

    await season.remove_studyDbIds(this.getIdValue(), input.removeStudies, benignErrorReporter);
    this.studyDbIds = helper.differenceIds(this.studyDbIds, input.removeStudies);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let season = await resolvers.readOneSeason({
        seasonDbId: id
    }, context);
    //check that record actually exists
    if (season === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(season.countFilteredObservations({}, context));
    promises_to_many.push(season.countFilteredStudies({}, context));

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
        throw new Error(`season with seasonDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * seasons - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    seasons: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "seasons");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await season.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * seasonsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    seasonsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "seasonsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await season.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSeason - Check user authorization and return one record with the specified seasonDbId in the seasonDbId argument.
     *
     * @param  {number} {seasonDbId}    seasonDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with seasonDbId requested
     */
    readOneSeason: async function({
        seasonDbId
    }, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSeason");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await season.readById(seasonDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSeasons - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSeasons: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await season.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSeason - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSeason: async function(_, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            return helper.vueTable(context.request, season, ["id", "season", "seasonDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSeason - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSeason: async function(input, context) {
        let authorization = await checkAuthorization(context, 'season', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSeason = await season.addOne(inputSanitized, benignErrorReporter);
            await createdSeason.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSeason;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSeasonCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSeasonCsv: async function(_, context) {
        if (await checkAuthorization(context, 'season', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return season.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSeason - Check user authorization and delete a record with the specified seasonDbId in the seasonDbId argument.
     *
     * @param  {number} {seasonDbId}    seasonDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSeason: async function({
        seasonDbId
    }, context) {
        if (await checkAuthorization(context, 'season', 'delete') === true) {
            if (await validForDeletion(seasonDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return season.deleteOne(seasonDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSeason - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSeason: async function(input, context) {
        let authorization = await checkAuthorization(context, 'season', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSeason = await season.updateOne(inputSanitized, benignErrorReporter);
            await updatedSeason.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSeason;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateSeason - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSeason: async function(_, context) {
        if (await checkAuthorization(context, 'season', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return season.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}