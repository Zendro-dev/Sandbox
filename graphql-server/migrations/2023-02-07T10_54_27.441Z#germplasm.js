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
            const storageHandler = await zendro.models.germplasm.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('germplasms', {
                    germplasmDbId: {
                        type: Sequelize.STRING,
                        primaryKey: true
                    },

                    createdAt: {
                        type: Sequelize.DATE
                    },

                    updatedAt: {
                        type: Sequelize.DATE
                    },

                    accessionNumber: {
                        type: Sequelize[dict['String']]
                    },
                    acquisitionDate: {
                        type: Sequelize[dict['Date']]
                    },
                    breedingMethodDbId: {
                        type: Sequelize[dict['String']]
                    },
                    commonCropName: {
                        type: Sequelize[dict['String']]
                    },
                    countryOfOriginCode: {
                        type: Sequelize[dict['String']]
                    },
                    defaultDisplayName: {
                        type: Sequelize[dict['String']]
                    },
                    documentationURL: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmGenus: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmName: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmPUI: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmPreprocessing: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmSpecies: {
                        type: Sequelize[dict['String']]
                    },
                    germplasmSubtaxa: {
                        type: Sequelize[dict['String']]
                    },
                    instituteCode: {
                        type: Sequelize[dict['String']]
                    },
                    instituteName: {
                        type: Sequelize[dict['String']]
                    },
                    pedigree: {
                        type: Sequelize[dict['String']]
                    },
                    seedSource: {
                        type: Sequelize[dict['String']]
                    },
                    seedSourceDescription: {
                        type: Sequelize[dict['String']]
                    },
                    speciesAuthority: {
                        type: Sequelize[dict['String']]
                    },
                    subtaxaAuthority: {
                        type: Sequelize[dict['String']]
                    },
                    xref: {
                        type: Sequelize[dict['String']]
                    },
                    biologicalStatusOfAccessionCode: {
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
            const storageHandler = await zendro.models.germplasm.storageHandler;
            const recordsExists = await zendro.models.germplasm.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of germplasm and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('germplasms');
        } catch (error) {
            throw new Error(error);
        }
    }
};