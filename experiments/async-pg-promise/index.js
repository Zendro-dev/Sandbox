const {
  getConnections,
  logQueryResults,
  queryPgPromise,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * from random'


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const conns = getConnections().postgres;
const results = conns.map(connection => queryPgPromise(QUERY, connection));


/* LOG QUERY TIMES */

logQueryResults(start, results);
