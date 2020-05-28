const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4');
const globals = require('../config/globals');
const validatorUtil = require('../utils/validatorUtil');
const helper = require('../utils/helper');
const errorHelper = require('../utils/errors');


// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Accession',
    storageType: 'cenz-server',
    url: 'http://integration_test_server1-graphql-container:3000/graphql',
    attributes: {
        accession_id: 'String',
        collectors_name: 'String',
        collectors_initials: 'String',
        sampling_date: 'Date',
        locationId: 'String'
    },
    associations: {
        location: {
            type: 'to_one',
            target: 'Location',
            targetKey: 'locationId',
            keyIn: 'Accession',
            targetStorageType: 'sql',
            label: 'country',
            sublabel: 'state',
            name: 'location',
            name_lc: 'location',
            name_cp: 'Location',
            target_lc: 'location',
            target_lc_pl: 'locations',
            target_pl: 'Locations',
            target_cp: 'Location',
            target_cp_pl: 'Locations',
            keyIn_lc: 'accession',
            holdsForeignKey: true
        },
        measurements: {
            type: 'to_many',
            target: 'Measurement',
            targetKey: 'accessionId',
            keyIn: 'Measurement',
            targetStorageType: 'sql',
            label: 'name',
            name: 'measurements',
            name_lc: 'measurements',
            name_cp: 'Measurements',
            target_lc: 'measurement',
            target_lc_pl: 'measurements',
            target_pl: 'Measurements',
            target_cp: 'Measurement',
            target_cp_pl: 'Measurements',
            keyIn_lc: 'measurement',
            holdsForeignKey: false
        }
    },
    internalId: 'accession_id',
    id: {
        name: 'accession_id',
        type: 'String'
    }
};

const url = "http://integration_test_server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Accession {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        accession_id,
        collectors_name,
        collectors_initials,
        sampling_date,
        locationId
    }) {
        this.accession_id = accession_id;
        this.collectors_name = collectors_name;
        this.collectors_initials = collectors_initials;
        this.sampling_date = sampling_date;
        this.locationId = locationId;
    }

    static get name() {
        return "accession";
    }

    static readById(id) {
        let query = `query readOneAccession{ readOneAccession(accession_id: "${id}"){accession_id        collectors_name
            collectors_initials
            sampling_date
            locationId
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let item = new Accession(res.data.data.readOneAccession);
                return validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item)
                    .then((valSuccess) => {
                        return item
                    })
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `query countAccessions($search: searchAccessionInput){
      countAccessions(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            return {
                sum: res.data.data.countAccessions,
                errors: []
            };
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query accessions($search: searchAccessionInput $pagination: paginationInput $order: [orderAccessionInput]){
      accessions(search:$search pagination:$pagination order:$order){accession_id          collectors_name
                collectors_initials
                sampling_date
                locationId
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
                let data = res.data.data.accessions;
                return data.map(item => {
                    return new Accession(item)
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

        let query = `query accessionsConnection($search: searchAccessionInput $pagination: paginationCursorInput $order: [orderAccessionInput]){

      accessionsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  accession_id  collectors_name
        collectors_initials
        sampling_date
        locationId
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
                let data_edges = res.data.data.accessionsConnection.edges;
                let pageInfo = res.data.data.accessionsConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new Accession(e.node),
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

    static addOne(input, benignErrorReporter) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
            .then(async (valSuccess) => {
                let query = `
              mutation addAccession(
                      $accession_id:ID!
                $collectors_name:String
                $collectors_initials:String
                $sampling_date:Date              ){
                addAccession(                accession_id:$accession_id
                collectors_name:$collectors_name
                collectors_initials:$collectors_initials
                sampling_date:$sampling_date){
                  accession_id                        collectors_name
                        collectors_initials
                        sampling_date
                        locationId
                      }
              }`;

              let errMessageIfNeeded = `Remote service ${url} returned error(s).`
              //let dataAndBeningErrors = { data: {}, beningErrors: [] }

              benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef( benignErrorReporter );

              try {
                let response = await axios.post(url, {
                    query: query,
                    variables: input
                })
                // STATUS-CODE is 200 -
                // NO ERROR as such has been detected by the server (Express),
                // though there might be errors from the remote GraphQL instance.
                errorHelper.handleErrorsInGraphQlResponse(response.data, benignErrorReporter);
                if (response && response.data && response.data.data) {
                    return new Accession(response.data.data.addAccession);
                }

              } catch (error) {
                if (!errorHelper.isRemoteGraphQlError(error)) {
                    // Non remote error:
                    throw error
                } else {
                    // STATUS CODE is NOT 200,
                    // which means a rather serious error was sent by the remote server.
                    benignErrorReporter.reportError(errorHelper.handleRemoteErrors(error.response.data.errors, url));
                    throw new Error(`Web-service ${url} returned attached (see below) error(s).`)
                }
              }


                // return axios.post(url, {
                //     query: query,
                //     variables: input
                // }).then(res => {
                //     //check
                //     if (res && res.data && res.data.data) {
                //         return new Accession(res.data.data.addAccession);
                //     } else {
                //         throw new Error(`Invalid response from remote cenz-server: ${url}`);
                //     }
                // }).catch(error => {
                //     error['url'] = url;
                //     handleError(error);
                // });
            });
    }

    static deleteOne(id) {
        let query = `
              mutation
                deleteAccession{
                  deleteAccession(
                    accession_id: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteAccession;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static updateOne(input) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input)
            .then(async (valSuccess) => {
                let query = `
              mutation
                updateAccession(
                  $accession_id:ID!
                  $collectors_name:String
                  $collectors_initials:String
                  $sampling_date:Date                 ){
                  updateAccession(
                    accession_id:$accession_id
                    collectors_name:$collectors_name
                    collectors_initials:$collectors_initials
                    sampling_date:$sampling_date                   ){
                    accession_id
                    collectors_name
                    collectors_initials
                    sampling_date
                    locationId
                  }
                }`

                return axios.post(url, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return new Accession(res.data.data.updateAccession);
                    } else {
                        throw new Error(`Invalid response from remote cenz-server: ${url}`);
                    }
                }).catch(error => {
                    error['url'] = url;
                    handleError(error);
                });
            });
    }

    /**
     * add_locationId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   locationId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static add_locationId(accession_id, locationId) {
        let query = `
            mutation
              updateAccession{
                updateAccession(
                  accession_id:"${accession_id}"
                  addLocation:"${locationId}"
                ){
                  accession_id                  locationId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Accession(res.data.data.updateAccession);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * remove_locationId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   accession_id   IdAttribute of the root model to be updated
     * @param {Id}   locationId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static remove_locationId(accession_id, locationId) {
        let query = `
            mutation
              updateAccession{
                updateAccession(
                  accession_id:"${accession_id}"
                  removeLocation:"${locationId}"
                ){
                  accession_id                  locationId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Accession(res.data.data.updateAccession);
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
            let query = `mutation {bulkAddAccessionCsv{accession_id}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddAccessionCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateAccession }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateAccession;
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
        let attributes = Object.keys(Accession.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Accession.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Accession.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Accession.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Accession.idAttribute()]
    }
};
