/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const geneExpression = require(path.join(__dirname, '..', 'models', 'index.js')).geneExpression;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addAssay': 'assay'
}



/**
 * geneExpression.prototype.assay - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
geneExpression.prototype.assay = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.assay_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneAssay({
                [models.assay.idAttribute()]: this.assay_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.assay.idAttribute(),
                "value": this.assay_id,
                "operator": "eq"
            });
            let found = (await resolvers.assaysConnection({
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
geneExpression.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addAssay)) {
        promises_add.push(this.add_assay(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeAssay)) {
        promises_remove.push(this.remove_assay(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_assay - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
geneExpression.prototype.add_assay = async function(input, benignErrorReporter) {
    await geneExpression.add_assay_id(this.getIdValue(), input.addAssay, benignErrorReporter);
    this.assay_id = input.addAssay;
}

/**
 * remove_assay - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
geneExpression.prototype.remove_assay = async function(input, benignErrorReporter) {
    if (input.removeAssay == this.assay_id) {
        await geneExpression.remove_assay_id(this.getIdValue(), input.removeAssay, benignErrorReporter);
        this.assay_id = null;
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

    let geneExpression = await resolvers.readOneGeneExpression({
        gene_id: id
    }, context);
    //check that record actually exists
    if (geneExpression === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(geneExpression.assay({}, context));

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
        throw new Error(`geneExpression with gene_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * geneExpressions - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    geneExpressions: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "geneExpressions");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await geneExpression.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * geneExpressionsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    geneExpressionsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "geneExpressionsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await geneExpression.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneGeneExpression - Check user authorization and return one record with the specified gene_id in the gene_id argument.
     *
     * @param  {number} {gene_id}    gene_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with gene_id requested
     */
    readOneGeneExpression: async function({
        gene_id
    }, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneGeneExpression");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await geneExpression.readById(gene_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countGeneExpressions - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countGeneExpressions: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await geneExpression.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableGeneExpression - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableGeneExpression: async function(_, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            return helper.vueTable(context.request, geneExpression, ["id", "gene_id", "assay_id", "geneCount"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addGeneExpression - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addGeneExpression: async function(input, context) {
        let authorization = await checkAuthorization(context, 'geneExpression', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdGeneExpression = await geneExpression.addOne(inputSanitized, benignErrorReporter);
            await createdGeneExpression.handleAssociations(inputSanitized, benignErrorReporter);
            return createdGeneExpression;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddGeneExpressionCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddGeneExpressionCsv: async function(_, context) {
        if (await checkAuthorization(context, 'geneExpression', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return geneExpression.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteGeneExpression - Check user authorization and delete a record with the specified gene_id in the gene_id argument.
     *
     * @param  {number} {gene_id}    gene_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteGeneExpression: async function({
        gene_id
    }, context) {
        if (await checkAuthorization(context, 'geneExpression', 'delete') === true) {
            if (await validForDeletion(gene_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return geneExpression.deleteOne(gene_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateGeneExpression - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateGeneExpression: async function(input, context) {
        let authorization = await checkAuthorization(context, 'geneExpression', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedGeneExpression = await geneExpression.updateOne(inputSanitized, benignErrorReporter);
            await updatedGeneExpression.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedGeneExpression;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateGeneExpressionWithAssay_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateGeneExpressionWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                gene_id
            }) => gene_id)), geneExpression);
        }
        return await geneExpression.bulkAssociateGeneExpressionWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateGeneExpressionWithAssay_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateGeneExpressionWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                gene_id
            }) => gene_id)), geneExpression);
        }
        return await geneExpression.bulkDisAssociateGeneExpressionWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateGeneExpression - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateGeneExpression: async function(_, context) {
        if (await checkAuthorization(context, 'geneExpression', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return geneExpression.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}