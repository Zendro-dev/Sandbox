const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'germplasm',
    storageType: 'distributed-data-model',
    registry: [
        'germplasm_PHENOMIS',
        'germplasm_PHIS',
        'germplasm_PIPPA'
    ],
    attributes: {
        accessionNumber: 'String',
        acquisitionDate: 'Date',
        breedingMethodDbId: 'String',
        commonCropName: 'String',
        countryOfOriginCode: 'String',
        defaultDisplayName: 'String',
        documentationURL: 'String',
        germplasmGenus: 'String',
        germplasmName: 'String',
        germplasmPUI: 'String',
        germplasmPreprocessing: 'String',
        germplasmSpecies: 'String',
        germplasmSubtaxa: 'String',
        instituteCode: 'String',
        instituteName: 'String',
        pedigree: 'String',
        seedSource: 'String',
        seedSourceDescription: 'String',
        speciesAuthority: 'String',
        subtaxaAuthority: 'String',
        xref: 'String',
        germplasmDbId: 'String',
        biologicalStatusOfAccessionCode: 'String'
    },
    associations: {
        breedingMethod: {
            type: 'to_one',
            target: 'breedingMethod',
            targetKey: 'breedingMethodDbId',
            keyIn: 'germplasm',
            targetStorageType: 'distributed-data-model',
            label: 'breedingMethodName',
            name: 'breedingMethod',
            name_lc: 'breedingMethod',
            name_cp: 'BreedingMethod',
            target_lc: 'breedingMethod',
            target_lc_pl: 'breedingMethods',
            target_pl: 'breedingMethods',
            target_cp: 'BreedingMethod',
            target_cp_pl: 'BreedingMethods',
            keyIn_lc: 'germplasm',
            holdsForeignKey: true
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'germplasmDbId',
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
            targetKey: 'germplasmDbId',
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
    internalId: 'germplasmDbId',
    id: {
        name: 'germplasmDbId',
        type: 'String'
    }
};

let registry = ["germplasm_PHENOMIS", "germplasm_PHIS", "germplasm_PIPPA"];

module.exports = class germplasm {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        germplasmDbId,
        accessionNumber,
        acquisitionDate,
        breedingMethodDbId,
        commonCropName,
        countryOfOriginCode,
        defaultDisplayName,
        documentationURL,
        germplasmGenus,
        germplasmName,
        germplasmPUI,
        germplasmPreprocessing,
        germplasmSpecies,
        germplasmSubtaxa,
        instituteCode,
        instituteName,
        pedigree,
        seedSource,
        seedSourceDescription,
        speciesAuthority,
        subtaxaAuthority,
        xref,
        biologicalStatusOfAccessionCode
    }) {
        this.germplasmDbId = germplasmDbId;
        this.accessionNumber = accessionNumber;
        this.acquisitionDate = acquisitionDate;
        this.breedingMethodDbId = breedingMethodDbId;
        this.commonCropName = commonCropName;
        this.countryOfOriginCode = countryOfOriginCode;
        this.defaultDisplayName = defaultDisplayName;
        this.documentationURL = documentationURL;
        this.germplasmGenus = germplasmGenus;
        this.germplasmName = germplasmName;
        this.germplasmPUI = germplasmPUI;
        this.germplasmPreprocessing = germplasmPreprocessing;
        this.germplasmSpecies = germplasmSpecies;
        this.germplasmSubtaxa = germplasmSubtaxa;
        this.instituteCode = instituteCode;
        this.instituteName = instituteName;
        this.pedigree = pedigree;
        this.seedSource = seedSource;
        this.seedSourceDescription = seedSourceDescription;
        this.speciesAuthority = speciesAuthority;
        this.subtaxaAuthority = subtaxaAuthority;
        this.xref = xref;
        this.biologicalStatusOfAccessionCode = biologicalStatusOfAccessionCode;
    }

    static get name() {
        return "germplasm";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["germplasm_PHENOMIS", "germplasm_PHIS", "germplasm_PIPPA"].reduce((a, c) => {
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

            return adapters[responsibleAdapter[0]].readById(id).then(result => new germplasm(result));
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
                        field: "germplasmDbId",
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
        let attributes = Object.keys(germplasm.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = germplasm.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return germplasm.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of germplasm.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[germplasm.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.germplasmDbId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'germplasmDbId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.germplasmDbId);
        return adapters[responsibleAdapter].addOne(input).then(result => new germplasm(result));
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);
        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.germplasmDbId);
        return adapters[responsibleAdapter].updateOne(input).then(result => new germplasm(result));
    }

    /**
     * add_breedingMethodDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let responsibleAdapter = this.adapterForIri(germplasmDbId);
        return await adapters[responsibleAdapter].add_breedingMethodDbId(germplasmDbId, breedingMethodDbId);
    }

    /**
     * remove_breedingMethodDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let responsibleAdapter = this.adapterForIri(germplasmDbId);
        return await adapters[responsibleAdapter].remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId);
    }



    static bulkAddCsv(context) {
        throw new Error("germplasm.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(germplasm);
    }
}