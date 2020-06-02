const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const validatorUtil = require('../utils/validatorUtil');
const errorHelper = require('../utils/errors');

const definition = {
    model: 'dog',
    storageType: 'distributed-data-model',
    registry: [
        'dog_instance1',
        'dog_instance2'
    ],
    attributes: {
        name: 'String',
        dog_id: 'String',
        person_id: 'String'
    },
    associations: {
        person: {
            type: 'to_one',
            target: 'person',
            targetKey: 'person_id',
            keyIn: 'dog',
            targetStorageType: 'distributed-data-model',
            name: 'person',
            name_lc: 'person',
            name_cp: 'Person',
            target_lc: 'person',
            target_lc_pl: 'people',
            target_pl: 'people',
            target_cp: 'Person',
            target_cp_pl: 'People',
            keyIn_lc: 'dog',
            holdsForeignKey: true
        }
    },
    internalId: 'dog_id',
    id: {
        name: 'dog_id',
        type: 'String'
    }
};

let registry = ["dog_instance1", "dog_instance2"];

module.exports = class dog {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        dog_id,
        name,
        person_id
    }) {
        this.dog_id = dog_id;
        this.name = name;
        this.person_id = person_id;
    }

    static get name() {
        return "dog";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["dog_instance1", "dog_instance2"].reduce((a, c) => {
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

    static readById(id) {
        if (id !== null) {
            let responsibleAdapter = registry.filter(adapter => adapters[adapter].recognizeId(id));

            if (responsibleAdapter.length > 1) {
                throw new Error("IRI has no unique match");
            } else if (responsibleAdapter.length === 0) {
                throw new Error("IRI has no match WS");
            }

            return adapters[responsibleAdapter[0]].readById(id).then(result => {
                let item = new dog(result);
                return validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item)
                    .then((valSuccess) => {
                        return item;
                    });
            });
        }
    }

    static async countRecords(search, authorizedAdapters, benignErrorReporter) {
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
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef( benignErrorReporter );

        let promises = authAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   sql-adapter:
             *      resolve with current parameters.
             *
             *   ddm-adapter:
             *   cenzontle-webservice-adapter:
             *   generic-adapter:
             *      add exclusions to search.excludeAdapterNames parameter.
             */
            switch (adapter.adapterType) {
                case 'ddm-adapter':
                case 'generic-adapter':
                    let nsearch = helper.addExclusions(search, adapter.adapterName, Object.values(this.registeredAdapters));
                    //return adapter.countRecords(nsearch).catch(benignErrors => benignErrors);
                    return adapter.countRecords(nsearch, benignErrorReporter); //.catch(benignErrors => benignErrors);

                case 'sql-adapter':
                case 'cenzontle-webservice-adapter':
                    //return adapter.countRecords(search).catch(benignErrors => benignErrors);
                    return adapter.countRecords(search, benignErrorReporter); //.catch(benignErrors => benignErrors);

                case 'default':
                    throw new Error(`Adapter type: '${adapter.adapterType}' is not supported`);
            }
        });

        return Promise.allSettled(promises).then(results => {
            console.log("RESULTS: ", results);
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
            }, 0 );
        });
    }

    static readAllCursor(search, order, pagination, authorizedAdapters) {
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

        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let promises = authAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   sql-adapter:
             *      resolve with current parameters.
             *
             *   ddm-adapter:
             *   cenzontle-webservice-adapter:
             *   generic-adapter:
             *      add exclusions to search.excludeAdapterNames parameter.
             */
            switch (adapter.adapterType) {
                case 'ddm-adapter':
                    let nsearch = helper.addExclusions(search, adapter.adapterName, Object.values(this.registeredAdapters));
                    return adapter.readAllCursor(nsearch, order, pagination).catch(benignErrors => benignErrors);

                case 'generic-adapter':
                case 'sql-adapter':
                case 'cenzontle-webservice-adapter':
                    return adapter.readAllCursor(search, order, pagination).catch(benignErrors => benignErrors);

                default:
                    throw new Error(`Adapter type '${adapter.adapterType}' is not supported`);
            }
        });
        let someHasNextPage = false;
        let someHasPreviousPage = false;
        return Promise.all(promises)
            //phase 1: reduce
            .then(results => {
                return results.reduce((total, current) => {
                    //check if current is Error
                    if (current instanceof Error) {
                        total.errors.push(current);
                    }
                    //check current
                    else if (current && current.pageInfo && current.edges) {
                        someHasNextPage |= current.pageInfo.hasNextPage;
                        someHasPreviousPage |= current.pageInfo.hasPreviousPage;
                        total.nodes = total.nodes.concat(current.edges.map(e => e.node));
                    }
                    return total;
                }, {
                    nodes: [],
                    errors: []
                });
            })
            //phase 2: order & paginate
            .then(nodesAndErrors => {
                let nodes = nodesAndErrors.nodes;
                let errors = nodesAndErrors.errors;

                if (order === undefined) {
                    order = [{
                        field: "dog_id",
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
                graphQLConnection['errors'] = errors;
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
        let attributes = Object.keys(dog.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = dog.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return dog.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of dog.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[dog.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.dog_id) {
            throw new Error(`Illegal argument. Provided input requires attribute 'dog_id'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
            .then(async (valSuccess) => {
                let responsibleAdapter = this.adapterForIri(input.dog_id);
                return adapters[responsibleAdapter].addOne(input).then(result => new dog(result));
            });
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input)
            .then(async (valSuccess) => {
                let responsibleAdapter = this.adapterForIri(input.dog_id);
                return adapters[responsibleAdapter].updateOne(input).then(result => new dog(result));
            });
    }

    static bulkAddCsv(context) {
        throw new Error("dog.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(dog);
    }



    /**
     * add_person_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_person_id(dog_id, person_id) {
        let responsibleAdapter = this.adapterForIri(dog_id);
        return await adapters[responsibleAdapter].add_person_id(dog_id, person_id);
    }

    /**
     * remove_person_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_person_id(dog_id, person_id) {
        let responsibleAdapter = this.adapterForIri(dog_id);
        return await adapters[responsibleAdapter].remove_person_id(dog_id, person_id);
    }






}
