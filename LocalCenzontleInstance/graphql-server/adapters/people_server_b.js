const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql";
const iriRegex = new RegExp('_server_b');

module.exports = class people_server_b {

    static get adapterName() {
        return 'people_server_b';
    }

    static get adapterType() {
        return 'remote';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static readById(iri) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: readById \niri: ", iri, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        let query = `
          query 
            readOnePerson
            {
              readOnePerson(internalPersonId:"${iri}")
              { 
                internalPersonId 
                firstName 
                lastName 
                email 
                companyId 
              }
            }`;

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: gql:\n");

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOnePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static countRecords(search) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: countRecords \nsearch: ", search, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        let query = `
      query countPeople($search: searchPersonInput){
        countPeople(search: $search)
      }`

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: gql:\n", {
            search: search
        });

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countPeople;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static readAllCursor(search, order, pagination) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: readAllCursor \search: ", search, "\norder: ", order, "\npagination: ", pagination, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }
        let query = `query peopleConnection($search: searchPersonInput $pagination: paginationCursorInput $order: [orderPersonInput]){
      peopleConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  internalPersonId  firstName
         lastName
         email
         companyId
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: gql:\n", {
            search: search,
            order: order,
            pagination: pagination
        });

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.peopleConnection;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static addOne(input) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: addOne \ninput: ", input, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        let query = `
        mutation addPerson(
          $internalPersonId:ID!  
          $firstName:String
          $lastName:String
          $email:String
          $companyId:Int 
          $addWorks:[ID]
 
        ){
          addPerson( 
          internalPersonId:$internalPersonId  
          firstName:$firstName
          lastName:$lastName
          email:$email
          companyId:$companyId   addWorks:$addWorks){
            internalPersonId 
            firstName
            lastName
            email
            companyId
          }
        }`;

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: gql:\n", input);

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addPerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static deleteOne(id) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: deleteOne \nid: ", id, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        let query = `
          mutation 
            deletePerson{ 
              deletePerson(
                internalPersonId: "${id}" )}`;

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: \n");

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deletePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static updateOne(input) {
        /**
         * Debug
         */
        console.log("-@@@------ adapter: (", this.adapterType, ") : ", this.adapterName, "\n- on: updateOne \ninput: ", input, "\nremoteCenzontleURL: ", remoteCenzontleURL);

        let query = `
          mutation 
            updatePerson(
              $internalPersonId:ID! 
              $firstName:String 
              $lastName:String 
              $email:String 
              $companyId:Int    
              $addWorks:[ID] 
              $removeWorks:[ID] 
            ){
              updatePerson(
                internalPersonId:$internalPersonId 
                firstName:$firstName 
                lastName:$lastName 
                email:$email 
                companyId:$companyId    
                addWorks:$addWorks 
                removeWorks:$removeWorks 
              ){
                internalPersonId 
                firstName 
                lastName 
                email 
                companyId 
              }
            }`

        /**
         * Debug
         */
        console.log("\nquery: gql:\n", query, "\nvariables: gql:\n", input);

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updatePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static bulkAddCsv(context) {
        throw Error("Person.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplatePerson }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplatePerson;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}