/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const proyecto = require(path.join(__dirname, '..', 'models', 'index.js')).proyecto;
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
 * proyecto.prototype.registro_siagroFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
proyecto.prototype.registro_siagroFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "proyecto_id",
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
 * proyecto.prototype.countFilteredRegistro_siagro - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
proyecto.prototype.countFilteredRegistro_siagro = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "proyecto_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countRegistro_siagros({
        search: nsearch
    }, context);
}

/**
 * proyecto.prototype.registro_siagroConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
proyecto.prototype.registro_siagroConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "proyecto_id",
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
proyecto.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
proyecto.prototype.add_registro_siagro = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addRegistro_siagro.map(associatedRecordId => {
        return {
            proyecto_id: this.getIdValue(),
            [models.registro_siagro.idAttribute()]: associatedRecordId
        }
    });
    await models.registro_siagro.bulkAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_registro_siagro - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
proyecto.prototype.remove_registro_siagro = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeRegistro_siagro.map(associatedRecordId => {
        return {
            proyecto_id: this.getIdValue(),
            [models.registro_siagro.idAttribute()]: associatedRecordId
        }
    });
    await models.registro_siagro.bulkDisAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let proyecto = await resolvers.readOneProyecto({
        proyecto_id: id
    }, context);
    //check that record actually exists
    if (proyecto === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(proyecto.countFilteredRegistro_siagro({}, context));

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
        throw new Error(`proyecto with proyecto_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * proyectos - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    proyectos: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "proyectos");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await proyecto.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * proyectosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    proyectosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "proyectosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await proyecto.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneProyecto - Check user authorization and return one record with the specified proyecto_id in the proyecto_id argument.
     *
     * @param  {number} {proyecto_id}    proyecto_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with proyecto_id requested
     */
    readOneProyecto: async function({
        proyecto_id
    }, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneProyecto");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await proyecto.readById(proyecto_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countProyectos - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countProyectos: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await proyecto.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableProyecto - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableProyecto: async function(_, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            return helper.vueTable(context.request, proyecto, ["id", "proyecto_id", "NombreProyecto", "InstitucionProyecto"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addProyecto - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addProyecto: async function(input, context) {
        let authorization = await checkAuthorization(context, 'proyecto', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdProyecto = await proyecto.addOne(inputSanitized, benignErrorReporter);
            await createdProyecto.handleAssociations(inputSanitized, benignErrorReporter);
            return createdProyecto;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddProyectoCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddProyectoCsv: async function(_, context) {
        if (await checkAuthorization(context, 'proyecto', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return proyecto.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteProyecto - Check user authorization and delete a record with the specified proyecto_id in the proyecto_id argument.
     *
     * @param  {number} {proyecto_id}    proyecto_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteProyecto: async function({
        proyecto_id
    }, context) {
        if (await checkAuthorization(context, 'proyecto', 'delete') === true) {
            if (await validForDeletion(proyecto_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return proyecto.deleteOne(proyecto_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateProyecto - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateProyecto: async function(input, context) {
        let authorization = await checkAuthorization(context, 'proyecto', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedProyecto = await proyecto.updateOne(inputSanitized, benignErrorReporter);
            await updatedProyecto.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedProyecto;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateProyecto - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateProyecto: async function(_, context) {
        if (await checkAuthorization(context, 'proyecto', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return proyecto.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}