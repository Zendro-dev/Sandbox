const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phenomis-graphql-container:3000/graphql";
const iriRegex = new RegExp('phenomis');

module.exports = class trait_PHENOMIS {

    static get adapterName() {
        return 'trait_PHENOMIS';
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
            readOneTrait
            {
              readOneTrait(traitDbId:"${iri}")
              {
                traitDbId 
                attribute 
                entity 
                mainAbbreviation 
                status 
                traitClass 
                traitDescription 
                traitName 
                xref 
                ontologyDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneTrait;
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
      query countTraits($search: searchTraitInput){
        countTraits(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countTraits;
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
        let query = `query traitsConnection($search: searchTraitInput $pagination: paginationCursorInput $order: [orderTraitInput]){
      traitsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  traitDbId  attribute
         entity
         mainAbbreviation
         status
         traitClass
         traitDescription
         traitName
         xref
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
                return res.data.data.traitsConnection;
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
        mutation addTrait(
          $traitDbId:ID!  
          $attribute:String
          $entity:String
          $mainAbbreviation:String
          $status:String
          $traitClass:String
          $traitDescription:String
          $traitName:String
          $xref:String        ){
          addTrait(          traitDbId:$traitDbId  
          attribute:$attribute
          entity:$entity
          mainAbbreviation:$mainAbbreviation
          status:$status
          traitClass:$traitClass
          traitDescription:$traitDescription
          traitName:$traitName
          xref:$xref){
            traitDbId            attribute
            entity
            mainAbbreviation
            status
            traitClass
            traitDescription
            traitName
            xref
            ontologyDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addTrait;
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
            deleteTrait{
              deleteTrait(
                traitDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteTrait;
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
            updateTrait(
              $traitDbId:ID! 
              $attribute:String 
              $entity:String 
              $mainAbbreviation:String 
              $status:String 
              $traitClass:String 
              $traitDescription:String 
              $traitName:String 
              $xref:String             ){
              updateTrait(
                traitDbId:$traitDbId 
                attribute:$attribute 
                entity:$entity 
                mainAbbreviation:$mainAbbreviation 
                status:$status 
                traitClass:$traitClass 
                traitDescription:$traitDescription 
                traitName:$traitName 
                xref:$xref               ){
                traitDbId 
                attribute 
                entity 
                mainAbbreviation 
                status 
                traitClass 
                traitDescription 
                traitName 
                xref 
                ontologyDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrait;
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
     * @param {Id}   traitDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_ontologyDbId(traitDbId, ontologyDbId) {
        let query = `
              mutation
                updateTrait{
                  updateTrait(
                    traitDbId:"${traitDbId}"
                    addOntologyReference:"${ontologyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    traitDbId                    ontologyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrait;
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
     * @param {Id}   traitDbId   IdAttribute of the root model to be updated
     * @param {Id}   ontologyDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_ontologyDbId(traitDbId, ontologyDbId) {
        let query = `
              mutation
                updateTrait{
                  updateTrait(
                    traitDbId:"${traitDbId}"
                    removeOntologyReference:"${ontologyDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    traitDbId                    ontologyDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateTrait;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("trait.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateTrait }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateTrait;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}