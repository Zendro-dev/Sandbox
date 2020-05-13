const _ = require('lodash');
const globals = require('../config/globals');
const helper = require('../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Accession',
    storageType: 'generic',
    attributes: {
        accession_id: 'String',
        collectors_name: 'String',
        collectors_initials: 'String',
        sampling_date: 'Date',
        sampling_number: 'String',
        catalog_number: 'String',
        institution_deposited: 'String',
        collection_name: 'String',
        collection_acronym: 'String',
        identified_by: 'String',
        identification_date: 'Date',
        abundance: 'String',
        habitat: 'String',
        observations: 'String',
        family: 'String',
        genus: 'String',
        species: 'String',
        subspecies: 'String',
        variety: 'String',
        race: 'String',
        form: 'String',
        taxon_id: 'String',
        collection_deposit: 'String',
        collect_number: 'String',
        collect_source: 'String',
        collected_seeds: 'Int',
        collected_plants: 'Int',
        collected_other: 'String',
        habit: 'String',
        local_name: 'String',
        locationId: 'String'
    },
    associations: {
        individuals: {
            type: 'to_many',
            target: 'Individual',
            targetKey: 'accession_id',
            keyIn: 'Individual',
            targetStorageType: 'generic',
            label: 'name',
            name: 'individuals',
            name_lc: 'individuals',
            name_cp: 'Individuals',
            target_lc: 'individual',
            target_lc_pl: 'individuals',
            target_pl: 'Individuals',
            target_cp: 'Individual',
            target_cp_pl: 'Individuals',
            keyIn_lc: 'individual',
            holdsForeignKey: false
        },
        taxon: {
            type: 'to_one',
            target: 'Taxon',
            targetKey: 'taxon_id',
            keyIn: 'Accession',
            targetStorageType: 'webservice',
            label: 'scientificName',
            sublabel: 'taxonRank',
            name: 'taxon',
            name_lc: 'taxon',
            name_cp: 'Taxon',
            target_lc: 'taxon',
            target_lc_pl: 'taxons',
            target_pl: 'Taxons',
            target_cp: 'Taxon',
            target_cp_pl: 'Taxons',
            keyIn_lc: 'accession',
            holdsForeignKey: true
        },
        location: {
            type: 'to_one',
            target: 'Location',
            targetKey: 'locationId',
            keyIn: 'Accession',
            targetStorageType: 'generic',
            label: 'country',
            sublabel: 'state',
            name: 'location',
            name_lc: 'location',
            name_cp: 'Location',
            target_lc: 'location',
            target_lc_pl: 'locations',
            target_pl: 'Locations',
            target_cp: 'Location',
            target_cp_pl: 'Locations',
            keyIn_lc: 'accession',
            holdsForeignKey: true
        },
        measurements: {
            type: 'to_many',
            target: 'Measurement',
            targetKey: 'accession_id',
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
    internalId: 'accession_id',
    id: {
        name: 'accession_id',
        type: 'String'
    }
};

module.exports = class Accession {

    /**
     * constructor - Creates an instance of the generic model Accession.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        accession_id,
        collectors_name,
        collectors_initials,
        sampling_date,
        sampling_number,
        catalog_number,
        institution_deposited,
        collection_name,
        collection_acronym,
        identified_by,
        identification_date,
        abundance,
        habitat,
        observations,
        family,
        genus,
        species,
        subspecies,
        variety,
        race,
        form,
        taxon_id,
        collection_deposit,
        collect_number,
        collect_source,
        collected_seeds,
        collected_plants,
        collected_other,
        habit,
        local_name,
        locationId
    }) {
        this.accession_id = accession_id;
        this.collectors_name = collectors_name;
        this.collectors_initials = collectors_initials;
        this.sampling_date = sampling_date;
        this.sampling_number = sampling_number;
        this.catalog_number = catalog_number;
        this.institution_deposited = institution_deposited;
        this.collection_name = collection_name;
        this.collection_acronym = collection_acronym;
        this.identified_by = identified_by;
        this.identification_date = identification_date;
        this.abundance = abundance;
        this.habitat = habitat;
        this.observations = observations;
        this.family = family;
        this.genus = genus;
        this.species = species;
        this.subspecies = subspecies;
        this.variety = variety;
        this.race = race;
        this.form = form;
        this.taxon_id = taxon_id;
        this.collection_deposit = collection_deposit;
        this.collect_number = collect_number;
        this.collect_source = collect_source;
        this.collected_seeds = collected_seeds;
        this.collected_plants = collected_plants;
        this.collected_other = collected_other;
        this.habit = habit;
        this.local_name = local_name;
        this.locationId = locationId;
    }

    static get name() {
        return "accession";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the Accession record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (Accession), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new Accession(record)
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class Accession;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Accession} Instance of Accession class.
     */
    static async readById(id) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readOneAccession is not implemented');
    }

    /**
     * countRecords - Count the number of records of model Accession that match the filters provided
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
        throw new Error('countAccessions is not implemented');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Accession), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new Accession(record) )
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Accession;
     * @see: Cenzontle specifications for limit-offset pagination.
     * @see: Cenzontle specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @return {[Accession]}    Array of instances of Accession class.
     */
    static async readAll(search, order, pagination) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('Read all accessions is not implemented');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (Accession), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class Accession;
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
        return Accession.countRecords(search).then(countA => {
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
                }).includes("accession_id")) {
                options['order'] = [...options['order'], ...[
                    ["accession_id", "ASC"]
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
                        paginationSearch = helper.parseOrderCursorGeneric(search, options['order'], decoded_cursor, "accession_id", pagination.includeCursor);
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        paginationSearch = helper.parseOrderCursorGenericBefore(search, options['order'], decoded_cursor, "accession_id", pagination.includeCursor);
                    }
                }
            }

            /*
             *  Count (with pagination search filters)
             */
            return Accession.countRecords(paginationSearch).then(countB => {
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
                    throw new Error(`Request of total accessions exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
                return Accession.readAll(paginationSearch, order, paginationLimitOffset).then(records => {
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
     * addOne - Creates a new record of model Accession with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (Accession), with all its properties set from the new record created.
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
     *    new Accession(newRecord)
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class Accession;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @return {Accession|null} If successfully created, returns an instance of 
     * Accession class constructed with the new record, otherwise returns null.
     */
    static async addOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addAccession is not implemented');
    }

    /**
     * updateOne - Updates the Accession record whose id is equal to the value
     * of id attribute: 'accession_id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (Accession), with all its properties set from the record updated.
     * If this function fails to update the record, returns null.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new Accession(updatedRecord)
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class Accession;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'accession_id' should contains the id value of the record
     * that will be updated. 
     * @return {Accession|null} If successfully created, returns an instance of 
     * Accession class constructed with the new record, otherwise returns null.
     */
    static async updateOne(input) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateAccession is not implemented');
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
        throw new Error('deleteAccession is not implemented');
    }

    static async bulkAddCsv(context) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddAccessionCsv is not implemented');
    }

    static async csvTableTemplate() {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('csvTableTemplateAccession is not implemented');
    }

    /**
     * add_taxon_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   taxon_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_taxon_id(accession_id, taxon_id) {
        let updated = await Accession.updateOne({
            accession_id: accession_id,
            taxon_id: taxon_id
        });
        return updated;
    }
    /**
     * add_locationId - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   locationId Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_locationId(accession_id, locationId) {
        let updated = await Accession.updateOne({
            accession_id: accession_id,
            locationId: locationId
        });
        return updated;
    }

    /**
     * remove_taxon_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   taxon_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_taxon_id(accession_id, taxon_id) {
        let updated = await Accession.updateOne({
            accession_id: accession_id,
            taxon_id: null
        });
        return updated;
    }
    /**
     * remove_locationId - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   locationId Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_locationId(accession_id, locationId) {
        let updated = await Accession.updateOne({
            accession_id: accession_id,
            locationId: null
        });
        return updated;
    }


    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(Accession.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Accession.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Accession.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Accession.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Accession.idAttribute()]
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