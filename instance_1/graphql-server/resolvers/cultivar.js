/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const cultivar = require(path.join(__dirname, '..', 'models', 'index.js')).cultivar;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addTaxon': 'taxon',
    'addIndividuals': 'individual'
}



/**
 * cultivar.prototype.taxon - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
cultivar.prototype.taxon = async function({
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
 * cultivar.prototype.individualsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
cultivar.prototype.individualsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "cultivar_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.individuals({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * cultivar.prototype.countFilteredIndividuals - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
cultivar.prototype.countFilteredIndividuals = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "cultivar_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countIndividuals({
        search: nsearch
    }, context);
}

/**
 * cultivar.prototype.individualsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
cultivar.prototype.individualsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "cultivar_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.individualsConnection({
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
cultivar.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addIndividuals)) {
        promises.push(this.add_individuals(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTaxon)) {
        promises.push(this.add_taxon(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeIndividuals)) {
        promises.push(this.remove_individuals(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTaxon)) {
        promises.push(this.remove_taxon(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_individuals - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cultivar.prototype.add_individuals = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addIndividuals.map(associatedRecordId => {
        return {
            cultivar_id: this.getIdValue(),
            [models.individual.idAttribute()]: associatedRecordId
        }
    });
    await models.individual.bulkAssociateIndividualWithCultivar_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_taxon - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cultivar.prototype.add_taxon = async function(input, benignErrorReporter) {
    await cultivar.add_taxon_id(this.getIdValue(), input.addTaxon, benignErrorReporter);
    this.taxon_id = input.addTaxon;
}

/**
 * remove_individuals - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cultivar.prototype.remove_individuals = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeIndividuals.map(associatedRecordId => {
        return {
            cultivar_id: this.getIdValue(),
            [models.individual.idAttribute()]: associatedRecordId
        }
    });
    await models.individual.bulkDisAssociateIndividualWithCultivar_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_taxon - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
cultivar.prototype.remove_taxon = async function(input, benignErrorReporter) {
    if (input.removeTaxon == this.taxon_id) {
        await cultivar.remove_taxon_id(this.getIdValue(), input.removeTaxon, benignErrorReporter);
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

    let cultivar = await resolvers.readOneCultivar({
        id: id
    }, context);
    //check that record actually exists
    if (cultivar === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(cultivar.countFilteredIndividuals({}, context));
    promises_to_one.push(cultivar.taxon({}, context));

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
        throw new Error(`cultivar with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * cultivars - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    cultivars: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "cultivars");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cultivar.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * cultivarsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    cultivarsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "cultivarsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cultivar.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCultivar - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneCultivar: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCultivar");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cultivar.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCultivars - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCultivars: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await cultivar.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCultivar - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCultivar: async function(_, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            return helper.vueTable(context.request, cultivar, ["id", "description", "genotype"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addCultivar - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCultivar: async function(input, context) {
        let authorization = await checkAuthorization(context, 'cultivar', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCultivar = await cultivar.addOne(inputSanitized, benignErrorReporter);
            await createdCultivar.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCultivar;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCultivarCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCultivarCsv: async function(_, context) {
        if (await checkAuthorization(context, 'cultivar', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return cultivar.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCultivar - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCultivar: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'cultivar', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return cultivar.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCultivar - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCultivar: async function(input, context) {
        let authorization = await checkAuthorization(context, 'cultivar', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCultivar = await cultivar.updateOne(inputSanitized, benignErrorReporter);
            await updatedCultivar.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCultivar;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCultivarWithTaxon_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCultivarWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), cultivar);
        }
        return await cultivar.bulkAssociateCultivarWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCultivarWithTaxon_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCultivarWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), cultivar);
        }
        return await cultivar.bulkDisAssociateCultivarWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCultivar - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCultivar: async function(_, context) {
        if (await checkAuthorization(context, 'cultivar', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return cultivar.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}