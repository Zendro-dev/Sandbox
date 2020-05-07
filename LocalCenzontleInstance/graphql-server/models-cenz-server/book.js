const _ = require('lodash');
const path = require('path');
const models = require(path.join(__dirname, '..', 'models_index.js'));
const axios_general = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const uuidv4 = require('uuidv4');
const globals = require('../config/globals');

// An exact copy of the the model definition that comes from the .json file
const definition = {
    model: 'Book',
    storageType: 'cenz-server',
    url: 'http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql',
    attributes: {
        title: 'String',
        genre: 'String',
        internalBId: 'String',
        internalPId: 'String'
    },
    associations: {
        Author: {
            type: 'to_one',
            target: 'Person',
            targetKey: 'internalPId',
            keyIn: 'Book',
            targetStorageType: 'cenz_server',
            label: 'firstName',
            sublabel: 'email',
            name: 'Author',
            name_lc: 'author',
            name_cp: 'Author',
            target_lc: 'person',
            target_lc_pl: 'people',
            target_pl: 'People',
            target_cp: 'Person',
            target_cp_pl: 'People',
            keyIn_lc: 'book',
            holdsForeignKey: true
        }
    },
    internalId: 'internalBId',
    id: {
        name: 'internalBId',
        type: 'String'
    }
};

const url = "http://remotecenzontleinstance_sdb_science_db_graphql_server_1:3030/graphql";
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

module.exports = class Book {

    /**
     * constructor - Creates an instance of the model stored in webservice
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        internalBId,
        title,
        genre,
        internalPId
    }) {
        this.internalBId = internalBId;
        this.title = title;
        this.genre = genre;
        this.internalPId = internalPId;
    }

    static get name() {
        return "book";
    }

    static readById(id) {
        let query = `query readOneBook{ readOneBook(internalBId: "${id}"){internalBId        title
            genre
            internalPId
      } }`

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Book(res.data.data.readOneBook);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static countRecords(search) {
        let query = `query countBooks($search: searchBookInput){
      countBooks(search: $search)
    }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.countBooks;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static readAll(search, order, pagination) {
        let query = `query books($search: searchBookInput $pagination: paginationInput $order: [orderBookInput]){
      books(search:$search pagination:$pagination order:$order){internalBId          title
                genre
                internalPId
        } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let data = res.data.data.books;
                return data.map(item => {
                    return new Book(item)
                });
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });

    }

    static readAllCursor(search, order, pagination) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let query = `query booksConnection($search: searchBookInput $pagination: paginationCursorInput $order: [orderBookInput]){

      booksConnection(search:$search pagination:$pagination order:$order){ edges{cursor node{  internalBId  title
        genre
        internalPId
       } } pageInfo{startCursor endCursor hasPreviousPage hasNextPage  } } }`

        return axios.post(url, {
            query: query,
            variables: {
                search: search,
                order: order,
                pagination: pagination
            }
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                let data_edges = res.data.data.booksConnection.edges;
                let pageInfo = res.data.data.booksConnection.pageInfo;

                let edges = data_edges.map(e => {
                    return {
                        node: new Book(e.node),
                        cursor: e.cursor
                    }
                })

                return {
                    edges,
                    pageInfo
                };
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static addOne(input) {
        let query = `
        mutation addBook(
          $internalBId:ID!  
          $title:String
          $genre:String        ){
          addBook(          internalBId:$internalBId  
          title:$title
          genre:$genre){
            internalBId            title
            genre
            internalPId
          }
        }`;

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Book(res.data.data.addBook);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static deleteOne(id) {
        let query = `
          mutation
            deleteBook{
              deleteBook(
                internalBId: "${id}" )}`;

        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return res.data.data.deleteBook;
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static updateOne(input) {
        let query = `
          mutation
            updateBook(
              $internalBId:ID! 
              $title:String 
              $genre:String             ){
              updateBook(
                internalBId:$internalBId 
                title:$title 
                genre:$genre               ){
                internalBId 
                title 
                genre 
                internalPId 
              }
            }`

        return axios.post(url, {
            query: query,
            variables: input
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Book(res.data.data.updateBook);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * add_internalPId - field Mutation (adapter-layer) for to_one associationsArguments to add
     *
     * @param {Id}   internalBId   IdAttribute of the root model to be updated
     * @param {Id}   internalPId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static add_internalPId(internalBId, internalPId) {
        let query = `
            mutation
              updateBook{
                updateBook(
                  internalBId:"${internalBId}"
                  addAuthor:"${internalPId}"
                ){
                  internalBId                  internalPId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Book(res.data.data.updateBook);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    /**
     * remove_internalPId - field Mutation (adapter-layer) for to_one associationsArguments to remove
     *
     * @param {Id}   internalBId   IdAttribute of the root model to be updated
     * @param {Id}   internalPId Foreign Key (stored in "Me") of the Association to be updated.
     */
    static remove_internalPId(internalBId, internalPId) {
        let query = `
            mutation
              updateBook{
                updateBook(
                  internalBId:"${internalBId}"
                  removeAuthor:"${internalPId}"
                ){
                  internalBId                  internalPId                }
              }`
        return axios.post(url, {
            query: query
        }).then(res => {
            //check
            if (res && res.data && res.data.data) {
                return new Book(res.data.data.updateBook);
            } else {
                throw new Error(`Invalid response from remote cenz-server: ${url}`);
            }
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }


    static bulkAddCsv(context) {
        let tmpFile = path.join(os.tmpdir(), uuidv4() + '.csv');

        return context.request.files.csv_file.mv(tmpFile).then(() => {
            let query = `mutation {bulkAddBookCsv{internalBId}}`;
            let formData = new FormData();
            formData.append('csv_file', fs.createReadStream(tmpFile));
            formData.append('query', query);

            return axios.post(url, formData, {
                headers: formData.getHeaders()
            }).then(res => {
                return res.data.data.bulkAddBookCsv;
            });

        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
    }

    static csvTableTemplate() {
        let query = `query { csvTableTemplateBook }`;
        return axios.post(url, {
            query: query
        }).then(res => {
            return res.data.data.csvTableTemplateBook;
        }).catch(error => {
            error['url'] = url;
            handleError(error);
        });
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
        let attributes = Object.keys(Book.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }

    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        return Book.definition.id.name;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Book.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Book.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Book.idAttribute()]
    }
};