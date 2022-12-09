const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');
const cassandraHelper = require('../../utils/cassandra_helpers');
const models = require(path.join(__dirname, '..', 'index.js'));
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');


const definition = {
    "model": "biological_material",
    "storageType": "distributed-data-model",
    "registry": ["biological_material_local", "biological_material_public"],
    "attributes": {
        "id": "String",
        "organism": "String",
        "genus": "String",
        "species": "String",
        "infraspecific_name": "String",
        "location_latitude": "String",
        "location_longitude": "String",
        "location_altitude": "Float",
        "location_coordinates_uncertainty": "Float",
        "preprocessing": "String",
        "source_id": "String",
        "source_doi": "String",
        "source_latitude": "String",
        "source_longitude": "String",
        "source_altitude": "Float",
        "source_coordinates_uncertainty": "Float",
        "source_description": "String",
        "study_ids": "[String]",
        "observation_unit_ids": "[String]"
    },
    "associations": {
        "studies": {
            "type": "many_to_many",
            "reverseAssociation": "biological_materials",
            "implementation": "foreignkeys",
            "target": "study",
            "targetStorageType": "distributed-data-model",
            "targetKey": "biological_material_ids",
            "sourceKey": "study_ids",
            "keysIn": "biological_material"
        },
        "observation_units": {
            "type": "many_to_many",
            "reverseAssociation": "biological_materials",
            "implementation": "foreignkeys",
            "target": "observation_unit",
            "targetStorageType": "distributed-data-model",
            "targetKey": "biological_material_ids",
            "sourceKey": "observation_unit_ids",
            "keysIn": "biological_material"
        }
    },
    "internalId": "id",
    "id": {
        "name": "id",
        "type": "String"
    }
};

let registry = ["biological_material_local", "biological_material_public"];

