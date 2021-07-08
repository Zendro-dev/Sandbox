const _ = require('lodash');
const globals = require('../../config/globals');
const Sequelize = require('sequelize');
const dict = require('../../utils/graphql-sequelize-types');
const validatorUtil = require('../../utils/validatorUtil');
const helper = require('../../utils/helper');
const searchArg = require('../../utils/search-argument');
const path = require('path');
const fileTools = require('../../utils/file-tools');
const helpersAcl = require('../../utils/helpers-acl');
const email = require('../../utils/email');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const models = require(path.join(__dirname, '..', 'index.js'));

const remoteZendroURL = "";
const iriRegex = new RegExp('instance1');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'book',
    storageType: 'sql-adapter',
    adapterName: 'book_instance1',
    regex: 'instance1',
    attributes: {
        book_id: 'String',
        name: 'String',
        country_ids: '[String]',
        publisher_id: 'String'
    },
    associations: {
        countries: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'available_books',
            target: 'country',
            targetKey: 'book_ids',
            sourceKey: 'country_ids',
            keysIn: 'book',
            targetStorageType: 'distributed-data-model'
        },
        publisher: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'books',
            target: 'publisher',
            targetKey: 'publisher_id',
            keysIn: 'book',
            targetStorageType: 'distributed-data-model'
        }
    },
    internalId: 'book_id',
    useDataLoader: false,
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

module.exports = class book_instance1 extends Sequelize.Model {

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
            modelName: "book",
            tableName: "books",
            sequelize
        });
    }

    static get adapterName() {
        return 'book_instance1';
    }

    static get adapterType() {
        return 'sql-adapter';
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

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(id) {
        let item = await book_instance1.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        item = book_instance1.postReadCast(item)
        return item;
    }
    static countRecords(search) {
        let options = {};

        /*
         * Search conditions
         */
        if (search !== undefined && search !== null) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize(book_instance1.definition.attributes);
            options['where'] = arg_sequelize;
        }
        return super.count(options);
    }

    static async readAllCursor(search, order, pagination) {
        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute(), book_instance1.definition.attributes);
        let records = await super.findAll(options);
        records = records.map(x => book_instance1.postReadCast(x))

        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, {
                ...pagination,
                includeCursor: false
            }, this.idAttribute(), book_instance1.definition.attributes);
            oppRecords = await super.findAll(oppOptions);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo,
            books: edges.map((edge) => edge.node)
        };
    }

    static async addOne(input) {
        input = book_instance1.preWriteCast(input)
        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
            book_instance1.postReadCast(result.dataValues)
            book_instance1.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }

    }

    static async deleteOne(id) {
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
        input = book_instance1.preWriteCast(input)
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
            book_instance1.postReadCast(result.dataValues)
            book_instance1.postReadCast(result._previousDataValues)
            return result;
        } catch (error) {
            throw error;
        }
    }


    /**
     * add_publisher_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   publisher_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async add_publisher_id(book_id, publisher_id) {
        let updated = await super.update({
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
                promises.push(models.country.add_book_ids(idx, [`${book_id}`], benignErrorReporter, false));
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
     * remove_publisher_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   publisher_id Foreign Key (stored in "Me") of the Association to be updated.
     */



    static async remove_publisher_id(book_id, publisher_id) {
        let updated = await super.update({
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
                promises.push(models.country.remove_book_ids(idx, [`${book_id}`], benignErrorReporter, false));
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
        return `Bulk import of book_instance1 records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(definition);
    }

    /**
     * bulkAssociateBookWithPublisher_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateBookWithPublisher_id(bulkAssociationInput) {
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
     * bulkDisAssociateBookWithPublisher_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateBookWithPublisher_id(bulkAssociationInput) {
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
        return book_instance1.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return book_instance1.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of book_instance1.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[book_instance1.idAttribute()]
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
        let attributes = Object.keys(book_instance1.definition.attributes);
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