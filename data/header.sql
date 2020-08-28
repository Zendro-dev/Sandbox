DROP TABLE IF EXISTS random;

CREATE TABLE random (
  id text NOT NULL,
  payload text NOT NULL,
  PRIMARY KEY (id)
);

COPY random (id, payload) FROM stdin;
