const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');
const validatorUtil = require('../utils/validatorUtil');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://instance_1_pgmn_sdb_science_db_graphql_server_1:3001/graphql";
const iriRegex = new RegExp('pgmn');

module.exports = class INDIVIDUAL_PGMN {

    static get adapterName() {
        return 'INDIVIDUAL_PGMN';
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
            readOneIndividual
            {
              readOneIndividual(name:"${iri}")
              {
                name 
                origin 
                description 
                accessionId 
                genotypeId 
                field_unit_id 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let item = res.data.data.readOneIndividual;
                return validatorUtil.ifHasValidatorFunctionInvoke('validateAfterRead', this, item)
                    .then((valSuccess) => {
                        return item
                    })
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
      query countIndividuals($search: searchIndividualInput){
        countIndividuals(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countIndividuals;
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
        let query = `query individualsConnection($search: searchIndividualInput $pagination: paginationCursorInput $order: [orderIndividualInput]){
      individualsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  name  origin
         description
         accessionId
         genotypeId
         field_unit_id
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
                return res.data.data.individualsConnection;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static addOne(input) {

        return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
            .then(async (valSuccess) => {
                let query = `
          mutation addIndividual(
              $name:ID!  
            $origin:String
            $description:String
            $genotypeId:Int
            $field_unit_id:Int          ){
            addIndividual(            name:$name  
            origin:$origin
            description:$description
            genotypeId:$genotypeId
            field_unit_id:$field_unit_id){
              name                origin
                description
                accessionId
                genotypeId
                field_unit_id
              }
          }`;

                return axios.post(remoteCenzontleURL, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return res.data.data.addIndividual;
                    } else {
                        throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
                    }
                }).catch(error => {
                    error['url'] = remoteCenzontleURL;
                    handleError(error);
                });
            });
    }

    static deleteOne(id) {
        let query = `
          mutation
            deleteIndividual{
              deleteIndividual(
                name: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteIndividual;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }

    static updateOne(input) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input)
            .then(async (valSuccess) => {
                let query = `
              mutation
                updateIndividual(
                  $name:ID! 
                  $origin:String 
                  $description:String 
                  $genotypeId:Int 
                  $field_unit_id:Int                 ){
                  updateIndividual(
                    name:$name 
                    origin:$origin 
                    description:$description 
                    genotypeId:$genotypeId 
                    field_unit_id:$field_unit_id                   ){
                    name 
                    origin 
                    description 
                    accessionId 
                    genotypeId 
                    field_unit_id 
                  }
                }`

                return axios.post(remoteCenzontleURL, {
                    query: query,
                    variables: input
                }).then(res => {
                    //check
                    if (res && res.data && res.data.data) {
                        return res.data.data.updateIndividual;
                    } else {
                        throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
                    }
                }).catch(error => {
                    error['url'] = remoteCenzontleURL;
                    handleError(error);
                });
            });
    }


    /**
     * add_accessionId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   name   IdAttribute of the root model to be updated
     * @param {Id}   accessionId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_accessionId(name, accessionId) {
        let query = `
              mutation
                updateIndividual{
                  updateIndividual(
                    name:"${name}"
                    addAccession:"${accessionId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    name                    accessionId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateIndividual;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_accessionId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   name   IdAttribute of the root model to be updated
     * @param {Id}   accessionId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_accessionId(name, accessionId) {
        let query = `
              mutation
                updateIndividual{
                  updateIndividual(
                    name:"${name}"
                    removeAccession:"${accessionId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    name                    accessionId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateIndividual;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("Individual.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateIndividual }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateIndividual;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}