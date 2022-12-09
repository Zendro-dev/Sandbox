const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://graphql.zendro-dev.org/graphql";
const iriRegex = new RegExp('zendro_public');

module.exports = class factor_public {

    static get adapterName() {
        return 'factor_public';
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
            readOneFactor
            {
              readOneFactor(id:"${iri}")
              {
                id 
                type 
                description 
                values 
                study_id 
                observation_unit_ids 
                
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
                return response.data.data.readOneFactor;
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
      query countFactors($search: searchFactorInput){
        countFactors(search: $search)
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
                return response.data.data.countFactors;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter, token) {

        let query = `query factorsConnection($search: searchFactorInput $pagination: paginationCursorInput! $order: [orderFactorInput]){
      factorsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  type
         description
         values
         study_id
         observation_unit_ids
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
            if (response && response.data && response.data.data && response.data.data.factorsConnection !== null) {
                return response.data.data.factorsConnection;
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
          mutation addFactor(
              $id:ID!  
            $type:String
            $description:String
            $values:[String]          ){
            addFactor(            id:$id  
            type:$type
            description:$description
            values:$values){
              id                type
                description
                values
                study_id
                observation_unit_ids
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
                return response.data.data.addFactor;
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
            deleteFactor{
              deleteFactor(
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
                return response.data.data.deleteFactor;
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
            updateFactor(
              $id:ID! 
              $type:String 
              $description:String 
              $values:[String]             ){
              updateFactor(
                id:$id 
                type:$type 
                description:$description 
                values:$values               ){
                id 
                type 
                description 
                values 
                study_id 
                observation_unit_ids 
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
                return response.data.data.updateFactor;
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
                updateFactor{
                  updateFactor(
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
     * add_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateFactor{
                    updateFactor(
                      id:"${id}"
                      addObservation_units:["${observation_unit_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      observation_unit_ids                    }
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
                return response.data.data.updateFactor;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
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
                updateFactor{
                  updateFactor(
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







    /**
     * remove_observation_unit_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   observation_unit_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_observation_unit_ids(id, observation_unit_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateFactor{
                    updateFactor(
                      id:"${id}"
                      removeObservation_units:["${observation_unit_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      observation_unit_ids                    }
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
                return response.data.data.updateFactor;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    static async csvTableTemplate(benignErrorReporter, token) {
        let query = `query { csvTableTemplateFactor }`;

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
            return response.data.data.csvTableTemplateFactor;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * bulkAssociateFactorWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkAssociateFactorWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkAssociateFactorWithStudy_id($bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput]){
          bulkAssociateFactorWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
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
                return response.data.data.bulkAssociateFactorWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * bulkDisAssociateFactorWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkDisAssociateFactorWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkDisAssociateFactorWithStudy_id($bulkAssociationInput: [bulkAssociationFactorWithStudy_idInput]){
          bulkDisAssociateFactorWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
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
                return response.data.data.bulkDisAssociateFactorWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



}