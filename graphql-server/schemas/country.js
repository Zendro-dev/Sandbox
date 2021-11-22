module.exports = `
  type country{
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
    population: Int

    """
    @original-field
    
    """
    size: Int

    """
    @original-field
    
    """
    river_ids: [String]

    """
    @original-field
    
    """
    capital_id: String

    """
    @original-field
    
    """
    continent_id: String

    capital(search: searchCityInput): city
  continent(search: searchContinentInput): continent
    
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
    @search-request
    """
    riversFilter(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationInput!): [river]


    """
    @search-request
    """
    riversConnection(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationCursorInput!): RiverConnection

    """
    @count-request
    """
    countFilteredRivers(search: searchRiverInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type CountryConnection{
  edges: [CountryEdge]
  countries: [country]
  pageInfo: pageInfo!
}

type CountryEdge{
  cursor: String!
  node: country!
}

  type VueTableCountry{
    data : [country]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum countryField {
    country_id
    name
    population
    size
    river_ids
    capital_id
    continent_id
  }
  
  input searchCountryInput {
    field: countryField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchCountryInput]
  }

  input orderCountryInput{
    field: countryField
    order: Order
  }

  input bulkAssociationCountryWithCapital_idInput{
    country_id: ID!
    capital_id: ID!
  }  input bulkAssociationCountryWithContinent_idInput{
    country_id: ID!
    continent_id: ID!
  }

  type Query {
    countries(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationInput! ): [country]
    readOneCountry(country_id: ID!): country
    countCountries(search: searchCountryInput ): Int
    vueTableCountry : VueTableCountry
    csvTableTemplateCountry: [String]
    countriesConnection(search:searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput! ): CountryConnection
    validateCountryForCreation(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, addContinent:ID  , addCities:[ID], addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCountryForUpdating(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, removeCapital:ID , addContinent:ID, removeContinent:ID   , addCities:[ID], removeCities:[ID] , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateCountryForDeletion(country_id: ID!): Boolean!
    validateCountryAfterReading(country_id: ID!): Boolean!
  }

  type Mutation {
    addCountry(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, addContinent:ID  , addCities:[ID], addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): country!
    updateCountry(country_id: ID!, name: String, population: Int, size: Int , addCapital:ID, removeCapital:ID , addContinent:ID, removeContinent:ID   , addCities:[ID], removeCities:[ID] , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): country!
    deleteCountry(country_id: ID!): String!
    bulkAddCountryCsv: String!
    bulkAssociateCountryWithCapital_id(bulkAssociationInput: [bulkAssociationCountryWithCapital_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCountryWithCapital_id(bulkAssociationInput: [bulkAssociationCountryWithCapital_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
bulkAssociateCountryWithContinent_id(bulkAssociationInput: [bulkAssociationCountryWithContinent_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCountryWithContinent_id(bulkAssociationInput: [bulkAssociationCountryWithContinent_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;