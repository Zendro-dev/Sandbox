const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'observationVariable',
    storageType: 'distributed-data-model',
    registry: [
        'observationVariable_PHENOMIS',
        'observationVariable_PHIS',
        'observationVariable_PIPPA'
    ],
    attributes: {
        commonCropName: 'String',
        defaultValue: 'String',
        documentationURL: 'String',
        growthStage: 'String',
        institution: 'String',
        language: 'String',
        scientist: 'String',
        status: 'String',
        submissionTimestamp: 'DateTime',
        xref: 'String',
        observationVariableDbId: 'String',
        observationVariableName: 'String',
        methodDbId: 'String',
        scaleDbId: 'String',
        traitDbId: 'String',
        ontologyDbId: 'String'
    },
    associations: {
        method: {
            type: 'to_one',
            target: 'method',
            targetKey: 'methodDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'distributed-data-model',
            label: 'methodName',
            name: 'method',
            name_lc: 'method',
            name_cp: 'Method',
            target_lc: 'method',
            target_lc_pl: 'methods',
            target_pl: 'methods',
            target_cp: 'Method',
            target_cp_pl: 'Methods',
            keyIn_lc: 'observationVariable',
            holdsForeignKey: true
        },
        ontologyReference: {
            type: 'to_one',
            target: 'ontologyReference',
            targetKey: 'ontologyDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'distributed-data-model',
            label: 'ontologyName',
            name: 'ontologyReference',
            name_lc: 'ontologyReference',
            name_cp: 'OntologyReference',
            target_lc: 'ontologyReference',
            target_lc_pl: 'ontologyReferences',
            target_pl: 'ontologyReferences',
            target_cp: 'OntologyReference',
            target_cp_pl: 'OntologyReferences',
            keyIn_lc: 'observationVariable',
            holdsForeignKey: true
        },
        scale: {
            type: 'to_one',
            target: 'scale',
            targetKey: 'scaleDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'distributed-data-model',
            label: 'scaleName',
            name: 'scale',
            name_lc: 'scale',
            name_cp: 'Scale',
            target_lc: 'scale',
            target_lc_pl: 'scales',
            target_pl: 'scales',
            target_cp: 'Scale',
            target_cp_pl: 'Scales',
            keyIn_lc: 'observationVariable',
            holdsForeignKey: true
        },
        trait: {
            type: 'to_one',
            target: 'trait',
            targetKey: 'traitDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'distributed-data-model',
            label: 'traitName',
            name: 'trait',
            name_lc: 'trait',
            name_cp: 'Trait',
            target_lc: 'trait',
            target_lc_pl: 'traits',
            target_pl: 'traits',
            target_cp: 'Trait',
            target_cp_pl: 'Traits',
            keyIn_lc: 'observationVariable',
            holdsForeignKey: true
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'observationVariableDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'observationVariableName',
            sublabel: 'value',
            name: 'observations',
            name_lc: 'observations',
            name_cp: 'Observations',
            target_lc: 'observation',
            target_lc_pl: 'observations',
            target_pl: 'observations',
            target_cp: 'Observation',
            target_cp_pl: 'Observations',
            keyIn_lc: 'observation',
            holdsForeignKey: false
        }
    },
    internalId: 'observationVariableDbId',
    id: {
        name: 'observationVariableDbId',
        type: 'String'
    }
};

let registry = ["observationVariable_PHENOMIS", "observationVariable_PHIS", "observationVariable_PIPPA"];

module.exports = class observationVariable {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        observationVariableDbId,
        commonCropName,
        defaultValue,
        documentationURL,
        growthStage,
        institution,
        language,
        scientist,
        status,
        submissionTimestamp,
        xref,
        observationVariableName,
        methodDbId,
        scaleDbId,
        traitDbId,
        ontologyDbId
    }) {
        this.observationVariableDbId = observationVariableDbId;
        this.commonCropName = commonCropName;
        this.defaultValue = defaultValue;
        this.documentationURL = documentationURL;
        this.growthStage = growthStage;
        this.institution = institution;
        this.language = language;
        this.scientist = scientist;
        this.status = status;
        this.submissionTimestamp = submissionTimestamp;
        this.xref = xref;
        this.observationVariableName = observationVariableName;
        this.methodDbId = methodDbId;
        this.scaleDbId = scaleDbId;
        this.traitDbId = traitDbId;
        this.ontologyDbId = ontologyDbId;
    }

    static get name() {
        return "observationVariable";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["observationVariable_PHENOMIS", "observationVariable_PHIS", "observationVariable_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new observationVariable(result));
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
                        field: "observationVariableDbId",
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
        let attributes = Object.keys(observationVariable.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = observationVariable.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observationVariable.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationVariable.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observationVariable.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.observationVariableDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationVariableDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationVariableDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new observationVariable(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationVariableDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new observationVariable(result));
    }

    /**
     * add_methodDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_methodDbId(observationVariableDbId, methodDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].add_methodDbId(observationVariableDbId, methodDbId);
    }
    /**
     * add_ontologyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].add_ontologyDbId(observationVariableDbId, ontologyDbId);
    }
    /**
     * add_scaleDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_scaleDbId(observationVariableDbId, scaleDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].add_scaleDbId(observationVariableDbId, scaleDbId);
    }
    /**
     * add_traitDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_traitDbId(observationVariableDbId, traitDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].add_traitDbId(observationVariableDbId, traitDbId);
    }

    /**
     * remove_methodDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_methodDbId(observationVariableDbId, methodDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].remove_methodDbId(observationVariableDbId, methodDbId);
    }
    /**
     * remove_ontologyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].remove_ontologyDbId(observationVariableDbId, ontologyDbId);
    }
    /**
     * remove_scaleDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_scaleDbId(observationVariableDbId, scaleDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].remove_scaleDbId(observationVariableDbId, scaleDbId);
    }
    /**
     * remove_traitDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_traitDbId(observationVariableDbId, traitDbId) {
        let responsibleAdapter = this.adapterForIri(observationVariableDbId);
        return await adapters[responsibleAdapter].remove_traitDbId(observationVariableDbId, traitDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("observationVariable.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(observationVariable);
    }
}