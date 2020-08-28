const express = require('express');
const http = require('http');

/**
 * Create a new number range.
 * @param {number} start Number where the range should start
 * @param {number} length Amount of numbers to create (sign determines direction)
 */
function range (start, length) {
  const sign = Math.sign(length);
  return Array.from({ length: Math.abs(length) }, (_, i) => start + (i * sign));
}

const REQ_PORTS = range(1,10).map(value => ({
  shard: value.toString().padStart(2, '0'),
  port: 3000 + value,
}))

const app = express();

app.get('/', async (req, res) => {

  const queryStart = new Date();
  const promises = REQ_PORTS.map(({shard, port}) => {

    return new Promise( (resolve, reject) => {

      http.get(`http://shard_${shard}:${port}/`, shardRes => {

        shardRes.setEncoding("utf8");

        shardRes.on('data', data => resolve(
          JSON.parse(data)
        ));

        shardRes.on('error', (err) => reject({
          error: err.message
        }))

      });

    })

  })


  await Promise.all(promises).then(data => {

    console.log(data);
    res.send(data);

  })
  console.log(`TOTAL TIME: ${new Date() - queryStart}ms`)

})

app.listen(3000, () => console.log(`Main server listening on PORT 3000`))
