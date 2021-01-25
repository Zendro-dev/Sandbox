'use strict';
const dict = require('../../utils/graphql-sequelize-types');

/**
 * @module - Migrations to create and to undo a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was created successfully, rejected otherwise.
     */
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('no_assocs', {

            idField: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            stringField: {
                type: Sequelize[dict['String']]
            },
            intField: {
                type: Sequelize[dict['Int']]
            },
            floatField: {
                type: Sequelize[dict['Float']]
            },
            datetimeField: {
                type: Sequelize[dict['DateTime']]
            },
            booleanField: {
                type: Sequelize[dict['Boolean']]
            },
            stringArrayField: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            intArrayField: {
                type: Sequelize[dict['[Int]']],
                defaultValue: '[]'
            },
            floatArrayField: {
                type: Sequelize[dict['[Float]']],
                defaultValue: '[]'
            },
            datetimeArrayField: {
                type: Sequelize[dict['[DateTime]']],
                defaultValue: '[]'
            },
            booleanArrayField: {
                type: Sequelize[dict['[Boolean]']],
                defaultValue: '[]'
            }

        });
    },

    /**
     * down - Deletes a table.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was deleted successfully, rejected otherwise.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('no_assocs');
    }

};