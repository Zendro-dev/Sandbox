const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://server1:3000/graphql";
const iriRegex = new RegExp('instance1');

module.exports = class person_instance1 {

    static get adapterName() {
        return 'person_instance1';
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
            readOnePerson
            {
              readOnePerson(person_id:"${iri}")
              {
                person_id 
                name 
              }
            }`;

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.readOnePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `
      query countPeople($search: searchPersonInput){
        countPeople(search: $search)
      }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: {
                    search: search
                }
            });

            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.countPeople;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }
        let query = `query peopleConnection($search: searchPersonInput $pagination: paginationCursorInput $order: [orderPersonInput]){
      peopleConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  person_id  name
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.peopleConnection;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async addOne(input, benignErrorReporter) {
        let query = `
          mutation addPerson(
              $person_id:ID!  
            $name:String          ){
            addPerson(            person_id:$person_id  
            name:$name){
              person_id                name
              }
          }`;

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.addPerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async deleteOne(id, benignErrorReporter) {
        let query = `
          mutation
            deletePerson{
              deletePerson(
                person_id: "${id}" )}`;


        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.deletePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async updateOne(input, benignErrorReporter) {
        let query = `
          mutation
            updatePerson(
              $person_id:ID! 
              $name:String             ){
              updatePerson(
                person_id:$person_id 
                name:$name               ){
                person_id 
                name 
              }
            }`


        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            if (response && response.data && response.data.data) {
                return response.data.data.updatePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }






    static bulkAddCsv(context) {
        throw new Error("person.bulkAddCsv is not implemented.")
    }

    static async csvTableTemplate(benignErrorReporter) {
        let query = `query { csvTableTemplatePerson }`;

        try {
            let response = await axios.post(remoteCenzontleURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            return response.data.data.csvTableTemplatePerson;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

}