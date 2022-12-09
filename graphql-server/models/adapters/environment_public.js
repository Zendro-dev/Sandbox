const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://graphql.zendro-dev.org/graphql";
const iriRegex = new RegExp('zendro_public');

module.exports = class environment_public {

    static get adapterName() {
        return 'environment_public';
    }

    static get adapterType() {
        return 'zendro-webservice-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(iri, benignErrorReporter, token) {
        let query = `
          query
            readOneEnvironment
            {
              readOneEnvironment(id:"${iri}")
              {
                id 
                parameter 
                value 
                study_id 
                
              }
            }`;

        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.readOneEnvironment;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter, token) {
        let query = `
      query countEnvironments($search: searchEnvironmentInput){
        countEnvironments(search: $search)
      }`

        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: {
                        search: search
                    },
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.countEnvironments;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter, token) {

        let query = `query environmentsConnection($search: searchEnvironmentInput $pagination: paginationCursorInput! $order: [orderEnvironmentInput]){
      environmentsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  parameter
         value
         study_id
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`


        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: {
                        search: search,
                        order: order,
                        pagination: pagination
                    },
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data && response.data.data.environmentsConnection !== null) {
                return response.data.data.environmentsConnection;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async addOne(input, benignErrorReporter, token) {
        let query = `
          mutation addEnvironment(
              $id:ID!  
            $parameter:String
            $value:String          ){
            addEnvironment(            id:$id  
            parameter:$parameter
            value:$value){
              id                parameter
                value
                study_id
              }
          }`;

        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: input,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.addEnvironment;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async deleteOne(id, benignErrorReporter, token) {
        let query = `
          mutation
            deleteEnvironment{
              deleteEnvironment(
                id: "${id}" )}`;


        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.deleteEnvironment;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async updateOne(input, benignErrorReporter, token) {
        let query = `
          mutation
            updateEnvironment(
              $id:ID! 
              $parameter:String 
              $value:String             ){
              updateEnvironment(
                id:$id 
                parameter:$parameter 
                value:$value               ){
                id 
                parameter 
                value 
                study_id 
              }
            }`


        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: input,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.updateEnvironment;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_study_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     */

    static async add_study_id(id, study_id, benignErrorReporter, token) {
        let query = `
              mutation
                updateEnvironment{
                  updateEnvironment(
                    id:"${id}"
                    addStudy:"${study_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    id                    study_id                  }
                }`

        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return 1;
            } else {
                benignErrorReporter.push({
                    message: `Remote zendro-server (${remoteZendroURL}) did not respond with data.`,
                });
            }
        } catch (error) {
            //handle caught errors
            benignErrorReporter.push(errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL));
        }
    }








    /**
     * remove_study_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Id}   study_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param {string} token The token used for authorization
     */

    static async remove_study_id(id, study_id, benignErrorReporter, token) {
        let query = `
              mutation
                updateEnvironment{
                  updateEnvironment(
                    id:"${id}"
                    removeStudy:"${study_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    id                    study_id                  }
                }`

        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return 1;
            } else {
                benignErrorReporter.push({
                    message: `Remote zendro-server (${remoteZendroURL}) did not respond with data.`,
                });
            }
        } catch (error) {
            //handle caught errors
            benignErrorReporter.push(errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL));
        }
    }









    static async csvTableTemplate(benignErrorReporter, token) {
        let query = `query { csvTableTemplateEnvironment }`;

        try {
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.csvTableTemplateEnvironment;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * bulkAssociateEnvironmentWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkAssociateEnvironmentWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkAssociateEnvironmentWithStudy_id($bulkAssociationInput: [bulkAssociationEnvironmentWithStudy_idInput]){
          bulkAssociateEnvironmentWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
        }`
        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: {
                        bulkAssociationInput: bulkAssociationInput
                    },
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send

            if (response && response.data && response.data.data) {
                return response.data.data.bulkAssociateEnvironmentWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * bulkDisAssociateEnvironmentWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkDisAssociateEnvironmentWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkDisAssociateEnvironmentWithStudy_id($bulkAssociationInput: [bulkAssociationEnvironmentWithStudy_idInput]){
          bulkDisAssociateEnvironmentWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
        }`
        try {
            // Send an HTTP request to the remote server
            let opts = {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/graphql",
                },
            };
            if (token) {
                opts.headers["authorization"] = token;
            }
            let response = await axios.post(
                remoteZendroURL, {
                    query: query,
                    variables: {
                        bulkAssociationInput: bulkAssociationInput
                    },
                },
                opts
            );
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.push(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send

            if (response && response.data && response.data.data) {
                return response.data.data.bulkDisAssociateEnvironmentWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



}