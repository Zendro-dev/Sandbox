/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const house = require(path.join(__dirname, '..', 'models', 'index.js')).house;
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


const associationArgsDef = {
    'addCats': 'cat'
}




/**
 * house.prototype.catsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the request query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
house.prototype.catsFilter = function({
    search,
    order,
    pagination
}, context) {
    try {
        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "house_id",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.cats({
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
 * house.prototype.countFilteredCats - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the request query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
house.prototype.countFilteredCats = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "house_id",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countCats({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * house.prototype.catsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the request query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
house.prototype.catsConnection = function({
    search,
    order,
    pagination
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "house_id",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.catsConnection({
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
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
house.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addCats)) {
        promises.push(this.add_cats(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCats)) {
        promises.push(this.remove_cats(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_cats - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
house.prototype.add_cats = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addCats) {
        results.push(models.cat.add_house_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}


/**
 * remove_cats - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
house.prototype.remove_cats = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeCats) {
        results.push(models.cat.remove_house_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
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
async function checkCountAndReduceRecordsLimit(search, context, resolverName, filtering, modelName = 'house') {
    let count = await models[modelName].countRecords(search, filtering);
    helper.checkCountAndReduceRecordLimitHelper(count, context, resolverName)
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    helper.checkCountAndReduceRecordLimitHelper(1, context, "readOneHouse")
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let house = await resolvers.readOneHouse({
        house_id: id
    }, context);
    //check that record actually exists
    if (house === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(house.countFilteredCats({}, context));

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
        throw new Error(`house with house_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {

    /**
     * housesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the request query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search and pagination argument
     */
    housesConnection: async function({
        search,
        pagination
    }, context) {
        try {
            if (await checkAuthorization(context, 'house', 'read') === true) {
                let filtering = await checkAuthorization(context, 'house', 'search')
                //await checkCountAndReduceRecordsLimit(search, context, "housesConnection", filtering);
                return house.readAllCursor(search, pagination, filtering);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * readOneHouse - Check user authorization and return one record with the specified house_id in the house_id argument.
     *
     * @param  {number} {house_id}    house_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Record with house_id requested
     */
    readOneHouse: async function({
        house_id
    }, context) {
        try {
            if (await checkAuthorization(context, 'house', 'read') === true) {
                //checkCountForOneAndReduceRecordsLimit(context);
                return house.readById(house_id);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * countHouses - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the request query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countHouses: async function({
        search
    }, context) {
        try {
            if (await checkAuthorization(context, 'house', 'read') === true) {
                let filtering = await checkAuthorization(context, 'house', 'search')
                return await house.countRecords(search, filtering);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * vueTableHouse - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableHouse: async function(_, context) {
        try {
            if (await checkAuthorization(context, 'house', 'read') === true) {
                return helper.vueTable(context.request, house, ["id", "address", "house_id"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * addHouse - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         New record created
     */
    addHouse: async function(input, context) {
        try {
            if (await checkAuthorization(context, 'house', 'create') === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                let createdHouse = await house.addOne(inputSanitized);
                await createdHouse.handleAssociations(inputSanitized, benignErrorReporter);
                return createdHouse;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * bulkAddHouseCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     */
    /* bulkAddHouseCsv: async function(_, context) {
      try {
          if (await checkAuthorization(context, 'house', 'create') === true) {
            return house.bulkAddCsv(context);
          } else {
              throw new Error("You don't have authorization to perform this action");
          }
      } catch(error) {
        console.error(error);
        handleError( error);
      }
    }, */

    /**
     * deleteHouse - Check user authorization and delete a record with the specified house_id in the house_id argument.
     *
     * @param  {number} {house_id}    house_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteHouse: async function({
        house_id
    }, context) {
        try {
            if (await checkAuthorization(context, 'house', 'delete') === true) {
                if (await validForDeletion(house_id, context)) {
                    return house.deleteOne(house_id);
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
     * updateHouse - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {object}         Updated record
     */
    updateHouse: async function(input, context) {
        try {
            if (await checkAuthorization(context, 'house', 'update') === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                let updatedHouse = await house.updateOne(inputSanitized);
                await updatedHouse.handleAssociations(inputSanitized, benignErrorReporter);
                return updatedHouse;
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateHouse - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the request query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateHouse: async function(_, context) {
        try {
            if (await checkAuthorization(context, 'house', 'read') === true) {
                return house.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    }

}