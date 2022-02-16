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
    model: 'assay',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        filename: 'String',
        measurementType_fk: 'String',
        technologyType_fk: 'String',
        technologyPlatform: 'String',
        materials_samples_fk: '[String]',
        materials_otherMaterials_fk: '[String]',
        characteristicCategories_fk: '[String]',
        unitCategories_fk: '[String]',
        study_assays_fk: 'String',
        id: 'String'
    },
    associations: {
        measurementType: {
            type: 'many_to_one',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_measurementType',
            targetKey: 'measurementType_fk',
            keysIn: 'assay'
        },
        technologyType: {
            type: 'many_to_one',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_technologyType',
            targetKey: 'technologyType_fk',
            keysIn: 'assay'
        },
        materials_otherMaterials: {
            type: 'many_to_many',
            sourceKey: 'materials_otherMaterials_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_materials_otherMaterials',
            targetKey: 'assay_materials_otherMaterials_fk',
            keysIn: 'assay'
        },
        materials_samples: {
            type: 'many_to_many',
            sourceKey: 'materials_samples_fk',
            target: 'sample',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_materials_samples',
            targetKey: 'assay_materials_samples_fk',
            keysIn: 'assay'
        },
        dataFiles: {
            type: 'one_to_many',
            target: 'data',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_dataFiles',
            targetKey: 'assay_dataFiles_fk',
            keysIn: 'data'
        },
        characteristicCategories: {
            type: 'many_to_many',
            sourceKey: 'characteristicCategories_fk',
            target: 'material_attribute',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_characteristicCategories',
            targetKey: 'assay_characteristicCategories_fk',
            keysIn: 'assay'
        },
        unitCategories: {
            type: 'many_to_many',
            sourceKey: 'unitCategories_fk',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_unitCategories',
            targetKey: 'assay_unitCategories_fk',
            keysIn: 'assay'
        },
        processSequence: {
            type: 'one_to_many',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_processSequence',
            targetKey: 'assay_processSequence_fk',
            keysIn: 'process'
        },
        comments: {
            type: 'one_to_many',
            target: 'comment',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assay_comments',
            targetKey: 'assay_comments_fk',
            keysIn: 'comment'
        },
        study_assays: {
            type: 'many_to_one',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'assays',
            targetKey: 'study_assays_fk',
            keysIn: 'assay'
        }
    },
    id: {
        name: 'id',
        type: 'String'
    }
};
const DataLoader = require("dataloader");

/**
 * module - Creates a sequelize model
 */

