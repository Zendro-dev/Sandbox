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
const uuidv4 = require('uuidv4').uuid;
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const moment = require('moment');
// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'grupo_enfoque',
    storageType: 'sql',
    attributes: {
        grupo_id: 'String',
        tipo_grupo: 'String',
        numero_participantes: 'Int',
        fecha: 'Date',
        lista_especies: 'String',
        foto_produccion: 'String',
        foto_autoconsumo: 'String',
        foto_venta: 'String',
        foto_compra: 'String',
        observaciones: 'String',
        justificacion_produccion_cuadrante1: 'String',
        justificacion_produccion_cuadrante2: 'String',
        justificacion_produccion_cuadrante3: 'String',
        justificacion_produccion_cuadrante4: 'String',
        sitio_id: 'String'
    },
    associations: {
        sitio: {
            type: 'to_one',
            target: 'sitio',
            targetKey: 'sitio_id',
            keyIn: 'grupo_enfoque',
            targetStorageType: 'sql',
            label: 'estado',
            sublabel: 'municipio',
            name: 'sitio',
            name_lc: 'sitio',
            name_cp: 'Sitio',
            target_lc: 'sitio',
            target_lc_pl: 'sitios',
            target_pl: 'sitios',
            target_cp: 'Sitio',
            target_cp_pl: 'Sitios',
            keyIn_lc: 'grupo_enfoque',
            holdsForeignKey: true
        },
        cuadrantes: {
            type: 'to_many',
            target: 'cuadrante',
            targetKey: 'grupo_enfoque_id',
            keyIn: 'cuadrante',
            targetStorageType: 'sql',
            label: 'nombre_comun_grupo_enfoque',
            name: 'cuadrantes',
            name_lc: 'cuadrantes',
            name_cp: 'Cuadrantes',
            target_lc: 'cuadrante',
            target_lc_pl: 'cuadrantes',
            target_pl: 'cuadrantes',
            target_cp: 'Cuadrante',
            target_cp_pl: 'Cuadrantes',
            keyIn_lc: 'cuadrante',
            holdsForeignKey: false
        }
    },
    internalId: 'grupo_id',
    id: {
        name: 'grupo_id',
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

module.exports = class grupo_enfoque extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            grupo_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            tipo_grupo: {
                type: Sequelize[dict['String']]
            },
            numero_participantes: {
                type: Sequelize[dict['Int']]
            },
            fecha: {
                type: Sequelize[dict['Date']]
            },
            lista_especies: {
                type: Sequelize[dict['String']]
            },
            foto_produccion: {
                type: Sequelize[dict['String']]
            },
            foto_autoconsumo: {
                type: Sequelize[dict['String']]
            },
            foto_venta: {
                type: Sequelize[dict['String']]
            },
            foto_compra: {
                type: Sequelize[dict['String']]
            },
            observaciones: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante1: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante2: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante3: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante4: {
                type: Sequelize[dict['String']]
            },
            sitio_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "grupo_enfoque",
            tableName: "grupo_enfoques",
            sequelize
        });
    }

    static associate(models) {
        grupo_enfoque.belongsTo(models.sitio, {
            as: 'sitio',
            foreignKey: 'sitio_id'
        });
        grupo_enfoque.hasMany(models.cuadrante, {
            as: 'cuadrantes',
            foreignKey: 'grupo_enfoque_id'
        });
    }

    static async readById(id) {
        let item = await grupo_enfoque.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        return validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item)
            .then((valSuccess) => {
                return item
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
        return super.count(options);
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
                    ["grupo_id", "ASC"]
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
                throw new Error(`Request of total grupo_enfoques exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
                }).includes("grupo_id")) {
                options['order'] = [...options['order'], ...[
                    ["grupo_id", "ASC"]
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
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "grupo_id", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "grupo_id", pagination.includeCursor)
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
                    throw new Error(`Request of total grupo_enfoques exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
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
        return helper.csvTableTemplate(grupo_enfoque);
    }



    /**
     * add_sitio_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   grupo_id   IdAttribute of the root model to be updated
     * @param {Id}   sitio_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_sitio_id(grupo_id, sitio_id) {
        let updated = await sequelize.transaction(async transaction => {
            return grupo_enfoque.update({
                sitio_id: sitio_id
            }, {
                where: {
                    grupo_id: grupo_id
                }
            }, {
                transaction: transaction
            })
        });
        return updated;
    }

    /**
     * remove_sitio_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   grupo_id   IdAttribute of the root model to be updated
     * @param {Id}   sitio_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_sitio_id(grupo_id, sitio_id) {
        let updated = await sequelize.transaction(async transaction => {
            return grupo_enfoque.update({
                sitio_id: null
            }, {
                where: {
                    grupo_id: grupo_id,
                    sitio_id: sitio_id
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
        return grupo_enfoque.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return grupo_enfoque.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of grupo_enfoque.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[grupo_enfoque.idAttribute()]
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
        let attributes = Object.keys(grupo_enfoque.definition.attributes);
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