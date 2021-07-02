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
  country_ids: [String]
"""
  @original-field
  
  """
  publisher_id: String


publisher(search: searchPublisherInput): publisher
  """
  @search-request
  """
  countriesConnection(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput!): CountryConnection
  """
  @count-request
  """
  countFilteredCountries(search: searchCountryInput) : Int

}

type BookConnection{
edges: [BookEdge]
books: [book]
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
  country_ids
  publisher_id

}

input searchBookInput {
  field: bookField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchBookInput]
}

input orderBookInput{
  field: bookField
  order: Order
}

input bulkAssociationBookWithPublisher_idInput{
  book_id: ID!
  publisher_id: ID!
}

type Query {
  readOneBook(book_id: ID!): book
  countBooks(search: searchBookInput ): Int
  vueTableBook : VueTableBook  csvTableTemplateBook: [String]
  booksConnection(search:searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput!): BookConnection
}

type Mutation {
  addBook(book_id: ID!, name: String , addPublisher:ID  , addCountries:[ID] , skipAssociationsExistenceChecks:Boolean = false): book!
  updateBook(book_id: ID!, name: String , addPublisher:ID, removePublisher:ID   , addCountries:[ID], removeCountries:[ID]  , skipAssociationsExistenceChecks:Boolean = false): book!
  deleteBook(book_id: ID!): String!
  bulkAddBookCsv: String
  bulkAssociateBookWithPublisher_id(bulkAssociationInput: [bulkAssociationBookWithPublisher_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  bulkDisAssociateBookWithPublisher_id(bulkAssociationInput: [bulkAssociationBookWithPublisher_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
}
`;