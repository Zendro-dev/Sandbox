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
    model: 'study',
    storageType: 'sql',
    internalId: 'id',
    attributes: {
        filename: 'String',
        identifier: 'String',
        title: 'String',
        description: 'String',
        submissionDate: 'DateTime',
        publicReleaseDate: 'DateTime',
        publications_fk: '[String]',
        people_fk: '[String]',
        studyDesignDescriptors_fk: '[String]',
        protocols_fk: '[String]',
        materials_sources_fk: '[String]',
        materials_samples_fk: '[String]',
        materials_otherMaterials_fk: '[String]',
        processSequence_fk: '[String]',
        assays_fk: '[String]',
        factors_fk: '[String]',
        characteristicCategories_fk: '[String]',
        unitCategories_fk: '[String]',
        investigation_studies_fk: 'String',
        id: 'String'
    },
    associations: {
        materials_sources: {
            type: 'many_to_many',
            sourceKey: 'materials_sources_fk',
            target: 'source',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_materials_sources',
            targetKey: 'study_materials_sources_fk',
            keysIn: 'study'
        },
        materials_samples: {
            type: 'many_to_many',
            sourceKey: 'materials_samples_fk',
            target: 'sample',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_materials_samples',
            targetKey: 'study_materials_samples_fk',
            keysIn: 'study'
        },
        materials_otherMaterials: {
            type: 'many_to_many',
            sourceKey: 'materials_otherMaterials_fk',
            target: 'material',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_materials_otherMaterials',
            targetKey: 'study_materials_otherMaterials_fk',
            keysIn: 'study'
        },
        publications: {
            type: 'many_to_many',
            sourceKey: 'publications_fk',
            target: 'publication',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_publications',
            targetKey: 'study_publications_fk',
            keysIn: 'study'
        },
        people: {
            type: 'many_to_many',
            sourceKey: 'people_fk',
            target: 'person',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_people',
            targetKey: 'study_people_fk',
            keysIn: 'study'
        },
        studyDesignDescriptors: {
            type: 'many_to_many',
            sourceKey: 'studyDesignDescriptors_fk',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_studyDesignDescriptors',
            targetKey: 'study_studyDesignDescriptors_fk',
            keysIn: 'study'
        },
        protocols: {
            type: 'many_to_many',
            sourceKey: 'protocols_fk',
            target: 'protocol',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_protocols',
            targetKey: 'study_protocols_fk',
            keysIn: 'study'
        },
        processSequence: {
            type: 'one_to_many',
            target: 'process',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_processSequence',
            targetKey: 'study_processSequence_fk',
            keysIn: 'process'
        },
        assays: {
            type: 'one_to_many',
            target: 'assay',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_assays',
            targetKey: 'study_assays_fk',
            keysIn: 'assay'
        },
        factors: {
            type: 'many_to_many',
            sourceKey: 'factors_fk',
            target: 'factor',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_factors',
            targetKey: 'study_factors_fk',
            keysIn: 'study'
        },
        characteristicCategories: {
            type: 'many_to_many',
            sourceKey: 'characteristicCategories_fk',
            target: 'material_attribute',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_characteristicCategories',
            targetKey: 'study_characteristicCategories_fk',
            keysIn: 'study'
        },
        unitCategories: {
            type: 'many_to_many',
            sourceKey: 'unitCategories_fk',
            target: 'ontology_annotation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_unitCategories',
            targetKey: 'study_unitCategories_fk',
            keysIn: 'study'
        },
        comments: {
            type: 'one_to_many',
            target: 'comment',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'study_comments',
            targetKey: 'study_comments_fk',
            keysIn: 'comment'
        },
        investigation_studies: {
            type: 'many_to_one',
            target: 'investigation',
            targetStorageType: 'sql',
            implementation: 'foreignkeys',
            reverseAssociation: 'studies',
            targetKey: 'investigation_studies_fk',
            keysIn: 'study'
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

module.exports = class study extends Sequelize.Model {
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
            identifier: {
                type: Sequelize[dict['String']]
            },
            title: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            submissionDate: {
                type: Sequelize[dict['DateTime']]
            },
            publicReleaseDate: {
                type: Sequelize[dict['DateTime']]
            },
            publications_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            people_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            studyDesignDescriptors_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            protocols_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            materials_sources_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            materials_samples_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            materials_otherMaterials_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            processSequence_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            assays_fk: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            factors_fk: {
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
            investigation_studies_fk: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "study",
            tableName: "studies",
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
        study.belongsTo(models.investigation, {
            as: 'investigation_studies',
            foreignKey: 'investigation_studies_fk'
        });
        study.hasMany(models.process, {
            as: 'processSequence',
            foreignKey: 'study_processSequence_fk'
        });
        study.hasMany(models.assay, {
            as: 'assays',
            foreignKey: 'study_assays_fk'
        });
        study.hasMany(models.comment, {
            as: 'comments',
            foreignKey: 'study_comments_fk'
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
            field: study.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await study.readAllCursor(queryArg);
        cursorRes = cursorRes.studies.reduce(
            (map, obj) => ((map[obj[study.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(study.batchReadById, {
        cache: false,
    });

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * Read a single record by a given ID
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type study, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        return await study.readByIdLoader.load(id);
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
        options['where'] = helper.searchConditionsToSequelize(search, study.definition.attributes);
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
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), study.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => study.postReadCast(x))
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
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), study.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => study.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), study.definition.attributes);
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
     * addOne - The model implementation method for adding a record.
     *
     * @param {object} input - The input object.
     * @return {object} The created record 
     * @throw {Error} If the process fails, an error is thrown
     */
    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = study.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            study.postReadCast(result.dataValues)
            study.postReadCast(result._previousDataValues)
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
        input = study.preWriteCast(input)
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
            study.postReadCast(result.dataValues)
            study.postReadCast(result._previousDataValues)
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

        return `Bulk import of study records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_investigation_studies_fk - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_studies_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async add_investigation_studies_fk(id, investigation_studies_fk, benignErrorReporter) {
        try {
            let updated = await study.update({
                investigation_studies_fk: investigation_studies_fk
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
     * add_materials_sources_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_sources_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_materials_sources_fk(id, materials_sources_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_sources_fk.forEach(idx => {
                promises.push(models.source.add_study_materials_sources_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.materials_sources_fk), materials_sources_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_sources_fk: updated_ids
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
                promises.push(models.sample.add_study_materials_samples_fk(idx, [`${id}`], benignErrorReporter, false));
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
                promises.push(models.material.add_study_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
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
     * add_publications_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   publications_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_publications_fk(id, publications_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            publications_fk.forEach(idx => {
                promises.push(models.publication.add_study_publications_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.publications_fk), publications_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                publications_fk: updated_ids
            });
        }
    }
    /**
     * add_people_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   people_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_people_fk(id, people_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            people_fk.forEach(idx => {
                promises.push(models.person.add_study_people_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.people_fk), people_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                people_fk: updated_ids
            });
        }
    }
    /**
     * add_studyDesignDescriptors_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   studyDesignDescriptors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_studyDesignDescriptors_fk(id, studyDesignDescriptors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            studyDesignDescriptors_fk.forEach(idx => {
                promises.push(models.ontology_annotation.add_study_studyDesignDescriptors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.studyDesignDescriptors_fk), studyDesignDescriptors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                studyDesignDescriptors_fk: updated_ids
            });
        }
    }
    /**
     * add_protocols_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   protocols_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_protocols_fk(id, protocols_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocols_fk.forEach(idx => {
                promises.push(models.protocol.add_study_protocols_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.protocols_fk), protocols_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                protocols_fk: updated_ids
            });
        }
    }
    /**
     * add_factors_fk - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_factors_fk(id, factors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factors_fk.forEach(idx => {
                promises.push(models.factor.add_study_factors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.factors_fk), factors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factors_fk: updated_ids
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
                promises.push(models.material_attribute.add_study_characteristicCategories_fk(idx, [`${id}`], benignErrorReporter, false));
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
                promises.push(models.ontology_annotation.add_study_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
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
     * remove_investigation_studies_fk - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_studies_fk Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors
     */
    static async remove_investigation_studies_fk(id, investigation_studies_fk, benignErrorReporter) {
        try {
            let updated = await study.update({
                investigation_studies_fk: null
            }, {
                where: {
                    id: id,
                    investigation_studies_fk: investigation_studies_fk
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
     * remove_materials_sources_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   materials_sources_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_materials_sources_fk(id, materials_sources_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            materials_sources_fk.forEach(idx => {
                promises.push(models.source.remove_study_materials_sources_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.materials_sources_fk), materials_sources_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                materials_sources_fk: updated_ids
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
                promises.push(models.sample.remove_study_materials_samples_fk(idx, [`${id}`], benignErrorReporter, false));
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
                promises.push(models.material.remove_study_materials_otherMaterials_fk(idx, [`${id}`], benignErrorReporter, false));
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
     * remove_publications_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   publications_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_publications_fk(id, publications_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            publications_fk.forEach(idx => {
                promises.push(models.publication.remove_study_publications_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.publications_fk), publications_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                publications_fk: updated_ids
            });
        }
    }
    /**
     * remove_people_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   people_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_people_fk(id, people_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            people_fk.forEach(idx => {
                promises.push(models.person.remove_study_people_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.people_fk), people_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                people_fk: updated_ids
            });
        }
    }
    /**
     * remove_studyDesignDescriptors_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   studyDesignDescriptors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_studyDesignDescriptors_fk(id, studyDesignDescriptors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            studyDesignDescriptors_fk.forEach(idx => {
                promises.push(models.ontology_annotation.remove_study_studyDesignDescriptors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.studyDesignDescriptors_fk), studyDesignDescriptors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                studyDesignDescriptors_fk: updated_ids
            });
        }
    }
    /**
     * remove_protocols_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   protocols_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_protocols_fk(id, protocols_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            protocols_fk.forEach(idx => {
                promises.push(models.protocol.remove_study_protocols_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.protocols_fk), protocols_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                protocols_fk: updated_ids
            });
        }
    }
    /**
     * remove_factors_fk - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factors_fk Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_factors_fk(id, factors_fk, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            factors_fk.forEach(idx => {
                promises.push(models.factor.remove_study_factors_fk(idx, [`${id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.factors_fk), factors_fk);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                factors_fk: updated_ids
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
                promises.push(models.material_attribute.remove_study_characteristicCategories_fk(idx, [`${id}`], benignErrorReporter, false));
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
                promises.push(models.ontology_annotation.remove_study_unitCategories_fk(idx, [`${id}`], benignErrorReporter, false));
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
     * bulkAssociateStudyWithInvestigation_studies_fk - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_studies_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_studies_fk,
            id
        }) => {
            promises.push(super.update({
                investigation_studies_fk: investigation_studies_fk
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
     * bulkDisAssociateStudyWithInvestigation_studies_fk - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateStudyWithInvestigation_studies_fk(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "investigation_studies_fk");
        var promises = [];
        mappedForeignKeys.forEach(({
            investigation_studies_fk,
            id
        }) => {
            promises.push(super.update({
                investigation_studies_fk: null
            }, {
                where: {
                    id: id,
                    investigation_studies_fk: investigation_studies_fk
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
        return study.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return study.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of study.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[study.idAttribute()];
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
     * base64Encode - Encode  study to a base 64 String
     *
     * @return {string} The study object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The study object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of study.
     *
     * @return {object} The attributes of study in object form
     */
    stripAssociations() {
        let attributes = Object.keys(study.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of study that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of study that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of study.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}