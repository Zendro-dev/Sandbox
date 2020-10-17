/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const field_plot = require(path.join(__dirname, '..', 'models', 'index.js')).field_plot;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addIndividuals': 'individual',
    'addSamples': 'sample'
}




/**
 * field_plot.prototype.individualsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
field_plot.prototype.individualsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.individuals({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * field_plot.prototype.countFilteredIndividuals - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
field_plot.prototype.countFilteredIndividuals = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countIndividuals({
        search: nsearch
    }, context);
}

/**
 * field_plot.prototype.individualsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
field_plot.prototype.individualsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.individualsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * field_plot.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
field_plot.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.samples({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * field_plot.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
field_plot.prototype.countFilteredSamples = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * field_plot.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
field_plot.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "field_plot_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.samplesConnection({
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
field_plot.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addIndividuals)) {
        promises.push(this.add_individuals(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSamples)) {
        promises.push(this.add_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeIndividuals)) {
        promises.push(this.remove_individuals(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises.push(this.remove_samples(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_individuals - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
field_plot.prototype.add_individuals = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addIndividuals.map(associatedRecordId => {
        return {
            field_plot_id: this.getIdValue(),
            [models.individual.idAttribute()]: associatedRecordId
        }
    });
    await models.individual.bulkAssociateIndividualWithField_plot_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
field_plot.prototype.add_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addSamples.map(associatedRecordId => {
        return {
            field_plot_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkAssociateSampleWithField_plot_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_individuals - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
field_plot.prototype.remove_individuals = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeIndividuals.map(associatedRecordId => {
        return {
            field_plot_id: this.getIdValue(),
            [models.individual.idAttribute()]: associatedRecordId
        }
    });
    await models.individual.bulkDisAssociateIndividualWithField_plot_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
field_plot.prototype.remove_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeSamples.map(associatedRecordId => {
        return {
            field_plot_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkDisAssociateSampleWithField_plot_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let field_plot = await resolvers.readOneField_plot({
        id: id
    }, context);
    //check that record actually exists
    if (field_plot === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(field_plot.countFilteredIndividuals({}, context));
    promises_to_many.push(field_plot.countFilteredSamples({}, context));

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
        throw new Error(`field_plot with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * field_plots - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    field_plots: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "field_plots");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await field_plot.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * field_plotsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    field_plotsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "field_plotsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await field_plot.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneField_plot - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneField_plot: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneField_plot");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await field_plot.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countField_plots - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countField_plots: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await field_plot.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableField_plot - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableField_plot: async function(_, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            return helper.vueTable(context.request, field_plot, ["id", "field_name", "location_code", "soil_treatment"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addField_plot - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addField_plot: async function(input, context) {
        let authorization = await checkAuthorization(context, 'field_plot', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdField_plot = await field_plot.addOne(inputSanitized, benignErrorReporter);
            await createdField_plot.handleAssociations(inputSanitized, benignErrorReporter);
            return createdField_plot;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddField_plotCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddField_plotCsv: async function(_, context) {
        if (await checkAuthorization(context, 'field_plot', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return field_plot.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteField_plot - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteField_plot: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'field_plot', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return field_plot.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateField_plot - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateField_plot: async function(input, context) {
        let authorization = await checkAuthorization(context, 'field_plot', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedField_plot = await field_plot.updateOne(inputSanitized, benignErrorReporter);
            await updatedField_plot.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedField_plot;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateField_plot - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateField_plot: async function(_, context) {
        if (await checkAuthorization(context, 'field_plot', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return field_plot.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}