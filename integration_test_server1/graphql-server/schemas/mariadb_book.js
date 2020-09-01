module.exports = `
  type mariadb_book{
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
type Mariadb_bookConnection{
  edges: [Mariadb_bookEdge]
  pageInfo: pageInfo!
}

type Mariadb_bookEdge{
  cursor: String!
  node: mariadb_book!
}

  type VueTableMariadb_book{
    data : [mariadb_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum mariadb_bookField {
    id
    title
    genre
    ISBN
  }
  input searchMariadb_bookInput {
    field: mariadb_bookField
    value: typeValue
    operator: Operator
    search: [searchMariadb_bookInput]
  }

  input orderMariadb_bookInput{
    field: mariadb_bookField
    order: Order
  }



  type Query {
    mariadb_books(search: searchMariadb_bookInput, order: [ orderMariadb_bookInput ], pagination: paginationInput ): [mariadb_book]
    readOneMariadb_book(id: ID!): mariadb_book
    countMariadb_books(search: searchMariadb_bookInput ): Int
    vueTableMariadb_book : VueTableMariadb_book    csvTableTemplateMariadb_book: [String]
    mariadb_booksConnection(search:searchMariadb_bookInput, order: [ orderMariadb_bookInput ], pagination: paginationCursorInput ): Mariadb_bookConnection
  }

  type Mutation {
    addMariadb_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): mariadb_book!
    updateMariadb_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): mariadb_book!
    deleteMariadb_book(id: ID!): String!
    bulkAddMariadb_bookCsv: String!
      }
`;