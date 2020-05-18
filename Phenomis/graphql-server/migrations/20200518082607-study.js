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
        return queryInterface.createTable('studies', {

            studyDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            active: {
                type: Sequelize[dict['Boolean']]
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            culturalPractices: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            endDate: {
                type: Sequelize[dict['DateTime']]
            },
            license: {
                type: Sequelize[dict['String']]
            },
            observationUnitsDescription: {
                type: Sequelize[dict['String']]
            },
            startDate: {
                type: Sequelize[dict['DateTime']]
            },
            studyDescription: {
                type: Sequelize[dict['String']]
            },
            studyName: {
                type: Sequelize[dict['String']]
            },
            studyType: {
                type: Sequelize[dict['String']]
            },
            trialDbId: {
                type: Sequelize[dict['String']]
            },
            locationDbId: {
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
        return queryInterface.dropTable('studies');
    }

};