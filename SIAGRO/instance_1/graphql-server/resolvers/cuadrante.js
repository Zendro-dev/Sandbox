/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const cuadrante = require(path.join(__dirname, '..', 'models', 'index.js')).cuadrante;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addGrupo_enfoque': 'grupo_enfoque',
    'addInformacion_taxonomica': 'taxon',
    'addTipo_planta': 'tipo_planta'
}



/**
 * cuadrante.prototype.grupo_enfoque - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
cuadrante.prototype.grupo_enfoque = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.grupo_enfoque_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneGrupo_enfoque({
                [models.grupo_enfoque.idAttribute()]: this.grupo_enfoque_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.grupo_enfoque.idAttribute(),
                "value": {
                    "value": this.grupo_enfoque_id
                },
                "operator": "eq"
            });
            let found = await resolvers.grupo_enfoques({
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
 * cuadrante.prototype.informacion_taxonomica - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
cuadrante.prototype.informacion_taxonomica = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.taxon_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneTaxon({
                [models.taxon.idAttribute()]: this.taxon_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.taxon.idAttribute(),
                "value": {
                    "value": this.taxon_id
                },
                "operator": "eq"
            });
            let found = await resolvers.taxons({
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
 * cuadrante.prototype.tipo_planta - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
cuadrante.prototype.tipo_planta = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.tipo_planta_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneTipo_planta({
                [models.tipo_planta.idAttribute()]: this.tipo_planta_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.tipo_planta.idAttribute(),
                "value": {
                    "value": this.tipo_planta_id
                },
                "operator": "eq"
            });
            let found = await resolvers.tipo_planta({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addGrupo_enfoque)) {
        promises.push(this.add_grupo_enfoque(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInformacion_taxonomica)) {
        promises.push(this.add_informacion_taxonomica(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTipo_planta)) {
        promises.push(this.add_tipo_planta(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeGrupo_enfoque)) {
        promises.push(this.remove_grupo_enfoque(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInformacion_taxonomica)) {
        promises.push(this.remove_informacion_taxonomica(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTipo_planta)) {
        promises.push(this.remove_tipo_planta(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_grupo_enfoque - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.add_grupo_enfoque = async function(input, benignErrorReporter) {
    await cuadrante.add_grupo_enfoque_id(this.getIdValue(), input.addGrupo_enfoque, benignErrorReporter);
    this.grupo_enfoque_id = input.addGrupo_enfoque;
}

/**
 * add_informacion_taxonomica - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.add_informacion_taxonomica = async function(input, benignErrorReporter) {
    await cuadrante.add_taxon_id(this.getIdValue(), input.addInformacion_taxonomica, benignErrorReporter);
    this.taxon_id = input.addInformacion_taxonomica;
}

/**
 * add_tipo_planta - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.add_tipo_planta = async function(input, benignErrorReporter) {
    await cuadrante.add_tipo_planta_id(this.getIdValue(), input.addTipo_planta, benignErrorReporter);
    this.tipo_planta_id = input.addTipo_planta;
}

/**
 * remove_grupo_enfoque - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.remove_grupo_enfoque = async function(input, benignErrorReporter) {
    if (input.removeGrupo_enfoque == this.grupo_enfoque_id) {
        await cuadrante.remove_grupo_enfoque_id(this.getIdValue(), input.removeGrupo_enfoque, benignErrorReporter);
        this.grupo_enfoque_id = null;
    }
}

/**
 * remove_informacion_taxonomica - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.remove_informacion_taxonomica = async function(input, benignErrorReporter) {
    if (input.removeInformacion_taxonomica == this.taxon_id) {
        await cuadrante.remove_taxon_id(this.getIdValue(), input.removeInformacion_taxonomica, benignErrorReporter);
        this.taxon_id = null;
    }
}

/**
 * remove_tipo_planta - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cuadrante.prototype.remove_tipo_planta = async function(input, benignErrorReporter) {
    if (input.removeTipo_planta == this.tipo_planta_id) {
        await cuadrante.remove_tipo_planta_id(this.getIdValue(), input.removeTipo_planta, benignErrorReporter);
        this.tipo_planta_id = null;
    }
}




/**
 * checkCountAndReduceRecordsLimit({search, pagination}, context, resolverName, modelName) - Make sure that the current
 * set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} {search}  Search argument for filtering records
 * @param {object} {pagination}  If limit-offset pagination, this object will include 'offset' and 'limit' properties
 * to get the records from and to respectively. If cursor-based pagination, this object will include 'first' or 'last'
 * properties to indicate the number of records to fetch, and 'after' or 'before' cursors to indicate from which record
 * to start fetching.
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit({
    search,
    pagination
}, context, resolverName, modelName = 'cuadrante') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["cuadrante_id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "cuadrante_id", inputPaginationValues);
    //get records count
    let count = (await models[modelName].countRecords(paginationValues.search));
    //get effective records count
    let effectiveCount = helper.getEffectiveRecordsCount(count, paginationValues.limit, paginationValues.offset);
    //do check and reduce of record limit.
    helper.checkCountAndReduceRecordLimitHelper(effectiveCount, context, resolverName);
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneCuadrante")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let cuadrante = await resolvers.readOneCuadrante({
        cuadrante_id: id
    }, context);
    //check that record actually exists
    if (cuadrante === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(cuadrante.grupo_enfoque({}, context));
    promises_to_one.push(cuadrante.informacion_taxonomica({}, context));
    promises_to_one.push(cuadrante.tipo_planta({}, context));

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
        throw new Error(`cuadrante with cuadrante_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * cuadrantes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    cuadrantes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "cuadrantes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cuadrante.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * cuadrantesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    cuadrantesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "cuadrantesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cuadrante.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCuadrante - Check user authorization and return one record with the specified cuadrante_id in the cuadrante_id argument.
     *
     * @param  {number} {cuadrante_id}    cuadrante_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with cuadrante_id requested
     */
    readOneCuadrante: async function({
        cuadrante_id
    }, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cuadrante.readById(cuadrante_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCuadrantes - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCuadrantes: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cuadrante.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCuadrante - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCuadrante: async function(_, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            return helper.vueTable(context.request, cuadrante, ["id", "cuadrante_id", "produccion_etiqueta", "autoconsumo_etiqueta", "compra_etiqueta", "venta_etiqueta", "nombre_comun_grupo_enfoque", "grupo_enfoque_id", "taxon_id", "tipo_planta_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addCuadrante - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCuadrante: async function(input, context) {
        let authorization = await checkAuthorization(context, 'cuadrante', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCuadrante = await cuadrante.addOne(inputSanitized, benignErrorReporter);
            await createdCuadrante.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCuadrante;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCuadranteCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCuadranteCsv: async function(_, context) {
        if (await checkAuthorization(context, 'cuadrante', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return cuadrante.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCuadrante - Check user authorization and delete a record with the specified cuadrante_id in the cuadrante_id argument.
     *
     * @param  {number} {cuadrante_id}    cuadrante_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCuadrante: async function({
        cuadrante_id
    }, context) {
        if (await checkAuthorization(context, 'cuadrante', 'delete') === true) {
            if (await validForDeletion(cuadrante_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return cuadrante.deleteOne(cuadrante_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCuadrante - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCuadrante: async function(input, context) {
        let authorization = await checkAuthorization(context, 'cuadrante', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCuadrante = await cuadrante.updateOne(inputSanitized, benignErrorReporter);
            await updatedCuadrante.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCuadrante;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCuadranteWithGrupo_enfoque_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCuadranteWithGrupo_enfoque_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                grupo_enfoque_id
            }) => grupo_enfoque_id)), models.grupo_enfoque);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkAssociateCuadranteWithGrupo_enfoque_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCuadranteWithTaxon_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCuadranteWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkAssociateCuadranteWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateCuadranteWithTipo_planta_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCuadranteWithTipo_planta_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                tipo_planta_id
            }) => tipo_planta_id)), models.tipo_planta);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkAssociateCuadranteWithTipo_planta_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCuadranteWithGrupo_enfoque_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCuadranteWithGrupo_enfoque_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                grupo_enfoque_id
            }) => grupo_enfoque_id)), models.grupo_enfoque);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkDisAssociateCuadranteWithGrupo_enfoque_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCuadranteWithTaxon_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCuadranteWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkDisAssociateCuadranteWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCuadranteWithTipo_planta_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCuadranteWithTipo_planta_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                tipo_planta_id
            }) => tipo_planta_id)), models.tipo_planta);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cuadrante_id
            }) => cuadrante_id)), cuadrante);
        }
        return await cuadrante.bulkDisAssociateCuadranteWithTipo_planta_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCuadrante - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCuadrante: async function(_, context) {
        if (await checkAuthorization(context, 'cuadrante', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return cuadrante.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}