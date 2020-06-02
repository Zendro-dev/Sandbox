const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');
const validatorUtil = require('../utils/validatorUtil');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://integration_test_server1-graphql-container:3000/graphql";
const iriRegex = new RegExp('instance1');

module.exports = class dog_instance1 {

    static get adapterName() {
        return 'dog_instance1';
    }

    static get adapterType() {
        return 'ddm-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static readById(iri) {
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

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static async countRecords(search) {
        // return new Promise( (res, rej) =>{
        //     rej( new Error('Something went wrong in cenz adapter') )
        // });
       //return await Promise.reject(new Error('Something went wrong in cenz adapter'));
      throw new Error("Something went wrong in cenz adapter");

        let query = `
      query countDogs($search: searchDogInput){
        countDogs(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countDogs;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static readAllCursor(search, order, pagination) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }
        let query = `query dogsConnection($search: searchDogInput $pagination: paginationCursorInput $order: [orderDogInput]){
      dogsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  dog_id  name
         person_id
        } } pageInfo{ startCursor endCursor hasPreviousPage hasNextPage } } }`

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
                return res.data.data.dogsConnection;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static addOne(input) {
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

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static deleteOne(id) {
        let query = `
          mutation
            deleteDog{
              deleteDog(
                dog_id: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static updateOne(input) {
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

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_person_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_person_id(dog_id, person_id) {
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

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_person_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   dog_id   IdAttribute of the root model to be updated
     * @param {Id}   person_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_person_id(dog_id, person_id) {
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

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("dog.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateDog }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateDog;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}
