module.exports = `
  type city{
    """
    @original-field
    """
    city_id: ID
    """
    @original-field
    
    """
    name: String

    """
    @original-field
    
    """
    intArr: [Int]

    """
    @original-field
    
    """
    strArr: [String]

    """
    @original-field
    
    """
    floatArr: [Float]

    """
    @original-field
    
    """
    boolArr: [Boolean]

    """
    @original-field
    
    """
    dateTimeArr: [DateTime]

    """
    @original-field
    
    """
    river_ids: [String]

    """
    @original-field
    
    """
    country_id: String

    country(search: searchCountryInput): country
    
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
  
    }
type CityConnection{
  edges: [CityEdge]
  cities: [city]
  pageInfo: pageInfo!
}

type CityEdge{
  cursor: String!
  node: city!
}

  type VueTableCity{
    data : [city]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum cityField {
    city_id
    name
    intArr
    strArr
    floatArr
    boolArr
    dateTimeArr
    river_ids
    country_id
  }
  input searchCityInput {
    field: cityField
    value: String
    valueType: InputType
    operator: CassandraOperator
    search: [searchCityInput]
  }

  input orderCityInput{
    field: cityField
    order: Order
  }

  input bulkAssociationCityWithCountry_idInput{
    city_id: ID!
    country_id: ID!
  }

  type Query {
    cities(search: searchCityInput, order: [ orderCityInput ], pagination: paginationInput! ): [city]
    readOneCity(city_id: ID!): city
    countCities(search: searchCityInput ): Int
    vueTableCity : VueTableCity
    csvTableTemplateCity: [String]
    citiesConnection(search:searchCityInput, order: [ orderCityInput ], pagination: paginationCursorInput! ): CityConnection
  }

  type Mutation {
    addCity(city_id: ID!, name: String, intArr: [Int], strArr: [String], floatArr: [Float], boolArr: [Boolean], dateTimeArr: [DateTime] , addCountry:ID  , addRivers:[ID] , skipAssociationsExistenceChecks:Boolean = false): city!
    updateCity(city_id: ID!, name: String, intArr: [Int], strArr: [String], floatArr: [Float], boolArr: [Boolean], dateTimeArr: [DateTime] , addCountry:ID, removeCountry:ID   , addRivers:[ID], removeRivers:[ID]  , skipAssociationsExistenceChecks:Boolean = false): city!
    deleteCity(city_id: ID!): String!
    bulkAddCityCsv: String!
    bulkAssociateCityWithCountry_id(bulkAssociationInput: [bulkAssociationCityWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateCityWithCountry_id(bulkAssociationInput: [bulkAssociationCityWithCountry_idInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;