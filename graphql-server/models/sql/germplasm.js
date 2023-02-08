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
    "model": "germplasm",
    "storageType": "sql",
    "attributes": {
        "accessionNumber": "String",
        "acquisitionDate": "Date",
        "breedingMethodDbId": "String",
        "commonCropName": "String",
        "countryOfOriginCode": "String",
        "defaultDisplayName": "String",
        "documentationURL": "String",
        "germplasmGenus": "String",
        "germplasmName": "String",
        "germplasmPUI": "String",
        "germplasmPreprocessing": "String",
        "germplasmSpecies": "String",
        "germplasmSubtaxa": "String",
        "instituteCode": "String",
        "instituteName": "String",
        "pedigree": "String",
        "seedSource": "String",
        "seedSourceDescription": "String",
        "speciesAuthority": "String",
        "subtaxaAuthority": "String",
        "xref": "String",
        "germplasmDbId": "String",
        "biologicalStatusOfAccessionCode": "String"
    },
    "associations": {
        "breedingMethod": {
            "type": "many_to_one",
            "implementation": "foreignkeys",
            "reverseAssociation": "germplasm",
            "target": "breedingMethod",
            "targetKey": "breedingMethodDbId",
            "keysIn": "germplasm",
            "targetStorageType": "sql"
        },
        "observationUnits": {
            "type": "one_to_many",
            "implementation": "foreignkeys",
            "reverseAssociation": "germplasm",
            "target": "observationUnit",
            "targetKey": "germplasmDbId",
            "keysIn": "observationUnit",
            "targetStorageType": "sql"
        },
        "observations": {
            "type": "one_to_many",
            "implementation": "foreignkeys",
            "reverseAssociation": "germplasm",
            "target": "observation",
            "targetKey": "germplasmDbId",
            "keysIn": "observation",
            "targetStorageType": "sql"
        }
    },
    "internalId": "germplasmDbId",
    "id": {
        "name": "germplasmDbId",
        "type": "String"
    }
};
const DataLoader = require("dataloader");

/**
 * module - Creates a sequelize model
 */

module.exports = class germplasm extends Sequelize.Model {
    /**
     * Initialize sequelize model.
     * @param  {object} sequelize Sequelize instance.
     * @param  {object} DataTypes Allowed sequelize data types.
     * @return {object}           Sequelize model with associations defined
     */
    static init(sequelize, DataTypes) {
        return super.init({

            germplasmDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            accessionNumber: {
                type: Sequelize[dict['String']]
            },
            acquisitionDate: {
                type: Sequelize[dict['Date']]
            },
            breedingMethodDbId: {
                type: Sequelize[dict['String']]
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            countryOfOriginCode: {
                type: Sequelize[dict['String']]
            },
            defaultDisplayName: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            germplasmGenus: {
                type: Sequelize[dict['String']]
            },
            germplasmName: {
                type: Sequelize[dict['String']]
            },
            germplasmPUI: {
                type: Sequelize[dict['String']]
            },
            germplasmPreprocessing: {
                type: Sequelize[dict['String']]
            },
            germplasmSpecies: {
                type: Sequelize[dict['String']]
            },
            germplasmSubtaxa: {
                type: Sequelize[dict['String']]
            },
            instituteCode: {
                type: Sequelize[dict['String']]
            },
            instituteName: {
                type: Sequelize[dict['String']]
            },
            pedigree: {
                type: Sequelize[dict['String']]
            },
            seedSource: {
                type: Sequelize[dict['String']]
            },
            seedSourceDescription: {
                type: Sequelize[dict['String']]
            },
            speciesAuthority: {
                type: Sequelize[dict['String']]
            },
            subtaxaAuthority: {
                type: Sequelize[dict['String']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            biologicalStatusOfAccessionCode: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "germplasm",
            tableName: "germplasms",
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
        germplasm.belongsTo(models.breedingMethod, {
            as: 'breedingMethod',
            foreignKey: 'breedingMethodDbId'
        });
        germplasm.hasMany(models.observationUnit, {
            as: 'observationUnits',
            foreignKey: 'germplasmDbId'
        });
        germplasm.hasMany(models.observation, {
            as: 'observations',
            foreignKey: 'germplasmDbId'
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
            field: germplasm.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await germplasm.readAllCursor(queryArg);
        cursorRes = cursorRes.germplasms.reduce(
            (map, obj) => ((map[obj[germplasm.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(germplasm.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type germplasm, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await germplasm.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, germplasm.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), germplasm.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => germplasm.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), germplasm.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => germplasm.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), germplasm.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            germplasms: edges.map((edge) => edge.node)
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
        input = germplasm.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            germplasm.postReadCast(result.dataValues)
            germplasm.postReadCast(result._previousDataValues)
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
        input = germplasm.preWriteCast(input)
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
            germplasm.postReadCast(result.dataValues)
            germplasm.postReadCast(result._previousDataValues)
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
     * add_breedingMethodDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_breedingMethodDbId(germplasmDbId, breedingMethodDbId, benignErrorReporter) {
        try {
            let updated = await germplasm.update({
                breedingMethodDbId: breedingMethodDbId
            }, {
                where: {
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
     * remove_breedingMethodDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId, benignErrorReporter) {
        try {
            let updated = await germplasm.update({
                breedingMethodDbId: null
            }, {
                where: {
                    germplasmDbId: germplasmDbId,
                    breedingMethodDbId: breedingMethodDbId
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
     * bulkAssociateGermplasmWithBreedingMethodDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "germplasmDbId", "breedingMethodDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            breedingMethodDbId,
            germplasmDbId
        }) => {
            promises.push(super.update({
                breedingMethodDbId: breedingMethodDbId
            }, {
                where: {
                    germplasmDbId: germplasmDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateGermplasmWithBreedingMethodDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateGermplasmWithBreedingMethodDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "germplasmDbId", "breedingMethodDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            breedingMethodDbId,
            germplasmDbId
        }) => {
            promises.push(super.update({
                breedingMethodDbId: null
            }, {
                where: {
                    germplasmDbId: germplasmDbId,
                    breedingMethodDbId: breedingMethodDbId
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
        return germplasm.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return germplasm.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of germplasm.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[germplasm.idAttribute()];
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
     * base64Encode - Encode  germplasm to a base 64 String
     *
     * @return {string} The germplasm object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The germplasm object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of germplasm.
     *
     * @return {object} The attributes of germplasm in object form
     */
    stripAssociations() {
        let attributes = Object.keys(germplasm.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of germplasm that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of germplasm that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of germplasm.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}