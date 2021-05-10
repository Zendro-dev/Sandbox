/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const country = require(path.join(__dirname, '..', 'models', 'index.js')).country;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addUnique_capital': 'capital',
    'addContinent': 'continent',
    'addRivers': 'river'
}



/**
 * country.prototype.unique_capital - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
country.prototype.unique_capital = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "country_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = (await resolvers.capitalsConnection({
        search: nsearch,
        pagination: {
            first: 2
        }
    }, context)).edges;
    if (found.length > 0) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 capitals matching country with country_id ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the country model. Returning first capital.`
            ));
        }
        return found[0].node;
    }
    return null;
}
/**
 * country.prototype.continent - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
country.prototype.continent = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.continent_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneContinent({
                [models.continent.idAttribute()]: this.continent_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.continent.idAttribute(),
                "value": this.continent_id,
                "operator": "eq"
            });
            let found = (await resolvers.continentsConnection({
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
 * country.prototype.riversFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
country.prototype.riversFilter = function({
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
 * country.prototype.countFilteredRivers - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
country.prototype.countFilteredRivers = function({
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
 * country.prototype.riversConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
country.prototype.riversConnection = function({
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
country.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addRivers)) {
        promises_add.push(this.add_rivers(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addUnique_capital)) {
        promises_add.push(this.add_unique_capital(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addContinent)) {
        promises_add.push(this.add_continent(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeRivers)) {
        promises_remove.push(this.remove_rivers(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeUnique_capital)) {
        promises_remove.push(this.remove_unique_capital(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeContinent)) {
        promises_remove.push(this.remove_continent(input, benignErrorReporter));
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
country.prototype.add_rivers = async function(input, benignErrorReporter) {

    await country.add_river_ids(this.getIdValue(), input.addRivers, benignErrorReporter);
    this.river_ids = helper.unionIds(this.river_ids, input.addRivers);
}

/**
 * add_unique_capital - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.add_unique_capital = async function(input, benignErrorReporter) {
    await models.capital.add_country_id(input.addUnique_capital, this.getIdValue(), benignErrorReporter);
}

/**
 * add_continent - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.add_continent = async function(input, benignErrorReporter) {
    await country.add_continent_id(this.getIdValue(), input.addContinent, benignErrorReporter);
    this.continent_id = input.addContinent;
}

/**
 * remove_rivers - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.remove_rivers = async function(input, benignErrorReporter) {

    await country.remove_river_ids(this.getIdValue(), input.removeRivers, benignErrorReporter);
    this.river_ids = helper.differenceIds(this.river_ids, input.removeRivers);
}

/**
 * remove_unique_capital - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.remove_unique_capital = async function(input, benignErrorReporter) {
    await models.capital.remove_country_id(input.removeUnique_capital, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_continent - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
country.prototype.remove_continent = async function(input, benignErrorReporter) {
    if (input.removeContinent == this.continent_id) {
        await country.remove_continent_id(this.getIdValue(), input.removeContinent, benignErrorReporter);
        this.continent_id = null;
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

    let country = await resolvers.readOneCountry({
        country_id: id
    }, context);
    //check that record actually exists
    if (country === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(country.countFilteredRivers({}, context));
    promises_to_one.push(country.unique_capital({}, context));
    promises_to_one.push(country.continent({}, context));

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
        throw new Error(`country with country_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * countries - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    countries: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "countries");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await country.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countriesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    countriesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "countriesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await country.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneCountry - Check user authorization and return one record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with country_id requested
     */
    readOneCountry: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneCountry");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await country.readById(country_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countCountries - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countCountries: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await country.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableCountry - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableCountry: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            return helper.vueTable(context.request, country, ["id", "name", "country_id", "continent_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addCountry - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addCountry: async function(input, context) {
        let authorization = await checkAuthorization(context, 'country', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdCountry = await country.addOne(inputSanitized, benignErrorReporter);
            await createdCountry.handleAssociations(inputSanitized, benignErrorReporter);
            return createdCountry;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddCountryCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddCountryCsv: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return country.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteCountry - Check user authorization and delete a record with the specified country_id in the country_id argument.
     *
     * @param  {number} {country_id}    country_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteCountry: async function({
        country_id
    }, context) {
        if (await checkAuthorization(context, 'country', 'delete') === true) {
            if (await validForDeletion(country_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return country.deleteOne(country_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateCountry - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateCountry: async function(input, context) {
        let authorization = await checkAuthorization(context, 'country', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedCountry = await country.updateOne(inputSanitized, benignErrorReporter);
            await updatedCountry.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedCountry;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateCountryWithContinent_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateCountryWithContinent_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                continent_id
            }) => continent_id)), models.continent);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), country);
        }
        return await country.bulkAssociateCountryWithContinent_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateCountryWithContinent_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateCountryWithContinent_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                continent_id
            }) => continent_id)), models.continent);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                country_id
            }) => country_id)), country);
        }
        return await country.bulkDisAssociateCountryWithContinent_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateCountry - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateCountry: async function(_, context) {
        if (await checkAuthorization(context, 'country', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return country.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}