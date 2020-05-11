const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://pippa-graphql-container:3002/graphql";
const iriRegex = new RegExp('pippa');

module.exports = class germplasm_PIPPA {

    static get adapterName() {
        return 'germplasm_PIPPA';
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
            readOneGermplasm
            {
              readOneGermplasm(germplasmDbId:"${iri}")
              {
                germplasmDbId 
                accessionNumber 
                acquisitionDate 
                breedingMethodDbId 
                commonCropName 
                countryOfOriginCode 
                defaultDisplayName 
                documentationURL 
                germplasmGenus 
                germplasmName 
                germplasmPUI 
                germplasmPreprocessing 
                germplasmSpecies 
                germplasmSubtaxa 
                instituteCode 
                instituteName 
                pedigree 
                seedSource 
                seedSourceDescription 
                speciesAuthority 
                subtaxaAuthority 
                xref 
                biologicalStatusOfAccessionCode 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneGermplasm;
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
      query countGermplasms($search: searchGermplasmInput){
        countGermplasms(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countGermplasms;
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
        let query = `query germplasmsConnection($search: searchGermplasmInput $pagination: paginationCursorInput $order: [orderGermplasmInput]){
      germplasmsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  germplasmDbId  accessionNumber
         acquisitionDate
         breedingMethodDbId
         commonCropName
         countryOfOriginCode
         defaultDisplayName
         documentationURL
         germplasmGenus
         germplasmName
         germplasmPUI
         germplasmPreprocessing
         germplasmSpecies
         germplasmSubtaxa
         instituteCode
         instituteName
         pedigree
         seedSource
         seedSourceDescription
         speciesAuthority
         subtaxaAuthority
         xref
         biologicalStatusOfAccessionCode
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
                return res.data.data.germplasmsConnection;
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
        mutation addGermplasm(
          $germplasmDbId:ID!  
          $accessionNumber:String
          $acquisitionDate:Date
          $commonCropName:String
          $countryOfOriginCode:String
          $defaultDisplayName:String
          $documentationURL:String
          $germplasmGenus:String
          $germplasmName:String
          $germplasmPUI:String
          $germplasmPreprocessing:String
          $germplasmSpecies:String
          $germplasmSubtaxa:String
          $instituteCode:String
          $instituteName:String
          $pedigree:String
          $seedSource:String
          $seedSourceDescription:String
          $speciesAuthority:String
          $subtaxaAuthority:String
          $xref:String
          $biologicalStatusOfAccessionCode:String        ){
          addGermplasm(          germplasmDbId:$germplasmDbId  
          accessionNumber:$accessionNumber
          acquisitionDate:$acquisitionDate
          commonCropName:$commonCropName
          countryOfOriginCode:$countryOfOriginCode
          defaultDisplayName:$defaultDisplayName
          documentationURL:$documentationURL
          germplasmGenus:$germplasmGenus
          germplasmName:$germplasmName
          germplasmPUI:$germplasmPUI
          germplasmPreprocessing:$germplasmPreprocessing
          germplasmSpecies:$germplasmSpecies
          germplasmSubtaxa:$germplasmSubtaxa
          instituteCode:$instituteCode
          instituteName:$instituteName
          pedigree:$pedigree
          seedSource:$seedSource
          seedSourceDescription:$seedSourceDescription
          speciesAuthority:$speciesAuthority
          subtaxaAuthority:$subtaxaAuthority
          xref:$xref
          biologicalStatusOfAccessionCode:$biologicalStatusOfAccessionCode){
            germplasmDbId            accessionNumber
            acquisitionDate
            breedingMethodDbId
            commonCropName
            countryOfOriginCode
            defaultDisplayName
            documentationURL
            germplasmGenus
            germplasmName
            germplasmPUI
            germplasmPreprocessing
            germplasmSpecies
            germplasmSubtaxa
            instituteCode
            instituteName
            pedigree
            seedSource
            seedSourceDescription
            speciesAuthority
            subtaxaAuthority
            xref
            biologicalStatusOfAccessionCode
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addGermplasm;
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
            deleteGermplasm{
              deleteGermplasm(
                germplasmDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteGermplasm;
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
            updateGermplasm(
              $germplasmDbId:ID! 
              $accessionNumber:String 
              $acquisitionDate:Date 
              $commonCropName:String 
              $countryOfOriginCode:String 
              $defaultDisplayName:String 
              $documentationURL:String 
              $germplasmGenus:String 
              $germplasmName:String 
              $germplasmPUI:String 
              $germplasmPreprocessing:String 
              $germplasmSpecies:String 
              $germplasmSubtaxa:String 
              $instituteCode:String 
              $instituteName:String 
              $pedigree:String 
              $seedSource:String 
              $seedSourceDescription:String 
              $speciesAuthority:String 
              $subtaxaAuthority:String 
              $xref:String 
              $biologicalStatusOfAccessionCode:String             ){
              updateGermplasm(
                germplasmDbId:$germplasmDbId 
                accessionNumber:$accessionNumber 
                acquisitionDate:$acquisitionDate 
                commonCropName:$commonCropName 
                countryOfOriginCode:$countryOfOriginCode 
                defaultDisplayName:$defaultDisplayName 
                documentationURL:$documentationURL 
                germplasmGenus:$germplasmGenus 
                germplasmName:$germplasmName 
                germplasmPUI:$germplasmPUI 
                germplasmPreprocessing:$germplasmPreprocessing 
                germplasmSpecies:$germplasmSpecies 
                germplasmSubtaxa:$germplasmSubtaxa 
                instituteCode:$instituteCode 
                instituteName:$instituteName 
                pedigree:$pedigree 
                seedSource:$seedSource 
                seedSourceDescription:$seedSourceDescription 
                speciesAuthority:$speciesAuthority 
                subtaxaAuthority:$subtaxaAuthority 
                xref:$xref 
                biologicalStatusOfAccessionCode:$biologicalStatusOfAccessionCode               ){
                germplasmDbId 
                accessionNumber 
                acquisitionDate 
                breedingMethodDbId 
                commonCropName 
                countryOfOriginCode 
                defaultDisplayName 
                documentationURL 
                germplasmGenus 
                germplasmName 
                germplasmPUI 
                germplasmPreprocessing 
                germplasmSpecies 
                germplasmSubtaxa 
                instituteCode 
                instituteName 
                pedigree 
                seedSource 
                seedSourceDescription 
                speciesAuthority 
                subtaxaAuthority 
                xref 
                biologicalStatusOfAccessionCode 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateGermplasm;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_breedingMethodDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async add_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let query = `
              mutation
                updateGermplasm{
                  updateGermplasm(
                    germplasmDbId:"${germplasmDbId}"
                    addBreedingMethod:"${breedingMethodDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    germplasmDbId                    breedingMethodDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateGermplasm;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }




    /**
     * remove_breedingMethodDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   germplasmDbId   IdAttribute of the root model to be updated
     * @param {Id}   breedingMethodDbId Foreign Key (stored in "Me") of the Association to be updated.
     */

    static async remove_breedingMethodDbId(germplasmDbId, breedingMethodDbId) {
        let query = `
              mutation
                updateGermplasm{
                  updateGermplasm(
                    germplasmDbId:"${germplasmDbId}"
                    removeBreedingMethod:"${breedingMethodDbId}"
                    skipAssociationsExistenceChecks: true
                  ){
                    germplasmDbId                    breedingMethodDbId                  }
                }`

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateGermplasm;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }






    static bulkAddCsv(context) {
        throw new Error("germplasm.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateGermplasm }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateGermplasm;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}