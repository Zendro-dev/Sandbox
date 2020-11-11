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
        return queryInterface.createTable('assayResults', {

            assayResult_id: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            unit: {
                type: Sequelize[dict['String']]
            },
            value_as_str: {
                type: Sequelize[dict['String']]
            },
            value_as_int: {
                type: Sequelize[dict['Int']]
            },
            value_as_num: {
                type: Sequelize[dict['Float']]
            },
            value_as_bool: {
                type: Sequelize[dict['Boolean']]
            },
            value_as_float: {
                type: Sequelize[dict['Float']]
            },
            assay_id: {
                type: Sequelize[dict['String']]
            },
            material_id: {
                type: Sequelize[dict['String']]
            },
            ontologyAnnotation_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            fileAttachment_ids: {
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
        return queryInterface.dropTable('assayResults');
    }

};