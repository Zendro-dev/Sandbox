const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const globals = require('../config/globals');
const validatorUtil = require('../utils/validatorUtil');
const helper = require('../utils/helper');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'country',
    storageType: 'cenz-server',
    url: 'http://integration_test_server1-graphql-container:3000/graphql',
    attributes: {
        name: 'String',
        country_id: 'String'
    },
    associations: {
        unique_capital: {
            type: 'to_one',
            target: 'capital',
            targetKey: 'country_id',
            keyIn: 'capital',
            targetStorageType: 'sql',
            name: 'unique_capital',
            name_lc: 'unique_capital',
            name_cp: 'Unique_capital',
            target_lc: 'capital',
            target_lc_pl: 'capitals',
            target_pl: 'capitals',
            target_cp: 'Capital',
            target_cp_pl: 'Capitals',
            keyIn_lc: 'capital',
            holdsForeignKey: false
        }
    },
    internalId: 'country_id',
    id: {
        name: 'country_id',
        type: 'String'
    }
};

const url = "http://integration_test_server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class country {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        country_id,
        name
    }) {
        this.country_id = country_id;
        this.name = name;
    }

    static get name() {
        return "country";
    }

    static readById(id) {
        let query = `query readOneCountry{ readOneCountry(country_id: "${id}"){country_id        name
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let item = new country(res.data.data.readOneCountry);
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
        let query = `query countCountries($search: searchCountryInput){
      countCountries(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            return {
                sum: res.data.data.countCountries,
                errors: []
            };
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query countries($search: searchCountryInput $pagination: paginationInput $order: [orderCountryInput]){
      countries(search:$search pagination:$pagination order:$order){country_id          name
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
                let data = res.data.data.countries;
                return data.map(item => {
                    return new country(item)
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

        let query = `query countriesConnection($search: searchCountryInput $pagination: paginationCursorInput $order: [orderCountryInput]){

      countriesConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  country_id  name
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
                let data_edges = res.data.data.countriesConnection.edges;
                let pageInfo = res.data.data.countriesConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new country(e.node),
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
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
            .then(async (valSuccess) => {
                let query = `
              mutation addCountry(
                      $country_id:ID!  
                $name:String              ){
                addCountry(                country_id:$country_id  
                name:$name){
                  country_id                        name
                      }
              }`;

                return axios.post(url, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return new country(res.data.data.addCountry);
                    } else {
                        throw new Error(`Invalid response from remote cenz-server: ${url}`);
                    }
                }).catch(error => {
                    error['url'] = url;
                    handleError(error);
                });
            });
    }

    static deleteOne(id) {
        let query = `
              mutation
                deleteCountry{
                  deleteCountry(
                    country_id: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteCountry;
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
                updateCountry(
                  $country_id:ID! 
                  $name:String                 ){
                  updateCountry(
                    country_id:$country_id 
                    name:$name                   ){
                    country_id 
                    name 
                  }
                }`

                return axios.post(url, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return new country(res.data.data.updateCountry);
                    } else {
                        throw new Error(`Invalid response from remote cenz-server: ${url}`);
                    }
                }).catch(error => {
                    error['url'] = url;
                    handleError(error);
                });
            });
    }

    static bulkAddCsv(context) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        return context.request.files.csv_file.mv(tmpFile).then(() => {
            let query = `mutation {bulkAddCountryCsv{country_id}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddCountryCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateCountry }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateCountry;
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
        let attributes = Object.keys(country.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return country.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return country.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of country.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[country.idAttribute()]
    }
};