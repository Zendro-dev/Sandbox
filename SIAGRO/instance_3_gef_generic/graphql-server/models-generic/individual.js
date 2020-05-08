const globals = require('../config/globals');
const helper = require('../utils/helper');
const GenericStorage = require('../generic-storage/GenericStorage');
const data = new GenericStorage({idName: 'name', dataFileName: 'individual-generic-data.json'});

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Individual',
    storageType: 'generic',
    attributes: {
        name: 'String',
        origin: 'String',
        description: 'String',
        accession_id: 'String',
        genotypeId: 'Int',
        field_unit_id: 'Int'
    },
    associations: {
        accession: {
            type: 'to_one',
            target: 'Accession',
            targetKey: 'accession_id',
            keyIn: 'Individual',
            targetStorageType: 'generic',
            label: 'accession_id',
            sublabel: 'institution_deposited',
            name: 'accession',
            name_lc: 'accession',
            name_cp: 'Accession',
            target_lc: 'accession',
            target_lc_pl: 'accessions',
            target_pl: 'Accessions',
            target_cp: 'Accession',
            target_cp_pl: 'Accessions',
            keyIn_lc: 'individual',
            holdsForeignKey: true
        },
        measurements: {
            type: 'to_many',
            target: 'Measurement',
            targetKey: 'individual_id',
            keyIn: 'Measurement',
            targetStorageType: 'generic',
            label: 'name',
            name: 'measurements',
            name_lc: 'measurements',
            name_cp: 'Measurements',
            target_lc: 'measurement',
            target_lc_pl: 'measurements',
            target_pl: 'Measurements',
            target_cp: 'Measurement',
            target_cp_pl: 'Measurements',
            keyIn_lc: 'measurement',
            holdsForeignKey: false
        }
    },
    internalId: 'name',
    id: {
        name: 'name',
        type: 'String'
    }
};

module.exports = class Individual {

    /**
     * constructor - Creates an instance of the generic model Individual.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        name,
        origin,
        description,
        accession_id,
        genotypeId,
        field_unit_id
    }) {
        this.name = name;
        this.origin = origin;
        this.description = description;
        this.accession_id = accession_id;
        this.genotypeId = genotypeId;
        this.field_unit_id = field_unit_id;
    }

    static get name() {
        return "individual";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the Individual record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (Individual), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new Individual(record)
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class Individual;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Individual} Instance of Individual class.
     */
    static async readById(id) {

        /*
        YOUR CODE GOES HERE
         */
        //throw new Error('readOneIndividual is not implemented');

        /**
         * Custom implementation
         */
        return data.readById(id)
        .then((result) => {
          return result ? new Individual(result) : null;
        })
        .catch((e)=>{
          throw e;
        });
    }

    /**
     * countRecords - Count the number of records of model Individual that match the filters provided
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
      //throw new Error('countIndividuals is not implemented');

      /**
       * Custom implementation
       */
      return data.countRecords(search)
      .then((result) => {
        return result;
      })
      .catch((e)=>{
        throw e;
      });
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Individual), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new Individual(record) )
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Individual;
     * @see: Cenzontle specifications for limit-offset pagination.
     * @see: Cenzontle specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @return {[Individual]}    Array of instances of Individual class.
     */
    static async readAll(search, order, pagination) {

        /*
        YOUR CODE GOES HERE
        */
        //throw new Error('Read all individuals is not implemented');

        /**
         * Custom implementation
         */
        return data.readAll(search, order, pagination)
        .then((results) => {
          let a = [];
          for(let i=0; i<results.length; ++i) {
            a.push(new Individual(results[i]));
          }
          return a;
        })
        .catch((e)=>{
          throw e;
        });
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Individual), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Individual;
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
        return Individual.countRecords(search).then(countA => {
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
                }).includes("name")) {
                options['order'] = [...options['order'], ...[
                    ["name", "ASC"]
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
                        paginationSearch = helper.parseOrderCursorGeneric(search, options['order'], decoded_cursor, "name", pagination.includeCursor);
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        paginationSearch = helper.parseOrderCursorGenericBefore(search, options['order'], decoded_cursor, "name", pagination.includeCursor);
                    }
                }
            }

            /*
             *  Count (with pagination search filters)
             */
            return Individual.countRecords(paginationSearch).then(countB => {
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
                    throw new Error(`Request of total individuals exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
                return Individual.readAll(paginationSearch, order, paginationLimitOffset).then(records => {
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
     * addOne - Creates a new record of model Individual with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (Individual), with all its properties set from the new record created.
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
     *    new Individual(newRecord)
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class Individual;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Individual|null} If successfully created, returns an instance of 
     * Individual class constructed with the new record, otherwise returns null.
     */
    static async addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        //throw new Error('addIndividual is not implemented');

        /**
         * Custom implementation
         */
        return data.addOne(input)
        .then((result) => {
          return result ? new Individual(result) : null;
        })
        .catch((e)=>{
          throw e;
        });
    }

    /**
     * updateOne - Updates the Individual record whose id is equal to the value
     * of id attribute: 'name', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (Individual), with all its properties set from the record updated.
     * If this function fails to update the record, returns null.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Individual(updatedRecord)
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class Individual;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'name' should contains the id value of the record
     * that will be updated. 
     * @return {Individual|null} If successfully created, returns an instance of 
     * Individual class constructed with the new record, otherwise returns null.
     */
    static async updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        //throw new Error('updateIndividual is not implemented');
        
        /**
         * Custom implementation
         */
        return data.updateOne(input)
        .then((result) => {
          return result ? new Individual(result) : null;
        })
        .catch((e)=>{
          throw e;
        });
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
        //throw new Error('deleteIndividual is not implemented');

        /**
         * Custom implementation
         */
        return data.deleteOne(id)
        .then((result) => {
          return result;
        })
        .catch((e)=>{
          throw e;
        });
    }

    static async bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddIndividualCsv is not implemented');
    }

    static async csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplateIndividual is not implemented');
    }

    /**
     * _addAccession - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   name   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _addAccession(name, accession_id) {
        return Individual.updateOne({
            name: name,
            accession_id: accession_id
        });
    }

    /**
     * _removeAccession - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   name   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async _removeAccession(name, accession_id) {
        return Individual.updateOne({
            name: name,
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
        let attributes = Object.keys(Individual.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Individual.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Individual.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Individual.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Individual.idAttribute()]
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