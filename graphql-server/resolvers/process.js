/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const process = require(path.join(__dirname, '..', 'models', 'index.js')).process;
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
    'addExecutesProtocol': 'protocol',
    'addPreviousProcess': 'process',
    'addNextProcess': 'process',
    'addAssay_processSequence': 'assay',
    'addStudy_processSequence': 'study',
    'addParameterValues': 'process_parameter_value',
    'addInputs_source': 'source',
    'addInputs_sample': 'sample',
    'addInputs_data': 'data',
    'addInputs_material': 'material',
    'addOutputs_sample': 'sample',
    'addOutputs_data': 'data',
    'addOutputs_material': 'material',
    'addComments': 'comment'
}



/**
 * process.prototype.executesProtocol - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process.prototype.executesProtocol = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.executesProtocol_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProtocol({
                [models.protocol.idAttribute()]: this.executesProtocol_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.protocol.idAttribute(),
                "value": this.executesProtocol_fk,
                "operator": "eq"
            });
            let found = (await resolvers.protocolsConnection({
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
 * process.prototype.previousProcess - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process.prototype.previousProcess = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.previousProcess_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProcess({
                [models.process.idAttribute()]: this.previousProcess_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.process.idAttribute(),
                "value": this.previousProcess_fk,
                "operator": "eq"
            });
            let found = (await resolvers.processesConnection({
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
 * process.prototype.nextProcess - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process.prototype.nextProcess = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.nextProcess_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProcess({
                [models.process.idAttribute()]: this.nextProcess_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.process.idAttribute(),
                "value": this.nextProcess_fk,
                "operator": "eq"
            });
            let found = (await resolvers.processesConnection({
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
 * process.prototype.assay_processSequence - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process.prototype.assay_processSequence = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.assay_processSequence_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneAssay({
                [models.assay.idAttribute()]: this.assay_processSequence_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.assay.idAttribute(),
                "value": this.assay_processSequence_fk,
                "operator": "eq"
            });
            let found = (await resolvers.assaysConnection({
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
 * process.prototype.study_processSequence - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
process.prototype.study_processSequence = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.study_processSequence_fk)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.study_processSequence_fk
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.study_processSequence_fk,
                "operator": "eq"
            });
            let found = (await resolvers.studiesConnection({
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
 * process.prototype.parameterValuesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.parameterValuesFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameterValues_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.process_parameter_values({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredParameterValues - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredParameterValues = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameterValues_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countProcess_parameter_values({
        search: nsearch
    }, context);
}

/**
 * process.prototype.parameterValuesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.parameterValuesConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_parameterValues_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.process_parameter_valuesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.inputs_sourceFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_sourceFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_source_fk) || this.inputs_source_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.inputs_source_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.sources({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredInputs_source - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredInputs_source = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_source_fk) || this.inputs_source_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.source.idAttribute(),
        "value": this.inputs_source_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSources({
        search: nsearch
    }, context);
}

/**
 * process.prototype.inputs_sourceConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_sourceConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_source_fk) || this.inputs_source_fk.length === 0) {
        return {
            edges: [],
            sources: [],
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
        "field": models.source.idAttribute(),
        "value": this.inputs_source_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.sourcesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.inputs_sampleFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_sampleFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_sample_fk) || this.inputs_sample_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.inputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samples({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredInputs_sample - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredInputs_sample = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_sample_fk) || this.inputs_sample_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.inputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * process.prototype.inputs_sampleConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_sampleConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_sample_fk) || this.inputs_sample_fk.length === 0) {
        return {
            edges: [],
            samples: [],
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
        "field": models.sample.idAttribute(),
        "value": this.inputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samplesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.inputs_dataFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_dataFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_data_fk) || this.inputs_data_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data.idAttribute(),
        "value": this.inputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.data({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredInputs_data - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredInputs_data = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_data_fk) || this.inputs_data_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data.idAttribute(),
        "value": this.inputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countData({
        search: nsearch
    }, context);
}

/**
 * process.prototype.inputs_dataConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_dataConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_data_fk) || this.inputs_data_fk.length === 0) {
        return {
            edges: [],
            data: [],
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
        "field": models.data.idAttribute(),
        "value": this.inputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.dataConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.inputs_materialFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_materialFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_material_fk) || this.inputs_material_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredInputs_material - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredInputs_material = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_material_fk) || this.inputs_material_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * process.prototype.inputs_materialConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.inputs_materialConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.inputs_material_fk) || this.inputs_material_fk.length === 0) {
        return {
            edges: [],
            materials: [],
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
        "field": models.material.idAttribute(),
        "value": this.inputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.outputs_sampleFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_sampleFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_sample_fk) || this.outputs_sample_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.outputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samples({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredOutputs_sample - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredOutputs_sample = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_sample_fk) || this.outputs_sample_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.sample.idAttribute(),
        "value": this.outputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countSamples({
        search: nsearch
    }, context);
}

/**
 * process.prototype.outputs_sampleConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_sampleConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_sample_fk) || this.outputs_sample_fk.length === 0) {
        return {
            edges: [],
            samples: [],
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
        "field": models.sample.idAttribute(),
        "value": this.outputs_sample_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.samplesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.outputs_dataFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_dataFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_data_fk) || this.outputs_data_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data.idAttribute(),
        "value": this.outputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.data({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredOutputs_data - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredOutputs_data = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_data_fk) || this.outputs_data_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.data.idAttribute(),
        "value": this.outputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countData({
        search: nsearch
    }, context);
}

/**
 * process.prototype.outputs_dataConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_dataConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_data_fk) || this.outputs_data_fk.length === 0) {
        return {
            edges: [],
            data: [],
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
        "field": models.data.idAttribute(),
        "value": this.outputs_data_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.dataConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.outputs_materialFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_materialFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_material_fk) || this.outputs_material_fk.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredOutputs_material - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredOutputs_material = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_material_fk) || this.outputs_material_fk.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * process.prototype.outputs_materialConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.outputs_materialConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.outputs_material_fk) || this.outputs_material_fk.length === 0) {
        return {
            edges: [],
            materials: [],
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
        "field": models.material.idAttribute(),
        "value": this.outputs_material_fk.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.materialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * process.prototype.commentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
process.prototype.commentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.comments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * process.prototype.countFilteredComments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
process.prototype.countFilteredComments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countComments({
        search: nsearch
    }, context);
}

/**
 * process.prototype.commentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
process.prototype.commentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "process_comments_fk",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.commentsConnection({
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
process.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addParameterValues)) {
        promises_add.push(this.add_parameterValues(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addInputs_source)) {
        promises_add.push(this.add_inputs_source(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addInputs_sample)) {
        promises_add.push(this.add_inputs_sample(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addInputs_data)) {
        promises_add.push(this.add_inputs_data(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addInputs_material)) {
        promises_add.push(this.add_inputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOutputs_sample)) {
        promises_add.push(this.add_outputs_sample(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOutputs_data)) {
        promises_add.push(this.add_outputs_data(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOutputs_material)) {
        promises_add.push(this.add_outputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addComments)) {
        promises_add.push(this.add_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addExecutesProtocol)) {
        promises_add.push(this.add_executesProtocol(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addPreviousProcess)) {
        promises_add.push(this.add_previousProcess(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addNextProcess)) {
        promises_add.push(this.add_nextProcess(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addAssay_processSequence)) {
        promises_add.push(this.add_assay_processSequence(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy_processSequence)) {
        promises_add.push(this.add_study_processSequence(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeParameterValues)) {
        promises_remove.push(this.remove_parameterValues(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeInputs_source)) {
        promises_remove.push(this.remove_inputs_source(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeInputs_sample)) {
        promises_remove.push(this.remove_inputs_sample(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeInputs_data)) {
        promises_remove.push(this.remove_inputs_data(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeInputs_material)) {
        promises_remove.push(this.remove_inputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOutputs_sample)) {
        promises_remove.push(this.remove_outputs_sample(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOutputs_data)) {
        promises_remove.push(this.remove_outputs_data(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOutputs_material)) {
        promises_remove.push(this.remove_outputs_material(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeComments)) {
        promises_remove.push(this.remove_comments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeExecutesProtocol)) {
        promises_remove.push(this.remove_executesProtocol(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removePreviousProcess)) {
        promises_remove.push(this.remove_previousProcess(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeNextProcess)) {
        promises_remove.push(this.remove_nextProcess(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeAssay_processSequence)) {
        promises_remove.push(this.remove_assay_processSequence(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy_processSequence)) {
        promises_remove.push(this.remove_study_processSequence(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_parameterValues - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_parameterValues = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addParameterValues.map(associatedRecordId => {
        return {
            process_parameterValues_fk: this.getIdValue(),
            [models.process_parameter_value.idAttribute()]: associatedRecordId
        }
    });
    await models.process_parameter_value.bulkAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_inputs_source - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_inputs_source = async function(input, benignErrorReporter) {

    await process.add_inputs_source_fk(this.getIdValue(), input.addInputs_source, benignErrorReporter);
    this.inputs_source_fk = helper.unionIds(this.inputs_source_fk, input.addInputs_source);
}

/**
 * add_inputs_sample - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_inputs_sample = async function(input, benignErrorReporter) {

    await process.add_inputs_sample_fk(this.getIdValue(), input.addInputs_sample, benignErrorReporter);
    this.inputs_sample_fk = helper.unionIds(this.inputs_sample_fk, input.addInputs_sample);
}

/**
 * add_inputs_data - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_inputs_data = async function(input, benignErrorReporter) {

    await process.add_inputs_data_fk(this.getIdValue(), input.addInputs_data, benignErrorReporter);
    this.inputs_data_fk = helper.unionIds(this.inputs_data_fk, input.addInputs_data);
}

/**
 * add_inputs_material - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_inputs_material = async function(input, benignErrorReporter) {

    await process.add_inputs_material_fk(this.getIdValue(), input.addInputs_material, benignErrorReporter);
    this.inputs_material_fk = helper.unionIds(this.inputs_material_fk, input.addInputs_material);
}

/**
 * add_outputs_sample - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_outputs_sample = async function(input, benignErrorReporter) {

    await process.add_outputs_sample_fk(this.getIdValue(), input.addOutputs_sample, benignErrorReporter);
    this.outputs_sample_fk = helper.unionIds(this.outputs_sample_fk, input.addOutputs_sample);
}

/**
 * add_outputs_data - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_outputs_data = async function(input, benignErrorReporter) {

    await process.add_outputs_data_fk(this.getIdValue(), input.addOutputs_data, benignErrorReporter);
    this.outputs_data_fk = helper.unionIds(this.outputs_data_fk, input.addOutputs_data);
}

/**
 * add_outputs_material - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_outputs_material = async function(input, benignErrorReporter) {

    await process.add_outputs_material_fk(this.getIdValue(), input.addOutputs_material, benignErrorReporter);
    this.outputs_material_fk = helper.unionIds(this.outputs_material_fk, input.addOutputs_material);
}

/**
 * add_comments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addComments.map(associatedRecordId => {
        return {
            process_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkAssociateCommentWithProcess_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_executesProtocol - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_executesProtocol = async function(input, benignErrorReporter) {
    await process.add_executesProtocol_fk(this.getIdValue(), input.addExecutesProtocol, benignErrorReporter);
    this.executesProtocol_fk = input.addExecutesProtocol;
}

/**
 * add_previousProcess - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_previousProcess = async function(input, benignErrorReporter) {
    const associated = await process.readAllCursor({
            field: "previousProcess_fk",
            operator: "eq",
            value: input.addPreviousProcess
        },
        undefined, {
            first: 2
        },
        benignErrorReporter
    );
    const num = associated.processes.length;
    if (num > 0) {
        if (num > 1) {
            benignErrorReporter.reportError({
                message: `Please manually fix inconsistent data! Record has been added without association!`,
            });
            return 0;
        } else {
            const id = associated.processes[0].id;
            const removed = await process.remove_previousProcess_fk(id, input.addPreviousProcess, benignErrorReporter);
            benignErrorReporter.reportError({
                message: `Hint: update ${removed} existing association!`,
            });
        }
    }
    await process.add_previousProcess_fk(this.getIdValue(), input.addPreviousProcess, benignErrorReporter);
    this.previousProcess_fk = input.addPreviousProcess;
}

/**
 * add_nextProcess - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_nextProcess = async function(input, benignErrorReporter) {
    const associated = await process.readAllCursor({
            field: "nextProcess_fk",
            operator: "eq",
            value: input.addNextProcess
        },
        undefined, {
            first: 2
        },
        benignErrorReporter
    );
    const num = associated.processes.length;
    if (num > 0) {
        if (num > 1) {
            benignErrorReporter.reportError({
                message: `Please manually fix inconsistent data! Record has been added without association!`,
            });
            return 0;
        } else {
            const id = associated.processes[0].id;
            const removed = await process.remove_nextProcess_fk(id, input.addNextProcess, benignErrorReporter);
            benignErrorReporter.reportError({
                message: `Hint: update ${removed} existing association!`,
            });
        }
    }
    await process.add_nextProcess_fk(this.getIdValue(), input.addNextProcess, benignErrorReporter);
    this.nextProcess_fk = input.addNextProcess;
}

/**
 * add_assay_processSequence - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_assay_processSequence = async function(input, benignErrorReporter) {
    await process.add_assay_processSequence_fk(this.getIdValue(), input.addAssay_processSequence, benignErrorReporter);
    this.assay_processSequence_fk = input.addAssay_processSequence;
}

/**
 * add_study_processSequence - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.add_study_processSequence = async function(input, benignErrorReporter) {
    await process.add_study_processSequence_fk(this.getIdValue(), input.addStudy_processSequence, benignErrorReporter);
    this.study_processSequence_fk = input.addStudy_processSequence;
}

/**
 * remove_parameterValues - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_parameterValues = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeParameterValues.map(associatedRecordId => {
        return {
            process_parameterValues_fk: this.getIdValue(),
            [models.process_parameter_value.idAttribute()]: associatedRecordId
        }
    });
    await models.process_parameter_value.bulkDisAssociateProcess_parameter_valueWithProcess_parameterValues_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_inputs_source - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_inputs_source = async function(input, benignErrorReporter) {

    await process.remove_inputs_source_fk(this.getIdValue(), input.removeInputs_source, benignErrorReporter);
    this.inputs_source_fk = helper.differenceIds(this.inputs_source_fk, input.removeInputs_source);
}

/**
 * remove_inputs_sample - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_inputs_sample = async function(input, benignErrorReporter) {

    await process.remove_inputs_sample_fk(this.getIdValue(), input.removeInputs_sample, benignErrorReporter);
    this.inputs_sample_fk = helper.differenceIds(this.inputs_sample_fk, input.removeInputs_sample);
}

/**
 * remove_inputs_data - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_inputs_data = async function(input, benignErrorReporter) {

    await process.remove_inputs_data_fk(this.getIdValue(), input.removeInputs_data, benignErrorReporter);
    this.inputs_data_fk = helper.differenceIds(this.inputs_data_fk, input.removeInputs_data);
}

/**
 * remove_inputs_material - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_inputs_material = async function(input, benignErrorReporter) {

    await process.remove_inputs_material_fk(this.getIdValue(), input.removeInputs_material, benignErrorReporter);
    this.inputs_material_fk = helper.differenceIds(this.inputs_material_fk, input.removeInputs_material);
}

/**
 * remove_outputs_sample - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_outputs_sample = async function(input, benignErrorReporter) {

    await process.remove_outputs_sample_fk(this.getIdValue(), input.removeOutputs_sample, benignErrorReporter);
    this.outputs_sample_fk = helper.differenceIds(this.outputs_sample_fk, input.removeOutputs_sample);
}

/**
 * remove_outputs_data - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_outputs_data = async function(input, benignErrorReporter) {

    await process.remove_outputs_data_fk(this.getIdValue(), input.removeOutputs_data, benignErrorReporter);
    this.outputs_data_fk = helper.differenceIds(this.outputs_data_fk, input.removeOutputs_data);
}

/**
 * remove_outputs_material - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_outputs_material = async function(input, benignErrorReporter) {

    await process.remove_outputs_material_fk(this.getIdValue(), input.removeOutputs_material, benignErrorReporter);
    this.outputs_material_fk = helper.differenceIds(this.outputs_material_fk, input.removeOutputs_material);
}

/**
 * remove_comments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_comments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeComments.map(associatedRecordId => {
        return {
            process_comments_fk: this.getIdValue(),
            [models.comment.idAttribute()]: associatedRecordId
        }
    });
    await models.comment.bulkDisAssociateCommentWithProcess_comments_fk(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_executesProtocol - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_executesProtocol = async function(input, benignErrorReporter) {
    if (input.removeExecutesProtocol == this.executesProtocol_fk) {
        await process.remove_executesProtocol_fk(this.getIdValue(), input.removeExecutesProtocol, benignErrorReporter);
        this.executesProtocol_fk = null;
    }
}

/**
 * remove_previousProcess - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_previousProcess = async function(input, benignErrorReporter) {
    if (input.removePreviousProcess == this.previousProcess_fk) {
        await process.remove_previousProcess_fk(this.getIdValue(), input.removePreviousProcess, benignErrorReporter);
        this.previousProcess_fk = null;
    }
}

/**
 * remove_nextProcess - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_nextProcess = async function(input, benignErrorReporter) {
    if (input.removeNextProcess == this.nextProcess_fk) {
        await process.remove_nextProcess_fk(this.getIdValue(), input.removeNextProcess, benignErrorReporter);
        this.nextProcess_fk = null;
    }
}

/**
 * remove_assay_processSequence - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_assay_processSequence = async function(input, benignErrorReporter) {
    if (input.removeAssay_processSequence == this.assay_processSequence_fk) {
        await process.remove_assay_processSequence_fk(this.getIdValue(), input.removeAssay_processSequence, benignErrorReporter);
        this.assay_processSequence_fk = null;
    }
}

/**
 * remove_study_processSequence - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
process.prototype.remove_study_processSequence = async function(input, benignErrorReporter) {
    if (input.removeStudy_processSequence == this.study_processSequence_fk) {
        await process.remove_study_processSequence_fk(this.getIdValue(), input.removeStudy_processSequence, benignErrorReporter);
        this.study_processSequence_fk = null;
    }
}



/**
 * countAssociatedRecordsWithRejectReaction - Count associated records with reject deletion action
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAssociatedRecordsWithRejectReaction(id, context) {

    let process = await resolvers.readOneProcess({
        id: id
    }, context);
    //check that record actually exists
    if (process === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];
    let get_to_many_associated_fk = 0;
    promises_to_many.push(process.countFilteredParameterValues({}, context));

    get_to_many_associated_fk += Array.isArray(process.inputs_source_fk) ? process.inputs_source_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.inputs_sample_fk) ? process.inputs_sample_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.inputs_data_fk) ? process.inputs_data_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.inputs_material_fk) ? process.inputs_material_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.outputs_sample_fk) ? process.outputs_sample_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.outputs_data_fk) ? process.outputs_data_fk.length : 0;

    get_to_many_associated_fk += Array.isArray(process.outputs_material_fk) ? process.outputs_material_fk.length : 0;
    promises_to_many.push(process.countFilteredComments({}, context));
    promises_to_one.push(process.executesProtocol({}, context));
    promises_to_one.push(process.previousProcess({}, context));
    promises_to_one.push(process.nextProcess({}, context));
    promises_to_one.push(process.assay_processSequence({}, context));
    promises_to_one.push(process.study_processSequence({}, context));


    let result_to_many = await Promise.all(promises_to_many);
    let result_to_one = await Promise.all(promises_to_one);

    let get_to_many_associated = result_to_many.reduce((accumulator, current_val) => accumulator + current_val, 0);
    let get_to_one_associated = result_to_one.filter((r, index) => helper.isNotUndefinedAndNotNull(r)).length;

    return get_to_one_associated + get_to_many_associated_fk + get_to_many_associated;
}

/**
 * validForDeletion - Checks wether a record is allowed to be deleted
 *
 * @param  {ID} id      Id of record to check if it can be deleted
 * @param  {object} context Default context by resolver
 * @return {boolean}         True if it is allowed to be deleted and false otherwise
 */
