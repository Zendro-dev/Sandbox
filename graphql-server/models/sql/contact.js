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
        contact_id: 'String',
        name: 'String',
        email: 'String',
        phone: 'String',
        address: 'String',
        affiliation: 'String',
        study_ids: '[String]',
        investigation_ids: '[String]',
        fileAttachment_ids: '[String]',
        ontologyAnnotation_ids: '[String]'
    },
    associations: {
        studies: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'study',
            targetKey: 'contact_ids',
            sourceKey: 'study_ids',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            label: 'name'
        },
        investigations: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'investigation',
            targetKey: 'contact_ids',
            sourceKey: 'investigation_ids',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            label: 'title'
        },
        fileAttachments: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'fileAttachment',
            targetKey: 'contact_ids',
            sourceKey: 'fileAttachment_ids',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            label: 'fileName'
        },
        ontologyAnnotations: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'ontologyAnnotation',
            targetKey: 'contact_ids',
            sourceKey: 'ontologyAnnotation_ids',
            keyIn: 'contact',
            reverseAssociationType: 'to_many',
            label: 'ontology'
        }
    },
    internalId: 'contact_id',
    id: {
        name: 'contact_id',
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

            contact_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            },
            email: {
                type: Sequelize[dict['String']]
            },
            phone: {
                type: Sequelize[dict['String']]
            },
            address: {
                type: Sequelize[dict['String']]
            },
            affiliation: {
                type: Sequelize[dict['String']]
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            investigation_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            fileAttachment_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            ontologyAnnotation_ids: {
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

    static associate(models) {}

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
     * add_study_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_ids(contact_id, study_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.add_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }
    /**
     * add_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_investigation_ids(contact_id, investigation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            investigation_ids.forEach(idx => {
                promises.push(models.investigation.add_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.investigation_ids), investigation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                investigation_ids: updated_ids
            });
        }
    }
    /**
     * add_fileAttachment_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   fileAttachment_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_fileAttachment_ids(contact_id, fileAttachment_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            fileAttachment_ids.forEach(idx => {
                promises.push(models.fileAttachment.add_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.fileAttachment_ids), fileAttachment_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                fileAttachment_ids: updated_ids
            });
        }
    }
    /**
     * add_ontologyAnnotation_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   ontologyAnnotation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_ontologyAnnotation_ids(contact_id, ontologyAnnotation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            ontologyAnnotation_ids.forEach(idx => {
                promises.push(models.ontologyAnnotation.add_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.ontologyAnnotation_ids), ontologyAnnotation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                ontologyAnnotation_ids: updated_ids
            });
        }
    }

    /**
     * remove_study_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_ids(contact_id, study_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.remove_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }
    /**
     * remove_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_investigation_ids(contact_id, investigation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            investigation_ids.forEach(idx => {
                promises.push(models.investigation.remove_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.investigation_ids), investigation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                investigation_ids: updated_ids
            });
        }
    }
    /**
     * remove_fileAttachment_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   fileAttachment_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_fileAttachment_ids(contact_id, fileAttachment_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            fileAttachment_ids.forEach(idx => {
                promises.push(models.fileAttachment.remove_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.fileAttachment_ids), fileAttachment_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                fileAttachment_ids: updated_ids
            });
        }
    }
    /**
     * remove_ontologyAnnotation_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   contact_id   IdAttribute of the root model to be updated
     * @param {Array}   ontologyAnnotation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_ontologyAnnotation_ids(contact_id, ontologyAnnotation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            ontologyAnnotation_ids.forEach(idx => {
                promises.push(models.ontologyAnnotation.remove_contact_ids(idx, [`${contact_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(contact_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.ontologyAnnotation_ids), ontologyAnnotation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                ontologyAnnotation_ids: updated_ids
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