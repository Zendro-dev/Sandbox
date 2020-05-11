const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'study',
    storageType: 'distributed-data-model',
    registry: [
        'study_PHENOMIS',
        'study_PHIS',
        'study_PIPPA'
    ],
    attributes: {
        active: 'Boolean',
        commonCropName: 'String',
        culturalPractices: 'String',
        documentationURL: 'String',
        endDate: 'DateTime',
        license: 'String',
        observationUnitsDescription: 'String',
        startDate: 'DateTime',
        studyDescription: 'String',
        studyName: 'String',
        studyType: 'String',
        trialDbId: 'String',
        studyDbId: 'String',
        locationDbId: 'String'
    },
    associations: {
        studyToContacts: {
            type: 'to_many',
            target: 'study_to_contact',
            targetKey: 'studyDbId',
            keyIn: 'study_to_contact',
            targetStorageType: 'distributed-data-model',
            name: 'studyToContacts',
            name_lc: 'studyToContacts',
            name_cp: 'StudyToContacts',
            target_lc: 'study_to_contact',
            target_lc_pl: 'study_to_contacts',
            target_pl: 'study_to_contacts',
            target_cp: 'Study_to_contact',
            target_cp_pl: 'Study_to_contacts',
            keyIn_lc: 'study_to_contact',
            holdsForeignKey: false
        },
        environmentParameters: {
            type: 'to_many',
            target: 'environmentParameter',
            targetKey: 'studyDbId',
            keyIn: 'environmentParameter',
            targetStorageType: 'distributed-data-model',
            label: 'parameterName',
            sublabel: 'environmentParametersDbId',
            name: 'environmentParameters',
            name_lc: 'environmentParameters',
            name_cp: 'EnvironmentParameters',
            target_lc: 'environmentParameter',
            target_lc_pl: 'environmentParameters',
            target_pl: 'environmentParameters',
            target_cp: 'EnvironmentParameter',
            target_cp_pl: 'EnvironmentParameters',
            keyIn_lc: 'environmentParameter',
            holdsForeignKey: false
        },
        studyToSeasons: {
            type: 'to_many',
            target: 'study_to_season',
            targetKey: 'studyDbId',
            keyIn: 'study_to_season',
            targetStorageType: 'distributed-data-model',
            name: 'studyToSeasons',
            name_lc: 'studyToSeasons',
            name_cp: 'StudyToSeasons',
            target_lc: 'study_to_season',
            target_lc_pl: 'study_to_seasons',
            target_pl: 'study_to_seasons',
            target_cp: 'Study_to_season',
            target_cp_pl: 'Study_to_seasons',
            keyIn_lc: 'study_to_season',
            holdsForeignKey: false
        },
        location: {
            type: 'to_one',
            target: 'location',
            targetKey: 'locationDbId',
            keyIn: 'study',
            targetStorageType: 'distributed-data-model',
            label: 'locationName',
            name: 'location',
            name_lc: 'location',
            name_cp: 'Location',
            target_lc: 'location',
            target_lc_pl: 'locations',
            target_pl: 'locations',
            target_cp: 'Location',
            target_cp_pl: 'Locations',
            keyIn_lc: 'study',
            holdsForeignKey: true
        },
        trial: {
            type: 'to_one',
            target: 'trial',
            targetKey: 'trialDbId',
            keyIn: 'study',
            targetStorageType: 'distributed-data-model',
            label: 'trialName',
            name: 'trial',
            name_lc: 'trial',
            name_cp: 'Trial',
            target_lc: 'trial',
            target_lc_pl: 'trials',
            target_pl: 'trials',
            target_cp: 'Trial',
            target_cp_pl: 'Trials',
            keyIn_lc: 'study',
            holdsForeignKey: true
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'studyDbId',
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
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'studyDbId',
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
        },
        events: {
            type: 'to_many',
            target: 'event',
            targetKey: 'studyDbId',
            keyIn: 'event',
            targetStorageType: 'distributed-data-model',
            label: 'eventType',
            name: 'events',
            name_lc: 'events',
            name_cp: 'Events',
            target_lc: 'event',
            target_lc_pl: 'events',
            target_pl: 'events',
            target_cp: 'Event',
            target_cp_pl: 'Events',
            keyIn_lc: 'event',
            holdsForeignKey: false
        }
    },
    internalId: 'studyDbId',
    id: {
        name: 'studyDbId',
        type: 'String'
    }
};

let registry = ["study_PHENOMIS", "study_PHIS", "study_PIPPA"];

module.exports = class study {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        studyDbId,
        active,
        commonCropName,
        culturalPractices,
        documentationURL,
        endDate,
        license,
        observationUnitsDescription,
        startDate,
        studyDescription,
        studyName,
        studyType,
        trialDbId,
        locationDbId
    }) {
        this.studyDbId = studyDbId;
        this.active = active;
        this.commonCropName = commonCropName;
        this.culturalPractices = culturalPractices;
        this.documentationURL = documentationURL;
        this.endDate = endDate;
        this.license = license;
        this.observationUnitsDescription = observationUnitsDescription;
        this.startDate = startDate;
        this.studyDescription = studyDescription;
        this.studyName = studyName;
        this.studyType = studyType;
        this.trialDbId = trialDbId;
        this.locationDbId = locationDbId;
    }

    static get name() {
        return "study";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["study_PHENOMIS", "study_PHIS", "study_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new study(result));
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
                case 'generic-adapter':
                    let nsearch = helper.addExclusions(search, adapter.adapterName, Object.values(this.registeredAdapters));
                    return adapter.readAllCursor(nsearch, order, pagination).catch(benignErrors => benignErrors);

                case 'sql-adapter':
                case 'cenzontle-webservice-adapter':
                    return adapter.readAllCursor(search, order, pagination).catch(benignErrors => benignErrors);

                case 'default':
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
                        field: "studyDbId",
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
        let attributes = Object.keys(study.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = study.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return study.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of study.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[study.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.studyDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'studyDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.studyDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new study(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.studyDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new study(result));
    }

    /**
     * add_locationDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_locationDbId(studyDbId, locationDbId) {
        let responsibleAdapter = this.adapterForIri(studyDbId);
        return await adapters[responsibleAdapter].add_locationDbId(studyDbId, locationDbId);
    }
    /**
     * add_trialDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_trialDbId(studyDbId, trialDbId) {
        let responsibleAdapter = this.adapterForIri(studyDbId);
        return await adapters[responsibleAdapter].add_trialDbId(studyDbId, trialDbId);
    }

    /**
     * remove_locationDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_locationDbId(studyDbId, locationDbId) {
        let responsibleAdapter = this.adapterForIri(studyDbId);
        return await adapters[responsibleAdapter].remove_locationDbId(studyDbId, locationDbId);
    }
    /**
     * remove_trialDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_trialDbId(studyDbId, trialDbId) {
        let responsibleAdapter = this.adapterForIri(studyDbId);
        return await adapters[responsibleAdapter].remove_trialDbId(studyDbId, trialDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("study.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(study);
    }
}