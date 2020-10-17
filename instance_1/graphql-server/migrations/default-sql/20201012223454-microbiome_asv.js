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
        return queryInterface.createTable('microbiome_asvs', {

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

            asv_id: {
                type: Sequelize[dict['String']]
            },
            compartment: {
                type: Sequelize[dict['String']]
            },
            count: {
                type: Sequelize[dict['Int']]
            },
            version: {
                type: Sequelize[dict['Int']]
            },
            primer_kingdom: {
                type: Sequelize[dict['String']]
            },
            reference_gene: {
                type: Sequelize[dict['String']]
            },
            reference_sequence: {
                type: Sequelize[dict['String']]
            },
            sample_id: {
                type: Sequelize[dict['Int']]
            },
            taxon_id: {
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
        return queryInterface.dropTable('microbiome_asvs');
    }

};