const {
  getConfigs,
  logQueryResults,
  queryPgPromise,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * from random'


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const { postgres } = getConfigs();
const results = postgres.map(config => queryPgPromise(QUERY, config));


/* LOG QUERY TIMES */

logQueryResults(start, results);
