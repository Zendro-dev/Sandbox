module.exports = `

  enum InputType{
    Array
    String
    Int
    Float
    Boolean
    Date
    Time
    DateTime
  }

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

  enum Order{
    DESC
    ASC
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

  type pageInfo{
    startCursor: String
    endCursor: String
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  scalar Date
  scalar Time
  scalar DateTime
`;