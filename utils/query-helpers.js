/* GLOBALS */

const PgNative = require('pg-native');

const pgPromise = require('pg-promise');
const pgp = pgPromise();

const { range } = require('./array-helpers');

const PORTS = range(1,5);


/**
 * Get a map of valid postgres connection objects.
 */
module.exports.getConnections = () => {

  const postgres = PORTS.map(i => ({
    host: 'localhost',
    port: 5000 + i,
    user: 'admin',
    password: 'admin',
    database: 'async_experiment',
  }));

  return {
    postgres,
  };

}


/**
 * Print query execution times to STDOUT.
 * @param {Date} start start date prior to the execution of all queries
 * @param {Promise[]} promises query results
 */
module.exports.logQueryResults = (start, promises) => {

  Promise.all(promises).then(results => {

    console.log(
      `\n/* PG-PROMISE RESULTS OVER ${promises.length} POSTGRES CONNECTIONS */\n`,
      '\nTimes are measured in milliseconds'
    );
    console.log(results);
    console.log(`FINISHED ALL QUERIES in ${new Date() - start}ms`);

  }).catch(console.err);
}

/**
 * Asynchronously execute a specific query on the given connection.
 * @param {string} query SQL-formatted query
 * @param {object} connection postgres connection object
 */
module.exports.queryPgNative = async(query, connection) => {

  const client = new PgNative();
  const { user, password, host, port, database } = connection;

  return new Promise((resolve, reject) => {

    client.connect(
      `postgresql://${user}:${password}@${host}:${port}/${database}`,
      (err) => {

        if (err) reject(err);

        const startQuery = new Date();
        client.query(query, (err, rows) => {

          if (err) reject(err);

          client.end();
          const endQuery = new Date();

          resolve({
            port,
            time: (endQuery - startQuery),
          })

        })

      })
  })
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
