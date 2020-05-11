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
        return queryInterface.createTable('images', {

            imageDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            copyright: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            imageFileName: {
                type: Sequelize[dict['String']]
            },
            imageFileSize: {
                type: Sequelize[dict['Int']]
            },
            imageHeight: {
                type: Sequelize[dict['Int']]
            },
            imageName: {
                type: Sequelize[dict['String']]
            },
            imageTimeStamp: {
                type: Sequelize[dict['DateTime']]
            },
            imageURL: {
                type: Sequelize[dict['String']]
            },
            imageWidth: {
                type: Sequelize[dict['Int']]
            },
            mimeType: {
                type: Sequelize[dict['String']]
            },
            observationUnitDbId: {
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
        return queryInterface.dropTable('images');
    }

};