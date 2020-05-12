const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'observationUnit',
    storageType: 'distributed-data-model',
    registry: [
        'observationUnit_PHENOMIS',
        'observationUnit_PHIS',
        'observationUnit_PIPPA'
    ],
    attributes: {
        germplasmDbId: 'String',
        locationDbId: 'String',
        observationLevel: 'String',
        observationUnitName: 'String',
        observationUnitPUI: 'String',
        plantNumber: 'String',
        plotNumber: 'String',
        programDbId: 'String',
        studyDbId: 'String',
        trialDbId: 'String',
        observationUnitDbId: 'String'
    },
    associations: {
        observationTreatments: {
            type: 'to_many',
            target: 'observationTreatment',
            targetKey: 'observationUnitDbId',
            keyIn: 'observationTreatment',
            targetStorageType: 'distributed-data-model',
            label: 'factor',
            name: 'observationTreatments',
            name_lc: 'observationTreatments',
            name_cp: 'ObservationTreatments',
            target_lc: 'observationTreatment',
            target_lc_pl: 'observationTreatments',
            target_pl: 'observationTreatments',
            target_cp: 'ObservationTreatment',
            target_cp_pl: 'ObservationTreatments',
            keyIn_lc: 'observationTreatment',
            holdsForeignKey: false
        },
        observationUnitPosition: {
            type: 'to_one',
            target: 'observationUnitPosition',
            targetKey: 'observationUnitDbId',
            keyIn: 'observationUnitPosition',
            targetStorageType: 'distributed-data-model',
            label: 'observationUnitPositionName',
            name: 'observationUnitPosition',
            name_lc: 'observationUnitPosition',
            name_cp: 'ObservationUnitPosition',
            target_lc: 'observationUnitPosition',
            target_lc_pl: 'observationUnitPositions',
            target_pl: 'observationUnitPositions',
            target_cp: 'ObservationUnitPosition',
            target_cp_pl: 'ObservationUnitPositions',
            keyIn_lc: 'observationUnitPosition',
            holdsForeignKey: false
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'observationUnitDbId',
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
        germplasm: {
            type: 'to_one',
            target: 'germplasm',
            targetKey: 'germplasmDbId',
            keyIn: 'observationUnit',
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
            keyIn_lc: 'observationUnit',
            holdsForeignKey: true
        },
        location: {
            type: 'to_one',
            target: 'location',
            targetKey: 'locationDbId',
            keyIn: 'observationUnit',
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
            keyIn_lc: 'observationUnit',
            holdsForeignKey: true
        },
        program: {
            type: 'to_one',
            target: 'program',
            targetKey: 'programDbId',
            keyIn: 'observationUnit',
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
            keyIn_lc: 'observationUnit',
            holdsForeignKey: true
        },
        study: {
            type: 'to_one',
            target: 'study',
            targetKey: 'studyDbId',
            keyIn: 'observationUnit',
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
            keyIn_lc: 'observationUnit',
            holdsForeignKey: true
        },
        trial: {
            type: 'to_one',
            target: 'trial',
            targetKey: 'trialDbId',
            keyIn: 'observationUnit',
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
            keyIn_lc: 'observationUnit',
            holdsForeignKey: true
        },
        images: {
            type: 'to_many',
            target: 'image',
            targetKey: 'observationUnitDbId',
            keyIn: 'image',
            targetStorageType: 'distributed-data-model',
            label: 'imageName',
            name: 'images',
            name_lc: 'images',
            name_cp: 'Images',
            target_lc: 'image',
            target_lc_pl: 'images',
            target_pl: 'images',
            target_cp: 'Image',
            target_cp_pl: 'Images',
            keyIn_lc: 'image',
            holdsForeignKey: false
        },
        observationUnitToEvents: {
            type: 'to_many',
            target: 'observationUnit_to_event',
            targetKey: 'observationUnitDbId',
            keyIn: 'observationUnit_to_event',
            targetStorageType: 'distributed-data-model',
            label: 'observationUnitDbId',
            name: 'observationUnitToEvents',
            name_lc: 'observationUnitToEvents',
            name_cp: 'ObservationUnitToEvents',
            target_lc: 'observationUnit_to_event',
            target_lc_pl: 'observationUnit_to_events',
            target_pl: 'observationUnit_to_events',
            target_cp: 'ObservationUnit_to_event',
            target_cp_pl: 'ObservationUnit_to_events',
            keyIn_lc: 'observationUnit_to_event',
            holdsForeignKey: false
        }
    },
    internalId: 'observationUnitDbId',
    id: {
        name: 'observationUnitDbId',
        type: 'String'
    }
};

let registry = ["observationUnit_PHENOMIS", "observationUnit_PHIS", "observationUnit_PIPPA"];

module.exports = class observationUnit {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        observationUnitDbId,
        germplasmDbId,
        locationDbId,
        observationLevel,
        observationUnitName,
        observationUnitPUI,
        plantNumber,
        plotNumber,
        programDbId,
        studyDbId,
        trialDbId
    }) {
        this.observationUnitDbId = observationUnitDbId;
        this.germplasmDbId = germplasmDbId;
        this.locationDbId = locationDbId;
        this.observationLevel = observationLevel;
        this.observationUnitName = observationUnitName;
        this.observationUnitPUI = observationUnitPUI;
        this.plantNumber = plantNumber;
        this.plotNumber = plotNumber;
        this.programDbId = programDbId;
        this.studyDbId = studyDbId;
        this.trialDbId = trialDbId;
    }

    static get name() {
        return "observationUnit";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["observationUnit_PHENOMIS", "observationUnit_PHIS", "observationUnit_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new observationUnit(result));
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
                        field: "observationUnitDbId",
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
        let attributes = Object.keys(observationUnit.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = observationUnit.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observationUnit.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationUnit.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observationUnit.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.observationUnitDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'observationUnitDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationUnitDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new observationUnit(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.observationUnitDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new observationUnit(result));
    }

    /**
     * add_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].add_germplasmDbId(observationUnitDbId, germplasmDbId);
    }
    /**
     * add_locationDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_locationDbId(observationUnitDbId, locationDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].add_locationDbId(observationUnitDbId, locationDbId);
    }
    /**
     * add_programDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_programDbId(observationUnitDbId, programDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].add_programDbId(observationUnitDbId, programDbId);
    }
    /**
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbId(observationUnitDbId, studyDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].add_studyDbId(observationUnitDbId, studyDbId);
    }
    /**
     * add_trialDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_trialDbId(observationUnitDbId, trialDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].add_trialDbId(observationUnitDbId, trialDbId);
    }

    /**
     * remove_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].remove_germplasmDbId(observationUnitDbId, germplasmDbId);
    }
    /**
     * remove_locationDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_locationDbId(observationUnitDbId, locationDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].remove_locationDbId(observationUnitDbId, locationDbId);
    }
    /**
     * remove_programDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_programDbId(observationUnitDbId, programDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].remove_programDbId(observationUnitDbId, programDbId);
    }
    /**
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbId(observationUnitDbId, studyDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].remove_studyDbId(observationUnitDbId, studyDbId);
    }
    /**
     * remove_trialDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_trialDbId(observationUnitDbId, trialDbId) {
        let responsibleAdapter = this.adapterForIri(observationUnitDbId);
        return await adapters[responsibleAdapter].remove_trialDbId(observationUnitDbId, trialDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("observationUnit.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(observationUnit);
    }
}