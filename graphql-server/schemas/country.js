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
  book_ids: [String]


capital(search: searchCapitalInput): capital
  """
  @search-request
  """
  available_booksConnection(search: searchBookInput, order: [ orderBookInput ], pagination: paginationCursorInput!): BookConnection
  """
  @count-request
  """
  countFilteredAvailable_books(search: searchBookInput) : Int

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
  book_ids

}

input searchCountryInput {
  field: countryField
  value: String
  valueType: InputType
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchCountryInput]
}

input orderCountryInput{
  field: countryField
  order: Order
}



type Query {
  readOneCountry(country_id: ID!): country
  countCountries(search: searchCountryInput ): Int
  vueTableCountry : VueTableCountry  csvTableTemplateCountry: [String]
  countriesConnection(search:searchCountryInput, order: [ orderCountryInput ], pagination: paginationCursorInput!): CountryConnection
}

type Mutation {
  addCountry(country_id: ID!, name: String , addCapital:ID  , addAvailable_books:[ID] , skipAssociationsExistenceChecks:Boolean = false): country!
  updateCountry(country_id: ID!, name: String , addCapital:ID, removeCapital:ID   , addAvailable_books:[ID], removeAvailable_books:[ID]  , skipAssociationsExistenceChecks:Boolean = false): country!
  deleteCountry(country_id: ID!): String!
  bulkAddCountryCsv: String
  }
`;