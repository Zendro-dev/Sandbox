const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'ontologyReference',
    storageType: 'distributed-data-model',
    registry: [
        'ontologyReference_PHENOMIS',
        'ontologyReference_PHIS',
        'ontologyReference_PIPPA'
    ],
    attributes: {
        documentationURL: 'String',
        ontologyDbId: 'String',
        ontologyName: 'String',
        version: 'String'
    },
    associations: {
        scales: {
            type: 'to_many',
            target: 'scale',
            targetKey: 'ontologyDbId',
            keyIn: 'scale',
            targetStorageType: 'distributed-data-model',
            label: 'scaleName',
            name: 'scales',
            name_lc: 'scales',
            name_cp: 'Scales',
            target_lc: 'scale',
            target_lc_pl: 'scales',
            target_pl: 'scales',
            target_cp: 'Scale',
            target_cp_pl: 'Scales',
            keyIn_lc: 'scale',
            holdsForeignKey: false
        },
        methods: {
            type: 'to_many',
            target: 'method',
            targetKey: 'ontologyDbId',
            keyIn: 'method',
            targetStorageType: 'distributed-data-model',
            label: 'methodName',
            name: 'methods',
            name_lc: 'methods',
            name_cp: 'Methods',
            target_lc: 'method',
            target_lc_pl: 'methods',
            target_pl: 'methods',
            target_cp: 'Method',
            target_cp_pl: 'Methods',
            keyIn_lc: 'method',
            holdsForeignKey: false
        },
        traits: {
            type: 'to_many',
            target: 'trait',
            targetKey: 'ontologyDbId',
            keyIn: 'trait',
            targetStorageType: 'distributed-data-model',
            label: 'traitName',
            name: 'traits',
            name_lc: 'traits',
            name_cp: 'Traits',
            target_lc: 'trait',
            target_lc_pl: 'traits',
            target_pl: 'traits',
            target_cp: 'Trait',
            target_cp_pl: 'Traits',
            keyIn_lc: 'trait',
            holdsForeignKey: false
        },
        observationVariables: {
            type: 'to_many',
            target: 'observationVariable',
            targetKey: 'ontologyDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'distributed-data-model',
            label: 'ObservationVariableName',
            name: 'observationVariables',
            name_lc: 'observationVariables',
            name_cp: 'ObservationVariables',
            target_lc: 'observationVariable',
            target_lc_pl: 'observationVariables',
            target_pl: 'observationVariables',
            target_cp: 'ObservationVariable',
            target_cp_pl: 'ObservationVariables',
            keyIn_lc: 'observationVariable',
            holdsForeignKey: false
        }
    },
    internalId: 'ontologyDbId',
    id: {
        name: 'ontologyDbId',
        type: 'String'
    }
};

let registry = ["ontologyReference_PHENOMIS", "ontologyReference_PHIS", "ontologyReference_PIPPA"];

module.exports = class ontologyReference {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        ontologyDbId,
        documentationURL,
        ontologyName,
        version
    }) {
        this.ontologyDbId = ontologyDbId;
        this.documentationURL = documentationURL;
        this.ontologyName = ontologyName;
        this.version = version;
    }

    static get name() {
        return "ontologyReference";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["ontologyReference_PHENOMIS", "ontologyReference_PHIS", "ontologyReference_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new ontologyReference(result));
        }
    }

    static countRecords(search, authorizedAdapters) {
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
                    return adapter.countRecords(nsearch).catch(benignErrors => benignErrors);

                case 'sql-adapter':
                case 'cenzontle-webservice-adapter':
                    return adapter.countRecords(search).catch(benignErrors => benignErrors);

                case 'default':
                    throw new Error(`Adapter type: '${adapter.adapterType}' is not supported`);
            }
        });

        return Promise.all(promises).then(results => {
            return results.reduce((total, current) => {
                //check if current is Error
                if (current instanceof Error) {
                    total.errors.push(current);
                }
                //check current result
                else if (current) {
                    total.sum += current;
                }
                return total;
            }, {
                sum: 0,
                errors: []
            });
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
                        field: "ontologyDbId",
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
        let attributes = Object.keys(ontologyReference.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = ontologyReference.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return ontologyReference.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of ontologyReference.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[ontologyReference.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.ontologyDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'ontologyDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.ontologyDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new ontologyReference(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.ontologyDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new ontologyReference(result));
    }





    static bulkAddCsv(context) {
        throw new Error("ontologyReference.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(ontologyReference);
    }
}