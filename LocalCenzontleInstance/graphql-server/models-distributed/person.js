const _ = require('lodash');
const path = require('path');
const adapters = require('../adapters/index');
const globals = require('../config/globals');
const helper = require('../utils/helper');
const models = require(path.join(__dirname, '..', 'models_index.js'));

const definition = {
    model: 'Person',
    storageType: 'distributed-data-model',
    registry: [
        'people_server_a',
        'people_server_b'
    ],
    attributes: {
        firstName: 'String',
        lastName: 'String',
        email: 'String',
        companyId: 'Int',
        internalPersonId: 'String'
    },
    associations: {
        works: {
            type: 'to_many',
            target: 'Book',
            targetKey: 'internalPersonId',
            keyIn: 'Book',
            targetStorageType: 'cenz_server',
            label: 'title',
            name: 'works',
            name_lc: 'works',
            name_cp: 'Works',
            target_lc: 'book',
            target_lc_pl: 'books',
            target_pl: 'Books',
            target_cp: 'Book',
            target_cp_pl: 'Books',
            keyIn_lc: 'book'
        }
    },
    internalId: 'internalPersonId',
    id: {
        name: 'internalPersonId',
        type: 'String'
    }
};

let registry = ["people_server_a", "people_server_b"];

module.exports = class Person {

    /**
     * constructor - Creates an instance of the model
     *
     * @param  {obejct} input    Data for the new instances. Input for each field of the model.
     */

    constructor({
        internalPersonId,
        firstName,
        lastName,
        email,
        companyId
    }) {
        this.internalPersonId = internalPersonId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.companyId = companyId;
    }

    static get name() {
        return "person";
    }

    /**
     * registeredAdapters - Returns an object which has a key for each
     * adapter on adapter/index.js. Each key of the object will have 
     *
     * @return {string}     baseUrl from request.
     */
    static get registeredAdapters() {
        return ["people_server_a", "people_server_b"].reduce((a, c) => {
            a[c] = adapters[c];
            return a;
        }, {});
    }

    static adapterForIri(iri) {
        let responsibleAdapter = registry.filter(adapter => adapters[adapter].recognizeId(iri));
        if (responsibleAdapter.length > 1) {
            throw new Error("IRI has no unique match");
        } else if (responsibleAdapter.length === 0) {
            throw new Error("IRI has no match WS");
        }
        return responsibleAdapter[0];
    }

    static readById(id) {
        /**
         * Debug
         */
        console.log("-@@---- ddm.readById \nid: ", id);

        if (id !== null) {
            let responsibleAdapter = this.adapterForIri(id);
            return adapters[responsibleAdapter].readById(id);
        }
    }

    static countRecords(search, authorizedAdapters) {
        /**
         * Debug
         */
        console.log("-@@---- ddm.countRecords \nauth.adapters: ", authorizedAdapters.reduce((a, c) => {
            a.push(c.adapterName);
            return a;
        }, []));

        let promises = authorizedAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   local: resolve with current parameters.
             *   remote: add exclusions to search.excludeAdapterNames
             */
            if (adapter.adapterType === 'local') {

                return adapter.countRecords(search).then(r => {
                    /**
                     * Debug
                     */
                    console.log("-@@-------- ddm: rx:\nlocal.adapter: ", adapter.adapterName, "\n result[", typeof r, "]: \n\n", r, "\n---------- @@@");
                    return r;
                });
            } else if (adapter.adapterType === 'remote') {
                //check: @search.excludeAdapterNames
                let nsearch = {};

                if ((!search || typeof search !== 'object')) { //has not search object
                    nsearch.excludeAdapterNames = [];

                } else {
                    if (search.excludeAdapterNames === undefined) { //search object has not exclusions
                        nsearch = {
                            ...search
                        };
                        nsearch.excludeAdapterNames = [];

                    } else { //exclusions are defined

                        if (!Array.isArray(search.excludeAdapterNames)) { //defined but invalid
                            throw new Error('Illegal excludeAdapterNames parameter in search object, it should be an array.');
                        } //else

                        nsearch = {
                            ...search
                        };
                    }
                }

                /*
                 * append all registeredAdapters, except the current <adapter>, 
                 * to search.excludeAdapterNames array.
                 */
                Object.values(this.registeredAdapters).forEach(a => {
                    if (a.adapterName !== adapter.adapterName && !nsearch.excludeAdapterNames.includes(a.adapterName)) {
                        //add adapter name to exclude list
                        nsearch.excludeAdapterNames.push(a.adapterName);
                    }
                });
                //use new search
                return adapter.countRecords(nsearch).then(r => {
                    /**
                     * Debug
                     */
                    console.log("-@@-------- ddm: rx:\nremote.adapter: ", adapter.adapterName, "\n result[", typeof r, "]: \n\n", r, "\n---------- @@@");
                    return r;
                });
            } else {

                throw Error(`Adapter of type '${adapter.type}' is not supported.`);
            }
        });

        return Promise.all(promises).then(results => {
            return results.reduce((total, current) => {
                //check current result
                if (current) {
                    return total + current;
                } else {
                    return total;
                }
            }, 0);
        });
    }

    static readAllCursor(search, order, pagination, authorizedAdapters) {
        /**
         * Debug
         */
        console.log("-@@---- ddm.readAllCursor \nauth.adapters: ", authorizedAdapters.reduce((a, c) => {
            a.push(c.adapterName);
            return a;
        }, []));

        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let promises = authorizedAdapters.map(adapter => {
            /**
             * Differentiated cases:
             *   local: resolve with current parameters.
             *   remote: add exclusions to search.excludeAdapterNames parameter.
             */
            if (adapter.adapterType === 'local') {

                return adapter.readAllCursor(search, order, pagination).then(r => {
                    /**
                     * Debug
                     */
                    console.log("-@@-------- ddm: rx:\nlocal.adapter: ", adapter.adapterName, "\n result[", typeof r, "]: \n\n", r, "\n---------- @@@");
                    return r;
                });
            } else if (adapter.adapterType === 'remote') {
                //check: @search.excludeAdapterNames
                let nsearch = {};

                if ((!search || typeof search !== 'object')) { //has not search object
                    nsearch.excludeAdapterNames = [];

                } else {
                    if (search.excludeAdapterNames === undefined) { //search object has not exclusions
                        nsearch = {
                            ...search
                        };
                        nsearch.excludeAdapterNames = [];

                    } else { //exclusions are defined

                        if (!Array.isArray(search.excludeAdapterNames)) { //defined but invalid
                            throw new Error('Illegal excludeAdapterNames parameter in search object, it should be an array.');
                        } //else

                        nsearch = {
                            ...search
                        };
                    }
                }

                /*
                 * append all registeredAdapters, except the current <adapter>, 
                 * to search.excludeAdapterNames array.
                 */
                Object.values(this.registeredAdapters).forEach(a => {
                    if (a.adapterName !== adapter.adapterName && !nsearch.excludeAdapterNames.includes(a.adapterName)) {
                        //add adapter name to exclude list
                        nsearch.excludeAdapterNames.push(a.adapterName);
                    }
                });
                //use new search
                return adapter.readAllCursor(nsearch, order, pagination).then(r => {
                    /**
                     * Debug
                     */
                    console.log("-@@-------- ddm: rx:\nremote.adapter: ", adapter.adapterName, "\n result[", typeof r, "]: \n\n", r, "\n---------- @@@");
                    return r;
                });
            } else {

                throw Error(`Adapter of type '${adapter.adapterType}' is not supported.`)
            }
        });
        let someHasNextPage = false;
        let someHasPreviousPage = false;
        return Promise.all(promises)
            //phase 1: reduce
            .then(results => {
                /**
                 * Debug
                 */
                console.log("@@---------- phase1:\n", "\n results[", typeof results, "]", "\n---------- @@@");

                return results.reduce((total, current) => {
                    //check
                    if (current && current.pageInfo && current.edges) {
                        someHasNextPage |= current.pageInfo.hasNextPage;
                        someHasPreviousPage |= current.pageInfo.hasPreviousPage;
                        return total.concat(current.edges.map(e => e.node));
                    } else {
                        return total;
                    }
                }, []);
            })
            //phase 2: order & paginate
            .then(nodes => {
                /**
                 * Debug
                 */
                console.log("@@---------- phase2:\n", "\n nodes[", typeof nodes, "]", "\n---------- @@@");

                if (order === undefined) {
                    order = [{
                        field: "internalPersonId",
                        order: 'ASC'
                    }];
                }
                if (pagination === undefined) {
                    pagination = {
                        first: Math.min(globals.LIMIT_RECORDS, nodes.length)
                    }
                }

                let ordered_records = helper.orderRecords(nodes, order);
                let paginated_records = [];

                if (isForwardPagination) {
                    paginated_records = helper.paginateRecordsCursor(ordered_records, pagination.first);
                } else {
                    paginated_records = helper.paginateRecordsBefore(ordered_records, pagination.last);
                }

                let hasNextPage = ordered_records.length > pagination.first || someHasNextPage;
                let hasPreviousPage = ordered_records.length > pagination.last || someHasPreviousPage;

                return helper.toGraphQLConnectionObject(paginated_records, this, hasNextPage, hasPreviousPage);
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
        let attributes = Object.keys(Person.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }





    countFilteredWorksImpl({
        search
    }) {

        if (search === undefined) {
            return models.book.countRecords({
                "field": "internalPersonId",
                "value": {
                    "value": this.getIdValue()
                },
                "operator": "eq"
            });
        } else {
            return models.book.countRecords({
                "operator": "and",
                "search": [{
                    "field": "internalPersonId",
                    "value": {
                        "value": this.getIdValue()
                    },
                    "operator": "eq"
                }, search]
            })
        }
    }

    worksConnectionImpl({
        search,
        order,
        pagination
    }) {
        if (search === undefined) {
            return models.book.readAllCursor({
                "field": "internalPersonId",
                "value": {
                    "value": this.getIdValue()
                },
                "operator": "eq"
            }, order, pagination);
        } else {
            return models.book.readAllCursor({
                "operator": "and",
                "search": [{
                    "field": "internalPersonId",
                    "value": {
                        "value": this.getIdValue()
                    },
                    "operator": "eq"
                }, search]
            }, order, pagination)
        }
    }


    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = Person.definition.id.name;
        return internalId;
    }

    /**
     * idAttributeType - Return the Type of the internalId.
     *
     * @return {type} Type given in the JSON model
     */

    static idAttributeType() {
        return Person.definition.id.type;
    }

    /**
     * getIdValue - Get the value of the idAttribute ("id", or "internalId") for an instance of Person.
     *
     * @return {type} id value
     */

    getIdValue() {
        return this[Person.idAttribute()]
    }

    static assertInputHasId(input) {
        if (!input.internalPersonId) {
            throw new Error(`Illegal argument. Provided input requires attribute 'internalPersonId'.`);
        }
        return true;
    }

    static addOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.internalPersonId);

        /**
         * Debug
         */
        console.log("-@@---- ddm.addOne: \nresponsibleAdapter: ", responsibleAdapter);

        return adapters[responsibleAdapter].addOne(input);
    }

    static deleteOne(id) {
        let responsibleAdapter = this.adapterForIri(id);

        /**
         * Debug
         */
        console.log("-@@---- ddm.deleteOne: \nresponsibleAdapter: ", responsibleAdapter);

        return adapters[responsibleAdapter].deleteOne(id);
    }

    static updateOne(input) {
        this.assertInputHasId(input);
        let responsibleAdapter = this.adapterForIri(input.internalPersonId);

        /**
         * Debug
         */
        console.log("-@@---- ddm.updateOne: \nresponsibleAdapter: ", responsibleAdapter);

        return adapters[responsibleAdapter].updateOne(input);
    }

    static bulkAddCsv(context) {
        throw Error("Person.bulkAddCsv is not implemented.")
    }

    static csvTableTemplate() {
        return helper.csvTableTemplate(Person);
    }
}