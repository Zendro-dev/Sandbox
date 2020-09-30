module.exports = `
type book{
  """
  @original-field
  """
  book_id: ID

  """
  @original-field
  
  """
  title: String
"""
  @original-field
  
  """
  author_id: String



author(search: searchAuthorInput): author

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
  title
  author_id

}

input searchBookInput {
  field: bookField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchBookInput]
}

input orderBookInput{
  field: bookField
  order: Order
}

type Query {
  readOneBook(book_id: ID!): book
  countBooks(search: searchBookInput ): Int
  vueTableBook : VueTableBook  csvTableTemplateBook: [String]

  booksConnection(search:searchBookInput, order: [ orderBookInput ],pagination: paginationCursorInput): BookConnection
}

  type Mutation {
  addBook(book_id: ID!, title: String , addAuthor:ID   , skipAssociationsExistenceChecks:Boolean = false): book!
  updateBook(book_id: ID!, title: String , addAuthor:ID, removeAuthor:ID    , skipAssociationsExistenceChecks:Boolean = false): book!
deleteBook(book_id: ID!): String!
bulkAddBookCsv: String }

`;