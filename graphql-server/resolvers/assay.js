/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const assay = require(path.join(__dirname, '..', 'models', 'index.js')).assay;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addStudy': 'study',
    'addFactors': 'factor',
    'addMaterials': 'material',
    'addProtocols': 'protocol',
    'addOntologyAnnotations': 'ontologyAnnotation',
    'addFileAttachments': 'fileAttachment'
}



/**
 * assay.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assay.prototype.study = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.study_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneStudy({
                [models.study.idAttribute()]: this.study_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.study.idAttribute(),
                "value": this.study_id,
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
 * assay.prototype.factorsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.factorsFilter = function({
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
 * assay.prototype.countFilteredFactors - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredFactors = function({
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
 * assay.prototype.factorsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.factorsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.factor_ids) || this.factor_ids.length === 0) {
        return {
            edges: [],
            factors: [],
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
 * assay.prototype.materialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.materialsFilter = function({
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
 * assay.prototype.countFilteredMaterials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredMaterials = function({
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
 * assay.prototype.materialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.materialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.material_ids) || this.material_ids.length === 0) {
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
 * assay.prototype.protocolsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.protocolsFilter = function({
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
 * assay.prototype.countFilteredProtocols - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredProtocols = function({
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
 * assay.prototype.protocolsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.protocolsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.protocol_ids) || this.protocol_ids.length === 0) {
        return {
            edges: [],
            protocols: [],
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
 * assay.prototype.ontologyAnnotationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.ontologyAnnotationsFilter = function({
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
 * assay.prototype.countFilteredOntologyAnnotations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredOntologyAnnotations = function({
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
 * assay.prototype.ontologyAnnotationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.ontologyAnnotationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.ontologyAnnotation_ids) || this.ontologyAnnotation_ids.length === 0) {
        return {
            edges: [],
            ontologyAnnotations: [],
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
 * assay.prototype.fileAttachmentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assay.prototype.fileAttachmentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.fileAttachments({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * assay.prototype.countFilteredFileAttachments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assay.prototype.countFilteredFileAttachments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countFileAttachments({
        search: nsearch
    }, context);
}

/**
 * assay.prototype.fileAttachmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assay.prototype.fileAttachmentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "assay_id",
        "value": this.getIdValue(),
        "operator": "eq"
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
assay.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addFactors)) {
        promises_add.push(this.add_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addMaterials)) {
        promises_add.push(this.add_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addProtocols)) {
        promises_add.push(this.add_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOntologyAnnotations)) {
        promises_add.push(this.add_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFileAttachments)) {
        promises_add.push(this.add_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeFactors)) {
        promises_remove.push(this.remove_factors(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeMaterials)) {
        promises_remove.push(this.remove_materials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeProtocols)) {
        promises_remove.push(this.remove_protocols(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOntologyAnnotations)) {
        promises_remove.push(this.remove_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFileAttachments)) {
        promises_remove.push(this.remove_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_factors - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_factors = async function(input, benignErrorReporter) {

    await assay.add_factor_ids(this.getIdValue(), input.addFactors, benignErrorReporter);
    this.factor_ids = helper.unionIds(this.factor_ids, input.addFactors);
}

/**
 * add_materials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_materials = async function(input, benignErrorReporter) {

    await assay.add_material_ids(this.getIdValue(), input.addMaterials, benignErrorReporter);
    this.material_ids = helper.unionIds(this.material_ids, input.addMaterials);
}

/**
 * add_protocols - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_protocols = async function(input, benignErrorReporter) {

    await assay.add_protocol_ids(this.getIdValue(), input.addProtocols, benignErrorReporter);
    this.protocol_ids = helper.unionIds(this.protocol_ids, input.addProtocols);
}

/**
 * add_ontologyAnnotations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_ontologyAnnotations = async function(input, benignErrorReporter) {

    await assay.add_ontologyAnnotation_ids(this.getIdValue(), input.addOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.unionIds(this.ontologyAnnotation_ids, input.addOntologyAnnotations);
}

/**
 * add_fileAttachments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_fileAttachments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addFileAttachments.map(associatedRecordId => {
        return {
            assay_id: this.getIdValue(),
            [models.fileAttachment.idAttribute()]: associatedRecordId
        }
    });
    await models.fileAttachment.bulkAssociateFileAttachmentWithAssay_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.add_study = async function(input, benignErrorReporter) {
    await assay.add_study_id(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.study_id = input.addStudy;
}

/**
 * remove_factors - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_factors = async function(input, benignErrorReporter) {

    await assay.remove_factor_ids(this.getIdValue(), input.removeFactors, benignErrorReporter);
    this.factor_ids = helper.differenceIds(this.factor_ids, input.removeFactors);
}

/**
 * remove_materials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_materials = async function(input, benignErrorReporter) {

    await assay.remove_material_ids(this.getIdValue(), input.removeMaterials, benignErrorReporter);
    this.material_ids = helper.differenceIds(this.material_ids, input.removeMaterials);
}

/**
 * remove_protocols - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_protocols = async function(input, benignErrorReporter) {

    await assay.remove_protocol_ids(this.getIdValue(), input.removeProtocols, benignErrorReporter);
    this.protocol_ids = helper.differenceIds(this.protocol_ids, input.removeProtocols);
}

/**
 * remove_ontologyAnnotations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_ontologyAnnotations = async function(input, benignErrorReporter) {

    await assay.remove_ontologyAnnotation_ids(this.getIdValue(), input.removeOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.differenceIds(this.ontologyAnnotation_ids, input.removeOntologyAnnotations);
}

/**
 * remove_fileAttachments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_fileAttachments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeFileAttachments.map(associatedRecordId => {
        return {
            assay_id: this.getIdValue(),
            [models.fileAttachment.idAttribute()]: associatedRecordId
        }
    });
    await models.fileAttachment.bulkDisAssociateFileAttachmentWithAssay_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assay.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.study_id) {
        await assay.remove_study_id(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.study_id = null;
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

    let assay = await resolvers.readOneAssay({
        assay_id: id
    }, context);
    //check that record actually exists
    if (assay === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(assay.countFilteredFactors({}, context));
    promises_to_many.push(assay.countFilteredMaterials({}, context));
    promises_to_many.push(assay.countFilteredProtocols({}, context));
    promises_to_many.push(assay.countFilteredOntologyAnnotations({}, context));
    promises_to_many.push(assay.countFilteredFileAttachments({}, context));
    promises_to_one.push(assay.study({}, context));

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
        throw new Error(`assay with assay_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * assays - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    assays: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "assays");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    assaysConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "assaysConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAssay - Check user authorization and return one record with the specified assay_id in the assay_id argument.
     *
     * @param  {number} {assay_id}    assay_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with assay_id requested
     */
    readOneAssay: async function({
        assay_id
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneAssay");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.readById(assay_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countAssays - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAssays: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assay.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableAssay - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAssay: async function(_, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            return helper.vueTable(context.request, assay, ["id", "assay_id", "measurement", "technology", "platform", "method", "study_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addAssay - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAssay: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assay', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAssay = await assay.addOne(inputSanitized, benignErrorReporter);
            await createdAssay.handleAssociations(inputSanitized, benignErrorReporter);
            return createdAssay;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddAssayCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAssayCsv: async function(_, context) {
        if (await checkAuthorization(context, 'assay', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assay.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAssay - Check user authorization and delete a record with the specified assay_id in the assay_id argument.
     *
     * @param  {number} {assay_id}    assay_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAssay: async function({
        assay_id
    }, context) {
        if (await checkAuthorization(context, 'assay', 'delete') === true) {
            if (await validForDeletion(assay_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return assay.deleteOne(assay_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateAssay - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAssay: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assay', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAssay = await assay.updateOne(inputSanitized, benignErrorReporter);
            await updatedAssay.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedAssay;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateAssayWithStudy_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), assay);
        }
        return await assay.bulkAssociateAssayWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayWithStudy_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), assay);
        }
        return await assay.bulkDisAssociateAssayWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateAssay - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAssay: async function(_, context) {
        if (await checkAuthorization(context, 'assay', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assay.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}