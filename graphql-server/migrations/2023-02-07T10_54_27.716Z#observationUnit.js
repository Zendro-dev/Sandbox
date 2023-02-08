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
            const storageHandler = await zendro.models.observationUnit.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('observationUnits', {
                    observationUnitDbId: {
                        type: Sequelize.STRING,
                        primaryKey: true
                    },

                    createdAt: {
                        type: Sequelize.DATE
                    },

                    updatedAt: {
                        type: Sequelize.DATE
                    },

                    observationLevel: {
                        type: Sequelize[dict['String']]
                    },
                    observationUnitName: {
                        type: Sequelize[dict['String']]
                    },
                    observationUnitPUI: {
                        type: Sequelize[dict['String']]
                    },
                    plantNumber: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmDbId: {
                        type: Sequelize[dict['String']]
                    },
                    locationDbId: {
                        type: Sequelize[dict['String']]
                    },
                    studyDbId: {
                        type: Sequelize[dict['String']]
                    },
                    trialDbId: {
                        type: Sequelize[dict['String']]
                    },
                    eventDbIds: {
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
            const storageHandler = await zendro.models.observationUnit.storageHandler;
            const recordsExists = await zendro.models.observationUnit.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of observationUnit and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('observationUnits');
        } catch (error) {
            throw new Error(error);
        }
    }
};