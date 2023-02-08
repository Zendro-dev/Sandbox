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
            const storageHandler = await zendro.models.trial.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('trials', {
                    trialDbId: {
                        type: Sequelize.STRING,
                        primaryKey: true
                    },

                    createdAt: {
                        type: Sequelize.DATE
                    },

                    updatedAt: {
                        type: Sequelize.DATE
                    },

                    active: {
                        type: Sequelize[dict['Boolean']]
                    },
                    commonCropName: {
                        type: Sequelize[dict['String']]
                    },
                    documentationURL: {
                        type: Sequelize[dict['String']]
                    },
                    endDate: {
                        type: Sequelize[dict['DateTime']]
                    },
                    startDate: {
                        type: Sequelize[dict['DateTime']]
                    },
                    trialDescription: {
                        type: Sequelize[dict['String']]
                    },
                    trialName: {
                        type: Sequelize[dict['String']]
                    },
                    trialPUI: {
                        type: Sequelize[dict['String']]
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
            const storageHandler = await zendro.models.trial.storageHandler;
            const recordsExists = await zendro.models.trial.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of trial and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('trials');
        } catch (error) {
            throw new Error(error);
        }
    }
};