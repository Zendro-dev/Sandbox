module.exports = `
type location{
  """
  @original-field
  """
  locationDbId: ID

"""
  @original-field
  
  """
  abbreviation: String

"""
  @original-field
  
  """
  coordinateDescription: String

"""
  @original-field
  
  """
  countryCode: String

"""
  @original-field
  
  """
  countryName: String

"""
  @original-field
  
  """
  documentationURL: String

"""
  @original-field
  
  """
  environmentType: String

"""
  @original-field
  
  """
  exposure: String

"""
  @original-field
  
  """
  instituteAddress: String

"""
  @original-field
  
  """
  instituteName: String

"""
  @original-field
  
  """
  locationName: String

"""
  @original-field
  
  """
  locationType: String

"""
  @original-field
  
  """
  siteStatus: String

"""
  @original-field
  
  """
  slope: String

"""
  @original-field
  
  """
  topography: String


  """
  @search-request
  """
  observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput): ObservationUnitConnection

  """
  @count-request
  """
  countFilteredObservationUnits(search: searchObservationUnitInput) : Int

  """
  @search-request
  """
  studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput): StudyConnection

  """
  @count-request
  """
  countFilteredStudies(search: searchStudyInput) : Int
}

type LocationConnection{
edges: [LocationEdge]
pageInfo: pageInfo!
}

type LocationEdge{
cursor: String!
node: location!
}

type VueTableLocation{
  data : [location]
  total: Int
  per_page: Int
  current_page: Int
  last_page: Int
  prev_page_url: String
  next_page_url: String
  from: Int
  to: Int
}

enum locationField {
  locationDbId
  abbreviation
  coordinateDescription
  countryCode
  countryName
  documentationURL
  environmentType
  exposure
  instituteAddress
  instituteName
  locationName
  locationType
  siteStatus
  slope
  topography
}

input searchLocationInput {
  field: locationField
  value: typeValue
  operator: Operator
  excludeAdapterNames: [String]
  search: [searchLocationInput]
}

input orderLocationInput{
  field: locationField
  order: Order
}

type Query {
  locations(search: searchLocationInput, order: [ orderLocationInput ], pagination: paginationInput ): [location]
  readOneLocation(locationDbId: ID!): location
  countLocations(search: searchLocationInput ): Int
  vueTableLocation : VueTableLocation  csvTableTemplateLocation: [String]

  locationsConnection(search:searchLocationInput, order: [ orderLocationInput ], pagination: paginationCursorInput ): LocationConnection
}

  type Mutation {
  addLocation(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String  , addObservationUnits:[ID], addStudies:[ID], skipAssociationsExistenceChecks:Boolean = false): location!
  updateLocation(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String  , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): location!
deleteLocation(locationDbId: ID!): String!
bulkAddLocationCsv: [location] }

`;