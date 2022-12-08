'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const searchArg = require('../../utils/search-argument');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
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
    "model": "data_file",
    "storageType": "sql",
    "attributes": {
        "id": "String",
        "url": "String",
        "description": "String",
        "version": "String",
        "study_id": "String",
        "observation_unit_ids": "[String]",
        "observed_variable_ids": "[String]",
        "sample_ids": "[String]"
    },
    "associations": {
        "study": {
            "type": "many_to_one",
            "reverseAssociation": "data_files",
            "implementation": "foreignkeys",
            "target": "study",
            "targetStorageType": "sql",
            "targetKey": "study_id",
            "keysIn": "data_file"
        },
        "observation_units": {
            "type": "many_to_many",
            "reverseAssociation": "data_files",
            "implementation": "foreignkeys",
            "target": "observation_unit",
            "targetStorageType": "sql",
            "targetKey": "data_file_ids",
            "sourceKey": "observation_unit_ids",
            "keysIn": "data_file"
        },
        "observed_variables": {
            "type": "many_to_many",
            "reverseAssociation": "data_files",
            "implementation": "foreignkeys",
            "target": "observed_variable",
            "targetStorageType": "sql",
            "targetKey": "data_file_ids",
            "sourceKey": "observed_variable_ids",
            "keysIn": "data_file"
        },
        "samples": {
            "type": "many_to_many",
            "reverseAssociation": "data_files",
            "implementation": "foreignkeys",
            "target": "sample",
            "targetStorageType": "sql",
            "targetKey": "data_file_ids",
            "sourceKey": "sample_ids",
            "keysIn": "data_file"
        }
    },
    "internalId": "id",
    "id": {
        "name": "id",
        "type": "String"
    }
};
const DataLoader = require("dataloader");

/**
 * module - Creates a sequelize model
 */

module.exports = class data_file extends Sequelize.Model {
    /**
     * Initialize sequelize model.
     * @param  {object} sequelize Sequelize instance.
     * @param  {object} DataTypes Allowed sequelize data types.
     * @return {object}           Sequelize model with associations defined
     */
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

    /**
     * Associate models.
     * @param  {object} models  Indexed models.
     */
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

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type data_file, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await data_file.readByIdLoader.load(id);
    }
    /**
     * countRecords - The model implementation for counting the number of records, possibly restricted by a search term
     *
     * This method is the implementation for counting the number of records that fulfill a given condition, or for all records in the table.
     * @param {object} search - The search term that restricts the set of records to be counted - if undefined, all records in the table
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @return {number} The number of records that fulfill the condition, or of all records in the table
     */
    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, data_file.definition.attributes);
        return super.count(options);
    }

    /**
     * readAll - The model implementation for searching for records in MongoDB. This method uses limit-offset-based pagination.
     *
     * @param  {object} search - Search argument for filtering records
     * @param  {array} order - Type of sorting (ASC, DESC) for each field
     * @param  {object} pagination - Offset and limit to get the records from and to respectively
     * @param  {BenignErrorReporter} - benignErrorReporter can be used to generate the standard
     * @return {array}  Array of records holding conditions specified by search, order and pagination argument
     */
    static async readAll(search, order, pagination, benignErrorReporter) {
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), data_file.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => data_file.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    /**
     * readAllCursor - The model implementation for searching for records. This method uses cursor based pagination.
     *
     * @param {object} search - The search condition for which records shall be fetched
     * @param  {array} order - Type of sorting (ASC, DESC) for each field
     * @param {object} pagination - The parameters for pagination, which can be used to get a subset of the requested record set.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @return {object} The set of records, possibly constrained by pagination, with full cursor information for all records
     */
    static async readAllCursor(search, order, pagination, benignErrorReporter) {
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

    /**
     * addOne - The model implementation method for adding a record.
     *
     * @param {object} input - The input object.
     * @return {object} The created record 
     * @throw {Error} If the process fails, an error is thrown
     */
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

    /**
     * deleteOne - The model implementation for deleting a single record, given by its ID.
     *
     * @param {string} id - The ID of the record to be deleted
     * @returns {string} A success message is returned
     * @throw {Error} If the record could not be deleted - this means a record with the ID is still present
     */
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

    /**
     * updateOne - The model implementation for updating a single record.
     *
     * @param {object} input - The input object.
     * @returns {object} The updated record
     * @throw {Error} If this method fails, an error is thrown
     */
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
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_study_id(id, study_id, benignErrorReporter) {
        try {
            let updated = await data_file.update({
                study_id: study_id
            }, {
                where: {
                    id: id
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.push({
                message: error
            });
        }
    }
    /**
     * add_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observation_unit_ids.forEach(idx => {
                promises.push(models.observation_unit.add_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_observed_variable_ids(id, observed_variable_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observed_variable_ids.forEach(idx => {
                promises.push(models.observed_variable.add_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_sample_ids(id, sample_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            sample_ids.forEach(idx => {
                promises.push(models.sample.add_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_study_id(id, study_id, benignErrorReporter) {
        try {
            let updated = await data_file.update({
                study_id: null
            }, {
                where: {
                    id: id,
                    study_id: study_id
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.push({
                message: error
            });
        }
    }
    /**
     * remove_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observation_unit_ids.forEach(idx => {
                promises.push(models.observation_unit.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_observed_variable_ids(id, observed_variable_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            observed_variable_ids.forEach(idx => {
                promises.push(models.observed_variable.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_sample_ids(id, sample_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            sample_ids.forEach(idx => {
                promises.push(models.sample.remove_data_file_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
        return this[data_file.idAttribute()];
    }

    /**
     * definition - Getter for the attribute 'definition'
     * @return {string} the definition string
     */
    static get definition() {
        return definition;
    }

    /**
     * base64Decode - Decode a base 64 String to UTF-8.
     * @param {string} cursor - The cursor to be decoded into the record, given in base 64
     * @return {string} The stringified object in UTF-8 format
     */
    static base64Decode(cursor) {
        return Buffer.from(cursor, "base64").toString("utf-8");
    }

    /**
     * base64Encode - Encode  data_file to a base 64 String
     *
     * @return {string} The data_file object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The data_file object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of data_file.
     *
     * @return {object} The attributes of data_file in object form
     */
    stripAssociations() {
        let attributes = Object.keys(data_file.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of data_file that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of data_file that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of data_file.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}