/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const sample = require(path.join(__dirname, '..', 'models', 'index.js')).sample;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addParent': 'sample',
    'addIndividual': 'individual',
    'addPot': 'pot',
    'addField_plot': 'field_plot',
    'addSamples': 'sample',
    'addMicrobiome_asvs': 'microbiome_asv',
    'addSample_measurements': 'sample_measurement'
}



/**
 * sample.prototype.parent - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.parent = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.sample_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneSample({
                [models.sample.idAttribute()]: this.sample_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.sample.idAttribute(),
                "value": this.sample_id,
                "operator": "eq"
            });
            let found = await resolvers.samples({
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
 * sample.prototype.individual - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.individual = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.individual_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneIndividual({
                [models.individual.idAttribute()]: this.individual_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.individual.idAttribute(),
                "value": this.individual_id,
                "operator": "eq"
            });
            let found = await resolvers.individuals({
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
 * sample.prototype.pot - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.pot = async function({
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
 * sample.prototype.field_plot - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
sample.prototype.field_plot = async function({
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
 * sample.prototype.samplesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample.prototype.samplesFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
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
 * sample.prototype.countFilteredSamples - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample.prototype.countFilteredSamples = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * sample.prototype.samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sample.prototype.samplesConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
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
 * sample.prototype.microbiome_asvsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample.prototype.microbiome_asvsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.microbiome_asvs({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * sample.prototype.countFilteredMicrobiome_asvs - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample.prototype.countFilteredMicrobiome_asvs = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countMicrobiome_asvs({
        search: nsearch
    }, context);
}

/**
 * sample.prototype.microbiome_asvsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sample.prototype.microbiome_asvsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.microbiome_asvsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * sample.prototype.sample_measurementsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
sample.prototype.sample_measurementsFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.sample_measurements({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * sample.prototype.countFilteredSample_measurements - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
sample.prototype.countFilteredSample_measurements = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.countSample_measurements({
        search: nsearch
    }, context);
}

/**
 * sample.prototype.sample_measurementsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
sample.prototype.sample_measurementsConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "sample_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.sample_measurementsConnection({
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
sample.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addSamples)) {
        promises.push(this.add_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMicrobiome_asvs)) {
        promises.push(this.add_microbiome_asvs(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSample_measurements)) {
        promises.push(this.add_sample_measurements(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addParent)) {
        promises.push(this.add_parent(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addIndividual)) {
        promises.push(this.add_individual(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addPot)) {
        promises.push(this.add_pot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addField_plot)) {
        promises.push(this.add_field_plot(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSamples)) {
        promises.push(this.remove_samples(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMicrobiome_asvs)) {
        promises.push(this.remove_microbiome_asvs(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSample_measurements)) {
        promises.push(this.remove_sample_measurements(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeParent)) {
        promises.push(this.remove_parent(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeIndividual)) {
        promises.push(this.remove_individual(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removePot)) {
        promises.push(this.remove_pot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeField_plot)) {
        promises.push(this.remove_field_plot(input, benignErrorReporter));
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
sample.prototype.add_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addSamples.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkAssociateSampleWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_microbiome_asvs - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_microbiome_asvs = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addMicrobiome_asvs.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.microbiome_asv.idAttribute()]: associatedRecordId
        }
    });
    await models.microbiome_asv.bulkAssociateMicrobiome_asvWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_sample_measurements - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_sample_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.addSample_measurements.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.sample_measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.sample_measurement.bulkAssociateSample_measurementWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_parent - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_parent = async function(input, benignErrorReporter) {
    await sample.add_sample_id(this.getIdValue(), input.addParent, benignErrorReporter);
    this.sample_id = input.addParent;
}

/**
 * add_individual - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_individual = async function(input, benignErrorReporter) {
    await sample.add_individual_id(this.getIdValue(), input.addIndividual, benignErrorReporter);
    this.individual_id = input.addIndividual;
}

/**
 * add_pot - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_pot = async function(input, benignErrorReporter) {
    await sample.add_pot_id(this.getIdValue(), input.addPot, benignErrorReporter);
    this.pot_id = input.addPot;
}

/**
 * add_field_plot - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.add_field_plot = async function(input, benignErrorReporter) {
    await sample.add_field_plot_id(this.getIdValue(), input.addField_plot, benignErrorReporter);
    this.field_plot_id = input.addField_plot;
}

/**
 * remove_samples - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_samples = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeSamples.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.sample.idAttribute()]: associatedRecordId
        }
    });
    await models.sample.bulkDisAssociateSampleWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_microbiome_asvs - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_microbiome_asvs = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeMicrobiome_asvs.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.microbiome_asv.idAttribute()]: associatedRecordId
        }
    });
    await models.microbiome_asv.bulkDisAssociateMicrobiome_asvWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_sample_measurements - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_sample_measurements = async function(input, benignErrorReporter) {
    let bulkAssociationInput = input.removeSample_measurements.map(associatedRecordId => {
        return {
            sample_id: this.getIdValue(),
            [models.sample_measurement.idAttribute()]: associatedRecordId
        }
    });
    await models.sample_measurement.bulkDisAssociateSample_measurementWithSample_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_parent - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_parent = async function(input, benignErrorReporter) {
    if (input.removeParent == this.sample_id) {
        await sample.remove_sample_id(this.getIdValue(), input.removeParent, benignErrorReporter);
        this.sample_id = null;
    }
}

/**
 * remove_individual - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_individual = async function(input, benignErrorReporter) {
    if (input.removeIndividual == this.individual_id) {
        await sample.remove_individual_id(this.getIdValue(), input.removeIndividual, benignErrorReporter);
        this.individual_id = null;
    }
}

/**
 * remove_pot - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_pot = async function(input, benignErrorReporter) {
    if (input.removePot == this.pot_id) {
        await sample.remove_pot_id(this.getIdValue(), input.removePot, benignErrorReporter);
        this.pot_id = null;
    }
}

/**
 * remove_field_plot - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
sample.prototype.remove_field_plot = async function(input, benignErrorReporter) {
    if (input.removeField_plot == this.field_plot_id) {
        await sample.remove_field_plot_id(this.getIdValue(), input.removeField_plot, benignErrorReporter);
        this.field_plot_id = null;
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

    let sample = await resolvers.readOneSample({
        id: id
    }, context);
    //check that record actually exists
    if (sample === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(sample.countFilteredSamples({}, context));
    promises_to_many.push(sample.countFilteredMicrobiome_asvs({}, context));
    promises_to_many.push(sample.countFilteredSample_measurements({}, context));
    promises_to_one.push(sample.parent({}, context));
    promises_to_one.push(sample.individual({}, context));
    promises_to_one.push(sample.pot({}, context));
    promises_to_one.push(sample.field_plot({}, context));

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
        throw new Error(`sample with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * samples - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    samples: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "samples");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * samplesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    samplesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "samplesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneSample - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneSample: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneSample");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countSamples - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countSamples: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await sample.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableSample - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableSample: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            return helper.vueTable(context.request, sample, ["id", "name", "material", "life_cycle_phase", "description", "library", "barcode_sequence"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addSample - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addSample: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdSample = await sample.addOne(inputSanitized, benignErrorReporter);
            await createdSample.handleAssociations(inputSanitized, benignErrorReporter);
            return createdSample;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddSampleCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddSampleCsv: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteSample - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteSample: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'sample', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return sample.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateSample - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateSample: async function(input, context) {
        let authorization = await checkAuthorization(context, 'sample', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedSample = await sample.updateOne(inputSanitized, benignErrorReporter);
            await updatedSample.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedSample;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateSampleWithSample_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSampleWithSample_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_id
            }) => sample_id)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkAssociateSampleWithSample_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateSampleWithIndividual_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSampleWithIndividual_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                individual_id
            }) => individual_id)), models.individual);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkAssociateSampleWithIndividual_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateSampleWithPot_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSampleWithPot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                pot_id
            }) => pot_id)), models.pot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkAssociateSampleWithPot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateSampleWithField_plot_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateSampleWithField_plot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                field_plot_id
            }) => field_plot_id)), models.field_plot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkAssociateSampleWithField_plot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateSampleWithSample_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSampleWithSample_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                sample_id
            }) => sample_id)), models.sample);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkDisAssociateSampleWithSample_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateSampleWithIndividual_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSampleWithIndividual_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                individual_id
            }) => individual_id)), models.individual);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkDisAssociateSampleWithIndividual_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateSampleWithPot_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSampleWithPot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                pot_id
            }) => pot_id)), models.pot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkDisAssociateSampleWithPot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateSampleWithField_plot_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateSampleWithField_plot_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                field_plot_id
            }) => field_plot_id)), models.field_plot);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), sample);
        }
        return await sample.bulkDisAssociateSampleWithField_plot_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateSample - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateSample: async function(_, context) {
        if (await checkAuthorization(context, 'sample', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return sample.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}