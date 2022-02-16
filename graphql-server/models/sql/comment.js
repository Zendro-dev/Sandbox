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
    model: 'comment',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        name: 'String',
        value: 'String',
        assay_comments_fk: 'String',
        ontology_annotation_comments_fk: 'String',
        data_comments_fk: 'String',
        process_comments_fk: 'String',
        ontology_source_reference_comments_fk: 'String',
        person_comments_fk: 'String',
        publication_comments_fk: 'String',
        investigation_comments_fk: 'String',
        factor_comments_fk: 'String',
        study_comments_fk: 'String',
        protocol_comments_fk: 'String',
        protocol_parameter_comments_fk: 'String',
        material_comments_fk: 'String',
        source_comments_fk: 'String',
        material_attribute_value_comments_fk: 'String',
        factor_value_comments_fk: 'String',
        process_parameter_value_comments_fk: 'String',
        sample_comments_fk: 'String',
        component_comments_fk: 'String',
        id: 'String'
    },
    associations: {
        ontology_annotation_comments: {
            type: 'many_to_one',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'ontology_annotation_comments_fk',
            keysIn: 'comment'
        },
        assay_comments: {
            type: 'many_to_one',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'assay_comments_fk',
            keysIn: 'comment'
        },
        data_comments: {
            type: 'many_to_one',
            target: 'data',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'data_comments_fk',
            keysIn: 'comment'
        },
        process_comments: {
            type: 'many_to_one',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'process_comments_fk',
            keysIn: 'comment'
        },
        ontology_source_reference_comments: {
            type: 'many_to_one',
            target: 'ontology_source_reference',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'ontology_source_reference_comments_fk',
            keysIn: 'comment'
        },
        publication_comments: {
            type: 'many_to_one',
            target: 'publication',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'publication_comments_fk',
            keysIn: 'comment'
        },
        person_comments: {
            type: 'many_to_one',
            target: 'person',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'person_comments_fk',
            keysIn: 'comment'
        },
        investigation_comments: {
            type: 'many_to_one',
            target: 'investigation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'investigation_comments_fk',
            keysIn: 'comment'
        },
        factor_comments: {
            type: 'many_to_one',
            target: 'factor',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'factor_comments_fk',
            keysIn: 'comment'
        },
        study_comments: {
            type: 'many_to_one',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'study_comments_fk',
            keysIn: 'comment'
        },
        protocol_comments: {
            type: 'many_to_one',
            target: 'protocol',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'protocol_comments_fk',
            keysIn: 'comment'
        },
        protocol_parameter_comments: {
            type: 'many_to_one',
            target: 'protocol_parameter',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'protocol_parameter_comments_fk',
            keysIn: 'comment'
        },
        material_comments: {
            type: 'many_to_one',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'material_comments_fk',
            keysIn: 'comment'
        },
        source_comments: {
            type: 'many_to_one',
            target: 'source',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'source_comments_fk',
            keysIn: 'comment'
        },
        material_attribute_value_comments: {
            type: 'many_to_one',
            target: 'material_attribute_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'material_attribute_value_comments_fk',
            keysIn: 'comment'
        },
        factor_value_comments: {
            type: 'many_to_one',
            target: 'factor_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'factor_value_comments_fk',
            keysIn: 'comment'
        },
        process_parameter_value_comments: {
            type: 'many_to_one',
            target: 'process_parameter_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'process_parameter_value_comments_fk',
            keysIn: 'comment'
        },
        sample_comments: {
            type: 'many_to_one',
            target: 'sample',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'sample_comments_fk',
            keysIn: 'comment'
        },
        component_comments: {
            type: 'many_to_one',
            target: 'component',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'comments',
            targetKey: 'component_comments_fk',
            keysIn: 'comment'
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

module.exports = class comment extends Sequelize.Model {
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
            value: {
                type: Sequelize[dict['String']]
            },
            assay_comments_fk: {
                type: Sequelize[dict['String']]
            },
            ontology_annotation_comments_fk: {
                type: Sequelize[dict['String']]
            },
            data_comments_fk: {
                type: Sequelize[dict['String']]
            },
            process_comments_fk: {
                type: Sequelize[dict['String']]
            },
            ontology_source_reference_comments_fk: {
                type: Sequelize[dict['String']]
            },
            person_comments_fk: {
                type: Sequelize[dict['String']]
            },
            publication_comments_fk: {
                type: Sequelize[dict['String']]
            },
            investigation_comments_fk: {
                type: Sequelize[dict['String']]
            },
            factor_comments_fk: {
                type: Sequelize[dict['String']]
            },
            study_comments_fk: {
                type: Sequelize[dict['String']]
            },
            protocol_comments_fk: {
                type: Sequelize[dict['String']]
            },
            protocol_parameter_comments_fk: {
                type: Sequelize[dict['String']]
            },
            material_comments_fk: {
                type: Sequelize[dict['String']]
            },
            source_comments_fk: {
                type: Sequelize[dict['String']]
            },
            material_attribute_value_comments_fk: {
                type: Sequelize[dict['String']]
            },
            factor_value_comments_fk: {
                type: Sequelize[dict['String']]
            },
            process_parameter_value_comments_fk: {
                type: Sequelize[dict['String']]
            },
            sample_comments_fk: {
                type: Sequelize[dict['String']]
            },
            component_comments_fk: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "comment",
            tableName: "comments",
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
        comment.belongsTo(models.ontology_annotation, {
            as: 'ontology_annotation_comments',
            foreignKey: 'ontology_annotation_comments_fk'
        });
        comment.belongsTo(models.assay, {
            as: 'assay_comments',
            foreignKey: 'assay_comments_fk'
        });
        comment.belongsTo(models.data, {
            as: 'data_comments',
            foreignKey: 'data_comments_fk'
        });
        comment.belongsTo(models.process, {
            as: 'process_comments',
            foreignKey: 'process_comments_fk'
        });
        comment.belongsTo(models.ontology_source_reference, {
            as: 'ontology_source_reference_comments',
            foreignKey: 'ontology_source_reference_comments_fk'
        });
        comment.belongsTo(models.publication, {
            as: 'publication_comments',
            foreignKey: 'publication_comments_fk'
        });
        comment.belongsTo(models.person, {
            as: 'person_comments',
            foreignKey: 'person_comments_fk'
        });
        comment.belongsTo(models.investigation, {
            as: 'investigation_comments',
            foreignKey: 'investigation_comments_fk'
        });
        comment.belongsTo(models.factor, {
            as: 'factor_comments',
            foreignKey: 'factor_comments_fk'
        });
        comment.belongsTo(models.study, {
            as: 'study_comments',
            foreignKey: 'study_comments_fk'
        });
        comment.belongsTo(models.protocol, {
            as: 'protocol_comments',
            foreignKey: 'protocol_comments_fk'
        });
        comment.belongsTo(models.protocol_parameter, {
            as: 'protocol_parameter_comments',
            foreignKey: 'protocol_parameter_comments_fk'
        });
        comment.belongsTo(models.material, {
            as: 'material_comments',
            foreignKey: 'material_comments_fk'
        });
        comment.belongsTo(models.source, {
            as: 'source_comments',
            foreignKey: 'source_comments_fk'
        });
        comment.belongsTo(models.material_attribute_value, {
            as: 'material_attribute_value_comments',
            foreignKey: 'material_attribute_value_comments_fk'
        });
        comment.belongsTo(models.factor_value, {
            as: 'factor_value_comments',
            foreignKey: 'factor_value_comments_fk'
        });
        comment.belongsTo(models.process_parameter_value, {
            as: 'process_parameter_value_comments',
            foreignKey: 'process_parameter_value_comments_fk'
        });
        comment.belongsTo(models.sample, {
            as: 'sample_comments',
            foreignKey: 'sample_comments_fk'
        });
        comment.belongsTo(models.component, {
            as: 'component_comments',
            foreignKey: 'component_comments_fk'
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
            field: comment.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await comment.readAllCursor(queryArg);
        cursorRes = cursorRes.comments.reduce(
            (map, obj) => ((map[obj[comment.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(comment.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type comment, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await comment.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, comment.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), comment.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => comment.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), comment.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => comment.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), comment.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            comments: edges.map((edge) => edge.node)
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
        input = comment.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            comment.postReadCast(result.dataValues)
            comment.postReadCast(result._previousDataValues)
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
        input = comment.preWriteCast(input)
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
            comment.postReadCast(result.dataValues)
            comment.postReadCast(result._previousDataValues)
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

        return `Bulk import of comment records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_ontology_annotation_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   ontology_annotation_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_ontology_annotation_comments_fk(id, ontology_annotation_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                ontology_annotation_comments_fk: ontology_annotation_comments_fk
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
     * add_assay_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_assay_comments_fk(id, assay_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                assay_comments_fk: assay_comments_fk
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
     * add_data_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   data_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_data_comments_fk(id, data_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                data_comments_fk: data_comments_fk
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
     * add_process_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   process_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_process_comments_fk(id, process_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                process_comments_fk: process_comments_fk
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
     * add_ontology_source_reference_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   ontology_source_reference_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_ontology_source_reference_comments_fk(id, ontology_source_reference_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                ontology_source_reference_comments_fk: ontology_source_reference_comments_fk
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
     * add_publication_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   publication_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_publication_comments_fk(id, publication_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                publication_comments_fk: publication_comments_fk
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
     * add_person_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   person_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_person_comments_fk(id, person_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                person_comments_fk: person_comments_fk
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
     * add_investigation_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_investigation_comments_fk(id, investigation_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                investigation_comments_fk: investigation_comments_fk
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
     * add_factor_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_factor_comments_fk(id, factor_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                factor_comments_fk: factor_comments_fk
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
     * add_study_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_study_comments_fk(id, study_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                study_comments_fk: study_comments_fk
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
     * add_protocol_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_protocol_comments_fk(id, protocol_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                protocol_comments_fk: protocol_comments_fk
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
     * add_protocol_parameter_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_parameter_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_protocol_parameter_comments_fk(id, protocol_parameter_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                protocol_parameter_comments_fk: protocol_parameter_comments_fk
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
     * add_material_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_material_comments_fk(id, material_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                material_comments_fk: material_comments_fk
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
     * add_source_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   source_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_source_comments_fk(id, source_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                source_comments_fk: source_comments_fk
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
     * add_material_attribute_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_attribute_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_material_attribute_value_comments_fk(id, material_attribute_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                material_attribute_value_comments_fk: material_attribute_value_comments_fk
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
     * add_factor_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_factor_value_comments_fk(id, factor_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                factor_value_comments_fk: factor_value_comments_fk
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
     * add_process_parameter_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   process_parameter_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_process_parameter_value_comments_fk(id, process_parameter_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                process_parameter_value_comments_fk: process_parameter_value_comments_fk
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
     * add_sample_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   sample_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_sample_comments_fk(id, sample_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                sample_comments_fk: sample_comments_fk
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
     * add_component_comments_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   component_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_component_comments_fk(id, component_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                component_comments_fk: component_comments_fk
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
     * remove_ontology_annotation_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   ontology_annotation_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_ontology_annotation_comments_fk(id, ontology_annotation_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                ontology_annotation_comments_fk: null
            }, {
                where: {
                    id: id,
                    ontology_annotation_comments_fk: ontology_annotation_comments_fk
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
     * remove_assay_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_assay_comments_fk(id, assay_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                assay_comments_fk: null
            }, {
                where: {
                    id: id,
                    assay_comments_fk: assay_comments_fk
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
     * remove_data_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   data_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_data_comments_fk(id, data_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                data_comments_fk: null
            }, {
                where: {
                    id: id,
                    data_comments_fk: data_comments_fk
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
     * remove_process_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   process_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_process_comments_fk(id, process_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                process_comments_fk: null
            }, {
                where: {
                    id: id,
                    process_comments_fk: process_comments_fk
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
     * remove_ontology_source_reference_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   ontology_source_reference_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_ontology_source_reference_comments_fk(id, ontology_source_reference_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                ontology_source_reference_comments_fk: null
            }, {
                where: {
                    id: id,
                    ontology_source_reference_comments_fk: ontology_source_reference_comments_fk
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
     * remove_publication_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   publication_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_publication_comments_fk(id, publication_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                publication_comments_fk: null
            }, {
                where: {
                    id: id,
                    publication_comments_fk: publication_comments_fk
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
     * remove_person_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   person_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_person_comments_fk(id, person_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                person_comments_fk: null
            }, {
                where: {
                    id: id,
                    person_comments_fk: person_comments_fk
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
     * remove_investigation_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_investigation_comments_fk(id, investigation_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                investigation_comments_fk: null
            }, {
                where: {
                    id: id,
                    investigation_comments_fk: investigation_comments_fk
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
     * remove_factor_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_factor_comments_fk(id, factor_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                factor_comments_fk: null
            }, {
                where: {
                    id: id,
                    factor_comments_fk: factor_comments_fk
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
     * remove_study_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_study_comments_fk(id, study_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                study_comments_fk: null
            }, {
                where: {
                    id: id,
                    study_comments_fk: study_comments_fk
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
     * remove_protocol_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_protocol_comments_fk(id, protocol_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                protocol_comments_fk: null
            }, {
                where: {
                    id: id,
                    protocol_comments_fk: protocol_comments_fk
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
     * remove_protocol_parameter_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_parameter_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_protocol_parameter_comments_fk(id, protocol_parameter_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                protocol_parameter_comments_fk: null
            }, {
                where: {
                    id: id,
                    protocol_parameter_comments_fk: protocol_parameter_comments_fk
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
     * remove_material_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_material_comments_fk(id, material_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                material_comments_fk: null
            }, {
                where: {
                    id: id,
                    material_comments_fk: material_comments_fk
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
     * remove_source_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   source_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_source_comments_fk(id, source_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                source_comments_fk: null
            }, {
                where: {
                    id: id,
                    source_comments_fk: source_comments_fk
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
     * remove_material_attribute_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_attribute_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_material_attribute_value_comments_fk(id, material_attribute_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                material_attribute_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    material_attribute_value_comments_fk: material_attribute_value_comments_fk
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
     * remove_factor_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_factor_value_comments_fk(id, factor_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                factor_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    factor_value_comments_fk: factor_value_comments_fk
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
     * remove_process_parameter_value_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   process_parameter_value_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_process_parameter_value_comments_fk(id, process_parameter_value_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                process_parameter_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    process_parameter_value_comments_fk: process_parameter_value_comments_fk
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
     * remove_sample_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   sample_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_sample_comments_fk(id, sample_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                sample_comments_fk: null
            }, {
                where: {
                    id: id,
                    sample_comments_fk: sample_comments_fk
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
     * remove_component_comments_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   component_comments_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_component_comments_fk(id, component_comments_fk, benignErrorReporter) {
        try {
            let updated = await comment.update({
                component_comments_fk: null
            }, {
                where: {
                    id: id,
                    component_comments_fk: component_comments_fk
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
     * bulkAssociateCommentWithOntology_annotation_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "ontology_annotation_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontology_annotation_comments_fk,
            id
        }) => {
            promises.push(super.update({
                ontology_annotation_comments_fk: ontology_annotation_comments_fk
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
     * bulkAssociateCommentWithAssay_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithAssay_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_comments_fk,
            id
        }) => {
            promises.push(super.update({
                assay_comments_fk: assay_comments_fk
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
     * bulkAssociateCommentWithData_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithData_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "data_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            data_comments_fk,
            id
        }) => {
            promises.push(super.update({
                data_comments_fk: data_comments_fk
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
     * bulkAssociateCommentWithProcess_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithProcess_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "process_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            process_comments_fk,
            id
        }) => {
            promises.push(super.update({
                process_comments_fk: process_comments_fk
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
     * bulkAssociateCommentWithOntology_source_reference_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "ontology_source_reference_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontology_source_reference_comments_fk,
            id
        }) => {
            promises.push(super.update({
                ontology_source_reference_comments_fk: ontology_source_reference_comments_fk
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
     * bulkAssociateCommentWithPublication_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithPublication_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "publication_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            publication_comments_fk,
            id
        }) => {
            promises.push(super.update({
                publication_comments_fk: publication_comments_fk
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
     * bulkAssociateCommentWithPerson_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithPerson_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "person_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            person_comments_fk,
            id
        }) => {
            promises.push(super.update({
                person_comments_fk: person_comments_fk
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
     * bulkAssociateCommentWithInvestigation_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_comments_fk,
            id
        }) => {
            promises.push(super.update({
                investigation_comments_fk: investigation_comments_fk
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
     * bulkAssociateCommentWithFactor_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithFactor_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_comments_fk,
            id
        }) => {
            promises.push(super.update({
                factor_comments_fk: factor_comments_fk
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
     * bulkAssociateCommentWithStudy_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithStudy_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_comments_fk,
            id
        }) => {
            promises.push(super.update({
                study_comments_fk: study_comments_fk
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
     * bulkAssociateCommentWithProtocol_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithProtocol_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_comments_fk,
            id
        }) => {
            promises.push(super.update({
                protocol_comments_fk: protocol_comments_fk
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
     * bulkAssociateCommentWithProtocol_parameter_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_parameter_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_parameter_comments_fk,
            id
        }) => {
            promises.push(super.update({
                protocol_parameter_comments_fk: protocol_parameter_comments_fk
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
     * bulkAssociateCommentWithMaterial_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithMaterial_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_comments_fk,
            id
        }) => {
            promises.push(super.update({
                material_comments_fk: material_comments_fk
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
     * bulkAssociateCommentWithSource_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithSource_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "source_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            source_comments_fk,
            id
        }) => {
            promises.push(super.update({
                source_comments_fk: source_comments_fk
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
     * bulkAssociateCommentWithMaterial_attribute_value_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_attribute_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_attribute_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                material_attribute_value_comments_fk: material_attribute_value_comments_fk
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
     * bulkAssociateCommentWithFactor_value_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                factor_value_comments_fk: factor_value_comments_fk
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
     * bulkAssociateCommentWithProcess_parameter_value_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "process_parameter_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            process_parameter_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                process_parameter_value_comments_fk: process_parameter_value_comments_fk
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
     * bulkAssociateCommentWithSample_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithSample_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "sample_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            sample_comments_fk,
            id
        }) => {
            promises.push(super.update({
                sample_comments_fk: sample_comments_fk
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
     * bulkAssociateCommentWithComponent_comments_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCommentWithComponent_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "component_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            component_comments_fk,
            id
        }) => {
            promises.push(super.update({
                component_comments_fk: component_comments_fk
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
     * bulkDisAssociateCommentWithOntology_annotation_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithOntology_annotation_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "ontology_annotation_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontology_annotation_comments_fk,
            id
        }) => {
            promises.push(super.update({
                ontology_annotation_comments_fk: null
            }, {
                where: {
                    id: id,
                    ontology_annotation_comments_fk: ontology_annotation_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithAssay_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithAssay_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_comments_fk,
            id
        }) => {
            promises.push(super.update({
                assay_comments_fk: null
            }, {
                where: {
                    id: id,
                    assay_comments_fk: assay_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithData_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithData_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "data_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            data_comments_fk,
            id
        }) => {
            promises.push(super.update({
                data_comments_fk: null
            }, {
                where: {
                    id: id,
                    data_comments_fk: data_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithProcess_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithProcess_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "process_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            process_comments_fk,
            id
        }) => {
            promises.push(super.update({
                process_comments_fk: null
            }, {
                where: {
                    id: id,
                    process_comments_fk: process_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithOntology_source_reference_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithOntology_source_reference_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "ontology_source_reference_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontology_source_reference_comments_fk,
            id
        }) => {
            promises.push(super.update({
                ontology_source_reference_comments_fk: null
            }, {
                where: {
                    id: id,
                    ontology_source_reference_comments_fk: ontology_source_reference_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithPublication_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithPublication_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "publication_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            publication_comments_fk,
            id
        }) => {
            promises.push(super.update({
                publication_comments_fk: null
            }, {
                where: {
                    id: id,
                    publication_comments_fk: publication_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithPerson_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithPerson_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "person_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            person_comments_fk,
            id
        }) => {
            promises.push(super.update({
                person_comments_fk: null
            }, {
                where: {
                    id: id,
                    person_comments_fk: person_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithInvestigation_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithInvestigation_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_comments_fk,
            id
        }) => {
            promises.push(super.update({
                investigation_comments_fk: null
            }, {
                where: {
                    id: id,
                    investigation_comments_fk: investigation_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithFactor_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithFactor_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_comments_fk,
            id
        }) => {
            promises.push(super.update({
                factor_comments_fk: null
            }, {
                where: {
                    id: id,
                    factor_comments_fk: factor_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithStudy_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithStudy_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_comments_fk,
            id
        }) => {
            promises.push(super.update({
                study_comments_fk: null
            }, {
                where: {
                    id: id,
                    study_comments_fk: study_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithProtocol_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithProtocol_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_comments_fk,
            id
        }) => {
            promises.push(super.update({
                protocol_comments_fk: null
            }, {
                where: {
                    id: id,
                    protocol_comments_fk: protocol_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithProtocol_parameter_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithProtocol_parameter_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_parameter_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_parameter_comments_fk,
            id
        }) => {
            promises.push(super.update({
                protocol_parameter_comments_fk: null
            }, {
                where: {
                    id: id,
                    protocol_parameter_comments_fk: protocol_parameter_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithMaterial_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithMaterial_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_comments_fk,
            id
        }) => {
            promises.push(super.update({
                material_comments_fk: null
            }, {
                where: {
                    id: id,
                    material_comments_fk: material_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithSource_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithSource_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "source_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            source_comments_fk,
            id
        }) => {
            promises.push(super.update({
                source_comments_fk: null
            }, {
                where: {
                    id: id,
                    source_comments_fk: source_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithMaterial_attribute_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_attribute_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_attribute_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                material_attribute_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    material_attribute_value_comments_fk: material_attribute_value_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithFactor_value_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithFactor_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                factor_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    factor_value_comments_fk: factor_value_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithProcess_parameter_value_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithProcess_parameter_value_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "process_parameter_value_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            process_parameter_value_comments_fk,
            id
        }) => {
            promises.push(super.update({
                process_parameter_value_comments_fk: null
            }, {
                where: {
                    id: id,
                    process_parameter_value_comments_fk: process_parameter_value_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithSample_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithSample_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "sample_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            sample_comments_fk,
            id
        }) => {
            promises.push(super.update({
                sample_comments_fk: null
            }, {
                where: {
                    id: id,
                    sample_comments_fk: sample_comments_fk
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateCommentWithComponent_comments_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCommentWithComponent_comments_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "component_comments_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            component_comments_fk,
            id
        }) => {
            promises.push(super.update({
                component_comments_fk: null
            }, {
                where: {
                    id: id,
                    component_comments_fk: component_comments_fk
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
        return comment.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return comment.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of comment.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[comment.idAttribute()];
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
     * base64Encode - Encode  comment to a base 64 String
     *
     * @return {string} The comment object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The comment object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of comment.
     *
     * @return {object} The attributes of comment in object form
     */
    stripAssociations() {
        let attributes = Object.keys(comment.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of comment that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of comment that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of comment.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}