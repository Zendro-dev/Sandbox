module.exports = `
  type mysql_book{
    """
    @original-field
    """
    id: ID
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
type Mysql_bookConnection{
  edges: [Mysql_bookEdge]
  pageInfo: pageInfo!
}

type Mysql_bookEdge{
  cursor: String!
  node: mysql_book!
}

  type VueTableMysql_book{
    data : [mysql_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum mysql_bookField {
    id
    title
    genre
    ISBN
  }
  input searchMysql_bookInput {
    field: mysql_bookField
    value: typeValue
    operator: Operator
    search: [searchMysql_bookInput]
  }

  input orderMysql_bookInput{
    field: mysql_bookField
    order: Order
  }



  type Query {
    mysql_books(search: searchMysql_bookInput, order: [ orderMysql_bookInput ], pagination: paginationInput ): [mysql_book]
    readOneMysql_book(id: ID!): mysql_book
    countMysql_books(search: searchMysql_bookInput ): Int
    vueTableMysql_book : VueTableMysql_book    csvTableTemplateMysql_book: [String]
    mysql_booksConnection(search:searchMysql_bookInput, order: [ orderMysql_bookInput ], pagination: paginationCursorInput ): Mysql_bookConnection
  }

  type Mutation {
    addMysql_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): mysql_book!
    updateMysql_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): mysql_book!
    deleteMysql_book(id: ID!): String!
    bulkAddMysql_bookCsv: String!
      }
`;