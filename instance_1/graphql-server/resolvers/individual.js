/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const individual = require(path.join(__dirname, '..', 'models', 'index.js')).individual;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addCultivar': 'cultivar',
    'addField_plot': 'field_plot',
    'addPot': 'pot',
    'addSamples': 'sample',
    'addPlant_measurements': 'plant_measurement',
    'addTranscript_counts': 'transcript_count'
}



/**
 * individual.prototype.cultivar - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
individual.prototype.cultivar = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.cultivar_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneCultivar({
                [models.cultivar.idAttribute()]: this.cultivar_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.cultivar.idAttribute(),
                "value": this.cultivar_id,
                "operator": "eq"
            });
            let found = await resolvers.cultivars({
                search: nsearch,
                pagination: {
                    limit: 1
                }
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}
/**
 * individual.prototype.field_plot - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
individual.prototype.field_plot = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.field_plot_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneField_plot({
                [models.field_plot.idAttribute()]: this.field_plot_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.field_plot.idAttribute(),
                "value": this.field_plot_id,
                "operator": "eq"
            });
            let found = await resolvers.field_plots({
                search: nsearch,
                pagination: {
                    limit: 1
                }
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}
/**
 * individual.prototype.pot - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
individual.prototype.pot = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.pot_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOnePot({
                [models.pot.idAttribute()]: this.pot_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.pot.idAttribute(),
                "value": this.pot_id,
                "operator": "eq"
            });
            let found = await resolvers.pots({
                search: nsearch,
                pagination: {
                    limit: 1
                }
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}

/**
 * individual.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
individual.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
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
 * individual.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
individual.prototype.countFilteredSamples = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * individual.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
individual.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
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
 * individual.prototype.plant_measurementsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
individual.prototype.plant_measurementsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.plant_measurements({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * individual.prototype.countFilteredPlant_measurements - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
individual.prototype.countFilteredPlant_measurements = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countPlant_measurements({
        search: nsearch
    }, context);
}

/**
 * individual.prototype.plant_measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
individual.prototype.plant_measurementsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.plant_measurementsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * individual.prototype.transcript_countsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
individual.prototype.transcript_countsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.transcript_counts({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * individual.prototype.countFilteredTranscript_counts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
individual.prototype.countFilteredTranscript_counts = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countTranscript_counts({
        search: nsearch
    }, context);
}

/**
 * individual.prototype.transcript_countsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
individual.prototype.transcript_countsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "individual_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.transcript_countsConnection({
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
individual.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addSamples)) {
        promises.push(this.add_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPlant_measurements)) {
        promises.push(this.add_plant_measurements(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addTranscript_counts)) {
        promises.push(this.add_transcript_counts(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addCultivar)) {
        promises.push(this.add_cultivar(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addField_plot)) {
        promises.push(this.add_field_plot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addPot)) {
        promises.push(this.add_pot(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises.push(this.remove_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePlant_measurements)) {
        promises.push(this.remove_plant_measurements(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeTranscript_counts)) {
        promises.push(this.remove_transcript_counts(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeCultivar)) {
        promises.push(this.remove_cultivar(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeField_plot)) {
        promises.push(this.remove_field_plot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removePot)) {
        promises.push(this.remove_pot(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_samples - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addSamples.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkAssociateSampleWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_plant_measurements - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_plant_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addPlant_measurements.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.plant_measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.plant_measurement.bulkAssociatePlant_measurementWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_transcript_counts - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_transcript_counts = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addTranscript_counts.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.transcript_count.idAttribute()]: associatedRecordId
        }
    });
    await models.transcript_count.bulkAssociateTranscript_countWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_cultivar - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_cultivar = async function(input, benignErrorReporter) {
    await individual.add_cultivar_id(this.getIdValue(), input.addCultivar, benignErrorReporter);
    this.cultivar_id = input.addCultivar;
}

/**
 * add_field_plot - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_field_plot = async function(input, benignErrorReporter) {
    await individual.add_field_plot_id(this.getIdValue(), input.addField_plot, benignErrorReporter);
    this.field_plot_id = input.addField_plot;
}

/**
 * add_pot - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.add_pot = async function(input, benignErrorReporter) {
    await individual.add_pot_id(this.getIdValue(), input.addPot, benignErrorReporter);
    this.pot_id = input.addPot;
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeSamples.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkDisAssociateSampleWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_plant_measurements - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_plant_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removePlant_measurements.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.plant_measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.plant_measurement.bulkDisAssociatePlant_measurementWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_transcript_counts - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_transcript_counts = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeTranscript_counts.map(associatedRecordId => {
        return {
            individual_id: this.getIdValue(),
            [models.transcript_count.idAttribute()]: associatedRecordId
        }
    });
    await models.transcript_count.bulkDisAssociateTranscript_countWithIndividual_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_cultivar - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_cultivar = async function(input, benignErrorReporter) {
    if (input.removeCultivar == this.cultivar_id) {
        await individual.remove_cultivar_id(this.getIdValue(), input.removeCultivar, benignErrorReporter);
        this.cultivar_id = null;
    }
}

/**
 * remove_field_plot - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_field_plot = async function(input, benignErrorReporter) {
    if (input.removeField_plot == this.field_plot_id) {
        await individual.remove_field_plot_id(this.getIdValue(), input.removeField_plot, benignErrorReporter);
        this.field_plot_id = null;
    }
}

/**
 * remove_pot - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
individual.prototype.remove_pot = async function(input, benignErrorReporter) {
    if (input.removePot == this.pot_id) {
        await individual.remove_pot_id(this.getIdValue(), input.removePot, benignErrorReporter);
        this.pot_id = null;
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

    let individual = await resolvers.readOneIndividual({
        id: id
    }, context);
    //check that record actually exists
    if (individual === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(individual.countFilteredSamples({}, context));
    promises_to_many.push(individual.countFilteredPlant_measurements({}, context));
    promises_to_many.push(individual.countFilteredTranscript_counts({}, context));
    promises_to_one.push(individual.cultivar({}, context));
    promises_to_one.push(individual.field_plot({}, context));
    promises_to_one.push(individual.pot({}, context));

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
        throw new Error(`individual with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * individuals - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    individuals: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "individuals");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await individual.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * individualsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    individualsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "individualsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await individual.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneIndividual - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneIndividual: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneIndividual");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await individual.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countIndividuals - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countIndividuals: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await individual.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableIndividual - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableIndividual: async function(_, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            return helper.vueTable(context.request, individual, ["id", "name", "developmental_state", "life_cycle_phase", "location_type"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addIndividual - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addIndividual: async function(input, context) {
        let authorization = await checkAuthorization(context, 'individual', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdIndividual = await individual.addOne(inputSanitized, benignErrorReporter);
            await createdIndividual.handleAssociations(inputSanitized, benignErrorReporter);
            return createdIndividual;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddIndividualCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddIndividualCsv: async function(_, context) {
        if (await checkAuthorization(context, 'individual', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return individual.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteIndividual - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteIndividual: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'individual', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return individual.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateIndividual - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateIndividual: async function(input, context) {
        let authorization = await checkAuthorization(context, 'individual', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedIndividual = await individual.updateOne(inputSanitized, benignErrorReporter);
            await updatedIndividual.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedIndividual;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateIndividualWithCultivar_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateIndividualWithCultivar_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cultivar_id
            }) => cultivar_id)), models.cultivar);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkAssociateIndividualWithCultivar_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateIndividualWithField_plot_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateIndividualWithField_plot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                field_plot_id
            }) => field_plot_id)), models.field_plot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkAssociateIndividualWithField_plot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateIndividualWithPot_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateIndividualWithPot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                pot_id
            }) => pot_id)), models.pot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkAssociateIndividualWithPot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateIndividualWithCultivar_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateIndividualWithCultivar_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                cultivar_id
            }) => cultivar_id)), models.cultivar);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkDisAssociateIndividualWithCultivar_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateIndividualWithField_plot_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateIndividualWithField_plot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                field_plot_id
            }) => field_plot_id)), models.field_plot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkDisAssociateIndividualWithField_plot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateIndividualWithPot_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateIndividualWithPot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                pot_id
            }) => pot_id)), models.pot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), individual);
        }
        return await individual.bulkDisAssociateIndividualWithPot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateIndividual - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateIndividual: async function(_, context) {
        if (await checkAuthorization(context, 'individual', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return individual.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}