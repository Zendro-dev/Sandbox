'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const dict = require('../utils/graphql-sequelize-types');
const searchArg = require('../utils/search-argument');
const globals = require('../config/globals');
const validatorUtil = require('../utils/validatorUtil');
const fileTools = require('../utils/file-tools');
const helpersAcl = require('../utils/helpers-acl');
const email = require('../utils/email');
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuidv4 = require('uuidv4');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const moment = require('moment');
// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'transcript_count',
    storageType: 'SQL',
    attributes: {
        gene: 'String',
        variable: 'String',
        count: 'Float',
        tissue_or_condition: 'String',
        individual_id: 'Int',
        aminoacidsequence_id: 'Int'
    },
    associations: {
        individual: {
            type: 'to_one',
            target: 'individual',
            targetKey: 'individual_id',
            keyIn: 'transcript_count',
            targetStorageType: 'sql',
            name: 'individual',
            name_lc: 'individual',
            name_cp: 'Individual',
            target_lc: 'individual',
            target_lc_pl: 'individuals',
            target_pl: 'individuals',
            target_cp: 'Individual',
            target_cp_pl: 'Individuals',
            keyIn_lc: 'transcript_count',
            holdsForeignKey: true
        },
        aminoacidsequence: {
            type: 'to_one',
            target: 'aminoacidsequence',
            targetKey: 'aminoacidsequence_id',
            keyIn: 'transcript_count',
            targetStorageType: 'webservice',
            name: 'aminoacidsequence',
            name_lc: 'aminoacidsequence',
            name_cp: 'Aminoacidsequence',
            target_lc: 'aminoacidsequence',
            target_lc_pl: 'aminoacidsequences',
            target_pl: 'aminoacidsequences',
            target_cp: 'Aminoacidsequence',
            target_cp_pl: 'Aminoacidsequences',
            keyIn_lc: 'transcript_count',
            holdsForeignKey: true
        }
    },
    id: {
        name: 'id',
        type: 'Int'
    }
};

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class transcript_count extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            gene: {
                type: Sequelize[dict['String']]
            },
            variable: {
                type: Sequelize[dict['String']]
            },
            count: {
                type: Sequelize[dict['Float']]
            },
            tissue_or_condition: {
                type: Sequelize[dict['String']]
            },
            individual_id: {
                type: Sequelize[dict['Int']]
            },
            aminoacidsequence_id: {
                type: Sequelize[dict['Int']]
            }


        }, {
            modelName: "transcript_count",
            tableName: "transcript_counts",
            sequelize
        });
    }

    static associate(models) {
        transcript_count.belongsTo(models.individual, {
            as: 'individual',
            foreignKey: 'individual_id'
        });
    }

    static async readById(id) {
        let item = await transcript_count.findByPk(id);
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

    static async countRecords(search) {
        let options = {};
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }
        return {
            sum: await super.count(options),
            errors: []
        };
    }

    static readAll(search, order, pagination) {
        let options = {};
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        return super.count(options).then(items => {
            if (order !== undefined) {
                options['order'] = order.map((orderItem) => {
                    return [orderItem.field, orderItem.order];
                });
            } else if (pagination !== undefined) {
                options['order'] = [
                    ["id", "ASC"]
                ];
            }

            if (pagination !== undefined) {
                options['offset'] = pagination.offset === undefined ? 0 : pagination.offset;
                options['limit'] = pagination.limit === undefined ? (items - options['offset']) : pagination.limit;
            } else {
                options['offset'] = 0;
                options['limit'] = items;
            }

            if (globals.LIMIT_RECORDS < options['limit']) {
                throw new Error(`Request of total transcript_counts exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
            }
            return super.findAll(options);
        });
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
                }).includes("id")) {
                options['order'] = [...options['order'], ...[
                    ["id", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "id", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "id", pagination.includeCursor)
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
                    throw new Error(`Request of total transcript_counts exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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

                if (item === null) return new Error(`Record with ID = ${id} does not exist`);

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
                        let promises_associations = [];
                        let item = await super.findByPk(input[this.idAttribute()], {
                            transaction: t
                        });
                        if (item === null) {
                            throw new Error(`Record with ID = ${id} does not exist`);
                        }
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
        return helper.csvTableTemplate(transcript_count);
    }


    /**
     * add_individual_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_individual_id(id, individual_id) {
        let updated = await sequelize.transaction(async transaction => {
            return transcript_count.update({
                individual_id: individual_id
            }, {
                where: {
                    id: id
                }
            }, {
                transaction: transaction
            })
        });
        return updated;
    }
    /**
     * add_aminoacidsequence_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   aminoacidsequence_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_aminoacidsequence_id(id, aminoacidsequence_id) {
        let updated = await sequelize.transaction(async transaction => {
            return transcript_count.update({
                aminoacidsequence_id: aminoacidsequence_id
            }, {
                where: {
                    id: id
                }
            }, {
                transaction: transaction
            })
        });
        return updated;
    }

    /**
     * remove_individual_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_individual_id(id, individual_id) {
        let updated = await sequelize.transaction(async transaction => {
            return transcript_count.update({
                individual_id: null
            }, {
                where: {
                    id: id,
                    individual_id: individual_id
                }
            }, {
                transaction: transaction
            })
        });
        return updated;
    }
    /**
     * remove_aminoacidsequence_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   aminoacidsequence_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_aminoacidsequence_id(id, aminoacidsequence_id) {
        let updated = await sequelize.transaction(async transaction => {
            return transcript_count.update({
                aminoacidsequence_id: null
            }, {
                where: {
                    id: id,
                    aminoacidsequence_id: aminoacidsequence_id
                }
            }, {
                transaction: transaction
            })
        });
        return updated;
    }


    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return transcript_count.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return transcript_count.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of transcript_count.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[transcript_count.idAttribute()]
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
        let attributes = Object.keys(transcript_count.definition.attributes);
        attributes.push('id');
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