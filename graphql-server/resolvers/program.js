/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const program = require(path.join(__dirname, '..', 'models', 'index.js')).program;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addLeadPerson': 'contact',
    'addTrials': 'trial',
    'addObservationUnits': 'observationUnit'
}



/**
 * program.prototype.leadPerson - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
program.prototype.leadPerson = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.leadPersonDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneContact({
                [models.contact.idAttribute()]: this.leadPersonDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.contact.idAttribute(),
                "value": this.leadPersonDbId,
                "operator": "eq"
            });
            let found = await resolvers.contacts({
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
 * program.prototype.trialsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
program.prototype.trialsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.trials({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * program.prototype.countFilteredTrials - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
program.prototype.countFilteredTrials = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countTrials({
        search: nsearch
    }, context);
}

/**
 * program.prototype.trialsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
program.prototype.trialsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.trialsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}
/**
 * program.prototype.observationUnitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
program.prototype.observationUnitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observationUnits({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * program.prototype.countFilteredObservationUnits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
program.prototype.countFilteredObservationUnits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationUnits({
        search: nsearch
    }, context);
}

/**
 * program.prototype.observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
program.prototype.observationUnitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "programDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationUnitsConnection({
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
program.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addTrials)) {
        promises_add.push(this.add_trials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservationUnits)) {
        promises_add.push(this.add_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addLeadPerson)) {
        promises_add.push(this.add_leadPerson(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeTrials)) {
        promises_remove.push(this.remove_trials(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservationUnits)) {
        promises_remove.push(this.remove_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeLeadPerson)) {
        promises_remove.push(this.remove_leadPerson(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_trials - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.add_trials = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addTrials.map(associatedRecordId => {
        return {
            programDbId: this.getIdValue(),
            [models.trial.idAttribute()]: associatedRecordId
        }
    });
    await models.trial.bulkAssociateTrialWithProgramDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observationUnits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.add_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationUnits.map(associatedRecordId => {
        return {
            programDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkAssociateObservationUnitWithProgramDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_leadPerson - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.add_leadPerson = async function(input, benignErrorReporter) {
    await program.add_leadPersonDbId(this.getIdValue(), input.addLeadPerson, benignErrorReporter);
    this.leadPersonDbId = input.addLeadPerson;
}

/**
 * remove_trials - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.remove_trials = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeTrials.map(associatedRecordId => {
        return {
            programDbId: this.getIdValue(),
            [models.trial.idAttribute()]: associatedRecordId
        }
    });
    await models.trial.bulkDisAssociateTrialWithProgramDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observationUnits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.remove_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationUnits.map(associatedRecordId => {
        return {
            programDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkDisAssociateObservationUnitWithProgramDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_leadPerson - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
program.prototype.remove_leadPerson = async function(input, benignErrorReporter) {
    if (input.removeLeadPerson == this.leadPersonDbId) {
        await program.remove_leadPersonDbId(this.getIdValue(), input.removeLeadPerson, benignErrorReporter);
        this.leadPersonDbId = null;
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

    let program = await resolvers.readOneProgram({
        programDbId: id
    }, context);
    //check that record actually exists
    if (program === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(program.countFilteredTrials({}, context));
    promises_to_many.push(program.countFilteredObservationUnits({}, context));
    promises_to_one.push(program.leadPerson({}, context));

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
        throw new Error(`program with programDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * programs - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    programs: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "programs");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await program.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * programsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    programsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "programsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await program.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneProgram - Check user authorization and return one record with the specified programDbId in the programDbId argument.
     *
     * @param  {number} {programDbId}    programDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with programDbId requested
     */
    readOneProgram: async function({
        programDbId
    }, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneProgram");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await program.readById(programDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countPrograms - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPrograms: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await program.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableProgram - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableProgram: async function(_, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            return helper.vueTable(context.request, program, ["id", "abbreviation", "commonCropName", "documentationURL", "leadPersonDbId", "objective", "programName", "programDbId"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addProgram - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addProgram: async function(input, context) {
        let authorization = await checkAuthorization(context, 'program', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdProgram = await program.addOne(inputSanitized, benignErrorReporter);
            await createdProgram.handleAssociations(inputSanitized, benignErrorReporter);
            return createdProgram;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddProgramCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddProgramCsv: async function(_, context) {
        if (await checkAuthorization(context, 'program', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return program.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteProgram - Check user authorization and delete a record with the specified programDbId in the programDbId argument.
     *
     * @param  {number} {programDbId}    programDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteProgram: async function({
        programDbId
    }, context) {
        if (await checkAuthorization(context, 'program', 'delete') === true) {
            if (await validForDeletion(programDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return program.deleteOne(programDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateProgram - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateProgram: async function(input, context) {
        let authorization = await checkAuthorization(context, 'program', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedProgram = await program.updateOne(inputSanitized, benignErrorReporter);
            await updatedProgram.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedProgram;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateProgramWithLeadPersonDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateProgramWithLeadPersonDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                leadPersonDbId
            }) => leadPersonDbId)), models.contact);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), program);
        }
        return await program.bulkAssociateProgramWithLeadPersonDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateProgramWithLeadPersonDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateProgramWithLeadPersonDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                leadPersonDbId
            }) => leadPersonDbId)), models.contact);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                programDbId
            }) => programDbId)), program);
        }
        return await program.bulkDisAssociateProgramWithLeadPersonDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateProgram - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateProgram: async function(_, context) {
        if (await checkAuthorization(context, 'program', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return program.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}