module.exports = class assay extends Sequelize.Model {
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
            filename: {
                type: Sequelize[dict['String']]
            },
            measurementType_fk: {
                type: Sequelize[dict['String']]
            },
            technologyType_fk: {
                type: Sequelize[dict['String']]
            },
            technologyPlatform: {
                type: Sequelize[dict['String']]
            },
            materials_samples_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            materials_otherMaterials_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            characteristicCategories_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            unitCategories_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_assays_fk: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "assay",
            tableName: "assays",
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
        assay.belongsTo(models.ontology_annotation, {
            as: 'measurementType',
            foreignKey: 'measurementType_fk'
        });
        assay.belongsTo(models.ontology_annotation, {
            as: 'technologyType',
            foreignKey: 'technologyType_fk'
        });
        assay.belongsTo(models.study, {
            as: 'study_assays',
            foreignKey: 'study_assays_fk'
        });
        assay.hasMany(models.data, {
            as: 'dataFiles',
            foreignKey: 'assay_dataFiles_fk'
        });
        assay.hasMany(models.process, {
            as: 'processSequence',
            foreignKey: 'assay_processSequence_fk'
        });
        assay.hasMany(models.comment, {
            as: 'comments',
            foreignKey: 'assay_comments_fk'
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
            field: assay.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await assay.readAllCursor(queryArg);
        cursorRes = cursorRes.assays.reduce(
            (map, obj) => ((map[obj[assay.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(assay.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type assay, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await assay.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, assay.definition.attributes);
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
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), assay.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => assay.postReadCast(x))
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
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), assay.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => assay.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), assay.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            assays: edges.map((edge) => edge.node)
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
        input = assay.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            assay.postReadCast(result.dataValues)
            assay.postReadCast(result._previousDataValues)
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
        input = assay.preWriteCast(input)
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
            assay.postReadCast(result.dataValues)
            assay.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
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

        return `Bulk import of assay records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_measurementType_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   measurementType_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_measurementType_fk(id, measurementType_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                measurementType_fk: measurementType_fk
            }, {
                where: {
                    id: id
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * add_technologyType_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   technologyType_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_technologyType_fk(id, technologyType_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                technologyType_fk: technologyType_fk
            }, {
                where: {
                    id: id
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * add_study_assays_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_assays_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_study_assays_fk(id, study_assays_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                study_assays_fk: study_assays_fk
            }, {
                where: {
                    id: id
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * add_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_materials_otherMaterials_fk(id, materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.material.add_assay_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.materials_otherMaterials_fk), materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_otherMaterials_fk: updated_ids
            });
        }
    }
    /**
     * add_materials_samples_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_samples_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_materials_samples_fk(id, materials_samples_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_samples_fk.forEach(idx => {
                promises.push(models.sample.add_assay_materials_samples_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.materials_samples_fk), materials_samples_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_samples_fk: updated_ids
            });
        }
    }
    /**
     * add_characteristicCategories_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   characteristicCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_characteristicCategories_fk(id, characteristicCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            characteristicCategories_fk.forEach(idx => {
                promises.push(models.material_attribute.add_assay_characteristicCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.characteristicCategories_fk), characteristicCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                characteristicCategories_fk: updated_ids
            });
        }
    }
    /**
     * add_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_unitCategories_fk(id, unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            unitCategories_fk.forEach(idx => {
                promises.push(models.ontology_annotation.add_assay_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.unitCategories_fk), unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                unitCategories_fk: updated_ids
            });
        }
    }

    /**
     * remove_measurementType_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   measurementType_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_measurementType_fk(id, measurementType_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                measurementType_fk: null
            }, {
                where: {
                    id: id,
                    measurementType_fk: measurementType_fk
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * remove_technologyType_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   technologyType_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_technologyType_fk(id, technologyType_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                technologyType_fk: null
            }, {
                where: {
                    id: id,
                    technologyType_fk: technologyType_fk
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * remove_study_assays_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_assays_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_study_assays_fk(id, study_assays_fk, benignErrorReporter) {
        try {
            let updated = await assay.update({
                study_assays_fk: null
            }, {
                where: {
                    id: id,
                    study_assays_fk: study_assays_fk
                }
            });
            return updated[0];
        } catch (error) {
            benignErrorReporter.reportError({
                message: error
            });
        }
    }
    /**
     * remove_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_materials_otherMaterials_fk(id, materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.material.remove_assay_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.materials_otherMaterials_fk), materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_otherMaterials_fk: updated_ids
            });
        }
    }
    /**
     * remove_materials_samples_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_samples_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_materials_samples_fk(id, materials_samples_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_samples_fk.forEach(idx => {
                promises.push(models.sample.remove_assay_materials_samples_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.materials_samples_fk), materials_samples_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_samples_fk: updated_ids
            });
        }
    }
    /**
     * remove_characteristicCategories_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   characteristicCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_characteristicCategories_fk(id, characteristicCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            characteristicCategories_fk.forEach(idx => {
                promises.push(models.material_attribute.remove_assay_characteristicCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.characteristicCategories_fk), characteristicCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                characteristicCategories_fk: updated_ids
            });
        }
    }
    /**
     * remove_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_unitCategories_fk(id, unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            unitCategories_fk.forEach(idx => {
                promises.push(models.ontology_annotation.remove_assay_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.unitCategories_fk), unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                unitCategories_fk: updated_ids
            });
        }
    }





    /**
     * bulkAssociateAssayWithMeasurementType_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateAssayWithMeasurementType_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "measurementType_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            measurementType_fk,
            id
        }) => {
            promises.push(super.update({
                measurementType_fk: measurementType_fk
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
     * bulkAssociateAssayWithTechnologyType_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateAssayWithTechnologyType_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "technologyType_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            technologyType_fk,
            id
        }) => {
            promises.push(super.update({
                technologyType_fk: technologyType_fk
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
     * bulkAssociateAssayWithStudy_assays_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateAssayWithStudy_assays_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_assays_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_assays_fk,
            id
        }) => {
            promises.push(super.update({
                study_assays_fk: study_assays_fk
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
     * bulkDisAssociateAssayWithMeasurementType_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateAssayWithMeasurementType_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "measurementType_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            measurementType_fk,
            id
        }) => {
            promises.push(super.update({
                measurementType_fk: null
            }, {
                where: {
                    id: id,
                    measurementType_fk: measurementType_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateAssayWithTechnologyType_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateAssayWithTechnologyType_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "technologyType_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            technologyType_fk,
            id
        }) => {
            promises.push(super.update({
                technologyType_fk: null
            }, {
                where: {
                    id: id,
                    technologyType_fk: technologyType_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateAssayWithStudy_assays_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateAssayWithStudy_assays_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_assays_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_assays_fk,
            id
        }) => {
            promises.push(super.update({
                study_assays_fk: null
            }, {
                where: {
                    id: id,
                    study_assays_fk: study_assays_fk
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
        return assay.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return assay.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of assay.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[assay.idAttribute()];
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
     * base64Encode - Encode  assay to a base 64 String
     *
     * @return {string} The assay object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The assay object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of assay.
     *
     * @return {object} The attributes of assay in object form
     */
    stripAssociations() {
        let attributes = Object.keys(assay.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of assay that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of assay that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of assay.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}