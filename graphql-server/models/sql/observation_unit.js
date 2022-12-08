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
    "model": "observation_unit",
    "storageType": "sql",
    "attributes": {
        "id": "String",
        "type": "String",
        "external_id": "String",
        "spatial_distribution": "String",
        "study_id": "String",
        "biological_material_ids": "[String]",
        "data_file_ids": "[Int]",
        "event_ids": "[Int]",
        "factor_ids": "[Int]"
    },
    "associations": {
        "study": {
            "type": "many_to_one",
            "reverseAssociation": "observation_units",
            "implementation": "foreignkeys",
            "target": "study",
            "targetStorageType": "sql",
            "targetKey": "study_id",
            "keysIn": "observation_unit"
        },
        "biological_materials": {
            "type": "many_to_many",
            "reverseAssociation": "observation_units",
            "implementation": "foreignkeys",
            "target": "biological_material",
            "targetStorageType": "sql",
            "targetKey": "observation_unit_ids",
            "sourceKey": "biological_material_ids",
            "keysIn": "observation_unit"
        },
        "data_files": {
            "type": "many_to_many",
            "reverseAssociation": "observation_units",
            "implementation": "foreignkeys",
            "target": "data_file",
            "targetStorageType": "sql",
            "targetKey": "observation_unit_ids",
            "sourceKey": "data_file_ids",
            "keysIn": "observation_unit"
        },
        "events": {
            "type": "many_to_many",
            "reverseAssociation": "observation_units",
            "implementation": "foreignkeys",
            "target": "event",
            "targetStorageType": "sql",
            "targetKey": "observation_unit_ids",
            "sourceKey": "event_ids",
            "keysIn": "observation_unit"
        },
        "factors": {
            "type": "many_to_many",
            "reverseAssociation": "observation_units",
            "implementation": "foreignkeys",
            "target": "factor",
            "targetStorageType": "sql",
            "targetKey": "observation_unit_ids",
            "sourceKey": "factor_ids",
            "keysIn": "observation_unit"
        },
        "samples": {
            "type": "one_to_many",
            "reverseAssociation": "observation_unit",
            "implementation": "foreignkeys",
            "target": "sample",
            "targetStorageType": "sql",
            "targetKey": "observation_unit_id",
            "keysIn": "sample"
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

module.exports = class observation_unit extends Sequelize.Model {
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
            type: {
                type: Sequelize[dict['String']]
            },
            external_id: {
                type: Sequelize[dict['String']]
            },
            spatial_distribution: {
                type: Sequelize[dict['String']]
            },
            study_id: {
                type: Sequelize[dict['String']]
            },
            biological_material_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            data_file_ids: {
                type: Sequelize[dict['[Int]']],
                defaultValue: '[]'
            },
            event_ids: {
                type: Sequelize[dict['[Int]']],
                defaultValue: '[]'
            },
            factor_ids: {
                type: Sequelize[dict['[Int]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "observation_unit",
            tableName: "observation_units",
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
        observation_unit.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'study_id'
        });
        observation_unit.hasMany(models.sample, {
            as: 'samples',
            foreignKey: 'observation_unit_id'
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
            field: observation_unit.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await observation_unit.readAllCursor(queryArg);
        cursorRes = cursorRes.observation_units.reduce(
            (map, obj) => ((map[obj[observation_unit.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(observation_unit.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type observation_unit, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await observation_unit.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, observation_unit.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), observation_unit.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observation_unit.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observation_unit.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => observation_unit.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observation_unit.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            observation_units: edges.map((edge) => edge.node)
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
        input = observation_unit.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observation_unit.postReadCast(result.dataValues)
            observation_unit.postReadCast(result._previousDataValues)
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
        input = observation_unit.preWriteCast(input)
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
            observation_unit.postReadCast(result.dataValues)
            observation_unit.postReadCast(result._previousDataValues)
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
            let updated = await observation_unit.update({
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
     * add_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_biological_material_ids(id, biological_material_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            biological_material_ids.forEach(idx => {
                promises.push(models.biological_material.add_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.biological_material_ids), biological_material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                biological_material_ids: updated_ids
            });
        }
    }
    /**
     * add_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_data_file_ids(id, data_file_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            data_file_ids.forEach(idx => {
                promises.push(models.data_file.add_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.data_file_ids), data_file_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                data_file_ids: updated_ids
            });
        }
    }
    /**
     * add_event_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   event_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_event_ids(id, event_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            event_ids.forEach(idx => {
                promises.push(models.event.add_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.event_ids), event_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                event_ids: updated_ids
            });
        }
    }
    /**
     * add_factor_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_factor_ids(id, factor_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.add_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
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
            let updated = await observation_unit.update({
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
     * remove_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_biological_material_ids(id, biological_material_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            biological_material_ids.forEach(idx => {
                promises.push(models.biological_material.remove_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.biological_material_ids), biological_material_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                biological_material_ids: updated_ids
            });
        }
    }
    /**
     * remove_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_data_file_ids(id, data_file_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            data_file_ids.forEach(idx => {
                promises.push(models.data_file.remove_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.data_file_ids), data_file_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                data_file_ids: updated_ids
            });
        }
    }
    /**
     * remove_event_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   event_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_event_ids(id, event_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            event_ids.forEach(idx => {
                promises.push(models.event.remove_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.event_ids), event_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                event_ids: updated_ids
            });
        }
    }
    /**
     * remove_factor_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_factor_ids(id, factor_ids, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factor_ids.forEach(idx => {
                promises.push(models.factor.remove_observation_unit_ids(idx, [`${id}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.factor_ids), factor_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factor_ids: updated_ids
            });
        }
    }





    /**
     * bulkAssociateObservation_unitWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput) {
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
     * bulkDisAssociateObservation_unitWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput) {
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
        return observation_unit.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observation_unit.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observation_unit.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observation_unit.idAttribute()];
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
     * base64Encode - Encode  observation_unit to a base 64 String
     *
     * @return {string} The observation_unit object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The observation_unit object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of observation_unit.
     *
     * @return {object} The attributes of observation_unit in object form
     */
    stripAssociations() {
        let attributes = Object.keys(observation_unit.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of observation_unit that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of observation_unit that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of observation_unit.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}