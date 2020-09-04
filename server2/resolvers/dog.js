/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const dog = require(path.join(__dirname, '..', 'models', 'index.js')).dog;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addPerson': 'person'
}



/**
 * dog.prototype.person - Return associated record
 *
 * @param  {object} search       Search argument to match the associated record
 * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}         Associated record
 */
dog.prototype.person = async function({
    search
}, context) {

    if (helper.isNotUndefinedAndNotNull(this.person_id)) {
        if (search === undefined || search === null) {
            return resolvers.readOnePerson({
                [models.person.idAttribute()]: this.person_id
            }, context)
        } else {
            //build new search filter
            let nsearch = helper.addSearchField({
                "search": search,
                "field": models.person.idAttribute(),
                "value": {
                    "value": this.person_id
                },
                "operator": "eq"
            });
            let found = await resolvers.people({
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
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
dog.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];

    if (helper.isNotUndefinedAndNotNull(input.addPerson)) {
        promises.push(this.add_person(input, benignErrorReporter));
    }

    if (helper.isNotUndefinedAndNotNull(input.removePerson)) {
        promises.push(this.remove_person(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_person - field Mutation for to_one associations to add
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
dog.prototype.add_person = async function(input, benignErrorReporter) {
    await dog.add_person_id(this.getIdValue(), input.addPerson, benignErrorReporter);
    this.person_id = input.addPerson;
}

/**
 * remove_person - field Mutation for to_one associations to remove
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
dog.prototype.remove_person = async function(input, benignErrorReporter) {
    if (input.removePerson == this.person_id) {
        await dog.remove_person_id(this.getIdValue(), input.removePerson, benignErrorReporter);
        this.person_id = null;
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

    let dog = await resolvers.readOneDog({
        dog_id: id
    }, context);
    //check that record actually exists
    if (dog === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_one.push(dog.person({}, context));

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
        throw new Error(`dog with dog_id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * dogs - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    dogs: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "dogs");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await dog.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * dogsConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    dogsConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = pagination.first !== undefined ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "dogsConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await dog.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOneDog - Check user authorization and return one record with the specified dog_id in the dog_id argument.
     *
     * @param  {number} {dog_id}    dog_id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with dog_id requested
     */
    readOneDog: async function({
        dog_id
    }, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOneDog");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await dog.readById(dog_id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countDogs - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countDogs: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await dog.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTableDog - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTableDog: async function(_, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            return helper.vueTable(context.request, dog, ["id", "name", "dog_id", "person_id"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addDog - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addDog: async function(input, context) {
        let authorization = await checkAuthorization(context, 'dog', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdDog = await dog.addOne(inputSanitized, benignErrorReporter);
            await createdDog.handleAssociations(inputSanitized, benignErrorReporter);
            return createdDog;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddDogCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddDogCsv: async function(_, context) {
        if (await checkAuthorization(context, 'dog', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return dog.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deleteDog - Check user authorization and delete a record with the specified dog_id in the dog_id argument.
     *
     * @param  {number} {dog_id}    dog_id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deleteDog: async function({
        dog_id
    }, context) {
        if (await checkAuthorization(context, 'dog', 'delete') === true) {
            if (await validForDeletion(dog_id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return dog.deleteOne(dog_id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updateDog - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updateDog: async function(input, context) {
        let authorization = await checkAuthorization(context, 'dog', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedDog = await dog.updateOne(inputSanitized, benignErrorReporter);
            await updatedDog.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedDog;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAssociateDogWithPerson_id - bulkAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkAssociateDogWithPerson_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                person_id
            }) => person_id)), models.person);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                dog_id
            }) => dog_id)), dog);
        }
        return await dog.bulkAssociateDogWithPerson_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },
    /**
     * bulkDisAssociateDogWithPerson_id - bulkDisAssociaton resolver of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove , 
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string} returns message on success
     */
    bulkDisAssociateDogWithPerson_id: async function(bulkAssociationInput, context) {
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        // if specified, check existence of the unique given ids
        if (!bulkAssociationInput.skipAssociationsExistenceChecks) {
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                person_id
            }) => person_id)), models.person);
            await helper.validateExistence(helper.unique(bulkAssociationInput.bulkAssociationInput.map(({
                dog_id
            }) => dog_id)), dog);
        }
        return await dog.bulkDisAssociateDogWithPerson_id(bulkAssociationInput.bulkAssociationInput, benignErrorReporter);
    },

    /**
     * csvTableTemplateDog - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplateDog: async function(_, context) {
        if (await checkAuthorization(context, 'dog', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return dog.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}