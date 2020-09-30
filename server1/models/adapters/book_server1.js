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

const remoteCenzontleURL = "";
const iriRegex = new RegExp('server1');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'book',
    storageType: 'cassandra-adapter',
    adapterName: 'book_server1',
    regex: 'server1',
    attributes: {
        title: 'String',
        author_id: 'String',
        book_id: 'String'
    },
    associations: {
        author: {
            type: 'to_one',
            target: 'author',
            targetKey: 'author_id',
            keyIn: 'book',
            targetStorageType: 'distributed-data-model'
        }
    },
    internalId: 'book_id',
    id: {
        name: 'book_id',
        type: 'String'
    }
};

const stringAttributeArray = ['title', 'author_id', 'book_id'];

/**
 * module - Creates a sequelize model
 *
 * @param  {object} sequelize Sequelize instance.
 * @param  {object} DataTypes Allowed sequelize data types.
 * @return {object}           Sequelize model with associations defined
 */

class book_server1 {

    constructor(input) {
        for (let key of Object.keys(input)) {
            this[key] = input[key];
        }
    }

    /* static init(sequelize, DataTypes){
      return super.init({

                  book_id : {
            type : Sequelize[ dict['String'] ],
            primaryKey: true
          },
                                      title: {
              type: Sequelize[ dict['String'] ]        }
          ,                      author_id: {
              type: Sequelize[ dict['String'] ]        }
                

      },{       modelName: "book",
        tableName: "books",
        sequelize
       } );
    }*/

    get storageHandler() {
        // defined below by `Object.defineProperty`
        return book_server1.storageHandler
    }

    static get adapterName() {
        return 'book_server1';
    }

