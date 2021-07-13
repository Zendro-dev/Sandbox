module.exports = `
  type local_publisher{
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
    booksFilter(search: searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationInput!): [local_book]


    """
    @search-request
    """
    booksConnection(search: searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationCursorInput!): Local_bookConnection

    """
    @count-request
    """
    countFilteredBooks(search: searchLocal_bookInput) : Int
  
    }
type Local_publisherConnection{
  edges: [Local_publisherEdge]
  local_publishers: [local_publisher]
  pageInfo: pageInfo!
}

type Local_publisherEdge{
  cursor: String!
  node: local_publisher!
}

  type VueTableLocal_publisher{
    data : [local_publisher]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum local_publisherField {
    publisher_id
    name
  }
  input searchLocal_publisherInput {
    field: local_publisherField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchLocal_publisherInput]
  }

  input orderLocal_publisherInput{
    field: local_publisherField
    order: Order
  }



  type Query {
    local_publishers(search: searchLocal_publisherInput, order: [ orderLocal_publisherInput ], pagination: paginationInput! ): [local_publisher]
    readOneLocal_publisher(publisher_id: ID!): local_publisher
    countLocal_publishers(search: searchLocal_publisherInput ): Int
    vueTableLocal_publisher : VueTableLocal_publisher
    csvTableTemplateLocal_publisher: [String]
    local_publishersConnection(search:searchLocal_publisherInput, order: [ orderLocal_publisherInput ], pagination: paginationCursorInput! ): Local_publisherConnection
  }

  type Mutation {
    addLocal_publisher(publisher_id: ID!, name: String   , addBooks:[ID] , skipAssociationsExistenceChecks:Boolean = false): local_publisher!
    updateLocal_publisher(publisher_id: ID!, name: String   , addBooks:[ID], removeBooks:[ID]  , skipAssociationsExistenceChecks:Boolean = false): local_publisher!
    deleteLocal_publisher(publisher_id: ID!): String!
    bulkAddLocal_publisherCsv: String!
      }
`;