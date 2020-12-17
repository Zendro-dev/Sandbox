/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const metodo = require(path.join(__dirname, '..', 'models', 'index.js')).metodo;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addCaracteristicas_cuantitativas': 'caracteristica_cuantitativa'
}




/**
 * metodo.prototype.caracteristicas_cuantitativasFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
metodo.prototype.caracteristicas_cuantitativasFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "metodo_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.caracteristica_cuantitativas({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * metodo.prototype.countFilteredCaracteristicas_cuantitativas - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
metodo.prototype.countFilteredCaracteristicas_cuantitativas = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "metodo_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countCaracteristica_cuantitativas({
        search: nsearch
    }, context);
}

/**
 * metodo.prototype.caracteristicas_cuantitativasConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
metodo.prototype.caracteristicas_cuantitativasConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "metodo_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.caracteristica_cuantitativasConnection({
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
metodo.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCaracteristicas_cuantitativas)) {
        promises_add.push(this.add_caracteristicas_cuantitativas(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCaracteristicas_cuantitativas)) {
        promises_remove.push(this.remove_caracteristicas_cuantitativas(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_caracteristicas_cuantitativas - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
metodo.prototype.add_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            metodo_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_caracteristicas_cuantitativas - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
metodo.prototype.remove_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            metodo_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkDisAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let metodo = await resolvers.readOneMetodo({
        id: id
    }, context);
    //check that record actually exists
    if (metodo === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(metodo.countFilteredCaracteristicas_cuantitativas({}, context));

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
        throw new Error(`metodo with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * metodos - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    metodos: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "metodos");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await metodo.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * metodosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    metodosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "metodosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await metodo.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMetodo - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMetodo: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMetodo");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await metodo.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMetodos - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMetodos: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await metodo.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableMetodo - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMetodo: async function(_, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            return helper.vueTable(context.request, metodo, ["id", "id", "descripcion"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addMetodo - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMetodo: async function(input, context) {
        let authorization = await checkAuthorization(context, 'metodo', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMetodo = await metodo.addOne(inputSanitized, benignErrorReporter);
            await createdMetodo.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMetodo;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMetodoCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMetodoCsv: async function(_, context) {
        if (await checkAuthorization(context, 'metodo', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return metodo.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMetodo - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMetodo: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'metodo', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return metodo.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMetodo - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMetodo: async function(input, context) {
        let authorization = await checkAuthorization(context, 'metodo', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMetodo = await metodo.updateOne(inputSanitized, benignErrorReporter);
            await updatedMetodo.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMetodo;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateMetodo - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMetodo: async function(_, context) {
        if (await checkAuthorization(context, 'metodo', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return metodo.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}