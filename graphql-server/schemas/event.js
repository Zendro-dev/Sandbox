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
    @original-field
    
    """
    studyDbId: String

    study(search: searchStudyInput): study
    
    """
    @search-request
    """
    eventParametersFilter(search: searchEventParameterInput, order: [ orderEventParameterInput ], pagination: paginationInput!): [eventParameter]


    """
    @search-request
    """
    eventParametersConnection(search: searchEventParameterInput, order: [ orderEventParameterInput ], pagination: paginationCursorInput!): EventParameterConnection

    """
    @count-request
    """
    countFilteredEventParameters(search: searchEventParameterInput) : Int
  
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
  
    }
type EventConnection{
  edges: [EventEdge]
  pageInfo: pageInfo!
}

type EventEdge{
  cursor: String!
  node: event!
}

  type VueTableEvent{
    data : [event]
    total: Int
    per_page: Int
    current_page: Int
    last_page: Int
    prev_page_url: String
    next_page_url: String
    from: Int
    to: Int
  }
  enum eventField {
    eventType
    eventDbId
    eventDescription
    date
    observationUnitDbIds
    studyDbId
  }
  input searchEventInput {
    field: eventField
    value: String
    valueType: InputType
    operator: Operator
    search: [searchEventInput]
  }

  input orderEventInput{
    field: eventField
    order: Order
  }

  input bulkAssociationEventWithStudyDbIdInput{
    eventType: ID!
    studyDbId: ID!
  }

  type Query {
    events(search: searchEventInput, order: [ orderEventInput ], pagination: paginationInput! ): [event]
    readOneEvent(eventType: ID!): event
    countEvents(search: searchEventInput ): Int
    vueTableEvent : VueTableEvent    csvTableTemplateEvent: [String]
    eventsConnection(search:searchEventInput, order: [ orderEventInput ], pagination: paginationCursorInput! ): EventConnection
  }

  type Mutation {
    addEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime , addStudy:ID  , addEventParameters:[ID], addObservationUnits:[ID] , skipAssociationsExistenceChecks:Boolean = false): event!
    updateEvent(eventType: ID!, eventDbId: String, eventDescription: String, date: DateTime , addStudy:ID, removeStudy:ID   , addEventParameters:[ID], removeEventParameters:[ID] , addObservationUnits:[ID], removeObservationUnits:[ID]  , skipAssociationsExistenceChecks:Boolean = false): event!
    deleteEvent(eventType: ID!): String!
    bulkAddEventCsv: String!
    bulkAssociateEventWithStudyDbId(bulkAssociationInput: [bulkAssociationEventWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
    bulkDisAssociateEventWithStudyDbId(bulkAssociationInput: [bulkAssociationEventWithStudyDbIdInput], skipAssociationsExistenceChecks:Boolean = false): String!
  }
`;