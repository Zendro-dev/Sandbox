const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phenomis-graphql-container:3000/graphql";
const iriRegex = new RegExp('phenomis');

module.exports = class environmentParameter_PHENOMIS {

    static get adapterName() {
        return 'environmentParameter_PHENOMIS';
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
            readOneEnvironmentParameter
            {
              readOneEnvironmentParameter(environmentParameterDbId:"${iri}")
              {
                environmentParameterDbId 
                description 
                parameterName 
                parameterPUI 
                unit 
                unitPUI 
                value 
                valuePUI 
                studyDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneEnvironmentParameter;
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
      query countEnvironmentParameters($search: searchEnvironmentParameterInput){
        countEnvironmentParameters(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countEnvironmentParameters;
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
        let query = `query environmentParametersConnection($search: searchEnvironmentParameterInput $pagination: paginationCursorInput $order: [orderEnvironmentParameterInput]){
      environmentParametersConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  environmentParameterDbId  description
         parameterName
         parameterPUI
         unit
         unitPUI
         value
         valuePUI
         studyDbId
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
                return res.data.data.environmentParametersConnection;
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
        mutation addEnvironmentParameter(
          $environmentParameterDbId:ID!  
          $description:String
          $parameterName:String
          $parameterPUI:String
          $unit:String
          $unitPUI:String
          $value:String
          $valuePUI:String        ){
          addEnvironmentParameter(          environmentParameterDbId:$environmentParameterDbId  
          description:$description
          parameterName:$parameterName
          parameterPUI:$parameterPUI
          unit:$unit
          unitPUI:$unitPUI
          value:$value
          valuePUI:$valuePUI){
            environmentParameterDbId            description
            parameterName
            parameterPUI
            unit
            unitPUI
            value
            valuePUI
            studyDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addEnvironmentParameter;
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
            deleteEnvironmentParameter{
              deleteEnvironmentParameter(
                environmentParameterDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteEnvironmentParameter;
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
            updateEnvironmentParameter(
              $environmentParameterDbId:ID! 
              $description:String 
              $parameterName:String 
              $parameterPUI:String 
              $unit:String 
              $unitPUI:String 
              $value:String 
              $valuePUI:String             ){
              updateEnvironmentParameter(
                environmentParameterDbId:$environmentParameterDbId 
                description:$description 
                parameterName:$parameterName 
                parameterPUI:$parameterPUI 
                unit:$unit 
                unitPUI:$unitPUI 
                value:$value 
                valuePUI:$valuePUI               ){
                environmentParameterDbId 
                description 
                parameterName 
                parameterPUI 
                unit 
                unitPUI 
                value 
                valuePUI 
                studyDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEnvironmentParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   environmentParameterDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_studyDbId(environmentParameterDbId, studyDbId) {
        let query = `
              mutation
                updateEnvironmentParameter{
                  updateEnvironmentParameter(
                    environmentParameterDbId:"${environmentParameterDbId}"
                    addStudy:"${studyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    environmentParameterDbId                    studyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEnvironmentParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_studyDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   environmentParameterDbId   IdAttribute of the root model to be updated
     * @param {Id}   studyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_studyDbId(environmentParameterDbId, studyDbId) {
        let query = `
              mutation
                updateEnvironmentParameter{
                  updateEnvironmentParameter(
                    environmentParameterDbId:"${environmentParameterDbId}"
                    removeStudy:"${studyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    environmentParameterDbId                    studyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateEnvironmentParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("environmentParameter.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateEnvironmentParameter }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateEnvironmentParameter;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}