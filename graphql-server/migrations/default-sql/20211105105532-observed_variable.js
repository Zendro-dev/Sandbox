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
        return queryInterface.createTable('observed_variables', {

            id: {
                type: Sequelize.STRING,
                primaryKey: true
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
            accession_number: {
                type: Sequelize[dict['String']]
            },
            trait: {
                type: Sequelize[dict['String']]
            },
            trait_accession_number: {
                type: Sequelize[dict['String']]
            },
            method: {
                type: Sequelize[dict['String']]
            },
            method_accession_number: {
                type: Sequelize[dict['String']]
            },
            method_description: {
                type: Sequelize[dict['String']]
            },
            scale: {
                type: Sequelize[dict['String']]
            },
            scale_accession_number: {
                type: Sequelize[dict['String']]
            },
            time_scale: {
                type: Sequelize[dict['String']]
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            data_file_ids: {
                type: Sequelize[dict['[Int]']],
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
        return queryInterface.dropTable('observed_variables');
    }

};