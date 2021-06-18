/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const donante = require(path.join(__dirname, '..', 'models', 'index.js')).donante;
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
 * donante.prototype.registro_siagroFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
donante.prototype.registro_siagroFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "donante_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.registro_siagros({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * donante.prototype.countFilteredRegistro_siagro - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
donante.prototype.countFilteredRegistro_siagro = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "donante_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countRegistro_siagros({
        search: nsearch
    }, context);
}

/**
 * donante.prototype.registro_siagroConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
donante.prototype.registro_siagroConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "donante_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.registro_siagrosConnection({
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
donante.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addRegistro_siagro)) {
        promises_add.push(this.add_registro_siagro(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeRegistro_siagro)) {
        promises_remove.push(this.remove_registro_siagro(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_registro_siagro - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
donante.prototype.add_registro_siagro = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addRegistro_siagro.map(associatedRecordId => {
        return {
            donante_id: this.getIdValue(),
            [models.registro_siagro.idAttribute()]: associatedRecordId
        }
    });
    await models.registro_siagro.bulkAssociateRegistro_siagroWithDonante_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_registro_siagro - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
donante.prototype.remove_registro_siagro = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeRegistro_siagro.map(associatedRecordId => {
        return {
            donante_id: this.getIdValue(),
            [models.registro_siagro.idAttribute()]: associatedRecordId
        }
    });
    await models.registro_siagro.bulkDisAssociateRegistro_siagroWithDonante_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let donante = await resolvers.readOneDonante({
        donante_id: id
    }, context);
    //check that record actually exists
    if (donante === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(donante.countFilteredRegistro_siagro({}, context));

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
        throw new Error(`donante with donante_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * donantes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    donantes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "donantes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await donante.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * donantesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    donantesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "donantesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await donante.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneDonante - Check user authorization and return one record with the specified donante_id in the donante_id argument.
     *
     * @param  {number} {donante_id}    donante_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with donante_id requested
     */
    readOneDonante: async function({
        donante_id
    }, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneDonante");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await donante.readById(donante_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countDonantes - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countDonantes: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await donante.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableDonante - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableDonante: async function(_, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            return helper.vueTable(context.request, donante, ["id", "NombreDonanteInformante", "GeneroDonanteInformante", "ActividadDonanteInformante", "GrupoEtnicoDonanteInformante", "LenguaDonanteInformante"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addDonante - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addDonante: async function(input, context) {
        let authorization = await checkAuthorization(context, 'donante', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdDonante = await donante.addOne(inputSanitized, benignErrorReporter);
            await createdDonante.handleAssociations(inputSanitized, benignErrorReporter);
            return createdDonante;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddDonanteCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddDonanteCsv: async function(_, context) {
        if (await checkAuthorization(context, 'donante', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return donante.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteDonante - Check user authorization and delete a record with the specified donante_id in the donante_id argument.
     *
     * @param  {number} {donante_id}    donante_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteDonante: async function({
        donante_id
    }, context) {
        if (await checkAuthorization(context, 'donante', 'delete') === true) {
            if (await validForDeletion(donante_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return donante.deleteOne(donante_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateDonante - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateDonante: async function(input, context) {
        let authorization = await checkAuthorization(context, 'donante', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedDonante = await donante.updateOne(inputSanitized, benignErrorReporter);
            await updatedDonante.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedDonante;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateDonante - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateDonante: async function(_, context) {
        if (await checkAuthorization(context, 'donante', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return donante.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}