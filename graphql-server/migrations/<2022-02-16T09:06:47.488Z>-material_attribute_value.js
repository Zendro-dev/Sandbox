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
     * @param  {object} zendro initialized zendro object
     */
    up: async (zendro) => {
        try {
            const storageHandler = await zendro.models.material_attribute_value.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('material_attribute_values', {
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

                    category_fk: {
                        type: Sequelize[dict['String']]
                    },
                    value: {
                        type: Sequelize[dict['String']]
                    },
                    unit_fk: {
                        type: Sequelize[dict['String']]
                    },
                    source_characteristics_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    material_characteristics_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    sample_characteristics_fk: {
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
     * @param  {object} zendro initialized zendro object
     */
    down: async (zendro) => {
        try {
            const storageHandler = await zendro.models.material_attribute_value.storageHandler;
            const recordsExists = await zendro.models.material_attribute_value.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of material_attribute_value and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('material_attribute_values');
        } catch (error) {
            throw new Error(error);
        }
    }
};