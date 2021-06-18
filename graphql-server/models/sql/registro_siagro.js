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
    model: 'registro_siagro',
    storageType: 'sql',
    attributes: {
        siagro_id: 'String',
        IndividuosCopias: 'Int',
        TipoPreparacion: 'String',
        FuenteColectaObservacion: 'String',
        Habitat: 'String',
        EstatusEcologico: 'String',
        PlantaManejada: 'String',
        MaterialColectado: 'String',
        FormaVida: 'String',
        FormaCrecimiento: 'String',
        Sexo: 'String',
        Fenologia: 'String',
        AlturaEjemplar: 'Float',
        Abundancia: 'String',
        OtrasObservacionesEjemplar: 'String',
        Uso: 'String',
        ParteUtilizada: 'String',
        LenguaNombreComun: 'String',
        NombreComun: 'String',
        InstitucionRespaldaObservacion: 'String',
        TipoVegetacion: 'String',
        AutorizacionInformacion: 'String',
        donante_id: 'Int',
        proyecto_id: 'String',
        snib_id: 'String'
    },
    associations: {
        proyecto: {
            type: 'to_one',
            target: 'proyecto',
            targetKey: 'proyecto_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'sql',
            label: 'proyecto_id',
            sublabel: 'NombreProyecto'
        },
        manejo: {
            type: 'to_one',
            target: 'manejo',
            targetKey: 'registro_id',
            keyIn: 'manejo',
            targetStorageType: 'sql',
            label: 'TipoManejo',
            sublabel: 'TipoAgroecosistema'
        },
        sitio: {
            type: 'to_one',
            target: 'sitio',
            targetKey: 'snib_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'generic',
            label: 'estadomapa',
            sublabel: 'municipiomapa'
        },
        taxon: {
            type: 'to_one',
            target: 'taxon',
            targetKey: 'snib_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'generic',
            label: 'Genero',
            sublabel: 'EpitetoEspecifico'
        },
        donante: {
            type: 'to_one',
            target: 'donante',
            targetKey: 'donante_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'sql',
            label: 'NombreDonanteInformante'
        },
        determinacion: {
            type: 'to_one',
            target: 'determinacion',
            targetKey: 'snib_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'generic',
            label: 'determinador'
        },
        registro_snib: {
            type: 'to_one',
            target: 'registro_snib',
            targetKey: 'snib_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'generic',
            label: 'id'
        }
    },
    internalId: 'siagro_id',
    id: {
        name: 'siagro_id',
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

module.exports = class registro_siagro extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            siagro_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            IndividuosCopias: {
                type: Sequelize[dict['Int']]
            },
            TipoPreparacion: {
                type: Sequelize[dict['String']]
            },
            FuenteColectaObservacion: {
                type: Sequelize[dict['String']]
            },
            Habitat: {
                type: Sequelize[dict['String']]
            },
            EstatusEcologico: {
                type: Sequelize[dict['String']]
            },
            PlantaManejada: {
                type: Sequelize[dict['String']]
            },
            MaterialColectado: {
                type: Sequelize[dict['String']]
            },
            FormaVida: {
                type: Sequelize[dict['String']]
            },
            FormaCrecimiento: {
                type: Sequelize[dict['String']]
            },
            Sexo: {
                type: Sequelize[dict['String']]
            },
            Fenologia: {
                type: Sequelize[dict['String']]
            },
            AlturaEjemplar: {
                type: Sequelize[dict['Float']]
            },
            Abundancia: {
                type: Sequelize[dict['String']]
            },
            OtrasObservacionesEjemplar: {
                type: Sequelize[dict['String']]
            },
            Uso: {
                type: Sequelize[dict['String']]
            },
            ParteUtilizada: {
                type: Sequelize[dict['String']]
            },
            LenguaNombreComun: {
                type: Sequelize[dict['String']]
            },
            NombreComun: {
                type: Sequelize[dict['String']]
            },
            InstitucionRespaldaObservacion: {
                type: Sequelize[dict['String']]
            },
            TipoVegetacion: {
                type: Sequelize[dict['String']]
            },
            AutorizacionInformacion: {
                type: Sequelize[dict['String']]
            },
            donante_id: {
                type: Sequelize[dict['Int']]
            },
            proyecto_id: {
                type: Sequelize[dict['String']]
            },
            snib_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "registro_siagro",
            tableName: "registro_siagros",
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
        registro_siagro.belongsTo(models.proyecto, {
            as: 'proyecto',
            foreignKey: 'proyecto_id'
        });
        registro_siagro.hasOne(models.manejo, {
            as: 'manejo',
            foreignKey: 'registro_id'
        });
        registro_siagro.belongsTo(models.donante, {
            as: 'donante',
            foreignKey: 'donante_id'
        });
    }

    static async readById(id) {
        let item = await registro_siagro.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = registro_siagro.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, registro_siagro.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), registro_siagro.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => registro_siagro.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), registro_siagro.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => registro_siagro.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), registro_siagro.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            registro_siagros: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = registro_siagro.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            registro_siagro.postReadCast(result.dataValues)
            registro_siagro.postReadCast(result._previousDataValues)
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
        input = registro_siagro.preWriteCast(input)
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
            registro_siagro.postReadCast(result.dataValues)
            registro_siagro.postReadCast(result._previousDataValues)
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

        return `Bulk import of registro_siagro records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_proyecto_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   proyecto_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_proyecto_id(siagro_id, proyecto_id) {
        let updated = await registro_siagro.update({
            proyecto_id: proyecto_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }
    /**
     * add_snib_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: snib_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }
    /**
     * add_snib_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: snib_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }
    /**
     * add_donante_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   donante_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_donante_id(siagro_id, donante_id) {
        let updated = await registro_siagro.update({
            donante_id: donante_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }
    /**
     * add_snib_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: snib_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }
    /**
     * add_snib_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: snib_id
        }, {
            where: {
                siagro_id: siagro_id
            }
        });
        return updated;
    }

    /**
     * remove_proyecto_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   proyecto_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_proyecto_id(siagro_id, proyecto_id) {
        let updated = await registro_siagro.update({
            proyecto_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                proyecto_id: proyecto_id
            }
        });
        return updated;
    }
    /**
     * remove_snib_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                snib_id: snib_id
            }
        });
        return updated;
    }
    /**
     * remove_snib_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                snib_id: snib_id
            }
        });
        return updated;
    }
    /**
     * remove_donante_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   donante_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_donante_id(siagro_id, donante_id) {
        let updated = await registro_siagro.update({
            donante_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                donante_id: donante_id
            }
        });
        return updated;
    }
    /**
     * remove_snib_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                snib_id: snib_id
            }
        });
        return updated;
    }
    /**
     * remove_snib_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   siagro_id   IdAttribute of the root model to be updated
     * @param {Id}   snib_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_snib_id(siagro_id, snib_id) {
        let updated = await registro_siagro.update({
            snib_id: null
        }, {
            where: {
                siagro_id: siagro_id,
                snib_id: snib_id
            }
        });
        return updated;
    }





    /**
     * bulkAssociateRegistro_siagroWithProyecto_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "proyecto_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            proyecto_id,
            siagro_id
        }) => {
            promises.push(super.update({
                proyecto_id: proyecto_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: snib_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: snib_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateRegistro_siagroWithDonante_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithDonante_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "donante_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            donante_id,
            siagro_id
        }) => {
            promises.push(super.update({
                donante_id: donante_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: snib_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateRegistro_siagroWithSnib_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: snib_id
            }, {
                where: {
                    siagro_id: siagro_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateRegistro_siagroWithProyecto_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithProyecto_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "proyecto_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            proyecto_id,
            siagro_id
        }) => {
            promises.push(super.update({
                proyecto_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    proyecto_id: proyecto_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    snib_id: snib_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    snib_id: snib_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateRegistro_siagroWithDonante_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithDonante_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "donante_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            donante_id,
            siagro_id
        }) => {
            promises.push(super.update({
                donante_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    donante_id: donante_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    snib_id: snib_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateRegistro_siagroWithSnib_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateRegistro_siagroWithSnib_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "siagro_id", "snib_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            snib_id,
            siagro_id
        }) => {
            promises.push(super.update({
                snib_id: null
            }, {
                where: {
                    siagro_id: siagro_id,
                    snib_id: snib_id
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
        return registro_siagro.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return registro_siagro.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of registro_siagro.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[registro_siagro.idAttribute()]
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
        let attributes = Object.keys(registro_siagro.definition.attributes);
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