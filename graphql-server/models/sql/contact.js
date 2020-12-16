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
    model: 'contact',
    storageType: 'sql',
    attributes: {
        contactDbId: 'String',
        email: 'String',
        instituteName: 'String',
        name: 'String',
        orcid: 'String',
        type: 'String',
        studyDbIds: '[String]',
        trialDbIds: '[String]'
    },
    associations: {
        studies: {
            type: 'to_many',
            target: 'study',
            targetKey: 'contactDbIds',
            sourceKey: 'studyDbIds',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'studyName'
        },
        trials: {
            type: 'to_many',
            target: 'trial',
            targetKey: 'contactDbIds',
            sourceKey: 'trialDbIds',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            targetStorageType: 'sql',
            label: 'trialName'
        },
        programs: {
            type: 'to_many',
            target: 'program',
            targetKey: 'leadPersonDbId',
            keyIn: 'program',
            targetStorageType: 'sql',
            label: 'programName'
        }
    },
    internalId: 'contactDbId',
    id: {
        name: 'contactDbId',
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

module.exports = class contact extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            contactDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            email: {
                type: Sequelize[dict['String']]
            },
            instituteName: {
                type: Sequelize[dict['String']]
            },
            name: {
                type: Sequelize[dict['String']]
            },
            orcid: {
                type: Sequelize[dict['String']]
            },
            type: {
                type: Sequelize[dict['String']]
            },
            studyDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            trialDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "contact",
            tableName: "contacts",
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
        contact.hasMany(models.program, {
            as: 'programs',
            foreignKey: 'leadPersonDbId'
        });
    }

    static async readById(id) {
        let item = await contact.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = contact.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, contact.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), contact.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => contact.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), contact.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => contact.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), contact.definition.attributes);
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
        input = contact.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            contact.postReadCast(result.dataValues)
            contact.postReadCast(result._previousDataValues)
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
        input = contact.preWriteCast(input)
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
            contact.postReadCast(result.dataValues)
            contact.postReadCast(result._previousDataValues)
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

        return `Bulk import of contact records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_studyDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contactDbId   IdAttribute of the root model to be updated
     * @param {Array}   studyDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDbIds(contactDbId, studyDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            studyDbIds.forEach(idx => {
                promises.push(models.study.add_contactDbIds(idx, [`${contactDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contactDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.studyDbIds), studyDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                studyDbIds: updated_ids
            });
        }
    }
    /**
     * add_trialDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contactDbId   IdAttribute of the root model to be updated
     * @param {Array}   trialDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_trialDbIds(contactDbId, trialDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            trialDbIds.forEach(idx => {
                promises.push(models.trial.add_contactDbIds(idx, [`${contactDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contactDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.trialDbIds), trialDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                trialDbIds: updated_ids
            });
        }
    }

    /**
     * remove_studyDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contactDbId   IdAttribute of the root model to be updated
     * @param {Array}   studyDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDbIds(contactDbId, studyDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            studyDbIds.forEach(idx => {
                promises.push(models.study.remove_contactDbIds(idx, [`${contactDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contactDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.studyDbIds), studyDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                studyDbIds: updated_ids
            });
        }
    }
    /**
     * remove_trialDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contactDbId   IdAttribute of the root model to be updated
     * @param {Array}   trialDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_trialDbIds(contactDbId, trialDbIds, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            trialDbIds.forEach(idx => {
                promises.push(models.trial.remove_contactDbIds(idx, [`${contactDbId}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contactDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.trialDbIds), trialDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                trialDbIds: updated_ids
            });
        }
    }








    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return contact.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return contact.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of contact.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[contact.idAttribute()]
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
        let attributes = Object.keys(contact.definition.attributes);
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