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
    observationUnitsFilter(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput!): [observationUnit]


    """
    @search-request
    """
    observationUnitsConnection(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput!): ObservationUnitConnection

    """
    @count-request
    """
    countFilteredObservationUnits(search: searchObservationUnitInput) : Int
  
    """
    @search-request
    """
    studiesFilter(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationInput!): [study]


    """
    @search-request
    """
    studiesConnection(search: searchStudyInput, order: [ orderStudyInput ], pagination: paginationCursorInput!): StudyConnection

    """
    @count-request
    """
    countFilteredStudies(search: searchStudyInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type LocationConnection{
  edges: [LocationEdge]
  locations: [location]
  pageInfo: pageInfo!
}

type LocationEdge{
  cursor: String!
  node: location!
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
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchLocationInput]
  }

  input orderLocationInput{
    field: locationField
    order: Order
  }



  type Query {
    locations(search: searchLocationInput, order: [ orderLocationInput ], pagination: paginationInput! ): [location]
    readOneLocation(locationDbId: ID!): location
    countLocations(search: searchLocationInput ): Int
    csvTableTemplateLocation: [String]
    locationsConnection(search:searchLocationInput, order: [ orderLocationInput ], pagination: paginationCursorInput! ): LocationConnection
    validateLocationForCreation(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String   , addObservationUnits:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateLocationForUpdating(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String   , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateLocationForDeletion(locationDbId: ID!): Boolean!
    validateLocationAfterReading(locationDbId: ID!): Boolean!
    """
    locationsZendroDefinition would return the static Zendro data model definition
    """
    locationsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addLocation(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String   , addObservationUnits:[ID], addStudies:[ID] , skipAssociationsExistenceChecks:Boolean = false): location!
    updateLocation(locationDbId: ID!, abbreviation: String, coordinateDescription: String, countryCode: String, countryName: String, documentationURL: String, environmentType: String, exposure: String, instituteAddress: String, instituteName: String, locationName: String, locationType: String, siteStatus: String, slope: String, topography: String   , addObservationUnits:[ID], removeObservationUnits:[ID] , addStudies:[ID], removeStudies:[ID]  , skipAssociationsExistenceChecks:Boolean = false): location!
    deleteLocation(locationDbId: ID!): String!
      }
`;