/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const fileAttachment = require(path.join(__dirname, '..', 'models', 'index.js')).fileAttachment;
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
    'addStudy': 'study',
    'addAssay': 'assay',
    'addFactor': 'factor',
    'addMaterial': 'material',
    'addProtocol': 'protocol'
}



/**
 * fileAttachment.prototype.investigation - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.investigation = async function({
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
 * fileAttachment.prototype.study - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.study = async function({
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
 * fileAttachment.prototype.assay - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.assay = async function({
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
 * fileAttachment.prototype.factor - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.factor = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.factor_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneFactor({
                [models.factor.idAttribute()]: this.factor_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.factor.idAttribute(),
                "value": this.factor_id,
                "operator": "eq"
            });
            let found = (await resolvers.factorsConnection({
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
 * fileAttachment.prototype.material - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.material = async function({
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
 * fileAttachment.prototype.protocol - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
fileAttachment.prototype.protocol = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.protocol_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOneProtocol({
                [models.protocol.idAttribute()]: this.protocol_id
            }, context)
        } else {

            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.protocol.idAttribute(),
                "value": this.protocol_id,
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];

    if (helper.isNotUndefinedAndNotNull(input.addInvestigation)) {
        promises_add.push(this.add_investigation(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addStudy)) {
        promises_add.push(this.add_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addAssay)) {
        promises_add.push(this.add_assay(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addFactor)) {
        promises_add.push(this.add_factor(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMaterial)) {
        promises_add.push(this.add_material(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addProtocol)) {
        promises_add.push(this.add_protocol(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];

    if (helper.isNotUndefinedAndNotNull(input.removeInvestigation)) {
        promises_remove.push(this.remove_investigation(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeStudy)) {
        promises_remove.push(this.remove_study(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeAssay)) {
        promises_remove.push(this.remove_assay(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeFactor)) {
        promises_remove.push(this.remove_factor(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMaterial)) {
        promises_remove.push(this.remove_material(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeProtocol)) {
        promises_remove.push(this.remove_protocol(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_investigation - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_investigation = async function(input, benignErrorReporter) {
    await fileAttachment.add_investigation_id(this.getIdValue(), input.addInvestigation, benignErrorReporter);
    this.investigation_id = input.addInvestigation;
}

/**
 * add_study - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_study = async function(input, benignErrorReporter) {
    await fileAttachment.add_study_id(this.getIdValue(), input.addStudy, benignErrorReporter);
    this.study_id = input.addStudy;
}

/**
 * add_assay - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_assay = async function(input, benignErrorReporter) {
    await fileAttachment.add_assay_id(this.getIdValue(), input.addAssay, benignErrorReporter);
    this.assay_id = input.addAssay;
}

/**
 * add_factor - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_factor = async function(input, benignErrorReporter) {
    await fileAttachment.add_factor_id(this.getIdValue(), input.addFactor, benignErrorReporter);
    this.factor_id = input.addFactor;
}

/**
 * add_material - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_material = async function(input, benignErrorReporter) {
    await fileAttachment.add_material_id(this.getIdValue(), input.addMaterial, benignErrorReporter);
    this.material_id = input.addMaterial;
}

/**
 * add_protocol - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.add_protocol = async function(input, benignErrorReporter) {
    await fileAttachment.add_protocol_id(this.getIdValue(), input.addProtocol, benignErrorReporter);
    this.protocol_id = input.addProtocol;
}

/**
 * remove_investigation - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_investigation = async function(input, benignErrorReporter) {
    if (input.removeInvestigation == this.investigation_id) {
        await fileAttachment.remove_investigation_id(this.getIdValue(), input.removeInvestigation, benignErrorReporter);
        this.investigation_id = null;
    }
}

/**
 * remove_study - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_study = async function(input, benignErrorReporter) {
    if (input.removeStudy == this.study_id) {
        await fileAttachment.remove_study_id(this.getIdValue(), input.removeStudy, benignErrorReporter);
        this.study_id = null;
    }
}

/**
 * remove_assay - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_assay = async function(input, benignErrorReporter) {
    if (input.removeAssay == this.assay_id) {
        await fileAttachment.remove_assay_id(this.getIdValue(), input.removeAssay, benignErrorReporter);
        this.assay_id = null;
    }
}

/**
 * remove_factor - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_factor = async function(input, benignErrorReporter) {
    if (input.removeFactor == this.factor_id) {
        await fileAttachment.remove_factor_id(this.getIdValue(), input.removeFactor, benignErrorReporter);
        this.factor_id = null;
    }
}

/**
 * remove_material - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_material = async function(input, benignErrorReporter) {
    if (input.removeMaterial == this.material_id) {
        await fileAttachment.remove_material_id(this.getIdValue(), input.removeMaterial, benignErrorReporter);
        this.material_id = null;
    }
}

/**
 * remove_protocol - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
fileAttachment.prototype.remove_protocol = async function(input, benignErrorReporter) {
    if (input.removeProtocol == this.protocol_id) {
        await fileAttachment.remove_protocol_id(this.getIdValue(), input.removeProtocol, benignErrorReporter);
        this.protocol_id = null;
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

    let fileAttachment = await resolvers.readOneFileAttachment({
        id: id
    }, context);
    //check that record actually exists
    if (fileAttachment === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(fileAttachment.investigation({}, context));
    promises_to_one.push(fileAttachment.study({}, context));
    promises_to_one.push(fileAttachment.assay({}, context));
    promises_to_one.push(fileAttachment.factor({}, context));
    promises_to_one.push(fileAttachment.material({}, context));
    promises_to_one.push(fileAttachment.protocol({}, context));

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
        throw new Error(`fileAttachment with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * fileAttachments - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    fileAttachments: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "fileAttachments");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await fileAttachment.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * fileAttachmentsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    fileAttachmentsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "fileAttachmentsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await fileAttachment.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneFileAttachment - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneFileAttachment: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneFileAttachment");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await fileAttachment.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countFileAttachments - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countFileAttachments: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await fileAttachment.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableFileAttachment - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableFileAttachment: async function(_, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            return helper.vueTable(context.request, fileAttachment, ["id", "fileName", "fileURL", "mimeType", "identifierName", "investigation_id", "study_id", "assay_id", "factor_id", "material_id", "protocol_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addFileAttachment - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addFileAttachment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'fileAttachment', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdFileAttachment = await fileAttachment.uploadFileAttachment(inputSanitized, benignErrorReporter);
            await createdFileAttachment.handleAssociations(inputSanitized, benignErrorReporter);
            return createdFileAttachment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    uploadFileAttachment: async function({file}, context){
        return await fileAttachment.uploadFileAttachment(file,context);
    },

    /**
     * bulkAddFileAttachmentCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddFileAttachmentCsv: async function(_, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return fileAttachment.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteFileAttachment - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteFileAttachment: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return fileAttachment.deleteFileAttachment(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateFileAttachment - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateFileAttachment: async function(input, context) {
        let authorization = await checkAuthorization(context, 'fileAttachment', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedFileAttachment = await fileAttachment.updateFileAttachment(inputSanitized, benignErrorReporter);
            await updatedFileAttachment.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedFileAttachment;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateFileAttachmentWithInvestigation_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithInvestigation_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_id
            }) => investigation_id)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateFileAttachmentWithStudy_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateFileAttachmentWithAssay_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateFileAttachmentWithFactor_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithFactor_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_id
            }) => factor_id)), models.factor);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithFactor_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateFileAttachmentWithMaterial_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithMaterial_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_id
            }) => material_id)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithMaterial_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkAssociateFileAttachmentWithProtocol_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateFileAttachmentWithProtocol_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_id
            }) => protocol_id)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkAssociateFileAttachmentWithProtocol_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithInvestigation_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithInvestigation_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                investigation_id
            }) => investigation_id)), models.investigation);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithStudy_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithStudy_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                study_id
            }) => study_id)), models.study);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithStudy_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithAssay_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithAssay_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                assay_id
            }) => assay_id)), models.assay);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithAssay_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithFactor_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithFactor_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                factor_id
            }) => factor_id)), models.factor);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithFactor_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithMaterial_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithMaterial_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                material_id
            }) => material_id)), models.material);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithMaterial_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateFileAttachmentWithProtocol_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateFileAttachmentWithProtocol_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                protocol_id
            }) => protocol_id)), models.protocol);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                id
            }) => id)), fileAttachment);
        }
        return await fileAttachment.bulkDisAssociateFileAttachmentWithProtocol_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateFileAttachment - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateFileAttachment: async function(_, context) {
        if (await checkAuthorization(context, 'fileAttachment', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return fileAttachment.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}