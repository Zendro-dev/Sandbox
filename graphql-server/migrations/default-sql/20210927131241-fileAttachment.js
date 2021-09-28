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
        return queryInterface.createTable('fileAttachments', {

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

            fileName: {
                type: Sequelize[dict['String']]
            },
            fileURL: {
                type: Sequelize[dict['String']]
            },
            mimeType: {
                type: Sequelize[dict['String']]
            },
            fileSize: {
                type: Sequelize[dict['Int']]
            },
            identifierName: {
                type: Sequelize[dict['String']]
            },
            investigation_id: {
                type: Sequelize[dict['String']]
            },
            study_id: {
                type: Sequelize[dict['String']]
            },
            assay_id: {
                type: Sequelize[dict['String']]
            },
            factor_id: {
                type: Sequelize[dict['String']]
            },
            material_id: {
                type: Sequelize[dict['String']]
            },
            protocol_id: {
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
        return queryInterface.dropTable('fileAttachments');
    }

};