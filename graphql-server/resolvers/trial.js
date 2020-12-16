/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const trial = require(path.join(__dirname, '..', 'models', 'index.js')).trial;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addProgram': 'program',
    'addContacts': 'contact',
    'addObservationUnits': 'observationUnit',
    'addStudies': 'study'
}



/**
 * trial.prototype.program - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
trial.prototype.program = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.programDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProgram({
                [models.program.idAttribute()]: this.programDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.program.idAttribute(),
                "value": this.programDbId,
                "operator": "eq"
            });
            let found = await resolvers.programs({
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
 * trial.prototype.contactsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
trial.prototype.contactsFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.contacts({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * trial.prototype.countFilteredContacts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
trial.prototype.countFilteredContacts = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countContacts({
        search: nsearch
    }, context);
}

/**
 * trial.prototype.contactsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
trial.prototype.contactsConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.contactsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * trial.prototype.observationUnitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
trial.prototype.observationUnitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
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
 * trial.prototype.countFilteredObservationUnits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
trial.prototype.countFilteredObservationUnits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationUnits({
        search: nsearch
    }, context);
}

/**
 * trial.prototype.observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
trial.prototype.observationUnitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
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
 * trial.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
trial.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
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
 * trial.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
trial.prototype.countFilteredStudies = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * trial.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
trial.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "trialDbId",
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
trial.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addContacts)) {
        promises_add.push(this.add_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservationUnits)) {
        promises_add.push(this.add_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProgram)) {
        promises_add.push(this.add_program(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeContacts)) {
        promises_remove.push(this.remove_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservationUnits)) {
        promises_remove.push(this.remove_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProgram)) {
        promises_remove.push(this.remove_program(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_contacts - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.add_contacts = async function(input, benignErrorReporter) {

    await trial.add_contactDbIds(this.getIdValue(), input.addContacts, benignErrorReporter);
    this.contactDbIds = helper.unionIds(this.contactDbIds, input.addContacts);
}

/**
 * add_observationUnits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.add_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationUnits.map(associatedRecordId => {
        return {
            trialDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.add_studies = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addStudies.map(associatedRecordId => {
        return {
            trialDbId: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkAssociateStudyWithTrialDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_program - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.add_program = async function(input, benignErrorReporter) {
    await trial.add_programDbId(this.getIdValue(), input.addProgram, benignErrorReporter);
    this.programDbId = input.addProgram;
}

/**
 * remove_contacts - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.remove_contacts = async function(input, benignErrorReporter) {

    await trial.remove_contactDbIds(this.getIdValue(), input.removeContacts, benignErrorReporter);
    this.contactDbIds = helper.differenceIds(this.contactDbIds, input.removeContacts);
}

/**
 * remove_observationUnits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.remove_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationUnits.map(associatedRecordId => {
        return {
            trialDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.remove_studies = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeStudies.map(associatedRecordId => {
        return {
            trialDbId: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkDisAssociateStudyWithTrialDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_program - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
trial.prototype.remove_program = async function(input, benignErrorReporter) {
    if (input.removeProgram == this.programDbId) {
        await trial.remove_programDbId(this.getIdValue(), input.removeProgram, benignErrorReporter);
        this.programDbId = null;
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

    let trial = await resolvers.readOneTrial({
        trialDbId: id
    }, context);
    //check that record actually exists
    if (trial === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(trial.countFilteredContacts({}, context));
    promises_to_many.push(trial.countFilteredObservationUnits({}, context));
    promises_to_many.push(trial.countFilteredStudies({}, context));
    promises_to_one.push(trial.program({}, context));

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
        throw new Error(`trial with trialDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * trials - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    trials: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "trials");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trial.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * trialsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    trialsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "trialsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trial.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneTrial - Check user authorization and return one record with the specified trialDbId in the trialDbId argument.
     *
     * @param  {number} {trialDbId}    trialDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with trialDbId requested
     */
    readOneTrial: async function({
        trialDbId
    }, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneTrial");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trial.readById(trialDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countTrials - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countTrials: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await trial.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableTrial - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableTrial: async function(_, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            return helper.vueTable(context.request, trial, ["id", "trialDbId", "commonCropName", "documentationURL", "trialDescription", "trialName", "trialPUI", "programDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addTrial - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addTrial: async function(input, context) {
        let authorization = await checkAuthorization(context, 'trial', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdTrial = await trial.addOne(inputSanitized, benignErrorReporter);
            await createdTrial.handleAssociations(inputSanitized, benignErrorReporter);
            return createdTrial;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddTrialCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddTrialCsv: async function(_, context) {
        if (await checkAuthorization(context, 'trial', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return trial.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteTrial - Check user authorization and delete a record with the specified trialDbId in the trialDbId argument.
     *
     * @param  {number} {trialDbId}    trialDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteTrial: async function({
        trialDbId
    }, context) {
        if (await checkAuthorization(context, 'trial', 'delete') === true) {
            if (await validForDeletion(trialDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return trial.deleteOne(trialDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateTrial - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateTrial: async function(input, context) {
        let authorization = await checkAuthorization(context, 'trial', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedTrial = await trial.updateOne(inputSanitized, benignErrorReporter);
            await updatedTrial.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedTrial;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateTrialWithProgramDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateTrialWithProgramDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), models.program);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), trial);
        }
        return await trial.bulkAssociateTrialWithProgramDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateTrialWithProgramDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateTrialWithProgramDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), models.program);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), trial);
        }
        return await trial.bulkDisAssociateTrialWithProgramDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateTrial - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTrial: async function(_, context) {
        if (await checkAuthorization(context, 'trial', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return trial.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}