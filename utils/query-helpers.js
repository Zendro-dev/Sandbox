/* GLOBALS */

const pgPromise = require('pg-promise');
const pgp = pgPromise();

const { range } = require('./array-helpers');

const PORTS = range(1,5);



module.exports.getPostgresConnections = () => {

  return PORTS.map(i => ({
    host: 'localhost',
    port: 5000 + i,
    user: 'admin',
    password: 'admin',
    database: 'async_experiment',
  }));

}

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
