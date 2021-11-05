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
        return queryInterface.createTable('biological_materials', {

            id: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            organism: {
                type: Sequelize[dict['String']]
            },
            genus: {
                type: Sequelize[dict['String']]
            },
            species: {
                type: Sequelize[dict['String']]
            },
            infraspecific_name: {
                type: Sequelize[dict['String']]
            },
            location_latitude: {
                type: Sequelize[dict['String']]
            },
            location_longitude: {
                type: Sequelize[dict['String']]
            },
            location_altitude: {
                type: Sequelize[dict['Float']]
            },
            location_coordinates_uncertainty: {
                type: Sequelize[dict['Float']]
            },
            preprocessing: {
                type: Sequelize[dict['String']]
            },
            source_id: {
                type: Sequelize[dict['String']]
            },
            source_doi: {
                type: Sequelize[dict['String']]
            },
            source_latitude: {
                type: Sequelize[dict['String']]
            },
            source_longitude: {
                type: Sequelize[dict['String']]
            },
            source_altitude: {
                type: Sequelize[dict['Float']]
            },
            source_coordinates_uncertainty: {
                type: Sequelize[dict['Float']]
            },
            source_description: {
                type: Sequelize[dict['String']]
            },
            study_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            observation_unit_ids: {
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
        return queryInterface.dropTable('biological_materials');
    }

};