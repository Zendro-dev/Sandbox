/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const assayResult = require(path.join(__dirname, '..', 'models', 'index.js')).assayResult;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addAssay': 'assay',
    'addObservedMaterial': 'material',
    'addFileAttachments': 'fileAttachment',
    'addOntologyAnnotations': 'ontologyAnnotation'
}



/**
 * assayResult.prototype.assay - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assayResult.prototype.assay = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.assay_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneAssay({
                [models.assay.idAttribute()]: this.assay_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.assay.idAttribute(),
                "value": this.assay_id,
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
 * assayResult.prototype.observedMaterial - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
assayResult.prototype.observedMaterial = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.material_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneMaterial({
                [models.material.idAttribute()]: this.material_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.material.idAttribute(),
                "value": this.material_id,
                "operator": "eq"
            });
            let found = (await resolvers.materialsConnection({
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
 * assayResult.prototype.fileAttachmentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assayResult.prototype.fileAttachmentsFilter = function({
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
 * assayResult.prototype.countFilteredFileAttachments - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assayResult.prototype.countFilteredFileAttachments = function({
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
 * assayResult.prototype.fileAttachmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assayResult.prototype.fileAttachmentsConnection = function({
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
 * assayResult.prototype.ontologyAnnotationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
assayResult.prototype.ontologyAnnotationsFilter = function({
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
 * assayResult.prototype.countFilteredOntologyAnnotations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
assayResult.prototype.countFilteredOntologyAnnotations = function({
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
 * assayResult.prototype.ontologyAnnotationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
assayResult.prototype.ontologyAnnotationsConnection = function({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addFileAttachments)) {
        promises_add.push(this.add_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addOntologyAnnotations)) {
        promises_add.push(this.add_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addAssay)) {
        promises_add.push(this.add_assay(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addObservedMaterial)) {
        promises_add.push(this.add_observedMaterial(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeFileAttachments)) {
        promises_remove.push(this.remove_fileAttachments(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeOntologyAnnotations)) {
        promises_remove.push(this.remove_ontologyAnnotations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeAssay)) {
        promises_remove.push(this.remove_assay(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeObservedMaterial)) {
        promises_remove.push(this.remove_observedMaterial(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_fileAttachments - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.add_fileAttachments = async function(input, benignErrorReporter) {

    await assayResult.add_fileAttachment_ids(this.getIdValue(), input.addFileAttachments, benignErrorReporter);
    this.fileAttachment_ids = helper.unionIds(this.fileAttachment_ids, input.addFileAttachments);
}

/**
 * add_ontologyAnnotations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.add_ontologyAnnotations = async function(input, benignErrorReporter) {

    await assayResult.add_ontologyAnnotation_ids(this.getIdValue(), input.addOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.unionIds(this.ontologyAnnotation_ids, input.addOntologyAnnotations);
}

/**
 * add_assay - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.add_assay = async function(input, benignErrorReporter) {
    await assayResult.add_assay_id(this.getIdValue(), input.addAssay, benignErrorReporter);
    this.assay_id = input.addAssay;
}

/**
 * add_observedMaterial - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.add_observedMaterial = async function(input, benignErrorReporter) {
    await assayResult.add_material_id(this.getIdValue(), input.addObservedMaterial, benignErrorReporter);
    this.material_id = input.addObservedMaterial;
}

/**
 * remove_fileAttachments - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.remove_fileAttachments = async function(input, benignErrorReporter) {

    await assayResult.remove_fileAttachment_ids(this.getIdValue(), input.removeFileAttachments, benignErrorReporter);
    this.fileAttachment_ids = helper.differenceIds(this.fileAttachment_ids, input.removeFileAttachments);
}

/**
 * remove_ontologyAnnotations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.remove_ontologyAnnotations = async function(input, benignErrorReporter) {

    await assayResult.remove_ontologyAnnotation_ids(this.getIdValue(), input.removeOntologyAnnotations, benignErrorReporter);
    this.ontologyAnnotation_ids = helper.differenceIds(this.ontologyAnnotation_ids, input.removeOntologyAnnotations);
}

/**
 * remove_assay - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.remove_assay = async function(input, benignErrorReporter) {
    if (input.removeAssay == this.assay_id) {
        await assayResult.remove_assay_id(this.getIdValue(), input.removeAssay, benignErrorReporter);
        this.assay_id = null;
    }
}

/**
 * remove_observedMaterial - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
assayResult.prototype.remove_observedMaterial = async function(input, benignErrorReporter) {
    if (input.removeObservedMaterial == this.material_id) {
        await assayResult.remove_material_id(this.getIdValue(), input.removeObservedMaterial, benignErrorReporter);
        this.material_id = null;
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

    let assayResult = await resolvers.readOneAssayResult({
        assayResult_id: id
    }, context);
    //check that record actually exists
    if (assayResult === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(assayResult.countFilteredFileAttachments({}, context));
    promises_to_many.push(assayResult.countFilteredOntologyAnnotations({}, context));
    promises_to_one.push(assayResult.assay({}, context));
    promises_to_one.push(assayResult.observedMaterial({}, context));

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
        throw new Error(`assayResult with assayResult_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * assayResults - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    assayResults: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "assayResults");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assayResult.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * assayResultsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    assayResultsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "assayResultsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assayResult.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneAssayResult - Check user authorization and return one record with the specified assayResult_id in the assayResult_id argument.
     *
     * @param  {number} {assayResult_id}    assayResult_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with assayResult_id requested
     */
    readOneAssayResult: async function({
        assayResult_id
    }, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneAssayResult");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assayResult.readById(assayResult_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countAssayResults - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countAssayResults: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await assayResult.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableAssayResult - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableAssayResult: async function(_, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            return helper.vueTable(context.request, assayResult, ["id", "assayResult_id", "unit", "value_as_str", "assay_id", "material_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addAssayResult - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addAssayResult: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assayResult', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdAssayResult = await assayResult.addOne(inputSanitized, benignErrorReporter);
            await createdAssayResult.handleAssociations(inputSanitized, benignErrorReporter);
            return createdAssayResult;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddAssayResultCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddAssayResultCsv: async function(_, context) {
        if (await checkAuthorization(context, 'assayResult', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assayResult.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteAssayResult - Check user authorization and delete a record with the specified assayResult_id in the assayResult_id argument.
     *
     * @param  {number} {assayResult_id}    assayResult_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteAssayResult: async function({
        assayResult_id
    }, context) {
        if (await checkAuthorization(context, 'assayResult', 'delete') === true) {
            if (await validForDeletion(assayResult_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return assayResult.deleteOne(assayResult_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateAssayResult - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateAssayResult: async function(input, context) {
        let authorization = await checkAuthorization(context, 'assayResult', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedAssayResult = await assayResult.updateOne(inputSanitized, benignErrorReporter);
            await updatedAssayResult.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedAssayResult;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateAssayResultWithAssay_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayResultWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assayResult_id
            }) => assayResult_id)), assayResult);
        }
        return await assayResult.bulkAssociateAssayResultWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateAssayResultWithMaterial_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateAssayResultWithMaterial_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_id
            }) => material_id)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assayResult_id
            }) => assayResult_id)), assayResult);
        }
        return await assayResult.bulkAssociateAssayResultWithMaterial_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayResultWithAssay_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayResultWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assayResult_id
            }) => assayResult_id)), assayResult);
        }
        return await assayResult.bulkDisAssociateAssayResultWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateAssayResultWithMaterial_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateAssayResultWithMaterial_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_id
            }) => material_id)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assayResult_id
            }) => assayResult_id)), assayResult);
        }
        return await assayResult.bulkDisAssociateAssayResultWithMaterial_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateAssayResult - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateAssayResult: async function(_, context) {
        if (await checkAuthorization(context, 'assayResult', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return assayResult.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}