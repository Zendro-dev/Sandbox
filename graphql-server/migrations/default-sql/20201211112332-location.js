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
        return queryInterface.createTable('locations', {

            locationDbId: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            abbreviation: {
                type: Sequelize[dict['String']]
            },
            coordinateDescription: {
                type: Sequelize[dict['String']]
            },
            countryCode: {
                type: Sequelize[dict['String']]
            },
            countryName: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            environmentType: {
                type: Sequelize[dict['String']]
            },
            exposure: {
                type: Sequelize[dict['String']]
            },
            instituteAddress: {
                type: Sequelize[dict['String']]
            },
            instituteName: {
                type: Sequelize[dict['String']]
            },
            locationName: {
                type: Sequelize[dict['String']]
            },
            locationType: {
                type: Sequelize[dict['String']]
            },
            siteStatus: {
                type: Sequelize[dict['String']]
            },
            slope: {
                type: Sequelize[dict['String']]
            },
            topography: {
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
        return queryInterface.dropTable('locations');
    }

};