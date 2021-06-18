'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const searchArg = require('../../utils/search-argument');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const fileTools = require('../../utils/file-tools');
const helpersAcl = require('../../utils/helpers-acl');
const email = require('../../utils/email');
const fs = require('fs');
const path = require('path');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const helper = require('../../utils/helper');
const models = require(path.join(__dirname, '..', 'index.js'));
const moment = require('moment');
const errorHelper = require('../../utils/errors');
// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'manejo',
    storageType: 'sql',
    attributes: {
        manejo_id: 'Int',
        TipoManejo: 'String',
        TipoAgroecosistema: 'String',
        DescripcionAgroecosistema: 'String',
        SindromeDomesticacion: 'String',
        TenenciaTierra: 'String',
        TipoMaterialProduccion: 'String',
        OrigenMaterial: 'String',
        DestinoProduccion: 'String',
        MesSiembra: 'String',
        MesFloracion: 'String',
        MesFructificacion: 'String',
        MesCosecha: 'String',
        SistemaCultivo: 'String',
        CultivosAsociados: 'String',
        UnidadesSuperficieProduccion: 'String',
        SuperficieProduccion: 'Float',
        UnidadesRendimiento: 'String',
        Rendimiento: 'Float',
        TipoRiego: 'String',
        CaracteristicaResistenciaTolerancia: 'String',
        CaracteristicaSusceptible: 'String',
        registro_id: 'String'
    },
    associations: {
        registro_siagro: {
            type: 'to_one',
            target: 'registro_siagro',
            targetKey: 'registro_id',
            keyIn: 'manejo',
            targetStorageType: 'sql',
            label: 'siagro_id',
            sublabel: 'NombreComun'
        }
    },
    internalId: 'manejo_id',
    id: {
        name: 'manejo_id',
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

module.exports = class manejo extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            manejo_id: {
                type: Sequelize[dict['Int']],
                primaryKey: true
            },
            TipoManejo: {
                type: Sequelize[dict['String']]
            },
            TipoAgroecosistema: {
                type: Sequelize[dict['String']]
            },
            DescripcionAgroecosistema: {
                type: Sequelize[dict['String']]
            },
            SindromeDomesticacion: {
                type: Sequelize[dict['String']]
            },
            TenenciaTierra: {
                type: Sequelize[dict['String']]
            },
            TipoMaterialProduccion: {
                type: Sequelize[dict['String']]
            },
            OrigenMaterial: {
                type: Sequelize[dict['String']]
            },
            DestinoProduccion: {
                type: Sequelize[dict['String']]
            },
            MesSiembra: {
                type: Sequelize[dict['String']]
            },
            MesFloracion: {
                type: Sequelize[dict['String']]
            },
            MesFructificacion: {
                type: Sequelize[dict['String']]
            },
            MesCosecha: {
                type: Sequelize[dict['String']]
            },
            SistemaCultivo: {
                type: Sequelize[dict['String']]
            },
            CultivosAsociados: {
                type: Sequelize[dict['String']]
            },
            UnidadesSuperficieProduccion: {
                type: Sequelize[dict['String']]
            },
            SuperficieProduccion: {
                type: Sequelize[dict['Float']]
            },
            UnidadesRendimiento: {
                type: Sequelize[dict['String']]
            },
            Rendimiento: {
                type: Sequelize[dict['Float']]
            },
            TipoRiego: {
                type: Sequelize[dict['String']]
            },
            CaracteristicaResistenciaTolerancia: {
                type: Sequelize[dict['String']]
            },
            CaracteristicaSusceptible: {
                type: Sequelize[dict['String']]
            },
            registro_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "manejo",
            tableName: "manejos",
            sequelize
        });
    }

    /**
     * Get the storage handler, which is a static property of the data model class.
     * @returns sequelize.
     */
    get storageHandler() {
        return this.sequelize;
    }

    /**
     * Cast array to JSON string for the storage.
     * @param  {object} record  Original data record.
     * @return {object}         Record with JSON string if necessary.
     */
    static preWriteCast(record) {
        for (let attr in definition.attributes) {
            let type = definition.attributes[attr].replace(/\s+/g, '');
            if (type[0] === '[' && record[attr] !== undefined && record[attr] !== null) {
                record[attr] = JSON.stringify(record[attr]);
            }
        }
        return record;
    }

    /**
     * Cast JSON string to array for the validation.
     * @param  {object} record  Record with JSON string if necessary.
     * @return {object}         Parsed data record.
     */
    static postReadCast(record) {
        for (let attr in definition.attributes) {
            let type = definition.attributes[attr].replace(/\s+/g, '');
            if (type[0] === '[' && record[attr] !== undefined && record[attr] !== null) {
                record[attr] = JSON.parse(record[attr]);
            }
        }
        return record;
    }

    static associate(models) {
        manejo.belongsTo(models.registro_siagro, {
            as: 'registro_siagro',
            foreignKey: 'registro_id'
        });
    }

    static async readById(id) {
        let item = await manejo.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = manejo.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, manejo.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), manejo.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => manejo.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), manejo.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => manejo.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), manejo.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            manejos: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = manejo.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            manejo.postReadCast(result.dataValues)
            manejo.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }

    }

    static async deleteOne(id) {
        //validate id
        await validatorUtil.validateData('validateForDelete', this, id);
        let destroyed = await super.destroy({
            where: {
                [this.idAttribute()]: id
            }
        });
        if (destroyed !== 0) {
            return 'Item successfully deleted';
        } else {
            throw new Error(`Record with ID = ${id} does not exist or could not been deleted`);
        }
    }

    static async updateOne(input) {
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        input = manejo.preWriteCast(input)
        try {
            let result = await this.sequelize.transaction(async (t) => {
                let to_update = await super.findByPk(input[this.idAttribute()]);
                if (to_update === null) {
                    throw new Error(`Record with ID = ${input[this.idAttribute()]} does not exist`);
                }

                let updated = await to_update.update(input, {
                    transaction: t
                });
                return updated;
            });
            manejo.postReadCast(result.dataValues)
            manejo.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
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

        return `Bulk import of manejo records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    /**
     * csvTableTemplate - Allows the user to download a template in CSV format with the
     * properties and types of this model.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the
     * GraphQL response will have a non empty errors property.
     */
    static async csvTableTemplate(benignErrorReporter) {
        return helper.csvTableTemplate(definition);
    }



    /**
     * add_registro_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   manejo_id   IdAttribute of the root model to be updated
     * @param {Id}   registro_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_registro_id(manejo_id, registro_id) {
        let updated = await manejo.update({
            registro_id: registro_id
        }, {
            where: {
                manejo_id: manejo_id
            }
        });
        return updated;
    }

    /**
     * remove_registro_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   manejo_id   IdAttribute of the root model to be updated
     * @param {Id}   registro_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_registro_id(manejo_id, registro_id) {
        let updated = await manejo.update({
            registro_id: null
        }, {
            where: {
                manejo_id: manejo_id,
                registro_id: registro_id
            }
        });
        return updated;
    }





    /**
     * bulkAssociateManejoWithRegistro_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateManejoWithRegistro_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "manejo_id", "registro_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            registro_id,
            manejo_id
        }) => {
            promises.push(super.update({
                registro_id: registro_id
            }, {
                where: {
                    manejo_id: manejo_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateManejoWithRegistro_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateManejoWithRegistro_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "manejo_id", "registro_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            registro_id,
            manejo_id
        }) => {
            promises.push(super.update({
                registro_id: null
            }, {
                where: {
                    manejo_id: manejo_id,
                    registro_id: registro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }



    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return manejo.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return manejo.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of manejo.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[manejo.idAttribute()]
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
        let attributes = Object.keys(manejo.definition.attributes);
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