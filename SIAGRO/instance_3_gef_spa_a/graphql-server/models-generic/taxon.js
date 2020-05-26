const _ = require('lodash');
const globals = require('../config/globals');
const helper = require('../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Taxon',
    storageType: 'generic',
    attributes: {
        id: 'String',
        taxon: 'String',
        categoria: 'String',
        estatus: 'String',
        nombreAutoridad: 'String',
        citaNomenclatural: 'String',
        fuente: 'String',
        ambiente: 'String',
        grupoSNIB: 'String',
        categoriaResidencia: 'String',
        nom: 'String',
        cites: 'String',
        iucn: 'String',
        prioritarias: 'String',
        endemismo: 'String'
    },
    associations: {
        accessions: {
            type: 'to_many',
            target: 'Accession',
            targetKey: 'taxon_id',
            keyIn: 'Accession',
            targetStorageType: 'sql',
            label: 'collection_name',
            sublabel: 'accession_id',
            name: 'accessions',
            name_lc: 'accessions',
            name_cp: 'Accessions',
            target_lc: 'accession',
            target_lc_pl: 'accessions',
            target_pl: 'Accessions',
            target_cp: 'Accession',
            target_cp_pl: 'Accessions',
            keyIn_lc: 'accession',
            holdsForeignKey: false
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

module.exports = class Taxon {

    /**
     * constructor - Creates an instance of the generic model Taxon.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */
    constructor({
        id,
        taxon,
        categoria,
        estatus,
        nombreAutoridad,
        citaNomenclatural,
        fuente,
        ambiente,
        grupoSNIB,
        categoriaResidencia,
        nom,
        cites,
        iucn,
        prioritarias,
        endemismo
    }) {
        this.id = id;
        this.taxon = taxon;
        this.categoria = categoria;
        this.estatus = estatus;
        this.nombreAutoridad = nombreAutoridad;
        this.citaNomenclatural = citaNomenclatural;
        this.fuente = fuente;
        this.ambiente = ambiente;
        this.grupoSNIB = grupoSNIB;
        this.categoriaResidencia = categoriaResidencia;
        this.nom = nom;
        this.cites = cites;
        this.iucn = iucn;
        this.prioritarias = prioritarias;
        this.endemismo = endemismo;
    }

    static get name() {
        return "taxon";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the Taxon record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (Taxon), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new Taxon(record)
     * 
     * Thrown on:
     *    * No record found.
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class Taxon;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Taxon} Instance of Taxon class.
     */
    static async readById(id) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readById() is not implemented for model Taxon');
    }

    /**
     * countRecords - Count the number of records of model Taxon that match the filters provided
     * in the @search parameter. Returns the number of records counted.
     * @see: Cenzontle specifications for search object.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {object} search Object with search filters.
     * @return {int} Number of records counted, that match the search filters.
     */
    static async countRecords(search) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countRecords() is not implemented for model Taxon');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Taxon), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new Taxon(record) )
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Taxon;
     * @see: Cenzontle specifications for limit-offset pagination.
     * @see: Cenzontle specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @return {[Taxon]}    Array of instances of Taxon class.
     */
    static async readAll(search, order, pagination) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readAll() is not implemented for model Taxon');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Taxon), where each instance
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
     * @see: constructor() of the class Taxon;
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
        return Taxon.countRecords(search).then(countA => {
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
            return Taxon.countRecords(paginationSearch).then(countB => {
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
                    throw new Error(`Request of total taxons exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
                return Taxon.readAll(paginationSearch, order, paginationLimitOffset).then(records => {
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
     * addOne - Creates a new record of model Taxon with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (Taxon), with all its properties set from the new record created.
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
     *    new Taxon(newRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class Taxon;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Taxon} If successfully created, returns an instance of 
     * Taxon class constructed with the new record, otherwise throws an error.
     */
    static async addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addOne() is not implemented for model Taxon');
    }

    /**
     * updateOne - Updates the Taxon record whose id is equal to the value
     * of id attribute: 'id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (Taxon), with all its properties set from the record updated.
     * If this function fails to update the record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Taxon(updatedRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class Taxon;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'id' should contains the id value of the record
     * that will be updated. 
     * @return {Taxon} If successfully created, returns an instance of 
     * Taxon class constructed with the new record, otherwise throws an error.
     */
    static async updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateOne() is not implemented for model Taxon');
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
     * @param  {String} id The id of the record that will be deleted.
     * @return {int} id of the record deleted or throws an error if the operation failed.
     */
    static async deleteOne(id) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteOne is not implemented for model Taxon');
    }

    static async bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddCsv() is not implemented for model Taxon');
    }

    static async csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplate() is not implemented for model Taxon');
    }









    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Taxon.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Taxon.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Taxon.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Taxon.idAttribute()]
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(Taxon.definition.attributes);
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