/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const book = require(path.join(__dirname, '..', 'models_index.js')).book;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models_index.js'));
const globals = require('../config/globals');



const associationArgsDef = {
    'addAuthors': 'person'
}



/**
 * book.prototype.Authors - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
book.prototype.Authors = async function({
    search
}, context) {
    if (helper.isNotUndefinedAndNotNull(this.internalPId)) {
        try {
            if (search === undefined) {
                return resolvers.readOnePerson({
                    [models.person.idAttribute()]: this.internalPId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.person.idAttribute(),
                    "value": {
                        "value": this.internalPId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.people({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
    }
}



/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
book.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];

        if (helper.isNotUndefinedAndNotNull(input.addAuthors)) {
            promises.push(this.add_authors(input, context));
        }

        if (helper.isNotUndefinedAndNotNull(input.removeAuthors)) {
            promises.push(this.remove_authors(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}

/**
 * add_authors - field Mutation for to_one associations to add 
 *
 * @param {object} input   Info of input Ids to add  the association
 */
book.prototype.add_authors = async function(input) {
    await book._addAuthors(this.getIdValue(), input.addAuthors);
    this.internalPId = input.addAuthors;
}



/**
 * remove_authors - field Mutation for to_one associations to remove 
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
book.prototype.remove_authors = async function(input) {
    if (input.removeAuthors === this.internalPId) {
        await book._removeAuthors(this.getIdValue(), input.removeAuthors);
        this.internalPId = null;
    }
}



/**
 * errorMessageForRecordsLimit(query) - returns error message in case the record limit is exceeded.
 *
 * @param {string} query The query that failed
 */
function errorMessageForRecordsLimit(query) {
    return "Max record limit of " + globals.LIMIT_RECORDS + " exceeded in " + query;
}

/**
 * checkCount(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCount(search, context, query) {
    if (await book.countRecords(search) > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
}

/**
 * checkCountForOne(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOne(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneBook"));
    }
}

/**
 * checkCountAgainAndAdaptLimit(context, numberOfFoundItems, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {number} numberOfFoundItems number of items that were found, to be subtracted from the current record limit
 * @param {string} query The query that makes this check
 */
function checkCountAgainAndAdaptLimit(context, numberOfFoundItems, query) {
    if (numberOfFoundItems > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= numberOfFoundItems;
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let book = await resolvers.readOneBook({
        internalBId: id
    }, context);
    //check that record actually exists
    if (book === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(book.Authors({}, context));

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
        throw new Error(`Book with internalBId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * books - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    books: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Book', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "books");
                let resultRecords = await book.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "books");
                return resultRecords;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * booksConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    booksConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Book', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "booksConnection");
                let resultRecords = await book.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "booksConnection");
                return book.readAllCursor(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * readOneBook - Check user authorization and return one record with the specified internalBId in the internalBId argument.
     *
     * @param  {number} {internalBId}    internalBId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with internalBId requested
     */
    readOneBook: function({
        internalBId
    }, context) {
        return checkAuthorization(context, 'Book', 'read').then(authorization => {
            if (authorization === true) {
                checkCountForOne(context);
                let resultRecords = book.readById(internalBId);
                checkCountForOne(context);
                context.recordsLimit = context.recordsLimit - 1;
                return resultRecords;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * countBooks - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countBooks: function({
        search
    }, context) {
        return checkAuthorization(context, 'Book', 'read').then(authorization => {
            if (authorization === true) {
                return book.countRecords(search);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * vueTableBook - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableBook: function(_, context) {
        return checkAuthorization(context, 'Book', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, book, ["id", "title", "genre", "internalBId", "internalPId"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * addBook - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addBook: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Book', 'create');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef)
                let createdBook = await book.addOne(inputSanitized);
                await createdBook.handleAssociations(inputSanitized, context);
                return createdBook;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddBookCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddBookCsv: function(_, context) {
        return checkAuthorization(context, 'Book', 'create').then(authorization => {
            if (authorization === true) {
                return book.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteBook - Check user authorization and delete a record with the specified internalBId in the internalBId argument.
     *
     * @param  {number} {internalBId}    internalBId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteBook: function({
        internalBId
    }, context) {
        return checkAuthorization(context, 'Book', 'delete').then(async authorization => {
            if (authorization === true) {
                if (await validForDeletion(internalBId, context)) {
                    return book.deleteOne(internalBId);
                }
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * updateBook - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateBook: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Book', 'update');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                let updatedBook = await book.updateOne(inputSanitized);
                await updatedBook.handleAssociations(inputSanitized, context);
                return updatedBook;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateBook - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateBook: function(_, context) {
        return checkAuthorization(context, 'Book', 'read').then(authorization => {
            if (authorization === true) {
                return book.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}