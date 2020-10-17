/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const microbiome_asv = require(path.join(__dirname, '..', 'models', 'index.js')).microbiome_asv;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addSample': 'sample',
    'addTaxon': 'taxon'
}



/**
 * microbiome_asv.prototype.sample - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
microbiome_asv.prototype.sample = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sample_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSample({
                [models.sample.idAttribute()]: this.sample_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sample.idAttribute(),
                "value": this.sample_id,
                "operator": "eq"
            });
            let found = await resolvers.samples({
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
 * microbiome_asv.prototype.taxon - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
microbiome_asv.prototype.taxon = async function({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
microbiome_asv.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addSample)) {
        promises.push(this.add_sample(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTaxon)) {
        promises.push(this.add_taxon(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeSample)) {
        promises.push(this.remove_sample(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTaxon)) {
        promises.push(this.remove_taxon(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_sample - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
microbiome_asv.prototype.add_sample = async function(input, benignErrorReporter) {
    await microbiome_asv.add_sample_id(this.getIdValue(), input.addSample, benignErrorReporter);
    this.sample_id = input.addSample;
}

/**
 * add_taxon - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
microbiome_asv.prototype.add_taxon = async function(input, benignErrorReporter) {
    await microbiome_asv.add_taxon_id(this.getIdValue(), input.addTaxon, benignErrorReporter);
    this.taxon_id = input.addTaxon;
}

/**
 * remove_sample - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
microbiome_asv.prototype.remove_sample = async function(input, benignErrorReporter) {
    if (input.removeSample == this.sample_id) {
        await microbiome_asv.remove_sample_id(this.getIdValue(), input.removeSample, benignErrorReporter);
        this.sample_id = null;
    }
}

/**
 * remove_taxon - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
microbiome_asv.prototype.remove_taxon = async function(input, benignErrorReporter) {
    if (input.removeTaxon == this.taxon_id) {
        await microbiome_asv.remove_taxon_id(this.getIdValue(), input.removeTaxon, benignErrorReporter);
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

    let microbiome_asv = await resolvers.readOneMicrobiome_asv({
        id: id
    }, context);
    //check that record actually exists
    if (microbiome_asv === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(microbiome_asv.sample({}, context));
    promises_to_one.push(microbiome_asv.taxon({}, context));

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
        throw new Error(`microbiome_asv with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * microbiome_asvs - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    microbiome_asvs: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "microbiome_asvs");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await microbiome_asv.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * microbiome_asvsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    microbiome_asvsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "microbiome_asvsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await microbiome_asv.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMicrobiome_asv - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMicrobiome_asv: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneMicrobiome_asv");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await microbiome_asv.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMicrobiome_asvs - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMicrobiome_asvs: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await microbiome_asv.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableMicrobiome_asv - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMicrobiome_asv: async function(_, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            return helper.vueTable(context.request, microbiome_asv, ["id", "asv_id", "compartment", "primer_kingdom", "reference_gene", "reference_sequence"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addMicrobiome_asv - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMicrobiome_asv: async function(input, context) {
        let authorization = await checkAuthorization(context, 'microbiome_asv', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMicrobiome_asv = await microbiome_asv.addOne(inputSanitized, benignErrorReporter);
            await createdMicrobiome_asv.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMicrobiome_asv;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMicrobiome_asvCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMicrobiome_asvCsv: async function(_, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return microbiome_asv.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMicrobiome_asv - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMicrobiome_asv: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return microbiome_asv.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMicrobiome_asv - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMicrobiome_asv: async function(input, context) {
        let authorization = await checkAuthorization(context, 'microbiome_asv', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMicrobiome_asv = await microbiome_asv.updateOne(inputSanitized, benignErrorReporter);
            await updatedMicrobiome_asv.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMicrobiome_asv;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateMicrobiome_asvWithSample_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMicrobiome_asvWithSample_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_id
            }) => sample_id)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), microbiome_asv);
        }
        return await microbiome_asv.bulkAssociateMicrobiome_asvWithSample_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateMicrobiome_asvWithTaxon_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateMicrobiome_asvWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), microbiome_asv);
        }
        return await microbiome_asv.bulkAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMicrobiome_asvWithSample_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMicrobiome_asvWithSample_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_id
            }) => sample_id)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), microbiome_asv);
        }
        return await microbiome_asv.bulkDisAssociateMicrobiome_asvWithSample_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateMicrobiome_asvWithTaxon_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateMicrobiome_asvWithTaxon_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                taxon_id
            }) => taxon_id)), models.taxon);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), microbiome_asv);
        }
        return await microbiome_asv.bulkDisAssociateMicrobiome_asvWithTaxon_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateMicrobiome_asv - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMicrobiome_asv: async function(_, context) {
        if (await checkAuthorization(context, 'microbiome_asv', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return microbiome_asv.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}