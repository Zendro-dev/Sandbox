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
    @original-field
    
    """
    city_ids: [String]

      
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
  
    """
    @search-request
    """
    citiesFilter(search: searchCityInput, order: [ orderCityInput ], pagination: paginationInput!): [city]


    """
    @search-request
    """
    citiesConnection(search: searchCityInput, order: [ orderCityInput ], pagination: paginationCursorInput!): CityConnection

    """
    @count-request
    """
    countFilteredCities(search: searchCityInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
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
    city_ids
  }
  
  input searchRiverInput {
    field: riverField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
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
    validateRiverForCreation(river_id: ID!, name: String, length: Int   , addCountries:[ID], addCities:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateRiverForUpdating(river_id: ID!, name: String, length: Int   , addCountries:[ID], removeCountries:[ID] , addCities:[ID], removeCities:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateRiverForDeletion(river_id: ID!): Boolean!
    validateRiverAfterReading(river_id: ID!): Boolean!
  }

  type Mutation {
    addRiver(river_id: ID!, name: String, length: Int   , addCountries:[ID], addCities:[ID] , skipAssociationsExistenceChecks:Boolean = false): river!
    updateRiver(river_id: ID!, name: String, length: Int   , addCountries:[ID], removeCountries:[ID] , addCities:[ID], removeCities:[ID]  , skipAssociationsExistenceChecks:Boolean = false): river!
    deleteRiver(river_id: ID!): String!
    bulkAddRiverCsv: String!
      }
`;