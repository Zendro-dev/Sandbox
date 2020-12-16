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
    model: 'observation',
    storageType: 'sql',
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
            targetStorageType: 'sql',
            label: 'season'
        },
        germplasm: {
            type: 'to_one',
            target: 'germplasm',
            targetKey: 'germplasmDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'germplasmName'
        },
        observationUnit: {
            type: 'to_one',
            target: 'observationUnit',
            targetKey: 'observationUnitDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationUnitName'
        },
        observationVariable: {
            type: 'to_one',
            target: 'observationVariable',
            targetKey: 'observationVariableDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationVariableName'
        },
        study: {
            type: 'to_one',
            target: 'study',
            targetKey: 'studyDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'studyName'
        },
        image: {
            type: 'to_one',
            target: 'image',
            targetKey: 'imageDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'imageName'
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

module.exports = class observation extends Sequelize.Model {

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
        observation.belongsTo(models.season, {
            as: 'season',
            foreignKey: 'seasonDbId'
        });
        observation.belongsTo(models.germplasm, {
            as: 'germplasm',
            foreignKey: 'germplasmDbId'
        });
        observation.belongsTo(models.observationUnit, {
            as: 'observationUnit',
            foreignKey: 'observationUnitDbId'
        });
        observation.belongsTo(models.observationVariable, {
            as: 'observationVariable',
            foreignKey: 'observationVariableDbId'
        });
        observation.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'studyDbId'
        });
        observation.belongsTo(models.image, {
            as: 'image',
            foreignKey: 'imageDbId'
        });
    }

    static async readById(id) {
        let item = await observation.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = observation.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, observation.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), observation.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observation.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observation.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => observation.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observation.definition.attributes);
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
        input = observation.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observation.postReadCast(result.dataValues)
            observation.postReadCast(result._previousDataValues)
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
        input = observation.preWriteCast(input)
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
            observation.postReadCast(result.dataValues)
            observation.postReadCast(result._previousDataValues)
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

        return `Bulk import of observation records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_seasonDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_seasonDbId(observationDbId, seasonDbId) {
        let updated = await observation.update({
            seasonDbId: seasonDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }
    /**
     * add_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_germplasmDbId(observationDbId, germplasmDbId) {
        let updated = await observation.update({
            germplasmDbId: germplasmDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }
    /**
     * add_observationUnitDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observationUnitDbId(observationDbId, observationUnitDbId) {
        let updated = await observation.update({
            observationUnitDbId: observationUnitDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }
    /**
     * add_observationVariableDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observationVariableDbId(observationDbId, observationVariableDbId) {
        let updated = await observation.update({
            observationVariableDbId: observationVariableDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }
    /**
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbId(observationDbId, studyDbId) {
        let updated = await observation.update({
            studyDbId: studyDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }
    /**
     * add_imageDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_imageDbId(observationDbId, imageDbId) {
        let updated = await observation.update({
            imageDbId: imageDbId
        }, {
            where: {
                observationDbId: observationDbId
            }
        });
        return updated;
    }

    /**
     * remove_seasonDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   seasonDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_seasonDbId(observationDbId, seasonDbId) {
        let updated = await observation.update({
            seasonDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                seasonDbId: seasonDbId
            }
        });
        return updated;
    }
    /**
     * remove_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_germplasmDbId(observationDbId, germplasmDbId) {
        let updated = await observation.update({
            germplasmDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                germplasmDbId: germplasmDbId
            }
        });
        return updated;
    }
    /**
     * remove_observationUnitDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observationUnitDbId(observationDbId, observationUnitDbId) {
        let updated = await observation.update({
            observationUnitDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * remove_observationVariableDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationVariableDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observationVariableDbId(observationDbId, observationVariableDbId) {
        let updated = await observation.update({
            observationVariableDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                observationVariableDbId: observationVariableDbId
            }
        });
        return updated;
    }
    /**
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbId(observationDbId, studyDbId) {
        let updated = await observation.update({
            studyDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                studyDbId: studyDbId
            }
        });
        return updated;
    }
    /**
     * remove_imageDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationDbId   IdAttribute of the root model to be updated
     * @param {Id}   imageDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_imageDbId(observationDbId, imageDbId) {
        let updated = await observation.update({
            imageDbId: null
        }, {
            where: {
                observationDbId: observationDbId,
                imageDbId: imageDbId
            }
        });
        return updated;
    }





    /**
     * bulkAssociateObservationWithSeasonDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithSeasonDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "seasonDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            seasonDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                seasonDbId: seasonDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationWithGermplasmDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: germplasmDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationWithObservationUnitDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithObservationUnitDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "observationUnitDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            observationUnitDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                observationUnitDbId: observationUnitDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationWithObservationVariableDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithObservationVariableDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "observationVariableDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            observationVariableDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                observationVariableDbId: observationVariableDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationWithStudyDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                studyDbId: studyDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationWithImageDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationWithImageDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "imageDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            imageDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                imageDbId: imageDbId
            }, {
                where: {
                    observationDbId: observationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationWithSeasonDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithSeasonDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "seasonDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            seasonDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                seasonDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    seasonDbId: seasonDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationWithGermplasmDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    germplasmDbId: germplasmDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationWithObservationUnitDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithObservationUnitDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "observationUnitDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            observationUnitDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                observationUnitDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationWithObservationVariableDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithObservationVariableDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "observationVariableDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            observationVariableDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                observationVariableDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    observationVariableDbId: observationVariableDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationWithStudyDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                studyDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    studyDbId: studyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationWithImageDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationWithImageDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationDbId", "imageDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            imageDbId,
            observationDbId
        }) => {
            promises.push(super.update({
                imageDbId: null
            }, {
                where: {
                    observationDbId: observationDbId,
                    imageDbId: imageDbId
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
        return observation.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observation.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observation.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observation.idAttribute()]
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
        let attributes = Object.keys(observation.definition.attributes);
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