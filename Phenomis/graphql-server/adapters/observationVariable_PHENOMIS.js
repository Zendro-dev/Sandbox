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
const iriRegex = new RegExp('phenomis');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'observationVariable',
    storageType: 'sql-adapter',
    adapterName: 'observationVariable_PHENOMIS',
    regex: 'phenomis',
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

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class observationVariable_PHENOMIS extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            observationVariableDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            defaultValue: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            growthStage: {
                type: Sequelize[dict['String']]
            },
            institution: {
                type: Sequelize[dict['String']]
            },
            language: {
                type: Sequelize[dict['String']]
            },
            scientist: {
                type: Sequelize[dict['String']]
            },
            status: {
                type: Sequelize[dict['String']]
            },
            submissionTimestamp: {
                type: Sequelize[dict['DateTime']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            observationVariableName: {
                type: Sequelize[dict['String']]
            },
            methodDbId: {
                type: Sequelize[dict['String']]
            },
            scaleDbId: {
                type: Sequelize[dict['String']]
            },
            traitDbId: {
                type: Sequelize[dict['String']]
            },
            ontologyDbId: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "observationVariable",
            tableName: "observationVariables",
            sequelize
        });
    }

    static get adapterName() {
        return 'observationVariable_PHENOMIS';
    }

    static get adapterType() {
        return 'sql-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(id) {
        let item = await observationVariable_PHENOMIS.findByPk(id);
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
                }).includes("observationVariableDbId")) {
                options['order'] = [...options['order'], ...[
                    ["observationVariableDbId", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "observationVariableDbId", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "observationVariableDbId", pagination.includeCursor)
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
                    throw new Error(`Request of total observationVariables exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
     * add_methodDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_methodDbId(observationVariableDbId, methodDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    methodDbId: methodDbId
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId
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
     * add_ontologyDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    ontologyDbId: ontologyDbId
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId
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
     * add_scaleDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_scaleDbId(observationVariableDbId, scaleDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    scaleDbId: scaleDbId
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId
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
     * add_traitDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_traitDbId(observationVariableDbId, traitDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    traitDbId: traitDbId
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId
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
     * remove_methodDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_methodDbId(observationVariableDbId, methodDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    methodDbId: null
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId,
                        methodDbId: methodDbId
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
     * remove_ontologyDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    ontologyDbId: null
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId,
                        ontologyDbId: ontologyDbId
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
     * remove_scaleDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_scaleDbId(observationVariableDbId, scaleDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    scaleDbId: null
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId,
                        scaleDbId: scaleDbId
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
     * remove_traitDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_traitDbId(observationVariableDbId, traitDbId) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    traitDbId: null
                }, {
                    where: {
                        observationVariableDbId: observationVariableDbId,
                        traitDbId: traitDbId
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
        return helper.csvTableTemplate(observationVariable);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return observationVariable_PHENOMIS.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return observationVariable_PHENOMIS.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationVariable.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[observationVariable_PHENOMIS.idAttribute()]
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
        let attributes = Object.keys(observationVariable_PHENOMIS.definition.attributes);
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