/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const river = require(path.join(__dirname, '..', 'models', 'index.js')).river;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
const validatorUtil = require("../utils/validatorUtil");
const associationArgsDef = {
    'addCountries': 'country',
    'addCities': 'city'
}




/**
 * river.prototype.countriesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
river.prototype.countriesFilter = function({
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
        "field": models.country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countries({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * river.prototype.countFilteredCountries - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
river.prototype.countFilteredCountries = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.country_ids) || this.country_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countCountries({
        search: nsearch
    }, context);
}

/**
 * river.prototype.countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
river.prototype.countriesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.country_ids) || this.country_ids.length === 0) {
        return {
            edges: [],
            countries: [],
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
        "field": models.country.idAttribute(),
        "value": this.country_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countriesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * river.prototype.citiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
river.prototype.citiesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.city_ids) || this.city_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.city.idAttribute(),
        "value": this.city_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.cities({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * river.prototype.countFilteredCities - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
river.prototype.countFilteredCities = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.city_ids) || this.city_ids.length === 0) {
        return 0;
    }


    //WORKAROUND for cassandra targetStorageType. Mainpulate search to intersect Equal searches on the primaryKey
    const hasIdSearch = helper.parseFieldResolverSearchArgForCassandra(search, this.city_ids, models.city.idAttribute());
    let nsearch = hasIdSearch ? search : helper.addSearchField({
        "search": search,
        "field": models.city.idAttribute(),
        "value": this.city_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countCities({
        search: nsearch
    }, context);
}

/**
 * river.prototype.citiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
river.prototype.citiesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.city_ids) || this.city_ids.length === 0) {
        return {
            edges: [],
            cities: [],
            pageInfo: {
                startCursor: null,
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false
            }
        };
    }


    const hasIdSearch = helper.parseFieldResolverSearchArgForCassandra(search, this.city_ids, models.city.idAttribute());
    let nsearch = hasIdSearch ? search : helper.addSearchField({
        "search": search,
        "field": models.city.idAttribute(),
        "value": this.city_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.citiesConnection({
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
river.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addCountries)) {
        promises_add.push(this.add_countries(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addCities)) {
        promises_add.push(this.add_cities(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeCountries)) {
        promises_remove.push(this.remove_countries(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeCities)) {
        promises_remove.push(this.remove_cities(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_countries - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
river.prototype.add_countries = async function(input, benignErrorReporter) {

    await river.add_country_ids(this.getIdValue(), input.addCountries, benignErrorReporter);
    this.country_ids = helper.unionIds(this.country_ids, input.addCountries);
}

/**
 * add_cities - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
river.prototype.add_cities = async function(input, benignErrorReporter) {

    await river.add_city_ids(this.getIdValue(), input.addCities, benignErrorReporter);
    this.city_ids = helper.unionIds(this.city_ids, input.addCities);
}

/**
 * remove_countries - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
river.prototype.remove_countries = async function(input, benignErrorReporter) {

    await river.remove_country_ids(this.getIdValue(), input.removeCountries, benignErrorReporter);
    this.country_ids = helper.differenceIds(this.country_ids, input.removeCountries);
}

/**
 * remove_cities - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
river.prototype.remove_cities = async function(input, benignErrorReporter) {

    await river.remove_city_ids(this.getIdValue(), input.removeCities, benignErrorReporter);
    this.city_ids = helper.differenceIds(this.city_ids, input.removeCities);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let river = await resolvers.readOneRiver({
        river_id: id
    }, context);
    //check that record actually exists
    if (river === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(river.countFilteredCountries({}, context));
    promises_to_many.push(river.countFilteredCities({}, context));

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
        throw new Error(`river with river_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * rivers - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    rivers: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "rivers");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await river.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * riversConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    riversConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "riversConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await river.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneRiver - Check user authorization and return one record with the specified river_id in the river_id argument.
     *
     * @param  {number} {river_id}    river_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with river_id requested
     */
    readOneRiver: async function({
        river_id
    }, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneRiver");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await river.readById(river_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countRivers - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countRivers: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await river.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableRiver - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableRiver: async function(_, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            return helper.vueTable(context.request, river, ["id", "name", "river_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateRiverForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateRiverForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'river', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForCreate",
                    river,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateRiverForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateRiverForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'river', 'read');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [
                Object.keys(associationArgsDef),
            ]);

            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            try {
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(
                        inputSanitized,
                        context,
                        associationArgsDef
                    );
                }
                await validatorUtil.validateData(
                    "validateForUpdate",
                    river,
                    inputSanitized
                );
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateRiverForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {river_id} river_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateRiverForDeletion: async ({
        river_id
    }, context) => {
        if ((await checkAuthorization(context, 'river', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(river_id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    river,
                    river_id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateRiverAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {river_id} river_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateRiverAfterReading: async ({
        river_id
    }, context) => {
        if ((await checkAuthorization(context, 'river', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    river,
                    river_id);
                return true;
            } catch (error) {
                benignErrorReporter.reportError(error);
                return false;
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },
    /**
     * addRiver - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addRiver: async function(input, context) {
        let authorization = await checkAuthorization(context, 'river', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdRiver = await river.addOne(inputSanitized, benignErrorReporter);
            await createdRiver.handleAssociations(inputSanitized, benignErrorReporter);
            return createdRiver;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddRiverCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddRiverCsv: async function(_, context) {
        if (await checkAuthorization(context, 'river', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return river.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteRiver - Check user authorization and delete a record with the specified river_id in the river_id argument.
     *
     * @param  {number} {river_id}    river_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteRiver: async function({
        river_id
    }, context) {
        if (await checkAuthorization(context, 'river', 'delete') === true) {
            if (await validForDeletion(river_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return river.deleteOne(river_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateRiver - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateRiver: async function(input, context) {
        let authorization = await checkAuthorization(context, 'river', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedRiver = await river.updateOne(inputSanitized, benignErrorReporter);
            await updatedRiver.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedRiver;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateRiver - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateRiver: async function(_, context) {
        if (await checkAuthorization(context, 'river', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return river.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}