    static get adapterType() {
        return 'cassandra-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    /**
     * encloseStringAttributesInApostrophes - Cassandra expects String values to be 
     * enclosed in apostrophes (see https://docs.datastax.com/en/cql-oss/3.x/cql/cql_reference/valid_literal_r.html). This method checks
     * all string attributes of book_server1, and if the value does not start with an apostrophe (index 0), the value is enclosed
     * in apostrophes.
     * @param {Object} obj - The object to be examined
     */
    static encloseStringAttributesInApostrophes(obj) {
        for (let key of Object.keys(obj)) {
            if (definition.attributes[key] === 'String' && obj[key].indexOf("'") !== 0) {
                obj[key] = `'${obj[key]}'`;
            }
        }
    }

    static async readById(id) {
        // -- Create a list of the table columns
        const query = `SELECT book_id, title, author_id, token(book_id) as toke FROM books WHERE book_id = ?`;
        let queryResult = await this.storageHandler.execute(query, [id], {
            prepare: true
        });
        let firstResult = queryResult.first();
        if (firstResult === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        let item = new book_server1(firstResult);
        return item;
    }

    static async countRecords(search, filtering) {
        let options = {};
        let result = 0;
        let arg_cassandra = ';';
        if (search !== undefined) {

            //check
            if (typeof search !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            let arg = new searchArg(search);
            arg_cassandra = 'WHERE ' + arg.toCassandra('book_id', filtering, stringAttributeArray);
        }
        const query = 'SELECT COUNT(*) AS count FROM books ' + arg_cassandra;
        let queryResult = await this.storageHandler.execute(query);
        let item = queryResult.first();
        result = parseInt(item['count']);
        return result;
    }

    static async readAllCursor(search, pagination, filteringAllowed) {
        // === Set variables ===

        let offsetCursor = pagination ? pagination.after : null;
        let arg_cassandra = ';';
        let searchTerms = search;

        // === Set pagination offset if needed ===

        /*
         * In this section, a special operator is used: "tgt", meaning "TOKEN > TOKEN".
         * This operator is implemented in utils/search-argument.js, toCassandra(idAttribute, allowFiltering)
         *
         * The Cassandra database is ordered by the TOKEN of the ID value, so if we want to cut away entries above the cursor,
         * we need to enforce the condition TOKEN(id) > TOKEN(cursor_id), which is realized here by: id TGT cursor_id
         */

        if (helper.isNotUndefinedAndNotNull(offsetCursor)) {
            let decoded_cursor = JSON.parse(this.base64Decode(offsetCursor));
            let cursorId = decoded_cursor['book_id'];
            let cursorSearchCondition = new {
                field: 'book_id',
                value: {
                    value: cursorId
                },
                operator: 'tgt',
                search: undefined
            };
            if (helper.isNotUndefinedAndNotNull(search)) {
                // -- Use *both* the given search condition and the cursor --
                searchTerms = new searchArg({
                    field: null,
                    value: null,
                    operator: 'and',
                    search: [search, cursorSearchCondition]
                });
            } else {
                // -- Use only the cursor --
                searchTerms = new searchArg(cursorSearchCondition);
            }
        }

        // === Construct CQL statement ===

        if (searchTerms && searchTerms.value && searchTerms.value.value) {
            searchTerms = new searchArg(searchTerms);
            arg_cassandra = ' ' + searchTerms.toCassandra('book_id', filteringAllowed, stringAttributeArray) + ';';
        }

        // -- Create a list of the table columns


        let query = 'SELECT book_id, title, author_id, token(book_id) as toke FROM books' + arg_cassandra;

        // === Set page size if needed ===

        let options = {};
        if (pagination && pagination.limit) {
            options.fetchSize = parseInt(pagination.limit);
        }

        // === Call to database ===

        const result = await this.storageHandler.execute(query, [], options);

        // === Construct return object ===

        const rows = result.rows.map(row => {
            let edge = {};
            let rowAsbook = new book_server1(row);
            edge.node = rowAsbook;
            edge.cursor = rowAsbook.base64Enconde();
            return edge;
        });
        let nextCursor = null;
        let hasNextCursor = false;
        /*
         * The pageState attribute is where Cassandra stores its own version of a cursor.
         * We cannot use it directly, because Cassandra uses different conventions. 
         * But its presence shows that there is a following page.
         */
        if (helper.isNotUndefinedAndNotNull(result.pageState)) {
            let maxIndex = rows.length - 1;
            nextCursor = rows[maxIndex].cursor;
            hasNextCursor = true;
        }

        let pageInfo = {
            endCursor: nextCursor,
            hasNextPage: hasNextCursor
        }
        return {
            edges: rows,
            pageInfo: pageInfo
        };
    }

    static async addOne({
        book_id,
        title,
        author_id
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            book_id,
            title,
            author_id
        });
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input);
        try {
            this.encloseStringAttributesInApostrophes(input);
            const fields = Object.keys(input).join(', ');
            const values = Object.values(input).join(', ');
            const query = 'INSERT INTO books (' + fields + ') VALUES (' + values + ')';
            await book_server1.storageHandler.execute(query);
            let checkQuery = (await this.storageHandler.execute(`SELECT * FROM books WHERE book_id = ${input[definition.internalId]}`)).rows[0];
            let response = new book_server1(checkQuery);
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async deleteOne(id) {
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForDelete', this, id);
        const mutation = `DELETE FROM books WHERE book_id = ${id}`;
        await this.storageHandler.execute(mutation);
        queryResponse = await this.storageHandler.execute(query);
        if (helper.isEmptyArray(queryResponse.rows)) {
            return 'Item successfully deleted';
        }
        throw new Error('Record was not deleted!');
    }

    static async updateOne({
        book_id,
        title,
        author_id
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            book_id,
            title,
            author_id
        });
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input);
        try {
            this.encloseStringAttributesInApostrophes(input);
            let idValue = input[this.idAttribute()];
            delete input[this.idAttribute()];
            let inputKeys = Object.keys(input);
            // An update that does not change the attributes must not execute the following CQL statement
            if (inputKeys.length > 0) {
                let mutation = `UPDATE books SET `;
                mutation += inputKeys.map(key => `${key} = ${input[key]}`).join(', ');
                mutation += ` WHERE book_id = ${idValue};`;
                await this.storageHandler.execute(mutation);
            }
            let checkQuery = (await this.storageHandler.execute(`SELECT * FROM books WHERE book_id = ${idValue}`)).rows[0];
            let response = new book_server1(checkQuery);
            return response;
        } catch (error) {
            throw error;
        }
    }


    /**
     * add_author_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   author_id Foreign Key (stored in "Me") of the Association to be updated.
     */




    static async add_author_id(book_id, author_id) {
        const mutationCql = `UPDATE books SET author_id = ? WHERE book_id = ${book_id}`;
        await this.storageHandler.execute(mutationCql, [`${author_id}`], {
            prepare: true
        });
        const checkCql = `SELECT * FROM books WHERE book_id = ${book_id}`;
        let result = await this.storageHandler.execute(checkCql);
        return new book_server1(result.first());
    }


    /**
     * remove_author_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   book_id   IdAttribute of the root model to be updated
     * @param {Id}   author_id Foreign Key (stored in "Me") of the Association to be updated.
     */




    static async remove_author_id(book_id, author_id) {
        const mutationCql = `UPDATE books SET author_id = ? WHERE book_id = ${book_id}`;
        await this.storageHandler.execute(mutationCql, [null], {
            prepare: true
        });
        const checkCql = `SELECT * FROM books WHERE book_id = ${book_id}`;
        let result = await this.storageHandler.execute(checkCql);
        return new book_server1(result.first());
    }





    static bulkAddCsv(context) {
        throw new Error('Bulk Adding from a CSV file is currently not implemented!');
        /*
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
        return `Bulk import of book_server1 records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
        */
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(book);
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return book_server1.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return book_server1.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of book.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[book_server1.idAttribute()]
    }

    static get definition() {
        let def = definition;
        def.attributes.toke = 'String';
        return def;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(book_server1.definition.attributes);
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

module.exports.getAndConnectDataModelClass = function(cassandraDriver) {
    return Object.defineProperty(book_server1, 'storageHandler', {
        value: cassandraDriver,
        writable: false, // cannot be changed in the future
        enumerable: true,
        configurable: false
    })
}