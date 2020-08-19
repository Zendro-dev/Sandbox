# Work Notes: SQLite Async Experiment

## Design

### Objective

Test whether the SQLite implementation in NodeJS executes queries in parallel.

### Approach

Use the packages `sqlite3` (driver) and `sqlite` (async API) to create databases, stablish connections, and execute queries.

The program flow can be summarized in the following code-block (pseudo-code):

```js

async main () {

    /* 01. An arbitrary number of databases are asynchronously created and seeded */

    // TIME-POINT: initialization start time-point is recorded here
    // TIME-POINT: individual database creation duration is resolved inside each promise
    initDatabases();

    // TIME-POINT: initialization duration is resolved here


    /* 02. Databases are asynchronously queried using the Promises API */

    // TIME-POINT: batch query start is recorded here
    // TIME-PONT: individual query duration is resolved inside each promise
    queryDatabases();

    /* 03. Individual query results are processed and logged */

    processResults();

    // TIME-POINT: total query time is resolved and logged here
}
```

Four distinct time intervals are measured:

```
INDIVIDUAL DB CREATION
TOTAL INITIALIZATION
INDIVIDUAL QUERY
TOTAL QUERY
```

### Results

Initial results indicate both asynchronous initialization and queries are run in parallel.

### Considerations

- Database initialization and query runs asynchronously, but only SQLite delegated processes are run in parallel. This is especially evident when seeding the database from memory, as a large amount of NodeJS calls are required.
- Using a higher level API, such as `knex`, should be preferred to ease and standardize query building.

## Reproduce

The experiment can be executed using NodeJS (tested on `14.8.0`).

```bash
node index.js [DB_NUM=5] [DB_SIZE=10000]
```

Optional parameters:

`DB_NUM`: the number of databases to dynamically create and query.
`DB_SIZE`: the number of rows to insert in each database.

For faster testing of database creation time-points, a lower number of rows `DB_SIZE` is recommended.

## To-Do

- [x] Execute the raw `sqlite3` + `sqlite` query performance experiment.
- [x] Create function to dynamically create multiple databases.
- [x] Create functions to initialize and seed the database.

## Work-log

### 19.08.2020

- Implement and execute the raw `sqlite3` + `sqlite` experiment.
