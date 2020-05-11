const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phis-graphql-container:3001/graphql";
const iriRegex = new RegExp('phis');

module.exports = class eventParameter_PHIS {

    static get adapterName() {
        return 'eventParameter_PHIS';
    }

    static get adapterType() {
        return 'cenzontle-webservice-adapter';
    }

    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static readById(iri) {
        let query = `
          query
            readOneEventParameter
            {
              readOneEventParameter(eventParameterDbId:"${iri}")
              {
                eventParameterDbId 
                key 
                rdfValue 
                value 
                eventDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneEventParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `
      query countEventParameters($search: searchEventParameterInput){
        countEventParameters(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countEventParameters;
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
        let query = `query eventParametersConnection($search: searchEventParameterInput $pagination: paginationCursorInput $order: [orderEventParameterInput]){
      eventParametersConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  eventParameterDbId  key
         rdfValue
         value
         eventDbId
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
                return res.data.data.eventParametersConnection;
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
        mutation addEventParameter(
          $eventParameterDbId:ID!  
          $key:String
          $rdfValue:String
          $value:String        ){
          addEventParameter(          eventParameterDbId:$eventParameterDbId  
          key:$key
          rdfValue:$rdfValue
          value:$value){
            eventParameterDbId            key
            rdfValue
            value
            eventDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addEventParameter;
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
            deleteEventParameter{
              deleteEventParameter(
                eventParameterDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteEventParameter;
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
            updateEventParameter(
              $eventParameterDbId:ID! 
              $key:String 
              $rdfValue:String 
              $value:String             ){
              updateEventParameter(
                eventParameterDbId:$eventParameterDbId 
                key:$key 
                rdfValue:$rdfValue 
                value:$value               ){
                eventParameterDbId 
                key 
                rdfValue 
                value 
                eventDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEventParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_eventDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   eventParameterDbId   IdAttribute of the root model to be updated
     * @param {Id}   eventDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_eventDbId(eventParameterDbId, eventDbId) {
        let query = `
              mutation
                updateEventParameter{
                  updateEventParameter(
                    eventParameterDbId:"${eventParameterDbId}"
                    addEvent:"${eventDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    eventParameterDbId                    eventDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEventParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_eventDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   eventParameterDbId   IdAttribute of the root model to be updated
     * @param {Id}   eventDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_eventDbId(eventParameterDbId, eventDbId) {
        let query = `
              mutation
                updateEventParameter{
                  updateEventParameter(
                    eventParameterDbId:"${eventParameterDbId}"
                    removeEvent:"${eventDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    eventParameterDbId                    eventDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEventParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("eventParameter.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateEventParameter }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateEventParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}