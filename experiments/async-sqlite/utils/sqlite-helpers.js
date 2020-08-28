const { Database } = require('sqlite3');
const { open }     = require('sqlite');


/**
 * Opens or creates a database.
 * @param {string} dbPath relative or absolute path to the database
 */
exports.openDatabase = async (dbPath) => await open({
  filename: dbPath,
  driver: Database
})
