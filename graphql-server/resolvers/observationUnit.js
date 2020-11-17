/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observationUnit = require(path.join(__dirname, '..', 'models', 'index.js')).observationUnit;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addObservationUnitPosition': 'observationUnitPosition',
    'addGermplasm': 'germplasm',
    'addLocation': 'location',
    'addProgram': 'program',
    'addStudy': 'study',
    'addTrial': 'trial',
    'addObservationTreatments': 'observationTreatment',
    'addObservations': 'observation',
    'addImages': 'image',
    'addEvents': 'event'
}



/**
 * observationUnit.prototype.observationUnitPosition - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.observationUnitPosition = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    let found = await resolvers.observationUnitPositions({
        search: nsearch,
        pagination: {
            limit: 2
        }
    }, context);
    if (found) {
        if (found.length > 1) {
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found > 1 observationUnitPositions matching observationUnit with observationUnitDbId ${this.getIdValue()}. Consider making this a "to_many" association, or using unique constraints, or moving the foreign key into the observationUnit model. Returning first observationUnitPosition.`
            ));
        }
        return found[0];
    }
    return found;
}
/**
 * observationUnit.prototype.germplasm - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.germplasm = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.germplasmDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneGermplasm({
                [models.germplasm.idAttribute()]: this.germplasmDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.germplasm.idAttribute(),
                "value": this.germplasmDbId,
                "operator": "eq"
            });
            let found = await resolvers.germplasms({
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
 * observationUnit.prototype.location - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.location = async function({
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
 * observationUnit.prototype.program - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.program = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.programDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProgram({
                [models.program.idAttribute()]: this.programDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.program.idAttribute(),
                "value": this.programDbId,
                "operator": "eq"
            });
            let found = await resolvers.programs({
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
 * observationUnit.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.study = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.studyDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.studyDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.studyDbId,
                "operator": "eq"
            });
            let found = await resolvers.studies({
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
 * observationUnit.prototype.trial - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
observationUnit.prototype.trial = async function({
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
 * observationUnit.prototype.observationTreatmentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.observationTreatmentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observationTreatments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observationUnit.prototype.countFilteredObservationTreatments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredObservationTreatments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationTreatments({
        search: nsearch
    }, context);
}

/**
 * observationUnit.prototype.observationTreatmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.observationTreatmentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationTreatmentsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * observationUnit.prototype.observationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.observationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
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
 * observationUnit.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredObservations = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservations({
        search: nsearch
    }, context);
}

/**
 * observationUnit.prototype.observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.observationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
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
 * observationUnit.prototype.imagesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.imagesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.images({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observationUnit.prototype.countFilteredImages - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredImages = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countImages({
        search: nsearch
    }, context);
}

/**
 * observationUnit.prototype.imagesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.imagesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "observationUnitDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.imagesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * observationUnit.prototype.eventsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.eventsFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.event.idAttribute(),
        "value": this.eventDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.events({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * observationUnit.prototype.countFilteredEvents - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredEvents = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.event.idAttribute(),
        "value": this.eventDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countEvents({
        search: nsearch
    }, context);
}

/**
 * observationUnit.prototype.eventsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.eventsConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.event.idAttribute(),
        "value": this.eventDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
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
observationUnit.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservationTreatments)) {
        promises_add.push(this.add_observationTreatments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservations)) {
        promises_add.push(this.add_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addImages)) {
        promises_add.push(this.add_images(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addEvents)) {
        promises_add.push(this.add_events(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addObservationUnitPosition)) {
        promises_add.push(this.add_observationUnitPosition(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addGermplasm)) {
        promises_add.push(this.add_germplasm(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLocation)) {
        promises_add.push(this.add_location(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProgram)) {
        promises_add.push(this.add_program(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addTrial)) {
        promises_add.push(this.add_trial(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservationTreatments)) {
        promises_remove.push(this.remove_observationTreatments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservations)) {
        promises_remove.push(this.remove_observations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeImages)) {
        promises_remove.push(this.remove_images(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeEvents)) {
        promises_remove.push(this.remove_events(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeObservationUnitPosition)) {
        promises_remove.push(this.remove_observationUnitPosition(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeGermplasm)) {
        promises_remove.push(this.remove_germplasm(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLocation)) {
        promises_remove.push(this.remove_location(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProgram)) {
        promises_remove.push(this.remove_program(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeTrial)) {
        promises_remove.push(this.remove_trial(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationTreatments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_observationTreatments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationTreatments.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.observationTreatment.idAttribute()]: associatedRecordId
        }
    });
    await models.observationTreatment.bulkAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservations.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkAssociateObservationWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_images - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_images = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addImages.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.image.idAttribute()]: associatedRecordId
        }
    });
    await models.image.bulkAssociateImageWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_events - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_events = async function(input, benignErrorReporter) {

    await observationUnit.add_eventDbIds(this.getIdValue(), input.addEvents, benignErrorReporter);
    this.eventDbIds = helper.unionIds(this.eventDbIds, input.addEvents);
}

/**
 * add_observationUnitPosition - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_observationUnitPosition = async function(input, benignErrorReporter) {
    await models.observationUnitPosition.add_observationUnitDbId(input.addObservationUnitPosition, this.getIdValue(), benignErrorReporter);
}

/**
 * add_germplasm - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_germplasm = async function(input, benignErrorReporter) {
    await observationUnit.add_germplasmDbId(this.getIdValue(), input.addGermplasm, benignErrorReporter);
    this.germplasmDbId = input.addGermplasm;
}

/**
 * add_location - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_location = async function(input, benignErrorReporter) {
    await observationUnit.add_locationDbId(this.getIdValue(), input.addLocation, benignErrorReporter);
    this.locationDbId = input.addLocation;
}

/**
 * add_program - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_program = async function(input, benignErrorReporter) {
    await observationUnit.add_programDbId(this.getIdValue(), input.addProgram, benignErrorReporter);
    this.programDbId = input.addProgram;
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_study = async function(input, benignErrorReporter) {
    await observationUnit.add_studyDbId(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.studyDbId = input.addStudy;
}

/**
 * add_trial - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.add_trial = async function(input, benignErrorReporter) {
    await observationUnit.add_trialDbId(this.getIdValue(), input.addTrial, benignErrorReporter);
    this.trialDbId = input.addTrial;
}

/**
 * remove_observationTreatments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_observationTreatments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationTreatments.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.observationTreatment.idAttribute()]: associatedRecordId
        }
    });
    await models.observationTreatment.bulkDisAssociateObservationTreatmentWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservations.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkDisAssociateObservationWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_images - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_images = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeImages.map(associatedRecordId => {
        return {
            observationUnitDbId: this.getIdValue(),
            [models.image.idAttribute()]: associatedRecordId
        }
    });
    await models.image.bulkDisAssociateImageWithObservationUnitDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_events - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_events = async function(input, benignErrorReporter) {

    await observationUnit.remove_eventDbIds(this.getIdValue(), input.removeEvents, benignErrorReporter);
    this.eventDbIds = helper.differenceIds(this.eventDbIds, input.removeEvents);
}

/**
 * remove_observationUnitPosition - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_observationUnitPosition = async function(input, benignErrorReporter) {
    await models.observationUnitPosition.remove_observationUnitDbId(input.removeObservationUnitPosition, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_germplasm - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_germplasm = async function(input, benignErrorReporter) {
    if (input.removeGermplasm == this.germplasmDbId) {
        await observationUnit.remove_germplasmDbId(this.getIdValue(), input.removeGermplasm, benignErrorReporter);
        this.germplasmDbId = null;
    }
}

/**
 * remove_location - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_location = async function(input, benignErrorReporter) {
    if (input.removeLocation == this.locationDbId) {
        await observationUnit.remove_locationDbId(this.getIdValue(), input.removeLocation, benignErrorReporter);
        this.locationDbId = null;
    }
}

/**
 * remove_program - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_program = async function(input, benignErrorReporter) {
    if (input.removeProgram == this.programDbId) {
        await observationUnit.remove_programDbId(this.getIdValue(), input.removeProgram, benignErrorReporter);
        this.programDbId = null;
    }
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.studyDbId) {
        await observationUnit.remove_studyDbId(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.studyDbId = null;
    }
}

/**
 * remove_trial - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
observationUnit.prototype.remove_trial = async function(input, benignErrorReporter) {
    if (input.removeTrial == this.trialDbId) {
        await observationUnit.remove_trialDbId(this.getIdValue(), input.removeTrial, benignErrorReporter);
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

    let observationUnit = await resolvers.readOneObservationUnit({
        observationUnitDbId: id
    }, context);
    //check that record actually exists
    if (observationUnit === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(observationUnit.countFilteredObservationTreatments({}, context));
    promises_to_many.push(observationUnit.countFilteredObservations({}, context));
    promises_to_many.push(observationUnit.countFilteredImages({}, context));
    promises_to_many.push(observationUnit.countFilteredEvents({}, context));
    promises_to_one.push(observationUnit.observationUnitPosition({}, context));
    promises_to_one.push(observationUnit.germplasm({}, context));
    promises_to_one.push(observationUnit.location({}, context));
    promises_to_one.push(observationUnit.program({}, context));
    promises_to_one.push(observationUnit.study({}, context));
    promises_to_one.push(observationUnit.trial({}, context));

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
        throw new Error(`observationUnit with observationUnitDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * observationUnits - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    observationUnits: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "observationUnits");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationUnit.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    observationUnitsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "observationUnitsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationUnit.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneObservationUnit - Check user authorization and return one record with the specified observationUnitDbId in the observationUnitDbId argument.
     *
     * @param  {number} {observationUnitDbId}    observationUnitDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with observationUnitDbId requested
     */
    readOneObservationUnit: async function({
        observationUnitDbId
    }, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneObservationUnit");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationUnit.readById(observationUnitDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countObservationUnits - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countObservationUnits: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await observationUnit.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableObservationUnit - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableObservationUnit: async function(_, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            return helper.vueTable(context.request, observationUnit, ["id", "observationLevel", "observationUnitName", "observationUnitPUI", "plantNumber", "plotNumber", "programDbId", "studyDbId", "trialDbId", "observationUnitDbId", "germplasmDbId", "locationDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addObservationUnit - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservationUnit: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationUnit', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdObservationUnit = await observationUnit.addOne(inputSanitized, benignErrorReporter);
            await createdObservationUnit.handleAssociations(inputSanitized, benignErrorReporter);
            return createdObservationUnit;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddObservationUnitCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationUnitCsv: async function(_, context) {
        if (await checkAuthorization(context, 'observationUnit', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationUnit.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteObservationUnit - Check user authorization and delete a record with the specified observationUnitDbId in the observationUnitDbId argument.
     *
     * @param  {number} {observationUnitDbId}    observationUnitDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteObservationUnit: async function({
        observationUnitDbId
    }, context) {
        if (await checkAuthorization(context, 'observationUnit', 'delete') === true) {
            if (await validForDeletion(observationUnitDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return observationUnit.deleteOne(observationUnitDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateObservationUnit - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservationUnit: async function(input, context) {
        let authorization = await checkAuthorization(context, 'observationUnit', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedObservationUnit = await observationUnit.updateOne(inputSanitized, benignErrorReporter);
            await updatedObservationUnit.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedObservationUnit;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateObservationUnitWithGermplasmDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitWithGermplasmDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), models.germplasm);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationUnitWithLocationDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitWithLocationDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationDbId
            }) => locationDbId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationUnitWithProgramDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitWithProgramDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), models.program);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkAssociateObservationUnitWithProgramDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationUnitWithStudyDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateObservationUnitWithTrialDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateObservationUnitWithTrialDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), models.trial);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationUnitWithGermplasmDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitWithGermplasmDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), models.germplasm);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationUnitWithLocationDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitWithLocationDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                locationDbId
            }) => locationDbId)), models.location);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationUnitWithProgramDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitWithProgramDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), models.program);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkDisAssociateObservationUnitWithProgramDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationUnitWithStudyDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitWithStudyDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                studyDbId
            }) => studyDbId)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateObservationUnitWithTrialDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateObservationUnitWithTrialDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                trialDbId
            }) => trialDbId)), models.trial);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                observationUnitDbId
            }) => observationUnitDbId)), observationUnit);
        }
        return await observationUnit.bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateObservationUnit - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservationUnit: async function(_, context) {
        if (await checkAuthorization(context, 'observationUnit', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return observationUnit.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}