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
            const storageHandler = await zendro.models.biological_material.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('biological_materials', {
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
            const storageHandler = await zendro.models.biological_material.storageHandler;
            const recordsExists = await zendro.models.biological_material.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of biological_material and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('biological_materials');
        } catch (error) {
            throw new Error(error);
        }
    }
};