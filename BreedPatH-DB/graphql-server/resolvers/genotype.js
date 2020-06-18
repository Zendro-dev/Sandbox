/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const genotype = require(path.join(__dirname, '..', 'models', 'index.js')).genotype;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addMother': 'individual',
    'addFather': 'individual',
    'addIndividual': 'individual',
    'addBreeding_pool': 'breeding_pool',
    'addField_plot': 'field_plot'
}



/**
 * genotype.prototype.mother - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
genotype.prototype.mother = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.mother_id)) {
        if (search === undefined) {
            return resolvers.readOneIndividual({
                [models.individual.idAttribute()]: this.mother_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.individual.idAttribute(),
                "value": {
                    "value": this.mother_id
                },
                "operator": "eq"
            });
            let found = await resolvers.individuals({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}
/**
 * genotype.prototype.father - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
genotype.prototype.father = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.father_id)) {
        if (search === undefined) {
            return resolvers.readOneIndividual({
                [models.individual.idAttribute()]: this.father_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.individual.idAttribute(),
                "value": {
                    "value": this.father_id
                },
                "operator": "eq"
            });
            let found = await resolvers.individuals({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}
/**
 * genotype.prototype.individual - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
genotype.prototype.individual = async function({
    search
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "genotype_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    let found = await resolvers.individuals({
        search: nsearch
    }, context);
    if (found) {
        if (found.length > 1) {
            let foundIds = [];
            found.forEach(individual => {
                foundIds.push(individual.getIdValue())
            })
            context.benignErrors.push(new Error(
                `Not unique "to_one" association Error: Found ${found.length} individuals matching genotype with id ${this.getIdValue()}. Consider making this association a "to_many", using unique constraints, or moving the foreign key into the genotype model. Returning first individual. Found individuals ${models.individual.idAttribute()}s: [${foundIds.toString()}]`
            ));
        }
        return found[0];
    }
    return found;
}
/**
 * genotype.prototype.breeding_pool - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
genotype.prototype.breeding_pool = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.breeding_pool_id)) {
        if (search === undefined) {
            return resolvers.readOneBreeding_pool({
                [models.breeding_pool.idAttribute()]: this.breeding_pool_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.breeding_pool.idAttribute(),
                "value": {
                    "value": this.breeding_pool_id
                },
                "operator": "eq"
            });
            let found = await resolvers.breeding_pools({
                search: nsearch
            }, context);
            if (found) {
                return found[0]
            }
            return found;
        }
    }
}

/**
 * genotype.prototype.field_plotFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
genotype.prototype.field_plotFilter = function({
    search,
    order,
    pagination
}, context) {
    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "genotype_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.field_plots({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}

/**
 * genotype.prototype.countFilteredField_plot - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
genotype.prototype.countFilteredField_plot = function({
    search
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "genotype_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.countField_plots({
        search: nsearch
    }, context);
}

/**
 * genotype.prototype.field_plotConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
genotype.prototype.field_plotConnection = function({
    search,
    order,
    pagination
}, context) {

    //build new search filter
    let nsearch = helper.addSearchField({
        "search": search,
        "field": "genotype_id",
        "value": {
            "value": this.getIdValue()
        },
        "operator": "eq"
    });

    return resolvers.field_plotsConnection({
        search: nsearch,
        order: order,
        pagination: pagination
    }, context);
}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addField_plot)) {
        promises.push(this.add_field_plot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addMother)) {
        promises.push(this.add_mother(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addFather)) {
        promises.push(this.add_father(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addIndividual)) {
        promises.push(this.add_individual(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.addBreeding_pool)) {
        promises.push(this.add_breeding_pool(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeField_plot)) {
        promises.push(this.remove_field_plot(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeMother)) {
        promises.push(this.remove_mother(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeFather)) {
        promises.push(this.remove_father(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeIndividual)) {
        promises.push(this.remove_individual(input, benignErrorReporter));
    }
    if (helper.isNotUndefinedAndNotNull(input.removeBreeding_pool)) {
        promises.push(this.remove_breeding_pool(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_field_plot - field Mutation for to_many associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.add_field_plot = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.addField_plot) {
        results.push(models.field_plot.add_genotype_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * add_mother - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.add_mother = async function(input, benignErrorReporter) {
    await genotype.add_mother_id(this.getIdValue(), input.addMother, benignErrorReporter);
    this.mother_id = input.addMother;
}

/**
 * add_father - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.add_father = async function(input, benignErrorReporter) {
    await genotype.add_father_id(this.getIdValue(), input.addFather, benignErrorReporter);
    this.father_id = input.addFather;
}

/**
 * add_individual - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.add_individual = async function(input, benignErrorReporter) {
    await models.individual.add_genotype_id(input.addIndividual, this.getIdValue(), benignErrorReporter);
}

/**
 * add_breeding_pool - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.add_breeding_pool = async function(input, benignErrorReporter) {
    await genotype.add_breeding_pool_id(this.getIdValue(), input.addBreeding_pool, benignErrorReporter);
    this.breeding_pool_id = input.addBreeding_pool;
}

/**
 * remove_field_plot - field Mutation for to_many associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.remove_field_plot = async function(input, benignErrorReporter) {
    let results = [];
    for await (associatedRecordId of input.removeField_plot) {
        results.push(models.field_plot.remove_genotype_id(associatedRecordId, this.getIdValue(), benignErrorReporter));
    }
    await Promise.all(results);
}

/**
 * remove_mother - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.remove_mother = async function(input, benignErrorReporter) {
    if (input.removeMother == this.mother_id) {
        await genotype.remove_mother_id(this.getIdValue(), input.removeMother, benignErrorReporter);
        this.mother_id = null;
    }
}

/**
 * remove_father - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.remove_father = async function(input, benignErrorReporter) {
    if (input.removeFather == this.father_id) {
        await genotype.remove_father_id(this.getIdValue(), input.removeFather, benignErrorReporter);
        this.father_id = null;
    }
}

/**
 * remove_individual - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.remove_individual = async function(input, benignErrorReporter) {
    await models.individual.remove_genotype_id(input.removeIndividual, this.getIdValue(), benignErrorReporter);
}

/**
 * remove_breeding_pool - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services
 */
