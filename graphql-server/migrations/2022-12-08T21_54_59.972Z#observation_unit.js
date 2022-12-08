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
            const storageHandler = await zendro.models.observation_unit.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('observation_units', {
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

                    type: {
                        type: Sequelize[dict['String']]
                    },
                    external_id: {
                        type: Sequelize[dict['String']]
                    },
                    spatial_distribution: {
                        type: Sequelize[dict['String']]
                    },
                    study_id: {
                        type: Sequelize[dict['String']]
                    },
                    biological_material_ids: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    data_file_ids: {
                        type: Sequelize[dict['[Int]']],
                        defaultValue: '[]'
                    },
                    event_ids: {
                        type: Sequelize[dict['[Int]']],
                        defaultValue: '[]'
                    },
                    factor_ids: {
                        type: Sequelize[dict['[Int]']],
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
            const storageHandler = await zendro.models.observation_unit.storageHandler;
            const recordsExists = await zendro.models.observation_unit.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of observation_unit and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('observation_units');
        } catch (error) {
            throw new Error(error);
        }
    }
};