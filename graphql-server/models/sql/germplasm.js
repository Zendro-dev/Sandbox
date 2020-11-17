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
    model: 'germplasm',
    storageType: 'sql',
    attributes: {
        accessionNumber: 'String',
        acquisitionDate: 'Date',
        breedingMethodDbId: 'String',
        commonCropName: 'String',
        countryOfOriginCode: 'String',
        defaultDisplayName: 'String',
        documentationURL: 'String',
        germplasmGenus: 'String',
        germplasmName: 'String',
        germplasmPUI: 'String',
        germplasmPreprocessing: 'String',
        germplasmSpecies: 'String',
        germplasmSubtaxa: 'String',
        instituteCode: 'String',
        instituteName: 'String',
        pedigree: 'String',
        seedSource: 'String',
        seedSourceDescription: 'String',
        speciesAuthority: 'String',
        subtaxaAuthority: 'String',
        xref: 'String',
        germplasmDbId: 'String',
        biologicalStatusOfAccessionCode: 'String'
    },
    associations: {
        breedingMethod: {
            type: 'to_one',
            target: 'breedingMethod',
            targetKey: 'breedingMethodDbId',
            keyIn: 'germplasm',
            targetStorageType: 'sql',
            label: 'breedingMethodName'
        },
        observationUnits: {
            type: 'to_many',
            target: 'observationUnit',
            targetKey: 'germplasmDbId',
            keyIn: 'observationUnit',
            targetStorageType: 'sql',
            label: 'observationUnitName'
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'germplasmDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationVariableName',
            sublabel: 'value'
        }
    },
    internalId: 'germplasmDbId',
    id: {
        name: 'germplasmDbId',
        type: 'String'
    }
};

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class germplasm extends Sequelize.Model {

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

    static async readById(id) {
        let item = await germplasm.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = germplasm.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, germplasm.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), germplasm.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => germplasm.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
            pageInfo
        };
    }

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

        return `Bulk import of germplasm records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     */
    static async add_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let updated = await germplasm.update({
            breedingMethodDbId: breedingMethodDbId
        }, {
            where: {
                germplasmDbId: germplasmDbId
            }
        });
        return updated;
    }

    /**
     * remove_breedingMethodDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let updated = await germplasm.update({
            breedingMethodDbId: null
        }, {
            where: {
                germplasmDbId: germplasmDbId,
                breedingMethodDbId: breedingMethodDbId
            }
        });
        return updated;
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
        return this[germplasm.idAttribute()]
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
        let attributes = Object.keys(germplasm.definition.attributes);
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