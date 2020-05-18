/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observation = require(path.join(__dirname, '..', 'models_index.js')).observation;
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
        try {
            if (search === undefined) {
                return resolvers.readOneSeason({
                    [models.season.idAttribute()]: this.seasonDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.season.idAttribute(),
                    "value": {
                        "value": this.seasonDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.seasonsConnection({
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
        try {
            if (search === undefined) {
                return resolvers.readOneGermplasm({
                    [models.germplasm.idAttribute()]: this.germplasmDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.germplasm.idAttribute(),
                    "value": {
                        "value": this.germplasmDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.germplasmsConnection({
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
        try {
            if (search === undefined) {
                return resolvers.readOneObservationUnit({
                    [models.observationUnit.idAttribute()]: this.observationUnitDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.observationUnit.idAttribute(),
                    "value": {
                        "value": this.observationUnitDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.observationUnitsConnection({
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
        try {
            if (search === undefined) {
                return resolvers.readOneObservationVariable({
                    [models.observationVariable.idAttribute()]: this.observationVariableDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.observationVariable.idAttribute(),
                    "value": {
                        "value": this.observationVariableDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.observationVariablesConnection({
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
        try {
            if (search === undefined) {
                return resolvers.readOneStudy({
                    [models.study.idAttribute()]: this.studyDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.study.idAttribute(),
                    "value": {
                        "value": this.studyDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.studiesConnection({
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
        try {
            if (search === undefined) {
                return resolvers.readOneImage({
                    [models.image.idAttribute()]: this.imageDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.image.idAttribute(),
                    "value": {
                        "value": this.imageDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.imagesConnection({
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
observation.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];

        if (helper.isNotUndefinedAndNotNull(input.addSeason)) {
            promises.push(this.add_season(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addGermplasm)) {
            promises.push(this.add_germplasm(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addObservationUnit)) {
            promises.push(this.add_observationUnit(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addObservationVariable)) {
            promises.push(this.add_observationVariable(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
            promises.push(this.add_study(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addImage)) {
            promises.push(this.add_image(input, context));
        }

        if (helper.isNotUndefinedAndNotNull(input.removeSeason)) {
            promises.push(this.remove_season(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeGermplasm)) {
            promises.push(this.remove_germplasm(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeObservationUnit)) {
            promises.push(this.remove_observationUnit(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeObservationVariable)) {
            promises.push(this.remove_observationVariable(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
            promises.push(this.remove_study(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeImage)) {
            promises.push(this.remove_image(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}
/**
 * add_season - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_season = async function(input) {
    await observation.add_seasonDbId(this.getIdValue(), input.addSeason);
    this.seasonDbId = input.addSeason;
}
/**
 * add_germplasm - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_germplasm = async function(input) {
    await observation.add_germplasmDbId(this.getIdValue(), input.addGermplasm);
    this.germplasmDbId = input.addGermplasm;
}
/**
 * add_observationUnit - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_observationUnit = async function(input) {
    await observation.add_observationUnitDbId(this.getIdValue(), input.addObservationUnit);
    this.observationUnitDbId = input.addObservationUnit;
}
/**
 * add_observationVariable - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_observationVariable = async function(input) {
    await observation.add_observationVariableDbId(this.getIdValue(), input.addObservationVariable);
    this.observationVariableDbId = input.addObservationVariable;
}
/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_study = async function(input) {
    await observation.add_studyDbId(this.getIdValue(), input.addStudy);
    this.studyDbId = input.addStudy;
}
/**
 * add_image - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observation.prototype.add_image = async function(input) {
    await observation.add_imageDbId(this.getIdValue(), input.addImage);
    this.imageDbId = input.addImage;
}
/**
 * remove_season - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_season = async function(input) {
    if (input.removeSeason == this.seasonDbId) {
        await observation.remove_seasonDbId(this.getIdValue(), input.removeSeason);
        this.seasonDbId = null;
    }
}
/**
 * remove_germplasm - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_germplasm = async function(input) {
    if (input.removeGermplasm == this.germplasmDbId) {
        await observation.remove_germplasmDbId(this.getIdValue(), input.removeGermplasm);
        this.germplasmDbId = null;
    }
}
/**
 * remove_observationUnit - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_observationUnit = async function(input) {
    if (input.removeObservationUnit == this.observationUnitDbId) {
        await observation.remove_observationUnitDbId(this.getIdValue(), input.removeObservationUnit);
        this.observationUnitDbId = null;
    }
}
/**
 * remove_observationVariable - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_observationVariable = async function(input) {
    if (input.removeObservationVariable == this.observationVariableDbId) {
        await observation.remove_observationVariableDbId(this.getIdValue(), input.removeObservationVariable);
        this.observationVariableDbId = null;
    }
}
/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_study = async function(input) {
    if (input.removeStudy == this.studyDbId) {
        await observation.remove_studyDbId(this.getIdValue(), input.removeStudy);
        this.studyDbId = null;
    }
}
/**
 * remove_image - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observation.prototype.remove_image = async function(input) {
    if (input.removeImage == this.imageDbId) {
        await observation.remove_imageDbId(this.getIdValue(), input.removeImage);
        this.imageDbId = null;
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
    let count = (await observation.countRecords(search)).sum;
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
        throw new Error(errorMessageForRecordsLimit("readOneObservation"));
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

    if (context.benignErrors.length > 0) {
        throw new Error('Errors occurred when counting associated records. No deletion permitted for reasons of security.');
    }

    return true;
}

module.exports = {

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
        //check: adapters
        let registeredAdapters = Object.values(observation.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observation"');
        } //else

        try {
            //exclude adapters
            let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "observation"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {
                let connectionObj = await observation.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters);
                //check adapter authorization Errors
                if (authorizationCheck.authorizationErrors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
                }
                //check Errors returned by the model layer (time-outs, unreachable, etc...)
                if (connectionObj.errors !== undefined && Array.isArray(connectionObj.errors) && connectionObj.errors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(connectionObj.errors)
                    delete connectionObj['errors']
                }
                return connectionObj;
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "observation" ');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
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
        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observation.adapterForIri(observationDbId), 'read');
            if (authorizationCheck === true) {
                return observation.readById(observationDbId);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * addObservation - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservation: async function(input, context) {
        //check: input has idAttribute
        if (!input.observationDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationDbId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observation.adapterForIri(input.observationDbId), 'create');
            if (authorizationCheck === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let createdRecord = await observation.addOne(inputSanitized);
                await createdRecord.handleAssociations(inputSanitized, context);
                return createdRecord;
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },


    /**
     * bulkAddObservationCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationCsv: function(_, context) {
        return checkAuthorization(context, 'observation', 'create').then(authorization => {
            if (authorization === true) {
                return observation.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
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
        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observation.adapterForIri(observationDbId), 'delete');
            if (authorizationCheck === true) {
                if (await validForDeletion(observationDbId, context)) {
                    return observation.deleteOne(observationDbId);
                }
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * updateObservation - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservation: async function(input, context) {
        //check: input has idAttribute
        if (!input.observationDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationDbId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observation.adapterForIri(input.observationDbId), 'update');
            if (authorizationCheck === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let updatedRecord = await observation.updateOne(inputSanitized);
                await updatedRecord.handleAssociations(inputSanitized, context);
                return updatedRecord;
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
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
        //check: adapters
        let registeredAdapters = Object.values(observation.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observation"');
        } //else

        try {
            //exclude adapters
            let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "observation"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {

                let countObj = await observation.countRecords(search, authorizationCheck.authorizedAdapters);
                //check adapter authorization Errors
                if (authorizationCheck.authorizationErrors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
                }
                //check Errors returned by the model layer (time-outs, unreachable, etc...)
                if (countObj.errors !== undefined && Array.isArray(countObj.errors) && countObj.errors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(countObj.errors)
                    delete countObj['errors']
                }
                return countObj.sum;
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "observation"');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateObservation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservation: function(_, context) {
        return checkAuthorization(context, 'observation', 'read').then(authorization => {
            if (authorization === true) {
                return observation.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}