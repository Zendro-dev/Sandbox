/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const referencia = require(path.join(__dirname, '..', 'models', 'index.js')).referencia;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addAlimentos': 'registro'
}




/**
 * referencia.prototype.alimentosFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
referencia.prototype.alimentosFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.registro.idAttribute(),
        "value": this.registros_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.registros({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * referencia.prototype.countFilteredAlimentos - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
referencia.prototype.countFilteredAlimentos = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.registro.idAttribute(),
        "value": this.registros_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countRegistros({
        search: nsearch
    }, context);
}

/**
 * referencia.prototype.alimentosConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
referencia.prototype.alimentosConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.registro.idAttribute(),
        "value": this.registros_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.registrosConnection({
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
referencia.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addAlimentos)) {
        promises_add.push(this.add_alimentos(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeAlimentos)) {
        promises_remove.push(this.remove_alimentos(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_alimentos - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
referencia.prototype.add_alimentos = async function(input, benignErrorReporter) {

    await referencia.add_registros_ids(this.getIdValue(), input.addAlimentos, benignErrorReporter);
    this.registros_ids = helper.unionIds(this.registros_ids, input.addAlimentos);
}

/**
 * remove_alimentos - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
referencia.prototype.remove_alimentos = async function(input, benignErrorReporter) {

    await referencia.remove_registros_ids(this.getIdValue(), input.removeAlimentos, benignErrorReporter);
    this.registros_ids = helper.differenceIds(this.registros_ids, input.removeAlimentos);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let referencia = await resolvers.readOneReferencia({
        referencia_id: id
    }, context);
    //check that record actually exists
    if (referencia === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(referencia.countFilteredAlimentos({}, context));

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
        throw new Error(`referencia with referencia_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * referencia - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    referencia: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "referencia");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await referencia.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * referenciaConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    referenciaConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "referenciaConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await referencia.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneReferencia - Check user authorization and return one record with the specified referencia_id in the referencia_id argument.
     *
     * @param  {number} {referencia_id}    referencia_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with referencia_id requested
     */
    readOneReferencia: async function({
        referencia_id
    }, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneReferencia");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await referencia.readById(referencia_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countReferencia - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countReferencia: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await referencia.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableReferencia - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableReferencia: async function(_, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            return helper.vueTable(context.request, referencia, ["id", "referencia_id", "referencia"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addReferencia - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addReferencia: async function(input, context) {
        let authorization = await checkAuthorization(context, 'referencia', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdReferencia = await referencia.addOne(inputSanitized, benignErrorReporter);
            await createdReferencia.handleAssociations(inputSanitized, benignErrorReporter);
            return createdReferencia;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddReferenciaCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddReferenciaCsv: async function(_, context) {
        if (await checkAuthorization(context, 'referencia', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return referencia.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteReferencia - Check user authorization and delete a record with the specified referencia_id in the referencia_id argument.
     *
     * @param  {number} {referencia_id}    referencia_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteReferencia: async function({
        referencia_id
    }, context) {
        if (await checkAuthorization(context, 'referencia', 'delete') === true) {
            if (await validForDeletion(referencia_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return referencia.deleteOne(referencia_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateReferencia - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateReferencia: async function(input, context) {
        let authorization = await checkAuthorization(context, 'referencia', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedReferencia = await referencia.updateOne(inputSanitized, benignErrorReporter);
            await updatedReferencia.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedReferencia;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateReferencia - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateReferencia: async function(_, context) {
        if (await checkAuthorization(context, 'referencia', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return referencia.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}