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
    model: 'capital',
    storageType: 'cenz-server',
    url: 'http://integration_test_server1-graphql-container:3000/graphql',
    attributes: {
        name: 'String',
        country_id: 'String',
        capital_id: 'String'
    },
    associations: {
        unique_country: {
            type: 'to_one',
            target: 'country',
            targetKey: 'country_id',
            keyIn: 'capital',
            targetStorageType: 'sql',
            name: 'unique_country',
            name_lc: 'unique_country',
            name_cp: 'Unique_country',
            target_lc: 'country',
            target_lc_pl: 'countries',
            target_pl: 'countries',
            target_cp: 'Country',
            target_cp_pl: 'Countries',
            keyIn_lc: 'capital',
            holdsForeignKey: true
        }
    },
    internalId: 'capital_id',
    id: {
        name: 'capital_id',
        type: 'String'
    }
};

const url = "http://integration_test_server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class capital {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        capital_id,
        name,
        country_id
    }) {
        this.capital_id = capital_id;
        this.name = name;
        this.country_id = country_id;
    }

    static get name() {
        return "capital";
    }

    static readById(id) {
        let query = `query readOneCapital{ readOneCapital(capital_id: "${id}"){capital_id        name
            country_id
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let item = new capital(res.data.data.readOneCapital);
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
        let query = `query countCapitals($search: searchCapitalInput){
      countCapitals(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            return {
                sum: res.data.data.countCapitals,
                errors: []
            };
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query capitals($search: searchCapitalInput $pagination: paginationInput $order: [orderCapitalInput]){
      capitals(search:$search pagination:$pagination order:$order){capital_id          name
                country_id
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
                let data = res.data.data.capitals;
                return data.map(item => {
                    return new capital(item)
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

        let query = `query capitalsConnection($search: searchCapitalInput $pagination: paginationCursorInput $order: [orderCapitalInput]){

      capitalsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  capital_id  name
        country_id
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
                let data_edges = res.data.data.capitalsConnection.edges;
                let pageInfo = res.data.data.capitalsConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new capital(e.node),
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
              mutation addCapital(
                      $capital_id:ID!  
                $name:String              ){
                addCapital(                capital_id:$capital_id  
                name:$name){
                  capital_id                        name
                        country_id
                      }
              }`;

                return axios.post(url, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return new capital(res.data.data.addCapital);
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
                deleteCapital{
                  deleteCapital(
                    capital_id: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteCapital;
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
                updateCapital(
                  $capital_id:ID! 
                  $name:String                 ){
                  updateCapital(
                    capital_id:$capital_id 
                    name:$name                   ){
                    capital_id 
                    name 
                    country_id 
                  }
                }`

                return axios.post(url, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return new capital(res.data.data.updateCapital);
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
            let query = `mutation {bulkAddCapitalCsv{capital_id}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddCapitalCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateCapital }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateCapital;
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }



    /**
     * add_country_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   capital_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static add_country_id(capital_id, country_id) {
        let query = `
            mutation
              updateCapital{
                updateCapital(
                  capital_id:"${capital_id}"
                  addUnique_country:"${country_id}"
                ){
                  capital_id                  country_id                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new capital(res.data.data.updateCapital);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * remove_country_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   capital_id   IdAttribute of the root model to be updated
     * @param {Id}   country_id Foreign Key (stored in "Me") of the Association to be updated.
     */
    static remove_country_id(capital_id, country_id) {
        let query = `
            mutation
              updateCapital{
                updateCapital(
                  capital_id:"${capital_id}"
                  removeUnique_country:"${country_id}"
                ){
                  capital_id                  country_id                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new capital(res.data.data.updateCapital);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
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
        let attributes = Object.keys(capital.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return capital.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return capital.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of capital.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[capital.idAttribute()]
    }
};