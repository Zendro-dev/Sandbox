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
    model: 'data_file',
    storageType: 'sql',
    attributes: {
        id: 'String',
        url: 'String',
        description: 'String',
        version: 'String',
        study_id: 'String',
        observation_unit_ids: '[String]',
        observed_variable_ids: '[String]',
        sample_ids: '[String]'
    },
    associations: {
        study: {
            type: 'many_to_one',
            reverseAssociation: 'data_files',
            implementation: 'foreignkeys',
            target: 'study',
            targetStorageType: 'sql',
            targetKey: 'study_id',
            keysIn: 'data_file'
        },
        observation_units: {
            type: 'many_to_many',
            reverseAssociation: 'data_files',
            implementation: 'foreignkeys',
            target: 'observation_unit',
            targetStorageType: 'sql',
            targetKey: 'data_file_ids',
            sourceKey: 'observation_unit_ids',
            keysIn: 'data_file'
        },
        observed_variables: {
            type: 'many_to_many',
            reverseAssociation: 'data_files',
            implementation: 'foreignkeys',
            target: 'observed_variable',
            targetStorageType: 'sql',
            targetKey: 'data_file_ids',
            sourceKey: 'observed_variable_ids',
            keysIn: 'data_file'
        },
        samples: {
            type: 'many_to_many',
            reverseAssociation: 'data_files',
            implementation: 'foreignkeys',
            target: 'sample',
            targetStorageType: 'sql',
            targetKey: 'data_file_ids',
            sourceKey: 'sample_ids',
            keysIn: 'data_file'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
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

module.exports = class data_file extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            url: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            version: {
                type: Sequelize[dict['String']]
            },
            study_id: {
                type: Sequelize[dict['String']]
            },
            observation_unit_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            observed_variable_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            sample_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "data_file",
            tableName: "data_files",
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
        data_file.belongsTo(models.study, {
            as: 'study',
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
            field: data_file.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await data_file.readAllCursor(queryArg);
        cursorRes = cursorRes.data_files.reduce(
            (map, obj) => ((map[obj[data_file.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(data_file.batchReadById, {
        cache: false,
    });

    static async readById(id) {
        return await data_file.readByIdLoader.load(id);
    }
    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, data_file.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), data_file.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => data_file.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), data_file.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => data_file.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), data_file.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            data_files: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = data_file.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            data_file.postReadCast(result.dataValues)
            data_file.postReadCast(result._previousDataValues)
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
        input = data_file.preWriteCast(input)
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
            data_file.postReadCast(result.dataValues)
            data_file.postReadCast(result._previousDataValues)
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

        return `Bulk import of data_file records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_study_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_id(id, study_id) {
        let updated = await data_file.update({
            study_id: study_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observation_unit_ids.forEach(idx => {
                promises.push(models.observation_unit.add_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.observation_unit_ids), observation_unit_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observation_unit_ids: updated_ids
            });
        }
    }
    /**
     * add_observed_variable_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observed_variable_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_observed_variable_ids(id, observed_variable_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observed_variable_ids.forEach(idx => {
                promises.push(models.observed_variable.add_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.observed_variable_ids), observed_variable_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observed_variable_ids: updated_ids
            });
        }
    }
    /**
     * add_sample_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   sample_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_sample_ids(id, sample_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            sample_ids.forEach(idx => {
                promises.push(models.sample.add_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.sample_ids), sample_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                sample_ids: updated_ids
            });
        }
    }

    /**
     * remove_study_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_id(id, study_id) {
        let updated = await data_file.update({
            study_id: null
        }, {
            where: {
                id: id,
                study_id: study_id
            }
        });
        return updated;
    }
    /**
     * remove_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observation_unit_ids.forEach(idx => {
                promises.push(models.observation_unit.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.observation_unit_ids), observation_unit_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observation_unit_ids: updated_ids
            });
        }
    }
    /**
     * remove_observed_variable_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observed_variable_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_observed_variable_ids(id, observed_variable_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observed_variable_ids.forEach(idx => {
                promises.push(models.observed_variable.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.observed_variable_ids), observed_variable_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                observed_variable_ids: updated_ids
            });
        }
    }
    /**
     * remove_sample_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   sample_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_sample_ids(id, sample_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            sample_ids.forEach(idx => {
                promises.push(models.sample.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.sample_ids), sample_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                sample_ids: updated_ids
            });
        }
    }





    /**
     * bulkAssociateData_fileWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateData_fileWithStudy_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_id,
            id
        }) => {
            promises.push(super.update({
                study_id: study_id
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
     * bulkDisAssociateData_fileWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateData_fileWithStudy_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_id,
            id
        }) => {
            promises.push(super.update({
                study_id: null
            }, {
                where: {
                    id: id,
                    study_id: study_id
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
        return data_file.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return data_file.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of data_file.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[data_file.idAttribute()]
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
        let attributes = Object.keys(data_file.definition.attributes);
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