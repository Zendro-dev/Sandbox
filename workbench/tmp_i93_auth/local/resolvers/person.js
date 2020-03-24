/*
    Resolvers for basic CRUD operations
*/

const path = require('path');
const person = require(path.join(__dirname, '..', 'models_index.js')).person;
const helper = require('../utils/helper');
const checkAuthorization = require('../utils/check-authorization');
const fs = require('fs');
const {
    handleError
} = require('../utils/errors');
const os = require('os');





/**
 * person.prototype.worksFilter - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Offset and limit to get the records from and to respectively
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of associated records holding conditions specified by search, order and pagination argument
 */
person.prototype.worksFilter = function({
    search,
    order,
    pagination
}, context) {
    try {
        return this.worksFilterImpl({
            search,
            order,
            pagination
        });
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}

/**
 * person.prototype.countFilteredWorks - Count number of associated records that holds the conditions specified in the search argument
 *
 * @param  {object} {search} description
 * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {type}          Number of associated records that holds the conditions specified in the search argument
 */
person.prototype.countFilteredWorks = function({
    search
}, context) {
    try {
        return this.countFilteredWorksImpl({
            search
        });
    } catch (error) {
        console.error(error);
        handleError(error);
    };
}


/**
 * person.prototype.worksConnection - Check user authorization and return certain number, specified in pagination argument, of records
 * associated with the current instance, this records should also
 * holds the condition of search argument, all of them sorted as specified by the order argument.
 *
 * @param  {object} search     Search argument for filtering associated records
 * @param  {array} order       Type of sorting (ASC, DESC) for each field
 * @param  {object} pagination Cursor and first(indicatig the number of records to retrieve) arguments to apply cursor-based pagination.
 * @param  {object} context     Provided to every resolver holds contextual information like the resquest query and user info.
 * @return {array}             Array of records as grapqhql connections holding conditions specified by search, order and pagination argument
 */
person.prototype.worksConnection = function({
    search,
    order,
    pagination
}, context) {
    try {
        return this.worksConnectionImpl({
            search,
            order,
            pagination
        });
    } catch (error) {
        console.error(error);
        handleError(error);
    };
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
    people: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            if (authorization === true) {
                return person.readAll(search, order, pagination);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
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
    peopleConnection: function({
        search,
        order,
        pagination
    }, context) {
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            if (authorization === true) {
                //check: adapters auth
                let authorizationCheck = helper.authorizedAdapters(context, person.Person.registeredAdapters, 'read');
                if (authorizationCheck.authorizedAdapters.length > 0) {
                    let connectionObj = person.readAllCursor(search, order, pagination, authorizationCheck.authorizedAdapters);
                    if (authorizationCheck.authorizationErrors.length > 0) {
                        connectionObj.edges.nodes.push(authorizationCheck.authorizationErrors);
                    }
                    return connectionObj;
                } else { //adapters not auth || errors
                    // else new Error
                    if (authorizationCheck.authorizationErrors.length > 0) {
                        throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                    } else {
                        throw new Error("You don't have authorization to perform this action on any adapter");
                    }
                }
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },


    /**
     * readOnePerson - Check user authorization and return one record with the specified internalPersonId in the internalPersonId argument.
     *
     * @param  {number} {internalPersonId}    internalPersonId of the record to retrieve
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Record with internalPersonId requested
     */
    readOnePerson: function({
        internalPersonId
    }, context) {
        //check: model auth
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            //check: adapter auth
            if (authorization === true) {
                checkAuthorization(context, person.adapterForIri(internalPersonId).name, 'read').then(authorizationAdapter => {
                    if (authorizationAdapter == true) {
                        return person.readById(internalPersonId);
                    } else { //adapter not auth
                        throw new Error("You don't have authorization to perform this action on adapter");
                    }
                }).catch(error => { //error on check: adapter auth
                    console.error(error);
                    handleError(error);
                })
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },

    /**
     * addPerson - Check user authorization and creates a new record with data specified in the input argument
     *
     * @param  {object} input   Info of each field to create the new record
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         New record created
     */
    addPerson: function(input, context) {
        //check: model auth
        return checkAuthorization(context, 'Person', 'create').then(authorization => {
            //check: adapter auth
            if (authorization === true) {
                if (!input.internalPersonId) {
                    throw new Error(`Illegal argument. Provided input requires attribute 'internalPersonId'.`);
                } //else
                checkAuthorization(context, person.adapterForIri(input.internalPersonId).name, 'create').then(authorizationAdapter => {
                    if (authorizationAdapter == true) {
                        return person.addOne(input);
                    } else { //adapter not auth
                        throw new Error("You don't have authorization to perform this action on adapter");
                    }
                }).catch(error => { //error on check: adapter auth
                    console.error(error);
                    handleError(error);
                })
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },

    /**
     * bulkAddPersonCsv - Load csv file of records
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     */
    bulkAddPersonCsv: function(_, context) {
        return checkAuthorization(context, 'Person', 'create').then(authorization => {
            if (authorization === true) {
                return person.bulkAddCsv(context);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * deletePerson - Check user authorization and delete a record with the specified internalPersonId in the internalPersonId argument.
     *
     * @param  {number} {internalPersonId}    internalPersonId of the record to delete
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {string}         Message indicating if deletion was successfull.
     */
    deletePerson: function({
        internalPersonId
    }, context) {
        //check: model auth
        return checkAuthorization(context, 'Person', 'delete').then(authorization => {
            //check: adapter auth
            if (authorization === true) {
                checkAuthorization(context, person.adapterForIri(internalPersonId).name, 'delete').then(authorizationAdapter => {
                    if (authorizationAdapter == true) {
                        return person.deleteOne(internalPersonId);
                    } else { //adapter not auth
                        throw new Error("You don't have authorization to perform this action on adapter");
                    }
                }).catch(error => { //error on check: adapter auth
                    console.error(error);
                    handleError(error);
                })
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },

    /**
     * updatePerson - Check user authorization and update the record specified in the input argument
     *
     * @param  {object} input   record to update and new info to update
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Updated record
     */
    updatePerson: function(input, context) {
        //check: model auth
        return checkAuthorization(context, 'Person', 'update').then(authorization => {
            //check: adapter auth
            if (authorization === true) {
                if (!input.internalPersonId) {
                    throw new Error(`Illegal argument. Provided input requires attribute 'internalPersonId'.`);
                } //else
                checkAuthorization(context, person.adapterForIri(input.internalPersonId).name, 'update').then(authorizationAdapter => {
                    if (authorizationAdapter == true) {
                        return person.updateOne(input);
                    } else { //adapter not auth
                        throw new Error("You don't have authorization to perform this action on adapter");
                    }
                }).catch(error => { //error on check: adapter auth
                    console.error(error);
                    handleError(error);
                })
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },

    /**
     * countPeople - Counts number of records that holds the conditions specified in the search argument
     *
     * @param  {object} {search} Search argument for filtering records
     * @param  {object} context  Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {number}          Number of records that holds the conditions specified in the search argument
     */
    countPeople: function({
        search
    }, context) {
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            if (authorization === true) {
                //check: adapters auth
                let authorizationCheck = helper.authorizedAdapters(context, person.Person.registeredAdapters, 'read');
                if (authorizationCheck.authorizedAdapters.length > 0) {
                    return person.countRecords(search, authorizationCheck.authorizedAdapters);
                } else { //adapters not auth || errors
                    // else new Error
                    if (authorizationCheck.authorizationErrors.length > 0) {
                        throw new Error(authorizationCheck.authorizationErrors.reduce((a, c) => `${a}, ${c.message}`));
                    } else {
                        throw new Error("You don't have authorization to perform this action on any adapter");
                    }
                }
            } else { //model not auth
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => { //error on check: model auth
            console.error(error);
            handleError(error);
        });
    },

    /**
     * vueTablePerson - Return table of records as needed for displaying a vuejs table
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {object}         Records with format as needed for displaying a vuejs table
     */
    vueTablePerson: function(_, context) {
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            if (authorization === true) {
                return helper.vueTable(context.request, person, ["id", "firstName", "lastName", "email", "internalPersonId"]);
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    },

    /**
     * csvTableTemplatePerson - Returns table's template
     *
     * @param  {string} _       First parameter is not used
     * @param  {object} context Provided to every resolver holds contextual information like the resquest query and user info.
     * @return {Array}         Strings, one for header and one columns types
     */
    csvTableTemplatePerson: function(_, context) {
        return checkAuthorization(context, 'Person', 'read').then(authorization => {
            if (authorization === true) {
                return person.csvTableTemplate();
            } else {
                throw new Error("You don't have authorization to perform this action");
            }
        }).catch(error => {
            console.error(error);
            handleError(error);
        })
    }

}