/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const registro_siagro = require(path.join(__dirname, '..', 'models', 'index.js')).registro_siagro;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addProyecto': 'proyecto',
    'addManejo': 'manejo',
    'addSitio': 'sitio',
    'addTaxon': 'taxon',
    'addDonante': 'donante',
    'addDeterminacion': 'determinacion',
    'addRegistro_snib': 'registro_snib'
}



/**
 * registro_siagro.prototype.proyecto - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.proyecto = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.proyecto_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProyecto({
                [models.proyecto.idAttribute()]: this.proyecto_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.proyecto.idAttribute(),
                "value": this.proyecto_id,
                "operator": "eq"
            });
            let found = (await resolvers.proyectosConnection({
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
 * registro_siagro.prototype.manejo - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.manejo = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "registro_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.manejosConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;
    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 manejos matching registro_siagro with siagro_id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the registro_siagro model. Returning first manejo.`
            ));
        }
        return found[0].node;
    }
    return null;
}
/**
 * registro_siagro.prototype.sitio - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.sitio = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.snib_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSitio({
                [models.sitio.idAttribute()]: this.snib_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sitio.idAttribute(),
                "value": this.snib_id,
                "operator": "eq"
            });
            let found = (await resolvers.sitiosConnection({
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
 * registro_siagro.prototype.taxon - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.taxon = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.snib_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneTaxon({
                [models.taxon.idAttribute()]: this.snib_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.taxon.idAttribute(),
                "value": this.snib_id,
                "operator": "eq"
            });
            let found = (await resolvers.taxonsConnection({
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
 * registro_siagro.prototype.donante - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.donante = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.donante_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneDonante({
                [models.donante.idAttribute()]: this.donante_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.donante.idAttribute(),
                "value": this.donante_id,
                "operator": "eq"
            });
            let found = (await resolvers.donantesConnection({
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
 * registro_siagro.prototype.determinacion - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.determinacion = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.snib_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneDeterminacion({
                [models.determinacion.idAttribute()]: this.snib_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.determinacion.idAttribute(),
                "value": this.snib_id,
                "operator": "eq"
            });
            let found = (await resolvers.determinacionsConnection({
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
 * registro_siagro.prototype.registro_snib - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
registro_siagro.prototype.registro_snib = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.snib_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneRegistro_snib({
                [models.registro_snib.idAttribute()]: this.snib_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.registro_snib.idAttribute(),
                "value": this.snib_id,
                "operator": "eq"
            });
            let found = (await resolvers.registro_snibsConnection({
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
registro_siagro.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addProyecto)) {
        promises_add.push(this.add_proyecto(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addManejo)) {
        promises_add.push(this.add_manejo(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addSitio)) {
        promises_add.push(this.add_sitio(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTaxon)) {
        promises_add.push(this.add_taxon(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addDonante)) {
        promises_add.push(this.add_donante(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addDeterminacion)) {
        promises_add.push(this.add_determinacion(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addRegistro_snib)) {
        promises_add.push(this.add_registro_snib(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeProyecto)) {
        promises_remove.push(this.remove_proyecto(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeManejo)) {
        promises_remove.push(this.remove_manejo(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeSitio)) {
        promises_remove.push(this.remove_sitio(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTaxon)) {
        promises_remove.push(this.remove_taxon(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeDonante)) {
        promises_remove.push(this.remove_donante(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeDeterminacion)) {
        promises_remove.push(this.remove_determinacion(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeRegistro_snib)) {
        promises_remove.push(this.remove_registro_snib(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_proyecto - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_proyecto = async function(input, benignErrorReporter) {
    await registro_siagro.add_proyecto_id(this.getIdValue(), input.addProyecto, benignErrorReporter);
    this.proyecto_id = input.addProyecto;
}

/**
 * add_manejo - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_manejo = async function(input, benignErrorReporter) {
    await models.manejo.add_registro_id(input.addManejo, this.getIdValue(), benignErrorReporter);
}

/**
 * add_sitio - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_sitio = async function(input, benignErrorReporter) {
    await registro_siagro.add_snib_id(this.getIdValue(), input.addSitio, benignErrorReporter);
    this.snib_id = input.addSitio;
}

/**
 * add_taxon - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_taxon = async function(input, benignErrorReporter) {
    await registro_siagro.add_snib_id(this.getIdValue(), input.addTaxon, benignErrorReporter);
    this.snib_id = input.addTaxon;
}

/**
 * add_donante - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_donante = async function(input, benignErrorReporter) {
    await registro_siagro.add_donante_id(this.getIdValue(), input.addDonante, benignErrorReporter);
    this.donante_id = input.addDonante;
}

/**
 * add_determinacion - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_determinacion = async function(input, benignErrorReporter) {
    await registro_siagro.add_snib_id(this.getIdValue(), input.addDeterminacion, benignErrorReporter);
    this.snib_id = input.addDeterminacion;
}

/**
 * add_registro_snib - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.add_registro_snib = async function(input, benignErrorReporter) {
    await registro_siagro.add_snib_id(this.getIdValue(), input.addRegistro_snib, benignErrorReporter);
    this.snib_id = input.addRegistro_snib;
}

/**
 * remove_proyecto - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_proyecto = async function(input, benignErrorReporter) {
    if (input.removeProyecto == this.proyecto_id) {
        await registro_siagro.remove_proyecto_id(this.getIdValue(), input.removeProyecto, benignErrorReporter);
        this.proyecto_id = null;
    }
}

/**
 * remove_manejo - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_manejo = async function(input, benignErrorReporter) {
    await models.manejo.remove_registro_id(input.removeManejo, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_sitio - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_sitio = async function(input, benignErrorReporter) {
    if (input.removeSitio == this.snib_id) {
        await registro_siagro.remove_snib_id(this.getIdValue(), input.removeSitio, benignErrorReporter);
        this.snib_id = null;
    }
}

/**
 * remove_taxon - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_taxon = async function(input, benignErrorReporter) {
    if (input.removeTaxon == this.snib_id) {
        await registro_siagro.remove_snib_id(this.getIdValue(), input.removeTaxon, benignErrorReporter);
        this.snib_id = null;
    }
}

/**
 * remove_donante - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_donante = async function(input, benignErrorReporter) {
    if (input.removeDonante == this.donante_id) {
        await registro_siagro.remove_donante_id(this.getIdValue(), input.removeDonante, benignErrorReporter);
        this.donante_id = null;
    }
}

/**
 * remove_determinacion - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_determinacion = async function(input, benignErrorReporter) {
    if (input.removeDeterminacion == this.snib_id) {
        await registro_siagro.remove_snib_id(this.getIdValue(), input.removeDeterminacion, benignErrorReporter);
        this.snib_id = null;
    }
}

/**
 * remove_registro_snib - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
registro_siagro.prototype.remove_registro_snib = async function(input, benignErrorReporter) {
    if (input.removeRegistro_snib == this.snib_id) {
        await registro_siagro.remove_snib_id(this.getIdValue(), input.removeRegistro_snib, benignErrorReporter);
        this.snib_id = null;
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

    let registro_siagro = await resolvers.readOneRegistro_siagro({
        siagro_id: id
    }, context);
    //check that record actually exists
    if (registro_siagro === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(registro_siagro.proyecto({}, context));
    promises_to_one.push(registro_siagro.manejo({}, context));
    promises_to_one.push(registro_siagro.sitio({}, context));
    promises_to_one.push(registro_siagro.taxon({}, context));
    promises_to_one.push(registro_siagro.donante({}, context));
    promises_to_one.push(registro_siagro.determinacion({}, context));
    promises_to_one.push(registro_siagro.registro_snib({}, context));

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
        throw new Error(`registro_siagro with siagro_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * registro_siagros - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    registro_siagros: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "registro_siagros");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_siagro.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * registro_siagrosConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    registro_siagrosConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "registro_siagrosConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_siagro.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneRegistro_siagro - Check user authorization and return one record with the specified siagro_id in the siagro_id argument.
     *
     * @param  {number} {siagro_id}    siagro_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with siagro_id requested
     */
    readOneRegistro_siagro: async function({
        siagro_id
    }, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneRegistro_siagro");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_siagro.readById(siagro_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countRegistro_siagros - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countRegistro_siagros: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await registro_siagro.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableRegistro_siagro - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableRegistro_siagro: async function(_, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            return helper.vueTable(context.request, registro_siagro, ["id", "siagro_id", "TipoPreparacion", "FuenteColectaObservacion", "Habitat", "EstatusEcologico", "PlantaManejada", "MaterialColectado", "FormaVida", "FormaCrecimiento", "Sexo", "Fenologia", "Abundancia", "OtrasObservacionesEjemplar", "Uso", "ParteUtilizada", "LenguaNombreComun", "NombreComun", "InstitucionRespaldaObservacion", "TipoVegetacion", "AutorizacionInformacion", "proyecto_id", "snib_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addRegistro_siagro - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addRegistro_siagro: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro_siagro', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdRegistro_siagro = await registro_siagro.addOne(inputSanitized, benignErrorReporter);
            await createdRegistro_siagro.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRegistro_siagro;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddRegistro_siagroCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddRegistro_siagroCsv: async function(_, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro_siagro.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteRegistro_siagro - Check user authorization and delete a record with the specified siagro_id in the siagro_id argument.
     *
     * @param  {number} {siagro_id}    siagro_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteRegistro_siagro: async function({
        siagro_id
    }, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'delete') === true) {
            if (await validForDeletion(siagro_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return registro_siagro.deleteOne(siagro_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateRegistro_siagro - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateRegistro_siagro: async function(input, context) {
        let authorization = await checkAuthorization(context, 'registro_siagro', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRegistro_siagro = await registro_siagro.updateOne(inputSanitized, benignErrorReporter);
            await updatedRegistro_siagro.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRegistro_siagro;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateRegistro_siagroWithProyecto_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithProyecto_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                proyecto_id
            }) => proyecto_id)), models.proyecto);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.sitio);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateRegistro_siagroWithDonante_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithDonante_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                donante_id
            }) => donante_id)), models.donante);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithDonante_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.determinacion);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.registro_snib);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithProyecto_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithProyecto_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                proyecto_id
            }) => proyecto_id)), models.proyecto);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.sitio);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithDonante_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithDonante_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                donante_id
            }) => donante_id)), models.donante);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithDonante_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.determinacion);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateRegistro_siagroWithSnib_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                snib_id
            }) => snib_id)), models.registro_snib);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                siagro_id
            }) => siagro_id)), registro_siagro);
        }
        return await registro_siagro.bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateRegistro_siagro - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateRegistro_siagro: async function(_, context) {
        if (await checkAuthorization(context, 'registro_siagro', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return registro_siagro.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}