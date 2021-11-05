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
    'addInvestigation': 'investigation',
    'addPeople': 'person',
    'addEnvironment_parameters': 'environment',
    'addEvents': 'event',
    'addObservation_units': 'observation_unit',
    'addObserved_variables': 'observed_variable',
    'addBiological_materials': 'biological_material',
    'addFactors': 'factor',
    'addData_files': 'data_file'
}



/**
 * study.prototype.investigation - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
study.prototype.investigation = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.investigation_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneInvestigation({
                [models.investigation.idAttribute()]: this.investigation_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.investigation.idAttribute(),
                "value": this.investigation_id,
                "operator": "eq"
            });
            let found = (await resolvers.investigationsConnection({
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
 * study.prototype.peopleFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.peopleFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_ids) || this.person_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.people({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredPeople - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredPeople = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_ids) || this.person_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.person_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * study.prototype.peopleConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.peopleConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.person_ids) || this.person_ids.length === 0) {
        return {
            edges: [],
            people: [],
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
        "field": models.person.idAttribute(),
        "value": this.person_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.peopleConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.environment_parametersFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.environment_parametersFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.environments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredEnvironment_parameters - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredEnvironment_parameters = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countEnvironments({
        search: nsearch
    }, context);
}

/**
 * study.prototype.environment_parametersConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.environment_parametersConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.environmentsConnection({
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
        "field": "study_id",
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
        "field": "study_id",
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
        "field": "study_id",
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
 * study.prototype.observation_unitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.observation_unitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observation_units({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredObservation_units - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredObservation_units = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservation_units({
        search: nsearch
    }, context);
}

/**
 * study.prototype.observation_unitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.observation_unitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observation_unitsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.observed_variablesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.observed_variablesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observed_variables({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredObserved_variables - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredObserved_variables = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countObserved_variables({
        search: nsearch
    }, context);
}

/**
 * study.prototype.observed_variablesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.observed_variablesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.observed_variable_ids) || this.observed_variable_ids.length === 0) {
        return {
            edges: [],
            observed_variables: [],
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
        "field": models.observed_variable.idAttribute(),
        "value": this.observed_variable_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.observed_variablesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.biological_materialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.biological_materialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.biological_material_ids) || this.biological_material_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.biological_material.idAttribute(),
        "value": this.biological_material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.biological_materials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredBiological_materials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredBiological_materials = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.biological_material_ids) || this.biological_material_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.biological_material.idAttribute(),
        "value": this.biological_material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countBiological_materials({
        search: nsearch
    }, context);
}

/**
 * study.prototype.biological_materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.biological_materialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.biological_material_ids) || this.biological_material_ids.length === 0) {
        return {
            edges: [],
            biological_materials: [],
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
        "field": models.biological_material.idAttribute(),
        "value": this.biological_material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.biological_materialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.factorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.factorsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.factors({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredFactors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredFactors = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countFactors({
        search: nsearch
    }, context);
}

/**
 * study.prototype.factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.factorsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.factorsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.data_filesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.data_filesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.data_files({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredData_files - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredData_files = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countData_files({
        search: nsearch
    }, context);
}

/**
 * study.prototype.data_filesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.data_filesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.data_filesConnection({
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
    if (helper.isNonEmptyArray(input.addPeople)) {
        promises_add.push(this.add_people(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addEnvironment_parameters)) {
        promises_add.push(this.add_environment_parameters(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addEvents)) {
        promises_add.push(this.add_events(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservation_units)) {
        promises_add.push(this.add_observation_units(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObserved_variables)) {
        promises_add.push(this.add_observed_variables(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addBiological_materials)) {
        promises_add.push(this.add_biological_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises_add.push(this.add_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addData_files)) {
        promises_add.push(this.add_data_files(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInvestigation)) {
        promises_add.push(this.add_investigation(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removePeople)) {
        promises_remove.push(this.remove_people(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeEnvironment_parameters)) {
        promises_remove.push(this.remove_environment_parameters(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeEvents)) {
        promises_remove.push(this.remove_events(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservation_units)) {
        promises_remove.push(this.remove_observation_units(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObserved_variables)) {
        promises_remove.push(this.remove_observed_variables(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeBiological_materials)) {
        promises_remove.push(this.remove_biological_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises_remove.push(this.remove_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeData_files)) {
        promises_remove.push(this.remove_data_files(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInvestigation)) {
        promises_remove.push(this.remove_investigation(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_people - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_people = async function(input, benignErrorReporter) {

    await study.add_person_ids(this.getIdValue(), input.addPeople, benignErrorReporter);
    this.person_ids = helper.unionIds(this.person_ids, input.addPeople);
}

/**
 * add_environment_parameters - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_environment_parameters = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addEnvironment_parameters.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.environment.idAttribute()]: associatedRecordId
        }
    });
    await models.environment.bulkAssociateEnvironmentWithStudy_id(bulkAssociationInput, benignErrorReporter);
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
            study_id: this.getIdValue(),
            [models.event.idAttribute()]: associatedRecordId
        }
    });
    await models.event.bulkAssociateEventWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observation_units - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_observation_units = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservation_units.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.observation_unit.idAttribute()]: associatedRecordId
        }
    });
    await models.observation_unit.bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observed_variables - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_observed_variables = async function(input, benignErrorReporter) {

    await study.add_observed_variable_ids(this.getIdValue(), input.addObserved_variables, benignErrorReporter);
    this.observed_variable_ids = helper.unionIds(this.observed_variable_ids, input.addObserved_variables);
}

/**
 * add_biological_materials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_biological_materials = async function(input, benignErrorReporter) {

    await study.add_biological_material_ids(this.getIdValue(), input.addBiological_materials, benignErrorReporter);
    this.biological_material_ids = helper.unionIds(this.biological_material_ids, input.addBiological_materials);
}

/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_factors = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addFactors.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.factor.idAttribute()]: associatedRecordId
        }
    });
    await models.factor.bulkAssociateFactorWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_data_files - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_data_files = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addData_files.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.data_file.idAttribute()]: associatedRecordId
        }
    });
    await models.data_file.bulkAssociateData_fileWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_investigation - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_investigation = async function(input, benignErrorReporter) {
    await study.add_investigation_id(this.getIdValue(), input.addInvestigation, benignErrorReporter);
    this.investigation_id = input.addInvestigation;
}

/**
 * remove_people - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_people = async function(input, benignErrorReporter) {

    await study.remove_person_ids(this.getIdValue(), input.removePeople, benignErrorReporter);
    this.person_ids = helper.differenceIds(this.person_ids, input.removePeople);
}

/**
 * remove_environment_parameters - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_environment_parameters = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeEnvironment_parameters.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.environment.idAttribute()]: associatedRecordId
        }
    });
    await models.environment.bulkDisAssociateEnvironmentWithStudy_id(bulkAssociationInput, benignErrorReporter);
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
            study_id: this.getIdValue(),
            [models.event.idAttribute()]: associatedRecordId
        }
    });
    await models.event.bulkDisAssociateEventWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observation_units - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_observation_units = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservation_units.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.observation_unit.idAttribute()]: associatedRecordId
        }
    });
    await models.observation_unit.bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observed_variables - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_observed_variables = async function(input, benignErrorReporter) {

    await study.remove_observed_variable_ids(this.getIdValue(), input.removeObserved_variables, benignErrorReporter);
    this.observed_variable_ids = helper.differenceIds(this.observed_variable_ids, input.removeObserved_variables);
}

/**
 * remove_biological_materials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_biological_materials = async function(input, benignErrorReporter) {

    await study.remove_biological_material_ids(this.getIdValue(), input.removeBiological_materials, benignErrorReporter);
    this.biological_material_ids = helper.differenceIds(this.biological_material_ids, input.removeBiological_materials);
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_factors = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeFactors.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.factor.idAttribute()]: associatedRecordId
        }
    });
    await models.factor.bulkDisAssociateFactorWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_data_files - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_data_files = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeData_files.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.data_file.idAttribute()]: associatedRecordId
        }
    });
    await models.data_file.bulkDisAssociateData_fileWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_investigation - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_investigation = async function(input, benignErrorReporter) {
    if (input.removeInvestigation == this.investigation_id) {
        await study.remove_investigation_id(this.getIdValue(), input.removeInvestigation, benignErrorReporter);
        this.investigation_id = null;
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
        id: id
    }, context);
    //check that record actually exists
    if (study === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(study.countFilteredPeople({}, context));
    promises_to_many.push(study.countFilteredEnvironment_parameters({}, context));
    promises_to_many.push(study.countFilteredEvents({}, context));
    promises_to_many.push(study.countFilteredObservation_units({}, context));
    promises_to_many.push(study.countFilteredObserved_variables({}, context));
    promises_to_many.push(study.countFilteredBiological_materials({}, context));
    promises_to_many.push(study.countFilteredFactors({}, context));
    promises_to_many.push(study.countFilteredData_files({}, context));
    promises_to_one.push(study.investigation({}, context));

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
        throw new Error(`study with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
     * readOneStudy - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneStudy: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneStudy");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readById(id, benignErrorReporter);
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
            return helper.vueTable(context.request, study, ["id", "id", "title", "description", "institution", "location_country", "location_latitude", "location_longitude", "location_altitude", "experimental_site_name", "experimental_design_type", "experimental_design_description", "experimental_design_map", "observation_unit_level_hirarchy", "observation_unit_description", "growth_facility", "growth_facility_description", "cultural_practices", "investigation_id"]);
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
     * deleteStudy - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteStudy: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'study', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return study.deleteOne(id, benignErrorReporter);
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
     * bulkAssociateStudyWithInvestigation_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateStudyWithInvestigation_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_id
            }) => investigation_id)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), study);
        }
        return await study.bulkAssociateStudyWithInvestigation_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateStudyWithInvestigation_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateStudyWithInvestigation_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_id
            }) => investigation_id)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), study);
        }
        return await study.bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
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