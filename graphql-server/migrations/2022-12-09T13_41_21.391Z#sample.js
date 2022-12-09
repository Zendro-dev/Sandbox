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

            const storageHandler = await zendro.adapters.sample_local.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('samples', {
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

                    value: {
                        type: Sequelize[dict['String']]
                    },
                    plant_structure_development_stage: {
                        type: Sequelize[dict['String']]
                    },
                    plant_anatomical_entity: {
                        type: Sequelize[dict['String']]
                    },
                    description: {
                        type: Sequelize[dict['String']]
                    },
                    collection_date: {
                        type: Sequelize[dict['DateTime']]
                    },
                    external_id: {
                        type: Sequelize[dict['String']]
                    },
                    observation_unit_id: {
                        type: Sequelize[dict['String']]
                    },
                    data_file_ids: {
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

            const storageHandler = await zendro.adapters.sample_local.storageHandler;
            const recordsExists = await zendro.adapters.sample_local.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of sample and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('samples');
        } catch (error) {
            throw new Error(error);
        }
    }
};