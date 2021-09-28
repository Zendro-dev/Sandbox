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
        study_id: 'String',
        name: 'String',
        description: 'String',
        startDate: 'Date',
        endDate: 'Date',
        investigation_id: 'String',
        factor_ids: '[String]',
        protocol_ids: '[String]',
        contact_ids: '[String]',
        material_ids: '[String]',
        ontologyAnnotation_ids: '[String]'
    },
    associations: {
        investigation: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'investigation',
            targetKey: 'investigation_id',
            keysIn: 'study'
        },
        assays: {
            type: 'one_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'study',
            targetStorageType: 'sql',
            target: 'assay',
            targetKey: 'study_id',
            keysIn: 'assay'
        },
        factors: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'factor',
            targetKey: 'study_ids',
            sourceKey: 'factor_ids',
            keysIn: 'study'
        },
        protocols: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'protocol',
            targetKey: 'study_ids',
            sourceKey: 'protocol_ids',
            keysIn: 'study'
        },
        contacts: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'contact',
            targetKey: 'study_ids',
            sourceKey: 'contact_ids',
            keysIn: 'study'
        },
        materials: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'material',
            targetKey: 'study_ids',
            sourceKey: 'material_ids',
            keysIn: 'study'
        },
        ontologyAnnotations: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetStorageType: 'sql',
            target: 'ontologyAnnotation',
            targetKey: 'study_ids',
            sourceKey: 'ontologyAnnotation_ids',
            keysIn: 'study'
        },
        fileAttachments: {
            type: 'one_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'study',
            targetStorageType: 'sql',
            target: 'fileAttachment',
            targetKey: 'study_id',
            keysIn: 'fileAttachment'
        }
    },
    internalId: 'study_id',
    id: {
        name: 'study_id',
        type: 'String'
    }
};
const DataLoader = require("dataloader");

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

            study_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            startDate: {
                type: Sequelize[dict['Date']]
            },
            endDate: {
                type: Sequelize[dict['Date']]
            },
            investigation_id: {
                type: Sequelize[dict['String']]
            },
            factor_ids: {
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
            },
            material_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            ontologyAnnotation_ids: {
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
        study.belongsTo(models.investigation, {
            as: 'investigation',
            foreignKey: 'investigation_id'
        });
        study.hasMany(models.assay, {
            as: 'assays',
            foreignKey: 'study_id'
        });
        study.hasMany(models.fileAttachment, {
            as: 'fileAttachments',
            foreignKey: 'study_id'
        });
    }

    /**
     * Batch function for readById method.
     * @param  {array} keys  keys from readById method
     * @return {array}       searched results
     */
    static async batchReadById(keys) {
        let queryArg = {
            operator: "in",
            field: study.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await study.readAllCursor(queryArg);
        cursorRes = cursorRes.studies.reduce(
            (map, obj) => ((map[obj[study.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(study.batchReadById, {
        cache: false,
    });

    static async readById(id) {
        return await study.readByIdLoader.load(id);
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
            pageInfo,
            studies: edges.map((edge) => edge.node)
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
     * add_investigation_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_investigation_id(study_id, investigation_id) {
        let updated = await study.update({
            investigation_id: investigation_id
        }, {
            where: {
                study_id: study_id
            }
        });
        return updated;
    }
    /**
     * add_factor_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_factor_ids(study_id, factor_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.add_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
            });
        }
    }
    /**
     * add_protocol_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   protocol_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_protocol_ids(study_id, protocol_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocol_ids.forEach(idx => {
                promises.push(models.protocol.add_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
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
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   contact_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_contact_ids(study_id, contact_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contact_ids.forEach(idx => {
                promises.push(models.contact.add_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.contact_ids), contact_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contact_ids: updated_ids
            });
        }
    }
    /**
     * add_material_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_material_ids(study_id, material_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            material_ids.forEach(idx => {
                promises.push(models.material.add_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.material_ids), material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                material_ids: updated_ids
            });
        }
    }
    /**
     * add_ontologyAnnotation_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   ontologyAnnotation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_ontologyAnnotation_ids(study_id, ontologyAnnotation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            ontologyAnnotation_ids.forEach(idx => {
                promises.push(models.ontologyAnnotation.add_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.ontologyAnnotation_ids), ontologyAnnotation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                ontologyAnnotation_ids: updated_ids
            });
        }
    }

    /**
     * remove_investigation_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_investigation_id(study_id, investigation_id) {
        let updated = await study.update({
            investigation_id: null
        }, {
            where: {
                study_id: study_id,
                investigation_id: investigation_id
            }
        });
        return updated;
    }
    /**
     * remove_factor_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_factor_ids(study_id, factor_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.remove_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
            });
        }
    }
    /**
     * remove_protocol_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   protocol_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_protocol_ids(study_id, protocol_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocol_ids.forEach(idx => {
                promises.push(models.protocol.remove_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
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
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   contact_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_contact_ids(study_id, contact_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            contact_ids.forEach(idx => {
                promises.push(models.contact.remove_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.contact_ids), contact_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                contact_ids: updated_ids
            });
        }
    }
    /**
     * remove_material_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_material_ids(study_id, material_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            material_ids.forEach(idx => {
                promises.push(models.material.remove_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.material_ids), material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                material_ids: updated_ids
            });
        }
    }
    /**
     * remove_ontologyAnnotation_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   study_id   IdAttribute of the root model to be updated
     * @param {Array}   ontologyAnnotation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_ontologyAnnotation_ids(study_id, ontologyAnnotation_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            ontologyAnnotation_ids.forEach(idx => {
                promises.push(models.ontologyAnnotation.remove_study_ids(idx, [`${study_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(study_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.ontologyAnnotation_ids), ontologyAnnotation_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                ontologyAnnotation_ids: updated_ids
            });
        }
    }





    /**
     * bulkAssociateStudyWithInvestigation_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateStudyWithInvestigation_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "study_id", "investigation_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_id,
            study_id
        }) => {
            promises.push(super.update({
                investigation_id: investigation_id
            }, {
                where: {
                    study_id: study_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateStudyWithInvestigation_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "study_id", "investigation_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_id,
            study_id
        }) => {
            promises.push(super.update({
                investigation_id: null
            }, {
                where: {
                    study_id: study_id,
                    investigation_id: investigation_id
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