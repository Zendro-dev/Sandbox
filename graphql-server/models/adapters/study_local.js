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
    model: 'study',
    storageType: 'sql-adapter',
    adapterName: 'study_local',
    regex: 'zendro_local',
    attributes: {
        id: 'String',
        title: 'String',
        description: 'String',
        startDate: 'Date',
        endDate: 'Date',
        institution: 'String',
        location_country: 'String',
        location_latitude: 'String',
        location_longitude: 'String',
        location_altitude: 'String',
        experimental_site_name: 'String',
        experimental_design_type: 'String',
        experimental_design_description: 'String',
        experimental_design_map: 'String',
        observation_unit_level_hirarchy: 'String',
        observation_unit_description: 'String',
        growth_facility: 'String',
        growth_facility_description: 'String',
        cultural_practices: 'String',
        investigation_id: 'String',
        person_ids: '[String]',
        observed_variable_ids: '[String]',
        biological_material_ids: '[String]'
    },
    associations: {
        investigation: {
            type: 'many_to_one',
            reverseAssociation: 'studies',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'investigation',
            targetKey: 'investigation_id',
            keysIn: 'study'
        },
        people: {
            type: 'many_to_many',
            reverseAssociation: 'studies',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'person',
            targetKey: 'study_ids',
            sourceKey: 'person_ids',
            keysIn: 'study'
        },
        environment_parameters: {
            type: 'one_to_many',
            reverseAssociation: 'study',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'environment',
            targetKey: 'study_id',
            keysIn: 'environment'
        },
        events: {
            type: 'one_to_many',
            reverseAssociation: 'study',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'event',
            targetKey: 'study_id',
            keysIn: 'event'
        },
        observation_units: {
            type: 'one_to_many',
            reverseAssociation: 'study',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'observation_unit',
            targetKey: 'study_id',
            keysIn: 'observation_unit'
        },
        observed_variables: {
            type: 'many_to_many',
            reverseAssociation: 'studies',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'observed_variable',
            targetKey: 'study_ids',
            sourceKey: 'observed_variable_ids',
            keysIn: 'study'
        },
        biological_materials: {
            type: 'many_to_many',
            reverseAssociation: 'studies',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'biological_material',
            targetKey: 'study_ids',
            sourceKey: 'biological_material_ids',
            keysIn: 'study'
        },
        factors: {
            type: 'one_to_many',
            reverseAssociation: 'study',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'factor',
            targetKey: 'study_id',
            keysIn: 'factor'
        },
        data_files: {
            type: 'one_to_many',
            reverseAssociation: 'study',
            implementation: 'foreignkeys',
            targetStorageType: 'distributed-data-model',
            target: 'data_file',
            targetKey: 'study_id',
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
 */

module.exports = class study_local extends Sequelize.Model {
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
            title: {
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
            institution: {
                type: Sequelize[dict['String']]
            },
            location_country: {
                type: Sequelize[dict['String']]
            },
            location_latitude: {
                type: Sequelize[dict['String']]
            },
            location_longitude: {
                type: Sequelize[dict['String']]
            },
            location_altitude: {
                type: Sequelize[dict['String']]
            },
            experimental_site_name: {
                type: Sequelize[dict['String']]
            },
            experimental_design_type: {
                type: Sequelize[dict['String']]
            },
            experimental_design_description: {
                type: Sequelize[dict['String']]
            },
            experimental_design_map: {
                type: Sequelize[dict['String']]
            },
            observation_unit_level_hirarchy: {
                type: Sequelize[dict['String']]
            },
            observation_unit_description: {
                type: Sequelize[dict['String']]
            },
            growth_facility: {
                type: Sequelize[dict['String']]
            },
            growth_facility_description: {
                type: Sequelize[dict['String']]
            },
            cultural_practices: {
                type: Sequelize[dict['String']]
            },
            investigation_id: {
                type: Sequelize[dict['String']]
            },
            person_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            observed_variable_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            biological_material_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "study",
            tableName: "studies",
            sequelize
        });
    }

    static get adapterName() {
        return 'study_local';
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
            field: study_local.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await study_local.readAllCursor(queryArg);
        cursorRes = cursorRes.studies.reduce(
            (map, obj) => ((map[obj[study_local.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(study_local.batchReadById, {
        cache: false,
    });

    /**
     * readById - The adapter implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type study_local, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await study_local.readByIdLoader.load(id);
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
            let arg_sequelize = arg.toSequelize(study_local.definition.attributes);
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), study_local.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => study_local.postReadCast(x))

        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), study_local.definition.attributes);
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

    /**
     * addOne - The adapter implementation method for adding a record.
     *
     * @param {object} input - The input object.
     * @return {object} The created record 
     * @throw {Error} If the process fails, an error is thrown
     */
    static async addOne(input) {
        input = study_local.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            study_local.postReadCast(result.dataValues)
            study_local.postReadCast(result._previousDataValues)
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
        input = study_local.preWriteCast(input)
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
            study_local.postReadCast(result.dataValues)
            study_local.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }


    /**
     * add_investigation_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_investigation_id(id, investigation_id) {
        let updated = await super.update({
            investigation_id: investigation_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }





    /**
     * add_person_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   person_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_person_ids(id, person_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            person_ids.forEach(idx => {
                promises.push(models.person.add_study_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.person_ids), person_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                person_ids: updated_ids
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
                promises.push(models.observed_variable.add_study_ids(idx, [`${id}`], benignErrorReporter, false));
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
     * add_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_biological_material_ids(id, biological_material_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            biological_material_ids.forEach(idx => {
                promises.push(models.biological_material.add_study_ids(idx, [`${id}`], benignErrorReporter, false));
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
     * remove_investigation_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_investigation_id(id, investigation_id) {
        let updated = await super.update({
            investigation_id: null
        }, {
            where: {
                id: id,
                investigation_id: investigation_id
            }
        });
        return updated;
    }





    /**
     * remove_person_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   person_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_person_ids(id, person_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            person_ids.forEach(idx => {
                promises.push(models.person.remove_study_ids(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.person_ids), person_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                person_ids: updated_ids
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
                promises.push(models.observed_variable.remove_study_ids(idx, [`${id}`], benignErrorReporter, false));
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
     * remove_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_biological_material_ids(id, biological_material_ids, benignErrorReporter, handle_inverse = true) {

        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            biological_material_ids.forEach(idx => {
                promises.push(models.biological_material.remove_study_ids(idx, [`${id}`], benignErrorReporter, false));
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
        return `Bulk import of study_local records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(definition);
    }

    /**
     * bulkAssociateStudyWithInvestigation_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateStudyWithInvestigation_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_id,
            id
        }) => {
            promises.push(super.update({
                investigation_id: investigation_id
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
     * bulkDisAssociateStudyWithInvestigation_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateStudyWithInvestigation_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_id,
            id
        }) => {
            promises.push(super.update({
                investigation_id: null
            }, {
                where: {
                    id: id,
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
        return study_local.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return study_local.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of study_local.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[study_local.idAttribute()];
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
     * base64Encode - Encode  study_local to a base 64 String
     *
     * @return {string} The study_local object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The study_local object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of study_local.
     *
     * @return {object} The attributes of study_local in object form
     */
    stripAssociations() {
        let attributes = Object.keys(study_local.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of study_local that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of study_local that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of study_local.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
}