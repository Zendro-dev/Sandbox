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
    model: 'study',
    storageType: 'sql',
    attributes: {
        studyDbId: 'String',
        active: 'Boolean',
        commonCropName: 'String',
        culturalPractices: 'String',
        documentationURL: 'String',
        endDate: 'DateTime',
        license: 'String',
        observationUnitsDescription: 'String',
        startDate: 'DateTime',
        studyDescription: 'String',
        studyName: 'String',
        studyType: 'String',
        trialDbId: 'String',
        locationDbId: 'String',
        contactDbIds: '[String]',
        seasonDbIds: '[String]'
    },
    associations: {
        contacts: {
            type: 'to_many',
            target: 'contact',
            targetKey: 'stduyDbIds',
            sourceKey: 'contactDbIds',
            keyIn: 'study',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'name'
        },
        environmentParameters: {
            type: 'to_many',
            target: 'environmentParameter',
            targetKey: 'studyDbId',
            keyIn: 'environmentParameter',
            targetStorageType: 'sql',
            label: 'parameterName',
            sublabel: 'environmentParametersDbId'
        },
        seasons: {
            type: 'to_many',
            target: 'season',
            targetKey: 'studyDbIds',
            sourceKey: 'seasonDbIds',
            keyIn: 'study',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'season'
        },
        location: {
            type: 'to_one',
            target: 'location',
            targetKey: 'locationDbId',
            keyIn: 'study',
            targetStorageType: 'sql',
            label: 'locationName'
        },
        trial: {
            type: 'to_one',
            target: 'trial',
            targetKey: 'trialDbId',
            keyIn: 'study',
            targetStorageType: 'sql',
            label: 'trialName'
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'studyDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'observationUnitName'
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'studyDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationVariableName',
            sublabel: 'value'
        },
        events: {
            type: 'to_many',
            target: 'event',
            targetKey: 'studyDbId',
            keyIn: 'event',
            targetStorageType: 'sql',
            label: 'eventType'
        }
    },
    internalId: 'studyDbId',
    id: {
        name: 'studyDbId',
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

module.exports = class study extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            studyDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            active: {
                type: Sequelize[dict['Boolean']]
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            culturalPractices: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            endDate: {
                type: Sequelize[dict['DateTime']]
            },
            license: {
                type: Sequelize[dict['String']]
            },
            observationUnitsDescription: {
                type: Sequelize[dict['String']]
            },
            startDate: {
                type: Sequelize[dict['DateTime']]
            },
            studyDescription: {
                type: Sequelize[dict['String']]
            },
            studyName: {
                type: Sequelize[dict['String']]
            },
            studyType: {
                type: Sequelize[dict['String']]
            },
            trialDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
                type: Sequelize[dict['String']]
            },
            contactDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            seasonDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "study",
            tableName: "studies",
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
        study.belongsTo(models.location, {
            as: 'location',
            foreignKey: 'locationDbId'
        });
        study.belongsTo(models.trial, {
            as: 'trial',
            foreignKey: 'trialDbId'
        });
        study.hasMany(models.environmentParameter, {
            as: 'environmentParameters',
            foreignKey: 'studyDbId'
        });
        study.hasMany(models.observationUnit, {
            as: 'observationUnits',
            foreignKey: 'studyDbId'
        });
        study.hasMany(models.observation, {
            as: 'observations',
            foreignKey: 'studyDbId'
        });
        study.hasMany(models.event, {
            as: 'events',
            foreignKey: 'studyDbId'
        });
    }

    static async readById(id) {
        let item = await study.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = study.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, study.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), study.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => study.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), study.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => study.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), study.definition.attributes);
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
        input = study.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            study.postReadCast(result.dataValues)
            study.postReadCast(result._previousDataValues)
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
        input = study.preWriteCast(input)
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
            study.postReadCast(result.dataValues)
            study.postReadCast(result._previousDataValues)
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

        return `Bulk import of study records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_locationDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_locationDbId(studyDbId, locationDbId) {
        let updated = await study.update({
            locationDbId: locationDbId
        }, {
            where: {
                studyDbId: studyDbId
            }
        });
        return updated;
    }
    /**
     * add_trialDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_trialDbId(studyDbId, trialDbId) {
        let updated = await study.update({
            trialDbId: trialDbId
        }, {
            where: {
                studyDbId: studyDbId
            }
        });
        return updated;
    }
    /**
     * add_contactDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Array}   contactDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_contactDbIds(studyDbId, contactDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contactDbIds.forEach(idx => {
                promises.push(models.contact.add_stduyDbIds(idx, [`${studyDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(studyDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.contactDbIds), contactDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contactDbIds: updated_ids
            });
        }
    }
    /**
     * add_seasonDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Array}   seasonDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_seasonDbIds(studyDbId, seasonDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            seasonDbIds.forEach(idx => {
                promises.push(models.season.add_studyDbIds(idx, [`${studyDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(studyDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.seasonDbIds), seasonDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                seasonDbIds: updated_ids
            });
        }
    }

    /**
     * remove_locationDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_locationDbId(studyDbId, locationDbId) {
        let updated = await study.update({
            locationDbId: null
        }, {
            where: {
                studyDbId: studyDbId,
                locationDbId: locationDbId
            }
        });
        return updated;
    }
    /**
     * remove_trialDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_trialDbId(studyDbId, trialDbId) {
        let updated = await study.update({
            trialDbId: null
        }, {
            where: {
                studyDbId: studyDbId,
                trialDbId: trialDbId
            }
        });
        return updated;
    }
    /**
     * remove_contactDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Array}   contactDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_contactDbIds(studyDbId, contactDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contactDbIds.forEach(idx => {
                promises.push(models.contact.remove_stduyDbIds(idx, [`${studyDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(studyDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.contactDbIds), contactDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contactDbIds: updated_ids
            });
        }
    }
    /**
     * remove_seasonDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Array}   seasonDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_seasonDbIds(studyDbId, seasonDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            seasonDbIds.forEach(idx => {
                promises.push(models.season.remove_studyDbIds(idx, [`${studyDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(studyDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.seasonDbIds), seasonDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                seasonDbIds: updated_ids
            });
        }
    }





    /**
     * bulkAssociateStudyWithLocationDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateStudyWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "studyDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            studyDbId
        }) => {
            promises.push(super.update({
                locationDbId: locationDbId
            }, {
                where: {
                    studyDbId: studyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateStudyWithTrialDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateStudyWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "studyDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            studyDbId
        }) => {
            promises.push(super.update({
                trialDbId: trialDbId
            }, {
                where: {
                    studyDbId: studyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateStudyWithLocationDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateStudyWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "studyDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            studyDbId
        }) => {
            promises.push(super.update({
                locationDbId: null
            }, {
                where: {
                    studyDbId: studyDbId,
                    locationDbId: locationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateStudyWithTrialDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateStudyWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "studyDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            studyDbId
        }) => {
            promises.push(super.update({
                trialDbId: null
            }, {
                where: {
                    studyDbId: studyDbId,
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
        return study.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return study.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of study.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[study.idAttribute()]
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
        let attributes = Object.keys(study.definition.attributes);
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