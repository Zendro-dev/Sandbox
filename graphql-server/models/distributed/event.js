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
    model: 'event',
    storageType: 'distributed-data-model',
    registry: [
        'event_local',
        'event_public'
    ],
    attributes: {
        id: 'String',
        type: 'String',
        accession_number: 'String',
        description: 'String',
        dates: '[DateTime]',
        study_id: 'String',
        observation_unit_ids: '[String]'
    },
    associations: {
        study: {
            type: 'many_to_one',
            reverseAssociation: 'events',
            implementation: 'foreignkeys',
            target: 'study',
            targetStorageType: 'distributed-data-model',
            targetKey: 'study_id',
            keysIn: 'event'
        },
        observation_units: {
            type: 'many_to_many',
            reverseAssociation: 'events',
            implementation: 'foreignkeys',
            target: 'observation_unit',
            targetStorageType: 'distributed-data-model',
            targetKey: 'event_ids',
            sourceKey: 'observation_unit_ids',
            keysIn: 'event'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

let registry = ["event_local", "event_public"];

module.exports = class event {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        type,
        accession_number,
        description,
        dates,
        study_id,
        observation_unit_ids
    }) {
        this.id = id;
        this.type = type;
        this.accession_number = accession_number;
        this.description = description;
        this.dates = dates;
        this.study_id = study_id;
        this.observation_unit_ids = observation_unit_ids;
    }

    static get name() {
        return "event";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["event_local", "event_public"].reduce((a, c) => {
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

    static readById(id, benignErrorReporter) {
        if (id !== null) {
            let responsibleAdapter = registry.filter(adapter => adapters[adapter].recognizeId(id));

            if (responsibleAdapter.length > 1) {
                throw new Error("IRI has no unique match");
            } else if (responsibleAdapter.length === 0) {
                throw new Error("IRI has no match WS");
            }

            //use default BenignErrorReporter if no BenignErrorReporter defined
            benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
            return adapters[responsibleAdapter[0]].readById(id, benignErrorReporter).then(result => {
                let item = new event(result);
                return validatorUtil.validateData('validateAfterRead', this, item);
            });
        }
    }

    static countRecords(search, authorizedAdapters, benignErrorReporter, searchAuthorizedAdapters) {
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

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
                    return adapter.countRecords(nsearch, benignErrorReporter);

                case 'sql-adapter':
                case 'mongodb-adapter':
                case 'amazon-s3-adapter':
                case 'trino-adapter':
                case 'presto-adapter':
                case 'neo4j-adapter':
                case 'zendro-webservice-adapter':
                    return adapter.countRecords(search, benignErrorReporter);
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
                    benignErrorReporter.reportError(current.reason);
                }
                //check current result
                else if (current.status === 'fulfilled') {
                    total += current.value;
                }
                return total;
            }, 0);
        });
    }

    static readAllCursor(search, order, pagination, authorizedAdapters, benignErrorReporter, searchAuthorizedAdapters) {
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

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);


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
                    return adapter.readAllCursor(nsearch, order, pagination, benignErrorReporter);

                case 'generic-adapter':
                case 'sql-adapter':
                case 'mongodb-adapter':
                case 'amazon-s3-adapter':
                case 'trino-adapter':
                case 'presto-adapter':
                case 'neo4j-adapter':
                case 'zendro-webservice-adapter':
                    return adapter.readAllCursor(search, order, pagination, benignErrorReporter);
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
                        benignErrorReporter.reportError(current.reason);
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

                let graphQLConnection = helper.toGraphQLConnectionObject(paginated_records, this, hasNextPage, hasPreviousPage, "events");
                return graphQLConnection;

            });
    }

    static assertInputHasId(input) {
        if (!input.id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'id'.`);
        }
        return true;
    }

    static async addOne(input, benignErrorReporter) {
        this.assertInputHasId(input);
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        let responsibleAdapter = this.adapterForIri(input.id);
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        return adapters[responsibleAdapter].addOne(input, benignErrorReporter).then(result => new event(result));
    }

    static async deleteOne(id, benignErrorReporter) {
        //validate input
        await validatorUtil.validateData('validateForDelete', this, id);
        let responsibleAdapter = this.adapterForIri(id);
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        return adapters[responsibleAdapter].deleteOne(id, benignErrorReporter);
    }

    static async updateOne(input, benignErrorReporter) {
        this.assertInputHasId(input);
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        let responsibleAdapter = this.adapterForIri(input.id);
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        return adapters[responsibleAdapter].updateOne(input, benignErrorReporter).then(result => new event(result));

    }

    static bulkAddCsv(context) {
        let responsibleAdapter = registry.filter(adapter => adapters[adapter].adapterType !== "ddm-adapter");
        if (responsibleAdapter.length > 1) {
            throw new Error("match more than one adapter");
        } else if (responsibleAdapter.length === 0) {
            throw new Error("doesn't match an adapter");
        }
        return adapters[responsibleAdapter[0]].bulkAddCsv(context);
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
     * add_study_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_study_id(id, study_id, benignErrorReporter) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].add_study_id(id, study_id, benignErrorReporter);
    }

    /**
     * add_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse = true) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse);
    }

    /**
     * remove_study_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_study_id(id, study_id, benignErrorReporter) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].remove_study_id(id, study_id, benignErrorReporter);
    }

    /**
     * remove_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse = true) {
        let responsibleAdapter = this.adapterForIri(id);
        return await adapters[responsibleAdapter].remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse);
    }





    /**
     * bulkAssociateEventWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateEventWithStudy_id(bulkAssociationInput, benignErrorReporter) {
        let mappedBulkAssociateInputToAdapters = this.mapBulkAssociationInputToAdapters(bulkAssociationInput);
        var promises = [];
        Object.keys(mappedBulkAssociateInputToAdapters).forEach(responsibleAdapter => {
            promises.push(adapters[responsibleAdapter].bulkAssociateEventWithStudy_id(mappedBulkAssociateInputToAdapters[responsibleAdapter], benignErrorReporter))
        });
        await Promise.all(promises);
        return "Records successfully updated!";
    }


    /**
     * bulkDisAssociateEventWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateEventWithStudy_id(bulkAssociationInput, benignErrorReporter) {
        let mappedBulkAssociateInputToAdapters = this.mapBulkAssociationInputToAdapters(bulkAssociationInput);
        var promises = [];
        Object.keys(mappedBulkAssociateInputToAdapters).forEach(responsibleAdapter => {
            promises.push(adapters[responsibleAdapter].bulkDisAssociateEventWithStudy_id(mappedBulkAssociateInputToAdapters[responsibleAdapter], benignErrorReporter))
        });
        await Promise.all(promises);
        return "Records successfully updated!";
    }



    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return event.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return event.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of event.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[event.idAttribute()];
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
     * base64Encode - Encode  event to a base 64 String
     *
     * @return {string} The event object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The event object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of event.
     *
     * @return {object} The attributes of event in object form
     */
    stripAssociations() {
        let attributes = Object.keys(event.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of event that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of event that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of event.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
}