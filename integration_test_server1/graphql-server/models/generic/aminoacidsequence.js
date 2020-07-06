const _ = require('lodash');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'aminoacidsequence',
    storageType: 'generic',
    attributes: {
        accession: 'String',
        sequence: 'String'
    },
    associations: {
        transcript_counts: {
            type: 'to_many',
            target: 'transcript_count',
            targetKey: 'aminoacidsequence_id',
            keyIn: 'transcript_count',
            targetStorageType: 'sql'
        }
    },
    id: {
        name: 'id',
        type: 'Int'
    }
};

module.exports = class aminoacidsequence {

    /**
     * constructor - Creates an instance of the generic model aminoacidsequence.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */
    constructor({
        id,
        accession,
        sequence
    }) {
        this.id = id;
        this.accession = accession;
        this.sequence = sequence;
    }

    static get name() {
        return "aminoacidsequence";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the aminoacidsequence record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (aminoacidsequence), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new aminoacidsequence(record)
     * 
     * Thrown on:
     *    * No record found.
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class aminoacidsequence;
     * 
     * @param  {Int} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {aminoacidsequence} Instance of aminoacidsequence class.
     */
    static async readById(id, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readById() is not implemented for model aminoacidsequence');
    }

    /**
     * countRecords - Count the number of records of model aminoacidsequence that match the filters provided
     * in the @search parameter. Returns the number of records counted.
     * @see: Zendro specifications for search object.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {object} search Object with search filters.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} Number of records counted, that match the search filters.
     */
    static async countRecords(search, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countRecords() is not implemented for model aminoacidsequence');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (aminoacidsequence), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new aminoacidsequence(record) )
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class aminoacidsequence;
     * @see: Zendro specifications for limit-offset pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {[aminoacidsequence]}    Array of instances of aminoacidsequence class.
     */
    static async readAll(search, order, pagination, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readAll() is not implemented for model aminoacidsequence');
    }

    /**
     * readAllCursor - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (aminoacidsequence), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class aminoacidsequence;
     * @see: Zendro specificatons for cursor based pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return { edges, pageInfo } Object with edges and pageInfo.
     */
    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let options = {};
        options['where'] = {};

        /*
         * Search conditions
         */
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }
        }
        let paginationSearch = null;

        /*
         * Count
         */
        return aminoacidsequence.countRecords(search, benignErrorReporter).then(countA => {
            options['offset'] = 0;
            options['order'] = [];
            options['limit'] = countA;
            /*
             * Order conditions
             */
            if (order !== undefined) {
                options['order'] = order.map((orderItem) => {
                    return [orderItem.field, orderItem.order];
                });
            }
            if (!options['order'].map(orderItem => {
                    return orderItem[0]
                }).includes("id")) {
                options['order'] = [...options['order'], ...[
                    ["id", "ASC"]
                ]];
            }

            /*
             * Pagination conditions
             */
            if (pagination) {
                //forward
                if (isForwardPagination) {
                    if (pagination.after) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.after));
                        paginationSearch = helper.parseOrderCursorGeneric(search, options['order'], decoded_cursor, "id", pagination.includeCursor);
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        paginationSearch = helper.parseOrderCursorGenericBefore(search, options['order'], decoded_cursor, "id", pagination.includeCursor);
                    }
                }
            }

            /*
             *  Count (with pagination search filters)
             */
            return aminoacidsequence.countRecords(paginationSearch, benignErrorReporter).then(countB => {
                /*
                 * Limit conditions
                 */
                if (pagination) {
                    //forward
                    if (isForwardPagination) {

                        if (pagination.first) {
                            options['limit'] = pagination.first;
                        }
                    } else { //backward
                        if (pagination.last) {
                            options['limit'] = pagination.last;
                            options['offset'] = Math.max((countB - pagination.last), 0);
                        }
                    }
                }

                //check: limit
                if (globals.LIMIT_RECORDS < options['limit']) {
                    throw new Error(`Request of total aminoacidsequences exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }

                //set equivalent limit/offset pagination
                let paginationLimitOffset = {
                    limit: options['limit'],
                    offset: options['offset'],
                }

                /*
                 * Get records
                 * 
                 * paginationSearch: includes order.
                 *
                 */
                return aminoacidsequence.readAll(paginationSearch, order, paginationLimitOffset, benignErrorReporter).then(records => {
                    let edges = [];
                    let pageInfo = {
                        hasPreviousPage: false,
                        hasNextPage: false,
                        startCursor: null,
                        endCursor: null
                    };

                    //edges
                    if (records.length > 0) {
                        edges = records.map(record => {
                            return {
                                node: record,
                                cursor: record.base64Enconde()
                            }
                        });
                    }

                    //forward
                    if (isForwardPagination) {

                        pageInfo = {
                            hasPreviousPage: ((countA - countB) > 0),
                            hasNextPage: (pagination && pagination.first ? (countB > pagination.first) : false),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    } else { //backward

                        pageInfo = {
                            hasPreviousPage: (pagination && pagination.last ? (countB > pagination.last) : false),
                            hasNextPage: ((countA - countB) > 0),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    }

                    return {
                        edges,
                        pageInfo
                    };

                }).catch(error => {
                    throw error;
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    }

    /**
     * addOne - Creates a new record of model aminoacidsequence with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (aminoacidsequence), with all its properties set from the new record created.
     * If this function fails to create the new record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are set to 
     *       null at creation time.
     *    2. non-existent: attributes not listed on the input are set to null at 
     *       creation time.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new aminoacidsequence(newRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class aminoacidsequence;
     * 
     * @param  {Int} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {aminoacidsequence} If successfully created, returns an instance of 
     * aminoacidsequence class constructed with the new record, otherwise throws an error.
     */
    static async addOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addOne() is not implemented for model aminoacidsequence');
    }

    /**
     * updateOne - Updates the aminoacidsequence record whose id is equal to the value
     * of id attribute: 'id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (aminoacidsequence), with all its properties set from the record updated.
     * If this function fails to update the record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new aminoacidsequence(updatedRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class aminoacidsequence;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'id' should contains the id value of the record
     * that will be updated.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {aminoacidsequence} If successfully created, returns an instance of 
     * aminoacidsequence class constructed with the new record, otherwise throws an error.
     */
    static async updateOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateOne() is not implemented for model aminoacidsequence');
    }

    /**
     * deleteOne - Delete the record whose id is equal to the @id received as parameter.
     * Only if record was deleted successfully, returns the id of the deleted record.
     * If this function fails to delete the record, should throw an error.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {Int} id The id of the record that will be deleted.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} id of the record deleted or throws an error if the operation failed.
     */
    static async deleteOne(id, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteOne is not implemented for model aminoacidsequence');
    }

    /**
     * bulkAddCsv - Allows the user to bulk-upload a set of records in CSV format.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async bulkAddCsv(context, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddCsv() is not implemented for model aminoacidsequence');
    }

    /**
     * csvTableTemplate - Allows the user to download a template in CSV format with the
     * properties and types of this model.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async csvTableTemplate(benignErrorReporter) {
        return helper.csvTableTemplate(definition);
    }









    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return aminoacidsequence.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return aminoacidsequence.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of aminoacidsequence.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[aminoacidsequence.idAttribute()]
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(aminoacidsequence.definition.attributes);
        attributes.push('id');
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    static externalIdsObject() {
        return {};
    }

};