const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const helper = require('../../utils/helper');
const errorHelper = require('../../utils/errors');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'capital',
    storageType: 'zendro-server',
    url: 'http://integration_test_server1-graphql-container:3000/graphql',
    attributes: {
        name: 'String',
        country_id: 'String',
        capital_id: 'String'
    },
    associations: {
        unique_country: {
            type: 'to_one',
            target: 'country',
            targetKey: 'country_id',
            keyIn: 'capital',
            targetStorageType: 'sql'
        }
    },
    internalId: 'capital_id',
    id: {
        name: 'capital_id',
        type: 'String'
    }
};

const remoteZendroURL = "http://integration_test_server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class capital {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        capital_id,
        name,
        country_id
    }) {
        this.capital_id = capital_id;
        this.name = name;
        this.country_id = country_id;
    }

    static get name() {
        return "capital";
    }

    static async readById(id, benignErrorReporter) {
        let query = `query readOneCapital{ readOneCapital(capital_id: "${id}"){capital_id       name
          country_id
     } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                let item = new capital(response.data.data.readOneCapital);
                await validatorUtil.validateData('validateAfterRead', this, item);
                return item;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `query countCapitals($search: searchCapitalInput){
      countCapitals(search: $search)
    }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.countCapitals;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        let query = `query capitals($search: searchCapitalInput $pagination: paginationInput $order: [orderCapitalInput]){
      capitals(search:$search pagination:$pagination order:$order){capital_id          name
                country_id
        } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                let data = response.data.data.capitals;
                data = await validatorUtil.bulkValidateData('validateAfterRead', this, data, benignErrorReporter);
                return data.map(item => {
                    return new capital(item)
                });
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let query = `query capitalsConnection($search: searchCapitalInput $pagination: paginationCursorInput $order: [orderCapitalInput]){
      capitalsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  capital_id  name
        country_id
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                let data_edges = response.data.data.capitalsConnection.edges;
                let pageInfo = response.data.data.capitalsConnection.pageInfo;

                //validate after read
                let nodes = data_edges.map(e => e.node);
                let valid_nodes = await validatorUtil.bulkValidateData('validateAfterRead', this, nodes, benignErrorReporter);

                let edges = valid_nodes.map(e => {
                    let temp_node = new capital(e);
                    return {
                        node: temp_node,
                        cursor: temp_node.base64Enconde()
                    }
                })

                return {
                    edges,
                    pageInfo
                };
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async addOne(input, benignErrorReporter) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);

        let query = `
            mutation addCapital(
                  $capital_id:ID!  
              $name:String            ){
              addCapital(              capital_id:$capital_id  
              name:$name){
                capital_id                    name
                    country_id
                  }
            }`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new capital(response.data.data.addCapital);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async deleteOne(id, benignErrorReporter) {
        //validate id
        await validatorUtil.validateData('validateForDelete', this, id);

        let query = `
              mutation
                deleteCapital{
                  deleteCapital(
                    capital_id: "${id}" )}`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.deleteCapital;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async updateOne(input, benignErrorReporter) {
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        let query = `
            mutation
              updateCapital(
                $capital_id:ID! 
                $name:String               ){
                updateCapital(
                  capital_id:$capital_id 
                  name:$name                 ){
                  capital_id 
                  name 
                  country_id 
                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new capital(response.data.data.updateCapital);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async bulkAddCsv(context, benignErrorReporter) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let csvRequestMv = await context.request.files.csv_file.mv(tmpFile);
            let query = `mutation {bulkAddCapitalCsv}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            let response = await axios.post(remoteZendroURL, formData, {
                headers: formData.getHeaders()
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.bulkAddCapitalCsv;

        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
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
        let query = `query { csvTableTemplateCapital }`;
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.csvTableTemplateCapital;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_country_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   capital_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_country_id(capital_id, country_id, benignErrorReporter) {
        let query = `
            mutation
              updateCapital{
                updateCapital(
                  capital_id:"${capital_id}"
                  addUnique_country:"${country_id}"
                ){
                  capital_id                  country_id                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new capital(response.data.data.updateCapital);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * remove_country_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   capital_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_country_id(capital_id, country_id, benignErrorReporter) {
        let query = `
            mutation
              updateCapital{
                updateCapital(
                  capital_id:"${capital_id}"
                  removeUnique_country:"${country_id}"
                ){
                  capital_id                  country_id                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new capital(response.data.data.updateCapital);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
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
        let attributes = Object.keys(capital.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return capital.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return capital.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of capital.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[capital.idAttribute()]
    }
};