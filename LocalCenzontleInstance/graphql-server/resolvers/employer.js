/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const employer = require(path.join(__dirname, '..', 'models_index.js')).employer;
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
    'addEmployees': 'person'
}




/**
 * employer.prototype.employeesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
employer.prototype.employeesFilter = function({
    search,
    order,
    pagination
}, context) {
    try {
        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "internalEId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.people({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * employer.prototype.countFilteredEmployees - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
employer.prototype.countFilteredEmployees = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "internalEId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countPeople({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * employer.prototype.employeesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
employer.prototype.employeesConnection = function({
    search,
    order,
    pagination
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "internalEId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.peopleConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}


/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
employer.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];
        if (helper.isNonEmptyArray(input.addEmployees)) {
            promises.push(this.add_employees(input, context));
        }
        if (helper.isNonEmptyArray(input.removeEmployees)) {
            promises.push(this.remove_employees(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}

/**
 * add_employees - field Mutation for to_many associations to add 
 *
 * @param {object} input   Info of input Ids to add  the association
 */
employer.prototype.add_employees = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addEmployees) {
        results.push(models.person.add_internalEId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}



/**
 * remove_employees - field Mutation for to_many associations to remove 
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
employer.prototype.remove_employees = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeEmployees) {
        results.push(models.person.remove_internalEId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
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
    if (await employer.countRecords(search) > context.recordsLimit) {
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
        throw new Error(errorMessageForRecordsLimit("readOneEmployer"));
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

    let employer = await resolvers.readOneEmployer({
        id: id
    }, context);
    //check that record actually exists
    if (employer === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(employer.countFilteredEmployees({}, context));

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
        throw new Error(`Employer with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * employers - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    employers: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Employer', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "employers");
                let resultRecords = await employer.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "employers");
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
     * employersConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    employersConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Employer', 'read').then(async authorization => {
            if (authorization === true) {
                await checkCount(search, context, "employersConnection");
                let resultRecords = await employer.readAll(search, order, pagination);
                checkCountAgainAndAdaptLimit(context, resultRecords.length, "employersConnection");
                return employer.readAllCursor(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * readOneEmployer - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneEmployer: function({
        id
    }, context) {
        return checkAuthorization(context, 'Employer', 'read').then(authorization => {
            if (authorization === true) {
                checkCountForOne(context);
                let resultRecords = employer.readById(id);
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
     * countEmployers - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countEmployers: function({
        search
    }, context) {
        return checkAuthorization(context, 'Employer', 'read').then(authorization => {
            if (authorization === true) {
                return employer.countRecords(search);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * vueTableEmployer - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableEmployer: function(_, context) {
        return checkAuthorization(context, 'Employer', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, employer, ["id", "employer"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * addEmployer - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addEmployer: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Employer', 'create');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef)
                let createdEmployer = await employer.addOne(inputSanitized);
                await createdEmployer.handleAssociations(inputSanitized, context);
                return createdEmployer;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddEmployerCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddEmployerCsv: function(_, context) {
        return checkAuthorization(context, 'Employer', 'create').then(authorization => {
            if (authorization === true) {
                return employer.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deleteEmployer - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteEmployer: function({
        id
    }, context) {
        return checkAuthorization(context, 'Employer', 'delete').then(async authorization => {
            if (authorization === true) {
                if (await validForDeletion(id, context)) {
                    return employer.deleteOne(id);
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
     * updateEmployer - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateEmployer: async function(input, context) {
        try {
            let authorization = await checkAuthorization(context, 'Employer', 'update');
            if (authorization === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                let updatedEmployer = await employer.updateOne(inputSanitized);
                await updatedEmployer.handleAssociations(inputSanitized, context);
                return updatedEmployer;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateEmployer - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateEmployer: function(_, context) {
        return checkAuthorization(context, 'Employer', 'read').then(authorization => {
            if (authorization === true) {
                return employer.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}