module.exports = `
  type observationUnit{
    """
    @original-field
    """
    observationUnitDbId: ID
    """
    @original-field
    
    """
    observationLevel: String

    """
    @original-field
    
    """
    observationUnitName: String

    """
    @original-field
    
    """
    observationUnitPUI: String

    """
    @original-field
    
    """
    plantNumber: String

    """
    @original-field
    
    """
    eventDbIds: [String]

    observationUnitPosition(search: searchObservationUnitPositionInput): observationUnitPosition
    
    """
    @search-request
    """
    observationsFilter(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationInput!): [observation]


    """
    @search-request
    """
    observationsConnection(search: searchObservationInput, order: [ orderObservationInput ], pagination: paginationCursorInput!): ObservationConnection

    """
    @count-request
    """
    countFilteredObservations(search: searchObservationInput) : Int
  
    """
    @search-request
    """
    eventsFilter(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput!): [event]


    """
    @search-request
    """
    eventsConnection(search: searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput!): EventConnection

    """
    @count-request
    """
    countFilteredEvents(search: searchEventInput) : Int
  
    
    """
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type ObservationUnitConnection{
  edges: [ObservationUnitEdge]
  observationUnits: [observationUnit]
  pageInfo: pageInfo!
}

type ObservationUnitEdge{
  cursor: String!
  node: observationUnit!
}

  enum observationUnitField {
    observationUnitDbId
    observationLevel
    observationUnitName
    observationUnitPUI
    plantNumber
    eventDbIds
  }
  
  input searchObservationUnitInput {
    field: observationUnitField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchObservationUnitInput]
  }

  input orderObservationUnitInput{
    field: observationUnitField
    order: Order
  }



  type Query {
    observationUnits(search: searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationInput! ): [observationUnit]
    readOneObservationUnit(observationUnitDbId: ID!): observationUnit
    countObservationUnits(search: searchObservationUnitInput ): Int
    csvTableTemplateObservationUnit: [String]
    observationUnitsConnection(search:searchObservationUnitInput, order: [ orderObservationUnitInput ], pagination: paginationCursorInput! ): ObservationUnitConnection
    validateObservationUnitForCreation(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID  , addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitForUpdating(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID   , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateObservationUnitForDeletion(observationUnitDbId: ID!): Boolean!
    validateObservationUnitAfterReading(observationUnitDbId: ID!): Boolean!
    """
    observationUnitsZendroDefinition would return the static Zendro data model definition
    """
    observationUnitsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID  , addObservations:[ID], addEvents:[ID] , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    updateObservationUnit(observationUnitDbId: ID!, observationLevel: String, observationUnitName: String, observationUnitPUI: String, plantNumber: String , addObservationUnitPosition:ID, removeObservationUnitPosition:ID   , addObservations:[ID], removeObservations:[ID] , addEvents:[ID], removeEvents:[ID]  , skipAssociationsExistenceChecks:Boolean = false): observationUnit!
    deleteObservationUnit(observationUnitDbId: ID!): String!
      }
`;