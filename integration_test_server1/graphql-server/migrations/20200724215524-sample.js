'use strict';
const dict = require('../utils/graphql-sequelize-types');

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
        return queryInterface.createTable('samples', {

            id: {
                type: Sequelize[dict['Int']],
                primaryKey: true,
                autoIncrement: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            name: {
                type: Sequelize[dict['String']]
            },
            material: {
                type: Sequelize[dict['String']]
            },
            life_cycle_phase: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            harvest_date: {
                type: Sequelize[dict['Date']]
            },
            library: {
                type: Sequelize[dict['String']]
            },
            barcode_number: {
                type: Sequelize[dict['Int']]
            },
            barcode_sequence: {
                type: Sequelize[dict['String']]
            },
            sample_id: {
                type: Sequelize[dict['Int']]
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
        return queryInterface.dropTable('samples');
    }

};