/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const cat = require(path.join(__dirname, '..', 'models', 'index.js')).cat;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');


const associationArgsDef = {}








/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
cat.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];



    await Promise.all(promises);
}




/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {boolean} filtering Is filtering allowed (only for Cassandra)?
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit(search, context, resolverName, filtering, modelName = 'cat') {
    let count = await models[modelName].countRecords(search, filtering);
    helper.checkCountAndReduceRecordLimitHelper(count, context, resolverName)
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneCat")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let cat = await resolvers.readOneCat({
        cat_id: id
    }, context);
    //check that record actually exists
    if (cat === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];


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
        throw new Error(`cat with cat_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {

    /**
     * catsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the request query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search and pagination argument
     */
    catsConnection: async function({
        search,
        pagination
    }, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'read') === true) {
                helper.checkCursorBasedPaginationArgument(pagination);
                let limit = pagination.first !== undefined ? pagination.first : pagination.last;
                helper.checkCountAndReduceRecordsLimit(limit, context, "dogsConnection");
                let filtering = await checkAuthorization(context, 'cat', 'search')
                // await checkCountAndReduceRecordsLimit(search, context, "catsConnection", filtering);
                return cat.readAllCursor(search, pagination, filtering);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * readOneCat - Check user authorization and return one record with the specified cat_id in the cat_id argument.
     *
     * @param  {number} {cat_id}    cat_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Record with cat_id requested
     */
    readOneCat: async function({
        cat_id
    }, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'read') === true) {
                helper.checkCountAndReduceRecordsLimit(1, context, "readOneDog");
                return cat.readById(cat_id);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * countCats - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the request query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCats: async function({
        search
    }, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'read') === true) {
                let filtering = await checkAuthorization(context, 'cat', 'search')
                return await cat.countRecords(search, filtering);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * vueTableCat - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCat: async function(_, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'read') === true) {
                return helper.vueTable(context.request, cat, ["id", "name", "cat_id", "person_id"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * addCat - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         New record created
     */
    addCat: async function(input, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'create') === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                let createdCat = await cat.addOne(inputSanitized);
                await createdCat.handleAssociations(inputSanitized, benignErrorReporter);
                return createdCat;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddCatCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     */
    /* bulkAddCatCsv: async function(_, context) {
      try {
          if (await checkAuthorization(context, 'cat', 'create') === true) {
            return cat.bulkAddCsv(context);
          } else {
              throw new Error("You don't have authorization to perform this action");
          }
      } catch(error) {
        console.error(error);
        handleError( error);
      }
    }, */

    /**
     * deleteCat - Check user authorization and delete a record with the specified cat_id in the cat_id argument.
     *
     * @param  {number} {cat_id}    cat_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCat: async function({
        cat_id
    }, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'delete') === true) {
                if (await validForDeletion(cat_id, context)) {
                    return cat.deleteOne(cat_id);
                }
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * updateCat - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Updated record
     */
    updateCat: async function(input, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'update') === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                let updatedCat = await cat.updateOne(inputSanitized);
                await updatedCat.handleAssociations(inputSanitized, benignErrorReporter);
                return updatedCat;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateCat - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCat: async function(_, context) {
        try {
            if (await checkAuthorization(context, 'cat', 'read') === true) {
                return cat.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    }

}