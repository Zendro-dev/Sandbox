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
const iriRegex = new RegExp('instance1');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'dog',
    storageType: 'sql-adapter',
    adapterName: 'dog_instance1',
    regex: 'instance1',
    attributes: {
        name: 'String',
        dog_id: 'String',
        person_id: 'String'
    },
    associations: {
        person: {
            type: 'to_one',
            target: 'person',
            targetKey: 'person_id',
            keyIn: 'dog',
            targetStorageType: 'distributed-data-model',
            name: 'person',
            name_lc: 'person',
            name_cp: 'Person',
            target_lc: 'person',
            target_lc_pl: 'people',
            target_pl: 'people',
            target_cp: 'Person',
            target_cp_pl: 'People',
            keyIn_lc: 'dog',
            holdsForeignKey: true
        }
    },
    internalId: 'dog_id',
    id: {
        name: 'dog_id',
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

module.exports = class dog_instance1 extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            dog_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            },
            person_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "dog",
            tableName: "dogs",
            sequelize
        });
    }

    static get adapterName() {
        return 'dog_instance1';
    }

    static get adapterType() {
        return 'sql-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(id) {
        let item = await dog_instance1.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        return item;
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
                }).includes("dog_id")) {
                options['order'] = [...options['order'], ...[
                    ["dog_id", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "dog_id", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "dog_id", pagination.includeCursor)
                        };
                    }
                }
            }
            //woptions: copy of {options} with only 'where' options
            let woptions = {};
            woptions['where'] = { ...options['where']
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
                    throw new Error(`Request of total dogs exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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

    static async addOne(input) {

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

    }

    static deleteOne(id) {
        return super.findByPk(id)
            .then(item => {
                if (item === null) return new Error(`Record with ID = ${id} not exist`);
                return item
                    .destroy()
                    .then(() => {
                        return 'Item successfully deleted';
                    });
            });
    }

    static async updateOne(input) {
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
    }


    /**
     * add_person_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_person_id(dog_id, person_id) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    person_id: person_id
                }, {
                    where: {
                        dog_id: dog_id
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
     * remove_person_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_person_id(dog_id, person_id) {
        let updated = await sequelize.transaction(async transaction => {
            try {
                return super.update({
                    person_id: null
                }, {
                    where: {
                        dog_id: dog_id,
                        person_id: person_id
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
        return helper.csvTableTemplate(dog);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return dog_instance1.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return dog_instance1.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of dog.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[dog_instance1.idAttribute()]
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
        let attributes = Object.keys(dog_instance1.definition.attributes);
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