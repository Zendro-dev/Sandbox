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
        return queryInterface.createTable('sequencing_experiments', {

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
            description: {
                type: Sequelize[dict['String']]
            },
            start_date: {
                type: Sequelize[dict['String']]
            },
            end_date: {
                type: Sequelize[dict['String']]
            },
            protocol: {
                type: Sequelize[dict['String']]
            },
            platform: {
                type: Sequelize[dict['String']]
            },
            data_type: {
                type: Sequelize[dict['String']]
            },
            library_type: {
                type: Sequelize[dict['String']]
            },
            library_preparation: {
                type: Sequelize[dict['String']]
            },
            aimed_coverage: {
                type: Sequelize[dict['Float']]
            },
            resulting_coverage: {
                type: Sequelize[dict['Float']]
            },
            insert_size: {
                type: Sequelize[dict['Float']]
            },
            aimed_read_length: {
                type: Sequelize[dict['String']]
            },
            genome_complexity_reduction: {
                type: Sequelize[dict['String']]
            },
            contamination: {
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
        return queryInterface.dropTable('sequencing_experiments');
    }

};