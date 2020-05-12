const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://pippa-graphql-container:3002/graphql";
const iriRegex = new RegExp('pippa');

module.exports = class location_PIPPA {

    static get adapterName() {
        return 'location_PIPPA';
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
            readOneLocation
            {
              readOneLocation(locationDbId:"${iri}")
              {
                locationDbId 
                abbreviation 
                coordinateDescription 
                countryCode 
                countryName 
                documentationURL 
                environmentType 
                exposure 
                instituteAddress 
                instituteName 
                locationName 
                locationType 
                siteStatus 
                slope 
                topography 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneLocation;
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
      query countLocations($search: searchLocationInput){
        countLocations(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countLocations;
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
        let query = `query locationsConnection($search: searchLocationInput $pagination: paginationCursorInput $order: [orderLocationInput]){
      locationsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  locationDbId  abbreviation
         coordinateDescription
         countryCode
         countryName
         documentationURL
         environmentType
         exposure
         instituteAddress
         instituteName
         locationName
         locationType
         siteStatus
         slope
         topography
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
                return res.data.data.locationsConnection;
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
        mutation addLocation(
          $locationDbId:ID!  
          $abbreviation:String
          $coordinateDescription:String
          $countryCode:String
          $countryName:String
          $documentationURL:String
          $environmentType:String
          $exposure:String
          $instituteAddress:String
          $instituteName:String
          $locationName:String
          $locationType:String
          $siteStatus:String
          $slope:String
          $topography:String        ){
          addLocation(          locationDbId:$locationDbId  
          abbreviation:$abbreviation
          coordinateDescription:$coordinateDescription
          countryCode:$countryCode
          countryName:$countryName
          documentationURL:$documentationURL
          environmentType:$environmentType
          exposure:$exposure
          instituteAddress:$instituteAddress
          instituteName:$instituteName
          locationName:$locationName
          locationType:$locationType
          siteStatus:$siteStatus
          slope:$slope
          topography:$topography){
            locationDbId            abbreviation
            coordinateDescription
            countryCode
            countryName
            documentationURL
            environmentType
            exposure
            instituteAddress
            instituteName
            locationName
            locationType
            siteStatus
            slope
            topography
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addLocation;
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
            deleteLocation{
              deleteLocation(
                locationDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteLocation;
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
            updateLocation(
              $locationDbId:ID! 
              $abbreviation:String 
              $coordinateDescription:String 
              $countryCode:String 
              $countryName:String 
              $documentationURL:String 
              $environmentType:String 
              $exposure:String 
              $instituteAddress:String 
              $instituteName:String 
              $locationName:String 
              $locationType:String 
              $siteStatus:String 
              $slope:String 
              $topography:String             ){
              updateLocation(
                locationDbId:$locationDbId 
                abbreviation:$abbreviation 
                coordinateDescription:$coordinateDescription 
                countryCode:$countryCode 
                countryName:$countryName 
                documentationURL:$documentationURL 
                environmentType:$environmentType 
                exposure:$exposure 
                instituteAddress:$instituteAddress 
                instituteName:$instituteName 
                locationName:$locationName 
                locationType:$locationType 
                siteStatus:$siteStatus 
                slope:$slope 
                topography:$topography               ){
                locationDbId 
                abbreviation 
                coordinateDescription 
                countryCode 
                countryName 
                documentationURL 
                environmentType 
                exposure 
                instituteAddress 
                instituteName 
                locationName 
                locationType 
                siteStatus 
                slope 
                topography 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateLocation;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("location.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateLocation }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateLocation;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}