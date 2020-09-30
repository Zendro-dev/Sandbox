'use strict';
const {
    cassandraDriver
} = require('../models/index');
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
    up: async function() {
        let createString = "CREATE TABLE books(book_id text PRIMARY KEY";
        let indexCreationStrings = [];

        createString += ", title text";
        indexCreationStrings.push("title");
        createString += ", author_id text";
        indexCreationStrings.push("author_id");

        createString += ");";

        await cassandraDriver.execute(createString);

        let indexCreationPromises = indexCreationStrings.map(async i =>
            await cassandraDriver.execute('CREATE INDEX IF NOT EXISTS ' + i + '_index ON books (' + i + ');'));

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
        await cassandraDriver.execute('DROP TABLE IF EXISTS books');
    }

};