'use strict';
const dict = require('../utils/graphql-sequelize-types');
const {
    Sequelize
} = require("sequelize");
const {
    DOWN_MIGRATION
} = require('../config/globals');
/**
 * @module - Migrations to create or to drop a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @param  {object} zendro initialized zendro object which provides the access to different APIs
     * in zendro layers (resolvers, models, adapters) and enables graphql queries.
     */
    up: async (zendro) => {
        try {
            const storageHandler = await zendro.models.study.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('studies', {
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
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * down - Drop a table.
     *
     * @param  {object} zendro initialized zendro object which provides the access to different APIs
     * in zendro layers (resolvers, models, adapters) and enables graphql queries.
     */
    down: async (zendro) => {
        try {
            const storageHandler = await zendro.models.study.storageHandler;
            const recordsExists = await zendro.models.study.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of study and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('studies');
        } catch (error) {
            throw new Error(error);
        }
    }
};