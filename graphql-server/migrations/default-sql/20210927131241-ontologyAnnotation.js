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
        return queryInterface.createTable('ontologyAnnotations', {

            ontologyAnnotation_id: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            ontology: {
                type: Sequelize[dict['String']]
            },
            ontologyURL: {
                type: Sequelize[dict['String']]
            },
            term: {
                type: Sequelize[dict['String']]
            },
            termURL: {
                type: Sequelize[dict['String']]
            },
            investigation_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            assay_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            factor_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            material_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            protocol_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            contact_ids: {
                type: Sequelize[dict['[String]']],
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
        return queryInterface.dropTable('ontologyAnnotations');
    }

};