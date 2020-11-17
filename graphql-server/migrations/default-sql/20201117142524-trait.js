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
        return queryInterface.createTable('traits', {

            traitDbId: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            attribute: {
                type: Sequelize[dict['String']]
            },
            entity: {
                type: Sequelize[dict['String']]
            },
            mainAbbreviation: {
                type: Sequelize[dict['String']]
            },
            status: {
                type: Sequelize[dict['String']]
            },
            traitClass: {
                type: Sequelize[dict['String']]
            },
            traitDescription: {
                type: Sequelize[dict['String']]
            },
            traitName: {
                type: Sequelize[dict['String']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            ontologyDbId: {
                type: Sequelize[dict['String']]
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
        return queryInterface.dropTable('traits');
    }

};