/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const taxon = require(path.join(__dirname, '..', 'models', 'index.js')).taxon;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addEjemplares': 'ejemplar'
}






/**
 * taxon.prototype.ejemplaresFilter - Check user authorization and return certain
 * number, specified in pagination argument, of records associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search      Search argument for filtering associated records.
 * @param  {array}  order       Type of sorting (ASC, DESC) for each field.
 * @param  {object} pagination  Offset and limit to get the records from and to respectively.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}              Array of associated records holding conditions specified by search, order and pagination argument.
 */
taxon.prototype.ejemplaresFilter = async function({
    search,
    order,
    pagination
}, context) {
    if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
        helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "ejemplaresFilter");
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        return await this.ejemplaresFilterImpl({
            search,
            order,
            pagination
        }, context, benignErrorReporter);
    } else {
        throw new Error("You don't have authorization to perform this action");
    }
}

/**
 * taxon.prototype.countFilteredEjemplares - Count number of associated records that
 * holds the conditions specified in the search argument.
 *
 * @param  {object} {search}  Search argument for filtering associated records.
 * @param  {object} context   Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}             Number of associated records that holds the conditions specified in the search argument.
 */
taxon.prototype.countFilteredEjemplares = async function({
    search
}, context) {
    if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        return await this.countFilteredEjemplaresImpl({
            search
        }, context, benignErrorReporter);
    } else {
        throw new Error("You don't have authorization to perform this action");
    }
}

/**
 * taxon.prototype.ejemplaresConnection - Check user authorization and return
 * certain number, specified in pagination argument, of records associated with the current instance, this records
 * should also holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search      Search argument for filtering associated records.
 * @param  {array}  order       Type of sorting (ASC, DESC) for each field.
 * @param  {object} pagination  Cursor and first (indicating the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}              Array of records as grapqhql connections holding conditions specified by search, order and pagination argument.
 */
taxon.prototype.ejemplaresConnection = async function({
    search,
    order,
    pagination
}, context) {
    if (await checkAuthorization(context, 'Ejemplar', 'read') === true) {
        helper.checkCursorBasedPaginationArgument(pagination);
        let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
        helper.checkCountAndReduceRecordsLimit(limit, context, "ejemplaresConnection");
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        return await this.ejemplaresConnectionImpl({
            search,
            order,
            pagination
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
taxon.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addEjemplares)) {
        promises_add.push(this.add_ejemplares(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeEjemplares)) {
        promises_remove.push(this.remove_ejemplares(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_ejemplares - field Mutation for generic_to_many associations to add
 *
 * @param {object} input   Object with all the current attributes of the Taxon model record to be updated,
 *                         including info of input ids to add as associations.
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.add_ejemplares = async function(input, benignErrorReporter) {
    await taxon.add_ejemplaresImpl(input, benignErrorReporter);
}

/**
 * remove_ejemplares - field Mutation for generic_to_many associations to remove
 *
 * @param {object} input   Object with all the current attributes of the Taxon model record to be updated,
 *                         including info of input ids to remove as associations.
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.remove_ejemplares = async function(input, benignErrorReporter) {
    await taxon.remove_ejemplaresImpl(input, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let taxon = await resolvers.readOneTaxon({
        id: id
    }, context);
    //check that record actually exists
    if (taxon === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let promises_generic_to_many = [];

    promises_generic_to_many.push(taxon.countFilteredEjemplares({}, context));

    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);
    let result_generic_to_many = await Promise.all(promises_generic_to_many);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;
    let get_generic_to_many_associated = result_generic_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);

    return get_to_one_associated + get_to_many_associated + get_generic_to_many_associated;
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
        throw new Error(`Taxon with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * taxons - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    taxons: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "taxons");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await taxon.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * taxonsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    taxonsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "taxonsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await taxon.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneTaxon - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneTaxon: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneTaxon");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await taxon.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countTaxons - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countTaxons: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await taxon.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableTaxon - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableTaxon: async function(_, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            return helper.vueTable(context.request, taxon, ["id", "id", "taxon", "categoria", "estatus", "nombreAutoridad", "citaNomenclatural", "fuente", "ambiente", "grupoSNIB", "categoriaResidencia", "nom", "cites", "iucn", "prioritarias", "endemismo", "categoriaSorter"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addTaxon - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addTaxon: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Taxon', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdTaxon = await taxon.addOne(inputSanitized, benignErrorReporter);
            await createdTaxon.handleAssociations(inputSanitized, benignErrorReporter);
            return createdTaxon;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddTaxonCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddTaxonCsv: async function(_, context) {
        if (await checkAuthorization(context, 'Taxon', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return taxon.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteTaxon - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteTaxon: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'Taxon', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return taxon.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateTaxon - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateTaxon: async function(input, context) {
        let authorization = await checkAuthorization(context, 'Taxon', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedTaxon = await taxon.updateOne(inputSanitized, benignErrorReporter);
            await updatedTaxon.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedTaxon;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateTaxon - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTaxon: async function(_, context) {
        if (await checkAuthorization(context, 'Taxon', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return taxon.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}