const _ = require('lodash');
const globals = require('../../config/globals');
const helper = require('../../utils/helper');
const axios = require('axios');
const errorHelper = require('../../utils/errors');
const path = require('path');
const models = require(path.join(__dirname, '..', 'index.js'));


// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'registro_snib',
    storageType: 'generic',
    attributes: {
        id: 'String',
        procedenciaejemplar: 'String',
        fechacolecta: 'String',
        numcolecta: 'String',
        ambiente: 'String',
        colector: 'String',
        coleccion: 'String',
        numcatalogo: 'String',
        proyecto: 'String',
        formadecitar: 'String',
        licenciauso: 'String',
        urlproyecto: 'String',
        urlejemplar: 'String',
        version: 'String'
    },
    associations: {
        registro_siagro: {
            type: 'to_one',
            target: 'registro_siagro',
            targetKey: 'snib_id',
            keyIn: 'registro_siagro',
            targetStorageType: 'sql',
            label: 'siagro_id',
            sublabel: 'NombreComun'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

module.exports = class registro_snib {

    /**
     * constructor - Creates an instance of the generic model registro_snib.
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */
    constructor({
        id,
        procedenciaejemplar,
        fechacolecta,
        numcolecta,
        ambiente,
        colector,
        coleccion,
        numcatalogo,
        proyecto,
        formadecitar,
        licenciauso,
        urlproyecto,
        urlejemplar,
        version
    }) {
        this.id = id;
        this.procedenciaejemplar = procedenciaejemplar;
        this.fechacolecta = fechacolecta;
        this.numcolecta = numcolecta;
        this.ambiente = ambiente;
        this.colector = colector;
        this.coleccion = coleccion;
        this.numcatalogo = numcatalogo;
        this.proyecto = proyecto;
        this.formadecitar = formadecitar;
        this.licenciauso = licenciauso;
        this.urlproyecto = urlproyecto;
        this.urlejemplar = urlejemplar;
        this.version = version;
    }

    static get name() {
        return "registro_snib";
    }

    static get definition() {
        return definition;
    }

    /**
     * readById - Search for the registro_snib record whose id is equal to the @id received as parameter.
     * Returns an instance of this class (registro_snib), with all its properties
     * set from the values of the record fetched.
     * 
     * Returned value:
     *    new registro_snib(record)
     * 
     * Thrown on:
     *    * No record found.
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from the record fetched.
     * @see: constructor() of the class registro_snib;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {registro_snib} Instance of registro_snib class.
     */
    static async readById(id, benignErrorReporter) {
        let query = `query ejemplar { ejemplar(id:"${id}"){
            id,
            procedenciaejemplar,
            fechacolecta,
            numcolecta,
            ambiente,
            colector,
            coleccion,
            numcatalogo,
            proyecto,
            formadecitar,
            licenciauso,
            urlproyecto,
            urlejemplar,
            version
            }
        }`;

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post("http://172.16.1.169:4003/graphql/", { query: query });
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            // console.log("RESPONSE: ", response)
            if (response && response.data && response.data.data) {
            return new registro_snib(response.data.data.ejemplar);
            } else {
            throw new Error(`Invalid response from remote cenz-server: Zacatuche`);
            }
        } catch (error) {
            console.log("ERROR ", error)
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, "http://zacatuche.conabio.gob.mx:4003/graphql");
        }
    }

    /**
     * countRecords - Count the number of records of model registro_snib that match the filters provided
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
        throw new Error('countRecords() is not implemented for model registro_snib');
    }

    /**
     * readAll - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * limit/offset pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (registro_snib), where each instance
     * has its properties set from the values of one of the records fetched.
     * 
     * Returned value:
     *    for each record
     *    array.push( new registro_snib(record) )
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where record is an object with all its properties set from a record fetched.
     * @see: constructor() of the class registro_snib;
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
     * @return {[registro_snib]}    Array of instances of registro_snib class.
     */
    static async readAll(search, order, pagination, benignErrorReporter) {

        /*
        YOUR CODE GOES HERE
        */
        throw new Error('readAll() is not implemented for model registro_snib');
    }

    /**
     * readAllCursor - Search for the multiple records that match the filters received
     * in the @search parameter. The final set of records is constrained by the 
     * cursor based pagination properties received in the @pagination parameter 
     * and ordered by the specifications received in the @order parameter.
     * Returns an array of instances of this class (registro_snib), where each instance
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
     * @see: constructor() of the class registro_snib;
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
        let records = await registro_snib.readAll(options['search'], options['order'], options['pagination'], benignErrorReporter);
        // get the first record (if exists) in the opposite direction to determine pageInfo.
        // if no cursor was given there is no need for an extra query as the results will start at the first (or last) page.
        let oppRecords = [];
        if (pagination && (pagination.after || pagination.before)) {
            let oppOptions = helper.buildOppositeSearchGeneric(search, order, pagination, this.idAttribute());
            oppRecords = await registro_snib.readAll(oppOptions['search'], oppOptions['order'], oppOptions['pagination'], benignErrorReporter);
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
     * addOne - Creates a new record of model registro_snib with the values provided
     * on @input object.
     * Only if record was created successfully, returns an instance of this class 
     * (registro_snib), with all its properties set from the new record created.
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
     *    new registro_snib(newRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where newRecord is an object with all its properties set from the new record created.
     * @see: constructor() of the class registro_snib;
     * 
     * @param  {String} id The id of the record that needs to be fetched.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {registro_snib} If successfully created, returns an instance of 
     * registro_snib class constructed with the new record, otherwise throws an error.
     */
    static async addOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('addOne() is not implemented for model registro_snib');
    }

    /**
     * updateOne - Updates the registro_snib record whose id is equal to the value
     * of id attribute: 'id', which should be on received as input.
     * Only if record was updated successfully, returns an instance of this class 
     * (registro_snib), with all its properties set from the record updated.
     * If this function fails to update the record, should throw an error.
     * 
     * Conventions on input's attributes values.
     *    1. undefined value: attributes with value equal to undefined are NOT
     *       updated.
     *    2. non-existent: attributes not listed on the input are NOT updated.
     *    3. null: attributes with value equal to null are set to null.
     * 
     * Returned value:
     *    new registro_snib(updatedRecord)
     * 
     * Thrown on:
     *    * Error.
     *    * Operation failed.
     * 
     * where updatedRecord is an object with all its properties set from the record updated.
     * @see: constructor() of the class registro_snib;
     * 
     * @param  {object} input Input with properties to be updated. The special id 
     * attribute: 'id' should contains the id value of the record
     * that will be updated.
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard 
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the 
     * GraphQL response will have a non empty errors property.
     * @return {registro_snib} If successfully created, returns an instance of 
     * registro_snib class constructed with the new record, otherwise throws an error.
     */
    static async updateOne(input, benignErrorReporter) {
        /*
        YOUR CODE GOES HERE
        */
        throw new Error('updateOne() is not implemented for model registro_snib');
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
        throw new Error('deleteOne is not implemented for model registro_snib');
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
        throw new Error('bulkAddCsv() is not implemented for model registro_snib');
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
        return registro_snib.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return registro_snib.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of registro_snib.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[registro_snib.idAttribute()]
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(registro_snib.definition.attributes);
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

};