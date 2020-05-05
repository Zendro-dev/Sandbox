module.exports = `
  type Book{
    """
    @original-field
    """
    internalBId: ID

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
    internalPId: String

    Authors(search: searchPersonInput): Person
    }

type BookConnection{
  edges: [BookEdge]
  pageInfo: pageInfo!
}

type BookEdge{
  cursor: String!
  node: Book!
}

  type VueTableBook{
    data : [Book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }

  enum BookField {
    internalBId
    title
    genre
    internalPId
  }

  input searchBookInput {
    field: BookField
    value: typeValue
    operator: Operator
    search: [searchBookInput]
  }

  input orderBookInput{
    field: BookField
    order: Order
  }

  type Query {
    books(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput ): [Book]
    readOneBook(internalBId: ID!): Book
    countBooks(search: searchBookInput ): Int
    vueTableBook : VueTableBook    csvTableTemplateBook: [String]

    booksConnection(search:searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput ): BookConnection
  }

    type Mutation {
    addBook(internalBId: ID!, title: String, genre: String , addAuthors:ID  ): Book!
    updateBook(internalBId: ID!, title: String, genre: String , addAuthors:ID, removeAuthors:ID  ): Book!
  deleteBook(internalBId: ID!): String!
  bulkAddBookCsv: [Book] }

`;