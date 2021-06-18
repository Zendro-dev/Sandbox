/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sitio = require(path.join(__dirname, '..', 'models', 'index.js')).sitio;
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
 * sitio.prototype.registro_siagro - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sitio.prototype.registro_siagro = async function({
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
                `Not unique "to_one" association Error: Found > 1 registro_siagros matching sitio with id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the sitio model. Returning first registro_siagro.`
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
sitio.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
sitio.prototype.add_registro_siagro = async function(input, benignErrorReporter) {
    await models.registro_siagro.add_snib_id(input.addRegistro_siagro, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_registro_siagro - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sitio.prototype.remove_registro_siagro = async function(input, benignErrorReporter) {
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

    let sitio = await resolvers.readOneSitio({
        id: id
    }, context);
    //check that record actually exists
    if (sitio === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(sitio.registro_siagro({}, context));

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
        throw new Error(`sitio with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * sitios - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    sitios: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "sitios");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sitio.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * sitiosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    sitiosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "sitiosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sitio.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSitio - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSitio: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSitio");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sitio.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSitios - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSitios: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sitio.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSitio - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSitio: async function(_, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            return helper.vueTable(context.request, sitio, ["id", "id", "paismapa", "estadomapa", "claveestadomapa", "clavemunicipiomapa", "municipiomapa", "localidad", "datum"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSitio - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSitio: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sitio', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSitio = await sitio.addOne(inputSanitized, benignErrorReporter);
            await createdSitio.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSitio;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSitioCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSitioCsv: async function(_, context) {
        if (await checkAuthorization(context, 'sitio', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sitio.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSitio - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSitio: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sitio', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sitio.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSitio - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSitio: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sitio', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSitio = await sitio.updateOne(inputSanitized, benignErrorReporter);
            await updatedSitio.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSitio;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateSitio - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSitio: async function(_, context) {
        if (await checkAuthorization(context, 'sitio', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sitio.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}