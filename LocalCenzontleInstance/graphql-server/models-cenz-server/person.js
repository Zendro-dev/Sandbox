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
    model: 'Person',
    storageType: 'cenz-server',
    url: 'http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql',
    attributes: {
        firstName: 'String',
        lastName: 'String',
        email: 'String',
        companyId: 'Int',
        internalPId: 'String',
        internalEId: 'Int'
    },
    associations: {
        works: {
            type: 'to_many',
            target: 'Book',
            keyIn: 'Book',
            targetKey: 'internalPId',
            targetStorageType: 'cenz_server',
            label: 'title',
            name: 'works',
            name_lc: 'works',
            name_cp: 'Works',
            target_lc: 'book',
            target_lc_pl: 'books',
            target_pl: 'Books',
            target_cp: 'Book',
            target_cp_pl: 'Books',
            keyIn_lc: 'book',
            holdsForeignKey: false
        },
        employer: {
            type: 'to_one',
            target: 'Employer',
            keyIn: 'Person',
            targetKey: 'internalEId',
            targetStorageType: 'cenz_server',
            label: 'employer',
            name: 'employer',
            name_lc: 'employer',
            name_cp: 'Employer',
            target_lc: 'employer',
            target_lc_pl: 'employers',
            target_pl: 'Employers',
            target_cp: 'Employer',
            target_cp_pl: 'Employers',
            keyIn_lc: 'person',
            holdsForeignKey: true
        }
    },
    internalId: 'internalPId',
    id: {
        name: 'internalPId',
        type: 'String'
    }
};

const url = "http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Person {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        internalPId,
        firstName,
        lastName,
        email,
        companyId,
        internalEId
    }) {
        this.internalPId = internalPId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.companyId = companyId;
        this.internalEId = internalEId;
    }

    static get name() {
        return "person";
    }

    static readById(id) {
        let query = `query readOnePerson{ readOnePerson(internalPId: "${id}"){internalPId        firstName
            lastName
            email
            companyId
            internalEId
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Person(res.data.data.readOnePerson);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `query countPeople($search: searchPersonInput){
      countPeople(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countPeople;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query people($search: searchPersonInput $pagination: paginationInput $order: [orderPersonInput]){
      people(search:$search pagination:$pagination order:$order){internalPId          firstName
                lastName
                email
                companyId
                internalEId
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
                let data = res.data.data.people;
                return data.map(item => {
                    return new Person(item)
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

        let query = `query peopleConnection($search: searchPersonInput $pagination: paginationCursorInput $order: [orderPersonInput]){

      peopleConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  internalPId  firstName
        lastName
        email
        companyId
        internalEId
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
            if (res && res.data && res.data.data) {
                let data_edges = res.data.data.peopleConnection.edges;
                let pageInfo = res.data.data.peopleConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new Person(e.node),
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
        mutation addPerson(
          $internalPId:ID!  
          $firstName:String
          $lastName:String
          $email:String
          $companyId:Int        ){
          addPerson(          internalPId:$internalPId  
          firstName:$firstName
          lastName:$lastName
          email:$email
          companyId:$companyId){
            internalPId            firstName
            lastName
            email
            companyId
            internalEId
          }
        }`;

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Person(res.data.data.addPerson);
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
            deletePerson{
              deletePerson(
                internalPId: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deletePerson;
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
            updatePerson(
              $internalPId:ID! 
              $firstName:String 
              $lastName:String 
              $email:String 
              $companyId:Int             ){
              updatePerson(
                internalPId:$internalPId 
                firstName:$firstName 
                lastName:$lastName 
                email:$email 
                companyId:$companyId               ){
                internalPId 
                firstName 
                lastName 
                email 
                companyId 
                internalEId 
              }
            }`

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Person(res.data.data.updatePerson);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * add_internalEId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   internalPId   IdAttribute of the root model to be updated
     * @param {Id}   internalEId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static add_internalEId(internalPId, internalEId) {
        let query = `
            mutation
              updatePerson{
                updatePerson(
                  internalPId:"${internalPId}"
                  addEmployer:"${internalEId}"
                ){
                  internalPId                  internalEId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Person(res.data.data.updatePerson);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * remove_internalEId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   internalPId   IdAttribute of the root model to be updated
     * @param {Id}   internalEId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static remove_internalEId(internalPId, internalEId) {
        let query = `
            mutation
              updatePerson{
                updatePerson(
                  internalPId:"${internalPId}"
                  removeEmployer:"${internalEId}"
                ){
                  internalPId                  internalEId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Person(res.data.data.updatePerson);
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
            let query = `mutation {bulkAddPersonCsv{internalPId}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddPersonCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplatePerson }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplatePerson;
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
        let attributes = Object.keys(Person.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Person.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Person.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Person.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Person.idAttribute()]
    }
};