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
        return queryInterface.createTable('sPARefactors', {

            string: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            array: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            int: {
                type: Sequelize[dict['Int']]
            },
            float: {
                type: Sequelize[dict['Float']]
            },
            date: {
                type: Sequelize[dict['Date']]
            },
            time: {
                type: Sequelize[dict['Time']]
            },
            datetime: {
                type: Sequelize[dict['DateTime']]
            },
            boolean: {
                type: Sequelize[dict['Boolean']]
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
        return queryInterface.dropTable('sPARefactors');
    }

};