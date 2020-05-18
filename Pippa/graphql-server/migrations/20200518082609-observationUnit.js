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
        return queryInterface.createTable('observationUnits', {

            observationUnitDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            germplasmDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
                type: Sequelize[dict['String']]
            },
            observationLevel: {
                type: Sequelize[dict['String']]
            },
            observationUnitName: {
                type: Sequelize[dict['String']]
            },
            observationUnitPUI: {
                type: Sequelize[dict['String']]
            },
            plantNumber: {
                type: Sequelize[dict['String']]
            },
            plotNumber: {
                type: Sequelize[dict['String']]
            },
            programDbId: {
                type: Sequelize[dict['String']]
            },
            studyDbId: {
                type: Sequelize[dict['String']]
            },
            trialDbId: {
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
        return queryInterface.dropTable('observationUnits');
    }

};