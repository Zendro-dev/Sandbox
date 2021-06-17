'use strict';

const _ = require('lodash');
const searchArg = require('../../utils/search-argument');
const validatorUtil = require('../../utils/validatorUtil');
const path = require('path');
const helper = require('../../utils/helper');
const cassandraHelper = require('../../utils/cassandra_helpers');
const Uuid = require('cassandra-driver').types.Uuid;
const models = require(path.join(__dirname, '..', 'index.js'));

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'city',
    storageType: 'cassandra',
    attributes: {
        city_id: 'String',
        name: 'String',
        intArr: '[Int]',
        strArr: '[String]',
        floatArr: '[Float]',
        boolArr: '[Boolean]',
        dateTimeArr: '[DateTime]',
        river_ids: '[String]',
        country_id: 'String'
    },
    associations: {
        rivers: {
            type: 'many_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'cities',
            target: 'river',
            targetStorageType: 'sql',
            sourceKey: 'river_ids',
            targetKey: 'city_ids',
            keysIn: 'city'
        },
        country: {
            type: 'many_to_one',
            implementation: 'foreignkeys',
            reverseAssociation: 'cities',
            target: 'country',
            targetStorageType: 'sql',
            targetKey: 'country_id',
            keysIn: 'city'
        }
    },
    internalId: 'city_id',
    id: {
        name: 'city_id',
        type: 'String'
    }
};

/**
 * module - Creates a class to administer Cassandra model types
 */
