const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4');
const globals = require('../config/globals');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Employer',
    storageType: 'cenz-server',
    url: 'http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql',
    attributes: {
        employer: 'String'
    },
    associations: {
        employees: {
            type: 'to_many',
            target: 'Person',
            targetKey: 'internalEId',
            keyIn: 'Person',
            targetStorageType: 'cenz_server',
            label: 'firstName',
            sublabel: 'email',
            name: 'employees',
            name_lc: 'employees',
            name_cp: 'Employees',
            target_lc: 'person',
            target_lc_pl: 'people',
            target_pl: 'People',
            target_cp: 'Person',
            target_cp_pl: 'People',
            keyIn_lc: 'person',
            holdsForeignKey: false
        }
    },
    id: {
        name: 'id',
        type: 'Int'
    }
};

const url = "http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Employer {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        employer
    }) {
        this.id = id;
        this.employer = employer;
    }

    static get name() {
        return "employer";
    }

    static readById(id) {
        let query = `query readOneEmployer{ readOneEmployer(id: "${id}"){id        employer
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            let data = res.data.data.readOneEmployer;
            return new Employer(data);
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `query countEmployers($search: searchEmployerInput){
      countEmployers(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            return res.data.data.countEmployers;
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query employers($search: searchEmployerInput $pagination: paginationInput $order: [orderEmployerInput]){
      employers(search:$search pagination:$pagination order:$order){id          employer
        } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            let data = res.data.data.employers;
            return data.map(item => {
                return new Employer(item)
            });
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

        let query = `query employersConnection($search: searchEmployerInput $pagination: paginationCursorInput $order: [orderEmployerInput]){

      employersConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  employer
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            let data_edges = res.data.data.employersConnection.edges;
            let pageInfo = res.data.data.employersConnection.pageInfo;

            let edges = data_edges.map(e => {
                return {
                    node: new Employer(e.node),
                    cursor: e.cursor
                }
            })

            return {
                edges,
                pageInfo
            };
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static addOne(input) {

        let query = `mutation addEmployer(        $employer:String
        $addEmployees:[ID] ){
       addEmployer(           employer:$employer
           addEmployees:$addEmployees){
          id            employer
         }
     }`;

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            let data = res.data.data.addEmployer;
            return new Employer(data);
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static deleteOne(id) {
        let query = `mutation deleteEmployer{ deleteEmployer(id: ${id}) }`;

        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.deleteEmployer;
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });

    }

    static updateOne(input) {
        let query = `mutation updateEmployer($id:ID!        $employer:String
        $addEmployees:[ID] $removeEmployees:[ID] ){
       updateEmployer(id:$id           employer:$employer
           addEmployees:$addEmployees removeEmployees:$removeEmployees ){
          id            employer
         }
     }`

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            let data = res.data.data.updateEmployer;
            return new Employer(data);
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static bulkAddCsv(context) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        return context.request.files.csv_file.mv(tmpFile).then(() => {
            let query = `mutation {bulkAddEmployerCsv{id}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddEmployerCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateEmployer }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateEmployer;
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
        let attributes = Object.keys(Employer.definition.attributes);
        attributes.push('id');
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Employer.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Employer.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Employer.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Employer.idAttribute()]
    }
};