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
    'addParent': 'taxon',
    'addMicrobiome_asvs': 'microbiome_asv',
    'addCultivars': 'cultivar'
}



/**
 * taxon.prototype.parent - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
taxon.prototype.parent = async function({
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
 * taxon.prototype.microbiome_asvsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
taxon.prototype.microbiome_asvsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.microbiome_asvs({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * taxon.prototype.countFilteredMicrobiome_asvs - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
taxon.prototype.countFilteredMicrobiome_asvs = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countMicrobiome_asvs({
        search: nsearch
    }, context);
}

/**
 * taxon.prototype.microbiome_asvsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
taxon.prototype.microbiome_asvsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.microbiome_asvsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * taxon.prototype.cultivarsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
taxon.prototype.cultivarsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.cultivars({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * taxon.prototype.countFilteredCultivars - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
taxon.prototype.countFilteredCultivars = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countCultivars({
        search: nsearch
    }, context);
}

/**
 * taxon.prototype.cultivarsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
taxon.prototype.cultivarsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "taxon_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.cultivarsConnection({
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
taxon.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addMicrobiome_asvs)) {
        promises.push(this.add_microbiome_asvs(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addCultivars)) {
        promises.push(this.add_cultivars(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addParent)) {
        promises.push(this.add_parent(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMicrobiome_asvs)) {
        promises.push(this.remove_microbiome_asvs(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCultivars)) {
        promises.push(this.remove_cultivars(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeParent)) {
        promises.push(this.remove_parent(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_microbiome_asvs - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.add_microbiome_asvs = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addMicrobiome_asvs.map(associatedRecordId => {
        return {
            taxon_id: this.getIdValue(),
            [models.microbiome_asv.idAttribute()]: associatedRecordId
        }
    });
    await models.microbiome_asv.bulkAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_cultivars - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.add_cultivars = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addCultivars.map(associatedRecordId => {
        return {
            taxon_id: this.getIdValue(),
            [models.cultivar.idAttribute()]: associatedRecordId
        }
    });
    await models.cultivar.bulkAssociateCultivarWithTaxon_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_parent - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.add_parent = async function(input, benignErrorReporter) {
    await taxon.add_taxon_id(this.getIdValue(), input.addParent, benignErrorReporter);
    this.taxon_id = input.addParent;
}

/**
 * remove_microbiome_asvs - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.remove_microbiome_asvs = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeMicrobiome_asvs.map(associatedRecordId => {
        return {
            taxon_id: this.getIdValue(),
            [models.microbiome_asv.idAttribute()]: associatedRecordId
        }
    });
    await models.microbiome_asv.bulkDisAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_cultivars - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.remove_cultivars = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeCultivars.map(associatedRecordId => {
        return {
            taxon_id: this.getIdValue(),
            [models.cultivar.idAttribute()]: associatedRecordId
        }
    });
    await models.cultivar.bulkDisAssociateCultivarWithTaxon_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_parent - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
taxon.prototype.remove_parent = async function(input, benignErrorReporter) {
    if (input.removeParent == this.taxon_id) {
        await taxon.remove_taxon_id(this.getIdValue(), input.removeParent, benignErrorReporter);
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

    let taxon = await resolvers.readOneTaxon({
        id: id
    }, context);
    //check that record actually exists
    if (taxon === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(taxon.countFilteredMicrobiome_asvs({}, context));
    promises_to_many.push(taxon.countFilteredCultivars({}, context));
    promises_to_one.push(taxon.parent({}, context));

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
        throw new Error(`taxon with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
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
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
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
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
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
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
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
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
            return helper.vueTable(context.request, taxon, ["id", "name", "taxonomic_level"]);
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
        let authorization = await checkAuthorization(context, 'taxon', 'create');
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
        if (await checkAuthorization(context, 'taxon', 'create') === true) {
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
        if (await checkAuthorization(context, 'taxon', 'delete') === true) {
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
        let authorization = await checkAuthorization(context, 'taxon', 'update');
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
     * bulkAssociateTaxonWithTaxon_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateTaxonWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), taxon);
        }
        return await taxon.bulkAssociateTaxonWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateTaxonWithTaxon_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateTaxonWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), taxon);
        }
        return await taxon.bulkDisAssociateTaxonWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateTaxon - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateTaxon: async function(_, context) {
        if (await checkAuthorization(context, 'taxon', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return taxon.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}