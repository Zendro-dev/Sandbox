const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phis-graphql-container:3001/graphql";
const iriRegex = new RegExp('phis');

module.exports = class observationUnit_PHIS {

    static get adapterName() {
        return 'observationUnit_PHIS';
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
            readOneObservationUnit
            {
              readOneObservationUnit(observationUnitDbId:"${iri}")
              {
                observationUnitDbId 
                germplasmDbId 
                locationDbId 
                observationLevel 
                observationUnitName 
                observationUnitPUI 
                plantNumber 
                plotNumber 
                programDbId 
                studyDbId 
                trialDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneObservationUnit;
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
      query countObservationUnits($search: searchObservationUnitInput){
        countObservationUnits(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countObservationUnits;
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
        let query = `query observationUnitsConnection($search: searchObservationUnitInput $pagination: paginationCursorInput $order: [orderObservationUnitInput]){
      observationUnitsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  observationUnitDbId  germplasmDbId
         locationDbId
         observationLevel
         observationUnitName
         observationUnitPUI
         plantNumber
         plotNumber
         programDbId
         studyDbId
         trialDbId
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
                return res.data.data.observationUnitsConnection;
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
        mutation addObservationUnit(
          $observationUnitDbId:ID!  
          $observationLevel:String
          $observationUnitName:String
          $observationUnitPUI:String
          $plantNumber:String
          $plotNumber:String        ){
          addObservationUnit(          observationUnitDbId:$observationUnitDbId  
          observationLevel:$observationLevel
          observationUnitName:$observationUnitName
          observationUnitPUI:$observationUnitPUI
          plantNumber:$plantNumber
          plotNumber:$plotNumber){
            observationUnitDbId            germplasmDbId
            locationDbId
            observationLevel
            observationUnitName
            observationUnitPUI
            plantNumber
            plotNumber
            programDbId
            studyDbId
            trialDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addObservationUnit;
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
            deleteObservationUnit{
              deleteObservationUnit(
                observationUnitDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteObservationUnit;
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
            updateObservationUnit(
              $observationUnitDbId:ID! 
              $observationLevel:String 
              $observationUnitName:String 
              $observationUnitPUI:String 
              $plantNumber:String 
              $plotNumber:String             ){
              updateObservationUnit(
                observationUnitDbId:$observationUnitDbId 
                observationLevel:$observationLevel 
                observationUnitName:$observationUnitName 
                observationUnitPUI:$observationUnitPUI 
                plantNumber:$plantNumber 
                plotNumber:$plotNumber               ){
                observationUnitDbId 
                germplasmDbId 
                locationDbId 
                observationLevel 
                observationUnitName 
                observationUnitPUI 
                plantNumber 
                plotNumber 
                programDbId 
                studyDbId 
                trialDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationUnit;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_germplasmDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * add_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * add_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * add_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * add_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */





    /**
     * remove_germplasmDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   germplasmDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * remove_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * remove_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * remove_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */




    /**
     * remove_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationUnitDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */







    static bulkAddCsv(context) {
        throw new Error("observationUnit.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateObservationUnit }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateObservationUnit;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}