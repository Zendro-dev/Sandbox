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
    model: 'local_book',
    storageType: 'sql',
    attributes: {
        book_id: 'String',
        name: 'String',
        country_ids: '[String]',
        publisher_id: 'String'
    },
    associations: {
        local_countries: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'available_local_books',
            target: 'local_country',
            targetKey: 'book_ids',
            sourceKey: 'country_ids',
            keysIn: 'local_book',
            targetStorageType: 'sql'
        },
        local_publisher: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'local_books',
            target: 'local_publisher',
            targetKey: 'publisher_id',
            keysIn: 'local_book',
            targetStorageType: 'sql'
        }
    },
    internalId: 'book_id',
    id: {
        name: 'book_id',
        type: 'String'
    }
};
const DataLoader = require("dataloader");

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

module.exports = class local_book extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            book_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            },
            country_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            publisher_id: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "local_book",
            tableName: "local_books",
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
        local_book.belongsTo(models.local_publisher, {
            as: 'local_publisher',
            foreignKey: 'publisher_id'
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
            field: local_book.idAttribute(),
            value: keys.join(),
            valueType: "Array",
        };
        let cursorRes = await local_book.readAllCursor(queryArg);
        cursorRes = cursorRes.local_books.reduce(
            (map, obj) => ((map[obj[local_book.idAttribute()]] = obj), map), {}
        );
        return keys.map(
            (key) =>
            cursorRes[key] || new Error(`Record with ID = "${key}" does not exist`)
        );
    }

    static readByIdLoader = new DataLoader(local_book.batchReadById, {
        cache: false,
    });

    static async readById(id) {
        return await local_book.readByIdLoader.load(id);
    }
    static async countRecords(search) {
        let options = {}
        options['where'] = helper.searchConditionsToSequelize(search, local_book.definition.attributes);
        return super.count(options);
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        // build the sequelize options object for limit-offset-based pagination
        let options = helper.buildLimitOffsetSequelizeOptions(search, order, pagination, this.idAttribute(), local_book.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => local_book.postReadCast(x))
        // validationCheck after read
        return validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), local_book.definition.attributes);
        let records = await super.findAll(options);

        records = records.map(x => local_book.postReadCast(x))

        // validationCheck after read
        records = await validatorUtil.bulkValidateData('validateAfterRead', this, records, benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), local_book.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            local_books: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);
        input = local_book.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            local_book.postReadCast(result.dataValues)
            local_book.postReadCast(result._previousDataValues)
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
        input = local_book.preWriteCast(input)
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
            local_book.postReadCast(result.dataValues)
            local_book.postReadCast(result._previousDataValues)
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

        return `Bulk import of local_book records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
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
     * add_publisher_id - field Mutation (model-layer) for to_one associationsArguments to add
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   publisher_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_publisher_id(book_id, publisher_id) {
        let updated = await local_book.update({
            publisher_id: publisher_id
        }, {
            where: {
                book_id: book_id
            }
        });
        return updated;
    }
    /**
     * add_country_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Array}   country_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_country_ids(book_id, country_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            country_ids.forEach(idx => {
                promises.push(models.local_country.add_book_ids(idx, [`${book_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(book_id);
        if (record !== null) {
            let updated_ids = helper.unionIds(JSON.parse(record.country_ids), country_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                country_ids: updated_ids
            });
        }
    }

    /**
     * remove_publisher_id - field Mutation (model-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   publisher_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_publisher_id(book_id, publisher_id) {
        let updated = await local_book.update({
            publisher_id: null
        }, {
            where: {
                book_id: book_id,
                publisher_id: publisher_id
            }
        });
        return updated;
    }
    /**
     * remove_country_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Array}   country_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_country_ids(book_id, country_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            country_ids.forEach(idx => {
                promises.push(models.local_country.remove_book_ids(idx, [`${book_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let record = await super.findByPk(book_id);
        if (record !== null) {
            let updated_ids = helper.differenceIds(JSON.parse(record.country_ids), country_ids);
            updated_ids = JSON.stringify(updated_ids);
            await record.update({
                country_ids: updated_ids
            });
        }
    }





    /**
     * bulkAssociateLocal_bookWithPublisher_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateLocal_bookWithPublisher_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "book_id", "publisher_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            publisher_id,
            book_id
        }) => {
            promises.push(super.update({
                publisher_id: publisher_id
            }, {
                where: {
                    book_id: book_id
                }
            }));
        })
        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateLocal_bookWithPublisher_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateLocal_bookWithPublisher_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "book_id", "publisher_id");
        var promises = [];
        mappedForeignKeys.forEach(({
            publisher_id,
            book_id
        }) => {
            promises.push(super.update({
                publisher_id: null
            }, {
                where: {
                    book_id: book_id,
                    publisher_id: publisher_id
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
        return local_book.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return local_book.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of local_book.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[local_book.idAttribute()]
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
        let attributes = Object.keys(local_book.definition.attributes);
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