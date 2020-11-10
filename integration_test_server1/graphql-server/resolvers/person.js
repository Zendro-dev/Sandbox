/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const person = require(path.join(__dirname, '..', 'models', 'index.js')).person;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const os = require('os');
const resolvers = require(path.join(__dirname, 'index.js'));
const models = require(path.join(__dirname, '..', 'models', 'index.js'));
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');

const associationArgsDef = {
    'addFriends': 'person',
    'addParents': 'person',
    'addChildren': 'person'
}




/**
 * person.prototype.friendsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
person.prototype.friendsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.friends_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.friends_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.people({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * person.prototype.countFilteredFriends - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredFriends = function({
    search
}, context) {


    if (this.friends_id.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.friends_id.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * person.prototype.friendsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.friendsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.friends_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.friends_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.peopleConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * person.prototype.parentsFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
person.prototype.parentsFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.parents_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.parents_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.people({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * person.prototype.countFilteredParents - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredParents = function({
    search
}, context) {


    if (this.parents_id.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.parents_id.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * person.prototype.parentsConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.parentsConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.parents_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.parents_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.peopleConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}
/**
 * person.prototype.childrenFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
person.prototype.childrenFilter = function({
    search,
    order,
    pagination
}, context) {


    if (this.children_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.children_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.people({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }
}

/**
 * person.prototype.countFilteredChildren - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredChildren = function({
    search
}, context) {


    if (this.children_id.length === 0) return 0;
    let nsearch = helper.addSearchField({
        "search": search,
        "field": models.person.idAttribute(),
        "value": this.children_id.join(','),
        "valueType": "Array",
        "operator": "in"
    });
    return resolvers.countPeople({
        search: nsearch
    }, context);
}

/**
 * person.prototype.childrenConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.childrenConnection = function({
    search,
    order,
    pagination
}, context) {


    if (this.children_id.length !== 0) {
        let nsearch = helper.addSearchField({
            "search": search,
            "field": models.person.idAttribute(),
            "value": this.children_id.join(','),
            "valueType": "Array",
            "operator": "in"
        });
        return resolvers.peopleConnection({
            search: nsearch,
            order: order,
            pagination: pagination
        }, context);
    }

}




/**
 * handleAssociations - handles the given associations in the create and update case.
 *
 * @param {object} input   Info of each field to create the new record
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.handleAssociations = async function(input, benignErrorReporter) {
    let promises = [];
    if (helper.isNonEmptyArray(input.addFriends)) {
        promises.push(this.add_friends(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addParents)) {
        promises.push(this.add_parents(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.addChildren)) {
        promises.push(this.add_children(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeFriends)) {
        promises.push(this.remove_friends(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeParents)) {
        promises.push(this.remove_parents(input, benignErrorReporter));
    }
    if (helper.isNonEmptyArray(input.removeChildren)) {
        promises.push(this.remove_children(input, benignErrorReporter));
    }

    await Promise.all(promises);
}
/**
 * add_friends - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.add_friends = async function(input, benignErrorReporter) {

    await person.add_friends_id(this.getIdValue(), input.addFriends, benignErrorReporter);
    this.friends_id = helper.unionIds(this.friends_id, input.addFriends);
}

/**
 * add_parents - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.add_parents = async function(input, benignErrorReporter) {

    await person.add_parents_id(this.getIdValue(), input.addParents, benignErrorReporter);
    this.parents_id = helper.unionIds(this.parents_id, input.addParents);
}

/**
 * add_children - field Mutation for to_many associations to add
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to add  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.add_children = async function(input, benignErrorReporter) {

    await person.add_children_id(this.getIdValue(), input.addChildren, benignErrorReporter);
    this.children_id = helper.unionIds(this.children_id, input.addChildren);
}

/**
 * remove_friends - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.remove_friends = async function(input, benignErrorReporter) {

    await person.remove_friends_id(this.getIdValue(), input.removeFriends, benignErrorReporter);
    this.friends_id = helper.differenceIds(this.friends_id, input.removeFriends);
}

/**
 * remove_parents - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.remove_parents = async function(input, benignErrorReporter) {

    await person.remove_parents_id(this.getIdValue(), input.removeParents, benignErrorReporter);
    this.parents_id = helper.differenceIds(this.parents_id, input.removeParents);
}

/**
 * remove_children - field Mutation for to_many associations to remove
 * uses bulkAssociate to efficiently update associations
 *
 * @param {object} input   Info of input Ids to remove  the association
 * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
 */
