module.exports = `
  type Book{
    """
    @original-field
    """
    internalBookId: ID

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
    internalPersonId: String

    author(search: searchPersonInput): Person
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
    internalBookId
    title
    genre
    internalPersonId
  }

  input searchBookInput {
    field: BookField
    value: typeValue
    operator: Operator
    excludeAdapterNames: [String]
    search: [searchBookInput]
  }

  input orderBookInput{
    field: BookField
    order: Order
  }

  type Query {
    books(search: searchBookInput, order: [ orderBookInput ], pagination: paginationInput ): [Book]
    readOneBook(internalBookId: ID!): Book
    countBooks(search: searchBookInput ): Int
    vueTableBook : VueTableBook    csvTableTemplateBook: [String]

    booksConnection(search:searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput ): BookConnection
  }

    type Mutation {
    addBook(internalBookId: ID!, title: String, genre: String , addAuthor:ID  ): Book!
    updateBook(internalBookId: ID!, title: String, genre: String , addAuthor:ID, removeAuthor:ID  ): Book!
  deleteBook(internalBookId: ID!): String!
  bulkAddBookCsv: [Book] }

`;