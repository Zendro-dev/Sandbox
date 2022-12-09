const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://graphql.zendro-dev.org/graphql";
const iriRegex = new RegExp('zendro_public');

module.exports = class person_public {

    static get adapterName() {
        return 'person_public';
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
            readOnePerson
            {
              readOnePerson(id:"${iri}")
              {
                id 
                name 
                email 
                role 
                affiliation 
                investigation_ids 
                study_ids 
                
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
                return response.data.data.readOnePerson;
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
      query countPeople($search: searchPersonInput){
        countPeople(search: $search)
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
                return response.data.data.countPeople;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter, token) {

        let query = `query peopleConnection($search: searchPersonInput $pagination: paginationCursorInput! $order: [orderPersonInput]){
      peopleConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  name
         email
         role
         affiliation
         investigation_ids
         study_ids
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
            if (response && response.data && response.data.data && response.data.data.peopleConnection !== null) {
                return response.data.data.peopleConnection;
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
          mutation addPerson(
              $id:ID!  
            $name:String
            $email:String
            $role:String
            $affiliation:String          ){
            addPerson(            id:$id  
            name:$name
            email:$email
            role:$role
            affiliation:$affiliation){
              id                name
                email
                role
                affiliation
                investigation_ids
                study_ids
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
                return response.data.data.addPerson;
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
            deletePerson{
              deletePerson(
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
                return response.data.data.deletePerson;
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
            updatePerson(
              $id:ID! 
              $name:String 
              $email:String 
              $role:String 
              $affiliation:String             ){
              updatePerson(
                id:$id 
                name:$name 
                email:$email 
                role:$role 
                affiliation:$affiliation               ){
                id 
                name 
                email 
                role 
                affiliation 
                investigation_ids 
                study_ids 
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
                return response.data.data.updatePerson;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



    /**
     * add_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_investigation_ids(id, investigation_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updatePerson{
                    updatePerson(
                      id:"${id}"
                      addInvestigations:["${investigation_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      investigation_ids                    }
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
                return response.data.data.updatePerson;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
                  updatePerson{
                    updatePerson(
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
                return response.data.data.updatePerson;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * remove_investigation_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   investigation_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_investigation_ids(id, investigation_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updatePerson{
                    updatePerson(
                      id:"${id}"
                      removeInvestigations:["${investigation_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      investigation_ids                    }
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
                return response.data.data.updatePerson;
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
                  updatePerson{
                    updatePerson(
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
                return response.data.data.updatePerson;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    static async csvTableTemplate(benignErrorReporter, token) {
        let query = `query { csvTableTemplatePerson }`;

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
            return response.data.data.csvTableTemplatePerson;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




}