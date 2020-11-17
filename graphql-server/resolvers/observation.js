/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observation = require(path.join(__dirname, '..', 'models', 'index.js')).observation;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addSeason': 'season',
    'addGermplasm': 'germplasm',
    'addObservationUnit': 'observationUnit',
    'addObservationVariable': 'observationVariable',
    'addStudy': 'study',
    'addImage': 'image'
}



/**
 * observation.prototype.season - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.season = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.seasonDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSeason({
                [models.season.idAttribute()]: this.seasonDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.season.idAttribute(),
                "value": this.seasonDbId,
                "operator": "eq"
            });
            let found = await resolvers.seasons({
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
 * observation.prototype.germplasm - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.germplasm = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.germplasmDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneGermplasm({
                [models.germplasm.idAttribute()]: this.germplasmDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.germplasm.idAttribute(),
                "value": this.germplasmDbId,
                "operator": "eq"
            });
            let found = await resolvers.germplasms({
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
 * observation.prototype.observationUnit - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.observationUnit = async function({
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
 * observation.prototype.observationVariable - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.observationVariable = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.observationVariableDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneObservationVariable({
                [models.observationVariable.idAttribute()]: this.observationVariableDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.observationVariable.idAttribute(),
                "value": this.observationVariableDbId,
                "operator": "eq"
            });
            let found = await resolvers.observationVariables({
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
 * observation.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.study = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.studyDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.studyDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.studyDbId,
                "operator": "eq"
            });
            let found = await resolvers.studies({
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
 * observation.prototype.image - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observation.prototype.image = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.imageDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneImage({
                [models.image.idAttribute()]: this.imageDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.image.idAttribute(),
                "value": this.imageDbId,
                "operator": "eq"
            });
            let found = await resolvers.images({
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
observation.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addSeason)) {
        promises_add.push(this.add_season(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addGermplasm)) {
        promises_add.push(this.add_germplasm(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addObservationUnit)) {
        promises_add.push(this.add_observationUnit(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addObservationVariable)) {
        promises_add.push(this.add_observationVariable(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addImage)) {
        promises_add.push(this.add_image(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeSeason)) {
        promises_remove.push(this.remove_season(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeGermplasm)) {
        promises_remove.push(this.remove_germplasm(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeObservationUnit)) {
        promises_remove.push(this.remove_observationUnit(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeObservationVariable)) {
        promises_remove.push(this.remove_observationVariable(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeImage)) {
        promises_remove.push(this.remove_image(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_season - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_season = async function(input, benignErrorReporter) {
    await observation.add_seasonDbId(this.getIdValue(), input.addSeason, benignErrorReporter);
    this.seasonDbId = input.addSeason;
}

/**
 * add_germplasm - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_germplasm = async function(input, benignErrorReporter) {
    await observation.add_germplasmDbId(this.getIdValue(), input.addGermplasm, benignErrorReporter);
    this.germplasmDbId = input.addGermplasm;
}

/**
 * add_observationUnit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_observationUnit = async function(input, benignErrorReporter) {
    await observation.add_observationUnitDbId(this.getIdValue(), input.addObservationUnit, benignErrorReporter);
    this.observationUnitDbId = input.addObservationUnit;
}

/**
 * add_observationVariable - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_observationVariable = async function(input, benignErrorReporter) {
    await observation.add_observationVariableDbId(this.getIdValue(), input.addObservationVariable, benignErrorReporter);
    this.observationVariableDbId = input.addObservationVariable;
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_study = async function(input, benignErrorReporter) {
    await observation.add_studyDbId(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.studyDbId = input.addStudy;
}

/**
 * add_image - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.add_image = async function(input, benignErrorReporter) {
    await observation.add_imageDbId(this.getIdValue(), input.addImage, benignErrorReporter);
    this.imageDbId = input.addImage;
}

/**
 * remove_season - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_season = async function(input, benignErrorReporter) {
    if (input.removeSeason == this.seasonDbId) {
        await observation.remove_seasonDbId(this.getIdValue(), input.removeSeason, benignErrorReporter);
        this.seasonDbId = null;
    }
}

/**
 * remove_germplasm - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_germplasm = async function(input, benignErrorReporter) {
    if (input.removeGermplasm == this.germplasmDbId) {
        await observation.remove_germplasmDbId(this.getIdValue(), input.removeGermplasm, benignErrorReporter);
        this.germplasmDbId = null;
    }
}

/**
 * remove_observationUnit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_observationUnit = async function(input, benignErrorReporter) {
    if (input.removeObservationUnit == this.observationUnitDbId) {
        await observation.remove_observationUnitDbId(this.getIdValue(), input.removeObservationUnit, benignErrorReporter);
        this.observationUnitDbId = null;
    }
}

/**
 * remove_observationVariable - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_observationVariable = async function(input, benignErrorReporter) {
    if (input.removeObservationVariable == this.observationVariableDbId) {
        await observation.remove_observationVariableDbId(this.getIdValue(), input.removeObservationVariable, benignErrorReporter);
        this.observationVariableDbId = null;
    }
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.studyDbId) {
        await observation.remove_studyDbId(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.studyDbId = null;
    }
}

/**
 * remove_image - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observation.prototype.remove_image = async function(input, benignErrorReporter) {
    if (input.removeImage == this.imageDbId) {
        await observation.remove_imageDbId(this.getIdValue(), input.removeImage, benignErrorReporter);
        this.imageDbId = null;
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

    let observation = await resolvers.readOneObservation({
        observationDbId: id
    }, context);
    //check that record actually exists
    if (observation === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(observation.season({}, context));
    promises_to_one.push(observation.germplasm({}, context));
    promises_to_one.push(observation.observationUnit({}, context));
    promises_to_one.push(observation.observationVariable({}, context));
    promises_to_one.push(observation.study({}, context));
    promises_to_one.push(observation.image({}, context));

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
        throw new Error(`observation with observationDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * observations - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    observations: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "observations");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observation.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observationsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "observationsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observation.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneObservation - Check user authorization and return one record with the specified observationDbId in the observationDbId argument.
     *
     * @param  {number} {observationDbId}    observationDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with observationDbId requested
     */
    readOneObservation: async function({
        observationDbId
    }, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservation");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observation.readById(observationDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countObservations - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countObservations: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observation.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableObservation - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableObservation: async function(_, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            return helper.vueTable(context.request, observation, ["id", "collector", "germplasmDbId", "observationUnitDbId", "observationVariableDbId", "studyDbId", "uploadedBy", "value", "observationDbId", "seasonDbId", "imageDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addObservation - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observation', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdObservation = await observation.addOne(inputSanitized, benignErrorReporter);
            await createdObservation.handleAssociations(inputSanitized, benignErrorReporter);
            return createdObservation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddObservationCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationCsv: async function(_, context) {
        if (await checkAuthorization(context, 'observation', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observation.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteObservation - Check user authorization and delete a record with the specified observationDbId in the observationDbId argument.
     *
     * @param  {number} {observationDbId}    observationDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservation: async function({
        observationDbId
    }, context) {
        if (await checkAuthorization(context, 'observation', 'delete') === true) {
            if (await validForDeletion(observationDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return observation.deleteOne(observationDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateObservation - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservation: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observation', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedObservation = await observation.updateOne(inputSanitized, benignErrorReporter);
            await updatedObservation.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedObservation;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateObservationWithSeasonDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithSeasonDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                seasonDbId
            }) => seasonDbId)), models.season);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithSeasonDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationWithGermplasmDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithGermplasmDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), models.germplasm);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithGermplasmDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationWithObservationUnitDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationWithObservationVariableDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithObservationVariableDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), models.observationVariable);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithObservationVariableDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationWithStudyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationWithImageDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationWithImageDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                imageDbId
            }) => imageDbId)), models.image);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkAssociateObservationWithImageDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithSeasonDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithSeasonDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                seasonDbId
            }) => seasonDbId)), models.season);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithSeasonDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithGermplasmDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithGermplasmDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), models.germplasm);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithGermplasmDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithObservationUnitDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithObservationUnitDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), models.observationUnit);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithObservationUnitDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithObservationVariableDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithObservationVariableDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationVariableDbId
            }) => observationVariableDbId)), models.observationVariable);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithObservationVariableDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithStudyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationWithImageDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationWithImageDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                imageDbId
            }) => imageDbId)), models.image);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationDbId
            }) => observationDbId)), observation);
        }
        return await observation.bulkDisAssociateObservationWithImageDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateObservation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservation: async function(_, context) {
        if (await checkAuthorization(context, 'observation', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observation.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}