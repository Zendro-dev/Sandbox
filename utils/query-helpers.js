// helpers
const { range } = require('./array-helpers');

// pg-native
const PgNative = require('pg-native');

// pg-promise
const pgPromise = require('pg-promise');
const pgp       = pgPromise();

// sqlite
const { Database } = require('sqlite3');
const { open }     = require('sqlite');

// globals
const PORTS = range(1,5);


/**
 * Get a map of valid postgres connection objects.
 */
module.exports.getConfigs = () => {

  return PORTS.reduce(

    // reducer function to create connections
    (acc, i) => {

      acc.postgres.push({
        host: 'localhost',
        port: 5000 + i,
        user: 'admin',
        password: 'admin',
        database: 'async_experiment',
      });

      acc.sqlite.push({
        filename: `./database_${i.toString().padStart(2, '0')}.db`,
        driver: Database,
      });

      return acc
    },

    // initial object
    { postgres: [], sqlite: [] }
  )

}

/**
 * Print query execution times to STDOUT.
 * @param {Date} start start date prior to the execution of all queries
 * @param {Promise[]} promises query results
 */
module.exports.logQueryResults = (start, promises) => {

  Promise.all(promises).then(results => {

    console.log(
      `\n/* QUERY RESULTS OF ${promises.length} CONNECTIONS */\n`,
      'Times are measured in milliseconds'
    );
    console.log(results);
    console.log(`FINISHED ALL QUERIES in ${new Date() - start}ms\n`);

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
  await db.any(query).catch(err => {
    console.log(err.message);
    process.exit(err.code);
  });
  const endQuery = new Date();

  return {
    port: connection.port,
    time: (endQuery - startQuery),
  };

}

/**
 * Asynchronously execute a specific query on the given connection.
 * @param {string} query SQL-formatted query
 * @param {object} connection sqlite connection object
 */
module.exports.querySqlite = async (query, connection) => {

  const db = await open(connection);

  const startQuery = new Date();

  await db.all(query);

  const endQuery = new Date();

  return {
    port: connection.filename,
    time: (endQuery - startQuery),
  };

}
