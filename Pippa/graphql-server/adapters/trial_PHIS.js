const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phis-graphql-container:3001/graphql";
const iriRegex = new RegExp('phis');

module.exports = class trial_PHIS {

    static get adapterName() {
        return 'trial_PHIS';
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
            readOneTrial
            {
              readOneTrial(trialDbId:"${iri}")
              {
                trialDbId 
                active 
                commonCropName 
                documentationURL 
                endDate 
                programDbId 
                startDate 
                trialDescription 
                trialName 
                trialPUI 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneTrial;
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
      query countTrials($search: searchTrialInput){
        countTrials(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countTrials;
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
        let query = `query trialsConnection($search: searchTrialInput $pagination: paginationCursorInput $order: [orderTrialInput]){
      trialsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  trialDbId  active
         commonCropName
         documentationURL
         endDate
         programDbId
         startDate
         trialDescription
         trialName
         trialPUI
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
                return res.data.data.trialsConnection;
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
        mutation addTrial(
          $trialDbId:ID!  
          $active:Boolean
          $commonCropName:String
          $documentationURL:String
          $endDate:DateTime
          $startDate:DateTime
          $trialDescription:String
          $trialName:String
          $trialPUI:String        ){
          addTrial(          trialDbId:$trialDbId  
          active:$active
          commonCropName:$commonCropName
          documentationURL:$documentationURL
          endDate:$endDate
          startDate:$startDate
          trialDescription:$trialDescription
          trialName:$trialName
          trialPUI:$trialPUI){
            trialDbId            active
            commonCropName
            documentationURL
            endDate
            programDbId
            startDate
            trialDescription
            trialName
            trialPUI
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addTrial;
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
            deleteTrial{
              deleteTrial(
                trialDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteTrial;
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
            updateTrial(
              $trialDbId:ID! 
              $active:Boolean 
              $commonCropName:String 
              $documentationURL:String 
              $endDate:DateTime 
              $startDate:DateTime 
              $trialDescription:String 
              $trialName:String 
              $trialPUI:String             ){
              updateTrial(
                trialDbId:$trialDbId 
                active:$active 
                commonCropName:$commonCropName 
                documentationURL:$documentationURL 
                endDate:$endDate 
                startDate:$startDate 
                trialDescription:$trialDescription 
                trialName:$trialName 
                trialPUI:$trialPUI               ){
                trialDbId 
                active 
                commonCropName 
                documentationURL 
                endDate 
                programDbId 
                startDate 
                trialDescription 
                trialName 
                trialPUI 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrial;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   trialDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_programDbId(trialDbId, programDbId) {
        let query = `
              mutation
                updateTrial{
                  updateTrial(
                    trialDbId:"${trialDbId}"
                    addProgram:"${programDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    trialDbId                    programDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrial;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_programDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   trialDbId   IdAttribute of the root model to be updated
     * @param {Id}   programDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_programDbId(trialDbId, programDbId) {
        let query = `
              mutation
                updateTrial{
                  updateTrial(
                    trialDbId:"${trialDbId}"
                    removeProgram:"${programDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    trialDbId                    programDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrial;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("trial.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateTrial }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateTrial;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}