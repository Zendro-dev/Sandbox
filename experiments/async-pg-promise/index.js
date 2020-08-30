const pgPromise = require('pg-promise');
const { range } = require('../../utils/array-helpers');

// Initialize pg-promise library
const pgp = pgPromise();

// Global query
const QUERY = 'SELECT * from random'
const PORTS = range(1,5).map(i => 5000 + i)

/**
 * Asynchronously executes a specific query on the given connection.
 * @param {string} query SQL-formatted query
 * @param {object} connection pg-promise connection object
 * @returns a string with the queried port and executiontime
 */
async function executeQuery(query, connection) {

  const db = pgp(connection)

  const startQuery = new Date();
  await db.any(query).catch(err => console.log(err));
  const endQuery = new Date();

  return {
    port: connection.port,
    time: (endQuery - startQuery),
  }

}


/* EXECUTE ASYNC QUERIES */

const startAll = new Date();

const promises = PORTS.map(port => {

  const connection = {
      host: 'localhost',
      port,
      user: 'admin',
      password: 'admin',
      database: 'async_experiment',
  };

  return executeQuery(QUERY, connection);

})


/* LOG QUERY TIMES */

Promise
  .all(promises).then(results => {

    console.log(
      `\n/* PG-PROMISE RESULTS OVER ${PORTS.length} POSTGRES CONNECTIONS */\n`,
      '\nTimes are measured in milliseconds'
    );
    console.log(results);
    console.log(`FINISHED ALL QUERIES in ${new Date() - startAll}ms`);

  })
  .catch(console.err);