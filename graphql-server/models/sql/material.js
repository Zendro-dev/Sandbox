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
    model: 'material',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        name: 'String',
        type: 'String',
        characteristics_fk: '[String]',
        derivesFrom_fk: '[String]',
        derived_children_fk: '[String]',
        assay_materials_otherMaterials_fk: '[String]',
        study_materials_otherMaterials_fk: '[String]',
        process_inputs_material_fk: '[String]',
        process_outputs_material_fk: '[String]',
        id: 'String'
    },
    associations: {
        characteristics: {
            type: 'many_to_many',
            sourceKey: 'characteristics_fk',
            target: 'material_attribute_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'material_characteristics',
            targetKey: 'material_characteristics_fk',
            keysIn: 'material'
        },
        derivesFrom: {
            type: 'many_to_many',
            sourceKey: 'derivesFrom_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'derived_children',
            targetKey: 'derived_children_fk',
            keysIn: 'material'
        },
        derived_children: {
            type: 'many_to_many',
            sourceKey: 'derived_children_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'derivesFrom',
            targetKey: 'derivesFrom_fk',
            keysIn: 'material'
        },
        comments: {
            type: 'one_to_many',
            target: 'comment',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'material_comments',
            targetKey: 'material_comments_fk',
            keysIn: 'comment'
        },
        process_inputs_material: {
            type: 'many_to_many',
            sourceKey: 'process_inputs_material_fk',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'inputs_material',
            targetKey: 'inputs_material_fk',
            keysIn: 'material'
        },
        process_outputs_material: {
            type: 'many_to_many',
            sourceKey: 'process_outputs_material_fk',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'outputs_material',
            targetKey: 'outputs_material_fk',
            keysIn: 'material'
        },
        assay_materials_otherMaterials: {
            type: 'many_to_many',
            sourceKey: 'assay_materials_otherMaterials_fk',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'materials_otherMaterials',
            targetKey: 'materials_otherMaterials_fk',
            keysIn: 'material'
        },
        study_materials_otherMaterials: {
            type: 'many_to_many',
            sourceKey: 'study_materials_otherMaterials_fk',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'materials_otherMaterials',
            targetKey: 'materials_otherMaterials_fk',
            keysIn: 'material'
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

module.exports = class material extends Sequelize.Model {
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
            type: {
                type: Sequelize[dict['String']]
            },
            characteristics_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            derivesFrom_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            derived_children_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            assay_materials_otherMaterials_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_materials_otherMaterials_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            process_inputs_material_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            process_outputs_material_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "material",
            tableName: "materials",
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
        material.hasMany(models.comment, {
            as: 'comments',
            foreignKey: 'material_comments_fk'
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
            field: material.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await material.readAllCursor(queryArg);
        cursorRes = cursorRes.materials.reduce(
            (map, obj) => ((map[obj[material.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(material.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type material, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await material.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, material.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), material.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => material.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), material.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => material.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), material.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            materials: edges.map((edge) => edge.node)
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
        input = material.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            material.postReadCast(result.dataValues)
            material.postReadCast(result._previousDataValues)
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
        input = material.preWriteCast(input)
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
            material.postReadCast(result.dataValues)
            material.postReadCast(result._previousDataValues)
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

        return `Bulk import of material records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_characteristics_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   characteristics_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_characteristics_fk(id, characteristics_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            characteristics_fk.forEach(idx => {
                promises.push(models.material_attribute_value.add_material_characteristics_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.characteristics_fk), characteristics_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                characteristics_fk: updated_ids
            });
        }
    }
    /**
     * add_derivesFrom_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   derivesFrom_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_derivesFrom_fk(id, derivesFrom_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            derivesFrom_fk.forEach(idx => {
                promises.push(models.material.add_derived_children_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.derivesFrom_fk), derivesFrom_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                derivesFrom_fk: updated_ids
            });
        }
    }
    /**
     * add_derived_children_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   derived_children_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_derived_children_fk(id, derived_children_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            derived_children_fk.forEach(idx => {
                promises.push(models.material.add_derivesFrom_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.derived_children_fk), derived_children_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                derived_children_fk: updated_ids
            });
        }
    }
    /**
     * add_process_inputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   process_inputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_process_inputs_material_fk(id, process_inputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            process_inputs_material_fk.forEach(idx => {
                promises.push(models.process.add_inputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.process_inputs_material_fk), process_inputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                process_inputs_material_fk: updated_ids
            });
        }
    }
    /**
     * add_process_outputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   process_outputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_process_outputs_material_fk(id, process_outputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            process_outputs_material_fk.forEach(idx => {
                promises.push(models.process.add_outputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.process_outputs_material_fk), process_outputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                process_outputs_material_fk: updated_ids
            });
        }
    }
    /**
     * add_assay_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   assay_materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_assay_materials_otherMaterials_fk(id, assay_materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.assay.add_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.assay_materials_otherMaterials_fk), assay_materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_materials_otherMaterials_fk: updated_ids
            });
        }
    }
    /**
     * add_study_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_materials_otherMaterials_fk(id, study_materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.study.add_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_materials_otherMaterials_fk), study_materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_materials_otherMaterials_fk: updated_ids
            });
        }
    }

    /**
     * remove_characteristics_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   characteristics_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_characteristics_fk(id, characteristics_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            characteristics_fk.forEach(idx => {
                promises.push(models.material_attribute_value.remove_material_characteristics_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.characteristics_fk), characteristics_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                characteristics_fk: updated_ids
            });
        }
    }
    /**
     * remove_derivesFrom_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   derivesFrom_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_derivesFrom_fk(id, derivesFrom_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            derivesFrom_fk.forEach(idx => {
                promises.push(models.material.remove_derived_children_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.derivesFrom_fk), derivesFrom_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                derivesFrom_fk: updated_ids
            });
        }
    }
    /**
     * remove_derived_children_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   derived_children_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_derived_children_fk(id, derived_children_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            derived_children_fk.forEach(idx => {
                promises.push(models.material.remove_derivesFrom_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.derived_children_fk), derived_children_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                derived_children_fk: updated_ids
            });
        }
    }
    /**
     * remove_process_inputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   process_inputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_process_inputs_material_fk(id, process_inputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            process_inputs_material_fk.forEach(idx => {
                promises.push(models.process.remove_inputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.process_inputs_material_fk), process_inputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                process_inputs_material_fk: updated_ids
            });
        }
    }
    /**
     * remove_process_outputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   process_outputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_process_outputs_material_fk(id, process_outputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            process_outputs_material_fk.forEach(idx => {
                promises.push(models.process.remove_outputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.process_outputs_material_fk), process_outputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                process_outputs_material_fk: updated_ids
            });
        }
    }
    /**
     * remove_assay_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   assay_materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_assay_materials_otherMaterials_fk(id, assay_materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.assay.remove_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.assay_materials_otherMaterials_fk), assay_materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_materials_otherMaterials_fk: updated_ids
            });
        }
    }
    /**
     * remove_study_materials_otherMaterials_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_materials_otherMaterials_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_materials_otherMaterials_fk(id, study_materials_otherMaterials_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_materials_otherMaterials_fk.forEach(idx => {
                promises.push(models.study.remove_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_materials_otherMaterials_fk), study_materials_otherMaterials_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_materials_otherMaterials_fk: updated_ids
            });
        }
    }








    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return material.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return material.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of material.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[material.idAttribute()];
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
     * base64Encode - Encode  material to a base 64 String
     *
     * @return {string} The material object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The material object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of material.
     *
     * @return {object} The attributes of material in object form
     */
    stripAssociations() {
        let attributes = Object.keys(material.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of material that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of material that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of material.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}