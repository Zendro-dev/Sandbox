const { SQL: sql }     = require('sql-template-strings')
const { openDatabase } = require('./utils/sqlite-helpers');
const { range }        = require('./utils/array-helpers');

const DB_NUM = parseInt( process.argv[2] );
const DB_SIZE = parseInt( process.argv[3] );


async function seedDb (dbObj, dbId, initStart) {

  console.log(
    `Database ${dbId} has NOT been seeded. Creating and inserting data tables.`
  );

  // Create "random" table
  await dbObj.exec(sql`

    DROP TABLE IF EXISTS random;
    CREATE TABLE random (
      uuid text NOT NULL,
      payload text NOT NULL,
      PRIMARY KEY (uuid)
    );

  `)

  // Seed "random"
  for (let rowIndex = 0; rowIndex < (DB_SIZE || 10000); rowIndex++) {

    const uuid = `db_${dbId}_${rowIndex}`;
    const payload = `random text ${dbId}_${rowIndex}`;

    await dbObj.run(sql`

      INSERT INTO random (uuid, payload)
      VALUES (${uuid},${payload});

    `);

  }

  // Create "flags" table and mark as seeded
  await dbObj.exec(sql`

    CREATE TABLE flags (
      seeded integer DEFAULT 1
    );

    INSERT INTO flags DEFAULT VALUES;

  `)

  console.log(`DB ${dbId} created in ${( new Date() - initStart ) / 1000}s`);
}

async function initDatabase (dbPath, dbId, initStart) {

  const dbObj = await openDatabase(dbPath);

  // Create and seed database as needed
  await dbObj
    .get(sql`

      SELECT seeded from flags;

    `)
    .catch(err => seedDb(dbObj, dbId, initStart));

  return dbObj;
}

async function main () {

  /* DATABASE CREATION / CONNECTION */

  const initStart = new Date();
  const dbPromises = range(0,DB_NUM || 5)
    .map((i) => initDatabase(
      `./db/database_${i.toString().padStart(2, '0')}`, i, initStart
    ));

  const connections = await Promise.all(dbPromises);
  console.log(`TOTAL INIT TIME: ${(new Date() - initStart) / 1000}s`);


  /* DATABASE QUERIES */

  const batchStart = new Date();
  const queries = connections.map(dbObj => {

    return new Promise((resolve, reject) => {

      const queryStart = new Date();
      dbObj
        .all(sql`SELECT * FROM random;`)
        .then(rows => resolve({
          file: dbObj.config.filename,
          count: rows.length,
          time: new Date() - queryStart,
        }))
        .catch(err => reject(err.message));

    })

  });

  /* QUERY RESULTS */

  await Promise
    .all(queries)
    .then(results => results.forEach(res => console.log(res)))
    .catch(err => console.log(err));

  console.log(`TOTAL QUERY TIME: ${new Date() - batchStart}ms`)
}

main();
