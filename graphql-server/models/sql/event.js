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
    model: 'event',
    storageType: 'sql',
    attributes: {
        eventDbId: 'String',
        eventDescription: 'String',
        eventType: 'String',
        date: 'DateTime',
        observationUnitDbIds: '[String]',
        studyDbId: 'String'
    },
    associations: {
        eventParameters: {
            type: 'to_many',
            target: 'eventParameter',
            targetKey: 'eventDbId',
            keyIn: 'eventParameter',
            targetStorageType: 'sql',
            label: 'key'
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'eventDbIds',
            sourceKey: 'observationUnitDbIds',
            keyIn: 'event',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'observationUnitName'
        },
        study: {
            type: 'to_one',
            target: 'study',
            targetKey: 'studyDbId',
            keyIn: 'event',
            targetStorageType: 'sql',
            label: 'studyName',
            sublabel: 'studyDbId'
        }
    },
    internalId: 'eventType',
    id: {
        name: 'eventType',
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

module.exports = class event extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            eventType: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            eventDbId: {
                type: Sequelize[dict['String']]
            },
            eventDescription: {
                type: Sequelize[dict['String']]
            },
            date: {
                type: Sequelize[dict['DateTime']]
            },
            observationUnitDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "event",
            tableName: "events",
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
        event.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'studyDbId'
        });
        event.hasMany(models.eventParameter, {
            as: 'eventParameters',
            foreignKey: 'eventDbId'
        });
    }

    static async readById(id) {
        let item = await event.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = event.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, event.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), event.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => event.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), event.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => event.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), event.definition.attributes);
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
        input = event.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            event.postReadCast(result.dataValues)
            event.postReadCast(result._previousDataValues)
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
        input = event.preWriteCast(input)
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
            event.postReadCast(result.dataValues)
            event.postReadCast(result._previousDataValues)
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

        return `Bulk import of event records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   eventType   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbId(eventType, studyDbId) {
        let updated = await event.update({
            studyDbId: studyDbId
        }, {
            where: {
                eventType: eventType
            }
        });
        return updated;
    }
    /**
     * add_observationUnitDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   eventType   IdAttribute of the root model to be updated
     * @param {Array}   observationUnitDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observationUnitDbIds(eventType, observationUnitDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observationUnitDbIds.forEach(idx => {
                promises.push(models.observationUnit.add_eventDbIds(idx, [`${eventType}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(eventType);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.observationUnitDbIds), observationUnitDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observationUnitDbIds: updated_ids
            });
        }
    }

    /**
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   eventType   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbId(eventType, studyDbId) {
        let updated = await event.update({
            studyDbId: null
        }, {
            where: {
                eventType: eventType,
                studyDbId: studyDbId
            }
        });
        return updated;
    }
    /**
     * remove_observationUnitDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   eventType   IdAttribute of the root model to be updated
     * @param {Array}   observationUnitDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observationUnitDbIds(eventType, observationUnitDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observationUnitDbIds.forEach(idx => {
                promises.push(models.observationUnit.remove_eventDbIds(idx, [`${eventType}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(eventType);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.observationUnitDbIds), observationUnitDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observationUnitDbIds: updated_ids
            });
        }
    }





    /**
     * bulkAssociateEventWithStudyDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateEventWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "eventType", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            eventType
        }) => {
            promises.push(super.update({
                studyDbId: studyDbId
            }, {
                where: {
                    eventType: eventType
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateEventWithStudyDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateEventWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "eventType", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            eventType
        }) => {
            promises.push(super.update({
                studyDbId: null
            }, {
                where: {
                    eventType: eventType,
                    studyDbId: studyDbId
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
        return event.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return event.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of event.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[event.idAttribute()]
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
        let attributes = Object.keys(event.definition.attributes);
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