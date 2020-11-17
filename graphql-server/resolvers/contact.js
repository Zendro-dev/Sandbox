/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const contact = require(path.join(__dirname, '..', 'models', 'index.js')).contact;
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
    'addTrials': 'trial',
    'addPrograms': 'program'
}




/**
 * contact.prototype.studiesFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
contact.prototype.studiesFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
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
 * contact.prototype.countFilteredStudies - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
contact.prototype.countFilteredStudies = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countStudies({
        search: nsearch
    }, context);
}

/**
 * contact.prototype.studiesConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
contact.prototype.studiesConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.study.idAttribute(),
        "value": this.studyDbIds.join(','),
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
 * contact.prototype.trialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
contact.prototype.trialsFilter = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.trial.idAttribute(),
        "value": this.trialDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.trials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * contact.prototype.countFilteredTrials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
contact.prototype.countFilteredTrials = function({
    search
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.trial.idAttribute(),
        "value": this.trialDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countTrials({
        search: nsearch
    }, context);
}

/**
 * contact.prototype.trialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
contact.prototype.trialsConnection = function({
    search,
    order,
    pagination
}, context) {


    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.trial.idAttribute(),
        "value": this.trialDbIds.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.trialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * contact.prototype.programsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
contact.prototype.programsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "leadPersonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.programs({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * contact.prototype.countFilteredPrograms - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
contact.prototype.countFilteredPrograms = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "leadPersonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countPrograms({
        search: nsearch
    }, context);
}

/**
 * contact.prototype.programsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
contact.prototype.programsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "leadPersonDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.programsConnection({
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
contact.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addStudies)) {
        promises_add.push(this.add_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addTrials)) {
        promises_add.push(this.add_trials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addPrograms)) {
        promises_add.push(this.add_programs(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeStudies)) {
        promises_remove.push(this.remove_studies(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeTrials)) {
        promises_remove.push(this.remove_trials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removePrograms)) {
        promises_remove.push(this.remove_programs(input, benignErrorReporter));
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
contact.prototype.add_studies = async function(input, benignErrorReporter) {

    await contact.add_studyDbIds(this.getIdValue(), input.addStudies, benignErrorReporter);
    this.studyDbIds = helper.unionIds(this.studyDbIds, input.addStudies);
}

/**
 * add_trials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
contact.prototype.add_trials = async function(input, benignErrorReporter) {

    await contact.add_trialDbIds(this.getIdValue(), input.addTrials, benignErrorReporter);
    this.trialDbIds = helper.unionIds(this.trialDbIds, input.addTrials);
}

/**
 * add_programs - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
contact.prototype.add_programs = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addPrograms.map(associatedRecordId => {
        return {
            leadPersonDbId: this.getIdValue(),
            [models.program.idAttribute()]: associatedRecordId
        }
    });
    await models.program.bulkAssociateProgramWithLeadPersonDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_studies - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
contact.prototype.remove_studies = async function(input, benignErrorReporter) {

    await contact.remove_studyDbIds(this.getIdValue(), input.removeStudies, benignErrorReporter);
    this.studyDbIds = helper.differenceIds(this.studyDbIds, input.removeStudies);
}

/**
 * remove_trials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
contact.prototype.remove_trials = async function(input, benignErrorReporter) {

    await contact.remove_trialDbIds(this.getIdValue(), input.removeTrials, benignErrorReporter);
    this.trialDbIds = helper.differenceIds(this.trialDbIds, input.removeTrials);
}

/**
 * remove_programs - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
contact.prototype.remove_programs = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removePrograms.map(associatedRecordId => {
        return {
            leadPersonDbId: this.getIdValue(),
            [models.program.idAttribute()]: associatedRecordId
        }
    });
    await models.program.bulkDisAssociateProgramWithLeadPersonDbId(bulkAssociationInput, benignErrorReporter);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let contact = await resolvers.readOneContact({
        contactDbId: id
    }, context);
    //check that record actually exists
    if (contact === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(contact.countFilteredStudies({}, context));
    promises_to_many.push(contact.countFilteredTrials({}, context));
    promises_to_many.push(contact.countFilteredPrograms({}, context));

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
        throw new Error(`contact with contactDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * contacts - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    contacts: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "contacts");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await contact.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * contactsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    contactsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "contactsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await contact.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneContact - Check user authorization and return one record with the specified contactDbId in the contactDbId argument.
     *
     * @param  {number} {contactDbId}    contactDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with contactDbId requested
     */
    readOneContact: async function({
        contactDbId
    }, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneContact");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await contact.readById(contactDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countContacts - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countContacts: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await contact.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableContact - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableContact: async function(_, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            return helper.vueTable(context.request, contact, ["id", "contactDbId", "email", "instituteName", "name", "orcid", "type"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addContact - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addContact: async function(input, context) {
        let authorization = await checkAuthorization(context, 'contact', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdContact = await contact.addOne(inputSanitized, benignErrorReporter);
            await createdContact.handleAssociations(inputSanitized, benignErrorReporter);
            return createdContact;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddContactCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddContactCsv: async function(_, context) {
        if (await checkAuthorization(context, 'contact', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return contact.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteContact - Check user authorization and delete a record with the specified contactDbId in the contactDbId argument.
     *
     * @param  {number} {contactDbId}    contactDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteContact: async function({
        contactDbId
    }, context) {
        if (await checkAuthorization(context, 'contact', 'delete') === true) {
            if (await validForDeletion(contactDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return contact.deleteOne(contactDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateContact - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateContact: async function(input, context) {
        let authorization = await checkAuthorization(context, 'contact', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedContact = await contact.updateOne(inputSanitized, benignErrorReporter);
            await updatedContact.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedContact;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplateContact - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateContact: async function(_, context) {
        if (await checkAuthorization(context, 'contact', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return contact.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}