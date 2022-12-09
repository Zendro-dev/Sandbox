const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://graphql.zendro-dev.org/graphql";
const iriRegex = new RegExp('zendro_public');

module.exports = class observed_variable_public {

    static get adapterName() {
        return 'observed_variable_public';
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
            readOneObserved_variable
            {
              readOneObserved_variable(id:"${iri}")
              {
                id 
                name 
                accession_number 
                trait 
                trait_accession_number 
                method 
                method_accession_number 
                method_description 
                scale 
                scale_accession_number 
                time_scale 
                study_ids 
                data_file_ids 
                
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
                return response.data.data.readOneObserved_variable;
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
      query countObserved_variables($search: searchObserved_variableInput){
        countObserved_variables(search: $search)
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
                return response.data.data.countObserved_variables;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter, token) {

        let query = `query observed_variablesConnection($search: searchObserved_variableInput $pagination: paginationCursorInput! $order: [orderObserved_variableInput]){
      observed_variablesConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  name
         accession_number
         trait
         trait_accession_number
         method
         method_accession_number
         method_description
         scale
         scale_accession_number
         time_scale
         study_ids
         data_file_ids
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
            if (response && response.data && response.data.data && response.data.data.observed_variablesConnection !== null) {
                return response.data.data.observed_variablesConnection;
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
          mutation addObserved_variable(
              $id:ID!  
            $name:String
            $accession_number:String
            $trait:String
            $trait_accession_number:String
            $method:String
            $method_accession_number:String
            $method_description:String
            $scale:String
            $scale_accession_number:String
            $time_scale:String          ){
            addObserved_variable(            id:$id  
            name:$name
            accession_number:$accession_number
            trait:$trait
            trait_accession_number:$trait_accession_number
            method:$method
            method_accession_number:$method_accession_number
            method_description:$method_description
            scale:$scale
            scale_accession_number:$scale_accession_number
            time_scale:$time_scale){
              id                name
                accession_number
                trait
                trait_accession_number
                method
                method_accession_number
                method_description
                scale
                scale_accession_number
                time_scale
                study_ids
                data_file_ids
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
                return response.data.data.addObserved_variable;
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
            deleteObserved_variable{
              deleteObserved_variable(
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
                return response.data.data.deleteObserved_variable;
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
            updateObserved_variable(
              $id:ID! 
              $name:String 
              $accession_number:String 
              $trait:String 
              $trait_accession_number:String 
              $method:String 
              $method_accession_number:String 
              $method_description:String 
              $scale:String 
              $scale_accession_number:String 
              $time_scale:String             ){
              updateObserved_variable(
                id:$id 
                name:$name 
                accession_number:$accession_number 
                trait:$trait 
                trait_accession_number:$trait_accession_number 
                method:$method 
                method_accession_number:$method_accession_number 
                method_description:$method_description 
                scale:$scale 
                scale_accession_number:$scale_accession_number 
                time_scale:$time_scale               ){
                id 
                name 
                accession_number 
                trait 
                trait_accession_number 
                method 
                method_accession_number 
                method_description 
                scale 
                scale_accession_number 
                time_scale 
                study_ids 
                data_file_ids 
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
                return response.data.data.updateObserved_variable;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



    /**
     * add_study_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_study_ids(id, study_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObserved_variable{
                    updateObserved_variable(
                      id:"${id}"
                      addStudies:["${study_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      study_ids                    }
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
                return response.data.data.updateObserved_variable;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_data_file_ids(id, data_file_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObserved_variable{
                    updateObserved_variable(
                      id:"${id}"
                      addData_files:["${data_file_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      data_file_ids                    }
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
                return response.data.data.updateObserved_variable;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * remove_study_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   study_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_study_ids(id, study_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObserved_variable{
                    updateObserved_variable(
                      id:"${id}"
                      removeStudies:["${study_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      study_ids                    }
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
                return response.data.data.updateObserved_variable;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * remove_data_file_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   data_file_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_data_file_ids(id, data_file_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObserved_variable{
                    updateObserved_variable(
                      id:"${id}"
                      removeData_files:["${data_file_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      data_file_ids                    }
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
                return response.data.data.updateObserved_variable;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    static async csvTableTemplate(benignErrorReporter, token) {
        let query = `query { csvTableTemplateObserved_variable }`;

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
            return response.data.data.csvTableTemplateObserved_variable;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




}