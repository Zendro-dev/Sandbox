const {
  getConnections,
  logQueryResults,
  queryPgNative,
} = require('../../utils/query-helpers');


/* GLOBAL QUERY */

const QUERY = 'SELECT * FROM random';


/* EXECUTE ASYNC QUERIES */

const start = new Date();

const { postgres } = getConnections();

const results = postgres.map( connection =>
  queryPgNative(QUERY, connection).catch(err => {
    console.log(err.message);
    process.exit(err.code);
  })
);

/* LOG QUERY TIMES */

logQueryResults(start, results);
