module.exports = `

  enum Operator{
    like
    notLike
    or
    and
    eq
    between
    notBetween
    in
    notIn
    gt
    gte
    lt
    lte
    ne
    regexp
    notRegexp
  }

  enum CassandraOperator{
    eq
    lt
    gt
    le
    ge
    ne
    _in
    cont   # CONTAINS
    ctk    # CONTAINS KEY
    tlt    # Token < Token
    tgt    # Token > Token
    and
  }

  enum Order{
    DESC
    ASC
  }

  input typeValue{
    type: String
    value: String!
  }

  input paginationInput{
    limit: Int
    offset: Int
  }

  input paginationCursorInput{
    first: Int
    last: Int
    after: String
    before: String
    includeCursor: Boolean
  }

  input paginationCursorCassandraInput{
    first: Int!     # first = last in the Cassandra case
    after: String
  }

  type pageInfo{
    startCursor: String
    endCursor: String
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type pageCassandraInfo{
    endCursor: String
    hasNextPage: Boolean!
  }

  scalar Date
  scalar Time
  scalar DateTime
`;