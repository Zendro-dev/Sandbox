const _ = require('lodash');
const path = require('path');

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
    model: 'Location',
    storageType: 'cenz-server',
    url: 'http://server1:3000/graphql',
    attributes: {
        locationId: 'String',
        country: 'String',
        state: 'String',
        municipality: 'String',
        locality: 'String'
    },
    associations: {
        accessions: {
            type: 'to_many',
            target: 'Accession',
            targetKey: 'locationId',
            keyIn: 'Accession',
            targetStorageType: 'sql',
            label: 'accession_id'
        }
    },
    internalId: 'locationId',
    id: {
        name: 'locationId',
        type: 'String'
    }
};

const remoteCenzontleURL = "http://server1:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Location {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        locationId,
        country,
        state,
        municipality,
        locality
    }) {
        this.locationId = locationId;
        this.country = country;
        this.state = state;
        this.municipality = municipality;
        this.locality = locality;
    }

    static get name() {
        return "location";
    }

    static async readById(id, benignErrorReporter) {
        let query = `query readOneLocation{ readOneLocation(locationId: "${id}"){locationId       country
          state
          municipality
          locality
     } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
                let item = new Location(response.data.data.readOneLocation);
                await validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item);
                return item;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `query countLocations($search: searchLocationInput){
      countLocations(search: $search)
    }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
                return response.data.data.countLocations;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        let query = `query locations($search: searchLocationInput $pagination: paginationInput $order: [orderLocationInput]){
      locations(search:$search pagination:$pagination order:$order){locationId          country
                state
                municipality
                locality
        } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
                let data = response.data.data.locations;
                return data.map(item => {
                    return new Location(item)
                });
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

        let query = `query locationsConnection($search: searchLocationInput $pagination: paginationCursorInput $order: [orderLocationInput]){
      locationsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  locationId  country
        state
        municipality
        locality
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

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
                let data_edges = response.data.data.locationsConnection.edges;
                let pageInfo = response.data.data.locationsConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new Location(e.node),
                        cursor: e.cursor
                    }
                })

                return {
                    edges,
                    pageInfo
                };
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
            mutation addLocation(
                  $locationId:ID!  
              $country:String
              $state:String
              $municipality:String
              $locality:String            ){
              addLocation(              locationId:$locationId  
              country:$country
              state:$state
              municipality:$municipality
              locality:$locality){
                locationId                    country
                    state
                    municipality
                    locality
                  }
            }`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            await validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input);
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new Location(response.data.data.addLocation);
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
                deleteLocation{
                  deleteLocation(
                    locationId: "${id}" )}`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            await validatorUtil.ifHasValidatorFunctionInvoke('validateForDelete', this, id);
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
                return response.data.data.deleteLocation;
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
              updateLocation(
                $locationId:ID! 
                $country:String 
                $state:String 
                $municipality:String 
                $locality:String               ){
                updateLocation(
                  locationId:$locationId 
                  country:$country 
                  state:$state 
                  municipality:$municipality 
                  locality:$locality                 ){
                  locationId 
                  country 
                  state 
                  municipality 
                  locality 
                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            await validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input);
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteCenzontleURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new Location(response.data.data.updateLocation);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
        }
    }

    static async bulkAddCsv(context, benignErrorReporter) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let csvRequestMv = await context.request.files.csv_file.mv(tmpFile);
            let query = `mutation {bulkAddLocationCsv}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            let response = await axios.post(remoteCenzontleURL, formData, {
                headers: formData.getHeaders()
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            return response.data.data.bulkAddLocationCsv;

        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
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
        let query = `query { csvTableTemplateLocation }`;
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let response = await axios.post(remoteCenzontleURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteCenzontleURL));
            }
            return response.data.data.csvTableTemplateLocation;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteCenzontleURL);
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
        let attributes = Object.keys(Location.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Location.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Location.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Location.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Location.idAttribute()]
    }
};