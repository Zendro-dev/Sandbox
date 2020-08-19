const express = require('express');

const PORT = process.env.PORT;
const SHARD = process.env.SHARD;
const app = express();

app.get('/', (req, res) => {

  setTimeout( () => {

    res.send({
      response: `Shard ${SHARD}`,
      cargo: `Lorem ipsum ${SHARD}`,
    });

  },
    3000
  )

})

app.listen(PORT, () => console.log(`Shard ${SHARD} listening on PORT ${PORT}`));