async function validForDeletion(id, context) {
    if (await countAssociatedRecordsWithRejectReaction(id, context) > 0) {
        throw new Error(`process with id ${id} has associated records with 'reject' reaction and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

/**
 * updateAssociations - update associations for a given record
 *
 * @param  {ID} id      Id of record
 * @param  {object} context Default context by resolver
 */
const updateAssociations = async (id, context) => {
    const process_record = await resolvers.readOneProcess({
            id: id
        },
        context
    );
    const pagi_first = globals.LIMIT_RECORDS;



}
module.exports = {
    /**
     * processes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    processes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'process', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "processes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * processesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    processesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'process', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "processesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneProcess - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneProcess: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'process', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneProcess");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countProcesses - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countProcesses: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'process', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await process.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * validateProcessForCreation - Check user authorization and validate input argument for creation.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcessForCreation: async (input, context) => {
        let authorization = await checkAuthorization(context, 'process', 'read');
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
                    process,
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
     * validateProcessForUpdating - Check user authorization and validate input argument for updating.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcessForUpdating: async (input, context) => {
        let authorization = await checkAuthorization(context, 'process', 'read');
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
                    process,
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
     * validateProcessForDeletion - Check user authorization and validate record by ID for deletion.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcessForDeletion: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'process', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validForDeletion(id, context);
                await validatorUtil.validateData(
                    "validateForDelete",
                    process,
                    id);
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
     * validateProcessAfterReading - Check user authorization and validate record by ID after reading.
     *
     * @param  {string} {id} id of the record to be validated
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info
     * @return {boolean}        Validation result
     */
    validateProcessAfterReading: async ({
        id
    }, context) => {
        if ((await checkAuthorization(context, 'process', 'read')) === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);

            try {
                await validatorUtil.validateData(
                    "validateAfterRead",
                    process,
                    id);
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
     * addProcess - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addProcess: async function(input, context) {
        let authorization = await checkAuthorization(context, 'process', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdProcess = await process.addOne(inputSanitized, benignErrorReporter);
            await createdProcess.handleAssociations(inputSanitized, benignErrorReporter);
            return createdProcess;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddProcessCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddProcessCsv: async function(_, context) {
        if (await checkAuthorization(context, 'process', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return process.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteProcess - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteProcess: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'process', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                await updateAssociations(id, context);
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return process.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateProcess - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateProcess: async function(input, context) {
        let authorization = await checkAuthorization(context, 'process', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedProcess = await process.updateOne(inputSanitized, benignErrorReporter);
            await updatedProcess.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedProcess;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateProcessWithExecutesProtocol_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcessWithExecutesProtocol_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                executesProtocol_fk
            }) => executesProtocol_fk)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcessWithPreviousProcess_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcessWithPreviousProcess_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                previousProcess_fk
            }) => previousProcess_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkAssociateProcessWithPreviousProcess_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcessWithNextProcess_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcessWithNextProcess_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                nextProcess_fk
            }) => nextProcess_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkAssociateProcessWithNextProcess_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcessWithAssay_processSequence_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcessWithAssay_processSequence_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_processSequence_fk
            }) => assay_processSequence_fk)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateProcessWithStudy_processSequence_fk - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProcessWithStudy_processSequence_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_processSequence_fk
            }) => study_processSequence_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcessWithExecutesProtocol_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcessWithExecutesProtocol_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                executesProtocol_fk
            }) => executesProtocol_fk)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkDisAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcessWithPreviousProcess_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcessWithPreviousProcess_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                previousProcess_fk
            }) => previousProcess_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkDisAssociateProcessWithPreviousProcess_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcessWithNextProcess_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcessWithNextProcess_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                nextProcess_fk
            }) => nextProcess_fk)), models.process);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkDisAssociateProcessWithNextProcess_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcessWithAssay_processSequence_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcessWithAssay_processSequence_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_processSequence_fk
            }) => assay_processSequence_fk)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkDisAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProcessWithStudy_processSequence_fk - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProcessWithStudy_processSequence_fk: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_processSequence_fk
            }) => study_processSequence_fk)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), process);
        }
        return await process.bulkDisAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateProcess - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateProcess: async function(_, context) {
        if (await checkAuthorization(context, 'process', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return process.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}