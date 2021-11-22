module.exports = `
  type continent{
    """
    @original-field
    """
    continent_id: ID
    """
    @original-field
    
    """
    name: String

      
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
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ContinentConnection{
  edges: [ContinentEdge]
  continents: [continent]
  pageInfo: pageInfo!
}

type ContinentEdge{
  cursor: String!
  node: continent!
}

  type VueTableContinent{
    data : [continent]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum continentField {
    continent_id
    name
  }
  
  input searchContinentInput {
    field: continentField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchContinentInput]
  }

  input orderContinentInput{
    field: continentField
    order: Order
  }



  type Query {
    continents(search: searchContinentInput, order: [ orderContinentInput ], pagination: paginationInput! ): [continent]
    readOneContinent(continent_id: ID!): continent
    countContinents(search: searchContinentInput ): Int
    vueTableContinent : VueTableContinent
    csvTableTemplateContinent: [String]
    continentsConnection(search:searchContinentInput, order: [ orderContinentInput ], pagination: paginationCursorInput! ): ContinentConnection
    validateContinentForCreation(continent_id: ID!, name: String   , addCountries:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateContinentForUpdating(continent_id: ID!, name: String   , addCountries:[ID], removeCountries:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateContinentForDeletion(continent_id: ID!): Boolean!
    validateContinentAfterReading(continent_id: ID!): Boolean!
  }

  type Mutation {
    addContinent(continent_id: ID!, name: String   , addCountries:[ID] , skipAssociationsExistenceChecks:Boolean = false): continent!
    updateContinent(continent_id: ID!, name: String   , addCountries:[ID], removeCountries:[ID]  , skipAssociationsExistenceChecks:Boolean = false): continent!
    deleteContinent(continent_id: ID!): String!
    bulkAddContinentCsv: String!
      }
`;