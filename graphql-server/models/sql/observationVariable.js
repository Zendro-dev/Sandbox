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
    model: 'observationVariable',
    storageType: 'sql',
    attributes: {
        commonCropName: 'String',
        defaultValue: 'String',
        documentationURL: 'String',
        growthStage: 'String',
        institution: 'String',
        language: 'String',
        scientist: 'String',
        status: 'String',
        submissionTimestamp: 'DateTime',
        xref: 'String',
        observationVariableDbId: 'String',
        observationVariableName: 'String',
        methodDbId: 'String',
        scaleDbId: 'String',
        traitDbId: 'String',
        ontologyDbId: 'String'
    },
    associations: {
        method: {
            type: 'to_one',
            target: 'method',
            targetKey: 'methodDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'sql',
            label: 'methodName'
        },
        ontologyReference: {
            type: 'to_one',
            target: 'ontologyReference',
            targetKey: 'ontologyDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'sql',
            label: 'ontologyName'
        },
        scale: {
            type: 'to_one',
            target: 'scale',
            targetKey: 'scaleDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'sql',
            label: 'scaleName'
        },
        trait: {
            type: 'to_one',
            target: 'trait',
            targetKey: 'traitDbId',
            keyIn: 'observationVariable',
            targetStorageType: 'sql',
            label: 'traitName'
        },
        observations: {
            type: 'to_many',
            target: 'observation',
            targetKey: 'observationVariableDbId',
            keyIn: 'observation',
            targetStorageType: 'sql',
            label: 'observationVariableName',
            sublabel: 'value'
        }
    },
    internalId: 'observationVariableDbId',
    id: {
        name: 'observationVariableDbId',
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

module.exports = class observationVariable extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            observationVariableDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            defaultValue: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            growthStage: {
                type: Sequelize[dict['String']]
            },
            institution: {
                type: Sequelize[dict['String']]
            },
            language: {
                type: Sequelize[dict['String']]
            },
            scientist: {
                type: Sequelize[dict['String']]
            },
            status: {
                type: Sequelize[dict['String']]
            },
            submissionTimestamp: {
                type: Sequelize[dict['DateTime']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            observationVariableName: {
                type: Sequelize[dict['String']]
            },
            methodDbId: {
                type: Sequelize[dict['String']]
            },
            scaleDbId: {
                type: Sequelize[dict['String']]
            },
            traitDbId: {
                type: Sequelize[dict['String']]
            },
            ontologyDbId: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "observationVariable",
            tableName: "observationVariables",
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
        observationVariable.belongsTo(models.method, {
            as: 'method',
            foreignKey: 'methodDbId'
        });
        observationVariable.belongsTo(models.ontologyReference, {
            as: 'ontologyReference',
            foreignKey: 'ontologyDbId'
        });
        observationVariable.belongsTo(models.scale, {
            as: 'scale',
            foreignKey: 'scaleDbId'
        });
        observationVariable.belongsTo(models.trait, {
            as: 'trait',
            foreignKey: 'traitDbId'
        });
        observationVariable.hasMany(models.observation, {
            as: 'observations',
            foreignKey: 'observationVariableDbId'
        });
    }

    static async readById(id) {
        let item = await observationVariable.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = observationVariable.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, observationVariable.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), observationVariable.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => observationVariable.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), observationVariable.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => observationVariable.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), observationVariable.definition.attributes);
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
        input = observationVariable.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            observationVariable.postReadCast(result.dataValues)
            observationVariable.postReadCast(result._previousDataValues)
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
        input = observationVariable.preWriteCast(input)
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
            observationVariable.postReadCast(result.dataValues)
            observationVariable.postReadCast(result._previousDataValues)
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

        return `Bulk import of observationVariable records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_methodDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_methodDbId(observationVariableDbId, methodDbId) {
        let updated = await observationVariable.update({
            methodDbId: methodDbId
        }, {
            where: {
                observationVariableDbId: observationVariableDbId
            }
        });
        return updated;
    }
    /**
     * add_ontologyDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let updated = await observationVariable.update({
            ontologyDbId: ontologyDbId
        }, {
            where: {
                observationVariableDbId: observationVariableDbId
            }
        });
        return updated;
    }
    /**
     * add_scaleDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_scaleDbId(observationVariableDbId, scaleDbId) {
        let updated = await observationVariable.update({
            scaleDbId: scaleDbId
        }, {
            where: {
                observationVariableDbId: observationVariableDbId
            }
        });
        return updated;
    }
    /**
     * add_traitDbId - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_traitDbId(observationVariableDbId, traitDbId) {
        let updated = await observationVariable.update({
            traitDbId: traitDbId
        }, {
            where: {
                observationVariableDbId: observationVariableDbId
            }
        });
        return updated;
    }

    /**
     * remove_methodDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_methodDbId(observationVariableDbId, methodDbId) {
        let updated = await observationVariable.update({
            methodDbId: null
        }, {
            where: {
                observationVariableDbId: observationVariableDbId,
                methodDbId: methodDbId
            }
        });
        return updated;
    }
    /**
     * remove_ontologyDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let updated = await observationVariable.update({
            ontologyDbId: null
        }, {
            where: {
                observationVariableDbId: observationVariableDbId,
                ontologyDbId: ontologyDbId
            }
        });
        return updated;
    }
    /**
     * remove_scaleDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_scaleDbId(observationVariableDbId, scaleDbId) {
        let updated = await observationVariable.update({
            scaleDbId: null
        }, {
            where: {
                observationVariableDbId: observationVariableDbId,
                scaleDbId: scaleDbId
            }
        });
        return updated;
    }
    /**
     * remove_traitDbId - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_traitDbId(observationVariableDbId, traitDbId) {
        let updated = await observationVariable.update({
            traitDbId: null
        }, {
            where: {
                observationVariableDbId: observationVariableDbId,
                traitDbId: traitDbId
            }
        });
        return updated;
    }





    /**
     * bulkAssociateObservationVariableWithMethodDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationVariableWithMethodDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "methodDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            methodDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                methodDbId: methodDbId
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationVariableWithOntologyDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationVariableWithOntologyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "ontologyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontologyDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                ontologyDbId: ontologyDbId
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationVariableWithScaleDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationVariableWithScaleDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "scaleDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            scaleDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                scaleDbId: scaleDbId
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkAssociateObservationVariableWithTraitDbId - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateObservationVariableWithTraitDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "traitDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            traitDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                traitDbId: traitDbId
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }

    /**
     * bulkDisAssociateObservationVariableWithMethodDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationVariableWithMethodDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "methodDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            methodDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                methodDbId: null
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId,
                    methodDbId: methodDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationVariableWithOntologyDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationVariableWithOntologyDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "ontologyDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            ontologyDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                ontologyDbId: null
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId,
                    ontologyDbId: ontologyDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationVariableWithScaleDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationVariableWithScaleDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "scaleDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            scaleDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                scaleDbId: null
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId,
                    scaleDbId: scaleDbId
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }
    /**
     * bulkDisAssociateObservationVariableWithTraitDbId - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservationVariableWithTraitDbId(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "observationVariableDbId", "traitDbId");
        var promises = [];
        mappedForeignKeys.forEach(({
            traitDbId,
            observationVariableDbId
        }) => {
            promises.push(super.update({
                traitDbId: null
            }, {
                where: {
                    observationVariableDbId: observationVariableDbId,
                    traitDbId: traitDbId
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
        return observationVariable.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return observationVariable.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of observationVariable.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[observationVariable.idAttribute()]
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
        let attributes = Object.keys(observationVariable.definition.attributes);
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