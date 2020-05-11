const _ = require('lodash');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');
const Sequelize = require('sequelize');
const dict = require('../utils/graphql-sequelize-types');
const validatorUtil = require('../utils/validatorUtil');
const helper = require('../utils/helper');
const searchArg = require('../utils/search-argument');
const path = require('path');
const fileTools = require('../utils/file-tools');
const helpersAcl = require('../utils/helpers-acl');
const email = require('../utils/email');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const remoteCenzontleURL = "";
const iriRegex = new RegExp('phis');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'germplasm',
    storageType: 'sql-adapter',
    adapterName: 'germplasm_PHIS',
    regex: 'phis',
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

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class germplasm_PHIS extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            germplasmDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            accessionNumber: {
                type: Sequelize[dict['String']]
            },
            acquisitionDate: {
                type: Sequelize[dict['Date']]
            },
            breedingMethodDbId: {
                type: Sequelize[dict['String']]
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            countryOfOriginCode: {
                type: Sequelize[dict['String']]
            },
            defaultDisplayName: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            germplasmGenus: {
                type: Sequelize[dict['String']]
            },
            germplasmName: {
                type: Sequelize[dict['String']]
            },
            germplasmPUI: {
                type: Sequelize[dict['String']]
            },
            germplasmPreprocessing: {
                type: Sequelize[dict['String']]
            },
            germplasmSpecies: {
                type: Sequelize[dict['String']]
            },
            germplasmSubtaxa: {
                type: Sequelize[dict['String']]
            },
            instituteCode: {
                type: Sequelize[dict['String']]
            },
            instituteName: {
                type: Sequelize[dict['String']]
            },
            pedigree: {
                type: Sequelize[dict['String']]
            },
            seedSource: {
                type: Sequelize[dict['String']]
            },
            seedSourceDescription: {
                type: Sequelize[dict['String']]
            },
            speciesAuthority: {
                type: Sequelize[dict['String']]
            },
            subtaxaAuthority: {
                type: Sequelize[dict['String']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            biologicalStatusOfAccessionCode: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "germplasm",
            tableName: "germplasms",
            sequelize
        });
    }

    static get adapterName() {
        return 'germplasm_PHIS';
    }

    static get adapterType() {
        return 'sql-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static readById(id) {
        let options = {};
        options['where'] = {};
        options['where'][this.idAttribute()] = id;
        return germplasm_PHIS.findOne(options);
    }

    static countRecords(search) {
        let options = {};

        /*
         * Search conditions
         */
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }
        return super.count(options);
    }

    static readAllCursor(search, order, pagination) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let options = {};
        options['where'] = {};

        /*
         * Search conditions
         */
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        /*
         * Count
         */
        return super.count(options).then(countA => {
            options['offset'] = 0;
            options['order'] = [];
            options['limit'] = countA;
            /*
             * Order conditions
             */
            if (order !== undefined) {
                options['order'] = order.map((orderItem) => {
                    return [orderItem.field, orderItem.order];
                });
            }
            if (!options['order'].map(orderItem => {
                    return orderItem[0]
                }).includes("germplasmDbId")) {
                options['order'] = [...options['order'], ...[
                    ["germplasmDbId", "ASC"]
                ]];
            }

            /*
             * Pagination conditions
             */
            if (pagination) {
                //forward
                if (isForwardPagination) {
                    if (pagination.after) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.after));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "germplasmDbId", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "germplasmDbId", pagination.includeCursor)
                        };
                    }
                }
            }
            //woptions: copy of {options} with only 'where' options
            let woptions = {};
            woptions['where'] = {
                ...options['where']
            };
            /*
             *  Count (with only where-options)
             */
            return super.count(woptions).then(countB => {
                /*
                 * Limit conditions
                 */
                if (pagination) {
                    //forward
                    if (isForwardPagination) {

                        if (pagination.first) {
                            options['limit'] = pagination.first;
                        }
                    } else { //backward
                        if (pagination.last) {
                            options['limit'] = pagination.last;
                            options['offset'] = Math.max((countB - pagination.last), 0);
                        }
                    }
                }
                //check: limit
                if (globals.LIMIT_RECORDS < options['limit']) {
                    throw new Error(`Request of total germplasms exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }

                /*
                 * Get records
                 */
                return super.findAll(options).then(records => {
                    let edges = [];
                    let pageInfo = {
                        hasPreviousPage: false,
                        hasNextPage: false,
                        startCursor: null,
                        endCursor: null
                    };

                    //edges
                    if (records.length > 0) {
                        edges = records.map(record => {
                            return {
                                node: record,
                                cursor: record.base64Enconde()
                            }
                        });
                    }

                    //forward
                    if (isForwardPagination) {

                        pageInfo = {
                            hasPreviousPage: ((countA - countB) > 0),
                            hasNextPage: (pagination && pagination.first ? (countB > pagination.first) : false),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    } else { //backward

                        pageInfo = {
                            hasPreviousPage: (pagination && pagination.last ? (countB > pagination.last) : false),
                            hasNextPage: ((countA - countB) > 0),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    }

                    return {
                        edges,
                        pageInfo
                    };

                }).catch(error => {
                    throw error;
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    }

    static addOne(input) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
            .then(async (valSuccess) => {
                try {
                    const result = await sequelize.transaction(async (t) => {
                        let item = await super.create(input, {
                            transaction: t
                        });
                        return item;
                    });
                    return result;
                } catch (error) {
                    throw error;
                }
            });
    }

    static deleteOne(id) {
        return super.findByPk(id)
            .then(item => {

                if (item === null) return new Error(`Record with ID = ${id} not exist`);

                return validatorUtil.ifHasValidatorFunctionInvoke('validateForDelete', this, item)
                    .then((valSuccess) => {
                        return item
                            .destroy()
                            .then(() => {
                                return 'Item successfully deleted';
                            });
                    }).catch((err) => {
                        return err
                    })
            });

    }

    static updateOne(input) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input)
            .then(async (valSuccess) => {
                try {
                    let result = await sequelize.transaction(async (t) => {
                        let item = await super.findByPk(input[this.idAttribute()], {
                            transaction: t
                        });
                        let updated = await item.update(input, {
                            transaction: t
                        });
                        return updated;
                    });
                    return result;
                } catch (error) {
                    throw error;
                }
            });
    }


    /**
     * add_breedingMethodDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    breedingMethodDbId: breedingMethodDbId
                }, {
                    where: {
                        germplasmDbId: germplasmDbId
                    }
                }, {
                    transaction: transaction
                })
            } catch (error) {
                throw error;
            }
        });
        return updated;
    }


    /**
     * remove_breedingMethodDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    breedingMethodDbId: null
                }, {
                    where: {
                        germplasmDbId: germplasmDbId
                    }
                }, {
                    transaction: transaction
                })
            } catch (error) {
                throw error;
            }
        });
        return updated;
    }





    static bulkAddCsv(context) {

        let delim = context.request.body.delim;
        let cols = context.request.body.cols;
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        context.request.files.csv_file.mv(tmpFile).then(() => {

            fileTools.parseCsvStream(tmpFile, this, delim, cols).then((addedZipFilePath) => {
                try {
                    console.log(`Sending ${addedZipFilePath} to the user.`);

                    let attach = [];
                    attach.push({
                        filename: path.basename("added_data.zip"),
                        path: addedZipFilePath
                    });

                    email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                        'ScienceDB batch add',
                        'Your data has been successfully added to the database.',
                        attach).then(function(info) {
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.log(info);
                    }).catch(function(err) {
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.error(err);
                    });

                } catch (error) {
                    console.error(error.message);
                }

                fs.unlinkSync(tmpFile);
            }).catch((error) => {
                email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                    'ScienceDB batch add', `${error.message}`).then(function(info) {
                    console.error(info);
                }).catch(function(err) {
                    console.error(err);
                });

                fs.unlinkSync(tmpFile);
            });

        }).catch((error) => {
            throw new Error(error);
        });
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(germplasm);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return germplasm_PHIS.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return germplasm_PHIS.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of germplasm.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[germplasm_PHIS.idAttribute()]
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
        let attributes = Object.keys(germplasm_PHIS.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    static externalIdsObject() {
        return {};
    }

}