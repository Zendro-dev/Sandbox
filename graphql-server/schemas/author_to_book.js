module.exports = `
  type author_to_book{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    author_id: String

    """
    @original-field
    
    """
    book_id: String

      
    }
type Author_to_bookConnection{
  edges: [Author_to_bookEdge]
  author_to_books: [author_to_book]
  pageInfo: pageInfo!
}

type Author_to_bookEdge{
  cursor: String!
  node: author_to_book!
}

  type VueTableAuthor_to_book{
    data : [author_to_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum author_to_bookField {
    id
    author_id
    book_id
  }
  input searchAuthor_to_bookInput {
    field: author_to_bookField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchAuthor_to_bookInput]
  }

  input orderAuthor_to_bookInput{
    field: author_to_bookField
    order: Order
  }



  type Query {
    author_to_books(search: searchAuthor_to_bookInput, order: [ orderAuthor_to_bookInput ], pagination: paginationInput! ): [author_to_book]
    readOneAuthor_to_book(id: ID!): author_to_book
    countAuthor_to_books(search: searchAuthor_to_bookInput ): Int
    vueTableAuthor_to_book : VueTableAuthor_to_book
    csvTableTemplateAuthor_to_book: [String]
    author_to_booksConnection(search:searchAuthor_to_bookInput, order: [ orderAuthor_to_bookInput ], pagination: paginationCursorInput! ): Author_to_bookConnection
  }

  type Mutation {
    addAuthor_to_book( author_id: String, book_id: String    , skipAssociationsExistenceChecks:Boolean = false): author_to_book!
    updateAuthor_to_book(id: ID!, author_id: String, book_id: String    , skipAssociationsExistenceChecks:Boolean = false): author_to_book!
    deleteAuthor_to_book(id: ID!): String!
    bulkAddAuthor_to_bookCsv: String!
      }
`;