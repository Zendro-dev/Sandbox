module.exports = `
  type country_to_river{
    """
    @original-field
    """
    id: ID
    """
    @original-field
    
    """
    country_id: String

    """
    @original-field
    
    """
    river_id: String

      
    }
type Country_to_riverConnection{
  edges: [Country_to_riverEdge]
  pageInfo: pageInfo!
}

type Country_to_riverEdge{
  cursor: String!
  node: country_to_river!
}

  type VueTableCountry_to_river{
    data : [country_to_river]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum country_to_riverField {
    id
    country_id
    river_id
  }
  input searchCountry_to_riverInput {
    field: country_to_riverField
    value: typeValue
    operator: Operator
    search: [searchCountry_to_riverInput]
  }

  input orderCountry_to_riverInput{
    field: country_to_riverField
    order: Order
  }

  type Query {
    country_to_rivers(search: searchCountry_to_riverInput, order: [ orderCountry_to_riverInput ], pagination: paginationInput ): [country_to_river]
    readOneCountry_to_river(id: ID!): country_to_river
    countCountry_to_rivers(search: searchCountry_to_riverInput ): Int
    vueTableCountry_to_river : VueTableCountry_to_river    csvTableTemplateCountry_to_river: [String]
    country_to_riversConnection(search:searchCountry_to_riverInput, order: [ orderCountry_to_riverInput ], pagination: paginationCursorInput ): Country_to_riverConnection
  }

  type Mutation {
    addCountry_to_river( country_id: String, river_id: String    , skipAssociationsExistenceChecks:Boolean = false): country_to_river!
    updateCountry_to_river(id: ID!, country_id: String, river_id: String    , skipAssociationsExistenceChecks:Boolean = false): country_to_river!
    deleteCountry_to_river(id: ID!): String!
    bulkAddCountry_to_riverCsv: String!
    }
`;