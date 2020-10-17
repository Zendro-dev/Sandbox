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
    model: 'individual',
    storageType: 'sql',
    attributes: {
        name: 'String',
        sowing_date: 'Date',
        harvest_date: 'Date',
        developmental_state: 'String',
        life_cycle_phase: 'String',
        location_type: 'String',
        cultivar_id: 'Int',
        field_plot_id: 'Int',
        pot_id: 'Int'
    },
    associations: {
        cultivar: {
            type: 'to_one',
            target: 'cultivar',
            targetKey: 'cultivar_id',
            keyIn: 'individual',
            targetStorageType: 'sql',
            label: 'genotype',
            sublabel: 'description'
        },
        field_plot: {
            type: 'to_one',
            target: 'field_plot',
            targetKey: 'field_plot_id',
            keyIn: 'individual',
            targetStorageType: 'sql',
            label: 'location_code',
            sublabel: 'field_name'
        },
        pot: {
            type: 'to_one',
            target: 'pot',
            targetKey: 'pot_id',
            keyIn: 'individual',
            targetStorageType: 'sql',
            label: 'pot',
            sublabel: 'greenhouse'
        },
        samples: {
            type: 'to_many',
            target: 'sample',
            targetKey: 'individual_id',
            keyIn: 'sample',
            targetStorageType: 'sql',
            label: 'name',
            sublabel: 'material'
        },
        plant_measurements: {
            type: 'to_many',
            target: 'plant_measurement',
            targetKey: 'individual_id',
            keyIn: 'plant_measurement',
            targetStorageType: 'sql',
            label: 'variable',
            sublabel: 'value'
        },
        transcript_counts: {
            type: 'to_many',
            target: 'transcript_count',
            targetKey: 'individual_id',
            keyIn: 'transcript_count',
            targetStorageType: 'sql',
            label: 'gene',
            sublabel: 'count'
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

module.exports = class individual extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            name: {
                type: Sequelize[dict['String']]
            },
            sowing_date: {
                type: Sequelize[dict['Date']]
            },
            harvest_date: {
                type: Sequelize[dict['Date']]
            },
            developmental_state: {
                type: Sequelize[dict['String']]
            },
            life_cycle_phase: {
                type: Sequelize[dict['String']]
            },
            location_type: {
                type: Sequelize[dict['String']]
            },
            cultivar_id: {
                type: Sequelize[dict['Int']]
            },
            field_plot_id: {
                type: Sequelize[dict['Int']]
            },
            pot_id: {
                type: Sequelize[dict['Int']]
            }


        }, {
            modelName: "individual",
            tableName: "individuals",
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

    static associate(models) {
        individual.belongsTo(models.cultivar, {
            as: 'cultivar',
            foreignKey: 'cultivar_id'
        });
        individual.belongsTo(models.field_plot, {
            as: 'field_plot',
            foreignKey: 'field_plot_id'
        });
        individual.belongsTo(models.pot, {
            as: 'pot',
            foreignKey: 'pot_id'
        });
        individual.hasMany(models.sample, {
            as: 'samples',
            foreignKey: 'individual_id'
        });
        individual.hasMany(models.plant_measurement, {
            as: 'plant_measurements',
            foreignKey: 'individual_id'
        });
        individual.hasMany(models.transcript_count, {
            as: 'transcript_counts',
            foreignKey: 'individual_id'
        });
    }

    static async readById(id) {
        let item = await individual.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute());
        let records = await super.findAll(options);
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute());
        let records = await super.findAll(options);
        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute());
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        try {
            const result = await this.sequelize.transaction(async (t) => {
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
        try {
            let result = await this.sequelize.transaction(async (t) => {
                let updated = await super.update(input, {
                    where: {
                        [this.idAttribute()]: input[this.idAttribute()]
                    },
                    returning: true,
                    transaction: t
                });
                return updated;
            });
            if (result[0] === 0) {
                throw new Error(`Record with ID = ${input[this.idAttribute()]} does not exist`);
            }
            return result[1][0];
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

        return `Bulk import of individual records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_cultivar_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   cultivar_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_cultivar_id(id, cultivar_id) {
        let updated = await individual.update({
            cultivar_id: cultivar_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_field_plot_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   field_plot_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_field_plot_id(id, field_plot_id) {
        let updated = await individual.update({
            field_plot_id: field_plot_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_pot_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   pot_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_pot_id(id, pot_id) {
        let updated = await individual.update({
            pot_id: pot_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }

    /**
     * remove_cultivar_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   cultivar_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_cultivar_id(id, cultivar_id) {
        let updated = await individual.update({
            cultivar_id: null
        }, {
            where: {
                id: id,
                cultivar_id: cultivar_id
            }
        });
        return updated;
    }
    /**
     * remove_field_plot_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   field_plot_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_field_plot_id(id, field_plot_id) {
        let updated = await individual.update({
            field_plot_id: null
        }, {
            where: {
                id: id,
                field_plot_id: field_plot_id
            }
        });
        return updated;
    }
    /**
     * remove_pot_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   pot_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_pot_id(id, pot_id) {
        let updated = await individual.update({
            pot_id: null
        }, {
            where: {
                id: id,
                pot_id: pot_id
            }
        });
        return updated;
    }





    /**
     * bulkAssociateIndividualWithCultivar_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateIndividualWithCultivar_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "cultivar_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            cultivar_id,
            id
        }) => {
            promises.push(super.update({
                cultivar_id: cultivar_id
            }, {
                where: {
                    id: id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateIndividualWithField_plot_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateIndividualWithField_plot_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "field_plot_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            field_plot_id,
            id
        }) => {
            promises.push(super.update({
                field_plot_id: field_plot_id
            }, {
                where: {
                    id: id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateIndividualWithPot_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateIndividualWithPot_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "pot_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            pot_id,
            id
        }) => {
            promises.push(super.update({
                pot_id: pot_id
            }, {
                where: {
                    id: id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateIndividualWithCultivar_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateIndividualWithCultivar_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "cultivar_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            cultivar_id,
            id
        }) => {
            promises.push(super.update({
                cultivar_id: null
            }, {
                where: {
                    id: id,
                    cultivar_id: cultivar_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateIndividualWithField_plot_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateIndividualWithField_plot_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "field_plot_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            field_plot_id,
            id
        }) => {
            promises.push(super.update({
                field_plot_id: null
            }, {
                where: {
                    id: id,
                    field_plot_id: field_plot_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateIndividualWithPot_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateIndividualWithPot_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "pot_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            pot_id,
            id
        }) => {
            promises.push(super.update({
                pot_id: null
            }, {
                where: {
                    id: id,
                    pot_id: pot_id
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
        return individual.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return individual.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of individual.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[individual.idAttribute()]
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
        let attributes = Object.keys(individual.definition.attributes);
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