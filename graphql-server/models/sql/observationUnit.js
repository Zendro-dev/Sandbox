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
    model: 'observationUnit',
    storageType: 'sql',
    attributes: {
        observationLevel: 'String',
        observationUnitName: 'String',
        observationUnitPUI: 'String',
        plantNumber: 'String',
        plotNumber: 'String',
        programDbId: 'String',
        studyDbId: 'String',
        trialDbId: 'String',
        observationUnitDbId: 'String',
        germplasmDbId: 'String',
        locationDbId: 'String',
        eventDbIds: '[String]'
    },
    associations: {
        observationTreatments: {
            type: 'to_many',
            target: 'observationTreatment',
            targetKey: 'observationUnitDbId',
            keyIn: 'observationTreatment',
            targetStorageType: 'sql',
            label: 'factor'
        },
        observationUnitPosition: {
            type: 'to_one',
            target: 'observationUnitPosition',
            targetKey: 'observationUnitDbId',
            keyIn: 'observationUnitPosition',
            targetStorageType: 'sql',
            label: 'observationUnitPositionName'
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'observationUnitDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationVariableName',
            sublabel: 'value'
        },
        germplasm: {
            type: 'to_one',
            target: 'germplasm',
            targetKey: 'germplasmDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'germplasmName'
        },
        location: {
            type: 'to_one',
            target: 'location',
            targetKey: 'locationDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'locationName'
        },
        program: {
            type: 'to_one',
            target: 'program',
            targetKey: 'programDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'programName'
        },
        study: {
            type: 'to_one',
            target: 'study',
            targetKey: 'studyDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'studyName'
        },
        trial: {
            type: 'to_one',
            target: 'trial',
            targetKey: 'trialDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'trialName'
        },
        images: {
            type: 'to_many',
            target: 'image',
            targetKey: 'observationUnitDbId',
            keyIn: 'image',
            targetStorageType: 'sql',
            label: 'imageName'
        },
        events: {
            type: 'to_many',
            target: 'event',
            targetKey: 'observationUnitDbIds',
            sourceKey: 'eventDbIds',
            keyIn: 'observationUnit',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'eventType'
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

module.exports = class observationUnit extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            observationUnitDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
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
            },
            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
                type: Sequelize[dict['String']]
            },
            eventDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "observationUnit",
            tableName: "observationUnits",
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
        observationUnit.hasOne(models.observationUnitPosition, {
            as: 'observationUnitPosition',
            foreignKey: 'observationUnitDbId'
        });
        observationUnit.belongsTo(models.germplasm, {
            as: 'germplasm',
            foreignKey: 'germplasmDbId'
        });
        observationUnit.belongsTo(models.location, {
            as: 'location',
            foreignKey: 'locationDbId'
        });
        observationUnit.belongsTo(models.program, {
            as: 'program',
            foreignKey: 'programDbId'
        });
        observationUnit.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'studyDbId'
        });
        observationUnit.belongsTo(models.trial, {
            as: 'trial',
            foreignKey: 'trialDbId'
        });
        observationUnit.hasMany(models.observationTreatment, {
            as: 'observationTreatments',
            foreignKey: 'observationUnitDbId'
        });
        observationUnit.hasMany(models.observation, {
            as: 'observations',
            foreignKey: 'observationUnitDbId'
        });
        observationUnit.hasMany(models.image, {
            as: 'images',
            foreignKey: 'observationUnitDbId'
        });
    }

    static async readById(id) {
        let item = await observationUnit.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = observationUnit.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, observationUnit.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), observationUnit.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observationUnit.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observationUnit.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => observationUnit.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observationUnit.definition.attributes);
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
        input = observationUnit.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observationUnit.postReadCast(result.dataValues)
            observationUnit.postReadCast(result._previousDataValues)
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
        input = observationUnit.preWriteCast(input)
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
            observationUnit.postReadCast(result.dataValues)
            observationUnit.postReadCast(result._previousDataValues)
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

        return `Bulk import of observationUnit records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let updated = await observationUnit.update({
            germplasmDbId: germplasmDbId
        }, {
            where: {
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * add_locationDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_locationDbId(observationUnitDbId, locationDbId) {
        let updated = await observationUnit.update({
            locationDbId: locationDbId
        }, {
            where: {
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * add_programDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_programDbId(observationUnitDbId, programDbId) {
        let updated = await observationUnit.update({
            programDbId: programDbId
        }, {
            where: {
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbId(observationUnitDbId, studyDbId) {
        let updated = await observationUnit.update({
            studyDbId: studyDbId
        }, {
            where: {
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * add_trialDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_trialDbId(observationUnitDbId, trialDbId) {
        let updated = await observationUnit.update({
            trialDbId: trialDbId
        }, {
            where: {
                observationUnitDbId: observationUnitDbId
            }
        });
        return updated;
    }
    /**
     * add_eventDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Array}   eventDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_eventDbIds(observationUnitDbId, eventDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            eventDbIds.forEach(idx => {
                promises.push(models.event.add_observationUnitDbIds(idx, [`${observationUnitDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(observationUnitDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.eventDbIds), eventDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                eventDbIds: updated_ids
            });
        }
    }

    /**
     * remove_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_germplasmDbId(observationUnitDbId, germplasmDbId) {
        let updated = await observationUnit.update({
            germplasmDbId: null
        }, {
            where: {
                observationUnitDbId: observationUnitDbId,
                germplasmDbId: germplasmDbId
            }
        });
        return updated;
    }
    /**
     * remove_locationDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_locationDbId(observationUnitDbId, locationDbId) {
        let updated = await observationUnit.update({
            locationDbId: null
        }, {
            where: {
                observationUnitDbId: observationUnitDbId,
                locationDbId: locationDbId
            }
        });
        return updated;
    }
    /**
     * remove_programDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_programDbId(observationUnitDbId, programDbId) {
        let updated = await observationUnit.update({
            programDbId: null
        }, {
            where: {
                observationUnitDbId: observationUnitDbId,
                programDbId: programDbId
            }
        });
        return updated;
    }
    /**
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbId(observationUnitDbId, studyDbId) {
        let updated = await observationUnit.update({
            studyDbId: null
        }, {
            where: {
                observationUnitDbId: observationUnitDbId,
                studyDbId: studyDbId
            }
        });
        return updated;
    }
    /**
     * remove_trialDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_trialDbId(observationUnitDbId, trialDbId) {
        let updated = await observationUnit.update({
            trialDbId: null
        }, {
            where: {
                observationUnitDbId: observationUnitDbId,
                trialDbId: trialDbId
            }
        });
        return updated;
    }
    /**
     * remove_eventDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Array}   eventDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_eventDbIds(observationUnitDbId, eventDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            eventDbIds.forEach(idx => {
                promises.push(models.event.remove_observationUnitDbIds(idx, [`${observationUnitDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(observationUnitDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.eventDbIds), eventDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                eventDbIds: updated_ids
            });
        }
    }





    /**
     * bulkAssociateObservationUnitWithGermplasmDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: germplasmDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationUnitWithLocationDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                locationDbId: locationDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationUnitWithProgramDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithProgramDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "programDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            programDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                programDbId: programDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationUnitWithStudyDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                studyDbId: studyDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationUnitWithTrialDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                trialDbId: trialDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationUnitWithGermplasmDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    germplasmDbId: germplasmDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationUnitWithLocationDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                locationDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    locationDbId: locationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationUnitWithProgramDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithProgramDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "programDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            programDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                programDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    programDbId: programDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationUnitWithStudyDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                studyDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    studyDbId: studyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationUnitWithTrialDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                trialDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    trialDbId: trialDbId
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
        return observationUnit.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observationUnit.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationUnit.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observationUnit.idAttribute()]
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
        let attributes = Object.keys(observationUnit.definition.attributes);
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