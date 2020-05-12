const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://phenomis-graphql-container:3000/graphql";
const iriRegex = new RegExp('phenomis');

module.exports = class image_PHENOMIS {

    static get adapterName() {
        return 'image_PHENOMIS';
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
            readOneImage
            {
              readOneImage(imageDbId:"${iri}")
              {
                imageDbId 
                copyright 
                description 
                imageFileName 
                imageFileSize 
                imageHeight 
                imageName 
                imageTimeStamp 
                imageURL 
                imageWidth 
                mimeType 
                observationUnitDbId 
              }
            }`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.readOneImage;
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
      query countImages($search: searchImageInput){
        countImages(search: $search)
      }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countImages;
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
        let query = `query imagesConnection($search: searchImageInput $pagination: paginationCursorInput $order: [orderImageInput]){
      imagesConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  imageDbId  copyright
         description
         imageFileName
         imageFileSize
         imageHeight
         imageName
         imageTimeStamp
         imageURL
         imageWidth
         mimeType
         observationUnitDbId
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
                return res.data.data.imagesConnection;
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
        mutation addImage(
          $imageDbId:ID!  
          $copyright:String
          $description:String
          $imageFileName:String
          $imageFileSize:Int
          $imageHeight:Int
          $imageName:String
          $imageTimeStamp:DateTime
          $imageURL:String
          $imageWidth:Int
          $mimeType:String        ){
          addImage(          imageDbId:$imageDbId  
          copyright:$copyright
          description:$description
          imageFileName:$imageFileName
          imageFileSize:$imageFileSize
          imageHeight:$imageHeight
          imageName:$imageName
          imageTimeStamp:$imageTimeStamp
          imageURL:$imageURL
          imageWidth:$imageWidth
          mimeType:$mimeType){
            imageDbId            copyright
            description
            imageFileName
            imageFileSize
            imageHeight
            imageName
            imageTimeStamp
            imageURL
            imageWidth
            mimeType
            observationUnitDbId
          }
        }`;

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.addImage;
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
            deleteImage{
              deleteImage(
                imageDbId: "${id}" )}`;

        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteImage;
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
            updateImage(
              $imageDbId:ID! 
              $copyright:String 
              $description:String 
              $imageFileName:String 
              $imageFileSize:Int 
              $imageHeight:Int 
              $imageName:String 
              $imageTimeStamp:DateTime 
              $imageURL:String 
              $imageWidth:Int 
              $mimeType:String             ){
              updateImage(
                imageDbId:$imageDbId 
                copyright:$copyright 
                description:$description 
                imageFileName:$imageFileName 
                imageFileSize:$imageFileSize 
                imageHeight:$imageHeight 
                imageName:$imageName 
                imageTimeStamp:$imageTimeStamp 
                imageURL:$imageURL 
                imageWidth:$imageWidth 
                mimeType:$mimeType               ){
                imageDbId 
                copyright 
                description 
                imageFileName 
                imageFileSize 
                imageHeight 
                imageName 
                imageTimeStamp 
                imageURL 
                imageWidth 
                mimeType 
                observationUnitDbId 
              }
            }`

        return axios.post(remoteCenzontleURL, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.updateImage;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }


    /**
     * add_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   imageDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */





    /**
     * remove_observationUnitDbId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   imageDbId   IdAttribute of the root model to be updated
     * @param {Id}   observationUnitDbId Foreign Key (stored in "Me") of the Association to be updated.
     */







    static bulkAddCsv(context) {
        throw new Error("image.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateImage }`;
        return axios.post(remoteCenzontleURL, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.csvTableTemplateImage;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${remoteCenzontleURL}`);
            }
        }).catch(error => {
            error['url'] = remoteCenzontleURL;
            handleError(error);
        });
    }
}