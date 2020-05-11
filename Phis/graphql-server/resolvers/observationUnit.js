/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const observationUnit = require(path.join(__dirname, '..', 'models_index.js')).observationUnit;
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
    'addObservationUnitPosition': 'observationUnitPosition',
    'addGermplasm': 'germplasm',
    'addLocation': 'location',
    'addProgram': 'program',
    'addStudy': 'study',
    'addTrial': 'trial',
    'addObservationTreatments': 'observationTreatment',
    'addObservations': 'observation',
    'addImages': 'image',
    'addObservationUnitToEvents': 'observationUnit_to_event'
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
    if (helper.isNotUndefinedAndNotNull(this.observationUnitDbId)) {
        try {
            if (search === undefined) {
                return resolvers.readOneObservationUnitPosition({
                    [models.observationUnitPosition.idAttribute()]: this.observationUnitDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.observationUnitPosition.idAttribute(),
                    "value": {
                        "value": this.observationUnitDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.observationUnitPositionsConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
    }
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
        try {
            if (search === undefined) {
                return resolvers.readOneGermplasm({
                    [models.germplasm.idAttribute()]: this.germplasmDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.germplasm.idAttribute(),
                    "value": {
                        "value": this.germplasmDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.germplasmsConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
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
        try {
            if (search === undefined) {
                return resolvers.readOneLocation({
                    [models.location.idAttribute()]: this.locationDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.location.idAttribute(),
                    "value": {
                        "value": this.locationDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.locationsConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
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
        try {
            if (search === undefined) {
                return resolvers.readOneProgram({
                    [models.program.idAttribute()]: this.programDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.program.idAttribute(),
                    "value": {
                        "value": this.programDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.programsConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
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
        try {
            if (search === undefined) {
                return resolvers.readOneStudy({
                    [models.study.idAttribute()]: this.studyDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.study.idAttribute(),
                    "value": {
                        "value": this.studyDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.studiesConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
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
        try {
            if (search === undefined) {
                return resolvers.readOneTrial({
                    [models.trial.idAttribute()]: this.trialDbId
                }, context)
            } else {
                //build new search filter
                let nsearch = helper.addSearchField({
                    "search": search,
                    "field": models.trial.idAttribute(),
                    "value": {
                        "value": this.trialDbId
                    },
                    "operator": "eq"
                });
                let found = await resolvers.trialsConnection({
                    search: nsearch
                }, context);
                if (found) {
                    return found[0]
                }
                return found;
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        };
    }
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
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countObservationTreatments({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
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
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.observationTreatmentsConnection({
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
 * observationUnit.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredObservations = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countObservations({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
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
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.observationsConnection({
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
 * observationUnit.prototype.countFilteredImages - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredImages = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countImages({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
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
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.imagesConnection({
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
 * observationUnit.prototype.countFilteredObservationUnitToEvents - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
observationUnit.prototype.countFilteredObservationUnitToEvents = function({
    search
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.countObservationUnit_to_events({
            search: nsearch
        }, context);
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}


/**
 * observationUnit.prototype.observationUnitToEventsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
observationUnit.prototype.observationUnitToEventsConnection = function({
    search,
    order,
    pagination
}, context) {
    try {

        //build new search filter
        let nsearch = helper.addSearchField({
            "search": search,
            "field": "observationUnitDbId",
            "value": {
                "value": this.getIdValue()
            },
            "operator": "eq"
        });

        return resolvers.observationUnit_to_eventsConnection({
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
observationUnit.prototype.handleAssociations = async function(input, context) {
    try {
        let promises = [];
        if (helper.isNonEmptyArray(input.addObservationTreatments)) {
            promises.push(this.add_observationTreatments(input, context));
        }
        if (helper.isNonEmptyArray(input.addObservations)) {
            promises.push(this.add_observations(input, context));
        }
        if (helper.isNonEmptyArray(input.addImages)) {
            promises.push(this.add_images(input, context));
        }
        if (helper.isNonEmptyArray(input.addObservationUnitToEvents)) {
            promises.push(this.add_observationUnitToEvents(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addObservationUnitPosition)) {
            promises.push(this.add_observationUnitPosition(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addGermplasm)) {
            promises.push(this.add_germplasm(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addLocation)) {
            promises.push(this.add_location(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addProgram)) {
            promises.push(this.add_program(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
            promises.push(this.add_study(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.addTrial)) {
            promises.push(this.add_trial(input, context));
        }
        if (helper.isNonEmptyArray(input.removeObservationTreatments)) {
            promises.push(this.remove_observationTreatments(input, context));
        }
        if (helper.isNonEmptyArray(input.removeObservations)) {
            promises.push(this.remove_observations(input, context));
        }
        if (helper.isNonEmptyArray(input.removeImages)) {
            promises.push(this.remove_images(input, context));
        }
        if (helper.isNonEmptyArray(input.removeObservationUnitToEvents)) {
            promises.push(this.remove_observationUnitToEvents(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeObservationUnitPosition)) {
            promises.push(this.remove_observationUnitPosition(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeGermplasm)) {
            promises.push(this.remove_germplasm(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeLocation)) {
            promises.push(this.remove_location(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeProgram)) {
            promises.push(this.remove_program(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
            promises.push(this.remove_study(input, context));
        }
        if (helper.isNotUndefinedAndNotNull(input.removeTrial)) {
            promises.push(this.remove_trial(input, context));
        }

        await Promise.all(promises);
    } catch (error) {
        throw error
    }
}
/**
 * add_observationTreatments - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_observationTreatments = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addObservationTreatments) {
        results.push(models.observationTreatment.add_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * add_observations - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_observations = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addObservations) {
        results.push(models.observation.add_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * add_images - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_images = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addImages) {
        results.push(models.image.add_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * add_observationUnitToEvents - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_observationUnitToEvents = async function(input) {
    let results = [];
    for await (associatedRecordId of input.addObservationUnitToEvents) {
        results.push(models.observationUnit_to_event.add_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * add_germplasm - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_germplasm = async function(input) {
    await observationUnit.add_germplasmDbId(this.getIdValue(), input.addGermplasm);
    this.germplasmDbId = input.addGermplasm;
}
/**
 * add_location - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_location = async function(input) {
    await observationUnit.add_locationDbId(this.getIdValue(), input.addLocation);
    this.locationDbId = input.addLocation;
}
/**
 * add_program - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_program = async function(input) {
    await observationUnit.add_programDbId(this.getIdValue(), input.addProgram);
    this.programDbId = input.addProgram;
}
/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_study = async function(input) {
    await observationUnit.add_studyDbId(this.getIdValue(), input.addStudy);
    this.studyDbId = input.addStudy;
}
/**
 * add_trial - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 */
observationUnit.prototype.add_trial = async function(input) {
    await observationUnit.add_trialDbId(this.getIdValue(), input.addTrial);
    this.trialDbId = input.addTrial;
}
/**
 * remove_observationTreatments - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_observationTreatments = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeObservationTreatments) {
        results.push(models.observationTreatment.remove_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_observations = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeObservations) {
        results.push(models.observation.remove_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * remove_images - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_images = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeImages) {
        results.push(models.image.remove_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * remove_observationUnitToEvents - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_observationUnitToEvents = async function(input) {
    let results = [];
    for await (associatedRecordId of input.removeObservationUnitToEvents) {
        results.push(models.observationUnit_to_event.remove_observationUnitDbId(associatedRecordId, this.getIdValue()));
    }
    await Promise.all(results);
}

/**
 * remove_germplasm - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_germplasm = async function(input) {
    if (input.removeGermplasm == this.germplasmDbId) {
        await observationUnit.remove_germplasmDbId(this.getIdValue(), input.removeGermplasm);
        this.germplasmDbId = null;
    }
}
/**
 * remove_location - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_location = async function(input) {
    if (input.removeLocation == this.locationDbId) {
        await observationUnit.remove_locationDbId(this.getIdValue(), input.removeLocation);
        this.locationDbId = null;
    }
}
/**
 * remove_program - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_program = async function(input) {
    if (input.removeProgram == this.programDbId) {
        await observationUnit.remove_programDbId(this.getIdValue(), input.removeProgram);
        this.programDbId = null;
    }
}
/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_study = async function(input) {
    if (input.removeStudy == this.studyDbId) {
        await observationUnit.remove_studyDbId(this.getIdValue(), input.removeStudy);
        this.studyDbId = null;
    }
}
/**
 * remove_trial - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 */
observationUnit.prototype.remove_trial = async function(input) {
    if (input.removeTrial == this.trialDbId) {
        await observationUnit.remove_trialDbId(this.getIdValue(), input.removeTrial);
        this.trialDbId = null;
    }
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
    if (await observationUnit.countRecords(search).sum > context.recordsLimit) {
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
        throw new Error(errorMessageForRecordsLimit("readOneObservationUnit"));
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
    promises_to_many.push(observationUnit.countFilteredObservationUnitToEvents({}, context));
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

    if (context.benignErrors.length > 0) {
        throw new Error('Errors occurred when counting associated records. No deletion permitted for reasons of security.');
    }

    return true;
}

module.exports = {

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
        //check: adapters
        let registeredAdapters = Object.values(observationUnit.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observationUnit"');
        } //else

        try {
            //exclude adapters
            let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "observationUnit"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {
                let connectionObj = await observationUnit.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters);
                //check adapter authorization Errors
                if (authorizationCheck.authorizationErrors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
                }
                //check Errors returned by the model layer (time-outs, unreachable, etc...)
                if (connectionObj.errors !== undefined && Array.isArray(connectionObj.errors) && connectionObj.errors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(connectionObj.errors)
                    delete connectionObj['errors']
                }
                return connectionObj;
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "observationUnit" ');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
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
        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observationUnit.adapterForIri(observationUnitDbId), 'read');
            if (authorizationCheck === true) {
                return observationUnit.readById(observationUnitDbId);
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * addObservationUnit - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addObservationUnit: async function(input, context) {
        //check: input has idAttribute
        if (!input.observationUnitDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationUnitDbId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observationUnit.adapterForIri(input.observationUnitDbId), 'create');
            if (authorizationCheck === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let createdRecord = await observationUnit.addOne(inputSanitized);
                await createdRecord.handleAssociations(inputSanitized, context);
                return createdRecord;
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },


    /**
     * bulkAddObservationUnitCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddObservationUnitCsv: function(_, context) {
        return checkAuthorization(context, 'observationUnit', 'create').then(authorization => {
            if (authorization === true) {
                return observationUnit.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
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
        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observationUnit.adapterForIri(observationUnitDbId), 'delete');
            if (authorizationCheck === true) {
                if (await validForDeletion(observationUnitDbId, context)) {
                    return observationUnit.deleteOne(observationUnitDbId);
                }
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * updateObservationUnit - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateObservationUnit: async function(input, context) {
        //check: input has idAttribute
        if (!input.observationUnitDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationUnitDbId'.`);
        }

        //check: adapters auth
        try {
            let authorizationCheck = await checkAuthorization(context, observationUnit.adapterForIri(input.observationUnitDbId), 'update');
            if (authorizationCheck === true) {
                let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
                await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'update'], models);
                await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
                if (!input.skipAssociationsExistenceChecks) {
                    await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
                }
                let updatedRecord = await observationUnit.updateOne(inputSanitized);
                await updatedRecord.handleAssociations(inputSanitized, context);
                return updatedRecord;
            } else { //adapter not auth
                throw new Error("You don't have authorization to perform this action on adapter");
            }
        } catch (error) {
            console.error(error);
            handleError(error);
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
        //check: adapters
        let registeredAdapters = Object.values(observationUnit.registeredAdapters);
        if (registeredAdapters.length === 0) {
            throw new Error('No adapters registered for data model "observationUnit"');
        } //else

        try {
            //exclude adapters
            let adapters = helper.removeExcludedAdapters(search, registeredAdapters);
            if (adapters.length === 0) {
                throw new Error('All adapters was excluded for data model "observationUnit"');
            } //else

            //check: auth adapters
            let authorizationCheck = await helper.authorizedAdapters(context, adapters, 'read');
            if (authorizationCheck.authorizedAdapters.length > 0) {

                let countObj = await observationUnit.countRecords(search, authorizationCheck.authorizedAdapters);
                //check adapter authorization Errors
                if (authorizationCheck.authorizationErrors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(authorizationCheck.authorizationErrors);
                }
                //check Errors returned by the model layer (time-outs, unreachable, etc...)
                if (countObj.errors !== undefined && Array.isArray(countObj.errors) && countObj.errors.length > 0) {
                    context.benignErrors = context.benignErrors.concat(countObj.errors)
                    delete countObj['errors']
                }
                return countObj.sum;
            } else { //adapters not auth || errors
                // else new Error
                if (authorizationCheck.authorizationErrors.length > 0) {
                    throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                } else {
                    throw new Error('No available adapters for data model "observationUnit"');
                }
            }
        } catch (error) {
            console.error(error);
            handleError(error);
        }
    },

    /**
     * csvTableTemplateObservationUnit - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateObservationUnit: function(_, context) {
        return checkAuthorization(context, 'observationUnit', 'read').then(authorization => {
            if (authorization === true) {
                return observationUnit.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}