module.exports = `
type sq_author{
  """
  @original-field
  """
  id: ID

  """
  @original-field
  
  """
  name: String
"""
  @original-field
  
  """
  lastname: String
"""
  @original-field
  
  """
  email: String
"""
  @original-field
  
  """
  book_ids: [String]

  """
  @search-request
  """
  booksConnection(search: searchSq_bookInput, order: [ orderSq_bookInput ], pagination: paginationCursorInput!): Sq_bookConnection
  """
  @count-request
  """
  countFilteredBooks(search: searchSq_bookInput) : Int

}

type Sq_authorConnection{
edges: [Sq_authorEdge]
sq_authors: [sq_author]
pageInfo: pageInfo!
}

type Sq_authorEdge{
cursor: String!
node: sq_author!
}

type VueTableSq_author{
  data : [sq_author]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum sq_authorField {
  id
  name
  lastname
  email
  book_ids
}

input searchSq_authorInput {
  field: sq_authorField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchSq_authorInput]
}

input orderSq_authorInput{
  field: sq_authorField
  order: Order
}



type Query {
  readOneSq_author(id: ID!): sq_author
  countSq_authors(search: searchSq_authorInput ): Int
  vueTableSq_author : VueTableSq_author  csvTableTemplateSq_author: [String]
  sq_authorsConnection(search:searchSq_authorInput, order: [ orderSq_authorInput ], pagination: paginationCursorInput! ): Sq_authorConnection
}

type Mutation {
  addSq_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): sq_author!
  updateSq_author(id: ID!, name: String, lastname: String, email: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): sq_author!
  deleteSq_author(id: ID!): String!
  bulkAddSq_authorCsv: String
  }
`;