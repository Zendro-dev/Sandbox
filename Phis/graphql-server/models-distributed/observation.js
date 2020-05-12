const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'observation',
    storageType: 'distributed-data-model',
    registry: [
        'observation_PHENOMIS',
        'observation_PHIS',
        'observation_PIPPA'
    ],
    attributes: {
        collector: 'String',
        germplasmDbId: 'String',
        observationTimeStamp: 'DateTime',
        observationUnitDbId: 'String',
        observationVariableDbId: 'String',
        studyDbId: 'String',
        uploadedBy: 'String',
        value: 'String',
        observationDbId: 'String',
        seasonDbId: 'String',
        imageDbId: 'String'
    },
    associations: {
        season: {
            type: 'to_one',
            target: 'season',
            targetKey: 'seasonDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'season',
            name: 'season',
            name_lc: 'season',
            name_cp: 'Season',
            target_lc: 'season',
            target_lc_pl: 'seasons',
            target_pl: 'seasons',
            target_cp: 'Season',
            target_cp_pl: 'Seasons',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        },
        germplasm: {
            type: 'to_one',
            target: 'germplasm',
            targetKey: 'germplasmDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'germplasmName',
            name: 'germplasm',
            name_lc: 'germplasm',
            name_cp: 'Germplasm',
            target_lc: 'germplasm',
            target_lc_pl: 'germplasms',
            target_pl: 'germplasms',
            target_cp: 'Germplasm',
            target_cp_pl: 'Germplasms',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        },
        observationUnit: {
            type: 'to_one',
            target: 'observationUnit',
            targetKey: 'observationUnitDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'observationUnitName',
            name: 'observationUnit',
            name_lc: 'observationUnit',
            name_cp: 'ObservationUnit',
            target_lc: 'observationUnit',
            target_lc_pl: 'observationUnits',
            target_pl: 'observationUnits',
            target_cp: 'ObservationUnit',
            target_cp_pl: 'ObservationUnits',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        },
        observationVariable: {
            type: 'to_one',
            target: 'observationVariable',
            targetKey: 'observationVariableDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'observationVariableName',
            name: 'observationVariable',
            name_lc: 'observationVariable',
            name_cp: 'ObservationVariable',
            target_lc: 'observationVariable',
            target_lc_pl: 'observationVariables',
            target_pl: 'observationVariables',
            target_cp: 'ObservationVariable',
            target_cp_pl: 'ObservationVariables',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        },
        study: {
            type: 'to_one',
            target: 'study',
            targetKey: 'studyDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'studyName',
            name: 'study',
            name_lc: 'study',
            name_cp: 'Study',
            target_lc: 'study',
            target_lc_pl: 'studies',
            target_pl: 'studies',
            target_cp: 'Study',
            target_cp_pl: 'Studies',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        },
        image: {
            type: 'to_one',
            target: 'image',
            targetKey: 'imageDbId',
            keyIn: 'observation',
            targetStorageType: 'distributed-data-model',
            label: 'imageName',
            name: 'image',
            name_lc: 'image',
            name_cp: 'Image',
            target_lc: 'image',
            target_lc_pl: 'images',
            target_pl: 'images',
            target_cp: 'Image',
            target_cp_pl: 'Images',
            keyIn_lc: 'observation',
            holdsForeignKey: true
        }
    },
    internalId: 'observationDbId',
    id: {
        name: 'observationDbId',
        type: 'String'
    }
};

let registry = ["observation_PHENOMIS", "observation_PHIS", "observation_PIPPA"];

module.exports = class observation {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        observationDbId,
        collector,
        germplasmDbId,
        observationTimeStamp,
        observationUnitDbId,
        observationVariableDbId,
        studyDbId,
        uploadedBy,
        value,
        seasonDbId,
        imageDbId
    }) {
        this.observationDbId = observationDbId;
        this.collector = collector;
        this.germplasmDbId = germplasmDbId;
        this.observationTimeStamp = observationTimeStamp;
        this.observationUnitDbId = observationUnitDbId;
        this.observationVariableDbId = observationVariableDbId;
        this.studyDbId = studyDbId;
        this.uploadedBy = uploadedBy;
        this.value = value;
        this.seasonDbId = seasonDbId;
        this.imageDbId = imageDbId;
    }

    static get name() {
        return "observation";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["observation_PHENOMIS", "observation_PHIS", "observation_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new observation(result));
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
                        field: "observationDbId",
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
        let attributes = Object.keys(observation.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = observation.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observation.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observation.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observation.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.observationDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new observation(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new observation(result));
    }

    /**
     * add_seasonDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_seasonDbId(observationDbId, seasonDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_seasonDbId(observationDbId, seasonDbId);
    }
    /**
     * add_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_germplasmDbId(observationDbId, germplasmDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_germplasmDbId(observationDbId, germplasmDbId);
    }
    /**
     * add_observationUnitDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observationUnitDbId(observationDbId, observationUnitDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_observationUnitDbId(observationDbId, observationUnitDbId);
    }
    /**
     * add_observationVariableDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observationVariableDbId(observationDbId, observationVariableDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_observationVariableDbId(observationDbId, observationVariableDbId);
    }
    /**
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbId(observationDbId, studyDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_studyDbId(observationDbId, studyDbId);
    }
    /**
     * add_imageDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_imageDbId(observationDbId, imageDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].add_imageDbId(observationDbId, imageDbId);
    }

    /**
     * remove_seasonDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_seasonDbId(observationDbId, seasonDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_seasonDbId(observationDbId, seasonDbId);
    }
    /**
     * remove_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_germplasmDbId(observationDbId, germplasmDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_germplasmDbId(observationDbId, germplasmDbId);
    }
    /**
     * remove_observationUnitDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observationUnitDbId(observationDbId, observationUnitDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_observationUnitDbId(observationDbId, observationUnitDbId);
    }
    /**
     * remove_observationVariableDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observationVariableDbId(observationDbId, observationVariableDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_observationVariableDbId(observationDbId, observationVariableDbId);
    }
    /**
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbId(observationDbId, studyDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_studyDbId(observationDbId, studyDbId);
    }
    /**
     * remove_imageDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_imageDbId(observationDbId, imageDbId) {
        let responsibleAdapter = this.adapterForIri(observationDbId);
        return await adapters[responsibleAdapter].remove_imageDbId(observationDbId, imageDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("observation.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(observation);
    }
}