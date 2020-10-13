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
    model: 'int_post_book',
    storageType: 'zendro-server',
    url: 'http://server1-graphql-container:3000/graphql',
    attributes: {
        id: 'Int',
        title: 'String',
        genre: 'String',
        ISBN: 'String',
        author_ids: '[ Int]'
    },
    associations: {
        authors: {
            type: 'to_many',
            reverseAssociationType: 'to_many',
            target: 'int_post_author',
            targetKey: 'book_ids',
            sourceKey: 'author_ids',
            keyIn: 'int_post_book',
            targetStorageType: 'zendro-server'
        }
    },
    internalId: 'id',
    id: {
        name: 'id',
        type: 'Int'
    }
};

const remoteZendroURL = "http://server1-graphql-container:3000/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class int_post_book {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        id,
        title,
        genre,
        ISBN,
        author_ids
    }) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.ISBN = ISBN;
        this.author_ids = author_ids;
    }

    static get name() {
        return "int_post_book";
    }

    static async readById(id, benignErrorReporter) {
        let query = `query readOneInt_post_book{ readOneInt_post_book(id: "${id}"){id       title
          genre
          ISBN
          author_ids
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
                let item = new int_post_book(response.data.data.readOneInt_post_book);
                await validatorUtil.validateData('validateAfterRead', this, item);
                return item;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async countRecords(search, benignErrorReporter) {
        let query = `query countInt_post_books($search: searchInt_post_bookInput){
      countInt_post_books(search: $search)
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
                return response.data.data.countInt_post_books;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAll(search, order, pagination, benignErrorReporter) {
        let query = `query int_post_books($search: searchInt_post_bookInput $pagination: paginationInput $order: [orderInt_post_bookInput]){
      int_post_books(search:$search pagination:$pagination order:$order){id          title
                genre
                ISBN
                author_ids
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
            if (response && response.data && response.data.data) {
                let data = response.data.data.int_post_books;
                data = await validatorUtil.bulkValidateData('validateAfterRead', this, data, benignErrorReporter);
                return data.map(item => {
                    return new int_post_book(item)
                });
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }

    static async readAllCursor(search, order, pagination, benignErrorReporter) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let query = `query int_post_booksConnection($search: searchInt_post_bookInput $pagination: paginationCursorInput $order: [orderInt_post_bookInput]){
      int_post_booksConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  id  title
        genre
        ISBN
        author_ids
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
            if (response && response.data && response.data.data) {
                let data_edges = response.data.data.int_post_booksConnection.edges;
                let pageInfo = response.data.data.int_post_booksConnection.pageInfo;

                //validate after read
                let nodes = data_edges.map(e => e.node);
                let valid_nodes = await validatorUtil.bulkValidateData('validateAfterRead', this, nodes, benignErrorReporter);

                let edges = valid_nodes.map(e => {
                    let temp_node = new int_post_book(e);
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
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
            mutation addInt_post_book(
                  $id:ID!  
              $title:String
              $genre:String
              $ISBN:String            ){
              addInt_post_book(              id:$id  
              title:$title
              genre:$genre
              ISBN:$ISBN){
                id                    title
                    genre
                    ISBN
                    author_ids
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
                return new int_post_book(response.data.data.addInt_post_book);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
                deleteInt_post_book{
                  deleteInt_post_book(
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
                return response.data.data.deleteInt_post_book;
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
              updateInt_post_book(
                $id:ID! 
                $title:String 
                $genre:String 
                $ISBN:String               ){
                updateInt_post_book(
                  id:$id 
                  title:$title 
                  genre:$genre 
                  ISBN:$ISBN                 ){
                  id 
                  title 
                  genre 
                  ISBN 
                  author_ids 
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
                return new int_post_book(response.data.data.updateInt_post_book);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
            let query = `mutation {bulkAddInt_post_bookCsv}`;
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
            return response.data.data.bulkAddInt_post_bookCsv;

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
        let query = `query { csvTableTemplateInt_post_book }`;
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
            return response.data.data.csvTableTemplateInt_post_book;
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }




    /**
     * add_author_ids - field Mutation (adapter-layer) for to_many associationsArguments to add
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}    Array of ids (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async add_author_ids(id, author_ids, benignErrorReporter) {
        let query = `
            mutation
              updateInt_post_book{
                updateInt_post_book(
                  id:"${id}"
                  addAuthors:["${author_ids.join("\",\"")}"]
                ){
                  id                  author_ids                }
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
                return new int_post_book(response.data.data.updateInt_post_book);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }
    }



    /**
     * remove_author_ids - field Mutation (adapter-layer) for to_many associationsArguments to remove
     *
     * @param {Id}   id   IdAttribute of the root model to be updated
     * @param {Array}    Array of ids (stored in "Me") of the Association to be updated.
     * @param {BenignErrorReporter} benignErrorReporter Error Reporter used for reporting Errors from remote zendro services
     */
    static async remove_author_ids(id, author_ids, benignErrorReporter) {
        let query = `
            mutation
              updateInt_post_book{
                updateInt_post_book(
                  id:"${id}"
                  removeAuthors:["${author_ids.join("\",\"")}"]
                ){
                  id                  author_ids                }
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
                return new int_post_book(response.data.data.updateInt_post_book);
            } else {
                throw new Error(`Invalid response from remote zendro-server: ${remoteZendroURL}`);
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
        let attributes = Object.keys(int_post_book.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return int_post_book.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return int_post_book.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of int_post_book.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[int_post_book.idAttribute()]
    }
};