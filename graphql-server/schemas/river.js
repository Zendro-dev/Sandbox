module.exports = `
  type river{
    """
    @original-field
    """
    river_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    length: Int

    """
    @original-field
    
    """
    country_ids: [String]

      
    """
    @search-request
    """
    countriesFilter(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationInput!): [country]


    """
    @search-request
    """
    countriesConnection(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput!): CountryConnection

    """
    @count-request
    """
    countFilteredCountries(search: searchCountryInput) : Int
  
    }
type RiverConnection{
  edges: [RiverEdge]
  rivers: [river]
  pageInfo: pageInfo!
}

type RiverEdge{
  cursor: String!
  node: river!
}

  type VueTableRiver{
    data : [river]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum riverField {
    river_id
    name
    length
    country_ids
  }
  input searchRiverInput {
    field: riverField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchRiverInput]
  }

  input orderRiverInput{
    field: riverField
    order: Order
  }



  type Query {
    rivers(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationInput! ): [river]
    readOneRiver(river_id: ID!): river
    countRivers(search: searchRiverInput ): Int
    vueTableRiver : VueTableRiver
    csvTableTemplateRiver: [String]
    riversConnection(search:searchRiverInput, order: [ orderRiverInput ], pagination: paginationCursorInput! ): RiverConnection
  }

  type Mutation {
    addRiver(river_id: ID!, name: String, length: Int   , addCountries:[ID] , skipAssociationsExistenceChecks:Boolean = false): river!
    updateRiver(river_id: ID!, name: String, length: Int   , addCountries:[ID], removeCountries:[ID]  , skipAssociationsExistenceChecks:Boolean = false): river!
    deleteRiver(river_id: ID!): String!
    bulkAddRiverCsv: String!
      }
`;