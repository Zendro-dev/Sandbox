module.exports = `
  type local_book{
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

    local_publisher(search: searchLocal_publisherInput): local_publisher
    
    """
    @search-request
    """
    local_countriesFilter(search: searchLocal_countryInput, order: [ orderLocal_countryInput ], pagination: paginationInput!): [local_country]


    """
    @search-request
    """
    local_countriesConnection(search: searchLocal_countryInput, order: [ orderLocal_countryInput ], pagination: paginationCursorInput!): Local_countryConnection

    """
    @count-request
    """
    countFilteredLocal_countries(search: searchLocal_countryInput) : Int
  
    }
type Local_bookConnection{
  edges: [Local_bookEdge]
  local_books: [local_book]
  pageInfo: pageInfo!
}

type Local_bookEdge{
  cursor: String!
  node: local_book!
}

  type VueTableLocal_book{
    data : [local_book]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum local_bookField {
    book_id
    name
    country_ids
    publisher_id
  }
  input searchLocal_bookInput {
    field: local_bookField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchLocal_bookInput]
  }

  input orderLocal_bookInput{
    field: local_bookField
    order: Order
  }

  input bulkAssociationLocal_bookWithPublisher_idInput{
    book_id: ID!
    publisher_id: ID!
  }

  type Query {
    local_books(search: searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationInput! ): [local_book]
    readOneLocal_book(book_id: ID!): local_book
    countLocal_books(search: searchLocal_bookInput ): Int
    vueTableLocal_book : VueTableLocal_book
    csvTableTemplateLocal_book: [String]
    local_booksConnection(search:searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationCursorInput! ): Local_bookConnection
    const_books:[local_book]
  }

  type Mutation {
    addLocal_book(book_id: ID!, name: String , addLocal_publisher:ID  , addLocal_countries:[ID] , skipAssociationsExistenceChecks:Boolean = false): local_book!
    updateLocal_book(book_id: ID!, name: String , addLocal_publisher:ID, removeLocal_publisher:ID   , addLocal_countries:[ID], removeLocal_countries:[ID]  , skipAssociationsExistenceChecks:Boolean = false): local_book!
    deleteLocal_book(book_id: ID!): String!
    bulkAddLocal_bookCsv: String!
    bulkAssociateLocal_bookWithPublisher_id(bulkAssociationInput: [bulkAssociationLocal_bookWithPublisher_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateLocal_bookWithPublisher_id(bulkAssociationInput: [bulkAssociationLocal_bookWithPublisher_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;