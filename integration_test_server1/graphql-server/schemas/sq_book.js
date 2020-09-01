module.exports = `
  type sq_book{
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
type Sq_bookConnection{
  edges: [Sq_bookEdge]
  pageInfo: pageInfo!
}

type Sq_bookEdge{
  cursor: String!
  node: sq_book!
}

  type VueTableSq_book{
    data : [sq_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum sq_bookField {
    id
    title
    genre
    ISBN
  }
  input searchSq_bookInput {
    field: sq_bookField
    value: typeValue
    operator: Operator
    search: [searchSq_bookInput]
  }

  input orderSq_bookInput{
    field: sq_bookField
    order: Order
  }



  type Query {
    sq_books(search: searchSq_bookInput, order: [ orderSq_bookInput ], pagination: paginationInput ): [sq_book]
    readOneSq_book(id: ID!): sq_book
    countSq_books(search: searchSq_bookInput ): Int
    vueTableSq_book : VueTableSq_book    csvTableTemplateSq_book: [String]
    sq_booksConnection(search:searchSq_bookInput, order: [ orderSq_bookInput ], pagination: paginationCursorInput ): Sq_bookConnection
  }

  type Mutation {
    addSq_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): sq_book!
    updateSq_book(id: ID!, title: String, genre: String, ISBN: String    , skipAssociationsExistenceChecks:Boolean = false): sq_book!
    deleteSq_book(id: ID!): String!
    bulkAddSq_bookCsv: String!
      }
`;