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
        return queryInterface.createTable('germplasms', {

            germplasmDbId: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            accessionNumber: {
                type: Sequelize[dict['String']]
            },
            acquisitionDate: {
                type: Sequelize[dict['Date']]
            },
            breedingMethodDbId: {
                type: Sequelize[dict['String']]
            },
            commonCropName: {
                type: Sequelize[dict['String']]
            },
            countryOfOriginCode: {
                type: Sequelize[dict['String']]
            },
            defaultDisplayName: {
                type: Sequelize[dict['String']]
            },
            documentationURL: {
                type: Sequelize[dict['String']]
            },
            germplasmGenus: {
                type: Sequelize[dict['String']]
            },
            germplasmName: {
                type: Sequelize[dict['String']]
            },
            germplasmPUI: {
                type: Sequelize[dict['String']]
            },
            germplasmPreprocessing: {
                type: Sequelize[dict['String']]
            },
            germplasmSpecies: {
                type: Sequelize[dict['String']]
            },
            germplasmSubtaxa: {
                type: Sequelize[dict['String']]
            },
            instituteCode: {
                type: Sequelize[dict['String']]
            },
            instituteName: {
                type: Sequelize[dict['String']]
            },
            pedigree: {
                type: Sequelize[dict['String']]
            },
            seedSource: {
                type: Sequelize[dict['String']]
            },
            seedSourceDescription: {
                type: Sequelize[dict['String']]
            },
            speciesAuthority: {
                type: Sequelize[dict['String']]
            },
            subtaxaAuthority: {
                type: Sequelize[dict['String']]
            },
            xref: {
                type: Sequelize[dict['String']]
            },
            biologicalStatusOfAccessionCode: {
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
        return queryInterface.dropTable('germplasms');
    }

};