module.exports = `
  type local_country{
    """
    @original-field
    """
    country_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    book_ids: [String]

    local_capital(search: searchLocal_capitalInput): local_capital
    
    """
    @search-request
    """
    available_local_booksFilter(search: searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationInput!): [local_book]


    """
    @search-request
    """
    available_local_booksConnection(search: searchLocal_bookInput, order: [ orderLocal_bookInput ], pagination: paginationCursorInput!): Local_bookConnection

    """
    @count-request
    """
    countFilteredAvailable_local_books(search: searchLocal_bookInput) : Int
  
    }
type Local_countryConnection{
  edges: [Local_countryEdge]
  local_countries: [local_country]
  pageInfo: pageInfo!
}

type Local_countryEdge{
  cursor: String!
  node: local_country!
}

  type VueTableLocal_country{
    data : [local_country]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum local_countryField {
    country_id
    name
    book_ids
  }
  input searchLocal_countryInput {
    field: local_countryField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchLocal_countryInput]
  }

  input orderLocal_countryInput{
    field: local_countryField
    order: Order
  }



  type Query {
    local_countries(search: searchLocal_countryInput, order: [ orderLocal_countryInput ], pagination: paginationInput! ): [local_country]
    readOneLocal_country(country_id: ID!): local_country
    countLocal_countries(search: searchLocal_countryInput ): Int
    vueTableLocal_country : VueTableLocal_country
    csvTableTemplateLocal_country: [String]
    local_countriesConnection(search:searchLocal_countryInput, order: [ orderLocal_countryInput ], pagination: paginationCursorInput! ): Local_countryConnection
  }

  type Mutation {
    addLocal_country(country_id: ID!, name: String , addLocal_capital:ID  , addAvailable_local_books:[ID] , skipAssociationsExistenceChecks:Boolean = false): local_country!
    updateLocal_country(country_id: ID!, name: String , addLocal_capital:ID, removeLocal_capital:ID   , addAvailable_local_books:[ID], removeAvailable_local_books:[ID]  , skipAssociationsExistenceChecks:Boolean = false): local_country!
    deleteLocal_country(country_id: ID!): String!
    bulkAddLocal_countryCsv: String!
      }
`;