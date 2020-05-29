module.exports = `
  type Location{
    """
    @original-field
    """
    locationId: ID
    """
    @original-field
    
    """
    country: String

    """
    @original-field
    
    """
    state: String

    """
    @original-field
    
    """
    municipality: String

    """
    @original-field
    
    """
    locality: String

      
    """
    @search-request
    """
    accessionsFilter(search: searchAccessionInput, order: [ orderAccessionInput ], pagination: paginationInput): [Accession]


    """
    @search-request
    """
    accessionsConnection(search: searchAccessionInput, order: [ orderAccessionInput ], pagination: paginationCursorInput): AccessionConnection

    """
    @count-request
    """
    countFilteredAccessions(search: searchAccessionInput) : Int
  
    }
type LocationConnection{
  edges: [LocationEdge]
  pageInfo: pageInfo!
}

type LocationEdge{
  cursor: String!
  node: Location!
}

  type VueTableLocation{
    data : [Location]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum LocationField {
    locationId
    country
    state
    municipality
    locality
  }
  input searchLocationInput {
    field: LocationField
    value: typeValue
    operator: Operator
    search: [searchLocationInput]
  }

  input orderLocationInput{
    field: LocationField
    order: Order
  }
  type Query {
    locations(search: searchLocationInput, order: [ orderLocationInput ], pagination: paginationInput ): [Location]
    readOneLocation(locationId: ID!): Location
    countLocations(search: searchLocationInput ): Int
    vueTableLocation : VueTableLocation    csvTableTemplateLocation: [String]

    locationsConnection(search:searchLocationInput, order: [ orderLocationInput ], pagination: paginationCursorInput ): LocationConnection
  }
    type Mutation {
    addLocation(locationId: ID!, country: String, state: String, municipality: String, locality: String   , addAccessions:[ID] , skipAssociationsExistenceChecks:Boolean = false): Location!
    updateLocation(locationId: ID!, country: String, state: String, municipality: String, locality: String   , addAccessions:[ID], removeAccessions:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Location!
  deleteLocation(locationId: ID!): String!
  bulkAddLocationCsv: [Location] }

`;