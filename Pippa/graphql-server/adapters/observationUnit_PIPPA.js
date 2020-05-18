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
    model: 'observationUnit',
    storageType: 'sql-adapter',
    adapterName: 'observationUnit_PIPPA',
    regex: 'pippa',
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

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class observationUnit_PIPPA extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            observationUnitDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
                type: Sequelize[dict['String']]
            },
            observationLevel: {
                type: Sequelize[dict['String']]
            },
            observationUnitName: {
                type: Sequelize[dict['String']]
            },
            observationUnitPUI: {
                type: Sequelize[dict['String']]
            },
            plantNumber: {
                type: Sequelize[dict['String']]
            },
            plotNumber: {
                type: Sequelize[dict['String']]
            },
            programDbId: {
                type: Sequelize[dict['String']]
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            },
            trialDbId: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "observationUnit",
            tableName: "observationUnits",
            sequelize
        });
    }

    static get adapterName() {
        return 'observationUnit_PIPPA';
    }

    static get adapterType() {
        return 'sql-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(id) {
        let item = await observationUnit_PIPPA.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        return validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item)
            .then((valSuccess) => {
                return item
            }).catch((err) => {
                return err
            });
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
                }).includes("observationUnitDbId")) {
                options['order'] = [...options['order'], ...[
                    ["observationUnitDbId", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "observationUnitDbId", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "observationUnitDbId", pagination.includeCursor)
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
                    throw new Error(`Request of total observationUnits exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
     * add_germplasmDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    germplasmDbId: germplasmDbId
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId
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
     * add_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_locationDbId(observationUnitDbId, locationDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    locationDbId: locationDbId
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId
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
     * add_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_programDbId(observationUnitDbId, programDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    programDbId: programDbId
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId
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
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_studyDbId(observationUnitDbId, studyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    studyDbId: studyDbId
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId
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
     * add_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_trialDbId(observationUnitDbId, trialDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    trialDbId: trialDbId
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId
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
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    germplasmDbId: null
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId,
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
     * remove_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_locationDbId(observationUnitDbId, locationDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    locationDbId: null
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId,
                        locationDbId: locationDbId
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
     * remove_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_programDbId(observationUnitDbId, programDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    programDbId: null
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId,
                        programDbId: programDbId
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
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_studyDbId(observationUnitDbId, studyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    studyDbId: null
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId,
                        studyDbId: studyDbId
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
     * remove_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_trialDbId(observationUnitDbId, trialDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    trialDbId: null
                }, {
                    where: {
                        observationUnitDbId: observationUnitDbId,
                        trialDbId: trialDbId
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
        return helper.csvTableTemplate(observationUnit);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return observationUnit_PIPPA.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observationUnit_PIPPA.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationUnit.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observationUnit_PIPPA.idAttribute()]
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
        let attributes = Object.keys(observationUnit_PIPPA.definition.attributes);
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