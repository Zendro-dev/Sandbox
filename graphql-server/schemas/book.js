module.exports = `
  type book{
    """
    @original-field
    """
    book_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    fk_books_authors: String

    authors(search: searchAuthorInput): author
    
    }
type BookConnection{
  edges: [BookEdge]
  pageInfo: pageInfo!
}

type BookEdge{
  cursor: String!
  node: book!
}

  type VueTableBook{
    data : [book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum bookField {
    book_id
    name
    fk_books_authors
  }
  input searchBookInput {
    field: bookField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchBookInput]
  }

  input orderBookInput{
    field: bookField
    order: Order
  }

  input bulkAssociationBookWithFk_books_authorsInput{
    book_id: ID!
    fk_books_authors: ID!
  }

  type Query {
    books(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput! ): [book]
    readOneBook(book_id: ID!): book
    countBooks(search: searchBookInput ): Int
    vueTableBook : VueTableBook    csvTableTemplateBook: [String]
    booksConnection(search:searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput! ): BookConnection
  }

  type Mutation {
    addBook(book_id: ID!, name: String , addAuthors:ID   , skipAssociationsExistenceChecks:Boolean = false): book!
    updateBook(book_id: ID!, name: String , addAuthors:ID, removeAuthors:ID    , skipAssociationsExistenceChecks:Boolean = false): book!
    deleteBook(book_id: ID!): String!
    bulkAddBookCsv: String!
    bulkAssociateBookWithFk_books_authors(bulkAssociationInput: [bulkAssociationBookWithFk_books_authorsInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateBookWithFk_books_authors(bulkAssociationInput: [bulkAssociationBookWithFk_books_authorsInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;