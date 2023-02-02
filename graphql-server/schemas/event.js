module.exports = `
  type event{
    """
    @original-field
    """
    eventType: ID
    """
    @original-field
    
    """
    eventDbId: String

    """
    @original-field
    
    """
    eventDescription: String

    """
    @original-field
    
    """
    date: DateTime

    """
    @original-field
    
    """
    observationUnitDbIds: [String]

      
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
    @record as base64 encoded cursor for paginated connections
    """
    asCursor: String!
}
type EventConnection{
  edges: [EventEdge]
  events: [event]
  pageInfo: pageInfo!
}

type EventEdge{
  cursor: String!
  node: event!
}

  enum eventField {
    eventType
    eventDbId
    eventDescription
    date
    observationUnitDbIds
  }
  
  input searchEventInput {
    field: eventField
    value: String
    valueType: InputType
    operator: GenericPrestoSqlOperator 
    search: [searchEventInput]
  }

  input orderEventInput{
    field: eventField
    order: Order
  }



  type Query {
    events(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput! ): [event]
    readOneEvent(eventType: ID!): event
    countEvents(search: searchEventInput ): Int
    csvTableTemplateEvent: [String]
    eventsConnection(search:searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput! ): EventConnection
    validateEventForCreation(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime   , addObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateEventForUpdating(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime   , addObservationUnits:[ID], removeObservationUnits:[ID]  , skipAssociationsExistenceChecks:Boolean = false): Boolean!
    validateEventForDeletion(eventType: ID!): Boolean!
    validateEventAfterReading(eventType: ID!): Boolean!
    """
    eventsZendroDefinition would return the static Zendro data model definition
    """
    eventsZendroDefinition: GraphQLJSONObject
  }

  type Mutation {
    addEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime   , addObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): event!
    updateEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime   , addObservationUnits:[ID], removeObservationUnits:[ID]  , skipAssociationsExistenceChecks:Boolean = false): event!
    deleteEvent(eventType: ID!): String!
      }
`;