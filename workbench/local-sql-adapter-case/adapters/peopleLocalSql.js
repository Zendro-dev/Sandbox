const _ = require('lodash');
const axios_general = require('axios');
const globals = require('../config/globals');
const {
    handleError
} = require('../utils/errors');
const Sequelize = require('sequelize');
const dict = require('../utils/graphql-sequelize-types');
const validatorUtil = require('../utils/validatorUtil');
const helper = require('../utils/helper');
const searchArg = require('../utils/search-argument');

let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteCenzontleURL = "http://localhost:3000/graphql";
const iriRegex = new RegExp('peopleLocal');

const definition = {
    model: 'Person',
    storageType: 'distributed-data-model',
    registry: [
        'peopleRemote',
        'peopleLocalSql'
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


module.exports = class peopleLocalSql extends Sequelize.Model {

  static init(sequelize, DataTypes) {
      return super.init({

          internalPersonId: {
              type: Sequelize[dict['String']],
              primaryKey: true
          },
          firstName: {
              type: Sequelize[dict['String']]
          },
          lastName: {
              type: Sequelize[dict['String']]
          },
          email: {
              type: Sequelize[dict['String']]
          },
          companyId: {
              type: Sequelize[dict['Int']]
          }


      }, {
          modelName: "person",
          tableName: "people",
          sequelize
      });
  }


      static addOne(input) {
          console.log("GOT TO THE CORRECT ADAPTER");
          return validatorUtil.ifHasValidatorFunctionInvoke('validateForCreate', this, input)
              .then(async (valSuccess) => {
                  try {
                      console.log("INPUT", input);
                      const result = await sequelize.transaction(async (t) => {
                          let item = await super.create(input, {
                              transaction: t
                          });
                          let promises_associations = [];

                          return Promise.all(promises_associations).then(() => {
                              return item
                          });
                      });

                      if (input.addWorks) {
                          let wrong_ids = await helper.checkExistence(input.addWorks, models.book);
                          if (wrong_ids.length > 0) {
                              throw new Error(`Ids ${wrong_ids.join(",")} in model book were not found.`);
                          } else {
                              await result._addWorks(input.addWorks);
                          }
                      }
                      return result;
                  } catch (error) {
                      throw error;
                  }
              });
      }


    static recognizeId(iri) {
        return iriRegex.test(iri);
    }

    static readById(id) {
        let options = {};
        options['where'] = {};
        options['where'][this.idAttribute()] = id;
        return peopleLocalSql.findOne(options);
    }

    static countRecords(search) {
        let options = {};
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }
        return super.count(options);
    }

    static readAllCursor(search, order, pagination) {
        //check valid pagination arguments
        let argsValid = (pagination === undefined) || (pagination.first && !pagination.before && !pagination.last) || (pagination.last && !pagination.after && !pagination.first);
        if (!argsValid) {
            throw new Error('Illegal cursor based pagination arguments. Use either "first" and optionally "after", or "last" and optionally "before"!');
        }

        let isForwardPagination = !pagination || !(pagination.last != undefined);
        let options = {};
        options['where'] = {};

        /*
         * Search conditions
         */
        if (search !== undefined) {
            let arg = new searchArg(search);
            let arg_sequelize = arg.toSequelize();
            options['where'] = arg_sequelize;
        }

        /*
         * Count
         */
        return super.count(options).then(countA => {
            options['offset'] = 0;
            options['order'] = [];
            options['limit'] = countA;
            /*
             * Order conditions
             */
            if (order !== undefined) {
                options['order'] = order.map((orderItem) => {
                    return [orderItem.field, orderItem.order];
                });
            }
            if (!options['order'].map(orderItem => {
                    return orderItem[0]
                }).includes("internalPersonId")) {
                options['order'] = [...options['order'], ...[
                    ["internalPersonId", "ASC"]
                ]];
            }

            /*
             * Pagination conditions
             */
            if (pagination) {
                //forward
                if (isForwardPagination) {
                    if (pagination.after) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.after));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursor(options['order'], decoded_cursor, "internalPersonId", pagination.includeCursor)
                        };
                    }
                } else { //backward
                    if (pagination.before) {
                        let decoded_cursor = JSON.parse(this.base64Decode(pagination.before));
                        options['where'] = {
                            ...options['where'],
                            ...helper.parseOrderCursorBefore(options['order'], decoded_cursor, "internalPersonId", pagination.includeCursor)
                        };
                    }
                }
            }
            //woptions: copy of {options} with only 'where' options
            let woptions = {};
            woptions['where'] = { ...options['where']
            };
            /*
             *  Count (with only where-options)
             */
            return super.count(woptions).then(countB => {
                /*
                 * Limit conditions
                 */
                if (pagination) {
                    //forward
                    if (isForwardPagination) {

                        if (pagination.first) {
                            options['limit'] = pagination.first;
                        }
                    } else { //backward
                        if (pagination.last) {
                            options['limit'] = pagination.last;
                            options['offset'] = Math.max((countB - pagination.last), 0);
                        }
                    }
                }
                //check: limit
                if (globals.LIMIT_RECORDS < options['limit']) {
                    throw new Error(`Request of total people exceeds max limit of ${globals.LIMIT_RECORDS}. Please use pagination.`);
                }

                /*
                 * Get records
                 */
                return super.findAll(options).then(records => {
                    let edges = [];
                    let pageInfo = {
                        hasPreviousPage: false,
                        hasNextPage: false,
                        startCursor: null,
                        endCursor: null
                    };

                    //edges
                    if (records.length > 0) {
                        edges = records.map(record => {
                            return {
                                node: record,
                                cursor: record.base64Enconde()
                            }
                        });
                    }

                    //forward
                    if (isForwardPagination) {

                        pageInfo = {
                            hasPreviousPage: ((countA - countB) > 0),
                            hasNextPage: (pagination && pagination.first ? (countB > pagination.first) : false),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    } else { //backward

                        pageInfo = {
                            hasPreviousPage: (pagination && pagination.last ? (countB > pagination.last) : false),
                            hasNextPage: ((countA - countB) > 0),
                            startCursor: (records.length > 0) ? edges[0].cursor : null,
                            endCursor: (records.length > 0) ? edges[edges.length - 1].cursor : null
                        }
                    }

                    return {
                        edges,
                        pageInfo
                    };

                }).catch(error => {
                    throw error;
                });
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    }


    static deleteOne(id) {
        return super.findByPk(id)
            .then(item => {

                if (item === null) return new Error(`Record with ID = ${id} not exist`);

                return validatorUtil.ifHasValidatorFunctionInvoke('validateForDelete', this, item)
                    .then((valSuccess) => {
                        return item
                            .destroy()
                            .then(() => {
                                return 'Item successfully deleted';
                            });
                    }).catch((err) => {
                        return err
                    })
            });

    }

    static updateOne(input) {
        return validatorUtil.ifHasValidatorFunctionInvoke('validateForUpdate', this, input)
            .then(async (valSuccess) => {
                try {
                    let result = await sequelize.transaction(async (t) => {
                        let promises_associations = [];
                        let item = await super.findByPk(input[this.idAttribute()], {
                            transaction: t
                        });
                        let updated = await item.update(input, {
                            transaction: t
                        });

                        return Promise.all(promises_associations).then(() => {
                            return updated;
                        });
                    });



                    if (input.addWorks) {
                        let wrong_ids = await helper.checkExistence(input.addWorks, models.book);
                        if (wrong_ids.length > 0) {
                            throw new Error(`Ids ${wrong_ids.join(",")} in model book were not found.`);
                        } else {
                            await result._addWorks(input.addWorks);
                        }
                    }

                    if (input.removeWorks) {
                        let ids_associated = await result.worksImpl().map(t => `${t[models.book.idAttribute()]}`);
                        await helper.asyncForEach(input.removeWorks, async id => {
                            if (!ids_associated.includes(id)) {
                                throw new Error(`The association with id ${id} that you're trying to remove desn't exist`);
                            }
                        });
                        await result._removeWorks(input.removeWorks);
                    }


                    return result;
                } catch (error) {
                    throw error;
                }
            });
    }


    getIdValue() {
        return this[peopleLocalSql.idAttribute()]
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
        let attributes = Object.keys(peopleLocalSql.definition.attributes);
        let data_values = _.pick(this, attributes);
        return data_values;
    }



    /**
     * idAttribute - Check whether an attribute "internalId" is given in the JSON model. If not the standard "id" is used instead.
     *
     * @return {type} Name of the attribute that functions as an internalId
     */

    static idAttribute() {
        let internalId = peopleLocalSql.definition.id.name;
        return internalId;
    }

    static get name() {
        return "peopleLocalSql";
    }

    static get type(){
      return 'local';
    }
}
