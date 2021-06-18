/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const manejo = require(path.join(__dirname, '..', 'models', 'index.js')).manejo;
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
 * manejo.prototype.registro_siagro - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
manejo.prototype.registro_siagro = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.registro_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneRegistro_siagro({
                [models.registro_siagro.idAttribute()]: this.registro_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.registro_siagro.idAttribute(),
                "value": this.registro_id,
                "operator": "eq"
            });
            let found = (await resolvers.registro_siagrosConnection({
                search: nsearch,
                pagination: {
                    first: 1
                }
            }, context)).edges;
            if (found.length > 0) {
                return found[0].node
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
manejo.prototype.handleAssociations = async function(input, benignErrorReporter) {

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
manejo.prototype.add_registro_siagro = async function(input, benignErrorReporter) {
    await manejo.add_registro_id(this.getIdValue(), input.addRegistro_siagro, benignErrorReporter);
    this.registro_id = input.addRegistro_siagro;
}

/**
 * remove_registro_siagro - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
manejo.prototype.remove_registro_siagro = async function(input, benignErrorReporter) {
    if (input.removeRegistro_siagro == this.registro_id) {
        await manejo.remove_registro_id(this.getIdValue(), input.removeRegistro_siagro, benignErrorReporter);
        this.registro_id = null;
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

    let manejo = await resolvers.readOneManejo({
        manejo_id: id
    }, context);
    //check that record actually exists
    if (manejo === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(manejo.registro_siagro({}, context));

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
        throw new Error(`manejo with manejo_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * manejos - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    manejos: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "manejos");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await manejo.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * manejosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    manejosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "manejosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await manejo.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneManejo - Check user authorization and return one record with the specified manejo_id in the manejo_id argument.
     *
     * @param  {number} {manejo_id}    manejo_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with manejo_id requested
     */
    readOneManejo: async function({
        manejo_id
    }, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneManejo");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await manejo.readById(manejo_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countManejos - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countManejos: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await manejo.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableManejo - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableManejo: async function(_, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            return helper.vueTable(context.request, manejo, ["id", "TipoManejo", "TipoAgroecosistema", "DescripcionAgroecosistema", "SindromeDomesticacion", "TenenciaTierra", "TipoMaterialProduccion", "OrigenMaterial", "DestinoProduccion", "MesSiembra", "MesFloracion", "MesFructificacion", "MesCosecha", "SistemaCultivo", "CultivosAsociados", "UnidadesSuperficieProduccion", "UnidadesRendimiento", "TipoRiego", "CaracteristicaResistenciaTolerancia", "CaracteristicaSusceptible", "registro_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addManejo - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addManejo: async function(input, context) {
        let authorization = await checkAuthorization(context, 'manejo', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdManejo = await manejo.addOne(inputSanitized, benignErrorReporter);
            await createdManejo.handleAssociations(inputSanitized, benignErrorReporter);
            return createdManejo;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddManejoCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddManejoCsv: async function(_, context) {
        if (await checkAuthorization(context, 'manejo', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return manejo.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteManejo - Check user authorization and delete a record with the specified manejo_id in the manejo_id argument.
     *
     * @param  {number} {manejo_id}    manejo_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteManejo: async function({
        manejo_id
    }, context) {
        if (await checkAuthorization(context, 'manejo', 'delete') === true) {
            if (await validForDeletion(manejo_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return manejo.deleteOne(manejo_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateManejo - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateManejo: async function(input, context) {
        let authorization = await checkAuthorization(context, 'manejo', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedManejo = await manejo.updateOne(inputSanitized, benignErrorReporter);
            await updatedManejo.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedManejo;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateManejoWithRegistro_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateManejoWithRegistro_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                registro_id
            }) => registro_id)), models.registro_siagro);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                manejo_id
            }) => manejo_id)), manejo);
        }
        return await manejo.bulkAssociateManejoWithRegistro_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateManejoWithRegistro_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateManejoWithRegistro_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                registro_id
            }) => registro_id)), models.registro_siagro);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                manejo_id
            }) => manejo_id)), manejo);
        }
        return await manejo.bulkDisAssociateManejoWithRegistro_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateManejo - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateManejo: async function(_, context) {
        if (await checkAuthorization(context, 'manejo', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return manejo.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}