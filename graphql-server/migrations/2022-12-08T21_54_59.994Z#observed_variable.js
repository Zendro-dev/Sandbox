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
            const storageHandler = await zendro.models.observed_variable.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('observed_variables', {
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

                    name: {
                        type: Sequelize[dict['String']]
                    },
                    accession_number: {
                        type: Sequelize[dict['String']]
                    },
                    trait: {
                        type: Sequelize[dict['String']]
                    },
                    trait_accession_number: {
                        type: Sequelize[dict['String']]
                    },
                    method: {
                        type: Sequelize[dict['String']]
                    },
                    method_accession_number: {
                        type: Sequelize[dict['String']]
                    },
                    method_description: {
                        type: Sequelize[dict['String']]
                    },
                    scale: {
                        type: Sequelize[dict['String']]
                    },
                    scale_accession_number: {
                        type: Sequelize[dict['String']]
                    },
                    time_scale: {
                        type: Sequelize[dict['String']]
                    },
                    study_ids: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    data_file_ids: {
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
            const storageHandler = await zendro.models.observed_variable.storageHandler;
            const recordsExists = await zendro.models.observed_variable.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of observed_variable and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('observed_variables');
        } catch (error) {
            throw new Error(error);
        }
    }
};