'use strict';
const {
    getConnectionInstances
} = require('../../connection');

/**
 * @module - Migrations to create and to undo a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @return {promise}                Resolved if the table was created successfully, rejected otherwise.
     */
    up: async function() {
        // get the default cassandra client
        const connectionInstances = await getConnectionInstances();
        const cassandraClient = connectionInstances.get("default-cassandra").connection;
        let createString = 'CREATE TABLE "cities"(city_id text PRIMARY KEY';
        let indexCreationStrings = [];

        createString += ', "name" text';
        indexCreationStrings.push("name");
        createString += ', "intArr" list <int>';
        indexCreationStrings.push("intArr");
        createString += ', "strArr" list <text>';
        indexCreationStrings.push("strArr");
        createString += ', "floatArr" list <Float>';
        indexCreationStrings.push("floatArr");
        createString += ', "boolArr" list <Boolean>';
        indexCreationStrings.push("boolArr");
        createString += ', "dateTimeArr" list <timestamp>';
        indexCreationStrings.push("dateTimeArr");
        createString += ', "river_ids" set <text>';
        indexCreationStrings.push("river_ids");
        createString += ', "country_id" text';
        indexCreationStrings.push("country_id");
        createString += ");";

        await cassandraClient.execute(createString);

        let indexCreationPromises = indexCreationStrings.map(async i =>
            await cassandraClient.execute('CREATE INDEX IF NOT EXISTS cities_' + i + '_index ON cities (' + i + ');'));

        await Promise.allSettled(indexCreationPromises);

    },

    /**
     * down - Deletes a table.
     *
     * @param  {object} queryInterface Used to modify the table in the database.
     * @param  {object} Sequelize      Sequelize instance with data types included
     * @return {promise}                Resolved if the table was deleted successfully, rejected otherwise.
     */
    down: async function() {
        // get the default cassandra client
        const connectionInstances = await getConnectionInstances();
        const cassandraClient = connectionInstances.get("default-cassandra").connection;
        await cassandraClient.execute('DROP TABLE IF EXISTS cities');
    }

};