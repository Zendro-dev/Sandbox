module.exports = `
  type sqlite_author{
    """
    @original-field
    """
    id_author: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    lastname: String

    """
    @original-field
    
    """
    email: String

      
    }
type Sqlite_authorConnection{
  edges: [Sqlite_authorEdge]
  pageInfo: pageInfo!
}

type Sqlite_authorEdge{
  cursor: String!
  node: sqlite_author!
}

  type VueTableSqlite_author{
    data : [sqlite_author]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sqlite_authorField {
    id_author
    name
    lastname
    email
  }
  input searchSqlite_authorInput {
    field: sqlite_authorField
    value: typeValue
    operator: Operator
    search: [searchSqlite_authorInput]
  }

  input orderSqlite_authorInput{
    field: sqlite_authorField
    order: Order
  }



  type Query {
    sqlite_authors(search: searchSqlite_authorInput, order: [ orderSqlite_authorInput ], pagination: paginationInput ): [sqlite_author]
    readOneSqlite_author(id_author: ID!): sqlite_author
    countSqlite_authors(search: searchSqlite_authorInput ): Int
    vueTableSqlite_author : VueTableSqlite_author    csvTableTemplateSqlite_author: [String]
    sqlite_authorsConnection(search:searchSqlite_authorInput, order: [ orderSqlite_authorInput ], pagination: paginationCursorInput ): Sqlite_authorConnection
  }

  type Mutation {
    addSqlite_author(id_author: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): sqlite_author!
    updateSqlite_author(id_author: ID!, name: String, lastname: String, email: String    , skipAssociationsExistenceChecks:Boolean = false): sqlite_author!
    deleteSqlite_author(id_author: ID!): String!
    bulkAddSqlite_authorCsv: String!
      }
`;