const {
  getConfigs,
  logQueryResults,
  querySqlite,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * from random'


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const { sqlite } = getConfigs();

const results = sqlite.map(config => querySqlite(QUERY, config));


/* LOG QUERY TIMES */

logQueryResults(start, results);
