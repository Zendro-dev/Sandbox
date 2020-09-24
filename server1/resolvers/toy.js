/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const toy = require(path.join(__dirname, '..', 'models', 'index.js')).toy;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addCat': 'cat'
}



/**
 * toy.prototype.cat - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
toy.prototype.cat = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.cat_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneCat({
                [models.cat.idAttribute()]: this.cat_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.cat.idAttribute(),
                "value": {
                    "value": this.cat_id
                },
                "operator": "eq"
            });
            let found = await resolvers.cats({
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
toy.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addCat)) {
        promises.push(this.add_cat(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removeCat)) {
        promises.push(this.remove_cat(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_cat - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
toy.prototype.add_cat = async function(input, benignErrorReporter) {
    await toy.add_cat_id(this.getIdValue(), input.addCat, benignErrorReporter);
    this.cat_id = input.addCat;
}

/**
 * remove_cat - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
toy.prototype.remove_cat = async function(input, benignErrorReporter) {
    if (input.removeCat == this.cat_id) {
        await toy.remove_cat_id(this.getIdValue(), input.removeCat, benignErrorReporter);
        this.cat_id = null;
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

    let toy = await resolvers.readOneToy({
        toy_id: id
    }, context);
    //check that record actually exists
    if (toy === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(toy.cat({}, context));

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
        throw new Error(`toy with toy_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * toys - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    toys: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "toys");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await toy.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * toysConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    toysConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = pagination.first !== undefined ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "toysConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await toy.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneToy - Check user authorization and return one record with the specified toy_id in the toy_id argument.
     *
     * @param  {number} {toy_id}    toy_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with toy_id requested
     */
    readOneToy: async function({
        toy_id
    }, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneToy");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await toy.readById(toy_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countToys - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countToys: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await toy.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableToy - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableToy: async function(_, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            return helper.vueTable(context.request, toy, ["id", "name", "cat_id", "toy_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addToy - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addToy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'toy', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdToy = await toy.addOne(inputSanitized, benignErrorReporter);
            await createdToy.handleAssociations(inputSanitized, benignErrorReporter);
            return createdToy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddToyCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddToyCsv: async function(_, context) {
        if (await checkAuthorization(context, 'toy', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return toy.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteToy - Check user authorization and delete a record with the specified toy_id in the toy_id argument.
     *
     * @param  {number} {toy_id}    toy_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteToy: async function({
        toy_id
    }, context) {
        if (await checkAuthorization(context, 'toy', 'delete') === true) {
            if (await validForDeletion(toy_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return toy.deleteOne(toy_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateToy - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateToy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'toy', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedToy = await toy.updateOne(inputSanitized, benignErrorReporter);
            await updatedToy.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedToy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateToyWithCat_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateToyWithCat_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cat_id
            }) => cat_id)), models.cat);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                toy_id
            }) => toy_id)), toy);
        }
        return await toy.bulkAssociateToyWithCat_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateToyWithCat_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateToyWithCat_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cat_id
            }) => cat_id)), models.cat);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                toy_id
            }) => toy_id)), toy);
        }
        return await toy.bulkDisAssociateToyWithCat_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateToy - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateToy: async function(_, context) {
        if (await checkAuthorization(context, 'toy', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return toy.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}