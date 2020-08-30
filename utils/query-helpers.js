/* GLOBALS */

const pgPromise = require('pg-promise');
const pgp = pgPromise();

const { range } = require('./array-helpers');

const PORTS = range(1,5);


/**
 * Get a map of valid postgres connection objects.
 */
module.exports.getPostgresConnections = () => {

  return PORTS.map(i => ({
    host: 'localhost',
    port: 5000 + i,
    user: 'admin',
    password: 'admin',
    database: 'async_experiment',
  }));

}

/**
 * Asynchronously execute a specific query on the given connection.
 * @param {string} query SQL-formatted query
 * @param {object} connection postgres connection object
 */
module.exports.queryPgPromise = async (query, connection) => {

  const db = pgp(connection);

  const startQuery = new Date();
  await db.any(query).catch(err => console.log(err));
  const endQuery = new Date();

  return {
    port: connection.port,
    time: (endQuery - startQuery),
  };

}
