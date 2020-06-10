/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const grupo_enfoque = require(path.join(__dirname, '..', 'models_index.js')).grupo_enfoque;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models_index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addSitio': 'sitio',
    'addCuadrantes': 'cuadrante'
}



/**
 * grupo_enfoque.prototype.sitio - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
grupo_enfoque.prototype.sitio = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sitio_id)) {
        if (search === undefined) {
            return resolvers.readOneSitio({
                [models.sitio.idAttribute()]: this.sitio_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sitio.idAttribute(),
                "value": {
                    "value": this.sitio_id
                },
                "operator": "eq"
            });
            let found = await resolvers.sitios({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}

/**
 * grupo_enfoque.prototype.cuadrantesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
grupo_enfoque.prototype.cuadrantesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "grupo_enfoque_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.cuadrantes({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * grupo_enfoque.prototype.countFilteredCuadrantes - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
grupo_enfoque.prototype.countFilteredCuadrantes = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "grupo_enfoque_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.countCuadrantes({
        search: nsearch
    }, context);
}

/**
 * grupo_enfoque.prototype.cuadrantesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
grupo_enfoque.prototype.cuadrantesConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "grupo_enfoque_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.cuadrantesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
grupo_enfoque.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addCuadrantes)) {
        promises.push(this.add_cuadrantes(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addSitio)) {
        promises.push(this.add_sitio(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCuadrantes)) {
        promises.push(this.remove_cuadrantes(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeSitio)) {
        promises.push(this.remove_sitio(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_cuadrantes - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
grupo_enfoque.prototype.add_cuadrantes = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addCuadrantes) {
        results.push(models.cuadrante.add_grupo_enfoque_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * add_sitio - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
grupo_enfoque.prototype.add_sitio = async function(input, benignErrorReporter) {
    await grupo_enfoque.add_sitio_id(this.getIdValue(), input.addSitio, benignErrorReporter);
    this.sitio_id = input.addSitio;
}

/**
 * remove_cuadrantes - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
grupo_enfoque.prototype.remove_cuadrantes = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeCuadrantes) {
        results.push(models.cuadrante.remove_grupo_enfoque_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * remove_sitio - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
grupo_enfoque.prototype.remove_sitio = async function(input, benignErrorReporter) {
    if (input.removeSitio == this.sitio_id) {
        await grupo_enfoque.remove_sitio_id(this.getIdValue(), input.removeSitio, benignErrorReporter);
        this.sitio_id = null;
    }
}



/**
 * errorMessageForRecordsLimit(query) - returns error message in case the record limit is exceeded.
 *
 * @param {string} query The query that failed
 */
function errorMessageForRecordsLimit(query) {
    return "Max record limit of " + globals.LIMIT_RECORDS + " exceeded in " + query;
}

/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCountAndReduceRecordsLimit(search, context, query) {
    let count = (await grupo_enfoque.countRecords(search));
    if (count > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= count;
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneGrupo_enfoque"));
    }
    context.recordsLimit -= 1;
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let grupo_enfoque = await resolvers.readOneGrupo_enfoque({
        grupo_id: id
    }, context);
    //check that record actually exists
    if (grupo_enfoque === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(grupo_enfoque.countFilteredCuadrantes({}, context));
    promises_to_one.push(grupo_enfoque.sitio({}, context));

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
        throw new Error(`grupo_enfoque with grupo_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * grupo_enfoques - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    grupo_enfoques: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "grupo_enfoques");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await grupo_enfoque.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * grupo_enfoquesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    grupo_enfoquesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "grupo_enfoquesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await grupo_enfoque.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneGrupo_enfoque - Check user authorization and return one record with the specified grupo_id in the grupo_id argument.
     *
     * @param  {number} {grupo_id}    grupo_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with grupo_id requested
     */
    readOneGrupo_enfoque: async function({
        grupo_id
    }, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await grupo_enfoque.readById(grupo_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countGrupo_enfoques - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countGrupo_enfoques: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await grupo_enfoque.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableGrupo_enfoque - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableGrupo_enfoque: async function(_, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            return helper.vueTable(context.request, grupo_enfoque, ["id", "grupo_id", "tipo_grupo", "lista_especies", "foto_produccion", "foto_autoconsumo", "foto_venta", "foto_compra", "observaciones", "justificacion_produccion_cuadrante1", "justificacion_produccion_cuadrante2", "justificacion_produccion_cuadrante3", "justificacion_produccion_cuadrante4", "sitio_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addGrupo_enfoque - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addGrupo_enfoque: async function(input, context) {
        let authorization = await checkAuthorization(context, 'grupo_enfoque', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdGrupo_enfoque = await grupo_enfoque.addOne(inputSanitized, benignErrorReporter);
            await createdGrupo_enfoque.handleAssociations(inputSanitized, context);
            return createdGrupo_enfoque;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddGrupo_enfoqueCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddGrupo_enfoqueCsv: async function(_, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return grupo_enfoque.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteGrupo_enfoque - Check user authorization and delete a record with the specified grupo_id in the grupo_id argument.
     *
     * @param  {number} {grupo_id}    grupo_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteGrupo_enfoque: async function({
        grupo_id
    }, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'delete') === true) {
            if (await validForDeletion(grupo_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return grupo_enfoque.deleteOne(grupo_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateGrupo_enfoque - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateGrupo_enfoque: async function(input, context) {
        let authorization = await checkAuthorization(context, 'grupo_enfoque', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedGrupo_enfoque = await grupo_enfoque.updateOne(inputSanitized, benignErrorReporter);
            await updatedGrupo_enfoque.handleAssociations(inputSanitized, context);
            return updatedGrupo_enfoque;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateGrupo_enfoque - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateGrupo_enfoque: async function(_, context) {
        if (await checkAuthorization(context, 'grupo_enfoque', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return grupo_enfoque.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}