genotype.prototype.remove_breeding_pool = async function(input, benignErrorReporter) {
    if (input.removeBreeding_pool == this.breeding_pool_id) {
        await genotype.remove_breeding_pool_id(this.getIdValue(), input.removeBreeding_pool, benignErrorReporter);
        this.breeding_pool_id = null;
    }
}



/**
 * errorMessageForRecordsLimit(query) - returns error message in case the record limit is exceeded.
 *
 * @param {string} query The query that failed
 */
function errorMessageForRecordsLimit(query) {
    return "Max record limit of " + globals.LIMIT_RECORDS + " exceeded in " + query;
}

/**
 * checkCountAndReduceRecordsLimit(search, context, query) - Make sure that the current set of requested records does not exceed the record limit set in globals.js.
 *
 * @param {object} search  Search argument for filtering records
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @param {string} query The query that makes this check
 */
async function checkCountAndReduceRecordsLimit(search, context, query) {
    let count = (await genotype.countRecords(search));
    if (count > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit(query));
    }
    context.recordsLimit -= count;
}

/**
 * checkCountForOneAndReduceRecordsLimit(context) - Make sure that the record limit is not exhausted before requesting a single record
 *
 * @param {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 */
function checkCountForOneAndReduceRecordsLimit(context) {
    if (1 > context.recordsLimit) {
        throw new Error(errorMessageForRecordsLimit("readOneGenotype"));
    }
    context.recordsLimit -= 1;
}
/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let genotype = await resolvers.readOneGenotype({
        id: id
    }, context);
    //check that record actually exists
    if (genotype === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(genotype.countFilteredField_plot({}, context));
    promises_to_one.push(genotype.mother({}, context));
    promises_to_one.push(genotype.father({}, context));
    promises_to_one.push(genotype.individual({}, context));
    promises_to_one.push(genotype.breeding_pool({}, context));

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
        throw new Error(`genotype with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * genotypes - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    genotypes: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "genotypes");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await genotype.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * genotypesConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    genotypesConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            await checkCountAndReduceRecordsLimit(search, context, "genotypesConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await genotype.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneGenotype - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOneGenotype: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            checkCountForOneAndReduceRecordsLimit(context);
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await genotype.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countGenotypes - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countGenotypes: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await genotype.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableGenotype - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableGenotype: async function(_, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            return helper.vueTable(context.request, genotype, ["id", "name", "description", "pedigree_type"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addGenotype - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addGenotype: async function(input, context) {
        let authorization = await checkAuthorization(context, 'genotype', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdGenotype = await genotype.addOne(inputSanitized, benignErrorReporter);
            await createdGenotype.handleAssociations(inputSanitized, context);
            return createdGenotype;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddGenotypeCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddGenotypeCsv: async function(_, context) {
        if (await checkAuthorization(context, 'genotype', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return genotype.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteGenotype - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteGenotype: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'genotype', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return genotype.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateGenotype - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateGenotype: async function(input, context) {
        let authorization = await checkAuthorization(context, 'genotype', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedGenotype = await genotype.updateOne(inputSanitized, benignErrorReporter);
            await updatedGenotype.handleAssociations(inputSanitized, context);
            return updatedGenotype;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * csvTableTemplateGenotype - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateGenotype: async function(_, context) {
        if (await checkAuthorization(context, 'genotype', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return genotype.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}