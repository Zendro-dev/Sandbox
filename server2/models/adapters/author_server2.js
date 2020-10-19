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
const iriRegex = new RegExp('server2');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'author',
    storageType: 'sql-adapter',
    adapterName: 'author_server2',
    regex: 'server2',
    attributes: {
        name: 'String',
        author_id: 'String'
    },
    associations: {
        books: {
            type: 'to_many',
            target: 'book',
            targetKey: 'author_id',
            keyIn: 'book',
            targetStorageType: 'distributed-data-model'
        }
    },
    internalId: 'author_id',
    id: {
        name: 'author_id',
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

module.exports = class author_server2 extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init({

            author_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },
            name: {
                type: Sequelize[dict['String']]
            }


        }, {
            modelName: "author",
            tableName: "authors",
            sequelize
        });
    }

    static get adapterName() {
        return 'author_server2';
    }

    static get adapterType() {
        return 'sql-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(id) {
        let item = await author_server2.findByPk(id);
        if (item === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
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
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }
        return super.count(options);
    }

    static async readAllCursor(search, order, pagination) {
        // build the sequelize options object for cursor-based pagination
        let options = helper.buildCursorBasedSequelizeOptions(search, order, pagination, this.idAttribute());
        let records = await super.findAll(options);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after !== undefined || pagination.before !== undefined)) {
            let oppOptions = helper.buildOppositeSearchSequelize(search, order, pagination, this.idAttribute());
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

        try {
            const result = await this.sequelize.transaction(async (t) => {
                let item = await super.create(input, {
                    transaction: t
                });
                return item;
            });
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
        try {
            let result = await this.sequelize.transaction(async (t) => {
                let updated = await super.update(input, {
                    where: {
                        [this.idAttribute()]: input[this.idAttribute()]
                    },
                    returning: true,
                    transaction: t
                });
                return updated;
            });
            if (result[0] === 0) {
                throw new Error(`Record with ID = ${input[this.idAttribute()]} does not exist`);
            }
            return result[1][0];
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
        return `Bulk import of author_server2 records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(author);
    }




    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return author_server2.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return author_server2.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of author.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[author_server2.idAttribute()]
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
        let attributes = Object.keys(author_server2.definition.attributes);
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