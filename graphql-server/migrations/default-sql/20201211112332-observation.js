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
        return queryInterface.createTable('observations', {

            observationDbId: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            collector: {
                type: Sequelize[dict['String']]
            },
            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            observationTimeStamp: {
                type: Sequelize[dict['DateTime']]
            },
            observationUnitDbId: {
                type: Sequelize[dict['String']]
            },
            observationVariableDbId: {
                type: Sequelize[dict['String']]
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            },
            uploadedBy: {
                type: Sequelize[dict['String']]
            },
            value: {
                type: Sequelize[dict['String']]
            },
            seasonDbId: {
                type: Sequelize[dict['String']]
            },
            imageDbId: {
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
        return queryInterface.dropTable('observations');
    }

};