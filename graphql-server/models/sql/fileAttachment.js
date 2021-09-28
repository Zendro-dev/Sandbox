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
const minioClient = require('../../utils/minio-connection');
const isImagePackage = require('is-image');
// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'fileAttachment',
    storageType: 'sql',
    attributes: {
        fileName: 'String',
        fileURL: 'String',
        mimeType: 'String',
        fileSize: 'Int',
        identifierName: 'String',
        investigation_id: 'String',
        study_id: 'String',
        assay_id: 'String',
        factor_id: 'String',
        material_id: 'String',
        protocol_id: 'String'
    },
    associations: {
        investigation: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'investigation',
            targetKey: 'investigation_id',
            keysIn: 'fileAttachment'
        },
        study: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'study',
            targetKey: 'study_id',
            keysIn: 'fileAttachment'
        },
        assay: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'assay',
            targetKey: 'assay_id',
            keysIn: 'fileAttachment'
        },
        factor: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'factor',
            targetKey: 'factor_id',
            keysIn: 'fileAttachment'
        },
        material: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'material',
            targetKey: 'material_id',
            keysIn: 'fileAttachment'
        },
        protocol: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'fileAttachments',
            targetStorageType: 'sql',
            target: 'protocol',
            targetKey: 'protocol_id',
            keysIn: 'fileAttachment'
        }
    },
    id: {
        name: 'id',
        type: 'Int'
    }
};
const DataLoader = require("dataloader");

