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
        return queryInterface.createTable('registro_siagros', {

            siagro_id: {
                type: Sequelize.STRING,
                primaryKey: true
            },

            createdAt: {
                type: Sequelize.DATE
            },

            updatedAt: {
                type: Sequelize.DATE
            },

            IndividuosCopias: {
                type: Sequelize[dict['Int']]
            },
            TipoPreparacion: {
                type: Sequelize[dict['String']]
            },
            FuenteColectaObservacion: {
                type: Sequelize[dict['String']]
            },
            Habitat: {
                type: Sequelize[dict['String']]
            },
            EstatusEcologico: {
                type: Sequelize[dict['String']]
            },
            PlantaManejada: {
                type: Sequelize[dict['String']]
            },
            MaterialColectado: {
                type: Sequelize[dict['String']]
            },
            FormaVida: {
                type: Sequelize[dict['String']]
            },
            FormaCrecimiento: {
                type: Sequelize[dict['String']]
            },
            Sexo: {
                type: Sequelize[dict['String']]
            },
            Fenologia: {
                type: Sequelize[dict['String']]
            },
            AlturaEjemplar: {
                type: Sequelize[dict['Float']]
            },
            Abundancia: {
                type: Sequelize[dict['String']]
            },
            OtrasObservacionesEjemplar: {
                type: Sequelize[dict['String']]
            },
            Uso: {
                type: Sequelize[dict['String']]
            },
            ParteUtilizada: {
                type: Sequelize[dict['String']]
            },
            LenguaNombreComun: {
                type: Sequelize[dict['String']]
            },
            NombreComun: {
                type: Sequelize[dict['String']]
            },
            InstitucionRespaldaObservacion: {
                type: Sequelize[dict['String']]
            },
            TipoVegetacion: {
                type: Sequelize[dict['String']]
            },
            AutorizacionInformacion: {
                type: Sequelize[dict['String']]
            },
            donante_id: {
                type: Sequelize[dict['Int']]
            },
            proyecto_id: {
                type: Sequelize[dict['String']]
            },
            snib_id: {
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
        return queryInterface.dropTable('registro_siagros');
    }

};