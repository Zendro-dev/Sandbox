const _ = require('lodash');
const globals = require('../../config/globals');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const validatorUtil = require('../../utils/validatorUtil');
const helper = require('../../utils/helper');
const searchArg = require('../../utils/search-argument');
const path = require('path');
const fileTools = require('../../utils/file-tools');
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
    model: 'observed_variable',
    storageType: 'sql-adapter',
    adapterName: 'observed_variable_local',
    regex: 'zendro_local',
    attributes: {
        id: 'String',
        name: 'String',
        accession_number: 'String',
        trait: 'String',
        trait_accession_number: 'String',
        method: 'String',
        method_accession_number: 'String',
        method_description: 'String',
        scale: 'String',
        scale_accession_number: 'String',
        time_scale: 'String',
        study_ids: '[String]',
        data_file_ids: '[Int]'
    },
    associations: {
        studies: {
            type: 'many_to_many',
            reverseAssociation: 'observed_variables',
            implementation: 'foreignkeys',
            target: 'study',
            targetStorageType: 'distributed-data-model',
            targetKey: 'observed_variable_ids',
            sourceKey: 'study_ids',
            keysIn: 'observed_variable'
        },
        data_files: {
            type: 'many_to_many',
            reverseAssociation: 'observed_variables',
            implementation: 'foreignkeys',
            target: 'data_file',
            targetStorageType: 'distributed-data-model',
            targetKey: 'observed_variable_ids',
            sourceKey: 'data_file_ids',
            keysIn: 'observed_variable'
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
 */

module.exports = class observed_variable_local extends Sequelize.Model {
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
            name: {
                type: Sequelize[dict['String']]
            },
            accession_number: {
                type: Sequelize[dict['String']]
            },
            trait: {
                type: Sequelize[dict['String']]
            },
            trait_accession_number: {
                type: Sequelize[dict['String']]
            },
            method: {
                type: Sequelize[dict['String']]
            },
            method_accession_number: {
                type: Sequelize[dict['String']]
            },
            method_description: {
                type: Sequelize[dict['String']]
            },
            scale: {
                type: Sequelize[dict['String']]
            },
            scale_accession_number: {
                type: Sequelize[dict['String']]
            },
            time_scale: {
                type: Sequelize[dict['String']]
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            data_file_ids: {
                type: Sequelize[dict['[Int]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "observed_variable",
            tableName: "observed_variables",
            sequelize
        });
    }

    static get adapterName() {
        return 'observed_variable_local';
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
            field: observed_variable_local.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await observed_variable_local.readAllCursor(queryArg);
        cursorRes = cursorRes.observed_variables.reduce(
            (map, obj) => ((map[obj[observed_variable_local.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(observed_variable_local.batchReadById, {
        cache: false,
    });

    /**
     * readById - The adapter implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type observed_variable_local, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await observed_variable_local.readByIdLoader.load(id);
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
            let arg_sequelize = arg.toSequelize(observed_variable_local.definition.attributes);
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observed_variable_local.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observed_variable_local.postReadCast(x))

        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observed_variable_local.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            observed_variables: edges.map((edge) => edge.node)
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
        input = observed_variable_local.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observed_variable_local.postReadCast(result.dataValues)
            observed_variable_local.postReadCast(result._previousDataValues)
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
        input = observed_variable_local.preWriteCast(input)
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
            observed_variable_local.postReadCast(result.dataValues)
            observed_variable_local.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }



    /**
     * add_study_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_study_ids(id, study_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.add_observed_variable_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }


    /**
     * add_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_data_file_ids(id, data_file_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            data_file_ids.forEach(idx => {
                promises.push(models.data_file.add_observed_variable_ids(idx, [`${id}`], benignErrorReporter, false));
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
     * remove_study_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_study_ids(id, study_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_ids.forEach(idx => {
                promises.push(models.study.remove_observed_variable_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_ids), study_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_ids: updated_ids
            });
        }
    }


    /**
     * remove_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_data_file_ids(id, data_file_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            data_file_ids.forEach(idx => {
                promises.push(models.data_file.remove_observed_variable_ids(idx, [`${id}`], benignErrorReporter, false));
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
     * bulkAddCsv - Add records from csv file
     *
     * @param  {object} context - contextual information, e.g. csv file, record delimiter and column names.
     */
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
        return `Bulk import of observed_variable_local records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(definition);
    }




    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return observed_variable_local.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observed_variable_local.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observed_variable_local.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observed_variable_local.idAttribute()];
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
     * base64Encode - Encode  observed_variable_local to a base 64 String
     *
     * @return {string} The observed_variable_local object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The observed_variable_local object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of observed_variable_local.
     *
     * @return {object} The attributes of observed_variable_local in object form
     */
    stripAssociations() {
        let attributes = Object.keys(observed_variable_local.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of observed_variable_local that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of observed_variable_local that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of observed_variable_local.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
}