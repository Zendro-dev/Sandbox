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
    'addAssays': 'assay',
    'addFactors': 'factor',
    'addProtocols': 'protocol',
    'addContacts': 'contact',
    'addMaterials': 'material',
    'addOntologyAnnotations': 'ontologyAnnotation',
    'addFileAttachments': 'fileAttachment'
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
 * study.prototype.assaysFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.assaysFilter = function({
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

    return resolvers.assays({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredAssays - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredAssays = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "study_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * study.prototype.assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.assaysConnection = function({
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
    return resolvers.assaysConnection({
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


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
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


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
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


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return {
            edges: [],
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
        "field": models.factor.idAttribute(),
        "value": this.factor_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.factorsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.protocolsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.protocolsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocol_ids) || this.protocol_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.protocol.idAttribute(),
        "value": this.protocol_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.protocols({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredProtocols - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredProtocols = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocol_ids) || this.protocol_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.protocol.idAttribute(),
        "value": this.protocol_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countProtocols({
        search: nsearch
    }, context);
}

/**
 * study.prototype.protocolsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.protocolsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocol_ids) || this.protocol_ids.length === 0) {
        return {
            edges: [],
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
        "field": models.protocol.idAttribute(),
        "value": this.protocol_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.protocolsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
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


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.contact_ids) || this.contact_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contact_ids.join(','),
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


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.contact_ids) || this.contact_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.contact.idAttribute(),
        "value": this.contact_ids.join(','),
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


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.contact_ids) || this.contact_ids.length === 0) {
        return {
            edges: [],
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
        "field": models.contact.idAttribute(),
        "value": this.contact_ids.join(','),
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
 * study.prototype.materialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.materialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_ids) || this.material_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.material_ids.join(','),
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
 * study.prototype.countFilteredMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredMaterials = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_ids) || this.material_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.material.idAttribute(),
        "value": this.material_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countMaterials({
        search: nsearch
    }, context);
}

/**
 * study.prototype.materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.materialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_ids) || this.material_ids.length === 0) {
        return {
            edges: [],
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
        "value": this.material_ids.join(','),
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
 * study.prototype.ontologyAnnotationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.ontologyAnnotationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.ontologyAnnotation_ids) || this.ontologyAnnotation_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontologyAnnotation.idAttribute(),
        "value": this.ontologyAnnotation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.ontologyAnnotations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredOntologyAnnotations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredOntologyAnnotations = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.ontologyAnnotation_ids) || this.ontologyAnnotation_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.ontologyAnnotation.idAttribute(),
        "value": this.ontologyAnnotation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countOntologyAnnotations({
        search: nsearch
    }, context);
}

/**
 * study.prototype.ontologyAnnotationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.ontologyAnnotationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.ontologyAnnotation_ids) || this.ontologyAnnotation_ids.length === 0) {
        return {
            edges: [],
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
        "field": models.ontologyAnnotation.idAttribute(),
        "value": this.ontologyAnnotation_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.ontologyAnnotationsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * study.prototype.fileAttachmentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
study.prototype.fileAttachmentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.fileAttachment_ids) || this.fileAttachment_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.fileAttachment.idAttribute(),
        "value": this.fileAttachment_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.fileAttachments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * study.prototype.countFilteredFileAttachments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
study.prototype.countFilteredFileAttachments = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.fileAttachment_ids) || this.fileAttachment_ids.length === 0) {
        return 0;
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.fileAttachment.idAttribute(),
        "value": this.fileAttachment_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countFileAttachments({
        search: nsearch
    }, context);
}

/**
 * study.prototype.fileAttachmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
study.prototype.fileAttachmentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.fileAttachment_ids) || this.fileAttachment_ids.length === 0) {
        return {
            edges: [],
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
        "field": models.fileAttachment.idAttribute(),
        "value": this.fileAttachment_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.fileAttachmentsConnection({
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
    if (helper.isNonEmptyArray(input.addAssays)) {
        promises_add.push(this.add_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises_add.push(this.add_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocols)) {
        promises_add.push(this.add_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addContacts)) {
        promises_add.push(this.add_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials)) {
        promises_add.push(this.add_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOntologyAnnotations)) {
        promises_add.push(this.add_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFileAttachments)) {
        promises_add.push(this.add_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addInvestigation)) {
        promises_add.push(this.add_investigation(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeAssays)) {
        promises_remove.push(this.remove_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises_remove.push(this.remove_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocols)) {
        promises_remove.push(this.remove_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeContacts)) {
        promises_remove.push(this.remove_contacts(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials)) {
        promises_remove.push(this.remove_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOntologyAnnotations)) {
        promises_remove.push(this.remove_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFileAttachments)) {
        promises_remove.push(this.remove_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeInvestigation)) {
        promises_remove.push(this.remove_investigation(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_assays - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_assays = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addAssays.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkAssociateAssayWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_factors = async function(input, benignErrorReporter) {

    await study.add_factor_ids(this.getIdValue(), input.addFactors, benignErrorReporter);
    this.factor_ids = helper.unionIds(this.factor_ids, input.addFactors);
}

/**
 * add_protocols - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_protocols = async function(input, benignErrorReporter) {

    await study.add_protocol_ids(this.getIdValue(), input.addProtocols, benignErrorReporter);
    this.protocol_ids = helper.unionIds(this.protocol_ids, input.addProtocols);
}

/**
 * add_contacts - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_contacts = async function(input, benignErrorReporter) {

    await study.add_contact_ids(this.getIdValue(), input.addContacts, benignErrorReporter);
    this.contact_ids = helper.unionIds(this.contact_ids, input.addContacts);
}

/**
 * add_materials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_materials = async function(input, benignErrorReporter) {

    await study.add_material_ids(this.getIdValue(), input.addMaterials, benignErrorReporter);
    this.material_ids = helper.unionIds(this.material_ids, input.addMaterials);
}

/**
 * add_ontologyAnnotations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_ontologyAnnotations = async function(input, benignErrorReporter) {

    await study.add_ontologyAnnotation_ids(this.getIdValue(), input.addOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.unionIds(this.ontologyAnnotation_ids, input.addOntologyAnnotations);
}

/**
 * add_fileAttachments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.add_fileAttachments = async function(input, benignErrorReporter) {

    await study.add_fileAttachment_ids(this.getIdValue(), input.addFileAttachments, benignErrorReporter);
    this.fileAttachment_ids = helper.unionIds(this.fileAttachment_ids, input.addFileAttachments);
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
 * remove_assays - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_assays = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeAssays.map(associatedRecordId => {
        return {
            study_id: this.getIdValue(),
            [models.assay.idAttribute()]: associatedRecordId
        }
    });
    await models.assay.bulkDisAssociateAssayWithStudy_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_factors = async function(input, benignErrorReporter) {

    await study.remove_factor_ids(this.getIdValue(), input.removeFactors, benignErrorReporter);
    this.factor_ids = helper.differenceIds(this.factor_ids, input.removeFactors);
}

/**
 * remove_protocols - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_protocols = async function(input, benignErrorReporter) {

    await study.remove_protocol_ids(this.getIdValue(), input.removeProtocols, benignErrorReporter);
    this.protocol_ids = helper.differenceIds(this.protocol_ids, input.removeProtocols);
}

/**
 * remove_contacts - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_contacts = async function(input, benignErrorReporter) {

    await study.remove_contact_ids(this.getIdValue(), input.removeContacts, benignErrorReporter);
    this.contact_ids = helper.differenceIds(this.contact_ids, input.removeContacts);
}

/**
 * remove_materials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_materials = async function(input, benignErrorReporter) {

    await study.remove_material_ids(this.getIdValue(), input.removeMaterials, benignErrorReporter);
    this.material_ids = helper.differenceIds(this.material_ids, input.removeMaterials);
}

/**
 * remove_ontologyAnnotations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_ontologyAnnotations = async function(input, benignErrorReporter) {

    await study.remove_ontologyAnnotation_ids(this.getIdValue(), input.removeOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.differenceIds(this.ontologyAnnotation_ids, input.removeOntologyAnnotations);
}

/**
 * remove_fileAttachments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
study.prototype.remove_fileAttachments = async function(input, benignErrorReporter) {

    await study.remove_fileAttachment_ids(this.getIdValue(), input.removeFileAttachments, benignErrorReporter);
    this.fileAttachment_ids = helper.differenceIds(this.fileAttachment_ids, input.removeFileAttachments);
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
        study_id: id
    }, context);
    //check that record actually exists
    if (study === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(study.countFilteredAssays({}, context));
    promises_to_many.push(study.countFilteredFactors({}, context));
    promises_to_many.push(study.countFilteredProtocols({}, context));
    promises_to_many.push(study.countFilteredContacts({}, context));
    promises_to_many.push(study.countFilteredMaterials({}, context));
    promises_to_many.push(study.countFilteredOntologyAnnotations({}, context));
    promises_to_many.push(study.countFilteredFileAttachments({}, context));
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
        throw new Error(`study with study_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
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
     * readOneStudy - Check user authorization and return one record with the specified study_id in the study_id argument.
     *
     * @param  {number} {study_id}    study_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with study_id requested
     */
    readOneStudy: async function({
        study_id
    }, context) {
        if (await checkAuthorization(context, 'study', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneStudy");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await study.readById(study_id, benignErrorReporter);
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
            return helper.vueTable(context.request, study, ["id", "study_id", "name", "description", "investigation_id"]);
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
     * deleteStudy - Check user authorization and delete a record with the specified study_id in the study_id argument.
     *
     * @param  {number} {study_id}    study_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteStudy: async function({
        study_id
    }, context) {
        if (await checkAuthorization(context, 'study', 'delete') === true) {
            if (await validForDeletion(study_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return study.deleteOne(study_id, benignErrorReporter);
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
                study_id
            }) => study_id)), study);
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
                study_id
            }) => study_id)), study);
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