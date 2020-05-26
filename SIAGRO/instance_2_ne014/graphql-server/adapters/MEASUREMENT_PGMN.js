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

module.exports = class MEASUREMENT_PGMN {

    static get adapterName() {
        return 'MEASUREMENT_PGMN';
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
            readOneMeasurement
            {
              readOneMeasurement(measurement_id:"${iri}")
              {
                measurement_id 
                name 
                method 
                reference 
                reference_link 
                value 
                unit 
                short_name 
                comments 
                field_unit_id 
                individual_id 
                accession_id 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneMeasurement;
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
      query countMeasurements($search: searchMeasurementInput){
        countMeasurements(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countMeasurements;
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
        let query = `query measurementsConnection($search: searchMeasurementInput $pagination: paginationCursorInput $order: [orderMeasurementInput]){
      measurementsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  measurement_id  name
         method
         reference
         reference_link
         value
         unit
         short_name
         comments
         field_unit_id
         individual_id
         accession_id
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
                return res.data.data.measurementsConnection;
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
          mutation addMeasurement(
              $measurement_id:ID!  
            $name:String
            $method:String
            $reference:String
            $reference_link:String
            $value:Float
            $unit:String
            $short_name:String
            $comments:String
            $field_unit_id:Int          ){
            addMeasurement(            measurement_id:$measurement_id  
            name:$name
            method:$method
            reference:$reference
            reference_link:$reference_link
            value:$value
            unit:$unit
            short_name:$short_name
            comments:$comments
            field_unit_id:$field_unit_id){
              measurement_id                name
                method
                reference
                reference_link
                value
                unit
                short_name
                comments
                field_unit_id
                individual_id
                accession_id
              }
          }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addMeasurement;
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
            deleteMeasurement{
              deleteMeasurement(
                measurement_id: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteMeasurement;
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
            updateMeasurement(
              $measurement_id:ID! 
              $name:String 
              $method:String 
              $reference:String 
              $reference_link:String 
              $value:Float 
              $unit:String 
              $short_name:String 
              $comments:String 
              $field_unit_id:Int             ){
              updateMeasurement(
                measurement_id:$measurement_id 
                name:$name 
                method:$method 
                reference:$reference 
                reference_link:$reference_link 
                value:$value 
                unit:$unit 
                short_name:$short_name 
                comments:$comments 
                field_unit_id:$field_unit_id               ){
                measurement_id 
                name 
                method 
                reference 
                reference_link 
                value 
                unit 
                short_name 
                comments 
                field_unit_id 
                individual_id 
                accession_id 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_individual_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_individual_id(measurement_id, individual_id) {
        let query = `
              mutation
                updateMeasurement{
                  updateMeasurement(
                    measurement_id:"${measurement_id}"
                    addIndividual:"${individual_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    measurement_id                    individual_id                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * add_accession_id - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_accession_id(measurement_id, accession_id) {
        let query = `
              mutation
                updateMeasurement{
                  updateMeasurement(
                    measurement_id:"${measurement_id}"
                    addAccession:"${accession_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    measurement_id                    accession_id                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_individual_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   individual_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_individual_id(measurement_id, individual_id) {
        let query = `
              mutation
                updateMeasurement{
                  updateMeasurement(
                    measurement_id:"${measurement_id}"
                    removeIndividual:"${individual_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    measurement_id                    individual_id                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }



    /**
     * remove_accession_id - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   measurement_id   IdAttribute of the root model to be updated
     * @param {Id}   accession_id Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_accession_id(measurement_id, accession_id) {
        let query = `
              mutation
                updateMeasurement{
                  updateMeasurement(
                    measurement_id:"${measurement_id}"
                    removeAccession:"${accession_id}"
                    skipAssociationsExistenceChecks: true
                  ){
                    measurement_id                    accession_id                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("Measurement.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateMeasurement }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateMeasurement;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}