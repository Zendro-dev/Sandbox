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
            const storageHandler = await zendro.models.location.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('locations', {
                    locationDbId: {
                        type: Sequelize.STRING,
                        primaryKey: true
                    },

                    createdAt: {
                        type: Sequelize.DATE
                    },

                    updatedAt: {
                        type: Sequelize.DATE
                    },

                    abbreviation: {
                        type: Sequelize[dict['String']]
                    },
                    coordinateDescription: {
                        type: Sequelize[dict['String']]
                    },
                    countryCode: {
                        type: Sequelize[dict['String']]
                    },
                    countryName: {
                        type: Sequelize[dict['String']]
                    },
                    documentationURL: {
                        type: Sequelize[dict['String']]
                    },
                    environmentType: {
                        type: Sequelize[dict['String']]
                    },
                    exposure: {
                        type: Sequelize[dict['String']]
                    },
                    instituteAddress: {
                        type: Sequelize[dict['String']]
                    },
                    instituteName: {
                        type: Sequelize[dict['String']]
                    },
                    locationName: {
                        type: Sequelize[dict['String']]
                    },
                    locationType: {
                        type: Sequelize[dict['String']]
                    },
                    siteStatus: {
                        type: Sequelize[dict['String']]
                    },
                    slope: {
                        type: Sequelize[dict['String']]
                    },
                    topography: {
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
            const storageHandler = await zendro.models.location.storageHandler;
            const recordsExists = await zendro.models.location.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of location and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('locations');
        } catch (error) {
            throw new Error(error);
        }
    }
};