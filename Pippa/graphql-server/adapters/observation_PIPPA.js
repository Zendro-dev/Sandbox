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
const iriRegex = new RegExp('pippa');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'observation',
    storageType: 'sql-adapter',
    adapterName: 'observation_PIPPA',
    regex: 'pippa',
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

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class observation_PIPPA extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            observationDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            collector: {
                type: Sequelize[dict['String']]
            },
            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            observationTimeStamp: {
                type: Sequelize[dict['DateTime']]
            },
            observationUnitDbId: {
                type: Sequelize[dict['String']]
            },
            observationVariableDbId: {
                type: Sequelize[dict['String']]
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            },
            uploadedBy: {
                type: Sequelize[dict['String']]
            },
            value: {
                type: Sequelize[dict['String']]
            },
            seasonDbId: {
                type: Sequelize[dict['String']]
            },
            imageDbId: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "observation",
            tableName: "observations",
            sequelize
        });
    }

    static get adapterName() {
        return 'observation_PIPPA';
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
        return observation_PIPPA.findOne(options);
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
                }).includes("observationDbId")) {
                options['order'] = [...options['order'], ...[
                    ["observationDbId", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "observationDbId", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "observationDbId", pagination.includeCursor)
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
                    throw new Error(`Request of total observations exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
     * add_seasonDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_seasonDbId(observationDbId, seasonDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    seasonDbId: seasonDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * add_germplasmDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_germplasmDbId(observationDbId, germplasmDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    germplasmDbId: germplasmDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * add_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_observationUnitDbId(observationDbId, observationUnitDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    observationUnitDbId: observationUnitDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * add_observationVariableDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_observationVariableDbId(observationDbId, observationVariableDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    observationVariableDbId: observationVariableDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * add_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_studyDbId(observationDbId, studyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    studyDbId: studyDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * add_imageDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_imageDbId(observationDbId, imageDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    imageDbId: imageDbId
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_seasonDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_seasonDbId(observationDbId, seasonDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    seasonDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_germplasmDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_germplasmDbId(observationDbId, germplasmDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    germplasmDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_observationUnitDbId(observationDbId, observationUnitDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    observationUnitDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_observationVariableDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_observationVariableDbId(observationDbId, observationVariableDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    observationVariableDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_studyDbId(observationDbId, studyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    studyDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
     * remove_imageDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_imageDbId(observationDbId, imageDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    imageDbId: null
                }, {
                    where: {
                        observationDbId: observationDbId
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
        return helper.csvTableTemplate(observation);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return observation_PIPPA.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observation_PIPPA.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observation.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observation_PIPPA.idAttribute()]
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
        let attributes = Object.keys(observation_PIPPA.definition.attributes);
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