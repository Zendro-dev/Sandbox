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
            sampling_date: {
                type: Sequelize[dict['String']]
            },
            type: {
                type: Sequelize[dict['String']]
            },
            biological_replicate_no: {
                type: Sequelize[dict['Int']]
            },
            lab_code: {
                type: Sequelize[dict['String']]
            },
            treatment: {
                type: Sequelize[dict['String']]
            },
            tissue: {
                type: Sequelize[dict['String']]
            },
            individual_id: {
                type: Sequelize[dict['Int']]
            },
            sequencing_experiment_id: {
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