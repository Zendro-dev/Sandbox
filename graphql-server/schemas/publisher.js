module.exports = `
type publisher{
  """
  @original-field
  """
  publisher_id: ID

  """
  @original-field
  
  """
  name: String


  """
  @search-request
  """
  booksConnection(search: searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput!): BookConnection
  """
  @count-request
  """
  countFilteredBooks(search: searchBookInput) : Int

}

type PublisherConnection{
edges: [PublisherEdge]
publishers: [publisher]
pageInfo: pageInfo!
}

type PublisherEdge{
cursor: String!
node: publisher!
}

type VueTablePublisher{
  data : [publisher]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum publisherField {
  publisher_id
  name

}

input searchPublisherInput {
  field: publisherField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchPublisherInput]
}

input orderPublisherInput{
  field: publisherField
  order: Order
}



type Query {
  readOnePublisher(publisher_id: ID!): publisher
  countPublishers(search: searchPublisherInput ): Int
  vueTablePublisher : VueTablePublisher  csvTableTemplatePublisher: [String]
  publishersConnection(search:searchPublisherInput, order: [ orderPublisherInput ], pagination: paginationCursorInput!): PublisherConnection
}

type Mutation {
  addPublisher(publisher_id: ID!, name: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): publisher!
  updatePublisher(publisher_id: ID!, name: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): publisher!
  deletePublisher(publisher_id: ID!): String!
  bulkAddPublisherCsv: String
  }
`;