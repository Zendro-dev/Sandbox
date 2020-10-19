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
// const client = require('../../utils/cassandra-client');
const Uuid = require('cassandra-driver').types.Uuid;

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'cat',
    storageType: 'cassandra',
    attributes: {
        name: 'String',
        cat_id: 'String',
        person_id: 'String',
        house_id: 'String'
    },
    associations: {
        toys: {
            type: 'to_many',
            target: 'toy',
            targetKey: 'cat_id',
            keyIn: 'toy',
            targetStorageType: 'sql'
        },
        person: {
            type: 'to_one',
            target: 'person',
            targetKey: 'person_id',
            keyIn: 'cat',
            targetStorageType: 'sql'
        },
        house: {
            type: 'to_one',
            target: 'house',
            targetKey: 'house_id',
            keyIn: 'cat',
            targetStorageType: 'cassandra'
        }
    },
    internalId: 'cat_id',
    id: {
        name: 'cat_id',
        type: 'String'
    }
};

/**
 * module - Creates a class to administer Cassandra model types
 */

class cat {
    constructor(input) {
        for (let key of Object.keys(input)) {
            this[key] = input[key];
        }
    }

    get storageHandler() {
        // defined below by `Object.defineProperty`
        return cat.storageHandler
    }

    /*static init(sequelize, DataTypes){
      return super.init({

                  cat_id : {
            type : Sequelize[ dict['String'] ],
            primaryKey: true
          },
                                      name: {
              type: Sequelize[ dict['String'] ]        }
          ,                      person_id: {
              type: Sequelize[ dict['String'] ]        }
          ,                      house_id: {
              type: Sequelize[ dict['String'] ]        }
                

      },{       modelName: "cat",
        tableName: "cats",
        sequelize
       } );
    }

    static associate(models){
                                                                                                  cat.belongsTo(models.house                                                                        ,{as: 'house', foreignKey:'house_id' }
              );
                                                                                                                                                                                          }*/