module.exports = class city {
    constructor(input) {
        for (let key of Object.keys(input)) {
            this[key] = input[key];
        }
    }

    get storageHandler() {
        return city.storageHandler
    }

    /**
     * name - Getter for the name attribute
     *
     * This attribute is needed by the models' index
     * @return {string} The name of the model
     */
    static get name() {
        return "city";
    }

    /**
     * readById - The model implementation for reading a single record given by its ID
     *
     * This method is the implementation for reading a single record for the Cassandra storage type, based on CQL.
     * @param {string} id - The ID of the requested record
     * @return {object} The requested record as an object with the type city, or an error object if the validation after reading fails
     * @throws {Error} If the requested record does not exist
     */
    static async readById(id) {
        const query = `SELECT * FROM "cities" WHERE city_id = ?`;
        let queryResult = await this.storageHandler.execute(query, [id], {
            prepare: true
        });
        let firstResult = queryResult.first();
        if (firstResult === null) {
            throw new Error(`Record with ID = "${id}" does not exist`);
        }
        let item = new city(firstResult);
        return validatorUtil.validateData('validateAfterRead', this, item);
    }

    /**
     * countRecords - The model implementation for counting the number of records, possibly restricted by a search term
     *
     * This method is the implementation for counting the number of records that fulfill a given condition, or for all records in the table,
     * for the Cassandra storage type, based on CQL.
     * @param {object} search - The search term that restricts the set of records to be counted - if undefined, all records in the table
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @param {boolean} allowFiltering - If the user has the 'search' right, the term 'ALLOW FILTERING' will be appended to the CQL string, possibly
     * allowing for searches that would otherwise be forbidden. This comes at an efficiency cost.
     * @return {number} The number of records that fulfill the condition, or of all records in the table
     */
    static async countRecords(search, benignErrorReporter, allowFiltering) {
        let whereOptions = cassandraHelper.searchConditionsToCassandra(search, definition, allowFiltering)
        const query = 'SELECT COUNT(*) AS count FROM "cities"' + whereOptions;
        let queryResult = await this.storageHandler.execute(query);
        let item = queryResult.first();
        return parseInt(item['count']);
    }

    /**
     * readAll - Limit-offset based pagination is not offered by Cassandra, and this method is left here only as information
     * to the user / developer. Use *readAllCursor* instead, which relies on cursor based pagination.
     * @throw {Error} If this method is used at all, an Error is thrown
     */
    static readAll(search, order, pagination, benignErrorReporter) {
        throw new Error('Limit-offset based pagination is not supported by Cassandra');
    }

    /**
     * readAllCursor - The model implementation for searching for records in Cassandra. This method uses cursor based pagination.
     *
     * @param {object} search - The search condition for which records shall be fetched
     * @param {object} pagination - The parameters for pagination, which can be used to get a subset of the requested record set.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * @param {boolean} allowFiltering - If the user has the right 'search', the term "ALLOW FILTERING" will be added to the
     * CQL statement, allowing for more search queries at a efficiency cost.
     * @return {object} The set of records, possibly constrained by pagination, with full cursor information for all records
     */
    static async readAllCursor(search, pagination, benignErrorReporter, allowFiltering) {

        let cassandraSearch = pagination && pagination.after ? cassandraHelper.cursorPaginationArgumentsToCassandra(search, pagination, 'city_id') : search;
        let whereOptions = cassandraHelper.searchConditionsToCassandra(cassandraSearch, definition, allowFiltering);

         
        console.log(JSON.stringify(whereOptions, null, 2));   

        let query = 'SELECT * FROM "cities"' + whereOptions;

        // Set page size if needed
        let options = {};
        if (pagination && pagination.first) {
            options.fetchSize = parseInt(pagination.first);
        }

        // Call to database 
        const result = await this.storageHandler.execute(query, [], options);

        // Construct return object
        const rows = result.rows.map(row => {
            let edge = {};
            let rowAscity = new city(row);
            edge.node = rowAscity;
            edge.cursor = rowAscity.base64Enconde();
            return edge;
        });

        let startCursor = null;
        let nextCursor = null;
        let hasNextCursor = false;

        /*
         * The pageState attribute is where Cassandra stores its own version of a cursor.
         * We cannot use it directly, because Cassandra uses different conventions. 
         * But its presence shows that there is a following page.
         */
        if (helper.isNotUndefinedAndNotNull(result.pageState)) {
            startCursor = rows[0].cursor;
            nextCursor = rows[rows.length - 1].cursor;
            hasNextCursor = true;
        }

        let pageInfo = {
            startCursor: startCursor,
            endCursor: nextCursor,
            hasNextPage: hasNextCursor,
            hasPreviousPage: false, // since cassandra does not support backward-pagination this will default false
        }
        return {
            edges: rows,
            pageInfo: pageInfo,
            cities: rows.map((edge) => edge.node)
        };
    }





    /**
     * addOne - The model implementation method for adding a record in Cassandra, based on CQL.
     *
     * @param {object} input_object - The input object with informations about the record to be added, destructured into
     * the attribute components, but whithout associations or other information like *skipAssociationsExistenceChecks*.
     * @return {object} The created record as a city object
     * @throw {Error} If the process fails, an error is thrown
     */
    static async addOne({
        city_id,
        name,
        intArr,
        strArr,
        floatArr,
        boolArr,
        dateTimeArr
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            city_id,
            name,
            intArr,
            strArr,
            floatArr,
            boolArr,
            dateTimeArr
        });
        await validatorUtil.validateData('validateForCreate', this, input);
        try {
            const fields = '"' + Object.keys(input).join('", "') + '"';
            const inputValues = Object.values(input);
            const prepareString = new Array(Object.keys(input).length).fill('?').join(', ');
            const mutation = 'INSERT INTO "cities" (' + fields + ') VALUES (' + prepareString + ')';
            // Call to database
            await this.storageHandler.execute(mutation, inputValues, {
                prepare: true
            });
            // return the newly created record by reading it
            return await this.readById(city_id);
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
        await validatorUtil.validateData('validateForDelete', this, id);
        const mutation = `DELETE FROM "cities" WHERE city_id = ? IF EXISTS`;
        let mutationResponse = await this.storageHandler.execute(mutation, [id]);
        if (mutationResponse) {
            return 'Item successfully deleted';
        } else {
            throw new Error(`Record with ID = ${id} does not exist or could not been deleted`)
        }
    }

    /**
     * updateOne - The model implementation for updating a single record in Cassandra, based on CQL.
     *
     * @param {object} input_object - The input object with informations about the record to be updated, destructured into
     * the attribute components, but whithout associations or other information like *skipAssociationsExistenceChecks*.
     * @returns {object} A new object of the type city, which represents the updated record
     * @throw {Error} If this method fails, an error is thrown
     */
    static async updateOne({
        city_id,
        name,
        intArr,
        strArr,
        floatArr,
        boolArr,
        dateTimeArr
    }) {
        let input = helper.copyWithoutUnsetAttributes({
            city_id,
            name,
            intArr,
            strArr,
            floatArr,
            boolArr,
            dateTimeArr
        });
        await validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input);
        try {
            let idValue = input[this.idAttribute()];
            delete input[this.idAttribute()];
            let inputKeys = Object.keys(input);
            let inputValues = Object.values(input);
            inputValues.push(idValue);
            // An update that does not change the attributes must not execute the following CQL statement
            if (inputKeys.length > 0) {
                let mutation = `UPDATE "cities" SET `;
                mutation += inputKeys.map(key => `"${key}" = ?`).join(', ');
                mutation += ` WHERE city_id = ?;`;
                await this.storageHandler.execute(mutation, inputValues, {
                    prepare: true
                });
            }
            // return the newly created record by reading it
            return await this.readById(city_id);
        } catch (error) {
            throw error;
        }
    }

    static async bulkAddCsv(context) {
        throw new Error('Bulk Adding from a CSV file is currently not implemented!');
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
     * add_country_id - field Mutation (model-layer) for to_one associationsArguments to add 
     *
     * @param {Id}   city_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async add_country_id(city_id, country_id) {
        const mutationCql = `UPDATE "cities" SET country_id = ? WHERE city_id = ?`;
        await this.storageHandler.execute(mutationCql, [country_id, city_id], {
            prepare: true
        });
        const checkCql = `SELECT * FROM "cities" WHERE city_id = ?`;
        let result = await this.storageHandler.execute(checkCql, [city_id]);
        return new city(result.first());
    }

    /**
     * add_river_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   city_id   IdAttribute of the root model to be updated
     * @param {Array}   river_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async add_river_ids(city_id, river_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            river_ids.forEach(idx => {
                promises.push(models.river.add_city_ids(idx, [`${city_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let mutation = `UPDATE "cities" SET river_ids = river_ids + ? WHERE city_id = ?`
        await this.storageHandler.execute(mutation, [river_ids, city_id], {
            prepare: true
        });
    }

    /**
     * remove_country_id - field Mutation (model-layer) for to_one associationsArguments to remove 
     *
     * @param {Id}   city_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated. 
     */
    static async remove_country_id(city_id, country_id) {
        const mutationCql = `UPDATE "cities" SET country_id = ? WHERE city_id = ?`;
        await this.storageHandler.execute(mutationCql, [null, city_id], {
            prepare: true
        });
        const checkCql = `SELECT * FROM "cities" WHERE city_id = ?`;
        let result = await this.storageHandler.execute(checkCql, [city_id]);
        return new city(result.first());
    }

    /**
     * remove_river_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   city_id   IdAttribute of the root model to be updated
     * @param {Array}   river_ids Array foreign Key (stored in "Me") of the Association to be updated.
     */
    static async remove_river_ids(city_id, river_ids, benignErrorReporter, handle_inverse = true) {
        //handle inverse association
        if (handle_inverse) {
            let promises = [];
            river_ids.forEach(idx => {
                promises.push(models.river.remove_city_ids(idx, [`${city_id}`], benignErrorReporter, false));
            });
            await Promise.all(promises);
        }

        let mutation = `UPDATE "cities" SET river_ids = river_ids - ? WHERE city_id = ?`
        await this.storageHandler.execute(mutation, [river_ids, city_id], {
            prepare: true
        });
    }





    /**
     * bulkAssociateCityWithCountry_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkAssociateCityWithCountry_id(bulkAssociationInput, benignErrorReporter) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "city_id", "country_id");
        let promises = [];
        let mutationCql = `UPDATE "cities" SET country_id = ? WHERE city_id IN ?`
        mappedForeignKeys.forEach(({
            country_id,
            city_id
        }) => {
            promises.push(this.storageHandler.execute(mutationCql, [country_id, city_id], {
                prepare: true
            }))
        });


        await Promise.all(promises);
        return "Records successfully updated!"
    }


    /**
     * bulkDisAssociateCityWithCountry_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @return {string} returns message on success
     */
    static async bulkDisAssociateCityWithCountry_id(bulkAssociationInput, benignErrorReporter) {
        let mappedForeignKeys = helper.mapForeignKeysToPrimaryKeyArray(bulkAssociationInput, "city_id", "country_id");
        let promises = [];
        let mutationCql = `UPDATE "cities" SET country_id = ? WHERE city_id IN ?`
        mappedForeignKeys.forEach(({
            country_id,
            city_id
        }) => {
            promises.push(this.storageHandler.execute(mutationCql, [null, city_id], {
                prepare: true
            }))
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
        return city.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return city.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of city.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[city.idAttribute()]
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
     * base64Enconde - Encode a city to a base 64 String
     *
     * @return {string} The city object, encoded in a base 64 String
     */
    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    /**
     * stripAssociations - Instant method for getting all attributes of a city.
     *
     * @return {object} The attributes of a city in object form
     */
    stripAssociations() {
        let attributes = Object.keys(city.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of a city that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of a city that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of a city.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }

}