const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4').uuid;
const globals = require('../../config/globals');
const validatorUtil = require('../../utils/validatorUtil');
const helper = require('../../utils/helper');
const errorHelper = require('../../utils/errors');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'post_author',
    storageType: 'zendro-server',
    url: 'http://server1-graphql-container:3000/graphql',
    attributes: {
        id: 'String',
        name: 'String',
        lastname: 'String',
        email: 'String',
        book_ids: '[ String ]'
    },
    associations: {
        books: {
            type: 'to_many',
            reverseAssociationType: 'to_many',
            target: 'post_book',
            targetKey: 'author_ids',
            sourceKey: 'book_ids',
            keyIn: 'post_author',
            targetStorageType: 'zendro-server'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'String'
    }
};

const remoteZendroURL = "http://server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class post_author {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        name,
        lastname,
        email,
        book_ids
    }) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.book_ids = book_ids;
    }

    static get name() {
        return "post_author";
    }

    static async readById(id, benignErrorReporter) {
        let query = `query readOnePost_author{ readOnePost_author(id: "${id}"){id       name
          lastname
          email
          book_ids
     } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                let item = new post_author(response.data.data.readOnePost_author);
                await validatorUtil.validateData('validateAfterRead', this, item);
                return item;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `query countPost_authors($search: searchPost_authorInput){
      countPost_authors(search: $search)
    }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.countPost_authors;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        let query = `query post_authors($search: searchPost_authorInput $pagination: paginationInput! $order: [orderPost_authorInput]){
      post_authors(search:$search pagination:$pagination order:$order){id          name
                lastname
                email
                book_ids
        } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data && response.data.data.post_authors !== null) {
                let data = response.data.data.post_authors;
                data = await validatorUtil.bulkValidateData('validateAfterRead', this, data, benignErrorReporter);
                return data.map(item => {
                    return new post_author(item)
                });
            } else {
                throw new Error(`Remote server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        let query = `query post_authorsConnection($search: searchPost_authorInput $pagination: paginationCursorInput! $order: [orderPost_authorInput]){
      post_authorsConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  name
        lastname
        email
        book_ids
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: {
                    search: search,
                    order: order,
                    pagination: pagination
                }
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data && response.data.data.post_authorsConnection !== null) {
                let data_edges = response.data.data.post_authorsConnection.edges;
                let pageInfo = response.data.data.post_authorsConnection.pageInfo;

                //validate after read
                let nodes = data_edges.map(e => e.node);
                let valid_nodes = await validatorUtil.bulkValidateData('validateAfterRead', this, nodes, benignErrorReporter);

                let edges = valid_nodes.map(e => {
                    let temp_node = new post_author(e);
                    return {
                        node: temp_node,
                        cursor: temp_node.base64Enconde()
                    }
                })

                return {
                    edges,
                    pageInfo
                };
            } else {
                throw new Error(`Remote server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async addOne(input, benignErrorReporter) {
        //validate input
        await validatorUtil.validateData('validateForCreate', this, input);

        let query = `
            mutation addPost_author(
                  $id:ID!  
              $name:String
              $lastname:String
              $email:String            ){
              addPost_author(              id:$id  
              name:$name
              lastname:$lastname
              email:$email){
                id                    name
                    lastname
                    email
                    book_ids
                  }
            }`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new post_author(response.data.data.addPost_author);
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async deleteOne(id, benignErrorReporter) {
        //validate id
        await validatorUtil.validateData('validateForDelete', this, id);

        let query = `
              mutation
                deletePost_author{
                  deletePost_author(
                    id: "${id}" )}`;

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.deletePost_author;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async updateOne(input, benignErrorReporter) {
        //validate input
        await validatorUtil.validateData('validateForUpdate', this, input);
        let query = `
            mutation
              updatePost_author(
                $id:ID! 
                $name:String 
                $lastname:String 
                $email:String               ){
                updatePost_author(
                  id:$id 
                  name:$name 
                  lastname:$lastname 
                  email:$email                 ){
                  id 
                  name 
                  lastname 
                  email 
                  book_ids 
                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query,
                variables: input
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new post_author(response.data.data.updatePost_author);
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async bulkAddCsv(context, benignErrorReporter) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let csvRequestMv = await context.request.files.csv_file.mv(tmpFile);
            let query = `mutation {bulkAddPost_authorCsv}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            let response = await axios.post(remoteZendroURL, formData, {
                headers: formData.getHeaders()
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.bulkAddPost_authorCsv;

        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    /**
     * csvTableTemplate - Allows the user to download a template in CSV format with the
     * properties and types of this model.
     *
     * @param {BenignErrorReporter} benignErrorReporter can be used to generate the standard
     * GraphQL output {error: ..., data: ...}. If the function reportError of the benignErrorReporter
     * is invoked, the server will include any so reported errors in the final response, i.e. the
     * GraphQL response will have a non empty errors property.
     */
    static async csvTableTemplate(benignErrorReporter) {
        let query = `query { csvTableTemplatePost_author }`;
        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            return response.data.data.csvTableTemplatePost_author;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * add_book_ids - field Mutation (adapter-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}    Array of ids (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_book_ids(id, book_ids, benignErrorReporter) {
        let query = `
            mutation
              updatePost_author{
                updatePost_author(
                  id:"${id}"
                  addBooks:["${book_ids.join("\",\"")}"]
                ){
                  id                  book_ids                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new post_author(response.data.data.updatePost_author);
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



    /**
     * remove_book_ids - field Mutation (adapter-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}    Array of ids (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_book_ids(id, book_ids, benignErrorReporter) {
        let query = `
            mutation
              updatePost_author{
                updatePost_author(
                  id:"${id}"
                  removeBooks:["${book_ids.join("\",\"")}"]
                ){
                  id                  book_ids                }
              }`

        //use default BenignErrorReporter if no BenignErrorReporter defined
        benignErrorReporter = errorHelper.getDefaultBenignErrorReporterIfUndef(benignErrorReporter);

        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            //check if remote service returned benign Errors in the response and add them to the benignErrorReporter
            if (helper.isNonEmptyArray(response.data.errors)) {
                benignErrorReporter.reportError(errorHelper.handleRemoteErrors(response.data.errors, remoteZendroURL));
            }
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return new post_author(response.data.data.updatePost_author);
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }









    static get definition() {
        return definition;
    }

    static base64Decode(cursor) {
        return Buffer.from(cursor, 'base64').toString('utf-8');
    }

    base64Enconde() {
        return Buffer.from(JSON.stringify(this.stripAssociations())).toString('base64');
    }

    stripAssociations() {
        let attributes = Object.keys(post_author.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return post_author.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return post_author.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of post_author.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[post_author.idAttribute()]
    }
};