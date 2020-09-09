/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const mysql_author = require(path.join(__dirname, '..', 'models', 'index.js')).mysql_author;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {}



mysql_author.prototype.booksFilter = function({
    search,
    order,
    pagination
}, context){

  let nsearch = helper.addSearchField({
        "search": search,
        "field": "id",
        "value": {
            "type": "Array",
            "value": this.book_ids.join(',')
        },
        "operator": "in"
    });

  return resolvers.mysql_books({
      search: nsearch,
      order: order,
      pagination: pagination
  }, context)
}


mysql_author.prototype.add_books = async function(input, benignErrorReporter){

  //add this author to each book
  // for each book_id
  //await models.post_book.add_authors( this.author );

  await mysql_author.add_book_ids(this.getIdValue(), input.addBooks, benignErrorReporter);
  this.book_ids = new Set([...this.book_ids, ...input.addBooks]);
}

mysql_author.prototype.remove_books = async function(input, benignErrorReporter){

  //remove this author from each book_ids
  // for each book_id
  //await models.post_book.remove_authors(this.author);
  await mysql_author.remove_book_ids(this.getIdValue(), input.removeBooks, benignErrorReporter);
   this.book_ids = this.book_ids.filter( i => !input.removeBooks.includes(i));
}



/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
mysql_author.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];


    if (helper.isNonEmptyArray(input.addBooks)) {
      promises.push(this.add_books(input, benignErrorReporter));
    }

    if (helper.isNonEmptyArray(input.removeBooks)) {
      promises.push(this.remove_books(input, benignErrorReporter));
    }


    await Promise.all(promises);
}



/**
 * checkCountAndReduceRecordsLimit({search, pagination}, context, resolverName, modelName) - Make sure that the current
 * set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} {search}  Search argument for filtering records
 * @param {object} {pagination}  If limit-offset pagination, this object will include 'offset' and 'limit' properties
 * to get the records from and to respectively. If cursor-based pagination, this object will include 'first' or 'last'
 * properties to indicate the number of records to fetch, and 'after' or 'before' cursors to indicate from which record
 * to start fetching.
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} resolverName The resolver that makes this check
 * @param {string} modelName The model to do the count
 */
async function checkCountAndReduceRecordsLimit({
    search,
    pagination
}, context, resolverName, modelName = 'mysql_author') {
    //defaults
    let inputPaginationValues = {
        limit: undefined,
        offset: 0,
        search: undefined,
        order: [
            ["id", "ASC"]
        ],
    }

    //check search
    helper.checkSearchArgument(search);
    if (search) inputPaginationValues.search = {
        ...search
    }; //copy

    //get generic pagination values
    let paginationValues = helper.getGenericPaginationValues(pagination, "id", inputPaginationValues);
    //get records count
    let count = (await models[modelName].countRecords(paginationValues.search));
    //get effective records count
    let effectiveCount = helper.getEffectiveRecordsCount(count, paginationValues.limit, paginationValues.offset);
    //do check and reduce of record limit.
    helper.checkCountAndReduceRecordLimitHelper(effectiveCount, context, resolverName);
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneMysql_author")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let mysql_author = await resolvers.readOneMysql_author({
        id: id
    }, context);
    //check that record actually exists
    if (mysql_author === null) throw new Error(`Record with ID = ${id} does not exist`);
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
        throw new Error(`mysql_author with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * mysql_authors - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    mysql_authors: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "mysql_authors");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await mysql_author.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * mysql_authorsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    mysql_authorsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            await checkCountAndReduceRecordsLimit({
                search,
                pagination
            }, context, "mysql_authorsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await mysql_author.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneMysql_author - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneMysql_author: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await mysql_author.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countMysql_authors - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countMysql_authors: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await mysql_author.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableMysql_author - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableMysql_author: async function(_, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            return helper.vueTable(context.request, mysql_author, ["id", "id", "name", "lastname", "email"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addMysql_author - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addMysql_author: async function(input, context) {
        let authorization = await checkAuthorization(context, 'mysql_author', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdMysql_author = await mysql_author.addOne(inputSanitized, benignErrorReporter);
            await createdMysql_author.handleAssociations(inputSanitized, benignErrorReporter);
            return createdMysql_author;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddMysql_authorCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddMysql_authorCsv: async function(_, context) {
        if (await checkAuthorization(context, 'mysql_author', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return mysql_author.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteMysql_author - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteMysql_author: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'mysql_author', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return mysql_author.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateMysql_author - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateMysql_author: async function(input, context) {
        let authorization = await checkAuthorization(context, 'mysql_author', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            // await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            // await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            // if (!input.skipAssociationsExistenceChecks) {
            //     await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            // }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedMysql_author = await mysql_author.updateOne(inputSanitized, benignErrorReporter);
            console.log("RESULT: ", updatedMysql_author);
            await updatedMysql_author.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedMysql_author;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateMysql_author - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateMysql_author: async function(_, context) {
        if (await checkAuthorization(context, 'mysql_author', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return mysql_author.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}
