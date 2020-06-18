const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://integration_test_server2-graphql-container:3001/graphql";
const iriRegex = new RegExp('instance2');

module.exports = class dog_instance2 {

    static get adapterName() {
        return 'dog_instance2';
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
            readOneDog
            {
              readOneDog(dog_id:"${iri}")
              {
                dog_id 
                name 
                person_id 
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
                return response.data.data.readOneDog;
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
      query countDogs($search: searchDogInput){
        countDogs(search: $search)
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
                return response.data.data.countDogs;
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
        let query = `query dogsConnection($search: searchDogInput $pagination: paginationCursorInput $order: [orderDogInput]){
      dogsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  dog_id  name
         person_id
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
                return response.data.data.dogsConnection;
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
          mutation addDog(
              $dog_id:ID!  
            $name:String          ){
            addDog(            dog_id:$dog_id  
            name:$name){
              dog_id                name
                person_id
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
                return response.data.data.addDog;
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
            deleteDog{
              deleteDog(
                dog_id: "${id}" )}`;


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
                return response.data.data.deleteDog;
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
            updateDog(
              $dog_id:ID! 
              $name:String             ){
              updateDog(
                dog_id:$dog_id 
                name:$name               ){
                dog_id 
                name 
                person_id 
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
                return response.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }


    /**
     * add_person_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services   
     */

    static async add_person_id(dog_id, person_id, benignErrorReporter) {
        let query = `
              mutation
                updateDog{
                  updateDog(
                    dog_id:"${dog_id}"
                    addPerson:"${person_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    dog_id                    person_id                  }
                }`

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
                return response.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }




    /**
     * remove_person_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote cenzontle services   
     */

    static async remove_person_id(dog_id, person_id, benignErrorReporter) {
        let query = `
              mutation
                updateDog{
                  updateDog(
                    dog_id:"${dog_id}"
                    removePerson:"${person_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    dog_id                    person_id                  }
                }`

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
                return response.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }






    static bulkAddCsv(context) {
        throw new Error("dog.bulkAddCsv is not implemented.")
    }

    static async csvTableTemplate(benignErrorReporter) {
        let query = `query { csvTableTemplateDog }`;

        try {
            let response = await axios.post(remoteCenzontleURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            return response.data.data.csvTableTemplateDog;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

}