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
        return queryInterface.createTable('grupo_enfoques', {

            grupo_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            tipo_grupo: {
                type: Sequelize[dict['String']]
            },
            numero_participantes: {
                type: Sequelize[dict['Int']]
            },
            fecha: {
                type: Sequelize[dict['Date']]
            },
            lista_especies: {
                type: Sequelize[dict['String']]
            },
            foto_produccion: {
                type: Sequelize[dict['String']]
            },
            foto_autoconsumo: {
                type: Sequelize[dict['String']]
            },
            foto_venta: {
                type: Sequelize[dict['String']]
            },
            foto_compra: {
                type: Sequelize[dict['String']]
            },
            observaciones: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante1: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante2: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante3: {
                type: Sequelize[dict['String']]
            },
            justificacion_produccion_cuadrante4: {
                type: Sequelize[dict['String']]
            },
            sitio_id: {
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
        return queryInterface.dropTable('grupo_enfoques');
    }

};