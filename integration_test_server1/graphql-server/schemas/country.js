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

    unique_capital(search: searchCapitalInput): capital
    
    """
    @search-request
    """
    riversFilter(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationInput): [river]


    """
    @search-request
    """
    riversConnection(search: searchRiverInput, order: [ orderRiverInput ], pagination: paginationCursorInput): RiverConnection

    """
    @count-request
    """
    countFilteredRivers(search: searchRiverInput) : Int
  
    }
type CountryConnection{
  edges: [CountryEdge]
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
  }
  input searchCountryInput {
    field: countryField
    value: typeValue
    operator: Operator
    search: [searchCountryInput]
  }

  input orderCountryInput{
    field: countryField
    order: Order
  }
  type Query {
    countries(search: searchCountryInput, order: [ orderCountryInput ], pagination: paginationInput ): [country]
    readOneCountry(country_id: ID!): country
    countCountries(search: searchCountryInput ): Int
    vueTableCountry : VueTableCountry    csvTableTemplateCountry: [String]

    countriesConnection(search:searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput ): CountryConnection
  }
    type Mutation {
    addCountry(country_id: ID!, name: String , addUnique_capital:ID  , addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): country!
    updateCountry(country_id: ID!, name: String , addUnique_capital:ID, removeUnique_capital:ID   , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): country!
  deleteCountry(country_id: ID!): String!
  bulkAddCountryCsv: String! }

`;