/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const study = require(path.join(__dirname, '..', 'models', 'index.js')).study;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addLocation': 'location',
    'addTrial': 'trial',
    'addContacts': 'contact',
    'addEnvironmentParameters': 'environmentParameter',
    'addSeasons': 'season',
    'addObservationUnits': 'observationUnit',
    'addObservations': 'observation',
    'addEvents': 'event'
}



/**
 * study.prototype.location - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
study.prototype.location = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.locationDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneLocation({
                [models.location.idAttribute()]: this.locationDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.location.idAttribute(),
                "value": this.locationDbId,
                "operator": "eq"
            });
            let found = await resolvers.locations({
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
 * study.prototype.trial - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
study.prototype.trial = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.trialDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneTrial({
                [models.trial.idAttribute()]: this.trialDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.trial.idAttribute(),
                "value": this.trialDbId,
                "operator": "eq"
            });
            let found = await resolvers.trials({
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
 * study.prototype.contactsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.contactsFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.contacts({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredContacts - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredContacts = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countContacts({
        search: nsearch
    }, context);
}

/**
 * study.prototype.contactsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.contactsConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contactDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.contactsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.environmentParametersFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.environmentParametersFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.environmentParameters({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredEnvironmentParameters - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredEnvironmentParameters = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countEnvironmentParameters({
        search: nsearch
    }, context);
}

/**
 * study.prototype.environmentParametersConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.environmentParametersConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.environmentParametersConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.seasonsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.seasonsFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.season.idAttribute(),
        "value": this.seasonDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.seasons({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredSeasons - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredSeasons = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.season.idAttribute(),
        "value": this.seasonDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countSeasons({
        search: nsearch
    }, context);
}

/**
 * study.prototype.seasonsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.seasonsConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.season.idAttribute(),
        "value": this.seasonDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.seasonsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.observationUnitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.observationUnitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observationUnits({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredObservationUnits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredObservationUnits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationUnits({
        search: nsearch
    }, context);
}

/**
 * study.prototype.observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.observationUnitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationUnitsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.observationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.observationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredObservations = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservations({
        search: nsearch
    }, context);
}

/**
 * study.prototype.observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.observationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.eventsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.eventsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.events({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredEvents - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredEvents = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countEvents({
        search: nsearch
    }, context);
}

/**
 * study.prototype.eventsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.eventsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "studyDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.eventsConnection({
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
study.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addContacts)) {
        promises_add.push(this.add_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addEnvironmentParameters)) {
        promises_add.push(this.add_environmentParameters(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addSeasons)) {
        promises_add.push(this.add_seasons(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservationUnits)) {
        promises_add.push(this.add_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservations)) {
        promises_add.push(this.add_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addEvents)) {
        promises_add.push(this.add_events(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLocation)) {
        promises_add.push(this.add_location(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTrial)) {
        promises_add.push(this.add_trial(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeContacts)) {
        promises_remove.push(this.remove_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeEnvironmentParameters)) {
        promises_remove.push(this.remove_environmentParameters(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeSeasons)) {
        promises_remove.push(this.remove_seasons(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservationUnits)) {
        promises_remove.push(this.remove_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservations)) {
        promises_remove.push(this.remove_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeEvents)) {
        promises_remove.push(this.remove_events(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLocation)) {
        promises_remove.push(this.remove_location(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTrial)) {
        promises_remove.push(this.remove_trial(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_contacts - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_contacts = async function(input, benignErrorReporter) {

    await study.add_contactDbIds(this.getIdValue(), input.addContacts, benignErrorReporter);
    this.contactDbIds = helper.unionIds(this.contactDbIds, input.addContacts);
}

/**
 * add_environmentParameters - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_environmentParameters = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addEnvironmentParameters.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.environmentParameter.idAttribute()]: associatedRecordId
        }
    });
    await models.environmentParameter.bulkAssociateEnvironmentParameterWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_seasons - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_seasons = async function(input, benignErrorReporter) {

    await study.add_seasonDbIds(this.getIdValue(), input.addSeasons, benignErrorReporter);
    this.seasonDbIds = helper.unionIds(this.seasonDbIds, input.addSeasons);
}

/**
 * add_observationUnits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationUnits.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservations.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkAssociateObservationWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_events - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_events = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addEvents.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.event.idAttribute()]: associatedRecordId
        }
    });
    await models.event.bulkAssociateEventWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_location - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_location = async function(input, benignErrorReporter) {
    await study.add_locationDbId(this.getIdValue(), input.addLocation, benignErrorReporter);
    this.locationDbId = input.addLocation;
}

/**
 * add_trial - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_trial = async function(input, benignErrorReporter) {
    await study.add_trialDbId(this.getIdValue(), input.addTrial, benignErrorReporter);
    this.trialDbId = input.addTrial;
}

/**
 * remove_contacts - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_contacts = async function(input, benignErrorReporter) {

    await study.remove_contactDbIds(this.getIdValue(), input.removeContacts, benignErrorReporter);
    this.contactDbIds = helper.differenceIds(this.contactDbIds, input.removeContacts);
}

/**
 * remove_environmentParameters - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_environmentParameters = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeEnvironmentParameters.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.environmentParameter.idAttribute()]: associatedRecordId
        }
    });
    await models.environmentParameter.bulkDisAssociateEnvironmentParameterWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_seasons - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_seasons = async function(input, benignErrorReporter) {

    await study.remove_seasonDbIds(this.getIdValue(), input.removeSeasons, benignErrorReporter);
    this.seasonDbIds = helper.differenceIds(this.seasonDbIds, input.removeSeasons);
}

/**
 * remove_observationUnits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationUnits.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservations.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkDisAssociateObservationWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_events - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_events = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeEvents.map(associatedRecordId => {
        return {
            studyDbId: this.getIdValue(),
            [models.event.idAttribute()]: associatedRecordId
        }
    });
    await models.event.bulkDisAssociateEventWithStudyDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_location - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_location = async function(input, benignErrorReporter) {
    if (input.removeLocation == this.locationDbId) {
        await study.remove_locationDbId(this.getIdValue(), input.removeLocation, benignErrorReporter);
        this.locationDbId = null;
    }
}

/**
 * remove_trial - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_trial = async function(input, benignErrorReporter) {
    if (input.removeTrial == this.trialDbId) {
        await study.remove_trialDbId(this.getIdValue(), input.removeTrial, benignErrorReporter);
        this.trialDbId = null;
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

    let study = await resolvers.readOneStudy({
        studyDbId: id
    }, context);
    //check that record actually exists
    if (study === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(study.countFilteredContacts({}, context));
    promises_to_many.push(study.countFilteredEnvironmentParameters({}, context));
    promises_to_many.push(study.countFilteredSeasons({}, context));
    promises_to_many.push(study.countFilteredObservationUnits({}, context));
    promises_to_many.push(study.countFilteredObservations({}, context));
    promises_to_many.push(study.countFilteredEvents({}, context));
    promises_to_one.push(study.location({}, context));
    promises_to_one.push(study.trial({}, context));

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
        throw new Error(`study with studyDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * studies - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    studies: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "studies");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    studiesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "studiesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneStudy - Check user authorization and return one record with the specified studyDbId in the studyDbId argument.
     *
     * @param  {number} {studyDbId}    studyDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with studyDbId requested
     */
    readOneStudy: async function({
        studyDbId
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneStudy");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readById(studyDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countStudies - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countStudies: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableStudy - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableStudy: async function(_, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            return helper.vueTable(context.request, study, ["id", "studyDbId", "commonCropName", "culturalPractices", "documentationURL", "license", "observationUnitsDescription", "studyDescription", "studyName", "studyType", "trialDbId", "locationDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addStudy - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addStudy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'study', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdStudy = await study.addOne(inputSanitized, benignErrorReporter);
            await createdStudy.handleAssociations(inputSanitized, benignErrorReporter);
            return createdStudy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddStudyCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddStudyCsv: async function(_, context) {
        if (await checkAuthorization(context, 'study', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return study.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteStudy - Check user authorization and delete a record with the specified studyDbId in the studyDbId argument.
     *
     * @param  {number} {studyDbId}    studyDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteStudy: async function({
        studyDbId
    }, context) {
        if (await checkAuthorization(context, 'study', 'delete') === true) {
            if (await validForDeletion(studyDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return study.deleteOne(studyDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateStudy - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateStudy: async function(input, context) {
        let authorization = await checkAuthorization(context, 'study', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedStudy = await study.updateOne(inputSanitized, benignErrorReporter);
            await updatedStudy.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedStudy;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateStudyWithLocationDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateStudyWithLocationDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationDbId
            }) => locationDbId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), study);
        }
        return await study.bulkAssociateStudyWithLocationDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateStudyWithTrialDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateStudyWithTrialDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), models.trial);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), study);
        }
        return await study.bulkAssociateStudyWithTrialDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateStudyWithLocationDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateStudyWithLocationDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationDbId
            }) => locationDbId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), study);
        }
        return await study.bulkDisAssociateStudyWithLocationDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateStudyWithTrialDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateStudyWithTrialDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), models.trial);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), study);
        }
        return await study.bulkDisAssociateStudyWithTrialDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateStudy - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateStudy: async function(_, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return study.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}