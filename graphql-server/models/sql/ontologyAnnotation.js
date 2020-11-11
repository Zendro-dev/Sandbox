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
    model: 'ontologyAnnotation',
    storageType: 'sql',
    attributes: {
        ontologyAnnotation_id: 'String',
        ontology: 'String',
        ontologyURL: 'String',
        term: 'String',
        termURL: 'String',
        investigation_ids: '[String]',
        study_ids: '[String]',
        assay_ids: '[String]',
        assayResult_ids: '[String]',
        factor_ids: '[String]',
        material_ids: '[String]',
        protocol_ids: '[String]',
        contact_ids: '[String]'
    },
    associations: {
        investigations: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'investigation',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'investigation_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'title'
        },
        studies: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'study',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'study_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'name'
        },
        assays: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'assay',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'assay_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'measurement'
        },
        assayResults: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'assayResult',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'assayResult_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'value_as_str'
        },
        factors: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'factor',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'factor_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'name'
        },
        materials: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'material',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'material_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'name'
        },
        protocols: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'protocol',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'protocol_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'name'
        },
        contacts: {
            type: 'to_many',
            targetStorageType: 'sql',
            target: 'contact',
            targetKey: 'ontologyAnnotation_ids',
            sourceKey: 'contact_ids',
            keyIn: 'ontologyAnnotation',
            reverseAssociationType: 'to_many',
            label: 'name'
        }
    },
    internalId: 'ontologyAnnotation_id',
    id: {
        name: 'ontologyAnnotation_id',
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

module.exports = class ontologyAnnotation extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            ontologyAnnotation_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            ontology: {
                type: Sequelize[dict['String']]
            },
            ontologyURL: {
                type: Sequelize[dict['String']]
            },
            term: {
                type: Sequelize[dict['String']]
            },
            termURL: {
                type: Sequelize[dict['String']]
            },
            investigation_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            assay_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            assayResult_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            factor_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            material_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            protocol_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            contact_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "ontologyAnnotation",
            tableName: "ontologyAnnotations",
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
        let item = await ontologyAnnotation.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = ontologyAnnotation.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, ontologyAnnotation.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), ontologyAnnotation.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => ontologyAnnotation.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), ontologyAnnotation.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => ontologyAnnotation.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), ontologyAnnotation.definition.attributes);
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
        input = ontologyAnnotation.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            ontologyAnnotation.postReadCast(result.dataValues)
            ontologyAnnotation.postReadCast(result._previousDataValues)
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
        input = ontologyAnnotation.preWriteCast(input)
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
            ontologyAnnotation.postReadCast(result.dataValues)
            ontologyAnnotation.postReadCast(result._previousDataValues)
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

        return `Bulk import of ontologyAnnotation records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_investigation_ids(ontologyAnnotation_id, investigation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            investigation_ids.forEach(idx => {
                promises.push(models.investigation.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.investigation_ids), investigation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                investigation_ids: updated_ids
            });
        }
    }
    /**
     * add_study_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_ids(ontologyAnnotation_id, study_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }
    /**
     * add_assay_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   assay_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_assay_ids(ontologyAnnotation_id, assay_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_ids.forEach(idx => {
                promises.push(models.assay.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.assay_ids), assay_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_ids: updated_ids
            });
        }
    }
    /**
     * add_assayResult_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   assayResult_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_assayResult_ids(ontologyAnnotation_id, assayResult_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assayResult_ids.forEach(idx => {
                promises.push(models.assayResult.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.assayResult_ids), assayResult_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assayResult_ids: updated_ids
            });
        }
    }
    /**
     * add_factor_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_factor_ids(ontologyAnnotation_id, factor_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
            });
        }
    }
    /**
     * add_material_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_material_ids(ontologyAnnotation_id, material_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            material_ids.forEach(idx => {
                promises.push(models.material.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.material_ids), material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                material_ids: updated_ids
            });
        }
    }
    /**
     * add_protocol_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   protocol_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_protocol_ids(ontologyAnnotation_id, protocol_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocol_ids.forEach(idx => {
                promises.push(models.protocol.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.protocol_ids), protocol_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                protocol_ids: updated_ids
            });
        }
    }
    /**
     * add_contact_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   contact_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_contact_ids(ontologyAnnotation_id, contact_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contact_ids.forEach(idx => {
                promises.push(models.contact.add_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.contact_ids), contact_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contact_ids: updated_ids
            });
        }
    }

    /**
     * remove_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_investigation_ids(ontologyAnnotation_id, investigation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            investigation_ids.forEach(idx => {
                promises.push(models.investigation.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.investigation_ids), investigation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                investigation_ids: updated_ids
            });
        }
    }
    /**
     * remove_study_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_ids(ontologyAnnotation_id, study_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }
    /**
     * remove_assay_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   assay_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_assay_ids(ontologyAnnotation_id, assay_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_ids.forEach(idx => {
                promises.push(models.assay.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.assay_ids), assay_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_ids: updated_ids
            });
        }
    }
    /**
     * remove_assayResult_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   assayResult_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_assayResult_ids(ontologyAnnotation_id, assayResult_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assayResult_ids.forEach(idx => {
                promises.push(models.assayResult.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.assayResult_ids), assayResult_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assayResult_ids: updated_ids
            });
        }
    }
    /**
     * remove_factor_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_factor_ids(ontologyAnnotation_id, factor_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
            });
        }
    }
    /**
     * remove_material_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_material_ids(ontologyAnnotation_id, material_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            material_ids.forEach(idx => {
                promises.push(models.material.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.material_ids), material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                material_ids: updated_ids
            });
        }
    }
    /**
     * remove_protocol_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   protocol_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_protocol_ids(ontologyAnnotation_id, protocol_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocol_ids.forEach(idx => {
                promises.push(models.protocol.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.protocol_ids), protocol_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                protocol_ids: updated_ids
            });
        }
    }
    /**
     * remove_contact_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   ontologyAnnotation_id   IdAttribute of the root model to be updated
     * @param {Array}   contact_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_contact_ids(ontologyAnnotation_id, contact_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contact_ids.forEach(idx => {
                promises.push(models.contact.remove_ontologyAnnotation_ids(idx, [`${ontologyAnnotation_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(ontologyAnnotation_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.contact_ids), contact_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contact_ids: updated_ids
            });
        }
    }








    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return ontologyAnnotation.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return ontologyAnnotation.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of ontologyAnnotation.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[ontologyAnnotation.idAttribute()]
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
        let attributes = Object.keys(ontologyAnnotation.definition.attributes);
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