const URL_IMG_PROXY = "http://localhost:8082/"
const IMG_BUCKET_NAME = "images";
const FILES_BUCKET_NAME = "test"

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class fileAttachment extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            fileName: {
                type: Sequelize[dict['String']]
            },
            fileURL: {
                type: Sequelize[dict['String']]
            },
            mimeType: {
                type: Sequelize[dict['String']]
            },
            fileSize: {
                type: Sequelize[dict['Int']]
            },
            identifierName: {
                type: Sequelize[dict['String']]
            },
            investigation_id: {
                type: Sequelize[dict['String']]
            },
            study_id: {
                type: Sequelize[dict['String']]
            },
            assay_id: {
                type: Sequelize[dict['String']]
            },
            factor_id: {
                type: Sequelize[dict['String']]
            },
            material_id: {
                type: Sequelize[dict['String']]
            },
            protocol_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "fileAttachment",
            tableName: "fileAttachments",
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

    static associate(models) {
        fileAttachment.belongsTo(models.investigation, {
            as: 'investigation',
            foreignKey: 'investigation_id'
        });
        fileAttachment.belongsTo(models.study, {
            as: 'study',
            foreignKey: 'study_id'
        });
        fileAttachment.belongsTo(models.assay, {
            as: 'assay',
            foreignKey: 'assay_id'
        });
        fileAttachment.belongsTo(models.factor, {
            as: 'factor',
            foreignKey: 'factor_id'
        });
        fileAttachment.belongsTo(models.material, {
            as: 'material',
            foreignKey: 'material_id'
        });
        fileAttachment.belongsTo(models.protocol, {
            as: 'protocol',
            foreignKey: 'protocol_id'
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
            field: fileAttachment.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await fileAttachment.readAllCursor(queryArg);
        cursorRes = cursorRes.fileAttachments.reduce(
            (map, obj) => ((map[obj[fileAttachment.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(fileAttachment.batchReadById, {
        cache: false,
    });

    static async readById(id) {
        return await fileAttachment.readByIdLoader.load(id);
    }
    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, fileAttachment.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), fileAttachment.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => fileAttachment.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), fileAttachment.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => fileAttachment.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), fileAttachment.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            fileAttachments: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = fileAttachment.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            fileAttachment.postReadCast(result.dataValues)
            fileAttachment.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }

    }

    static async uploadFileAttachment(input){

        if(input.file){
            console.log("FILE: ", input.file);
            const {filename, mimetype, createReadStream} =  await input.file.file;
            const stream = createReadStream();
            input['fileName'] = input.fileName ?? filename;
            const bucket_name = isImagePackage(input.fileName) ?  IMG_BUCKET_NAME : FILES_BUCKET_NAME;
            const exists = await minioClient.fileExists(input.fileName, bucket_name);
            console.log("EXISTS: ", exists);
            if( !exists) {
                const upload = await minioClient.uploadFile(stream, input.fileName, bucket_name);
                if(! upload.success){
                    throw upload.error;
                }
                input['mimeType'] = mimetype;
                input['fileURL'] = upload.url;
                input['fileSize'] = upload.fileSize;
            }else{
                throw new Error(`File with name ${input.fileName} already exists.`)
            }

        }
        return await this.addOne(input);
    }

    static async updateFileAttachment(input){

        if(input.file){
            console.log("FILE: ", input.file);

            
            const {filename, mimetype, createReadStream} =  await input.file.file;
            const stream = createReadStream();
            input['fileName'] = input.fileName ?? filename;
            
            const bucket_name = isImagePackage(input.fileName) ?  IMG_BUCKET_NAME : FILES_BUCKET_NAME;
            
            // delete old attachment
            let oldAttachment = await super.findByPk(input.id);
            let deleted = await minioClient.deleteFile(oldAttachment.fileName, bucket_name);
            if(!deleted.success){
                throw deleted.error;
            }
            
            const exists = await minioClient.fileExists(input.fileName, bucket_name);
            console.log("EXISTS: ", exists);
            if( !exists) {
                const upload = await minioClient.uploadFile(stream, input.fileName, bucket_name);
                if(! upload.success){
                    throw upload.error;
                }
                input['mimeType'] = mimetype;
                input['fileURL'] = upload.url;
                input['fileSize'] = upload.fileSize;
            }else{
                throw new Error(`File with name ${input.fileName} already exists.`)
            }

        }
        return await this.updateOne(input);
    }

    urlThumbnail({width, height, format}){
        if(this.isImage() ){
            let url = `${URL_IMG_PROXY}unsafe/fit/${width}/${height}/sm/0/plain/s3://images/${this.fileName}@${format}`;
            return url;
        }
        return "This file attachment is not an image";
    }

    isImage(){
        return isImagePackage(this.fileName);
    }

    static async deleteFileAttachment(id){
        let attachment = await super.findByPk(id);
        if (attachment === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        const bucket_name = isImagePackage(attachment.fileName) ?  IMG_BUCKET_NAME : FILES_BUCKET_NAME;
        let deleted = await minioClient.deleteFile(attachment.fileName, bucket_name);
        if(!deleted.success){
          throw deleted.error;
        }
        return  this.deleteOne(id);
    }

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

    static async updateOne(input) {
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        input = fileAttachment.preWriteCast(input)
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
            fileAttachment.postReadCast(result.dataValues)
            fileAttachment.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }

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

        return `Bulk import of fileAttachment records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_investigation_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_investigation_id(id, investigation_id) {
        let updated = await fileAttachment.update({
            investigation_id: investigation_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_study_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_study_id(id, study_id) {
        let updated = await fileAttachment.update({
            study_id: study_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_assay_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_assay_id(id, assay_id) {
        let updated = await fileAttachment.update({
            assay_id: assay_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_factor_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_factor_id(id, factor_id) {
        let updated = await fileAttachment.update({
            factor_id: factor_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_material_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_material_id(id, material_id) {
        let updated = await fileAttachment.update({
            material_id: material_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }
    /**
     * add_protocol_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_protocol_id(id, protocol_id) {
        let updated = await fileAttachment.update({
            protocol_id: protocol_id
        }, {
            where: {
                id: id
            }
        });
        return updated;
    }

    /**
     * remove_investigation_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   investigation_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_investigation_id(id, investigation_id) {
        let updated = await fileAttachment.update({
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
     * remove_study_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_study_id(id, study_id) {
        let updated = await fileAttachment.update({
            study_id: null
        }, {
            where: {
                id: id,
                study_id: study_id
            }
        });
        return updated;
    }
    /**
     * remove_assay_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   assay_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_assay_id(id, assay_id) {
        let updated = await fileAttachment.update({
            assay_id: null
        }, {
            where: {
                id: id,
                assay_id: assay_id
            }
        });
        return updated;
    }
    /**
     * remove_factor_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   factor_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_factor_id(id, factor_id) {
        let updated = await fileAttachment.update({
            factor_id: null
        }, {
            where: {
                id: id,
                factor_id: factor_id
            }
        });
        return updated;
    }
    /**
     * remove_material_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   material_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_material_id(id, material_id) {
        let updated = await fileAttachment.update({
            material_id: null
        }, {
            where: {
                id: id,
                material_id: material_id
            }
        });
        return updated;
    }
    /**
     * remove_protocol_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   protocol_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_protocol_id(id, protocol_id) {
        let updated = await fileAttachment.update({
            protocol_id: null
        }, {
            where: {
                id: id,
                protocol_id: protocol_id
            }
        });
        return updated;
    }





    /**
     * bulkAssociateFileAttachmentWithInvestigation_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput) {
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
     * bulkAssociateFileAttachmentWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithStudy_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_id,
            id
        }) => {
            promises.push(super.update({
                study_id: study_id
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
     * bulkAssociateFileAttachmentWithAssay_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithAssay_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_id,
            id
        }) => {
            promises.push(super.update({
                assay_id: assay_id
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
     * bulkAssociateFileAttachmentWithFactor_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithFactor_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_id,
            id
        }) => {
            promises.push(super.update({
                factor_id: factor_id
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
     * bulkAssociateFileAttachmentWithMaterial_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithMaterial_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_id,
            id
        }) => {
            promises.push(super.update({
                material_id: material_id
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
     * bulkAssociateFileAttachmentWithProtocol_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateFileAttachmentWithProtocol_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_id,
            id
        }) => {
            promises.push(super.update({
                protocol_id: protocol_id
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
     * bulkDisAssociateFileAttachmentWithInvestigation_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithInvestigation_id(bulkAssociationInput) {
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
     * bulkDisAssociateFileAttachmentWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithStudy_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "study_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            study_id,
            id
        }) => {
            promises.push(super.update({
                study_id: null
            }, {
                where: {
                    id: id,
                    study_id: study_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateFileAttachmentWithAssay_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithAssay_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "assay_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            assay_id,
            id
        }) => {
            promises.push(super.update({
                assay_id: null
            }, {
                where: {
                    id: id,
                    assay_id: assay_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateFileAttachmentWithFactor_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithFactor_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "factor_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            factor_id,
            id
        }) => {
            promises.push(super.update({
                factor_id: null
            }, {
                where: {
                    id: id,
                    factor_id: factor_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateFileAttachmentWithMaterial_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithMaterial_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "material_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            material_id,
            id
        }) => {
            promises.push(super.update({
                material_id: null
            }, {
                where: {
                    id: id,
                    material_id: material_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateFileAttachmentWithProtocol_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFileAttachmentWithProtocol_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "id", "protocol_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            protocol_id,
            id
        }) => {
            promises.push(super.update({
                protocol_id: null
            }, {
                where: {
                    id: id,
                    protocol_id: protocol_id
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
        return fileAttachment.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return fileAttachment.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of fileAttachment.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[fileAttachment.idAttribute()]
    }

    static get definition() {
        return definition;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(fileAttachment.definition.attributes);
        attributes.push('id');
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    static externalIdsObject() {
        return {};
    }

}