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
    "model": "observationUnit",
    "storageType": "sql",
    "attributes": {
        "observationLevel": "String",
        "observationUnitName": "String",
        "observationUnitPUI": "String",
        "plantNumber": "String",
        "observationUnitDbId": "String",
        "germplasmDbId": "String",
        "locationDbId": "String",
        "studyDbId": "String",
        "trialDbId": "String",
        "eventDbIds": "[String]"
    },
    "associations": {
        "observationUnitPosition": {
            "type": "one_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnit",
            "target": "observationUnitPosition",
            "targetKey": "observationUnitDbId",
            "keysIn": "observationUnitPosition",
            "targetStorageType": "sql"
        },
        "observationTreatments": {
            "type": "one_to_many",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnit",
            "target": "observationTreatment",
            "targetKey": "observationUnitDbId",
            "keysIn": "observationTreatment",
            "targetStorageType": "sql"
        },
        "location": {
            "type": "many_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnits",
            "target": "location",
            "targetKey": "locationDbId",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        },
        "observations": {
            "type": "one_to_many",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnit",
            "target": "observation",
            "targetKey": "observationUnitDbId",
            "keysIn": "observation",
            "targetStorageType": "sql"
        },
        "germplasm": {
            "type": "many_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnits",
            "target": "germplasm",
            "targetKey": "germplasmDbId",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        },
        "study": {
            "type": "many_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnits",
            "target": "study",
            "targetKey": "studyDbId",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        },
        "trial": {
            "type": "many_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnits",
            "target": "trial",
            "targetKey": "trialDbId",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        },
        "events": {
            "type": "many_to_many",
            "implementation": "foreignkeys",
            "reverseAssociation": "observationUnits",
            "target": "event",
            "targetKey": "observationUnitDbIds",
            "sourceKey": "eventDbIds",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        }
    },
    "internalId": "observationUnitDbId",
    "id": {
        "name": "observationUnitDbId",
        "type": "String"
    }
};
const DataLoader = require("dataloader");

/**
 * module - Creates a sequelize model
 */

