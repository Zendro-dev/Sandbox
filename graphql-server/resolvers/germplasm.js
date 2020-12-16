/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const germplasm = require(path.join(__dirname, '..', 'models', 'index.js')).germplasm;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addBreedingMethod': 'breedingMethod',
    'addObservationUnits': 'observationUnit',
    'addObservations': 'observation'
}



/**
 * germplasm.prototype.breedingMethod - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
germplasm.prototype.breedingMethod = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.breedingMethodDbId)) {
        if (search === undefined || search === null) {
            return resolvers.readOneBreedingMethod({
                [models.breedingMethod.idAttribute()]: this.breedingMethodDbId
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.breedingMethod.idAttribute(),
                "value": this.breedingMethodDbId,
                "operator": "eq"
            });
            let found = await resolvers.breedingMethods({
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
 * germplasm.prototype.observationUnitsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
germplasm.prototype.observationUnitsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
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
 * germplasm.prototype.countFilteredObservationUnits - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
germplasm.prototype.countFilteredObservationUnits = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservationUnits({
        search: nsearch
    }, context);
}

/**
 * germplasm.prototype.observationUnitsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
germplasm.prototype.observationUnitsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
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
 * germplasm.prototype.observationsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
germplasm.prototype.observationsFilter = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });

    return resolvers.observations({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * germplasm.prototype.countFilteredObservations - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
germplasm.prototype.countFilteredObservations = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.countObservations({
        search: nsearch
    }, context);
}

/**
 * germplasm.prototype.observationsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
germplasm.prototype.observationsConnection = function({
    search,
    order,
    pagination
}, context) {


    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "germplasmDbId",
        "value": this.getIdValue(),
        "operator": "eq"
    });
    return resolvers.observationsConnection({
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
germplasm.prototype.handleAssociations = async function(input, benignErrorReporter) {

    let promises_add = [];
    if (helper.isNonEmptyArray(input.addObservationUnits)) {
        promises_add.push(this.add_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addObservations)) {
        promises_add.push(this.add_observations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addBreedingMethod)) {
        promises_add.push(this.add_breedingMethod(input, benignErrorReporter));
    }

    await Promise.all(promises_add);
    let promises_remove = [];
    if (helper.isNonEmptyArray(input.removeObservationUnits)) {
        promises_remove.push(this.remove_observationUnits(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeObservations)) {
        promises_remove.push(this.remove_observations(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeBreedingMethod)) {
        promises_remove.push(this.remove_breedingMethod(input, benignErrorReporter));
    }

    await Promise.all(promises_remove);

}
/**
 * add_observationUnits - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.add_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservationUnits.map(associatedRecordId => {
        return {
            germplasmDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_observations - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.add_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.addObservations.map(associatedRecordId => {
        return {
            germplasmDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkAssociateObservationWithGermplasmDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * add_breedingMethod - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.add_breedingMethod = async function(input, benignErrorReporter) {
    await germplasm.add_breedingMethodDbId(this.getIdValue(), input.addBreedingMethod, benignErrorReporter);
    this.breedingMethodDbId = input.addBreedingMethod;
}

/**
 * remove_observationUnits - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.remove_observationUnits = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservationUnits.map(associatedRecordId => {
        return {
            germplasmDbId: this.getIdValue(),
            [models.observationUnit.idAttribute()]: associatedRecordId
        }
    });
    await models.observationUnit.bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_observations - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.remove_observations = async function(input, benignErrorReporter) {

    let bulkAssociationInput = input.removeObservations.map(associatedRecordId => {
        return {
            germplasmDbId: this.getIdValue(),
            [models.observation.idAttribute()]: associatedRecordId
        }
    });
    await models.observation.bulkDisAssociateObservationWithGermplasmDbId(bulkAssociationInput, benignErrorReporter);
}

/**
 * remove_breedingMethod - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
germplasm.prototype.remove_breedingMethod = async function(input, benignErrorReporter) {
    if (input.removeBreedingMethod == this.breedingMethodDbId) {
        await germplasm.remove_breedingMethodDbId(this.getIdValue(), input.removeBreedingMethod, benignErrorReporter);
        this.breedingMethodDbId = null;
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

    let germplasm = await resolvers.readOneGermplasm({
        germplasmDbId: id
    }, context);
    //check that record actually exists
    if (germplasm === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(germplasm.countFilteredObservationUnits({}, context));
    promises_to_many.push(germplasm.countFilteredObservations({}, context));
    promises_to_one.push(germplasm.breedingMethod({}, context));

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
        throw new Error(`germplasm with germplasmDbId ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * germplasms - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    germplasms: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "germplasms");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await germplasm.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * germplasmsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    germplasmsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "germplasmsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await germplasm.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneGermplasm - Check user authorization and return one record with the specified germplasmDbId in the germplasmDbId argument.
     *
     * @param  {number} {germplasmDbId}    germplasmDbId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with germplasmDbId requested
     */
    readOneGermplasm: async function({
        germplasmDbId
    }, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneGermplasm");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await germplasm.readById(germplasmDbId, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countGermplasms - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countGermplasms: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await germplasm.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableGermplasm - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableGermplasm: async function(_, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            return helper.vueTable(context.request, germplasm, ["id", "accessionNumber", "breedingMethodDbId", "commonCropName", "countryOfOriginCode", "defaultDisplayName", "documentationURL", "germplasmGenus", "germplasmName", "germplasmPUI", "germplasmPreprocessing", "germplasmSpecies", "germplasmSubtaxa", "instituteCode", "instituteName", "pedigree", "seedSource", "seedSourceDescription", "speciesAuthority", "subtaxaAuthority", "xref", "germplasmDbId", "biologicalStatusOfAccessionCode"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addGermplasm - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addGermplasm: async function(input, context) {
        let authorization = await checkAuthorization(context, 'germplasm', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdGermplasm = await germplasm.addOne(inputSanitized, benignErrorReporter);
            await createdGermplasm.handleAssociations(inputSanitized, benignErrorReporter);
            return createdGermplasm;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddGermplasmCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddGermplasmCsv: async function(_, context) {
        if (await checkAuthorization(context, 'germplasm', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return germplasm.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteGermplasm - Check user authorization and delete a record with the specified germplasmDbId in the germplasmDbId argument.
     *
     * @param  {number} {germplasmDbId}    germplasmDbId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteGermplasm: async function({
        germplasmDbId
    }, context) {
        if (await checkAuthorization(context, 'germplasm', 'delete') === true) {
            if (await validForDeletion(germplasmDbId, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return germplasm.deleteOne(germplasmDbId, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateGermplasm - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateGermplasm: async function(input, context) {
        let authorization = await checkAuthorization(context, 'germplasm', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedGermplasm = await germplasm.updateOne(inputSanitized, benignErrorReporter);
            await updatedGermplasm.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedGermplasm;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateGermplasmWithBreedingMethodDbId - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateGermplasmWithBreedingMethodDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                breedingMethodDbId
            }) => breedingMethodDbId)), models.breedingMethod);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), germplasm);
        }
        return await germplasm.bulkAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateGermplasmWithBreedingMethodDbId - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateGermplasmWithBreedingMethodDbId: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                breedingMethodDbId
            }) => breedingMethodDbId)), models.breedingMethod);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                germplasmDbId
            }) => germplasmDbId)), germplasm);
        }
        return await germplasm.bulkDisAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateGermplasm - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateGermplasm: async function(_, context) {
        if (await checkAuthorization(context, 'germplasm', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return germplasm.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}