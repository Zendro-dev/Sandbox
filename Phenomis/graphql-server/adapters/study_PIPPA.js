const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://pippa-graphql-container:3002/graphql";
const iriRegex = new RegExp('pippa');

module.exports = class study_PIPPA {

    static get adapterName() {
        return 'study_PIPPA';
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
            readOneStudy
            {
              readOneStudy(studyDbId:"${iri}")
              {
                studyDbId 
                active 
                commonCropName 
                culturalPractices 
                documentationURL 
                endDate 
                license 
                observationUnitsDescription 
                startDate 
                studyDescription 
                studyName 
                studyType 
                trialDbId 
                locationDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneStudy;
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
      query countStudies($search: searchStudyInput){
        countStudies(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countStudies;
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
        let query = `query studiesConnection($search: searchStudyInput $pagination: paginationCursorInput $order: [orderStudyInput]){
      studiesConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  studyDbId  active
         commonCropName
         culturalPractices
         documentationURL
         endDate
         license
         observationUnitsDescription
         startDate
         studyDescription
         studyName
         studyType
         trialDbId
         locationDbId
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
                return res.data.data.studiesConnection;
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
        mutation addStudy(
          $studyDbId:ID!  
          $active:Boolean
          $commonCropName:String
          $culturalPractices:String
          $documentationURL:String
          $endDate:DateTime
          $license:String
          $observationUnitsDescription:String
          $startDate:DateTime
          $studyDescription:String
          $studyName:String
          $studyType:String        ){
          addStudy(          studyDbId:$studyDbId  
          active:$active
          commonCropName:$commonCropName
          culturalPractices:$culturalPractices
          documentationURL:$documentationURL
          endDate:$endDate
          license:$license
          observationUnitsDescription:$observationUnitsDescription
          startDate:$startDate
          studyDescription:$studyDescription
          studyName:$studyName
          studyType:$studyType){
            studyDbId            active
            commonCropName
            culturalPractices
            documentationURL
            endDate
            license
            observationUnitsDescription
            startDate
            studyDescription
            studyName
            studyType
            trialDbId
            locationDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addStudy;
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
            deleteStudy{
              deleteStudy(
                studyDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteStudy;
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
            updateStudy(
              $studyDbId:ID! 
              $active:Boolean 
              $commonCropName:String 
              $culturalPractices:String 
              $documentationURL:String 
              $endDate:DateTime 
              $license:String 
              $observationUnitsDescription:String 
              $startDate:DateTime 
              $studyDescription:String 
              $studyName:String 
              $studyType:String             ){
              updateStudy(
                studyDbId:$studyDbId 
                active:$active 
                commonCropName:$commonCropName 
                culturalPractices:$culturalPractices 
                documentationURL:$documentationURL 
                endDate:$endDate 
                license:$license 
                observationUnitsDescription:$observationUnitsDescription 
                startDate:$startDate 
                studyDescription:$studyDescription 
                studyName:$studyName 
                studyType:$studyType               ){
                studyDbId 
                active 
                commonCropName 
                culturalPractices 
                documentationURL 
                endDate 
                license 
                observationUnitsDescription 
                startDate 
                studyDescription 
                studyName 
                studyType 
                trialDbId 
                locationDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_locationDbId(studyDbId, locationDbId) {
        let query = `
              mutation
                updateStudy{
                  updateStudy(
                    studyDbId:"${studyDbId}"
                    addLocation:"${locationDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    studyDbId                    locationDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * add_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_trialDbId(studyDbId, trialDbId) {
        let query = `
              mutation
                updateStudy{
                  updateStudy(
                    studyDbId:"${studyDbId}"
                    addTrial:"${trialDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    studyDbId                    trialDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_locationDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   locationDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_locationDbId(studyDbId, locationDbId) {
        let query = `
              mutation
                updateStudy{
                  updateStudy(
                    studyDbId:"${studyDbId}"
                    removeLocation:"${locationDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    studyDbId                    locationDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * remove_trialDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   studyDbId   IdAttribute of the root model to be updated
     * @param {Id}   trialDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_trialDbId(studyDbId, trialDbId) {
        let query = `
              mutation
                updateStudy{
                  updateStudy(
                    studyDbId:"${studyDbId}"
                    removeTrial:"${trialDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    studyDbId                    trialDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("study.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateStudy }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateStudy;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}