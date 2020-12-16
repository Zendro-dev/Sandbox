/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const environmentParameter = require(path.join(__dirname, '..', 'models', 'index.js')).environmentParameter;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addStudy': 'study'
}



/**
 * environmentParameter.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
environmentParameter.prototype.study = async function({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
environmentParameter.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
environmentParameter.prototype.add_study = async function(input, benignErrorReporter) {
    await environmentParameter.add_studyDbId(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.studyDbId = input.addStudy;
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
environmentParameter.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.studyDbId) {
        await environmentParameter.remove_studyDbId(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.studyDbId = null;
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

    let environmentParameter = await resolvers.readOneEnvironmentParameter({
        environmentParameterDbId: id
    }, context);
    //check that record actually exists
    if (environmentParameter === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(environmentParameter.study({}, context));

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
        throw new Error(`environmentParameter with environmentParameterDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * environmentParameters - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    environmentParameters: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "environmentParameters");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await environmentParameter.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * environmentParametersConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    environmentParametersConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "environmentParametersConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await environmentParameter.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneEnvironmentParameter - Check user authorization and return one record with the specified environmentParameterDbId in the environmentParameterDbId argument.
     *
     * @param  {number} {environmentParameterDbId}    environmentParameterDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with environmentParameterDbId requested
     */
    readOneEnvironmentParameter: async function({
        environmentParameterDbId
    }, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneEnvironmentParameter");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await environmentParameter.readById(environmentParameterDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countEnvironmentParameters - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countEnvironmentParameters: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await environmentParameter.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableEnvironmentParameter - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableEnvironmentParameter: async function(_, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            return helper.vueTable(context.request, environmentParameter, ["id", "description", "parameterName", "parameterPUI", "unit", "unitPUI", "value", "valuePUI", "studyDbId", "environmentParameterDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addEnvironmentParameter - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addEnvironmentParameter: async function(input, context) {
        let authorization = await checkAuthorization(context, 'environmentParameter', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdEnvironmentParameter = await environmentParameter.addOne(inputSanitized, benignErrorReporter);
            await createdEnvironmentParameter.handleAssociations(inputSanitized, benignErrorReporter);
            return createdEnvironmentParameter;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddEnvironmentParameterCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddEnvironmentParameterCsv: async function(_, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return environmentParameter.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteEnvironmentParameter - Check user authorization and delete a record with the specified environmentParameterDbId in the environmentParameterDbId argument.
     *
     * @param  {number} {environmentParameterDbId}    environmentParameterDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteEnvironmentParameter: async function({
        environmentParameterDbId
    }, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'delete') === true) {
            if (await validForDeletion(environmentParameterDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return environmentParameter.deleteOne(environmentParameterDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateEnvironmentParameter - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateEnvironmentParameter: async function(input, context) {
        let authorization = await checkAuthorization(context, 'environmentParameter', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedEnvironmentParameter = await environmentParameter.updateOne(inputSanitized, benignErrorReporter);
            await updatedEnvironmentParameter.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedEnvironmentParameter;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateEnvironmentParameterWithStudyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateEnvironmentParameterWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                environmentParameterDbId
            }) => environmentParameterDbId)), environmentParameter);
        }
        return await environmentParameter.bulkAssociateEnvironmentParameterWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateEnvironmentParameterWithStudyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateEnvironmentParameterWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                environmentParameterDbId
            }) => environmentParameterDbId)), environmentParameter);
        }
        return await environmentParameter.bulkDisAssociateEnvironmentParameterWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateEnvironmentParameter - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateEnvironmentParameter: async function(_, context) {
        if (await checkAuthorization(context, 'environmentParameter', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return environmentParameter.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}