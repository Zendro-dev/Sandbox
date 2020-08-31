DROP TABLE IF EXISTS random;

CREATE TABLE random (
  id text NOT NULL,
  payload text NOT NULL,
  PRIMARY KEY (id)
);

.mode tabs
.import table.txt random
