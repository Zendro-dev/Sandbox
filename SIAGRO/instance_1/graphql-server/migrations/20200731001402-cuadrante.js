'use strict';
const dict = require('../utils/graphql-sequelize-types');

/**
 * @module - Migrations to create and to undo a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was created successfully, rejected otherwise.
     */
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('cuadrantes', {

            cuadrante_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            produccion_valor: {
                type: Sequelize[dict['Int']]
            },
            produccion_etiqueta: {
                type: Sequelize[dict['String']]
            },
            autoconsumo_valor: {
                type: Sequelize[dict['Int']]
            },
            autoconsumo_etiqueta: {
                type: Sequelize[dict['String']]
            },
            compra_valor: {
                type: Sequelize[dict['Int']]
            },
            compra_etiqueta: {
                type: Sequelize[dict['String']]
            },
            venta_valor: {
                type: Sequelize[dict['Int']]
            },
            venta_etiqueta: {
                type: Sequelize[dict['String']]
            },
            nombre_comun_grupo_enfoque: {
                type: Sequelize[dict['String']]
            },
            grupo_enfoque_id: {
                type: Sequelize[dict['String']]
            },
            taxon_id: {
                type: Sequelize[dict['String']]
            },
            tipo_planta_id: {
                type: Sequelize[dict['String']]
            }

        });
    },

    /**
     * down - Deletes a table.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was deleted successfully, rejected otherwise.
     */
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('cuadrantes');
    }

};