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
        return queryInterface.createTable('sitios', {

            sitio_id: {
                type: Sequelize[dict['String']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            pais: {
                type: Sequelize[dict['String']]
            },
            estado: {
                type: Sequelize[dict['String']]
            },
            clave_estado: {
                type: Sequelize[dict['String']]
            },
            municipio: {
                type: Sequelize[dict['String']]
            },
            clave_municipio: {
                type: Sequelize[dict['String']]
            },
            localidad: {
                type: Sequelize[dict['String']]
            },
            clave_localidad: {
                type: Sequelize[dict['String']]
            },
            latitud: {
                type: Sequelize[dict['Float']]
            },
            longitud: {
                type: Sequelize[dict['Float']]
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
        return queryInterface.dropTable('sitios');
    }

};