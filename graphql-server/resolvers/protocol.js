/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const protocol = require(path.join(__dirname, '..', 'models', 'index.js')).protocol;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addStudies': 'study',
    'addAssays': 'assay',
    'addOntologyAnnotation': 'ontologyAnnotation',
    'addFileAttachments': 'fileAttachment'
}




/**
 * protocol.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
protocol.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_ids) || this.study_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.studies({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * protocol.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
protocol.prototype.countFilteredStudies = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_ids) || this.study_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * protocol.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
protocol.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.study_ids) || this.study_ids.length === 0) {
        return {
            edges: [],
            studies: [],
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
        "field": models.study.idAttribute(),
        "value": this.study_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.studiesConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * protocol.prototype.assaysFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
protocol.prototype.assaysFilter = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_ids) || this.assay_ids.length === 0) {
        return [];
    }
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.assays({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * protocol.prototype.countFilteredAssays - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
protocol.prototype.countFilteredAssays = function({
    search
}, context) {


    //return 0 if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_ids) || this.assay_ids.length === 0) {
        return 0;
    }

    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.assay.idAttribute(),
        "value": this.assay_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });

    return resolvers.countAssays({
        search: nsearch
    }, context);
}

/**
 * protocol.prototype.assaysConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
protocol.prototype.assaysConnection = function({
    search,
    order,
    pagination
}, context) {


    //return an empty response if the foreignKey Array is empty, no need to query the database
    if (!Array.isArray(this.assay_ids) || this.assay_ids.length === 0) {
        return {
            edges: [],
            assays: [],
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
        "field": models.assay.idAttribute(),
        "value": this.assay_ids.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.assaysConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * protocol.prototype.ontologyAnnotationFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
protocol.prototype.ontologyAnnotationFilter = function({
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
 * protocol.prototype.countFilteredOntologyAnnotation - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
protocol.prototype.countFilteredOntologyAnnotation = function({
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
 * protocol.prototype.ontologyAnnotationConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
protocol.prototype.ontologyAnnotationConnection = function({
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
 * protocol.prototype.fileAttachmentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
protocol.prototype.fileAttachmentsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocol_id",
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
 * protocol.prototype.countFilteredFileAttachments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
protocol.prototype.countFilteredFileAttachments = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocol_id",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countFileAttachments({
        search: nsearch
    }, context);
}

/**
 * protocol.prototype.fileAttachmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
protocol.prototype.fileAttachmentsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "protocol_id",
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
protocol.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addAssays)) {
        promises_add.push(this.add_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOntologyAnnotation)) {
        promises_add.push(this.add_ontologyAnnotation(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addFileAttachments)) {
        promises_add.push(this.add_fileAttachments(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeAssays)) {
        promises_remove.push(this.remove_assays(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOntologyAnnotation)) {
        promises_remove.push(this.remove_ontologyAnnotation(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFileAttachments)) {
        promises_remove.push(this.remove_fileAttachments(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_studies - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.add_studies = async function(input, benignErrorReporter) {

    await protocol.add_study_ids(this.getIdValue(), input.addStudies, benignErrorReporter);
    this.study_ids = helper.unionIds(this.study_ids, input.addStudies);
}

/**
 * add_assays - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.add_assays = async function(input, benignErrorReporter) {

    await protocol.add_assay_ids(this.getIdValue(), input.addAssays, benignErrorReporter);
    this.assay_ids = helper.unionIds(this.assay_ids, input.addAssays);
}

/**
 * add_ontologyAnnotation - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.add_ontologyAnnotation = async function(input, benignErrorReporter) {

    await protocol.add_ontologyAnnotation_ids(this.getIdValue(), input.addOntologyAnnotation, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.unionIds(this.ontologyAnnotation_ids, input.addOntologyAnnotation);
}

/**
 * add_fileAttachments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.add_fileAttachments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addFileAttachments.map(associatedRecordId => {
        return {
            protocol_id: this.getIdValue(),
            [models.fileAttachment.idAttribute()]: associatedRecordId
        }
    });
    await models.fileAttachment.bulkAssociateFileAttachmentWithProtocol_id(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.remove_studies = async function(input, benignErrorReporter) {

    await protocol.remove_study_ids(this.getIdValue(), input.removeStudies, benignErrorReporter);
    this.study_ids = helper.differenceIds(this.study_ids, input.removeStudies);
}

/**
 * remove_assays - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.remove_assays = async function(input, benignErrorReporter) {

    await protocol.remove_assay_ids(this.getIdValue(), input.removeAssays, benignErrorReporter);
    this.assay_ids = helper.differenceIds(this.assay_ids, input.removeAssays);
}

/**
 * remove_ontologyAnnotation - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.remove_ontologyAnnotation = async function(input, benignErrorReporter) {

    await protocol.remove_ontologyAnnotation_ids(this.getIdValue(), input.removeOntologyAnnotation, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.differenceIds(this.ontologyAnnotation_ids, input.removeOntologyAnnotation);
}

/**
 * remove_fileAttachments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
protocol.prototype.remove_fileAttachments = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeFileAttachments.map(associatedRecordId => {
        return {
            protocol_id: this.getIdValue(),
            [models.fileAttachment.idAttribute()]: associatedRecordId
        }
    });
    await models.fileAttachment.bulkDisAssociateFileAttachmentWithProtocol_id(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let protocol = await resolvers.readOneProtocol({
        protocol_id: id
    }, context);
    //check that record actually exists
    if (protocol === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(protocol.countFilteredStudies({}, context));
    promises_to_many.push(protocol.countFilteredAssays({}, context));
    promises_to_many.push(protocol.countFilteredOntologyAnnotation({}, context));
    promises_to_many.push(protocol.countFilteredFileAttachments({}, context));

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
        throw new Error(`protocol with protocol_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * protocols - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    protocols: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "protocols");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await protocol.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * protocolsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    protocolsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "protocolsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await protocol.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneProtocol - Check user authorization and return one record with the specified protocol_id in the protocol_id argument.
     *
     * @param  {number} {protocol_id}    protocol_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with protocol_id requested
     */
    readOneProtocol: async function({
        protocol_id
    }, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneProtocol");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await protocol.readById(protocol_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countProtocols - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countProtocols: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await protocol.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableProtocol - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableProtocol: async function(_, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            return helper.vueTable(context.request, protocol, ["id", "protocol_id", "name", "description"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addProtocol - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addProtocol: async function(input, context) {
        let authorization = await checkAuthorization(context, 'protocol', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdProtocol = await protocol.addOne(inputSanitized, benignErrorReporter);
            await createdProtocol.handleAssociations(inputSanitized, benignErrorReporter);
            return createdProtocol;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddProtocolCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddProtocolCsv: async function(_, context) {
        if (await checkAuthorization(context, 'protocol', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return protocol.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteProtocol - Check user authorization and delete a record with the specified protocol_id in the protocol_id argument.
     *
     * @param  {number} {protocol_id}    protocol_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteProtocol: async function({
        protocol_id
    }, context) {
        if (await checkAuthorization(context, 'protocol', 'delete') === true) {
            if (await validForDeletion(protocol_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return protocol.deleteOne(protocol_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateProtocol - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateProtocol: async function(input, context) {
        let authorization = await checkAuthorization(context, 'protocol', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedProtocol = await protocol.updateOne(inputSanitized, benignErrorReporter);
            await updatedProtocol.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedProtocol;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateProtocol - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateProtocol: async function(_, context) {
        if (await checkAuthorization(context, 'protocol', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return protocol.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}