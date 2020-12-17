/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const caracteristica_cuantitativa = require(path.join(__dirname, '..', 'models', 'index.js')).caracteristica_cuantitativa;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addRegistro': 'registro',
    'addMetodo': 'metodo'
}



/**
 * caracteristica_cuantitativa.prototype.registro - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
caracteristica_cuantitativa.prototype.registro = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.registro_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneRegistro({
                [models.registro.idAttribute()]: this.registro_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.registro.idAttribute(),
                "value": this.registro_id,
                "operator": "eq"
            });
            let found = await resolvers.registros({
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
 * caracteristica_cuantitativa.prototype.metodo - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
caracteristica_cuantitativa.prototype.metodo = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.metodo_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMetodo({
                [models.metodo.idAttribute()]: this.metodo_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.metodo.idAttribute(),
                "value": this.metodo_id,
                "operator": "eq"
            });
            let found = await resolvers.metodos({
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
caracteristica_cuantitativa.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addRegistro)) {
        promises_add.push(this.add_registro(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMetodo)) {
        promises_add.push(this.add_metodo(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeRegistro)) {
        promises_remove.push(this.remove_registro(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMetodo)) {
        promises_remove.push(this.remove_metodo(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_registro - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
caracteristica_cuantitativa.prototype.add_registro = async function(input, benignErrorReporter) {
    await caracteristica_cuantitativa.add_registro_id(this.getIdValue(), input.addRegistro, benignErrorReporter);
    this.registro_id = input.addRegistro;
}

/**
 * add_metodo - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
caracteristica_cuantitativa.prototype.add_metodo = async function(input, benignErrorReporter) {
    await caracteristica_cuantitativa.add_metodo_id(this.getIdValue(), input.addMetodo, benignErrorReporter);
    this.metodo_id = input.addMetodo;
}

/**
 * remove_registro - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
caracteristica_cuantitativa.prototype.remove_registro = async function(input, benignErrorReporter) {
    if (input.removeRegistro == this.registro_id) {
        await caracteristica_cuantitativa.remove_registro_id(this.getIdValue(), input.removeRegistro, benignErrorReporter);
        this.registro_id = null;
    }
}

/**
 * remove_metodo - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
caracteristica_cuantitativa.prototype.remove_metodo = async function(input, benignErrorReporter) {
    if (input.removeMetodo == this.metodo_id) {
        await caracteristica_cuantitativa.remove_metodo_id(this.getIdValue(), input.removeMetodo, benignErrorReporter);
        this.metodo_id = null;
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

    let caracteristica_cuantitativa = await resolvers.readOneCaracteristica_cuantitativa({
        id: id
    }, context);
    //check that record actually exists
    if (caracteristica_cuantitativa === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(caracteristica_cuantitativa.registro({}, context));
    promises_to_one.push(caracteristica_cuantitativa.metodo({}, context));

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
        throw new Error(`caracteristica_cuantitativa with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * caracteristica_cuantitativas - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    caracteristica_cuantitativas: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "caracteristica_cuantitativas");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await caracteristica_cuantitativa.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * caracteristica_cuantitativasConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    caracteristica_cuantitativasConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "caracteristica_cuantitativasConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await caracteristica_cuantitativa.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCaracteristica_cuantitativa - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneCaracteristica_cuantitativa: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCaracteristica_cuantitativa");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await caracteristica_cuantitativa.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCaracteristica_cuantitativas - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCaracteristica_cuantitativas: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await caracteristica_cuantitativa.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCaracteristica_cuantitativa - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCaracteristica_cuantitativa: async function(_, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            return helper.vueTable(context.request, caracteristica_cuantitativa, ["id", "nombre", "unidad", "nombre_corto", "comentarios", "metodo_id", "registro_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addCaracteristica_cuantitativa - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCaracteristica_cuantitativa: async function(input, context) {
        let authorization = await checkAuthorization(context, 'caracteristica_cuantitativa', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCaracteristica_cuantitativa = await caracteristica_cuantitativa.addOne(inputSanitized, benignErrorReporter);
            await createdCaracteristica_cuantitativa.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCaracteristica_cuantitativa;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCaracteristica_cuantitativaCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCaracteristica_cuantitativaCsv: async function(_, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return caracteristica_cuantitativa.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCaracteristica_cuantitativa - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCaracteristica_cuantitativa: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return caracteristica_cuantitativa.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCaracteristica_cuantitativa - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCaracteristica_cuantitativa: async function(input, context) {
        let authorization = await checkAuthorization(context, 'caracteristica_cuantitativa', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCaracteristica_cuantitativa = await caracteristica_cuantitativa.updateOne(inputSanitized, benignErrorReporter);
            await updatedCaracteristica_cuantitativa.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCaracteristica_cuantitativa;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCaracteristica_cuantitativaWithRegistro_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCaracteristica_cuantitativaWithRegistro_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                registro_id
            }) => registro_id)), models.registro);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), caracteristica_cuantitativa);
        }
        return await caracteristica_cuantitativa.bulkAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCaracteristica_cuantitativaWithMetodo_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCaracteristica_cuantitativaWithMetodo_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                metodo_id
            }) => metodo_id)), models.metodo);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), caracteristica_cuantitativa);
        }
        return await caracteristica_cuantitativa.bulkAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                registro_id
            }) => registro_id)), models.registro);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), caracteristica_cuantitativa);
        }
        return await caracteristica_cuantitativa.bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCaracteristica_cuantitativaWithMetodo_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCaracteristica_cuantitativaWithMetodo_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                metodo_id
            }) => metodo_id)), models.metodo);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), caracteristica_cuantitativa);
        }
        return await caracteristica_cuantitativa.bulkDisAssociateCaracteristica_cuantitativaWithMetodo_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCaracteristica_cuantitativa - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCaracteristica_cuantitativa: async function(_, context) {
        if (await checkAuthorization(context, 'caracteristica_cuantitativa', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return caracteristica_cuantitativa.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}