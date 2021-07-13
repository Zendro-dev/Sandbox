module.exports = `
  type local_capital{
    """
    @original-field
    """
    capital_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    country_id: String

    local_country(search: searchLocal_countryInput): local_country
    
    }
type Local_capitalConnection{
  edges: [Local_capitalEdge]
  local_capitals: [local_capital]
  pageInfo: pageInfo!
}

type Local_capitalEdge{
  cursor: String!
  node: local_capital!
}

  type VueTableLocal_capital{
    data : [local_capital]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum local_capitalField {
    capital_id
    name
    country_id
  }
  input searchLocal_capitalInput {
    field: local_capitalField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchLocal_capitalInput]
  }

  input orderLocal_capitalInput{
    field: local_capitalField
    order: Order
  }

  input bulkAssociationLocal_capitalWithCountry_idInput{
    capital_id: ID!
    country_id: ID!
  }

  type Query {
    local_capitals(search: searchLocal_capitalInput, order: [ orderLocal_capitalInput ], pagination: paginationInput! ): [local_capital]
    readOneLocal_capital(capital_id: ID!): local_capital
    countLocal_capitals(search: searchLocal_capitalInput ): Int
    vueTableLocal_capital : VueTableLocal_capital
    csvTableTemplateLocal_capital: [String]
    local_capitalsConnection(search:searchLocal_capitalInput, order: [ orderLocal_capitalInput ], pagination: paginationCursorInput! ): Local_capitalConnection
  }

  type Mutation {
    addLocal_capital(capital_id: ID!, name: String , addLocal_country:ID   , skipAssociationsExistenceChecks:Boolean = false): local_capital!
    updateLocal_capital(capital_id: ID!, name: String , addLocal_country:ID, removeLocal_country:ID    , skipAssociationsExistenceChecks:Boolean = false): local_capital!
    deleteLocal_capital(capital_id: ID!): String!
    bulkAddLocal_capitalCsv: String!
    bulkAssociateLocal_capitalWithCountry_id(bulkAssociationInput: [bulkAssociationLocal_capitalWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateLocal_capitalWithCountry_id(bulkAssociationInput: [bulkAssociationLocal_capitalWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;