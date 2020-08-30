const {
  getPostgresConnections,
  queryPgPromise,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * from random'


/* EXECUTE ASYNC QUERIES */

const startAll = new Date();

const conns = getPostgresConnections();
const results = conns.map(
  connection => queryPgPromise(QUERY, connection)
);


/* LOG QUERY TIMES */

Promise
  .all(results).then(results => {

    console.log(
      `\n/* PG-PROMISE RESULTS OVER ${conns.length} POSTGRES CONNECTIONS */\n`,
      '\nTimes are measured in milliseconds'
    );
    console.log(results);
    console.log(`FINISHED ALL QUERIES in ${new Date() - startAll}ms`);

  })
  .catch(console.err);