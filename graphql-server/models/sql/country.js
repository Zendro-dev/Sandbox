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
    model: 'country',
    storageType: 'SQL',
    attributes: {
        name: 'String',
        country_id: 'String',
        continent_id: 'String',
        river_ids: '[String]'
    },
    associations: {
        unique_capital: {
            type: 'one_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'unique_country',
            target: 'capital',
            targetKey: 'country_id',
            keysIn: 'capital',
            targetStorageType: 'sql'
        },
        cities: {
            type: 'one_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'country',
            target: 'city',
            targetKey: 'country_id',
            keysIn: 'city',
            targetStorageType: 'cassandra'
        },
        rivers: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'countries',
            target: 'river',
            targetKey: 'country_ids',
            sourceKey: 'river_ids',
            keysIn: 'country',
            targetStorageType: 'sql'
        },
        continent: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'countries',
            target: 'continent',
            targetKey: 'continent_id',
            keysIn: 'country',
            targetStorageType: 'sql'
        }
    },
    internalId: 'country_id',
    id: {
        name: 'country_id',
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

module.exports = class country extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            country_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            },
            continent_id: {
                type: Sequelize[dict['String']]
            },
            river_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            }


        }, {
            modelName: "country",
            tableName: "countries",
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
        country.hasOne(models.capital, {
            as: 'unique_capital',
            foreignKey: 'country_id'
        });
        country.belongsTo(models.continent, {
            as: 'continent',
            foreignKey: 'continent_id'
        });
    }

    static async readById(id) {
        let item = await country.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = country.postReadCast(item)
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, country.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), country.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => country.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), country.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => country.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), country.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            countries: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = country.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            country.postReadCast(result.dataValues)
            country.postReadCast(result._previousDataValues)
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
        input = country.preWriteCast(input)
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
            country.postReadCast(result.dataValues)
            country.postReadCast(result._previousDataValues)
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

        return `Bulk import of country records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_continent_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   country_id   IdAttribute of the root model to be updated
     * @param {Id}   continent_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_continent_id(country_id, continent_id) {
        let updated = await country.update({
            continent_id: continent_id
        }, {
            where: {
                country_id: country_id
            }
        });
        return updated;
    }
    /**
     * add_river_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   country_id   IdAttribute of the root model to be updated
     * @param {Array}   river_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_river_ids(country_id, river_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            river_ids.forEach(idx => {
                promises.push(models.river.add_country_ids(idx, [`${country_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(country_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.river_ids), river_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                river_ids: updated_ids
            });
        }
    }

    /**
     * remove_continent_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   country_id   IdAttribute of the root model to be updated
     * @param {Id}   continent_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_continent_id(country_id, continent_id) {
        let updated = await country.update({
            continent_id: null
        }, {
            where: {
                country_id: country_id,
                continent_id: continent_id
            }
        });
        return updated;
    }
    /**
     * remove_river_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   country_id   IdAttribute of the root model to be updated
     * @param {Array}   river_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_river_ids(country_id, river_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            river_ids.forEach(idx => {
                promises.push(models.river.remove_country_ids(idx, [`${country_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(country_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.river_ids), river_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                river_ids: updated_ids
            });
        }
    }





    /**
     * bulkAssociateCountryWithContinent_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCountryWithContinent_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "country_id", "continent_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            continent_id,
            country_id
        }) => {
            promises.push(super.update({
                continent_id: continent_id
            }, {
                where: {
                    country_id: country_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateCountryWithContinent_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCountryWithContinent_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "country_id", "continent_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            continent_id,
            country_id
        }) => {
            promises.push(super.update({
                continent_id: null
            }, {
                where: {
                    country_id: country_id,
                    continent_id: continent_id
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
        return country.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return country.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of country.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[country.idAttribute()]
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
        let attributes = Object.keys(country.definition.attributes);
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