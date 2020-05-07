const globals = require('../config/globals');
const helper = require('../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Measurement',
    storageType: 'generic',
    attributes: {
        measurement_id: 'String',
        name: 'String',
        method: 'String',
        reference: 'String',
        reference_link: 'String',
        value: 'Float',
        unit: 'String',
        short_name: 'String',
        comments: 'String',
        field_unit_id: 'Int',
        individual_id: 'String',
        accession_id: 'String'
    },
    associations: {
        individual: {
            type: 'to_one',
            target: 'Individual',
            targetKey: 'individual_id',
            keyIn: 'Measurement',
            targetStorageType: 'generic',
            label: 'name',
            name: 'individual',
            name_lc: 'individual',
            name_cp: 'Individual',
            target_lc: 'individual',
            target_lc_pl: 'individuals',
            target_pl: 'Individuals',
            target_cp: 'Individual',
            target_cp_pl: 'Individuals',
            keyIn_lc: 'measurement',
            holdsForeignKey: true
        },
        accession: {
            type: 'to_one',
            target: 'Accession',
            targetKey: 'accession_id',
            keyIn: 'Measurement',
            targetStorageType: 'generic',
            label: 'accession_id',
            name: 'accession',
            name_lc: 'accession',
            name_cp: 'Accession',
            target_lc: 'accession',
            target_lc_pl: 'accessions',
            target_pl: 'Accessions',
            target_cp: 'Accession',
            target_cp_pl: 'Accessions',
            keyIn_lc: 'measurement',
            holdsForeignKey: true
        }
    },
    internalId: 'measurement_id',
    id: {
        name: 'measurement_id',
        type: 'String'
    }
};

module.exports = class Measurement {

    /**
     * constructor - Creates an instance of the generic model Measurement.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        measurement_id,
        name,
        method,
        reference,
        reference_link,
        value,
        unit,
        short_name,
        comments,
        field_unit_id,
        individual_id,
        accession_id
    }) {
        this.measurement_id = measurement_id;
        this.name = name;
        this.method = method;
        this.reference = reference;
        this.reference_link = reference_link;
        this.value = value;
        this.unit = unit;
        this.short_name = short_name;
        this.comments = comments;
        this.field_unit_id = field_unit_id;
        this.individual_id = individual_id;
        this.accession_id = accession_id;
    }

    static get name() {
        return "measurement";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the Measurement record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (Measurement), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new Measurement(record)
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class Measurement;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Measurement} Instance of Measurement class.
     */
    static async readById(id) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readOneMeasurement is not implemented');
    }

    /**
     * countRecords - Count the number of records of model Measurement that match the filters provided
     * in the @search parameter. Returns the number of records counted.
     * @see: Cenzontle specifications for search object.
     * 
     * @param  {object} search Object with search filters.
     * @return {int} Number of records counted, that match the search filters.
     */
    static async countRecords(search) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countMeasurements is not implemented');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Measurement), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new Measurement(record) )
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Measurement;
     * @see: Cenzontle specifications for limit-offset pagination.
     * @see: Cenzontle specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @return {[Measurement]}    Array of instances of Measurement class.
     */
    static async readAll(search, order, pagination) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all measurements is not implemented');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Measurement), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Measurement;
     * @see: Cenzontle specificatons for cursor based pagination.
     * @see: Cenzontle specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with pagination properties.
     * @return { edges, pageInfo } Object with edges and pageInfo.
     */
    static async readAllCursor(search, order, pagination) {
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
        return Measurement.countRecords(search).then(countA => {
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
                }).includes("measurement_id")) {
                options['order'] = [...options['order'], ...[
                    ["measurement_id", "ASC"]
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
                        paginationSearch = helper.parseOrderCursorGeneric(search, options['order'], decoded_cursor, "measurement_id", pagination.includeCursor);
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        paginationSearch = helper.parseOrderCursorGenericBefore(search, options['order'], decoded_cursor, "measurement_id", pagination.includeCursor);
                    }
                }
            }

            /*
             *  Count (with pagination search filters)
             */
            return Measurement.countRecords(paginationSearch).then(countB => {
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
                    throw new Error(`Request of total measurements exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
                return Measurement.readAll(paginationSearch, order, paginationLimitOffset).then(records => {
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
     * addOne - Creates a new record of model Measurement with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (Measurement), with all its properties set from the new record created.
     * If this function fails to create the new record, returns null.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are set to 
     *       null at creation time.
     *    2. non-existent: attributes not listed on the input are set to null at 
     *       creation time.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Measurement(newRecord)
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class Measurement;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Measurement|null} If successfully created, returns an instance of 
     * Measurement class constructed with the new record, otherwise returns null.
     */
    static async addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addMeasurement is not implemented');
    }

    /**
     * updateOne - Updates the Measurement record whose id is equal to the value
     * of id attribute: 'measurement_id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (Measurement), with all its properties set from the record updated.
     * If this function fails to update the record, returns null.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Measurement(updatedRecord)
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class Measurement;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'measurement_id' should contains the id value of the record
     * that will be updated. 
     * @return {Measurement|null} If successfully created, returns an instance of 
     * Measurement class constructed with the new record, otherwise returns null.
     */
    static async updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateMeasurement is not implemented');
    }

    /**
     * deleteOne - Delete the record whose id is equal to the @id received as parameter.
     * Only if record was deleted successfully, returns the id of the deleted record.
     * If this function fails to delete the record, returns null.
     * 
     * @param  {String} id The id of the record that will be deleted.
     * @return {int|null} id of the record deleted or null if the operation failed.
     */
    static async deleteOne(id) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteMeasurement is not implemented');
    }

    static async bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddMeasurementCsv is not implemented');
    }

    static async csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplateMeasurement is not implemented');
    }

    /**
     * _addIndividual - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _addIndividual(measurement_id, individual_id) {
        return Measurement.updateOne({
            measurement_id: measurement_id,
            individual_id: individual_id
        });
    }
    /**
     * _addAccession - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _addAccession(measurement_id, accession_id) {
        return Measurement.updateOne({
            measurement_id: measurement_id,
            accession_id: accession_id
        });
    }

    /**
     * _removeIndividual - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _removeIndividual(measurement_id, individual_id) {
        return Measurement.updateOne({
            measurement_id: measurement_id,
            individual_id: null
        });
    }
    /**
     * _removeAccession - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _removeAccession(measurement_id, accession_id) {
        return Measurement.updateOne({
            measurement_id: measurement_id,
            accession_id: null
        });
    }


    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(Measurement.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Measurement.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Measurement.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Measurement.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Measurement.idAttribute()]
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