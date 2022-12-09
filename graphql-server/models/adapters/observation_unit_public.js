const axios_general = require('axios');
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const errorHelper = require('../../utils/errors');
const helper = require('../../utils/helper');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://graphql.zendro-dev.org/graphql";
const iriRegex = new RegExp('zendro_public');

module.exports = class observation_unit_public {

    static get adapterName() {
        return 'observation_unit_public';
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
            readOneObservation_unit
            {
              readOneObservation_unit(id:"${iri}")
              {
                id 
                type 
                external_id 
                spatial_distribution 
                study_id 
                biological_material_ids 
                data_file_ids 
                event_ids 
                factor_ids 
                
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
                return response.data.data.readOneObservation_unit;
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
      query countObservation_units($search: searchObservation_unitInput){
        countObservation_units(search: $search)
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
                return response.data.data.countObservation_units;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }

    }

    static async readAllCursor(search, order, pagination, benignErrorReporter, token) {

        let query = `query observation_unitsConnection($search: searchObservation_unitInput $pagination: paginationCursorInput! $order: [orderObservation_unitInput]){
      observation_unitsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  type
         external_id
         spatial_distribution
         study_id
         biological_material_ids
         data_file_ids
         event_ids
         factor_ids
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
            if (response && response.data && response.data.data && response.data.data.observation_unitsConnection !== null) {
                return response.data.data.observation_unitsConnection;
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
          mutation addObservation_unit(
              $id:ID!  
            $type:String
            $external_id:String
            $spatial_distribution:String          ){
            addObservation_unit(            id:$id  
            type:$type
            external_id:$external_id
            spatial_distribution:$spatial_distribution){
              id                type
                external_id
                spatial_distribution
                study_id
                biological_material_ids
                data_file_ids
                event_ids
                factor_ids
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
                return response.data.data.addObservation_unit;
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
            deleteObservation_unit{
              deleteObservation_unit(
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
                return response.data.data.deleteObservation_unit;
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
            updateObservation_unit(
              $id:ID! 
              $type:String 
              $external_id:String 
              $spatial_distribution:String             ){
              updateObservation_unit(
                id:$id 
                type:$type 
                external_id:$external_id 
                spatial_distribution:$spatial_distribution               ){
                id 
                type 
                external_id 
                spatial_distribution 
                study_id 
                biological_material_ids 
                data_file_ids 
                event_ids 
                factor_ids 
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
                return response.data.data.updateObservation_unit;
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
                updateObservation_unit{
                  updateObservation_unit(
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
     * add_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_biological_material_ids(id, biological_material_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      addBiological_materials:["${biological_material_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      biological_material_ids                    }
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
                return response.data.data.updateObservation_unit;
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
                  updateObservation_unit{
                    updateObservation_unit(
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
                return response.data.data.updateObservation_unit;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_event_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   event_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_event_ids(id, event_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      addEvents:["${event_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      event_ids                    }
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
                return response.data.data.updateObservation_unit;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * add_factor_ids - field Mutation (model-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async add_factor_ids(id, factor_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      addFactors:["${factor_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      factor_ids                    }
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
                return response.data.data.updateObservation_unit;
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
                updateObservation_unit{
                  updateObservation_unit(
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
     * remove_biological_material_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   biological_material_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_biological_material_ids(id, biological_material_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      removeBiological_materials:["${biological_material_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      biological_material_ids                    }
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
                return response.data.data.updateObservation_unit;
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
                  updateObservation_unit{
                    updateObservation_unit(
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
                return response.data.data.updateObservation_unit;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * remove_event_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   event_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_event_ids(id, event_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      removeEvents:["${event_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      event_ids                    }
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
                return response.data.data.updateObservation_unit;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * remove_factor_ids - field Mutation (model-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}   factor_ids Array foreign Key (stored in "Me") of the Association to be updated.
     * @param {string} token The token used for authorization
     * @param {boolean} handle_inverse Handle inverse association
     */

    static async remove_factor_ids(id, factor_ids, benignErrorReporter, token) {
        let query = `
                mutation
                  updateObservation_unit{
                    updateObservation_unit(
                      id:"${id}"
                      removeFactors:["${factor_ids.join("\",\"")}"]
                      skipAssociationsExistenceChecks: true
                    ){
                      id                      factor_ids                    }
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
                return response.data.data.updateObservation_unit;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    static async csvTableTemplate(benignErrorReporter, token) {
        let query = `query { csvTableTemplateObservation_unit }`;

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
            return response.data.data.csvTableTemplateObservation_unit;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * bulkAssociateObservation_unitWithStudy_id - bulkAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to add
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkAssociateObservation_unitWithStudy_id($bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput]){
          bulkAssociateObservation_unitWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
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
                return response.data.data.bulkAssociateObservation_unitWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }


    /**
     * bulkDisAssociateObservation_unitWithStudy_id - bulkDisAssociaton of given ids
     *
     * @param  {array} bulkAssociationInput Array of associations to remove
     * @param  {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     * @param  {string} token The token used for authorization
     * @return {string} returns message on success
     */
    static async bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput, benignErrorReporter, token) {
        let query = `mutation  bulkDisAssociateObservation_unitWithStudy_id($bulkAssociationInput: [bulkAssociationObservation_unitWithStudy_idInput]){
          bulkDisAssociateObservation_unitWithStudy_id(bulkAssociationInput: $bulkAssociationInput, skipAssociationsExistenceChecks: true) 
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
                return response.data.data.bulkDisAssociateObservation_unitWithStudy_id;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



}