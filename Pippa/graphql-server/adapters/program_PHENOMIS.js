const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phenomis-graphql-container:3000/graphql";
const iriRegex = new RegExp('phenomis');

module.exports = class program_PHENOMIS {

    static get adapterName() {
        return 'program_PHENOMIS';
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
            readOneProgram
            {
              readOneProgram(programDbId:"${iri}")
              {
                programDbId 
                abbreviation 
                commonCropName 
                documentationURL 
                leadPersonDbId 
                leadPersonName 
                objective 
                programName 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneProgram;
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
      query countPrograms($search: searchProgramInput){
        countPrograms(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countPrograms;
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
        let query = `query programsConnection($search: searchProgramInput $pagination: paginationCursorInput $order: [orderProgramInput]){
      programsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  programDbId  abbreviation
         commonCropName
         documentationURL
         leadPersonDbId
         leadPersonName
         objective
         programName
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
                return res.data.data.programsConnection;
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
        mutation addProgram(
          $programDbId:ID!  
          $abbreviation:String
          $commonCropName:String
          $documentationURL:String
          $leadPersonDbId:String
          $leadPersonName:String
          $objective:String
          $programName:String        ){
          addProgram(          programDbId:$programDbId  
          abbreviation:$abbreviation
          commonCropName:$commonCropName
          documentationURL:$documentationURL
          leadPersonDbId:$leadPersonDbId
          leadPersonName:$leadPersonName
          objective:$objective
          programName:$programName){
            programDbId            abbreviation
            commonCropName
            documentationURL
            leadPersonDbId
            leadPersonName
            objective
            programName
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addProgram;
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
            deleteProgram{
              deleteProgram(
                programDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteProgram;
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
            updateProgram(
              $programDbId:ID! 
              $abbreviation:String 
              $commonCropName:String 
              $documentationURL:String 
              $leadPersonDbId:String 
              $leadPersonName:String 
              $objective:String 
              $programName:String             ){
              updateProgram(
                programDbId:$programDbId 
                abbreviation:$abbreviation 
                commonCropName:$commonCropName 
                documentationURL:$documentationURL 
                leadPersonDbId:$leadPersonDbId 
                leadPersonName:$leadPersonName 
                objective:$objective 
                programName:$programName               ){
                programDbId 
                abbreviation 
                commonCropName 
                documentationURL 
                leadPersonDbId 
                leadPersonName 
                objective 
                programName 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateProgram;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("program.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateProgram }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateProgram;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}