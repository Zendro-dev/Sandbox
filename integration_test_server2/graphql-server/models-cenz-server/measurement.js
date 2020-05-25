const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4');
const globals = require('../config/globals');
const helper = require('../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Measurement',
    storageType: 'cenz-server',
    url: 'http://integration_test_server1-graphql-container:3000/graphql',
    attributes: {
        measurement_id: 'String',
        name: 'String',
        method: 'String',
        reference: 'String',
        accessionId: 'String'
    },
    associations: {
        accession: {
            type: 'to_one',
            target: 'Accession',
            targetKey: 'accessionId',
            keyIn: 'Measurement',
            targetStorageType: 'sql',
            label: 'accession_id',
            name: 'accession',
            name_lc: 'accession',
            name_cp: 'Accession',
            target_lc: 'accession',
            target_lc_pl: 'accessions',
            target_pl: 'Accessions',
            target_cp: 'Accession',
            target_cp_pl: 'Accessions',
            keyIn_lc: 'measurement',
            holdsForeignKey: true
        }
    },
    internalId: 'measurement_id',
    id: {
        name: 'measurement_id',
        type: 'String'
    }
};

const url = "http://integration_test_server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Measurement {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        measurement_id,
        name,
        method,
        reference,
        accessionId
    }) {
        this.measurement_id = measurement_id;
        this.name = name;
        this.method = method;
        this.reference = reference;
        this.accessionId = accessionId;
    }

    static get name() {
        return "measurement";
    }

    static readById(id) {
        let query = `query readOneMeasurement{ readOneMeasurement(measurement_id: "${id}"){measurement_id        name
            method
            reference
            accessionId
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Measurement(res.data.data.readOneMeasurement);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `query countMeasurements($search: searchMeasurementInput){
      countMeasurements(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            return {
                sum: res.data.data.countMeasurements,
                errors: []
            };
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query measurements($search: searchMeasurementInput $pagination: paginationInput $order: [orderMeasurementInput]){
      measurements(search:$search pagination:$pagination order:$order){measurement_id          name
                method
                reference
                accessionId
        } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let data = res.data.data.measurements;
                return data.map(item => {
                    return new Measurement(item)
                });
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });

    }

    static readAllCursor(search, order, pagination) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let query = `query measurementsConnection($search: searchMeasurementInput $pagination: paginationCursorInput $order: [orderMeasurementInput]){

      measurementsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  measurement_id  name
        method
        reference
        accessionId
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            //check
            if (helper.isNonEmptyArray(res.data.errors)) {
                throw new Error(JSON.stringify(res.data.errors));
            }
            if (res && res.data && res.data.data) {
                let data_edges = res.data.data.measurementsConnection.edges;
                let pageInfo = res.data.data.measurementsConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new Measurement(e.node),
                        cursor: e.cursor
                    }
                })

                return {
                    edges,
                    pageInfo
                };
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static addOne(input) {
        let query = `
        mutation addMeasurement(
          $measurement_id:ID!  
          $name:String
          $method:String
          $reference:String        ){
          addMeasurement(          measurement_id:$measurement_id  
          name:$name
          method:$method
          reference:$reference){
            measurement_id            name
            method
            reference
            accessionId
          }
        }`;

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Measurement(res.data.data.addMeasurement);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static deleteOne(id) {
        let query = `
          mutation
            deleteMeasurement{
              deleteMeasurement(
                measurement_id: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static updateOne(input) {
        let query = `
          mutation
            updateMeasurement(
              $measurement_id:ID! 
              $name:String 
              $method:String 
              $reference:String             ){
              updateMeasurement(
                measurement_id:$measurement_id 
                name:$name 
                method:$method 
                reference:$reference               ){
                measurement_id 
                name 
                method 
                reference 
                accessionId 
              }
            }`

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Measurement(res.data.data.updateMeasurement);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * add_accessionId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accessionId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static add_accessionId(measurement_id, accessionId) {
        let query = `
            mutation
              updateMeasurement{
                updateMeasurement(
                  measurement_id:"${measurement_id}"
                  addAccession:"${accessionId}"
                ){
                  measurement_id                  accessionId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Measurement(res.data.data.updateMeasurement);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * remove_accessionId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accessionId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static remove_accessionId(measurement_id, accessionId) {
        let query = `
            mutation
              updateMeasurement{
                updateMeasurement(
                  measurement_id:"${measurement_id}"
                  removeAccession:"${accessionId}"
                ){
                  measurement_id                  accessionId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Measurement(res.data.data.updateMeasurement);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }


    static bulkAddCsv(context) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        return context.request.files.csv_file.mv(tmpFile).then(() => {
            let query = `mutation {bulkAddMeasurementCsv{measurement_id}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddMeasurementCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateMeasurement }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateMeasurement;
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
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
        let attributes = Object.keys(Measurement.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Measurement.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Measurement.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Measurement.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Measurement.idAttribute()]
    }
};