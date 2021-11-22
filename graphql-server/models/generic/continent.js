const _ = require('lodash');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'continent',
    storageType: 'generic',
    attributes: {
        continent_id: 'String',
        name: 'String'
    },
    associations: {
        countries: {
            type: 'one_to_many',
            implementation: 'foreignkeys',
            reverseAssociation: 'continent',
            target: 'country',
            targetKey: 'continent_id',
            keysIn: 'country',
            targetStorageType: 'sql'
        }
    },
    internalId: 'continent_id',
    id: {
        name: 'continent_id',
        type: 'String'
    }
};

module.exports = class continent {

    /**
     * constructor - Creates an instance of the generic model continent.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */
    constructor({
        continent_id,
        name
    }) {
        this.continent_id = continent_id;
        this.name = name;
    }

    static get name() {
        return "continent";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the continent record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (continent), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new continent(record)
     * 
     * Thrown on:
     *    * No record found.
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class continent;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {continent} Instance of continent class.
     */
    static async readById(id, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
         */
        throw new Error('readById() is not implemented for model continent');
    }

    /**
     * countRecords - Count the number of records of model continent that match the filters provided
     * in the @search parameter. Returns the number of records counted.
     * @see: Zendro specifications for search object.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {object} search Object with search filters.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} Number of records counted, that match the search filters.
     */
    static async countRecords(search, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('countRecords() is not implemented for model continent');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (continent), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new continent(record) )
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class continent;
     * @see: Zendro specifications for limit-offset pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with limit/offset pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {[continent]}    Array of instances of continent class.
     */
    static async readAll(search, order, pagination, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readAll() is not implemented for model continent');
    }

    /**
     * readAllCursor - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (continent), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    { edges, pageInfo }
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class continent;
     * @see: Zendro specificatons for cursor based pagination.
     * @see: Zendro specifications for search and order objects.
     * 
     * @param  {object} search     Object with search filters.
     * @param  {object} order      Object with order specifications.
     * @param  {object} pagination Object with pagination properties.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return { edges, pageInfo } Object with edges and pageInfo.
     */
    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);
        let options = helper.buildCursorBasedGenericOptions(search, order, pagination, this.idAttribute());
        let records = await continent.readAll(options['search'], options['order'], options['pagination'], benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchGeneric(search, order, pagination, this.idAttribute());
            oppRecords = await continent.readAll(oppOptions['search'], oppOptions['order'], oppOptions['pagination'], benignErrorReporter);
        }
        // build the graphql Connection Object
        let edges = helper.buildEdgeObject(records);
        let pageInfo = helper.buildPageInfo(edges, oppRecords, pagination);
        return {
            edges,
            pageInfo
        };
    }

    /**
     * addOne - Creates a new record of model continent with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (continent), with all its properties set from the new record created.
     * If this function fails to create the new record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are set to 
     *       null at creation time.
     *    2. non-existent: attributes not listed on the input are set to null at 
     *       creation time.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new continent(newRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class continent;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {continent} If successfully created, returns an instance of 
     * continent class constructed with the new record, otherwise throws an error.
     */
    static async addOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addOne() is not implemented for model continent');
    }

    /**
     * updateOne - Updates the continent record whose id is equal to the value
     * of id attribute: 'continent_id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (continent), with all its properties set from the record updated.
     * If this function fails to update the record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new continent(updatedRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class continent;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'continent_id' should contains the id value of the record
     * that will be updated.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {continent} If successfully created, returns an instance of 
     * continent class constructed with the new record, otherwise throws an error.
     */
    static async updateOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateOne() is not implemented for model continent');
    }

    /**
     * deleteOne - Delete the record whose id is equal to the @id received as parameter.
     * Only if record was deleted successfully, returns the id of the deleted record.
     * If this function fails to delete the record, should throw an error.
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * @param  {String} id The id of the record that will be deleted.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {int} id of the record deleted or throws an error if the operation failed.
     */
    static async deleteOne(id, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('deleteOne is not implemented for model continent');
    }

    /**
     * bulkAddCsv - Allows the user to bulk-upload a set of records in CSV format.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     */
    static async bulkAddCsv(context, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('bulkAddCsv() is not implemented for model continent');
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
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */
    static idAttribute() {
        return continent.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */
    static idAttributeType() {
        return continent.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of continent.
     *
     * @return {type} id value
     */
    getIdValue() {
        return this[continent.idAttribute()];
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
        return Buffer.from(cursor, "base64").toString("utf-8");
    }

    /**
     * base64Encode - Encode  continent to a base 64 String
     *
     * @return {string} The continent object, encoded in a base 64 String
     */
    base64Encode() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString(
            "base64"
        );
    }

    /**
     * asCursor - alias method for base64Encode
     *
     * @return {string} The continent object, encoded in a base 64 String
     */
    asCursor() {
        return this.base64Encode()
    }

    /**
     * stripAssociations - Instance method for getting all attributes of continent.
     *
     * @return {object} The attributes of continent in object form
     */
    stripAssociations() {
        let attributes = Object.keys(continent.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * externalIdsArray - Get all attributes of continent that are marked as external IDs.
     *
     * @return {Array<String>} An array of all attributes of continent that are marked as external IDs
     */
    static externalIdsArray() {
        let externalIds = [];
        if (definition.externalIds) {
            externalIds = definition.externalIds;
        }

        return externalIds;
    }

    /**
     * externalIdsObject - Get all external IDs of continent.
     *
     * @return {object} An object that has the names of the external IDs as keys and their types as values
     */
    static externalIdsObject() {
        return {};
    }
};