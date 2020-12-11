/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const ejemplar = require(path.join(__dirname, '..', 'models', 'index.js')).ejemplar;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addCaracteristicas_cuantitativas': 'caracteristica_cuantitativa',
    'addCaracteristicas_cualitativas': 'caracteristica_cualitativa',
    'addTaxon': 'taxon'
}




/**
 * ejemplar.prototype.caracteristicas_cuantitativasFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ejemplar.prototype.caracteristicas_cuantitativasFilter = function({
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
 * ejemplar.prototype.countFilteredCaracteristicas_cuantitativas - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ejemplar.prototype.countFilteredCaracteristicas_cuantitativas = function({
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
 * ejemplar.prototype.caracteristicas_cuantitativasConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ejemplar.prototype.caracteristicas_cuantitativasConnection = function({
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
 * ejemplar.prototype.caracteristicas_cualitativasFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
ejemplar.prototype.caracteristicas_cualitativasFilter = function({
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

    return resolvers.caracteristica_cualitativas({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ejemplar.prototype.countFilteredCaracteristicas_cualitativas - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
ejemplar.prototype.countFilteredCaracteristicas_cualitativas = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "registro_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countCaracteristica_cualitativas({
        search: nsearch
    }, context);
}

/**
 * ejemplar.prototype.caracteristicas_cualitativasConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
ejemplar.prototype.caracteristicas_cualitativasConnection = function({
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
    return resolvers.caracteristica_cualitativasConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * ejemplar.prototype.Taxon - Return associated record
 *
 * @param  {object} search    Search argument to match the associated record.
 * @param  {object} context   Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}             Associated record.
 */
ejemplar.prototype.Taxon = async function({
    search
}, context) {
    if (await checkAuthorization(context, 'Taxon', 'read') === true) {
        helper.checkCountAndReduceRecordsLimit(1, context, "Taxon");
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        return await this.TaxonImpl({
            search
        }, context, benignErrorReporter);
    } else {
        throw new Error("You don't have authorization to perform this action");
    }
}



/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCaracteristicas_cuantitativas)) {
        promises_add.push(this.add_caracteristicas_cuantitativas(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addCaracteristicas_cualitativas)) {
        promises_add.push(this.add_caracteristicas_cualitativas(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTaxon)) {
        promises_add.push(this.add_taxon(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCaracteristicas_cuantitativas)) {
        promises_remove.push(this.remove_caracteristicas_cuantitativas(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCaracteristicas_cualitativas)) {
        promises_remove.push(this.remove_caracteristicas_cualitativas(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTaxon)) {
        promises_remove.push(this.remove_taxon(input, benignErrorReporter));
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
ejemplar.prototype.add_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_caracteristicas_cualitativas - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.add_caracteristicas_cualitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addCaracteristicas_cualitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cualitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cualitativa.bulkAssociateCaracteristica_cualitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_taxon - field Mutation for generic_to_one associations to add
 *
 * @param {object} input   Object with all the current attributes of the Ejemplar model record to be updated,
 *                         including info of input id to add as association.
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.add_taxon = async function(input, benignErrorReporter) {
    await ejemplar.add_taxonImpl(input, benignErrorReporter);
}

/**
 * remove_caracteristicas_cuantitativas - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.remove_caracteristicas_cuantitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeCaracteristicas_cuantitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cuantitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cuantitativa.bulkDisAssociateCaracteristica_cuantitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_caracteristicas_cualitativas - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.remove_caracteristicas_cualitativas = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeCaracteristicas_cualitativas.map(associatedRecordId => {
        return {
            registro_id: this.getIdValue(),
            [models.caracteristica_cualitativa.idAttribute()]: associatedRecordId
        }
    });
    await models.caracteristica_cualitativa.bulkDisAssociateCaracteristica_cualitativaWithRegistro_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_taxon - field Mutation for generic_to_one associations to remove
 *
 * @param {object} input   Object with all the current attributes of the Ejemplar model record to be updated,
 *                         including info of input id to remove as association.
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
ejemplar.prototype.remove_taxon = async function(input, benignErrorReporter) {
    await ejemplar.remove_taxonImpl(input, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let ejemplar = await resolvers.readOneEjemplar({
        id: id
    }, context);
    //check that record actually exists
    if (ejemplar === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let promises_generic_to_one = [];

    promises_to_many.push(ejemplar.countFilteredCaracteristicas_cuantitativas({}, context));
    promises_to_many.push(ejemplar.countFilteredCaracteristicas_cualitativas({}, context));
    promises_generic_to_one.push(ejemplar.Taxon({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);
    let result_generic_to_one = await Promise.all(promises_generic_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;
    let get_generic_to_one_associated = result_generic_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated + get_generic_to_one_associated;
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
        throw new Error(`Ejemplar with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * ejemplars - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    ejemplars: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "ejemplars");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ejemplar.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * ejemplarsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    ejemplarsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "ejemplarsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ejemplar.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneEjemplar - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneEjemplar: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneEjemplar");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ejemplar.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countEjemplars - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countEjemplars: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await ejemplar.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableEjemplar - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableEjemplar: async function(_, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            return helper.vueTable(context.request, ejemplar, ["id", "id", "region", "localidad", "datum", "validacionambiente", "geovalidacion", "paismapa", "estadomapa", "claveestadomapa", "mt24nombreestadomapa", "mt24claveestadomapa", "municipiomapa", "clavemunicipiomapa", "mt24nombremunicipiomapa", "mt24clavemunicipiomapa", "incertidumbrexy", "altitudmapa", "usvserieI", "usvserieII", "usvserieIII", "usvserieIV", "usvserieV", "usvserieVI", "anp", "grupobio", "subgrupobio", "taxon", "autor", "estatustax", "reftax", "taxonvalido", "autorvalido", "reftaxvalido", "taxonvalidado", "endemismo", "taxonextinto", "ambiente", "nombrecomun", "formadecrecimiento", "prioritaria", "nivelprioridad", "exoticainvasora", "nom059", "cites", "iucn", "categoriaresidenciaaves", "probablelocnodecampo", "obsusoinfo", "coleccion", "institucion", "paiscoleccion", "numcatalogo", "numcolecta", "procedenciaejemplar", "determinador", "aniodeterminacion", "mesdeterminacion", "diadeterminacion", "fechadeterminacion", "calificadordeterminacion", "colector", "aniocolecta", "mescolecta", "diacolecta", "fechacolecta", "tipo", "ejemplarfosil", "proyecto", "fuente", "formadecitar", "licenciauso", "urlproyecto", "urlorigen", "urlejemplar", "ultimafechaactualizacion", "cuarentena", "version", "especie", "especievalida", "especievalidabusqueda"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addEjemplar - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addEjemplar: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Ejemplar', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdEjemplar = await ejemplar.addOne(inputSanitized, benignErrorReporter);
            await createdEjemplar.handleAssociations(inputSanitized, benignErrorReporter);
            return createdEjemplar;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddEjemplarCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddEjemplarCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ejemplar.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteEjemplar - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteEjemplar: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return ejemplar.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateEjemplar - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateEjemplar: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Ejemplar', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedEjemplar = await ejemplar.updateOne(inputSanitized, benignErrorReporter);
            await updatedEjemplar.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedEjemplar;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateEjemplar - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateEjemplar: async function(_, context) {
        if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return ejemplar.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}