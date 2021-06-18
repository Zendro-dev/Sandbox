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
        return queryInterface.createTable('manejos', {

            manejo_id: {
                type: Sequelize[dict['Int']],
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            TipoManejo: {
                type: Sequelize[dict['String']]
            },
            TipoAgroecosistema: {
                type: Sequelize[dict['String']]
            },
            DescripcionAgroecosistema: {
                type: Sequelize[dict['String']]
            },
            SindromeDomesticacion: {
                type: Sequelize[dict['String']]
            },
            TenenciaTierra: {
                type: Sequelize[dict['String']]
            },
            TipoMaterialProduccion: {
                type: Sequelize[dict['String']]
            },
            OrigenMaterial: {
                type: Sequelize[dict['String']]
            },
            DestinoProduccion: {
                type: Sequelize[dict['String']]
            },
            MesSiembra: {
                type: Sequelize[dict['String']]
            },
            MesFloracion: {
                type: Sequelize[dict['String']]
            },
            MesFructificacion: {
                type: Sequelize[dict['String']]
            },
            MesCosecha: {
                type: Sequelize[dict['String']]
            },
            SistemaCultivo: {
                type: Sequelize[dict['String']]
            },
            CultivosAsociados: {
                type: Sequelize[dict['String']]
            },
            UnidadesSuperficieProduccion: {
                type: Sequelize[dict['String']]
            },
            SuperficieProduccion: {
                type: Sequelize[dict['Float']]
            },
            UnidadesRendimiento: {
                type: Sequelize[dict['String']]
            },
            Rendimiento: {
                type: Sequelize[dict['Float']]
            },
            TipoRiego: {
                type: Sequelize[dict['String']]
            },
            CaracteristicaResistenciaTolerancia: {
                type: Sequelize[dict['String']]
            },
            CaracteristicaSusceptible: {
                type: Sequelize[dict['String']]
            },
            registro_id: {
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
        return queryInterface.dropTable('manejos');
    }

};