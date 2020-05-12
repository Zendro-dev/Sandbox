const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'trial',
    storageType: 'distributed-data-model',
    registry: [
        'trial_PHENOMIS',
        'trial_PHIS',
        'trial_PIPPA'
    ],
    attributes: {
        active: 'Boolean',
        commonCropName: 'String',
        documentationURL: 'String',
        endDate: 'DateTime',
        programDbId: 'String',
        startDate: 'DateTime',
        trialDescription: 'String',
        trialName: 'String',
        trialPUI: 'String',
        trialDbId: 'String'
    },
    associations: {
        trialToContacts: {
            type: 'to_many',
            target: 'trial_to_contact',
            targetKey: 'trialDbId',
            keyIn: 'trial_to_contact',
            targetStorageType: 'distributed-data-model',
            label: 'trialDbId',
            name: 'trialToContacts',
            name_lc: 'trialToContacts',
            name_cp: 'TrialToContacts',
            target_lc: 'trial_to_contact',
            target_lc_pl: 'trial_to_contacts',
            target_pl: 'trial_to_contacts',
            target_cp: 'Trial_to_contact',
            target_cp_pl: 'Trial_to_contacts',
            keyIn_lc: 'trial_to_contact',
            holdsForeignKey: false
        },
        program: {
            type: 'to_one',
            target: 'program',
            targetKey: 'programDbId',
            keyIn: 'trial',
            targetStorageType: 'distributed-data-model',
            label: 'programName',
            name: 'program',
            name_lc: 'program',
            name_cp: 'Program',
            target_lc: 'program',
            target_lc_pl: 'programs',
            target_pl: 'programs',
            target_cp: 'Program',
            target_cp_pl: 'Programs',
            keyIn_lc: 'trial',
            holdsForeignKey: true
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'trialDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'distributed-data-model',
            label: 'observationUnitName',
            name: 'observationUnits',
            name_lc: 'observationUnits',
            name_cp: 'ObservationUnits',
            target_lc: 'observationUnit',
            target_lc_pl: 'observationUnits',
            target_pl: 'observationUnits',
            target_cp: 'ObservationUnit',
            target_cp_pl: 'ObservationUnits',
            keyIn_lc: 'observationUnit',
            holdsForeignKey: false
        },
        studies: {
            type: 'to_many',
            target: 'study',
            targetKey: 'trialDbId',
            keyIn: 'study',
            targetStorageType: 'distributed-data-model',
            label: 'studyName',
            name: 'studies',
            name_lc: 'studies',
            name_cp: 'Studies',
            target_lc: 'study',
            target_lc_pl: 'studies',
            target_pl: 'studies',
            target_cp: 'Study',
            target_cp_pl: 'Studies',
            keyIn_lc: 'study',
            holdsForeignKey: false
        }
    },
    internalId: 'trialDbId',
    id: {
        name: 'trialDbId',
        type: 'String'
    }
};

let registry = ["trial_PHENOMIS", "trial_PHIS", "trial_PIPPA"];

module.exports = class trial {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        trialDbId,
        active,
        commonCropName,
        documentationURL,
        endDate,
        programDbId,
        startDate,
        trialDescription,
        trialName,
        trialPUI
    }) {
        this.trialDbId = trialDbId;
        this.active = active;
        this.commonCropName = commonCropName;
        this.documentationURL = documentationURL;
        this.endDate = endDate;
        this.programDbId = programDbId;
        this.startDate = startDate;
        this.trialDescription = trialDescription;
        this.trialName = trialName;
        this.trialPUI = trialPUI;
    }

    static get name() {
        return "trial";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["trial_PHENOMIS", "trial_PHIS", "trial_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new trial(result));
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
                        field: "trialDbId",
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
        let attributes = Object.keys(trial.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = trial.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return trial.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of trial.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[trial.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.trialDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'trialDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.trialDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new trial(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.trialDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new trial(result));
    }

    /**
     * add_programDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   trialDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_programDbId(trialDbId, programDbId) {
        let responsibleAdapter = this.adapterForIri(trialDbId);
        return await adapters[responsibleAdapter].add_programDbId(trialDbId, programDbId);
    }

    /**
     * remove_programDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   trialDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_programDbId(trialDbId, programDbId) {
        let responsibleAdapter = this.adapterForIri(trialDbId);
        return await adapters[responsibleAdapter].remove_programDbId(trialDbId, programDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("trial.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(trial);
    }
}