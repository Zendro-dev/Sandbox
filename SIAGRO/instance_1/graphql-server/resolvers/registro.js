/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const registro = require(path.join(__dirname, '..', 'models', 'index.js')).registro;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addInformacion_taxonomica': 'taxon',
    'addCaracteristicas_cuantitativas': 'caracteristica_cuantitativa',
    'addReferencias': 'referencia'
}



/**
 * registro.prototype.informacion_taxonomica - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro.prototype.informacion_taxonomica = async function({
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
                "value": this.taxon_id,
                "operator": "eq"
            });
            let found = await resolvers.taxons({
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
 * registro.prototype.caracteristicas_cuantitativasFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
registro.prototype.caracteristicas_cuantitativasFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "registro_id",
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
 * registro.prototype.countFilteredCaracteristicas_cuantitativas - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
registro.prototype.countFilteredCaracteristicas_cuantitativas = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "registro_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countCaracteristica_cuantitativas({
        search: nsearch
    }, context);
}

/**
 * registro.prototype.caracteristicas_cuantitativasConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
registro.prototype.caracteristicas_cuantitativasConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "registro_id",
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
 * registro.prototype.referenciasFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
registro.prototype.referenciasFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.referencia.idAttribute(),
        "value": this.referencias_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.referencia({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * registro.prototype.countFilteredReferencias - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
registro.prototype.countFilteredReferencias = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.referencia.idAttribute(),
        "value": this.referencias_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countReferencia({
        search: nsearch
    }, context);
}

/**
 * registro.prototype.referenciasConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
registro.prototype.referenciasConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.referencia.idAttribute(),
        "value": this.referencias_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.referenciaConnection({
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
registro.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCaracteristicas_cuantitativas)) {
        promises_add.push(this.add_caracteristicas_cuantitativas(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addReferencias)) {
        promises_add.push(this.add_referencias(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInformacion_taxonomica)) {
        promises_add.push(this.add_informacion_taxonomica(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCaracteristicas_cuantitativas)) {
        promises_remove.push(this.remove_caracteristicas_cuantitativas(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeReferencias)) {
        promises_remove.push(this.remove_referencias(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInformacion_taxonomica)) {
        promises_remove.push(this.remove_informacion_taxonomica(input, benignErrorReporter));
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
registro.prototype.add_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_referencias - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro.prototype.add_referencias = async function(input, benignErrorReporter) {

    await registro.add_referencias_ids(this.getIdValue(), input.addReferencias, benignErrorReporter);
    this.referencias_ids = helper.unionIds(this.referencias_ids, input.addReferencias);
}

/**
 * add_informacion_taxonomica - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro.prototype.add_informacion_taxonomica = async function(input, benignErrorReporter) {
    await registro.add_taxon_id(this.getIdValue(), input.addInformacion_taxonomica, benignErrorReporter);
    this.taxon_id = input.addInformacion_taxonomica;
}

/**
 * remove_caracteristicas_cuantitativas - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro.prototype.remove_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_referencias - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro.prototype.remove_referencias = async function(input, benignErrorReporter) {

    await registro.remove_referencias_ids(this.getIdValue(), input.removeReferencias, benignErrorReporter);
    this.referencias_ids = helper.differenceIds(this.referencias_ids, input.removeReferencias);
}

/**
 * remove_informacion_taxonomica - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro.prototype.remove_informacion_taxonomica = async function(input, benignErrorReporter) {
    if (input.removeInformacion_taxonomica == this.taxon_id) {
        await registro.remove_taxon_id(this.getIdValue(), input.removeInformacion_taxonomica, benignErrorReporter);
        this.taxon_id = null;
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

    let registro = await resolvers.readOneRegistro({
        conabio_id: id
    }, context);
    //check that record actually exists
    if (registro === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(registro.countFilteredCaracteristicas_cuantitativas({}, context));
    promises_to_many.push(registro.countFilteredReferencias({}, context));
    promises_to_one.push(registro.informacion_taxonomica({}, context));

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
        throw new Error(`registro with conabio_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * registros - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    registros: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "registros");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * registrosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    registrosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "registrosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneRegistro - Check user authorization and return one record with the specified conabio_id in the conabio_id argument.
     *
     * @param  {number} {conabio_id}    conabio_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with conabio_id requested
     */
    readOneRegistro: async function({
        conabio_id
    }, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneRegistro");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro.readById(conabio_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countRegistros - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countRegistros: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableRegistro - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableRegistro: async function(_, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            return helper.vueTable(context.request, registro, ["id", "conabio_id", "clave_original", "tipo_alimento", "food_type", "descripcion_alimento", "food_description", "procedencia", "taxon_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addRegistro - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addRegistro: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdRegistro = await registro.addOne(inputSanitized, benignErrorReporter);
            await createdRegistro.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRegistro;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddRegistroCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddRegistroCsv: async function(_, context) {
        if (await checkAuthorization(context, 'registro', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteRegistro - Check user authorization and delete a record with the specified conabio_id in the conabio_id argument.
     *
     * @param  {number} {conabio_id}    conabio_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteRegistro: async function({
        conabio_id
    }, context) {
        if (await checkAuthorization(context, 'registro', 'delete') === true) {
            if (await validForDeletion(conabio_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return registro.deleteOne(conabio_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateRegistro - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateRegistro: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRegistro = await registro.updateOne(inputSanitized, benignErrorReporter);
            await updatedRegistro.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRegistro;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateRegistroWithTaxon_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistroWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                conabio_id
            }) => conabio_id)), registro);
        }
        return await registro.bulkAssociateRegistroWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistroWithTaxon_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistroWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                conabio_id
            }) => conabio_id)), registro);
        }
        return await registro.bulkDisAssociateRegistroWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateRegistro - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateRegistro: async function(_, context) {
        if (await checkAuthorization(context, 'registro', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}