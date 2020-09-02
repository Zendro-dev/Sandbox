const {
  getConfigs,
  logQueryResults,
  queryPgNative,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * FROM random';


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const { postgres } = getConfigs();

const results = postgres.map(config => queryPgNative(QUERY, config)
  .catch(err => {
    console.log(err.message);
    process.exit(err.code);
  })
);

/* LOG QUERY TIMES */

logQueryResults(start, results);