    /**
     * name - Getter for the name attribute
     *
     * This attribute is needed by the models' index
     * @return {string} The name of the model
     */
    static get name() {
        return "cat";
    }

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * This method is the implementation for reading a single record for the Cassandra storage type, based on CQL.
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type cat, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        const query = `SELECT * FROM cats WHERE cat_id = ?`;
        let queryResult = await this.storageHandler.execute(query, [id], {
            prepare: true
        });
        let firstResult = queryResult.first();
        // let item = new cat(firstResult);
        console.log("Result: ", queryResult);
        if (firstResult === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        try {
            let item =  new cat(firstResult);
            await validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item);
            return item;
        } catch (err) {
            return err
        };
    }

    /**
     * countRecords - The model implementation for counting the number of records, possibly restricted by a search term
     *
     * This method is the implementation for counting the number of records that fulfill a given condition, or for all records in the table,
     * for the Cassandra storage type, based on CQL.
     * @param {object} search - The search term that restricts the set of records to be counted - if undefined, all records in the table
     * @param {boolean} filtering - If the user has the 'search' right, the term 'ALLOW FILTERING' will be appended to the CQL string, possibly
     * allowing for searches that would otherwise be forbidden. This comes at an efficiency cost.
     * @return {number} The number of records that fulfill the condition, or of all records in the table
     */
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
            arg_cassandra = 'WHERE ' + arg.toCassandra('cat_id', filtering);
        }
        const query = 'SELECT COUNT(*) AS count FROM cats ' + arg_cassandra;
        let queryResult = await this.storageHandler.execute(query);
        let item = queryResult.first();
        result = parseInt(item['count']);
        return result;
    }

    /**
     * readAll - Limit-offset based pagination is not offered by Cassandra, and this method is left here only as information
     * to the user / developer. Use *readAllCursor* instead, which relies on cursor based pagination.
     * @throw {Error} If this method is used at all, an Error is thrown
     */
    static readAll(search, order, pagination) {
        throw new Error('Limit-offset based pagination is not supported by Cassandra');
    }

    /**
     * readAllCursor - The model implementation for searching for records in Cassandra. This method uses cursor based pagination.
     *
     * @param {object} search - The search condition for which records shall be fetched
     * @param {object} pagination - The parameters for pagination, which can be used to get a subset of the requested record set.
     * @param {boolean} filteringAllowed - If the user has the right 'search', the term "ALLOW FILTERING" will be added to the
     * CQL statement, allowing for more search queries at a efficiency cost.
     * @return {object} The set of records, possibly constrained by pagination, with full cursor information for all records
     */
    static async readAllCursor(search, pagination, filteringAllowed) {
        // === Set variables ===

        let offsetCursor = pagination ? pagination.after : null;
        let arg_cassandra = ';';
        let searchTerms = search;
        console.log("offsetCursor: ", offsetCursor);
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
            let cursorId = decoded_cursor['cat_id'];
            // let cursorSearchCondition = new searchArg({
            //     field: 'cat_id',
            //     value: {
            //         value: cursorId
            //     },
            //     operator: 'tgt',
            //     search: undefined
            // });
            let cursorSearchCondition = {
                field: 'cat_id',
                value: {
                    value: cursorId
                },
                operator: 'tgt',
                search: undefined
            };
            console.log("cursorSearchCondition: ", JSON.stringify(cursorSearchCondition));
            if (helper.isNotUndefinedAndNotNull(search)) {
                // -- Use *both* the given search condition and the cursor --
                searchTerms = {
                    // field: null,
                    // value: null,
                    operator: 'and',
                    search: [search, cursorSearchCondition]
                };
            } else {
                // -- Use only the cursor --
                searchTerms = cursorSearchCondition;
            }
        }

        // === Construct CQL statement ===
        console.log("searchTerms: ", JSON.stringify(searchTerms));
        if (searchTerms !== undefined) {

            //check
            if (typeof searchTerms !== 'object') {
                throw new Error('Illegal "search" argument type, it must be an object.');
            }

            // if (searchTerms.value && searchTerms.value.value) {
            //     searchTerms = new searchArg(searchTerms);
            // }
            searchTerms = new searchArg(searchTerms);
            console.log("searchTerms");
            console.log(searchTerms);
            arg_cassandra = 'WHERE ' + searchTerms.toCassandra(definition.attributes, filteringAllowed) + ';';
        }
        console.log("arg_cassandra: ", arg_cassandra);
        let query = 'SELECT * FROM cats ' + arg_cassandra;

        // === Set page size if needed ===

        let options = {};
        if (pagination && pagination.first) {
            options.fetchSize = parseInt(pagination.first);
        }

        // === Call to database ===

        const result = await this.storageHandler.execute(query, [], options);
        // console.log("result");
        // console.log(result);

        // === Construct return object ===

        const rows = result.rows.map(row => {
            let edge = {};
            let rowAscat = new cat(row);
            edge.node = rowAscat;
            edge.cursor = rowAscat.base64Enconde();
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

    /**
     * encloseStringAttributesInApostrophes - Cassandra expects String values to be 
     * enclosed in apostrophes (see https://docs.datastax.com/en/cql-oss/3.x/cql/cql_reference/valid_literal_r.html). This method checks
     * all string attributes of cat, and if the value does not start with an apostrophe (index 0), the value is enclosed
     * in apostrophes.
     * @param {Object} obj - The object to be examined
     */
    static encloseStringAttributesInApostrophes(obj) {
        for (let key of Object.keys(obj)) {
            if ((definition.attributes[key] === 'String' || definition.attributes[key].includes('Date')) && obj[key].indexOf("'") !== 0) {
                obj[key] = `'${obj[key]}'`;
            }
        }
    }



    /**
     * addOne - The model implementation method for adding a record in Cassandra, based on CQL.
     *
     * @param {object} input_object - The input object with informations about the record to be added, destructured into
     * the attribute components, but whithout associations or other information like *skipAssociationsExistenceChecks*.
     * @return {object} The created record as a cat object
     * @throw {Error} If the process fails, an error is thrown
     */
    static async addOne({
        cat_id,
        name,
        person_id
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            cat_id,
            name,
            person_id
        });
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input);
        try {
            this.encloseStringAttributesInApostrophes(input);
            const fields = Object.keys(input).join(', ');
            const values = Object.values(input).join(', ');
            const query = 'INSERT INTO cats (' + fields + ') VALUES (' + values + ')';
            await this.storageHandler.execute(query);
            let checkQuery = (await this.storageHandler.execute(`SELECT * FROM cats WHERE cat_id = ${input[definition.internalId]}`)).rows[0];
            let response = new cat(checkQuery);
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * deleteOne - The model implementation for deleting a single record, given by its ID, in Cassandra, based on CQL.
     *
     * @param {string} id - The ID of the record to be deleted
     * @returns {string} A success message is returned
     * @throw {Error} If the record could not be deleted - this means a record with the ID is still present
     */
    static async deleteOne(id) {
        // const query = `SELECT * FROM cats WHERE cat_id = ${id}`; // can be replaced with readById(id) ?
        // let queryResponse = await this.storageHandler.execute(query);
        // await validatorUtil.ifHasValidatorFunctionInvoke('validateForDelete', this, queryResponse.rows[0]);
        // const mutation = `DELETE FROM cats WHERE cat_id = ${id}`;
        // await this.storageHandler.execute(mutation);
        // queryResponse = await this.storageHandler.execute(query);
        // if (helper.isEmptyArray(queryResponse.rows)) {
        //     return 'Item successfully deleted';
        // }
        // throw new Error('Record was not deleted!');







        const query =  `DELETE FROM cats WHERE cat_id = ? IF EXISTS`;
        let queryResult = await this.storageHandler.execute(query, [id]);
        if(queryResult){
            return 'Item successfully deleted';
        } else {
            throw new Error(`Record with ID = ${id} does not exist or could not been deleted`);
        }
    }

    /**
     * updateOne - The model implementation for updating a single record in Cassandra, based on CQL.
     *
     * @param {object} input_object - The input object with informations about the record to be updated, destructured into
     * the attribute components, but whithout associations or other information like *skipAssociationsExistenceChecks*.
     * @returns {object} A new object of the type cat, which represents the updated record
     * @throw {Error} If this method fails, an error is thrown
     */
    static async updateOne({
        cat_id,
        name,
        person_id
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            cat_id,
            name,
            person_id
        });
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input);
        try {
            this.encloseStringAttributesInApostrophes(input);
            let idValue = input[this.idAttribute()];
            delete input[this.idAttribute()];
            let inputKeys = Object.keys(input);
            // An update that does not change the attributes must not execute the following CQL statement
            if (inputKeys.length > 0) {
                let mutation = `UPDATE cats SET `;
                mutation += inputKeys.map(key => `${key} = ${input[key]}`).join(', ');
                mutation += ` WHERE cat_id = ${idValue};`;
                await this.storageHandler.execute(mutation);
            }
            // this can be readById()?
            let checkQuery = (await this.storageHandler.execute(`SELECT * FROM cats WHERE cat_id = ${idValue}`)).rows[0];
            let response = new cat(checkQuery);
            return response;
        } catch (error) {
            throw error;
        }
    }

    static async bulkAddCsv(context) {
        throw new Error('Bulk Adding from a CSV file is currently not implemented!');
        /*
        let delim = context.request.body.delim || ',';
        let csvFile = context.request.files.csv_file;
        let cols = context.request.body.cols;
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        await context.request.files.csv_file.mv(tmpFile);

          try {

            // The following command will only work for up to 2 million rows. For large datasets, use https://docs.datastax.com/en/cassandra-oss/3.x/cassandra/tools/toolsBulkloader.html

            // The COPY statement can *only* be applied in the CQLSH, not by the driver!
            let copyQuery = `COPY cats FROM '${tmpFile}' WITH HEADER = TRUE AND DELIMITER = '${delim}';`;
            await this.storageHandler.execute(copyQuery);
            let idArray = await fileTools.getIdArrayFromCSV(tmpFile, this, delim, cols);
            let idString = idArray.join(', ');
            let resultQuery = `SELECT * FROM cats WHERE ID IN (${idString});`
            let insertionResult = await this.storageHandler.execute(resultQuery);

            let rowsJson = insertionResult.rows.map(record => JSON.stringify(record));
            let addedZipFilePath = await fileTools.JSONArrayToZIP(rowsJson, tmpFile);

            // let addedZipFilePath = await fileTools.parseCsvStream(tmpFile, this, delim, cols);

                try {
                    console.log(`Sending ${addedZipFilePath} to the user.`);

                    let attach = [];
                    attach.push({
                        filename: path.basename("added_data.zip"),
                        path: addedZipFilePath
                    });

                    try {
                        let info = await email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                          'ScienceDB batch add',
                          'Your data has been successfully added to the database.',
                          attach);
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.log(info);
                    } catch(err) {
                        fileTools.deleteIfExists(addedZipFilePath);
                        console.error(err);
                    }

                } catch (error) {
                    console.error(error.message);
                }

                fs.unlinkSync(tmpFile);
            } catch(error) {
              try {
                let info = await email.sendEmail(helpersAcl.getTokenFromContext(context).email,
                    'ScienceDB batch add', `${error.message}`);
                    console.error(info);
                } catch(err) {
                    console.error(err);
                }

                fs.unlinkSync(tmpFile);
            }

        return `Bulk import of cat records started. You will be send an email to ${helpersAcl.getTokenFromContext(context).email} informing you about success or errors`;
        */
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
     * add_person_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   cat_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_person_id(cat_id, person_id) {
        const mutationCql = `UPDATE cats SET person_id = ? WHERE cat_id = '${cat_id}'`;
        await this.storageHandler.execute(mutationCql, [`${person_id}`], {
            prepare: true
        });
        const checkCql = `SELECT * FROM cats WHERE cat_id = '${cat_id}'`;
        let result = await this.storageHandler.execute(checkCql);
        return new cat(result.first());
    }
    /**
     * add_house_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   cat_id   IdAttribute of the root model to be updated
     * @param {Id}   house_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_house_id(cat_id, house_id) {
        const mutationCql = `UPDATE cats SET house_id = ? WHERE cat_id = '${cat_id}'`;
        await this.storageHandler.execute(mutationCql, [`${house_id}`], {
            prepare: true
        });
        const checkCql = `SELECT * FROM cats WHERE cat_id = '${cat_id}'`;
        let result = await this.storageHandler.execute(checkCql);
        return new cat(result.first());
    }

    /**
     * remove_person_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   cat_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_person_id(cat_id, person_id) {
        const mutationCql = `UPDATE cats SET person_id = ? WHERE cat_id = '${cat_id}'`;
        await this.storageHandler.execute(mutationCql, [null], {
            prepare: true
        });
        const checkCql = `SELECT * FROM cats WHERE cat_id = '${cat_id}'`;
        let result = await this.storageHandler.execute(checkCql);
        return new cat(result.first());
    }
    /**
     * remove_house_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   cat_id   IdAttribute of the root model to be updated
     * @param {Id}   house_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_house_id(cat_id, house_id) {
        // we could check if the record WHERE cat_id = 'cat_id' and house_id = 'house_id' exists with a separate SELECT statement.
        // UPDATE statements do not allow filtering on non-primary Key columns, even when indexed and use with 'ALLOW FILTERING'
        const mutationCql = `UPDATE cats SET house_id = ? WHERE cat_id = '${cat_id}'`;
        await this.storageHandler.execute(mutationCql, [null], {
            prepare: true
        });
        const checkCql = `SELECT * FROM cats WHERE cat_id = '${cat_id}'`;
        let result = await this.storageHandler.execute(checkCql);
        return new cat(result.first());
    }

    static async bulkAssociateCatWithPerson_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "cat_id", "person_id");
        let promises = [];
        let mutationCql = `UPDATE cats SET person_id = ? WHERE cat_id IN ?`
        mappedForeignKeys.forEach(({
            person_id,
            cat_id
        }) => {
            promises.push(this.storageHandler.execute(mutationCql,[person_id, cat_id], {prepare: true}))
        });


        await Promise.all(promises);
        return "Records successfully updated!"
    }

    static async bulkDisAssociateCatWithPerson_id(bulkAssociationInput) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "cat_id", "person_id");
        let promises = [];
        let mutationCql = `UPDATE cats SET person_id = ? WHERE cat_id IN ?`
        mappedForeignKeys.forEach(({
            person_id,
            cat_id
        }) => {
            promises.push(this.storageHandler.execute(mutationCql,[null, cat_id], {prepare: true}))
        });


        await Promise.all(promises);
        return "Records successfully updated!"
    }





    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return cat.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return cat.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of cat.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[cat.idAttribute()]
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
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    /**
     * base64Enconde - Encode a cat to a base 64 String
     *
     * @return {string} The cat object, encoded in a base 64 String
     */
    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    /**
     * stripAssociations - Instant method for getting all attributes of a cat.
     *
     * @return {object} The attributes of a cat in object form
     */
    stripAssociations() {
        let attributes = Object.keys(cat.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of a cat that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of a cat that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of a cat.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}

module.exports.getAndConnectDataModelClass = function(cassandraDriver) {
    return Object.defineProperty(cat, 'storageHandler', {
        value: cassandraDriver,
        writable: false, // cannot be changed in the future
        enumerable: true,
        configurable: false
    })
}