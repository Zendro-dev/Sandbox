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
    model: 'process',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        name: 'String',
        executesProtocol_fk: 'String',
        performer: 'String',
        date: 'DateTime',
        previousProcess_fk: 'String',
        nextProcess_fk: 'String',
        inputs_source_fk: '[String]',
        inputs_sample_fk: '[String]',
        inputs_data_fk: '[String]',
        inputs_material_fk: '[String]',
        outputs_sample_fk: '[String]',
        outputs_data_fk: '[String]',
        outputs_material_fk: '[String]',
        study_processSequence_fk: 'String',
        assay_processSequence_fk: 'String',
        id: 'String'
    },
    associations: {
        executesProtocol: {
            type: 'many_to_one',
            target: 'protocol',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_executesProtocol',
            targetKey: 'executesProtocol_fk',
            keysIn: 'process'
        },
        parameterValues: {
            type: 'one_to_many',
            target: 'process_parameter_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_parameterValues',
            targetKey: 'process_parameterValues_fk',
            keysIn: 'process_parameter_value'
        },
        previousProcess: {
            type: 'one_to_one',
            sourceKey: 'nextProcess_fk',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'nextProcess',
            targetKey: 'previousProcess_fk',
            keysIn: 'process'
        },
        nextProcess: {
            type: 'one_to_one',
            sourceKey: 'previousProcess_fk',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'previousProcess',
            targetKey: 'nextProcess_fk',
            keysIn: 'process'
        },
        inputs_source: {
            type: 'many_to_many',
            sourceKey: 'inputs_source_fk',
            target: 'source',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_inputs_source',
            targetKey: 'process_inputs_source_fk',
            keysIn: 'process'
        },
        inputs_sample: {
            type: 'many_to_many',
            sourceKey: 'inputs_sample_fk',
            target: 'sample',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_inputs_sample',
            targetKey: 'process_inputs_sample_fk',
            keysIn: 'process'
        },
        inputs_data: {
            type: 'many_to_many',
            sourceKey: 'inputs_data_fk',
            target: 'data',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_inputs_data',
            targetKey: 'process_inputs_data_fk',
            keysIn: 'process'
        },
        inputs_material: {
            type: 'many_to_many',
            sourceKey: 'inputs_material_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_inputs_material',
            targetKey: 'process_inputs_material_fk',
            keysIn: 'process'
        },
        outputs_sample: {
            type: 'many_to_many',
            sourceKey: 'outputs_sample_fk',
            target: 'sample',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_outputs_sample',
            targetKey: 'process_outputs_sample_fk',
            keysIn: 'process'
        },
        outputs_data: {
            type: 'many_to_many',
            sourceKey: 'outputs_data_fk',
            target: 'data',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_outputs_data',
            targetKey: 'process_outputs_data_fk',
            keysIn: 'process'
        },
        outputs_material: {
            type: 'many_to_many',
            sourceKey: 'outputs_material_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_outputs_material',
            targetKey: 'process_outputs_material_fk',
            keysIn: 'process'
        },
        comments: {
            type: 'one_to_many',
            target: 'comment',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'process_comments',
            targetKey: 'process_comments_fk',
            keysIn: 'comment'
        },
        assay_processSequence: {
            type: 'many_to_one',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'processSequence',
            targetKey: 'assay_processSequence_fk',
            keysIn: 'process'
        },
        study_processSequence: {
            type: 'many_to_one',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'processSequence',
            targetKey: 'study_processSequence_fk',
            keysIn: 'process'
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

module.exports = class process extends Sequelize.Model {
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
            executesProtocol_fk: {
                type: Sequelize[dict['String']]
            },
            performer: {
                type: Sequelize[dict['String']]
            },
            date: {
                type: Sequelize[dict['DateTime']]
            },
            previousProcess_fk: {
                type: Sequelize[dict['String']]
            },
            nextProcess_fk: {
                type: Sequelize[dict['String']]
            },
            inputs_source_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            inputs_sample_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            inputs_data_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            inputs_material_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            outputs_sample_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            outputs_data_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            outputs_material_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_processSequence_fk: {
                type: Sequelize[dict['String']]
            },
            assay_processSequence_fk: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "process",
            tableName: "processes",
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
        process.belongsTo(models.protocol, {
            as: 'executesProtocol',
            foreignKey: 'executesProtocol_fk'
        });
        process.hasOne(models.process, {
            as: 'previousProcess',
            foreignKey: 'previousProcess_fk'
        });
        process.hasOne(models.process, {
            as: 'nextProcess',
            foreignKey: 'nextProcess_fk'
        });
        process.belongsTo(models.assay, {
            as: 'assay_processSequence',
            foreignKey: 'assay_processSequence_fk'
        });
        process.belongsTo(models.study, {
            as: 'study_processSequence',
            foreignKey: 'study_processSequence_fk'
        });
        process.hasMany(models.process_parameter_value, {
            as: 'parameterValues',
            foreignKey: 'process_parameterValues_fk'
        });
        process.hasMany(models.comment, {
            as: 'comments',
            foreignKey: 'process_comments_fk'
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
            field: process.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await process.readAllCursor(queryArg);
        cursorRes = cursorRes.processes.reduce(
            (map, obj) => ((map[obj[process.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(process.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type process, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await process.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, process.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), process.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => process.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), process.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => process.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), process.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            processes: edges.map((edge) => edge.node)
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
        input = process.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            process.postReadCast(result.dataValues)
            process.postReadCast(result._previousDataValues)
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
        input = process.preWriteCast(input)
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
            process.postReadCast(result.dataValues)
            process.postReadCast(result._previousDataValues)
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

        return `Bulk import of process records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_executesProtocol_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   executesProtocol_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_executesProtocol_fk(id, executesProtocol_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                executesProtocol_fk: executesProtocol_fk
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
     * add_previousProcess_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   previousProcess_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_previousProcess_fk(id, previousProcess_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                previousProcess_fk: previousProcess_fk
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
     * add_nextProcess_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   nextProcess_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_nextProcess_fk(id, nextProcess_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                nextProcess_fk: nextProcess_fk
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
     * add_assay_processSequence_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_processSequence_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_assay_processSequence_fk(id, assay_processSequence_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                assay_processSequence_fk: assay_processSequence_fk
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
     * add_study_processSequence_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_processSequence_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_study_processSequence_fk(id, study_processSequence_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                study_processSequence_fk: study_processSequence_fk
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
     * add_inputs_source_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_source_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_inputs_source_fk(id, inputs_source_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_source_fk.forEach(idx => {
                promises.push(models.source.add_process_inputs_source_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.inputs_source_fk), inputs_source_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_source_fk: updated_ids
            });
        }
    }
    /**
     * add_inputs_sample_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_sample_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_inputs_sample_fk(id, inputs_sample_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_sample_fk.forEach(idx => {
                promises.push(models.sample.add_process_inputs_sample_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.inputs_sample_fk), inputs_sample_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_sample_fk: updated_ids
            });
        }
    }
    /**
     * add_inputs_data_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_data_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_inputs_data_fk(id, inputs_data_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_data_fk.forEach(idx => {
                promises.push(models.data.add_process_inputs_data_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.inputs_data_fk), inputs_data_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_data_fk: updated_ids
            });
        }
    }
    /**
     * add_inputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_inputs_material_fk(id, inputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_material_fk.forEach(idx => {
                promises.push(models.material.add_process_inputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.inputs_material_fk), inputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_material_fk: updated_ids
            });
        }
    }
    /**
     * add_outputs_sample_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_sample_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_outputs_sample_fk(id, outputs_sample_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_sample_fk.forEach(idx => {
                promises.push(models.sample.add_process_outputs_sample_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.outputs_sample_fk), outputs_sample_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_sample_fk: updated_ids
            });
        }
    }
    /**
     * add_outputs_data_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_data_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_outputs_data_fk(id, outputs_data_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_data_fk.forEach(idx => {
                promises.push(models.data.add_process_outputs_data_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.outputs_data_fk), outputs_data_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_data_fk: updated_ids
            });
        }
    }
    /**
     * add_outputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_outputs_material_fk(id, outputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_material_fk.forEach(idx => {
                promises.push(models.material.add_process_outputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.outputs_material_fk), outputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_material_fk: updated_ids
            });
        }
    }

    /**
     * remove_executesProtocol_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   executesProtocol_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_executesProtocol_fk(id, executesProtocol_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                executesProtocol_fk: null
            }, {
                where: {
                    id: id,
                    executesProtocol_fk: executesProtocol_fk
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
     * remove_previousProcess_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   previousProcess_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_previousProcess_fk(id, previousProcess_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                previousProcess_fk: null
            }, {
                where: {
                    id: id,
                    previousProcess_fk: previousProcess_fk
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
     * remove_nextProcess_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   nextProcess_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_nextProcess_fk(id, nextProcess_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                nextProcess_fk: null
            }, {
                where: {
                    id: id,
                    nextProcess_fk: nextProcess_fk
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
     * remove_assay_processSequence_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_processSequence_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_assay_processSequence_fk(id, assay_processSequence_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                assay_processSequence_fk: null
            }, {
                where: {
                    id: id,
                    assay_processSequence_fk: assay_processSequence_fk
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
     * remove_study_processSequence_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_processSequence_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_study_processSequence_fk(id, study_processSequence_fk, benignErrorReporter) {
        try {
            let updated = await process.update({
                study_processSequence_fk: null
            }, {
                where: {
                    id: id,
                    study_processSequence_fk: study_processSequence_fk
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
     * remove_inputs_source_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_source_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_inputs_source_fk(id, inputs_source_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_source_fk.forEach(idx => {
                promises.push(models.source.remove_process_inputs_source_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.inputs_source_fk), inputs_source_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_source_fk: updated_ids
            });
        }
    }
    /**
     * remove_inputs_sample_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_sample_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_inputs_sample_fk(id, inputs_sample_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_sample_fk.forEach(idx => {
                promises.push(models.sample.remove_process_inputs_sample_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.inputs_sample_fk), inputs_sample_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_sample_fk: updated_ids
            });
        }
    }
    /**
     * remove_inputs_data_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_data_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_inputs_data_fk(id, inputs_data_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_data_fk.forEach(idx => {
                promises.push(models.data.remove_process_inputs_data_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.inputs_data_fk), inputs_data_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_data_fk: updated_ids
            });
        }
    }
    /**
     * remove_inputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   inputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_inputs_material_fk(id, inputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            inputs_material_fk.forEach(idx => {
                promises.push(models.material.remove_process_inputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.inputs_material_fk), inputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                inputs_material_fk: updated_ids
            });
        }
    }
    /**
     * remove_outputs_sample_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_sample_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_outputs_sample_fk(id, outputs_sample_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_sample_fk.forEach(idx => {
                promises.push(models.sample.remove_process_outputs_sample_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.outputs_sample_fk), outputs_sample_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_sample_fk: updated_ids
            });
        }
    }
    /**
     * remove_outputs_data_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_data_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_outputs_data_fk(id, outputs_data_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_data_fk.forEach(idx => {
                promises.push(models.data.remove_process_outputs_data_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.outputs_data_fk), outputs_data_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_data_fk: updated_ids
            });
        }
    }
    /**
     * remove_outputs_material_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   outputs_material_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_outputs_material_fk(id, outputs_material_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            outputs_material_fk.forEach(idx => {
                promises.push(models.material.remove_process_outputs_material_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.outputs_material_fk), outputs_material_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                outputs_material_fk: updated_ids
            });
        }
    }





    /**
     * bulkAssociateProcessWithExecutesProtocol_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "executesProtocol_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            executesProtocol_fk,
            id
        }) => {
            promises.push(super.update({
                executesProtocol_fk: executesProtocol_fk
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
     * bulkAssociateProcessWithAssay_processSequence_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_processSequence_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_processSequence_fk,
            id
        }) => {
            promises.push(super.update({
                assay_processSequence_fk: assay_processSequence_fk
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
     * bulkAssociateProcessWithStudy_processSequence_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_processSequence_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_processSequence_fk,
            id
        }) => {
            promises.push(super.update({
                study_processSequence_fk: study_processSequence_fk
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
     * bulkDisAssociateProcessWithExecutesProtocol_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateProcessWithExecutesProtocol_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "executesProtocol_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            executesProtocol_fk,
            id
        }) => {
            promises.push(super.update({
                executesProtocol_fk: null
            }, {
                where: {
                    id: id,
                    executesProtocol_fk: executesProtocol_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateProcessWithAssay_processSequence_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateProcessWithAssay_processSequence_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_processSequence_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_processSequence_fk,
            id
        }) => {
            promises.push(super.update({
                assay_processSequence_fk: null
            }, {
                where: {
                    id: id,
                    assay_processSequence_fk: assay_processSequence_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateProcessWithStudy_processSequence_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateProcessWithStudy_processSequence_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_processSequence_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_processSequence_fk,
            id
        }) => {
            promises.push(super.update({
                study_processSequence_fk: null
            }, {
                where: {
                    id: id,
                    study_processSequence_fk: study_processSequence_fk
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
        return process.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return process.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of process.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[process.idAttribute()];
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
     * base64Encode - Encode  process to a base 64 String
     *
     * @return {string} The process object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The process object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of process.
     *
     * @return {object} The attributes of process in object form
     */
    stripAssociations() {
        let attributes = Object.keys(process.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of process that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of process that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of process.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}