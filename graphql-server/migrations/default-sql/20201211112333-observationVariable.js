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
        return queryInterface.createTable('observationVariables', {

            observationVariableDbId: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            commonCropName: {
                type: Sequelize[dict['String']]
            },
            defaultValue: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            growthStage: {
                type: Sequelize[dict['String']]
            },
            institution: {
                type: Sequelize[dict['String']]
            },
            language: {
                type: Sequelize[dict['String']]
            },
            scientist: {
                type: Sequelize[dict['String']]
            },
            status: {
                type: Sequelize[dict['String']]
            },
            submissionTimestamp: {
                type: Sequelize[dict['DateTime']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            observationVariableName: {
                type: Sequelize[dict['String']]
            },
            methodDbId: {
                type: Sequelize[dict['String']]
            },
            scaleDbId: {
                type: Sequelize[dict['String']]
            },
            traitDbId: {
                type: Sequelize[dict['String']]
            },
            ontologyDbId: {
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
        return queryInterface.dropTable('observationVariables');
    }

};