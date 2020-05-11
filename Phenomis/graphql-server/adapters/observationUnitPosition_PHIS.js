const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phis-graphql-container:3001/graphql";
const iriRegex = new RegExp('phis');

module.exports = class observationUnitPosition_PHIS {

    static get adapterName() {
        return 'observationUnitPosition_PHIS';
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
            readOneObservationUnitPosition
            {
              readOneObservationUnitPosition(observationUnitPositionDbId:"${iri}")
              {
                observationUnitPositionDbId 
                blockNumber 
                entryNumber 
                positionCoordinateX 
                positionCoordinateY 
                replicate 
                observationUnitDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneObservationUnitPosition;
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
      query countObservationUnitPositions($search: searchObservationUnitPositionInput){
        countObservationUnitPositions(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countObservationUnitPositions;
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
        let query = `query observationUnitPositionsConnection($search: searchObservationUnitPositionInput $pagination: paginationCursorInput $order: [orderObservationUnitPositionInput]){
      observationUnitPositionsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  observationUnitPositionDbId  blockNumber
         entryNumber
         positionCoordinateX
         positionCoordinateY
         replicate
         observationUnitDbId
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
                return res.data.data.observationUnitPositionsConnection;
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
        mutation addObservationUnitPosition(
          $observationUnitPositionDbId:ID!  
          $blockNumber:String
          $entryNumber:String
          $positionCoordinateX:String
          $positionCoordinateY:String
          $replicate:String        ){
          addObservationUnitPosition(          observationUnitPositionDbId:$observationUnitPositionDbId  
          blockNumber:$blockNumber
          entryNumber:$entryNumber
          positionCoordinateX:$positionCoordinateX
          positionCoordinateY:$positionCoordinateY
          replicate:$replicate){
            observationUnitPositionDbId            blockNumber
            entryNumber
            positionCoordinateX
            positionCoordinateY
            replicate
            observationUnitDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addObservationUnitPosition;
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
            deleteObservationUnitPosition{
              deleteObservationUnitPosition(
                observationUnitPositionDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteObservationUnitPosition;
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
            updateObservationUnitPosition(
              $observationUnitPositionDbId:ID! 
              $blockNumber:String 
              $entryNumber:String 
              $positionCoordinateX:String 
              $positionCoordinateY:String 
              $replicate:String             ){
              updateObservationUnitPosition(
                observationUnitPositionDbId:$observationUnitPositionDbId 
                blockNumber:$blockNumber 
                entryNumber:$entryNumber 
                positionCoordinateX:$positionCoordinateX 
                positionCoordinateY:$positionCoordinateY 
                replicate:$replicate               ){
                observationUnitPositionDbId 
                blockNumber 
                entryNumber 
                positionCoordinateX 
                positionCoordinateY 
                replicate 
                observationUnitDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationUnitPosition;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitPositionDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_observationUnitDbId(observationUnitPositionDbId, observationUnitDbId) {
        let query = `
              mutation
                updateObservationUnitPosition{
                  updateObservationUnitPosition(
                    observationUnitPositionDbId:"${observationUnitPositionDbId}"
                    addObservationUnit:"${observationUnitDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationUnitPositionDbId                    observationUnitDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationUnitPosition;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitPositionDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_observationUnitDbId(observationUnitPositionDbId, observationUnitDbId) {
        let query = `
              mutation
                updateObservationUnitPosition{
                  updateObservationUnitPosition(
                    observationUnitPositionDbId:"${observationUnitPositionDbId}"
                    removeObservationUnit:"${observationUnitDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationUnitPositionDbId                    observationUnitDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationUnitPosition;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("observationUnitPosition.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateObservationUnitPosition }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateObservationUnitPosition;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}