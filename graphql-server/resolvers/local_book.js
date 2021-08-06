/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const local_book = require(path.join(__dirname, '..', 'models', 'index.js')).local_book;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addLocal_publisher': 'local_publisher',
    'addLocal_countries': 'local_country'
}



/**
 * local_book.prototype.local_publisher - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
local_book.prototype.local_publisher = async function({
    search
}, context) {
    const startTime = new Date()
    if (helper.isNotUndefinedAndNotNull(this.publisher_id)) {
        if (search === undefined || search === null) {
            context['field']=true
            const res = await resolvers.readOneLocal_publisher({
                [models.local_publisher.idAttribute()]: this.publisher_id
            }, context)
            const measuredTime = (new Date()) - startTime
            console.log(`local_publisher*local_book:`, measuredTime)
            return res
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.local_publisher.idAttribute(),
                "value": this.publisher_id,
                "operator": "eq"
            });
            let found = (await resolvers.local_publishersConnection({
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
 * local_book.prototype.local_countriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
local_book.prototype.local_countriesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.country_ids) || this.country_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.local_countries({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * local_book.prototype.countFilteredLocal_countries - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
local_book.prototype.countFilteredLocal_countries = async function({
    search
}, context) {

    const startTime = new Date()
    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.country_ids) || this.country_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    const result = await resolvers.countLocal_countries({
        search: nsearch
    }, context);
	const measuredTime = (new Date()) - startTime
	console.log(`countFilteredLocal_countries*local_book:`, measuredTime)
    return result
}

/**
 * local_book.prototype.local_countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
local_book.prototype.local_countriesConnection = async function({
    search,
    order,
    pagination
}, context) {

    const startTime = new Date()
    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.country_ids) || this.country_ids.length === 0) {
        return {
            edges: [],
            local_countries: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.local_country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    const result = await resolvers.local_countriesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
	const measuredTime = (new Date()) - startTime
	console.log(`local_countriesConnection*local_book:`, measuredTime)
    return result
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_book.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addLocal_countries)) {
        promises_add.push(this.add_local_countries(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLocal_publisher)) {
        promises_add.push(this.add_local_publisher(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeLocal_countries)) {
        promises_remove.push(this.remove_local_countries(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLocal_publisher)) {
        promises_remove.push(this.remove_local_publisher(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_local_countries - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_book.prototype.add_local_countries = async function(input, benignErrorReporter) {

    await local_book.add_country_ids(this.getIdValue(), input.addLocal_countries, benignErrorReporter);
    this.country_ids = helper.unionIds(this.country_ids, input.addLocal_countries);
}

/**
 * add_local_publisher - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_book.prototype.add_local_publisher = async function(input, benignErrorReporter) {
    await local_book.add_publisher_id(this.getIdValue(), input.addLocal_publisher, benignErrorReporter);
    this.publisher_id = input.addLocal_publisher;
}

/**
 * remove_local_countries - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_book.prototype.remove_local_countries = async function(input, benignErrorReporter) {

    await local_book.remove_country_ids(this.getIdValue(), input.removeLocal_countries, benignErrorReporter);
    this.country_ids = helper.differenceIds(this.country_ids, input.removeLocal_countries);
}

/**
 * remove_local_publisher - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
local_book.prototype.remove_local_publisher = async function(input, benignErrorReporter) {
    if (input.removeLocal_publisher == this.publisher_id) {
        await local_book.remove_publisher_id(this.getIdValue(), input.removeLocal_publisher, benignErrorReporter);
        this.publisher_id = null;
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

    let local_book = await resolvers.readOneLocal_book({
        book_id: id
    }, context);
    //check that record actually exists
    if (local_book === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(local_book.countFilteredLocal_countries({}, context));
    promises_to_one.push(local_book.local_publisher({}, context));

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
        throw new Error(`local_book with book_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * local_books - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    local_books: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "local_books");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_book.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * local_booksConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    local_booksConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "local_booksConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_book.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneLocal_book - Check user authorization and return one record with the specified book_id in the book_id argument.
     *
     * @param  {number} {book_id}    book_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with book_id requested
     */
    readOneLocal_book: async function({
        book_id
    }, context) {
        const startTime = new Date()
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneLocal_book");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            const res = await local_book.readById(book_id, benignErrorReporter);
            const measuredTime = (new Date()) - startTime
            console.log('readOneLocal_book:', measuredTime)
            return res
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countLocal_books - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countLocal_books: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await local_book.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableLocal_book - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableLocal_book: async function(_, context) {
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            return helper.vueTable(context.request, local_book, ["id", "book_id", "name", "publisher_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addLocal_book - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addLocal_book: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_book', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdLocal_book = await local_book.addOne(inputSanitized, benignErrorReporter);
            await createdLocal_book.handleAssociations(inputSanitized, benignErrorReporter);
            return createdLocal_book;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddLocal_bookCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddLocal_bookCsv: async function(_, context) {
        if (await checkAuthorization(context, 'local_book', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_book.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteLocal_book - Check user authorization and delete a record with the specified book_id in the book_id argument.
     *
     * @param  {number} {book_id}    book_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteLocal_book: async function({
        book_id
    }, context) {
        if (await checkAuthorization(context, 'local_book', 'delete') === true) {
            if (await validForDeletion(book_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return local_book.deleteOne(book_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateLocal_book - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateLocal_book: async function(input, context) {
        let authorization = await checkAuthorization(context, 'local_book', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedLocal_book = await local_book.updateOne(inputSanitized, benignErrorReporter);
            await updatedLocal_book.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedLocal_book;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateLocal_bookWithPublisher_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateLocal_bookWithPublisher_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                publisher_id
            }) => publisher_id)), models.local_publisher);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                book_id
            }) => book_id)), local_book);
        }
        return await local_book.bulkAssociateLocal_bookWithPublisher_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateLocal_bookWithPublisher_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateLocal_bookWithPublisher_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                publisher_id
            }) => publisher_id)), models.local_publisher);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                book_id
            }) => book_id)), local_book);
        }
        return await local_book.bulkDisAssociateLocal_bookWithPublisher_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateLocal_book - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateLocal_book: async function(_, context) {
        if (await checkAuthorization(context, 'local_book', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return local_book.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}