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
        return queryInterface.createTable('studies', {

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

            title: {
                type: Sequelize[dict['String']]
            },
            description: {
                type: Sequelize[dict['String']]
            },
            startDate: {
                type: Sequelize[dict['Date']]
            },
            endDate: {
                type: Sequelize[dict['Date']]
            },
            institution: {
                type: Sequelize[dict['String']]
            },
            location_country: {
                type: Sequelize[dict['String']]
            },
            location_latitude: {
                type: Sequelize[dict['String']]
            },
            location_longitude: {
                type: Sequelize[dict['String']]
            },
            location_altitude: {
                type: Sequelize[dict['String']]
            },
            experimental_site_name: {
                type: Sequelize[dict['String']]
            },
            experimental_design_type: {
                type: Sequelize[dict['String']]
            },
            experimental_design_description: {
                type: Sequelize[dict['String']]
            },
            experimental_design_map: {
                type: Sequelize[dict['String']]
            },
            observation_unit_level_hirarchy: {
                type: Sequelize[dict['String']]
            },
            observation_unit_description: {
                type: Sequelize[dict['String']]
            },
            growth_facility: {
                type: Sequelize[dict['String']]
            },
            growth_facility_description: {
                type: Sequelize[dict['String']]
            },
            cultural_practices: {
                type: Sequelize[dict['String']]
            },
            investigation_id: {
                type: Sequelize[dict['String']]
            },
            person_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            observed_variable_ids: {
                type: Sequelize[dict['[String]']],
                defaultValue: '[]'
            },
            biological_material_ids: {
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
        return queryInterface.dropTable('studies');
    }

};