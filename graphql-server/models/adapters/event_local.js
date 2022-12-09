const _ = require('lodash');
const globals = require('../../config/globals');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const validatorUtil = require('../../utils/validatorUtil');
const helper = require('../../utils/helper');
const searchArg = require('../../utils/search-argument');
const path = require('path');
const helpersAcl = require('../../utils/helpers-acl');
const email = require('../../utils/email');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const models = require(path.join(__dirname, '..', 'index.js'));

const remoteZendroURL = "";
const iriRegex = new RegExp('zendro_local');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    "model": "event",
    "storageType": "sql-adapter",
    "adapterName": "event_local",
    "regex": "zendro_local",
    "attributes": {
        "id": "String",
        "type": "String",
        "accession_number": "String",
        "description": "String",
        "dates": "[DateTime]",
        "study_id": "String",
        "observation_unit_ids": "[String]"
    },
    "associations": {
        "study": {
            "type": "many_to_one",
            "reverseAssociation": "events",
            "implementation": "foreignkeys",
            "target": "study",
            "targetStorageType": "distributed-data-model",
            "targetKey": "study_id",
            "keysIn": "event"
        },
        "observation_units": {
            "type": "many_to_many",
            "reverseAssociation": "events",
            "implementation": "foreignkeys",
            "target": "observation_unit",
            "targetStorageType": "distributed-data-model",
            "targetKey": "event_ids",
            "sourceKey": "observation_unit_ids",
            "keysIn": "event"
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

module.exports = class event_local extends Sequelize.Model {
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
            accession_number: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            dates: {
                type: Sequelize[dict['[DateTime]']],
                defaultValue: '[]'
            },
            study_id: {
                type: Sequelize[dict['String']]
            },
            observation_unit_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "event",
            tableName: "events",
            sequelize
        });
    }

    static get adapterName() {
        return 'event_local';
    }

    static get adapterType() {
        return 'sql-adapter';
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

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    /**
     * Batch function for readById method.
     * @param  {array} keys  keys from readById method
     * @return {array}       searched results
     */
    static async batchReadById(keys) {
        let queryArg = {
            operator: "in",
            field: event_local.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await event_local.readAllCursor(queryArg);
        cursorRes = cursorRes.events.reduce(
            (map, obj) => ((map[obj[event_local.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(event_local.batchReadById, {
        cache: false,
    });

    /**
     * readById - The adapter implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type event_local, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await event_local.readByIdLoader.load(id);
    }
    /**
     * countRecords - The adapter implementation for counting the number of records, possibly restricted by a search term
     *
     * This method is the implementation for counting the number of records that fulfill a given condition, or for all records in the table.
     * @param {object} search - The search term that restricts the set of records to be counted - if undefined, all records in the table
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @return {number} The number of records that fulfill the condition, or of all records in the table
     */
    static countRecords(search) {
        let options = {};

        /*
         * Search conditions
         */
        if (search !== undefined && search !== null) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize(event_local.definition.attributes);
            options['where'] = arg_sequelize;
        }
        return super.count(options);
    }

    /**
     * readAllCursor - The adapter implementation for searching for records. This method uses cursor based pagination.
     *
     * @param {object} search - The search condition for which records shall be fetched
     * @param  {array} order - Type of sorting (ASC, DESC) for each field
     * @param {object} pagination - The parameters for pagination, which can be used to get a subset of the requested record set.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @return {object} The set of records, possibly constrained by pagination, with full cursor information for all records
     */
    static async readAllCursor(search, order, pagination) {
        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), event_local.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => event_local.postReadCast(x))

        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), event_local.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            events: edges.map((edge) => edge.node)
        };
    }

    /**
     * addOne - The adapter implementation method for adding a record.
     *
     * @param {object} input - The input object.
     * @return {object} The created record 
     * @throw {Error} If the process fails, an error is thrown
     */
    static async addOne(input) {
        input = event_local.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            event_local.postReadCast(result.dataValues)
            event_local.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }

    }

    /**
     * deleteOne - The adapter implementation for deleting a single record, given by its ID.
     *
     * @param {string} id - The ID of the record to be deleted
     * @returns {string} A success message is returned
     * @throw {Error} If the record could not be deleted - this means a record with the ID is still present
     */
    static async deleteOne(id) {
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
     * updateOne - The adapter implementation for updating a single record.
     *
     * @param {object} input - The input object.
     * @returns {object} The updated record
     * @throw {Error} If this method fails, an error is thrown
     */
    static async updateOne(input) {
        input = event_local.preWriteCast(input)
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
            event_local.postReadCast(result.dataValues)
            event_local.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }


    /**
     * add_study_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_study_id(id, study_id, benignErrorReporter) {
        try {
            let updated = await super.update({
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
                promises.push(models.observation_unit.add_event_ids(idx, [`${id}`], benignErrorReporter, token, false));
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
     * remove_study_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_study_id(id, study_id, benignErrorReporter) {
        try {
            let updated = await super.update({
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
                promises.push(models.observation_unit.remove_event_ids(idx, [`${id}`], benignErrorReporter, token, false));
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




    static csvTableTemplate() {
        return helper.csvTableTemplate(definition);
    }

    /**
     * bulkAssociateEventWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateEventWithStudy_id(bulkAssociationInput) {
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
     * bulkDisAssociateEventWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateEventWithStudy_id(bulkAssociationInput) {
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
        return event_local.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return event_local.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of event_local.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[event_local.idAttribute()];
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
     * base64Encode - Encode  event_local to a base 64 String
     *
     * @return {string} The event_local object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The event_local object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of event_local.
     *
     * @return {object} The attributes of event_local in object form
     */
    stripAssociations() {
        let attributes = Object.keys(event_local.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of event_local that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of event_local that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of event_local.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
}