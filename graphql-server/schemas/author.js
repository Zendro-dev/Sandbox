module.exports = `
type author{
  """
  @original-field
  """
  author_id: ID

  """
  @original-field
  
  """
  name: String
"""
  @original-field
  
  """
  book_ids: [String]


  """
  @search-request
  """
  worksConnection(search: searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput!): BookConnection
  """
  @count-request
  """
  countFilteredWorks(search: searchBookInput) : Int

}

type AuthorConnection{
edges: [AuthorEdge]
authors: [author]
pageInfo: pageInfo!
}

type AuthorEdge{
cursor: String!
node: author!
}

type VueTableAuthor{
  data : [author]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum authorField {
  author_id
  name
  book_ids

}

input searchAuthorInput {
  field: authorField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchAuthorInput]
}

input orderAuthorInput{
  field: authorField
  order: Order
}



type Query {
  readOneAuthor(author_id: ID!): author
  countAuthors(search: searchAuthorInput ): Int
  vueTableAuthor : VueTableAuthor  csvTableTemplateAuthor: [String]
  authorsConnection(search:searchAuthorInput, order: [ orderAuthorInput ], pagination: paginationCursorInput!): AuthorConnection
}

type Mutation {
  addAuthor(author_id: ID!, name: String, book_ids: [String]   , addWorks:[ID] , skipAssociationsExistenceChecks:Boolean = false): author!
  updateAuthor(author_id: ID!, name: String, book_ids: [String]   , addWorks:[ID], removeWorks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): author!
  deleteAuthor(author_id: ID!): String!
  bulkAddAuthorCsv: String
  }
`;