module.exports = class biological_material {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        organism,
        genus,
        species,
        infraspecific_name,
        location_latitude,
        location_longitude,
        location_altitude,
        location_coordinates_uncertainty,
        preprocessing,
        source_id,
        source_doi,
        source_latitude,
        source_longitude,
        source_altitude,
        source_coordinates_uncertainty,
        source_description,
        study_ids,
        observation_unit_ids
    }) {
        this.id = id;
        this.organism = organism;
        this.genus = genus;
        this.species = species;
        this.infraspecific_name = infraspecific_name;
        this.location_latitude = location_latitude;
        this.location_longitude = location_longitude;
        this.location_altitude = location_altitude;
        this.location_coordinates_uncertainty = location_coordinates_uncertainty;
        this.preprocessing = preprocessing;
        this.source_id = source_id;
        this.source_doi = source_doi;
        this.source_latitude = source_latitude;
        this.source_longitude = source_longitude;
        this.source_altitude = source_altitude;
        this.source_coordinates_uncertainty = source_coordinates_uncertainty;
        this.source_description = source_description;
        this.study_ids = study_ids;
        this.observation_unit_ids = observation_unit_ids;
    }

    static get name() {
        return "biological_material";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["biological_material_local", "biological_material_public"].reduce((a, c) => {
            a[c] = adapters[c];
            return a;
        }, {});
    }

    static adapterForIri(iri) {
        let responsibleAdapter = registry.filter(adapter => adapters[adapter].recognizeId(iri));
        if (responsibleAdapter.length > 1) {
            throw new Error("IRI has no unique match");
        } else if (responsibleAdapter.length === 0) {
            throw new Error("IRI has no match WS");
        }
        return responsibleAdapter[0];
    }

    /**
     * mapBulkAssociationInputToAdapters - maps the input of a bulkAssociate to the responsible adapters
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @param {Array} bulkAssociationInput Array of "edges" between two records to be associated
     * @return {object} mapped "edge" objects ({<id_model1>: id, <id_model2>:id}) to the adapter responsible for the primary Key
     */
    static mapBulkAssociationInputToAdapters(bulkAssociationInput) {
        let mappedInput = {}
        bulkAssociationInput.map((idMap) => {
            let responsibleAdapter = this.adapterForIri(idMap.id);
            mappedInput[responsibleAdapter] === undefined ? mappedInput[responsibleAdapter] = [idMap] : mappedInput[responsibleAdapter].push(idMap)
        });
        return mappedInput;
    }

    static readById(id, benignErrorReporter, token) {
        if (id !== null) {
            let responsibleAdapter = registry.filter(adapter => adapters[adapter].recognizeId(id));

            if (responsibleAdapter.length > 1) {
                throw new Error("IRI has no unique match");
            } else if (responsibleAdapter.length === 0) {
                throw new Error("IRI has no match WS");
            }

            return adapters[responsibleAdapter[0]].readById(id, benignErrorReporter, token).then(result => {
                let item = new biological_material(result);
                return validatorUtil.validateData('validateAfterRead', this, item);
            });
        }
    }

    static countRecords(search, authorizedAdapters, benignErrorReporter, searchAuthorizedAdapters, token) {
        let authAdapters = [];
        /**
         * Differentiated cases:
         *    if authorizedAdapters is defined:
         *      - called from resolver.
         *      - authorizedAdapters will no be modified.
         *
         *    if authorizedAdapters is not defined:
         *      - called internally
         *      - authorizedAdapters will be set to registered adapters.
         */
        if (authorizedAdapters === undefined) {
            authAdapters = Object.values(this.registeredAdapters);
        } else {
            authAdapters = Array.from(authorizedAdapters)
        }

        // map the adapters authorized for 'search' to cassandra-adapters. This is needed to pass the 'allowFiltering' parameter to the cassandra-adapter
        let searchAuthAdapters = [];
        if (helper.isNotUndefinedAndNotNull(searchAuthorizedAdapters)) {
            searchAuthAdapters = Array.from(searchAuthorizedAdapters).filter(adapter => adapter.adapterType === 'cassandra-adapter').map(adapter => adapter.adapterName);
        }

        let promises = authAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   sql-adapter:
             *      resolve with current parameters.
             *
             *   ddm-adapter:
             *   zendro-webservice-adapter:
             *   generic-adapter:
             *      add exclusions to search.excludeAdapterNames parameter.
             */
            switch (adapter.adapterType) {
                case 'ddm-adapter':
                case 'generic-adapter':
                    let nsearch = helper.addExclusions(search, adapter.adapterName, Object.values(this.registeredAdapters));
                    return adapter.countRecords(nsearch, benignErrorReporter, token);

                case 'sql-adapter':
                case 'mongodb-adapter':
                case 'amazon-s3-adapter':
                case 'trino-adapter':
                case 'presto-adapter':
                case 'neo4j-adapter':
                    return adapter.countRecords(search, benignErrorReporter);
                case 'zendro-webservice-adapter':
                    return adapter.countRecords(search, benignErrorReporter, token);
                case 'cassandra-adapter':
                    return adapter.countRecords(search, benignErrorReporter, searchAuthAdapters.includes(adapter.adapterName));

                case 'default':
                    throw new Error(`Adapter type: '${adapter.adapterType}' is not supported`);
            }
        });

        return Promise.allSettled(promises).then(results => {
            return results.reduce((total, current) => {
                //check if current is Error
                if (current.status === 'rejected') {
                    benignErrorReporter.push(current.reason);
                }
                //check current result
                else if (current.status === 'fulfilled') {
                    total += current.value;
                }
                return total;
            }, 0);
        });
    }

    static readAllCursor(search, order, pagination, authorizedAdapters, benignErrorReporter, searchAuthorizedAdapters, token) {
        let authAdapters = [];
        /**
         * Differentiated cases:
         *    if authorizedAdapters is defined:
         *      - called from resolver.
         *      - authorizedAdapters will no be modified.
         *
         *    if authorizedAdapters is not defined:
         *      - called internally
         *      - authorizedAdapters will be set to registered adapters.
         */
        if (authorizedAdapters === undefined) {
            authAdapters = Object.values(this.registeredAdapters);
        } else {
            authAdapters = Array.from(authorizedAdapters)
        }

        // map the adapters authorized for 'search' to cassandra-adapters. This is needed to pass the 'allowFiltering' parameter to the cassandra-adapter
        let searchAuthAdapters = [];
        if (helper.isNotUndefinedAndNotNull(searchAuthorizedAdapters)) {
            searchAuthAdapters = Array.from(searchAuthorizedAdapters).filter(adapter => adapter.adapterType === 'cassandra-adapter').map(adapter => adapter.adapterName);
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let promises = authAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   sql-adapter:
             *      resolve with current parameters.
             *
             *   ddm-adapter:
             *   zendro-webservice-adapter:
             *   generic-adapter:
             *      add exclusions to search.excludeAdapterNames parameter.
             */
            switch (adapter.adapterType) {
                case 'ddm-adapter':
                    let nsearch = helper.addExclusions(search, adapter.adapterName, Object.values(this.registeredAdapters));
                    return adapter.readAllCursor(nsearch, order, pagination, benignErrorReporter, token);
                case 'generic-adapter':
                case 'sql-adapter':
                case 'mongodb-adapter':
                case 'amazon-s3-adapter':
                case 'trino-adapter':
                case 'presto-adapter':
                case 'neo4j-adapter':
                    return adapter.readAllCursor(search, order, pagination, benignErrorReporter);
                case 'zendro-webservice-adapter':
                    return adapter.readAllCursor(search, order, pagination, benignErrorReporter, token);
                case 'cassandra-adapter':
                    return adapter.readAllCursor(search, pagination, benignErrorReporter, searchAuthAdapters.includes(adapter.adapterName));

                default:
                    throw new Error(`Adapter type '${adapter.adapterType}' is not supported`);
            }
        });
        let someHasNextPage = false;
        let someHasPreviousPage = false;
        return Promise.allSettled(promises)
            //phase 1: reduce
            .then(results => {
                return results.reduce((total, current) => {
                    //check if current is Error
                    if (current.status === 'rejected') {
                        benignErrorReporter.push(current.reason);
                    }
                    //check current
                    else if (current.status === 'fulfilled') {
                        if (current.value && current.value.pageInfo && current.value.edges) {
                            someHasNextPage |= current.value.pageInfo.hasNextPage;
                            someHasPreviousPage |= current.value.pageInfo.hasPreviousPage;
                            total = total.concat(current.value.edges.map(e => e.node));
                        }
                    }
                    return total;
                }, []);
            })
            //phase 2: validate & order & paginate
            .then(async nodes => {
                nodes = await validatorUtil.bulkValidateData('validateAfterRead', this, nodes, benignErrorReporter);
                if (order === undefined) {
                    order = [{
                        field: "id",
                        order: 'ASC'
                    }];
                }
                if (pagination === undefined) {
                    pagination = {
                        first: Math.min(globals.LIMIT_RECORDS, nodes.length)
                    }
                }


                let ordered_records = helper.orderRecords(nodes, order);
                let paginated_records = [];

                if (isForwardPagination) {
                    paginated_records = helper.paginateRecordsCursor(ordered_records, pagination.first);
                } else {
                    paginated_records = helper.paginateRecordsBefore(ordered_records, pagination.last);
                }

                let hasNextPage = ordered_records.length > pagination.first || someHasNextPage;
                let hasPreviousPage = ordered_records.length > pagination.last || someHasPreviousPage;

                let graphQLConnection = helper.toGraphQLConnectionObject(paginated_records, this, hasNextPage, hasPreviousPage, "biological_materials");
                return graphQLConnection;

            });
    }

    static assertInputHasId(input) {
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        return true;
    }

    static async addOne(input, benignErrorReporter, token) {
        this.assertInputHasId(input);
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        let responsibleAdapter = this.adapterForIri(input.id);
        return adapters[responsibleAdapter].addOne(input, benignErrorReporter, token).then(result => new biological_material(result));
    }

    static async deleteOne(id, benignErrorReporter, token) {
        //validate input
        await validatorUtil.validateData('validateForDelete', this, id);
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id, benignErrorReporter, token);
    }

    static async updateOne(input, benignErrorReporter, token) {
        this.assertInputHasId(input);
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        let responsibleAdapter = this.adapterForIri(input.id);
        return adapters[responsibleAdapter].updateOne(input, benignErrorReporter, token).then(result => new biological_material(result));

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
     * add_study_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_study_ids(id, study_ids, benignErrorReporter, token, handle_inverse) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].add_study_ids(id, study_ids, benignErrorReporter, token, handle_inverse);
    }
    /**
     * add_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse);
    }


    /**
     * remove_study_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_study_ids(id, study_ids, benignErrorReporter, token, handle_inverse) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].remove_study_ids(id, study_ids, benignErrorReporter, token, handle_inverse);
    }
    /**
     * remove_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse);
    }








    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return biological_material.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return biological_material.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of biological_material.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[biological_material.idAttribute()];
    }

    /**
     * definition - Getter for the attribute 'definition'
     * @return {string} the definition string
     */
    static get definition() {
        return definition;
    }

    /**
     * base64Decode - Decode a base 64 String to UTF-8.
     * @param {string} cursor - The cursor to be decoded into the record, given in base 64
     * @return {string} The stringified object in UTF-8 format
     */
    static base64Decode(cursor) {
        return Buffer.from(cursor, "base64").toString("utf-8");
    }

    /**
     * base64Encode - Encode  biological_material to a base 64 String
     *
     * @return {string} The biological_material object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The biological_material object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of biological_material.
     *
     * @return {object} The attributes of biological_material in object form
     */
    stripAssociations() {
        let attributes = Object.keys(biological_material.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of biological_material that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of biological_material that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of biological_material.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
}