const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');
const models = require(path.join(__dirname, '..', 'index.js'));
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');


const definition = {
    model: 'parrot',
    storageType: 'distributed-data-model',
    registry: [
        'parrot_instance1',
        'parrot_instance2'
    ],
    attributes: {
        name: 'String',
        parrot_id: 'String',
        person_id: 'String'
    },
    associations: {
        unique_person: {
            type: 'to_one',
            target: 'person',
            targetKey: 'person_id',
            keyIn: 'parrot',
            targetStorageType: 'distributed-data-model'
        }
    },
    internalId: 'parrot_id',
    id: {
        name: 'parrot_id',
        type: 'String'
    }
};

let registry = ["parrot_instance1", "parrot_instance2"];

module.exports = class parrot {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        parrot_id,
        name,
        person_id
    }) {
        this.parrot_id = parrot_id;
        this.name = name;
        this.person_id = person_id;
    }

    static get name() {
        return "parrot";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["parrot_instance1", "parrot_instance2"].reduce((a, c) => {
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
            let responsibleAdapter = this.adapterForIri(idMap.parrot_id);
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
                let item = new parrot(result);
                return validatorUtil.validateData('validateAfterRead', this, item);
            });
        }
    }

    static countRecords(search, authorizedAdapters, benignErrorReporter) {
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
                case 'zendro-webservice-adapter':
                    return adapter.countRecords(search, benignErrorReporter);

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

    static readAllCursor(search, order, pagination, authorizedAdapters, benignErrorReporter) {
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
                case 'zendro-webservice-adapter':
                    return adapter.readAllCursor(search, order, pagination, benignErrorReporter);

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
                        field: "parrot_id",
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

                let graphQLConnection = helper.toGraphQLConnectionObject(paginated_records, this, hasNextPage, hasPreviousPage);
                return graphQLConnection;
            });
    }

    static get definition() {
        return definition;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(parrot.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = parrot.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return parrot.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of parrot.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[parrot.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.parrot_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'parrot_id'.`);
        }
        return true;
    }

    static async addOne(input, benignErrorReporter) {
        this.assertInputHasId(input);
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        let responsibleAdapter = this.adapterForIri(input.parrot_id);
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        return adapters[responsibleAdapter].addOne(input, benignErrorReporter).then(result => new parrot(result));
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
        let responsibleAdapter = this.adapterForIri(input.parrot_id);
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        return adapters[responsibleAdapter].updateOne(input, benignErrorReporter).then(result => new parrot(result));

    }

    static bulkAddCsv(context) {
        throw new Error("parrot.bulkAddCsv is not implemented.")
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
     * add_person_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   parrot_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_person_id(parrot_id, person_id, benignErrorReporter) {
        let responsibleAdapter = this.adapterForIri(parrot_id);
        return await adapters[responsibleAdapter].add_person_id(parrot_id, person_id, benignErrorReporter);
    }

    /**
     * remove_person_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   parrot_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_person_id(parrot_id, person_id, benignErrorReporter) {
        let responsibleAdapter = this.adapterForIri(parrot_id);
        return await adapters[responsibleAdapter].remove_person_id(parrot_id, person_id, benignErrorReporter);
    }





    /**
     * bulkAssociateParrotWithPerson_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateParrotWithPerson_id(bulkAssociationInput, benignErrorReporter) {
        let mappedBulkAssociateInputToAdapters = this.mapBulkAssociationInputToAdapters(bulkAssociationInput);
        var promises = [];
        Object.keys(mappedBulkAssociateInputToAdapters).forEach(responsibleAdapter => {
            promises.push(adapters[responsibleAdapter].bulkAssociateParrotWithPerson_id(mappedBulkAssociateInputToAdapters[responsibleAdapter], benignErrorReporter))
        });
        await Promise.all(promises);
        return "Records successfully updated!";
    }

    /**
     * bulkDisAssociateParrotWithPerson_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateParrotWithPerson_id(bulkAssociationInput, benignErrorReporter) {
        let mappedBulkAssociateInputToAdapters = this.mapBulkAssociationInputToAdapters(bulkAssociationInput);
        var promises = [];
        Object.keys(mappedBulkAssociateInputToAdapters).forEach(responsibleAdapter => {
            promises.push(adapters[responsibleAdapter].bulkDisAssociateParrotWithPerson_id(mappedBulkAssociateInputToAdapters[responsibleAdapter], benignErrorReporter))
        });
        await Promise.all(promises);
        return "Records successfully updated!";
    }


}