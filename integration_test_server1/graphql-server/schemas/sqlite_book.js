module.exports = `
  type sqlite_book{
    """
    @original-field
    """
    id_book: ID
    """
    @original-field
    
    """
    title: String

    """
    @original-field
    
    """
    genre: String

    """
    @original-field
    
    """
    ISBN: String

      
    }
type Sqlite_bookConnection{
  edges: [Sqlite_bookEdge]
  pageInfo: pageInfo!
}

type Sqlite_bookEdge{
  cursor: String!
  node: sqlite_book!
}

  type VueTableSqlite_book{
    data : [sqlite_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sqlite_bookField {
    id_book
    title
    genre
    ISBN
  }
  input searchSqlite_bookInput {
    field: sqlite_bookField
    value: typeValue
    operator: Operator
    search: [searchSqlite_bookInput]
  }

  input orderSqlite_bookInput{
    field: sqlite_bookField
    order: Order
  }



  type Query {
    sqlite_books(search: searchSqlite_bookInput, order: [ orderSqlite_bookInput ], pagination: paginationInput ): [sqlite_book]
    readOneSqlite_book(id_book: ID!): sqlite_book
    countSqlite_books(search: searchSqlite_bookInput ): Int
    vueTableSqlite_book : VueTableSqlite_book    csvTableTemplateSqlite_book: [String]
    sqlite_booksConnection(search:searchSqlite_bookInput, order: [ orderSqlite_bookInput ], pagination: paginationCursorInput ): Sqlite_bookConnection
  }

  type Mutation {
    addSqlite_book(id_book: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): sqlite_book!
    updateSqlite_book(id_book: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): sqlite_book!
    deleteSqlite_book(id_book: ID!): String!
    bulkAddSqlite_bookCsv: String!
      }
`;