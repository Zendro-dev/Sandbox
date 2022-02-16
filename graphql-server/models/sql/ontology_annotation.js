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
    model: 'ontology_annotation',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        annotationValue: 'String',
        termSource: 'String',
        termAccession: 'String',
        assay_unitCategories_fk: '[String]',
        study_studyDesignDescriptors_fk: '[String]',
        study_unitCategories_fk: '[String]',
        person_roles_fk: '[String]',
        id: 'String'
    },
    associations: {
        comments: {
            type: 'one_to_many',
            target: 'comment',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'ontology_annotation_comments',
            targetKey: 'ontology_annotation_comments_fk',
            keysIn: 'comment'
        },
        assay_measurementType: {
            type: 'one_to_many',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'measurementType',
            targetKey: 'measurementType_fk',
            keysIn: 'assay'
        },
        assay_unitCategories: {
            type: 'many_to_many',
            sourceKey: 'assay_unitCategories_fk',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'unitCategories',
            targetKey: 'unitCategories_fk',
            keysIn: 'ontology_annotation'
        },
        publication_status: {
            type: 'one_to_many',
            target: 'publication',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'status',
            targetKey: 'status_fk',
            keysIn: 'publication'
        },
        person_roles: {
            type: 'many_to_many',
            sourceKey: 'person_roles_fk',
            target: 'person',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'roles',
            targetKey: 'roles_fk',
            keysIn: 'ontology_annotation'
        },
        study_studyDesignDescriptors: {
            type: 'many_to_many',
            sourceKey: 'study_studyDesignDescriptors_fk',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'studyDesignDescriptors',
            targetKey: 'studyDesignDescriptors_fk',
            keysIn: 'ontology_annotation'
        },
        factor_factorType: {
            type: 'one_to_many',
            target: 'factor',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'factorType',
            targetKey: 'factorType_fk',
            keysIn: 'factor'
        },
        study_unitCategories: {
            type: 'many_to_many',
            sourceKey: 'study_unitCategories_fk',
            target: 'study',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'unitCategories',
            targetKey: 'unitCategories_fk',
            keysIn: 'ontology_annotation'
        },
        protocol_protocolType: {
            type: 'one_to_many',
            target: 'protocol',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'protocolType',
            targetKey: 'protocolType_fk',
            keysIn: 'protocol'
        },
        protocol_parameter_parameterName: {
            type: 'one_to_many',
            target: 'protocol_parameter',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'parameterName',
            targetKey: 'parameterName_fk',
            keysIn: 'protocol_parameter'
        },
        material_attribute_characteristicType: {
            type: 'one_to_many',
            target: 'material_attribute',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'characteristicType',
            targetKey: 'characteristicType_fk',
            keysIn: 'material_attribute'
        },
        material_attribute_value_unit: {
            type: 'one_to_many',
            target: 'material_attribute_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'unit',
            targetKey: 'unit_fk',
            keysIn: 'material_attribute_value'
        },
        factor_value_unit: {
            type: 'one_to_many',
            target: 'factor_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'unit',
            targetKey: 'unit_fk',
            keysIn: 'factor_value'
        },
        process_parameter_value_unit: {
            type: 'one_to_many',
            target: 'process_parameter_value',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'unit',
            targetKey: 'unit_fk',
            keysIn: 'process_parameter_value'
        },
        assay_technologyType: {
            type: 'one_to_many',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'technologyType',
            targetKey: 'technologyType_fk',
            keysIn: 'assay'
        },
        component_componentType: {
            type: 'one_to_many',
            target: 'component',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'componentType',
            targetKey: 'componentType_fk',
            keysIn: 'component'
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

module.exports = class ontology_annotation extends Sequelize.Model {
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
            annotationValue: {
                type: Sequelize[dict['String']]
            },
            termSource: {
                type: Sequelize[dict['String']]
            },
            termAccession: {
                type: Sequelize[dict['String']]
            },
            assay_unitCategories_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_studyDesignDescriptors_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_unitCategories_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            person_roles_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "ontology_annotation",
            tableName: "ontology_annotations",
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
        ontology_annotation.hasMany(models.comment, {
            as: 'comments',
            foreignKey: 'ontology_annotation_comments_fk'
        });
        ontology_annotation.hasMany(models.assay, {
            as: 'assay_measurementType',
            foreignKey: 'measurementType_fk'
        });
        ontology_annotation.hasMany(models.publication, {
            as: 'publication_status',
            foreignKey: 'status_fk'
        });
        ontology_annotation.hasMany(models.factor, {
            as: 'factor_factorType',
            foreignKey: 'factorType_fk'
        });
        ontology_annotation.hasMany(models.protocol, {
            as: 'protocol_protocolType',
            foreignKey: 'protocolType_fk'
        });
        ontology_annotation.hasMany(models.protocol_parameter, {
            as: 'protocol_parameter_parameterName',
            foreignKey: 'parameterName_fk'
        });
        ontology_annotation.hasMany(models.material_attribute, {
            as: 'material_attribute_characteristicType',
            foreignKey: 'characteristicType_fk'
        });
        ontology_annotation.hasMany(models.material_attribute_value, {
            as: 'material_attribute_value_unit',
            foreignKey: 'unit_fk'
        });
        ontology_annotation.hasMany(models.factor_value, {
            as: 'factor_value_unit',
            foreignKey: 'unit_fk'
        });
        ontology_annotation.hasMany(models.process_parameter_value, {
            as: 'process_parameter_value_unit',
            foreignKey: 'unit_fk'
        });
        ontology_annotation.hasMany(models.assay, {
            as: 'assay_technologyType',
            foreignKey: 'technologyType_fk'
        });
        ontology_annotation.hasMany(models.component, {
            as: 'component_componentType',
            foreignKey: 'componentType_fk'
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
            field: ontology_annotation.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await ontology_annotation.readAllCursor(queryArg);
        cursorRes = cursorRes.ontology_annotations.reduce(
            (map, obj) => ((map[obj[ontology_annotation.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(ontology_annotation.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type ontology_annotation, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await ontology_annotation.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, ontology_annotation.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), ontology_annotation.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => ontology_annotation.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), ontology_annotation.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => ontology_annotation.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), ontology_annotation.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            ontology_annotations: edges.map((edge) => edge.node)
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
        input = ontology_annotation.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            ontology_annotation.postReadCast(result.dataValues)
            ontology_annotation.postReadCast(result._previousDataValues)
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
        input = ontology_annotation.preWriteCast(input)
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
            ontology_annotation.postReadCast(result.dataValues)
            ontology_annotation.postReadCast(result._previousDataValues)
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

        return `Bulk import of ontology_annotation records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_assay_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   assay_unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_assay_unitCategories_fk(id, assay_unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_unitCategories_fk.forEach(idx => {
                promises.push(models.assay.add_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.assay_unitCategories_fk), assay_unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_unitCategories_fk: updated_ids
            });
        }
    }
    /**
     * add_person_roles_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   person_roles_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_person_roles_fk(id, person_roles_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            person_roles_fk.forEach(idx => {
                promises.push(models.person.add_roles_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.person_roles_fk), person_roles_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                person_roles_fk: updated_ids
            });
        }
    }
    /**
     * add_study_studyDesignDescriptors_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_studyDesignDescriptors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_studyDesignDescriptors_fk(id, study_studyDesignDescriptors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_studyDesignDescriptors_fk.forEach(idx => {
                promises.push(models.study.add_studyDesignDescriptors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_studyDesignDescriptors_fk), study_studyDesignDescriptors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_studyDesignDescriptors_fk: updated_ids
            });
        }
    }
    /**
     * add_study_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_unitCategories_fk(id, study_unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_unitCategories_fk.forEach(idx => {
                promises.push(models.study.add_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.study_unitCategories_fk), study_unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_unitCategories_fk: updated_ids
            });
        }
    }

    /**
     * remove_assay_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   assay_unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_assay_unitCategories_fk(id, assay_unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            assay_unitCategories_fk.forEach(idx => {
                promises.push(models.assay.remove_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.assay_unitCategories_fk), assay_unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                assay_unitCategories_fk: updated_ids
            });
        }
    }
    /**
     * remove_person_roles_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   person_roles_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_person_roles_fk(id, person_roles_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            person_roles_fk.forEach(idx => {
                promises.push(models.person.remove_roles_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.person_roles_fk), person_roles_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                person_roles_fk: updated_ids
            });
        }
    }
    /**
     * remove_study_studyDesignDescriptors_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_studyDesignDescriptors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_studyDesignDescriptors_fk(id, study_studyDesignDescriptors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_studyDesignDescriptors_fk.forEach(idx => {
                promises.push(models.study.remove_studyDesignDescriptors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_studyDesignDescriptors_fk), study_studyDesignDescriptors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_studyDesignDescriptors_fk: updated_ids
            });
        }
    }
    /**
     * remove_study_unitCategories_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_unitCategories_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_unitCategories_fk(id, study_unitCategories_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            study_unitCategories_fk.forEach(idx => {
                promises.push(models.study.remove_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.study_unitCategories_fk), study_unitCategories_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                study_unitCategories_fk: updated_ids
            });
        }
    }








    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return ontology_annotation.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return ontology_annotation.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of ontology_annotation.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[ontology_annotation.idAttribute()];
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
     * base64Encode - Encode  ontology_annotation to a base 64 String
     *
     * @return {string} The ontology_annotation object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The ontology_annotation object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of ontology_annotation.
     *
     * @return {object} The attributes of ontology_annotation in object form
     */
    stripAssociations() {
        let attributes = Object.keys(ontology_annotation.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of ontology_annotation that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of ontology_annotation that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of ontology_annotation.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}