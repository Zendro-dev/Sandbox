/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const investigation = require(path.join(__dirname, '..', 'models', 'index.js')).investigation;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
const validatorUtil = require("../utils/validatorUtil");

const associationArgsDef = {
    'addStudies': 'study',
    'addPeople': 'person'
}



/**
 * investigation.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
investigation.prototype.countFilteredStudies = function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "investigation_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}


/**
 * investigation.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
investigation.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "investigation_id",
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
 * investigation.prototype.countFilteredPeople - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
investigation.prototype.countFilteredPeople = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_ids) || this.person_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countPeople({
        search: nsearch
    }, context);
}


/**
 * investigation.prototype.peopleConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
investigation.prototype.peopleConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_ids) || this.person_ids.length === 0) {
        return {
            edges: [],
            people: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.peopleConnection({
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
 * @param {string} token The token used for authorization
 */
investigation.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addPeople)) {
        promises_add.push(this.add_people(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removePeople)) {
        promises_remove.push(this.remove_people(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
investigation.prototype.add_studies = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.addStudies.map(associatedRecordId => {
        return {
            investigation_id: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkAssociateStudyWithInvestigation_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * add_people - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
investigation.prototype.add_people = async function(input, benignErrorReporter, token) {

    await investigation.add_person_ids(this.getIdValue(), input.addPeople, benignErrorReporter, token);
    this.person_ids = helper.unionIds(this.person_ids, input.addPeople);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
investigation.prototype.remove_studies = async function(input, benignErrorReporter, token) {

    let bulkAssociationInput = input.removeStudies.map(associatedRecordId => {
        return {
            investigation_id: this.getIdValue(),
            [models.study.idAttribute()]: associatedRecordId
        }
    });
    await models.study.bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput, benignErrorReporter, token);
}

/**
 * remove_people - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
investigation.prototype.remove_people = async function(input, benignErrorReporter, token) {

    await investigation.remove_person_ids(this.getIdValue(), input.removePeople, benignErrorReporter, token);
    this.person_ids = helper.differenceIds(this.person_ids, input.removePeople);
}


/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let investigation = await resolvers.readOneInvestigation({
        id: id
    }, context);
    //check that record actually exists
    if (investigation === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;

    promises_to_many.push(investigation.countFilteredStudies({}, context));

    get_to_many_associated_fk += Array.isArray(investigation.person_ids) ? investigation.person_ids.length : 0;

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated + get_to_one_associated_fk;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAssociatedRecordsWithRejectReaction(id, context) > 0) {
        throw new Error(`investigation with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }

    return true;
}

/**
 * updateAssociations - update associations for a given record
 *
 * @param  {ID} id      Id of record
 * @param  {object} context Default context by resolver
 */
const updateAssociations = async (id, context) => {
    const investigation_record = await resolvers.readOneInvestigation({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;


}

module.exports = {

    /**
     * investigationsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    investigationsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "investigationsConnection");

        //check: adapters
        let registeredAdapters = Object.values(investigation.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "investigation"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "investigation"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors.push(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await investigation.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "investigation" ');
            }
        }
    },


    /**
     * readOneInvestigation - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneInvestigation: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, investigation.adapterForIri(id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneInvestigation");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return investigation.readById(id, context.benignErrors, token);
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addInvestigation - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addInvestigation: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, investigation.adapterForIri(input.id), 'create');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let createdRecord = await investigation.addOne(inputSanitized, context.benignErrors, token);
            await createdRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * deleteInvestigation - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteInvestigation: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, investigation.adapterForIri(id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return investigation.deleteOne(id, context.benignErrors, token);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updateInvestigation - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateInvestigation: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, investigation.adapterForIri(input.id), 'update');
        if (authorizationCheck === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            let updatedRecord = await investigation.updateOne(inputSanitized, context.benignErrors, token);
            await updatedRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countInvestigations - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countInvestigations: async function({
        search
    }, context) {

        //check: adapters
        let registeredAdapters = Object.values(investigation.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "investigation"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "investigation"');
        } //else

        //check: auth adapters
        let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
        if (authorizationCheck.authorizedAdapters.length > 0) {
            //check adapter authorization Errors
            if (authorizationCheck.authorizationErrors.length > 0) {
                context.benignErrors.push(authorizationCheck.authorizationErrors);
            }
            let searchAuthorizationCheck = await helper.authorizedAdapters(context, adapters, 'search');
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return await investigation.countRecords(search, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "investigation"');
            }
        }
    },


    /**
     * csvTableTemplateInvestigation - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateInvestigation: async function(_, context) {
        if (await checkAuthorization(context, 'investigation', 'read') === true) {
            return investigation.csvTableTemplate(context.benignErrors);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * investigationsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    investigationsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "investigation", "read")) === true) {
            return investigation.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * investigationsZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    investigationsZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "investigation", "read")) === true) {
            return investigation.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateInvestigationForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateInvestigationForCreation: async (input, context) => {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        let authorization = await checkAuthorization(context, investigation.adapterForIri(input.id), 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForCreate",
                    investigation,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateInvestigationForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateInvestigationForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, investigation.adapterForIri(input.id), 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForUpdate",
                    investigation,
                    inputSanitized
                );
                return true;
            } catch (error) {
                delete input.skipAssociationsExistenceChecks;
                error.input = input;
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateInvestigationForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateInvestigationForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, investigation.adapterForIri(id), 'read')) === true) {

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    investigation,
                    id);
                return true;
            } catch (error) {
                error.input = {
                    id: id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateInvestigationAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateInvestigationAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, investigation.adapterForIri(id), 'read')) === true) {

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    investigation,
                    id);
                return true;
            } catch (error) {
                error.input = {
                    id: id
                };
                context.benignErrors.push(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
}