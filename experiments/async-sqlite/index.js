const {
  getConnections,
  logQueryResults,
  querySqlite,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * from random'


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const { sqlite } = getConnections();

const results = sqlite.map(connection => querySqlite(QUERY, connection));


/* LOG QUERY TIMES */

logQueryResults(start, results);
