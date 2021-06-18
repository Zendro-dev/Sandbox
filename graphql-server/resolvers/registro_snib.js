/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const registro_snib = require(path.join(__dirname, '..', 'models', 'index.js')).registro_snib;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addRegistro_siagro': 'registro_siagro'
}



/**
 * registro_snib.prototype.registro_siagro - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_snib.prototype.registro_siagro = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "snib_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.registro_siagrosConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;
    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 registro_siagros matching registro_snib with id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the registro_snib model. Returning first registro_siagro.`
            ));
        }
        return found[0].node;
    }
    return null;
}





/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_snib.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addRegistro_siagro)) {
        promises_add.push(this.add_registro_siagro(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeRegistro_siagro)) {
        promises_remove.push(this.remove_registro_siagro(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_registro_siagro - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_snib.prototype.add_registro_siagro = async function(input, benignErrorReporter) {
    await models.registro_siagro.add_snib_id(input.addRegistro_siagro, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_registro_siagro - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_snib.prototype.remove_registro_siagro = async function(input, benignErrorReporter) {
    await models.registro_siagro.remove_snib_id(input.removeRegistro_siagro, this.getIdValue(), benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let registro_snib = await resolvers.readOneRegistro_snib({
        id: id
    }, context);
    //check that record actually exists
    if (registro_snib === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(registro_snib.registro_siagro({}, context));

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
        throw new Error(`registro_snib with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * registro_snibs - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    registro_snibs: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "registro_snibs");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_snib.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * registro_snibsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    registro_snibsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "registro_snibsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_snib.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneRegistro_snib - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneRegistro_snib: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneRegistro_snib");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_snib.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countRegistro_snibs - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countRegistro_snibs: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_snib.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableRegistro_snib - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableRegistro_snib: async function(_, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            return helper.vueTable(context.request, registro_snib, ["id", "id", "procedenciaejemplar", "fechacolecta", "numcolecta", "ambiente", "colector", "coleccion", "numcatalogo", "proyecto", "formadecitar", "licenciauso", "urlproyecto", "urlejemplar", "version"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addRegistro_snib - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addRegistro_snib: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro_snib', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdRegistro_snib = await registro_snib.addOne(inputSanitized, benignErrorReporter);
            await createdRegistro_snib.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRegistro_snib;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddRegistro_snibCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddRegistro_snibCsv: async function(_, context) {
        if (await checkAuthorization(context, 'registro_snib', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro_snib.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteRegistro_snib - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteRegistro_snib: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'registro_snib', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return registro_snib.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateRegistro_snib - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateRegistro_snib: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro_snib', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRegistro_snib = await registro_snib.updateOne(inputSanitized, benignErrorReporter);
            await updatedRegistro_snib.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRegistro_snib;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateRegistro_snib - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateRegistro_snib: async function(_, context) {
        if (await checkAuthorization(context, 'registro_snib', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro_snib.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}