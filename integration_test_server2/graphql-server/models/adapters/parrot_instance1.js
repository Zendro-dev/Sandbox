const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://integration_test_server1-graphql-container:3000/graphql";
const iriRegex = new RegExp('instance1');

module.exports = class parrot_instance1 {

    static get adapterName() {
        return 'parrot_instance1';
    }

    static get adapterType() {
        return 'ddm-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static async readById(iri, benignErrorReporter) {
        let query = `
          query
            readOneParrot
            {
              readOneParrot(parrot_id:"${iri}")
              {
                parrot_id 
                name 
                person_id 
              }
            }`;

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
                return response.data.data.readOneParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `
      query countParrots($search: searchParrotInput){
        countParrots(search: $search)
      }`

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
                return response.data.data.countParrots;
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
        let query = `query parrotsConnection($search: searchParrotInput $pagination: paginationCursorInput $order: [orderParrotInput]){
      parrotsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  parrot_id  name
         person_id
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`

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
                return response.data.data.parrotsConnection;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async addOne(input, benignErrorReporter) {
        let query = `
          mutation addParrot(
              $parrot_id:ID!  
            $name:String          ){
            addParrot(            parrot_id:$parrot_id  
            name:$name){
              parrot_id                name
                person_id
              }
          }`;

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
            if (response && response.data && response.data.data) {
                return response.data.data.addParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async deleteOne(id, benignErrorReporter) {
        let query = `
          mutation
            deleteParrot{
              deleteParrot(
                parrot_id: "${id}" )}`;


        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.deleteParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async updateOne(input, benignErrorReporter) {
        let query = `
          mutation
            updateParrot(
              $parrot_id:ID! 
              $name:String             ){
              updateParrot(
                parrot_id:$parrot_id 
                name:$name               ){
                parrot_id 
                name 
                person_id 
              }
            }`


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
            if (response && response.data && response.data.data) {
                return response.data.data.updateParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_person_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   parrot_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services   
     */

    static async add_person_id(parrot_id, person_id, benignErrorReporter) {
        let query = `
              mutation
                updateParrot{
                  updateParrot(
                    parrot_id:"${parrot_id}"
                    addUnique_person:"${person_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    parrot_id                    person_id                  }
                }`

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
                return response.data.data.updateParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * remove_person_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   parrot_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services   
     */

    static async remove_person_id(parrot_id, person_id, benignErrorReporter) {
        let query = `
              mutation
                updateParrot{
                  updateParrot(
                    parrot_id:"${parrot_id}"
                    removeUnique_person:"${person_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    parrot_id                    person_id                  }
                }`

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
                return response.data.data.updateParrot;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }






    static bulkAddCsv(context) {
        throw new Error("parrot.bulkAddCsv is not implemented.")
    }

    static async csvTableTemplate(benignErrorReporter) {
        let query = `query { csvTableTemplateParrot }`;

        try {
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.csvTableTemplateParrot;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

}