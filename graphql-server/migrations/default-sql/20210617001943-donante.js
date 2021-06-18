'use strict';
const dict = require('../../utils/graphql-sequelize-types');

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
        return queryInterface.createTable('donantes', {

            donante_id: {
                type: Sequelize[dict['Int']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            NombreDonanteInformante: {
                type: Sequelize[dict['String']]
            },
            GeneroDonanteInformante: {
                type: Sequelize[dict['String']]
            },
            EdadDonanteInformante: {
                type: Sequelize[dict['Int']]
            },
            ActividadDonanteInformante: {
                type: Sequelize[dict['String']]
            },
            GrupoEtnicoDonanteInformante: {
                type: Sequelize[dict['String']]
            },
            LenguaDonanteInformante: {
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
        return queryInterface.dropTable('donantes');
    }

};