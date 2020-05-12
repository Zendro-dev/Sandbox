const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phis-graphql-container:3001/graphql";
const iriRegex = new RegExp('phis');

module.exports = class observationVariable_PHIS {

    static get adapterName() {
        return 'observationVariable_PHIS';
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
            readOneObservationVariable
            {
              readOneObservationVariable(observationVariableDbId:"${iri}")
              {
                observationVariableDbId 
                commonCropName 
                defaultValue 
                documentationURL 
                growthStage 
                institution 
                language 
                scientist 
                status 
                submissionTimestamp 
                xref 
                observationVariableName 
                methodDbId 
                scaleDbId 
                traitDbId 
                ontologyDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneObservationVariable;
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
      query countObservationVariables($search: searchObservationVariableInput){
        countObservationVariables(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countObservationVariables;
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
        let query = `query observationVariablesConnection($search: searchObservationVariableInput $pagination: paginationCursorInput $order: [orderObservationVariableInput]){
      observationVariablesConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  observationVariableDbId  commonCropName
         defaultValue
         documentationURL
         growthStage
         institution
         language
         scientist
         status
         submissionTimestamp
         xref
         observationVariableName
         methodDbId
         scaleDbId
         traitDbId
         ontologyDbId
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
                return res.data.data.observationVariablesConnection;
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
        mutation addObservationVariable(
          $observationVariableDbId:ID!  
          $commonCropName:String
          $defaultValue:String
          $documentationURL:String
          $growthStage:String
          $institution:String
          $language:String
          $scientist:String
          $status:String
          $submissionTimestamp:DateTime
          $xref:String
          $observationVariableName:String        ){
          addObservationVariable(          observationVariableDbId:$observationVariableDbId  
          commonCropName:$commonCropName
          defaultValue:$defaultValue
          documentationURL:$documentationURL
          growthStage:$growthStage
          institution:$institution
          language:$language
          scientist:$scientist
          status:$status
          submissionTimestamp:$submissionTimestamp
          xref:$xref
          observationVariableName:$observationVariableName){
            observationVariableDbId            commonCropName
            defaultValue
            documentationURL
            growthStage
            institution
            language
            scientist
            status
            submissionTimestamp
            xref
            observationVariableName
            methodDbId
            scaleDbId
            traitDbId
            ontologyDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addObservationVariable;
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
            deleteObservationVariable{
              deleteObservationVariable(
                observationVariableDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteObservationVariable;
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
            updateObservationVariable(
              $observationVariableDbId:ID! 
              $commonCropName:String 
              $defaultValue:String 
              $documentationURL:String 
              $growthStage:String 
              $institution:String 
              $language:String 
              $scientist:String 
              $status:String 
              $submissionTimestamp:DateTime 
              $xref:String 
              $observationVariableName:String             ){
              updateObservationVariable(
                observationVariableDbId:$observationVariableDbId 
                commonCropName:$commonCropName 
                defaultValue:$defaultValue 
                documentationURL:$documentationURL 
                growthStage:$growthStage 
                institution:$institution 
                language:$language 
                scientist:$scientist 
                status:$status 
                submissionTimestamp:$submissionTimestamp 
                xref:$xref 
                observationVariableName:$observationVariableName               ){
                observationVariableDbId 
                commonCropName 
                defaultValue 
                documentationURL 
                growthStage 
                institution 
                language 
                scientist 
                status 
                submissionTimestamp 
                xref 
                observationVariableName 
                methodDbId 
                scaleDbId 
                traitDbId 
                ontologyDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_methodDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_methodDbId(observationVariableDbId, methodDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    addMethod:"${methodDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    methodDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * add_ontologyDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    addOntologyReference:"${ontologyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    ontologyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * add_scaleDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_scaleDbId(observationVariableDbId, scaleDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    addScale:"${scaleDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    scaleDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * add_traitDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_traitDbId(observationVariableDbId, traitDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    addTrait:"${traitDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    traitDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_methodDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   methodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_methodDbId(observationVariableDbId, methodDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    removeMethod:"${methodDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    methodDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * remove_ontologyDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_ontologyDbId(observationVariableDbId, ontologyDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    removeOntologyReference:"${ontologyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    ontologyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * remove_scaleDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   scaleDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_scaleDbId(observationVariableDbId, scaleDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    removeScale:"${scaleDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    scaleDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * remove_traitDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   observationVariableDbId   IdAttribute of the root model to be updated
     * @param {Id}   traitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_traitDbId(observationVariableDbId, traitDbId) {
        let query = `
              mutation
                updateObservationVariable{
                  updateObservationVariable(
                    observationVariableDbId:"${observationVariableDbId}"
                    removeTrait:"${traitDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    observationVariableDbId                    traitDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("observationVariable.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateObservationVariable }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateObservationVariable;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}