person.prototype.remove_children = async function(input, benignErrorReporter) {

    await person.remove_children_id(this.getIdValue(), input.removeChildren, benignErrorReporter);
    this.children_id = helper.differenceIds(this.children_id, input.removeChildren);
}



/**
 * countAllAssociatedRecords - Count records associated with another given record
 *
 * @param  {ID} id      Id of the record which the associations will be counted
 * @param  {objec} context Default context by resolver
 * @return {Int}         Number of associated records
 */
async function countAllAssociatedRecords(id, context) {

    let person = await resolvers.readOnePerson({
        id: id
    }, context);
    //check that record actually exists
    if (person === null) throw new Error(`Record with ID = ${id} does not exist`);
    let promises_to_many = [];
    let promises_to_one = [];

    promises_to_many.push(person.countFilteredFriends({}, context));
    promises_to_many.push(person.countFilteredParents({}, context));
    promises_to_many.push(person.countFilteredChildren({}, context));

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
        throw new Error(`person with id ${id} has associated records and is NOT valid for deletion. Please clean up before you delete.`);
    }
    return true;
}

module.exports = {
    /**
     * people - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Offset and limit to get the records from and to respectively
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records holding conditions specified by search, order and pagination argument
     */
    people: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(pagination.limit, context, "people");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await person.readAll(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * peopleConnection - Check user authorization and return certain number, specified in pagination argument, of records that
     * holds the condition of search argument, all of them sorted as specified by the order argument.
     *
     * @param  {object} search     Search argument for filtering records
     * @param  {array} order       Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
     * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
     */
    peopleConnection: async function({
        search,
        order,
        pagination
    }, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            helper.checkCursorBasedPaginationArgument(pagination);
            let limit = helper.isNotUndefinedAndNotNull(pagination.first) ? pagination.first : pagination.last;
            helper.checkCountAndReduceRecordsLimit(limit, context, "peopleConnection");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await person.readAllCursor(search, order, pagination, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * readOnePerson - Check user authorization and return one record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with id requested
     */
    readOnePerson: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            helper.checkCountAndReduceRecordsLimit(1, context, "readOnePerson");
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await person.readById(id, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * countPeople - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPeople: async function({
        search
    }, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return await person.countRecords(search, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * vueTablePerson - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTablePerson: async function(_, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            return helper.vueTable(context.request, person, ["id", "id", "name", "email"]);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * addPerson - Check user authorization and creates a new record with data specified in the input argument.
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPerson: async function(input, context) {
        let authorization = await checkAuthorization(context, 'person', 'create');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let createdPerson = await person.addOne(inputSanitized, benignErrorReporter);
            await createdPerson.handleAssociations(inputSanitized, benignErrorReporter);
            return createdPerson;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * bulkAddPersonCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPersonCsv: async function(_, context) {
        if (await checkAuthorization(context, 'person', 'create') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return person.bulkAddCsv(context, benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * deletePerson - Check user authorization and delete a record with the specified id in the id argument.
     *
     * @param  {number} {id}    id of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePerson: async function({
        id
    }, context) {
        if (await checkAuthorization(context, 'person', 'delete') === true) {
            if (await validForDeletion(id, context)) {
                let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
                return person.deleteOne(id, benignErrorReporter);
            }
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },

    /**
     * updatePerson - Check user authorization and update the record specified in the input argument
     * This function only handles attributes, not associations.
     * @see handleAssociations for further information.
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePerson: async function(input, context) {
        let authorization = await checkAuthorization(context, 'person', 'update');
        if (authorization === true) {
            let inputSanitized = helper.sanitizeAssociationArguments(input, [Object.keys(associationArgsDef)]);
            await helper.checkAuthorizationOnAssocArgs(inputSanitized, context, associationArgsDef, ['read', 'create'], models);
            await helper.checkAndAdjustRecordLimitForCreateUpdate(inputSanitized, context, associationArgsDef);
            if (!input.skipAssociationsExistenceChecks) {
                await helper.validateAssociationArgsExistence(inputSanitized, context, associationArgsDef);
            }
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            let updatedPerson = await person.updateOne(inputSanitized, benignErrorReporter);
            await updatedPerson.handleAssociations(inputSanitized, benignErrorReporter);
            return updatedPerson;
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    },


    /**
     * csvTableTemplatePerson - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePerson: async function(_, context) {
        if (await checkAuthorization(context, 'person', 'read') === true) {
            let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
            return person.csvTableTemplate(benignErrorReporter);
        } else {
            throw new Error("You don't have authorization to perform this action");
        }
    }

}