/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const person = require(path.join(__dirname, '..', 'models', 'index.js')).person;
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
    'addInvestigations': 'investigation',
    'addStudies': 'study'
}



/**
 * person.prototype.countFilteredInvestigations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredInvestigations = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.investigation_ids) || this.investigation_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.investigation.idAttribute(),
        "value": this.investigation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countInvestigations({
        search: nsearch
    }, context);
}


/**
 * person.prototype.investigationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.investigationsConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.investigation_ids) || this.investigation_ids.length === 0) {
        return {
            edges: [],
            investigations: [],
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
        "field": models.investigation.idAttribute(),
        "value": this.investigation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.investigationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * person.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredStudies = function({
    search
}, context) {

    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_ids) || this.study_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}


/**
 * person.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {

    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_ids) || this.study_ids.length === 0) {
        return {
            edges: [],
            studies: [],
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
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
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
 * @param {string} token The token used for authorization
 */
person.prototype.handleAssociations = async function(input, benignErrorReporter, token) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addInvestigations)) {
        promises_add.push(this.add_investigations(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter, token));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeInvestigations)) {
        promises_remove.push(this.remove_investigations(input, benignErrorReporter, token));
    }
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter, token));
    }

    await Promise.all(promises_remove);

}
/**
 * add_investigations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
person.prototype.add_investigations = async function(input, benignErrorReporter, token) {

    await person.add_investigation_ids(this.getIdValue(), input.addInvestigations, benignErrorReporter, token);
    this.investigation_ids = helper.unionIds(this.investigation_ids, input.addInvestigations);
}

/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
person.prototype.add_studies = async function(input, benignErrorReporter, token) {

    await person.add_study_ids(this.getIdValue(), input.addStudies, benignErrorReporter, token);
    this.study_ids = helper.unionIds(this.study_ids, input.addStudies);
}

/**
 * remove_investigations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
person.prototype.remove_investigations = async function(input, benignErrorReporter, token) {

    await person.remove_investigation_ids(this.getIdValue(), input.removeInvestigations, benignErrorReporter, token);
    this.investigation_ids = helper.differenceIds(this.investigation_ids, input.removeInvestigations);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 * @param {string} token The token used for authorization
 */
person.prototype.remove_studies = async function(input, benignErrorReporter, token) {

    await person.remove_study_ids(this.getIdValue(), input.removeStudies, benignErrorReporter, token);
    this.study_ids = helper.differenceIds(this.study_ids, input.removeStudies);
}


/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let person = await resolvers.readOnePerson({
        id: id
    }, context);
    //check that record actually exists
    if (person === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    let get_to_one_associated_fk = 0;


    get_to_many_associated_fk += Array.isArray(person.investigation_ids) ? person.investigation_ids.length : 0;

    get_to_many_associated_fk += Array.isArray(person.study_ids) ? person.study_ids.length : 0;

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
        throw new Error(`person with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
    const person_record = await resolvers.readOnePerson({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;


}

module.exports = {

    /**
     * peopleConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    peopleConnection: async function({
        search,
        order,
        pagination
    }, context) {
        // check valid pagination arguments
        helper.checkCursorBasedPaginationArgument(pagination);
        // reduce recordsLimit and check if exceeded
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "peopleConnection");

        //check: adapters
        let registeredAdapters = Object.values(person.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "person"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "person"');
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
            return await person.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "person" ');
            }
        }
    },


    /**
     * readOnePerson - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOnePerson: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, person.adapterForIri(id), 'read');
        if (authorizationCheck === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOnePerson");
            let token = context.request ?
                context.request.headers ?
                context.request.headers.authorization :
                undefined :
                undefined;
            return person.readById(id, context.benignErrors, token);
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * addPerson - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPerson: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, person.adapterForIri(input.id), 'create');
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
            let createdRecord = await person.addOne(inputSanitized, context.benignErrors, token);
            await createdRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return createdRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * deletePerson - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePerson: async function({
        id
    }, context) {
        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, person.adapterForIri(id), 'delete');
        if (authorizationCheck === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let token = context.request ?
                    context.request.headers ?
                    context.request.headers.authorization :
                    undefined :
                    undefined;
                return person.deleteOne(id, context.benignErrors, token);
            }
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * updatePerson - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePerson: async function(input, context) {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }

        //check: adapters auth
        let authorizationCheck = await checkAuthorization(context, person.adapterForIri(input.id), 'update');
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
            let updatedRecord = await person.updateOne(inputSanitized, context.benignErrors, token);
            await updatedRecord.handleAssociations(inputSanitized, context.benignErrors, token);
            return updatedRecord;
        } else { //adapter not auth
            throw new Error("You don't have authorization to perform this action on adapter");
        }
    },

    /**
     * countPeople - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */

    countPeople: async function({
        search
    }, context) {

        //check: adapters
        let registeredAdapters = Object.values(person.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "person"');
        } //else

        //exclude adapters
        let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
        if (adapters.length === 0) {
            throw new Error('All adapters was excluded for data model "person"');
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
            return await person.countRecords(search, authorizationCheck.authorizedAdapters, context.benignErrors, searchAuthorizationCheck.authorizedAdapters, token);
        } else { //adapters not auth || errors
            // else new Error
            if (authorizationCheck.authorizationErrors.length > 0) {
                throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
            } else {
                throw new Error('No available adapters for data model "person"');
            }
        }
    },


    /**
     * csvTableTemplatePerson - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePerson: async function(_, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            return person.csvTableTemplate(context.benignErrors);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * peopleZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    peopleZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "person", "read")) === true) {
            return person.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * peopleZendroDefinition - Return data model definition
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {GraphQLJSONObject}        Data model definition
     */
    peopleZendroDefinition: async function(_, context) {
        if ((await checkAuthorization(context, "person", "read")) === true) {
            return person.definition;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validatePersonForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validatePersonForCreation: async (input, context) => {
        //check: input has idAttribute
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        let authorization = await checkAuthorization(context, person.adapterForIri(input.id), 'read');
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
                    person,
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
     * validatePersonForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validatePersonForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, person.adapterForIri(input.id), 'read');
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
                    person,
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
     * validatePersonForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validatePersonForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, person.adapterForIri(id), 'read')) === true) {

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    person,
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
     * validatePersonAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validatePersonAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, person.adapterForIri(id), 'read')) === true) {

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    person,
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