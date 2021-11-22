/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const city = require(path.join(__dirname, '..', 'models', 'index.js')).city;
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
    'addCountry': 'country',
    'addCapitalTo': 'country',
    'addRivers': 'river'
}



/**
 * city.prototype.country - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
city.prototype.country = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.country_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneCountry({
                [models.country.idAttribute()]: this.country_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.country.idAttribute(),
                "value": this.country_id,
                "operator": "eq"
            });
            let found = (await resolvers.countriesConnection({
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
 * city.prototype.capitalTo - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
city.prototype.capitalTo = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "capital_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.countriesConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;
    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 countries matching city with city_id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the city model. Returning first country.`
            ));
        }
        return found[0].node;
    }
    return null;
}

/**
 * city.prototype.riversFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
city.prototype.riversFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.rivers({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * city.prototype.countFilteredRivers - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
city.prototype.countFilteredRivers = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countRivers({
        search: nsearch
    }, context);
}

/**
 * city.prototype.riversConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
city.prototype.riversConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.river_ids) || this.river_ids.length === 0) {
        return {
            edges: [],
            rivers: [],
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
        "field": models.river.idAttribute(),
        "value": this.river_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.riversConnection({
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
city.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addRivers)) {
        promises_add.push(this.add_rivers(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCountry)) {
        promises_add.push(this.add_country(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCapitalTo)) {
        promises_add.push(this.add_capitalTo(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeRivers)) {
        promises_remove.push(this.remove_rivers(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCountry)) {
        promises_remove.push(this.remove_country(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCapitalTo)) {
        promises_remove.push(this.remove_capitalTo(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_rivers - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.add_rivers = async function(input, benignErrorReporter) {

    await city.add_river_ids(this.getIdValue(), input.addRivers, benignErrorReporter);
    this.river_ids = helper.unionIds(this.river_ids, input.addRivers);
}

/**
 * add_country - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.add_country = async function(input, benignErrorReporter) {
    await city.add_country_id(this.getIdValue(), input.addCountry, benignErrorReporter);
    this.country_id = input.addCountry;
}

/**
 * add_capitalTo - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.add_capitalTo = async function(input, benignErrorReporter) {
    await models.country.add_capital_id(input.addCapitalTo, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_rivers - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.remove_rivers = async function(input, benignErrorReporter) {

    await city.remove_river_ids(this.getIdValue(), input.removeRivers, benignErrorReporter);
    this.river_ids = helper.differenceIds(this.river_ids, input.removeRivers);
}

/**
 * remove_country - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.remove_country = async function(input, benignErrorReporter) {
    if (input.removeCountry == this.country_id) {
        await city.remove_country_id(this.getIdValue(), input.removeCountry, benignErrorReporter);
        this.country_id = null;
    }
}

/**
 * remove_capitalTo - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
city.prototype.remove_capitalTo = async function(input, benignErrorReporter) {
    await models.country.remove_capital_id(input.removeCapitalTo, this.getIdValue(), benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let city = await resolvers.readOneCity({
        city_id: id
    }, context);
    //check that record actually exists
    if (city === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(city.countFilteredRivers({}, context));
    promises_to_one.push(city.country({}, context));
    promises_to_one.push(city.capitalTo({}, context));

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
        throw new Error(`city with city_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * cities - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    cities: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "cities");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await city.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * citiesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    citiesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "citiesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await city.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCity - Check user authorization and return one record with the specified city_id in the city_id argument.
     *
     * @param  {number} {city_id}    city_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with city_id requested
     */
    readOneCity: async function({
        city_id
    }, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCity");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await city.readById(city_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCities - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCities: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await city.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCity - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCity: async function(_, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            return helper.vueTable(context.request, city, ["id", "city_id", "name", "country_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateCityForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCityForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'city', 'read');
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
                    city,
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
     * validateCityForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCityForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'city', 'read');
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
                    city,
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
     * validateCityForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {city_id} city_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCityForDeletion: async ({
        city_id
    }, context) => {
        if ((await checkAuthorization(context, 'city', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(city_id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    city,
                    city_id);
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
     * validateCityAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {city_id} city_id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateCityAfterReading: async ({
        city_id
    }, context) => {
        if ((await checkAuthorization(context, 'city', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    city,
                    city_id);
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
     * addCity - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCity: async function(input, context) {
        let authorization = await checkAuthorization(context, 'city', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCity = await city.addOne(inputSanitized, benignErrorReporter);
            await createdCity.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCity;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCityCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCityCsv: async function(_, context) {
        if (await checkAuthorization(context, 'city', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return city.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCity - Check user authorization and delete a record with the specified city_id in the city_id argument.
     *
     * @param  {number} {city_id}    city_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCity: async function({
        city_id
    }, context) {
        if (await checkAuthorization(context, 'city', 'delete') === true) {
            if (await validForDeletion(city_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return city.deleteOne(city_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCity - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCity: async function(input, context) {
        let authorization = await checkAuthorization(context, 'city', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCity = await city.updateOne(inputSanitized, benignErrorReporter);
            await updatedCity.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCity;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCityWithCountry_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCityWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                city_id
            }) => city_id)), city);
        }
        return await city.bulkAssociateCityWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCityWithCountry_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCityWithCountry_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), models.country);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                city_id
            }) => city_id)), city);
        }
        return await city.bulkDisAssociateCityWithCountry_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCity - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCity: async function(_, context) {
        if (await checkAuthorization(context, 'city', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return city.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}