module.exports = class observationUnit extends Sequelize.Model {
    /**
     * Initialize sequelize model.
     * @param  {object} sequelize Sequelize instance.
     * @param  {object} DataTypes Allowed sequelize data types.
     * @return {object}           Sequelize model with associations defined
     */
    static init(sequelize, DataTypes) {
        return super.init({

            observationUnitDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            observationLevel: {
                type: Sequelize[dict['String']]
            },
            observationUnitName: {
                type: Sequelize[dict['String']]
            },
            observationUnitPUI: {
                type: Sequelize[dict['String']]
            },
            plantNumber: {
                type: Sequelize[dict['String']]
            },
            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
                type: Sequelize[dict['String']]
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            },
            trialDbId: {
                type: Sequelize[dict['String']]
            },
            eventDbIds: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "observationUnit",
            tableName: "observationUnits",
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
        observationUnit.hasOne(models.observationUnitPosition, {
            as: 'observationUnitPosition',
            foreignKey: 'observationUnitDbId'
        });
        observationUnit.belongsTo(models.location, {
            as: 'location',
            foreignKey: 'locationDbId'
        });
        observationUnit.belongsTo(models.germplasm, {
            as: 'germplasm',
            foreignKey: 'germplasmDbId'
        });
        observationUnit.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'studyDbId'
        });
        observationUnit.belongsTo(models.trial, {
            as: 'trial',
            foreignKey: 'trialDbId'
        });
        observationUnit.hasMany(models.observationTreatment, {
            as: 'observationTreatments',
            foreignKey: 'observationUnitDbId'
        });
        observationUnit.hasMany(models.observation, {
            as: 'observations',
            foreignKey: 'observationUnitDbId'
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
            field: observationUnit.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await observationUnit.readAllCursor(queryArg);
        cursorRes = cursorRes.observationUnits.reduce(
            (map, obj) => ((map[obj[observationUnit.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(observationUnit.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type observationUnit, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await observationUnit.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, observationUnit.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), observationUnit.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observationUnit.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observationUnit.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => observationUnit.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observationUnit.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            observationUnits: edges.map((edge) => edge.node)
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
        input = observationUnit.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observationUnit.postReadCast(result.dataValues)
            observationUnit.postReadCast(result._previousDataValues)
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
        input = observationUnit.preWriteCast(input)
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
            observationUnit.postReadCast(result.dataValues)
            observationUnit.postReadCast(result._previousDataValues)
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
     * add_locationDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_locationDbId(observationUnitDbId, locationDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                locationDbId: locationDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
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
     * add_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_germplasmDbId(observationUnitDbId, germplasmDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                germplasmDbId: germplasmDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
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
     * add_studyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_studyDbId(observationUnitDbId, studyDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                studyDbId: studyDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
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
     * add_trialDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_trialDbId(observationUnitDbId, trialDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                trialDbId: trialDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
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
     * add_eventDbIds - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Array}   eventDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async add_eventDbIds(observationUnitDbId, eventDbIds, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            eventDbIds.forEach(idx => {
                promises.push(models.event.add_observationUnitDbIds(idx, [`${observationUnitDbId}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(observationUnitDbId);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.eventDbIds), eventDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                eventDbIds: updated_ids
            });
        }
    }

    /**
     * remove_locationDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_locationDbId(observationUnitDbId, locationDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                locationDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    locationDbId: locationDbId
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
     * remove_germplasmDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_germplasmDbId(observationUnitDbId, germplasmDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                germplasmDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    germplasmDbId: germplasmDbId
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
     * remove_studyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_studyDbId(observationUnitDbId, studyDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                studyDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    studyDbId: studyDbId
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
     * remove_trialDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_trialDbId(observationUnitDbId, trialDbId, benignErrorReporter) {
        try {
            let updated = await observationUnit.update({
                trialDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    trialDbId: trialDbId
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
     * remove_eventDbIds - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Array}   eventDbIds Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */
    static async remove_eventDbIds(observationUnitDbId, eventDbIds, benignErrorReporter, token, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            eventDbIds.forEach(idx => {
                promises.push(models.event.remove_observationUnitDbIds(idx, [`${observationUnitDbId}`], benignErrorReporter, token, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(observationUnitDbId);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.eventDbIds), eventDbIds);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                eventDbIds: updated_ids
            });
        }
    }





    /**
     * bulkAssociateObservationUnitWithLocationDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                locationDbId: locationDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateObservationUnitWithGermplasmDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: germplasmDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateObservationUnitWithStudyDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                studyDbId: studyDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkAssociateObservationUnitWithTrialDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationUnitWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                trialDbId: trialDbId
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateObservationUnitWithLocationDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithLocationDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "locationDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            locationDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                locationDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    locationDbId: locationDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationUnitWithGermplasmDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithGermplasmDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "germplasmDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            germplasmDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                germplasmDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    germplasmDbId: germplasmDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationUnitWithStudyDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithStudyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "studyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            studyDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                studyDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
                    studyDbId: studyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationUnitWithTrialDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationUnitWithTrialDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationUnitDbId", "trialDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            trialDbId,
            observationUnitDbId
        }) => {
            promises.push(super.update({
                trialDbId: null
            }, {
                where: {
                    observationUnitDbId: observationUnitDbId,
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
        return observationUnit.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observationUnit.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationUnit.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observationUnit.idAttribute()];
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
     * base64Encode - Encode  observationUnit to a base 64 String
     *
     * @return {string} The observationUnit object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The observationUnit object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of observationUnit.
     *
     * @return {object} The attributes of observationUnit in object form
     */
    stripAssociations() {
        let attributes = Object.keys(observationUnit.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of observationUnit that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of observationUnit that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of observationUnit.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}